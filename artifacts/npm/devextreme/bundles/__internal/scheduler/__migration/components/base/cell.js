/**
* DevExtreme (bundles/__internal/scheduler/__migration/components/base/cell.js)
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
exports.CellBaseDefaultProps = exports.CellBase = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _inferno2 = require("inferno");
var _index = require("../../utils/index");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const CellBaseDefaultProps = exports.CellBaseDefaultProps = {
  className: '',
  isFirstGroupCell: false,
  isLastGroupCell: false,
  startDate: new Date(),
  endDate: new Date(),
  allDay: false,
  text: '',
  index: 0,
  contentTemplateProps: {
    data: {},
    index: 0
  }
};
let CellBase = exports.CellBase = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(CellBase, _BaseInfernoComponent);
  function CellBase() {
    return _BaseInfernoComponent.apply(this, arguments) || this;
  }
  var _proto = CellBase.prototype;
  _proto.render = function render() {
    const {
      className,
      isFirstGroupCell,
      isLastGroupCell,
      children,
      ariaLabel
    } = this.props;
    const classNames = _index.renderUtils.getGroupCellClasses(isFirstGroupCell, isLastGroupCell, className);
    return (0, _inferno2.createVNode)(1, 'td', classNames, children, 0, {
      'aria-label': ariaLabel
    });
  };
  return CellBase;
}(_inferno.BaseInfernoComponent);
CellBase.defaultProps = CellBaseDefaultProps;
