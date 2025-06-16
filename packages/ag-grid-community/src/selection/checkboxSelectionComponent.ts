import type { AgColumn } from '../entities/agColumn';
import type { CheckboxSelectionCallback } from '../entities/colDef';
import type { RowNode } from '../entities/rowNode';
import { _getCheckboxes, _getHideDisabledCheckboxes, _getIsRowSelectable } from '../gridOptionsUtils';
import type { GroupCheckboxSelectionCallback } from '../interfaces/groupCellRenderer';
import { _getAriaCheckboxStateName } from '../utils/aria';
import type { ElementParams } from '../utils/dom';
import { _stopPropagationForAgGrid } from '../utils/event';
import type { AgCheckbox } from '../widgets/agCheckbox';
import { AgCheckboxSelector } from '../widgets/agCheckbox';
import { Component, RefPlaceholder } from '../widgets/component';

const CheckboxSelectionComponentElement: ElementParams = {
    tag: 'div',
    cls: 'ag-selection-checkbox',
    role: 'presentation',
    children: [
        {
            tag: 'ag-checkbox',
            ref: 'eCheckbox',
            role: 'presentation',
        },
    ],
};

export class CheckboxSelectionComponent extends Component {
    private readonly eCheckbox: AgCheckbox = RefPlaceholder;

    private rowNode: RowNode;
    private column: AgColumn | undefined;
    private overrides?: {
        isVisible: boolean | CheckboxSelectionCallback | GroupCheckboxSelectionCallback | undefined;
        callbackParams: any;
        removeHidden: boolean;
    };

    constructor() {
        super(CheckboxSelectionComponentElement, [AgCheckboxSelector]);
    }

    public postConstruct(): void {
        this.eCheckbox.setPassive(true);
    }

    public getCheckboxId(): string {
        return this.eCheckbox.getInputElement().id;
    }

    private onDataChanged(): void {
        // when rows are loaded for the second time, this can impact the selection, as a row
        // could be loaded as already selected (if user scrolls down, and then up again).
        this.onSelectionChanged();
    }

    private onSelectableChanged(): void {
        this.showOrHideSelect();
    }

    private onSelectionChanged(): void {
        const translate = this.getLocaleTextFunc();
        const { rowNode, eCheckbox } = this;
        const state = rowNode.isSelected();
        const stateName = _getAriaCheckboxStateName(translate, state);
        const [ariaKey, ariaLabel] = rowNode.selectable
            ? ['ariaRowToggleSelection', 'Press Space to toggle row selection']
            : ['ariaRowSelectionDisabled', 'Row Selection is disabled for this row'];
        const translatedLabel = translate(ariaKey, ariaLabel);

        eCheckbox.setValue(state, true);
        eCheckbox.setInputAriaLabel(`${translatedLabel} (${stateName})`);
    }

    public init(params: {
        rowNode: RowNode;
        column?: AgColumn;
        overrides?: {
            isVisible: boolean | CheckboxSelectionCallback | GroupCheckboxSelectionCallback | undefined;
            callbackParams: any;
            removeHidden: boolean;
        };
    }): void {
        this.rowNode = params.rowNode;
        this.column = params.column;
        this.overrides = params.overrides;

        this.onSelectionChanged();

        this.addManagedListeners(this.eCheckbox.getInputElement(), {
            // we don't want double click on this icon to open a group
            dblclick: _stopPropagationForAgGrid,
            click: (event: MouseEvent) => {
                // we don't want the row clicked event to fire when selecting the checkbox, otherwise the row
                // would possibly get selected twice
                _stopPropagationForAgGrid(event);

                this.beans.selectionSvc?.handleSelectionEvent(event, this.rowNode, 'checkboxSelected');
            },
        });

        this.addManagedListeners(this.rowNode, {
            rowSelected: this.onSelectionChanged.bind(this),
            dataChanged: this.onDataChanged.bind(this),
            selectableChanged: this.onSelectableChanged.bind(this),
        });

        this.addManagedPropertyListener('rowSelection', ({ currentValue, previousValue }) => {
            const curr = typeof currentValue === 'object' ? _getHideDisabledCheckboxes(currentValue) : undefined;
            const prev = typeof previousValue === 'object' ? _getHideDisabledCheckboxes(previousValue) : undefined;
            if (curr !== prev) {
                this.onSelectableChanged();
            }
        });

        const isRowSelectableFunc = _getIsRowSelectable(this.gos);
        const checkboxVisibleIsDynamic = isRowSelectableFunc || typeof this.getIsVisible() === 'function';

        if (checkboxVisibleIsDynamic) {
            const showOrHideSelectListener = this.showOrHideSelect.bind(this);
            this.addManagedEventListeners({ displayedColumnsChanged: showOrHideSelectListener });

            this.addManagedListeners(this.rowNode, {
                dataChanged: showOrHideSelectListener,
                cellChanged: showOrHideSelectListener,
            });

            this.showOrHideSelect();
        }

        this.eCheckbox.getInputElement().setAttribute('tabindex', '-1');
    }

    private showOrHideSelect(): void {
        const { column, rowNode, overrides, gos } = this;
        // if the isRowSelectable() is not provided the row node is selectable by default
        const selectable = rowNode.selectable;

        const isVisible = this.getIsVisible();
        let checkboxes = undefined;
        if (typeof isVisible === 'function') {
            const extraParams = overrides?.callbackParams;
            if (!column) {
                // full width row
                checkboxes = isVisible({ ...extraParams, node: rowNode, data: rowNode.data });
            } else {
                const params = column.createColumnFunctionCallbackParams(rowNode);
                checkboxes = isVisible({ ...extraParams, ...params });
            }
        } else {
            checkboxes = isVisible ?? false;
        }

        const disabled = (selectable && !checkboxes) || (!selectable && checkboxes);
        const visible = selectable || checkboxes;

        const so = gos.get('rowSelection');
        const showDisabledCheckboxes =
            so && typeof so !== 'string'
                ? !_getHideDisabledCheckboxes(so)
                : !!column?.getColDef().showDisabledCheckboxes;

        this.setVisible(visible && (disabled ? showDisabledCheckboxes : true));
        this.setDisplayed(visible && (disabled ? showDisabledCheckboxes : true));
        if (visible) {
            this.eCheckbox.setDisabled(disabled);
        }

        if (overrides?.removeHidden) {
            this.setDisplayed(visible);
            return;
        }
    }

    private getIsVisible(): boolean | CheckboxSelectionCallback<any> | undefined {
        const overrides = this.overrides;
        if (overrides) {
            return overrides.isVisible;
        }

        const so = this.gos.get('rowSelection');
        if (so && typeof so !== 'string') {
            return _getCheckboxes(so);
        }

        // column will be missing if groupDisplayType = 'groupRows'
        return this.column?.getColDef()?.checkboxSelection;
    }
}
