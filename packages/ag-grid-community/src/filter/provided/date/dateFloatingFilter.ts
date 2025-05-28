import type { FilterChangedEvent } from '../../../events';
import { _addGridCommonParams } from '../../../gridOptionsUtils';
import type { IDateParams } from '../../../interfaces/dateComponent';
import { _parseDateTimeFromString } from '../../../utils/date';
import type { ElementParams } from '../../../utils/dom';
import { _setDisplayed } from '../../../utils/dom';
import { _debounce } from '../../../utils/function';
import type { AgInputTextField } from '../../../widgets/agInputTextField';
import { AgInputTextFieldSelector } from '../../../widgets/agInputTextField';
import { RefPlaceholder } from '../../../widgets/component';
import type { IFloatingFilterParams } from '../../floating/floatingFilter';
import { getDebounceMs } from '../../floating/provided/providedFilterUtils';
import { SimpleFloatingFilter } from '../../floating/provided/simpleFloatingFilter';
import type { ISimpleFilterModel } from '../iSimpleFilter';
import { DateCompWrapper } from './dateCompWrapper';
import type { DateFilter } from './dateFilter';
import { DEFAULT_DATE_FILTER_OPTIONS } from './dateFilterConstants';
import { DateFilterModelFormatter } from './dateFilterModelFormatter';
import type { DateFilterModel, DateFilterParams } from './iDateFilter';

const DateFloatingFilterElement: ElementParams = {
    tag: 'div',
    cls: 'ag-floating-filter-input',
    role: 'presentation',
    children: [
        {
            tag: 'ag-input-text-field',
            ref: 'eReadOnlyText',
        },
        { tag: 'div', ref: 'eDateWrapper', cls: 'ag-date-floating-filter-wrapper' },
    ],
};

export class DateFloatingFilter extends SimpleFloatingFilter {
    private readonly eReadOnlyText: AgInputTextField = RefPlaceholder;
    private readonly eDateWrapper: HTMLInputElement = RefPlaceholder;

    private dateComp: DateCompWrapper;
    private params: IFloatingFilterParams<DateFilter>;
    private filterParams: DateFilterParams;
    protected filterModelFormatter: DateFilterModelFormatter;

    constructor() {
        super(DateFloatingFilterElement, [AgInputTextFieldSelector]);
    }

    protected getDefaultOptions(): string[] {
        return DEFAULT_DATE_FILTER_OPTIONS;
    }

    public override init(params: IFloatingFilterParams<DateFilter>): void {
        super.init(params);
        this.params = params;
        this.filterParams = params.filterParams;

        this.createDateComponent();
        this.filterModelFormatter = new DateFilterModelFormatter(
            this.filterParams,
            this.getLocaleTextFunc.bind(this),
            this.optionsFactory
        );
        const translate = this.getLocaleTextFunc();
        this.eReadOnlyText.setDisabled(true).setInputAriaLabel(translate('ariaDateFilterInput', 'Date Filter Input'));
    }

    public override refresh(params: IFloatingFilterParams<DateFilter>): void {
        super.refresh(params);
        this.params = params;
        this.filterParams = params.filterParams;

        this.dateComp.updateParams(this.getDateComponentParams());

        this.filterModelFormatter.updateParams({
            optionsFactory: this.optionsFactory,
            dateFilterParams: this.filterParams,
        });
        this.updateCompOnModelChange(params.currentParentModel());
    }

    private updateCompOnModelChange(model: any): void {
        // Update the read-only text field
        const allowEditing = !this.readOnly && this.canWeEditAfterModelFromParentFilter(model);
        this.setEditable(allowEditing);

        if (allowEditing) {
            const dateModel = (model as DateFilterModel) ? _parseDateTimeFromString(model.dateFrom) : null;
            this.dateComp.setDate(dateModel);

            this.eReadOnlyText.setValue('');
        } else {
            this.eReadOnlyText.setValue(this.filterModelFormatter.getModelAsString(model));
            this.dateComp.setDate(null);
        }
    }

    protected setEditable(editable: boolean): void {
        _setDisplayed(this.eDateWrapper, editable);
        _setDisplayed(this.eReadOnlyText.getGui(), !editable);
    }

    public onParentModelChanged(model: ISimpleFilterModel, event: FilterChangedEvent): void {
        // We don't want to update the floating filter if the floating filter caused the change,
        // because the UI is already in sync. if we didn't do this, the UI would behave strangely
        // as it would be updating as the user is typing.
        // This is similar for data changes, which don't affect provided date floating filters
        if (event?.afterFloatingFilter || event?.afterDataChange) {
            return;
        }

        super.setLastTypeFromModel(model);
        this.updateCompOnModelChange(model);
    }

    private onDateChanged(): void {
        const filterValueDate = this.dateComp.getDate();

        this.params.parentFilterInstance((filterInstance) => {
            if (filterInstance) {
                filterInstance.onFloatingFilterChanged(this.lastType || null, filterValueDate);
            }
        });
    }

    private getDateComponentParams(): IDateParams {
        const { filterParams } = this.params;
        const debounceMs = getDebounceMs(filterParams, this.defaultDebounceMs);
        return _addGridCommonParams(this.gos, {
            onDateChanged: _debounce(this, this.onDateChanged.bind(this), debounceMs),
            filterParams,
            location: 'floatingFilter',
        });
    }

    private createDateComponent(): void {
        const {
            beans: { context, userCompFactory },
            eDateWrapper,
            params,
        } = this;
        this.dateComp = new DateCompWrapper(
            context,
            userCompFactory,
            params.column.getColDef(),
            this.getDateComponentParams(),
            eDateWrapper,
            (dateComp) => {
                dateComp.setInputAriaLabel(this.getAriaLabel(params));
            }
        );

        this.addDestroyFunc(() => this.dateComp.destroy());
    }
}
