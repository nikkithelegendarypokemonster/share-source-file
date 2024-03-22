/**
* DevExtreme (esm/core/utils/console.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* global console */
/* eslint no-console: off */

import { isFunction } from './type';
var noop = function noop() {};
var getConsoleMethod = function getConsoleMethod(method) {
  if (typeof console === 'undefined' || !isFunction(console[method])) {
    return noop;
  }
  return console[method].bind(console);
};
export var logger = {
  log: getConsoleMethod('log'),
  info: getConsoleMethod('info'),
  warn: getConsoleMethod('warn'),
  error: getConsoleMethod('error')
};
export var debug = function () {
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
