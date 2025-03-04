import type { MockInstance } from 'vitest';

import type { GridOptions } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';

import type { GridRowsOptions } from '../../test-utils';
import { GridRows, TestGridsManager, asyncSetTimeout, cachedJSONObjects } from '../../test-utils';

describe('ag-grid hierarchical tree data', () => {
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

    test('ag-grid hierarchical tree data loading and no-show overlay', async () => {
        const rowData = [{ x: 1 }];

        const gridOptions: GridOptions = {
            columnDefs: [{ field: 'x' }],
            autoGroupColumnDef: {
                headerName: 'Organisation Hierarchy',
                cellRendererParams: { suppressCount: true },
            },
            treeData: true,
            animateRows: false,
            groupDefaultExpanded: -1,
            treeDataChildrenField: 'children',
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

    test('ag-grid hierarchical tree data (without id)', async () => {
        const rowData = [
            { x: 'A', children: [{ x: 'B', children: [{ x: 'C', children: [{ x: 'D' }] }] }] },
            { x: 'E', children: [{ x: 'F', children: [{ x: 'G', children: [{ x: 'H' }] }] }] },
        ];

        const gridOptions: GridOptions = {
            columnDefs: [{ field: 'x' }],
            treeData: true,
            treeDataChildrenField: 'children',
            animateRows: false,
            groupDefaultExpanded: -1,
            rowData,
        };

        const api = gridsManager.createGrid('myGrid', gridOptions);

        const gridRowsOptions: GridRowsOptions = {
            checkDom: true,
            columns: true,
        };

        await new GridRows(api, 'data', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ 0 GROUP id:0 ag-Grid-AutoColumn:"0" x:"A"
            │ └─┬ 1 GROUP id:1 ag-Grid-AutoColumn:"1" x:"B"
            │ · └─┬ 2 GROUP id:2 ag-Grid-AutoColumn:"2" x:"C"
            │ · · └── 3 LEAF id:3 ag-Grid-AutoColumn:"3" x:"D"
            └─┬ 4 GROUP id:4 ag-Grid-AutoColumn:"4" x:"E"
            · └─┬ 5 GROUP id:5 ag-Grid-AutoColumn:"5" x:"F"
            · · └─┬ 6 GROUP id:6 ag-Grid-AutoColumn:"6" x:"G"
            · · · └── 7 LEAF id:7 ag-Grid-AutoColumn:"7" x:"H"
        `);
    });

    // TODO: disabled due to AG-13994 - Remove the treeData flattening behavior (from the API, not the codebase)
    test.skip('ag-grid hierarchical tree data (without id) flattening', async () => {
        const rowData = [
            { x: 'A', children: [{ x: 'B', children: [{ x: 'C', children: [{ x: 'D' }] }] }] },
            { x: 'E', children: [{ x: 'F', children: [{ x: 'G', children: [{ x: 'H' }] }] }] },
        ];

        const gridOptions: GridOptions = {
            columnDefs: [{ field: 'x' }],
            treeData: true,
            treeDataChildrenField: 'children',
            animateRows: false,
            groupDefaultExpanded: -1,
            rowData,
        };

        const api = gridsManager.createGrid('myGrid', gridOptions);

        const gridRowsOptions: GridRowsOptions = {
            checkDom: true,
            columns: true,
        };

        await new GridRows(api, 'initial', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ 0 GROUP id:0 ag-Grid-AutoColumn:"0" x:"A"
            │ └─┬ 1 GROUP id:1 ag-Grid-AutoColumn:"1" x:"B"
            │ · └─┬ 2 GROUP id:2 ag-Grid-AutoColumn:"2" x:"C"
            │ · · └── 3 LEAF id:3 ag-Grid-AutoColumn:"3" x:"D"
            └─┬ 4 GROUP id:4 ag-Grid-AutoColumn:"4" x:"E"
            · └─┬ 5 GROUP id:5 ag-Grid-AutoColumn:"5" x:"F"
            · · └─┬ 6 GROUP id:6 ag-Grid-AutoColumn:"6" x:"G"
            · · · └── 7 LEAF id:7 ag-Grid-AutoColumn:"7" x:"H"
        `);

        api.setGridOption('treeData', false);

        await new GridRows(api, 'flat', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID
            ├── 0 LEAF id:0 x:"A"
            ├── 1 LEAF id:1 x:"B"
            ├── 2 LEAF id:2 x:"C"
            ├── 3 LEAF id:3 x:"D"
            ├── 4 LEAF id:4 x:"E"
            ├── 5 LEAF id:5 x:"F"
            ├── 6 LEAF id:6 x:"G"
            └── 7 LEAF id:7 x:"H"
        `);

        api.setGridOption('treeData', true);

        await new GridRows(api, 'hierarchical', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ 0 GROUP id:0 ag-Grid-AutoColumn:"0" x:"A"
            │ └─┬ 1 GROUP id:1 ag-Grid-AutoColumn:"1" x:"B"
            │ · └─┬ 2 GROUP id:2 ag-Grid-AutoColumn:"2" x:"C"
            │ · · └── 3 LEAF id:3 ag-Grid-AutoColumn:"3" x:"D"
            └─┬ 4 GROUP id:4 ag-Grid-AutoColumn:"4" x:"E"
            · └─┬ 5 GROUP id:5 ag-Grid-AutoColumn:"5" x:"F"
            · · └─┬ 6 GROUP id:6 ag-Grid-AutoColumn:"6" x:"G"
            · · · └── 7 LEAF id:7 ag-Grid-AutoColumn:"7" x:"H"
        `);
    });

    test('ag-grid hierarchical override tree data (without id)', async () => {
        const rowData0 = [
            { x: 'A', children: [{ x: 'B' }] },
            { x: 'C', children: [{ x: 'D' }] },
        ];

        const rowData1 = [
            { x: 'E', children: [{ x: 'F' }, { x: 'G' }] },
            { x: 'H', children: [{ x: 'I' }, { x: 'J' }] },
        ];

        const api = gridsManager.createGrid('myGrid', {
            columnDefs: [{ field: 'x' }],
            treeData: true,
            treeDataChildrenField: 'children',
            animateRows: false,
            groupDefaultExpanded: -1,
            rowData: rowData0,
        });

        const gridRowsOptions: GridRowsOptions = {
            checkDom: true,
            columns: true,
        };

        let gridRows = new GridRows(api, 'data', gridRowsOptions);
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ 0 GROUP id:0 ag-Grid-AutoColumn:"0" x:"A"
            │ └── 1 LEAF id:1 ag-Grid-AutoColumn:"1" x:"B"
            └─┬ 2 GROUP id:2 ag-Grid-AutoColumn:"2" x:"C"
            · └── 3 LEAF id:3 ag-Grid-AutoColumn:"3" x:"D"
        `);

        api.setGridOption('rowData', rowData1);

        gridRows = new GridRows(api, 'update 1', gridRowsOptions);
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ 0 GROUP id:0 ag-Grid-AutoColumn:"0" x:"E"
            │ ├── 1 LEAF id:1 ag-Grid-AutoColumn:"1" x:"F"
            │ └── 2 LEAF id:2 ag-Grid-AutoColumn:"2" x:"G"
            └─┬ 3 GROUP id:3 ag-Grid-AutoColumn:"3" x:"H"
            · ├── 4 LEAF id:4 ag-Grid-AutoColumn:"4" x:"I"
            · └── 5 LEAF id:5 ag-Grid-AutoColumn:"5" x:"J"
        `);

        api.updateGridOptions({ rowData: rowData0 });

        gridRows = new GridRows(api, 'update 2', gridRowsOptions);
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ 0 GROUP id:0 ag-Grid-AutoColumn:"0" x:"A"
            │ └── 1 LEAF id:1 ag-Grid-AutoColumn:"1" x:"B"
            └─┬ 2 GROUP id:2 ag-Grid-AutoColumn:"2" x:"C"
            · └── 3 LEAF id:3 ag-Grid-AutoColumn:"3" x:"D"
            `);

        api.updateGridOptions({ rowData: rowData1 });

        gridRows = new GridRows(api, 'update 4', gridRowsOptions);
        await gridRows.check(`
                ROOT id:ROOT_NODE_ID
                ├─┬ 0 GROUP id:0 ag-Grid-AutoColumn:"0" x:"E"
                │ ├── 1 LEAF id:1 ag-Grid-AutoColumn:"1" x:"F"
                │ └── 2 LEAF id:2 ag-Grid-AutoColumn:"2" x:"G"
                └─┬ 3 GROUP id:3 ag-Grid-AutoColumn:"3" x:"H"
                · ├── 4 LEAF id:4 ag-Grid-AutoColumn:"4" x:"I"
                · └── 5 LEAF id:5 ag-Grid-AutoColumn:"5" x:"J"
            `);
    });

    // TODO: disabled due to AG-13994 - Remove the treeData flattening behavior (from the API, not the codebase)
    test.skip('ag-grid hierarchical override flat tree data (without id)', async () => {
        const rowData0 = [
            { x: 'A', children: [{ x: 'B' }] },
            { x: 'C', children: [{ x: 'D' }] },
        ];

        const rowData1 = [
            { x: 'E', children: [{ x: 'F' }, { x: 'G' }] },
            { x: 'H', children: [{ x: 'I' }, { x: 'J' }] },
        ];

        const api = gridsManager.createGrid('myGrid', {
            columnDefs: [{ field: 'x' }],
            treeData: false,
            treeDataChildrenField: 'children',
            animateRows: false,
            groupDefaultExpanded: -1,
            rowData: rowData0,
        });

        const gridRowsOptions: GridRowsOptions = {
            checkDom: true,
            columns: true,
        };

        let gridRows = new GridRows(api, 'data', gridRowsOptions);
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├── LEAF id:0 x:"A"
            ├── LEAF id:1 x:"B"
            ├── LEAF id:2 x:"C"
            └── LEAF id:3 x:"D"
        `);

        api.setGridOption('treeData', false);
        gridRows = new GridRows(api, 'data', gridRowsOptions);
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├── LEAF id:0 x:"A"
            ├── LEAF id:1 x:"B"
            ├── LEAF id:2 x:"C"
            └── LEAF id:3 x:"D"
        `);

        api.setGridOption('rowData', rowData1);

        api.updateGridOptions({
            treeData: true,
            rowData: rowData1,
        });

        gridRows = new GridRows(api, 'update 1', gridRowsOptions);
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ 0 GROUP id:0 ag-Grid-AutoColumn:"0" x:"E"
            │ ├── 1 LEAF id:1 ag-Grid-AutoColumn:"1" x:"F"
            │ └── 2 LEAF id:2 ag-Grid-AutoColumn:"2" x:"G"
            └─┬ 3 GROUP id:3 ag-Grid-AutoColumn:"3" x:"H"
            · ├── 4 LEAF id:4 ag-Grid-AutoColumn:"4" x:"I"
            · └── 5 LEAF id:5 ag-Grid-AutoColumn:"5" x:"J"
        `);

        api.updateGridOptions({ rowData: rowData0, treeData: false });

        gridRows = new GridRows(api, 'update 2', gridRowsOptions);
        await gridRows.check(`
                ROOT id:ROOT_NODE_ID
                ├── LEAF id:0 x:"A"
                ├── LEAF id:1 x:"B"
                ├── LEAF id:2 x:"C"
                └── LEAF id:3 x:"D"
            `);

        api.updateGridOptions({ rowData: rowData1 });

        gridRows = new GridRows(api, 'update 3', gridRowsOptions);
        await gridRows.check(`
                ROOT id:ROOT_NODE_ID
                ├── LEAF id:0 x:"E"
                ├── LEAF id:1 x:"F"
                ├── LEAF id:2 x:"G"
                ├── LEAF id:3 x:"H"
                ├── LEAF id:4 x:"I"
                └── LEAF id:5 x:"J"
            `);

        api.updateGridOptions({ treeData: true });

        gridRows = new GridRows(api, 'update 4', gridRowsOptions);
        await gridRows.check(`
                ROOT id:ROOT_NODE_ID
                ├─┬ 0 GROUP id:0 ag-Grid-AutoColumn:"0" x:"E"
                │ ├── 1 LEAF id:1 ag-Grid-AutoColumn:"1" x:"F"
                │ └── 2 LEAF id:2 ag-Grid-AutoColumn:"2" x:"G"
                └─┬ 3 GROUP id:3 ag-Grid-AutoColumn:"3" x:"H"
                · ├── 4 LEAF id:4 ag-Grid-AutoColumn:"4" x:"I"
                · └── 5 LEAF id:5 ag-Grid-AutoColumn:"5" x:"J"
            `);
    });

    test('ag-grid hierarchical override tree data is insensitive to updateGridOptions object order', async () => {
        // see https://ag-grid.atlassian.net/browse/AG-13089 - Order of grouped property listener changed is not deterministic
        const rowData0 = [
            { x: 'A', children: [{ x: 'B' }] },
            { x: 'C', children: [{ x: 'D' }] },
        ];

        const rowData1 = [
            { x: 'E', children: [{ x: 'F' }, { x: 'G' }] },
            { x: 'H', children: [{ x: 'I' }, { x: 'J' }] },
        ];

        const api = gridsManager.createGrid('myGrid', {
            columnDefs: [{ field: 'x' }],
            treeData: false,
            treeDataChildrenField: 'children',
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
            ├─┬ 0 GROUP id:0 ag-Grid-AutoColumn:"0" x:"E"
            │ ├── 1 LEAF id:1 ag-Grid-AutoColumn:"1" x:"F"
            │ └── 2 LEAF id:2 ag-Grid-AutoColumn:"2" x:"G"
            └─┬ 3 GROUP id:3 ag-Grid-AutoColumn:"3" x:"H"
            · ├── 4 LEAF id:4 ag-Grid-AutoColumn:"4" x:"I"
            · └── 5 LEAF id:5 ag-Grid-AutoColumn:"5" x:"J"
        `);
    });

    test('ag-grid initial hierarchical tree data (with id)', async () => {
        const rowData = getHierarchicalData();

        const gridOptions: GridOptions = {
            columnDefs: [{ field: 'x' }],
            treeData: true,
            treeDataChildrenField: 'children',
            animateRows: false,
            groupDefaultExpanded: -1,
            rowData,
            getRowId: ({ data }) => data.id,
        };

        const api = gridsManager.createGrid('myGrid', gridOptions);

        const gridRowsOptions: GridRowsOptions = {
            checkDom: true,
            columns: true,
        };

        const gridRows = new GridRows(api, 'data', gridRowsOptions);
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ idA GROUP id:idA ag-Grid-AutoColumn:"idA" x:"A"
            │ └─┬ idB GROUP id:idB ag-Grid-AutoColumn:"idB" x:"B"
            │ · ├─┬ idC GROUP id:idC ag-Grid-AutoColumn:"idC" x:"C"
            │ · │ └── idD LEAF id:idD ag-Grid-AutoColumn:"idD" x:"D"
            │ · └─┬ idE GROUP id:idE ag-Grid-AutoColumn:"idE" x:"E"
            │ · · └── idF LEAF id:idF ag-Grid-AutoColumn:"idF" x:"F"
            └─┬ idG GROUP id:idG ag-Grid-AutoColumn:"idG" x:"G"
            · ├── idH LEAF id:idH ag-Grid-AutoColumn:"idH" x:"H"
            · └── idI LEAF id:idI ag-Grid-AutoColumn:"idI" x:"I"
        `);
    });

    // TODO: disabled due to AG-13994 - Remove the treeData flattening behavior (from the API, not the codebase)
    test.skip('ag-grid initial hierarchical tree data (with id) flattening', async () => {
        const rowData = getHierarchicalData();

        const gridOptions: GridOptions = {
            columnDefs: [{ field: 'x' }],
            treeData: true,
            treeDataChildrenField: 'children',
            animateRows: false,
            groupDefaultExpanded: -1,
            rowData,
            getRowId: ({ data }) => data.id,
        };

        const api = gridsManager.createGrid('myGrid', gridOptions);

        const gridRowsOptions: GridRowsOptions = {
            checkDom: true,
            columns: true,
        };

        api.setGridOption('treeData', false);

        await new GridRows(api, 'flat', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID
            ├── idA LEAF id:idA x:"A"
            ├── idB LEAF id:idB x:"B"
            ├── idC LEAF id:idC x:"C"
            ├── idD LEAF id:idD x:"D"
            ├── idE LEAF id:idE x:"E"
            ├── idF LEAF id:idF x:"F"
            ├── idG LEAF id:idG x:"G"
            ├── idH LEAF id:idH x:"H"
            └── idI LEAF id:idI x:"I"
        `);

        api.setGridOption('treeData', true);

        await new GridRows(api, 'tree', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ idA GROUP id:idA ag-Grid-AutoColumn:"idA" x:"A"
            │ └─┬ idB GROUP id:idB ag-Grid-AutoColumn:"idB" x:"B"
            │ · ├─┬ idC GROUP id:idC ag-Grid-AutoColumn:"idC" x:"C"
            │ · │ └── idD LEAF id:idD ag-Grid-AutoColumn:"idD" x:"D"
            │ · └─┬ idE GROUP id:idE ag-Grid-AutoColumn:"idE" x:"E"
            │ · · └── idF LEAF id:idF ag-Grid-AutoColumn:"idF" x:"F"
            └─┬ idG GROUP id:idG ag-Grid-AutoColumn:"idG" x:"G"
            · ├── idH LEAF id:idH ag-Grid-AutoColumn:"idH" x:"H"
            · └── idI LEAF id:idI ag-Grid-AutoColumn:"idI" x:"I"
        `);
    });

    test('ag-grid hierarchical tree data (with id)', async () => {
        const rowData = [
            {
                id: 'A',
                children: [{ id: 'B', children: [] }],
            },
            {
                id: 'C',
                children: [{ id: 'D' }],
            },

            {
                id: 'E',
                children: [
                    { id: 'F', children: [{ id: 'G' }, { id: 'H' }, { id: 'I' }] },
                    { id: 'J', children: [] },
                ],
            },
        ];

        const gridOptions: GridOptions = {
            columnDefs: [],
            treeData: true,
            treeDataChildrenField: 'children',
            animateRows: false,
            groupDefaultExpanded: -1,
            rowData,
            getRowId: ({ data }) => data.id,
        };

        const api = gridsManager.createGrid('myGrid', gridOptions);

        const gridRowsOptions: GridRowsOptions = {
            checkDom: true,
            columns: true,
        };

        const gridRows = new GridRows(api, 'data', gridRowsOptions);
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ A GROUP id:A ag-Grid-AutoColumn:"A"
            │ └── B LEAF id:B ag-Grid-AutoColumn:"B"
            ├─┬ C GROUP id:C ag-Grid-AutoColumn:"C"
            │ └── D LEAF id:D ag-Grid-AutoColumn:"D"
            └─┬ E GROUP id:E ag-Grid-AutoColumn:"E"
            · ├─┬ F GROUP id:F ag-Grid-AutoColumn:"F"
            · │ ├── G LEAF id:G ag-Grid-AutoColumn:"G"
            · │ ├── H LEAF id:H ag-Grid-AutoColumn:"H"
            · │ └── I LEAF id:I ag-Grid-AutoColumn:"I"
            · └── J LEAF id:J ag-Grid-AutoColumn:"J"
        `);
    });

    test('initializing columns after rowData with tree data', async () => {
        let rowDataUpdated = 0;
        let modelUpdated = 0;
        const gridOptions: GridOptions = {
            groupDefaultExpanded: -1,
            treeData: true,
            treeDataChildrenField: 'children',
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

        const allData = getHierarchicalData();
        api.setGridOption('rowData', cachedJSONObjects.array([allData[0]]));
        api.setGridOption('rowData', cachedJSONObjects.array(allData));

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(0);
        expect(modelUpdated).toBe(0);

        await new GridRows(api, 'empty', gridRowsOptions).check('empty');

        api.setGridOption('columnDefs', [{ field: 'x' }]);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(1);
        expect(modelUpdated).toBe(1);

        await new GridRows(api, 'data', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ idA GROUP id:idA ag-Grid-AutoColumn:"idA" x:"A"
            │ └─┬ idB GROUP id:idB ag-Grid-AutoColumn:"idB" x:"B"
            │ · ├─┬ idC GROUP id:idC ag-Grid-AutoColumn:"idC" x:"C"
            │ · │ └── idD LEAF id:idD ag-Grid-AutoColumn:"idD" x:"D"
            │ · └─┬ idE GROUP id:idE ag-Grid-AutoColumn:"idE" x:"E"
            │ · · └── idF LEAF id:idF ag-Grid-AutoColumn:"idF" x:"F"
            └─┬ idG GROUP id:idG ag-Grid-AutoColumn:"idG" x:"G"
            · ├── idH LEAF id:idH ag-Grid-AutoColumn:"idH" x:"H"
            · └── idI LEAF id:idI ag-Grid-AutoColumn:"idI" x:"I"
        `);
    });

    test('changing group columns updates the row groups', async () => {
        const rowData = [
            {
                id: 'A',
                x: 'a',
                z: 1,
                children: [{ id: 'B', x: 'a-b', z: 2 }],
            },
            {
                id: 'C',
                x: 'c',
                z: 3,
                children: [{ id: 'D', x: 'c-d', z: 4 }],
            },
            {
                id: 'E',
                x: 'e',
                z: 5,
                children: [
                    {
                        id: 'F',
                        x: 'e-f',
                        z: 6,
                        children: [
                            {
                                id: 'G',
                                x: 'e-f-g',
                                z: 7,
                                children: [{ id: 'H', x: 'e-f-g-h', z: 8 }],
                            },
                        ],
                    },
                ],
            },
        ];

        const api = gridsManager.createGrid('myGrid', {
            columnDefs: [{ field: 'x' }],
            animateRows: false,
            groupDefaultExpanded: -1,
            rowData,
            autoGroupColumnDef: { headerName: 'H', colId: 'zzz' },
            getRowId: (params) => params.data.id,
            treeData: true,
            treeDataChildrenField: 'children',
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
            autoGroupColumnDef: { headerName: 'X', field: 'x', colId: 'xxx' },
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
            autoGroupColumnDef: { headerName: 'X', field: 'z', colId: 'www' },
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

function getHierarchicalData() {
    return [
        {
            id: 'idA',
            x: 'A',
            children: [
                {
                    id: 'idB',
                    x: 'B',
                    children: [
                        {
                            id: 'idC',
                            x: 'C',
                            children: [
                                {
                                    id: 'idD',
                                    x: 'D',
                                },
                            ],
                        },
                        {
                            id: 'idE',
                            x: 'E',
                            children: [
                                {
                                    id: 'idF',
                                    x: 'F',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 'idG',
            x: 'G',
            children: [
                {
                    id: 'idH',
                    x: 'H',
                },
                {
                    id: 'idI',
                    x: 'I',
                },
            ],
        },
    ];
}
