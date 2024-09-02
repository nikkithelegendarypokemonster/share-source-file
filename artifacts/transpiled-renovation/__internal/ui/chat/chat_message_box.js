"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _button = _interopRequireDefault(require("../../../ui/button"));
var _m_text_area = _interopRequireDefault(require("../m_text_area"));
var _widget = _interopRequireDefault(require("../widget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const CHAT_MESSAGE_BOX_CLASS = 'dx-chat-message-box';
const CHAT_MESSAGE_BOX_TEXTAREA_CLASS = 'dx-chat-message-box-text-area';
const CHAT_MESSAGE_BOX_BUTTON_CLASS = 'dx-chat-message-box-button';
class MessageBox extends _widget.default {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      onMessageSend: undefined
    });
  }
  _init() {
    super._init();
    this._createMessageSendAction();
  }
  _initMarkup() {
    (0, _renderer.default)(this.element()).addClass(CHAT_MESSAGE_BOX_CLASS);
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
    const $textArea = (0, _renderer.default)('<div>').addClass(CHAT_MESSAGE_BOX_TEXTAREA_CLASS).appendTo(this.element());
    this._textArea = this._createComponent($textArea, _m_text_area.default, {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled
    });
  }
  _renderButton() {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled
    } = this.option();
    const $button = (0, _renderer.default)('<div>').addClass(CHAT_MESSAGE_BOX_BUTTON_CLASS).appendTo(this.element());
    this._button = this._createComponent($button, _button.default, {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      icon: 'send',
      stylingMode: 'text',
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
    var _this$_messageSendAct, _this$_textArea;
    const {
      text
    } = this._textArea.option();
    if (!(text !== null && text !== void 0 && text.trim())) {
      return;
    }
    (_this$_messageSendAct = this._messageSendAction) === null || _this$_messageSendAct === void 0 || _this$_messageSendAct.call(this, {
      text,
      event: e.event
    });
    (_this$_textArea = this._textArea) === null || _this$_textArea === void 0 || _this$_textArea.reset();
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
          const options = {
            [name]: value
          };
          this._button.option(options);
          this._textArea.option(options);
          break;
        }
      case 'onMessageSend':
        this._createMessageSendAction();
        break;
      default:
        super._optionChanged(args);
    }
  }
}
var _default = exports.default = MessageBox;