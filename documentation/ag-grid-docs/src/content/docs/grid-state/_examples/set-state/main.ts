import type { GridApi, GridOptions, GridPreDestroyedEvent, GridState, StateUpdatedEvent } from 'ag-grid-community';
import {
    ClientSideRowModelModule,
    GridStateModule,
    ModuleRegistry,
    NumberFilterModule,
    PaginationModule,
    RowSelectionModule,
    ValidationModule,
    createGrid,
} from 'ag-grid-community';
import {
    CellSelectionModule,
    ColumnsToolPanelModule,
    FiltersToolPanelModule,
    PivotModule,
    SetFilterModule,
} from 'ag-grid-enterprise';

ModuleRegistry.registerModules([
    NumberFilterModule,
    GridStateModule,
    PaginationModule,
    ClientSideRowModelModule,
    ColumnsToolPanelModule,
    FiltersToolPanelModule,
    RowSelectionModule,
    CellSelectionModule,
    SetFilterModule,
    PivotModule,
    ...(process.env.NODE_ENV !== 'production' ? [ValidationModule] : []),
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
    columnDefs: [
        {
            field: 'athlete',
            minWidth: 150,
        },
        { field: 'age', maxWidth: 90 },
        { field: 'country', minWidth: 150 },
        { field: 'year', maxWidth: 90 },
        { field: 'date', minWidth: 150 },
        { field: 'sport', minWidth: 150 },
        { field: 'gold' },
        { field: 'silver' },
        { field: 'bronze' },
        { field: 'total' },
    ],
    defaultColDef: {
        flex: 1,
        minWidth: 100,
        filter: true,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
    },
    sideBar: true,
    pagination: true,
    rowSelection: { mode: 'multiRow' },
    suppressColumnMoveAnimation: true,
    onGridPreDestroyed: onGridPreDestroyed,
    onStateUpdated: onStateUpdated,
};

function onGridPreDestroyed(event: GridPreDestroyedEvent<IOlympicData>): void {
    console.log('Grid state on destroy (can be persisted)', event.state);
}

function onStateUpdated(event: StateUpdatedEvent<IOlympicData>): void {
    console.log('State updated', event.state);
}

function reloadGrid() {
    gridApi.destroy();

    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;

    gridApi = createGrid(gridDiv, gridOptions);

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then((response) => response.json())
        .then((data) => gridApi.setGridOption('rowData', data));
}

function printState() {
    console.log('Grid state', gridApi.getState());
}

let savedState: GridState | undefined;

function saveState() {
    savedState = gridApi.getState();
    console.log('Saved state', savedState);
}

function setState() {
    if (savedState) {
        gridApi.setState(savedState);
        console.log('Set state', savedState);
    }
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    gridApi = createGrid(gridDiv, gridOptions);

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then((response) => response.json())
        .then((data: IOlympicData[]) => gridApi!.setGridOption('rowData', data));
});
