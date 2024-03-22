/**
* DevExtreme (cjs/renovation/component_wrapper/editors/editor.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _type = require("../../../core/utils/type");
var _component = _interopRequireDefault(require("../common/component"));
var _validation_engine = _interopRequireDefault(require("../../../ui/validation_engine"));
var _extend = require("../../../core/utils/extend");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _element_data = require("../../../core/element_data");
var _callbacks = _interopRequireDefault(require("../../../core/utils/callbacks"));
var _editor = _interopRequireDefault(require("../../../ui/editor/editor"));
var _dom = require("../../utils/dom");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const VALIDATION_TARGET = 'dx-validation-target';
let Editor = exports.default = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Editor, _Component);
  function Editor() {
    return _Component.apply(this, arguments) || this;
  }
  var _proto = Editor.prototype;
  _proto.getProps = function getProps() {
    const props = _Component.prototype.getProps.call(this);
    props.onFocusIn = () => {
      const isValidationMessageShownOnFocus = this.option('validationMessageMode') === 'auto';
      if (isValidationMessageShownOnFocus) {
        const $validationMessageWrapper = (0, _renderer.default)((0, _dom.querySelectorInSameDocument)(this.element(), '.dx-invalid-message.dx-overlay-wrapper'));
        $validationMessageWrapper === null || $validationMessageWrapper === void 0 ? void 0 : $validationMessageWrapper.removeClass(INVALID_MESSAGE_AUTO);
        const timeToWaitBeforeShow = 150;
        if (this.showValidationMessageTimeout) {
          clearTimeout(this.showValidationMessageTimeout);
        }
        this.showValidationMessageTimeout = setTimeout(() => {
          $validationMessageWrapper === null || $validationMessageWrapper === void 0 ? void 0 : $validationMessageWrapper.addClass(INVALID_MESSAGE_AUTO);
        }, timeToWaitBeforeShow);
      }
    };
    props.saveValueChangeEvent = e => {
      this._valueChangeEventInstance = e;
    };
    return props;
  };
  _proto._createElement = function _createElement(element) {
    _Component.prototype._createElement.call(this, element);
    this.showValidationMessageTimeout = undefined;
    this.validationRequest = (0, _callbacks.default)();
    (0, _element_data.data)(this.$element()[0], VALIDATION_TARGET, this);
  };
  _proto._render = function _render() {
    var _this$option;
    (_this$option = this.option('_onMarkupRendered')) === null || _this$option === void 0 ? void 0 : _this$option();
  };
  _proto._init = function _init() {
    _Component.prototype._init.call(this);
    this._initialValue = this.option('value');
  };
  _proto._initializeComponent = function _initializeComponent() {
    _Component.prototype._initializeComponent.call(this);
    this._valueChangeAction = this._createActionByOption('onValueChanged', {
      excludeValidators: ['disabled', 'readOnly']
    });
  };
  _proto._initOptions = function _initOptions(options) {
    _Component.prototype._initOptions.call(this, options);
    this.option(_validation_engine.default.initValidationOptions(options));
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Component.prototype._getDefaultOptions.call(this), {
      validationMessageOffset: {
        h: 0,
        v: 0
      },
      validationTooltipOptions: {}
    });
  };
  _proto._bindInnerWidgetOptions = function _bindInnerWidgetOptions(innerWidget, optionsContainer) {
    const innerWidgetOptions = (0, _extend.extend)({}, innerWidget.option());
    const syncOptions = () => this._silent(optionsContainer, innerWidgetOptions);
    syncOptions();
    innerWidget.on('optionChanged', syncOptions);
  };
  _proto._raiseValidation = function _raiseValidation(value, previousValue) {
    const areValuesEmpty = !(0, _type.isDefined)(value) && !(0, _type.isDefined)(previousValue);
    if (value !== previousValue && !areValuesEmpty) {
      this.validationRequest.fire({
        value,
        editor: this
      });
    }
  };
  _proto._raiseValueChangeAction = function _raiseValueChangeAction(value, previousValue) {
    var _this$_valueChangeAct;
    (_this$_valueChangeAct = this._valueChangeAction) === null || _this$_valueChangeAct === void 0 ? void 0 : _this$_valueChangeAct.call(this, {
      element: this.$element(),
      previousValue,
      value,
      event: this._valueChangeEventInstance
    });
    this._valueChangeEventInstance = undefined;
  };
  _proto._optionChanged = function _optionChanged(option) {
    const {
      name,
      previousValue,
      value
    } = option;
    if (name && this._getActionConfigs()[name] !== undefined) {
      this._addAction(name);
    }
    switch (name) {
      case 'value':
        this._raiseValidation(value, previousValue);
        this.option('isDirty', this._initialValue !== value);
        this._raiseValueChangeAction(value, previousValue);
        break;
      case 'onValueChanged':
        this._valueChangeAction = this._createActionByOption('onValueChanged', {
          excludeValidators: ['disabled', 'readOnly']
        });
        break;
      case 'isValid':
      case 'validationError':
      case 'validationErrors':
      case 'validationStatus':
        this.option(_validation_engine.default.synchronizeValidationOptions(option, this.option()));
        break;
      default:
        break;
    }
    _Component.prototype._optionChanged.call(this, option);
  };
  _proto.clear = function clear() {
    const {
      value
    } = this._getDefaultOptions();
    this.option({
      value
    });
  };
  _proto.reset = function reset() {
    let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    if (arguments.length) {
      this._initialValue = value;
    }
    this.option('value', this._initialValue);
    this.option('isDirty', false);
    this.option('isValid', true);
  };
  _proto._dispose = function _dispose() {
    _Component.prototype._dispose.call(this);
    (0, _element_data.data)(this.element(), VALIDATION_TARGET, null);
    if (this.showValidationMessageTimeout) {
      clearTimeout(this.showValidationMessageTimeout);
    }
  };
  return Editor;
}(_component.default);
const prevIsEditor = _editor.default.isEditor;
const newIsEditor = instance => prevIsEditor(instance) || instance instanceof Editor;
Editor.isEditor = newIsEditor;
_editor.default.isEditor = newIsEditor;
module.exports = exports.default;
module.exports.default = exports.default;
