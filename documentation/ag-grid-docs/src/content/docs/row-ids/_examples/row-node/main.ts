import type { ColDef, GetRowIdParams, GridApi, GridOptions } from 'ag-grid-community';
import {
    ClientSideRowModelModule,
    ModuleRegistry,
    RowApiModule,
    ValidationModule,
    createGrid,
} from 'ag-grid-community';

ModuleRegistry.registerModules([
    RowApiModule,
    ClientSideRowModelModule,
    ...(process.env.NODE_ENV !== 'production' ? [ValidationModule] : []),
]);

const columnDefs: ColDef[] = [
    { field: 'id', headerName: 'Row ID' },
    { field: 'make' },
    { field: 'model' },
    { field: 'price' },
];

// specify the data
const rowData = [
    { id: 'c1', make: 'Toyota', model: 'Celica', price: 35000 },
    { id: 'c2', make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: 'c8', make: 'Porsche', model: 'Boxster', price: 72000 },
    { id: 'c4', make: 'BMW', model: 'M50', price: 60000 },
    { id: 'c14', make: 'Aston Martin', model: 'DBX', price: 190000 },
];

function getAllRows() {
    gridApi!.forEachNode((rowNode) => {
        console.log(`=============== ROW ${rowNode.rowIndex}`);
        console.log(`id = ${rowNode.id}`);
        console.log(`rowIndex = ${rowNode.rowIndex}`);
        console.log(`data = ${JSON.stringify(rowNode.data)}`);
        console.log(`group = ${rowNode.group}`);
        console.log(`height = ${rowNode.rowHeight}px`);
        console.log(`isSelected = ${rowNode.isSelected()}`);
    });
}

function getRowById() {
    const rowNode = gridApi!.getRowNode('c2');
    if (rowNode && rowNode.id == 'c2') {
        console.log(`################ Got Row Node C2`);
        console.log(`data = ${JSON.stringify(rowNode.data)}`);
    }
}

let gridApi: GridApi;

// let the grid know which columns and what data to use
const gridOptions: GridOptions = {
    columnDefs,
    defaultColDef: {
        flex: 1,
    },
    rowData,
    getRowId: (params: GetRowIdParams) => String(params.data.id),
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    gridApi = createGrid(gridDiv, gridOptions);
});
