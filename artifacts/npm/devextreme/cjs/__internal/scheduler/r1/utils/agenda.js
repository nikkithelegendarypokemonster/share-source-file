/**
* DevExtreme (cjs/__internal/scheduler/r1/utils/agenda.js)
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
exports.calculateStartViewDate = void 0;
var _base = require("./base");
const calculateStartViewDate = (currentDate, startDayHour) => {
  const validCurrentDate = new Date(currentDate);
  return (0, _base.setOptionHour)(validCurrentDate, startDayHour);
};
exports.calculateStartViewDate = calculateStartViewDate;
