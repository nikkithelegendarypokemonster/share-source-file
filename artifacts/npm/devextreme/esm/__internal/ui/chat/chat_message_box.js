/**
* DevExtreme (esm/__internal/ui/chat/chat_message_box.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import $ from '../../../core/renderer';
import Button from '../../../ui/button';
import TextArea from '../m_text_area';
import Widget from '../widget';
const CHAT_MESSAGE_BOX_CLASS = 'dx-chat-message-box';
const CHAT_MESSAGE_BOX_TEXTAREA_CLASS = 'dx-chat-message-box-text-area';
const CHAT_MESSAGE_BOX_BUTTON_CLASS = 'dx-chat-message-box-button';
class MessageBox extends Widget {
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
    $(this.element()).addClass(CHAT_MESSAGE_BOX_CLASS);
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
    const $textArea = $('<div>').addClass(CHAT_MESSAGE_BOX_TEXTAREA_CLASS).appendTo(this.element());
    this._textArea = this._createComponent($textArea, TextArea, {
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
    const $button = $('<div>').addClass(CHAT_MESSAGE_BOX_BUTTON_CLASS).appendTo(this.element());
    this._button = this._createComponent($button, Button, {
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
export default MessageBox;
