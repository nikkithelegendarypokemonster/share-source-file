/**
* DevExtreme (esm/__internal/scheduler/__migration/components/base/group_panel_vertical.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/component_wrappers/utils/index';
import { createComponentVNode, createVNode } from 'inferno';
import { renderUtils } from '../../utils/index';
import { GroupPanelBaseDefaultProps } from './group_panel_props';
import { GroupPanelVerticalRow } from './group_panel_vertical_row';
export class GroupPanelVertical extends BaseInfernoComponent {
  render() {
    var {
      className,
      elementRef,
      groupPanelData,
      resourceCellTemplate,
      height,
      styles
    } = this.props;
    var resourceCellTemplateComponent = getTemplate(resourceCellTemplate);
    var style = normalizeStyles(renderUtils.addHeightToStyle(height, styles));
    return createVNode(1, 'div', className, createVNode(1, 'div', 'dx-scheduler-group-flex-container', groupPanelData.groupPanelItems.map(group => createComponentVNode(2, GroupPanelVerticalRow, {
      groupItems: group,
      cellTemplate: resourceCellTemplateComponent
    }, group[0].key)), 0), 2, {
      style
    }, null, elementRef);
  }
}
GroupPanelVertical.defaultProps = GroupPanelBaseDefaultProps;
