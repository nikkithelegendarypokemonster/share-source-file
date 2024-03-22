/**
* DevExtreme (esm/__internal/scheduler/__migration/components/base/row.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import { createComponentVNode, createVNode } from 'inferno';
import { splitNumber } from '../../utils/index';
import { VirtualCell } from './virtual_cell';
var MAX_COL_SPAN = 1000;
var RowDefaultProps = {
  className: '',
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  isHeaderRow: false
};
export class Row extends BaseInfernoComponent {
  render() {
    var {
      children,
      className,
      isHeaderRow,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      styles
    } = this.props;
    var hasLeftVirtualCell = !!leftVirtualCellCount;
    var hasRightVirtualCell = !!rightVirtualCellCount;
    return createVNode(1, 'tr', className, [hasLeftVirtualCell && leftVirtualCellCount != null && splitNumber(leftVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => createComponentVNode(2, VirtualCell, {
      width: leftVirtualCellWidth * (colSpan / leftVirtualCellCount),
      colSpan,
      isHeaderCell: isHeaderRow
    }, 'left-virtual-cell-'.concat(index.toString()))), children, hasRightVirtualCell && rightVirtualCellCount != null && splitNumber(rightVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => createComponentVNode(2, VirtualCell, {
      width: rightVirtualCellWidth * (colSpan / rightVirtualCellCount),
      colSpan,
      isHeaderCell: isHeaderRow
    }, 'right-virtual-cell-'.concat(index.toString())))], 0, {
      style: normalizeStyles(styles)
    });
  }
}
Row.defaultProps = RowDefaultProps;
