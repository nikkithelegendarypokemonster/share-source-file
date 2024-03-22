/**
* DevExtreme (renovation/ui/common/utils/date/toMilliseconds.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.toMilliseconds = toMilliseconds;
const timeIntervals = {
  millisecond: 1,
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
  quarter: 1000 * 60 * 60 * 24 * 30 * 3,
  year: 1000 * 60 * 60 * 24 * 365
};
function toMilliseconds(value) {
  return timeIntervals[value];
}
