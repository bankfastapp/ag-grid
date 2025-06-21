import type { ColDef, ColGroupDef } from '../entities/colDef';
import type { Column, ColumnGroup } from '../interfaces/iColumn';
import type { AgGridCommon } from '../interfaces/iCommon';
import type { IComponent } from '../interfaces/iComponent';
import type { IRowNode } from '../interfaces/iRowNode';
import type { ElementParams } from '../utils/dom';
import { _toString } from '../utils/string';
import { PopupComponent } from '../widgets/popupComponent';

export type TooltipLocation =
    | 'advancedFilter'
    | 'cell'
    | 'cellEditor'
    | 'columnToolPanelColumn'
    | 'columnToolPanelColumnGroup'
    | 'filterToolPanelColumnGroup'
    | 'fullWidthRow'
    | 'fullRowEditor'
    | 'header'
    | 'headerGroup'
    | 'menu'
    | 'pivotColumnsList'
    | 'rowGroupColumnsList'
    | 'setFilterValue'
    | 'valueColumnsList'
    | 'UNKNOWN';

export interface ITooltipParams<TData = any, TValue = any, TContext = any> extends AgGridCommon<TData, TContext> {
    /** What part of the application is showing the tooltip, e.g. 'cell', 'header', 'menuItem' etc */
    location: TooltipLocation;
    /** The value to be rendered by the tooltip. */
    value?: TValue | null;
    /** The formatted value to be rendered by the tooltip. */
    valueFormatted?: string | null;
    /** Column / ColumnGroup definition. */
    colDef?: ColDef<TData, TValue> | ColGroupDef<TData> | null;
    /** Column / ColumnGroup */
    column?: Column<TValue> | ColumnGroup;
    /** The index of the row containing the cell rendering the tooltip. */
    rowIndex?: number;
    /** The row node. */
    node?: IRowNode<TData>;
    /** Data for the row node in question. */
    data?: TData;
    /** A callback function that hides the tooltip */
    hideTooltipCallback?: () => void;
}

export interface ITooltipComp extends IComponent<ITooltipParams> {}

const TooltipComponentElement: ElementParams = { tag: 'div', cls: 'ag-tooltip' };

export class TooltipComponent extends PopupComponent implements ITooltipComp {
    constructor() {
        super(TooltipComponentElement);
    }

    // will need to type params
    public init(params: ITooltipParams): void {
        const { value } = params;
        const eGui = this.getGui();

        eGui.textContent = _toString(value) as string;
        const locationKebabCase = params.location.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase();
        eGui.classList.add(`ag-${locationKebabCase}-tooltip`);
    }
}
