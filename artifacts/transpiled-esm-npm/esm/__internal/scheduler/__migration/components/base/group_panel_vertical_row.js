import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/component_wrappers/utils/index';
import { createComponentVNode, createVNode } from 'inferno';
import { GroupPanelRowDefaultProps } from './group_panel_props';
import { GroupPanelVerticalCell } from './group_panel_vertical_cell';
export class GroupPanelVerticalRow extends BaseInfernoComponent {
  render() {
    var {
      className,
      groupItems,
      cellTemplate
    } = this.props;
    var cellTemplateComponent = getTemplate(cellTemplate);
    return createVNode(1, 'div', 'dx-scheduler-group-row '.concat(className), groupItems.map((item, index) => {
      var {
        color,
        data,
        id,
        key,
        text
      } = item;
      return createComponentVNode(2, GroupPanelVerticalCell, {
        text,
        id,
        data,
        index,
        color,
        cellTemplate: cellTemplateComponent
      }, key);
    }), 0);
  }
}
GroupPanelVerticalRow.defaultProps = GroupPanelRowDefaultProps;