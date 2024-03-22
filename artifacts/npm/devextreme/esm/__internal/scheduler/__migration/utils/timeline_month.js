/**
* DevExtreme (esm/__internal/scheduler/__migration/utils/timeline_month.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import dateUtils from '../../../../core/utils/date';
import { setOptionHour } from './base';
import { getViewStartByOptions } from './month';
export var calculateStartViewDate = (currentDate, startDayHour, startDate, intervalCount) => {
  var firstViewDate = dateUtils.getFirstMonthDate(getViewStartByOptions(startDate, currentDate, intervalCount, dateUtils.getFirstMonthDate(startDate)));
  return setOptionHour(firstViewDate, startDayHour);
};
