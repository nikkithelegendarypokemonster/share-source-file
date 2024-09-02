/**
* DevExtreme (esm/__internal/scheduler/r1/components/base/group_panel_horizontal_row.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { createVNode, createComponentVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/r1/utils/index';
import { GroupPanelHorizontalCell, GroupPanelHorizontalCellDefaultProps } from './group_panel_horizontal_cell';
import { GroupPanelRowDefaultProps } from './group_panel_props';
export class GroupPanelHorizontalRow extends BaseInfernoComponent {
  render() {
    const {
      cellTemplate,
      className,
      groupItems
    } = this.props;
    const CellTemplateComponent = getTemplate(cellTemplate);
    return createVNode(1, "tr", `dx-scheduler-group-row ${className}`, groupItems.map((_ref, index) => {
      let {
        colSpan,
        color,
        data,
        id,
        isFirstGroupCell,
        isLastGroupCell,
        key,
        text
        // @ts-ignore
      } = _ref;
      return createComponentVNode(2, GroupPanelHorizontalCell, {
        "text": text,
        "id": id,
        "data": data,
        "index": index,
        "color": color,
        "colSpan": colSpan ?? GroupPanelHorizontalCellDefaultProps.colSpan,
        "isFirstGroupCell": !!isFirstGroupCell,
        "isLastGroupCell": !!isLastGroupCell,
        "cellTemplate": CellTemplateComponent
      }, key);
    }), 0);
  }
}
GroupPanelHorizontalRow.defaultProps = GroupPanelRowDefaultProps;
