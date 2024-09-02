import _extends from "@babel/runtime/helpers/esm/extends";
import $ from '../../../core/renderer';
import { isDefined } from '../../../core/utils/type';
import Widget from '../widget';
const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_AVATAR_INITIALS_CLASS = 'dx-chat-message-avatar-initials';
class Avatar extends Widget {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      name: ''
    });
  }
  _initMarkup() {
    $(this.element()).addClass(CHAT_MESSAGE_AVATAR_CLASS);
    super._initMarkup();
    this._renderInitialsElement();
    this._updateInitials();
  }
  _renderInitialsElement() {
    this._$initials = $('<div>').addClass(CHAT_MESSAGE_AVATAR_INITIALS_CLASS).appendTo(this.element());
  }
  _updateInitials() {
    const {
      name
    } = this.option();
    this._$initials.text(this._getInitials(name));
  }
  _getInitials(name) {
    if (isDefined(name)) {
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
export default Avatar;