/**
* DevExtreme (cjs/__internal/ui/chat/chat_avatar.js)
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
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _type = require("../../../core/utils/type");
var _widget = _interopRequireDefault(require("../widget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_AVATAR_INITIALS_CLASS = 'dx-chat-message-avatar-initials';
class Avatar extends _widget.default {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      name: ''
    });
  }
  _initMarkup() {
    (0, _renderer.default)(this.element()).addClass(CHAT_MESSAGE_AVATAR_CLASS);
    super._initMarkup();
    this._renderInitialsElement();
    this._updateInitials();
  }
  _renderInitialsElement() {
    this._$initials = (0, _renderer.default)('<div>').addClass(CHAT_MESSAGE_AVATAR_INITIALS_CLASS).appendTo(this.element());
  }
  _updateInitials() {
    const {
      name
    } = this.option();
    this._$initials.text(this._getInitials(name));
  }
  _getInitials(name) {
    if ((0, _type.isDefined)(name)) {
      return String(name).charAt(0).toUpperCase();
    }
    return '';
  }
  _optionChanged(args) {
    const {
      name
    } = args;
    switch (name) {
      case 'name':
        this._updateInitials();
        break;
      default:
        super._optionChanged(args);
    }
  }
}
var _default = exports.default = Avatar;
