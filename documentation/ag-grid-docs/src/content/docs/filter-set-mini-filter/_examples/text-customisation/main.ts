import type { GridApi, GridOptions } from 'ag-grid-community';
import {
    ClientSideRowModelModule,
    LocaleModule,
    ModuleRegistry,
    NumberFilterModule,
    ValidationModule,
    createGrid,
} from 'ag-grid-community';
import { ColumnMenuModule, ContextMenuModule, SetFilterModule } from 'ag-grid-enterprise';

ModuleRegistry.registerModules([
    LocaleModule,
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
        // set filters
        { field: 'athlete', filter: 'agSetColumnFilter' },
        { field: 'country', filter: 'agSetColumnFilter' },

        // number filters
        { field: 'gold', filter: 'agNumberColumnFilter' },
        { field: 'silver', filter: 'agNumberColumnFilter' },
        { field: 'bronze', filter: 'agNumberColumnFilter' },
    ],
    defaultColDef: {
        flex: 1,
        minWidth: 200,
        floatingFilter: true,
    },
    localeText: {
        searchOoo: 'Search values...',
        noMatches: 'No matches could be found.',
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
