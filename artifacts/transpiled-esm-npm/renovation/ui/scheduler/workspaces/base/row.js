"use strict";

exports.viewFunction = exports.RowProps = exports.Row = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _virtual_cell = require("./virtual_cell");
var _index = require("../../../../../__internal/scheduler/__migration/utils/index");
const _excluded = ["children", "className", "isHeaderRow", "leftVirtualCellCount", "leftVirtualCellWidth", "rightVirtualCellCount", "rightVirtualCellWidth", "styles"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const MAX_COL_SPAN = 1000;
const viewFunction = _ref => {
  let {
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
  return (0, _inferno.createVNode)(1, "tr", className, [hasLeftVirtualCell && leftVirtualCellCount != null && (0, _index.splitNumber)(leftVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => (0, _inferno.createComponentVNode)(2, _virtual_cell.VirtualCell, {
    "width": leftVirtualCellWidth * (colSpan / leftVirtualCellCount),
    "colSpan": colSpan,
    "isHeaderCell": isHeaderRow
  }, "left-virtual-cell-".concat(index))), children, hasRightVirtualCell && rightVirtualCellCount != null && (0, _index.splitNumber)(rightVirtualCellCount, MAX_COL_SPAN).map((colSpan, index) => (0, _inferno.createComponentVNode)(2, _virtual_cell.VirtualCell, {
    "width": rightVirtualCellWidth * (colSpan / rightVirtualCellCount),
    "colSpan": colSpan,
    "isHeaderCell": isHeaderRow
  }, "right-virtual-cell-".concat(index)))], 0, {
    "style": (0, _inferno2.normalizeStyles)(styles)
  });
};
exports.viewFunction = viewFunction;
const RowProps = exports.RowProps = {
  className: '',
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  isHeaderRow: false
};
let Row = exports.Row = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(Row, _BaseInfernoComponent);
  function Row(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = Row.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      hasLeftVirtualCell: this.hasLeftVirtualCell,
      hasRightVirtualCell: this.hasRightVirtualCell,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Row, [{
    key: "hasLeftVirtualCell",
    get: function () {
      const {
        leftVirtualCellCount
      } = this.props;
      return !!leftVirtualCellCount;
    }
  }, {
    key: "hasRightVirtualCell",
    get: function () {
      const {
        rightVirtualCellCount
      } = this.props;
      return !!rightVirtualCellCount;
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return Row;
}(_inferno2.BaseInfernoComponent);
Row.defaultProps = RowProps;