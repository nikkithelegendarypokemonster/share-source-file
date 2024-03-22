import _extends from "@babel/runtime/helpers/esm/extends";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/component_wrappers/utils/index';
import { createVNode } from 'inferno';
import { renderUtils } from '../../utils/index';
import { GroupPanelCellDefaultProps } from './group_panel_props';
var GroupPanelHorizontalCellDefaultProps = _extends(_extends({}, GroupPanelCellDefaultProps), {
  isFirstGroupCell: false,
  isLastGroupCell: false,
  colSpan: 1
});
export class GroupPanelHorizontalCell extends BaseInfernoComponent {
  render() {
    var {
      cellTemplate,
      colSpan,
      color,
      data,
      id,
      index,
      text,
      className,
      isFirstGroupCell,
      isLastGroupCell
    } = this.props;
    var cellTemplateComponent = getTemplate(cellTemplate);
    var classNames = renderUtils.combineClasses({
      'dx-scheduler-group-header': true,
      'dx-scheduler-first-group-cell': isFirstGroupCell,
      'dx-scheduler-last-group-cell': isLastGroupCell,
      [className]: !!className
    });
    return createVNode(1, 'th', classNames, createVNode(1, 'div', 'dx-scheduler-group-header-content', [!!cellTemplateComponent && cellTemplateComponent({
      data: {
        data,
        id,
        color,
        text
      },
      index
    }), !cellTemplateComponent && createVNode(1, 'div', null, text, 0)], 0), 2, {
      colSpan
    });
  }
}
GroupPanelHorizontalCell.defaultProps = GroupPanelHorizontalCellDefaultProps;