"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewDataGeneratorMonth = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _date2 = _interopRequireDefault(require("../../../../localization/date"));
var _index = require("../../../scheduler/__migration/utils/index");
var _m_utils_time_zone = _interopRequireDefault(require("../../m_utils_time_zone"));
var _m_utils = require("./m_utils");
var _m_view_data_generator = require("./m_view_data_generator");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } // eslint-disable-next-line import/no-cycle
const toMs = _date.default.dateToMilliseconds;
const DAYS_IN_WEEK = 7;
let ViewDataGeneratorMonth = exports.ViewDataGeneratorMonth = /*#__PURE__*/function (_ViewDataGenerator) {
  _inheritsLoose(ViewDataGeneratorMonth, _ViewDataGenerator);
  function ViewDataGeneratorMonth() {
    var _this;
    _this = _ViewDataGenerator.apply(this, arguments) || this;
    _this.tableAllDay = undefined;
    return _this;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var _proto = ViewDataGeneratorMonth.prototype;
  _proto.getCellData = function getCellData(rowIndex, columnIndex, options, allDay) {
    const {
      indicatorTime,
      timeZoneCalculator,
      intervalCount,
      viewOffset
    } = options;
    const data = _ViewDataGenerator.prototype.getCellData.call(this, rowIndex, columnIndex, options, false);
    const startDate = _m_utils_time_zone.default.addOffsetsWithoutDST(data.startDate, -viewOffset);
    data.today = this.isCurrentDate(startDate, indicatorTime, timeZoneCalculator);
    data.otherMonth = this.isOtherMonth(startDate, this._minVisibleDate, this._maxVisibleDate);
    data.firstDayOfMonth = (0, _index.isFirstCellInMonthWithIntervalCount)(startDate, intervalCount);
    data.text = _index.monthUtils.getCellText(startDate, intervalCount);
    return data;
  };
  _proto.isCurrentDate = function isCurrentDate(date, indicatorTime, timeZoneCalculator) {
    return _date.default.sameDate(date, (0, _index.getToday)(indicatorTime, timeZoneCalculator));
  };
  _proto.isOtherMonth = function isOtherMonth(cellDate, minDate, maxDate) {
    return !_date.default.dateInRange(cellDate, minDate, maxDate, 'date');
  };
  _proto._calculateCellIndex = function _calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount) {
    return _index.monthUtils.calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount);
  };
  _proto.calculateEndDate = function calculateEndDate(startDate, interval, endDayHour) {
    return (0, _index.setOptionHour)(startDate, endDayHour);
  };
  _proto.getInterval = function getInterval() {
    return toMs('day');
  };
  _proto._calculateStartViewDate = function _calculateStartViewDate(options) {
    return _index.monthUtils.calculateStartViewDate(options.currentDate, options.startDayHour, options.startDate, options.intervalCount, this.getFirstDayOfWeek(options.firstDayOfWeek));
  };
  _proto._setVisibilityDates = function _setVisibilityDates(options) {
    const {
      intervalCount,
      startDate,
      currentDate
    } = options;
    const firstMonthDate = _date.default.getFirstMonthDate(startDate);
    const viewStart = _index.monthUtils.getViewStartByOptions(startDate, currentDate, intervalCount, firstMonthDate);
    this._minVisibleDate = new Date(viewStart.setDate(1));
    const nextMonthDate = new Date(viewStart.setMonth(viewStart.getMonth() + intervalCount));
    this._maxVisibleDate = new Date(nextMonthDate.setDate(0));
  };
  _proto.getCellCount = function getCellCount() {
    return DAYS_IN_WEEK;
  };
  _proto.getRowCount = function getRowCount(options) {
    var _a;
    const startDate = new Date(options.currentDate);
    startDate.setDate(1);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + options.intervalCount);
    endDate.setDate(0);
    return (0, _m_utils.calculateAlignedWeeksBetweenDates)(startDate, endDate, (_a = options.firstDayOfWeek) !== null && _a !== void 0 ? _a : _date2.default.firstDayOfWeekIndex());
  };
  _proto.getCellCountInDay = function getCellCountInDay() {
    return 1;
  };
  _proto.setHiddenInterval = function setHiddenInterval() {
    this.hiddenInterval = 0;
  };
  _proto.getCellEndDate = function getCellEndDate(cellStartDate, options) {
    const {
      startDayHour,
      endDayHour
    } = options;
    const durationMs = (endDayHour - startDayHour) * toMs('hour');
    return _m_utils_time_zone.default.addOffsetsWithoutDST(cellStartDate, durationMs);
  };
  return ViewDataGeneratorMonth;
}(_m_view_data_generator.ViewDataGenerator);