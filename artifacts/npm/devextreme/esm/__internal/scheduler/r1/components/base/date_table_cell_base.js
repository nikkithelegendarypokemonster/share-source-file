/**
* DevExtreme (esm/__internal/scheduler/r1/components/base/date_table_cell_base.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { createFragment, createComponentVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/r1/utils/index';
import { combineClasses } from '../../../../core/r1/utils/render_utils';
import { renderUtils } from '../../utils/index';
import { DATE_TABLE_CELL_CLASS } from '../const';
import { CellBase, CellBaseDefaultProps } from './cell';
export const DateTableCallBaseDefaultProps = _extends({}, CellBaseDefaultProps, {
  otherMonth: false,
  today: false,
  firstDayOfMonth: false,
  isSelected: false,
  isFocused: false
});
const ADD_APPOINTMENT_LABEL = 'Add appointment';
export class DateTableCellBase extends BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this.dataCellTemplateProps = null;
  }
  getDataCellTemplateProps() {
    if (this.dataCellTemplateProps !== null) {
      return this.dataCellTemplateProps;
    }
    const {
      allDay,
      contentTemplateProps,
      endDate,
      groupIndex,
      groups,
      index,
      startDate
    } = this.props;
    this.dataCellTemplateProps = {
      data: _extends({
        startDate,
        endDate,
        groups,
        groupIndex: groups ? groupIndex : undefined,
        text: '',
        allDay: !!allDay || undefined
      }, contentTemplateProps === null || contentTemplateProps === void 0 ? void 0 : contentTemplateProps.data),
      index
    };
    return this.dataCellTemplateProps;
  }
  componentWillUpdate(nextProps) {
    if (this.props.allDay !== nextProps.allDay || this.props.contentTemplateProps !== nextProps.contentTemplateProps || this.props.endDate !== nextProps.endDate || this.props.groupIndex !== nextProps.groupIndex || this.props.groups !== nextProps.groups || this.props.index !== nextProps.index || this.props.startDate !== nextProps.startDate) {
      this.dataCellTemplateProps = null;
    }
  }
  render() {
    const {
      viewContext,
      allDay,
      className,
      isFocused,
      isSelected,
      isFirstGroupCell,
      isLastGroupCell,
      dataCellTemplate,
      children
    } = this.props;
    const {
      view: {
        type: viewType
      },
      crossScrollingEnabled
    } = viewContext;
    const cellSizeHorizontalClass = renderUtils.getCellSizeHorizontalClass(viewType, crossScrollingEnabled);
    const cellSizeVerticalClass = renderUtils.getCellSizeVerticalClass(!!allDay);
    const classes = combineClasses({
      [cellSizeHorizontalClass]: true,
      [cellSizeVerticalClass]: true,
      [DATE_TABLE_CELL_CLASS]: !allDay,
      'dx-state-focused': isSelected,
      'dx-scheduler-focused-cell': isFocused,
      [className ?? '']: true
    });
    const ariaLabel = isSelected ? ADD_APPOINTMENT_LABEL : undefined;
    const dataCellTemplateProps = this.getDataCellTemplateProps();
    const DataCellTemplateComponent = getTemplate(dataCellTemplate);
    return (// @ts-ignore
      createComponentVNode(2, CellBase, {
        "className": classes,
        "viewContext": viewContext,
        "isFirstGroupCell": isFirstGroupCell,
        "isLastGroupCell": isLastGroupCell,
        "ariaLabel": ariaLabel,
        "startDate": CellBaseDefaultProps.startDate,
        "endDate": CellBaseDefaultProps.endDate,
        "index": CellBaseDefaultProps.index,
        children: createFragment([!DataCellTemplateComponent && children, !!DataCellTemplateComponent && DataCellTemplateComponent({
          index: dataCellTemplateProps.index,
          data: dataCellTemplateProps.data
        })], 0)
      })
    );
  }
}
DateTableCellBase.defaultProps = DateTableCallBaseDefaultProps;
