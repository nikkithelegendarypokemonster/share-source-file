/**
* DevExtreme (esm/__internal/scheduler/__migration/utils/exclude_from_recurrence.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import dateSerialization from '../../../../core/utils/date_serialization';
import { createAppointmentAdapter } from '../../m_appointment_adapter';
var FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';
var UTC_FULL_DATE_FORMAT = "".concat(FULL_DATE_FORMAT, "Z");
var getSerializedDate = (date, startDate, isAllDay) => {
  if (isAllDay) {
    date.setHours(startDate.getHours(), startDate.getMinutes(), startDate.getSeconds(), startDate.getMilliseconds());
  }
  return dateSerialization.serializeDate(date, UTC_FULL_DATE_FORMAT);
};
var createRecurrenceException = (appointmentAdapter, exceptionDate) => {
  var result = [];
  if (appointmentAdapter.recurrenceException) {
    result.push(appointmentAdapter.recurrenceException);
  }
  result.push(getSerializedDate(exceptionDate, appointmentAdapter.startDate, appointmentAdapter.allDay));
  return result.join();
};
export var excludeFromRecurrence = (appointment, exceptionDate, dataAccessors, timeZoneCalculator) => {
  var appointmentAdapter = createAppointmentAdapter(_extends({}, appointment), dataAccessors, timeZoneCalculator);
  appointmentAdapter.recurrenceException = createRecurrenceException(appointmentAdapter, exceptionDate);
  return appointmentAdapter;
};
