/**
* DevExtreme (esm/__internal/scheduler/__migration/components/base/group_panel_horizontal_row.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
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
