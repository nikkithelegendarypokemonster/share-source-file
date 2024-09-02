/**
* DevExtreme (esm/__internal/scheduler/r1/utils/week.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import dateUtils from '../../../../core/utils/date';
import dateLocalization from '../../../../localization/date';
import { getCalculatedFirstDayOfWeek, getValidCellDateForLocalTimeFormat, getViewStartByOptions, setOptionHour } from './base';
// T410490: incorrectly displaying time slots on Linux
export const getTimePanelCellText = (rowIndex, date, startViewDate, cellDuration, startDayHour, viewOffset) => {
  if (rowIndex % 2 !== 0) {
    return '';
  }
  const validTimeDate = getValidCellDateForLocalTimeFormat(date, {
    startViewDate,
    startDayHour,
    cellIndexShift: Math.round(cellDuration) * rowIndex,
    viewOffset
  });
  return dateLocalization.format(validTimeDate, 'shorttime');
};
export const getIntervalDuration = intervalCount => dateUtils.dateToMilliseconds('day') * 7 * intervalCount;
export const getValidStartDate = (startDate, firstDayOfWeek) => startDate ? dateUtils.getFirstWeekDate(startDate, firstDayOfWeek) : undefined;
export const calculateStartViewDate = (currentDate, startDayHour, startDate, intervalDuration, firstDayOfWeekOption) => {
  const firstDayOfWeek = getCalculatedFirstDayOfWeek(firstDayOfWeekOption);
  const viewStart = getViewStartByOptions(startDate, currentDate, intervalDuration, getValidStartDate(startDate, firstDayOfWeek));
  const firstViewDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);
  return setOptionHour(firstViewDate, startDayHour);
};
export const calculateViewStartDate = (startDateOption, firstDayOfWeek) => {
  const validFirstDayOfWeek = firstDayOfWeek ?? dateLocalization.firstDayOfWeekIndex();
  return dateUtils.getFirstWeekDate(startDateOption, validFirstDayOfWeek);
};
