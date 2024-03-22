/**
* DevExtreme (esm/__internal/scheduler/m_appointments_layout_manager.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { equalByValue } from '../../core/utils/common';
import dateUtils from '../../core/utils/date';
import { getAppointmentRenderingStrategyName, getCellDuration, getGroupCount } from './__migration/utils/index';
import { AppointmentViewModelGenerator } from './appointments/m_view_model_generator';
import { getAllDayHeight, getCellHeight, getCellWidth } from './workspaces/helpers/m_position_helper';
var toMs = dateUtils.dateToMilliseconds;
class AppointmentLayoutManager {
  constructor(instance) {
    this.instance = instance;
    this.appointmentViewModel = new AppointmentViewModelGenerator();
  }
  get appointmentRenderingStrategyName() {
    return getAppointmentRenderingStrategyName(this.instance.currentViewType);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCellDimensions(options) {
    if (this.instance._workSpace) {
      return {
        width: this.instance._workSpace.getCellWidth(),
        height: this.instance._workSpace.getCellHeight(),
        allDayHeight: this.instance._workSpace.getAllDayHeight()
      };
    }
    return undefined;
  }
  _getRenderingStrategyOptions() {
    var workspace = this.instance.getWorkSpace();
    var {
      virtualScrollingDispatcher
    } = this.instance.getWorkSpace();
    var {
      cellCountInsideLeftVirtualCell,
      cellCountInsideTopVirtualRow
    } = virtualScrollingDispatcher;
    var groupCount = getGroupCount(this.instance.option('loadedResources'));
    var DOMMetaData = workspace.getDOMElementsMetaData();
    var allDayHeight = getAllDayHeight(workspace.option('showAllDayPanel'), workspace._isVerticalGroupedWorkSpace(), DOMMetaData);
    var rowCount = workspace._getRowCount();
    var {
      positionHelper,
      viewDataProvider
    } = workspace;
    var visibleDayDuration = viewDataProvider.getVisibleDayDuration(workspace.option('startDayHour'), workspace.option('endDayHour'), workspace.option('hoursInterval'));
    var cellDuration = getCellDuration(workspace.type, workspace.option('startDayHour'), workspace.option('endDayHour'), workspace.option('hoursInterval'));
    return {
      resources: this.instance.option('resources'),
      loadedResources: this.instance.option('loadedResources'),
      getAppointmentColor: this.instance.createGetAppointmentColor(),
      dataAccessors: this.instance._dataAccessors,
      appointmentRenderingStrategyName: this.appointmentRenderingStrategyName,
      adaptivityEnabled: this.instance.option('adaptivityEnabled'),
      rtlEnabled: this.instance.option('rtlEnabled'),
      startDayHour: this.instance._getCurrentViewOption('startDayHour'),
      endDayHour: this.instance._getCurrentViewOption('endDayHour'),
      viewOffset: this.instance._getCurrentViewOption('offset') * toMs('minute'),
      maxAppointmentsPerCell: this.instance._getCurrentViewOption('maxAppointmentsPerCell'),
      currentDate: this.instance.option('currentDate'),
      isVirtualScrolling: this.instance.isVirtualScrolling(),
      leftVirtualCellCount: cellCountInsideLeftVirtualCell,
      topVirtualCellCount: cellCountInsideTopVirtualRow,
      intervalCount: workspace.option('intervalCount'),
      hoursInterval: workspace.option('hoursInterval'),
      showAllDayPanel: workspace.option('showAllDayPanel'),
      isGroupedAllDayPanel: workspace.isGroupedAllDayPanel(),
      groups: this.instance._getCurrentViewOption('groups'),
      groupCount,
      rowCount,
      appointmentCountPerCell: this.instance.option('_appointmentCountPerCell'),
      appointmentOffset: this.instance.option('_appointmentOffset'),
      allowResizing: this.instance._allowResizing(),
      allowAllDayResizing: this.instance._allowAllDayResizing(),
      startViewDate: workspace.getStartViewDate(),
      groupOrientation: workspace._getRealGroupOrientation(),
      cellWidth: getCellWidth(DOMMetaData),
      cellHeight: getCellHeight(DOMMetaData),
      allDayHeight,
      resizableStep: positionHelper.getResizableStep(),
      visibleDayDuration,
      allDayPanelMode: this.instance._getCurrentViewOption('allDayPanelMode'),
      // appointment settings
      timeZoneCalculator: this.instance.timeZoneCalculator,
      timeZone: this.instance.option('timeZone'),
      firstDayOfWeek: this.instance.getFirstDayOfWeek(),
      viewStartDayHour: this.instance._getCurrentViewOption('startDayHour'),
      viewEndDayHour: this.instance._getCurrentViewOption('endDayHour'),
      viewType: workspace.type,
      endViewDate: workspace.getEndViewDate(),
      positionHelper,
      isGroupedByDate: workspace.isGroupedByDate(),
      cellDuration,
      cellDurationInMinutes: workspace.option('cellDuration'),
      viewDataProvider: workspace.viewDataProvider,
      supportAllDayRow: workspace.supportAllDayRow(),
      dateRange: workspace.getDateRange(),
      intervalDuration: workspace.getIntervalDuration(),
      allDayIntervalDuration: workspace.getIntervalDuration(true),
      isVerticalGroupOrientation: workspace.isVerticalOrientation(),
      DOMMetaData,
      // agenda only
      instance: this.instance,
      agendaDuration: workspace.option('agendaDuration')
    };
  }
  createAppointmentsMap(items) {
    var renderingStrategyOptions = this._getRenderingStrategyOptions();
    var {
      viewModel,
      positionMap
    } = this.appointmentViewModel.generate(items, renderingStrategyOptions);
    this._positionMap = positionMap; // TODO get rid of this after remove old render
    return viewModel;
  }
  _isDataChanged(data) {
    var {
      appointmentDataProvider
    } = this.instance;
    var updatedData = appointmentDataProvider.getUpdatedAppointment();
    return updatedData === data || appointmentDataProvider.getUpdatedAppointmentKeys().some(item => data[item.key] === item.value);
  }
  _isAppointmentShouldAppear(currentAppointment, sourceAppointment) {
    return currentAppointment.needRepaint && sourceAppointment.needRemove;
  }
  _isSettingChanged(settings, sourceSetting) {
    if (settings.length !== sourceSetting.length) {
      return true;
    }
    var createSettingsToCompare = (settings, index) => {
      var currentSetting = settings[index];
      var leftVirtualCellCount = currentSetting.leftVirtualCellCount || 0;
      var topVirtualCellCount = currentSetting.topVirtualCellCount || 0;
      var columnIndex = currentSetting.columnIndex + leftVirtualCellCount;
      var rowIndex = currentSetting.rowIndex + topVirtualCellCount;
      var hMax = currentSetting.reduced ? currentSetting.hMax : undefined;
      var vMax = currentSetting.reduced ? currentSetting.vMax : undefined;
      return _extends(_extends({}, currentSetting), {
        columnIndex,
        rowIndex,
        positionByMap: undefined,
        topVirtualCellCount: undefined,
        leftVirtualCellCount: undefined,
        leftVirtualWidth: undefined,
        topVirtualHeight: undefined,
        hMax,
        vMax,
        info: {}
      });
    };
    for (var i = 0; i < settings.length; i++) {
      var newSettings = createSettingsToCompare(settings, i);
      var oldSettings = createSettingsToCompare(sourceSetting, i);
      if (oldSettings) {
        // exclude sortedIndex property for comparison in commonUtils.equalByValue
        oldSettings.sortedIndex = newSettings.sortedIndex;
      }
      if (!equalByValue(newSettings, oldSettings)) {
        return true;
      }
    }
    return false;
  }
  _getAssociatedSourceAppointment(currentAppointment, sourceAppointments) {
    for (var i = 0; i < sourceAppointments.length; i++) {
      var item = sourceAppointments[i];
      if (item.itemData === currentAppointment.itemData) {
        return item;
      }
    }
    return null;
  }
  _getDeletedAppointments(currentAppointments, sourceAppointments) {
    var result = [];
    for (var i = 0; i < sourceAppointments.length; i++) {
      var sourceAppointment = sourceAppointments[i];
      var currentAppointment = this._getAssociatedSourceAppointment(sourceAppointment, currentAppointments);
      if (!currentAppointment) {
        sourceAppointment.needRemove = true;
        result.push(sourceAppointment);
      }
    }
    return result;
  }
  getRepaintedAppointments(currentAppointments, sourceAppointments) {
    if (sourceAppointments.length === 0 || this.appointmentRenderingStrategyName === 'agenda') {
      return currentAppointments;
    }
    currentAppointments.forEach(appointment => {
      var sourceAppointment = this._getAssociatedSourceAppointment(appointment, sourceAppointments);
      if (sourceAppointment) {
        var isDataChanged = this._isDataChanged(appointment.itemData);
        var isSettingChanged = this._isSettingChanged(appointment.settings, sourceAppointment.settings);
        var isAppointmentShouldAppear = this._isAppointmentShouldAppear(appointment, sourceAppointment);
        appointment.needRepaint = isDataChanged || isSettingChanged || isAppointmentShouldAppear;
      }
    });
    return currentAppointments.concat(this._getDeletedAppointments(currentAppointments, sourceAppointments));
  }
  getRenderingStrategyInstance() {
    var renderingStrategy = this.appointmentViewModel.getRenderingStrategy();
    if (!renderingStrategy) {
      var options = this._getRenderingStrategyOptions();
      this.appointmentViewModel.initRenderingStrategy(options);
    }
    return this.appointmentViewModel.getRenderingStrategy();
  }
}
export default AppointmentLayoutManager;
