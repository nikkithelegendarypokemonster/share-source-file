import { createComponentVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { renderUtils } from '../../utils/index';
import { HeaderCell } from './header_cell';
import { OrdinaryCell } from './ordinary_cell';
export const VirtualCellDefaultProps = {
  width: 0,
  isHeaderCell: false
};
export class VirtualCell extends BaseInfernoComponent {
  render() {
    const {
      colSpan,
      isHeaderCell,
      width,
      styles
    } = this.props;
    const modifiedStyles = renderUtils.addWidthToStyle(width, styles);
    const Cell = isHeaderCell ? HeaderCell : OrdinaryCell;
    return (// @ts-ignore
      createComponentVNode(2, Cell, {
        "className": "dx-scheduler-virtual-cell",
        "styles": modifiedStyles,
        "colSpan": colSpan
      })
    );
  }
}
VirtualCell.defaultProps = VirtualCellDefaultProps;