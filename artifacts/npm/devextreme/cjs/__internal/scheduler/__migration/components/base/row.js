/**
* DevExtreme (cjs/__internal/scheduler/__migration/components/base/row.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Row = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _inferno2 = require("inferno");
var _index = require("../../utils/index");
var _virtual_cell = require("./virtual_cell");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const MAX_COL_SPAN = 1000;
const RowDefaultProps = {
  className: '',
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  isHeaderRow: false
};
let Row = exports.Row = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(Row, _BaseInfernoComponent);
  function Row() {
    return _BaseInfernoComponent.apply(this, arguments) || this;
  }
  var _proto = Row.prototype;
  _proto.render = function render() {
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
    return (0, _inferno2.createVNode)(1, 'tr', className, [hasLeftVirtualCell && leftVirtualCellCount != null && (0, _index.splitNumber)(leftVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => (0, _inferno2.createComponentVNode)(2, _virtual_cell.VirtualCell, {
      width: leftVirtualCellWidth * (colSpan / leftVirtualCellCount),
      colSpan,
      isHeaderCell: isHeaderRow
    }, 'left-virtual-cell-'.concat(index.toString()))), children, hasRightVirtualCell && rightVirtualCellCount != null && (0, _index.splitNumber)(rightVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => (0, _inferno2.createComponentVNode)(2, _virtual_cell.VirtualCell, {
      width: rightVirtualCellWidth * (colSpan / rightVirtualCellCount),
      colSpan,
      isHeaderCell: isHeaderRow
    }, 'right-virtual-cell-'.concat(index.toString())))], 0, {
      style: (0, _inferno.normalizeStyles)(styles)
    });
  };
  return Row;
}(_inferno.BaseInfernoComponent);
Row.defaultProps = RowDefaultProps;
