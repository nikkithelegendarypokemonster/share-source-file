/**
* DevExtreme (cjs/core/utils/console.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.logger = exports.debug = void 0;
var _type = require("./type");
/* global console */
/* eslint no-console: off */

const noop = function () {};
const getConsoleMethod = function (method) {
  if (typeof console === 'undefined' || !(0, _type.isFunction)(console[method])) {
    return noop;
  }
  return console[method].bind(console);
};
const logger = exports.logger = {
  log: getConsoleMethod('log'),
  info: getConsoleMethod('info'),
  warn: getConsoleMethod('warn'),
  error: getConsoleMethod('error')
};
const debug = exports.debug = function () {
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }
  function assertParam(parameter, message) {
    assert(parameter !== null && parameter !== undefined, message);
  }
  return {
    assert: assert,
    assertParam: assertParam
  };
}();
