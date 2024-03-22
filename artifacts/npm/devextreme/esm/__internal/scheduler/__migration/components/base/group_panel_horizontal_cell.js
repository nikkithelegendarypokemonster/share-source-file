/**
* DevExtreme (esm/__internal/scheduler/__migration/components/base/group_panel_horizontal_cell.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
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
