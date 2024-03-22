/**
* DevExtreme (cjs/__internal/scheduler/__migration/utils/timeline_week.js)
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
exports.getDateForHeaderText = void 0;
var _base = require("./base");
const getDateForHeaderText = (index, date, _ref) => {
  let {
    startDayHour,
    startViewDate,
    cellCountInDay,
    interval,
    viewOffset
  } = _ref;
  return (0, _base.getValidCellDateForLocalTimeFormat)(date, {
    startViewDate,
    startDayHour,
    cellIndexShift: index % cellCountInDay * interval,
    viewOffset
  });
};
exports.getDateForHeaderText = getDateForHeaderText;
