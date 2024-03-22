/**
* DevExtreme (cjs/ui/file_manager/ui.file_manager.dialog.name_editor.js)
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
var _text_box = _interopRequireDefault(require("../text_box"));
var _uiFile_manager = _interopRequireDefault(require("./ui.file_manager.dialog"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const FILE_MANAGER_DIALOG_NAME_EDITOR = 'dx-filemanager-dialog-name-editor';
const FILE_MANAGER_DIALOG_NAME_EDITOR_POPUP = 'dx-filemanager-dialog-name-editor-popup';
let FileManagerNameEditorDialog = /*#__PURE__*/function (_FileManagerDialogBas) {
  _inheritsLoose(FileManagerNameEditorDialog, _FileManagerDialogBas);
  function FileManagerNameEditorDialog() {
    return _FileManagerDialogBas.apply(this, arguments) || this;
  }
  var _proto = FileManagerNameEditorDialog.prototype;
  _proto.show = function show(name) {
    name = name || '';
    if (this._nameTextBox) {
      this._nameTextBox.option('value', name);
    } else {
      this._initialNameValue = name;
    }
    _FileManagerDialogBas.prototype.show.call(this);
  };
  _proto._onPopupShown = function _onPopupShown() {
    if (!this._nameTextBox) {
      return;
    }
    const $textBoxInput = this._nameTextBox._input();
    $textBoxInput.length && $textBoxInput[0].select();
    this._nameTextBox.focus();
  };
  _proto._getDialogOptions = function _getDialogOptions() {
    return (0, _extend.extend)(_FileManagerDialogBas.prototype._getDialogOptions.call(this), {
      title: this.option('title'),
      buttonText: this.option('buttonText'),
      contentCssClass: FILE_MANAGER_DIALOG_NAME_EDITOR,
      popupCssClass: FILE_MANAGER_DIALOG_NAME_EDITOR_POPUP
    });
  };
  _proto._createContentTemplate = function _createContentTemplate(element) {
    _FileManagerDialogBas.prototype._createContentTemplate.call(this, element);
    this._nameTextBox = this._createComponent((0, _renderer.default)('<div>'), _text_box.default, {
      value: this._initialNameValue,
      onEnterKey: () => this._hasCompositionJustEnded && this._applyDialogChanges(),
      onKeyDown: e => this._checkCompositionEnded(e)
    });
    this._$contentElement.append(this._nameTextBox.$element());
  };
  _proto._checkCompositionEnded = function _checkCompositionEnded(_ref) {
    let {
      event
    } = _ref;
    this._hasCompositionJustEnded = event.which !== 229;
  };
  _proto._getDialogResult = function _getDialogResult() {
    const nameValue = this._nameTextBox.option('value');
    return nameValue ? {
      name: nameValue
    } : null;
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_FileManagerDialogBas.prototype._getDefaultOptions.call(this), {
      title: '',
      buttonText: ''
    });
  };
  return FileManagerNameEditorDialog;
}(_uiFile_manager.default);
var _default = exports.default = FileManagerNameEditorDialog;
module.exports = exports.default;
module.exports.default = exports.default;
