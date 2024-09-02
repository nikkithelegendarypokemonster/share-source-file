/**
* DevExtreme (esm/__internal/ui/chat/chat_header.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import DOMComponent from '../../../core/dom_component';
import $ from '../../../core/renderer';
const CHAT_HEADER_CLASS = 'dx-chat-header';
const CHAT_HEADER_TEXT_CLASS = 'dx-chat-header-text';
class ChatHeader extends DOMComponent {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      title: ''
    });
  }
  _init() {
    // @ts-expect-error
    super._init();
    $(this.element()).addClass(CHAT_HEADER_CLASS);
  }
  _initMarkup() {
    // @ts-expect-error
    super._initMarkup();
    this._renderTextElement();
    this._updateText();
  }
  _renderTextElement() {
    this._$text = $('<div>').addClass(CHAT_HEADER_TEXT_CLASS).appendTo(this.element());
  }
  _updateText() {
    const {
      title
    } = this.option();
    this._$text.text(title);
  }
  _optionChanged(args) {
    const {
      name
    } = args;
    switch (name) {
      case 'title':
        this._updateText();
        break;
      default:
        // @ts-expect-error
        super._optionChanged(args);
    }
  }
}
export default ChatHeader;
