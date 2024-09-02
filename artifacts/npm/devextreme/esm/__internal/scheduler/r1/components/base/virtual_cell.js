/**
* DevExtreme (esm/__internal/scheduler/r1/components/base/virtual_cell.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
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
