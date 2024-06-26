/**
* DevExtreme (cjs/__internal/scheduler/appointments/rendering_strategies/m_strategy_horizontal_month_line.js)
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
exports.default = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _query = _interopRequireDefault(require("../../../../data/query"));
var _m_utils = require("../data_provider/m_utils");
var _m_strategy_horizontal = _interopRequireDefault(require("./m_strategy_horizontal"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const MILLISECONDS_IN_MINUTE = 60000;
const ZERO_APPOINTMENT_DURATION_IN_DAYS = 1;
let HorizontalMonthLineRenderingStrategy = /*#__PURE__*/function (_HorizontalAppointmen) {
  _inheritsLoose(HorizontalMonthLineRenderingStrategy, _HorizontalAppointmen);
  function HorizontalMonthLineRenderingStrategy() {
    return _HorizontalAppointmen.apply(this, arguments) || this;
  }
  var _proto = HorizontalMonthLineRenderingStrategy.prototype;
  _proto.calculateAppointmentWidth = function calculateAppointmentWidth(_, position) {
    const {
      startDate: startDateWithTime,
      normalizedEndDate
    } = position.info.appointment;
    const startDate = _date.default.trimTime(startDateWithTime);
    const cellWidth = this.cellWidth || this.getAppointmentMinSize();
    const duration = Math.ceil(this._getDurationInDays(startDate, normalizedEndDate));
    let width = this.cropAppointmentWidth(duration * cellWidth, cellWidth);
    if (this.isVirtualScrolling) {
      const skippedDays = this.viewDataProvider.getSkippedDaysCount(position.groupIndex, startDate, normalizedEndDate, duration);
      width -= skippedDays * cellWidth;
    }
    return width;
  };
  _proto._columnCondition = function _columnCondition(a, b) {
    const conditions = this._getConditions(a, b);
    return conditions.rowCondition || conditions.columnCondition || conditions.cellPositionCondition;
  };
  _proto._getDurationInDays = function _getDurationInDays(startDate, endDate) {
    const adjustedDuration = this._adjustDurationByDaylightDiff(endDate.getTime() - startDate.getTime(), startDate, endDate);
    return adjustedDuration / _date.default.dateToMilliseconds('day') || ZERO_APPOINTMENT_DURATION_IN_DAYS;
  };
  _proto.getDeltaTime = function getDeltaTime(args, initialSize) {
    return HOURS_IN_DAY * MINUTES_IN_HOUR * MILLISECONDS_IN_MINUTE * this._getDeltaWidth(args, initialSize);
  };
  _proto.isAllDay = function isAllDay() {
    return false;
  };
  _proto.createTaskPositionMap = function createTaskPositionMap(items, skipSorting) {
    if (!skipSorting) {
      (0, _m_utils.sortAppointmentsByStartDate)(items, this.dataAccessors);
    }
    return _HorizontalAppointmen.prototype.createTaskPositionMap.call(this, items);
  };
  _proto._getSortedPositions = function _getSortedPositions(map, skipSorting) {
    let result = _HorizontalAppointmen.prototype._getSortedPositions.call(this, map);
    if (!skipSorting) {
      result = (0, _query.default)(result).sortBy('top').thenBy('left').thenBy('cellPosition').thenBy('i').toArray();
    }
    return result;
  };
  _proto.needCorrectAppointmentDates = function needCorrectAppointmentDates() {
    return false;
  };
  _proto.getPositionShift = function getPositionShift(timeShift) {
    return {
      top: 0,
      left: 0,
      cellPosition: timeShift * this.cellWidth
    };
  };
  return HorizontalMonthLineRenderingStrategy;
}(_m_strategy_horizontal.default);
var _default = exports.default = HorizontalMonthLineRenderingStrategy;
