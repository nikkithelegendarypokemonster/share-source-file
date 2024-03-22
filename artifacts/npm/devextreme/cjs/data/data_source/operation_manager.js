/**
* DevExtreme (cjs/data/data_source/operation_manager.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _utils = require("./utils");
let OperationManager = exports.default = /*#__PURE__*/function () {
  function OperationManager() {
    this._counter = -1;
    this._deferreds = {};
  }
  var _proto = OperationManager.prototype;
  _proto.add = function add(deferred) {
    this._counter++;
    this._deferreds[this._counter] = deferred;
    return this._counter;
  };
  _proto.remove = function remove(operationId) {
    return delete this._deferreds[operationId];
  };
  _proto.cancel = function cancel(operationId) {
    if (operationId in this._deferreds) {
      this._deferreds[operationId].reject(_utils.CANCELED_TOKEN);
      return true;
    }
    return false;
  };
  _proto.cancelAll = function cancelAll() {
    while (this._counter > -1) {
      this.cancel(this._counter);
      this._counter--;
    }
  };
  return OperationManager;
}();
module.exports = exports.default;
module.exports.default = exports.default;
