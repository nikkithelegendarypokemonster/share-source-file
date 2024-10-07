"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _widget = _interopRequireDefault(require("../../core/widget/widget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
class MessageBubble extends _widget.default {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      text: ''
    });
  }
  _initMarkup() {
    (0, _renderer.default)(this.element()).addClass(CHAT_MESSAGEBUBBLE_CLASS);
    super._initMarkup();
    this._updateText();
  }
  _updateText() {
    const {
      text = ''
    } = this.option();
    (0, _renderer.default)(this.element()).text(text);
  }
  _optionChanged(args) {
    const {
      name
    } = args;
    switch (name) {
      case 'text':
        this._updateText();
        break;
      default:
        super._optionChanged(args);
    }
  }
}
var _default = exports.default = MessageBubble;