/**
* DevExtreme (esm/__internal/scheduler/r1/components/base/header_panel.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode, createComponentVNode } from "inferno";
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/r1/utils/index';
import { isHorizontalGroupingApplied } from '../../utils/index';
import { DateHeader } from './date_header';
import { GroupPanel, GroupPanelDefaultProps } from './group_panel';
export const HeaderPanelDefaultProps = _extends({}, GroupPanelDefaultProps, {
  isRenderDateHeader: true,
  dateHeaderTemplate: DateHeader
});
export class HeaderPanel extends InfernoWrapperComponent {
  // eslint-disable-next-line class-methods-use-this
  createEffects() {
    return [createReRenderEffect()];
  }
  render() {
    const {
      viewContext,
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
    const isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation);
    const DateCellTemplateComponent = getTemplate(dateCellTemplate);
    const DateHeaderTemplateComponent = getTemplate(dateHeaderTemplate);
    const ResourceCellTemplateComponent = getTemplate(resourceCellTemplate);
    const TimeCellTemplateComponent = getTemplate(timeCellTemplate);
    return createVNode(1, "thead", null, [isHorizontalGrouping && !groupByDate && // @ts-ignore
    createComponentVNode(2, GroupPanel, {
      "viewContext": viewContext,
      "groupPanelData": groupPanelData,
      "groups": groups,
      "groupByDate": groupByDate,
      "groupOrientation": groupOrientation,
      "resourceCellTemplate": ResourceCellTemplateComponent
    }), isRenderDateHeader && DateHeaderTemplateComponent({
      viewContext,
      groupByDate,
      dateHeaderData,
      groupOrientation,
      groups,
      dateCellTemplate: DateCellTemplateComponent,
      timeCellTemplate: TimeCellTemplateComponent
    }), groupByDate && // @ts-ignore
    createComponentVNode(2, GroupPanel, {
      "viewContext": viewContext,
      "groupPanelData": groupPanelData,
      "groups": groups,
      "groupByDate": groupByDate,
      "groupOrientation": groupOrientation,
      "resourceCellTemplate": ResourceCellTemplateComponent
    })], 0);
  }
}
HeaderPanel.defaultProps = HeaderPanelDefaultProps;
