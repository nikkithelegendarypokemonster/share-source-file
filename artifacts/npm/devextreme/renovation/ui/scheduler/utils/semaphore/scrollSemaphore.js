/**
* DevExtreme (renovation/ui/scheduler/utils/semaphore/scrollSemaphore.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.ScrollSemaphore = void 0;
var _index = require("../../../../../__internal/scheduler/__migration/semaphore/index");
let ScrollSemaphore = exports.ScrollSemaphore = /*#__PURE__*/function () {
  function ScrollSemaphore() {
    this.semaphore = new _index.Semaphore();
    this.position = {
      left: -1,
      top: -1
    };
  }
  var _proto = ScrollSemaphore.prototype;
  _proto.isFree = function isFree(position) {
    if (this.isInitialPosition()) {
      this.setPosition(position);
      return this.semaphore.isFree();
    }
    return this.semaphore.isFree() && !this.comparePosition(position);
  };
  _proto.take = function take(position) {
    this.semaphore.take();
    this.setPosition(position);
  };
  _proto.release = function release() {
    this.semaphore.release();
  };
  _proto.setPosition = function setPosition(source) {
    var _source$left, _source$top;
    this.position.left = (_source$left = source.left) !== null && _source$left !== void 0 ? _source$left : -1;
    this.position.top = (_source$top = source.top) !== null && _source$top !== void 0 ? _source$top : -1;
  };
  _proto.isInitialPosition = function isInitialPosition() {
    return this.position.left === -1 && this.position.top === -1;
  };
  _proto.comparePosition = function comparePosition(target) {
    var _target$left, _target$top;
    const left = (_target$left = target.left) !== null && _target$left !== void 0 ? _target$left : -1;
    const top = (_target$top = target.top) !== null && _target$top !== void 0 ? _target$top : -1;
    return this.position.left === left && this.position.top === top;
  };
  return ScrollSemaphore;
}();
