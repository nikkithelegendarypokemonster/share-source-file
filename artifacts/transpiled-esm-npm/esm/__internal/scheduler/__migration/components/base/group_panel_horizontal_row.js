import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/component_wrappers/utils/index';
import { createComponentVNode, createVNode } from 'inferno';
import { GroupPanelHorizontalCell } from './group_panel_horizontal_cell';
import { GroupPanelRowDefaultProps } from './group_panel_props';
export class GroupPanelHorizontalRow extends BaseInfernoComponent {
  render() {
    var {
      cellTemplate,
      className,
      groupItems
    } = this.props;
    var cellTemplateComponent = getTemplate(cellTemplate);
    return createVNode(1, 'tr', 'dx-scheduler-group-row '.concat(className), groupItems.map((_ref2, index) => {
      var {
        colSpan,
        color,
        data,
        id,
        isFirstGroupCell,
        isLastGroupCell,
        key,
        text
      } = _ref2;
      return createComponentVNode(2, GroupPanelHorizontalCell, {
        text,
        id,
        data,
        index,
        color,
        colSpan,
        isFirstGroupCell: !!isFirstGroupCell,
        isLastGroupCell: !!isLastGroupCell,
        cellTemplate: cellTemplateComponent
      }, key);
    }), 0);
  }
}
GroupPanelHorizontalRow.defaultProps = GroupPanelRowDefaultProps;