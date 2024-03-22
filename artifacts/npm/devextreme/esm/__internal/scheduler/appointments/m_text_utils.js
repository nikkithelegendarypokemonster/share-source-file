/**
* DevExtreme (esm/__internal/scheduler/appointments/m_text_utils.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import dateUtils from '../../../core/utils/date';
import dateLocalization from '../../../localization/date';
export var createFormattedDateText = options => {
  var {
    startDate,
    endDate,
    allDay,
    format
  } = options;
  var formatType = format || getFormatType(startDate, endDate, allDay);
  return formatDates(startDate, endDate, formatType);
};
export var getFormatType = (startDate, endDate, isAllDay, isDateAndTimeView) => {
  if (isAllDay) {
    return 'DATE';
  }
  if (isDateAndTimeView && dateUtils.sameDate(startDate, endDate)) {
    return 'TIME';
  }
  return 'DATETIME';
};
// @ts-expect-error
export var formatDates = (startDate, endDate, formatType) => {
  var dateFormat = 'monthandday';
  var timeFormat = 'shorttime';
  var isSameDate = startDate.getDate() === endDate.getDate();
  switch (formatType) {
    case 'DATETIME':
      return [dateLocalization.format(startDate, dateFormat), ' ', dateLocalization.format(startDate, timeFormat), ' - ', isSameDate ? '' : "".concat(dateLocalization.format(endDate, dateFormat), " "), dateLocalization.format(endDate, timeFormat)].join('');
    case 'TIME':
      return "".concat(dateLocalization.format(startDate, timeFormat), " - ").concat(dateLocalization.format(endDate, timeFormat));
    case 'DATE':
      return "".concat(dateLocalization.format(startDate, dateFormat)).concat(isSameDate ? '' : " - ".concat(dateLocalization.format(endDate, dateFormat)));
    default:
      break;
  }
};
