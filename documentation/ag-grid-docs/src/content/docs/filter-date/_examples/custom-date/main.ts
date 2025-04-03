import type { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import {
    ClientSideRowModelModule,
    DateFilterModule,
    ModuleRegistry,
    TextFilterModule,
    ValidationModule,
    createGrid,
} from 'ag-grid-community';

import { CustomDateComponent } from './customDateComponent_typescript';

ModuleRegistry.registerModules([
    TextFilterModule,
    ClientSideRowModelModule,
    DateFilterModule,
    ...(process.env.NODE_ENV !== 'production' ? [ValidationModule] : []),
]);

const columnDefs: ColDef[] = [
    { field: 'athlete' },
    { field: 'country' },
    {
        field: 'date',
        minWidth: 190,
        dateComponent: CustomDateComponent,
    },
    { field: 'sport' },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
    defaultColDef: {
        flex: 1,
        minWidth: 100,
        filter: true,
        floatingFilter: true,
    },
    columnDefs: columnDefs,
    rowData: null,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    gridApi = createGrid(gridDiv, gridOptions);

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then((response) => response.json())
        .then((data) => {
            gridApi!.setGridOption(
                'rowData',
                data.map((row: IOlympicData) => {
                    const dateParts = (row.date as any).split('/');
                    const date = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
                    return {
                        ...row,
                        date,
                    };
                })
            );
        });
});
