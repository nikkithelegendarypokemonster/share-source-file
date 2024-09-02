/**
* DevExtreme (esm/__internal/ui/chat/chat.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import registerComponent from '../../../core/component_registrator';
import Guid from '../../../core/guid';
import $ from '../../../core/renderer';
import Widget from '../widget';
import ChatHeader from './chat_header';
import MessageBox from './chat_message_box';
import MessageList from './chat_message_list';
const CHAT_CLASS = 'dx-chat';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
class Chat extends Widget {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      title: '',
      items: [],
      user: {
        id: new Guid().toString()
      },
      onMessageSend: undefined
    });
  }
  _init() {
    super._init();
    this._createMessageSendAction();
  }
  _initMarkup() {
    $(this.element()).addClass(CHAT_CLASS);
    super._initMarkup();
    this._renderHeader();
    this._renderMessageList();
    this._renderMessageBox();
  }
  _renderHeader() {
    const {
      title = ''
    } = this.option();
    const $header = $('<div>').appendTo(this.element());
    this._chatHeader = this._createComponent($header, ChatHeader, {
      title
    });
  }
  _renderMessageList() {
    const {
      items = [],
      user
    } = this.option();
    const currentUserId = user === null || user === void 0 ? void 0 : user.id;
    const $messageList = $('<div>').appendTo(this.element());
    this._messageList = this._createComponent($messageList, MessageList, {
      items,
      currentUserId
    });
  }
  _renderMessageBox() {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled
    } = this.option();
    const $messageBox = $('<div>').appendTo(this.element());
    const configuration = {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      onMessageSend: e => {
        this._messageSendHandler(e);
      }
    };
    this._messageBox = this._createComponent($messageBox, MessageBox, configuration);
  }
  _createMessageSendAction() {
    this._messageSendAction = this._createActionByOption('onMessageSend', {
      excludeValidators: ['disabled', 'readOnly']
    });
  }
  _messageSendHandler(e) {
    var _this$_messageSendAct;
    const {
      text,
      event
    } = e;
    const {
      user
    } = this.option();
    const message = {
      timestamp: String(Date.now()),
      author: user,
      text
    };
    this.renderMessage(message);
    (_this$_messageSendAct = this._messageSendAction) === null || _this$_messageSendAct === void 0 || _this$_messageSendAct.call(this, {
      message,
      event
    });
  }
  _focusTarget() {
    const $input = $(this.element()).find(`.${TEXTEDITOR_INPUT_CLASS}`);
    return $input;
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
        this._messageBox.option({
          [name]: value
        });
        break;
      case 'title':
        this._chatHeader.option('title', value ?? '');
        break;
      case 'user':
        this._messageList.option('currentUserId', value === null || value === void 0 ? void 0 : value.id);
        break;
      case 'items':
        this._messageList.option('items', value ?? []);
        break;
      case 'onMessageSend':
        this._createMessageSendAction();
        break;
      default:
        super._optionChanged(args);
    }
  }
  renderMessage() {
    let message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      items
    } = this.option();
    const newItems = [...(items ?? []), message];
    this.option('items', newItems);
  }
}
// @ts-expect-error ts-error
registerComponent('dxChat', Chat);
export default Chat;
