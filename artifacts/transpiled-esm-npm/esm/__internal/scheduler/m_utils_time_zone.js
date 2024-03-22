/* globals Intl */
import { dateUtilsTs } from '../core/utils/date';
import dateUtils from '../../core/utils/date';
import DateAdapter from './m_date_adapter';
import timeZoneDataUtils from './timezones/m_utils_timezones_data';
var toMs = dateUtils.dateToMilliseconds;
var MINUTES_IN_HOUR = 60;
var MS_IN_MINUTE = 60000;
var createUTCDateWithLocalOffset = date => {
  if (!date) {
    return null;
  }
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
};
var createDateFromUTCWithLocalOffset = date => {
  var result = DateAdapter(date);
  var timezoneOffsetBeforeInMin = result.getTimezoneOffset();
  result.addTime(result.getTimezoneOffset('minute'));
  result.subtractMinutes(timezoneOffsetBeforeInMin - result.getTimezoneOffset());
  return result.source;
};
var getTimeZones = function getTimeZones() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var dateInUTC = createUTCDate(date);
  return timeZoneDataUtils.getDisplayedTimeZones(dateInUTC.getTime());
};
var createUTCDate = date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()));
var getTimezoneOffsetChangeInMinutes = (startDate, endDate, updatedStartDate, updatedEndDate) => getDaylightOffset(updatedStartDate, updatedEndDate) - getDaylightOffset(startDate, endDate);
var getTimezoneOffsetChangeInMs = (startDate, endDate, updatedStartDate, updatedEndDate) => getTimezoneOffsetChangeInMinutes(startDate, endDate, updatedStartDate, updatedEndDate) * toMs('minute');
var getDaylightOffset = (startDate, endDate) => new Date(startDate).getTimezoneOffset() - new Date(endDate).getTimezoneOffset();
var getDaylightOffsetInMs = (startDate, endDate) => getDaylightOffset(startDate, endDate) * toMs('minute');
var calculateTimezoneByValue = function calculateTimezoneByValue(timezone) {
  var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  // NOTE: This check could be removed. We don't support numerical timezones
  if (typeof timezone === 'string') {
    var dateUtc = createUTCDate(date);
    return timeZoneDataUtils.getTimeZoneOffsetById(timezone, dateUtc.getTime());
  }
  return timezone;
};
// eslint-disable-next-line @typescript-eslint/naming-convention
var _getDaylightOffsetByTimezone = (startDate, endDate, timeZone) => calculateTimezoneByValue(timeZone, startDate) - calculateTimezoneByValue(timeZone, endDate);
var getCorrectedDateByDaylightOffsets = (convertedOriginalStartDate, convertedDate, date, timeZone, startDateTimezone) => {
  var daylightOffsetByCommonTimezone = _getDaylightOffsetByTimezone(convertedOriginalStartDate, convertedDate, timeZone);
  var daylightOffsetByAppointmentTimezone = _getDaylightOffsetByTimezone(convertedOriginalStartDate, convertedDate, startDateTimezone);
  var diff = daylightOffsetByCommonTimezone - daylightOffsetByAppointmentTimezone;
  return new Date(date.getTime() - diff * toMs('hour'));
};
var correctRecurrenceExceptionByTimezone = function correctRecurrenceExceptionByTimezone(exception, exceptionByStartDate, timeZone, startDateTimeZone) {
  var isBackConversion = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var timezoneOffset = (exception.getTimezoneOffset() - exceptionByStartDate.getTimezoneOffset()) / MINUTES_IN_HOUR;
  if (startDateTimeZone) {
    timezoneOffset = _getDaylightOffsetByTimezone(exceptionByStartDate, exception, startDateTimeZone);
  } else if (timeZone) {
    timezoneOffset = _getDaylightOffsetByTimezone(exceptionByStartDate, exception, timeZone);
  }
  return new Date(exception.getTime() + (isBackConversion ? -1 : 1) * timezoneOffset * toMs('hour'));
};
var isTimezoneChangeInDate = date => {
  var startDayDate = new Date(new Date(date).setHours(0, 0, 0, 0));
  var endDayDate = new Date(new Date(date).setHours(23, 59, 59, 0));
  return startDayDate.getTimezoneOffset() - endDayDate.getTimezoneOffset() !== 0;
};
var getDateWithoutTimezoneChange = date => {
  var clonedDate = new Date(date);
  if (isTimezoneChangeInDate(clonedDate)) {
    var result = new Date(clonedDate);
    return new Date(result.setDate(result.getDate() + 1));
  }
  return clonedDate;
};
var isSameAppointmentDates = (startDate, endDate) => {
  // NOTE: subtract 1 millisecond to avoid 00.00 time. Method should return 'true' for "2020:10:10 22:00:00" and "2020:10:11 00:00:00", for example.
  endDate = new Date(endDate.getTime() - 1);
  return dateUtils.sameDate(startDate, endDate);
};
var getClientTimezoneOffset = function getClientTimezoneOffset() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  return date.getTimezoneOffset() * MS_IN_MINUTE;
};
var getDiffBetweenClientTimezoneOffsets = function getDiffBetweenClientTimezoneOffsets() {
  var firstDate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var secondDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  return getClientTimezoneOffset(firstDate) - getClientTimezoneOffset(secondDate);
};
var isEqualLocalTimeZone = function isEqualLocalTimeZone(timeZoneName) {
  var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  if (Intl) {
    var localTimeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (localTimeZoneName === timeZoneName) {
      return true;
    }
  }
  return isEqualLocalTimeZoneByDeclaration(timeZoneName, date);
};
// TODO: Not used anywhere, if it isn't use in the future, then it must be removed
var hasDSTInLocalTimeZone = () => {
  var [startDate, endDate] = getExtremeDates();
  return startDate.getTimezoneOffset() !== endDate.getTimezoneOffset();
};
var isEqualLocalTimeZoneByDeclaration = (timeZoneName, date) => {
  var year = date.getFullYear();
  var getOffset = date => -date.getTimezoneOffset() / 60;
  var getDateAndMoveHourBack = dateStamp => new Date(dateStamp - 3600000);
  var configTuple = timeZoneDataUtils.getTimeZoneDeclarationTuple(timeZoneName, year);
  var [summerTime, winterTime] = configTuple;
  var noDSTInTargetTimeZone = configTuple.length < 2;
  if (noDSTInTargetTimeZone) {
    var targetTimeZoneOffset = timeZoneDataUtils.getTimeZoneOffsetById(timeZoneName, date);
    var localTimeZoneOffset = getOffset(date);
    if (targetTimeZoneOffset !== localTimeZoneOffset) {
      return false;
    }
    return !hasDSTInLocalTimeZone();
  }
  var localSummerOffset = getOffset(new Date(summerTime.date));
  var localWinterOffset = getOffset(new Date(winterTime.date));
  if (localSummerOffset !== summerTime.offset) {
    return false;
  }
  if (localSummerOffset === getOffset(getDateAndMoveHourBack(summerTime.date))) {
    return false;
  }
  if (localWinterOffset !== winterTime.offset) {
    return false;
  }
  if (localWinterOffset === getOffset(getDateAndMoveHourBack(winterTime.date))) {
    return false;
  }
  return true;
};
// TODO: Getting two dates in january or june is the standard mechanism for determining that an offset has occurred.
var getExtremeDates = () => {
  var nowDate = new Date(Date.now());
  var startDate = new Date();
  var endDate = new Date();
  startDate.setFullYear(nowDate.getFullYear(), 0, 1);
  endDate.setFullYear(nowDate.getFullYear(), 6, 1);
  return [startDate, endDate];
};
// TODO Vinogradov refactoring: Change to date utils.
var setOffsetsToDate = (targetDate, offsetsArray) => {
  var newDateMs = offsetsArray.reduce((result, offset) => result + offset, targetDate.getTime());
  return new Date(newDateMs);
};
var addOffsetsWithoutDST = function addOffsetsWithoutDST(date) {
  for (var _len = arguments.length, offsets = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    offsets[_key - 1] = arguments[_key];
  }
  var newDate = dateUtilsTs.addOffsets(date, offsets);
  var daylightShift = getDaylightOffsetInMs(date, newDate);
  if (!daylightShift) {
    return newDate;
  }
  var correctLocalDate = dateUtilsTs.addOffsets(newDate, [-daylightShift]);
  var daylightSecondShift = getDaylightOffsetInMs(newDate, correctLocalDate);
  return !daylightSecondShift ? correctLocalDate : newDate;
};
// NOTE:
// GMT-N is "negative" timezone
// GMT+N is "positive" timezone
var isNegativeMachineTimezone = () => new Date().getTimezoneOffset() > 0;
var isSummerToWinterDSTChange = timezoneDiff => timezoneDiff < 0;
var getSummerToWinterTimeDSTDiffMs = (firstDate, secondDate) => {
  var diffMinutes = getDaylightOffset(firstDate, secondDate);
  var isSummerTimeChange = isSummerToWinterDSTChange(diffMinutes);
  return isSummerTimeChange ? Math.abs(diffMinutes * toMs('minute')) : 0;
};
var utils = {
  getDaylightOffset,
  getDaylightOffsetInMs,
  getTimezoneOffsetChangeInMinutes,
  getTimezoneOffsetChangeInMs,
  calculateTimezoneByValue,
  getCorrectedDateByDaylightOffsets,
  isSameAppointmentDates,
  correctRecurrenceExceptionByTimezone,
  getClientTimezoneOffset,
  getDiffBetweenClientTimezoneOffsets,
  createUTCDateWithLocalOffset,
  createDateFromUTCWithLocalOffset,
  createUTCDate,
  isTimezoneChangeInDate,
  getDateWithoutTimezoneChange,
  hasDSTInLocalTimeZone,
  isEqualLocalTimeZone,
  isEqualLocalTimeZoneByDeclaration,
  getTimeZones,
  setOffsetsToDate,
  addOffsetsWithoutDST,
  isNegativeMachineTimezone,
  isSummerTimeDSTChange: isSummerToWinterDSTChange,
  getSummerToWinterTimeDSTDiffMs
};
export default utils;