import _extends from "@babel/runtime/helpers/esm/extends";
import $ from '../../../core/renderer';
import { hasWindow } from '../../../core/utils/window';
import Scrollable from '../../../ui/scroll_view/ui.scrollable';
import Widget from '../widget';
import MessageGroup from './chat_message_group';
const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';
class MessageList extends Widget {
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
    $(this.element()).addClass(CHAT_MESSAGE_LIST_CLASS);
    super._initMarkup();
    this._renderMessageListContent();
    this._renderScrollable();
    this._scrollContentToLastMessageGroup();
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
    const $messageGroup = $('<div>').appendTo(this._$content);
    const messageGroup = this._createComponent($messageGroup, MessageGroup, {
      items,
      alignment: this._messageGroupAlignment(userId)
    });
    (_this$_messageGroups = this._messageGroups) === null || _this$_messageGroups === void 0 || _this$_messageGroups.push(messageGroup);
  }
  _renderScrollable() {
    this._scrollable = this._createComponent(this._$content, Scrollable, {
      useNative: true
    });
  }
  _renderMessageListContent() {
    var _items$;
    const {
      items
    } = this.option();
    this._$content = $('<div>').appendTo(this.$element());
    if (!(items !== null && items !== void 0 && items.length)) {
      return;
    }
    let currentMessageGroupUserId = (_items$ = items[0]) === null || _items$ === void 0 || (_items$ = _items$.author) === null || _items$ === void 0 ? void 0 : _items$.id;
    let currentMessageGroupItems = [];
    items.forEach((item, index) => {
      var _newMessageGroupItem$;
      const newMessageGroupItem = item ?? {};
      const id = (_newMessageGroupItem$ = newMessageGroupItem.author) === null || _newMessageGroupItem$ === void 0 ? void 0 : _newMessageGroupItem$.id;
      if (id === currentMessageGroupUserId) {
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
  _renderMessage(message, newItems) {
    var _this$_messageGroups2;
    const sender = message.author;
    this._setOptionWithoutOptionChange('items', newItems);
    const lastMessageGroup = (_this$_messageGroups2 = this._messageGroups) === null || _this$_messageGroups2 === void 0 ? void 0 : _this$_messageGroups2[this._messageGroups.length - 1];
    if (lastMessageGroup) {
      var _lastMessageGroup$opt;
      const lastMessageGroupUserId = (_lastMessageGroup$opt = lastMessageGroup.option('items')[0].author) === null || _lastMessageGroup$opt === void 0 ? void 0 : _lastMessageGroup$opt.id;
      if ((sender === null || sender === void 0 ? void 0 : sender.id) === lastMessageGroupUserId) {
        lastMessageGroup.renderMessage(message);
        this._scrollContentToLastMessageGroup();
        return;
      }
    }
    this._createMessageGroupComponent([message], sender === null || sender === void 0 ? void 0 : sender.id);
    this._scrollContentToLastMessageGroup();
  }
  _scrollContentToLastMessageGroup() {
    var _this$_messageGroups3;
    if (!((_this$_messageGroups3 = this._messageGroups) !== null && _this$_messageGroups3 !== void 0 && _this$_messageGroups3.length && hasWindow())) {
      return;
    }
    const lastMessageGroup = this._messageGroups[this._messageGroups.length - 1];
    const element = lastMessageGroup.$element()[0];
    this._scrollable.scrollToElement(element);
  }
  _clean() {
    this._messageGroups = [];
    super._clean();
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
      const newMessage = value[value.length - 1];
      this._renderMessage(newMessage ?? {}, value);
    }
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
        this._processItemsUpdating(value, previousValue);
        break;
      default:
        super._optionChanged(args);
    }
  }
}
export default MessageList;