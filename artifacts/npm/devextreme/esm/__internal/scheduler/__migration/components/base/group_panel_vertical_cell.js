/**
* DevExtreme (esm/__internal/scheduler/__migration/components/base/group_panel_vertical_cell.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/component_wrappers/utils/index';
import { createVNode } from 'inferno';
import { GroupPanelCellDefaultProps } from './group_panel_props';
export class GroupPanelVerticalCell extends BaseInfernoComponent {
  render() {
    var {
      className,
      data,
      id,
      color,
      text,
      index,
      cellTemplate
    } = this.props;
    var cellTemplateComponent = getTemplate(cellTemplate);
    return createVNode(1, 'div', 'dx-scheduler-group-header '.concat(className), [!!cellTemplateComponent && cellTemplateComponent({
      data: {
        data,
        id,
        color,
        text
      },
      index
    }), !cellTemplateComponent && createVNode(1, 'div', 'dx-scheduler-group-header-content', text, 0)], 0);
  }
}
GroupPanelVerticalCell.defaultProps = GroupPanelCellDefaultProps;
