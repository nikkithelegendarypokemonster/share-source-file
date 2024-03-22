/**
* DevExtreme (cjs/ui/validation_message.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _size = require("../core/utils/size");
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));
var _ui = _interopRequireDefault(require("./overlay/ui.overlay"));
var _extend = require("../core/utils/extend");
var _string = require("../core/utils/string");
var _position = require("../core/utils/position");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const INVALID_MESSAGE = 'dx-invalid-message';
const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const INVALID_MESSAGE_ALWAYS = 'dx-invalid-message-always';
const INVALID_MESSAGE_CONTENT = 'dx-invalid-message-content';
const VALIDATION_MESSAGE_MIN_WIDTH = 100;
const ValidationMessage = _ui.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      integrationOptions: {},
      templatesRenderAsynchronously: false,
      shading: false,
      width: 'auto',
      height: 'auto',
      hideOnOutsideClick: false,
      animation: null,
      visible: true,
      propagateOutsideClick: true,
      _checkParentVisibility: false,
      rtlEnabled: false,
      contentTemplate: this._renderInnerHtml,
      maxWidth: '100%',
      container: this.$element(),
      target: undefined,
      mode: 'auto',
      validationErrors: undefined,
      preventScrollEvents: false,
      positionSide: 'top',
      boundary: undefined,
      offset: {
        h: 0,
        v: 0
      },
      contentId: undefined
    });
  },
  _init() {
    this.callBase();
    this.updateMaxWidth();
    this._updatePosition();
  },
  _initMarkup() {
    this.callBase();
    this._ensureMessageNotEmpty();
    this._updatePositionByTarget();
    this._toggleModeClass();
    this._updateContentId();
  },
  _updatePositionByTarget: function () {
    const {
      target
    } = this.option();
    this.option('position.of', target);
  },
  _ensureMessageNotEmpty: function () {
    this._textMarkup = this._getTextMarkup();
    const shouldShowMessage = this.option('visible') && this._textMarkup;
    this._toggleVisibilityClasses(shouldShowMessage);
  },
  _toggleVisibilityClasses: function (visible) {
    if (visible) {
      this.$element().addClass(INVALID_MESSAGE);
      this.$wrapper().addClass(INVALID_MESSAGE);
    } else {
      this.$element().removeClass(INVALID_MESSAGE);
      this.$wrapper().removeClass(INVALID_MESSAGE);
    }
  },
  _updateContentId() {
    const {
      container,
      contentId
    } = this.option();
    const id = contentId !== null && contentId !== void 0 ? contentId : (0, _renderer.default)(container).attr('aria-describedby');
    this.$content().addClass(INVALID_MESSAGE_CONTENT).attr('id', id);
  },
  _renderInnerHtml(element) {
    const $element = element && (0, _renderer.default)(element);
    $element === null || $element === void 0 ? void 0 : $element.html(this._textMarkup);
  },
  _getTextMarkup() {
    var _this$option;
    const validationErrors = (_this$option = this.option('validationErrors')) !== null && _this$option !== void 0 ? _this$option : [];
    let validationErrorMessage = '';
    validationErrors.forEach(err => {
      var _err$message;
      const separator = validationErrorMessage ? '<br />' : '';
      validationErrorMessage += separator + (0, _string.encodeHtml)((_err$message = err === null || err === void 0 ? void 0 : err.message) !== null && _err$message !== void 0 ? _err$message : '');
    });
    return validationErrorMessage;
  },
  _toggleModeClass() {
    const mode = this.option('mode');
    this.$wrapper().toggleClass(INVALID_MESSAGE_AUTO, mode === 'auto').toggleClass(INVALID_MESSAGE_ALWAYS, mode === 'always');
  },
  updateMaxWidth() {
    const target = this.option('target');
    const targetWidth = (0, _size.getOuterWidth)(target);
    let maxWidth = '100%';
    if (targetWidth) {
      maxWidth = Math.max(targetWidth, VALIDATION_MESSAGE_MIN_WIDTH);
    }
    this.option({
      maxWidth
    });
  },
  _getPositionsArray: function (positionSide, rtlSide) {
    switch (positionSide) {
      case 'top':
        return ["".concat(rtlSide, " bottom"), "".concat(rtlSide, " top")];
      case 'left':
        return ['right', 'left'];
      case 'right':
        return ['left', 'right'];
      default:
        return ["".concat(rtlSide, " top"), "".concat(rtlSide, " bottom")];
    }
  },
  _updatePosition: function () {
    const {
      positionSide,
      rtlEnabled,
      offset: componentOffset,
      boundary
    } = this.option();
    const rtlSide = (0, _position.getDefaultAlignment)(rtlEnabled);
    const positions = this._getPositionsArray(positionSide, rtlSide);
    const offset = _extends({}, componentOffset);
    this.$element().addClass("dx-invalid-message-".concat(positionSide));
    if (rtlEnabled && positionSide !== 'left' && positionSide !== 'right') offset.h = -offset.h;
    if (positionSide === 'top') offset.v = -offset.v;
    if (positionSide === 'left') offset.h = -offset.h;
    this.option('position', {
      offset,
      boundary,
      my: positions[0],
      at: positions[1],
      collision: 'none flip'
    });
  },
  _optionChanged(args) {
    const {
      name,
      value,
      previousValue
    } = args;
    switch (name) {
      case 'target':
        this._updatePositionByTarget();
        this.updateMaxWidth();
        this.callBase(args);
        break;
      case 'boundary':
        this.option('position.boundary', value);
        break;
      case 'mode':
        this._toggleModeClass(value);
        break;
      case 'rtlEnabled':
      case 'offset':
      case 'positionSide':
        this.$element().removeClass("dx-invalid-message-".concat(previousValue));
        this._updatePosition();
        break;
      case 'container':
        this._updateContentId();
        this.callBase(args);
        break;
      case 'contentId':
        this._updateContentId();
        break;
      case 'validationErrors':
        this._ensureMessageNotEmpty();
        this._renderInnerHtml(this.$content());
        break;
      default:
        this.callBase(args);
    }
  }
});
(0, _component_registrator.default)('dxValidationMessage', ValidationMessage);
var _default = exports.default = ValidationMessage;
module.exports = exports.default;
module.exports.default = exports.default;
