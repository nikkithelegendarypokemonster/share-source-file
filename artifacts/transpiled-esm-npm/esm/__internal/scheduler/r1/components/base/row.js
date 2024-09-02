import { createVNode, createComponentVNode } from "inferno";
import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import { splitNumber } from '../../utils/index';
import { VirtualCell, VirtualCellDefaultProps } from './virtual_cell';
const MAX_COL_SPAN = 1000;
export const RowDefaultProps = {
  className: '',
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  isHeaderRow: false
};
export class Row extends BaseInfernoComponent {
  render() {
    const {
      children,
      className,
      isHeaderRow,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      styles
    } = this.props;
    const hasLeftVirtualCell = !!leftVirtualCellCount;
    const hasRightVirtualCell = !!rightVirtualCellCount;
    return createVNode(1, "tr", className, [hasLeftVirtualCell && leftVirtualCellCount != null && splitNumber(leftVirtualCellCount, MAX_COL_SPAN).map(
    // @ts-ignore
    (colSpan, index) => createComponentVNode(2, VirtualCell, {
      "className": `left-virtual-cell-${index}`,
      "width": leftVirtualCellWidth * (colSpan / leftVirtualCellCount),
      "colSpan": colSpan,
      "isHeaderCell": isHeaderRow ?? VirtualCellDefaultProps.isHeaderCell
    })), children, hasRightVirtualCell && rightVirtualCellCount != null && splitNumber(rightVirtualCellCount, MAX_COL_SPAN).map(
    // @ts-ignore
    (colSpan, index) => createComponentVNode(2, VirtualCell, {
      "className": `right-virtual-cell-${index}`,
      "width": rightVirtualCellWidth * (colSpan / rightVirtualCellCount),
      "colSpan": colSpan,
      "isHeaderCell": isHeaderRow ?? VirtualCellDefaultProps.isHeaderCell
    }))], 0, {
      "style": normalizeStyles(styles)
    });
  }
}
Row.defaultProps = RowDefaultProps;