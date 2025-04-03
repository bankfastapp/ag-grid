import React, { StrictMode, useCallback, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

import type { CellValueChangedEvent, ColDef, SideBarDef } from 'ag-grid-community';
import {
    ClientSideRowModelApiModule,
    ClientSideRowModelModule,
    EventApiModule,
    ModuleRegistry,
    NumberEditorModule,
    NumberFilterModule,
    RowApiModule,
    TextEditorModule,
    TextFilterModule,
    ValidationModule,
    iconOverrides,
    themeQuartz,
} from 'ag-grid-community';
import { ColumnsToolPanelModule, FiltersToolPanelModule, SetFilterModule } from 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';

import CustomStatsToolPanel from './customStatsToolPanel';
import type { IOlympicData } from './interfaces';

ModuleRegistry.registerModules([
    ClientSideRowModelApiModule,
    NumberEditorModule,
    TextEditorModule,
    TextFilterModule,
    NumberFilterModule,
    ClientSideRowModelModule,
    ColumnsToolPanelModule,
    FiltersToolPanelModule,
    SetFilterModule,
    RowApiModule,
    EventApiModule,
    ...(process.env.NODE_ENV !== 'production' ? [ValidationModule] : []),
]);

const myTheme = themeQuartz.withPart(
    iconOverrides({
        type: 'image',
        mask: true,
        icons: {
            // map of icon names to images
            'custom-stats': {
                svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><g stroke="#7F8C8D" fill="none" fill-rule="evenodd"><path d="M10.5 6V4.5h-5v.532a1 1 0 0 0 .36.768l1.718 1.432a1 1 0 0 1 0 1.536L5.86 10.2a1 1 0 0 0-.36.768v.532h5V10"/><rect x="1.5" y="1.5" width="13" height="13" rx="2"/></g></svg>',
            },
        },
    })
);

const GridExample = () => {
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: 'athlete', width: 150, filter: 'agTextColumnFilter' },
        { field: 'age', width: 90 },
        { field: 'country', width: 120 },
        { field: 'year', width: 90 },
        { field: 'date', width: 110 },
        { field: 'gold', width: 100, filter: false },
        { field: 'silver', width: 100, filter: false },
        { field: 'bronze', width: 100, filter: false },
        { field: 'total', width: 100, filter: false },
    ]);
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            editable: true,
            flex: 1,
            minWidth: 100,
            filter: true,
        };
    }, []);
    const icons = useMemo<{
        [key: string]: ((...args: any[]) => any) | string;
    }>(() => {
        return {
            'custom-stats': '<span class="ag-icon ag-icon-custom-stats"></span>',
        };
    }, []);
    const sideBar = useMemo<SideBarDef | string | string[] | boolean | null>(() => {
        return {
            toolPanels: [
                {
                    id: 'columns',
                    labelDefault: 'Columns',
                    labelKey: 'columns',
                    iconKey: 'columns',
                    toolPanel: 'agColumnsToolPanel',
                },
                {
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                },
                {
                    id: 'customStats',
                    labelDefault: 'Custom Stats',
                    labelKey: 'customStats',
                    iconKey: 'custom-stats',
                    toolPanel: CustomStatsToolPanel,
                    toolPanelParams: {
                        title: 'Custom Stats',
                    },
                },
            ],
            defaultToolPanel: 'customStats',
        };
    }, []);

    const { data, loading } = useFetchJson<IOlympicData>('https://www.ag-grid.com/example-assets/olympic-winners.json');

    const onCellValueChanged = useCallback((params: CellValueChangedEvent) => {
        params.api.refreshClientSideRowModel();
    }, []);

    return (
        <div style={containerStyle}>
            <div style={{ height: '100%', boxSizing: 'border-box' }}>
                <div style={gridStyle}>
                    <AgGridReact<IOlympicData>
                        theme={myTheme}
                        rowData={data}
                        loading={loading}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        icons={icons}
                        sideBar={sideBar}
                        onCellValueChanged={onCellValueChanged}
                    />
                </div>
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(
    <StrictMode>
        <GridExample />
    </StrictMode>
);
