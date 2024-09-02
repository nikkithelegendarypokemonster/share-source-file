/**
* DevExtreme (esm/__internal/scheduler/r1/utils/timeline_week.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { getValidCellDateForLocalTimeFormat } from './base';
export const getDateForHeaderText = (index, date, _ref) => {
  let {
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
