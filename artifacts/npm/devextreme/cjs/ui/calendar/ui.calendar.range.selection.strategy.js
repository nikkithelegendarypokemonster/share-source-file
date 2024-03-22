/**
* DevExtreme (cjs/ui/calendar/ui.calendar.range.selection.strategy.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _date = _interopRequireDefault(require("../../core/utils/date"));
var _uiCalendarSelection = _interopRequireDefault(require("./ui.calendar.selection.strategy"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const DAY_INTERVAL = 86400000;
let CalendarRangeSelectionStrategy = /*#__PURE__*/function (_CalendarSelectionStr) {
  _inheritsLoose(CalendarRangeSelectionStrategy, _CalendarSelectionStr);
  function CalendarRangeSelectionStrategy(component) {
    var _this;
    _this = _CalendarSelectionStr.call(this, component) || this;
    _this.NAME = 'RangeSelection';
    return _this;
  }
  var _proto = CalendarRangeSelectionStrategy.prototype;
  _proto.getViewOptions = function getViewOptions() {
    const value = this._getValue();
    const range = this._getDaysInRange(value[0], value[1]);
    return {
      value,
      range,
      selectionMode: 'range',
      onCellHover: this._cellHoverHandler.bind(this),
      onWeekNumberClick: this._shouldHandleWeekNumberClick() ? this._weekNumberClickHandler.bind(this) : null
    };
  };
  _proto.selectValue = function selectValue(selectedValue, e) {
    const [startDate, endDate] = this._getValue();
    this.skipNavigate();
    this._updateCurrentDate(selectedValue);
    this._currentDateChanged = true;
    if (this.calendar.option('_allowChangeSelectionOrder') === true) {
      this.calendar._valueSelected = true;
      if (this.calendar.option('_currentSelection') === 'startDate') {
        if (this.calendar._convertToDate(selectedValue) > this.calendar._convertToDate(endDate)) {
          this.dateValue([selectedValue, null], e);
        } else {
          this.dateValue([selectedValue, endDate], e);
        }
      } else {
        if (this.calendar._convertToDate(selectedValue) >= this.calendar._convertToDate(startDate)) {
          this.dateValue([startDate, selectedValue], e);
        } else {
          this.dateValue([selectedValue, null], e);
        }
      }
    } else {
      if (!startDate || endDate) {
        this.dateValue([selectedValue, null], e);
      } else {
        this.dateValue(startDate < selectedValue ? [startDate, selectedValue] : [selectedValue, startDate], e);
      }
    }
  };
  _proto.updateAriaSelected = function updateAriaSelected(value, previousValue) {
    var _value, _previousValue;
    (_value = value) !== null && _value !== void 0 ? _value : value = this._getValue();
    (_previousValue = previousValue) !== null && _previousValue !== void 0 ? _previousValue : previousValue = [];
    _CalendarSelectionStr.prototype.updateAriaSelected.call(this, value, previousValue);
  };
  _proto.processValueChanged = function processValueChanged(value, previousValue) {
    _CalendarSelectionStr.prototype.processValueChanged.call(this, value, previousValue);
    const range = this._getRange();
    this._updateViewsOption('range', range);
  };
  _proto.getDefaultCurrentDate = function getDefaultCurrentDate() {
    const {
      _allowChangeSelectionOrder,
      _currentSelection
    } = this.calendar.option();
    const value = this.dateOption('value');
    if (_allowChangeSelectionOrder) {
      if (_currentSelection === 'startDate' && value[0]) {
        return value[0];
      }
      if (_currentSelection === 'endDate' && value[1]) {
        return value[1];
      }
    }
    const dates = value.filter(value => value);
    return this._getLowestDateInArray(dates);
  };
  _proto.restoreValue = function restoreValue() {
    this.calendar.option('value', [null, null]);
  };
  _proto._getValue = function _getValue() {
    const value = this.dateOption('value');
    if (!value.length) {
      return value;
    }
    let [startDate, endDate] = value;
    if (startDate && endDate && startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }
    return [startDate, endDate];
  };
  _proto._getRange = function _getRange() {
    const [startDate, endDate] = this._getValue();
    return this._getDaysInRange(startDate, endDate);
  };
  _proto._getDaysInRange = function _getDaysInRange(startDate, endDate) {
    if (!startDate || !endDate) {
      return [];
    }
    const {
      currentDate,
      viewsCount
    } = this.calendar.option();
    const isAdditionalViewDate = this.calendar._isAdditionalViewDate(currentDate);
    const firstDateInViews = _date.default.getFirstMonthDate(_date.default.addDateInterval(currentDate, 'month', isAdditionalViewDate ? -2 : -1));
    const lastDateInViews = _date.default.getLastMonthDate(_date.default.addDateInterval(currentDate, 'month', isAdditionalViewDate ? 1 : viewsCount));
    const rangeStartDate = new Date(Math.max(firstDateInViews, startDate));
    const rangeEndDate = new Date(Math.min(lastDateInViews, endDate));
    return [..._date.default.getDatesOfInterval(rangeStartDate, rangeEndDate, DAY_INTERVAL), rangeEndDate];
  };
  _proto._cellHoverHandler = function _cellHoverHandler(e) {
    const isMaxZoomLevel = this._isMaxZoomLevel();
    const [startDate, endDate] = this._getValue();
    const {
      _allowChangeSelectionOrder,
      _currentSelection
    } = this.calendar.option();
    if (isMaxZoomLevel) {
      const skipHoveredRange = _allowChangeSelectionOrder && _currentSelection === 'startDate';
      if (startDate && !endDate && !skipHoveredRange) {
        if (e.value > startDate) {
          this._updateViewsOption('hoveredRange', this._getDaysInRange(startDate, e.value));
          return;
        }
      } else if (!startDate && endDate && !(_allowChangeSelectionOrder && _currentSelection === 'endDate')) {
        if (e.value < endDate) {
          this._updateViewsOption('hoveredRange', this._getDaysInRange(e.value, endDate));
          return;
        }
      } else if (startDate && endDate) {
        if (_currentSelection === 'startDate' && e.value < startDate) {
          this._updateViewsOption('hoveredRange', this._getDaysInRange(e.value, startDate));
          return;
        } else if (_currentSelection === 'endDate' && e.value > endDate) {
          this._updateViewsOption('hoveredRange', this._getDaysInRange(endDate, e.value));
          return;
        }
      }
      this._updateViewsOption('hoveredRange', []);
    }
  };
  _proto._weekNumberClickHandler = function _weekNumberClickHandler(_ref) {
    let {
      rowDates,
      event
    } = _ref;
    const selectedDates = rowDates.filter(date => !this._isDateDisabled(date));
    const value = selectedDates.length ? [selectedDates[0], selectedDates[selectedDates.length - 1]] : [null, null];
    this.dateValue(value, event);
  };
  return CalendarRangeSelectionStrategy;
}(_uiCalendarSelection.default);
var _default = exports.default = CalendarRangeSelectionStrategy;
module.exports = exports.default;
module.exports.default = exports.default;
