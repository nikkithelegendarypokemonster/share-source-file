/**
* DevExtreme (cjs/__internal/scheduler/__migration/semaphore/index.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Semaphore = void 0;
let Semaphore = exports.Semaphore = /*#__PURE__*/function () {
  function Semaphore() {
    this.counter = 0;
  }
  var _proto = Semaphore.prototype;
  _proto.isFree = function isFree() {
    return this.counter === 0;
  };
  _proto.take = function take() {
    this.counter += 1;
  };
  _proto.release = function release() {
    this.counter -= 1;
    if (this.counter < 0) {
      this.counter = 0;
    }
  };
  return Semaphore;
}();
