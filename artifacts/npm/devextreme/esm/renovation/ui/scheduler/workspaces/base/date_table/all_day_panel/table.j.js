/**
* DevExtreme (esm/renovation/ui/scheduler/workspaces/base/date_table/all_day_panel/table.j.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import registerComponent from '../../../../../../../core/component_registrator';
import { DateTable } from '../../../../../../component_wrapper/scheduler/date_table';
import { AllDayTable as AllDayTableComponent } from './table';
export default class AllDayTable extends DateTable {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ['dataCellTemplate'],
      props: ['viewData', 'groupOrientation', 'leftVirtualCellWidth', 'rightVirtualCellWidth', 'topVirtualRowHeight', 'bottomVirtualRowHeight', 'addDateTableClass', 'addVerticalSizesClassToRows', 'width', 'dataCellTemplate']
    };
  }
  get _viewComponent() {
    return AllDayTableComponent;
  }
}
registerComponent('dxAllDayTable', AllDayTable);