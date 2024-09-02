/**
* DevExtreme (esm/__internal/scheduler/r1/components/base/time_panel_table.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["timePanelData", "viewContext", "tableRef", "timeCellTemplate"];
import { createFragment, createComponentVNode, normalizeProps } from "inferno";
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/r1/utils/index';
import { Fragment } from 'inferno';
import { AllDayPanelTitle } from './all_day_panel_title';
import { CellBase, CellBaseDefaultProps } from './cell';
import { Row, RowDefaultProps } from './row';
import { Table } from './table';
import { TimePanelCell } from './time_panel_cell';
export const TimePanelTableDefaultProps = {
  timePanelData: {
    groupedData: [],
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
    topVirtualRowCount: 0,
    bottomVirtualRowCount: 0
  }
};
export class TimePanelTable extends InfernoWrapperComponent {
  createEffects() {
    return [createReRenderEffect()];
  }
  render() {
    const _this$props = this.props,
      {
        timePanelData,
        viewContext,
        tableRef,
        timeCellTemplate
      } = _this$props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    const {
      topVirtualRowHeight,
      bottomVirtualRowHeight
    } = timePanelData;
    const TimeCellTemplateComponent = getTemplate(timeCellTemplate);
    return (// @ts-ignore
      normalizeProps(createComponentVNode(2, Table, _extends({}, restProps, {
        "className": "dx-scheduler-time-panel",
        "topVirtualRowHeight": topVirtualRowHeight ?? 0,
        "bottomVirtualRowHeight": bottomVirtualRowHeight ?? 0,
        "virtualCellsCount": 1,
        "tableRef": tableRef,
        children: timePanelData.groupedData.map(_ref => {
          let {
            dateTable,
            groupIndex,
            isGroupedAllDayPanel,
            key: fragmentKey
          } = _ref;
          return createFragment([isGroupedAllDayPanel && // @ts-ignore
          createComponentVNode(2, Row, {
            "leftVirtualCellWidth": RowDefaultProps.leftVirtualCellWidth,
            "rightVirtualCellWidth": RowDefaultProps.rightVirtualCellWidth,
            children: createComponentVNode(2, CellBase, {
              "className": "dx-scheduler-time-panel-title-cell",
              "viewContext": viewContext,
              "startDate": CellBaseDefaultProps.startDate,
              "endDate": CellBaseDefaultProps.endDate,
              "index": CellBaseDefaultProps.index,
              children: createComponentVNode(2, AllDayPanelTitle)
            })
          }), dateTable.map(_ref2 => {
            let {
              groups,
              highlighted,
              index: cellIndex,
              isFirstGroupCell,
              isLastGroupCell,
              key,
              startDate,
              text
            } = _ref2;
            return (// @ts-ignore
              createComponentVNode(2, Row, {
                "className": "dx-scheduler-time-panel-row",
                "leftVirtualCellWidth": RowDefaultProps.leftVirtualCellWidth,
                "rightVirtualCellWidth": RowDefaultProps.rightVirtualCellWidth,
                children: createComponentVNode(2, TimePanelCell, {
                  "viewContext": viewContext,
                  "startDate": startDate,
                  "endDate": CellBaseDefaultProps.endDate,
                  "text": text,
                  "groups": groups,
                  "groupIndex": groupIndex,
                  "isFirstGroupCell": isFirstGroupCell,
                  "isLastGroupCell": isLastGroupCell,
                  "index": cellIndex,
                  "timeCellTemplate": TimeCellTemplateComponent,
                  "highlighted": highlighted
                })
              }, key)
            );
          })], 0, fragmentKey);
        })
      })))
    );
  }
}
TimePanelTable.defaultProps = TimePanelTableDefaultProps;
