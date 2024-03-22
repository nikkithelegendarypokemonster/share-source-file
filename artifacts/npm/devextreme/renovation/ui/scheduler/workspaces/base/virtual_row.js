/**
* DevExtreme (renovation/ui/scheduler/workspaces/base/virtual_row.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.VirtualRowProps = exports.VirtualRow = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../../__internal/scheduler/__migration/utils/index");
var _row = require("./row");
var _virtual_cell = require("./virtual_cell");
const _excluded = ["cellsCount", "children", "className", "height", "isHeaderRow", "leftVirtualCellCount", "leftVirtualCellWidth", "rightVirtualCellCount", "rightVirtualCellWidth", "styles"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    classes,
    props: {
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth
    },
    style,
    virtualCells
  } = _ref;
  return (0, _inferno.createComponentVNode)(2, _row.Row, {
    "styles": style,
    "className": classes,
    "leftVirtualCellWidth": leftVirtualCellWidth,
    "rightVirtualCellWidth": rightVirtualCellWidth,
    "leftVirtualCellCount": leftVirtualCellCount,
    "rightVirtualCellCount": rightVirtualCellCount,
    children: virtualCells.map((_, index) => (0, _inferno.createComponentVNode)(2, _virtual_cell.VirtualCell, null, index.toString()))
  });
};
exports.viewFunction = viewFunction;
const VirtualRowProps = exports.VirtualRowProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_row.RowProps), Object.getOwnPropertyDescriptors({
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  cellsCount: 1
})));
let VirtualRow = exports.VirtualRow = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(VirtualRow, _BaseInfernoComponent);
  function VirtualRow(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    return _this;
  }
  var _proto = VirtualRow.prototype;
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.props['cellsCount'] !== nextProps['cellsCount']) {
      this.__getterCache['virtualCells'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      style: this.style,
      classes: this.classes,
      virtualCells: this.virtualCells,
      restAttributes: this.restAttributes
    });
  };
  _createClass(VirtualRow, [{
    key: "style",
    get: function () {
      const {
        height
      } = this.props;
      const {
        style
      } = this.restAttributes;
      return _index.renderUtils.addHeightToStyle(height, style);
    }
  }, {
    key: "classes",
    get: function () {
      const {
        className
      } = this.props;
      return "dx-scheduler-virtual-row ".concat(className);
    }
  }, {
    key: "virtualCells",
    get: function () {
      if (this.__getterCache['virtualCells'] !== undefined) {
        return this.__getterCache['virtualCells'];
      }
      return this.__getterCache['virtualCells'] = (() => {
        const {
          cellsCount
        } = this.props;
        return [...Array(cellsCount)];
      })();
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return VirtualRow;
}(_inferno2.BaseInfernoComponent);
VirtualRow.defaultProps = VirtualRowProps;
