import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/component_wrappers/utils/index';
import { createComponentVNode, createFragment } from 'inferno';
import { isHorizontalGroupingApplied, themeUtils } from '../../utils/index';
import { DateHeaderCell } from './date_header_cell';
import { Row } from './row';
var {
  isMaterialBased
} = themeUtils.getThemeType();
var DateHeaderDefaultProps = {
  groupOrientation: 'horizontal',
  groupByDate: false,
  groups: []
};
export class DateHeader extends BaseInfernoComponent {
  render() {
    var {
      dateCellTemplate,
      dateHeaderData: {
        dataMap,
        leftVirtualCellCount,
        leftVirtualCellWidth,
        rightVirtualCellCount,
        rightVirtualCellWidth
      },
      groupByDate,
      groupOrientation,
      groups
    } = this.props;
    var dateCellTemplateComponent = getTemplate(dateCellTemplate);
    var isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation) && !groupByDate;
    return createFragment(dataMap.map((dateHeaderRow, rowIndex) => createComponentVNode(2, Row, {
      className: 'dx-scheduler-header-row',
      leftVirtualCellWidth,
      leftVirtualCellCount,
      rightVirtualCellWidth,
      rightVirtualCellCount,
      isHeaderRow: true,
      children: dateHeaderRow.map(_ref2 => {
        var {
          colSpan,
          endDate,
          groupIndex,
          groups: cellGroups,
          index,
          isFirstGroupCell,
          isLastGroupCell,
          key,
          startDate,
          text,
          today
        } = _ref2;
        return createComponentVNode(2, DateHeaderCell, {
          startDate,
          endDate,
          groups: isHorizontalGrouping ? cellGroups : undefined,
          groupIndex: isHorizontalGrouping ? groupIndex : undefined,
          today,
          index,
          text,
          isFirstGroupCell,
          isLastGroupCell,
          dateCellTemplate: dateCellTemplateComponent,
          colSpan,
          splitText: isMaterialBased
        }, key);
      })
    }, rowIndex.toString())), 0);
  }
}
DateHeader.defaultProps = DateHeaderDefaultProps;