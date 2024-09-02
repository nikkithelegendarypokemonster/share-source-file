/**
* DevExtreme (esm/__internal/ui/date_range_box/m_multiselect_date_box.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
// eslint-disable-next-line max-classes-per-file
import $ from '../../../core/renderer';
import { getWidth } from '../../../core/utils/size';
import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils';
import DateBox from '../../../ui/date_box';
import { getDeserializedDate, monthDifference } from './m_date_range.utils';
import RangeCalendarStrategy from './strategy/m_rangeCalendar';
const START_DATEBOX_CLASS = 'dx-start-datebox';
const TypedDateBox = DateBox;
class MultiselectDateBox extends TypedDateBox {
  _initStrategy() {
    this._strategy = new RangeCalendarStrategy(this);
  }
  _initMarkup() {
    // @ts-expect-error
    super._initMarkup();
    this._renderInputClickEvent();
  }
  _renderInputClickEvent() {
    const clickEventName = addNamespace('dxclick', this.NAME);
    // @ts-expect-error
    eventsEngine.off(this._input(), clickEventName);
    // @ts-expect-error
    eventsEngine.on(this._input(), clickEventName, e => {
      this._processValueChange(e);
    });
  }
  _applyButtonHandler(_ref) {
    let {
      event
    } = _ref;
    const strategy = this.getStrategy();
    const value = strategy.getValue();
    strategy.getDateRangeBox().updateValue(value, event);
    this.close();
    this.option('focusStateEnabled') && this.focus();
  }
  _openHandler(e) {
    if (this.getStrategy().getDateRangeBox().option('opened')) {
      return;
    }
    // @ts-expect-error
    super._openHandler(e);
  }
  _renderOpenedState() {
    const {
      opened
    } = this.option();
    this._getDateRangeBox().option('opened', opened);
    if (this._isStartDateBox()) {
      if (opened) {
        // @ts-expect-error
        this._createPopup();
      }
      // @ts-expect-error
      this._getDateRangeBox()._popupContentIdentifier(this._getControlsAria());
      // @ts-expect-error
      this._setPopupOption('visible', opened);
      this._getDateRangeBox()._setAriaAttributes();
    }
  }
  _getDateRangeBox() {
    return this.getStrategy().getDateRangeBox();
  }
  _isStartDateBox() {
    return $(this.element()).hasClass(START_DATEBOX_CLASS);
  }
  _renderPopup() {
    // @ts-expect-error
    super._renderPopup();
    if (this._isStartDateBox()) {
      // @ts-expect-error
      this._getDateRangeBox()._bindInnerWidgetOptions(this._popup, 'dropDownOptions');
    }
  }
  _popupShownHandler() {
    var _this$_getDateRangeBo;
    // @ts-expect-error
    super._popupShownHandler();
    // @ts-expect-error
    (_this$_getDateRangeBo = this._getDateRangeBox()._validationMessage) === null || _this$_getDateRangeBo === void 0 || _this$_getDateRangeBo.option('positionSide', this._getValidationMessagePositionSide());
  }
  _popupHiddenHandler() {
    var _this$_getDateRangeBo2;
    // @ts-expect-error
    super._popupHiddenHandler();
    // @ts-expect-error
    (_this$_getDateRangeBo2 = this._getDateRangeBox()._validationMessage) === null || _this$_getDateRangeBo2 === void 0 || _this$_getDateRangeBo2.option('positionSide', this._getValidationMessagePositionSide());
  }
  _focusInHandler(e) {
    // @ts-expect-error
    super._focusInHandler(e);
    this._processValueChange(e);
  }
  _popupTabHandler(e) {
    const $element = $(e.target);
    // @ts-expect-error
    if (e.shiftKey && $element.is(this._getFirstPopupElement())) {
      this._getDateRangeBox().getEndDateBox().focus();
      e.preventDefault();
    }
    // @ts-expect-error
    if (!e.shiftKey && $element.is(this._getLastPopupElement())) {
      this._getDateRangeBox().getStartDateBox().focus();
      e.preventDefault();
    }
  }
  _processValueChange(e) {
    const {
      target
    } = e;
    const dateRangeBox = this._getDateRangeBox();
    const [startDateInput, endDateInput] = dateRangeBox.field();
    if ($(target).is($(startDateInput))) {
      dateRangeBox.option('_currentSelection', 'startDate');
    }
    if ($(target).is($(endDateInput))) {
      dateRangeBox.option('_currentSelection', 'endDate');
    }
    if (!dateRangeBox.getStartDateBox().getStrategy().getWidget()) {
      return;
    }
    const calendar = dateRangeBox.getStartDateBox().getStrategy().getWidget();
    const {
      value
    } = calendar.option();
    const startDate = getDeserializedDate(value === null || value === void 0 ? void 0 : value[0]);
    const endDate = getDeserializedDate(value === null || value === void 0 ? void 0 : value[1]);
    if ($(target).is($(startDateInput))) {
      if (startDate) {
        // @ts-expect-error
        calendar._skipNavigate = true;
        calendar.option('currentDate', startDate);
      }
      this.getStrategy().setActiveStartDateBox();
      calendar.option('_currentSelection', 'startDate');
      if (dateRangeBox.option('disableOutOfRangeSelection')) {
        // @ts-expect-error
        calendar._setViewsMaxOption(endDate);
      }
    }
    if ($(target).is($(endDateInput))) {
      if (endDate) {
        if (startDate && monthDifference(startDate, endDate) > 1) {
          // @ts-expect-error
          calendar.option('currentDate', calendar._getDateByOffset(null, endDate));
          // @ts-expect-error
          calendar.option('currentDate', calendar._getDateByOffset(-1, endDate));
        }
        // @ts-expect-error
        calendar._skipNavigate = true;
        calendar.option('currentDate', endDate);
      }
      dateRangeBox.getStartDateBox().getStrategy().setActiveEndDateBox();
      calendar.option('_currentSelection', 'endDate');
      if (dateRangeBox.option('disableOutOfRangeSelection')) {
        // @ts-expect-error
        calendar._setViewsMinOption(startDate);
      }
    }
  }
  _invalidate() {
    super._invalidate();
    // @ts-expect-error
    this._refreshStrategy();
  }
  _updateInternalValidationState(isValid, validationMessage) {
    this.option({
      isValid,
      validationError: isValid ? null : {
        message: validationMessage
      }
    });
  }
  _recallInternalValidation(value) {
    // @ts-expect-error
    this._applyInternalValidation(value);
  }
  _isTargetOutOfComponent(target) {
    const $dateRangeBox = $(this._getDateRangeBox().element());
    const isTargetOutOfDateRangeBox = $(target).closest($dateRangeBox).length === 0;
    // @ts-expect-error
    return super._isTargetOutOfComponent(target) && isTargetOutOfDateRangeBox;
  }
  _updateLabelWidth() {
    const $beforeButtonsContainer = this._getDateRangeBox()._$beforeButtonsContainer;
    const {
      labelMode
    } = this.option();
    if (labelMode === 'outside' && $beforeButtonsContainer && this._isStartDateBox()) {
      this._label._updateLabelTransform(getWidth($beforeButtonsContainer));
      return;
    }
    // @ts-expect-error
    super._updateLabelWidth();
  }
  _optionChanged(args) {
    switch (args.name) {
      case 'isValid':
        {
          const isValid = this._getDateRangeBox().option('isValid');
          if (this._skipIsValidOptionChange || isValid === args.value) {
            // @ts-expect-error
            super._optionChanged(args);
            return;
          }
          this._skipIsValidOptionChange = true;
          this.option({
            isValid
          });
          this._skipIsValidOptionChange = false;
          break;
        }
      default:
        // @ts-expect-error
        super._optionChanged(args);
        break;
    }
  }
  close() {
    this.getStrategy().getDateRangeBox().getStartDateBox().option('opened', false);
  }
  getStrategy() {
    return this._strategy;
  }
}
export default MultiselectDateBox;
