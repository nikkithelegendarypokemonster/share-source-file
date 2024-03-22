/**
* DevExtreme (bundles/__internal/scheduler/workspaces/m_timeline.js)
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
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _extend = require("../../../core/utils/extend");
var _position = require("../../../core/utils/position");
var _size = require("../../../core/utils/size");
var _window = require("../../../core/utils/window");
var _layout = _interopRequireDefault(require("../../../renovation/ui/scheduler/workspaces/timeline/header_panel/layout.j"));
var _index = require("../__migration/utils/index");
var _m_classes = require("../m_classes");
var _m_table_creator = _interopRequireDefault(require("../m_table_creator"));
var _m_utils_time_zone = _interopRequireDefault(require("../m_utils_time_zone"));
var _m_current_time_shader_horizontal = _interopRequireDefault(require("../shaders/m_current_time_shader_horizontal"));
var _m_work_space_indicator = _interopRequireDefault(require("./m_work_space_indicator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } // NOTE: Renovation component import.
// @ts-expect-error
const {
  tableCreator
} = _m_table_creator.default;
const TIMELINE_CLASS = 'dx-scheduler-timeline';
const GROUP_TABLE_CLASS = 'dx-scheduler-group-table';
const HORIZONTAL_GROUPED_WORKSPACE_CLASS = 'dx-scheduler-work-space-horizontal-grouped';
const HEADER_PANEL_CELL_CLASS = 'dx-scheduler-header-panel-cell';
const HEADER_PANEL_WEEK_CELL_CLASS = 'dx-scheduler-header-panel-week-cell';
const HEADER_ROW_CLASS = 'dx-scheduler-header-row';
const HORIZONTAL = 'horizontal';
const toMs = _date.default.dateToMilliseconds;
let SchedulerTimeline = /*#__PURE__*/function (_SchedulerWorkSpace) {
  _inheritsLoose(SchedulerTimeline, _SchedulerWorkSpace);
  function SchedulerTimeline() {
    var _this;
    _this = _SchedulerWorkSpace.apply(this, arguments) || this;
    _this.viewDirection = 'horizontal';
    return _this;
  }
  var _proto = SchedulerTimeline.prototype;
  _proto.getGroupTableWidth = function getGroupTableWidth() {
    return this._$sidebarTable ? (0, _size.getOuterWidth)(this._$sidebarTable) : 0;
  };
  _proto._getTotalRowCount = function _getTotalRowCount(groupCount) {
    if (this._isHorizontalGroupedWorkSpace()) {
      return this._getRowCount();
    }
    groupCount = groupCount || 1;
    return this._getRowCount() * groupCount;
  };
  _proto._getFormat = function _getFormat() {
    return 'shorttime';
  };
  _proto._getWorkSpaceHeight = function _getWorkSpaceHeight() {
    if (this.option('crossScrollingEnabled') && (0, _window.hasWindow)()) {
      return (0, _position.getBoundingRect)(this._$dateTable.get(0)).height;
    }
    return (0, _position.getBoundingRect)(this.$element().get(0)).height;
  };
  _proto._dateTableScrollableConfig = function _dateTableScrollableConfig() {
    const config = _SchedulerWorkSpace.prototype._dateTableScrollableConfig.call(this);
    const timelineConfig = {
      direction: HORIZONTAL
    };
    return this.option('crossScrollingEnabled') ? config : (0, _extend.extend)(config, timelineConfig);
  };
  _proto._needCreateCrossScrolling = function _needCreateCrossScrolling() {
    return true;
  };
  _proto._headerScrollableConfig = function _headerScrollableConfig() {
    const config = _SchedulerWorkSpace.prototype._headerScrollableConfig.call(this);
    return (0, _extend.extend)(config, {
      scrollByContent: true
    });
  };
  _proto.supportAllDayRow = function supportAllDayRow() {
    return false;
  };
  _proto._getGroupHeaderContainer = function _getGroupHeaderContainer() {
    if (this._isHorizontalGroupedWorkSpace()) {
      return this._$thead;
    }
    return this._$sidebarTable;
  };
  _proto._insertAllDayRowsIntoDateTable = function _insertAllDayRowsIntoDateTable() {
    return false;
  };
  _proto._needRenderWeekHeader = function _needRenderWeekHeader() {
    return false;
  };
  _proto._incrementDate = function _incrementDate(date) {
    date.setDate(date.getDate() + 1);
  };
  _proto.getIndicationCellCount = function getIndicationCellCount() {
    const timeDiff = this._getTimeDiff();
    return this._calculateDurationInCells(timeDiff);
  };
  _proto._getTimeDiff = function _getTimeDiff() {
    let today = this._getToday();
    const date = this._getIndicationFirstViewDate();
    const startViewDate = this.getStartViewDate();
    const dayLightOffset = _m_utils_time_zone.default.getDaylightOffsetInMs(startViewDate, today);
    if (dayLightOffset) {
      today = new Date(today.getTime() + dayLightOffset);
    }
    return today.getTime() - date.getTime();
  };
  _proto._calculateDurationInCells = function _calculateDurationInCells(timeDiff) {
    const today = this._getToday();
    const differenceInDays = Math.floor(timeDiff / toMs('day'));
    let duration = (timeDiff - differenceInDays * toMs('day') - this.option('startDayHour') * toMs('hour')) / this.getCellDuration();
    if (today.getHours() > this.option('endDayHour')) {
      duration = this._getCellCountInDay();
    }
    if (duration < 0) {
      duration = 0;
    }
    return differenceInDays * this._getCellCountInDay() + duration;
  };
  _proto.getIndicationWidth = function getIndicationWidth() {
    if (this.isGroupedByDate()) {
      const cellCount = this.getIndicationCellCount();
      const integerPart = Math.floor(cellCount);
      const fractionPart = cellCount - integerPart;
      return this.getCellWidth() * (integerPart * this._getGroupCount() + fractionPart);
    }
    return this.getIndicationCellCount() * this.getCellWidth();
  };
  _proto._isVerticalShader = function _isVerticalShader() {
    return false;
  };
  _proto._isCurrentTimeHeaderCell = function _isCurrentTimeHeaderCell() {
    return false;
  };
  _proto._setTableSizes = function _setTableSizes() {
    _SchedulerWorkSpace.prototype._setTableSizes.call(this);
    const minHeight = this._getWorkSpaceMinHeight();
    (0, _size.setHeight)(this._$sidebarTable, minHeight);
    (0, _size.setHeight)(this._$dateTable, minHeight);
    this.virtualScrollingDispatcher.updateDimensions();
  };
  _proto._getWorkSpaceMinHeight = function _getWorkSpaceMinHeight() {
    let minHeight = this._getWorkSpaceHeight();
    const workspaceContainerHeight = (0, _size.getOuterHeight)(this._$flexContainer, true);
    if (minHeight < workspaceContainerHeight) {
      minHeight = workspaceContainerHeight;
    }
    return minHeight;
  };
  _proto._getCellCoordinatesByIndex = function _getCellCoordinatesByIndex(index) {
    return {
      columnIndex: index % this._getCellCount(),
      rowIndex: 0
    };
  };
  _proto._getCellByCoordinates = function _getCellByCoordinates(cellCoordinates, groupIndex) {
    const indexes = this._groupedStrategy.prepareCellIndexes(cellCoordinates, groupIndex);
    return this._$dateTable.find('tr').eq(indexes.rowIndex).find('td').eq(indexes.columnIndex);
  };
  _proto._getWorkSpaceWidth = function _getWorkSpaceWidth() {
    return (0, _size.getOuterWidth)(this._$dateTable, true);
  };
  _proto._getIndicationFirstViewDate = function _getIndicationFirstViewDate() {
    return _date.default.trimTime(new Date(this.getStartViewDate()));
  };
  _proto._getIntervalBetween = function _getIntervalBetween(currentDate, allDay) {
    const startDayHour = this.option('startDayHour');
    const endDayHour = this.option('endDayHour');
    const firstViewDate = this.getStartViewDate();
    const firstViewDateTime = firstViewDate.getTime();
    const hiddenInterval = (24 - endDayHour + startDayHour) * toMs('hour');
    const timeZoneOffset = _date.default.getTimezonesDifference(firstViewDate, currentDate);
    const apptStart = currentDate.getTime();
    const fullInterval = apptStart - firstViewDateTime - timeZoneOffset;
    const fullDays = Math.floor(fullInterval / toMs('day'));
    const tailDuration = fullInterval - fullDays * toMs('day');
    let tailDelta = 0;
    const cellCount = this._getCellCountInDay() * (fullDays - this._getWeekendsCount(fullDays));
    const gapBeforeAppt = apptStart - _date.default.trimTime(new Date(currentDate)).getTime();
    let result = cellCount * this.option('hoursInterval') * toMs('hour');
    if (!allDay) {
      if (currentDate.getHours() < startDayHour) {
        tailDelta = tailDuration - hiddenInterval + gapBeforeAppt;
      } else if (currentDate.getHours() >= startDayHour && currentDate.getHours() < endDayHour) {
        tailDelta = tailDuration;
      } else if (currentDate.getHours() >= startDayHour && currentDate.getHours() >= endDayHour) {
        tailDelta = tailDuration - (gapBeforeAppt - endDayHour * toMs('hour'));
      } else if (!fullDays) {
        result = fullInterval;
      }
      result += tailDelta;
    }
    return result;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._getWeekendsCount = function _getWeekendsCount(argument) {
    return 0;
  };
  _proto.getAllDayContainer = function getAllDayContainer() {
    return null;
  };
  _proto.getTimePanelWidth = function getTimePanelWidth() {
    return 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.getIntervalDuration = function getIntervalDuration(allDay) {
    return this.getCellDuration();
  };
  _proto.getCellMinWidth = function getCellMinWidth() {
    return 0;
  };
  _proto.getWorkSpaceLeftOffset = function getWorkSpaceLeftOffset() {
    return 0;
  };
  _proto.scrollToTime = function scrollToTime(hours, minutes, date) {
    const coordinates = this._getScrollCoordinates(hours, minutes, date);
    const scrollable = this.getScrollable();
    const offset = this.option('rtlEnabled') ? (0, _position.getBoundingRect)(this.getScrollableContainer().get(0)).width : 0;
    if (this.option('templatesRenderAsynchronously')) {
      setTimeout(() => {
        scrollable.scrollBy({
          left: coordinates.left - scrollable.scrollLeft() - offset,
          top: 0
        });
      });
    } else {
      scrollable.scrollBy({
        left: coordinates.left - scrollable.scrollLeft() - offset,
        top: 0
      });
    }
  };
  _proto.renderRAllDayPanel = function renderRAllDayPanel() {};
  _proto.renderRTimeTable = function renderRTimeTable() {};
  _proto._renderGroupAllDayPanel = function _renderGroupAllDayPanel() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.generateRenderOptions = function generateRenderOptions(argument) {
    const options = _SchedulerWorkSpace.prototype.generateRenderOptions.call(this, true);
    return _extends(_extends({}, options), {
      isGenerateWeekDaysHeaderData: this._needRenderWeekHeader(),
      getDateForHeaderText: _index.timelineWeekUtils.getDateForHeaderText
    });
  }
  // -------------
  // We need these methods for now but they are useless for renovation
  // -------------
  ;
  _proto._init = function _init() {
    _SchedulerWorkSpace.prototype._init.call(this);
    this.$element().addClass(TIMELINE_CLASS);
    this._$sidebarTable = (0, _renderer.default)('<div>').addClass(GROUP_TABLE_CLASS);
  };
  _proto._getDefaultGroupStrategy = function _getDefaultGroupStrategy() {
    return 'vertical';
  };
  _proto._toggleGroupingDirectionClass = function _toggleGroupingDirectionClass() {
    this.$element().toggleClass(HORIZONTAL_GROUPED_WORKSPACE_CLASS, this._isHorizontalGroupedWorkSpace());
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_SchedulerWorkSpace.prototype._getDefaultOptions.call(this), {
      groupOrientation: 'vertical'
    });
  };
  _proto._createWorkSpaceElements = function _createWorkSpaceElements() {
    this._createWorkSpaceScrollableElements();
  };
  _proto._toggleAllDayVisibility = function _toggleAllDayVisibility() {
    return (0, _common.noop)();
  };
  _proto._changeAllDayVisibility = function _changeAllDayVisibility() {
    return (0, _common.noop)();
  };
  _proto._getDateHeaderTemplate = function _getDateHeaderTemplate() {
    return this.option('timeCellTemplate');
  };
  _proto._renderView = function _renderView() {
    let groupCellTemplates;
    if (!this.isRenovatedRender()) {
      groupCellTemplates = this._renderGroupHeader();
    }
    this.renderWorkSpace();
    if (this.isRenovatedRender()) {
      this.virtualScrollingDispatcher.updateDimensions();
    }
    this._shader = new _m_current_time_shader_horizontal.default(this);
    this._$sidebarTable.appendTo(this._sidebarScrollable.$content());
    if (this.isRenovatedRender() && this._isVerticalGroupedWorkSpace()) {
      this.renderRGroupPanel();
    }
    this.updateHeaderEmptyCellWidth();
    this._applyCellTemplates(groupCellTemplates);
  };
  _proto._setHorizontalGroupHeaderCellsHeight = function _setHorizontalGroupHeaderCellsHeight() {
    return (0, _common.noop)();
  };
  _proto._getTimePanelCells = function _getTimePanelCells() {
    return this.$element().find(".".concat(HEADER_PANEL_CELL_CLASS, ":not(.").concat(HEADER_PANEL_WEEK_CELL_CLASS, ")"));
  };
  _proto._getCurrentTimePanelCellIndices = function _getCurrentTimePanelCellIndices() {
    const columnCountPerGroup = this._getCellCount();
    const today = this._getToday();
    const index = this.getCellIndexByDate(today);
    const {
      columnIndex: currentTimeColumnIndex
    } = this._getCellCoordinatesByIndex(index);
    if (currentTimeColumnIndex === undefined) {
      return [];
    }
    const horizontalGroupCount = this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate() ? this._getGroupCount() : 1;
    return [...new Array(horizontalGroupCount)].map((_, groupIndex) => columnCountPerGroup * groupIndex + currentTimeColumnIndex);
  }
  // --------------
  // These methods should be deleted when we get rid of old render
  // --------------
  ;
  _proto._renderTimePanel = function _renderTimePanel() {
    return (0, _common.noop)();
  };
  _proto._renderAllDayPanel = function _renderAllDayPanel() {
    return (0, _common.noop)();
  };
  _proto._createAllDayPanelElements = function _createAllDayPanelElements() {
    return (0, _common.noop)();
  };
  _proto._renderDateHeader = function _renderDateHeader() {
    const $headerRow = _SchedulerWorkSpace.prototype._renderDateHeader.call(this);
    if (this._needRenderWeekHeader()) {
      const firstViewDate = new Date(this.getStartViewDate());
      let currentDate = new Date(firstViewDate);
      const $cells = [];
      const groupCount = this._getGroupCount();
      const cellCountInDay = this._getCellCountInDay();
      const colSpan = this.isGroupedByDate() ? cellCountInDay * groupCount : cellCountInDay;
      const cellTemplate = this.option('dateCellTemplate');
      const horizontalGroupCount = this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate() ? groupCount : 1;
      const cellsInGroup = this.viewDataProvider.viewDataGenerator.daysInInterval * this.option('intervalCount');
      const cellsCount = cellsInGroup * horizontalGroupCount;
      for (let templateIndex = 0; templateIndex < cellsCount; templateIndex++) {
        const $th = (0, _renderer.default)('<th>');
        const text = (0, _index.formatWeekdayAndDay)(currentDate);
        if (cellTemplate) {
          const templateOptions = {
            model: _extends({
              text,
              date: new Date(currentDate)
            }, this._getGroupsForDateHeaderTemplate(templateIndex, colSpan)),
            container: $th,
            index: templateIndex
          };
          cellTemplate.render(templateOptions);
        } else {
          $th.text(text);
        }
        $th.addClass(HEADER_PANEL_CELL_CLASS).addClass(HEADER_PANEL_WEEK_CELL_CLASS).attr('colSpan', colSpan);
        $cells.push($th);
        if (templateIndex % cellsInGroup === cellsInGroup - 1) {
          currentDate = new Date(firstViewDate);
        } else {
          this._incrementDate(currentDate);
        }
      }
      const $row = (0, _renderer.default)('<tr>').addClass(HEADER_ROW_CLASS).append($cells);
      $headerRow.before($row);
    }
  };
  _proto._renderIndicator = function _renderIndicator(height, rtlOffset, $container, groupCount) {
    let $indicator;
    const width = this.getIndicationWidth();
    if (this.option('groupOrientation') === 'vertical') {
      $indicator = this._createIndicator($container);
      (0, _size.setHeight)($indicator, (0, _position.getBoundingRect)($container.get(0)).height);
      $indicator.css('left', rtlOffset ? rtlOffset - width : width);
    } else {
      for (let i = 0; i < groupCount; i++) {
        const offset = this.isGroupedByDate() ? i * this.getCellWidth() : this._getCellCount() * this.getCellWidth() * i;
        $indicator = this._createIndicator($container);
        (0, _size.setHeight)($indicator, (0, _position.getBoundingRect)($container.get(0)).height);
        $indicator.css('left', rtlOffset ? rtlOffset - width - offset : width + offset);
      }
    }
  };
  _proto._makeGroupRows = function _makeGroupRows(groups, groupByDate) {
    const tableCreatorStrategy = this.option('groupOrientation') === 'vertical' ? tableCreator.VERTICAL : tableCreator.HORIZONTAL;
    return tableCreator.makeGroupedTable(tableCreatorStrategy, groups, {
      groupRowClass: _m_classes.GROUP_ROW_CLASS,
      groupHeaderRowClass: _m_classes.GROUP_ROW_CLASS,
      groupHeaderClass: this._getGroupHeaderClass.bind(this),
      groupHeaderContentClass: _m_classes.GROUP_HEADER_CONTENT_CLASS
    }, this._getCellCount() || 1, this.option('resourceCellTemplate'), this._getTotalRowCount(this._getGroupCount()), groupByDate);
  }
  // Old render methods.
  // TODO Old render: delete these methods with the old render.
  ;
  _proto._setCurrentTimeCells = function _setCurrentTimeCells() {
    const timePanelCells = this._getTimePanelCells();
    const currentTimeCellIndices = this._getCurrentTimePanelCellIndices();
    currentTimeCellIndices.forEach(timePanelCellIndex => {
      timePanelCells.eq(timePanelCellIndex).addClass(_m_classes.HEADER_CURRENT_TIME_CELL_CLASS);
    });
  };
  _proto._cleanCurrentTimeCells = function _cleanCurrentTimeCells() {
    this.$element().find(".".concat(_m_classes.HEADER_CURRENT_TIME_CELL_CLASS)).removeClass(_m_classes.HEADER_CURRENT_TIME_CELL_CLASS);
  };
  _createClass(SchedulerTimeline, [{
    key: "verticalGroupTableClass",
    get: function () {
      return GROUP_TABLE_CLASS;
    }
  }, {
    key: "renovatedHeaderPanelComponent",
    get: function () {
      return _layout.default;
    }
  }]);
  return SchedulerTimeline;
}(_m_work_space_indicator.default);
(0, _component_registrator.default)('dxSchedulerTimeline', SchedulerTimeline);
var _default = exports.default = SchedulerTimeline;
