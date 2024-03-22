/**
* DevExtreme (renovation/ui/scheduler/workspaces/base/group_panel/vertical/layout.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.VerticalGroupPanelLayoutProps = exports.GroupPanelVerticalLayout = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _row = require("./row");
var _index = require("../../../../../../../__internal/scheduler/__migration/utils/index");
var _group_panel_layout_props = require("../group_panel_layout_props");
const _excluded = ["className", "elementRef", "groupByDate", "groupPanelData", "height", "resourceCellTemplate", "styles"];
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
    props: {
      className,
      elementRef,
      groupPanelData,
      resourceCellTemplate
    },
    style
  } = _ref;
  return (0, _inferno.createVNode)(1, "div", className, (0, _inferno.createVNode)(1, "div", "dx-scheduler-group-flex-container", groupPanelData.groupPanelItems.map(group => (0, _inferno.createComponentVNode)(2, _row.Row, {
    "groupItems": group,
    "cellTemplate": resourceCellTemplate
  }, group[0].key)), 0), 2, {
    "style": (0, _inferno2.normalizeStyles)(style)
  }, null, elementRef);
};
exports.viewFunction = viewFunction;
const VerticalGroupPanelLayoutProps = exports.VerticalGroupPanelLayoutProps = _group_panel_layout_props.GroupPanelLayoutProps;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let GroupPanelVerticalLayout = exports.GroupPanelVerticalLayout = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(GroupPanelVerticalLayout, _BaseInfernoComponent);
  function GroupPanelVerticalLayout(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = GroupPanelVerticalLayout.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        resourceCellTemplate: getTemplate(props.resourceCellTemplate)
      }),
      style: this.style,
      restAttributes: this.restAttributes
    });
  };
  _createClass(GroupPanelVerticalLayout, [{
    key: "style",
    get: function () {
      const {
        height,
        styles
      } = this.props;
      return _index.renderUtils.addHeightToStyle(height, styles);
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return GroupPanelVerticalLayout;
}(_inferno2.BaseInfernoComponent);
GroupPanelVerticalLayout.defaultProps = VerticalGroupPanelLayoutProps;
