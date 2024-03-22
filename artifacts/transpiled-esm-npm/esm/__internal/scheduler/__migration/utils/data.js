import { isDefined } from '../../../../core/utils/type';
import { replaceWrongEndDate } from '../../appointments/data_provider/m_utils';
import { createAppointmentAdapter } from '../../m_appointment_adapter';
var RECURRENCE_FREQ = 'freq';
export var getPreparedDataItems = (dataItems, dataAccessors, cellDurationInMinutes, timeZoneCalculator) => {
  var result = [];
  dataItems === null || dataItems === void 0 ? void 0 : dataItems.forEach(rawAppointment => {
    var _a;
    var startDate = new Date(dataAccessors.getter.startDate(rawAppointment));
    var endDate = new Date(dataAccessors.getter.endDate(rawAppointment));
    replaceWrongEndDate(rawAppointment, startDate, endDate, cellDurationInMinutes, dataAccessors);
    var adapter = createAppointmentAdapter(rawAppointment, dataAccessors, timeZoneCalculator);
    var comparableStartDate = adapter.startDate && adapter.calculateStartDate('toGrid');
    var comparableEndDate = adapter.endDate && adapter.calculateEndDate('toGrid');
    var regex = new RegExp(RECURRENCE_FREQ, 'gi');
    var recurrenceRule = adapter.recurrenceRule;
    var hasRecurrenceRule = !!((_a = recurrenceRule === null || recurrenceRule === void 0 ? void 0 : recurrenceRule.match(regex)) === null || _a === void 0 ? void 0 : _a.length);
    var visible = isDefined(rawAppointment.visible) ? !!rawAppointment.visible : true;
    if (comparableStartDate && comparableEndDate) {
      result.push({
        allDay: !!adapter.allDay,
        startDate: comparableStartDate,
        startDateTimeZone: rawAppointment.startDateTimeZone,
        endDate: comparableEndDate,
        endDateTimeZone: rawAppointment.endDateTimeZone,
        recurrenceRule: adapter.recurrenceRule,
        recurrenceException: adapter.recurrenceException,
        hasRecurrenceRule,
        visible,
        rawAppointment
      });
    }
  });
  return result;
};
export var resolveDataItems = options => Array.isArray(options) ? options : options.data;