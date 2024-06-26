/**
* DevExtreme (cjs/__internal/scheduler/appointments/m_settings_generator.js)
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
exports.DateGeneratorVirtualStrategy = exports.DateGeneratorBaseStrategy = exports.AppointmentSettingsGenerator = void 0;
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _extend = require("../../../core/utils/extend");
var _type = require("../../../core/utils/type");
var _utils = _interopRequireDefault(require("../../../ui/scheduler/utils.timeZone"));
var _date2 = require("../../core/utils/date");
var _index = require("../__migration/utils/index");
var _m_appointment_adapter = require("../m_appointment_adapter");
var _m_expression_utils = require("../m_expression_utils");
var _m_recurrence = require("../m_recurrence");
var _m_utils = require("../resources/m_utils");
var _m_cell_position_calculator = require("./m_cell_position_calculator");
var _m_text_utils = require("./m_text_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* eslint-disable max-classes-per-file */
const toMs = _date.default.dateToMilliseconds;
const APPOINTMENT_DATE_TEXT_FORMAT = 'TIME';
// TODO: Vinogradov types refactoring.
let DateGeneratorBaseStrategy = exports.DateGeneratorBaseStrategy = /*#__PURE__*/function () {
  function DateGeneratorBaseStrategy(options) {
    this.options = options;
  }
  // TODO Vinogradov: Remove these getters.
  var _proto = DateGeneratorBaseStrategy.prototype;
  _proto.getIntervalDuration = function getIntervalDuration() {
    return this.appointmentTakesAllDay ? this.options.allDayIntervalDuration : this.options.intervalDuration;
  };
  _proto.generate = function generate(appointmentAdapter) {
    const {
      isRecurrent
    } = appointmentAdapter;
    const itemGroupIndices = this._getGroupIndices(this.rawAppointment);
    let appointmentList = this._createAppointments(appointmentAdapter, itemGroupIndices);
    appointmentList = this._getProcessedByAppointmentTimeZone(appointmentList, appointmentAdapter); // T983264
    if (this._canProcessNotNativeTimezoneDates(appointmentAdapter)) {
      appointmentList = this._getProcessedNotNativeTimezoneDates(appointmentList, appointmentAdapter);
    }
    let dateSettings = this._createGridAppointmentList(appointmentList, appointmentAdapter);
    const firstViewDates = this._getAppointmentsFirstViewDate(dateSettings);
    dateSettings = this._fillNormalizedStartDate(dateSettings, firstViewDates);
    dateSettings = this._cropAppointmentsByStartDayHour(dateSettings, firstViewDates);
    dateSettings = this._fillNormalizedEndDate(dateSettings, this.rawAppointment);
    if (this._needSeparateLongParts()) {
      dateSettings = this._separateLongParts(dateSettings, appointmentAdapter);
    }
    dateSettings = this.shiftSourceAppointmentDates(dateSettings);
    return {
      dateSettings,
      itemGroupIndices,
      isRecurrent
    };
  };
  _proto.shiftSourceAppointmentDates = function shiftSourceAppointmentDates(dateSettings) {
    const {
      viewOffset
    } = this.options;
    return dateSettings.map(item => _extends(_extends({}, item), {
      source: _extends(_extends({}, item.source), {
        startDate: _date2.dateUtilsTs.addOffsets(item.source.startDate, [viewOffset]),
        endDate: _date2.dateUtilsTs.addOffsets(item.source.endDate, [viewOffset])
      })
    }));
  };
  _proto._getProcessedByAppointmentTimeZone = function _getProcessedByAppointmentTimeZone(appointmentList, appointment) {
    const hasAppointmentTimeZone = !(0, _type.isEmptyObject)(appointment.startDateTimeZone) || !(0, _type.isEmptyObject)(appointment.endDateTimeZone);
    if (hasAppointmentTimeZone) {
      const appointmentOffsets = {
        startDate: this.timeZoneCalculator.getOffsets(appointment.startDate, appointment.startDateTimeZone),
        endDate: this.timeZoneCalculator.getOffsets(appointment.endDate, appointment.endDateTimeZone)
      };
      appointmentList.forEach(a => {
        const sourceOffsets = {
          startDate: this.timeZoneCalculator.getOffsets(a.startDate, appointment.startDateTimeZone),
          endDate: this.timeZoneCalculator.getOffsets(a.endDate, appointment.endDateTimeZone)
        };
        const startDateOffsetDiff = appointmentOffsets.startDate.appointment - sourceOffsets.startDate.appointment;
        const endDateOffsetDiff = appointmentOffsets.endDate.appointment - sourceOffsets.endDate.appointment;
        if (sourceOffsets.startDate.appointment !== sourceOffsets.startDate.common) {
          a.startDate = new Date(a.startDate.getTime() + startDateOffsetDiff * toMs('hour'));
        }
        if (sourceOffsets.endDate.appointment !== sourceOffsets.endDate.common) {
          a.endDate = new Date(a.endDate.getTime() + endDateOffsetDiff * toMs('hour'));
        }
      });
    }
    return appointmentList;
  };
  _proto._createAppointments = function _createAppointments(appointment, groupIndices) {
    let appointments = this._createRecurrenceAppointments(appointment, groupIndices);
    if (!appointment.isRecurrent && appointments.length === 0) {
      appointments.push({
        startDate: appointment.startDate,
        endDate: appointment.endDate
      });
    }
    // T817857
    appointments = appointments.map(item => {
      var _a;
      const resultEndTime = (_a = item.endDate) === null || _a === void 0 ? void 0 : _a.getTime();
      if (item.startDate.getTime() === resultEndTime) {
        item.endDate.setTime(resultEndTime + toMs('minute'));
      }
      return _extends(_extends({}, item), {
        exceptionDate: new Date(item.startDate)
      });
    });
    return appointments;
  };
  _proto._canProcessNotNativeTimezoneDates = function _canProcessNotNativeTimezoneDates(appointment) {
    const isTimeZoneSet = !(0, _type.isEmptyObject)(this.timeZone);
    if (!isTimeZoneSet) {
      return false;
    }
    if (!appointment.isRecurrent) {
      return false;
    }
    return !_utils.default.isEqualLocalTimeZone(this.timeZone, appointment.startDate);
  };
  _proto._getProcessedNotNativeDateIfCrossDST = function _getProcessedNotNativeDateIfCrossDST(date, offset) {
    if (offset < 0) {
      // summer time
      const newDate = new Date(date);
      const newDateMinusOneHour = new Date(newDate);
      newDateMinusOneHour.setHours(newDateMinusOneHour.getHours() - 1);
      const newDateOffset = this.timeZoneCalculator.getOffsets(newDate).common;
      const newDateMinusOneHourOffset = this.timeZoneCalculator.getOffsets(newDateMinusOneHour).common;
      if (newDateOffset !== newDateMinusOneHourOffset) {
        return 0;
      }
    }
    return offset;
  };
  _proto._getCommonOffset = function _getCommonOffset(date) {
    return this.timeZoneCalculator.getOffsets(date).common;
  };
  _proto._getProcessedNotNativeTimezoneDates = function _getProcessedNotNativeTimezoneDates(appointmentList, appointment) {
    return appointmentList.map(item => {
      let diffStartDateOffset = this._getCommonOffset(appointment.startDate) - this._getCommonOffset(item.startDate);
      let diffEndDateOffset = this._getCommonOffset(appointment.endDate) - this._getCommonOffset(item.endDate);
      if (diffStartDateOffset === 0 && diffEndDateOffset === 0) {
        return item;
      }
      diffStartDateOffset = this._getProcessedNotNativeDateIfCrossDST(item.startDate, diffStartDateOffset);
      diffEndDateOffset = this._getProcessedNotNativeDateIfCrossDST(item.endDate, diffEndDateOffset);
      const newStartDate = new Date(item.startDate.getTime() + diffStartDateOffset * toMs('hour'));
      let newEndDate = new Date(item.endDate.getTime() + diffEndDateOffset * toMs('hour'));
      const testNewStartDate = this.timeZoneCalculator.createDate(newStartDate, {
        path: 'toGrid'
      });
      const testNewEndDate = this.timeZoneCalculator.createDate(newEndDate, {
        path: 'toGrid'
      });
      if (appointment.duration > testNewEndDate.getTime() - testNewStartDate.getTime()) {
        newEndDate = new Date(newStartDate.getTime() + appointment.duration);
      }
      return _extends(_extends({}, item), {
        startDate: newStartDate,
        endDate: newEndDate,
        exceptionDate: new Date(newStartDate)
      });
    });
  };
  _proto._needSeparateLongParts = function _needSeparateLongParts() {
    return this.isVerticalOrientation ? this.isGroupedByDate : this.isGroupedByDate && this.appointmentTakesAllDay;
  };
  _proto.normalizeEndDateByViewEnd = function normalizeEndDateByViewEnd(rawAppointment, endDate) {
    let result = new Date(endDate.getTime());
    const isAllDay = (0, _index.isDateAndTimeView)(this.viewType) && this.appointmentTakesAllDay;
    if (!isAllDay) {
      const roundedEndViewDate = _date.default.roundToHour(this.endViewDate);
      if (result > roundedEndViewDate) {
        result = roundedEndViewDate;
      }
    }
    const endDayHour = this.viewEndDayHour;
    const allDay = _m_expression_utils.ExpressionUtils.getField(this.dataAccessors, 'allDay', rawAppointment);
    const currentViewEndTime = new Date(new Date(endDate.getTime()).setHours(endDayHour, 0, 0, 0));
    if (result.getTime() > currentViewEndTime.getTime() || allDay && result.getHours() < endDayHour) {
      result = currentViewEndTime;
    }
    return result;
  };
  _proto._fillNormalizedEndDate = function _fillNormalizedEndDate(dateSettings, rawAppointment) {
    return dateSettings.map(item => _extends(_extends({}, item), {
      normalizedEndDate: this.normalizeEndDateByViewEnd(rawAppointment, item.endDate)
    }));
  };
  _proto._separateLongParts = function _separateLongParts(gridAppointmentList, appointmentAdapter) {
    let result = [];
    gridAppointmentList.forEach(gridAppointment => {
      const maxDate = new Date(this.dateRange[1]);
      const {
        startDate,
        normalizedEndDate: endDateOfPart
      } = gridAppointment;
      const longStartDateParts = _date.default.getDatesOfInterval(startDate, endDateOfPart, {
        milliseconds: this.getIntervalDuration()
      });
      const list = longStartDateParts.filter(startDatePart => new Date(startDatePart) < maxDate).map(date => {
        const endDate = new Date(new Date(date).setMilliseconds(appointmentAdapter.duration));
        const normalizedEndDate = this.normalizeEndDateByViewEnd(this.rawAppointment, endDate);
        return {
          startDate: date,
          endDate,
          normalizedEndDate,
          source: gridAppointment.source
        };
      });
      result = result.concat(list);
    });
    return result;
  };
  _proto._createGridAppointmentList = function _createGridAppointmentList(appointmentList, appointmentAdapter) {
    return appointmentList.map(source => {
      const offsetDifference = appointmentAdapter.startDate.getTimezoneOffset() - source.startDate.getTimezoneOffset();
      if (offsetDifference !== 0 && this._canProcessNotNativeTimezoneDates(appointmentAdapter)) {
        source.startDate = _date2.dateUtilsTs.addOffsets(source.startDate, [offsetDifference * toMs('minute')]);
        source.endDate = _date2.dateUtilsTs.addOffsets(source.endDate, [offsetDifference * toMs('minute')]);
        source.exceptionDate = new Date(source.startDate);
      }
      const duration = source.endDate.getTime() - source.startDate.getTime();
      const startDate = this.timeZoneCalculator.createDate(source.startDate, {
        path: 'toGrid'
      });
      const endDate = _date2.dateUtilsTs.addOffsets(startDate, [duration]);
      return {
        startDate,
        endDate,
        allDay: appointmentAdapter.allDay || false,
        source // TODO
      };
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._createExtremeRecurrenceDates = function _createExtremeRecurrenceDates(groupIndex) {
    let startViewDate = this.appointmentTakesAllDay ? _date.default.trimTime(this.dateRange[0]) : this.dateRange[0];
    let endViewDateByEndDayHour = this.dateRange[1];
    if (this.timeZone) {
      startViewDate = this.timeZoneCalculator.createDate(startViewDate, {
        path: 'fromGrid'
      });
      endViewDateByEndDayHour = this.timeZoneCalculator.createDate(endViewDateByEndDayHour, {
        path: 'fromGrid'
      });
      const daylightOffset = _utils.default.getDaylightOffsetInMs(startViewDate, endViewDateByEndDayHour);
      if (daylightOffset) {
        endViewDateByEndDayHour = new Date(endViewDateByEndDayHour.getTime() + daylightOffset);
      }
    }
    return [startViewDate, endViewDateByEndDayHour];
  };
  _proto._createRecurrenceOptions = function _createRecurrenceOptions(appointment, groupIndex) {
    const {
      viewOffset
    } = this.options;
    // NOTE: For creating a recurrent appointments,
    // we should use original appointment's dates (without view offset).
    const originalAppointmentStartDate = _date2.dateUtilsTs.addOffsets(appointment.startDate, [viewOffset]);
    const originalAppointmentEndDate = _date2.dateUtilsTs.addOffsets(appointment.endDate, [viewOffset]);
    const [minRecurrenceDate, maxRecurrenceDate] = this._createExtremeRecurrenceDates(groupIndex);
    const shiftedMinRecurrenceDate = _date2.dateUtilsTs.addOffsets(minRecurrenceDate, [viewOffset]);
    const shiftedMaxRecurrenceDate = _date2.dateUtilsTs.addOffsets(maxRecurrenceDate, [viewOffset]);
    return {
      rule: appointment.recurrenceRule,
      exception: appointment.recurrenceException,
      min: shiftedMinRecurrenceDate,
      max: shiftedMaxRecurrenceDate,
      firstDayOfWeek: this.firstDayOfWeek,
      start: originalAppointmentStartDate,
      end: originalAppointmentEndDate,
      appointmentTimezoneOffset: this.timeZoneCalculator.getOriginStartDateOffsetInMs(originalAppointmentStartDate, appointment.rawAppointment.startDateTimeZone, true),
      getPostProcessedException: date => {
        if ((0, _type.isEmptyObject)(this.timeZone) || _utils.default.isEqualLocalTimeZone(this.timeZone, date)) {
          return date;
        }
        const appointmentOffset = this.timeZoneCalculator.getOffsets(originalAppointmentStartDate).common;
        const exceptionAppointmentOffset = this.timeZoneCalculator.getOffsets(date).common;
        let diff = appointmentOffset - exceptionAppointmentOffset;
        diff = this._getProcessedNotNativeDateIfCrossDST(date, diff);
        return new Date(date.getTime() - diff * _date.default.dateToMilliseconds('hour'));
      }
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._createRecurrenceAppointments = function _createRecurrenceAppointments(appointment, groupIndices) {
    const {
      duration
    } = appointment;
    const {
      viewOffset
    } = this.options;
    const option = this._createRecurrenceOptions(appointment);
    const generatedStartDates = (0, _m_recurrence.getRecurrenceProcessor)().generateDates(option);
    return generatedStartDates.map(date => {
      const utcDate = _utils.default.createUTCDateWithLocalOffset(date);
      utcDate.setTime(utcDate.getTime() + duration);
      const endDate = _utils.default.createDateFromUTCWithLocalOffset(utcDate);
      return {
        startDate: new Date(date),
        endDate
      };
    })
    // NOTE: For the next calculations,
    // we should shift recurrence appointments by view offset.
    .map(_ref => {
      let {
        startDate,
        endDate
      } = _ref;
      return {
        startDate: _date2.dateUtilsTs.addOffsets(startDate, [-viewOffset]),
        endDate: _date2.dateUtilsTs.addOffsets(endDate, [-viewOffset])
      };
    });
  };
  _proto._getAppointmentsFirstViewDate = function _getAppointmentsFirstViewDate(appointments) {
    const {
      viewOffset
    } = this.options;
    return appointments.map(appointment => {
      const tableFirstDate = this._getAppointmentFirstViewDate(_extends(_extends({}, appointment), {
        startDate: _date2.dateUtilsTs.addOffsets(appointment.startDate, [viewOffset]),
        endDate: _date2.dateUtilsTs.addOffsets(appointment.endDate, [viewOffset])
      }));
      if (!tableFirstDate) {
        return appointment.startDate;
      }
      const firstDate = _date2.dateUtilsTs.addOffsets(tableFirstDate, [-viewOffset]);
      return firstDate > appointment.startDate ? firstDate : appointment.startDate;
    });
  };
  _proto._fillNormalizedStartDate = function _fillNormalizedStartDate(appointments, firstViewDates,
  // TODO Vinogradov: Check this unused argument.
  rawAppointment) {
    return appointments.map((item, idx) => _extends(_extends({}, item), {
      startDate: this._getAppointmentResultDate({
        appointment: item,
        rawAppointment,
        startDate: new Date(item.startDate),
        startDayHour: this.viewStartDayHour,
        firstViewDate: firstViewDates[idx]
      })
    }));
  };
  _proto._cropAppointmentsByStartDayHour = function _cropAppointmentsByStartDayHour(appointments, firstViewDates) {
    return appointments.filter((appointment, idx) => {
      if (!firstViewDates[idx]) {
        return false;
      }
      if (this.appointmentTakesAllDay) {
        return true;
      }
      return appointment.endDate > appointment.startDate;
    });
  };
  _proto._getAppointmentResultDate = function _getAppointmentResultDate(options) {
    const {
      appointment,
      startDayHour,
      firstViewDate
    } = options;
    let {
      startDate
    } = options;
    let resultDate;
    if (this.appointmentTakesAllDay) {
      resultDate = _date.default.normalizeDate(startDate, firstViewDate);
    } else {
      if (startDate < firstViewDate) {
        startDate = firstViewDate;
      }
      resultDate = _date.default.normalizeDate(appointment.startDate, startDate);
    }
    return !this.isDateAppointment ? _date.default.roundDateByStartDayHour(resultDate, startDayHour) : resultDate;
  };
  _proto._getAppointmentFirstViewDate = function _getAppointmentFirstViewDate(appointment) {
    const groupIndex = appointment.source.groupIndex || 0;
    const {
      startDate,
      endDate
    } = appointment;
    if (this.isAllDayRowAppointment || appointment.allDay) {
      return this.viewDataProvider.findAllDayGroupCellStartDate(groupIndex);
    }
    return this.viewDataProvider.findGroupCellStartDate(groupIndex, startDate, endDate, this.isDateAppointment);
  };
  _proto._getGroupIndices = function _getGroupIndices(rawAppointment) {
    let result = [];
    if (rawAppointment && this.loadedResources.length) {
      const tree = (0, _m_utils.createResourcesTree)(this.loadedResources);
      result = (0, _m_utils.getResourceTreeLeaves)((field, action) => (0, _m_utils.getDataAccessors)(this.options.dataAccessors.resources, field, action), tree, rawAppointment);
    }
    return result;
  };
  _createClass(DateGeneratorBaseStrategy, [{
    key: "rawAppointment",
    get: function () {
      return this.options.rawAppointment;
    }
  }, {
    key: "timeZoneCalculator",
    get: function () {
      return this.options.timeZoneCalculator;
    }
  }, {
    key: "viewDataProvider",
    get: function () {
      return this.options.viewDataProvider;
    }
  }, {
    key: "appointmentTakesAllDay",
    get: function () {
      return this.options.appointmentTakesAllDay;
    }
  }, {
    key: "supportAllDayRow",
    get: function () {
      return this.options.supportAllDayRow;
    }
  }, {
    key: "isAllDayRowAppointment",
    get: function () {
      return this.options.isAllDayRowAppointment;
    }
  }, {
    key: "timeZone",
    get: function () {
      return this.options.timeZone;
    }
  }, {
    key: "dateRange",
    get: function () {
      return this.options.dateRange;
    }
  }, {
    key: "firstDayOfWeek",
    get: function () {
      return this.options.firstDayOfWeek;
    }
  }, {
    key: "viewStartDayHour",
    get: function () {
      return this.options.viewStartDayHour;
    }
  }, {
    key: "viewEndDayHour",
    get: function () {
      return this.options.viewEndDayHour;
    }
  }, {
    key: "endViewDate",
    get: function () {
      return this.options.endViewDate;
    }
  }, {
    key: "viewType",
    get: function () {
      return this.options.viewType;
    }
  }, {
    key: "isGroupedByDate",
    get: function () {
      return this.options.isGroupedByDate;
    }
  }, {
    key: "isVerticalOrientation",
    get: function () {
      return this.options.isVerticalGroupOrientation;
    }
  }, {
    key: "dataAccessors",
    get: function () {
      return this.options.dataAccessors;
    }
  }, {
    key: "loadedResources",
    get: function () {
      return this.options.loadedResources;
    }
  }, {
    key: "isDateAppointment",
    get: function () {
      return !(0, _index.isDateAndTimeView)(this.viewType) && this.appointmentTakesAllDay;
    }
  }]);
  return DateGeneratorBaseStrategy;
}();
let DateGeneratorVirtualStrategy = exports.DateGeneratorVirtualStrategy = /*#__PURE__*/function (_DateGeneratorBaseStr) {
  _inheritsLoose(DateGeneratorVirtualStrategy, _DateGeneratorBaseStr);
  function DateGeneratorVirtualStrategy() {
    return _DateGeneratorBaseStr.apply(this, arguments) || this;
  }
  var _proto2 = DateGeneratorVirtualStrategy.prototype;
  _proto2._createRecurrenceAppointments = function _createRecurrenceAppointments(appointment, groupIndices) {
    const {
      duration
    } = appointment;
    const result = [];
    const validGroupIndices = this.groupCount ? groupIndices : [0];
    validGroupIndices.forEach(groupIndex => {
      const option = this._createRecurrenceOptions(appointment, groupIndex);
      const generatedStartDates = (0, _m_recurrence.getRecurrenceProcessor)().generateDates(option);
      const recurrentInfo = generatedStartDates.map(date => {
        const startDate = new Date(date);
        const utcDate = _utils.default.createUTCDateWithLocalOffset(date);
        utcDate.setTime(utcDate.getTime() + duration);
        const endDate = _utils.default.createDateFromUTCWithLocalOffset(utcDate);
        return {
          startDate,
          endDate,
          groupIndex
        };
      });
      result.push(...recurrentInfo);
    });
    return result;
  };
  _proto2._updateGroupIndices = function _updateGroupIndices(appointments, groupIndices) {
    const result = [];
    groupIndices.forEach(groupIndex => {
      const groupStartDate = this.viewDataProvider.getGroupStartDate(groupIndex);
      if (groupStartDate) {
        appointments.forEach(appointment => {
          const appointmentCopy = (0, _extend.extend)({}, appointment);
          appointmentCopy.groupIndex = groupIndex;
          result.push(appointmentCopy);
        });
      }
    });
    return result;
  };
  _proto2._getGroupIndices = function _getGroupIndices(resources) {
    let groupIndices = _DateGeneratorBaseStr.prototype._getGroupIndices.call(this, resources);
    const viewDataGroupIndices = this.viewDataProvider.getGroupIndices();
    if (!(groupIndices === null || groupIndices === void 0 ? void 0 : groupIndices.length)) {
      groupIndices = [0];
    }
    return groupIndices.filter(groupIndex => viewDataGroupIndices.indexOf(groupIndex) !== -1);
  };
  _proto2._createAppointments = function _createAppointments(appointment, groupIndices) {
    const appointments = _DateGeneratorBaseStr.prototype._createAppointments.call(this, appointment, groupIndices);
    return !appointment.isRecurrent ? this._updateGroupIndices(appointments, groupIndices) : appointments;
  };
  _createClass(DateGeneratorVirtualStrategy, [{
    key: "groupCount",
    get: function () {
      return (0, _index.getGroupCount)(this.loadedResources);
    }
  }]);
  return DateGeneratorVirtualStrategy;
}(DateGeneratorBaseStrategy); // TODO rename to AppointmentInfoGenerator or AppointmentViewModel after refactoring geometry calculation strategies
let AppointmentSettingsGenerator = exports.AppointmentSettingsGenerator = /*#__PURE__*/function () {
  function AppointmentSettingsGenerator(options) {
    this.options = options;
    this.appointmentAdapter = (0, _m_appointment_adapter.createAppointmentAdapter)(this.rawAppointment, this.dataAccessors, this.timeZoneCalculator);
  }
  var _proto3 = AppointmentSettingsGenerator.prototype;
  _proto3.create = function create() {
    const {
      dateSettings,
      itemGroupIndices,
      isRecurrent
    } = this._generateDateSettings();
    const cellPositions = this._calculateCellPositions(dateSettings, itemGroupIndices);
    const result = this._prepareAppointmentInfos(dateSettings, cellPositions, isRecurrent);
    return result;
  };
  _proto3._generateDateSettings = function _generateDateSettings() {
    return this.dateSettingsStrategy.generate(this.appointmentAdapter);
  };
  _proto3._calculateCellPositions = function _calculateCellPositions(dateSettings, itemGroupIndices) {
    const cellPositionCalculator = new _m_cell_position_calculator.CellPositionCalculator(_extends(_extends({}, this.options), {
      dateSettings
    }));
    return cellPositionCalculator.calculateCellPositions(itemGroupIndices, this.isAllDayRowAppointment, this.appointmentAdapter.isRecurrent);
  };
  _proto3._prepareAppointmentInfos = function _prepareAppointmentInfos(dateSettings, cellPositions, isRecurrent) {
    const infos = [];
    cellPositions.forEach(_ref2 => {
      let {
        coordinates,
        dateSettingIndex
      } = _ref2;
      const dateSetting = dateSettings[dateSettingIndex];
      const dateText = this._getAppointmentDateText(dateSetting);
      const info = {
        appointment: dateSetting,
        sourceAppointment: dateSetting.source,
        dateText,
        isRecurrent
      };
      infos.push(_extends(_extends({}, coordinates), {
        info
      }));
    });
    return infos;
  };
  _proto3._getAppointmentDateText = function _getAppointmentDateText(sourceAppointment) {
    const {
      startDate,
      endDate,
      allDay
    } = sourceAppointment;
    return (0, _m_text_utils.createFormattedDateText)({
      startDate,
      endDate,
      allDay,
      format: APPOINTMENT_DATE_TEXT_FORMAT
    });
  };
  _createClass(AppointmentSettingsGenerator, [{
    key: "rawAppointment",
    get: function () {
      return this.options.rawAppointment;
    }
  }, {
    key: "dataAccessors",
    get: function () {
      return this.options.dataAccessors;
    }
  }, {
    key: "timeZoneCalculator",
    get: function () {
      return this.options.timeZoneCalculator;
    }
  }, {
    key: "isAllDayRowAppointment",
    get: function () {
      return this.options.appointmentTakesAllDay && this.options.supportAllDayRow;
    }
  }, {
    key: "groups",
    get: function () {
      return this.options.groups;
    }
  }, {
    key: "dateSettingsStrategy",
    get: function () {
      const options = _extends(_extends({}, this.options), {
        isAllDayRowAppointment: this.isAllDayRowAppointment
      });
      return this.options.isVirtualScrolling ? new DateGeneratorVirtualStrategy(options) : new DateGeneratorBaseStrategy(options);
    }
  }]);
  return AppointmentSettingsGenerator;
}();
