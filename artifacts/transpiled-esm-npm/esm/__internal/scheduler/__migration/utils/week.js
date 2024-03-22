import dateUtils from '../../../../core/utils/date';
import dateLocalization from '../../../../localization/date';
import { getCalculatedFirstDayOfWeek, getValidCellDateForLocalTimeFormat, getViewStartByOptions, setOptionHour } from './base';
// T410490: incorrectly displaying time slots on Linux
export var getTimePanelCellText = (rowIndex, date, startViewDate, cellDuration, startDayHour, viewOffset) => {
  if (rowIndex % 2 !== 0) {
    return '';
  }
  var validTimeDate = getValidCellDateForLocalTimeFormat(date, {
    startViewDate,
    startDayHour,
    cellIndexShift: Math.round(cellDuration) * rowIndex,
    viewOffset
  });
  return dateLocalization.format(validTimeDate, 'shorttime');
};
export var getIntervalDuration = intervalCount => dateUtils.dateToMilliseconds('day') * 7 * intervalCount;
export var getValidStartDate = (startDate, firstDayOfWeek) => startDate ? dateUtils.getFirstWeekDate(startDate, firstDayOfWeek) : undefined;
export var calculateStartViewDate = (currentDate, startDayHour, startDate, intervalDuration, firstDayOfWeekOption) => {
  var firstDayOfWeek = getCalculatedFirstDayOfWeek(firstDayOfWeekOption);
  var viewStart = getViewStartByOptions(startDate, currentDate, intervalDuration, getValidStartDate(startDate, firstDayOfWeek));
  var firstViewDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);
  return setOptionHour(firstViewDate, startDayHour);
};
export var calculateViewStartDate = (startDateOption, firstDayOfWeek) => {
  var validFirstDayOfWeek = firstDayOfWeek !== null && firstDayOfWeek !== void 0 ? firstDayOfWeek : dateLocalization.firstDayOfWeekIndex();
  return dateUtils.getFirstWeekDate(startDateOption, validFirstDayOfWeek);
};