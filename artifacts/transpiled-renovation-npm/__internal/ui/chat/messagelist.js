"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MESSAGEGROUP_TIMEOUT = void 0;
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _resize_observer = _interopRequireDefault(require("../../../core/resize_observer"));
var _date_serialization = _interopRequireDefault(require("../../../core/utils/date_serialization"));
var _dom = require("../../../core/utils/dom");
var _type = require("../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _get_scroll_top_max = require("../../../renovation/ui/scroll_view/utils/get_scroll_top_max");
var _ui = _interopRequireDefault(require("../../../ui/scroll_view/ui.scrollable"));
var _widget = _interopRequireDefault(require("../../core/widget/widget"));
var _layout = require("../splitter/utils/layout");
var _messagegroup = _interopRequireDefault(require("./messagegroup"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const CHAT_MESSAGELIST_CLASS = 'dx-chat-messagelist';
const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';
const CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS = 'dx-chat-messagelist-empty-image';
const CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS = 'dx-chat-messagelist-empty-message';
const CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS = 'dx-chat-messagelist-empty-prompt';
const SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
const MESSAGEGROUP_TIMEOUT = exports.MESSAGEGROUP_TIMEOUT = 5 * 1000 * 60;
class MessageList extends _widget.default {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      items: [],
      currentUserId: ''
    });
  }
  _init() {
    super._init();
    this._messageGroups = [];
  }
  _initMarkup() {
    (0, _renderer.default)(this.element()).addClass(CHAT_MESSAGELIST_CLASS);
    super._initMarkup();
    this._renderScrollable();
    this._renderMessageListContent();
    this._updateAria();
  }
  _renderContentImpl() {
    super._renderContentImpl();
    this._attachResizeObserverSubscription();
  }
  _attachResizeObserverSubscription() {
    const element = this.$element().get(0);
    _resize_observer.default.unobserve(element);
    _resize_observer.default.observe(element, entry => this._resizeHandler(entry));
  }
  _resizeHandler(_ref) {
    let {
      contentRect,
      target
    } = _ref;
    if (!(0, _dom.isElementInDom)((0, _renderer.default)(target)) || !(0, _layout.isElementVisible)(target)) {
      return;
    }
    const isInitialRendering = !(0, _type.isDefined)(this._containerClientHeight);
    const newHeight = contentRect.height;
    if (isInitialRendering) {
      this._scrollContentToLastMessage();
    } else {
      const heightChange = this._containerClientHeight - newHeight;
      const isHeightDecreasing = heightChange > 0;
      let scrollTop = this._scrollable.scrollTop();
      if (isHeightDecreasing) {
        scrollTop += heightChange;
        this._scrollable.scrollTo({
          top: scrollTop
        });
      }
    }
    this._containerClientHeight = newHeight;
  }
  _renderEmptyViewContent() {
    const $emptyView = (0, _renderer.default)('<div>').addClass(CHAT_MESSAGELIST_EMPTY_VIEW_CLASS).attr('id', `dx-${new _guid.default()}`);
    (0, _renderer.default)('<div>').appendTo($emptyView).addClass(CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS);
    const messageText = _message.default.format('dxChat-emptyListMessage');
    (0, _renderer.default)('<div>').appendTo($emptyView).addClass(CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS).text(messageText);
    const promptText = _message.default.format('dxChat-emptyListPrompt');
    (0, _renderer.default)('<div>').appendTo($emptyView).addClass(CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS).text(promptText);
    $emptyView.appendTo(this._$content());
  }
  _removeEmptyView() {
    this._$content().empty();
  }
  _isEmpty() {
    const {
      items
    } = this.option();
    return items.length === 0;
  }
  _isCurrentUser(id) {
    const {
      currentUserId
    } = this.option();
    return currentUserId === id;
  }
  _messageGroupAlignment(id) {
    return this._isCurrentUser(id) ? 'end' : 'start';
  }
  _createMessageGroupComponent(items, userId) {
    var _this$_messageGroups;
    const $messageGroup = (0, _renderer.default)('<div>').appendTo(this._$content());
    const messageGroup = this._createComponent($messageGroup, _messagegroup.default, {
      items,
      alignment: this._messageGroupAlignment(userId)
    });
    (_this$_messageGroups = this._messageGroups) === null || _this$_messageGroups === void 0 || _this$_messageGroups.push(messageGroup);
  }
  _renderScrollable() {
    const $scrollable = (0, _renderer.default)('<div>').appendTo(this.$element());
    this._scrollable = this._createComponent($scrollable, _ui.default, {
      useKeyboard: false,
      bounceEnabled: false
    });
  }
  _renderMessageListContent() {
    var _items$;
    if (this._isEmpty()) {
      this._renderEmptyViewContent();
      return;
    }
    const {
      items
    } = this.option();
    let currentMessageGroupUserId = (_items$ = items[0]) === null || _items$ === void 0 || (_items$ = _items$.author) === null || _items$ === void 0 ? void 0 : _items$.id;
    let currentMessageGroupItems = [];
    items.forEach((item, index) => {
      var _newMessageGroupItem$;
      const newMessageGroupItem = item ?? {};
      const id = (_newMessageGroupItem$ = newMessageGroupItem.author) === null || _newMessageGroupItem$ === void 0 ? void 0 : _newMessageGroupItem$.id;
      const isTimeoutExceeded = this._isTimeoutExceeded(currentMessageGroupItems[currentMessageGroupItems.length - 1] ?? {}, item);
      if (id === currentMessageGroupUserId && !isTimeoutExceeded) {
        currentMessageGroupItems.push(newMessageGroupItem);
      } else {
        this._createMessageGroupComponent(currentMessageGroupItems, currentMessageGroupUserId);
        currentMessageGroupUserId = id;
        currentMessageGroupItems = [];
        currentMessageGroupItems.push(newMessageGroupItem);
      }
      if (items.length - 1 === index) {
        this._createMessageGroupComponent(currentMessageGroupItems, currentMessageGroupUserId);
      }
    });
  }
  _renderMessage(message) {
    var _this$_messageGroups2;
    const {
      author
    } = message;
    const lastMessageGroup = (_this$_messageGroups2 = this._messageGroups) === null || _this$_messageGroups2 === void 0 ? void 0 : _this$_messageGroups2[this._messageGroups.length - 1];
    if (lastMessageGroup) {
      var _lastMessageGroupItem;
      const {
        items
      } = lastMessageGroup.option();
      const lastMessageGroupItem = items[items.length - 1];
      const lastMessageGroupUserId = (_lastMessageGroupItem = lastMessageGroupItem.author) === null || _lastMessageGroupItem === void 0 ? void 0 : _lastMessageGroupItem.id;
      const isTimeoutExceeded = this._isTimeoutExceeded(lastMessageGroupItem, message);
      if ((author === null || author === void 0 ? void 0 : author.id) === lastMessageGroupUserId && !isTimeoutExceeded) {
        lastMessageGroup.renderMessage(message);
        this._scrollContentToLastMessage();
        return;
      }
    }
    this._createMessageGroupComponent([message], author === null || author === void 0 ? void 0 : author.id);
    this._scrollContentToLastMessage();
  }
  _$content() {
    return (0, _renderer.default)(this._scrollable.content());
  }
  _scrollContentToLastMessage() {
    this._scrollable.scrollTo({
      top: (0, _get_scroll_top_max.getScrollTopMax)(this._scrollableContainer())
    });
  }
  _scrollableContainer() {
    return (0, _renderer.default)(this._scrollable.element()).find(`.${SCROLLABLE_CONTAINER_CLASS}`).get(0);
  }
  _isMessageAddedToEnd(value, previousValue) {
    const valueLength = value.length;
    const previousValueLength = previousValue.length;
    if (valueLength === 0) {
      return false;
    }
    if (previousValueLength === 0) {
      return valueLength === 1;
    }
    const lastValueItem = value[valueLength - 1];
    const lastPreviousValueItem = previousValue[previousValueLength - 1];
    const isLastItemNotTheSame = lastValueItem !== lastPreviousValueItem;
    const isLengthIncreasedByOne = valueLength - previousValueLength === 1;
    return isLastItemNotTheSame && isLengthIncreasedByOne;
  }
  _processItemsUpdating(value, previousValue) {
    const shouldItemsBeUpdatedCompletely = !this._isMessageAddedToEnd(value, previousValue);
    if (shouldItemsBeUpdatedCompletely) {
      this._invalidate();
    } else {
      if (!previousValue.length) {
        this._removeEmptyView();
      }
      const newMessage = value[value.length - 1];
      this._renderMessage(newMessage ?? {});
    }
  }
  _isTimeoutExceeded(lastMessage, newMessage) {
    const lastMessageTimestamp = lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.timestamp;
    const newMessageTimestamp = newMessage === null || newMessage === void 0 ? void 0 : newMessage.timestamp;
    if (!lastMessageTimestamp || !newMessageTimestamp) {
      return false;
    }
    const lastMessageTimestampInMs = _date_serialization.default.deserializeDate(lastMessageTimestamp);
    const newMessageTimestampInMs = _date_serialization.default.deserializeDate(newMessageTimestamp);
    const result = newMessageTimestampInMs - lastMessageTimestampInMs > MESSAGEGROUP_TIMEOUT;
    return result;
  }
  _updateAria() {
    const aria = {
      role: 'log',
      atomic: 'false',
      label: _message.default.format('dxChat-messageListAriaLabel'),
      live: 'polite',
      relevant: 'additions'
    };
    this.setAria(aria);
  }
  _clean() {
    this._messageGroups = [];
    super._clean();
  }
  _optionChanged(args) {
    const {
      name,
      value,
      previousValue
    } = args;
    switch (name) {
      case 'currentUserId':
        this._invalidate();
        break;
      case 'items':
        this._processItemsUpdating(value ?? [], previousValue ?? []);
        break;
      default:
        super._optionChanged(args);
    }
  }
  getEmptyViewId() {
    if (this._isEmpty()) {
      const $emptyView = this._$content().find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`);
      const emptyViewId = $emptyView.attr('id') ?? null;
      return emptyViewId;
    }
    return null;
  }
}
var _default = exports.default = MessageList;