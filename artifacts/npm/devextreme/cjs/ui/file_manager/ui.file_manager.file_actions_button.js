/**
* DevExtreme (cjs/ui/file_manager/ui.file_manager.file_actions_button.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _button = _interopRequireDefault(require("../button"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const FILE_MANAGER_FILE_ACTIONS_BUTTON = 'dx-filemanager-file-actions-button';
const FILE_MANAGER_FILE_ACTIONS_BUTTON_ACTIVATED = 'dx-filemanager-file-actions-button-activated';
const ACTIVE_STATE_CLASS = 'dx-state-active';
let FileManagerFileActionsButton = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(FileManagerFileActionsButton, _Widget);
  function FileManagerFileActionsButton() {
    return _Widget.apply(this, arguments) || this;
  }
  var _proto = FileManagerFileActionsButton.prototype;
  _proto._initMarkup = function _initMarkup() {
    this._createClickAction();
    const $button = (0, _renderer.default)('<div>');
    this.$element().append($button).addClass(FILE_MANAGER_FILE_ACTIONS_BUTTON);
    this._button = this._createComponent($button, _button.default, {
      icon: 'overflow',
      stylingMode: 'text',
      onClick: e => this._raiseClick(e)
    });
    _Widget.prototype._initMarkup.call(this);
  };
  _proto._createClickAction = function _createClickAction() {
    this._clickAction = this._createActionByOption('onClick');
  };
  _proto._raiseClick = function _raiseClick(e) {
    this._clickAction(e);
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      cssClass: '',
      onClick: null
    });
  };
  _proto._optionChanged = function _optionChanged(args) {
    const name = args.name;
    switch (name) {
      case 'cssClass':
        this.repaint();
        break;
      case 'onClick':
        this._createClickAction();
        break;
      default:
        _Widget.prototype._optionChanged.call(this, args);
    }
  };
  _proto.setActive = function setActive(active) {
    this.$element().toggleClass(FILE_MANAGER_FILE_ACTIONS_BUTTON_ACTIVATED, active);
    setTimeout(() => this._button.$element().toggleClass(ACTIVE_STATE_CLASS, active));
  };
  return FileManagerFileActionsButton;
}(_ui.default);
var _default = exports.default = FileManagerFileActionsButton;
module.exports = exports.default;
module.exports.default = exports.default;
