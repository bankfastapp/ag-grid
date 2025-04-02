import type { GridOptions, IFooterService, NamedBean, RowNode } from 'ag-grid-community';
import { BeanStub, _getGrandTotalRow, _getGroupTotalRowCallback } from 'ag-grid-community';

import { _createRowNodeFooter } from './footerUtils';

export class FooterService extends BeanStub implements NamedBean, IFooterService {
    beanName = 'footerSvc' as const;

    public addTotalRows(
        startIndex: number,
        node: RowNode,
        callback: (node: RowNode, index: number) => void,
        includeFooterNodes: boolean,
        isRootNode: boolean,
        position: 'top' | 'bottom'
    ): number {
        let index = startIndex;

        if (isRootNode) {
            const grandTotal = includeFooterNodes && _getGrandTotalRow(this.gos);
            if (_positionMatchesGrandTotalRow(position, grandTotal)) {
                _createRowNodeFooter(node, this.beans);
                callback(node.sibling, index++);
            }
            return index;
        }

        const isGroupIncludeFooter = _getGroupTotalRowCallback(this.gos);
        const groupTotal = includeFooterNodes && isGroupIncludeFooter({ node });
        if (groupTotal === position) {
            _createRowNodeFooter(node, this.beans);
            callback(node.sibling, index++);
        }
        return index;
    }

    public getTopDisplayIndex(
        rowsToDisplay: RowNode[],
        topLevelIndex: number,
        childrenAfterSort: RowNode[],
        getDefaultIndex: (adjustedIndex: number) => number
    ): number {
        let adjustedIndex = topLevelIndex;
        if (rowsToDisplay[0].footer) {
            // if footer is first displayed row and looking for first row, return footer
            if (topLevelIndex === 0) {
                return 0;
            }

            // if first row is footer, offset index to check sorted rows by 1
            adjustedIndex -= 1;
        }

        const lastRow = rowsToDisplay[rowsToDisplay.length - 1];
        const indexOutsideGroupBounds = adjustedIndex >= childrenAfterSort.length;
        // if last row is footer, and attempting to retrieve row of too high index, return footer row index
        if (lastRow.footer && indexOutsideGroupBounds) {
            return lastRow.rowIndex!;
        }

        return getDefaultIndex(adjustedIndex);
    }

    public getTotalValue(value: any): string {
        return this.getLocaleTextFunc()('footerTotal', 'Total') + ' ' + (value ?? '');
    }
}

function _positionMatchesGrandTotalRow(
    position: 'top' | 'bottom',
    grandTotaRow: GridOptions['grandTotalRow'] | false
): boolean {
    switch (grandTotaRow) {
        case 'top':
        case 'pinnedTop':
            return position === 'top';
        case 'bottom':
        case 'pinnedBottom':
            return position === 'bottom';
        default:
            return false;
    }
}
