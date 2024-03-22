/**
* DevExtreme (cjs/__internal/scheduler/m_appointments_layout_manager.js)
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
exports.default = void 0;
var _common = require("../../core/utils/common");
var _date = _interopRequireDefault(require("../../core/utils/date"));
var _index = require("./__migration/utils/index");
var _m_view_model_generator = require("./appointments/m_view_model_generator");
var _m_position_helper = require("./workspaces/helpers/m_position_helper");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const toMs = _date.default.dateToMilliseconds;
let AppointmentLayoutManager = /*#__PURE__*/function () {
  function AppointmentLayoutManager(instance) {
    this.instance = instance;
    this.appointmentViewModel = new _m_view_model_generator.AppointmentViewModelGenerator();
  }
  var _proto = AppointmentLayoutManager.prototype;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _proto.getCellDimensions = function getCellDimensions(options) {
    if (this.instance._workSpace) {
      return {
        width: this.instance._workSpace.getCellWidth(),
        height: this.instance._workSpace.getCellHeight(),
        allDayHeight: this.instance._workSpace.getAllDayHeight()
      };
    }
    return undefined;
  };
  _proto._getRenderingStrategyOptions = function _getRenderingStrategyOptions() {
    const workspace = this.instance.getWorkSpace();
    const {
      virtualScrollingDispatcher
    } = this.instance.getWorkSpace();
    const {
      cellCountInsideLeftVirtualCell,
      cellCountInsideTopVirtualRow
    } = virtualScrollingDispatcher;
    const groupCount = (0, _index.getGroupCount)(this.instance.option('loadedResources'));
    const DOMMetaData = workspace.getDOMElementsMetaData();
    const allDayHeight = (0, _m_position_helper.getAllDayHeight)(workspace.option('showAllDayPanel'), workspace._isVerticalGroupedWorkSpace(), DOMMetaData);
    const rowCount = workspace._getRowCount();
    const {
      positionHelper,
      viewDataProvider
    } = workspace;
    const visibleDayDuration = viewDataProvider.getVisibleDayDuration(workspace.option('startDayHour'), workspace.option('endDayHour'), workspace.option('hoursInterval'));
    const cellDuration = (0, _index.getCellDuration)(workspace.type, workspace.option('startDayHour'), workspace.option('endDayHour'), workspace.option('hoursInterval'));
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
      cellWidth: (0, _m_position_helper.getCellWidth)(DOMMetaData),
      cellHeight: (0, _m_position_helper.getCellHeight)(DOMMetaData),
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
  };
  _proto.createAppointmentsMap = function createAppointmentsMap(items) {
    const renderingStrategyOptions = this._getRenderingStrategyOptions();
    const {
      viewModel,
      positionMap
    } = this.appointmentViewModel.generate(items, renderingStrategyOptions);
    this._positionMap = positionMap; // TODO get rid of this after remove old render
    return viewModel;
  };
  _proto._isDataChanged = function _isDataChanged(data) {
    const {
      appointmentDataProvider
    } = this.instance;
    const updatedData = appointmentDataProvider.getUpdatedAppointment();
    return updatedData === data || appointmentDataProvider.getUpdatedAppointmentKeys().some(item => data[item.key] === item.value);
  };
  _proto._isAppointmentShouldAppear = function _isAppointmentShouldAppear(currentAppointment, sourceAppointment) {
    return currentAppointment.needRepaint && sourceAppointment.needRemove;
  };
  _proto._isSettingChanged = function _isSettingChanged(settings, sourceSetting) {
    if (settings.length !== sourceSetting.length) {
      return true;
    }
    const createSettingsToCompare = (settings, index) => {
      const currentSetting = settings[index];
      const leftVirtualCellCount = currentSetting.leftVirtualCellCount || 0;
      const topVirtualCellCount = currentSetting.topVirtualCellCount || 0;
      const columnIndex = currentSetting.columnIndex + leftVirtualCellCount;
      const rowIndex = currentSetting.rowIndex + topVirtualCellCount;
      const hMax = currentSetting.reduced ? currentSetting.hMax : undefined;
      const vMax = currentSetting.reduced ? currentSetting.vMax : undefined;
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
    for (let i = 0; i < settings.length; i++) {
      const newSettings = createSettingsToCompare(settings, i);
      const oldSettings = createSettingsToCompare(sourceSetting, i);
      if (oldSettings) {
        // exclude sortedIndex property for comparison in commonUtils.equalByValue
        oldSettings.sortedIndex = newSettings.sortedIndex;
      }
      if (!(0, _common.equalByValue)(newSettings, oldSettings)) {
        return true;
      }
    }
    return false;
  };
  _proto._getAssociatedSourceAppointment = function _getAssociatedSourceAppointment(currentAppointment, sourceAppointments) {
    for (let i = 0; i < sourceAppointments.length; i++) {
      const item = sourceAppointments[i];
      if (item.itemData === currentAppointment.itemData) {
        return item;
      }
    }
    return null;
  };
  _proto._getDeletedAppointments = function _getDeletedAppointments(currentAppointments, sourceAppointments) {
    const result = [];
    for (let i = 0; i < sourceAppointments.length; i++) {
      const sourceAppointment = sourceAppointments[i];
      const currentAppointment = this._getAssociatedSourceAppointment(sourceAppointment, currentAppointments);
      if (!currentAppointment) {
        sourceAppointment.needRemove = true;
        result.push(sourceAppointment);
      }
    }
    return result;
  };
  _proto.getRepaintedAppointments = function getRepaintedAppointments(currentAppointments, sourceAppointments) {
    if (sourceAppointments.length === 0 || this.appointmentRenderingStrategyName === 'agenda') {
      return currentAppointments;
    }
    currentAppointments.forEach(appointment => {
      const sourceAppointment = this._getAssociatedSourceAppointment(appointment, sourceAppointments);
      if (sourceAppointment) {
        const isDataChanged = this._isDataChanged(appointment.itemData);
        const isSettingChanged = this._isSettingChanged(appointment.settings, sourceAppointment.settings);
        const isAppointmentShouldAppear = this._isAppointmentShouldAppear(appointment, sourceAppointment);
        appointment.needRepaint = isDataChanged || isSettingChanged || isAppointmentShouldAppear;
      }
    });
    return currentAppointments.concat(this._getDeletedAppointments(currentAppointments, sourceAppointments));
  };
  _proto.getRenderingStrategyInstance = function getRenderingStrategyInstance() {
    const renderingStrategy = this.appointmentViewModel.getRenderingStrategy();
    if (!renderingStrategy) {
      const options = this._getRenderingStrategyOptions();
      this.appointmentViewModel.initRenderingStrategy(options);
    }
    return this.appointmentViewModel.getRenderingStrategy();
  };
  _createClass(AppointmentLayoutManager, [{
    key: "appointmentRenderingStrategyName",
    get: function () {
      return (0, _index.getAppointmentRenderingStrategyName)(this.instance.currentViewType);
    }
  }]);
  return AppointmentLayoutManager;
}();
var _default = exports.default = AppointmentLayoutManager;
