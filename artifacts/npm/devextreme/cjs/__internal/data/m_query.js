/**
* DevExtreme (cjs/__internal/data/m_query.js)
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
var _query_implementation = require("../../data/query_implementation");
const query = function () {
  const impl = Array.isArray(arguments[0]) ? 'array' : 'remote';
  // @ts-expect-error
  return _query_implementation.queryImpl[impl].apply(this, arguments);
};
var _default = exports.default = query;
