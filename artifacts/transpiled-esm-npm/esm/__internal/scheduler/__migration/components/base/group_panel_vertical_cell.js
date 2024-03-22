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