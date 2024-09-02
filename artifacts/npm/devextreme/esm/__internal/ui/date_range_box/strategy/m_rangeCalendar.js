/**
* DevExtreme (esm/__internal/ui/date_range_box/strategy/m_rangeCalendar.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { extend } from '../../../../core/utils/extend';
import { isFunction } from '../../../../core/utils/type';
import eventsEngine from '../../../../events/core/events_engine';
import CalendarStrategy from '../../date_box/m_date_box.strategy.calendar';
import { getDeserializedDate, isSameDateArrays, isSameDates } from '../m_date_range.utils';
class RangeCalendarStrategy extends CalendarStrategy {
  constructor(dateBox) {
    super();
    this._dateSelectedCounter = 0;
    this.dateBox = dateBox;
    this.dateRangeBox = dateBox.option('_dateRangeBoxInstance');
  }
  popupConfig(popupConfig) {
    // @ts-expect-error
    return extend(true, super.popupConfig(popupConfig), {
      position: {
        of: this.getDateRangeBox().$element()
      }
    });
  }
  popupShowingHandler() {
    // @ts-expect-error
    this.getWidget()._restoreViewsMinMaxOptions();
    this._dateSelectedCounter = 0;
  }
  _getPopup() {
    // @ts-expect-error
    return super._getPopup() || this.getDateRangeBox().getStartDateBox()._popup;
  }
  supportedKeys() {
    const dateRangeBox = this.getDateRangeBox();
    return _extends({}, super.supportedKeys(), {
      rightArrow: () => {
        if (dateRangeBox.option('opened')) {
          return true;
        }
        return undefined;
      },
      leftArrow: () => {
        if (dateRangeBox.option('opened')) {
          return true;
        }
        return undefined;
      },
      enter: e => {
        if (dateRangeBox.option('opened')) {
          // @ts-expect-error
          const dateBoxValue = this.dateBox.dateOption('value');
          // @ts-expect-error
          this.dateBox._valueChangeEventHandler(e);
          // @ts-expect-error
          const newDateBoxValue = this.dateBox.dateOption('value');
          const dateBoxValueChanged = !isSameDates(dateBoxValue, newDateBoxValue);
          if (dateBoxValueChanged) {
            dateRangeBox.getStartDateBox().getStrategy().getWidget().option('value', dateRangeBox.option('value'));
          } else {
            // @ts-expect-error
            dateRangeBox.getStartDateBox().getStrategy().getWidget()._enterKeyHandler(e);
          }
          return false;
        }
        return undefined;
      },
      tab: e => {
        if (!dateRangeBox.option('opened')) {
          return;
        }
        if (!this._getPopup().getFocusableElements().length) {
          if (!e.shiftKey && dateRangeBox._isEndDateActiveElement() || e.shiftKey && dateRangeBox._isStartDateActiveElement()) {
            dateRangeBox.close();
          }
          return;
        }
        if (!e.shiftKey && dateRangeBox._isStartDateActiveElement() || e.shiftKey && dateRangeBox._isEndDateActiveElement()) {
          return;
        }
        const $focusableElement = e.shiftKey
        // @ts-expect-error
        ? dateRangeBox.getStartDateBox()._getLastPopupElement()
        // @ts-expect-error
        : dateRangeBox.getStartDateBox()._getFirstPopupElement();
        if ($focusableElement) {
          // @ts-expect-error
          eventsEngine.trigger($focusableElement, 'focus');
          $focusableElement.select();
        }
        e.preventDefault();
      }
    });
  }
  _getWidgetOptions() {
    // @ts-expect-error
    const {
      disabledDates: disabledDatesValue,
      value,
      multiView
    } = this.dateRangeBox.option();
    const disabledDates = isFunction(disabledDatesValue) ? this._injectComponent(disabledDatesValue) : disabledDatesValue ?? undefined;
    // @ts-expect-error
    return extend(super._getWidgetOptions(), {
      disabledDates,
      value,
      selectionMode: 'range',
      viewsCount: multiView ? 2 : 1,
      _allowChangeSelectionOrder: true,
      _currentSelection: this.getCurrentSelection()
    });
  }
  _refreshActiveDescendant(e) {
    // @ts-expect-error
    this.getDateRangeBox().setAria('activedescendant', e.actionValue);
  }
  _injectComponent(func) {
    return params => func(extend(params, {
      component: this.getDateRangeBox()
    }));
  }
  getKeyboardListener() {
    const dateRangeBox = this.getDateRangeBox();
    return dateRangeBox.getStartDateBox() ? dateRangeBox.getStartDateBox().getStrategy().getWidget() : this.getWidget();
  }
  getValue() {
    return this.getWidget().option('value');
  }
  _updateValue() {
    const {
      value
    } = this.getDateRangeBox().option();
    if (!this.getWidget()) {
      return;
    }
    this._shouldPreventFocusChange = true;
    this.getWidget().option('value', value);
  }
  _isInstantlyMode() {
    return this.getDateRangeBox().option('applyValueMode') === 'instantly';
  }
  _valueChangedHandler(_ref) {
    let {
      value,
      previousValue,
      event
    } = _ref;
    // @ts-expect-error
    if (isSameDateArrays(value, previousValue) && !this.getWidget()._valueSelected) {
      this._shouldPreventFocusChange = false;
      return;
    }
    // @ts-expect-error
    this.getWidget()._valueSelected = false;
    const dateRangeBox = this.getDateRangeBox();
    if (this._isInstantlyMode()) {
      if (!dateRangeBox.option('disableOutOfRangeSelection')) {
        if (this._getCalendarCurrentSelection() === 'startDate') {
          this._dateSelectedCounter = 0;
        } else {
          this._dateSelectedCounter = 1;
          if (!value[0]) {
            this._dateSelectedCounter = -1;
          } else if (getDeserializedDate(value[0]) > getDeserializedDate(value[1])) {
            dateRangeBox.updateValue([value[0], null], event);
            return;
          }
        }
      }
      dateRangeBox.updateValue(value, event);
      this._dateSelectedCounter += 1;
      if (this._dateSelectedCounter === 2) {
        dateRangeBox.close();
        return;
      }
    } else if (this._getCalendarCurrentSelection() === 'endDate') {
      if (value[0] && getDeserializedDate(value[0]) > getDeserializedDate(value[1])) {
        return;
      }
    }
    if (!this._shouldPreventFocusChange) {
      this._moveFocusToNextInput();
    }
    this._shouldPreventFocusChange = false;
  }
  _moveFocusToNextInput() {
    const targetDateBox = this._getCalendarCurrentSelection() === 'startDate' ? this.getDateRangeBox().getEndDateBox() : this.getDateRangeBox().getStartDateBox();
    targetDateBox.focus();
    // @ts-expect-error
    eventsEngine.trigger(targetDateBox.field(), 'dxclick');
  }
  getCurrentSelection() {
    return this.getDateRangeBox().option('_currentSelection');
  }
  _getCalendarCurrentSelection() {
    return this.getWidget().option('_currentSelection');
  }
  _closeDropDownByEnter() {
    if (this._getCalendarCurrentSelection() === 'startDate') {
      return false;
    }
    return true;
  }
  dateBoxValue() {
    const {
      dateBox
    } = this;
    if (arguments.length) {
      // @ts-expect-error
      return dateBox.dateValue.apply(dateBox, arguments);
    }
    // @ts-expect-error
    return dateBox.dateOption.apply(dateBox, ['value']);
  }
  _cellClickHandler() {}
  setActiveStartDateBox() {
    this.dateBox = this.getDateRangeBox().getStartDateBox();
  }
  setActiveEndDateBox() {
    this.dateBox = this.getDateRangeBox().getEndDateBox();
  }
  getDateRangeBox() {
    return this.dateRangeBox;
  }
  getWidget() {
    return this._widget;
  }
}
export default RangeCalendarStrategy;
