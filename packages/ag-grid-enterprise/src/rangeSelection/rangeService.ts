import type {
    AgColumn,
    AgColumnGroup,
    BeanCollection,
    CellCtrl,
    CellNavigationService,
    CellPosition,
    CellRange,
    CellRangeParams,
    ClearCellRangeParams,
    ColumnModel,
    CtrlsService,
    DragService,
    GridOptionsService,
    ICellRangeFeature,
    IHeaderCellComp,
    IRangeService,
    IRowModel,
    NamedBean,
    PartialCellRange,
    RowPinnedType,
    RowPosition,
    ValueService,
    VisibleColsService,
} from 'ag-grid-community';
import {
    AutoScrollService,
    BeanStub,
    _areCellsEqual,
    _areEqual,
    _exists,
    _getCellCtrlForEventTarget,
    _getRowAbove,
    _getRowBelow,
    _getRowNode,
    _getSuppressMultiRanges,
    _isCellSelectionEnabled,
    _isDomLayout,
    _isRowBefore,
    _isSameRow,
    _isUsingNewCellSelectionAPI,
    _last,
    _makeNull,
    _missing,
    _warn,
    isRowNumberCol,
} from 'ag-grid-community';

import { CellRangeFeature } from './cellRangeFeature';
import { DragListenerFeature } from './dragListenerFeature';
import { RangeHeaderHighlightFeature } from './rangeHeaderHighlightFeature';

enum SelectionMode {
    NORMAL,
    ALL_COLUMNS,
}
export class RangeService extends BeanStub implements NamedBean, IRangeService {
    beanName = 'rangeSvc' as const;

    private rowModel: IRowModel;
    private dragSvc: DragService;
    private colModel: ColumnModel;
    private visibleCols: VisibleColsService;
    private cellNavigation: CellNavigationService;
    private ctrlsSvc: CtrlsService;
    private valueSvc: ValueService;
    private selectionMode: SelectionMode;

    public wireBeans(beans: BeanCollection) {
        this.rowModel = beans.rowModel;
        this.dragSvc = beans.dragSvc!;
        this.colModel = beans.colModel;
        this.visibleCols = beans.visibleCols;
        this.cellNavigation = beans.cellNavigation!;
        this.ctrlsSvc = beans.ctrlsSvc;
        this.valueSvc = beans.valueSvc;
    }

    private cellRanges: CellRange[] = [];
    private lastMouseEvent: MouseEvent | null;
    private bodyScrollListener = this.onBodyScroll.bind(this);

    private lastCellHovered: CellPosition | undefined;
    private cellHasChanged: boolean;

    // when a range is created, we mark the 'start cell' for further processing as follows:
    // 1) if dragging, then the new range is extended from the start position
    // 2) if user hits 'shift' click on a cell, the previous range is extended from the start position
    private newestRangeStartCell?: CellPosition;

    private dragging = false;
    private draggingRange?: CellRange;

    private intersectionRange = false; // When dragging ends, the current range will be used to intersect all other ranges

    public autoScrollService: AutoScrollService;

    public postConstruct(): void {
        const onColumnsChanged = this.onColumnsChanged.bind(this);
        const removeAllCellRanges = () => this.removeAllCellRanges();
        const refreshLastRangeStart = this.refreshLastRangeStart.bind(this);
        this.addManagedEventListeners({
            newColumnsLoaded: onColumnsChanged,
            columnVisible: onColumnsChanged,
            columnValueChanged: onColumnsChanged,
            columnPivotModeChanged: removeAllCellRanges,
            columnRowGroupChanged: removeAllCellRanges,
            columnPivotChanged: removeAllCellRanges,
            columnGroupOpened: refreshLastRangeStart,
            columnMoved: refreshLastRangeStart,
            columnPinned: refreshLastRangeStart,
        });

        this.ctrlsSvc.whenReady(this, (p) => {
            const gridBodyCtrl = p.gridBodyCtrl;
            this.autoScrollService = new AutoScrollService({
                scrollContainer: gridBodyCtrl.eBodyViewport!,
                scrollAxis: 'xy',
                getVerticalPosition: () => gridBodyCtrl.scrollFeature.getVScrollPosition().top,
                setVerticalPosition: (position) => gridBodyCtrl.scrollFeature.setVerticalScrollPosition(position),
                getHorizontalPosition: () => gridBodyCtrl.scrollFeature.getHScrollPosition().left,
                setHorizontalPosition: (position) => gridBodyCtrl.scrollFeature.setHorizontalScrollPosition(position),
                shouldSkipVerticalScroll: () => !_isDomLayout(this.gos, 'normal'),
                shouldSkipHorizontalScroll: () => !gridBodyCtrl.scrollFeature.isHorizontalScrollShowing(),
            });
        });
    }

    // Drag And Drop Target Methods
    public onDragStart(mouseEvent: MouseEvent): void {
        if (!_isCellSelectionEnabled(this.gos)) {
            return;
        }

        const { ctrlKey, metaKey, shiftKey } = mouseEvent;

        // ctrlKey for windows, metaKey for Apple
        const isMultiKey = ctrlKey || metaKey;
        const allowMulti = !_getSuppressMultiRanges(this.gos);
        const isMultiSelect = allowMulti ? isMultiKey : false;
        const extendRange = shiftKey && !!this.cellRanges?.length;

        if (!isMultiSelect && (!extendRange || _exists(_last(this.cellRanges)!.type))) {
            this.removeAllCellRanges(true);
        }

        // The browser changes the Event target of cached events when working with the ShadowDOM
        // so we need to retrieve the initial DragStartTarget.
        const startTarget = this.dragSvc.startTarget;

        if (startTarget) {
            this.updateValuesOnMove(startTarget);
        }

        if (!this.lastCellHovered) {
            return;
        }

        this.dragging = true;
        this.lastMouseEvent = mouseEvent;
        this.intersectionRange = isMultiSelect && this.getCellRangeCount(this.lastCellHovered) > 1;

        if (!extendRange) {
            this.setNewestRangeStartCell(this.lastCellHovered);
        }

        // if we didn't clear the ranges, then dragging means the user clicked, and when the
        // user clicks it means a range of one cell was created. we need to extend this range
        // rather than creating another range. otherwise we end up with two distinct ranges
        // from a drag operation (one from click, and one from drag).
        if (this.cellRanges.length > 0) {
            this.draggingRange = _last(this.cellRanges);
        } else {
            const mouseRowPosition: RowPosition = {
                rowIndex: this.lastCellHovered.rowIndex,
                rowPinned: this.lastCellHovered.rowPinned,
            };

            const columns = this.getColumnsFromModel([this.lastCellHovered.column] as AgColumn[]);

            if (!columns || !columns.length) {
                return;
            }

            this.draggingRange = {
                startRow: mouseRowPosition,
                endRow: mouseRowPosition,
                columns,
                startColumn: this.newestRangeStartCell!.column,
            };

            this.cellRanges.push(this.draggingRange);
        }

        this.ctrlsSvc
            .getGridBodyCtrl()
            .eBodyViewport.addEventListener('scroll', this.bodyScrollListener, { passive: true });

        this.dispatchChangedEvent(true, false, this.draggingRange.id);
    }

    public onDragging(mouseEvent: MouseEvent | null): void {
        const { dragging, lastCellHovered, newestRangeStartCell, autoScrollService, cellHasChanged } = this;
        if (!dragging || !mouseEvent) {
            return;
        }

        this.updateValuesOnMove(mouseEvent.target);

        this.lastMouseEvent = mouseEvent;

        const isMouseAndStartInPinned = (position: string) =>
            lastCellHovered && lastCellHovered.rowPinned === position && newestRangeStartCell!.rowPinned === position;

        const skipVerticalScroll = isMouseAndStartInPinned('top') || isMouseAndStartInPinned('bottom');

        autoScrollService.check(mouseEvent, skipVerticalScroll!);

        if (!cellHasChanged || !lastCellHovered) {
            return;
        }

        const startColumn = newestRangeStartCell?.column as AgColumn;
        const currentColumn = lastCellHovered?.column as AgColumn;

        const columns = this.calculateColumnsBetween(startColumn, currentColumn);

        if (!columns) {
            return;
        }

        const { rowIndex, rowPinned } = lastCellHovered;

        this.draggingRange!.endRow = {
            rowIndex,
            rowPinned,
        };

        this.draggingRange!.columns = columns;
        this.dispatchChangedEvent(false, false, this.draggingRange!.id);
    }

    public onDragStop(): void {
        if (!this.dragging) {
            return;
        }

        const { id } = this.draggingRange!;

        this.autoScrollService.ensureCleared();

        this.ctrlsSvc.getGridBodyCtrl().eBodyViewport.removeEventListener('scroll', this.bodyScrollListener);
        this.lastMouseEvent = null;
        this.dragging = false;
        this.draggingRange = undefined;
        this.lastCellHovered = undefined;

        if (this.intersectionRange) {
            this.intersectionRange = false;
            this.intersectLastRange();
        }

        this.dispatchChangedEvent(false, true, id);
    }

    // Called for both columns loaded & column visibility events
    public onColumnsChanged(): void {
        // first move start column in last cell range (i.e. series chart range)
        this.refreshLastRangeStart();

        const allColumns = this.visibleCols.allCols;

        // check that the columns in each range still exist and are visible
        this.cellRanges.forEach((cellRange) => {
            const beforeCols = cellRange.columns;

            // remove hidden or removed cols from cell range
            cellRange.columns = cellRange.columns.filter(
                (col: AgColumn) => col.isVisible() && allColumns.indexOf(col) !== -1
            );

            const colsInRangeChanged = !_areEqual(beforeCols, cellRange.columns);

            if (colsInRangeChanged) {
                // notify users and other parts of grid (i.e. status panel) that range has changed
                this.dispatchChangedEvent(false, true, cellRange.id);
            }
        });
        // Remove empty cell ranges
        const countBefore = this.cellRanges.length;
        this.cellRanges = this.cellRanges.filter((range) => range.columns.length > 0);
        if (countBefore > this.cellRanges.length) {
            this.dispatchChangedEvent(false, true);
        }
    }

    public refreshLastRangeStart(): void {
        const lastRange = _last(this.cellRanges);

        if (!lastRange) {
            return;
        }

        this.refreshRangeStart(lastRange);
    }

    public isContiguousRange(cellRange: CellRange): boolean {
        const rangeColumns = cellRange.columns as AgColumn[];

        if (!rangeColumns.length) {
            return false;
        }

        const allColumns = this.visibleCols.allCols;
        const allPositions = rangeColumns.map((c) => allColumns.indexOf(c)).sort((a, b) => a - b);

        return _last(allPositions) - allPositions[0] + 1 === rangeColumns.length;
    }

    public getRangeStartRow(cellRange: PartialCellRange): RowPosition {
        if (cellRange.startRow && cellRange.endRow) {
            return _isRowBefore(cellRange.startRow, cellRange.endRow) ? cellRange.startRow : cellRange.endRow;
        }

        const pinnedTopRowCount = this.beans.pinnedRowModel?.getPinnedTopRowCount() ?? 0;
        const rowPinned = pinnedTopRowCount > 0 ? 'top' : null;

        return { rowIndex: 0, rowPinned };
    }

    public getRangeEndRow(cellRange: PartialCellRange): RowPosition {
        if (cellRange.startRow && cellRange.endRow) {
            return _isRowBefore(cellRange.startRow, cellRange.endRow) ? cellRange.endRow : cellRange.startRow;
        }

        const pinnedBottomRowCount = this.beans.pinnedRowModel?.getPinnedBottomRowCount() ?? 0;
        const pinnedBottom = pinnedBottomRowCount > 0;

        if (pinnedBottom) {
            return {
                rowIndex: pinnedBottomRowCount - 1,
                rowPinned: 'bottom',
            };
        }

        return {
            rowIndex: this.rowModel.getRowCount() - 1,
            rowPinned: null,
        };
    }

    public setRangeToCell(cell: CellPosition, appendRange = false): void {
        const { gos } = this;
        if (!_isCellSelectionEnabled(gos)) {
            return;
        }

        const isRowNumbersEnabled = gos.get('rowNumbers');
        const allColumnsRange = isRowNumberCol(cell.column);
        if (isRowNumbersEnabled) {
            this.setSelectionMode(allColumnsRange);
        }

        const columns = this.calculateColumnsBetween(cell.column as AgColumn, cell.column as AgColumn);

        if (!columns) {
            return;
        }

        const suppressMultiRangeSelections = _getSuppressMultiRanges(this.gos);

        // if not appending, then clear previous range selections
        if (suppressMultiRangeSelections || !appendRange || _missing(this.cellRanges)) {
            this.removeAllCellRanges(true);
        }

        const rowForCell: RowPosition = {
            rowIndex: cell.rowIndex,
            rowPinned: cell.rowPinned,
        };

        const cellRange: CellRange = {
            startRow: rowForCell,
            endRow: rowForCell,
            columns,
            startColumn: cell.column,
        };

        this.cellRanges.push(cellRange);

        this.setNewestRangeStartCell(cell);
        this.onDragStop();
        this.dispatchChangedEvent(true, true);
    }

    public extendLatestRangeToCell(cellPosition: CellPosition): void {
        if (this.isEmpty() || !this.newestRangeStartCell) {
            return;
        }

        const cellRange = _last(this.cellRanges);

        this.setSelectionMode(isRowNumberCol(cellPosition.column));
        this.updateRangeEnd(cellRange, cellPosition);
    }

    public updateRangeEnd(cellRange: CellRange, cellPosition: CellPosition, silent = false): void {
        const endColumn = cellPosition.column as AgColumn;
        const colsToAdd = this.calculateColumnsBetween(cellRange.startColumn as AgColumn, endColumn);

        if (!colsToAdd || this.isLastCellOfRange(cellRange, cellPosition)) {
            return;
        }

        cellRange.columns = colsToAdd;
        cellRange.endRow = { rowIndex: cellPosition.rowIndex, rowPinned: cellPosition.rowPinned };

        if (!silent) {
            this.dispatchChangedEvent(true, true, cellRange.id);
        }
    }

    public getRangeEdgeColumns(cellRange: CellRange): { left: AgColumn; right: AgColumn } {
        const allColumns = this.visibleCols.allCols;
        const allIndices = cellRange.columns
            .map((c: AgColumn) => allColumns.indexOf(c))
            .filter((i) => i > -1)
            .sort((a, b) => a - b);

        return {
            left: allColumns[allIndices[0]],
            right: allColumns[_last(allIndices)!],
        };
    }

    // returns true if successful, false if not successful
    public extendLatestRangeInDirection(event: KeyboardEvent): CellPosition | undefined {
        if (this.isEmpty() || !this.newestRangeStartCell) {
            return;
        }

        const key = event.key;
        const ctrlKey = event.ctrlKey || event.metaKey;

        const lastRange = _last(this.cellRanges)!;
        const startCell = this.newestRangeStartCell;
        const firstCol = lastRange.columns[0];
        const lastCol = _last(lastRange.columns)!;

        // find the cell that is at the furthest away corner from the starting cell
        const endCellIndex = lastRange.endRow!.rowIndex;
        const endCellFloating = lastRange.endRow!.rowPinned;
        const endCellColumn = startCell.column === firstCol ? lastCol : firstCol;

        const endCell: CellPosition = { column: endCellColumn, rowIndex: endCellIndex, rowPinned: endCellFloating };
        const newEndCell = this.cellNavigation.getNextCellToFocus(key, endCell, ctrlKey);

        // if user is at end of grid, so no cell to extend to, we return false
        if (!newEndCell) {
            return;
        }

        this.setCellRange({
            rowStartIndex: startCell.rowIndex,
            rowStartPinned: startCell.rowPinned,
            rowEndIndex: newEndCell.rowIndex,
            rowEndPinned: newEndCell.rowPinned,
            columnStart: startCell.column,
            columnEnd: newEndCell.column,
        });

        return newEndCell;
    }

    public setCellRange(params: CellRangeParams): void {
        if (!_isCellSelectionEnabled(this.gos)) {
            return;
        }

        this.removeAllCellRanges(true);
        this.addCellRange(params);
    }

    public setCellRanges(cellRanges: CellRange[]): void {
        if (_areEqual(this.cellRanges, cellRanges)) {
            return;
        }

        if (!this.verifyCellRanges(this.gos)) {
            return;
        }

        this.removeAllCellRanges(true);

        for (const cellRange of cellRanges) {
            if (cellRange.columns && cellRange.startRow) {
                const columns = this.getColumnsFromModel(cellRange.columns as (string | AgColumn)[]);
                if (!columns || columns.length === 0) {
                    continue;
                }

                cellRange.columns = columns;

                const { startRow } = cellRange;

                this.setNewestRangeStartCell({
                    rowIndex: startRow.rowIndex,
                    rowPinned: startRow.rowPinned,
                    column: cellRange.columns[0],
                });
            }

            this.cellRanges.push(cellRange);
        }

        this.dispatchChangedEvent(false, true);
    }

    public clearCellRangeCellValues(params: ClearCellRangeParams): void {
        const { beans, valueSvc, eventSvc } = this;
        const { cellEventSource = 'rangeSvc', dispatchWrapperEvents, wrapperEventSource = 'deleteKey' } = params;

        let { cellRanges } = params;

        if (dispatchWrapperEvents) {
            eventSvc.dispatchEvent({
                type: 'cellSelectionDeleteStart',
                source: wrapperEventSource,
            });
            eventSvc.dispatchEvent({
                type: 'rangeDeleteStart',
                source: wrapperEventSource,
            });
        }

        if (!cellRanges) {
            cellRanges = this.cellRanges;
        }

        cellRanges.forEach((cellRange) => {
            this.forEachRowInRange(cellRange, (rowPosition) => {
                const rowNode = _getRowNode(beans, rowPosition);
                if (!rowNode) {
                    return;
                }
                for (let i = 0; i < cellRange.columns.length; i++) {
                    const column = this.getColumnFromModel(cellRange.columns[i] as AgColumn);
                    if (!column || !column.isCellEditable(rowNode)) {
                        continue;
                    }
                    const emptyValue = valueSvc.getDeleteValue(column, rowNode);
                    rowNode.setDataValue(column, emptyValue, cellEventSource);
                }
            });
        });

        if (dispatchWrapperEvents) {
            eventSvc.dispatchEvent({
                type: 'cellSelectionDeleteEnd',
                source: wrapperEventSource,
            });
            eventSvc.dispatchEvent({
                type: 'rangeDeleteEnd',
                source: wrapperEventSource,
            });
        }
    }

    public createCellRangeFromCellRangeParams(params: CellRangeParams): CellRange | undefined {
        return this.createPartialCellRangeFromRangeParams(params, false) as CellRange | undefined;
    }

    // Range service can't normally support a range without columns, but charts can
    public createPartialCellRangeFromRangeParams(
        params: CellRangeParams,
        allowEmptyColumns: boolean
    ): PartialCellRange | undefined {
        const {
            columns: paramColumns,
            columnStart,
            columnEnd,
            rowStartIndex,
            rowStartPinned,
            rowEndIndex,
            rowEndPinned,
        } = params;
        const columnInfo = this.getColumnsFromParams(
            paramColumns as (string | AgColumn)[],
            columnStart as string | AgColumn,
            columnEnd as string | AgColumn
        );

        if (!columnInfo || (!allowEmptyColumns && columnInfo.columns.length === 0)) {
            return;
        }

        const { columns, startsOnTheRight } = columnInfo;

        const startRow = this.createRowPosition(rowStartIndex, rowStartPinned);
        const endRow = this.createRowPosition(rowEndIndex, rowEndPinned);

        return {
            startRow,
            endRow,
            columns,
            startColumn:
                this.getColumnFromModel(columnStart as AgColumn) ?? (startsOnTheRight ? _last(columns) : columns[0]),
        };
    }

    public addCellRange(params: CellRangeParams): void {
        const gos = this.gos;
        if (!_isCellSelectionEnabled(gos) || !this.verifyCellRanges(gos)) {
            return;
        }

        // when creating a new range via API we should reset the selection mode
        this.setSelectionMode(false);
        const newRange = this.createCellRangeFromCellRangeParams(params);

        if (newRange) {
            if (newRange.startRow) {
                this.setNewestRangeStartCell({
                    rowIndex: newRange.startRow.rowIndex,
                    rowPinned: newRange.startRow.rowPinned,
                    column: newRange.startColumn,
                });
            }

            this.cellRanges.push(newRange);
            this.dispatchChangedEvent(false, true, newRange.id);
        }
    }

    public getCellRanges(): CellRange[] {
        return this.cellRanges;
    }

    public isEmpty(): boolean {
        return this.cellRanges.length === 0;
    }

    public isMoreThanOneCell(): boolean {
        const len = this.cellRanges.length;

        if (len === 0) {
            return false;
        }
        if (len > 1) {
            return true; // Assumes a cell range must contain at least one cell
        }

        // only one range, return true if range has more than one
        const range = this.cellRanges[0];
        const startRow = this.getRangeStartRow(range);
        const endRow = this.getRangeEndRow(range);

        return (
            startRow.rowPinned !== endRow.rowPinned ||
            startRow.rowIndex !== endRow.rowIndex ||
            range.columns.length !== 1
        );
    }

    public areAllRangesAbleToMerge(): boolean {
        const rowToColumnMap: Map<string, string[]> = new Map();
        const len = this.cellRanges.length;

        if (len <= 1) return true;

        this.cellRanges.forEach((range) => {
            this.forEachRowInRange(range, (row) => {
                const rowName = `${row.rowPinned || 'normal'}_${row.rowIndex}`;
                const columns = rowToColumnMap.get(rowName);
                const currentRangeColIds = range.columns.map((col) => col.getId());
                if (columns) {
                    const filteredColumns = currentRangeColIds.filter((col) => columns.indexOf(col) === -1);
                    columns.push(...filteredColumns);
                } else {
                    rowToColumnMap.set(rowName, currentRangeColIds);
                }
            });
        });

        let columnsString: string | undefined;

        for (const val of rowToColumnMap.values()) {
            const currentValString = val.sort().join();
            if (columnsString === undefined) {
                columnsString = currentValString;
                continue;
            }
            if (columnsString !== currentValString) {
                return false;
            }
        }

        return true;
    }

    public removeAllCellRanges(silent?: boolean): void {
        if (this.isEmpty()) {
            return;
        }

        this.onDragStop();
        this.cellRanges.length = 0;

        if (!silent) {
            this.dispatchChangedEvent(false, true);
        }
    }

    public isCellInAnyRange(cell: CellPosition): boolean {
        return this.getCellRangeCount(cell) > 0;
    }

    public isCellInSpecificRange(cell: CellPosition, range: CellRange): boolean {
        const columnInRange = range.columns !== null && range.columns.includes(cell.column);
        const rowInRange = this.isRowInRange(cell.rowIndex, cell.rowPinned, range);

        return columnInRange && rowInRange;
    }

    public isBottomRightCell(cellRange: CellRange, cell: CellPosition): boolean {
        const allColumns = this.visibleCols.allCols;
        const allPositions = cellRange.columns.map((c: AgColumn) => allColumns.indexOf(c)).sort((a, b) => a - b);
        const { startRow, endRow } = cellRange;
        const lastRow = _isRowBefore(startRow!, endRow!) ? endRow : startRow;

        const isRightColumn = allColumns.indexOf(cell.column as AgColumn) === _last(allPositions);
        const isLastRow =
            cell.rowIndex === lastRow!.rowIndex && _makeNull(cell.rowPinned) === _makeNull(lastRow!.rowPinned);

        return isRightColumn && isLastRow;
    }

    // returns the number of ranges this cell is in
    public getCellRangeCount(cell: CellPosition): number {
        if (this.isEmpty()) {
            return 0;
        }

        return this.cellRanges.filter((cellRange) => this.isCellInSpecificRange(cell, cellRange)).length;
    }

    public isRowInRange(rowIndex: number, rowPinned: RowPinnedType, cellRange: CellRange): boolean {
        const firstRow = this.getRangeStartRow(cellRange);
        const lastRow = this.getRangeEndRow(cellRange);
        const thisRow: RowPosition = { rowIndex, rowPinned: rowPinned || null };

        // compare rowPinned with == instead of === because it can be `null` or `undefined`
        const equalsFirstRow = thisRow.rowIndex === firstRow.rowIndex && thisRow.rowPinned == firstRow.rowPinned;
        const equalsLastRow = thisRow.rowIndex === lastRow.rowIndex && thisRow.rowPinned == lastRow.rowPinned;

        if (equalsFirstRow || equalsLastRow) {
            return true;
        }

        const afterFirstRow = !_isRowBefore(thisRow, firstRow);
        const beforeLastRow = _isRowBefore(thisRow, lastRow);

        return afterFirstRow && beforeLastRow;
    }

    public intersectLastRange(fromMouseClick?: boolean) {
        // when ranges are created due to a mouse click without drag (happens in cellMouseListener)
        // this method will be called with `fromMouseClick=true`.
        if (fromMouseClick && this.dragging) {
            return;
        }
        if (_getSuppressMultiRanges(this.gos)) {
            return;
        }
        if (this.isEmpty()) {
            return;
        }
        const lastRange = _last(this.cellRanges);
        const intersectionStartRow = this.getRangeStartRow(lastRange);
        const intersectionEndRow = this.getRangeEndRow(lastRange);

        const newRanges: CellRange[] = [];

        this.cellRanges.slice(0, -1).forEach((range) => {
            const startRow = this.getRangeStartRow(range);
            const endRow = this.getRangeEndRow(range);
            const cols = range.columns;
            const intersectCols = cols.filter((col) => lastRange.columns.indexOf(col) === -1);
            if (intersectCols.length === cols.length) {
                // No overlapping columns, retain previous range
                newRanges.push(range);
                return;
            }
            if (_isRowBefore(intersectionEndRow, startRow) || _isRowBefore(endRow, intersectionStartRow)) {
                // No overlapping rows, retain previous range
                newRanges.push(range);
                return;
            }
            const rangeCountBefore = newRanges.length;
            // Top
            if (_isRowBefore(startRow, intersectionStartRow)) {
                const top: CellRange = {
                    columns: [...cols],
                    startColumn: lastRange.startColumn,
                    startRow: { ...startRow },
                    endRow: _getRowAbove(this.beans, intersectionStartRow)!,
                };
                newRanges.push(top);
            }
            // Left & Right (not contiguous with columns)
            if (intersectCols.length > 0) {
                const middle: CellRange = {
                    columns: intersectCols,
                    startColumn: intersectCols.includes(lastRange.startColumn)
                        ? lastRange.startColumn
                        : intersectCols[0],
                    startRow: this.rowMax([{ ...intersectionStartRow }, { ...startRow }]),
                    endRow: this.rowMin([{ ...intersectionEndRow }, { ...endRow }]),
                };
                newRanges.push(middle);
            }
            // Bottom
            if (_isRowBefore(intersectionEndRow, endRow)) {
                newRanges.push({
                    columns: [...cols],
                    startColumn: lastRange.startColumn,
                    startRow: _getRowBelow(this.beans, intersectionEndRow)!,
                    endRow: { ...endRow },
                });
            }
            if (newRanges.length - rangeCountBefore === 1) {
                // Only one range result from the intersection.
                // Copy the source range's id, since essentially we just reduced it's size
                newRanges[newRanges.length - 1].id = range.id;
            }
        });
        this.cellRanges = newRanges;

        // when this is called because of a clickEvent and the ranges were changed
        // we need to force a dragEnd event to update the UI.
        if (fromMouseClick) {
            this.dispatchChangedEvent(false, true);
        }
    }

    public createRangeHighlightFeature(
        compBean: BeanStub,
        column: AgColumn<any> | AgColumnGroup,
        headerComp: IHeaderCellComp
    ): void {
        compBean.createManagedBean(new RangeHeaderHighlightFeature(column, headerComp));
    }

    private setSelectionMode(allColumns: boolean) {
        this.selectionMode = allColumns ? SelectionMode.ALL_COLUMNS : SelectionMode.NORMAL;
    }

    private refreshRangeStart(cellRange: CellRange) {
        const { startColumn, columns } = cellRange;

        const moveColInCellRange = (colToMove: AgColumn, moveToFront: boolean) => {
            const otherCols = cellRange.columns.filter((col) => col !== colToMove);

            if (colToMove) {
                cellRange.startColumn = colToMove;
                cellRange.columns = moveToFront ? [colToMove, ...otherCols] : [...otherCols, colToMove];
            } else {
                cellRange.columns = otherCols;
            }
        };

        const { left, right } = this.getRangeEdgeColumns(cellRange);
        const shouldMoveLeftCol = startColumn === columns[0] && startColumn !== left;

        if (shouldMoveLeftCol) {
            moveColInCellRange(left, true);
            return;
        }

        const shouldMoveRightCol = startColumn === _last(columns) && startColumn === right;

        if (shouldMoveRightCol) {
            moveColInCellRange(right, false);
            return;
        }
    }

    private setNewestRangeStartCell(position: CellPosition) {
        this.newestRangeStartCell = position;
    }

    private getColumnsFromParams(
        columns?: (string | AgColumn)[],
        columnA?: string | AgColumn,
        columnB?: string | AgColumn
    ): { columns: AgColumn[]; startsOnTheRight: boolean } | undefined {
        const noColsInfo = !columns && !columnA && !columnB;
        let processedColumns: AgColumn[] | undefined;
        let startsOnTheRight = false;

        if (noColsInfo || columns) {
            processedColumns = this.getColumnsFromModel(noColsInfo ? undefined : columns);
        } else if (columnA && columnB) {
            processedColumns = this.calculateColumnsBetween(columnA, columnB);

            if (processedColumns && processedColumns.length) {
                startsOnTheRight = processedColumns[0] !== this.getColumnFromModel(columnA);
            }
        }

        return processedColumns
            ? {
                  columns: processedColumns,
                  startsOnTheRight,
              }
            : undefined;
    }

    private createRowPosition(rowIndex: number | null, rowPinned?: RowPinnedType): RowPosition | undefined {
        return rowIndex != null ? { rowIndex, rowPinned } : undefined;
    }

    private verifyCellRanges(gos: GridOptionsService): boolean {
        const invalid = _isUsingNewCellSelectionAPI(gos) && _getSuppressMultiRanges(gos) && this.cellRanges.length > 1;
        if (invalid) {
            _warn(93);
        }

        return !invalid;
    }

    private forEachRowInRange(cellRange: CellRange, callback: (row: RowPosition) => void) {
        const topRow = this.getRangeStartRow(cellRange);
        const bottomRow = this.getRangeEndRow(cellRange);
        let currentRow: RowPosition | null = topRow;

        while (currentRow) {
            callback(currentRow);

            if (_isSameRow(currentRow, bottomRow)) {
                break;
            }
            currentRow = _getRowBelow(this.beans, currentRow);
        }
    }

    // as the user is dragging outside of the panel, the div starts to scroll, which in turn
    // means we are selection more (or less) cells, but the mouse isn't moving, so we recalculate
    // the selection my mimicking a new mouse event
    private onBodyScroll(): void {
        if (this.dragging && this.lastMouseEvent) {
            this.onDragging(this.lastMouseEvent);
        }
    }

    private isLastCellOfRange(cellRange: CellRange, cell: CellPosition): boolean {
        const { startRow, endRow } = cellRange;
        const lastRow = _isRowBefore(startRow!, endRow!) ? endRow : startRow;
        const isLastRow = cell.rowIndex === lastRow!.rowIndex && cell.rowPinned === lastRow!.rowPinned;
        const rangeFirstIndexColumn = cellRange.columns[0];
        const rangeLastIndexColumn = _last(cellRange.columns);
        const lastRangeColumn =
            cellRange.startColumn === rangeFirstIndexColumn ? rangeLastIndexColumn : rangeFirstIndexColumn;
        const isLastColumn = cell.column === lastRangeColumn;

        return isLastColumn && isLastRow;
    }

    private rowMax(rows: RowPosition[]): RowPosition | undefined {
        let max: RowPosition | undefined;
        rows.forEach((row) => {
            if (max === undefined || _isRowBefore(max, row)) {
                max = row;
            }
        });
        return max;
    }

    private rowMin(rows: RowPosition[]): RowPosition | undefined {
        let min: RowPosition | undefined;
        rows.forEach((row) => {
            if (min === undefined || _isRowBefore(row, min)) {
                min = row;
            }
        });
        return min;
    }

    private updateValuesOnMove(eventTarget: EventTarget | null) {
        const cellCtrl = _getCellCtrlForEventTarget(this.gos, eventTarget);
        const cell = cellCtrl?.cellPosition;

        this.cellHasChanged = false;

        if (!cell || (this.lastCellHovered && _areCellsEqual(cell, this.lastCellHovered))) {
            return;
        }

        if (cellCtrl?.editing) {
            this.dragSvc.cancelDrag(eventTarget as HTMLElement);
            return;
        }

        if (this.lastCellHovered) {
            this.cellHasChanged = true;
        }

        this.lastCellHovered = cell;
    }

    private shouldSkipCurrentColumn(currentColumn: AgColumn): boolean {
        return isRowNumberCol(currentColumn);
    }

    private dispatchChangedEvent(started: boolean, finished: boolean, id?: string): void {
        this.eventSvc.dispatchEvent({
            type: 'cellSelectionChanged',
            started,
            finished,
            id,
        });
        this.eventSvc.dispatchEvent({
            type: 'rangeSelectionChanged',
            started,
            finished,
            id,
        });
    }

    private getColumnFromModel(col: string | AgColumn): AgColumn | null {
        return typeof col === 'string' ? this.colModel.getCol(col) : col;
    }

    private getColumnsFromModel(cols?: (string | AgColumn)[]): AgColumn[] | undefined {
        const { gos, visibleCols } = this;
        const isRowHeaderActive = gos.get('rowNumbers');

        if (!cols || this.selectionMode === SelectionMode.ALL_COLUMNS) {
            cols = visibleCols.allCols;
        }

        const columns: AgColumn[] = [];

        for (const col of cols) {
            const column = this.getColumnFromModel(col);
            if (!column || (isRowHeaderActive && this.shouldSkipCurrentColumn(column))) {
                continue;
            }
            columns.push(column);
        }

        return columns.length ? columns : undefined;
    }

    private calculateColumnsBetween(columnA: string | AgColumn, columnB: string | AgColumn): AgColumn[] | undefined {
        const allColumns = this.visibleCols.allCols;

        const fromColumn = this.getColumnFromModel(columnA) as AgColumn;
        const toColumn = this.getColumnFromModel(columnB) as AgColumn;

        const isSameColumn = fromColumn === toColumn;
        const fromIndex = allColumns.indexOf(fromColumn);

        if (fromIndex < 0) {
            _warn(178, { colId: fromColumn.getId() });
            return;
        }

        const toIndex = isSameColumn ? fromIndex : allColumns.indexOf(toColumn);

        if (toIndex < 0) {
            _warn(178, { colId: toColumn.getId() });
            return;
        }

        if (isSameColumn || this.selectionMode === SelectionMode.ALL_COLUMNS) {
            return this.getColumnsFromModel([fromColumn]);
        }

        const firstIndex = Math.min(fromIndex, toIndex);
        const lastIndex = firstIndex === fromIndex ? toIndex : fromIndex;
        const columns: AgColumn[] = [];

        for (let i = firstIndex; i <= lastIndex; i++) {
            columns.push(allColumns[i]);
        }

        return this.getColumnsFromModel(columns);
    }

    public createDragListenerFeature(eContainer: HTMLElement): BeanStub {
        return new DragListenerFeature(eContainer);
    }

    public createCellRangeFeature(beans: BeanCollection, ctrl: CellCtrl): ICellRangeFeature {
        return new CellRangeFeature(beans, ctrl);
    }
}
