"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _message = _interopRequireDefault(require("../../../localization/message"));
var _button = _interopRequireDefault(require("../../../ui/button"));
var _dom_component = _interopRequireDefault(require("../../core/widget/dom_component"));
var _m_text_area = _interopRequireDefault(require("../m_text_area"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const CHAT_MESSAGEBOX_CLASS = 'dx-chat-messagebox';
const CHAT_MESSAGEBOX_TEXTAREA_CLASS = 'dx-chat-messagebox-textarea';
const CHAT_MESSAGEBOX_BUTTON_CLASS = 'dx-chat-messagebox-button';
class MessageBox extends _dom_component.default {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      onMessageSend: undefined,
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true
    });
  }
  _init() {
    super._init();
    this._createMessageSendAction();
  }
  _initMarkup() {
    (0, _renderer.default)(this.element()).addClass(CHAT_MESSAGEBOX_CLASS);
    super._initMarkup();
    this._renderTextArea();
    this._renderButton();
  }
  _renderTextArea() {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled
    } = this.option();
    const $textArea = (0, _renderer.default)('<div>').addClass(CHAT_MESSAGEBOX_TEXTAREA_CLASS).appendTo(this.element());
    this._textArea = this._createComponent($textArea, _m_text_area.default, {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      stylingMode: 'outlined',
      placeholder: _message.default.format('dxChat-textareaPlaceholder'),
      autoResizeEnabled: true,
      valueChangeEvent: 'input',
      maxHeight: '8em',
      onInput: () => {
        const shouldButtonBeDisabled = !this._isValuableTextEntered();
        this._toggleButtonDisableState(shouldButtonBeDisabled);
      },
      onEnterKey: e => {
        var _e$event;
        if (!((_e$event = e.event) !== null && _e$event !== void 0 && _e$event.shiftKey)) {
          this._sendHandler(e);
        }
      }
    });
    this._textArea.registerKeyHandler('enter', event => {
      if (!event.shiftKey && this._isValuableTextEntered()) {
        event.preventDefault();
      }
    });
  }
  _renderButton() {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled
    } = this.option();
    const $button = (0, _renderer.default)('<div>').addClass(CHAT_MESSAGEBOX_BUTTON_CLASS).appendTo(this.element());
    this._button = this._createComponent($button, _button.default, {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      icon: 'sendfilled',
      type: 'default',
      stylingMode: 'text',
      disabled: true,
      elementAttr: {
        'aria-label': _message.default.format('dxChat-sendButtonAriaLabel')
      },
      onClick: e => {
        this._sendHandler(e);
      }
    });
  }
  _createMessageSendAction() {
    this._messageSendAction = this._createActionByOption('onMessageSend', {
      excludeValidators: ['disabled', 'readOnly']
    });
  }
  _sendHandler(e) {
    var _this$_messageSendAct;
    if (!this._isValuableTextEntered()) {
      return;
    }
    const {
      text
    } = this._textArea.option();
    this._textArea.reset();
    this._toggleButtonDisableState(true);
    (_this$_messageSendAct = this._messageSendAction) === null || _this$_messageSendAct === void 0 || _this$_messageSendAct.call(this, {
      text,
      event: e.event
    });
  }
  _toggleButtonDisableState(state) {
    this._button.option('disabled', state);
  }
  _isValuableTextEntered() {
    const {
      text
    } = this._textArea.option();
    return !!(text !== null && text !== void 0 && text.trim());
  }
  _optionChanged(args) {
    const {
      name,
      value
    } = args;
    switch (name) {
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        {
          this._button.option(name, value);
          this._textArea.option(name, value);
          break;
        }
      case 'onMessageSend':
        this._createMessageSendAction();
        break;
      default:
        super._optionChanged(args);
    }
  }
  updateInputAria(emptyViewId) {
    this._textArea.option({
      inputAttr: {
        'aria-labelledby': emptyViewId
      }
    });
  }
}
var _default = exports.default = MessageBox;