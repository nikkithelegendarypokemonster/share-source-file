"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _date = require("../core/utils/date");
var _date2 = _interopRequireDefault(require("../../core/utils/date"));
var _m_date_adapter = _interopRequireDefault(require("./m_date_adapter"));
var _m_utils_timezones_data = _interopRequireDefault(require("./timezones/m_utils_timezones_data"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* globals Intl */

const toMs = _date2.default.dateToMilliseconds;
const MINUTES_IN_HOUR = 60;
const MS_IN_MINUTE = 60000;
const createUTCDateWithLocalOffset = date => {
  if (!date) {
    return null;
  }
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
};
const createDateFromUTCWithLocalOffset = date => {
  const result = (0, _m_date_adapter.default)(date);
  const timezoneOffsetBeforeInMin = result.getTimezoneOffset();
  result.addTime(result.getTimezoneOffset('minute'));
  result.subtractMinutes(timezoneOffsetBeforeInMin - result.getTimezoneOffset());
  return result.source;
};
const getTimeZones = function () {
  let date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  const dateInUTC = createUTCDate(date);
  return _m_utils_timezones_data.default.getDisplayedTimeZones(dateInUTC.getTime());
};
const createUTCDate = date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()));
const getTimezoneOffsetChangeInMinutes = (startDate, endDate, updatedStartDate, updatedEndDate) => getDaylightOffset(updatedStartDate, updatedEndDate) - getDaylightOffset(startDate, endDate);
const getTimezoneOffsetChangeInMs = (startDate, endDate, updatedStartDate, updatedEndDate) => getTimezoneOffsetChangeInMinutes(startDate, endDate, updatedStartDate, updatedEndDate) * toMs('minute');
const getDaylightOffset = (startDate, endDate) => new Date(startDate).getTimezoneOffset() - new Date(endDate).getTimezoneOffset();
const getDaylightOffsetInMs = (startDate, endDate) => getDaylightOffset(startDate, endDate) * toMs('minute');
const calculateTimezoneByValue = function (timezone) {
  let date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  // NOTE: This check could be removed. We don't support numerical timezones
  if (typeof timezone === 'string') {
    const dateUtc = createUTCDate(date);
    return _m_utils_timezones_data.default.getTimeZoneOffsetById(timezone, dateUtc.getTime());
  }
  return timezone;
};
// eslint-disable-next-line @typescript-eslint/naming-convention
const _getDaylightOffsetByTimezone = (startDate, endDate, timeZone) => calculateTimezoneByValue(timeZone, startDate) - calculateTimezoneByValue(timeZone, endDate);
const getCorrectedDateByDaylightOffsets = (convertedOriginalStartDate, convertedDate, date, timeZone, startDateTimezone) => {
  const daylightOffsetByCommonTimezone = _getDaylightOffsetByTimezone(convertedOriginalStartDate, convertedDate, timeZone);
  const daylightOffsetByAppointmentTimezone = _getDaylightOffsetByTimezone(convertedOriginalStartDate, convertedDate, startDateTimezone);
  const diff = daylightOffsetByCommonTimezone - daylightOffsetByAppointmentTimezone;
  return new Date(date.getTime() - diff * toMs('hour'));
};
const correctRecurrenceExceptionByTimezone = function (exception, exceptionByStartDate, timeZone, startDateTimeZone) {
  let isBackConversion = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  let timezoneOffset = (exception.getTimezoneOffset() - exceptionByStartDate.getTimezoneOffset()) / MINUTES_IN_HOUR;
  if (startDateTimeZone) {
    timezoneOffset = _getDaylightOffsetByTimezone(exceptionByStartDate, exception, startDateTimeZone);
  } else if (timeZone) {
    timezoneOffset = _getDaylightOffsetByTimezone(exceptionByStartDate, exception, timeZone);
  }
  return new Date(exception.getTime() + (isBackConversion ? -1 : 1) * timezoneOffset * toMs('hour'));
};
const isTimezoneChangeInDate = date => {
  const startDayDate = new Date(new Date(date).setHours(0, 0, 0, 0));
  const endDayDate = new Date(new Date(date).setHours(23, 59, 59, 0));
  return startDayDate.getTimezoneOffset() - endDayDate.getTimezoneOffset() !== 0;
};
const getDateWithoutTimezoneChange = date => {
  const clonedDate = new Date(date);
  if (isTimezoneChangeInDate(clonedDate)) {
    const result = new Date(clonedDate);
    return new Date(result.setDate(result.getDate() + 1));
  }
  return clonedDate;
};
const isSameAppointmentDates = (startDate, endDate) => {
  // NOTE: subtract 1 millisecond to avoid 00.00 time. Method should return 'true' for "2020:10:10 22:00:00" and "2020:10:11 00:00:00", for example.
  endDate = new Date(endDate.getTime() - 1);
  return _date2.default.sameDate(startDate, endDate);
};
const getClientTimezoneOffset = function () {
  let date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  return date.getTimezoneOffset() * MS_IN_MINUTE;
};
const getDiffBetweenClientTimezoneOffsets = function () {
  let firstDate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  let secondDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  return getClientTimezoneOffset(firstDate) - getClientTimezoneOffset(secondDate);
};
const isEqualLocalTimeZone = function (timeZoneName) {
  let date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  if (Intl) {
    const localTimeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (localTimeZoneName === timeZoneName) {
      return true;
    }
  }
  return isEqualLocalTimeZoneByDeclaration(timeZoneName, date);
};
// TODO: Not used anywhere, if it isn't use in the future, then it must be removed
const hasDSTInLocalTimeZone = () => {
  const [startDate, endDate] = getExtremeDates();
  return startDate.getTimezoneOffset() !== endDate.getTimezoneOffset();
};
const isEqualLocalTimeZoneByDeclaration = (timeZoneName, date) => {
  const year = date.getFullYear();
  const getOffset = date => -date.getTimezoneOffset() / 60;
  const getDateAndMoveHourBack = dateStamp => new Date(dateStamp - 3600000);
  const configTuple = _m_utils_timezones_data.default.getTimeZoneDeclarationTuple(timeZoneName, year);
  const [summerTime, winterTime] = configTuple;
  const noDSTInTargetTimeZone = configTuple.length < 2;
  if (noDSTInTargetTimeZone) {
    const targetTimeZoneOffset = _m_utils_timezones_data.default.getTimeZoneOffsetById(timeZoneName, date);
    const localTimeZoneOffset = getOffset(date);
    if (targetTimeZoneOffset !== localTimeZoneOffset) {
      return false;
    }
    return !hasDSTInLocalTimeZone();
  }
  const localSummerOffset = getOffset(new Date(summerTime.date));
  const localWinterOffset = getOffset(new Date(winterTime.date));
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
const getExtremeDates = () => {
  const nowDate = new Date(Date.now());
  const startDate = new Date();
  const endDate = new Date();
  startDate.setFullYear(nowDate.getFullYear(), 0, 1);
  endDate.setFullYear(nowDate.getFullYear(), 6, 1);
  return [startDate, endDate];
};
// TODO Vinogradov refactoring: Change to date utils.
const setOffsetsToDate = (targetDate, offsetsArray) => {
  const newDateMs = offsetsArray.reduce((result, offset) => result + offset, targetDate.getTime());
  return new Date(newDateMs);
};
const addOffsetsWithoutDST = function (date) {
  for (var _len = arguments.length, offsets = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    offsets[_key - 1] = arguments[_key];
  }
  const newDate = _date.dateUtilsTs.addOffsets(date, offsets);
  const daylightShift = getDaylightOffsetInMs(date, newDate);
  if (!daylightShift) {
    return newDate;
  }
  const correctLocalDate = _date.dateUtilsTs.addOffsets(newDate, [-daylightShift]);
  const daylightSecondShift = getDaylightOffsetInMs(newDate, correctLocalDate);
  return !daylightSecondShift ? correctLocalDate : newDate;
};
// NOTE:
// GMT-N is "negative" timezone
// GMT+N is "positive" timezone
const isNegativeMachineTimezone = () => new Date().getTimezoneOffset() > 0;
const isSummerToWinterDSTChange = timezoneDiff => timezoneDiff < 0;
const getSummerToWinterTimeDSTDiffMs = (firstDate, secondDate) => {
  const diffMinutes = getDaylightOffset(firstDate, secondDate);
  const isSummerTimeChange = isSummerToWinterDSTChange(diffMinutes);
  return isSummerTimeChange ? Math.abs(diffMinutes * toMs('minute')) : 0;
};
const utils = {
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
var _default = exports.default = utils;