"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorDefaultProps = void 0;
var _base_widget_props = require("./base_widget_props");
var _widget_props = require("./widget_props");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const EditorDefaultProps = exports.EditorDefaultProps = _extends({}, _base_widget_props.BaseWidgetDefaultProps, {
  aria: _widget_props.WidgetDefaultProps.aria,
  classes: _widget_props.WidgetDefaultProps.classes,
  readOnly: false,
  name: '',
  value: null,
  validationError: null,
  validationErrors: null,
  validationMessageMode: 'auto',
  validationMessagePosition: 'bottom',
  validationStatus: 'valid',
  isValid: true,
  isDirty: false,
  inputAttr: {}
});