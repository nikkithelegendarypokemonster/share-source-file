/**
* DevExtreme (renovation/ui/scheduler/workspaces/base/header_panel/layout.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.HeaderPanelLayoutProps = exports.HeaderPanelLayout = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _group_panel = require("../group_panel/group_panel");
var _layout = require("./date_header/layout");
var _index = require("../../../../../../__internal/scheduler/__migration/utils/index");
const _excluded = ["className", "dateCellTemplate", "dateHeaderData", "dateHeaderTemplate", "elementRef", "groupByDate", "groupOrientation", "groupPanelData", "groups", "height", "isRenderDateHeader", "resourceCellTemplate", "timeCellTemplate"];
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
    isHorizontalGrouping,
    props: {
      dateCellTemplate,
      dateHeaderData,
      dateHeaderTemplate: DateHeader,
      groupByDate,
      groupOrientation,
      groupPanelData,
      groups,
      isRenderDateHeader,
      resourceCellTemplate,
      timeCellTemplate
    }
  } = _ref;
  return (0, _inferno.createVNode)(1, "thead", null, [isHorizontalGrouping && !groupByDate && (0, _inferno.createComponentVNode)(2, _group_panel.GroupPanel, {
    "groupPanelData": groupPanelData,
    "groups": groups,
    "groupByDate": groupByDate,
    "groupOrientation": groupOrientation,
    "resourceCellTemplate": resourceCellTemplate
  }), isRenderDateHeader && DateHeader({
    groupByDate: groupByDate,
    dateHeaderData: dateHeaderData,
    groupOrientation: groupOrientation,
    groups: groups,
    dateCellTemplate: dateCellTemplate,
    timeCellTemplate: timeCellTemplate
  }), groupByDate && (0, _inferno.createComponentVNode)(2, _group_panel.GroupPanel, {
    "groupPanelData": groupPanelData,
    "groups": groups,
    "groupByDate": groupByDate,
    "groupOrientation": groupOrientation,
    "resourceCellTemplate": resourceCellTemplate
  })], 0);
};
exports.viewFunction = viewFunction;
const HeaderPanelLayoutProps = exports.HeaderPanelLayoutProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_group_panel.GroupPanelProps), Object.getOwnPropertyDescriptors({
  isRenderDateHeader: true,
  dateHeaderTemplate: _layout.DateHeaderLayout
})));
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let HeaderPanelLayout = exports.HeaderPanelLayout = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(HeaderPanelLayout, _InfernoWrapperCompon);
  function HeaderPanelLayout(props) {
    var _this;
    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = HeaderPanelLayout.prototype;
  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        dateCellTemplate: getTemplate(props.dateCellTemplate),
        timeCellTemplate: getTemplate(props.timeCellTemplate),
        dateHeaderTemplate: getTemplate(props.dateHeaderTemplate),
        resourceCellTemplate: getTemplate(props.resourceCellTemplate)
      }),
      isHorizontalGrouping: this.isHorizontalGrouping,
      restAttributes: this.restAttributes
    });
  };
  _createClass(HeaderPanelLayout, [{
    key: "isHorizontalGrouping",
    get: function () {
      const {
        groupOrientation,
        groups
      } = this.props;
      return (0, _index.isHorizontalGroupingApplied)(groups, groupOrientation);
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return HeaderPanelLayout;
}(_inferno2.InfernoWrapperComponent);
HeaderPanelLayout.defaultProps = HeaderPanelLayoutProps;
