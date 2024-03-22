/**
* DevExtreme (cjs/ui/calendar/ui.calendar.multiple.selection.strategy.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _uiCalendarSelection = _interopRequireDefault(require("./ui.calendar.selection.strategy"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let CalendarMultiSelectionStrategy = /*#__PURE__*/function (_CalendarSelectionStr) {
  _inheritsLoose(CalendarMultiSelectionStrategy, _CalendarSelectionStr);
  function CalendarMultiSelectionStrategy(component) {
    var _this;
    _this = _CalendarSelectionStr.call(this, component) || this;
    _this.NAME = 'MultiSelection';
    return _this;
  }
  var _proto = CalendarMultiSelectionStrategy.prototype;
  _proto.getViewOptions = function getViewOptions() {
    return {
      value: this.dateOption('value'),
      range: [],
      selectionMode: 'multi',
      onWeekNumberClick: this._shouldHandleWeekNumberClick() ? this._weekNumberClickHandler.bind(this) : null
    };
  };
  _proto.selectValue = function selectValue(selectedValue, e) {
    const value = [...this.dateOption('value')];
    const alreadySelectedIndex = value.findIndex(date => (date === null || date === void 0 ? void 0 : date.toDateString()) === selectedValue.toDateString());
    if (alreadySelectedIndex > -1) {
      value.splice(alreadySelectedIndex, 1);
    } else {
      value.push(selectedValue);
    }
    this.skipNavigate();
    this._updateCurrentDate(selectedValue);
    this._currentDateChanged = true;
    this.dateValue(value, e);
  };
  _proto.updateAriaSelected = function updateAriaSelected(value, previousValue) {
    var _value, _previousValue;
    (_value = value) !== null && _value !== void 0 ? _value : value = this.dateOption('value');
    (_previousValue = previousValue) !== null && _previousValue !== void 0 ? _previousValue : previousValue = [];
    _CalendarSelectionStr.prototype.updateAriaSelected.call(this, value, previousValue);
  };
  _proto.getDefaultCurrentDate = function getDefaultCurrentDate() {
    const dates = this.dateOption('value').filter(value => value);
    return this._getLowestDateInArray(dates);
  };
  _proto.restoreValue = function restoreValue() {
    this.calendar.option('value', []);
  };
  _proto._weekNumberClickHandler = function _weekNumberClickHandler(_ref) {
    let {
      rowDates,
      event
    } = _ref;
    const selectedDates = rowDates.filter(date => !this._isDateDisabled(date));
    this.dateValue(selectedDates, event);
  };
  return CalendarMultiSelectionStrategy;
}(_uiCalendarSelection.default);
var _default = exports.default = CalendarMultiSelectionStrategy;
module.exports = exports.default;
module.exports.default = exports.default;
