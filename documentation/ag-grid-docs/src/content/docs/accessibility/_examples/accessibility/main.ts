import type { GridApi, GridOptions } from 'ag-grid-community';
import {
    ClientSideRowModelModule,
    ModuleRegistry,
    NumberEditorModule,
    NumberFilterModule,
    TextEditorModule,
    ValidationModule,
    createGrid,
} from 'ag-grid-community';
import { ColumnMenuModule, ContextMenuModule, SetFilterModule } from 'ag-grid-enterprise';

ModuleRegistry.registerModules([
    NumberEditorModule,
    TextEditorModule,
    ClientSideRowModelModule,
    ColumnMenuModule,
    ContextMenuModule,
    SetFilterModule,
    NumberFilterModule,
    ...(process.env.NODE_ENV !== 'production' ? [ValidationModule] : []),
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
    columnDefs: [
        { field: 'athlete', minWidth: 150 },
        { field: 'age', minWidth: 50, filter: 'agNumberColumnFilter' },
        { field: 'country', width: 120 },
        { field: 'year', width: 90 },
        { field: 'date', width: 110 },
        { field: 'sport', width: 110 },
        { field: 'gold', width: 110 },
        { field: 'silver', width: 110 },
        { field: 'bronze', width: 110 },
    ],
    defaultColDef: {
        editable: true,
        flex: 1,
        minWidth: 100,
        filter: true,
    },
    ensureDomOrder: true,
    suppressColumnVirtualisation: true,
    suppressRowVirtualisation: true,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    gridApi = createGrid(gridDiv, gridOptions);

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then((response) => response.json())
        .then((data: IOlympicData[]) => gridApi!.setGridOption('rowData', data.slice(0, 600)));
});
