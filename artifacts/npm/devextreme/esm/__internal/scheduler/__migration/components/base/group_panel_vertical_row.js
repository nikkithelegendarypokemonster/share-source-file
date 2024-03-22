/**
* DevExtreme (esm/__internal/scheduler/__migration/components/base/group_panel_vertical_row.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
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
