/**
* DevExtreme (cjs/__internal/core/r1/utils/get_computed_style.js)
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
exports.default = getElementComputedStyle;
var _window = require("../../../../core/utils/window");
function getElementComputedStyle(el) {
  var _window$getComputedSt;
  const window = (0, _window.getWindow)();
  return el ? (_window$getComputedSt = window.getComputedStyle) === null || _window$getComputedSt === void 0 ? void 0 : _window$getComputedSt.call(window, el) : null;
}
