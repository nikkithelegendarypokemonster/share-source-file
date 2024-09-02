/**
* DevExtreme (esm/__internal/scheduler/r1/components/base/group_panel_vertical_cell.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { createVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/r1/utils/index';
import { GroupPanelCellDefaultProps } from './group_panel_props';
export class GroupPanelVerticalCell extends BaseInfernoComponent {
  render() {
    const {
      className,
      data,
      id,
      color,
      text,
      index,
      cellTemplate
    } = this.props;
    const CellTemplateComponent = getTemplate(cellTemplate);
    return createVNode(1, "div", `dx-scheduler-group-header ${className}`, CellTemplateComponent ? CellTemplateComponent({
      data: {
        data,
        id,
        color,
        text
      },
      index
    }) : createVNode(1, "div", "dx-scheduler-group-header-content", text, 0), 0);
  }
}
GroupPanelVerticalCell.defaultProps = GroupPanelCellDefaultProps;
