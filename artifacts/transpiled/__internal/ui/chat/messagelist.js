"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MESSAGEGROUP_TIMEOUT = void 0;
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _resize_observer = _interopRequireDefault(require("../../../core/resize_observer"));
var _common = require("../../../core/utils/common");
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _date_serialization = _interopRequireDefault(require("../../../core/utils/date_serialization"));
var _dom = require("../../../core/utils/dom");
var _type = require("../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _get_scroll_top_max = require("../../../renovation/ui/scroll_view/utils/get_scroll_top_max");
var _scroll_view = _interopRequireDefault(require("../../../ui/scroll_view"));
var _widget = _interopRequireDefault(require("../../core/widget/widget"));
var _layout = require("../splitter/utils/layout");
var _messagegroup = _interopRequireDefault(require("./messagegroup"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const CHAT_MESSAGELIST_CLASS = 'dx-chat-messagelist';
const CHAT_MESSAGELIST_EMPTY_CLASS = 'dx-chat-messagelist-empty';
const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';
const CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS = 'dx-chat-messagelist-empty-image';
const CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS = 'dx-chat-messagelist-empty-message';
const CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS = 'dx-chat-messagelist-empty-prompt';
const CHAT_MESSAGELIST_DAY_HEADER_CLASS = 'dx-chat-messagelist-day-header';
const SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
const MESSAGEGROUP_TIMEOUT = exports.MESSAGEGROUP_TIMEOUT = 5 * 1000 * 60;
class MessageList extends _widget.default {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      items: [],
      currentUserId: '',
      showDayHeaders: true,
      isLoading: false
    });
  }
  _init() {
    super._init();
    this._messageGroups = [];
    this._lastMessageDate = null;
  }
  _initMarkup() {
    (0, _renderer.default)(this.element()).addClass(CHAT_MESSAGELIST_CLASS);
    super._initMarkup();
    this._renderScrollView();
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
      let scrollTop = this._scrollView.scrollTop();
      if (isHeightDecreasing) {
        scrollTop += heightChange;
        this._scrollView.scrollTo({
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
    this.$element().removeClass(CHAT_MESSAGELIST_EMPTY_CLASS);
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
  _renderScrollView() {
    const $scrollable = (0, _renderer.default)('<div>').appendTo(this.$element());
    this._scrollView = this._createComponent($scrollable, _scroll_view.default, {
      useKeyboard: false,
      bounceEnabled: false,
      onReachBottom: _common.noop,
      reachBottomText: '',
      indicateLoading: false
    });
  }
  _shouldAddDayHeader(timestamp) {
    const {
      showDayHeaders
    } = this.option();
    if (!showDayHeaders) {
      return false;
    }
    const deserializedDate = _date_serialization.default.deserializeDate(timestamp);
    if (!(0, _type.isDate)(deserializedDate) || isNaN(deserializedDate.getTime())) {
      return false;
    }
    return !_date.default.sameDate(this._lastMessageDate, deserializedDate);
  }
  _createDayHeader(timestamp) {
    const deserializedDate = _date_serialization.default.deserializeDate(timestamp);
    const today = new Date();
    const yesterday = new Date(new Date().setDate(today.getDate() - 1));
    this._lastMessageDate = deserializedDate;
    let headerDate = deserializedDate.toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/[/-]/g, '.');
    if (_date.default.sameDate(deserializedDate, today)) {
      headerDate = `${_message.default.format('Today')} ${headerDate}`;
    }
    if (_date.default.sameDate(deserializedDate, yesterday)) {
      headerDate = `${_message.default.format('Yesterday')} ${headerDate}`;
    }
    (0, _renderer.default)('<div>').addClass(CHAT_MESSAGELIST_DAY_HEADER_CLASS).text(headerDate).appendTo(this._$content());
  }
  _updateLoadingState(isLoading) {
    if (!this._scrollView) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._scrollView.release(!isLoading);
  }
  _renderMessageListContent() {
    var _items$;
    const {
      isLoading
    } = this.option();
    this.$element().toggleClass(CHAT_MESSAGELIST_EMPTY_CLASS, this._isEmpty() && !isLoading);
    if (this._isEmpty() && !isLoading) {
      this._renderEmptyViewContent();
      this._updateLoadingState(false);
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
      const shouldCreateDayHeader = this._shouldAddDayHeader(newMessageGroupItem.timestamp);
      const isTimeoutExceeded = this._isTimeoutExceeded(currentMessageGroupItems[currentMessageGroupItems.length - 1] ?? {}, item);
      const shouldCreateMessageGroup = shouldCreateDayHeader && currentMessageGroupItems.length || isTimeoutExceeded || id !== currentMessageGroupUserId;
      if (shouldCreateMessageGroup) {
        this._createMessageGroupComponent(currentMessageGroupItems, currentMessageGroupUserId);
        currentMessageGroupUserId = id;
        currentMessageGroupItems = [];
        currentMessageGroupItems.push(newMessageGroupItem);
      } else {
        currentMessageGroupItems.push(newMessageGroupItem);
      }
      if (shouldCreateDayHeader) {
        this._createDayHeader(item === null || item === void 0 ? void 0 : item.timestamp);
      }
      if (items.length - 1 === index) {
        this._createMessageGroupComponent(currentMessageGroupItems, currentMessageGroupUserId);
      }
    });
    // @ts-expect-error
    this._updateLoadingState(isLoading);
    this._scrollContentToLastMessage();
  }
  _renderMessage(message) {
    var _this$_messageGroups2;
    const {
      author,
      timestamp
    } = message;
    const lastMessageGroup = (_this$_messageGroups2 = this._messageGroups) === null || _this$_messageGroups2 === void 0 ? void 0 : _this$_messageGroups2[this._messageGroups.length - 1];
    const shouldCreateDayHeader = this._shouldAddDayHeader(timestamp);
    if (lastMessageGroup) {
      var _lastMessageGroupItem;
      const {
        items
      } = lastMessageGroup.option();
      const lastMessageGroupItem = items[items.length - 1];
      const lastMessageGroupUserId = (_lastMessageGroupItem = lastMessageGroupItem.author) === null || _lastMessageGroupItem === void 0 ? void 0 : _lastMessageGroupItem.id;
      const isTimeoutExceeded = this._isTimeoutExceeded(lastMessageGroupItem, message);
      if ((author === null || author === void 0 ? void 0 : author.id) === lastMessageGroupUserId && !isTimeoutExceeded && !shouldCreateDayHeader) {
        lastMessageGroup.renderMessage(message);
        this._scrollContentToLastMessage();
        return;
      }
    }
    if (shouldCreateDayHeader) {
      this._createDayHeader(timestamp);
    }
    this._createMessageGroupComponent([message], author === null || author === void 0 ? void 0 : author.id);
    this._scrollContentToLastMessage();
  }
  _$content() {
    return (0, _renderer.default)(this._scrollView.content());
  }
  _scrollContentToLastMessage() {
    this._scrollView.scrollTo({
      top: (0, _get_scroll_top_max.getScrollTopMax)(this._scrollableContainer())
    });
  }
  _scrollableContainer() {
    return (0, _renderer.default)(this._scrollView.element()).find(`.${SCROLLABLE_CONTAINER_CLASS}`).get(0);
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
    this._lastMessageDate = null;
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
      case 'showDayHeaders':
        this._invalidate();
        break;
      case 'isLoading':
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