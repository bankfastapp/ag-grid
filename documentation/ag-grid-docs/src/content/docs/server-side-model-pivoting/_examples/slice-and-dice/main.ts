import type { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import {
    CustomFilterModule,
    IServerSideDatasource,
    ModuleRegistry,
    NumberFilterModule,
    ValidationModule,
    createGrid,
} from 'ag-grid-community';
import {
    ColumnMenuModule,
    ColumnsToolPanelModule,
    ContextMenuModule,
    FiltersToolPanelModule,
    RowGroupingModule,
    RowGroupingPanelModule,
    ServerSideRowModelModule,
    SetFilterModule,
} from 'ag-grid-enterprise';

import { getCountries } from './countries';
import { CustomAgeFilter } from './customAgeFilter';
import { createFakeServer, createServerSideDatasource } from './server';

ModuleRegistry.registerModules([
    NumberFilterModule,
    ColumnsToolPanelModule,
    FiltersToolPanelModule,
    ColumnMenuModule,
    ContextMenuModule,
    CustomFilterModule,
    RowGroupingModule,
    ServerSideRowModelModule,
    SetFilterModule,
    RowGroupingPanelModule,
    ...(process.env.NODE_ENV !== 'production' ? [ValidationModule] : []),
]);

const countries = getCountries();

const columnDefs: ColDef[] = [
    { field: 'athlete', enableRowGroup: true, filter: false },
    {
        field: 'age',
        enableRowGroup: true,
        enablePivot: true,
        filter: CustomAgeFilter,
    },
    {
        field: 'country',
        enableRowGroup: true,
        enablePivot: true,
        rowGroup: true,
        hide: true,
        filter: 'agSetColumnFilter',
        filterParams: { values: countries },
    },
    {
        field: 'year',
        enableRowGroup: true,
        enablePivot: true,
        rowGroup: true,
        hide: true,
        filter: 'agSetColumnFilter',
        filterParams: {
            values: ['2000', '2002', '2004', '2006', '2008', '2010', '2012'],
        },
    },
    { field: 'sport', enableRowGroup: true, enablePivot: true, filter: false },
    { field: 'gold', aggFunc: 'sum', filter: false, enableValue: true },
    { field: 'silver', aggFunc: 'sum', filter: false, enableValue: true },
    { field: 'bronze', aggFunc: 'sum', filter: false, enableValue: true },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
    defaultColDef: {
        flex: 1,
        minWidth: 150,
        // restrict what aggregation functions the columns can have,
        // include a custom function 'random' that just returns a
        // random number
        allowedAggFuncs: ['sum', 'min', 'max', 'random'],
        filter: true,
    },
    autoGroupColumnDef: {
        width: 180,
    },
    columnDefs: columnDefs,
    rowModelType: 'serverSide',
    rowGroupPanelShow: 'always',
    pivotPanelShow: 'always',
    sideBar: true,
    maxConcurrentDatasourceRequests: 1,
    maxBlocksInCache: 2,
    purgeClosedRowNodes: true,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    gridApi = createGrid(gridDiv, gridOptions);

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then((response) => response.json())
        .then(function (data) {
            const fakeServer = createFakeServer(data);
            const datasource = createServerSideDatasource(fakeServer);
            gridApi!.setGridOption('serverSideDatasource', datasource);
        });
});
