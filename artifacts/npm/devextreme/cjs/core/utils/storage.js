/**
* DevExtreme (cjs/core/utils/storage.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.sessionStorage = void 0;
var _window = require("../../core/utils/window");
const window = (0, _window.getWindow)();
const getSessionStorage = function () {
  let sessionStorage;
  try {
    sessionStorage = window.sessionStorage;
  } catch (e) {}
  return sessionStorage;
};
exports.sessionStorage = getSessionStorage;
