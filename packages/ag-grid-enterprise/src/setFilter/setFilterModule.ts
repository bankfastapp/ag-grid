import type { FilterWrapperParams, _ModuleWithoutApi } from 'ag-grid-community';
import { _ColumnFilterModule } from 'ag-grid-community';

import { EnterpriseCoreModule } from '../agGridEnterpriseModule';
import { VERSION } from '../version';
import { SetFilter } from './setFilter';
import { SetFilterHandler } from './setFilterHandler';
import { applyExcelModeOptions } from './setFilterUtils';
import { SetFloatingFilterComp } from './setFloatingFilter';

/**
 * @feature Filtering -> Set Filter
 */
export const SetFilterModule: _ModuleWithoutApi = {
    moduleName: 'SetFilter',
    version: VERSION,
    userComponents: {
        agSetColumnFilter: {
            classImp: SetFilter,
            params: {
                useForm: true,
            } as FilterWrapperParams,
            processParams: (params) => {
                applyExcelModeOptions(params);
                return params;
            },
        },
        agSetColumnFloatingFilter: SetFloatingFilterComp,
    },
    dynamicBeans: {
        agSetColumnFilterHandler: SetFilterHandler,
    },
    icons: {
        // set filter tree list group contracted (click to expand)
        setFilterGroupClosed: 'tree-closed',
        // set filter tree list group expanded (click to contract)
        setFilterGroupOpen: 'tree-open',
        // set filter tree list expand/collapse all button, shown when some children are expanded and
        //     others are collapsed
        setFilterGroupIndeterminate: 'tree-indeterminate',
        // set filter async values loading
        setFilterLoading: 'loading',
    },
    dependsOn: [EnterpriseCoreModule, _ColumnFilterModule],
};
