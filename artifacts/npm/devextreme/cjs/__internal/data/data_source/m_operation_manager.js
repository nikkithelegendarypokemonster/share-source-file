/**
* DevExtreme (cjs/__internal/data/data_source/m_operation_manager.js)
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
exports.default = void 0;
var _utils = require("../../../data/data_source/utils");
class OperationManager {
  constructor() {
    // @ts-expect-error
    this._counter = -1;
    // @ts-expect-error
    this._deferreds = {};
  }
  add(deferred) {
    // @ts-expect-error
    this._counter++;
    // @ts-expect-error
    this._deferreds[this._counter] = deferred;
    // @ts-expect-error
    return this._counter;
  }
  remove(operationId) {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    return delete this._deferreds[operationId];
  }
  cancel(operationId) {
    // @ts-expect-error
    if (operationId in this._deferreds) {
      // @ts-expect-error
      this._deferreds[operationId].reject(_utils.CANCELED_TOKEN);
      return true;
    }
    return false;
  }
  cancelAll() {
    // @ts-expect-error
    while (this._counter > -1) {
      // @ts-expect-error
      this.cancel(this._counter);
      // @ts-expect-error
      this._counter--;
    }
  }
}
exports.default = OperationManager;
