/**
* DevExtreme (bundles/__internal/scheduler/appointments/data_provider/m_appointment_filter.js)
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
exports.AppointmentFilterVirtualStrategy = exports.AppointmentFilterBaseStrategy = void 0;
var _array = require("../../../../core/utils/array");
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _query = _interopRequireDefault(require("../../../../data/query"));
var _date2 = require("../../../core/utils/date");
var _index = require("../../../scheduler/__migration/utils/index");
var _index2 = require("../../__migration/utils/index");
var _m_appointment_adapter = require("../../m_appointment_adapter");
var _m_recurrence = require("../../m_recurrence");
var _m_utils = require("../../resources/m_utils");
var _m_utils2 = require("./m_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* eslint-disable max-classes-per-file */
// TODO Vinogradov refactoring: this module should be refactored :)
const toMs = _date.default.dateToMilliseconds;
const FilterStrategies = {
  virtual: 'virtual',
  standard: 'standard'
};
let AppointmentFilterBaseStrategy = exports.AppointmentFilterBaseStrategy = /*#__PURE__*/function () {
  function AppointmentFilterBaseStrategy(options) {
    this.options = options;
    this.dataAccessors = this.options.dataAccessors;
    this._init();
  }
  var _proto = AppointmentFilterBaseStrategy.prototype;
  _proto._resolveOption = function _resolveOption(name) {
    const result = this.options[name];
    return typeof result === 'function' ? result() : result;
  };
  _proto._init = function _init() {
    this.setDataAccessors(this.dataAccessors);
  };
  _proto.filter = function filter(preparedItems) {
    const [min, max] = this.dateRange;
    const {
      viewOffset
    } = this.options;
    const allDay = !this.showAllDayPanel && this.supportAllDayRow ? false : undefined;
    return this.filterLoadedAppointments({
      startDayHour: this.viewStartDayHour,
      endDayHour: this.viewEndDayHour,
      viewOffset,
      viewStartDayHour: this.viewStartDayHour,
      viewEndDayHour: this.viewEndDayHour,
      min,
      max,
      resources: this.loadedResources,
      allDay,
      supportMultiDayAppointments: (0, _index.isTimelineView)(this.viewType),
      firstDayOfWeek: this.firstDayOfWeek
    }, preparedItems);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.hasAllDayAppointments = function hasAllDayAppointments(filteredItems, preparedItems) {
    const adapters = filteredItems.map(item => (0, _m_appointment_adapter.createAppointmentAdapter)(item, this.dataAccessors, this.timeZoneCalculator));
    let result = false;
    // @ts-expect-error
    (0, _iterator.each)(adapters, (_, item) => {
      if ((0, _index2.getAppointmentTakesAllDay)(item, this.allDayPanelMode)) {
        result = true;
        return false;
      }
    });
    return result;
  };
  _proto.setDataAccessors = function setDataAccessors(dataAccessors) {
    this.dataAccessors = dataAccessors;
  };
  _proto._createAllDayAppointmentFilter = function _createAllDayAppointmentFilter() {
    return [[appointment => (0, _index2.getAppointmentTakesAllDay)(appointment, this.allDayPanelMode)]];
  };
  _proto._createCombinedFilter = function _createCombinedFilter(filterOptions) {
    const min = new Date(filterOptions.min);
    const max = new Date(filterOptions.max);
    const {
      startDayHour,
      endDayHour,
      viewOffset,
      viewStartDayHour,
      viewEndDayHour,
      resources,
      firstDayOfWeek,
      checkIntersectViewport,
      supportMultiDayAppointments
    } = filterOptions;
    const [trimMin, trimMax] = (0, _index2.getDatesWithoutTime)(min, max);
    const useRecurrence = (0, _type.isDefined)(this.dataAccessors.getter.recurrenceRule);
    return [[appointment => {
      var _a;
      const appointmentVisible = (_a = appointment.visible) !== null && _a !== void 0 ? _a : true;
      if (!appointmentVisible) {
        return false;
      }
      const {
        allDay: isAllDay,
        hasRecurrenceRule
      } = appointment;
      const startDate = _date2.dateUtilsTs.addOffsets(appointment.startDate, [-viewOffset]);
      const endDate = _date2.dateUtilsTs.addOffsets(appointment.endDate, [-viewOffset]);
      const appointmentTakesAllDay = (0, _index2.getAppointmentTakesAllDay)(appointment, this.allDayPanelMode);
      if (!hasRecurrenceRule) {
        if (!(endDate >= trimMin && startDate < trimMax || _date.default.sameDate(endDate, trimMin) && _date.default.sameDate(startDate, trimMin))) {
          return false;
        }
      }
      const appointmentTakesSeveralDays = (0, _m_utils2.getAppointmentTakesSeveralDays)(appointment);
      const isLongAppointment = appointmentTakesSeveralDays || appointmentTakesAllDay;
      if ((resources === null || resources === void 0 ? void 0 : resources.length) && !this._filterAppointmentByResources(appointment.rawAppointment, resources)) {
        return false;
      }
      if (appointmentTakesAllDay && filterOptions.allDay === false) {
        return false;
      }
      if (hasRecurrenceRule) {
        const recurrenceException = (0, _m_utils2.getRecurrenceException)(appointment, this.timeZoneCalculator, this.timezone);
        if (!this._filterAppointmentByRRule(_extends(_extends({}, appointment), {
          recurrenceException,
          allDay: appointmentTakesAllDay
        }), min, max, startDayHour, endDayHour, firstDayOfWeek)) {
          return false;
        }
      }
      if (!isAllDay && supportMultiDayAppointments && isLongAppointment) {
        if (endDate < min && (!useRecurrence || useRecurrence && !hasRecurrenceRule)) {
          return false;
        }
      }
      if (!isAllDay && (0, _type.isDefined)(startDayHour) && (!useRecurrence || !filterOptions.isVirtualScrolling)) {
        if (!(0, _m_utils2.compareDateWithStartDayHour)(startDate, endDate, startDayHour, appointmentTakesAllDay, appointmentTakesSeveralDays)) {
          return false;
        }
      }
      if (!isAllDay && (0, _type.isDefined)(endDayHour)) {
        if (!(0, _m_utils2.compareDateWithEndDayHour)({
          startDate,
          endDate,
          startDayHour,
          endDayHour,
          viewOffset,
          viewStartDayHour,
          viewEndDayHour,
          allDay: appointmentTakesAllDay,
          severalDays: appointmentTakesSeveralDays,
          min,
          max,
          checkIntersectViewport
        })) {
          return false;
        }
      }
      if (!isAllDay && (!isLongAppointment || supportMultiDayAppointments)) {
        if (endDate < min && useRecurrence && !hasRecurrenceRule) {
          return false;
        }
      }
      return true;
    }]];
  }
  // TODO get rid of wrapper
  ;
  _proto._createAppointmentFilter = function _createAppointmentFilter(filterOptions) {
    return this._createCombinedFilter(filterOptions);
  };
  _proto._filterAppointmentByResources = function _filterAppointmentByResources(appointment, resources) {
    const checkAppointmentResourceValues = (resourceName, resourceIndex) => {
      const resourceGetter = this.dataAccessors.resources.getter[resourceName];
      let resource;
      if ((0, _type.isFunction)(resourceGetter)) {
        resource = resourceGetter(appointment);
      }
      const appointmentResourceValues = (0, _array.wrapToArray)(resource);
      const resourceData = (0, _iterator.map)(resources[resourceIndex].items, _ref => {
        let {
          id
        } = _ref;
        return id;
      });
      for (let i = 0; i < appointmentResourceValues.length; i++) {
        if ((0, _index2.hasResourceValue)(resourceData, appointmentResourceValues[i])) {
          return true;
        }
      }
      return false;
    };
    let result = false;
    for (let i = 0; i < resources.length; i++) {
      const resourceName = resources[i].name;
      result = checkAppointmentResourceValues(resourceName, i);
      if (!result) {
        return false;
      }
    }
    return result;
  };
  _proto._filterAppointmentByRRule = function _filterAppointmentByRRule(appointment, min, max, startDayHour, endDayHour, firstDayOfWeek) {
    const {
      recurrenceRule
    } = appointment;
    const {
      recurrenceException
    } = appointment;
    const {
      allDay
    } = appointment;
    let result = true;
    const appointmentStartDate = appointment.startDate;
    const appointmentEndDate = appointment.endDate;
    const recurrenceProcessor = (0, _m_recurrence.getRecurrenceProcessor)();
    if (allDay || (0, _m_utils2._appointmentPartInInterval)(appointmentStartDate, appointmentEndDate, startDayHour, endDayHour)) {
      const [trimMin, trimMax] = (0, _index2.getDatesWithoutTime)(min, max);
      min = trimMin;
      max = new Date(trimMax.getTime() - toMs('minute'));
    }
    if (recurrenceRule && !recurrenceProcessor.isValidRecurrenceRule(recurrenceRule)) {
      result = appointmentEndDate > min && appointmentStartDate <= max;
    }
    if (result && recurrenceProcessor.isValidRecurrenceRule(recurrenceRule)) {
      const {
        viewOffset
      } = this.options;
      result = recurrenceProcessor.hasRecurrence({
        rule: recurrenceRule,
        exception: recurrenceException,
        start: appointmentStartDate,
        end: appointmentEndDate,
        min: _date2.dateUtilsTs.addOffsets(min, [viewOffset]),
        max: _date2.dateUtilsTs.addOffsets(max, [viewOffset]),
        firstDayOfWeek,
        appointmentTimezoneOffset: this.timeZoneCalculator.getOriginStartDateOffsetInMs(appointmentStartDate, appointment.startDateTimeZone, false)
      });
    }
    return result;
  };
  _proto.filterLoadedAppointments = function filterLoadedAppointments(filterOptions, preparedItems) {
    const filteredItems = this.filterPreparedItems(filterOptions, preparedItems);
    return filteredItems.map(_ref2 => {
      let {
        rawAppointment
      } = _ref2;
      return rawAppointment;
    });
  };
  _proto.filterPreparedItems = function filterPreparedItems(filterOptions, preparedItems) {
    const combinedFilter = this._createAppointmentFilter(filterOptions);
    return (0, _query.default)(preparedItems).filter(combinedFilter).toArray();
  };
  _proto.filterAllDayAppointments = function filterAllDayAppointments(preparedItems) {
    const combinedFilter = this._createAllDayAppointmentFilter();
    return (0, _query.default)(preparedItems).filter(combinedFilter).toArray().map(_ref3 => {
      let {
        rawAppointment
      } = _ref3;
      return rawAppointment;
    });
  };
  _createClass(AppointmentFilterBaseStrategy, [{
    key: "strategyName",
    get: function () {
      return FilterStrategies.standard;
    }
  }, {
    key: "timeZoneCalculator",
    get: function () {
      return this.options.timeZoneCalculator;
    }
  }, {
    key: "viewStartDayHour",
    get: function () {
      return this.options.startDayHour;
    }
  }, {
    key: "viewEndDayHour",
    get: function () {
      return this.options.endDayHour;
    }
  }, {
    key: "timezone",
    get: function () {
      return this.options.timezone;
    }
  }, {
    key: "firstDayOfWeek",
    get: function () {
      return this.options.firstDayOfWeek;
    }
  }, {
    key: "showAllDayPanel",
    get: function () {
      return this.options.showAllDayPanel;
    }
  }, {
    key: "loadedResources",
    get: function () {
      return this._resolveOption('loadedResources');
    }
  }, {
    key: "supportAllDayRow",
    get: function () {
      return this._resolveOption('supportAllDayRow');
    }
  }, {
    key: "viewType",
    get: function () {
      return this._resolveOption('viewType');
    }
  }, {
    key: "viewDirection",
    get: function () {
      return this._resolveOption('viewDirection');
    }
  }, {
    key: "dateRange",
    get: function () {
      return this._resolveOption('dateRange');
    }
  }, {
    key: "groupCount",
    get: function () {
      return this._resolveOption('groupCount');
    }
  }, {
    key: "viewDataProvider",
    get: function () {
      return this._resolveOption('viewDataProvider');
    }
  }, {
    key: "allDayPanelMode",
    get: function () {
      return this._resolveOption('allDayPanelMode');
    }
  }]);
  return AppointmentFilterBaseStrategy;
}();
let AppointmentFilterVirtualStrategy = exports.AppointmentFilterVirtualStrategy = /*#__PURE__*/function (_AppointmentFilterBas) {
  _inheritsLoose(AppointmentFilterVirtualStrategy, _AppointmentFilterBas);
  function AppointmentFilterVirtualStrategy() {
    return _AppointmentFilterBas.apply(this, arguments) || this;
  }
  var _proto2 = AppointmentFilterVirtualStrategy.prototype;
  _proto2.filter = function filter(preparedItems) {
    const {
      viewOffset
    } = this.options;
    const hourMs = toMs('hour');
    const isCalculateStartAndEndDayHour = (0, _index2.isDateAndTimeView)(this.viewType);
    const checkIntersectViewport = isCalculateStartAndEndDayHour && this.viewDirection === 'horizontal';
    const isAllDayWorkspace = !this.supportAllDayRow;
    const showAllDayAppointments = this.showAllDayPanel || isAllDayWorkspace;
    const endViewDate = this.viewDataProvider.getLastViewDateByEndDayHour(this.viewEndDayHour);
    const shiftedEndViewDate = _date2.dateUtilsTs.addOffsets(endViewDate, [viewOffset]);
    const filterOptions = [];
    const groupsInfo = this.viewDataProvider.getCompletedGroupsInfo();
    groupsInfo.forEach(item => {
      const {
        groupIndex
      } = item;
      const groupStartDate = item.startDate;
      const groupEndDate = new Date(Math.min(item.endDate.getTime(), shiftedEndViewDate.getTime()));
      const startDayHour = isCalculateStartAndEndDayHour ? groupStartDate.getHours() : this.viewStartDayHour;
      const endDayHour = isCalculateStartAndEndDayHour ? startDayHour + groupStartDate.getMinutes() / 60 + (groupEndDate.getTime() - groupStartDate.getTime()) / hourMs : this.viewEndDayHour;
      const resources = this._getPrerenderFilterResources(groupIndex);
      const hasAllDayPanel = this.viewDataProvider.hasGroupAllDayPanel(groupIndex);
      const supportAllDayAppointment = isAllDayWorkspace || !!showAllDayAppointments && hasAllDayPanel;
      filterOptions.push({
        isVirtualScrolling: true,
        startDayHour,
        endDayHour,
        viewOffset,
        viewStartDayHour: this.viewStartDayHour,
        viewEndDayHour: this.viewEndDayHour,
        min: _date2.dateUtilsTs.addOffsets(groupStartDate, [-viewOffset]),
        max: _date2.dateUtilsTs.addOffsets(groupEndDate, [-viewOffset]),
        supportMultiDayAppointments: (0, _index.isTimelineView)(this.viewType),
        allDay: supportAllDayAppointment,
        resources,
        firstDayOfWeek: this.firstDayOfWeek,
        checkIntersectViewport
      });
    });
    return this.filterLoadedAppointments({
      filterOptions,
      groupCount: this.groupCount
    }, preparedItems);
  };
  _proto2.filterPreparedItems = function filterPreparedItems(_ref4, preparedItems) {
    let {
      filterOptions,
      groupCount
    } = _ref4;
    const combinedFilters = [];
    let itemsToFilter = preparedItems;
    const needPreFilter = groupCount > 0;
    if (needPreFilter) {
      // @ts-expect-error
      itemsToFilter = itemsToFilter.filter(_ref5 => {
        let {
          rawAppointment
        } = _ref5;
        for (let i = 0; i < filterOptions.length; ++i) {
          const {
            resources
          } = filterOptions[i];
          if (this._filterAppointmentByResources(rawAppointment, resources)) {
            return true;
          }
        }
      });
    }
    filterOptions.forEach(option => {
      combinedFilters.length && combinedFilters.push('or');
      const filter = this._createAppointmentFilter(option);
      combinedFilters.push(filter);
    });
    return (0, _query.default)(itemsToFilter).filter(combinedFilters).toArray();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto2.hasAllDayAppointments = function hasAllDayAppointments(filteredItems, preparedItems) {
    return this.filterAllDayAppointments(preparedItems).length > 0;
  };
  _proto2._getPrerenderFilterResources = function _getPrerenderFilterResources(groupIndex) {
    const cellGroup = this.viewDataProvider.getCellsGroup(groupIndex);
    return (0, _m_utils.getResourcesDataByGroups)(this.loadedResources, this.resources, [cellGroup]);
  };
  _createClass(AppointmentFilterVirtualStrategy, [{
    key: "strategyName",
    get: function () {
      return FilterStrategies.virtual;
    }
  }, {
    key: "resources",
    get: function () {
      return this.options.resources;
    }
  }]);
  return AppointmentFilterVirtualStrategy;
}(AppointmentFilterBaseStrategy);
