import CalendarSelectionStrategy from './m_calendar.selection.strategy';
class CalendarSingleSelectionStrategy extends CalendarSelectionStrategy {
  constructor(component) {
    super(component);
    this.NAME = 'SingleSelection';
  }
  getViewOptions() {
    return {
      value: this.dateOption('value'),
      range: [],
      selectionMode: 'single'
    };
  }
  selectValue(selectedValue, e) {
    this.skipNavigate();
    this.dateValue(selectedValue, e);
  }
  updateAriaSelected(value, previousValue) {
    value ?? (value = [this.dateOption('value')]);
    previousValue ?? (previousValue = []);
    super.updateAriaSelected(value, previousValue);
  }
  getDefaultCurrentDate() {
    return this.dateOption('value');
  }
  restoreValue() {
    this.calendar.option('value', null);
  }
  _updateViewsValue(value) {
    this._updateViewsOption('value', value[0]);
  }
}
export default CalendarSingleSelectionStrategy;