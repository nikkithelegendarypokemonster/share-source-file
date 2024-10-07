"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _type = require("../../../core/utils/type");
var _data_helper = _interopRequireDefault(require("../../../data_helper"));
var _message = _interopRequireDefault(require("../../../localization/message"));
var _widget = _interopRequireDefault(require("../../core/widget/widget"));
var _header = _interopRequireDefault(require("./header"));
var _messagebox = _interopRequireDefault(require("./messagebox"));
var _messagelist = _interopRequireDefault(require("./messagelist"));
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
      dataSource: null,
      user: {
        id: new _guid.default().toString()
      },
      onMessageSend: undefined
    });
  }
  _init() {
    super._init();
    // @ts-expect-error
    this._initDataController();
    // @ts-expect-error
    this._refreshDataSource();
    this._createMessageSendAction();
  }
  _dataSourceLoadErrorHandler() {
    this.option('items', []);
  }
  _dataSourceChangedHandler(newItems) {
    this.option('items', newItems.slice());
  }
  _dataSourceOptions() {
    return {
      paginate: false
    };
  }
  _initMarkup() {
    (0, _renderer.default)(this.element()).addClass(CHAT_CLASS);
    super._initMarkup();
    const {
      title
    } = this.option();
    if (title) {
      this._renderHeader(title);
    }
    this._renderMessageList();
    this._renderMessageBox();
    this._updateRootAria();
    this._updateMessageBoxAria();
  }
  _renderHeader(title) {
    const $header = (0, _renderer.default)('<div>');
    this.$element().append($header);
    this._chatHeader = this._createComponent($header, _header.default, {
      title
    });
  }
  _renderMessageList() {
    const {
      items = [],
      user
    } = this.option();
    const currentUserId = user === null || user === void 0 ? void 0 : user.id;
    const $messageList = (0, _renderer.default)('<div>');
    this.$element().append($messageList);
    this._messageList = this._createComponent($messageList, _messagelist.default, {
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
    const $messageBox = (0, _renderer.default)('<div>');
    this.$element().append($messageBox);
    const configuration = {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      onMessageSend: e => {
        this._messageSendHandler(e);
      }
    };
    this._messageBox = this._createComponent($messageBox, _messagebox.default, configuration);
  }
  _updateRootAria() {
    const aria = {
      role: 'group',
      label: _message.default.format('dxChat-elementAriaLabel')
    };
    this.setAria(aria, this.$element());
  }
  _updateMessageBoxAria() {
    const emptyViewId = this._messageList.getEmptyViewId();
    this._messageBox.updateInputAria(emptyViewId);
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
      timestamp: new Date(),
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
        this._messageBox.option(name, value);
        break;
      case 'title':
        {
          if (value) {
            if (this._chatHeader) {
              this._chatHeader.option('title', value);
            } else {
              this._renderHeader(value);
            }
          } else if (this._chatHeader) {
            this._chatHeader.dispose();
            this._chatHeader.$element().remove();
          }
          break;
        }
      case 'user':
        {
          const author = value;
          this._messageList.option('currentUserId', author === null || author === void 0 ? void 0 : author.id);
          break;
        }
      case 'items':
        this._messageList.option(name, value);
        this._updateMessageBoxAria();
        break;
      case 'dataSource':
        // @ts-expect-error
        this._refreshDataSource();
        break;
      case 'onMessageSend':
        this._createMessageSendAction();
        break;
      default:
        super._optionChanged(args);
    }
  }
  _insertNewItem(item) {
    const {
      items
    } = this.option();
    const newItems = [...(items ?? []), item];
    this.option('items', newItems);
  }
  renderMessage() {
    let message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // @ts-expect-error
    const dataSource = this.getDataSource();
    if (!(0, _type.isDefined)(dataSource)) {
      this._insertNewItem(message);
      return;
    }
    dataSource.store().insert(message).done(() => {
      this._insertNewItem(message);
    });
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Chat.include(_data_helper.default);
(0, _component_registrator.default)('dxChat', Chat);
var _default = exports.default = Chat;