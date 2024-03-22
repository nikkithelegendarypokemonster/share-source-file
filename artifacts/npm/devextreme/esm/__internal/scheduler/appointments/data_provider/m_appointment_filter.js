/**
* DevExtreme (esm/__internal/scheduler/appointments/data_provider/m_appointment_filter.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
/* eslint-disable max-classes-per-file */
import { wrapToArray } from '../../../../core/utils/array';
import dateUtils from '../../../../core/utils/date';
import { each, map } from '../../../../core/utils/iterator';
import { isDefined, isFunction } from '../../../../core/utils/type';
import query from '../../../../data/query';
import { dateUtilsTs } from '../../../core/utils/date';
import { isTimelineView } from '../../../scheduler/__migration/utils/index';
import { getAppointmentTakesAllDay, getDatesWithoutTime, hasResourceValue, isDateAndTimeView } from '../../__migration/utils/index';
import { createAppointmentAdapter } from '../../m_appointment_adapter';
import { getRecurrenceProcessor } from '../../m_recurrence';
import { getResourcesDataByGroups } from '../../resources/m_utils';
import { _appointmentPartInInterval, compareDateWithEndDayHour, compareDateWithStartDayHour, getAppointmentTakesSeveralDays, getRecurrenceException } from './m_utils';
// TODO Vinogradov refactoring: this module should be refactored :)
var toMs = dateUtils.dateToMilliseconds;
var FilterStrategies = {
  virtual: 'virtual',
  standard: 'standard'
};
export class AppointmentFilterBaseStrategy {
  constructor(options) {
    this.options = options;
    this.dataAccessors = this.options.dataAccessors;
    this._init();
  }
  get strategyName() {
    return FilterStrategies.standard;
  }
  get timeZoneCalculator() {
    return this.options.timeZoneCalculator;
  }
  get viewStartDayHour() {
    return this.options.startDayHour;
  }
  get viewEndDayHour() {
    return this.options.endDayHour;
  }
  get timezone() {
    return this.options.timezone;
  }
  get firstDayOfWeek() {
    return this.options.firstDayOfWeek;
  }
  get showAllDayPanel() {
    return this.options.showAllDayPanel;
  }
  get loadedResources() {
    return this._resolveOption('loadedResources');
  }
  get supportAllDayRow() {
    return this._resolveOption('supportAllDayRow');
  }
  get viewType() {
    return this._resolveOption('viewType');
  }
  get viewDirection() {
    return this._resolveOption('viewDirection');
  }
  get dateRange() {
    return this._resolveOption('dateRange');
  }
  get groupCount() {
    return this._resolveOption('groupCount');
  }
  get viewDataProvider() {
    return this._resolveOption('viewDataProvider');
  }
  get allDayPanelMode() {
    return this._resolveOption('allDayPanelMode');
  }
  _resolveOption(name) {
    var result = this.options[name];
    return typeof result === 'function' ? result() : result;
  }
  _init() {
    this.setDataAccessors(this.dataAccessors);
  }
  filter(preparedItems) {
    var [min, max] = this.dateRange;
    var {
      viewOffset
    } = this.options;
    var allDay = !this.showAllDayPanel && this.supportAllDayRow ? false : undefined;
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
      supportMultiDayAppointments: isTimelineView(this.viewType),
      firstDayOfWeek: this.firstDayOfWeek
    }, preparedItems);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasAllDayAppointments(filteredItems, preparedItems) {
    var adapters = filteredItems.map(item => createAppointmentAdapter(item, this.dataAccessors, this.timeZoneCalculator));
    var result = false;
    // @ts-expect-error
    each(adapters, (_, item) => {
      if (getAppointmentTakesAllDay(item, this.allDayPanelMode)) {
        result = true;
        return false;
      }
    });
    return result;
  }
  setDataAccessors(dataAccessors) {
    this.dataAccessors = dataAccessors;
  }
  _createAllDayAppointmentFilter() {
    return [[appointment => getAppointmentTakesAllDay(appointment, this.allDayPanelMode)]];
  }
  _createCombinedFilter(filterOptions) {
    var min = new Date(filterOptions.min);
    var max = new Date(filterOptions.max);
    var {
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
    var [trimMin, trimMax] = getDatesWithoutTime(min, max);
    var useRecurrence = isDefined(this.dataAccessors.getter.recurrenceRule);
    return [[appointment => {
      var _a;
      var appointmentVisible = (_a = appointment.visible) !== null && _a !== void 0 ? _a : true;
      if (!appointmentVisible) {
        return false;
      }
      var {
        allDay: isAllDay,
        hasRecurrenceRule
      } = appointment;
      var startDate = dateUtilsTs.addOffsets(appointment.startDate, [-viewOffset]);
      var endDate = dateUtilsTs.addOffsets(appointment.endDate, [-viewOffset]);
      var appointmentTakesAllDay = getAppointmentTakesAllDay(appointment, this.allDayPanelMode);
      if (!hasRecurrenceRule) {
        if (!(endDate >= trimMin && startDate < trimMax || dateUtils.sameDate(endDate, trimMin) && dateUtils.sameDate(startDate, trimMin))) {
          return false;
        }
      }
      var appointmentTakesSeveralDays = getAppointmentTakesSeveralDays(appointment);
      var isLongAppointment = appointmentTakesSeveralDays || appointmentTakesAllDay;
      if ((resources === null || resources === void 0 ? void 0 : resources.length) && !this._filterAppointmentByResources(appointment.rawAppointment, resources)) {
        return false;
      }
      if (appointmentTakesAllDay && filterOptions.allDay === false) {
        return false;
      }
      if (hasRecurrenceRule) {
        var recurrenceException = getRecurrenceException(appointment, this.timeZoneCalculator, this.timezone);
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
      if (!isAllDay && isDefined(startDayHour) && (!useRecurrence || !filterOptions.isVirtualScrolling)) {
        if (!compareDateWithStartDayHour(startDate, endDate, startDayHour, appointmentTakesAllDay, appointmentTakesSeveralDays)) {
          return false;
        }
      }
      if (!isAllDay && isDefined(endDayHour)) {
        if (!compareDateWithEndDayHour({
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
  _createAppointmentFilter(filterOptions) {
    return this._createCombinedFilter(filterOptions);
  }
  _filterAppointmentByResources(appointment, resources) {
    var checkAppointmentResourceValues = (resourceName, resourceIndex) => {
      var resourceGetter = this.dataAccessors.resources.getter[resourceName];
      var resource;
      if (isFunction(resourceGetter)) {
        resource = resourceGetter(appointment);
      }
      var appointmentResourceValues = wrapToArray(resource);
      var resourceData = map(resources[resourceIndex].items, _ref => {
        var {
          id
        } = _ref;
        return id;
      });
      for (var i = 0; i < appointmentResourceValues.length; i++) {
        if (hasResourceValue(resourceData, appointmentResourceValues[i])) {
          return true;
        }
      }
      return false;
    };
    var result = false;
    for (var i = 0; i < resources.length; i++) {
      var resourceName = resources[i].name;
      result = checkAppointmentResourceValues(resourceName, i);
      if (!result) {
        return false;
      }
    }
    return result;
  }
  _filterAppointmentByRRule(appointment, min, max, startDayHour, endDayHour, firstDayOfWeek) {
    var {
      recurrenceRule
    } = appointment;
    var {
      recurrenceException
    } = appointment;
    var {
      allDay
    } = appointment;
    var result = true;
    var appointmentStartDate = appointment.startDate;
    var appointmentEndDate = appointment.endDate;
    var recurrenceProcessor = getRecurrenceProcessor();
    if (allDay || _appointmentPartInInterval(appointmentStartDate, appointmentEndDate, startDayHour, endDayHour)) {
      var [trimMin, trimMax] = getDatesWithoutTime(min, max);
      min = trimMin;
      max = new Date(trimMax.getTime() - toMs('minute'));
    }
    if (recurrenceRule && !recurrenceProcessor.isValidRecurrenceRule(recurrenceRule)) {
      result = appointmentEndDate > min && appointmentStartDate <= max;
    }
    if (result && recurrenceProcessor.isValidRecurrenceRule(recurrenceRule)) {
      var {
        viewOffset
      } = this.options;
      result = recurrenceProcessor.hasRecurrence({
        rule: recurrenceRule,
        exception: recurrenceException,
        start: appointmentStartDate,
        end: appointmentEndDate,
        min: dateUtilsTs.addOffsets(min, [viewOffset]),
        max: dateUtilsTs.addOffsets(max, [viewOffset]),
        firstDayOfWeek,
        appointmentTimezoneOffset: this.timeZoneCalculator.getOriginStartDateOffsetInMs(appointmentStartDate, appointment.startDateTimeZone, false)
      });
    }
    return result;
  }
  filterLoadedAppointments(filterOptions, preparedItems) {
    var filteredItems = this.filterPreparedItems(filterOptions, preparedItems);
    return filteredItems.map(_ref2 => {
      var {
        rawAppointment
      } = _ref2;
      return rawAppointment;
    });
  }
  filterPreparedItems(filterOptions, preparedItems) {
    var combinedFilter = this._createAppointmentFilter(filterOptions);
    return query(preparedItems).filter(combinedFilter).toArray();
  }
  filterAllDayAppointments(preparedItems) {
    var combinedFilter = this._createAllDayAppointmentFilter();
    return query(preparedItems).filter(combinedFilter).toArray().map(_ref3 => {
      var {
        rawAppointment
      } = _ref3;
      return rawAppointment;
    });
  }
}
export class AppointmentFilterVirtualStrategy extends AppointmentFilterBaseStrategy {
  get strategyName() {
    return FilterStrategies.virtual;
  }
  get resources() {
    return this.options.resources;
  }
  filter(preparedItems) {
    var {
      viewOffset
    } = this.options;
    var hourMs = toMs('hour');
    var isCalculateStartAndEndDayHour = isDateAndTimeView(this.viewType);
    var checkIntersectViewport = isCalculateStartAndEndDayHour && this.viewDirection === 'horizontal';
    var isAllDayWorkspace = !this.supportAllDayRow;
    var showAllDayAppointments = this.showAllDayPanel || isAllDayWorkspace;
    var endViewDate = this.viewDataProvider.getLastViewDateByEndDayHour(this.viewEndDayHour);
    var shiftedEndViewDate = dateUtilsTs.addOffsets(endViewDate, [viewOffset]);
    var filterOptions = [];
    var groupsInfo = this.viewDataProvider.getCompletedGroupsInfo();
    groupsInfo.forEach(item => {
      var {
        groupIndex
      } = item;
      var groupStartDate = item.startDate;
      var groupEndDate = new Date(Math.min(item.endDate.getTime(), shiftedEndViewDate.getTime()));
      var startDayHour = isCalculateStartAndEndDayHour ? groupStartDate.getHours() : this.viewStartDayHour;
      var endDayHour = isCalculateStartAndEndDayHour ? startDayHour + groupStartDate.getMinutes() / 60 + (groupEndDate.getTime() - groupStartDate.getTime()) / hourMs : this.viewEndDayHour;
      var resources = this._getPrerenderFilterResources(groupIndex);
      var hasAllDayPanel = this.viewDataProvider.hasGroupAllDayPanel(groupIndex);
      var supportAllDayAppointment = isAllDayWorkspace || !!showAllDayAppointments && hasAllDayPanel;
      filterOptions.push({
        isVirtualScrolling: true,
        startDayHour,
        endDayHour,
        viewOffset,
        viewStartDayHour: this.viewStartDayHour,
        viewEndDayHour: this.viewEndDayHour,
        min: dateUtilsTs.addOffsets(groupStartDate, [-viewOffset]),
        max: dateUtilsTs.addOffsets(groupEndDate, [-viewOffset]),
        supportMultiDayAppointments: isTimelineView(this.viewType),
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
  }
  filterPreparedItems(_ref4, preparedItems) {
    var {
      filterOptions,
      groupCount
    } = _ref4;
    var combinedFilters = [];
    var itemsToFilter = preparedItems;
    var needPreFilter = groupCount > 0;
    if (needPreFilter) {
      // @ts-expect-error
      itemsToFilter = itemsToFilter.filter(_ref5 => {
        var {
          rawAppointment
        } = _ref5;
        for (var i = 0; i < filterOptions.length; ++i) {
          var {
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
      var filter = this._createAppointmentFilter(option);
      combinedFilters.push(filter);
    });
    return query(itemsToFilter).filter(combinedFilters).toArray();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasAllDayAppointments(filteredItems, preparedItems) {
    return this.filterAllDayAppointments(preparedItems).length > 0;
  }
  _getPrerenderFilterResources(groupIndex) {
    var cellGroup = this.viewDataProvider.getCellsGroup(groupIndex);
    return getResourcesDataByGroups(this.loadedResources, this.resources, [cellGroup]);
  }
}
