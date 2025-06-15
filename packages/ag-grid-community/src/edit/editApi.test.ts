import type { BeanCollection } from '../context/context';
import type { EditingCellPosition } from '../interfaces/iCellEditor';
import type { CellPosition } from '../interfaces/iCellPosition';
import type { Column } from '../interfaces/iColumn';
import type { EditMap, EditRow, IEditModelService } from '../interfaces/iEditModelService';
import type { IEditService } from '../interfaces/iEditService';
import type { IRowNode } from '../interfaces/iRowNode';
import type { CellCtrl } from '../rendering/cell/cellCtrl';
import type { RowCtrl } from '../rendering/row/rowCtrl';
import type { RowRenderer } from '../rendering/rowRenderer';
import type { ValueService } from '../valueService/valueService';
import { getEditingCells, setEditingCells } from './editApi';
import { UNEDITED } from './utils/editors';

describe('Edit API', () => {
    const rowNode1 = { rowIndex: 0, rowPinned: undefined } as unknown as IRowNode;
    const rowNode2 = { rowIndex: 1, rowPinned: undefined } as unknown as IRowNode;
    const column1 = { getColId: () => 'col1' } as unknown as Column;
    const column2 = { getColId: () => 'col2' } as unknown as Column;
    const cellCtrl1 = { rowNode: rowNode1 } as unknown as CellCtrl;
    const cellCtrl2 = { rowNode: rowNode2 } as unknown as CellCtrl;

    const getCellCtrl = (column: Column) => {
        if (column.getColId() === 'col1') {
            return cellCtrl1;
        } else if (column.getColId() === 'col2') {
            return cellCtrl2;
        }
        return undefined;
    };

    const rowCtrl1 = {
        rowNode: rowNode1,
        getCellCtrl,
    } as unknown as RowCtrl;
    const rowCtrl2 = {
        rowNode: rowNode2,
        getCellCtrl,
    } as unknown as RowCtrl;

    let editMap: EditMap | undefined;
    let beans: BeanCollection;

    beforeEach(() => {
        editMap = new Map();
        beans = {
            editSvc: {
                setBatchEditing: jest.fn(),
                isBatchEditing: jest.fn().mockReturnValue(false),
                setEditMap: jest.fn((em) => beans.editModelSvc!.setEditMap(em)),
                getEditMap: jest.fn(() => beans.editModelSvc!.getEditMap()),
            } as unknown as IEditService,
            editModelSvc: {
                getEditMap: jest.fn(() => editMap),
                setEditMap: jest.fn((em) => (editMap = em)),
            } as unknown as IEditModelService,
            colModel: {
                getCol: jest.fn((col: Column | string) => {
                    const colId = typeof col === 'string' ? col : col.getColId();
                    if (colId === 'col1') {
                        return column1;
                    } else if (colId === 'col2') {
                        return column2;
                    }
                    return undefined;
                }),
            },
            rowRenderer: {
                getRowByPosition: jest.fn((position: CellPosition) => {
                    if (position.rowIndex === 0) {
                        return rowCtrl1;
                    } else if (position.rowIndex === 1) {
                        return rowCtrl2;
                    }
                    return undefined;
                }),
            } as unknown as RowRenderer,
            valueSvc: {
                getValue: jest.fn((col: Column, rowNode: IRowNode, _ignoreAggData: boolean, _source: string) => {
                    if (col.getColId() === 'col1' && rowNode.rowIndex === 0) {
                        return 'old1';
                    } else if (col.getColId() === 'col2' && rowNode.rowIndex === 0) {
                        return 'old2';
                    } else if (col.getColId() === 'col1' && rowNode.rowIndex === 1) {
                        return 'old1';
                    } else if (col.getColId() === 'col2' && rowNode.rowIndex === 1) {
                        return 'old2';
                    }
                    return undefined;
                }),
            } as unknown as ValueService,
        } as unknown as BeanCollection;
    });

    afterEach(() => {
        jest.clearAllMocks();
        editMap = undefined;
    });

    describe('getEditingCells', () => {
        test('returns empty array when no edits', () => {
            const result = getEditingCells(beans, {});
            expect(result).toEqual([]);
        });
        test('returns editing cells with pending edits', () => {
            editMap!.set(
                rowNode1,
                new Map([
                    [column1, { newValue: 'new1', oldValue: 'old1', state: 'editing' }],
                    [column2, { newValue: 'new2', oldValue: 'old2', state: 'changed' }],
                ])
            );

            const result = getEditingCells(beans, { includePending: true });
            expect(result).toEqual([
                {
                    newValue: 'new1',
                    oldValue: 'old1',
                    state: 'editing',
                    column: column1,
                    colId: 'col1',
                    colKey: 'col1',
                    rowIndex: 0,
                    rowPinned: undefined,
                },
                {
                    newValue: 'new2',
                    oldValue: 'old2',
                    state: 'changed',
                    column: column2,
                    colId: 'col2',
                    colKey: 'col2',
                    rowIndex: 0,
                    rowPinned: undefined,
                },
            ]);
        });
        test('returns only changed cells when includePending is false', () => {
            editMap!.set(
                rowNode1,
                new Map([
                    [column1, { newValue: 'new1', oldValue: 'old1', state: 'editing' }],
                    [column2, { newValue: 'new2', oldValue: 'old2', state: 'changed' }],
                ])
            );

            const result = getEditingCells(beans, { includePending: false });
            expect(result).toEqual([
                {
                    newValue: 'new2',
                    oldValue: 'old2',
                    state: 'changed',
                    column: column2,
                    colId: 'col2',
                    colKey: 'col2',
                    rowIndex: 0,
                    rowPinned: undefined,
                },
            ]);
        });
        test('handles multiple rows and columns', () => {
            editMap!.set(
                rowNode1,
                new Map([
                    [column1, { newValue: 'new1', oldValue: 'old1', state: 'editing' }],
                    [column2, { newValue: 'new2', oldValue: 'old2', state: 'changed' }],
                ])
            );
            editMap!.set(
                rowNode2,
                new Map([
                    [column1, { newValue: 'new3', oldValue: 'old3', state: 'editing' }],
                    [column2, { newValue: 'new4', oldValue: 'old4', state: 'changed' }],
                ])
            );

            const result = getEditingCells(beans, { includePending: true });
            expect(result).toEqual([
                {
                    newValue: 'new1',
                    oldValue: 'old1',
                    state: 'editing',
                    column: column1,
                    colId: 'col1',
                    colKey: 'col1',
                    rowIndex: 0,
                    rowPinned: undefined,
                },
                {
                    newValue: 'new2',
                    oldValue: 'old2',
                    state: 'changed',
                    column: column2,
                    colId: 'col2',
                    colKey: 'col2',
                    rowIndex: 0,
                    rowPinned: undefined,
                },
                {
                    newValue: 'new3',
                    oldValue: 'old3',
                    state: 'editing',
                    column: column1,
                    colId: 'col1',
                    colKey: 'col1',
                    rowIndex: 1,
                    rowPinned: undefined,
                },
                {
                    newValue: 'new4',
                    oldValue: 'old4',
                    state: 'changed',
                    column: column2,
                    colId: 'col2',
                    colKey: 'col2',
                    rowIndex: 1,
                    rowPinned: undefined,
                },
            ]);
        });
        test('returns empty array when no edits match criteria', () => {
            editMap!.set(rowNode1, new Map([[column1, { newValue: 'new1', oldValue: 'old1', state: 'editing' }]]));

            const result = getEditingCells(beans, { includePending: false });
            expect(result).toEqual([]);
        });
        test('handles edits with UNEDITED state', () => {
            editMap!.set(
                rowNode1,
                new Map([
                    [column1, { newValue: UNEDITED, oldValue: 'old1', state: 'editing' }],
                    [column2, { newValue: 'new2', oldValue: 'old2', state: 'changed' }],
                ])
            );

            const result = getEditingCells(beans, { includePending: true });
            expect(result).toEqual([
                {
                    newValue: 'new2',
                    oldValue: 'old2',
                    state: 'changed',
                    column: column2,
                    colId: 'col2',
                    colKey: 'col2',
                    rowIndex: 0,
                    rowPinned: undefined,
                },
            ]);
        });
    });

    describe('setEditingCells', () => {
        test('does not set edits when not in batch editing mode', () => {
            beans.editSvc!.isBatchEditing = jest.fn().mockReturnValue(false);
            const cells = [
                { colId: 'col1', rowIndex: 0, rowPinned: undefined, newValue: 'new1', state: 'editing' },
            ] as EditingCellPosition[];
            setEditingCells(beans, cells);
            expect(beans.editModelSvc!.setEditMap).not.toHaveBeenCalled();
            expect(getEditingCells(beans)).toEqual([]);
        });

        test('sets edits in batch editing mode, using colId', () => {
            beans.editSvc!.isBatchEditing = jest.fn().mockReturnValue(true);
            const cells = [
                { colId: 'col1', rowIndex: 0, rowPinned: undefined, newValue: 'new1', state: 'editing' },
                { colId: 'col2', rowIndex: 1, rowPinned: undefined, newValue: 'new2', state: 'changed' },
            ] as EditingCellPosition[];
            setEditingCells(beans, cells);
            expect(beans.editModelSvc!.setEditMap).toHaveBeenCalledWith(
                new Map([
                    [
                        { rowIndex: 0, rowPinned: undefined },
                        new Map([[column1, { newValue: 'new1', oldValue: 'old1', state: 'editing' }]]),
                    ],
                    [
                        { rowIndex: 1, rowPinned: undefined },
                        new Map([[column2, { newValue: 'new2', oldValue: 'old2', state: 'changed' }]]),
                    ],
                ]) as any
            );
        });

        test('sets edits in batch editing mode, using colKey:string', () => {
            beans.editSvc!.isBatchEditing = jest.fn().mockReturnValue(true);
            const cells = [
                { colKey: 'col1', rowIndex: 0, rowPinned: undefined, newValue: 'new1', state: 'editing' },
                { colKey: 'col2', rowIndex: 1, rowPinned: undefined, newValue: 'new2', state: 'changed' },
            ] as EditingCellPosition[];
            setEditingCells(beans, cells);
            expect(beans.editModelSvc!.setEditMap).toHaveBeenCalledWith(
                new Map([
                    [
                        { rowIndex: 0, rowPinned: undefined },
                        new Map([[column1, { newValue: 'new1', oldValue: 'old1', state: 'editing' }]]),
                    ],
                    [
                        { rowIndex: 1, rowPinned: undefined },
                        new Map([[column2, { newValue: 'new2', oldValue: 'old2', state: 'changed' }]]),
                    ],
                ])
            );
        });

        test('sets edits in batch editing mode, using colKey:column', () => {
            beans.editSvc!.isBatchEditing = jest.fn().mockReturnValue(true);
            const cells = [
                { colKey: column1, rowIndex: 0, rowPinned: undefined, newValue: 'new1', state: 'editing' },
                { colKey: column2, rowIndex: 1, rowPinned: undefined, newValue: 'new2', state: 'changed' },
            ] as EditingCellPosition[];
            setEditingCells(beans, cells);
            expect(beans.editModelSvc!.setEditMap).toHaveBeenCalledWith(
                new Map([
                    [
                        { rowIndex: 0, rowPinned: undefined },
                        new Map([[column1, { newValue: 'new1', oldValue: 'old1', state: 'editing' }]]),
                    ],
                    [
                        { rowIndex: 1, rowPinned: undefined },
                        new Map([[column2, { newValue: 'new2', oldValue: 'old2', state: 'changed' }]]),
                    ],
                ])
            );
        });

        test('sets edits in batch editing mode, using column', () => {
            beans.editSvc!.isBatchEditing = jest.fn().mockReturnValue(true);
            const cells = [
                { column: column1, rowIndex: 0, rowPinned: undefined, newValue: 'new1', state: 'editing' },
                { column: column2, rowIndex: 1, rowPinned: undefined, newValue: 'new2', state: 'changed' },
            ] as EditingCellPosition[];
            setEditingCells(beans, cells);
            expect(beans.editModelSvc!.setEditMap).toHaveBeenCalledWith(
                new Map([
                    [
                        { rowIndex: 0, rowPinned: undefined },
                        new Map([[column1, { newValue: 'new1', oldValue: 'old1', state: 'editing' }]]),
                    ],
                    [
                        { rowIndex: 1, rowPinned: undefined },
                        new Map([[column2, { newValue: 'new2', oldValue: 'old2', state: 'changed' }]]),
                    ],
                ])
            );
        });

        test('sets edits in batch editing mode, using all three column options', () => {
            beans.editSvc!.isBatchEditing = jest.fn().mockReturnValue(true);
            const cells = [
                {
                    colId: 'col1',
                    colKey: 'colA',
                    column: {},
                    rowIndex: 0,
                    rowPinned: undefined,
                    newValue: 'new1',
                    state: 'editing',
                },
                {
                    colId: 'col2',
                    colKey: 'colB',
                    column: {},
                    rowIndex: 1,
                    rowPinned: undefined,
                    newValue: 'new2',
                    state: 'changed',
                },
            ] as EditingCellPosition[];
            setEditingCells(beans, cells);
            expect(beans.editModelSvc!.setEditMap).toHaveBeenCalledWith(
                new Map([
                    [
                        { rowIndex: 0, rowPinned: undefined },
                        new Map([[column1, { newValue: 'new1', oldValue: 'old1', state: 'editing' }]]),
                    ],
                    [
                        { rowIndex: 1, rowPinned: undefined },
                        new Map([[column2, { newValue: 'new2', oldValue: 'old2', state: 'changed' }]]),
                    ],
                ])
            );
        });

        test('updates existing edits when update flag is true (append)', () => {
            beans.editSvc!.isBatchEditing = jest.fn().mockReturnValue(true);
            editMap!.set(rowNode1, new Map([[column1, { newValue: 'old1', oldValue: UNEDITED, state: 'editing' }]]));
            const cells = [
                { colId: 'col2', rowIndex: 1, rowPinned: undefined, newValue: 'new2', state: 'changed' },
            ] as EditingCellPosition[];
            setEditingCells(beans, cells, { update: true });
            expect(beans.editModelSvc!.getEditMap()).toEqual(
                new Map([
                    [
                        rowNode1,
                        new Map([[column1, { newValue: 'old1', oldValue: UNEDITED, state: 'editing' }]]) as EditRow,
                    ],
                    [
                        rowNode2,
                        new Map([[column2, { newValue: 'new2', oldValue: 'old2', state: 'changed' }]]) as EditRow,
                    ],
                ])
            );
        });

        test('updates existing edits when update flag is true (replace)', () => {
            beans.editSvc!.isBatchEditing = jest.fn().mockReturnValue(true);
            editMap!.set(rowNode1, new Map([[column1, { newValue: 'old1', oldValue: UNEDITED, state: 'editing' }]]));
            const cells = [
                { colId: 'col1', rowIndex: 0, rowPinned: undefined, newValue: 'new1', state: 'editing' },
            ] as EditingCellPosition[];
            setEditingCells(beans, cells, { update: true });
            expect(beans.editModelSvc!.getEditMap()).toEqual(
                new Map([
                    [
                        rowNode1,
                        new Map([[column1, { newValue: 'new1', oldValue: 'old1', state: 'editing' }]]) as EditRow,
                    ],
                ])
            );
        });
    });
});
