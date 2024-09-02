/**
* DevExtreme (cjs/__internal/scheduler/r1/components/timeline/header_panel_timeline.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderPanelTimeline = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _header_panel = require("../base/header_panel");
var _date_header_timeline = require("./date_header_timeline");
class HeaderPanelTimeline extends _inferno2.InfernoWrapperComponent {
  createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  }
  render() {
    const {
      viewContext,
      dateCellTemplate,
      dateHeaderData,
      groupByDate,
      groupOrientation,
      groupPanelData,
      groups,
      isRenderDateHeader,
      resourceCellTemplate,
      timeCellTemplate
    } = this.props;
    const DateCellTemplateComponent = (0, _index.getTemplate)(dateCellTemplate);
    const ResourceCellTemplateComponent = (0, _index.getTemplate)(resourceCellTemplate);
    const TimeCellTemplateComponent = (0, _index.getTemplate)(timeCellTemplate);
    return (// @ts-ignore
      (0, _inferno.createComponentVNode)(2, _header_panel.HeaderPanel, {
        "viewContext": viewContext,
        "dateHeaderData": dateHeaderData,
        "groupPanelData": groupPanelData,
        "groupByDate": groupByDate,
        "groups": groups,
        "groupOrientation": groupOrientation,
        "isRenderDateHeader": isRenderDateHeader,
        "dateHeaderTemplate": _date_header_timeline.TimelineDateHeaderLayout,
        "resourceCellTemplate": ResourceCellTemplateComponent,
        "dateCellTemplate": DateCellTemplateComponent,
        "timeCellTemplate": TimeCellTemplateComponent
      })
    );
  }
}
exports.HeaderPanelTimeline = HeaderPanelTimeline;
HeaderPanelTimeline.defaultProps = _header_panel.HeaderPanelDefaultProps;
