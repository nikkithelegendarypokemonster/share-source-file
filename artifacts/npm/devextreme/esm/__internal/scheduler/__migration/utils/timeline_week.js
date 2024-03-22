/**
* DevExtreme (esm/__internal/scheduler/__migration/utils/timeline_week.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { getValidCellDateForLocalTimeFormat } from './base';
export var getDateForHeaderText = (index, date, _ref) => {
  var {
    startDayHour,
    startViewDate,
    cellCountInDay,
    interval,
    viewOffset
  } = _ref;
  return getValidCellDateForLocalTimeFormat(date, {
    startViewDate,
    startDayHour,
    cellIndexShift: index % cellCountInDay * interval,
    viewOffset
  });
};
