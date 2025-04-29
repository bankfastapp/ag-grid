import type {
    IServerSideGroupSelectionState,
    IServerSideSelectionState,
    ISetNodesSelectedParams,
    RowNode,
    RowRangeSelectionContext,
} from 'ag-grid-community';
import { BeanStub, _error, _isMultiRowSelection, _isUsingNewRowSelectionAPI, _warn } from 'ag-grid-community';

import type { ISelectionStrategy } from './iSelectionStrategy';

interface SelectedState {
    /** Base selection state for all nodes, whether they have been loaded or not */
    selectAll: boolean;
    /** RowNode IDs of those nodes whose selection state differs from the base state */
    toggledNodes: Set<string>;
}

export class DefaultStrategy extends BeanStub implements ISelectionStrategy {
    private selectedState: SelectedState = { selectAll: false, toggledNodes: new Set() };

    /**
     * Whether select-all functionality has ever been used. Used only to print warnings in `getSelectedNodes` for users.
     * We print a warning even if not currently selecting all because we want users to be aware of the potential
     * for unexpected behaviour when these two features are used together.
     */
    private selectAllUsed = false;
    /** This is to prevent regressions, default selectionSvc retains reference of selected nodes. */
    private selectedNodes: { [key: string]: RowNode } = {};

    constructor(private readonly selectionCtx: RowRangeSelectionContext) {
        super();
    }

    public getSelectedState(): IServerSideSelectionState {
        return {
            selectAll: this.selectedState.selectAll,
            toggledNodes: [...this.selectedState.toggledNodes],
        };
    }

    public setSelectedState(state: IServerSideSelectionState | IServerSideGroupSelectionState): void {
        if (typeof state !== 'object') {
            // The provided selection state should be an object
            _error(116);
            return;
        }

        if (!('selectAll' in state)) {
            //'Invalid selection state. The state must conform to `IServerSideSelectionState`.'
            _error(116);
            return;
        }

        if (typeof state.selectAll !== 'boolean') {
            //selectAll must be of boolean type.
            _error(117);
            return;
        }

        if (!('toggledNodes' in state) || !Array.isArray(state.toggledNodes)) {
            return _warn(197);
        }

        const newState: SelectedState = {
            selectAll: state.selectAll,
            toggledNodes: new Set(),
        };

        state.toggledNodes.forEach((key: any) => {
            if (typeof key === 'string') {
                newState.toggledNodes.add(key);
            } else {
                _warn(196, { key });
            }
        });

        const isSelectingMultipleRows = newState.selectAll || newState.toggledNodes.size > 1;
        if (_isUsingNewRowSelectionAPI(this.gos) && !_isMultiRowSelection(this.gos) && isSelectingMultipleRows) {
            _warn(130);
            return;
        }

        this.selectedState = newState;
    }

    public deleteSelectionStateFromParent(parentPath: string[], removedNodeIds: string[]): boolean {
        if (this.selectedState.toggledNodes.size === 0) {
            return false;
        }

        let anyNodesToggled = false;

        removedNodeIds.forEach((id) => {
            if (this.selectedState.toggledNodes.delete(id)) {
                anyNodesToggled = true;
            }
        });

        return anyNodesToggled;
    }

    public setNodesSelected(params: ISetNodesSelectedParams): number {
        const { nodes, clearSelection, newValue, source } = params;
        if (nodes.length === 0) return 0;

        const onlyThisNode = clearSelection && newValue;
        if (!_isMultiRowSelection(this.gos) || onlyThisNode) {
            if (nodes.length > 1) {
                _error(130);
                return 0;
            }
            const rowNode = nodes[0];
            const node = rowNode.footer ? rowNode.sibling : rowNode;
            if (newValue && node.selectable) {
                this.selectedNodes = { [node.id!]: node };
                this.selectedState = {
                    selectAll: false,
                    toggledNodes: new Set([node.id!]),
                };
            } else {
                this.selectedNodes = {};
                this.selectedState = {
                    selectAll: false,
                    toggledNodes: new Set(),
                };
            }
            return 1;
        }

        const updateNodeState = (rowNode: RowNode, value = newValue) => {
            const node = rowNode.footer ? rowNode.sibling : rowNode;
            if (value && node.selectable) {
                this.selectedNodes[node.id!] = node;
            } else {
                delete this.selectedNodes[node.id!];
            }

            const doesNodeConform = value === this.selectedState.selectAll;
            if (doesNodeConform || !node.selectable) {
                this.selectedState.toggledNodes.delete(node.id!);
            } else {
                this.selectedState.toggledNodes.add(node.id!);
            }
        };

        nodes.forEach((node) => updateNodeState(node));

        if (nodes.length === 1 && source === 'api') {
            this.selectionCtx.setRoot(nodes[0].footer ? nodes[0].sibling : nodes[0]);
        }
        return 1;
    }

    public processNewRow(node: RowNode<any>): void {
        if (this.selectedNodes[node.id!]) {
            this.selectedNodes[node.id!] = node;
        }
    }

    public isNodeSelected(node: RowNode): boolean | undefined {
        const isToggled = this.selectedState.toggledNodes.has(node.id!);
        return this.selectedState.selectAll ? !isToggled : isToggled;
    }

    public getSelectedNodes(nullWhenSelectAll = false, warnWhenSelectAll = true): RowNode<any>[] | null {
        const {
            selectedState: { selectAll },
            selectedNodes,
            selectAllUsed,
        } = this;

        // We warn when select all has ever been used, even if not currently active, to help users avoid this codepath
        // early in their devloop.
        if (warnWhenSelectAll && selectAllUsed) {
            _warn(199);
        }

        return nullWhenSelectAll && selectAll ? null : Object.values(selectedNodes);
    }

    public getSelectedRows(): any[] {
        return (this.getSelectedNodes() ?? []).map((node) => node.data);
    }

    public getSelectionCount(): number {
        if (this.selectedState.selectAll) {
            return -1;
        }
        return this.selectedState.toggledNodes.size;
    }

    public isEmpty(): boolean {
        return !this.selectedState.selectAll && !this.selectedState.toggledNodes?.size;
    }

    public selectAllRowNodes(): void {
        this.reset(true);
    }

    public deselectAllRowNodes(): void {
        this.reset(false);
    }

    private reset(selectAll: boolean): void {
        this.selectedState = { selectAll, toggledNodes: new Set() };
        this.selectedNodes = {};
        // If we have ever used select-all, we keep this flag true.
        this.selectAllUsed ||= selectAll;
    }

    public getSelectAllState(): boolean | null {
        if (this.selectedState.selectAll) {
            if (this.selectedState.toggledNodes.size > 0) {
                return null;
            }
            return true;
        }

        if (this.selectedState.toggledNodes.size > 0) {
            return null;
        }
        return false;
    }
}
