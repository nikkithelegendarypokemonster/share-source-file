"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WidgetDefaultProps = void 0;
var _base_props = require("../../base_props");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DEFAULT_FEEDBACK_HIDE_TIMEOUT = 400;
const DEFAULT_FEEDBACK_SHOW_TIMEOUT = 30;
const WidgetDefaultProps = exports.WidgetDefaultProps = _extends({}, _base_props.BaseWidgetDefaultProps, {
  _feedbackHideTimeout: DEFAULT_FEEDBACK_HIDE_TIMEOUT,
  _feedbackShowTimeout: DEFAULT_FEEDBACK_SHOW_TIMEOUT,
  cssText: '',
  aria: {},
  classes: '',
  name: '',
  addWidgetClass: true
});