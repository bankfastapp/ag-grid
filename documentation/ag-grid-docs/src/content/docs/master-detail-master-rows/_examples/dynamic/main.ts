import type { FirstDataRenderedEvent, GridApi, GridOptions, IDetailCellRendererParams } from 'ag-grid-community';
import {
    ClientSideRowModelModule,
    ModuleRegistry,
    RowApiModule,
    ValidationModule,
    createGrid,
} from 'ag-grid-community';
import { ColumnMenuModule, ColumnsToolPanelModule, ContextMenuModule, MasterDetailModule } from 'ag-grid-enterprise';

ModuleRegistry.registerModules([
    RowApiModule,
    ClientSideRowModelModule,
    ColumnsToolPanelModule,
    MasterDetailModule,
    ColumnMenuModule,
    ContextMenuModule,
    ...(process.env.NODE_ENV !== 'production' ? [ValidationModule] : []),
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
    masterDetail: true,
    isRowMaster: (dataItem: any) => {
        return dataItem ? dataItem.callRecords.length > 0 : false;
    },
    columnDefs: [
        // group cell renderer needed for expand / collapse icons
        { field: 'name', cellRenderer: 'agGroupCellRenderer' },
        { field: 'account' },
        { field: 'calls' },
        { field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'" },
    ],
    defaultColDef: {
        flex: 1,
    },
    detailCellRendererParams: {
        detailGridOptions: {
            columnDefs: [
                { field: 'callId' },
                { field: 'direction' },
                { field: 'number', minWidth: 150 },
                { field: 'duration', valueFormatter: "x.toLocaleString() + 's'" },
                { field: 'switchCode', minWidth: 150 },
            ],
            defaultColDef: {
                flex: 1,
            },
        },
        getDetailRowData: function (params) {
            params.successCallback(params.data.callRecords);
        },
    } as IDetailCellRendererParams<IAccount, ICallRecord>,
    onFirstDataRendered: onFirstDataRendered,
};

function onFirstDataRendered(params: FirstDataRenderedEvent) {
    // arbitrarily expand a row for presentational purposes
    setTimeout(() => {
        params.api.getDisplayedRowAtIndex(1)!.setExpanded(true);
    }, 0);
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    gridApi = createGrid(gridDiv, gridOptions);

    fetch('https://www.ag-grid.com/example-assets/master-detail-dynamic-data.json')
        .then((response) => response.json())
        .then(function (data) {
            gridApi!.setGridOption('rowData', data);
        });
});
