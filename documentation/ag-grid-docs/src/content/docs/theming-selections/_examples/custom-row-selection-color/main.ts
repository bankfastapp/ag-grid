import type { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, createGrid, themeQuartz } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz.withParams({
    // bright green, 10% opacity
    selectedRowBackgroundColor: 'rgba(0, 255, 0, 0.1)',

    // alternating row colors will be visible through the semi-transparent
    // selection background color
    oddRowBackgroundColor: '#8881',
});

const columnDefs: ColDef[] = [
    { field: 'athlete', minWidth: 170 },
    { field: 'age' },
    { field: 'country' },
    { field: 'year' },
    { field: 'date' },
    { field: 'sport' },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
    theme: myTheme,
    columnDefs: columnDefs,
    rowSelection: { mode: 'multiRow' },
    defaultColDef: {
        editable: true,
        filter: true,
    },
    onFirstDataRendered: (params) => {
        params.api.forEachNode((node) => {
            if (
                node.rowIndex === 2 ||
                node.rowIndex === 3 ||
                node.rowIndex === 4 ||
                node.rowIndex === 5 ||
                node.rowIndex === 6
            ) {
                node.setSelected(true);
            }
        });
    },
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    gridApi = createGrid(gridDiv, gridOptions);

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then((response) => response.json())
        .then((data: IOlympicData[]) => {
            gridApi.setGridOption('rowData', data);
        });
});
