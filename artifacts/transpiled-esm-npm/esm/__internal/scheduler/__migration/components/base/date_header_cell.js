import _extends from "@babel/runtime/helpers/esm/extends";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/component_wrappers/utils/index';
import { createComponentVNode, createFragment, createVNode } from 'inferno';
import { renderUtils } from '../../utils/index';
import { CellBaseDefaultProps } from './cell';
import { DateHeaderText } from './date_header_text';
var DateHeaderCellDefaultProps = _extends(_extends({}, CellBaseDefaultProps), {
  today: false,
  colSpan: 1,
  isWeekDayCell: false,
  splitText: false,
  isTimeCellTemplate: false
});
export class DateHeaderCell extends BaseInfernoComponent {
  render() {
    var {
      colSpan,
      dateCellTemplate,
      groupIndex,
      groups,
      index,
      isTimeCellTemplate,
      splitText,
      startDate,
      text,
      timeCellTemplate,
      className,
      isFirstGroupCell,
      isLastGroupCell,
      isWeekDayCell,
      today
    } = this.props;
    var timeCellTemplateComponent = getTemplate(timeCellTemplate);
    var dateCellTemplateComponent = getTemplate(dateCellTemplate);
    var cellClasses = renderUtils.combineClasses({
      'dx-scheduler-header-panel-cell': true,
      'dx-scheduler-cell-sizes-horizontal': true,
      'dx-scheduler-header-panel-current-time-cell': today,
      'dx-scheduler-header-panel-week-cell': isWeekDayCell,
      [className]: !!className
    });
    var classNames = renderUtils.getGroupCellClasses(isFirstGroupCell, isLastGroupCell, cellClasses);
    var useTemplate = !isTimeCellTemplate && !!dateCellTemplate || isTimeCellTemplate && !!timeCellTemplate;
    var children = useTemplate ? createFragment([isTimeCellTemplate && timeCellTemplateComponent && timeCellTemplateComponent({
      data: {
        date: startDate,
        text,
        groups,
        groupIndex
      },
      index
    }), !isTimeCellTemplate && dateCellTemplateComponent && dateCellTemplateComponent({
      data: {
        date: startDate,
        text,
        groups,
        groupIndex
      },
      index
    })], 0) : createComponentVNode(2, DateHeaderText, {
      splitText,
      text
    });
    return createVNode(1, 'th', classNames, children, 0, {
      colSpan,
      title: text
    });
  }
}
DateHeaderCell.defaultProps = DateHeaderCellDefaultProps;