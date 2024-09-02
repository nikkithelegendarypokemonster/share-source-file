/**
* DevExtreme (esm/core/utils/console.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* global console */
/* eslint no-console: off */

import { isFunction } from './type';
const noop = function () {};
const getConsoleMethod = function (method) {
  if (typeof console === 'undefined' || !isFunction(console[method])) {
    return noop;
  }
  return console[method].bind(console);
};
export const logger = {
  log: getConsoleMethod('log'),
  info: getConsoleMethod('info'),
  warn: getConsoleMethod('warn'),
  error: getConsoleMethod('error')
};
export const debug = function () {
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
