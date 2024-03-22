/**
* DevExtreme (cjs/renovation/ui/scheduler/workspaces/base/table.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.TableProps = exports.Table = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../../__internal/scheduler/__migration/utils/index");
var _virtual_row = require("./virtual_row");
const _excluded = ["bottomVirtualRowHeight", "children", "className", "height", "leftVirtualCellCount", "leftVirtualCellWidth", "rightVirtualCellCount", "rightVirtualCellWidth", "tableRef", "topVirtualRowHeight", "virtualCellsCount", "width"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const viewFunction = _ref => {
  let {
    hasBottomVirtualRow,
    hasTopVirtualRow,
    props: {
      bottomVirtualRowHeight,
      children,
      className,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      tableRef,
      topVirtualRowHeight,
      virtualCellsCount
    },
    style
  } = _ref;
  return (0, _inferno.createVNode)(1, "table", className, (0, _inferno.createVNode)(1, "tbody", null, [hasTopVirtualRow && (0, _inferno.createComponentVNode)(2, _virtual_row.VirtualRow, {
    "height": topVirtualRowHeight,
    "cellsCount": virtualCellsCount,
    "leftVirtualCellWidth": leftVirtualCellWidth,
    "rightVirtualCellWidth": rightVirtualCellWidth,
    "leftVirtualCellCount": leftVirtualCellCount,
    "rightVirtualCellCount": rightVirtualCellCount
  }), children, hasBottomVirtualRow && (0, _inferno.createComponentVNode)(2, _virtual_row.VirtualRow, {
    "height": bottomVirtualRowHeight,
    "cellsCount": virtualCellsCount,
    "leftVirtualCellWidth": leftVirtualCellWidth,
    "rightVirtualCellWidth": rightVirtualCellWidth,
    "leftVirtualCellCount": leftVirtualCellCount,
    "rightVirtualCellCount": rightVirtualCellCount
  })], 0), 2, {
    "style": (0, _inferno2.normalizeStyles)(style)
  }, null, tableRef);
};
exports.viewFunction = viewFunction;
const TableProps = exports.TableProps = {
  className: '',
  topVirtualRowHeight: 0,
  bottomVirtualRowHeight: 0,
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  virtualCellsCount: 0
};
let Table = exports.Table = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(Table, _BaseInfernoComponent);
  function Table(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.elementRef = (0, _inferno.createRef)();
    return _this;
  }
  var _proto = Table.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      elementRef: this.elementRef,
      style: this.style,
      hasTopVirtualRow: this.hasTopVirtualRow,
      hasBottomVirtualRow: this.hasBottomVirtualRow,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Table, [{
    key: "style",
    get: function () {
      const {
        height,
        width
      } = this.props;
      const {
        style
      } = this.restAttributes;
      const heightAdded = _index.renderUtils.addHeightToStyle(height, style);
      return _index.renderUtils.addWidthToStyle(width, heightAdded);
    }
  }, {
    key: "hasTopVirtualRow",
    get: function () {
      const {
        topVirtualRowHeight
      } = this.props;
      return !!topVirtualRowHeight;
    }
  }, {
    key: "hasBottomVirtualRow",
    get: function () {
      const {
        bottomVirtualRowHeight
      } = this.props;
      return !!bottomVirtualRowHeight;
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return Table;
}(_inferno2.BaseInfernoComponent);
Table.defaultProps = TableProps;
