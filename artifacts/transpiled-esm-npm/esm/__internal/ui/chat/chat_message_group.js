import _extends from "@babel/runtime/helpers/esm/extends";
import $ from '../../../core/renderer';
import { isDefined } from '../../../core/utils/type';
import Widget from '../widget';
import Avatar from './chat_avatar';
import MessageBubble from './chat_message_bubble';
const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS = 'dx-chat-message-group-alignment-start';
const CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS = 'dx-chat-message-group-alignment-end';
const CHAT_MESSAGE_GROUP_INFORMATION_CLASS = 'dx-chat-message-group-information';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';
const CHAT_MESSAGE_AUTHOR_NAME_CLASS = 'dx-chat-message-author-name';
const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';
const CHAT_MESSAGE_BUBBLE_FIRST_CLASS = 'dx-chat-message-bubble-first';
const CHAT_MESSAGE_BUBBLE_LAST_CLASS = 'dx-chat-message-bubble-last';
class MessageGroup extends Widget {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      items: [],
      alignment: 'start'
    });
  }
  _updateAlignmentClass() {
    const {
      alignment
    } = this.option();
    $(this.element()).removeClass(CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS).removeClass(CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS);
    const alignmentClass = alignment === 'start' ? CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS : CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS;
    $(this.element()).addClass(alignmentClass);
  }
  _initMarkup() {
    const {
      alignment,
      items
    } = this.option();
    $(this.element()).addClass(CHAT_MESSAGE_GROUP_CLASS);
    this._updateAlignmentClass();
    super._initMarkup();
    if (items.length === 0) {
      return;
    }
    if (alignment === 'start') {
      this._renderAvatar();
    }
    this._renderMessageGroupInformation(items === null || items === void 0 ? void 0 : items[0]);
    this._renderMessageBubbles(items);
  }
  _renderAvatar() {
    var _items$0$author;
    const $avatar = $('<div>').appendTo(this.element());
    const {
      items
    } = this.option();
    const authorName = (_items$0$author = items[0].author) === null || _items$0$author === void 0 ? void 0 : _items$0$author.name;
    this._avatar = this._createComponent($avatar, Avatar, {
      name: authorName
    });
  }
  _renderMessageBubble(message, index, length) {
    const $bubble = $('<div>');
    const isFirst = index === 0;
    const isLast = index === length - 1;
    if (isFirst) {
      $bubble.addClass(CHAT_MESSAGE_BUBBLE_FIRST_CLASS);
    }
    if (isLast) {
      $bubble.addClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS);
    }
    $bubble.appendTo(this.element());
    this._createComponent($bubble, MessageBubble, {
      text: message.text
    });
  }
  _renderMessageBubbles(items) {
    items.forEach((message, index) => {
      this._renderMessageBubble(message, index, items.length);
    });
  }
  _renderName(name, $element) {
    $('<div>').addClass(CHAT_MESSAGE_AUTHOR_NAME_CLASS).text(name).appendTo($element);
  }
  _getTimeValue(timestamp) {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    const dateTime = new Date(Number(timestamp));
    return dateTime.toLocaleTimeString(undefined, options);
  }
  _renderMessageGroupInformation(message) {
    const {
      timestamp,
      author
    } = message;
    const $information = $('<div>').addClass(CHAT_MESSAGE_GROUP_INFORMATION_CLASS);
    $('<div>').addClass(CHAT_MESSAGE_AUTHOR_NAME_CLASS).text((author === null || author === void 0 ? void 0 : author.name) ?? '').appendTo($information);
    const $time = $('<div>').addClass(CHAT_MESSAGE_TIME_CLASS).appendTo($information);
    if (isDefined(timestamp)) {
      $time.text(this._getTimeValue(timestamp));
    }
    $information.appendTo(this.element());
  }
  _updateLastBubbleClasses() {
    const $bubbles = $(this.element()).find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);
    const $lastBubble = $bubbles.eq($bubbles.length - 1);
    $lastBubble.removeClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS);
  }
  _optionChanged(args) {
    const {
      name
    } = args;
    switch (name) {
      case 'items':
      case 'alignment':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
  renderMessage(message) {
    const {
      items
    } = this.option();
    const newItems = [...items, message];
    this._setOptionWithoutOptionChange('items', newItems);
    this._updateLastBubbleClasses();
    this._renderMessageBubble(message, newItems.length - 1, newItems.length);
  }
}
export default MessageGroup;