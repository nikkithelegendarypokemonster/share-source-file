/**
* DevExtreme (cjs/data/query_implementation.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.queryImpl = void 0;
var _array_query = _interopRequireDefault(require("./array_query"));
var _remote_query = _interopRequireDefault(require("./remote_query"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const queryImpl = exports.queryImpl = {
  array: _array_query.default,
  remote: _remote_query.default
};
