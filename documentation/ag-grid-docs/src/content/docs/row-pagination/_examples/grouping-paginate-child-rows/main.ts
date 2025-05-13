import type { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import {
    ClientSideRowModelModule,
    ModuleRegistry,
    PaginationModule,
    ValidationModule,
    createGrid,
} from 'ag-grid-community';
import { RowGroupingModule } from 'ag-grid-enterprise';

ModuleRegistry.registerModules([
    PaginationModule,
    ClientSideRowModelModule,
    RowGroupingModule,
    ...(process.env.NODE_ENV !== 'production' ? [ValidationModule] : []),
]);

const columnDefs: ColDef[] = [
    { field: 'athlete' },
    { field: 'age' },
    { field: 'country', rowGroup: true },
    { field: 'year', rowGroup: true },
    { field: 'date' },
    { field: 'sport', rowGroup: true },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
    columnDefs: columnDefs,
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50, 100],
    paginateChildRows: true,
    defaultColDef: {
        flex: 1,
        minWidth: 190,
    },
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    gridApi = createGrid(gridDiv, gridOptions);

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then((response) => response.json())
        .then((data: IOlympicData[]) => gridApi!.setGridOption('rowData', data));
});
