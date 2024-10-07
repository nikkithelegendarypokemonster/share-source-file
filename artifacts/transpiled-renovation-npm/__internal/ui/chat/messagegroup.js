"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _date_serialization = _interopRequireDefault(require("../../../core/utils/date_serialization"));
var _type = require("../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _widget = _interopRequireDefault(require("../../core/widget/widget"));
var _avatar = _interopRequireDefault(require("./avatar"));
var _messagebubble = _interopRequireDefault(require("./messagebubble"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const CHAT_MESSAGEGROUP_CLASS = 'dx-chat-messagegroup';
const CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS = 'dx-chat-messagegroup-alignment-start';
const CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS = 'dx-chat-messagegroup-alignment-end';
const CHAT_MESSAGEGROUP_INFORMATION_CLASS = 'dx-chat-messagegroup-information';
const CHAT_MESSAGEGROUP_TIME_CLASS = 'dx-chat-messagegroup-time';
const CHAT_MESSAGEGROUP_AUTHOR_NAME_CLASS = 'dx-chat-messagegroup-author-name';
const CHAT_MESSAGEGROUP_CONTENT_CLASS = 'dx-chat-messagegroup-content';
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
    (0, _renderer.default)(this.element()).removeClass(CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS).removeClass(CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS);
    const alignmentClass = alignment === 'start' ? CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS : CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS;
    (0, _renderer.default)(this.element()).addClass(alignmentClass);
  }
  _initMarkup() {
    const {
      alignment,
      items
    } = this.option();
    (0, _renderer.default)(this.element()).addClass(CHAT_MESSAGEGROUP_CLASS);
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
    const $avatar = (0, _renderer.default)('<div>').appendTo(this.element());
    const {
      items
    } = this.option();
    const {
      author
    } = items[0];
    const authorName = author === null || author === void 0 ? void 0 : author.name;
    const authorAvatarUrl = author === null || author === void 0 ? void 0 : author.avatarUrl;
    this._avatar = this._createComponent($avatar, _avatar.default, {
      name: authorName,
      url: authorAvatarUrl
    });
  }
  _renderMessageBubble(message) {
    const $bubble = (0, _renderer.default)('<div>');
    this._createComponent($bubble, _messagebubble.default, {
      text: message.text
    });
    this._$messageBubbleContainer.append($bubble);
  }
  _renderMessageBubbles(items) {
    this._$messageBubbleContainer = (0, _renderer.default)('<div>').addClass(CHAT_MESSAGEGROUP_CONTENT_CLASS);
    items.forEach(message => {
      this._renderMessageBubble(message);
    });
    this._$messageBubbleContainer.appendTo(this.element());
  }
  _renderMessageGroupInformation(message) {
    const {
      alignment
    } = this.option();
    const {
      timestamp,
      author
    } = message;
    const $information = (0, _renderer.default)('<div>').addClass(CHAT_MESSAGEGROUP_INFORMATION_CLASS);
    const authorName = (author === null || author === void 0 ? void 0 : author.name) ?? _message.default.format('dxChat-defaultUserName');
    const authorNameText = alignment === 'start' ? authorName : '';
    (0, _renderer.default)('<div>').addClass(CHAT_MESSAGEGROUP_AUTHOR_NAME_CLASS).text(authorNameText).appendTo($information);
    const $time = (0, _renderer.default)('<div>').addClass(CHAT_MESSAGEGROUP_TIME_CLASS).appendTo($information);
    if ((0, _type.isDefined)(timestamp)) {
      $time.text(this._getTimeValue(timestamp));
    }
    $information.appendTo(this.element());
  }
  _getTimeValue(timestamp) {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    const date = _date_serialization.default.deserializeDate(timestamp);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return date.toLocaleTimeString(undefined, options);
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
    this._renderMessageBubble(message);
  }
}
var _default = exports.default = MessageGroup;