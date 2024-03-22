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