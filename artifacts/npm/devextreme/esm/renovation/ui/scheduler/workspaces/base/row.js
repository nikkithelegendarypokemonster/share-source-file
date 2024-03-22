/**
* DevExtreme (esm/renovation/ui/scheduler/workspaces/base/row.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["children", "className", "isHeaderRow", "leftVirtualCellCount", "leftVirtualCellWidth", "rightVirtualCellCount", "rightVirtualCellWidth", "styles"];
import { createVNode, createComponentVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { normalizeStyles } from '@devextreme/runtime/inferno';
import { VirtualCell } from './virtual_cell';
import { splitNumber } from '../../../../../__internal/scheduler/__migration/utils/index';
var MAX_COL_SPAN = 1000;
export var viewFunction = _ref => {
  var {
    hasLeftVirtualCell,
    hasRightVirtualCell,
    props: {
      children,
      className,
      isHeaderRow,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      styles
    }
  } = _ref;
  return createVNode(1, "tr", className, [hasLeftVirtualCell && leftVirtualCellCount != null && splitNumber(leftVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => createComponentVNode(2, VirtualCell, {
    "width": leftVirtualCellWidth * (colSpan / leftVirtualCellCount),
    "colSpan": colSpan,
    "isHeaderCell": isHeaderRow
  }, "left-virtual-cell-".concat(index))), children, hasRightVirtualCell && rightVirtualCellCount != null && splitNumber(rightVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => createComponentVNode(2, VirtualCell, {
    "width": rightVirtualCellWidth * (colSpan / rightVirtualCellCount),
    "colSpan": colSpan,
    "isHeaderCell": isHeaderRow
  }, "right-virtual-cell-".concat(index)))], 0, {
    "style": normalizeStyles(styles)
  });
};
export var RowProps = {
  className: '',
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  isHeaderRow: false
};
export class Row extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  get hasLeftVirtualCell() {
    var {
      leftVirtualCellCount
    } = this.props;
    return !!leftVirtualCellCount;
  }
  get hasRightVirtualCell() {
    var {
      rightVirtualCellCount
    } = this.props;
    return !!rightVirtualCellCount;
  }
  get restAttributes() {
    var _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      hasLeftVirtualCell: this.hasLeftVirtualCell,
      hasRightVirtualCell: this.hasRightVirtualCell,
      restAttributes: this.restAttributes
    });
  }
}
Row.defaultProps = RowProps;
