/**
* DevExtreme (cjs/__internal/scheduler/__migration/utils/day.js)
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
exports.calculateStartViewDate = void 0;
var _base = require("./base");
const calculateStartViewDate = (currentDate, startDayHour, startDate, intervalDuration) => {
  const firstViewDate = (0, _base.getViewStartByOptions)(startDate, currentDate, intervalDuration, startDate);
  return (0, _base.setOptionHour)(firstViewDate, startDayHour);
};
exports.calculateStartViewDate = calculateStartViewDate;
