import _extends from "@babel/runtime/helpers/esm/extends";
import { createComponentVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { renderUtils } from '../../utils/index';
import { Row, RowDefaultProps } from './row';
import { VirtualCell, VirtualCellDefaultProps } from './virtual_cell';
export const VirtualRowDefaultProps = _extends({}, RowDefaultProps, {
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  cellsCount: 1
});
export class VirtualRow extends BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this.virtualCells = null;
  }
  getVirtualCells() {
    if (this.virtualCells !== null) {
      return this.virtualCells;
    }
    const {
      cellsCount
    } = this.props;
    this.virtualCells = [...Array(cellsCount)];
    return this.virtualCells;
  }
  componentWillUpdate(nextProps) {
    if (this.props.cellsCount !== nextProps.cellsCount) {
      this.virtualCells = null;
    }
  }
  render() {
    const {
      className,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      styles,
      height
    } = this.props;
    const classes = `dx-scheduler-virtual-row ${className}`;
    const modifiedStyles = renderUtils.addHeightToStyle(height, styles);
    const virtualCells = this.getVirtualCells();
    return (// @ts-ignore
      createComponentVNode(2, Row, {
        "className": classes,
        "styles": modifiedStyles,
        "leftVirtualCellWidth": leftVirtualCellWidth,
        "rightVirtualCellWidth": rightVirtualCellWidth,
        "leftVirtualCellCount": leftVirtualCellCount,
        "rightVirtualCellCount": rightVirtualCellCount,
        children: virtualCells.map((_, index) => // @ts-ignore
        createComponentVNode(2, VirtualCell, {
          "width": VirtualCellDefaultProps.width,
          "isHeaderCell": VirtualCellDefaultProps.isHeaderCell
        }, index.toString()))
      })
    );
  }
}
VirtualRow.defaultProps = VirtualRowDefaultProps;