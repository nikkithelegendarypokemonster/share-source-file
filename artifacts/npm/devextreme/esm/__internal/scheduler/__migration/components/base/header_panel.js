/**
* DevExtreme (esm/__internal/scheduler/__migration/components/base/header_panel.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/component_wrappers/utils/index';
import { createComponentVNode, createVNode } from 'inferno';
import { isHorizontalGroupingApplied } from '../../utils/index';
import { DateHeader } from './date_header';
import { GroupPanel, GroupPanelDefaultProps } from './group_panel';
export var HeaderPanelDefaultProps = _extends(_extends({}, GroupPanelDefaultProps), {
  isRenderDateHeader: true,
  dateHeaderTemplate: DateHeader
});
export class HeaderPanel extends InfernoWrapperComponent {
  // eslint-disable-next-line class-methods-use-this
  createEffects() {
    return [createReRenderEffect()];
  }
  render() {
    var {
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
    var dateCellTemplateComponent = getTemplate(dateCellTemplate);
    var dateHeaderTemplateComponent = getTemplate(dateHeaderTemplate);
    var resourceCellTemplateComponent = getTemplate(resourceCellTemplate);
    var timeCellTemplateComponent = getTemplate(timeCellTemplate);
    var isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation);
    return createVNode(1, 'thead', null, [isHorizontalGrouping && !groupByDate && createComponentVNode(2, GroupPanel, {
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
    }), groupByDate && createComponentVNode(2, GroupPanel, {
      groupPanelData,
      groups,
      groupByDate,
      groupOrientation,
      resourceCellTemplate: resourceCellTemplateComponent
    })], 0);
  }
}
HeaderPanel.defaultProps = HeaderPanelDefaultProps;
