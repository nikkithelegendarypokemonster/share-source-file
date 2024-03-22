/**
* DevExtreme (esm/__internal/scheduler/__migration/components/base/group_panel.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/component_wrappers/utils/index';
import { createComponentVNode } from 'inferno';
import { VERTICAL_GROUP_ORIENTATION } from '../../const';
import { isVerticalGroupingApplied } from '../../utils/index';
import { GroupPanelHorizontal } from './group_panel_horizontal';
import { GroupPanelBaseDefaultProps } from './group_panel_props';
import { GroupPanelVertical } from './group_panel_vertical';
export var GroupPanelDefaultProps = _extends(_extends({}, GroupPanelBaseDefaultProps), {
  groups: [],
  groupOrientation: VERTICAL_GROUP_ORIENTATION
});
export class GroupPanel extends InfernoWrapperComponent {
  // eslint-disable-next-line class-methods-use-this
  createEffects() {
    return [createReRenderEffect()];
  }
  render() {
    var {
      className,
      elementRef,
      groupPanelData,
      height,
      resourceCellTemplate,
      groupOrientation,
      groups,
      styles
    } = this.props;
    var resourceCellTemplateComponent = getTemplate(resourceCellTemplate);
    var isVerticalLayout = isVerticalGroupingApplied(groups, groupOrientation);
    return isVerticalLayout ? createComponentVNode(2, GroupPanelVertical, {
      height,
      resourceCellTemplate: resourceCellTemplateComponent,
      className,
      groupPanelData,
      elementRef,
      styles
    }) : createComponentVNode(2, GroupPanelHorizontal, {
      height,
      resourceCellTemplate: resourceCellTemplateComponent,
      className,
      groupPanelData,
      elementRef,
      styles
    });
  }
}
GroupPanel.defaultProps = GroupPanelDefaultProps;
