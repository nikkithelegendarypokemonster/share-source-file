"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _dom_component = _interopRequireDefault(require("../../core/widget/dom_component"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const CHAT_HEADER_CLASS = 'dx-chat-header';
const CHAT_HEADER_TEXT_CLASS = 'dx-chat-header-text';
class ChatHeader extends _dom_component.default {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      title: ''
    });
  }
  _init() {
    super._init();
    (0, _renderer.default)(this.element()).addClass(CHAT_HEADER_CLASS);
  }
  _initMarkup() {
    super._initMarkup();
    this._renderTextElement();
    this._updateText();
  }
  _renderTextElement() {
    this._$text = (0, _renderer.default)('<div>').addClass(CHAT_HEADER_TEXT_CLASS).appendTo(this.element());
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
        super._optionChanged(args);
    }
  }
}
var _default = exports.default = ChatHeader;