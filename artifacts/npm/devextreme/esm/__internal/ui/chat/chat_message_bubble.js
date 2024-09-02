/**
* DevExtreme (esm/__internal/ui/chat/chat_message_bubble.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import $ from '../../../core/renderer';
import Widget from '../widget';
const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';
class MessageBubble extends Widget {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      text: ''
    });
  }
  _initMarkup() {
    $(this.element()).addClass(CHAT_MESSAGE_BUBBLE_CLASS);
    super._initMarkup();
    this._updateText();
  }
  _updateText() {
    const {
      text = ''
    } = this.option();
    $(this.element()).text(text);
  }
  _optionChanged(args) {
    const {
      name
    } = args;
    switch (name) {
      case 'text':
        this._updateText();
        break;
      default:
        super._optionChanged(args);
    }
  }
}
export default MessageBubble;
