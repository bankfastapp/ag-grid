import type { ColDef, GridApi, GridOptions, INumberFilterParams, ValueFormatterParams } from 'ag-grid-community';
import {
    ClientSideRowModelModule,
    ModuleRegistry,
    NumberFilterModule,
    ValidationModule,
    createGrid,
} from 'ag-grid-community';

import { getData } from './data';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    NumberFilterModule,
    ...(process.env.NODE_ENV !== 'production' ? [ValidationModule] : []),
]);

const numberValueFormatter = function (params: ValueFormatterParams) {
    return params.value.toFixed(2);
};

const saleFilterParams: INumberFilterParams = {
    allowedCharPattern: '\\d\\-\\,\\$',
    numberParser: (text: string | null) => {
        return text == null ? null : parseFloat(text.replace(',', '.').replace('$', ''));
    },
    numberFormatter: (value: number | null) => {
        return value == null ? null : value.toString().replace('.', ',');
    },
};

const saleValueFormatter = function (params: ValueFormatterParams) {
    const formatted = params.value.toFixed(2).replace('.', ',');

    if (formatted.indexOf('-') === 0) {
        return '-$' + formatted.slice(1);
    }

    return '$' + formatted;
};

const columnDefs: ColDef[] = [
    {
        field: 'sale',
        headerName: 'Sale ($)',
        floatingFilter: true,
        valueFormatter: numberValueFormatter,
    },
    {
        field: 'sale',
        headerName: 'Sale',
        floatingFilter: true,
        filterParams: saleFilterParams,
        valueFormatter: saleValueFormatter,
    },
];

let gridApi: GridApi;

const gridOptions: GridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        flex: 1,
        minWidth: 150,
        filter: true,
    },
    rowData: getData(),
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    gridApi = createGrid(gridDiv, gridOptions);
});
