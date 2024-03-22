/**
* DevExtreme (esm/__internal/scheduler/__migration/utils/agenda.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { setOptionHour } from './base';
export var calculateStartViewDate = (currentDate, startDayHour) => {
  var validCurrentDate = new Date(currentDate);
  return setOptionHour(validCurrentDate, startDayHour);
};
