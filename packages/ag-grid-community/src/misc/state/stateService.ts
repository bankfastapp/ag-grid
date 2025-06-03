import { _applyColumnState, _getColumnState } from '../../columns/columnStateUtils';
import type { ColumnState, ColumnStateParams } from '../../columns/columnStateUtils';
import type { NamedBean } from '../../context/bean';
import { BeanStub } from '../../context/beanStub';
import type { AgColumn } from '../../entities/agColumn';
import { _isCellSelectionEnabled, _isClientSideRowModel } from '../../gridOptionsUtils';
import type { CellRange } from '../../interfaces/IRangeService';
import type {
    AggregationState,
    CellSelectionState,
    ColumnGroupState,
    ColumnOrderState,
    ColumnPinningState,
    ColumnSizingState,
    ColumnVisibilityState,
    FilterState,
    FocusedCellState,
    GridState,
    GridStateKey,
    PaginationState,
    PivotState,
    RowGroupExpansionState,
    RowGroupState,
    RowPinningState,
    ScrollState,
    SideBarState,
    SortState,
} from '../../interfaces/gridState';
import type { FilterModel } from '../../interfaces/iFilter';
import type { ServerSideRowGroupSelectionState, ServerSideRowSelectionState } from '../../interfaces/selectionState';
import { _debounce } from '../../utils/function';
import { _jsonEquals } from '../../utils/generic';
import { migrateGridStateModel } from './stateModelMigration';
import { _convertColumnGroupState, convertColumnState } from './stateUtils';

export class StateService extends BeanStub implements NamedBean {
    beanName = 'stateSvc' as const;

    private updateRowGroupExpansionStateTimer: ReturnType<typeof setTimeout> | number = 0;

    private isClientSideRowModel: boolean;
    private cachedState: GridState;
    private suppressEvents = true;
    private queuedUpdateSources: Set<keyof GridState | 'gridInitializing' | 'api'> = new Set();
    private dispatchStateUpdateEventDebounced = _debounce(this, () => this.dispatchQueuedStateUpdateEvents(), 0);
    // If user is doing a manual expand all node by node, we don't want to process one at a time.
    // EVENT_ROW_GROUP_OPENED is already async, so no impact of making the state async here.
    private onRowGroupOpenedDebounced = _debounce(
        this,
        () => {
            this.updateCachedState('rowGroupExpansion', this.getRowGroupExpansionState());
        },
        0
    );
    // similar to row expansion, want to debounce. However, selection is synchronous, so need to mark as stale in case `getState` is called.
    private onRowSelectedDebounced = _debounce(
        this,
        () => {
            this.staleStateKeys.delete('rowSelection');
            this.updateCachedState('rowSelection', this.getRowSelectionState());
        },
        0
    );
    private columnStates?: ColumnState[];
    private columnGroupStates?: { groupId: string; open: boolean | undefined }[];
    private staleStateKeys: Set<keyof GridState> = new Set();

    public postConstruct(): void {
        this.isClientSideRowModel = _isClientSideRowModel(this.gos);

        const initialState = migrateGridStateModel(this.gos.get('initialState') ?? {});
        const partialColumnState = initialState.partialColumnState;
        delete initialState.partialColumnState;
        this.cachedState = initialState;

        const suppressEventsAndDispatchInitEvent = this.suppressEventsAndDispatchInitEvent.bind(this);

        this.beans.ctrlsSvc.whenReady(this, () =>
            suppressEventsAndDispatchInitEvent(() => this.setupStateOnGridReady(initialState))
        );

        const [newColumnsLoadedDestroyFunc, rowCountReadyDestroyFunc, firstDataRenderedDestroyFunc] =
            this.addManagedEventListeners({
                newColumnsLoaded: ({ source }) => {
                    if (source === 'gridInitializing') {
                        newColumnsLoadedDestroyFunc();
                        suppressEventsAndDispatchInitEvent(() =>
                            this.setupStateOnColumnsInitialised(initialState, !!partialColumnState)
                        );
                    }
                },
                rowCountReady: () => {
                    rowCountReadyDestroyFunc?.();
                    suppressEventsAndDispatchInitEvent(() => this.setupStateOnRowCountReady(initialState));
                },
                firstDataRendered: () => {
                    firstDataRenderedDestroyFunc?.();
                    suppressEventsAndDispatchInitEvent(() => this.setupStateOnFirstDataRendered(initialState));
                },
            });
    }

    public override destroy(): void {
        super.destroy();

        // Release memory
        clearTimeout(this.updateRowGroupExpansionStateTimer);
        this.queuedUpdateSources.clear();
    }

    public getState(): GridState {
        if (this.staleStateKeys.size) {
            this.refreshStaleState();
        }
        return this.cachedState;
    }

    public setState(providedState: GridState, propertiesToIgnore?: GridStateKey[]): void {
        const state = migrateGridStateModel(providedState);
        delete state.partialColumnState;
        this.cachedState = state;

        this.startSuppressEvents();

        const source = 'api';

        const ignoreSet = propertiesToIgnore ? new Set(propertiesToIgnore) : undefined;

        this.setGridReadyState(state, source, ignoreSet);

        this.setColumnsInitialisedState(state, source, false, ignoreSet);

        this.setRowCountState(state, source, ignoreSet);

        setTimeout(() => {
            if (this.isAlive()) {
                this.setFirstDataRenderedState(state, source, ignoreSet);
            }
            this.stopSuppressEvents(source);
        });
    }

    private setGridReadyState(
        state: GridState,
        source: 'gridInitializing' | 'api',
        ignoreSet?: Set<GridStateKey>
    ): void {
        // sidebar reads the initial state itself, so don't need to set on init
        if (source === 'api' && !ignoreSet?.has('sideBar')) {
            this.beans.sideBar?.comp?.setState(state.sideBar);
        }
        this.updateCachedState('sideBar', this.getSideBarState());
    }

    private setupStateOnGridReady(initialState: GridState): void {
        this.setGridReadyState(initialState, 'gridInitializing');

        const stateUpdater = () => this.updateCachedState('sideBar', this.getSideBarState());
        this.addManagedEventListeners({
            toolPanelVisibleChanged: stateUpdater,
            sideBarUpdated: stateUpdater,
        });
    }

    private updateColumnAndGroupState(): void {
        this.updateColumnState([
            'aggregation',
            'columnOrder',
            'columnPinning',
            'columnSizing',
            'columnVisibility',
            'pivot',
            'rowGroup',
            'sort',
        ]);
        this.updateCachedState('columnGroup', this.getColumnGroupState());
    }

    private setColumnsInitialisedState(
        state: GridState,
        source: 'gridInitializing' | 'api',
        partialColumnState: boolean,
        ignoreSet?: Set<GridStateKey>
    ): void {
        this.setColumnState(state, source, partialColumnState, ignoreSet);
        this.setColumnGroupState(state, source, ignoreSet);

        this.updateColumnAndGroupState();
    }

    private setupStateOnColumnsInitialised(initialState: GridState, partialColumnState: boolean): void {
        this.setColumnsInitialisedState(initialState, 'gridInitializing', partialColumnState);

        const onUpdate = (state: keyof GridState) => () => this.updateColumnState([state]);
        this.addManagedEventListeners({
            columnValueChanged: onUpdate('aggregation'),
            columnMoved: onUpdate('columnOrder'),
            columnPinned: onUpdate('columnPinning'),
            columnResized: onUpdate('columnSizing'),
            columnVisible: onUpdate('columnVisibility'),
            columnPivotChanged: onUpdate('pivot'),
            columnPivotModeChanged: onUpdate('pivot'),
            columnRowGroupChanged: onUpdate('rowGroup'),
            sortChanged: onUpdate('sort'),
            newColumnsLoaded: this.updateColumnAndGroupState.bind(this),
            columnGroupOpened: () => this.updateCachedState('columnGroup', this.getColumnGroupState()),
        });
    }

    private setRowCountState(
        state: GridState,
        source: 'gridInitializing' | 'api',
        ignoreSet?: Set<GridStateKey>
    ): void {
        const {
            filter: filterState,
            rowGroupExpansion: rowGroupExpansionState,
            rowSelection: rowSelectionState,
            pagination: paginationState,
        } = state;
        const shouldSetState = <TKey extends GridStateKey>(prop: TKey, propState: GridState[TKey]) =>
            !ignoreSet?.has(prop) && (propState || source === 'api');

        if (shouldSetState('filter', filterState)) {
            this.setFilterState(filterState);
        }
        if (shouldSetState('rowGroupExpansion', rowGroupExpansionState)) {
            this.setRowGroupExpansionState(rowGroupExpansionState, source);
        }
        if (shouldSetState('rowSelection', rowSelectionState)) {
            this.setRowSelectionState(rowSelectionState, source);
        }
        if (shouldSetState('pagination', paginationState)) {
            this.setPaginationState(paginationState, source);
        }

        const updateCachedState = this.updateCachedState.bind(this);
        updateCachedState('filter', this.getFilterState());
        updateCachedState('rowGroupExpansion', this.getRowGroupExpansionState());
        updateCachedState('rowSelection', this.getRowSelectionState());
        updateCachedState('pagination', this.getPaginationState());
    }

    private setupStateOnRowCountReady(initialState: GridState): void {
        this.setRowCountState(initialState, 'gridInitializing');

        const updateCachedState = this.updateCachedState.bind(this);
        const updateRowGroupExpansionState = () => {
            this.updateRowGroupExpansionStateTimer = 0;
            updateCachedState('rowGroupExpansion', this.getRowGroupExpansionState());
        };
        const updateFilterState = () => updateCachedState('filter', this.getFilterState());

        const { gos, colFilter } = this.beans;
        this.addManagedEventListeners({
            filterChanged: updateFilterState,
            rowGroupOpened: () => this.onRowGroupOpenedDebounced(),
            expandOrCollapseAll: updateRowGroupExpansionState,
            // `groupDefaultExpanded`/`isGroupOpenByDefault` updates expansion state without an expansion event
            columnRowGroupChanged: updateRowGroupExpansionState,
            rowDataUpdated: () => {
                if (gos.get('groupDefaultExpanded') !== 0 || gos.get('isGroupOpenByDefault')) {
                    // once rows are loaded, they may be expanded, start the timer only once
                    this.updateRowGroupExpansionStateTimer ||= setTimeout(updateRowGroupExpansionState);
                }
            },
            selectionChanged: () => {
                this.staleStateKeys.add('rowSelection');
                this.onRowSelectedDebounced();
            },
            paginationChanged: (event) => {
                if (event.newPage || event.newPageSize) {
                    updateCachedState('pagination', this.getPaginationState());
                }
            },
        });
        if (colFilter) {
            this.addManagedListeners(colFilter, {
                filterStateChanged: updateFilterState,
            });
        }
    }

    private setFirstDataRenderedState(
        state: GridState,
        source: 'gridInitializing' | 'api',
        ignoreSet?: Set<GridStateKey>
    ): void {
        const {
            scroll: scrollState,
            cellSelection: cellSelectionState,
            focusedCell: focusedCellState,
            columnOrder: columnOrderState,
            rowPinning,
        } = state;
        const shouldSetState = <TKey extends GridStateKey>(prop: TKey, propState: GridState[TKey]) =>
            !ignoreSet?.has(prop) && (propState || source === 'api');

        if (shouldSetState('focusedCell', focusedCellState)) {
            this.setFocusedCellState(focusedCellState);
        }
        if (shouldSetState('cellSelection', cellSelectionState)) {
            this.setCellSelectionState(cellSelectionState);
        }
        if (shouldSetState('scroll', scrollState)) {
            this.setScrollState(scrollState);
        }
        if (shouldSetState('rowPinning', rowPinning)) {
            this.setRowPinningState(rowPinning);
        }
        this.setColumnPivotState(!!columnOrderState?.orderedColIds, source);

        const updateCachedState = this.updateCachedState.bind(this);
        // reset sidebar as it could have updated when columns changed
        updateCachedState('sideBar', this.getSideBarState());
        updateCachedState('focusedCell', this.getFocusedCellState());
        const cellSelection = this.getRangeSelectionState();
        updateCachedState('rangeSelection', cellSelection);
        updateCachedState('cellSelection', cellSelection);
        updateCachedState('scroll', this.getScrollState());
    }

    private setupStateOnFirstDataRendered(initialState: GridState): void {
        this.setFirstDataRenderedState(initialState, 'gridInitializing');

        const updateCachedState = this.updateCachedState.bind(this);
        this.addManagedEventListeners({
            cellFocused: () => updateCachedState('focusedCell', this.getFocusedCellState()),
            cellSelectionChanged: (event) => {
                if (event.finished) {
                    const cellSelection = this.getRangeSelectionState();
                    updateCachedState('rangeSelection', cellSelection);
                    updateCachedState('cellSelection', cellSelection);
                }
            },
            bodyScrollEnd: () => updateCachedState('scroll', this.getScrollState()),
            pinnedRowsChanged: () => updateCachedState('rowPinning', this.getRowPinningState()),
        });
    }

    private getColumnState(): {
        sort?: SortState;
        rowGroup?: RowGroupState;
        aggregation?: AggregationState;
        pivot?: PivotState;
        columnPinning?: ColumnPinningState;
        columnVisibility?: ColumnVisibilityState;
        columnSizing?: ColumnSizingState;
        columnOrder?: ColumnOrderState;
    } {
        const beans = this.beans;
        return convertColumnState(_getColumnState(beans), beans.colModel.isPivotMode());
    }

    private setColumnState(
        state: GridState,
        source: 'gridInitializing' | 'api',
        partialColumnState: boolean,
        ignoreSet?: Set<GridStateKey>
    ): void {
        const {
            sort: sortState,
            rowGroup: groupState,
            aggregation: aggregationState,
            pivot: pivotState,
            columnPinning: columnPinningState,
            columnVisibility: columnVisibilityState,
            columnSizing: columnSizingState,
            columnOrder: columnOrderState,
        } = state;
        const shouldSetState = <TKey extends GridStateKey>(prop: TKey, propState: GridState[TKey]) =>
            !ignoreSet?.has(prop) && (propState || source === 'api');
        const columnStateMap: { [colId: string]: ColumnState } = {};
        const getColumnState = (colId: string) => {
            let columnState = columnStateMap[colId];
            if (columnState) {
                return columnState;
            }
            columnState = { colId };
            columnStateMap[colId] = columnState;
            return columnState;
        };
        const defaultState: ColumnStateParams = {};

        const shouldSetSortState = shouldSetState('sort', sortState);
        if (shouldSetSortState) {
            sortState?.sortModel.forEach(({ colId, sort }, sortIndex) => {
                const columnState = getColumnState(colId);
                columnState.sort = sort;
                columnState.sortIndex = sortIndex;
            });
        }
        if (shouldSetSortState || !partialColumnState) {
            defaultState.sort = null;
            defaultState.sortIndex = null;
        }

        const shouldSetGroupState = shouldSetState('rowGroup', groupState);
        if (shouldSetGroupState) {
            groupState?.groupColIds.forEach((colId, rowGroupIndex) => {
                const columnState = getColumnState(colId);
                columnState.rowGroup = true;
                columnState.rowGroupIndex = rowGroupIndex;
            });
        }
        if (shouldSetGroupState || !partialColumnState) {
            defaultState.rowGroup = null;
            defaultState.rowGroupIndex = null;
        }

        const shouldSetAggregationState = shouldSetState('aggregation', aggregationState);
        if (shouldSetAggregationState) {
            aggregationState?.aggregationModel.forEach(({ colId, aggFunc }) => {
                getColumnState(colId).aggFunc = aggFunc;
            });
        }
        if (shouldSetAggregationState || !partialColumnState) {
            defaultState.aggFunc = null;
        }

        const shouldSetPivotState = shouldSetState('pivot', pivotState);
        if (shouldSetPivotState) {
            pivotState?.pivotColIds.forEach((colId, pivotIndex) => {
                const columnState = getColumnState(colId);
                columnState.pivot = true;
                columnState.pivotIndex = pivotIndex;
            });
            this.gos.updateGridOptions({
                options: { pivotMode: !!pivotState?.pivotMode },
                source: source as any,
            });
        }
        if (shouldSetPivotState || !partialColumnState) {
            defaultState.pivot = null;
            defaultState.pivotIndex = null;
        }

        const shouldSetColumnPinningState = shouldSetState('columnPinning', columnPinningState);
        if (shouldSetColumnPinningState) {
            columnPinningState?.leftColIds.forEach((colId) => {
                getColumnState(colId).pinned = 'left';
            });
            columnPinningState?.rightColIds.forEach((colId) => {
                getColumnState(colId).pinned = 'right';
            });
        }
        if (shouldSetColumnPinningState || !partialColumnState) {
            defaultState.pinned = null;
        }

        const shouldSetColumnVisibilityState = shouldSetState('columnVisibility', columnVisibilityState);
        if (shouldSetColumnVisibilityState) {
            columnVisibilityState?.hiddenColIds.forEach((colId) => {
                getColumnState(colId).hide = true;
            });
        }
        if (shouldSetColumnVisibilityState || !partialColumnState) {
            defaultState.hide = null;
        }

        const shouldSetColumnSizingState = shouldSetState('columnSizing', columnSizingState);
        if (shouldSetColumnSizingState) {
            columnSizingState?.columnSizingModel.forEach(({ colId, flex, width }) => {
                const columnState = getColumnState(colId);
                columnState.flex = flex ?? null;
                columnState.width = width;
            });
        }
        if (shouldSetColumnSizingState || !partialColumnState) {
            defaultState.flex = null;
        }

        const columns = columnOrderState?.orderedColIds;
        const applyOrder = !!columns?.length && !ignoreSet?.has('columnOrder');
        const columnStates = applyOrder ? columns.map((colId) => getColumnState(colId)) : Object.values(columnStateMap);

        if (columnStates.length) {
            this.columnStates = columnStates;
            _applyColumnState(
                this.beans,
                {
                    state: columnStates,
                    applyOrder,
                    defaultState,
                },
                source
            );
        }
    }

    private setColumnPivotState(applyOrder: boolean, source: 'gridInitializing' | 'api'): void {
        const columnStates = this.columnStates;
        this.columnStates = undefined;
        const columnGroupStates = this.columnGroupStates;
        this.columnGroupStates = undefined;

        const beans = this.beans;
        const { pivotResultCols, colGroupSvc } = beans;
        if (!pivotResultCols?.isPivotResultColsPresent()) {
            return;
        }

        if (columnStates) {
            const secondaryColumnStates: ColumnState[] = [];
            for (const columnState of columnStates) {
                if (pivotResultCols.getPivotResultCol(columnState.colId)) {
                    secondaryColumnStates.push(columnState);
                }
            }

            _applyColumnState(
                beans,
                {
                    state: secondaryColumnStates,
                    applyOrder,
                },
                source
            );
        }

        if (columnGroupStates) {
            // no easy/performant way of knowing which column groups are pivot column groups
            colGroupSvc?.setColumnGroupState(columnGroupStates, source);
        }
    }

    private getColumnGroupState(): ColumnGroupState | undefined {
        const colGroupSvc = this.beans.colGroupSvc;
        if (!colGroupSvc) {
            return undefined;
        }
        const columnGroupState = colGroupSvc.getColumnGroupState();
        return _convertColumnGroupState(columnGroupState);
    }

    private setColumnGroupState(
        state: GridState,
        source: 'gridInitializing' | 'api',
        ignoreSet?: Set<GridStateKey>
    ): void {
        const colGroupSvc = this.beans.colGroupSvc;
        if (
            !colGroupSvc ||
            ignoreSet?.has('columnGroup') ||
            (source !== 'api' && !Object.prototype.hasOwnProperty.call(state, 'columnGroup'))
        ) {
            return;
        }

        const openColumnGroups = new Set(state.columnGroup?.openColumnGroupIds);
        const existingColumnGroupState = colGroupSvc.getColumnGroupState();
        const stateItems = existingColumnGroupState.map(({ groupId }) => {
            const open = openColumnGroups.has(groupId);
            if (open) {
                openColumnGroups.delete(groupId);
            }
            return {
                groupId,
                open,
            };
        });
        // probably pivot cols
        openColumnGroups.forEach((groupId) => {
            stateItems.push({
                groupId,
                open: true,
            });
        });
        if (stateItems.length) {
            this.columnGroupStates = stateItems;
        }
        colGroupSvc.setColumnGroupState(stateItems, source);
    }

    private getFilterState(): FilterState | undefined {
        const filterManager = this.beans.filterManager;
        let filterModel: FilterModel | undefined = filterManager?.getFilterModel();
        if (filterModel && Object.keys(filterModel).length === 0) {
            filterModel = undefined;
        }
        const columnFilterState = filterManager?.getFilterState();
        const advancedFilterModel = filterManager?.getAdvFilterModel() ?? undefined;
        return filterModel || advancedFilterModel || columnFilterState
            ? { filterModel, columnFilterState, advancedFilterModel }
            : undefined;
    }

    private setFilterState(filterState?: FilterState): void {
        const filterManager = this.beans.filterManager;
        const { filterModel, columnFilterState, advancedFilterModel } = filterState ?? {
            filterModel: null,
            columnFilterState: null,
            advancedFilterModel: null,
        };
        if (filterModel !== undefined || columnFilterState !== undefined) {
            filterManager?.setFilterState(filterModel ?? null, columnFilterState ?? null, 'columnFilter');
        }
        if (advancedFilterModel !== undefined) {
            filterManager?.setAdvFilterModel(advancedFilterModel ?? null, 'advancedFilter');
        }
    }

    private getRangeSelectionState(): CellSelectionState | undefined {
        const cellRanges = this.beans.rangeSvc?.getCellRanges().map((cellRange) => {
            const { id, type, startRow, endRow, columns, startColumn } = cellRange;
            return {
                id,
                type,
                startRow,
                endRow,
                colIds: columns.map((column) => column.getColId()),
                startColId: startColumn.getColId(),
            };
        });
        return cellRanges?.length ? { cellRanges } : undefined;
    }

    private setCellSelectionState(cellSelectionState?: CellSelectionState): void {
        const { gos, rangeSvc, colModel, visibleCols } = this.beans;

        if (!_isCellSelectionEnabled(gos) || !rangeSvc) {
            return;
        }

        const cellRanges: CellRange[] = [];
        cellSelectionState?.cellRanges.forEach((cellRange) => {
            const columns: AgColumn[] = [];
            cellRange.colIds.forEach((colId) => {
                const column = colModel.getCol(colId);
                if (column) {
                    columns.push(column);
                }
            });
            if (!columns.length) {
                return;
            }
            let startColumn = colModel.getCol(cellRange.startColId);
            if (!startColumn) {
                // find the first remaining column
                const allColumns = visibleCols.allCols;
                const columnSet = new Set(columns);
                startColumn = allColumns.find((column) => columnSet.has(column))!;
            }
            cellRanges.push({
                ...cellRange,
                columns,
                startColumn,
            });
        });

        rangeSvc.setCellRanges(cellRanges);
    }

    private getScrollState(): ScrollState | undefined {
        if (!this.isClientSideRowModel) {
            // can't restore, so don't provide
            return undefined;
        }
        const scrollFeature = this.beans.ctrlsSvc.getScrollFeature();
        const { left } = scrollFeature?.getHScrollPosition() ?? { left: 0 };
        const { top } = scrollFeature?.getVScrollPosition() ?? { top: 0 };
        return top || left
            ? {
                  top,
                  left,
              }
            : undefined;
    }

    private setScrollState(scrollState?: ScrollState): void {
        if (!this.isClientSideRowModel) {
            return;
        }
        const { top, left } = scrollState ?? { top: 0, left: 0 };
        const { frameworkOverrides, rowRenderer, animationFrameSvc, ctrlsSvc } = this.beans;
        frameworkOverrides.wrapIncoming(() => {
            ctrlsSvc.get('center').setCenterViewportScrollLeft(left);
            ctrlsSvc.getScrollFeature()?.setVerticalScrollPosition(top);
            rowRenderer.redraw({ afterScroll: true });
            animationFrameSvc?.flushAllFrames();
        });
    }

    private getSideBarState(): SideBarState | undefined {
        return this.beans.sideBar?.comp?.getState();
    }

    private getFocusedCellState(): FocusedCellState | undefined {
        if (!this.isClientSideRowModel) {
            // can't restore, so don't provide
            return undefined;
        }
        const focusedCell = this.beans.focusSvc.getFocusedCell();
        if (focusedCell) {
            const { column, rowIndex, rowPinned } = focusedCell;
            return {
                colId: column.getColId(),
                rowIndex,
                rowPinned,
            };
        }
        return undefined;
    }

    private setFocusedCellState(focusedCellState?: FocusedCellState): void {
        if (!this.isClientSideRowModel) {
            return;
        }
        const { focusSvc, colModel } = this.beans;
        if (!focusedCellState) {
            focusSvc.clearFocusedCell();
            return;
        }
        const { colId, rowIndex, rowPinned } = focusedCellState;
        focusSvc.setFocusedCell({
            column: colModel.getCol(colId),
            rowIndex,
            rowPinned,
            forceBrowserFocus: true,
            preventScrollOnBrowserFocus: true,
        });
    }

    private getPaginationState(): PaginationState | undefined {
        const { pagination, gos } = this.beans;
        if (!pagination) {
            return undefined;
        }
        const page = pagination.getCurrentPage();
        const pageSize = !gos.get('paginationAutoPageSize') ? pagination.getPageSize() : undefined;

        if (!page && !pageSize) {
            return;
        }
        return { page, pageSize };
    }

    private setPaginationState(paginationState: PaginationState | undefined, source: 'gridInitializing' | 'api'): void {
        const { pagination, gos } = this.beans;
        if (!pagination) {
            return;
        }
        const { pageSize, page } = paginationState ?? { page: 0, pageSize: gos.get('paginationPageSize') };
        const isInit = source === 'gridInitializing';
        if (pageSize && !gos.get('paginationAutoPageSize')) {
            pagination.setPageSize(pageSize, isInit ? 'initialState' : 'pageSizeSelector');
        }

        if (typeof page === 'number') {
            if (isInit) {
                pagination.setPage(page);
            } else {
                pagination.goToPage(page);
            }
        }
    }

    private getRowSelectionState():
        | string[]
        | ServerSideRowSelectionState
        | ServerSideRowGroupSelectionState
        | undefined {
        const selectionSvc = this.beans.selectionSvc;
        if (!selectionSvc) {
            return undefined;
        }
        const selectionState = selectionSvc.getSelectionState();
        const noSelections =
            !selectionState ||
            (!Array.isArray(selectionState) &&
                ((selectionState as ServerSideRowSelectionState).selectAll === false ||
                    (selectionState as ServerSideRowGroupSelectionState).selectAllChildren === false) &&
                !selectionState?.toggledNodes?.length);
        return noSelections ? undefined : selectionState;
    }

    private setRowSelectionState(
        rowSelectionState: string[] | ServerSideRowSelectionState | ServerSideRowGroupSelectionState | undefined,
        source: 'gridInitializing' | 'api'
    ): void {
        this.beans.selectionSvc?.setSelectionState(rowSelectionState, source, source === 'api');
    }

    private getRowGroupExpansionState(): RowGroupExpansionState | undefined {
        const { expansionSvc, rowModel } = this.beans;
        if (!expansionSvc) {
            return undefined;
        }

        const expandedRowGroups: string[] = [];
        rowModel.forEachNode(({ expanded, id }) => {
            if (expanded && id) {
                expandedRowGroups.push(id);
            }
        });
        return expandedRowGroups.length
            ? {
                  expandedRowGroupIds: expandedRowGroups,
              }
            : undefined;
    }

    private getRowPinningState(): RowPinningState | undefined {
        return this.beans.pinnedRowModel?.getPinnedState();
    }

    private setRowPinningState(state?: RowPinningState): void {
        const pinnedRowModel = this.beans.pinnedRowModel;
        if (state) {
            pinnedRowModel?.setPinnedState(state);
        } else {
            pinnedRowModel?.reset();
        }
    }

    private setRowGroupExpansionState(
        rowGroupExpansionState: RowGroupExpansionState | undefined,
        source: 'gridInitializing' | 'api'
    ): void {
        const expansionSvc = this.beans.expansionSvc;
        if (!expansionSvc) {
            return;
        }
        const rowGroupIdsToExpand = rowGroupExpansionState?.expandedRowGroupIds ?? [];
        let rowGroupIdsToCollapse: string[] | undefined;
        if (source === 'api') {
            const oldExpandedRowGroupIds = this.getRowGroupExpansionState()?.expandedRowGroupIds;
            if (oldExpandedRowGroupIds?.length) {
                const oldExpandedRowGroupIdsSet = new Set(oldExpandedRowGroupIds);
                for (const id of rowGroupIdsToExpand) {
                    oldExpandedRowGroupIdsSet.delete(id);
                }
                rowGroupIdsToCollapse = Array.from(oldExpandedRowGroupIdsSet);
            }
        }
        expansionSvc.expandRows(rowGroupIdsToExpand, rowGroupIdsToCollapse);
    }

    private updateColumnState(features: (keyof GridState)[]): void {
        const newColumnState = this.getColumnState();
        let hasChanged = false;
        const cachedState = this.cachedState;
        for (const key of Object.keys(newColumnState) as (keyof GridState)[]) {
            const value = (newColumnState as any)[key];
            if (!_jsonEquals(value, cachedState[key])) {
                hasChanged = true;
            }
        }

        this.cachedState = {
            ...cachedState,
            ...newColumnState,
        };
        if (hasChanged) {
            this.dispatchStateUpdateEvent(features);
        }
    }

    private updateCachedState<K extends keyof GridState>(key: K, value: GridState[K]): void {
        const existingValue = this.cachedState[key];
        this.setCachedStateValue(key, value);
        if (!_jsonEquals(value, existingValue)) {
            this.dispatchStateUpdateEvent([key]);
        }
    }

    private setCachedStateValue<K extends keyof GridState>(key: K, value: GridState[K]): void {
        this.cachedState = {
            ...this.cachedState,
            [key]: value,
        };
    }

    private refreshStaleState(): void {
        const staleStateKeys = this.staleStateKeys;
        staleStateKeys.forEach((key) => {
            switch (key) {
                // only row selection supported for now
                case 'rowSelection':
                    this.setCachedStateValue(key, this.getRowSelectionState());
                    break;
            }
        });
        staleStateKeys.clear();
    }

    private dispatchStateUpdateEvent(sources: (keyof GridState | 'gridInitializing' | 'api')[]): void {
        if (this.suppressEvents) {
            return;
        }
        sources.forEach((source) => this.queuedUpdateSources.add(source));
        this.dispatchStateUpdateEventDebounced();
    }

    private dispatchQueuedStateUpdateEvents(): void {
        const queuedUpdateSources = this.queuedUpdateSources;
        const sources = Array.from(queuedUpdateSources);
        queuedUpdateSources.clear();
        this.eventSvc.dispatchEvent({
            type: 'stateUpdated',
            sources,
            state: this.cachedState,
        });
    }

    private startSuppressEvents(): void {
        this.suppressEvents = true;
        this.beans.colAnimation?.setSuppressAnimation(true);
    }

    private stopSuppressEvents(source: 'gridInitializing' | 'api'): void {
        // We want to suppress any grid events, but not user events.
        // Using a timeout here captures things like column resizing and emits a single grid initializing event.
        setTimeout(() => {
            this.suppressEvents = false;
            // We only want the grid initializing source.
            this.queuedUpdateSources.clear();
            if (!this.isAlive()) {
                // Ensure the grid is still alive before dispatching the event.
                return;
            }
            this.beans.colAnimation?.setSuppressAnimation(false);
            this.dispatchStateUpdateEvent([source]);
        });
    }

    private suppressEventsAndDispatchInitEvent(updateFunc: () => void): void {
        this.startSuppressEvents();
        updateFunc();
        this.stopSuppressEvents('gridInitializing');
    }
}
