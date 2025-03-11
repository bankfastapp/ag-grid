import type { GridApi, GridOptions } from 'ag-grid-community';
import { ClientSideRowModelModule, ModuleRegistry, ValidationModule, createGrid } from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';

import { getData } from './data';

ModuleRegistry.registerModules([ClientSideRowModelModule, TreeDataModule, ValidationModule /* Development Only */]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
    columnDefs: [
        {
            headerName: 'Aggregated (Sum)',
            aggFunc: 'sum',
            field: 'items',
        },
        {
            headerName: 'Provided',
            field: 'items',
        },
    ],
    defaultColDef: {
        flex: 1,
    },
    autoGroupColumnDef: {
        headerName: 'Name',
        field: 'name',
        cellRendererParams: {
            suppressCount: true,
        },
    },
    rowData: getData(),
    getRowId: (params) => params.data.id, // This is required
    treeData: true, // enable Tree Data mode
    treeDataParentIdField: 'parentId', // the field that points to the parent row id
    groupDefaultExpanded: -1, // expand all groups by default
};

// wait for the document to be loaded, otherwise
// AG Grid will not find the div in the document.
document.addEventListener('DOMContentLoaded', function () {
    // lookup the container we want the Grid to use
    const eGridDiv = document.querySelector<HTMLElement>('#myGrid')!;

    // create the grid passing in the div to use together with the columns & data we want to use
    gridApi = createGrid(eGridDiv, gridOptions);
});
