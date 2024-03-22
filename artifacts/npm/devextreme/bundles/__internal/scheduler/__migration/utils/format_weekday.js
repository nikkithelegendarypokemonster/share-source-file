/**
* DevExtreme (bundles/__internal/scheduler/__migration/utils/format_weekday.js)
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
exports.formatWeekdayAndDay = exports.formatWeekday = void 0;
var _date = _interopRequireDefault(require("../../../../localization/date"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const formatWeekday = date => _date.default.getDayNames('abbreviated')[date.getDay()];
exports.formatWeekday = formatWeekday;
const formatWeekdayAndDay = date => "".concat(formatWeekday(date), " ").concat(_date.default.format(date, 'day'));
exports.formatWeekdayAndDay = formatWeekdayAndDay;
