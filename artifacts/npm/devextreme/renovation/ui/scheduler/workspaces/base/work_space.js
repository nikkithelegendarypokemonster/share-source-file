/**
* DevExtreme (renovation/ui/scheduler/workspaces/base/work_space.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.prepareGenerationOptions = exports.WorkSpace = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _subscribe_to_event = require("../../../../utils/subscribe_to_event");
var _combine_classes = require("../../../../utils/combine_classes");
var _ordinary_layout = require("./ordinary_layout");
var _m_virtual_scrolling = require("../../../../../__internal/scheduler/workspaces/m_virtual_scrolling");
var _m_view_data_provider = _interopRequireDefault(require("../../../../../__internal/scheduler/workspaces/view_model/m_view_data_provider"));
var _utils = require("./utils");
var _props = require("../props");
var _work_space_config = require("./work_space_config");
var _cross_scrolling_layout = require("./cross_scrolling_layout");
var _m_utils = require("../../../../../__internal/scheduler/workspaces/view_model/m_utils");
var _m_date_header_data_generator = require("../../../../../__internal/scheduler/workspaces/view_model/m_date_header_data_generator");
var _m_time_panel_data_generator = require("../../../../../__internal/scheduler/workspaces/view_model/m_time_panel_data_generator");
var _m_cells_selection_controller = require("../../../../../__internal/scheduler/workspaces/m_cells_selection_controller");
var _window = require("../../../../../core/utils/window");
var _dom_adapter = _interopRequireDefault(require("../../../../../core/dom_adapter"));
var _config_context = require("../../../../common/config_context");
var _pointer = _interopRequireDefault(require("../../../../../events/pointer"));
var _events_engine = _interopRequireDefault(require("../../../../../events/core/events_engine"));
var _index = require("../../../../../events/utils/index");
var _const = require("../const");
var _diagnostic = require("../../../../utils/diagnostic");
var _index2 = require("../../../../../__internal/scheduler/__migration/utils/index");
const _excluded = ["accessKey", "activeStateEnabled", "allDayAppointments", "allDayPanelExpanded", "allDayPanelMode", "allowMultipleCellSelection", "appointments", "cellDuration", "className", "crossScrollingEnabled", "currentDate", "dataCellTemplate", "dateCellTemplate", "disabled", "endDayHour", "firstDayOfWeek", "focusStateEnabled", "groupByDate", "groupOrientation", "groups", "height", "hint", "hoursInterval", "hoverStateEnabled", "indicatorTime", "indicatorUpdateInterval", "intervalCount", "maxAppointmentsPerCell", "onClick", "onKeyDown", "onViewRendered", "resourceCellTemplate", "rtlEnabled", "schedulerHeight", "schedulerWidth", "scrolling", "selectedCellData", "shadeUntilCurrentTime", "showAllDayPanel", "showCurrentTimeIndicator", "startDate", "startDayHour", "startViewDate", "tabIndex", "timeCellTemplate", "today", "type", "viewOffset", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DATA_CELL_SELECTOR = ".".concat(_const.DATE_TABLE_CELL_CLASS, ", .").concat(_const.ALL_DAY_PANEL_CELL_CLASS);
const defaultVirtualScrollingMetaData = {
  cellHeight: 50,
  cellWidth: _utils.DATE_TABLE_MIN_CELL_WIDTH,
  viewWidth: 300,
  viewHeight: 300,
  scrollableWidth: 300,
  windowHeight: 300,
  windowWidth: 300
};
const calculateDefaultVirtualScrollingState = options => {
  const completeColumnCount = options.completeViewDataMap[0].length;
  const completeRowCount = options.completeViewDataMap.length;
  options.virtualScrollingDispatcher.setViewOptions((0, _utils.createVirtualScrollingOptions)({
    cellHeight: defaultVirtualScrollingMetaData.cellHeight,
    cellWidth: defaultVirtualScrollingMetaData.cellWidth,
    schedulerHeight: options.schedulerHeight,
    schedulerWidth: options.schedulerWidth,
    viewHeight: defaultVirtualScrollingMetaData.viewHeight,
    viewWidth: defaultVirtualScrollingMetaData.viewWidth,
    scrolling: options.scrolling,
    scrollableWidth: defaultVirtualScrollingMetaData.scrollableWidth,
    groups: options.groups,
    isVerticalGrouping: options.isVerticalGrouping,
    completeRowCount,
    completeColumnCount,
    windowHeight: defaultVirtualScrollingMetaData.windowHeight,
    windowWidth: defaultVirtualScrollingMetaData.windowWidth,
    rtlEnabled: options.rtlEnabled
  }));
  options.virtualScrollingDispatcher.createVirtualScrolling();
  options.virtualScrollingDispatcher.updateDimensions(true);
  return options.virtualScrollingDispatcher.getRenderState();
};
const prepareGenerationOptions = (workSpaceProps, renderConfig, isAllDayPanelVisible, virtualStartIndices) => {
  const {
    cellDuration,
    currentDate,
    endDayHour,
    firstDayOfWeek,
    groupByDate,
    groupOrientation,
    groups,
    hoursInterval,
    intervalCount,
    startDate,
    startDayHour,
    today,
    type,
    viewOffset
  } = workSpaceProps;
  const {
    getDateForHeaderText,
    headerCellTextFormat,
    isGenerateWeekDaysHeaderData,
    isProvideVirtualCellsWidth,
    isRenderTimePanel
  } = renderConfig;
  return {
    startRowIndex: virtualStartIndices.startRowIndex,
    startCellIndex: virtualStartIndices.startCellIndex,
    groupOrientation,
    groupByDate,
    groups,
    isProvideVirtualCellsWidth,
    isAllDayPanelVisible,
    selectedCells: undefined,
    focusedCell: undefined,
    headerCellTextFormat,
    getDateForHeaderText,
    startDayHour,
    endDayHour,
    viewOffset,
    cellDuration,
    viewType: type,
    intervalCount,
    hoursInterval,
    currentDate,
    startDate,
    firstDayOfWeek,
    today,
    isGenerateTimePanelData: isRenderTimePanel,
    isGenerateWeekDaysHeaderData
  };
};
exports.prepareGenerationOptions = prepareGenerationOptions;
const viewFunction = _ref => {
  let {
    allDayPanelRef,
    classes,
    dateHeaderData,
    dateTableRef,
    groupOrientation,
    groupPanelData,
    groupPanelHeight,
    groupPanelRef,
    headerEmptyCellWidth,
    isAllDayPanelVisible,
    isGroupedByDate,
    isRenderHeaderEmptyCell,
    isStandaloneAllDayPanel,
    isVerticalGrouping,
    layoutRef,
    onScrollableScroll,
    props: {
      allDayAppointments,
      allDayPanelExpanded,
      appointments,
      dataCellTemplate,
      dateCellTemplate,
      groups,
      intervalCount,
      resourceCellTemplate,
      timeCellTemplate
    },
    renderConfig: {
      groupPanelClassName,
      isCreateCrossScrolling,
      isRenderDateHeader,
      isRenderTimePanel,
      isUseMonthDateTable,
      isUseTimelineHeader,
      scrollingDirection
    },
    tablesWidth,
    timePanelData,
    timePanelRef,
    viewData,
    widgetElementRef
  } = _ref;
  const Layout = isCreateCrossScrolling ? _cross_scrolling_layout.CrossScrollingLayout : _ordinary_layout.OrdinaryLayout;
  return (0, _inferno.createComponentVNode)(2, Layout, {
    "viewData": viewData,
    "dateHeaderData": dateHeaderData,
    "timePanelData": timePanelData,
    "groupPanelData": groupPanelData,
    "dataCellTemplate": dataCellTemplate,
    "dateCellTemplate": dateCellTemplate,
    "timeCellTemplate": timeCellTemplate,
    "resourceCellTemplate": resourceCellTemplate,
    "groups": groups,
    "groupByDate": isGroupedByDate,
    "groupOrientation": groupOrientation,
    "groupPanelClassName": groupPanelClassName,
    "intervalCount": intervalCount,
    "isUseMonthDateTable": isUseMonthDateTable,
    "isUseTimelineHeader": isUseTimelineHeader,
    "isRenderTimePanel": isRenderTimePanel,
    "isAllDayPanelCollapsed": !allDayPanelExpanded,
    "isAllDayPanelVisible": isAllDayPanelVisible,
    "isRenderDateHeader": isRenderDateHeader,
    "isRenderHeaderEmptyCell": isRenderHeaderEmptyCell,
    "isRenderGroupPanel": isVerticalGrouping,
    "isStandaloneAllDayPanel": isStandaloneAllDayPanel,
    "scrollingDirection": scrollingDirection,
    "groupPanelHeight": groupPanelHeight,
    "headerEmptyCellWidth": headerEmptyCellWidth,
    "tablesWidth": tablesWidth,
    "onScroll": onScrollableScroll,
    "className": classes,
    "dateTableRef": dateTableRef,
    "allDayPanelRef": allDayPanelRef,
    "timePanelRef": timePanelRef,
    "groupPanelRef": groupPanelRef,
    "widgetElementRef": widgetElementRef,
    "appointments": appointments,
    "allDayAppointments": allDayAppointments
  }, null, layoutRef);
};
exports.viewFunction = viewFunction;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let WorkSpace = exports.WorkSpace = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(WorkSpace, _InfernoComponent);
  function WorkSpace(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.dateTableRef = (0, _inferno.createRef)();
    _this.allDayPanelRef = (0, _inferno.createRef)();
    _this.timePanelRef = (0, _inferno.createRef)();
    _this.groupPanelRef = (0, _inferno.createRef)();
    _this.layoutRef = (0, _inferno.createRef)();
    _this.widgetElementRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.state = {
      groupPanelHeight: undefined,
      headerEmptyCellWidth: undefined,
      tablesWidth: undefined,
      virtualScrolling: new _m_virtual_scrolling.VirtualScrollingDispatcher(),
      virtualScrollingData: undefined,
      cellsSelectionState: null,
      isPointerDown: false
    };
    _this.diagnosticEffect = _this.diagnosticEffect.bind(_assertThisInitialized(_this));
    _this.headerEmptyCellWidthEffect = _this.headerEmptyCellWidthEffect.bind(_assertThisInitialized(_this));
    _this.tablesWidthEffect = _this.tablesWidthEffect.bind(_assertThisInitialized(_this));
    _this.virtualScrollingMetaDataEffect = _this.virtualScrollingMetaDataEffect.bind(_assertThisInitialized(_this));
    _this.groupPanelHeightEffect = _this.groupPanelHeightEffect.bind(_assertThisInitialized(_this));
    _this.onWindowScrollEffect = _this.onWindowScrollEffect.bind(_assertThisInitialized(_this));
    _this.pointerEventsEffect = _this.pointerEventsEffect.bind(_assertThisInitialized(_this));
    _this.onViewRendered = _this.onViewRendered.bind(_assertThisInitialized(_this));
    _this.pointerUpEffect = _this.pointerUpEffect.bind(_assertThisInitialized(_this));
    _this.createDateTableElementsMeta = _this.createDateTableElementsMeta.bind(_assertThisInitialized(_this));
    _this.createAllDayPanelElementsMeta = _this.createAllDayPanelElementsMeta.bind(_assertThisInitialized(_this));
    _this.onWindowScroll = _this.onWindowScroll.bind(_assertThisInitialized(_this));
    _this.onScrollableScroll = _this.onScrollableScroll.bind(_assertThisInitialized(_this));
    _this.onScroll = _this.onScroll.bind(_assertThisInitialized(_this));
    _this.onPointerDown = _this.onPointerDown.bind(_assertThisInitialized(_this));
    _this.onPointerUp = _this.onPointerUp.bind(_assertThisInitialized(_this));
    _this.onPointerMove = _this.onPointerMove.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = WorkSpace.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.diagnosticEffect, [this.props, this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.state.tablesWidth, this.state.virtualScrolling, this.state.virtualScrollingData, this.state.cellsSelectionState, this.state.isPointerDown, this.config, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.viewOffset, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.startViewDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.today, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.maxAppointmentsPerCell, this.props.allDayPanelMode, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]), new _inferno2.InfernoEffect(this.headerEmptyCellWidthEffect, [this.props, this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.state.tablesWidth, this.state.virtualScrolling, this.state.virtualScrollingData, this.state.cellsSelectionState, this.state.isPointerDown, this.config, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.viewOffset, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.startViewDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.today, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.maxAppointmentsPerCell, this.props.allDayPanelMode, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]), new _inferno2.InfernoEffect(this.tablesWidthEffect, [this.props, this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.state.tablesWidth, this.state.virtualScrolling, this.state.virtualScrollingData, this.state.cellsSelectionState, this.state.isPointerDown, this.config, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.viewOffset, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.startViewDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.today, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.maxAppointmentsPerCell, this.props.allDayPanelMode, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]), new _inferno2.InfernoEffect(this.virtualScrollingMetaDataEffect, [this.props, this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.state.tablesWidth, this.state.virtualScrolling, this.state.virtualScrollingData, this.state.cellsSelectionState, this.state.isPointerDown, this.config, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.viewOffset, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.startViewDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.today, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.maxAppointmentsPerCell, this.props.allDayPanelMode, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]), new _inferno2.InfernoEffect(this.groupPanelHeightEffect, [this.props, this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.state.tablesWidth, this.state.virtualScrolling, this.state.virtualScrollingData, this.state.cellsSelectionState, this.state.isPointerDown, this.config, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.viewOffset, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.startViewDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.today, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.maxAppointmentsPerCell, this.props.allDayPanelMode, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]), new _inferno2.InfernoEffect(this.onWindowScrollEffect, [this.state.virtualScrolling, this.state.virtualScrollingData]), new _inferno2.InfernoEffect(this.pointerEventsEffect, [this.props.cellDuration, this.props.currentDate, this.props.endDayHour, this.props.firstDayOfWeek, this.props.groups, this.props.hoursInterval, this.props.intervalCount, this.props.startDate, this.props.startDayHour, this.props.today, this.props.type, this.props.viewOffset, this.props.groupByDate, this.props.startViewDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.showAllDayPanel, this.state.virtualScrollingData, this.props.schedulerHeight, this.props.schedulerWidth, this.props.scrolling, this.state.virtualScrolling, this.state.isPointerDown, this.state.cellsSelectionState]), new _inferno2.InfernoEffect(this.onViewRendered, [this.props.allDayPanelExpanded, this.props.cellDuration, this.props.crossScrollingEnabled, this.props.currentDate, this.props.endDayHour, this.props.firstDayOfWeek, this.props.groupByDate, this.props.groupOrientation, this.props.type, this.props.intervalCount, this.props.groups, this.props.hoursInterval, this.props.onViewRendered, this.props.scrolling, this.props.showAllDayPanel, this.props.startDate, this.props.startDayHour, this.props.today, this.props.viewOffset, this.props.startViewDate, this.state.virtualScrollingData, this.props.schedulerHeight, this.props.schedulerWidth, this.state.virtualScrolling, this.state.tablesWidth]), new _inferno2.InfernoEffect(this.pointerUpEffect, [])];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5, _this$_effects$6, _this$_effects$7, _this$_effects$8;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props, this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.state.tablesWidth, this.state.virtualScrolling, this.state.virtualScrollingData, this.state.cellsSelectionState, this.state.isPointerDown, this.config, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.viewOffset, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.startViewDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.today, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.maxAppointmentsPerCell, this.props.allDayPanelMode, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]);
    (_this$_effects$2 = this._effects[1]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props, this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.state.tablesWidth, this.state.virtualScrolling, this.state.virtualScrollingData, this.state.cellsSelectionState, this.state.isPointerDown, this.config, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.viewOffset, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.startViewDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.today, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.maxAppointmentsPerCell, this.props.allDayPanelMode, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]);
    (_this$_effects$3 = this._effects[2]) === null || _this$_effects$3 === void 0 ? void 0 : _this$_effects$3.update([this.props, this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.state.tablesWidth, this.state.virtualScrolling, this.state.virtualScrollingData, this.state.cellsSelectionState, this.state.isPointerDown, this.config, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.viewOffset, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.startViewDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.today, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.maxAppointmentsPerCell, this.props.allDayPanelMode, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]);
    (_this$_effects$4 = this._effects[3]) === null || _this$_effects$4 === void 0 ? void 0 : _this$_effects$4.update([this.props, this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.state.tablesWidth, this.state.virtualScrolling, this.state.virtualScrollingData, this.state.cellsSelectionState, this.state.isPointerDown, this.config, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.viewOffset, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.startViewDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.today, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.maxAppointmentsPerCell, this.props.allDayPanelMode, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]);
    (_this$_effects$5 = this._effects[4]) === null || _this$_effects$5 === void 0 ? void 0 : _this$_effects$5.update([this.props, this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.state.tablesWidth, this.state.virtualScrolling, this.state.virtualScrollingData, this.state.cellsSelectionState, this.state.isPointerDown, this.config, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.viewOffset, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.startViewDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.today, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.maxAppointmentsPerCell, this.props.allDayPanelMode, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]);
    (_this$_effects$6 = this._effects[5]) === null || _this$_effects$6 === void 0 ? void 0 : _this$_effects$6.update([this.state.virtualScrolling, this.state.virtualScrollingData]);
    (_this$_effects$7 = this._effects[6]) === null || _this$_effects$7 === void 0 ? void 0 : _this$_effects$7.update([this.props.cellDuration, this.props.currentDate, this.props.endDayHour, this.props.firstDayOfWeek, this.props.groups, this.props.hoursInterval, this.props.intervalCount, this.props.startDate, this.props.startDayHour, this.props.today, this.props.type, this.props.viewOffset, this.props.groupByDate, this.props.startViewDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.showAllDayPanel, this.state.virtualScrollingData, this.props.schedulerHeight, this.props.schedulerWidth, this.props.scrolling, this.state.virtualScrolling, this.state.isPointerDown, this.state.cellsSelectionState]);
    (_this$_effects$8 = this._effects[7]) === null || _this$_effects$8 === void 0 ? void 0 : _this$_effects$8.update([this.props.allDayPanelExpanded, this.props.cellDuration, this.props.crossScrollingEnabled, this.props.currentDate, this.props.endDayHour, this.props.firstDayOfWeek, this.props.groupByDate, this.props.groupOrientation, this.props.type, this.props.intervalCount, this.props.groups, this.props.hoursInterval, this.props.onViewRendered, this.props.scrolling, this.props.showAllDayPanel, this.props.startDate, this.props.startDayHour, this.props.today, this.props.viewOffset, this.props.startViewDate, this.state.virtualScrollingData, this.props.schedulerHeight, this.props.schedulerWidth, this.state.virtualScrolling, this.state.tablesWidth]);
  };
  _proto.diagnosticEffect = function diagnosticEffect() {
    _diagnostic.DiagnosticUtils.incrementRenderCount('scheduler_workspace');
  };
  _proto.headerEmptyCellWidthEffect = function headerEmptyCellWidthEffect() {
    var _this$timePanelRef$cu, _this$timePanelRef$cu2, _this$groupPanelRef$c, _this$groupPanelRef$c2;
    const timePanelWidth = (_this$timePanelRef$cu = (_this$timePanelRef$cu2 = this.timePanelRef.current) === null || _this$timePanelRef$cu2 === void 0 ? void 0 : _this$timePanelRef$cu2.getBoundingClientRect().width) !== null && _this$timePanelRef$cu !== void 0 ? _this$timePanelRef$cu : 0;
    const groupPanelWidth = (_this$groupPanelRef$c = (_this$groupPanelRef$c2 = this.groupPanelRef.current) === null || _this$groupPanelRef$c2 === void 0 ? void 0 : _this$groupPanelRef$c2.getBoundingClientRect().width) !== null && _this$groupPanelRef$c !== void 0 ? _this$groupPanelRef$c : 0;
    this.setState(__state_argument => ({
      headerEmptyCellWidth: timePanelWidth + groupPanelWidth
    }));
  };
  _proto.tablesWidthEffect = function tablesWidthEffect() {
    if (this.isCalculateTablesWidth) {
      const {
        currentDate,
        endDayHour,
        groups,
        hoursInterval,
        intervalCount,
        startDayHour,
        type: viewType
      } = this.props;
      this.setState(__state_argument => ({
        tablesWidth: (0, _utils.getDateTableWidth)(this.layoutRef.current.getScrollableWidth(), this.dateTableRef.current, this.viewDataProvider, {
          intervalCount,
          currentDate,
          viewType,
          hoursInterval,
          startDayHour,
          endDayHour,
          groups,
          groupOrientation: this.groupOrientation
        })
      }));
    }
  };
  _proto.virtualScrollingMetaDataEffect = function virtualScrollingMetaDataEffect() {
    const dateTableCell = this.dateTableRef.current.querySelector('td:not(.dx-scheduler-virtual-cell)');
    const cellRect = dateTableCell.getBoundingClientRect();
    const cellHeight = Math.floor(cellRect.height);
    const cellWidth = Math.floor(cellRect.width);
    const scrollableWidth = this.layoutRef.current.getScrollableWidth();
    const widgetRect = this.widgetElementRef.current.getBoundingClientRect();
    const viewHeight = widgetRect.height;
    const viewWidth = widgetRect.width;
    const windowHeight = (0, _window.getWindow)().innerHeight;
    const windowWidth = (0, _window.getWindow)().innerWidth;
    const nextSizes = {
      cellHeight,
      cellWidth,
      scrollableWidth,
      viewHeight,
      viewWidth,
      windowHeight,
      windowWidth
    };
    const isNextMetaDataNotEqualToCurrent = !this.state.virtualScrollingData || Object.entries(nextSizes).some(_ref2 => {
      let [key, value] = _ref2;
      return value !== this.state.virtualScrollingData.sizes[key];
    });
    if (isNextMetaDataNotEqualToCurrent) {
      var _this$config;
      const {
        groups,
        schedulerHeight,
        schedulerWidth,
        scrolling
      } = this.props;
      const completeColumnCount = this.completeViewDataMap[0].length;
      const completeRowCount = this.completeViewDataMap.length;
      this.state.virtualScrolling.setViewOptions((0, _utils.createVirtualScrollingOptions)({
        cellHeight: nextSizes.cellHeight,
        cellWidth: nextSizes.cellWidth,
        schedulerHeight,
        schedulerWidth,
        viewHeight: nextSizes.viewHeight,
        viewWidth: nextSizes.viewWidth,
        scrolling,
        scrollableWidth: nextSizes.scrollableWidth,
        groups,
        isVerticalGrouping: this.isVerticalGrouping,
        completeRowCount,
        completeColumnCount,
        windowHeight: nextSizes.windowHeight,
        windowWidth: nextSizes.windowWidth,
        rtlEnabled: !!((_this$config = this.config) !== null && _this$config !== void 0 && _this$config.rtlEnabled)
      }));
      this.state.virtualScrolling.createVirtualScrolling();
      this.state.virtualScrolling.updateDimensions(true);
      this.setState(__state_argument => ({
        virtualScrollingData: {
          state: this.state.virtualScrolling.getRenderState(),
          sizes: nextSizes
        }
      }));
    }
  };
  _proto.groupPanelHeightEffect = function groupPanelHeightEffect() {
    this.setState(__state_argument => {
      var _this$dateTableRef$cu;
      return {
        groupPanelHeight: (_this$dateTableRef$cu = this.dateTableRef.current) === null || _this$dateTableRef$cu === void 0 ? void 0 : _this$dateTableRef$cu.getBoundingClientRect().height
      };
    });
  };
  _proto.onWindowScrollEffect = function onWindowScrollEffect() {
    if (this.state.virtualScrolling.isAttachWindowScrollEvent()) {
      return (0, _subscribe_to_event.subscribeToScrollEvent)(_dom_adapter.default.getDocument(), () => this.onWindowScroll());
    }
    return undefined;
  };
  _proto.pointerEventsEffect = function pointerEventsEffect() {
    const disposePointerDown = (0, _subscribe_to_event.subscribeToDXPointerDownEvent)(this.widgetElementRef.current, e => this.onPointerDown(e));
    const disposePointerMove = (0, _subscribe_to_event.subscribeToDXPointerMoveEvent)(this.widgetElementRef.current, e => this.onPointerMove(e));
    return () => {
      disposePointerDown();
      disposePointerMove();
    };
  };
  _proto.onViewRendered = function onViewRendered() {
    const {
      allDayPanelExpanded,
      cellDuration,
      crossScrollingEnabled,
      currentDate,
      endDayHour,
      firstDayOfWeek,
      groupByDate,
      groupOrientation,
      groups,
      hoursInterval,
      intervalCount,
      onViewRendered,
      scrolling,
      showAllDayPanel,
      startDate,
      startDayHour,
      type: viewType
    } = this.props;
    const tableWidths = (0, _utils.getDateTableWidth)(this.layoutRef.current.getScrollableWidth(), this.dateTableRef.current, this.viewDataProvider, {
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour,
      groups,
      groupOrientation: this.groupOrientation
    });
    if (!this.isCalculateTablesWidth || tableWidths === this.state.tablesWidth) {
      const columnCount = this.viewDataMap.dateTableMap[0].length;
      const dateTableCellsMeta = this.createDateTableElementsMeta(columnCount);
      const allDayPanelCellsMeta = this.createAllDayPanelElementsMeta();
      onViewRendered({
        viewDataProvider: this.viewDataProvider,
        cellsMetaData: {
          dateTableCellsMeta,
          allDayPanelCellsMeta
        },
        viewDataProviderValidationOptions: {
          intervalCount,
          currentDate,
          type: viewType,
          hoursInterval,
          startDayHour,
          endDayHour,
          groups,
          groupOrientation,
          groupByDate,
          crossScrollingEnabled,
          firstDayOfWeek,
          startDate,
          showAllDayPanel,
          allDayPanelExpanded,
          scrolling,
          cellDuration
        }
      });
    }
  };
  _proto.pointerUpEffect = function pointerUpEffect() {
    const onPointerUp = e => this.onPointerUp(e);
    _events_engine.default.on(_dom_adapter.default.getDocument(), _pointer.default.up, onPointerUp);
    return () => {
      _events_engine.default.off(_dom_adapter.default.getDocument(), _pointer.default.up, onPointerUp);
    };
  };
  _proto.createDateTableElementsMeta = function createDateTableElementsMeta(totalCellCount) {
    const dateTableCells = this.dateTableRef.current.querySelectorAll('td:not(.dx-scheduler-virtual-cell)');
    const dateTableRect = this.dateTableRef.current.getBoundingClientRect();
    const dateTableCellsMeta = [];
    dateTableCells.forEach((cellElement, index) => {
      if (index % totalCellCount === 0) {
        dateTableCellsMeta.push([]);
      }
      const cellRect = cellElement.getBoundingClientRect();
      const validCellRect = (0, _utils.createCellElementMetaData)(dateTableRect, cellRect);
      dateTableCellsMeta[dateTableCellsMeta.length - 1].push(validCellRect);
    });
    return dateTableCellsMeta;
  };
  _proto.createAllDayPanelElementsMeta = function createAllDayPanelElementsMeta() {
    if (!this.allDayPanelRef.current) {
      return [];
    }
    const allDayPanelCells = this.allDayPanelRef.current.querySelectorAll('td');
    const allDayPanelRect = this.allDayPanelRef.current.getBoundingClientRect();
    const allDayPanelCellsMeta = [];
    allDayPanelCells.forEach(cellElement => {
      const cellRect = cellElement.getBoundingClientRect();
      allDayPanelCellsMeta.push((0, _utils.createCellElementMetaData)(allDayPanelRect, cellRect));
    });
    return allDayPanelCellsMeta;
  };
  _proto.onWindowScroll = function onWindowScroll() {
    const {
      scrollX,
      scrollY
    } = (0, _window.getWindow)();
    this.onScroll({
      top: scrollY,
      left: scrollX
    });
  };
  _proto.onScrollableScroll = function onScrollableScroll(event) {
    if (this.props.scrolling.mode === 'virtual') {
      this.onScroll(event.scrollOffset);
    }
  };
  _proto.onScroll = function onScroll(scrollOffset) {
    this.state.virtualScrolling.handleOnScrollEvent(scrollOffset);
    const nextState = this.state.virtualScrolling.getRenderState();
    const isUpdateState = Object.entries(nextState).some(_ref3 => {
      let [key, value] = _ref3;
      return value !== this.state.virtualScrollingData.state[key];
    });
    if (isUpdateState) {
      this.setState(__state_argument => ({
        virtualScrollingData: {
          state: nextState,
          sizes: __state_argument.virtualScrollingData.sizes
        }
      }));
    }
  };
  _proto.onPointerDown = function onPointerDown(e) {
    const cell = e.target.closest(DATA_CELL_SELECTOR);
    if (cell && (0, _index.isMouseEvent)(e) && e.button === 0) {
      const isAllDay = (0, _utils.isCellAllDay)(cell);
      const cellIndices = (0, _utils.getCellIndices)(cell);
      const cellData = this.viewDataProvider.getCellData(cellIndices.rowIndex, cellIndices.columnIndex, isAllDay);
      this.setState(__state_argument => ({
        cellsSelectionState: {
          focusedCell: {
            cellData,
            position: cellIndices
          },
          selectedCells: [cellData],
          firstSelectedCell: cellData
        }
      }));
      this.setState(__state_argument => ({
        isPointerDown: true
      }));
    }
  };
  _proto.onPointerUp = function onPointerUp(e) {
    if ((0, _index.isMouseEvent)(e) && e.button === 0) {
      this.setState(__state_argument => ({
        isPointerDown: false
      }));
    }
  };
  _proto.onPointerMove = function onPointerMove(e) {
    const cell = e.target.closest(DATA_CELL_SELECTOR);
    if (cell && this.state.isPointerDown) {
      e.preventDefault();
      e.stopPropagation();
      const cellsSelectionController = new _m_cells_selection_controller.CellsSelectionController();
      const cellIndices = (0, _utils.getCellIndices)(cell);
      const isAllDay = (0, _utils.isCellAllDay)(cell);
      const cellData = this.viewDataProvider.getCellData(cellIndices.rowIndex, cellIndices.columnIndex, isAllDay);
      const nextFocusedCell = cellsSelectionController.moveToCell({
        isMultiSelection: true,
        isMultiSelectionAllowed: true,
        focusedCellData: this.state.cellsSelectionState.focusedCell.cellData,
        currentCellData: cellData
      });
      if (nextFocusedCell === cellData && this.state.cellsSelectionState.focusedCell.cellData.index !== cellData.index) {
        const firstCell = this.state.cellsSelectionState.firstSelectedCell;
        const selectedCells = this.viewDataProvider.getCellsBetween(firstCell, cellData);
        this.setState(__state_argument => ({
          cellsSelectionState: {
            focusedCell: {
              cellData,
              position: cellIndices
            },
            selectedCells,
            firstSelectedCell: __state_argument.cellsSelectionState.firstSelectedCell
          }
        }));
      }
    }
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoComponent.prototype.componentWillUpdate.call(this);
    if (this.props['type'] !== nextProps['type'] || this.props['crossScrollingEnabled'] !== nextProps['crossScrollingEnabled'] || this.props['intervalCount'] !== nextProps['intervalCount'] || this.props['groups'] !== nextProps['groups'] || this.props['groupOrientation'] !== nextProps['groupOrientation']) {
      this.__getterCache['renderConfig'] = undefined;
    }
    if (this.props['type'] !== nextProps['type']) {
      this.__getterCache['viewDataGenerator'] = undefined;
    }
    if (this.props['type'] !== nextProps['type']) {
      this.__getterCache['dateHeaderDataGenerator'] = undefined;
    }
    if (this.props['type'] !== nextProps['type']) {
      this.__getterCache['timePanelDataGenerator'] = undefined;
    }
    if (this.props['cellDuration'] !== nextProps['cellDuration'] || this.props['currentDate'] !== nextProps['currentDate'] || this.props['endDayHour'] !== nextProps['endDayHour'] || this.props['firstDayOfWeek'] !== nextProps['firstDayOfWeek'] || this.props['groupByDate'] !== nextProps['groupByDate'] || this.props['groups'] !== nextProps['groups'] || this.props['hoursInterval'] !== nextProps['hoursInterval'] || this.props['intervalCount'] !== nextProps['intervalCount'] || this.props['startDate'] !== nextProps['startDate'] || this.props['startDayHour'] !== nextProps['startDayHour'] || this.props['type'] !== nextProps['type'] || this.props['viewOffset'] !== nextProps['viewOffset'] || this.props['startViewDate'] !== nextProps['startViewDate'] || this.props['groupOrientation'] !== nextProps['groupOrientation'] || this.props['crossScrollingEnabled'] !== nextProps['crossScrollingEnabled'] || this.props['showAllDayPanel'] !== nextProps['showAllDayPanel']) {
      this.__getterCache['completeViewDataMap'] = undefined;
    }
    if (this.state['virtualScrollingData'] !== nextState['virtualScrollingData'] || this.props['groups'] !== nextProps['groups'] || this.props['schedulerHeight'] !== nextProps['schedulerHeight'] || this.props['schedulerWidth'] !== nextProps['schedulerWidth'] || this.props['scrolling'] !== nextProps['scrolling'] || this.state['virtualScrolling'] !== nextState['virtualScrolling'] || this.props['cellDuration'] !== nextProps['cellDuration'] || this.props['currentDate'] !== nextProps['currentDate'] || this.props['endDayHour'] !== nextProps['endDayHour'] || this.props['firstDayOfWeek'] !== nextProps['firstDayOfWeek'] || this.props['groupByDate'] !== nextProps['groupByDate'] || this.props['hoursInterval'] !== nextProps['hoursInterval'] || this.props['intervalCount'] !== nextProps['intervalCount'] || this.props['startDate'] !== nextProps['startDate'] || this.props['startDayHour'] !== nextProps['startDayHour'] || this.props['type'] !== nextProps['type'] || this.props['viewOffset'] !== nextProps['viewOffset'] || this.props['startViewDate'] !== nextProps['startViewDate'] || this.props['groupOrientation'] !== nextProps['groupOrientation'] || this.props['crossScrollingEnabled'] !== nextProps['crossScrollingEnabled'] || this.props['showAllDayPanel'] !== nextProps['showAllDayPanel']) {
      this.__getterCache['correctedVirtualScrollingState'] = undefined;
    }
    if (this.props['groups'] !== nextProps['groups'] || this.props['type'] !== nextProps['type'] || this.props['cellDuration'] !== nextProps['cellDuration'] || this.props['currentDate'] !== nextProps['currentDate'] || this.props['endDayHour'] !== nextProps['endDayHour'] || this.props['firstDayOfWeek'] !== nextProps['firstDayOfWeek'] || this.props['groupByDate'] !== nextProps['groupByDate'] || this.props['hoursInterval'] !== nextProps['hoursInterval'] || this.props['intervalCount'] !== nextProps['intervalCount'] || this.props['startDate'] !== nextProps['startDate'] || this.props['startDayHour'] !== nextProps['startDayHour'] || this.props['viewOffset'] !== nextProps['viewOffset'] || this.props['startViewDate'] !== nextProps['startViewDate'] || this.props['groupOrientation'] !== nextProps['groupOrientation'] || this.props['crossScrollingEnabled'] !== nextProps['crossScrollingEnabled'] || this.props['showAllDayPanel'] !== nextProps['showAllDayPanel'] || this.state['cellsSelectionState'] !== nextState['cellsSelectionState'] || this.state['virtualScrollingData'] !== nextState['virtualScrollingData'] || this.props['schedulerHeight'] !== nextProps['schedulerHeight'] || this.props['schedulerWidth'] !== nextProps['schedulerWidth'] || this.props['scrolling'] !== nextProps['scrolling'] || this.state['virtualScrolling'] !== nextState['virtualScrolling']) {
      this.__getterCache['viewData'] = undefined;
    }
    if (this.props['currentDate'] !== nextProps['currentDate'] || this.props['endDayHour'] !== nextProps['endDayHour'] || this.props['groups'] !== nextProps['groups'] || this.props['hoursInterval'] !== nextProps['hoursInterval'] || this.props['intervalCount'] !== nextProps['intervalCount'] || this.props['startDayHour'] !== nextProps['startDayHour'] || this.props['type'] !== nextProps['type'] || this.props['viewOffset'] !== nextProps['viewOffset'] || this.props['crossScrollingEnabled'] !== nextProps['crossScrollingEnabled'] || this.props['groupOrientation'] !== nextProps['groupOrientation'] || this.props['groupByDate'] !== nextProps['groupByDate'] || this.props['startViewDate'] !== nextProps['startViewDate'] || this.props['cellDuration'] !== nextProps['cellDuration'] || this.props['firstDayOfWeek'] !== nextProps['firstDayOfWeek'] || this.props['startDate'] !== nextProps['startDate'] || this.props['showAllDayPanel'] !== nextProps['showAllDayPanel']) {
      this.__getterCache['completeDateHeaderData'] = undefined;
    }
    if (this.props['endDayHour'] !== nextProps['endDayHour'] || this.props['groups'] !== nextProps['groups'] || this.props['hoursInterval'] !== nextProps['hoursInterval'] || this.props['startDayHour'] !== nextProps['startDayHour'] || this.props['type'] !== nextProps['type'] || this.props['currentDate'] !== nextProps['currentDate'] || this.props['intervalCount'] !== nextProps['intervalCount'] || this.props['viewOffset'] !== nextProps['viewOffset'] || this.props['crossScrollingEnabled'] !== nextProps['crossScrollingEnabled'] || this.props['groupOrientation'] !== nextProps['groupOrientation'] || this.props['groupByDate'] !== nextProps['groupByDate'] || this.props['startViewDate'] !== nextProps['startViewDate'] || this.props['cellDuration'] !== nextProps['cellDuration'] || this.props['firstDayOfWeek'] !== nextProps['firstDayOfWeek'] || this.props['startDate'] !== nextProps['startDate'] || this.props['showAllDayPanel'] !== nextProps['showAllDayPanel'] || this.state['virtualScrollingData'] !== nextState['virtualScrollingData'] || this.props['schedulerHeight'] !== nextProps['schedulerHeight'] || this.props['schedulerWidth'] !== nextProps['schedulerWidth'] || this.props['scrolling'] !== nextProps['scrolling'] || this.state['virtualScrolling'] !== nextState['virtualScrolling']) {
      this.__getterCache['dateHeaderData'] = undefined;
    }
    if (this.props['type'] !== nextProps['type'] || this.props['crossScrollingEnabled'] !== nextProps['crossScrollingEnabled'] || this.props['intervalCount'] !== nextProps['intervalCount'] || this.props['groups'] !== nextProps['groups'] || this.props['groupOrientation'] !== nextProps['groupOrientation'] || this.props['cellDuration'] !== nextProps['cellDuration'] || this.props['currentDate'] !== nextProps['currentDate'] || this.props['endDayHour'] !== nextProps['endDayHour'] || this.props['hoursInterval'] !== nextProps['hoursInterval'] || this.props['startDayHour'] !== nextProps['startDayHour'] || this.props['today'] !== nextProps['today'] || this.props['viewOffset'] !== nextProps['viewOffset'] || this.props['startViewDate'] !== nextProps['startViewDate'] || this.props['firstDayOfWeek'] !== nextProps['firstDayOfWeek'] || this.props['groupByDate'] !== nextProps['groupByDate'] || this.props['startDate'] !== nextProps['startDate'] || this.props['showAllDayPanel'] !== nextProps['showAllDayPanel']) {
      this.__getterCache['completeTimePanelData'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        dataCellTemplate: getTemplate(props.dataCellTemplate),
        dateCellTemplate: getTemplate(props.dateCellTemplate),
        timeCellTemplate: getTemplate(props.timeCellTemplate),
        resourceCellTemplate: getTemplate(props.resourceCellTemplate)
      }),
      groupPanelHeight: this.state.groupPanelHeight,
      headerEmptyCellWidth: this.state.headerEmptyCellWidth,
      tablesWidth: this.state.tablesWidth,
      virtualScrolling: this.state.virtualScrolling,
      virtualScrollingData: this.state.virtualScrollingData,
      cellsSelectionState: this.state.cellsSelectionState,
      isPointerDown: this.state.isPointerDown,
      dateTableRef: this.dateTableRef,
      allDayPanelRef: this.allDayPanelRef,
      timePanelRef: this.timePanelRef,
      groupPanelRef: this.groupPanelRef,
      widgetElementRef: this.widgetElementRef,
      layoutRef: this.layoutRef,
      config: this.config,
      renderConfig: this.renderConfig,
      groupOrientation: this.groupOrientation,
      isVerticalGrouping: this.isVerticalGrouping,
      isHorizontalGrouping: this.isHorizontalGrouping,
      isGroupedByDate: this.isGroupedByDate,
      isAllDayPanelVisible: this.isAllDayPanelVisible,
      viewDataGenerator: this.viewDataGenerator,
      dateHeaderDataGenerator: this.dateHeaderDataGenerator,
      timePanelDataGenerator: this.timePanelDataGenerator,
      completeViewDataMap: this.completeViewDataMap,
      correctedVirtualScrollingState: this.correctedVirtualScrollingState,
      viewDataMap: this.viewDataMap,
      viewDataMapWithSelection: this.viewDataMapWithSelection,
      viewData: this.viewData,
      completeDateHeaderData: this.completeDateHeaderData,
      dateHeaderData: this.dateHeaderData,
      completeTimePanelData: this.completeTimePanelData,
      timePanelData: this.timePanelData,
      viewDataProvider: this.viewDataProvider,
      groupPanelData: this.groupPanelData,
      isRenderHeaderEmptyCell: this.isRenderHeaderEmptyCell,
      isWorkSpaceWithOddCells: this.isWorkSpaceWithOddCells,
      classes: this.classes,
      isStandaloneAllDayPanel: this.isStandaloneAllDayPanel,
      isCalculateTablesWidth: this.isCalculateTablesWidth,
      createDateTableElementsMeta: this.createDateTableElementsMeta,
      createAllDayPanelElementsMeta: this.createAllDayPanelElementsMeta,
      onWindowScroll: this.onWindowScroll,
      onScrollableScroll: this.onScrollableScroll,
      onScroll: this.onScroll,
      onPointerDown: this.onPointerDown,
      onPointerUp: this.onPointerUp,
      onPointerMove: this.onPointerMove,
      restAttributes: this.restAttributes
    });
  };
  _createClass(WorkSpace, [{
    key: "config",
    get: function () {
      if (this.context[_config_context.ConfigContext.id]) {
        return this.context[_config_context.ConfigContext.id];
      }
      return _config_context.ConfigContext.defaultValue;
    }
  }, {
    key: "renderConfig",
    get: function () {
      if (this.__getterCache['renderConfig'] !== undefined) {
        return this.__getterCache['renderConfig'];
      }
      return this.__getterCache['renderConfig'] = (() => {
        return (0, _work_space_config.getViewRenderConfigByType)(this.props.type, this.props.crossScrollingEnabled, this.props.intervalCount, this.props.groups, this.props.groupOrientation);
      })();
    }
  }, {
    key: "groupOrientation",
    get: function () {
      const {
        groupOrientation
      } = this.props;
      const {
        defaultGroupOrientation
      } = this.renderConfig;
      return groupOrientation !== null && groupOrientation !== void 0 ? groupOrientation : defaultGroupOrientation;
    }
  }, {
    key: "isVerticalGrouping",
    get: function () {
      return (0, _index2.isVerticalGroupingApplied)(this.props.groups, this.groupOrientation);
    }
  }, {
    key: "isHorizontalGrouping",
    get: function () {
      return (0, _index2.isHorizontalGroupingApplied)(this.props.groups, this.groupOrientation);
    }
  }, {
    key: "isGroupedByDate",
    get: function () {
      return (0, _index2.isGroupingByDate)(this.props.groups, this.groupOrientation, this.props.groupByDate);
    }
  }, {
    key: "isAllDayPanelVisible",
    get: function () {
      const {
        showAllDayPanel
      } = this.props;
      const {
        isAllDayPanelSupported
      } = this.renderConfig;
      return isAllDayPanelSupported && showAllDayPanel;
    }
  }, {
    key: "viewDataGenerator",
    get: function () {
      if (this.__getterCache['viewDataGenerator'] !== undefined) {
        return this.__getterCache['viewDataGenerator'];
      }
      return this.__getterCache['viewDataGenerator'] = (() => {
        return (0, _m_utils.getViewDataGeneratorByViewType)(this.props.type);
      })();
    }
  }, {
    key: "dateHeaderDataGenerator",
    get: function () {
      if (this.__getterCache['dateHeaderDataGenerator'] !== undefined) {
        return this.__getterCache['dateHeaderDataGenerator'];
      }
      return this.__getterCache['dateHeaderDataGenerator'] = (() => {
        return new _m_date_header_data_generator.DateHeaderDataGenerator(this.viewDataGenerator);
      })();
    }
  }, {
    key: "timePanelDataGenerator",
    get: function () {
      if (this.__getterCache['timePanelDataGenerator'] !== undefined) {
        return this.__getterCache['timePanelDataGenerator'];
      }
      return this.__getterCache['timePanelDataGenerator'] = (() => {
        return new _m_time_panel_data_generator.TimePanelDataGenerator(this.viewDataGenerator);
      })();
    }
  }, {
    key: "completeViewDataMap",
    get: function () {
      if (this.__getterCache['completeViewDataMap'] !== undefined) {
        return this.__getterCache['completeViewDataMap'];
      }
      return this.__getterCache['completeViewDataMap'] = (() => {
        const {
          cellDuration,
          currentDate,
          endDayHour,
          firstDayOfWeek,
          groupByDate,
          groups,
          hoursInterval,
          intervalCount,
          startDate,
          startDayHour,
          type,
          viewOffset
        } = this.props;
        return this.viewDataGenerator.getCompleteViewDataMap({
          currentDate,
          startDate,
          startDayHour,
          endDayHour,
          viewOffset,
          groupByDate,
          groups,
          intervalCount,
          firstDayOfWeek,
          hoursInterval,
          cellDuration,
          startViewDate: this.props.startViewDate,
          groupOrientation: this.groupOrientation,
          isVerticalGrouping: this.isVerticalGrouping,
          isHorizontalGrouping: this.isHorizontalGrouping,
          isGroupedByDate: this.isGroupedByDate,
          isAllDayPanelVisible: this.isAllDayPanelVisible,
          viewType: type,
          interval: this.viewDataGenerator.getInterval(hoursInterval)
        });
      })();
    }
  }, {
    key: "correctedVirtualScrollingState",
    get: function () {
      if (this.__getterCache['correctedVirtualScrollingState'] !== undefined) {
        return this.__getterCache['correctedVirtualScrollingState'];
      }
      return this.__getterCache['correctedVirtualScrollingState'] = (_this$state$virtualSc => {
        let result = (_this$state$virtualSc = this.state.virtualScrollingData) === null || _this$state$virtualSc === void 0 ? void 0 : _this$state$virtualSc.state;
        if (!result) {
          const {
            groups,
            schedulerHeight,
            schedulerWidth,
            scrolling
          } = this.props;
          result = calculateDefaultVirtualScrollingState({
            virtualScrollingDispatcher: this.state.virtualScrolling,
            scrolling,
            groups,
            completeViewDataMap: this.completeViewDataMap,
            isVerticalGrouping: this.isVerticalGrouping,
            schedulerHeight,
            schedulerWidth,
            rtlEnabled: false
          });
        }
        return _extends({
          startCellIndex: 0,
          startRowIndex: 0
        }, result);
      })();
    }
  }, {
    key: "viewDataMap",
    get: function () {
      return this.viewDataGenerator.generateViewDataMap(this.completeViewDataMap, _extends({}, this.correctedVirtualScrollingState, {
        isVerticalGrouping: this.isVerticalGrouping,
        isAllDayPanelVisible: this.isAllDayPanelVisible
      }));
    }
  }, {
    key: "viewDataMapWithSelection",
    get: function () {
      if (!this.state.cellsSelectionState) {
        return this.viewDataMap;
      }
      return this.viewDataGenerator.markSelectedAndFocusedCells(this.viewDataMap, this.state.cellsSelectionState);
    }
  }, {
    key: "viewData",
    get: function () {
      if (this.__getterCache['viewData'] !== undefined) {
        return this.__getterCache['viewData'];
      }
      return this.__getterCache['viewData'] = (() => {
        const {
          groups
        } = this.props;
        const result = this.viewDataGenerator.getViewDataFromMap(this.completeViewDataMap, this.viewDataMapWithSelection, _extends({}, this.correctedVirtualScrollingState, {
          isProvideVirtualCellsWidth: this.renderConfig.isProvideVirtualCellsWidth,
          isVerticalGrouping: this.isVerticalGrouping,
          isAllDayPanelVisible: this.isAllDayPanelVisible,
          isGroupedAllDayPanel: (0, _index2.calculateIsGroupedAllDayPanel)(groups, this.groupOrientation, this.isAllDayPanelVisible)
        }));
        return result;
      })();
    }
  }, {
    key: "completeDateHeaderData",
    get: function () {
      if (this.__getterCache['completeDateHeaderData'] !== undefined) {
        return this.__getterCache['completeDateHeaderData'];
      }
      return this.__getterCache['completeDateHeaderData'] = (() => {
        const {
          currentDate,
          endDayHour,
          groups,
          hoursInterval,
          intervalCount,
          startDayHour,
          type: viewType,
          viewOffset
        } = this.props;
        return this.dateHeaderDataGenerator.getCompleteDateHeaderMap({
          isGenerateWeekDaysHeaderData: this.renderConfig.isGenerateWeekDaysHeaderData,
          isGroupedByDate: this.isGroupedByDate,
          groups,
          groupOrientation: this.groupOrientation,
          isHorizontalGrouping: this.isHorizontalGrouping,
          startDayHour,
          endDayHour,
          viewOffset,
          hoursInterval,
          intervalCount,
          headerCellTextFormat: this.renderConfig.headerCellTextFormat,
          getDateForHeaderText: this.renderConfig.getDateForHeaderText,
          interval: this.viewDataGenerator.getInterval(hoursInterval),
          startViewDate: this.props.startViewDate,
          currentDate,
          viewType,
          today: new Date()
        }, this.completeViewDataMap);
      })();
    }
  }, {
    key: "dateHeaderData",
    get: function () {
      if (this.__getterCache['dateHeaderData'] !== undefined) {
        return this.__getterCache['dateHeaderData'];
      }
      return this.__getterCache['dateHeaderData'] = (() => {
        const {
          endDayHour,
          groups,
          hoursInterval,
          startDayHour
        } = this.props;
        return this.dateHeaderDataGenerator.generateDateHeaderData(this.completeDateHeaderData, this.completeViewDataMap, _extends({
          isGenerateWeekDaysHeaderData: this.renderConfig.isGenerateWeekDaysHeaderData,
          isProvideVirtualCellsWidth: this.renderConfig.isProvideVirtualCellsWidth,
          isMonthDateHeader: this.renderConfig.isMonthDateHeader,
          startDayHour,
          endDayHour,
          hoursInterval,
          groups,
          groupOrientation: this.groupOrientation,
          isGroupedByDate: this.isGroupedByDate
        }, this.correctedVirtualScrollingState));
      })();
    }
  }, {
    key: "completeTimePanelData",
    get: function () {
      if (this.__getterCache['completeTimePanelData'] !== undefined) {
        return this.__getterCache['completeTimePanelData'];
      }
      return this.__getterCache['completeTimePanelData'] = (() => {
        if (!this.renderConfig.isRenderTimePanel) {
          return undefined;
        }
        const {
          cellDuration,
          currentDate,
          endDayHour,
          hoursInterval,
          intervalCount,
          startDayHour,
          today,
          type,
          viewOffset
        } = this.props;
        return this.timePanelDataGenerator.getCompleteTimePanelMap({
          startViewDate: this.props.startViewDate,
          cellDuration,
          startDayHour,
          endDayHour,
          isVerticalGrouping: this.isVerticalGrouping,
          intervalCount,
          currentDate,
          viewType: type,
          hoursInterval,
          viewOffset,
          today
        }, this.completeViewDataMap);
      })();
    }
  }, {
    key: "timePanelData",
    get: function () {
      if (!this.completeTimePanelData) {
        return undefined;
      }
      return this.timePanelDataGenerator.generateTimePanelData(this.completeTimePanelData, _extends({
        isGroupedAllDayPanel: (0, _index2.calculateIsGroupedAllDayPanel)(this.props.groups, this.groupOrientation, this.isAllDayPanelVisible),
        isVerticalGrouping: this.isVerticalGrouping,
        isAllDayPanelVisible: this.isAllDayPanelVisible
      }, this.correctedVirtualScrollingState));
    }
  }, {
    key: "viewDataProvider",
    get: function () {
      const {
        cellDuration,
        currentDate,
        endDayHour,
        firstDayOfWeek,
        groups,
        hoursInterval,
        intervalCount,
        startDate,
        startDayHour,
        today,
        type,
        viewOffset
      } = this.props;
      const viewDataProvider = new _m_view_data_provider.default(type);
      viewDataProvider.completeViewDataMap = this.completeViewDataMap;
      viewDataProvider.viewDataMap = this.viewDataMap;
      const generationOptions = prepareGenerationOptions({
        intervalCount,
        groups,
        groupByDate: this.isGroupedByDate,
        groupOrientation: this.groupOrientation,
        startDayHour,
        endDayHour,
        viewOffset,
        currentDate,
        startDate,
        firstDayOfWeek,
        hoursInterval,
        type,
        cellDuration,
        today
      }, this.renderConfig, this.isAllDayPanelVisible, this.correctedVirtualScrollingState);
      viewDataProvider.setViewOptions(generationOptions);
      viewDataProvider.createGroupedDataMapProvider();
      return viewDataProvider;
    }
  }, {
    key: "groupPanelData",
    get: function () {
      const {
        currentDate,
        endDayHour,
        groups,
        hoursInterval,
        intervalCount,
        startDayHour,
        type
      } = this.props;
      const columnCountPerGroup = this.viewDataGenerator.getCellCount({
        intervalCount,
        hoursInterval,
        currentDate,
        startDayHour,
        endDayHour,
        viewType: type
      });
      const groupPanelData = (0, _index2.getGroupPanelData)(groups, columnCountPerGroup, this.isGroupedByDate, this.isGroupedByDate ? 1 : columnCountPerGroup);
      return groupPanelData;
    }
  }, {
    key: "isRenderHeaderEmptyCell",
    get: function () {
      return this.isVerticalGrouping || !!this.renderConfig.isRenderTimePanel;
    }
  }, {
    key: "isWorkSpaceWithOddCells",
    get: function () {
      return false;
    }
  }, {
    key: "classes",
    get: function () {
      const {
        allDayPanelExpanded,
        groups,
        intervalCount,
        scrolling
      } = this.props;
      return (0, _combine_classes.combineClasses)({
        [this.renderConfig.className]: true,
        'dx-scheduler-work-space-count': intervalCount > 1,
        'dx-scheduler-work-space-odd-cells': !!this.isWorkSpaceWithOddCells,
        'dx-scheduler-work-space-all-day-collapsed': !allDayPanelExpanded && this.isAllDayPanelVisible,
        'dx-scheduler-work-space-all-day': this.isAllDayPanelVisible,
        'dx-scheduler-work-space-group-by-date': this.isGroupedByDate,
        'dx-scheduler-work-space-grouped': groups.length > 0,
        'dx-scheduler-work-space-vertical-grouped': this.isVerticalGrouping && this.renderConfig.defaultGroupOrientation !== 'vertical',
        'dx-scheduler-work-space-horizontal-grouped': (0, _index2.isHorizontalGroupingApplied)(groups, this.groupOrientation) && this.renderConfig.defaultGroupOrientation === 'vertical',
        'dx-scheduler-group-column-count-one': this.isVerticalGrouping && groups.length === 1,
        'dx-scheduler-group-column-count-two': this.isVerticalGrouping && groups.length === 2,
        'dx-scheduler-group-column-count-three': this.isVerticalGrouping && groups.length === 3,
        'dx-scheduler-work-space-both-scrollbar': this.props.crossScrollingEnabled,
        'dx-scheduler-work-space-virtual': scrolling.mode === 'virtual',
        'dx-scheduler-work-space': true
      });
    }
  }, {
    key: "isStandaloneAllDayPanel",
    get: function () {
      const {
        groups
      } = this.props;
      return !(0, _index2.isVerticalGroupingApplied)(groups, this.groupOrientation) && this.isAllDayPanelVisible;
    }
  }, {
    key: "isCalculateTablesWidth",
    get: function () {
      return this.props.crossScrollingEnabled && this.renderConfig.defaultGroupOrientation !== 'vertical';
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return WorkSpace;
}(_inferno2.InfernoComponent);
WorkSpace.defaultProps = _props.WorkSpaceProps;
