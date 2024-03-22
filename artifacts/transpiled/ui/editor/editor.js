"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _element_data = require("../../core/element_data");
var _callbacks = _interopRequireDefault(require("../../core/utils/callbacks"));
var _window = require("../../core/utils/window");
var _index = require("../../events/utils/index");
var _extend = require("../../core/utils/extend");
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _validation_engine = _interopRequireDefault(require("../validation_engine"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _validation_message = _interopRequireDefault(require("../validation_message"));
var _guid = _interopRequireDefault(require("../../core/guid"));
var _common = require("../../core/utils/common");
var _dom = require("../../core/utils/dom");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const INVALID_CLASS = 'dx-invalid';
const DX_INVALID_BADGE_CLASS = 'dx-show-invalid-badge';
const VALIDATION_TARGET = 'dx-validation-target';
const VALIDATION_STATUS_VALID = 'valid';
const VALIDATION_STATUS_INVALID = 'invalid';
const READONLY_NAMESPACE = 'editorReadOnly';
const ALLOWED_STYLING_MODES = ['outlined', 'filled', 'underlined'];
const VALIDATION_MESSAGE_KEYS_MAP = {
  validationMessageMode: 'mode',
  validationMessagePosition: 'positionSide',
  validationMessageOffset: 'offset',
  validationBoundary: 'boundary'
};
const Editor = _ui.default.inherit({
  ctor: function () {
    this.showValidationMessageTimeout = null;
    this.validationRequest = (0, _callbacks.default)();
    this.callBase.apply(this, arguments);
  },
  _createElement: function (element) {
    this.callBase(element);
    const $element = this.$element();
    if ($element) {
      (0, _element_data.data)($element[0], VALIDATION_TARGET, this);
    }
  },
  _initOptions: function (options) {
    this.callBase.apply(this, arguments);
    this.option(_validation_engine.default.initValidationOptions(options));
  },
  _init: function () {
    this._initialValue = this.option('value');
    this.callBase();
    this._options.cache('validationTooltipOptions', this.option('validationTooltipOptions'));
    const $element = this.$element();
    $element.addClass(DX_INVALID_BADGE_CLASS);
  },
  _getDefaultOptions: function () {
    return (0, _extend.extend)(this.callBase(), {
      value: null,
      /**
      * @name EditorOptions.name
      * @type string
      * @default ""
      * @hidden
      */
      name: '',
      onValueChanged: null,
      readOnly: false,
      isValid: true,
      validationError: null,
      validationErrors: null,
      validationStatus: VALIDATION_STATUS_VALID,
      validationMessageMode: 'auto',
      validationMessagePosition: 'bottom',
      validationBoundary: undefined,
      validationMessageOffset: {
        h: 0,
        v: 0
      },
      validationTooltipOptions: {},
      _showValidationMessage: true,
      isDirty: false
    });
  },
  _attachKeyboardEvents: function () {
    if (!this.option('readOnly')) {
      this.callBase();
    }
  },
  _setOptionsByReference: function () {
    this.callBase();
    (0, _extend.extend)(this._optionsByReference, {
      validationError: true
    });
  },
  _createValueChangeAction: function () {
    this._valueChangeAction = this._createActionByOption('onValueChanged', {
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _suppressValueChangeAction: function () {
    this._valueChangeActionSuppressed = true;
  },
  _resumeValueChangeAction: function () {
    this._valueChangeActionSuppressed = false;
  },
  _initMarkup: function () {
    var _this$option;
    this._toggleReadOnlyState();
    this._setSubmitElementName(this.option('name'));
    this.callBase();
    this._renderValidationState();
    (_this$option = this.option('_onMarkupRendered')) === null || _this$option === void 0 ? void 0 : _this$option();
  },
  _raiseValueChangeAction: function (value, previousValue) {
    if (!this._valueChangeAction) {
      this._createValueChangeAction();
    }
    this._valueChangeAction(this._valueChangeArgs(value, previousValue));
  },
  _valueChangeArgs: function (value, previousValue) {
    return {
      value: value,
      previousValue: previousValue,
      event: this._valueChangeEventInstance
    };
  },
  _saveValueChangeEvent: function (e) {
    this._valueChangeEventInstance = e;
  },
  _focusInHandler: function (e) {
    const isValidationMessageShownOnFocus = this.option('validationMessageMode') === 'auto';

    // NOTE: The click should be processed before the validation message is shown because
    // it can change the editor's value
    if (this._canValueBeChangedByClick() && isValidationMessageShownOnFocus) {
      var _this$_validationMess;
      // NOTE: Prevent the validation message from showing
      const $validationMessageWrapper = (_this$_validationMess = this._validationMessage) === null || _this$_validationMess === void 0 ? void 0 : _this$_validationMess.$wrapper();
      $validationMessageWrapper === null || $validationMessageWrapper === void 0 ? void 0 : $validationMessageWrapper.removeClass(INVALID_MESSAGE_AUTO);
      clearTimeout(this.showValidationMessageTimeout);

      // NOTE: Show the validation message after a click changes the value
      this.showValidationMessageTimeout = setTimeout(() => $validationMessageWrapper === null || $validationMessageWrapper === void 0 ? void 0 : $validationMessageWrapper.addClass(INVALID_MESSAGE_AUTO), 150);
    }
    return this.callBase(e);
  },
  _canValueBeChangedByClick: function () {
    return false;
  },
  _getStylingModePrefix: function () {
    return 'dx-editor-';
  },
  _renderStylingMode: function () {
    const optionName = 'stylingMode';
    const optionValue = this.option(optionName);
    const prefix = this._getStylingModePrefix();
    const allowedStylingClasses = ALLOWED_STYLING_MODES.map(mode => {
      return prefix + mode;
    });
    allowedStylingClasses.forEach(className => this.$element().removeClass(className));
    let stylingModeClass = prefix + optionValue;
    if (allowedStylingClasses.indexOf(stylingModeClass) === -1) {
      const defaultOptionValue = this._getDefaultOptions()[optionName];
      const platformOptionValue = this._convertRulesToOptions(this._defaultOptionsRules())[optionName];
      stylingModeClass = prefix + (platformOptionValue || defaultOptionValue);
    }
    this.$element().addClass(stylingModeClass);
  },
  _getValidationErrors: function () {
    let validationErrors = this.option('validationErrors');
    if (!validationErrors && this.option('validationError')) {
      validationErrors = [this.option('validationError')];
    }
    return validationErrors;
  },
  _disposeValidationMessage: function () {
    if (this._$validationMessage) {
      this._$validationMessage.remove();
      this.setAria('describedby', null);
      this._$validationMessage = undefined;
      this._validationMessage = undefined;
    }
  },
  _toggleValidationClasses: function (isInvalid) {
    this.$element().toggleClass(INVALID_CLASS, isInvalid);
    this.setAria(VALIDATION_STATUS_INVALID, isInvalid || undefined);
  },
  _renderValidationState: function () {
    const isValid = this.option('isValid') && this.option('validationStatus') !== VALIDATION_STATUS_INVALID;
    const validationErrors = this._getValidationErrors();
    const $element = this.$element();
    this._toggleValidationClasses(!isValid);
    if (!(0, _window.hasWindow)() || this.option('_showValidationMessage') === false) {
      return;
    }
    this._disposeValidationMessage();
    if (!isValid && validationErrors) {
      const {
        validationMessageMode,
        validationMessageOffset,
        validationBoundary,
        rtlEnabled
      } = this.option();
      this._$validationMessage = (0, _renderer.default)('<div>').appendTo($element);
      const validationMessageContentId = "dx-".concat(new _guid.default());
      this.setAria('describedby', validationMessageContentId);
      this._validationMessage = new _validation_message.default(this._$validationMessage, (0, _extend.extend)({
        validationErrors,
        rtlEnabled,
        target: this._getValidationMessageTarget(),
        visualContainer: $element,
        mode: validationMessageMode,
        positionSide: this._getValidationMessagePosition(),
        offset: validationMessageOffset,
        boundary: validationBoundary,
        contentId: validationMessageContentId
      }, this._options.cache('validationTooltipOptions')));
      this._bindInnerWidgetOptions(this._validationMessage, 'validationTooltipOptions');
    }
  },
  _getValidationMessagePosition: function () {
    return this.option('validationMessagePosition');
  },
  _getValidationMessageTarget: function () {
    return this.$element();
  },
  _toggleReadOnlyState: function () {
    const readOnly = this.option('readOnly');
    this._toggleBackspaceHandler(readOnly);
    this.$element().toggleClass(READONLY_STATE_CLASS, !!readOnly);
    this._setAriaReadonly(readOnly);
  },
  _setAriaReadonly(readOnly) {
    this.setAria('readonly', readOnly || undefined);
  },
  _toggleBackspaceHandler: function (isReadOnly) {
    const $eventTarget = this._keyboardEventBindingTarget();
    const eventName = (0, _index.addNamespace)('keydown', READONLY_NAMESPACE);
    _events_engine.default.off($eventTarget, eventName);
    if (isReadOnly) {
      _events_engine.default.on($eventTarget, eventName, e => {
        if ((0, _index.normalizeKeyName)(e) === 'backspace') {
          e.preventDefault();
        }
      });
    }
  },
  _dispose: function () {
    const element = this.$element()[0];
    (0, _element_data.data)(element, VALIDATION_TARGET, null);
    clearTimeout(this.showValidationMessageTimeout);
    this._disposeValidationMessage();
    this.callBase();
  },
  _setSubmitElementName: function (name) {
    const $submitElement = this._getSubmitElement();
    if (!$submitElement) {
      return;
    }
    if (name.length > 0) {
      $submitElement.attr('name', name);
    } else {
      $submitElement.removeAttr('name');
    }
  },
  _getSubmitElement: function () {
    return null;
  },
  _setValidationMessageOption: function (_ref) {
    var _this$_validationMess2;
    let {
      name,
      value
    } = _ref;
    const optionKey = VALIDATION_MESSAGE_KEYS_MAP[name] ? VALIDATION_MESSAGE_KEYS_MAP[name] : name;
    (_this$_validationMess2 = this._validationMessage) === null || _this$_validationMess2 === void 0 ? void 0 : _this$_validationMess2.option(optionKey, value);
  },
  _hasActiveElement: _common.noop,
  _optionChanged: function (args) {
    var _this$_validationMess3;
    switch (args.name) {
      case 'onValueChanged':
        this._createValueChangeAction();
        break;
      case 'readOnly':
        this._toggleReadOnlyState();
        this._refreshFocusState();
        break;
      case 'value':
        if (args.value != args.previousValue) {
          // eslint-disable-line eqeqeq
          this.option('isDirty', this._initialValue !== args.value);
          this.validationRequest.fire({
            value: args.value,
            editor: this
          });
        }
        if (!this._valueChangeActionSuppressed) {
          this._raiseValueChangeAction(args.value, args.previousValue);
          this._saveValueChangeEvent(undefined);
        }
        break;
      case 'width':
        this.callBase(args);
        (_this$_validationMess3 = this._validationMessage) === null || _this$_validationMess3 === void 0 ? void 0 : _this$_validationMess3.updateMaxWidth();
        break;
      case 'name':
        this._setSubmitElementName(args.value);
        break;
      case 'isValid':
      case 'validationError':
      case 'validationErrors':
      case 'validationStatus':
        this.option(_validation_engine.default.synchronizeValidationOptions(args, this.option()));
        this._renderValidationState();
        break;
      case 'validationBoundary':
      case 'validationMessageMode':
      case 'validationMessagePosition':
      case 'validationMessageOffset':
        this._setValidationMessageOption(args);
        break;
      case 'rtlEnabled':
        this._setValidationMessageOption(args);
        this.callBase(args);
        break;
      case 'validationTooltipOptions':
        this._innerWidgetOptionChanged(this._validationMessage, args);
        break;
      case '_showValidationMessage':
      case 'isDirty':
        break;
      default:
        this.callBase(args);
    }
  },
  _resetToInitialValue: function () {
    this.option('value', this._initialValue);
  },
  blur: function () {
    if (this._hasActiveElement()) {
      (0, _dom.resetActiveElement)();
    }
  },
  clear: function () {
    const defaultOptions = this._getDefaultOptions();
    this.option('value', defaultOptions.value);
  },
  reset: function () {
    let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    if (arguments.length) {
      this._initialValue = value;
    }
    this._resetToInitialValue();
    this.option('isDirty', false);
    this.option('isValid', true);
  }
});
Editor.isEditor = instance => {
  return instance instanceof Editor;
};
var _default = exports.default = Editor;
module.exports = exports.default;
module.exports.default = exports.default;