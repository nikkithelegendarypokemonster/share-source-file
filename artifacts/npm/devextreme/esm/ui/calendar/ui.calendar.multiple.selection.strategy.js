/**
* DevExtreme (esm/ui/calendar/ui.calendar.multiple.selection.strategy.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import CalendarSelectionStrategy from './ui.calendar.selection.strategy';
class CalendarMultiSelectionStrategy extends CalendarSelectionStrategy {
  constructor(component) {
    super(component);
    this.NAME = 'MultiSelection';
  }
  getViewOptions() {
    return {
      value: this.dateOption('value'),
      range: [],
      selectionMode: 'multi',
      onWeekNumberClick: this._shouldHandleWeekNumberClick() ? this._weekNumberClickHandler.bind(this) : null
    };
  }
  selectValue(selectedValue, e) {
    var value = [...this.dateOption('value')];
    var alreadySelectedIndex = value.findIndex(date => (date === null || date === void 0 ? void 0 : date.toDateString()) === selectedValue.toDateString());
    if (alreadySelectedIndex > -1) {
      value.splice(alreadySelectedIndex, 1);
    } else {
      value.push(selectedValue);
    }
    this.skipNavigate();
    this._updateCurrentDate(selectedValue);
    this._currentDateChanged = true;
    this.dateValue(value, e);
  }
  updateAriaSelected(value, previousValue) {
    var _value, _previousValue;
    (_value = value) !== null && _value !== void 0 ? _value : value = this.dateOption('value');
    (_previousValue = previousValue) !== null && _previousValue !== void 0 ? _previousValue : previousValue = [];
    super.updateAriaSelected(value, previousValue);
  }
  getDefaultCurrentDate() {
    var dates = this.dateOption('value').filter(value => value);
    return this._getLowestDateInArray(dates);
  }
  restoreValue() {
    this.calendar.option('value', []);
  }
  _weekNumberClickHandler(_ref) {
    var {
      rowDates,
      event
    } = _ref;
    var selectedDates = rowDates.filter(date => !this._isDateDisabled(date));
    this.dateValue(selectedDates, event);
  }
}
export default CalendarMultiSelectionStrategy;
