import type { MockInstance } from 'vitest';

import { ClientSideRowModelModule } from 'ag-grid-community';
import type { GridOptions } from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';

import { GridRows, TestGridsManager, asyncSetTimeout, getRowsSnapshot } from '../../test-utils';
import type { GridRowsOptions, RowSnapshot } from '../../test-utils';
import { simpleHierarchyRowsSnapshot } from './simpleHierarchyRowsSnapshot';

const getDataPath = (data: any) => data.orgHierarchy;

describe('ag-grid tree data', () => {
    const gridsManager = new TestGridsManager({
        modules: [ClientSideRowModelModule, TreeDataModule],
    });

    let consoleWarnSpy: MockInstance;

    function hasLoadingOverlay() {
        return !!document.querySelector('.ag-overlay-loading-center');
    }

    function hasNoRowsOverlay() {
        return !!document.querySelector('.ag-overlay-no-rows-center');
    }

    beforeEach(() => {
        gridsManager.reset();
    });

    afterEach(() => {
        gridsManager.reset();
        consoleWarnSpy?.mockRestore();
    });

    test('ag-grid tree data loading and no-show overlay', async () => {
        const rowData = [
            { orgHierarchy: ['A'] },
            { orgHierarchy: ['A', 'B'] },
            { orgHierarchy: ['C', 'D'] },
            { orgHierarchy: ['E', 'F', 'G', 'H'] },
        ];

        const gridOptions: GridOptions = {
            columnDefs: [
                {
                    field: 'groupType',
                    valueGetter: (params) => (params.data ? 'Provided' : 'Filler'),
                },
            ],
            autoGroupColumnDef: {
                headerName: 'Organisation Hierarchy',
                cellRendererParams: { suppressCount: true },
            },
            treeData: true,
            animateRows: false,
            groupDefaultExpanded: -1,
            getDataPath,
        };

        const api = gridsManager.createGrid('myGrid', gridOptions);

        expect(hasLoadingOverlay()).toBe(true);
        expect(hasNoRowsOverlay()).toBe(false);

        api.setGridOption('rowData', []);

        expect(hasLoadingOverlay()).toBe(false);
        expect(hasNoRowsOverlay()).toBe(true);

        api.setGridOption('rowData', rowData);

        expect(hasLoadingOverlay()).toBe(false);
        expect(hasNoRowsOverlay()).toBe(false);

        api.setGridOption('rowData', []);

        await asyncSetTimeout(10);

        expect(hasLoadingOverlay()).toBe(false);
        expect(hasNoRowsOverlay()).toBe(true);
    });

    test('ag-grid tree data', async () => {
        const rowData = [
            { orgHierarchy: ['A'] },
            { orgHierarchy: ['A', 'B'] },
            { orgHierarchy: ['C', 'D'] },
            { orgHierarchy: ['E', 'F', 'G', 'H'] },
        ];

        const gridOptions: GridOptions = {
            columnDefs: [
                {
                    field: 'groupType',
                    valueGetter: (params) => (params.data ? 'Provided' : 'Filler'),
                },
            ],
            autoGroupColumnDef: {
                headerName: 'Organisation Hierarchy',
                cellRendererParams: { suppressCount: true },
            },
            treeData: true,
            animateRows: false,
            groupDefaultExpanded: -1,
            rowData,
            getDataPath,
        };

        const api = gridsManager.createGrid('myGrid', gridOptions);

        const gridRowsOptions: GridRowsOptions = {
            checkDom: true,
        };

        const gridRows = new GridRows(api, 'data', gridRowsOptions);
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ A GROUP id:0
            │ └── B LEAF id:1
            ├─┬ C filler id:row-group-0-C
            │ └── D LEAF id:2
            └─┬ E filler id:row-group-0-E
            · └─┬ F filler id:row-group-0-E-1-F
            · · └─┬ G filler id:row-group-0-E-1-F-2-G
            · · · └── H LEAF id:3
        `);

        const rows = gridRows.rowNodes;
        expect(rows[0].data).toEqual(rowData[0]);
        expect(rows[1].data).toEqual(rowData[1]);
        expect(rows[2].data).toEqual(undefined);
        expect(rows[3].data).toEqual(rowData[2]);
        expect(rows[4].data).toEqual(undefined);
        expect(rows[5].data).toEqual(undefined);
        expect(rows[6].data).toEqual(undefined);
        expect(rows[7].data).toEqual(rowData[3]);

        const rowsSnapshot = getRowsSnapshot(rows);
        expect(rowsSnapshot).toMatchObject(simpleHierarchyRowsSnapshot());
    });

    test('ag-grid tree data with inverted order', async () => {
        const rowData = [
            { orgHierarchy: ['A', 'B'] },
            { orgHierarchy: ['C', 'D', 'E'] },
            { orgHierarchy: ['A'] },
            { orgHierarchy: ['C', 'D'] },
        ];

        const gridOptions: GridOptions = {
            columnDefs: [
                {
                    field: 'groupType',
                    valueGetter: (params) => (params.data ? 'Provided' : 'Filler'),
                },
            ],
            autoGroupColumnDef: {
                headerName: 'Organisation Hierarchy',
                cellRendererParams: { suppressCount: true },
            },
            treeData: true,
            animateRows: false,
            groupDefaultExpanded: -1,
            rowData,
            getDataPath,
        };

        const api = gridsManager.createGrid('myGrid', gridOptions);

        const gridRowsOptions: GridRowsOptions = {
            checkDom: true,
        };

        const gridRows = new GridRows(api, 'data', gridRowsOptions);
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ A GROUP id:2
            │ └── B LEAF id:0
            └─┬ C filler id:row-group-0-C
            · └─┬ D GROUP id:3
            · · └── E LEAF id:1
        `);

        const rows = gridRows.rowNodes;
        const rowsSnapshot = getRowsSnapshot(rows);

        expect(rows[0].data).toEqual(rowData[2]);
        expect(rows[1].data).toEqual(rowData[0]);
        expect(rows[2].data).toEqual(undefined);
        expect(rows[3].data).toEqual(rowData[3]);
        expect(rows[4].data).toEqual(rowData[1]);

        const expectedSnapshot: RowSnapshot[] = hierarchyWithInvertedOrderRowSnapshot();

        expect(rowsSnapshot).toMatchObject(expectedSnapshot);
    });

    test('ag-grid override tree data is insensitive to updateGridOptions object order', async () => {
        // see https://ag-grid.atlassian.net/browse/AG-13089 - Order of grouped property listener changed is not deterministic
        const rowData0 = [
            { orgHierarchy: ['A', 'B'], x: 'B' },
            { orgHierarchy: ['C', 'D', 'E'], x: 'E' },
            { orgHierarchy: ['A'], x: 'A' },
            { orgHierarchy: ['C', 'D'], x: 'D' },
        ];

        const rowData1 = [
            { orgHierarchy: ['A', 'B'], x: 'b' },
            { orgHierarchy: ['C', 'D', 'E'], x: 'e' },
            { orgHierarchy: ['A'], x: 'a' },
            { orgHierarchy: ['C', 'D'], x: 'd' },
        ];

        const api = gridsManager.createGrid('myGrid', {
            columnDefs: [{ field: 'x' }],
            treeData: false,
            getDataPath: (data) => data.orgHierarchy,
            animateRows: false,
            groupDefaultExpanded: -1,
            rowData: rowData0,
        });

        api.updateGridOptions({
            rowData: rowData1,
            treeData: true,
        });

        const gridRowsOptions: GridRowsOptions = {
            checkDom: true,
            columns: true,
        };

        const gridRows = new GridRows(api, 'update 1', gridRowsOptions);
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ A GROUP id:2 ag-Grid-AutoColumn:"A" x:"a"
            │ └── B LEAF id:0 ag-Grid-AutoColumn:"B" x:"b"
            └─┬ C filler id:row-group-0-C ag-Grid-AutoColumn:"C"
            · └─┬ D GROUP id:3 ag-Grid-AutoColumn:"D" x:"d"
            · · └── E LEAF id:1 ag-Grid-AutoColumn:"E" x:"e"
        `);
    });

    test('initializing columns after rowData with tree data', async () => {
        let rowDataUpdated = 0;
        let modelUpdated = 0;
        const gridOptions: GridOptions = {
            groupDefaultExpanded: -1,
            treeData: true,
            getDataPath: (data) => data.orgHierarchy,
            getRowId: (params) => params.data.id,
            onRowDataUpdated: () => ++rowDataUpdated,
            onModelUpdated: () => ++modelUpdated,
        };

        const gridRowsOptions: GridRowsOptions = {
            checkDom: true,
            columns: true,
        };

        const api = gridsManager.createGrid('myGrid', gridOptions);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(0);
        expect(modelUpdated).toBe(0);

        api.setGridOption('rowData', [
            { id: 'a', orgHierarchy: ['A'] },
            { id: 'b', orgHierarchy: ['A', 'B'] },
            { id: 'd', orgHierarchy: ['C', 'D'] },
            { id: 'h', orgHierarchy: ['E', 'F', 'G', 'H'] },
        ]);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(0);
        expect(modelUpdated).toBe(0);

        await new GridRows(api, 'empty', gridRowsOptions).check('empty');

        api.setGridOption('columnDefs', [
            { field: 'groupType', valueGetter: (params) => (params.data ? 'Provided' : 'Filler') },
        ]);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(1);
        expect(modelUpdated).toBe(1);

        await new GridRows(api, 'data', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID groupType:"Filler"
            ├─┬ A GROUP id:a ag-Grid-AutoColumn:"A" groupType:"Provided"
            │ └── B LEAF id:b ag-Grid-AutoColumn:"B" groupType:"Provided"
            ├─┬ C filler id:row-group-0-C ag-Grid-AutoColumn:"C" groupType:"Filler"
            │ └── D LEAF id:d ag-Grid-AutoColumn:"D" groupType:"Provided"
            └─┬ E filler id:row-group-0-E ag-Grid-AutoColumn:"E" groupType:"Filler"
            · └─┬ F filler id:row-group-0-E-1-F ag-Grid-AutoColumn:"F" groupType:"Filler"
            · · └─┬ G filler id:row-group-0-E-1-F-2-G ag-Grid-AutoColumn:"G" groupType:"Filler"
            · · · └── H LEAF id:h ag-Grid-AutoColumn:"H" groupType:"Provided"
        `);
    });

    test('initializing columns after transactions initialization with tree data', async () => {
        let rowDataUpdated = 0;
        let modelUpdated = 0;
        const gridOptions: GridOptions = {
            groupDefaultExpanded: -1,
            treeData: true,
            getDataPath: (data) => data.orgHierarchy,
            getRowId: (params) => params.data.id,
            onRowDataUpdated: () => ++rowDataUpdated,
            onModelUpdated: () => ++modelUpdated,
        };

        const gridRowsOptions: GridRowsOptions = {
            checkDom: true,
            columns: true,
        };

        const api = gridsManager.createGrid('myGrid', gridOptions);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(0);
        expect(modelUpdated).toBe(0);

        api.applyTransaction({
            add: [
                { id: 'a', orgHierarchy: ['A'] },
                { id: 'b', orgHierarchy: ['A', 'B'] },
            ],
        });

        api.applyTransaction({
            add: [
                { id: 'd', orgHierarchy: ['C', 'D'] },
                { id: 'h', orgHierarchy: ['E', 'F', 'G', 'H'] },
            ],
        });

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(0);
        expect(modelUpdated).toBe(0);

        await new GridRows(api, 'empty', gridRowsOptions).check('empty');

        api.setGridOption('columnDefs', [
            { field: 'groupType', valueGetter: (params) => (params.data ? 'Provided' : 'Filler') },
        ]);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(1);
        expect(modelUpdated).toBe(1);

        await new GridRows(api, 'data', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID groupType:"Filler"
            ├─┬ A GROUP id:a ag-Grid-AutoColumn:"A" groupType:"Provided"
            │ └── B LEAF id:b ag-Grid-AutoColumn:"B" groupType:"Provided"
            ├─┬ C filler id:row-group-0-C ag-Grid-AutoColumn:"C" groupType:"Filler"
            │ └── D LEAF id:d ag-Grid-AutoColumn:"D" groupType:"Provided"
            └─┬ E filler id:row-group-0-E ag-Grid-AutoColumn:"E" groupType:"Filler"
            · └─┬ F filler id:row-group-0-E-1-F ag-Grid-AutoColumn:"F" groupType:"Filler"
            · · └─┬ G filler id:row-group-0-E-1-F-2-G ag-Grid-AutoColumn:"G" groupType:"Filler"
            · · · └── H LEAF id:h ag-Grid-AutoColumn:"H" groupType:"Provided"
        `);
    });

    test('changing group columns updates the row groups', async () => {
        const rowData = [
            { id: 'A', x: 'a', z: 1, path: ['A'] },
            { id: 'B', x: 'a-b', z: 2, path: ['A', 'B'] },
            { id: 'C', x: 'c', z: 3, path: ['C'] },
            { id: 'D', x: 'c-d', z: 4, path: ['C', 'D'] },
            { id: 'E', x: 'e', z: 5, path: ['E'] },
            { id: 'F', x: 'e-f', z: 6, path: ['E', 'F'] },
            { id: 'G', x: 'e-f-g', z: 7, path: ['E', 'F', 'G'] },
            { id: 'H', x: 'e-f-g-h', z: 8, path: ['E', 'F', 'G', 'H'] },
        ];

        const api = gridsManager.createGrid('myGrid', {
            columnDefs: [{ field: 'x' }],
            animateRows: false,
            groupDefaultExpanded: -1,
            rowData,
            autoGroupColumnDef: { headerName: 'H', colId: 'zzz' },
            getRowId: (params) => params.data.id,
            treeData: true,
            getDataPath: (data) => data.path,
        });

        const gridRowsOptions = {
            columns: true,
            checkDom: true,
        };

        const gridRows = new GridRows(api, 'data', gridRowsOptions);

        await gridRows.check(`
                ROOT id:ROOT_NODE_ID
                ├─┬ A GROUP id:A ag-Grid-AutoColumn:"A" x:"a"
                │ └── B LEAF id:B ag-Grid-AutoColumn:"B" x:"a-b"
                ├─┬ C GROUP id:C ag-Grid-AutoColumn:"C" x:"c"
                │ └── D LEAF id:D ag-Grid-AutoColumn:"D" x:"c-d"
                └─┬ E GROUP id:E ag-Grid-AutoColumn:"E" x:"e"
                · └─┬ F GROUP id:F ag-Grid-AutoColumn:"F" x:"e-f"
                · · └─┬ G GROUP id:G ag-Grid-AutoColumn:"G" x:"e-f-g"
                · · · └── H LEAF id:H ag-Grid-AutoColumn:"H" x:"e-f-g-h"
            `);

        api.updateGridOptions({
            columnDefs: [{ field: 'x' }, { field: 'id' }, { field: 'z' }],
            autoGroupColumnDef: { headerName: 'X', field: 'x' },
        });

        await gridRows.check(`
                ROOT id:ROOT_NODE_ID
                ├─┬ A GROUP id:A ag-Grid-AutoColumn:"a" x:"a" id:"A" z:1
                │ └── B LEAF id:B ag-Grid-AutoColumn:"a-b" x:"a-b" id:"B" z:2
                ├─┬ C GROUP id:C ag-Grid-AutoColumn:"c" x:"c" id:"C" z:3
                │ └── D LEAF id:D ag-Grid-AutoColumn:"c-d" x:"c-d" id:"D" z:4
                └─┬ E GROUP id:E ag-Grid-AutoColumn:"e" x:"e" id:"E" z:5
                · └─┬ F GROUP id:F ag-Grid-AutoColumn:"e-f" x:"e-f" id:"F" z:6
                · · └─┬ G GROUP id:G ag-Grid-AutoColumn:"e-f-g" x:"e-f-g" id:"G" z:7
                · · · └── H LEAF id:H ag-Grid-AutoColumn:"e-f-g-h" x:"e-f-g-h" id:"H" z:8
            `);

        api.updateGridOptions({
            autoGroupColumnDef: { headerName: 'X', field: 'z' },
        });

        await gridRows.check(`
                ROOT id:ROOT_NODE_ID
                ├─┬ A GROUP id:A ag-Grid-AutoColumn:1 x:"a" id:"A" z:1
                │ └── B LEAF id:B ag-Grid-AutoColumn:2 x:"a-b" id:"B" z:2
                ├─┬ C GROUP id:C ag-Grid-AutoColumn:3 x:"c" id:"C" z:3
                │ └── D LEAF id:D ag-Grid-AutoColumn:4 x:"c-d" id:"D" z:4
                └─┬ E GROUP id:E ag-Grid-AutoColumn:5 x:"e" id:"E" z:5
                · └─┬ F GROUP id:F ag-Grid-AutoColumn:6 x:"e-f" id:"F" z:6
                · · └─┬ G GROUP id:G ag-Grid-AutoColumn:7 x:"e-f-g" id:"G" z:7
                · · · └── H LEAF id:H ag-Grid-AutoColumn:8 x:"e-f-g-h" id:"H" z:8
            `);
    });
});

function hierarchyWithInvertedOrderRowSnapshot(): RowSnapshot[] {
    return [
        {
            allChildrenCount: 1,
            allLeafChildren: ['B'],
            childIndex: 0,
            childrenAfterFilter: ['B'],
            childrenAfterGroup: ['B'],
            childrenAfterSort: ['B'],
            detail: undefined,
            displayed: true,
            expanded: true,
            firstChild: true,
            footer: undefined,
            group: true,
            groupData: { 'ag-Grid-AutoColumn': 'A' },
            id: '2',
            key: 'A',
            lastChild: false,
            leafGroup: undefined,
            level: 0,
            master: false,
            parentKey: null,
            rowGroupIndex: undefined,
            rowPinned: undefined,
            selectable: true,
            siblingKey: undefined,
            uiLevel: 0,
            rowIndex: 0,
        },
        {
            allChildrenCount: null,
            allLeafChildren: [],
            childIndex: 0,
            childrenAfterFilter: [],
            childrenAfterGroup: [],
            childrenAfterSort: [],
            detail: undefined,
            displayed: true,
            expanded: false,
            firstChild: true,
            footer: undefined,
            group: false,
            groupData: { 'ag-Grid-AutoColumn': 'B' },
            id: '0',
            key: 'B',
            lastChild: true,
            leafGroup: undefined,
            level: 1,
            master: false,
            parentKey: 'A',
            rowGroupIndex: undefined,
            rowPinned: undefined,
            selectable: true,
            siblingKey: undefined,
            uiLevel: 1,
            rowIndex: 1,
        },
        {
            allChildrenCount: 2,
            allLeafChildren: ['E'],
            childIndex: 1,
            childrenAfterFilter: ['D'],
            childrenAfterGroup: ['D'],
            childrenAfterSort: ['D'],
            detail: undefined,
            displayed: true,
            expanded: true,
            firstChild: false,
            footer: undefined,
            group: true,
            groupData: { 'ag-Grid-AutoColumn': 'C' },
            id: 'row-group-0-C',
            key: 'C',
            lastChild: true,
            leafGroup: false,
            level: 0,
            master: false,
            parentKey: null,
            rowGroupIndex: null,
            rowPinned: undefined,
            selectable: true,
            siblingKey: undefined,
            uiLevel: 0,
            rowIndex: 2,
        },
        {
            allChildrenCount: 1,
            allLeafChildren: ['E'],
            childIndex: 0,
            childrenAfterFilter: ['E'],
            childrenAfterGroup: ['E'],
            childrenAfterSort: ['E'],
            detail: undefined,
            displayed: true,
            expanded: true,
            firstChild: true,
            footer: undefined,
            group: true,
            groupData: { 'ag-Grid-AutoColumn': 'D' },
            id: '3',
            key: 'D',
            lastChild: true,
            leafGroup: undefined,
            level: 1,
            master: false,
            parentKey: 'C',
            rowGroupIndex: undefined,
            rowPinned: undefined,
            selectable: true,
            siblingKey: undefined,
            uiLevel: 1,
            rowIndex: 3,
        },
        {
            allChildrenCount: null,
            allLeafChildren: [],
            childIndex: 0,
            childrenAfterFilter: [],
            childrenAfterGroup: [],
            childrenAfterSort: [],
            detail: undefined,
            displayed: true,
            expanded: false,
            firstChild: true,
            footer: undefined,
            group: false,
            groupData: { 'ag-Grid-AutoColumn': 'E' },
            id: '1',
            key: 'E',
            lastChild: true,
            leafGroup: undefined,
            level: 2,
            master: false,
            parentKey: 'D',
            rowGroupIndex: undefined,
            rowPinned: undefined,
            selectable: true,
            siblingKey: undefined,
            uiLevel: 2,
            rowIndex: 4,
        },
    ];
}
