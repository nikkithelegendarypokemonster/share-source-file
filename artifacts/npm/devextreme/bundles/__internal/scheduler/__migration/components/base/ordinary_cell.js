/**
* DevExtreme (bundles/__internal/scheduler/__migration/components/base/ordinary_cell.js)
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
exports.OrdinaryCell = exports.CellDefaultProps = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _inferno2 = require("inferno");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const CellDefaultProps = exports.CellDefaultProps = {};
let OrdinaryCell = exports.OrdinaryCell = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(OrdinaryCell, _BaseInfernoComponent);
  function OrdinaryCell() {
    return _BaseInfernoComponent.apply(this, arguments) || this;
  }
  var _proto = OrdinaryCell.prototype;
  _proto.render = function render() {
    const {
      children,
      className,
      colSpan,
      styles
    } = this.props;
    return (0, _inferno2.createVNode)(1, 'td', className, children, 0, {
      style: (0, _inferno.normalizeStyles)(styles),
      colSpan
    });
  };
  return OrdinaryCell;
}(_inferno.BaseInfernoComponent);
OrdinaryCell.defaultProps = CellDefaultProps;
