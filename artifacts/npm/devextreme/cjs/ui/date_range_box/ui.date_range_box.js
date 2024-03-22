/**
* DevExtreme (cjs/ui/date_range_box/ui.date_range_box.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
var _extend = require("../../core/utils/extend");
var _icon = require("../../core/utils/icon");
var _config = _interopRequireDefault(require("../../core/config"));
var _devices = _interopRequireDefault(require("../../core/devices"));
var _message = _interopRequireDefault(require("../../localization/message"));
var _themes = require("../themes");
var _editor = _interopRequireDefault(require("../editor/editor"));
var _ui = _interopRequireDefault(require("./ui.multiselect_date_box"));
var _index = _interopRequireDefault(require("../text_box/texteditor_button_collection/index"));
var _ui2 = _interopRequireDefault(require("../drop_down_editor/ui.drop_down_button"));
var _uiText_editor = _interopRequireDefault(require("../text_box/ui.text_editor.clear"));
var _function_template = require("../../core/templates/function_template");
var _uiDate_range = require("./ui.date_range.utils");
var _iterator = require("../../core/utils/iterator");
var _inflector = require("../../core/utils/inflector");
var _index2 = require("../../events/utils/index");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const DATERANGEBOX_CLASS = 'dx-daterangebox';
const TEXTEDITOR_LABEL_STATIC_CLASS = 'dx-texteditor-with-label';
const TEXTEDITOR_LABEL_OUTSIDE_CLASS = 'dx-texteditor-label-outside';
const TEXTEDITOR_LABEL_FLOATING_CLASS = 'dx-texteditor-with-floating-label';
const START_DATEBOX_CLASS = 'dx-start-datebox';
const END_DATEBOX_CLASS = 'dx-end-datebox';
const DATERANGEBOX_SEPARATOR_CLASS = 'dx-daterangebox-separator';
const DROP_DOWN_EDITOR_BUTTON_ICON = 'dx-dropdowneditor-icon';
const INVALID_BADGE_CLASS = 'dx-show-invalid-badge';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const TEXTEDITOR_CLASS = 'dx-texteditor';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TEXTEDITOR_EMPTY_INPUT_CLASS = 'dx-texteditor-empty';
const DROP_DOWN_EDITOR_CLASS = 'dx-dropdowneditor';
const DROP_DOWN_EDITOR_ACTIVE_CLASS = 'dx-dropdowneditor-active';
const SEPARATOR_ICON_NAME = 'to';
const EVENTS_LIST = ['KeyDown', 'KeyUp', 'Change', 'Cut', 'Copy', 'Paste', 'Input', 'EnterKey'];

// STYLE dateRangeBox
let DateRangeBox = /*#__PURE__*/function (_Editor) {
  _inheritsLoose(DateRangeBox, _Editor);
  function DateRangeBox() {
    return _Editor.apply(this, arguments) || this;
  }
  var _proto = DateRangeBox.prototype;
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Editor.prototype._getDefaultOptions.call(this), {
      acceptCustomValue: true,
      activeStateEnabled: true,
      applyButtonText: _message.default.format('OK'),
      applyValueMode: 'instantly',
      buttons: undefined,
      calendarOptions: {},
      cancelButtonText: _message.default.format('Cancel'),
      endDateOutOfRangeMessage: _message.default.format('dxDateRangeBox-endDateOutOfRangeMessage'),
      dateSerializationFormat: undefined,
      deferRendering: true,
      disableOutOfRangeSelection: false,
      disabledDates: null,
      displayFormat: null,
      dropDownButtonTemplate: 'dropDownButton',
      dropDownOptions: {},
      endDate: null,
      endDateInputAttr: {},
      endDateLabel: _message.default.format('dxDateRangeBox-endDateLabel'),
      endDateName: '',
      endDatePlaceholder: '',
      endDateText: undefined,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      invalidStartDateMessage: _message.default.format('dxDateRangeBox-invalidStartDateMessage'),
      invalidEndDateMessage: _message.default.format('dxDateRangeBox-invalidEndDateMessage'),
      isValid: true,
      labelMode: 'static',
      max: undefined,
      min: undefined,
      multiView: true,
      onChange: null,
      onClosed: null,
      onCopy: null,
      onCut: null,
      onEnterKey: null,
      onInput: null,
      onKeyDown: null,
      onKeyUp: null,
      onOpened: null,
      onPaste: null,
      onValueChanged: null,
      openOnFieldClick: true,
      opened: false,
      pickerType: 'calendar',
      readOnly: false,
      showClearButton: false,
      showDropDownButton: true,
      spellcheck: false,
      startDate: null,
      startDateInputAttr: {},
      startDateLabel: _message.default.format('dxDateRangeBox-startDateLabel'),
      startDateName: '',
      startDateOutOfRangeMessage: _message.default.format('dxDateRangeBox-startDateOutOfRangeMessage'),
      startDatePlaceholder: '',
      startDateText: undefined,
      stylingMode: (0, _config.default)().editorStylingMode || 'outlined',
      todayButtonText: _message.default.format('dxCalendar-todayButtonText'),
      useHiddenSubmitElement: false,
      useMaskBehavior: false,
      validationError: null,
      validationErrors: null,
      validationMessageMode: 'auto',
      validationMessagePosition: 'auto',
      validationStatus: 'valid',
      value: [null, null],
      valueChangeEvent: 'change',
      _internalValidationErrors: [],
      _currentSelection: 'startDate'
    });
  };
  _proto._defaultOptionsRules = function _defaultOptionsRules() {
    return _Editor.prototype._defaultOptionsRules.call(this).concat([{
      device: function () {
        const themeName = (0, _themes.current)();
        return (0, _themes.isMaterial)(themeName);
      },
      options: {
        labelMode: 'floating',
        stylingMode: (0, _config.default)().editorStylingMode || 'filled'
      }
    }, {
      device: function () {
        const themeName = (0, _themes.current)();
        return (0, _themes.isFluent)(themeName);
      },
      options: {
        labelMode: 'outside'
      }
    }, {
      device: function () {
        const realDevice = _devices.default.real();
        const platform = realDevice.platform;
        return platform === 'ios' || platform === 'android';
      },
      options: {
        multiView: false
      }
    }]);
  };
  _proto._initOptions = function _initOptions(options) {
    _Editor.prototype._initOptions.call(this, options);
    const {
      value: initialValue
    } = this.initialOption();
    let {
      value,
      startDate,
      endDate
    } = this.option();
    if (value[0] && value[1] && (0, _uiDate_range.getDeserializedDate)(value[0]) > (0, _uiDate_range.getDeserializedDate)(value[1])) {
      value = [value[1], value[0]];
    }
    if (startDate && endDate && (0, _uiDate_range.getDeserializedDate)(startDate) > (0, _uiDate_range.getDeserializedDate)(endDate)) {
      [startDate, endDate] = [endDate, startDate];
    }
    if ((0, _uiDate_range.isSameDateArrays)(initialValue, value)) {
      value = [startDate, endDate];
    } else {
      [startDate, endDate] = value;
    }
    this.option({
      startDate,
      endDate,
      value
    });
  };
  _proto._createOpenAction = function _createOpenAction() {
    this._openAction = this._createActionByOption('onOpened', {
      excludeValidators: ['disabled', 'readOnly']
    });
  };
  _proto._raiseOpenAction = function _raiseOpenAction() {
    if (!this._openAction) {
      this._createOpenAction();
    }
    this._openAction();
  };
  _proto._createCloseAction = function _createCloseAction() {
    this._closeAction = this._createActionByOption('onClosed', {
      excludeValidators: ['disabled', 'readOnly']
    });
  };
  _proto._raiseCloseAction = function _raiseCloseAction() {
    if (!this._closeAction) {
      this._createCloseAction();
    }
    this._closeAction();
  };
  _proto._createEventAction = function _createEventAction(eventName) {
    this["_".concat((0, _inflector.camelize)(eventName), "Action")] = this._createActionByOption("on".concat(eventName), {
      excludeValidators: ['readOnly']
    });
  };
  _proto._raiseAction = function _raiseAction(eventName, event) {
    const action = this["_".concat((0, _inflector.camelize)(eventName), "Action")];
    if (!action) {
      this._createEventAction(eventName);
    }
    this["_".concat((0, _inflector.camelize)(eventName), "Action")]({
      event
    });
  };
  _proto._initTemplates = function _initTemplates() {
    this._templateManager.addDefaultTemplates({
      dropDownButton: new _function_template.FunctionTemplate(function (options) {
        const $icon = (0, _renderer.default)('<div>').addClass(DROP_DOWN_EDITOR_BUTTON_ICON);
        (0, _renderer.default)(options.container).append($icon);
      })
    });
    this.callBase();
  };
  _proto._getDefaultButtons = function _getDefaultButtons() {
    return [{
      name: 'clear',
      Ctor: _uiText_editor.default
    }, {
      name: 'dropDown',
      Ctor: _ui2.default
    }];
  };
  _proto._initMarkup = function _initMarkup() {
    this.$element().addClass(DATERANGEBOX_CLASS).addClass(TEXTEDITOR_CLASS).addClass(DROP_DOWN_EDITOR_CLASS);
    this._toggleDropDownEditorActiveClass();
    this._toggleEditorLabelClass();
    this._toggleReadOnlyState();
    this._renderStylingMode();
    // TODO: probably it need to update styling mode for dropDown in buttons container. It depends from design decision

    this._renderEndDateBox();
    this._renderSeparator();
    this._renderStartDateBox();
    this._toggleEmptinessState();
    this._renderEmptinessEvent();
    this._renderButtonsContainer();
    _Editor.prototype._initMarkup.call(this);
    this.$element().removeClass(INVALID_BADGE_CLASS);
  };
  _proto._renderEmptinessEvent = function _renderEmptinessEvent() {
    const eventName = (0, _index2.addNamespace)('input blur', this.NAME);
    _events_engine.default.off(this._focusTarget(), eventName);
    _events_engine.default.on(this._focusTarget(), eventName, this._toggleEmptinessState.bind(this));
  };
  _proto._toggleEmptinessState = function _toggleEmptinessState() {
    const isEmpty = this.getStartDateBox().$element().hasClass(TEXTEDITOR_EMPTY_INPUT_CLASS) && this.getEndDateBox().$element().hasClass(TEXTEDITOR_EMPTY_INPUT_CLASS);
    this.$element().toggleClass(TEXTEDITOR_EMPTY_INPUT_CLASS, isEmpty);
  };
  _proto._attachKeyboardEvents = function _attachKeyboardEvents() {
    if (!this.option('readOnly')) {
      _Editor.prototype._attachKeyboardEvents.call(this);
    }
  };
  _proto._toggleReadOnlyState = function _toggleReadOnlyState() {
    const {
      readOnly
    } = this.option();
    this.$element().toggleClass(READONLY_STATE_CLASS, !!readOnly);
    // TODO: should we add area readonly here?
  };
  _proto._toggleDropDownEditorActiveClass = function _toggleDropDownEditorActiveClass() {
    const {
      opened
    } = this.option();
    this.$element().toggleClass(DROP_DOWN_EDITOR_ACTIVE_CLASS, opened);
  };
  _proto._toggleEditorLabelClass = function _toggleEditorLabelClass() {
    const {
      startDateLabel,
      endDateLabel,
      labelMode
    } = this.option();
    const isLabelVisible = (!!startDateLabel || !!endDateLabel) && labelMode !== 'hidden';
    this.$element().removeClass(TEXTEDITOR_LABEL_FLOATING_CLASS).removeClass(TEXTEDITOR_LABEL_OUTSIDE_CLASS).removeClass(TEXTEDITOR_LABEL_STATIC_CLASS);
    if (isLabelVisible) {
      this.$element().addClass(labelMode === 'floating' ? TEXTEDITOR_LABEL_FLOATING_CLASS : TEXTEDITOR_LABEL_STATIC_CLASS);
      if (labelMode === 'outside') {
        this.$element().addClass(TEXTEDITOR_LABEL_OUTSIDE_CLASS);
      }
    }
  };
  _proto._renderStartDateBox = function _renderStartDateBox() {
    this._$startDateBox = (0, _renderer.default)('<div>').addClass(START_DATEBOX_CLASS).prependTo(this.$element());
    this._startDateBox = this._createComponent(this._$startDateBox, _ui.default, this._getStartDateBoxConfig());
    this._startDateBox.NAME = '_StartDateBox';
  };
  _proto._renderEndDateBox = function _renderEndDateBox() {
    this._$endDateBox = (0, _renderer.default)('<div>').addClass(END_DATEBOX_CLASS).appendTo(this.$element());
    this._endDateBox = this._createComponent(this._$endDateBox, _ui.default, this._getEndDateBoxConfig());
    this._endDateBox.NAME = '_EndDateBox';
  };
  _proto._renderSeparator = function _renderSeparator() {
    const $icon = (0, _icon.getImageContainer)(SEPARATOR_ICON_NAME);
    this._$separator = (0, _renderer.default)('<div>').addClass(DATERANGEBOX_SEPARATOR_CLASS).prependTo(this.$element());
    this._renderPreventBlurOnSeparatorClick();
    $icon.appendTo(this._$separator);
  };
  _proto._renderPreventBlurOnSeparatorClick = function _renderPreventBlurOnSeparatorClick() {
    const eventName = (0, _index2.addNamespace)('mousedown', this.NAME);
    _events_engine.default.off(this._$separator, eventName);
    _events_engine.default.on(this._$separator, eventName, e => {
      if (!this._hasActiveElement()) {
        this.focus();
      }
      e.preventDefault();
    });
  };
  _proto._renderButtonsContainer = function _renderButtonsContainer() {
    this._buttonCollection = new _index.default(this, this._getDefaultButtons());
    this._$beforeButtonsContainer = null;
    this._$afterButtonsContainer = null;
    const {
      buttons
    } = this.option();
    this._$beforeButtonsContainer = this._buttonCollection.renderBeforeButtons(buttons, this.$element());
    this._$afterButtonsContainer = this._buttonCollection.renderAfterButtons(buttons, this.$element());
  };
  _proto._updateButtons = function _updateButtons(names) {
    this._buttonCollection.updateButtons(names);
  };
  _proto._openHandler = function _openHandler() {
    this._toggleOpenState();
  };
  _proto._shouldCallOpenHandler = function _shouldCallOpenHandler() {
    return true;
  };
  _proto._toggleOpenState = function _toggleOpenState() {
    const {
      opened
    } = this.option();
    if (!opened) {
      this.getStartDateBox()._focusInput();
    }
    if (!this.option('readOnly')) {
      this.option('opened', !this.option('opened'));
    }
  };
  _proto._clearValueHandler = function _clearValueHandler(e) {
    e.stopPropagation();
    this._saveValueChangeEvent(e);
    this.clear();
    !this._isStartDateActiveElement() && this.focus();
    _events_engine.default.trigger((0, _renderer.default)(this.startDateField()), 'input');
  };
  _proto._isClearButtonVisible = function _isClearButtonVisible() {
    return this.option('showClearButton') && !this.option('readOnly');
  };
  _proto._focusInHandler = function _focusInHandler(event) {
    if (this._shouldSkipFocusEvent(event)) {
      return;
    }
    _Editor.prototype._focusInHandler.call(this, event);
  };
  _proto._focusOutHandler = function _focusOutHandler(event) {
    if (this._shouldSkipFocusEvent(event)) {
      return;
    }
    _Editor.prototype._focusOutHandler.call(this, event);
  };
  _proto._shouldSkipFocusEvent = function _shouldSkipFocusEvent(event) {
    const {
      target,
      relatedTarget
    } = event;
    return (0, _renderer.default)(target).is(this.startDateField()) && (0, _renderer.default)(relatedTarget).is(this.endDateField()) || (0, _renderer.default)(target).is(this.endDateField()) && (0, _renderer.default)(relatedTarget).is(this.startDateField());
  };
  _proto._getPickerType = function _getPickerType() {
    const {
      pickerType
    } = this.option();
    return ['calendar', 'native'].includes(pickerType) ? pickerType : 'calendar';
  };
  _proto._getRestErrors = function _getRestErrors(allErrors, partialErrors) {
    return allErrors.filter(error => {
      return !partialErrors.some(prevError => error.message === prevError.message);
    });
  };
  _proto._syncValidationErrors = function _syncValidationErrors(optionName, newPartialErrors, previousPartialErrors) {
    newPartialErrors || (newPartialErrors = []);
    previousPartialErrors || (previousPartialErrors = []);
    const allErrors = this.option(optionName) || [];
    const otherErrors = this._getRestErrors(allErrors, previousPartialErrors);
    this.option(optionName, [...otherErrors, ...newPartialErrors]);
  };
  _proto._getDateBoxConfig = function _getDateBoxConfig() {
    const options = this.option();
    const dateBoxConfig = {
      acceptCustomValue: options.acceptCustomValue,
      activeStateEnabled: options.activeStateEnabled,
      applyValueMode: options.applyValueMode,
      dateOutOfRangeMessage: options.dateOutOfRangeMessage,
      dateSerializationFormat: options.dateSerializationFormat,
      deferRendering: options.deferRendering,
      disabled: options.disabled,
      displayFormat: options.displayFormat,
      focusStateEnabled: options.focusStateEnabled,
      isValid: options.isValid,
      tabIndex: options.tabIndex,
      height: options.height,
      hoverStateEnabled: options.hoverStateEnabled,
      labelMode: options.labelMode,
      max: options.max,
      min: options.min,
      openOnFieldClick: options.openOnFieldClick,
      pickerType: this._getPickerType(),
      readOnly: options.readOnly,
      rtlEnabled: options.rtlEnabled,
      spellcheck: options.spellcheck,
      stylingMode: options.stylingMode,
      type: 'date',
      useMaskBehavior: options.useMaskBehavior,
      validationMessageMode: options.validationMessageMode,
      validationMessagePosition: options.validationMessagePosition,
      valueChangeEvent: options.valueChangeEvent,
      onKeyDown: options.onKeyDown,
      onKeyUp: options.onKeyUp,
      onChange: options.onChange,
      onInput: options.onInput,
      onCut: options.onCut,
      onCopy: options.onCopy,
      onPaste: options.onPaste,
      onEnterKey: options.onEnterKey,
      _dateRangeBoxInstance: this,
      _showValidationMessage: false
    };
    (0, _iterator.each)(EVENTS_LIST, (_, eventName) => {
      const optionName = "on".concat(eventName);
      if (this.hasActionSubscription(optionName)) {
        dateBoxConfig[optionName] = e => {
          this._raiseAction(eventName, e.event);
        };
      }
    });
    return dateBoxConfig;
  };
  _proto._hideOnOutsideClickHandler = function _hideOnOutsideClickHandler(_ref) {
    let {
      target
    } = _ref;
    // TODO: extract this common code part with ddeditor to avoid duplication
    const $target = (0, _renderer.default)(target);
    const dropDownButton = this.getButton('dropDown');
    const $dropDownButton = dropDownButton && dropDownButton.$element();
    const isInputClicked = !!$target.closest(this.$element()).length;
    const isDropDownButtonClicked = !!$target.closest($dropDownButton).length;
    const isOutsideClick = !isInputClicked && !isDropDownButtonClicked;
    return isOutsideClick;
  };
  _proto._getStartDateBoxConfig = function _getStartDateBoxConfig() {
    var _options$dropDownOpti;
    const options = this.option();
    return _extends({}, this._getDateBoxConfig(), {
      applyButtonText: options.applyButtonText,
      calendarOptions: options.calendarOptions,
      cancelButtonText: options.cancelButtonText,
      dateOutOfRangeMessage: options.startDateOutOfRangeMessage,
      deferRendering: options.deferRendering,
      disabledDates: (_options$dropDownOpti = options.dropDownOptions) === null || _options$dropDownOpti === void 0 ? void 0 : _options$dropDownOpti.disabledDates,
      dropDownOptions: _extends({
        showTitle: false,
        title: '',
        hideOnOutsideClick: e => this._hideOnOutsideClickHandler(e),
        hideOnParentScroll: false,
        preventScrollEvents: false
      }, options.dropDownOptions),
      invalidDateMessage: options.invalidStartDateMessage,
      onValueChanged: _ref2 => {
        let {
          value,
          event
        } = _ref2;
        const newValue = [value, this.option('value')[1]];
        this.updateValue(newValue, event);
      },
      opened: options.opened,
      onOpened: () => {
        this._raiseOpenAction();
      },
      onClosed: () => {
        this._raiseCloseAction();
      },
      onOptionChanged: args => {
        const {
          name,
          value,
          previousValue
        } = args;
        if (name === 'text') {
          this.option('startDateText', value);
        }
        if (name === 'validationErrors') {
          this._syncValidationErrors('_internalValidationErrors', value, previousValue);
        }
      },
      todayButtonText: options.todayButtonText,
      showClearButton: false,
      showDropDownButton: false,
      value: this.option('value')[0],
      label: options.startDateLabel,
      placeholder: options.startDatePlaceholder,
      inputAttr: options.startDateInputAttr,
      name: options.startDateName,
      _showValidationIcon: false
    });
  };
  _proto._getEndDateBoxConfig = function _getEndDateBoxConfig() {
    const options = this.option();
    return _extends({}, this._getDateBoxConfig(), {
      invalidDateMessage: options.invalidEndDateMessage,
      dateOutOfRangeMessage: options.endDateOutOfRangeMessage,
      onValueChanged: _ref3 => {
        let {
          value,
          event
        } = _ref3;
        const newValue = [this.option('value')[0], value];
        this.updateValue(newValue, event);
      },
      onOptionChanged: args => {
        const {
          name,
          value,
          previousValue
        } = args;
        if (name === 'text') {
          this.option('endDateText', value);
        }
        if (name === 'validationErrors') {
          this._syncValidationErrors('_internalValidationErrors', value, previousValue);
        }
      },
      opened: options.opened,
      showClearButton: false,
      showDropDownButton: false,
      value: this.option('value')[1],
      label: options.endDateLabel,
      placeholder: options.endDatePlaceholder,
      deferRendering: true,
      inputAttr: options.endDateInputAttr,
      name: options.endDateName
    });
  };
  _proto._getValidationMessagePosition = function _getValidationMessagePosition() {
    const {
      validationMessagePosition
    } = this.option();
    if (validationMessagePosition === 'auto') {
      return this.option('opened') ? 'top' : 'bottom';
    }
    return validationMessagePosition;
  };
  _proto._getSerializedDates = function _getSerializedDates(_ref4) {
    let [startDate, endDate] = _ref4;
    return [this.getStartDateBox()._serializeDate((0, _uiDate_range.getDeserializedDate)(startDate)), this.getStartDateBox()._serializeDate((0, _uiDate_range.getDeserializedDate)(endDate))];
  };
  _proto.updateValue = function updateValue(newValue, event) {
    if (!(0, _uiDate_range.isSameDateArrays)(newValue, this.option('value'))) {
      if (event) {
        this._saveValueChangeEvent(event);
      }
      this.option('value', this._getSerializedDates(newValue));
    }
  };
  _proto._updateDateBoxesValue = function _updateDateBoxesValue(newValue) {
    const startDateBox = this.getStartDateBox();
    const endDateBox = this.getEndDateBox();
    const [newStartDate, newEndDate] = newValue;
    const oldStartDate = startDateBox.option('value');
    const oldEndDate = endDateBox.option('value');
    if (!(0, _uiDate_range.isSameDates)(newStartDate, oldStartDate)) {
      startDateBox.option('value', newStartDate);
    }
    if (!(0, _uiDate_range.isSameDates)(newEndDate, oldEndDate)) {
      endDateBox.option('value', newEndDate);
    }
  };
  _proto._renderAccessKey = function _renderAccessKey() {
    const $startDateInput = (0, _renderer.default)(this.field()[0]);
    const {
      accessKey
    } = this.option();
    $startDateInput.attr('accesskey', accessKey);
  };
  _proto._focusTarget = function _focusTarget() {
    return this.$element().find(".".concat(TEXTEDITOR_INPUT_CLASS));
  };
  _proto._focusEventTarget = function _focusEventTarget() {
    return this.element();
  };
  _proto._focusClassTarget = function _focusClassTarget() {
    return this.$element();
  };
  _proto._toggleFocusClass = function _toggleFocusClass(isFocused, $element) {
    _Editor.prototype._toggleFocusClass.call(this, isFocused, this._focusClassTarget($element));
  };
  _proto._hasActiveElement = function _hasActiveElement() {
    return this._isStartDateActiveElement() || this._isEndDateActiveElement();
  };
  _proto._isStartDateActiveElement = function _isStartDateActiveElement() {
    return this._isActiveElement(this.startDateField());
  };
  _proto._isEndDateActiveElement = function _isEndDateActiveElement() {
    return this._isActiveElement(this.endDateField());
  };
  _proto._isActiveElement = function _isActiveElement(input) {
    return (0, _renderer.default)(input).is(_dom_adapter.default.getActiveElement(input));
  };
  _proto._popupContentIdentifier = function _popupContentIdentifier(identifier) {
    if (identifier) {
      this._popupContentId = identifier;
    }
    return this._popupContentId;
  };
  _proto._setAriaAttributes = function _setAriaAttributes() {
    const {
      opened
    } = this.option();
    const arias = {
      'expanded': opened,
      'controls': this._popupContentIdentifier()
    };
    const ariaOwns = opened ? this._popupContentIdentifier() : undefined;
    this.setAria(arias);
    this.setAria('owns', ariaOwns, this.$element());
  };
  _proto._cleanButtonContainers = function _cleanButtonContainers() {
    var _this$_$beforeButtons, _this$_$afterButtonsC;
    (_this$_$beforeButtons = this._$beforeButtonsContainer) === null || _this$_$beforeButtons === void 0 ? void 0 : _this$_$beforeButtons.remove();
    (_this$_$afterButtonsC = this._$afterButtonsContainer) === null || _this$_$afterButtonsC === void 0 ? void 0 : _this$_$afterButtonsC.remove();
    this._buttonCollection.clean();
    this._$beforeButtonsContainer = null;
    this._$afterButtonsContainer = null;
  };
  _proto._applyCustomValidation = function _applyCustomValidation(value) {
    this.validationRequest.fire({
      editor: this,
      value
    });
  };
  _proto._clean = function _clean() {
    var _this$_$startDateBox, _this$_$endDateBox, _this$_$separator;
    this._cleanButtonContainers();
    (_this$_$startDateBox = this._$startDateBox) === null || _this$_$startDateBox === void 0 ? void 0 : _this$_$startDateBox.remove();
    (_this$_$endDateBox = this._$endDateBox) === null || _this$_$endDateBox === void 0 ? void 0 : _this$_$endDateBox.remove();
    (_this$_$separator = this._$separator) === null || _this$_$separator === void 0 ? void 0 : _this$_$separator.remove();
    _Editor.prototype._clean.call(this);
  };
  _proto._optionChanged = function _optionChanged(args) {
    const {
      name,
      fullName,
      value,
      previousValue
    } = args;
    switch (name) {
      case 'acceptCustomValue':
      case 'dateSerializationFormat':
      case 'displayFormat':
      case 'max':
      case 'min':
      case 'openOnFieldClick':
      case 'spellcheck':
      case 'useMaskBehavior':
      case 'valueChangeEvent':
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        break;
      case 'rtlEnabled':
        _Editor.prototype._optionChanged.call(this, args);
        break;
      case 'labelMode':
        this._toggleEditorLabelClass();
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        break;
      case 'applyButtonText':
      case 'applyValueMode':
      case 'cancelButtonText':
      case 'deferRendering':
      case 'disabledDates':
      case 'todayButtonText':
        this.getStartDateBox().option(name, value);
        break;
      case 'opened':
        this._toggleDropDownEditorActiveClass();
        this.getStartDateBox().option(name, value);
        this.getEndDateBox()._setOptionWithoutOptionChange(name, value);
        break;
      case 'buttons':
        this._cleanButtonContainers();
        this._renderButtonsContainer();
        break;
      case 'calendarOptions':
      case 'dropDownOptions':
        this.getStartDateBox().option(fullName, value);
        break;
      case 'pickerType':
        {
          const pickerType = this._getPickerType();
          this.getStartDateBox().option(name, pickerType);
          this.getEndDateBox().option(name, pickerType);
          break;
        }
      case 'dateOutOfRangeMessage':
        break;
      case 'height':
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        _Editor.prototype._optionChanged.call(this, args);
        break;
      case 'dropDownButtonTemplate':
      case 'showDropDownButton':
        this._updateButtons(['dropDown']);
        break;
      case 'showClearButton':
        this._updateButtons(['clear']);
        break;
      case 'endDate':
        this.updateValue([this.option('value')[0], value]);
        break;
      case 'startDateLabel':
        this._toggleEditorLabelClass();
        this.getStartDateBox().option('label', value);
        break;
      case 'endDateLabel':
        this._toggleEditorLabelClass();
        this.getEndDateBox().option('label', value);
        break;
      case 'startDatePlaceholder':
        this.getStartDateBox().option('placeholder', value);
        break;
      case 'endDatePlaceholder':
        this.getEndDateBox().option('placeholder', value);
        break;
      case 'startDateInputAttr':
        this.getStartDateBox().option('inputAttr', value);
        break;
      case 'startDateName':
        this.getStartDateBox().option('name', value);
        break;
      case 'endDateInputAttr':
        this.getEndDateBox().option('inputAttr', value);
        break;
      case 'endDateName':
        this.getEndDateBox().option('name', value);
        break;
      case 'multiView':
        this.getStartDateBox().option('calendarOptions.viewsCount', value ? 2 : 1);
        break;
      case 'tabIndex':
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        _Editor.prototype._optionChanged.call(this, args);
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        break;
      case 'onValueChanged':
        this._createValueChangeAction();
        break;
      case 'onOpened':
        this._createOpenAction();
        break;
      case 'onClosed':
        this._createCloseAction();
        break;
      case 'onKeyDown':
      case 'onKeyUp':
      case 'onChange':
      case 'onInput':
      case 'onCut':
      case 'onCopy':
      case 'onPaste':
      case 'onEnterKey':
        this._createEventAction(name.replace('on', ''));
        break;
      case 'readOnly':
        this._updateButtons();
        _Editor.prototype._optionChanged.call(this, args);
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        break;
      case 'disabled':
        this._updateButtons();
        _Editor.prototype._optionChanged.call(this, args);
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        break;
      case 'disableOutOfRangeSelection':
        break;
      case 'startDate':
        this.updateValue([value, this.option('value')[1]]);
        break;
      case 'stylingMode':
        this._renderStylingMode();
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        break;
      case 'startDateText':
      case 'endDateText':
      case 'useHiddenSubmitElement':
        break;
      case 'invalidStartDateMessage':
        this.getStartDateBox().option('invalidDateMessage', value);
        break;
      case 'invalidEndDateMessage':
        this.getEndDateBox().option('invalidDateMessage', value);
        break;
      case 'startDateOutOfRangeMessage':
        this.getStartDateBox().option('dateOutOfRangeMessage', value);
        break;
      case 'endDateOutOfRangeMessage':
        this.getEndDateBox().option('dateOutOfRangeMessage', value);
        break;
      case 'validationMessagePosition':
        this.getStartDateBox().option(name, value);
        _Editor.prototype._optionChanged.call(this, args);
        break;
      case '_internalValidationErrors':
        {
          this._syncValidationErrors('validationErrors', value, previousValue);
          const validationErrors = this.option('validationErrors');
          this.option('isValid', !(validationErrors !== null && validationErrors !== void 0 && validationErrors.length));
          break;
        }
      case 'isValid':
        {
          this.getStartDateBox().option(name, value);
          this.getEndDateBox().option(name, value);
          const isValid = value && !this.option('_internalValidationErrors').length;
          if (this._shouldSkipIsValidChange || isValid === value) {
            _Editor.prototype._optionChanged.call(this, args);
            return;
          }
          this._shouldSkipIsValidChange = true;
          this.option('isValid', isValid);
          this._shouldSkipIsValidChange = false;
          break;
        }
      case 'validationErrors':
        {
          const internalValidationErrors = this.option('_internalValidationErrors') || [];
          const allErrors = value || [];
          const externalErrors = this._getRestErrors(allErrors, internalValidationErrors);
          const errors = [...externalErrors, ...internalValidationErrors];
          const newValue = errors.length ? errors : null;
          this._options.silent('validationErrors', newValue);
          _Editor.prototype._optionChanged.call(this, _extends({}, args, {
            value: newValue
          }));
          break;
        }
      case 'value':
        {
          const newValue = (0, _uiDate_range.sortDatesArray)(value);
          if (!(0, _uiDate_range.isSameDateArrays)(newValue, previousValue)) {
            const isDirty = !(0, _uiDate_range.isSameDateArrays)(newValue, this._initialValue);
            this.option('isDirty', isDirty);
            this._setOptionWithoutOptionChange('value', newValue);
            this._setOptionWithoutOptionChange('startDate', newValue[0]);
            this._setOptionWithoutOptionChange('endDate', newValue[1]);
            this._applyCustomValidation(newValue);
            this._updateDateBoxesValue(newValue);
            this.getStartDateBox()._strategy.renderValue();
            this._toggleEmptinessState();
            this._raiseValueChangeAction(newValue, previousValue);
            this._saveValueChangeEvent(undefined);
          }
          break;
        }
      case '_currentSelection':
        // TODO: change calendar option here?
        break;
      default:
        _Editor.prototype._optionChanged.call(this, args);
    }
  };
  _proto.getStartDateBox = function getStartDateBox() {
    return this._startDateBox;
  };
  _proto.getEndDateBox = function getEndDateBox() {
    return this._endDateBox;
  };
  _proto.getButton = function getButton(name) {
    return this._buttonCollection.getButton(name);
  };
  _proto.open = function open() {
    this.option('opened', true);
  };
  _proto.close = function close() {
    this.option('opened', false);
  };
  _proto.content = function content() {
    return this.getStartDateBox().content();
  };
  _proto.field = function field() {
    return [this.startDateField(), this.endDateField()];
  };
  _proto.startDateField = function startDateField() {
    return this.getStartDateBox().field();
  };
  _proto.endDateField = function endDateField() {
    return this.getEndDateBox().field();
  };
  _proto.focus = function focus() {
    this.getStartDateBox().focus();
  };
  _proto.reset = function reset() {
    _Editor.prototype.reset.call(this);
    const startDateBox = this.getStartDateBox();
    const endDateBox = this.getEndDateBox();
    startDateBox.reset();
    endDateBox.reset();
    startDateBox._updateInternalValidationState(true);
    endDateBox._updateInternalValidationState(true);
  };
  _proto.clear = function clear() {
    _Editor.prototype.clear.call(this);
    this.getEndDateBox().clear();
    this.getStartDateBox().clear();
  };
  return DateRangeBox;
}(_editor.default);
(0, _component_registrator.default)('dxDateRangeBox', DateRangeBox);
var _default = exports.default = DateRangeBox;
module.exports = exports.default;
module.exports.default = exports.default;
