import _extends from "@babel/runtime/helpers/esm/extends";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import dateUtils from '../../../../core/utils/date';
import { VIEWS } from '../../../scheduler/m_constants';
import { formatWeekdayAndDay, getDisplayedCellCount, getGroupCount, getHeaderCellText, getHorizontalGroupCount, getTotalCellCountByCompleteData, isTimelineView } from '../../__migration/utils/index';
import timeZoneUtils from '../../m_utils_time_zone';
export class DateHeaderDataGenerator {
  constructor(_viewDataGenerator) {
    this._viewDataGenerator = _viewDataGenerator;
  }
  getCompleteDateHeaderMap(options, completeViewDataMap) {
    var {
      isGenerateWeekDaysHeaderData
    } = options;
    var result = [];
    if (isGenerateWeekDaysHeaderData) {
      var weekDaysRow = this._generateWeekDaysHeaderRowMap(options, completeViewDataMap);
      result.push(weekDaysRow);
    }
    var dateRow = this._generateHeaderDateRow(options, completeViewDataMap);
    result.push(dateRow);
    return result;
  }
  _generateWeekDaysHeaderRowMap(options, completeViewDataMap) {
    var {
      isGroupedByDate,
      groups,
      groupOrientation,
      startDayHour,
      endDayHour,
      hoursInterval,
      isHorizontalGrouping,
      intervalCount,
      viewOffset
    } = options;
    var cellCountInDay = this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    var horizontalGroupCount = getHorizontalGroupCount(groups, groupOrientation);
    var index = completeViewDataMap[0][0].allDay ? 1 : 0;
    var colSpan = isGroupedByDate ? horizontalGroupCount * cellCountInDay : cellCountInDay;
    var groupCount = getGroupCount(groups);
    var datesRepeatCount = isHorizontalGrouping && !isGroupedByDate ? groupCount : 1;
    var daysInGroup = this._viewDataGenerator.daysInInterval * intervalCount;
    var daysInView = daysInGroup * datesRepeatCount;
    var weekDaysRow = [];
    for (var dayIndex = 0; dayIndex < daysInView; dayIndex += 1) {
      var cell = completeViewDataMap[index][dayIndex * colSpan];
      var shiftedStartDate = timeZoneUtils.addOffsetsWithoutDST(cell.startDate, -viewOffset);
      weekDaysRow.push(_extends(_extends({}, cell), {
        colSpan,
        text: formatWeekdayAndDay(shiftedStartDate),
        isFirstGroupCell: false,
        isLastGroupCell: false
      }));
    }
    return weekDaysRow;
  }
  _generateHeaderDateRow(options, completeViewDataMap) {
    var {
      today,
      isGroupedByDate,
      groupOrientation,
      groups,
      headerCellTextFormat,
      getDateForHeaderText,
      interval,
      startViewDate,
      startDayHour,
      endDayHour,
      hoursInterval,
      intervalCount,
      currentDate,
      viewType,
      viewOffset
    } = options;
    var horizontalGroupCount = getHorizontalGroupCount(groups, groupOrientation);
    var index = completeViewDataMap[0][0].allDay ? 1 : 0;
    var colSpan = isGroupedByDate ? horizontalGroupCount : 1;
    var isVerticalGrouping = groupOrientation === 'vertical';
    var cellCountInGroupRow = this._viewDataGenerator.getCellCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour
    });
    var cellCountInDay = this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    var slicedByColumnsData = isGroupedByDate ? completeViewDataMap[index].filter((_, columnIndex) => columnIndex % horizontalGroupCount === 0) : completeViewDataMap[index];
    // NOTE: Should leave dates as is when creating time row in timelines.
    var shouldShiftDatesForHeaderText = !isTimelineView(viewType) || viewType === VIEWS.TIMELINE_MONTH;
    return slicedByColumnsData.map((_a, idx) => {
      var {
          startDate,
          endDate,
          isFirstGroupCell,
          isLastGroupCell
        } = _a,
        restProps = __rest(_a, ["startDate", "endDate", "isFirstGroupCell", "isLastGroupCell"]);
      var shiftedStartDate = timeZoneUtils.addOffsetsWithoutDST(startDate, -viewOffset);
      var shiftedStartDateForHeaderText = shouldShiftDatesForHeaderText ? shiftedStartDate : startDate;
      var text = getHeaderCellText(idx % cellCountInGroupRow, shiftedStartDateForHeaderText, headerCellTextFormat, getDateForHeaderText, {
        interval,
        startViewDate,
        startDayHour,
        cellCountInDay,
        viewOffset
      });
      return _extends(_extends({}, restProps), {
        startDate,
        text,
        today: dateUtils.sameDate(shiftedStartDate, today),
        colSpan,
        isFirstGroupCell: isGroupedByDate || isFirstGroupCell && !isVerticalGrouping,
        isLastGroupCell: isGroupedByDate || isLastGroupCell && !isVerticalGrouping
      });
    });
  }
  generateDateHeaderData(completeDateHeaderMap, completeViewDataMap, options) {
    var {
      isGenerateWeekDaysHeaderData,
      cellWidth,
      isProvideVirtualCellsWidth,
      startDayHour,
      endDayHour,
      hoursInterval,
      isMonthDateHeader
    } = options;
    var dataMap = [];
    var weekDayRowConfig = {};
    var validCellWidth = cellWidth || 0;
    if (isGenerateWeekDaysHeaderData) {
      weekDayRowConfig = this._generateDateHeaderDataRow(options, completeDateHeaderMap, completeViewDataMap, this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval), 0, validCellWidth);
      dataMap.push(weekDayRowConfig.dateRow);
    }
    var datesRowConfig = this._generateDateHeaderDataRow(options, completeDateHeaderMap, completeViewDataMap, 1, isGenerateWeekDaysHeaderData ? 1 : 0, validCellWidth);
    dataMap.push(datesRowConfig.dateRow);
    return {
      dataMap,
      leftVirtualCellWidth: isProvideVirtualCellsWidth ? datesRowConfig.leftVirtualCellWidth : undefined,
      rightVirtualCellWidth: isProvideVirtualCellsWidth ? datesRowConfig.rightVirtualCellWidth : undefined,
      leftVirtualCellCount: datesRowConfig.leftVirtualCellCount,
      rightVirtualCellCount: datesRowConfig.rightVirtualCellCount,
      weekDayLeftVirtualCellWidth: weekDayRowConfig.leftVirtualCellWidth,
      weekDayRightVirtualCellWidth: weekDayRowConfig.rightVirtualCellWidth,
      weekDayLeftVirtualCellCount: weekDayRowConfig.leftVirtualCellCount,
      weekDayRightVirtualCellCount: weekDayRowConfig.rightVirtualCellCount,
      isMonthDateHeader
    };
  }
  _generateDateHeaderDataRow(options, completeDateHeaderMap, completeViewDataMap, baseColSpan, rowIndex, cellWidth) {
    var {
      startCellIndex,
      cellCount,
      isProvideVirtualCellsWidth,
      groups,
      groupOrientation,
      isGroupedByDate
    } = options;
    var horizontalGroupCount = getHorizontalGroupCount(groups, groupOrientation);
    var colSpan = isGroupedByDate ? horizontalGroupCount * baseColSpan : baseColSpan;
    var leftVirtualCellCount = Math.floor(startCellIndex / colSpan);
    var displayedCellCount = getDisplayedCellCount(cellCount, completeViewDataMap);
    var actualCellCount = Math.ceil((startCellIndex + displayedCellCount) / colSpan);
    var totalCellCount = getTotalCellCountByCompleteData(completeViewDataMap);
    var dateRow = completeDateHeaderMap[rowIndex].slice(leftVirtualCellCount, actualCellCount);
    var finalLeftVirtualCellCount = leftVirtualCellCount * colSpan;
    var finalLeftVirtualCellWidth = finalLeftVirtualCellCount * cellWidth;
    var finalRightVirtualCellCount = totalCellCount - actualCellCount * colSpan;
    var finalRightVirtualCellWidth = finalRightVirtualCellCount * cellWidth;
    return {
      dateRow,
      leftVirtualCellCount: finalLeftVirtualCellCount,
      leftVirtualCellWidth: isProvideVirtualCellsWidth ? finalLeftVirtualCellWidth : undefined,
      rightVirtualCellCount: finalRightVirtualCellCount,
      rightVirtualCellWidth: isProvideVirtualCellsWidth ? finalRightVirtualCellWidth : undefined
    };
  }
}