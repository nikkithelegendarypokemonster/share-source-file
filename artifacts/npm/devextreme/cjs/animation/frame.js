/**
* DevExtreme (cjs/animation/frame.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.cancelAnimationFrame = cancelAnimationFrame;
exports.requestAnimationFrame = requestAnimationFrame;
var _window = require("../core/utils/window");
var _call_once = _interopRequireDefault(require("../core/utils/call_once"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.hasWindow)() ? (0, _window.getWindow)() : {};
const FRAME_ANIMATION_STEP_TIME = 1000 / 60;
let request = function (callback) {
  return setTimeout(callback, FRAME_ANIMATION_STEP_TIME);
};
let cancel = function (requestID) {
  clearTimeout(requestID);
};
const setAnimationFrameMethods = (0, _call_once.default)(function () {
  const nativeRequest = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
  const nativeCancel = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
  if (nativeRequest && nativeCancel) {
    request = nativeRequest;
    cancel = nativeCancel;
  }
});
function requestAnimationFrame() {
  setAnimationFrameMethods();
  return request.apply(window, arguments);
}
function cancelAnimationFrame() {
  setAnimationFrameMethods();
  cancel.apply(window, arguments);
}