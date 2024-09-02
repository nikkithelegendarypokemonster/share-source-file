/**
* DevExtreme (cjs/__internal/ui/chat/chat.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _widget = _interopRequireDefault(require("../widget"));
var _chat_header = _interopRequireDefault(require("./chat_header"));
var _chat_message_box = _interopRequireDefault(require("./chat_message_box"));
var _chat_message_list = _interopRequireDefault(require("./chat_message_list"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const CHAT_CLASS = 'dx-chat';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
class Chat extends _widget.default {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      title: '',
      items: [],
      user: {
        id: new _guid.default().toString()
      },
      onMessageSend: undefined
    });
  }
  _init() {
    super._init();
    this._createMessageSendAction();
  }
  _initMarkup() {
    (0, _renderer.default)(this.element()).addClass(CHAT_CLASS);
    super._initMarkup();
    this._renderHeader();
    this._renderMessageList();
    this._renderMessageBox();
  }
  _renderHeader() {
    const {
      title = ''
    } = this.option();
    const $header = (0, _renderer.default)('<div>').appendTo(this.element());
    this._chatHeader = this._createComponent($header, _chat_header.default, {
      title
    });
  }
  _renderMessageList() {
    const {
      items = [],
      user
    } = this.option();
    const currentUserId = user === null || user === void 0 ? void 0 : user.id;
    const $messageList = (0, _renderer.default)('<div>').appendTo(this.element());
    this._messageList = this._createComponent($messageList, _chat_message_list.default, {
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
    const $messageBox = (0, _renderer.default)('<div>').appendTo(this.element());
    const configuration = {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      onMessageSend: e => {
        this._messageSendHandler(e);
      }
    };
    this._messageBox = this._createComponent($messageBox, _chat_message_box.default, configuration);
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
    const $input = (0, _renderer.default)(this.element()).find(`.${TEXTEDITOR_INPUT_CLASS}`);
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
(0, _component_registrator.default)('dxChat', Chat);
var _default = exports.default = Chat;
