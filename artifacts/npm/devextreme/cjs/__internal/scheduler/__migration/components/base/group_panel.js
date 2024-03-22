/**
* DevExtreme (cjs/__internal/scheduler/__migration/components/base/group_panel.js)
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
exports.GroupPanelDefaultProps = exports.GroupPanel = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/component_wrappers/utils/index");
var _inferno2 = require("inferno");
var _const = require("../../const");
var _index2 = require("../../utils/index");
var _group_panel_horizontal = require("./group_panel_horizontal");
var _group_panel_props = require("./group_panel_props");
var _group_panel_vertical = require("./group_panel_vertical");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const GroupPanelDefaultProps = exports.GroupPanelDefaultProps = _extends(_extends({}, _group_panel_props.GroupPanelBaseDefaultProps), {
  groups: [],
  groupOrientation: _const.VERTICAL_GROUP_ORIENTATION
});
let GroupPanel = exports.GroupPanel = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(GroupPanel, _InfernoWrapperCompon);
  function GroupPanel() {
    return _InfernoWrapperCompon.apply(this, arguments) || this;
  }
  var _proto = GroupPanel.prototype;
  // eslint-disable-next-line class-methods-use-this
  _proto.createEffects = function createEffects() {
    return [(0, _inferno.createReRenderEffect)()];
  };
  _proto.render = function render() {
    const {
      className,
      elementRef,
      groupPanelData,
      height,
      resourceCellTemplate,
      groupOrientation,
      groups,
      styles
    } = this.props;
    const resourceCellTemplateComponent = (0, _index.getTemplate)(resourceCellTemplate);
    const isVerticalLayout = (0, _index2.isVerticalGroupingApplied)(groups, groupOrientation);
    return isVerticalLayout ? (0, _inferno2.createComponentVNode)(2, _group_panel_vertical.GroupPanelVertical, {
      height,
      resourceCellTemplate: resourceCellTemplateComponent,
      className,
      groupPanelData,
      elementRef,
      styles
    }) : (0, _inferno2.createComponentVNode)(2, _group_panel_horizontal.GroupPanelHorizontal, {
      height,
      resourceCellTemplate: resourceCellTemplateComponent,
      className,
      groupPanelData,
      elementRef,
      styles
    });
  };
  return GroupPanel;
}(_inferno.InfernoWrapperComponent);
GroupPanel.defaultProps = GroupPanelDefaultProps;
