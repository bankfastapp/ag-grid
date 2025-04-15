import type { GridApi, GridOptions } from 'ag-grid-community';
import {
    CellStyleModule,
    ClientSideRowModelModule,
    ModuleRegistry,
    ValidationModule,
    createGrid,
} from 'ag-grid-community';

import { CompanyLogoRenderer } from './companyLogoRenderer_typescript';
import { CompanyRenderer } from './companyRenderer_typescript';
import { CustomButtonComponent } from './customButtonComponent_typescript';
import { MissionResultRenderer } from './missionResultRenderer_typescript';
import { PriceRenderer } from './priceRenderer_typescript';

ModuleRegistry.registerModules([
    CellStyleModule,
    ClientSideRowModelModule,
    ...(process.env.NODE_ENV !== 'production' ? [ValidationModule] : []),
]);

// Grid API: Access to Grid API methods
let gridApi: GridApi;

// Row Data Interface
interface IRow {
    company: string;
    website: string;
    revenue: number;
    hardware: boolean;
}

const gridOptions: GridOptions<IRow> = {
    defaultColDef: {
        flex: 10,
    },
    // Columns to be displayed (Should match rowData properties)
    columnDefs: [
        {
            field: 'company',
            flex: 6,
        },
        {
            field: 'website',
            cellRenderer: CompanyRenderer,
        },
        {
            headerName: 'Logo',
            field: 'company',
            cellRenderer: CompanyLogoRenderer,
            cellClass: 'logoCell',
            minWidth: 100,
        },
        {
            field: 'revenue',
            cellRenderer: PriceRenderer,
        },
        {
            field: 'hardware',
            cellRenderer: MissionResultRenderer,
        },
        {
            colId: 'actions',
            headerName: 'Actions',
            cellRenderer: CustomButtonComponent,
        },
    ],
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    gridApi = createGrid(gridDiv, gridOptions);

    fetch('https://www.ag-grid.com/example-assets/small-company-data.json')
        .then((response) => response.json())
        .then((data) => {
            gridApi!.setGridOption('rowData', data);
        });
});
