/**
* DevExtreme (esm/__internal/scheduler/r1/utils/agenda.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { setOptionHour } from './base';
export const calculateStartViewDate = (currentDate, startDayHour) => {
  const validCurrentDate = new Date(currentDate);
  return setOptionHour(validCurrentDate, startDayHour);
};
