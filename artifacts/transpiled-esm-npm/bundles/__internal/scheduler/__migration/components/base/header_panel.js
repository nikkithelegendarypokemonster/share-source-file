"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderPanelDefaultProps = exports.HeaderPanel = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/component_wrappers/utils/index");
var _inferno2 = require("inferno");
var _index2 = require("../../utils/index");
var _date_header = require("./date_header");
var _group_panel = require("./group_panel");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const HeaderPanelDefaultProps = exports.HeaderPanelDefaultProps = _extends(_extends({}, _group_panel.GroupPanelDefaultProps), {
  isRenderDateHeader: true,
  dateHeaderTemplate: _date_header.DateHeader
});
let HeaderPanel = exports.HeaderPanel = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(HeaderPanel, _InfernoWrapperCompon);
  function HeaderPanel() {
    return _InfernoWrapperCompon.apply(this, arguments) || this;
  }
  var _proto = HeaderPanel.prototype;
  // eslint-disable-next-line class-methods-use-this
  _proto.createEffects = function createEffects() {
    return [(0, _inferno.createReRenderEffect)()];
  };
  _proto.render = function render() {
    const {
      dateHeaderData,
      groupByDate,
      groupOrientation,
      groupPanelData,
      groups,
      isRenderDateHeader,
      dateCellTemplate,
      dateHeaderTemplate,
      resourceCellTemplate,
      timeCellTemplate
    } = this.props;
    const dateCellTemplateComponent = (0, _index.getTemplate)(dateCellTemplate);
    const dateHeaderTemplateComponent = (0, _index.getTemplate)(dateHeaderTemplate);
    const resourceCellTemplateComponent = (0, _index.getTemplate)(resourceCellTemplate);
    const timeCellTemplateComponent = (0, _index.getTemplate)(timeCellTemplate);
    const isHorizontalGrouping = (0, _index2.isHorizontalGroupingApplied)(groups, groupOrientation);
    return (0, _inferno2.createVNode)(1, 'thead', null, [isHorizontalGrouping && !groupByDate && (0, _inferno2.createComponentVNode)(2, _group_panel.GroupPanel, {
      groupPanelData,
      groups,
      groupByDate,
      groupOrientation,
      resourceCellTemplate: resourceCellTemplateComponent
    }), isRenderDateHeader && dateHeaderTemplateComponent({
      groupByDate,
      dateHeaderData,
      groupOrientation,
      groups,
      dateCellTemplate: dateCellTemplateComponent,
      timeCellTemplate: timeCellTemplateComponent
    }), groupByDate && (0, _inferno2.createComponentVNode)(2, _group_panel.GroupPanel, {
      groupPanelData,
      groups,
      groupByDate,
      groupOrientation,
      resourceCellTemplate: resourceCellTemplateComponent
    })], 0);
  };
  return HeaderPanel;
}(_inferno.InfernoWrapperComponent);
HeaderPanel.defaultProps = HeaderPanelDefaultProps;