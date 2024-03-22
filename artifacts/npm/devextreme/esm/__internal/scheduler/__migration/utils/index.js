/**
* DevExtreme (esm/__internal/scheduler/__migration/utils/index.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { getThemeType } from '../../../scheduler/__migration/utils/themes';
import { calculateStartViewDate } from './agenda';
import { calculateStartViewDate as dayCalculateStartViewDate } from './day';
import { calculateCellIndex, calculateStartViewDate as monthCalculateStartViewDate, getCellText, getViewStartByOptions } from './month';
import { addHeightToStyle, addToStyles, addWidthToStyle, combineClasses, getGroupCellClasses } from './render';
import { calculateStartViewDate as timelineMonthCalculateStartViewDate } from './timeline_month';
import { getDateForHeaderText } from './timeline_week';
import { getCurrentView } from './views';
import { calculateStartViewDate as weekCalculateStartViewDate, calculateViewStartDate as weekCalculateViewStartDate, getIntervalDuration, getTimePanelCellText } from './week';
import { calculateStartViewDate as workWeekCalculateStartViewDate } from './work_week';
export { calculateCellIndex, calculateDayDuration, calculateIsGroupedAllDayPanel, calculateViewStartDate, extendGroupItemsForGroupingByDate, getAppointmentKey, getAppointmentRenderingStrategyName, getAppointmentTakesAllDay, getCalculatedFirstDayOfWeek, getCellDuration, getDatesWithoutTime, getDisplayedCellCount, getDisplayedRowCount, getGroupCount, getGroupPanelData, getHeaderCellText, getHorizontalGroupCount, getIsGroupedAllDayPanel, getKeyByGroup, getOverflowIndicatorColor, getSkippedHoursInRange, getStartViewDateTimeOffset, getStartViewDateWithoutDST, getToday, getTotalCellCountByCompleteData, getTotalRowCountByCompleteData, getValidCellDateForLocalTimeFormat, getVerticalGroupCountClass, getViewStartByOptions, getWeekendsCount, hasResourceValue, isDataOnWeekend, isDateAndTimeView, isDateInRange, isFirstCellInMonthWithIntervalCount, isGroupingByDate, isHorizontalGroupingApplied, isHorizontalView, isTimelineView, isVerticalGroupingApplied, setOptionHour, splitNumber } from './base';
export { getPreparedDataItems } from './data';
export { excludeFromRecurrence } from './exclude_from_recurrence';
export { formatWeekday, formatWeekdayAndDay } from './format_weekday';
export var agendaUtils = {
  calculateStartViewDate
};
export var dayUtils = {
  calculateStartViewDate: dayCalculateStartViewDate
};
export var weekUtils = {
  getIntervalDuration,
  getTimePanelCellText,
  calculateStartViewDate: weekCalculateStartViewDate,
  calculateViewStartDate: weekCalculateViewStartDate
};
export var workWeekUtils = {
  calculateStartViewDate: workWeekCalculateStartViewDate
};
export var monthUtils = {
  getViewStartByOptions,
  getCellText,
  calculateCellIndex,
  calculateStartViewDate: monthCalculateStartViewDate
};
export var timelineWeekUtils = {
  getDateForHeaderText
};
export var timelineMonthUtils = {
  calculateStartViewDate: timelineMonthCalculateStartViewDate
};
export var viewsUtils = {
  getCurrentView
};
export var renderUtils = {
  addToStyles,
  addWidthToStyle,
  addHeightToStyle,
  getGroupCellClasses,
  combineClasses
};
export var themeUtils = {
  getThemeType
};
