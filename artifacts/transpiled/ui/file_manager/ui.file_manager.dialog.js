"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _message = _interopRequireDefault(require("../../localization/message"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _ui2 = _interopRequireDefault(require("../popup/ui.popup"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const FILE_MANAGER_DIALOG_CONTENT = 'dx-filemanager-dialog';
const FILE_MANAGER_DIALOG_POPUP = 'dx-filemanager-dialog-popup';
let FileManagerDialogBase = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(FileManagerDialogBase, _Widget);
  function FileManagerDialogBase() {
    return _Widget.apply(this, arguments) || this;
  }
  var _proto = FileManagerDialogBase.prototype;
  _proto._initMarkup = function _initMarkup() {
    var _options$popupCssClas;
    _Widget.prototype._initMarkup.call(this);
    this._createOnClosedAction();
    const options = this._getDialogOptions();
    const $popup = (0, _renderer.default)('<div>').appendTo(this.$element());
    const popupOptions = {
      showTitle: true,
      title: options.title,
      visible: false,
      hideOnOutsideClick: true,
      contentTemplate: this._createContentTemplate.bind(this),
      toolbarItems: [{
        widget: 'dxButton',
        toolbar: 'bottom',
        location: 'after',
        options: {
          text: options.buttonText,
          onClick: this._applyDialogChanges.bind(this)
        }
      }, {
        widget: 'dxButton',
        toolbar: 'bottom',
        location: 'after',
        options: {
          text: _message.default.format('dxFileManager-dialogButtonCancel'),
          onClick: this._closeDialog.bind(this)
        }
      }],
      onInitialized: _ref => {
        let {
          component
        } = _ref;
        component.registerKeyHandler('enter', this._applyDialogChanges.bind(this));
      },
      onHiding: this._onPopupHiding.bind(this),
      onShown: this._onPopupShown.bind(this),
      _wrapperClassExternal: "".concat(FILE_MANAGER_DIALOG_POPUP, " ").concat((_options$popupCssClas = options.popupCssClass) !== null && _options$popupCssClas !== void 0 ? _options$popupCssClas : '')
    };
    if ((0, _type.isDefined)(options.height)) {
      popupOptions.height = options.height;
    }
    if ((0, _type.isDefined)(options.maxHeight)) {
      popupOptions.maxHeight = options.maxHeight;
    }
    this._popup = this._createComponent($popup, _ui2.default, popupOptions);
  };
  _proto.show = function show() {
    this._dialogResult = null;
    this._popup.show();
  };
  _proto._getDialogOptions = function _getDialogOptions() {
    return {
      title: 'Title',
      buttonText: 'ButtonText',
      contentCssClass: '',
      popupCssClass: ''
    };
  };
  _proto._createContentTemplate = function _createContentTemplate(element) {
    this._$contentElement = (0, _renderer.default)('<div>').appendTo(element).addClass(FILE_MANAGER_DIALOG_CONTENT);
    const cssClass = this._getDialogOptions().contentCssClass;
    if (cssClass) {
      this._$contentElement.addClass(cssClass);
    }
  };
  _proto._getDialogResult = function _getDialogResult() {
    return null;
  };
  _proto._applyDialogChanges = function _applyDialogChanges() {
    const result = this._getDialogResult();
    if (result) {
      this._dialogResult = result;
      this._closeDialog();
    }
  };
  _proto._closeDialog = function _closeDialog() {
    this._popup.hide();
  };
  _proto._onPopupHiding = function _onPopupHiding() {
    this._onClosedAction({
      dialogResult: this._dialogResult
    });
  };
  _proto._onPopupShown = function _onPopupShown() {};
  _proto._createOnClosedAction = function _createOnClosedAction() {
    this._onClosedAction = this._createActionByOption('onClosed');
  };
  _proto._setTitle = function _setTitle(newTitle) {
    this._popup.option('title', newTitle);
  };
  _proto._setApplyButtonOptions = function _setApplyButtonOptions(options) {
    this._popup.option('toolbarItems[0].options', options);
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      onClosed: null
    });
  };
  _proto._optionChanged = function _optionChanged(args) {
    const name = args.name;
    switch (name) {
      case 'onClosed':
        this._createOnPathChangedAction();
        break;
      default:
        _Widget.prototype._optionChanged.call(this, args);
    }
  };
  return FileManagerDialogBase;
}(_ui.default);
var _default = exports.default = FileManagerDialogBase;
module.exports = exports.default;
module.exports.default = exports.default;