/**
* DevExtreme (cjs/data/query.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _query_implementation = require("./query_implementation");
const query = function () {
  const impl = Array.isArray(arguments[0]) ? 'array' : 'remote';
  return _query_implementation.queryImpl[impl].apply(this, arguments);
};
var _default = exports.default = query;
module.exports = exports.default;
module.exports.default = exports.default;