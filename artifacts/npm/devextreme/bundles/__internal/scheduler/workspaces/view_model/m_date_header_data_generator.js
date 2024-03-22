/**
* DevExtreme (bundles/__internal/scheduler/workspaces/view_model/m_date_header_data_generator.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateHeaderDataGenerator = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _m_constants = require("../../../scheduler/m_constants");
var _index = require("../../__migration/utils/index");
var _m_utils_time_zone = _interopRequireDefault(require("../../m_utils_time_zone"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
let DateHeaderDataGenerator = exports.DateHeaderDataGenerator = /*#__PURE__*/function () {
  function DateHeaderDataGenerator(_viewDataGenerator) {
    this._viewDataGenerator = _viewDataGenerator;
  }
  var _proto = DateHeaderDataGenerator.prototype;
  _proto.getCompleteDateHeaderMap = function getCompleteDateHeaderMap(options, completeViewDataMap) {
    const {
      isGenerateWeekDaysHeaderData
    } = options;
    const result = [];
    if (isGenerateWeekDaysHeaderData) {
      const weekDaysRow = this._generateWeekDaysHeaderRowMap(options, completeViewDataMap);
      result.push(weekDaysRow);
    }
    const dateRow = this._generateHeaderDateRow(options, completeViewDataMap);
    result.push(dateRow);
    return result;
  };
  _proto._generateWeekDaysHeaderRowMap = function _generateWeekDaysHeaderRowMap(options, completeViewDataMap) {
    const {
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
    const cellCountInDay = this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    const horizontalGroupCount = (0, _index.getHorizontalGroupCount)(groups, groupOrientation);
    const index = completeViewDataMap[0][0].allDay ? 1 : 0;
    const colSpan = isGroupedByDate ? horizontalGroupCount * cellCountInDay : cellCountInDay;
    const groupCount = (0, _index.getGroupCount)(groups);
    const datesRepeatCount = isHorizontalGrouping && !isGroupedByDate ? groupCount : 1;
    const daysInGroup = this._viewDataGenerator.daysInInterval * intervalCount;
    const daysInView = daysInGroup * datesRepeatCount;
    const weekDaysRow = [];
    for (let dayIndex = 0; dayIndex < daysInView; dayIndex += 1) {
      const cell = completeViewDataMap[index][dayIndex * colSpan];
      const shiftedStartDate = _m_utils_time_zone.default.addOffsetsWithoutDST(cell.startDate, -viewOffset);
      weekDaysRow.push(_extends(_extends({}, cell), {
        colSpan,
        text: (0, _index.formatWeekdayAndDay)(shiftedStartDate),
        isFirstGroupCell: false,
        isLastGroupCell: false
      }));
    }
    return weekDaysRow;
  };
  _proto._generateHeaderDateRow = function _generateHeaderDateRow(options, completeViewDataMap) {
    const {
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
    const horizontalGroupCount = (0, _index.getHorizontalGroupCount)(groups, groupOrientation);
    const index = completeViewDataMap[0][0].allDay ? 1 : 0;
    const colSpan = isGroupedByDate ? horizontalGroupCount : 1;
    const isVerticalGrouping = groupOrientation === 'vertical';
    const cellCountInGroupRow = this._viewDataGenerator.getCellCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour
    });
    const cellCountInDay = this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    const slicedByColumnsData = isGroupedByDate ? completeViewDataMap[index].filter((_, columnIndex) => columnIndex % horizontalGroupCount === 0) : completeViewDataMap[index];
    // NOTE: Should leave dates as is when creating time row in timelines.
    const shouldShiftDatesForHeaderText = !(0, _index.isTimelineView)(viewType) || viewType === _m_constants.VIEWS.TIMELINE_MONTH;
    return slicedByColumnsData.map((_a, idx) => {
      var {
          startDate,
          endDate,
          isFirstGroupCell,
          isLastGroupCell
        } = _a,
        restProps = __rest(_a, ["startDate", "endDate", "isFirstGroupCell", "isLastGroupCell"]);
      const shiftedStartDate = _m_utils_time_zone.default.addOffsetsWithoutDST(startDate, -viewOffset);
      const shiftedStartDateForHeaderText = shouldShiftDatesForHeaderText ? shiftedStartDate : startDate;
      const text = (0, _index.getHeaderCellText)(idx % cellCountInGroupRow, shiftedStartDateForHeaderText, headerCellTextFormat, getDateForHeaderText, {
        interval,
        startViewDate,
        startDayHour,
        cellCountInDay,
        viewOffset
      });
      return _extends(_extends({}, restProps), {
        startDate,
        text,
        today: _date.default.sameDate(shiftedStartDate, today),
        colSpan,
        isFirstGroupCell: isGroupedByDate || isFirstGroupCell && !isVerticalGrouping,
        isLastGroupCell: isGroupedByDate || isLastGroupCell && !isVerticalGrouping
      });
    });
  };
  _proto.generateDateHeaderData = function generateDateHeaderData(completeDateHeaderMap, completeViewDataMap, options) {
    const {
      isGenerateWeekDaysHeaderData,
      cellWidth,
      isProvideVirtualCellsWidth,
      startDayHour,
      endDayHour,
      hoursInterval,
      isMonthDateHeader
    } = options;
    const dataMap = [];
    let weekDayRowConfig = {};
    const validCellWidth = cellWidth || 0;
    if (isGenerateWeekDaysHeaderData) {
      weekDayRowConfig = this._generateDateHeaderDataRow(options, completeDateHeaderMap, completeViewDataMap, this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval), 0, validCellWidth);
      dataMap.push(weekDayRowConfig.dateRow);
    }
    const datesRowConfig = this._generateDateHeaderDataRow(options, completeDateHeaderMap, completeViewDataMap, 1, isGenerateWeekDaysHeaderData ? 1 : 0, validCellWidth);
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
  };
  _proto._generateDateHeaderDataRow = function _generateDateHeaderDataRow(options, completeDateHeaderMap, completeViewDataMap, baseColSpan, rowIndex, cellWidth) {
    const {
      startCellIndex,
      cellCount,
      isProvideVirtualCellsWidth,
      groups,
      groupOrientation,
      isGroupedByDate
    } = options;
    const horizontalGroupCount = (0, _index.getHorizontalGroupCount)(groups, groupOrientation);
    const colSpan = isGroupedByDate ? horizontalGroupCount * baseColSpan : baseColSpan;
    const leftVirtualCellCount = Math.floor(startCellIndex / colSpan);
    const displayedCellCount = (0, _index.getDisplayedCellCount)(cellCount, completeViewDataMap);
    const actualCellCount = Math.ceil((startCellIndex + displayedCellCount) / colSpan);
    const totalCellCount = (0, _index.getTotalCellCountByCompleteData)(completeViewDataMap);
    const dateRow = completeDateHeaderMap[rowIndex].slice(leftVirtualCellCount, actualCellCount);
    const finalLeftVirtualCellCount = leftVirtualCellCount * colSpan;
    const finalLeftVirtualCellWidth = finalLeftVirtualCellCount * cellWidth;
    const finalRightVirtualCellCount = totalCellCount - actualCellCount * colSpan;
    const finalRightVirtualCellWidth = finalRightVirtualCellCount * cellWidth;
    return {
      dateRow,
      leftVirtualCellCount: finalLeftVirtualCellCount,
      leftVirtualCellWidth: isProvideVirtualCellsWidth ? finalLeftVirtualCellWidth : undefined,
      rightVirtualCellCount: finalRightVirtualCellCount,
      rightVirtualCellWidth: isProvideVirtualCellsWidth ? finalRightVirtualCellWidth : undefined
    };
  };
  return DateHeaderDataGenerator;
}();
