/**
* DevExtreme (cjs/ui/date_range_box/ui.multiselect_date_box.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _uiDate_box = _interopRequireDefault(require("../date_box/ui.date_box.mask"));
var _rangeCalendar = _interopRequireDefault(require("./strategy/rangeCalendar"));
var _utils = require("../../events/utils");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _uiDate_range = require("./ui.date_range.utils");
var _size = require("../../core/utils/size");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const START_DATEBOX_CLASS = 'dx-start-datebox';
let MultiselectDateBox = /*#__PURE__*/function (_DateBox) {
  _inheritsLoose(MultiselectDateBox, _DateBox);
  function MultiselectDateBox() {
    return _DateBox.apply(this, arguments) || this;
  }
  var _proto = MultiselectDateBox.prototype;
  _proto._initStrategy = function _initStrategy() {
    this._strategy = new _rangeCalendar.default(this);
  };
  _proto._initMarkup = function _initMarkup() {
    _DateBox.prototype._initMarkup.call(this);
    this._renderInputClickEvent();
  };
  _proto._renderInputClickEvent = function _renderInputClickEvent() {
    const clickEventName = (0, _utils.addNamespace)('dxclick', this.NAME);
    _events_engine.default.off(this._input(), clickEventName);
    _events_engine.default.on(this._input(), clickEventName, e => {
      this._processValueChange(e);
    });
  };
  _proto._applyButtonHandler = function _applyButtonHandler(_ref) {
    let {
      event
    } = _ref;
    const value = this._strategy.getValue();
    this._strategy.dateRangeBox.updateValue(value, event);
    this.close();
    this.option('focusStateEnabled') && this.focus();
  };
  _proto._openHandler = function _openHandler(e) {
    if (this._strategy.dateRangeBox.option('opened')) {
      return;
    }
    _DateBox.prototype._openHandler.call(this, e);
  };
  _proto._renderOpenedState = function _renderOpenedState() {
    const {
      opened
    } = this.option();
    this._getDateRangeBox().option('opened', opened);
    if (this._isStartDateBox()) {
      if (opened) {
        this._createPopup();
      }
      this._getDateRangeBox()._popupContentIdentifier(this._getControlsAria());
      this._setPopupOption('visible', opened);
      this._getDateRangeBox()._setAriaAttributes();
    }
  };
  _proto._getDateRangeBox = function _getDateRangeBox() {
    return this._strategy.dateRangeBox;
  };
  _proto._isStartDateBox = function _isStartDateBox() {
    return this.$element().hasClass(START_DATEBOX_CLASS);
  };
  _proto._renderPopup = function _renderPopup() {
    _DateBox.prototype._renderPopup.call(this);
    if (this._isStartDateBox()) {
      const dateRangeBox = this._strategy.dateRangeBox;
      dateRangeBox._bindInnerWidgetOptions(this._popup, 'dropDownOptions');
    }
  };
  _proto._popupShownHandler = function _popupShownHandler() {
    var _this$_strategy$dateR;
    _DateBox.prototype._popupShownHandler.call(this);
    (_this$_strategy$dateR = this._strategy.dateRangeBox._validationMessage) === null || _this$_strategy$dateR === void 0 ? void 0 : _this$_strategy$dateR.option('positionSide', this._getValidationMessagePositionSide());
  };
  _proto._popupHiddenHandler = function _popupHiddenHandler() {
    var _this$_strategy$dateR2;
    _DateBox.prototype._popupHiddenHandler.call(this);
    (_this$_strategy$dateR2 = this._strategy.dateRangeBox._validationMessage) === null || _this$_strategy$dateR2 === void 0 ? void 0 : _this$_strategy$dateR2.option('positionSide', this._getValidationMessagePositionSide());
  };
  _proto._focusInHandler = function _focusInHandler(e) {
    _DateBox.prototype._focusInHandler.call(this, e);
    this._processValueChange(e);
  };
  _proto._popupTabHandler = function _popupTabHandler(e) {
    const $element = (0, _renderer.default)(e.target);
    if (e.shiftKey && $element.is(this._getFirstPopupElement())) {
      this._strategy.dateRangeBox.getEndDateBox().focus();
      e.preventDefault();
    }
    if (!e.shiftKey && $element.is(this._getLastPopupElement())) {
      this._strategy.dateRangeBox.getStartDateBox().focus();
      e.preventDefault();
    }
  };
  _proto._processValueChange = function _processValueChange(e) {
    const {
      target
    } = e;
    const [startDateInput, endDateInput] = this._strategy.dateRangeBox.field();
    if ((0, _renderer.default)(target).is(startDateInput)) {
      this._strategy.dateRangeBox.option('_currentSelection', 'startDate');
    }
    if ((0, _renderer.default)(target).is(endDateInput)) {
      this._strategy.dateRangeBox.option('_currentSelection', 'endDate');
    }
    if (!this._strategy.dateRangeBox.getStartDateBox()._strategy._widget) {
      return;
    }
    const calendar = this._strategy.dateRangeBox.getStartDateBox()._strategy._widget;
    const value = calendar.option('value');
    const startDate = (0, _uiDate_range.getDeserializedDate)(value[0]);
    const endDate = (0, _uiDate_range.getDeserializedDate)(value[1]);
    if ((0, _renderer.default)(target).is(startDateInput)) {
      if (startDate) {
        calendar._skipNavigate = true;
        calendar.option('currentDate', startDate);
      }
      this._strategy.setActiveStartDateBox();
      calendar.option('_currentSelection', 'startDate');
      if (this._strategy.dateRangeBox.option('disableOutOfRangeSelection')) {
        calendar._setViewsMaxOption(endDate);
      }
    }
    if ((0, _renderer.default)(target).is(endDateInput)) {
      if (endDate) {
        if (startDate && (0, _uiDate_range.monthDifference)(startDate, endDate) > 1) {
          calendar.option('currentDate', calendar._getDateByOffset(null, endDate));
          calendar.option('currentDate', calendar._getDateByOffset(-1, endDate));
        }
        calendar._skipNavigate = true;
        calendar.option('currentDate', endDate);
      }
      this._strategy.dateRangeBox.getStartDateBox()._strategy.setActiveEndDateBox();
      calendar.option('_currentSelection', 'endDate');
      if (this._strategy.dateRangeBox.option('disableOutOfRangeSelection')) {
        calendar._setViewsMinOption(startDate);
      }
    }
  };
  _proto._invalidate = function _invalidate() {
    _DateBox.prototype._invalidate.call(this);
    this._refreshStrategy();
  };
  _proto._updateInternalValidationState = function _updateInternalValidationState(isValid, validationMessage) {
    this.option({
      isValid,
      validationError: isValid ? null : {
        message: validationMessage
      }
    });
  };
  _proto._recallInternalValidation = function _recallInternalValidation(value) {
    this._applyInternalValidation(value);
  };
  _proto._isTargetOutOfComponent = function _isTargetOutOfComponent(target) {
    const $dateRangeBox = this._strategy.dateRangeBox.$element();
    const isTargetOutOfDateRangeBox = (0, _renderer.default)(target).closest($dateRangeBox).length === 0;
    return _DateBox.prototype._isTargetOutOfComponent.call(this, target) && isTargetOutOfDateRangeBox;
  };
  _proto._updateLabelWidth = function _updateLabelWidth() {
    const $beforeButtonsContainer = this._strategy.dateRangeBox._$beforeButtonsContainer;
    const {
      labelMode
    } = this.option();
    if (labelMode === 'outside' && $beforeButtonsContainer && this._isStartDateBox()) {
      this._label._updateLabelTransform((0, _size.getWidth)($beforeButtonsContainer));
      return;
    }
    _DateBox.prototype._updateLabelWidth.call(this);
  };
  _proto._optionChanged = function _optionChanged(args) {
    switch (args.name) {
      case 'isValid':
        {
          const isValid = this._strategy.dateRangeBox.option('isValid');
          if (this._skipIsValidOptionChange || isValid === args.value) {
            _DateBox.prototype._optionChanged.call(this, args);
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
        _DateBox.prototype._optionChanged.call(this, args);
        break;
    }
  };
  _proto.close = function close() {
    this._strategy.getDateRangeBox().getStartDateBox().option('opened', false);
  };
  return MultiselectDateBox;
}(_uiDate_box.default);
var _default = exports.default = MultiselectDateBox;
module.exports = exports.default;
module.exports.default = exports.default;
