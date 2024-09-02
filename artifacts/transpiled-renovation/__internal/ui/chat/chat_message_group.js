"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _type = require("../../../core/utils/type");
var _widget = _interopRequireDefault(require("../widget"));
var _chat_avatar = _interopRequireDefault(require("./chat_avatar"));
var _chat_message_bubble = _interopRequireDefault(require("./chat_message_bubble"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS = 'dx-chat-message-group-alignment-start';
const CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS = 'dx-chat-message-group-alignment-end';
const CHAT_MESSAGE_GROUP_INFORMATION_CLASS = 'dx-chat-message-group-information';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';
const CHAT_MESSAGE_AUTHOR_NAME_CLASS = 'dx-chat-message-author-name';
const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';
const CHAT_MESSAGE_BUBBLE_FIRST_CLASS = 'dx-chat-message-bubble-first';
const CHAT_MESSAGE_BUBBLE_LAST_CLASS = 'dx-chat-message-bubble-last';
class MessageGroup extends _widget.default {
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
    (0, _renderer.default)(this.element()).removeClass(CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS).removeClass(CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS);
    const alignmentClass = alignment === 'start' ? CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS : CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS;
    (0, _renderer.default)(this.element()).addClass(alignmentClass);
  }
  _initMarkup() {
    const {
      alignment,
      items
    } = this.option();
    (0, _renderer.default)(this.element()).addClass(CHAT_MESSAGE_GROUP_CLASS);
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
    const $avatar = (0, _renderer.default)('<div>').appendTo(this.element());
    const {
      items
    } = this.option();
    const authorName = (_items$0$author = items[0].author) === null || _items$0$author === void 0 ? void 0 : _items$0$author.name;
    this._avatar = this._createComponent($avatar, _chat_avatar.default, {
      name: authorName
    });
  }
  _renderMessageBubble(message, index, length) {
    const $bubble = (0, _renderer.default)('<div>');
    const isFirst = index === 0;
    const isLast = index === length - 1;
    if (isFirst) {
      $bubble.addClass(CHAT_MESSAGE_BUBBLE_FIRST_CLASS);
    }
    if (isLast) {
      $bubble.addClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS);
    }
    $bubble.appendTo(this.element());
    this._createComponent($bubble, _chat_message_bubble.default, {
      text: message.text
    });
  }
  _renderMessageBubbles(items) {
    items.forEach((message, index) => {
      this._renderMessageBubble(message, index, items.length);
    });
  }
  _renderName(name, $element) {
    (0, _renderer.default)('<div>').addClass(CHAT_MESSAGE_AUTHOR_NAME_CLASS).text(name).appendTo($element);
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
    const $information = (0, _renderer.default)('<div>').addClass(CHAT_MESSAGE_GROUP_INFORMATION_CLASS);
    (0, _renderer.default)('<div>').addClass(CHAT_MESSAGE_AUTHOR_NAME_CLASS).text((author === null || author === void 0 ? void 0 : author.name) ?? '').appendTo($information);
    const $time = (0, _renderer.default)('<div>').addClass(CHAT_MESSAGE_TIME_CLASS).appendTo($information);
    if ((0, _type.isDefined)(timestamp)) {
      $time.text(this._getTimeValue(timestamp));
    }
    $information.appendTo(this.element());
  }
  _updateLastBubbleClasses() {
    const $bubbles = (0, _renderer.default)(this.element()).find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);
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
var _default = exports.default = MessageGroup;