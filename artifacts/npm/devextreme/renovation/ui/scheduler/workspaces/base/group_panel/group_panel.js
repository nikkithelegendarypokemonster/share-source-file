/**
* DevExtreme (renovation/ui/scheduler/workspaces/base/group_panel/group_panel.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.GroupPanelProps = exports.GroupPanel = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _group_panel_props = require("./group_panel_props");
var _layout = require("./vertical/layout");
var _layout2 = require("./horizontal/layout");
var _const = require("../../../../../../__internal/scheduler/__migration/const");
var _index = require("../../../../../../__internal/scheduler/__migration/utils/index");
const _excluded = ["className", "elementRef", "groupByDate", "groupOrientation", "groupPanelData", "groups", "height", "resourceCellTemplate"];
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
    isVerticalLayout,
    props: {
      className,
      elementRef,
      groupPanelData,
      height,
      resourceCellTemplate
    },
    restAttributes
  } = _ref;
  return isVerticalLayout ? (0, _inferno.createComponentVNode)(2, _layout.GroupPanelVerticalLayout, {
    "height": height,
    "resourceCellTemplate": resourceCellTemplate,
    "className": className,
    "groupPanelData": groupPanelData,
    "elementRef": elementRef,
    "styles": restAttributes.style
  }) : (0, _inferno.createComponentVNode)(2, _layout2.GroupPanelHorizontalLayout, {
    "height": height,
    "resourceCellTemplate": resourceCellTemplate,
    "className": className,
    "groupPanelData": groupPanelData,
    "elementRef": elementRef,
    "styles": restAttributes.style
  });
};
exports.viewFunction = viewFunction;
const GroupPanelProps = exports.GroupPanelProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_group_panel_props.GroupPanelBaseProps), Object.getOwnPropertyDescriptors({
  groups: Object.freeze([]),
  groupOrientation: _const.VERTICAL_GROUP_ORIENTATION
})));
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let GroupPanel = exports.GroupPanel = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(GroupPanel, _InfernoWrapperCompon);
  function GroupPanel(props) {
    var _this;
    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = GroupPanel.prototype;
  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        resourceCellTemplate: getTemplate(props.resourceCellTemplate)
      }),
      isVerticalLayout: this.isVerticalLayout,
      restAttributes: this.restAttributes
    });
  };
  _createClass(GroupPanel, [{
    key: "isVerticalLayout",
    get: function () {
      const {
        groupOrientation,
        groups
      } = this.props;
      return (0, _index.isVerticalGroupingApplied)(groups, groupOrientation);
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return GroupPanel;
}(_inferno2.InfernoWrapperComponent);
GroupPanel.defaultProps = GroupPanelProps;
