/**
* DevExtreme (esm/__internal/scheduler/__migration/timezone_calculator/utils.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import timeZoneUtils from '../../m_utils_time_zone';
import { TimeZoneCalculator } from './calculator';
export var createTimeZoneCalculator = currentTimeZone => new TimeZoneCalculator({
  getClientOffset: date => timeZoneUtils.getClientTimezoneOffset(date),
  tryGetCommonOffset: date => timeZoneUtils.calculateTimezoneByValue(currentTimeZone, date),
  tryGetAppointmentOffset: (date, appointmentTimezone) => timeZoneUtils.calculateTimezoneByValue(appointmentTimezone, date)
});
