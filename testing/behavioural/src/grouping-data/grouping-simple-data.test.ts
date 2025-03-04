import type { GridOptions } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { RowGroupingModule } from 'ag-grid-enterprise';

import type { GridRowsOptions, RowSnapshot } from '../test-utils';
import { GridRows, TestGridsManager, asyncSetTimeout, getRowsSnapshot } from '../test-utils';

describe('ag-grid grouping simple data', () => {
    const gridsManager = new TestGridsManager({
        modules: [ClientSideRowModelModule, RowGroupingModule],
    });

    beforeEach(() => {
        gridsManager.reset();
    });

    afterEach(() => {
        gridsManager.reset();
    });

    test('simple grouping rows snapshot', async () => {
        const rowData = [
            { country: 'Ireland', year: '2000', sport: 'Sailing', athlete: 'John Von Neumann' },
            { country: 'Ireland', year: '2000', sport: 'Soccer', athlete: 'Ada Lovelace' },
            { country: 'Ireland', year: '2001', sport: 'Football', athlete: 'Alan Turing' },
            { country: 'Italy', year: '2000', sport: 'Soccer', athlete: 'Donald Knuth' },
            { country: 'Italy', year: '2001', sport: 'Football', athlete: 'Marvin Minsky' },
        ];

        const gridOptions: GridOptions = {
            columnDefs: [
                { field: 'country', rowGroup: true, hide: true },
                { field: 'year', rowGroup: true, hide: true },
                { field: 'athlete' },
            ],
            groupDefaultExpanded: -1,
            rowData,
        };

        const api = gridsManager.createGrid('myGrid', gridOptions);

        const gridRows = new GridRows(api, 'data', {
            columns: true,
            checkDom: true,
        });
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ filler id:row-group-country-Ireland ag-Grid-AutoColumn:"Ireland"
            │ ├─┬ filler id:row-group-country-Ireland-year-2000 ag-Grid-AutoColumn:"2000"
            │ │ ├── LEAF id:0 ag-Grid-AutoColumn:undefined country:"Ireland" year:"2000" athlete:"John Von Neumann"
            │ │ └── LEAF id:1 ag-Grid-AutoColumn:undefined country:"Ireland" year:"2000" athlete:"Ada Lovelace"
            │ └─┬ filler id:row-group-country-Ireland-year-2001 ag-Grid-AutoColumn:"2001"
            │ · └── LEAF id:2 ag-Grid-AutoColumn:undefined country:"Ireland" year:"2001" athlete:"Alan Turing"
            └─┬ filler id:row-group-country-Italy ag-Grid-AutoColumn:"Italy"
            · ├─┬ filler id:row-group-country-Italy-year-2000 ag-Grid-AutoColumn:"2000"
            · │ └── LEAF id:3 ag-Grid-AutoColumn:undefined country:"Italy" year:"2000" athlete:"Donald Knuth"
            · └─┬ filler id:row-group-country-Italy-year-2001 ag-Grid-AutoColumn:"2001"
            · · └── LEAF id:4 ag-Grid-AutoColumn:undefined country:"Italy" year:"2001" athlete:"Marvin Minsky"
        `);

        const rows = gridRows.rowNodes;
        expect(rows.length).toBe(11);

        const rowsSnapshot = getRowsSnapshot(rows);

        expect(rows[0].data).toBeUndefined();
        expect(rows[1].data).toBeUndefined();
        expect(rows[2].data).toBe(rowData[0]);
        expect(rows[3].data).toBe(rowData[1]);
        expect(rows[4].data).toBeUndefined();
        expect(rows[5].data).toBe(rowData[2]);
        expect(rows[6].data).toBeUndefined();
        expect(rows[7].data).toBeUndefined();
        expect(rows[8].data).toBe(rowData[3]);
        expect(rows[9].data).toBeUndefined();
        expect(rows[10].data).toBe(rowData[4]);

        const expectedRowsSnapshots: RowSnapshot[] = [
            {
                allChildrenCount: 3,
                allLeafChildren: [null, null, null],
                childIndex: 0,
                childrenAfterFilter: ['2000', '2001'],
                childrenAfterGroup: ['2000', '2001'],
                childrenAfterSort: ['2000', '2001'],
                detail: undefined,
                displayed: true,
                expanded: true,
                firstChild: true,
                footer: undefined,
                group: true,
                groupData: { 'ag-Grid-AutoColumn': 'Ireland' },
                id: 'row-group-country-Ireland',
                key: 'Ireland',
                lastChild: false,
                leafGroup: false,
                level: 0,
                master: false,
                parentKey: null,
                rowGroupIndex: 0,
                rowPinned: undefined,
                selectable: true,
                siblingKey: undefined,
                uiLevel: 0,
                rowIndex: 0,
            },
            {
                allChildrenCount: 2,
                allLeafChildren: [null, null],
                childIndex: 0,
                childrenAfterFilter: [null, null],
                childrenAfterGroup: [null, null],
                childrenAfterSort: [null, null],
                detail: undefined,
                displayed: true,
                expanded: true,
                firstChild: true,
                footer: undefined,
                group: true,
                groupData: { 'ag-Grid-AutoColumn': '2000' },
                id: 'row-group-country-Ireland-year-2000',
                key: '2000',
                lastChild: false,
                leafGroup: true,
                level: 1,
                master: false,
                parentKey: 'Ireland',
                rowGroupIndex: 1,
                rowPinned: undefined,
                selectable: true,
                siblingKey: undefined,
                uiLevel: 1,
                rowIndex: 1,
            },
            {
                allChildrenCount: undefined,
                allLeafChildren: undefined,
                childIndex: 0,
                childrenAfterFilter: undefined,
                childrenAfterGroup: undefined,
                childrenAfterSort: undefined,
                detail: undefined,
                displayed: true,
                expanded: false,
                firstChild: true,
                footer: undefined,
                group: false,
                groupData: undefined,
                id: '0',
                key: null,
                lastChild: false,
                leafGroup: undefined,
                level: 2,
                master: false,
                parentKey: '2000',
                rowGroupIndex: undefined,
                rowPinned: undefined,
                selectable: true,
                siblingKey: undefined,
                uiLevel: 2,
                rowIndex: 2,
            },
            {
                allChildrenCount: undefined,
                allLeafChildren: undefined,
                childIndex: 1,
                childrenAfterFilter: undefined,
                childrenAfterGroup: undefined,
                childrenAfterSort: undefined,
                detail: undefined,
                displayed: true,
                expanded: false,
                firstChild: false,
                footer: undefined,
                group: false,
                groupData: undefined,
                id: '1',
                key: null,
                lastChild: true,
                leafGroup: undefined,
                level: 2,
                master: false,
                parentKey: '2000',
                rowGroupIndex: undefined,
                rowPinned: undefined,
                selectable: true,
                siblingKey: undefined,
                uiLevel: 2,
                rowIndex: 3,
            },
            {
                allChildrenCount: 1,
                allLeafChildren: [null],
                childIndex: 1,
                childrenAfterFilter: [null],
                childrenAfterGroup: [null],
                childrenAfterSort: [null],
                detail: undefined,
                displayed: true,
                expanded: true,
                firstChild: false,
                footer: undefined,
                group: true,
                groupData: { 'ag-Grid-AutoColumn': '2001' },
                id: 'row-group-country-Ireland-year-2001',
                key: '2001',
                lastChild: true,
                leafGroup: true,
                level: 1,
                master: false,
                parentKey: 'Ireland',
                rowGroupIndex: 1,
                rowPinned: undefined,
                selectable: true,
                siblingKey: undefined,
                uiLevel: 1,
                rowIndex: 4,
            },
            {
                allChildrenCount: undefined,
                allLeafChildren: undefined,
                childIndex: 0,
                childrenAfterFilter: undefined,
                childrenAfterGroup: undefined,
                childrenAfterSort: undefined,
                detail: undefined,
                displayed: true,
                expanded: false,
                firstChild: true,
                footer: undefined,
                group: false,
                groupData: undefined,
                id: '2',
                key: null,
                lastChild: true,
                leafGroup: undefined,
                level: 2,
                master: false,
                parentKey: '2001',
                rowGroupIndex: undefined,
                rowPinned: undefined,
                selectable: true,
                siblingKey: undefined,
                uiLevel: 2,
                rowIndex: 5,
            },
            {
                allChildrenCount: 2,
                allLeafChildren: [null, null],
                childIndex: 1,
                childrenAfterFilter: ['2000', '2001'],
                childrenAfterGroup: ['2000', '2001'],
                childrenAfterSort: ['2000', '2001'],
                detail: undefined,
                displayed: true,
                expanded: true,
                firstChild: false,
                footer: undefined,
                group: true,
                groupData: { 'ag-Grid-AutoColumn': 'Italy' },
                id: 'row-group-country-Italy',
                key: 'Italy',
                lastChild: true,
                leafGroup: false,
                level: 0,
                master: false,
                parentKey: null,
                rowGroupIndex: 0,
                rowPinned: undefined,
                selectable: true,
                siblingKey: undefined,
                uiLevel: 0,
                rowIndex: 6,
            },
            {
                allChildrenCount: 1,
                allLeafChildren: [null],
                childIndex: 0,
                childrenAfterFilter: [null],
                childrenAfterGroup: [null],
                childrenAfterSort: [null],
                detail: undefined,
                displayed: true,
                expanded: true,
                firstChild: true,
                footer: undefined,
                group: true,
                groupData: { 'ag-Grid-AutoColumn': '2000' },
                id: 'row-group-country-Italy-year-2000',
                key: '2000',
                lastChild: false,
                leafGroup: true,
                level: 1,
                master: false,
                parentKey: 'Italy',
                rowGroupIndex: 1,
                rowPinned: undefined,
                selectable: true,
                siblingKey: undefined,
                uiLevel: 1,
                rowIndex: 7,
            },
            {
                allChildrenCount: undefined,
                allLeafChildren: undefined,
                childIndex: 0,
                childrenAfterFilter: undefined,
                childrenAfterGroup: undefined,
                childrenAfterSort: undefined,
                detail: undefined,
                displayed: true,
                expanded: false,
                firstChild: true,
                footer: undefined,
                group: false,
                groupData: undefined,
                id: '3',
                key: null,
                lastChild: true,
                leafGroup: undefined,
                level: 2,
                master: false,
                parentKey: '2000',
                rowGroupIndex: undefined,
                rowPinned: undefined,
                selectable: true,
                siblingKey: undefined,
                uiLevel: 2,
                rowIndex: 8,
            },
            {
                allChildrenCount: 1,
                allLeafChildren: [null],
                childIndex: 1,
                childrenAfterFilter: [null],
                childrenAfterGroup: [null],
                childrenAfterSort: [null],
                detail: undefined,
                displayed: true,
                expanded: true,
                firstChild: false,
                footer: undefined,
                group: true,
                groupData: { 'ag-Grid-AutoColumn': '2001' },
                id: 'row-group-country-Italy-year-2001',
                key: '2001',
                lastChild: true,
                leafGroup: true,
                level: 1,
                master: false,
                parentKey: 'Italy',
                rowGroupIndex: 1,
                rowPinned: undefined,
                selectable: true,
                siblingKey: undefined,
                uiLevel: 1,
                rowIndex: 9,
            },
            {
                allChildrenCount: undefined,
                allLeafChildren: undefined,
                childIndex: 0,
                childrenAfterFilter: undefined,
                childrenAfterGroup: undefined,
                childrenAfterSort: undefined,
                detail: undefined,
                displayed: true,
                expanded: false,
                firstChild: true,
                footer: undefined,
                group: false,
                groupData: undefined,
                id: '4',
                key: null,
                lastChild: true,
                leafGroup: undefined,
                level: 2,
                master: false,
                parentKey: '2001',
                rowGroupIndex: undefined,
                rowPinned: undefined,
                selectable: true,
                siblingKey: undefined,
                uiLevel: 2,
                rowIndex: 10,
            },
        ];

        expect(rowsSnapshot).toMatchObject(expectedRowsSnapshots);
    });

    test('can change an entire group without row id', async () => {
        const gridOptions: GridOptions = {
            columnDefs: [
                { field: 'name' },
                { field: 'country', rowGroup: true, hide: true },
                { field: 'year', rowGroup: true, hide: true },
            ],
            groupDefaultExpanded: -1,
        };

        const api = gridsManager.createGrid('myGrid', gridOptions);

        api.setGridOption('rowData', [
            { id: '0', country: 'Ireland', year: 2000, name: 'John Von Neumann' },
            { id: '1', country: 'Ireland', year: 2000, name: 'Ada Lovelace' },
            { id: '2', country: 'Ireland', year: 2001, name: 'Alan Turing' },
            { id: '3', country: 'Italy', year: 2000, name: 'Donald Knuth' },
            { id: '4', country: 'Italy', year: 2001, name: 'Marvin Minsky' },
        ]);

        const gridRowsOptions: GridRowsOptions = {
            columns: ['country', 'year', 'name'],
            printHiddenRows: true,
            checkDom: true,
        };

        let gridRows = new GridRows(api, 'first', gridRowsOptions);
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ filler id:row-group-country-Ireland
            │ ├─┬ filler id:row-group-country-Ireland-year-2000
            │ │ ├── LEAF id:0 name:"John Von Neumann" country:"Ireland" year:2000
            │ │ └── LEAF id:1 name:"Ada Lovelace" country:"Ireland" year:2000
            │ └─┬ filler id:row-group-country-Ireland-year-2001
            │ · └── LEAF id:2 name:"Alan Turing" country:"Ireland" year:2001
            └─┬ filler id:row-group-country-Italy
            · ├─┬ filler id:row-group-country-Italy-year-2000
            · │ └── LEAF id:3 name:"Donald Knuth" country:"Italy" year:2000
            · └─┬ filler id:row-group-country-Italy-year-2001
            · · └── LEAF id:4 name:"Marvin Minsky" country:"Italy" year:2001
        `);

        api.setGridOption('rowData', [
            { id: '0', country: 'Germany', year: 2000, name: 'John Von Neumann' },
            { id: '1', country: 'Germany', year: 2000, name: 'Ada Lovelace' },
            { id: '2', country: 'Germany', year: 2001, name: 'Alan Turing' },
            { id: '3', country: 'Italy', year: 2000, name: 'Donald Knuth' },
            { id: '4', country: 'Italy', year: 2001, name: 'Marvin Minsky' },
        ]);

        gridRows = new GridRows(api, 'update 1', gridRowsOptions);
        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ filler id:row-group-country-Germany
            │ ├─┬ filler id:row-group-country-Germany-year-2000
            │ │ ├── LEAF id:0 name:"John Von Neumann" country:"Germany" year:2000
            │ │ └── LEAF id:1 name:"Ada Lovelace" country:"Germany" year:2000
            │ └─┬ filler id:row-group-country-Germany-year-2001
            │ · └── LEAF id:2 name:"Alan Turing" country:"Germany" year:2001
            └─┬ filler id:row-group-country-Italy
            · ├─┬ filler id:row-group-country-Italy-year-2000
            · │ └── LEAF id:3 name:"Donald Knuth" country:"Italy" year:2000
            · └─┬ filler id:row-group-country-Italy-year-2001
            · · └── LEAF id:4 name:"Marvin Minsky" country:"Italy" year:2001
        `);
    });

    test('initializing columns after rowData with grouping module registered', async () => {
        let rowDataUpdated = 0;
        let modelUpdated = 0;
        const gridOptions: GridOptions = {
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
            { id: '1', value: 1, x: 10 },
            { id: '2', value: 2, x: 20 },
            { id: '3', value: 3, x: 30 },
        ]);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(0);
        expect(modelUpdated).toBe(0);

        await new GridRows(api, 'empty', gridRowsOptions).check('empty');

        api.setGridOption('columnDefs', [{ field: 'value' }]);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(1);
        expect(modelUpdated).toBe(1);

        await new GridRows(api, 'data', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID
            ├── LEAF id:1 value:1
            ├── LEAF id:2 value:2
            └── LEAF id:3 value:3
        `);

        api.setGridOption('columnDefs', [{ field: 'value' }, { field: 'x' }]);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(1);
        expect(modelUpdated).toBe(2);

        await new GridRows(api, 'data', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID
            ├── LEAF id:1 value:1 x:10
            ├── LEAF id:2 value:2 x:20
            └── LEAF id:3 value:3 x:30
        `);

        api.setGridOption('rowData', [
            { id: '1', value: 1, x: 10 },
            { id: '4', value: 4, x: 40 },
        ]);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(2);
        expect(modelUpdated).toBe(3);

        api.setGridOption('columnDefs', [{ field: 'x' }, { field: 'value' }]);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(2);
        expect(modelUpdated).toBe(4);

        await new GridRows(api, 'data', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID
            ├── LEAF id:1 x:10 value:1
            └── LEAF id:4 x:40 value:4
        `);
    });

    test('initializing columns after rowData with simple grouping', async () => {
        let rowDataUpdated = 0;
        let modelUpdated = 0;
        const gridOptions: GridOptions = {
            groupDefaultExpanded: -1,
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
            { id: '0', country: 'Ireland', year: '2000', sport: 'Sailing', athlete: 'John Von Neumann' },
            { id: '1', country: 'Ireland', year: '2000', sport: 'Soccer', athlete: 'Ada Lovelace' },
            { id: '2', country: 'Ireland', year: '2001', sport: 'Football', athlete: 'Alan Turing' },
            { id: '3', country: 'Italy', year: '2000', sport: 'Soccer', athlete: 'Donald Knuth' },
            { id: '4', country: 'Italy', year: '2001', sport: 'Football', athlete: 'Marvin Minsky' },
        ]);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(0);
        expect(modelUpdated).toBe(0);

        await new GridRows(api, 'empty', gridRowsOptions).check('empty');

        api.setGridOption('columnDefs', [
            { field: 'country', rowGroup: true, hide: true },
            { field: 'year', rowGroup: true, hide: true },
            { field: 'athlete' },
        ]);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(1);
        expect(modelUpdated).toBe(1);

        await new GridRows(api, 'data', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ filler id:row-group-country-Ireland ag-Grid-AutoColumn:"Ireland"
            │ ├─┬ filler id:row-group-country-Ireland-year-2000 ag-Grid-AutoColumn:"2000"
            │ │ ├── LEAF id:0 ag-Grid-AutoColumn:undefined country:"Ireland" year:"2000" athlete:"John Von Neumann"
            │ │ └── LEAF id:1 ag-Grid-AutoColumn:undefined country:"Ireland" year:"2000" athlete:"Ada Lovelace"
            │ └─┬ filler id:row-group-country-Ireland-year-2001 ag-Grid-AutoColumn:"2001"
            │ · └── LEAF id:2 ag-Grid-AutoColumn:undefined country:"Ireland" year:"2001" athlete:"Alan Turing"
            └─┬ filler id:row-group-country-Italy ag-Grid-AutoColumn:"Italy"
            · ├─┬ filler id:row-group-country-Italy-year-2000 ag-Grid-AutoColumn:"2000"
            · │ └── LEAF id:3 ag-Grid-AutoColumn:undefined country:"Italy" year:"2000" athlete:"Donald Knuth"
            · └─┬ filler id:row-group-country-Italy-year-2001 ag-Grid-AutoColumn:"2001"
            · · └── LEAF id:4 ag-Grid-AutoColumn:undefined country:"Italy" year:"2001" athlete:"Marvin Minsky"
        `);
    });

    test('initializing columns after initializing with a transaction with grouping module registered', async () => {
        let rowDataUpdated = 0;
        let modelUpdated = 0;
        const gridOptions: GridOptions = {
            getRowId: (params) => params.data.id,
            onRowDataUpdated: () => ++rowDataUpdated,
            onModelUpdated: () => ++modelUpdated,
        };

        const gridRowsOptions: GridRowsOptions = {
            checkDom: true,
            columns: ['value'],
        };

        const api = gridsManager.createGrid('myGrid', gridOptions);

        api.applyTransaction({
            add: [
                { id: '1', value: 0 },
                { id: '2', value: 2 },
            ],
        });

        api.applyTransaction({
            update: [{ id: '1', value: 1 }],
            add: [{ id: '3', value: 3 }],
        });

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(0);
        expect(modelUpdated).toBe(0);

        await new GridRows(api, 'data', gridRowsOptions).check('empty');

        api.setGridOption('columnDefs', [{ field: 'value' }, { field: 'value' }]);

        await asyncSetTimeout(1);
        expect(rowDataUpdated).toBe(1);
        expect(modelUpdated).toBe(1);

        await new GridRows(api, 'data', gridRowsOptions).check(`
            ROOT id:ROOT_NODE_ID
            ├── LEAF id:1 value:1
            ├── LEAF id:2 value:2
            └── LEAF id:3 value:3
        `);
    });

    test('changing group columns updates the row groups', async () => {
        const rowData = [
            { id: 'A', x: 'a', z: 1, group: 'Group1' },
            { id: 'B', x: 'a-b', z: 2, group: 'Group1' },
            { id: 'C', x: 'c', z: 3, group: 'Group2' },
            { id: 'D', x: 'c-d', z: 4, group: 'Group2' },
            { id: 'E', x: 'e', z: 5, group: 'Group3' },
            { id: 'F', x: 'e-f', z: 6, group: 'Group3' },
            { id: 'G', x: 'e-f-g', z: 7, group: 'Group3' },
            { id: 'H', x: 'e-f-g-h', z: 8, group: 'Group3' },
        ];

        const api = gridsManager.createGrid('myGrid', {
            columnDefs: [{ field: 'group', rowGroup: true, hide: true }, { field: 'x' }, { field: 'z' }],
            animateRows: false,
            groupDefaultExpanded: -1,
            autoGroupColumnDef: { headerName: 'Group', colId: 'zzz' },
            rowData,
            getRowId: (params) => params.data.id,
        });

        const gridRowsOptions = {
            columns: true,
            checkDom: true,
        };

        const gridRows = new GridRows(api, 'data', gridRowsOptions);

        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ filler id:row-group-group-Group1 ag-Grid-AutoColumn:"Group1"
            │ ├── LEAF id:A ag-Grid-AutoColumn:undefined group:"Group1" x:"a" z:1
            │ └── LEAF id:B ag-Grid-AutoColumn:undefined group:"Group1" x:"a-b" z:2
            ├─┬ filler id:row-group-group-Group2 ag-Grid-AutoColumn:"Group2"
            │ ├── LEAF id:C ag-Grid-AutoColumn:undefined group:"Group2" x:"c" z:3
            │ └── LEAF id:D ag-Grid-AutoColumn:undefined group:"Group2" x:"c-d" z:4
            └─┬ filler id:row-group-group-Group3 ag-Grid-AutoColumn:"Group3"
            · ├── LEAF id:E ag-Grid-AutoColumn:undefined group:"Group3" x:"e" z:5
            · ├── LEAF id:F ag-Grid-AutoColumn:undefined group:"Group3" x:"e-f" z:6
            · ├── LEAF id:G ag-Grid-AutoColumn:undefined group:"Group3" x:"e-f-g" z:7
            · └── LEAF id:H ag-Grid-AutoColumn:undefined group:"Group3" x:"e-f-g-h" z:8
        `);

        api.updateGridOptions({
            autoGroupColumnDef: { headerName: 'Group', field: 'group', colId: 'xxx' },
        });

        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ filler id:row-group-group-Group1 ag-Grid-AutoColumn:"Group1"
            │ ├── LEAF id:A ag-Grid-AutoColumn:"Group1" group:"Group1" x:"a" z:1
            │ └── LEAF id:B ag-Grid-AutoColumn:"Group1" group:"Group1" x:"a-b" z:2
            ├─┬ filler id:row-group-group-Group2 ag-Grid-AutoColumn:"Group2"
            │ ├── LEAF id:C ag-Grid-AutoColumn:"Group2" group:"Group2" x:"c" z:3
            │ └── LEAF id:D ag-Grid-AutoColumn:"Group2" group:"Group2" x:"c-d" z:4
            └─┬ filler id:row-group-group-Group3 ag-Grid-AutoColumn:"Group3"
            · ├── LEAF id:E ag-Grid-AutoColumn:"Group3" group:"Group3" x:"e" z:5
            · ├── LEAF id:F ag-Grid-AutoColumn:"Group3" group:"Group3" x:"e-f" z:6
            · ├── LEAF id:G ag-Grid-AutoColumn:"Group3" group:"Group3" x:"e-f-g" z:7
            · └── LEAF id:H ag-Grid-AutoColumn:"Group3" group:"Group3" x:"e-f-g-h" z:8
        `);

        api.updateGridOptions({
            autoGroupColumnDef: { headerName: 'Group', field: 'z', colId: 'yyy' },
        });

        await gridRows.check(`
            ROOT id:ROOT_NODE_ID
            ├─┬ filler id:row-group-group-Group1 ag-Grid-AutoColumn:"Group1"
            │ ├── LEAF id:A ag-Grid-AutoColumn:1 group:"Group1" x:"a" z:1
            │ └── LEAF id:B ag-Grid-AutoColumn:2 group:"Group1" x:"a-b" z:2
            ├─┬ filler id:row-group-group-Group2 ag-Grid-AutoColumn:"Group2"
            │ ├── LEAF id:C ag-Grid-AutoColumn:3 group:"Group2" x:"c" z:3
            │ └── LEAF id:D ag-Grid-AutoColumn:4 group:"Group2" x:"c-d" z:4
            └─┬ filler id:row-group-group-Group3 ag-Grid-AutoColumn:"Group3"
            · ├── LEAF id:E ag-Grid-AutoColumn:5 group:"Group3" x:"e" z:5
            · ├── LEAF id:F ag-Grid-AutoColumn:6 group:"Group3" x:"e-f" z:6
            · ├── LEAF id:G ag-Grid-AutoColumn:7 group:"Group3" x:"e-f-g" z:7
            · └── LEAF id:H ag-Grid-AutoColumn:8 group:"Group3" x:"e-f-g-h" z:8
        `);
    });
});
