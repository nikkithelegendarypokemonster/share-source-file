/**
* DevExtreme (cjs/viz/translators/datetime_translator.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _date = _interopRequireDefault(require("../../core/utils/date"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function parse(value) {
  return value !== null ? new Date(value) : value;
}
var _default = exports.default = {
  fromValue: parse,
  toValue: parse,
  _add: _date.default.addDateInterval,
  convert: _date.default.dateToMilliseconds
};
module.exports = exports.default;
module.exports.default = exports.default;
