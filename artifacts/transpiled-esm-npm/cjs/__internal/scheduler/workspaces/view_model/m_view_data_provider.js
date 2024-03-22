"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _date2 = require("../../../core/utils/date");
var _index = require("../../../scheduler/__migration/utils/index");
var _index2 = require("../../__migration/utils/index");
var _m_utils_time_zone = _interopRequireDefault(require("../../m_utils_time_zone"));
var _m_date_header_data_generator = require("./m_date_header_data_generator");
var _m_grouped_data_map_provider = require("./m_grouped_data_map_provider");
var _m_time_panel_data_generator = require("./m_time_panel_data_generator");
var _m_utils = require("./m_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
// TODO: Vinogradov types refactoring.
let ViewDataProvider = exports.default = /*#__PURE__*/function () {
  function ViewDataProvider(viewType) {
    this.viewType = viewType;
    this.viewDataGenerator = (0, _m_utils.getViewDataGeneratorByViewType)(viewType);
    this.viewData = {};
    this.completeViewDataMap = [];
    this.completeDateHeaderMap = [];
    this.viewDataMap = {};
    this._groupedDataMapProvider = null;
  }
  var _proto = ViewDataProvider.prototype;
  _proto.isSkippedDate = function isSkippedDate(date) {
    return this.viewDataGenerator.isSkippedDate(date);
  };
  _proto.update = function update(options, isGenerateNewViewData) {
    this.viewDataGenerator = (0, _m_utils.getViewDataGeneratorByViewType)(options.viewType);
    const {
      viewDataGenerator
    } = this;
    const dateHeaderDataGenerator = new _m_date_header_data_generator.DateHeaderDataGenerator(viewDataGenerator);
    const timePanelDataGenerator = new _m_time_panel_data_generator.TimePanelDataGenerator(viewDataGenerator);
    const renderOptions = this._transformRenderOptions(options);
    renderOptions.interval = this.viewDataGenerator.getInterval(renderOptions.hoursInterval);
    this._options = renderOptions;
    if (isGenerateNewViewData) {
      this.completeViewDataMap = viewDataGenerator.getCompleteViewDataMap(renderOptions);
      this.completeDateHeaderMap = dateHeaderDataGenerator.getCompleteDateHeaderMap(renderOptions, this.completeViewDataMap);
      if (renderOptions.isGenerateTimePanelData) {
        this.completeTimePanelMap = timePanelDataGenerator.getCompleteTimePanelMap(renderOptions, this.completeViewDataMap);
      }
    }
    this.viewDataMap = viewDataGenerator.generateViewDataMap(this.completeViewDataMap, renderOptions);
    this.updateViewData(renderOptions);
    this._groupedDataMapProvider = new _m_grouped_data_map_provider.GroupedDataMapProvider(this.viewDataGenerator, this.viewDataMap, this.completeViewDataMap, {
      isVerticalGrouping: renderOptions.isVerticalGrouping,
      viewType: renderOptions.viewType,
      viewOffset: options.viewOffset
    });
    this.dateHeaderData = dateHeaderDataGenerator.generateDateHeaderData(this.completeDateHeaderMap, this.completeViewDataMap, renderOptions);
    if (renderOptions.isGenerateTimePanelData) {
      this.timePanelData = timePanelDataGenerator.generateTimePanelData(this.completeTimePanelMap, renderOptions);
    }
  };
  _proto.createGroupedDataMapProvider = function createGroupedDataMapProvider() {
    this._groupedDataMapProvider = new _m_grouped_data_map_provider.GroupedDataMapProvider(this.viewDataGenerator, this.viewDataMap, this.completeViewDataMap, {
      isVerticalGrouping: this._options.isVerticalGrouping,
      viewType: this._options.viewType
    });
  };
  _proto.updateViewData = function updateViewData(options) {
    const renderOptions = this._transformRenderOptions(options);
    this.viewDataMapWithSelection = this.viewDataGenerator.markSelectedAndFocusedCells(this.viewDataMap, renderOptions);
    this.viewData = this.viewDataGenerator.getViewDataFromMap(this.completeViewDataMap, this.viewDataMapWithSelection, renderOptions);
  };
  _proto._transformRenderOptions = function _transformRenderOptions(renderOptions) {
    const {
        groups,
        groupOrientation,
        groupByDate,
        isAllDayPanelVisible,
        viewOffset
      } = renderOptions,
      restOptions = __rest(renderOptions, ["groups", "groupOrientation", "groupByDate", "isAllDayPanelVisible", "viewOffset"]);
    return _extends(_extends({}, restOptions), {
      startViewDate: this.viewDataGenerator._calculateStartViewDate(renderOptions),
      isVerticalGrouping: (0, _index.isVerticalGroupingApplied)(groups, groupOrientation),
      isHorizontalGrouping: (0, _index.isHorizontalGroupingApplied)(groups, groupOrientation),
      isGroupedByDate: (0, _index.isGroupingByDate)(groups, groupOrientation, groupByDate),
      isGroupedAllDayPanel: (0, _index.calculateIsGroupedAllDayPanel)(groups, groupOrientation, isAllDayPanelVisible),
      groups,
      groupOrientation,
      isAllDayPanelVisible,
      viewOffset
    });
  };
  _proto.getGroupPanelData = function getGroupPanelData(options) {
    const renderOptions = this._transformRenderOptions(options);
    if (renderOptions.groups.length > 0) {
      const cellCount = this.getCellCount(renderOptions);
      return (0, _index2.getGroupPanelData)(renderOptions.groups, cellCount, renderOptions.isGroupedByDate, renderOptions.isGroupedByDate ? 1 : cellCount);
    }
    return undefined;
  };
  _proto.getGroupStartDate = function getGroupStartDate(groupIndex) {
    return this._groupedDataMapProvider.getGroupStartDate(groupIndex);
  };
  _proto.getGroupEndDate = function getGroupEndDate(groupIndex) {
    return this._groupedDataMapProvider.getGroupEndDate(groupIndex);
  };
  _proto.findGroupCellStartDate = function findGroupCellStartDate(groupIndex, startDate, endDate) {
    let isFindByDate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return this._groupedDataMapProvider.findGroupCellStartDate(groupIndex, startDate, endDate, isFindByDate);
  };
  _proto.findAllDayGroupCellStartDate = function findAllDayGroupCellStartDate(groupIndex) {
    return this._groupedDataMapProvider.findAllDayGroupCellStartDate(groupIndex);
  };
  _proto.findCellPositionInMap = function findCellPositionInMap(cellInfo) {
    let isAppointmentRender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return this._groupedDataMapProvider.findCellPositionInMap(cellInfo, isAppointmentRender);
  };
  _proto.hasAllDayPanel = function hasAllDayPanel() {
    const {
      viewData
    } = this.viewDataMap;
    const {
      allDayPanel
    } = viewData.groupedData[0];
    return !viewData.isGroupedAllDayPanel && (allDayPanel === null || allDayPanel === void 0 ? void 0 : allDayPanel.length) > 0;
  };
  _proto.getCellsGroup = function getCellsGroup(groupIndex) {
    return this._groupedDataMapProvider.getCellsGroup(groupIndex);
  };
  _proto.getCompletedGroupsInfo = function getCompletedGroupsInfo() {
    return this._groupedDataMapProvider.getCompletedGroupsInfo();
  };
  _proto.getGroupIndices = function getGroupIndices() {
    return this._groupedDataMapProvider.getGroupIndices();
  };
  _proto.getLastGroupCellPosition = function getLastGroupCellPosition(groupIndex) {
    return this._groupedDataMapProvider.getLastGroupCellPosition(groupIndex);
  };
  _proto.getRowCountInGroup = function getRowCountInGroup(groupIndex) {
    return this._groupedDataMapProvider.getRowCountInGroup(groupIndex);
  };
  _proto.getCellData = function getCellData(rowIndex, columnIndex, isAllDay, rtlEnabled) {
    const row = isAllDay && !this._options.isVerticalGrouping ? this.viewDataMap.allDayPanelMap : this.viewDataMap.dateTableMap[rowIndex];
    const actualColumnIndex = !rtlEnabled ? columnIndex : row.length - 1 - columnIndex;
    const {
      cellData
    } = row[actualColumnIndex];
    return cellData;
  };
  _proto.getCellsByGroupIndexAndAllDay = function getCellsByGroupIndexAndAllDay(groupIndex, allDay) {
    const rowsPerGroup = this._getRowCountWithAllDayRows();
    const isShowAllDayPanel = this._options.isAllDayPanelVisible;
    const firstRowInGroup = this._options.isVerticalGrouping ? groupIndex * rowsPerGroup : 0;
    const lastRowInGroup = this._options.isVerticalGrouping ? (groupIndex + 1) * rowsPerGroup - 1 : rowsPerGroup;
    const correctedFirstRow = isShowAllDayPanel && !allDay ? firstRowInGroup + 1 : firstRowInGroup;
    const correctedLastRow = allDay ? correctedFirstRow : lastRowInGroup;
    return this.completeViewDataMap.slice(correctedFirstRow, correctedLastRow + 1).map(row => row.filter(_ref => {
      let {
        groupIndex: currentGroupIndex
      } = _ref;
      return groupIndex === currentGroupIndex;
    }));
  };
  _proto.getCellCountWithGroup = function getCellCountWithGroup(groupIndex) {
    let rowIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    const {
      dateTableGroupedMap
    } = this.groupedDataMap;
    return dateTableGroupedMap.filter((_, index) => index <= groupIndex).reduce((previous, row) => previous + row[rowIndex].length, 0);
  };
  _proto.hasGroupAllDayPanel = function hasGroupAllDayPanel(groupIndex) {
    var _a, _b;
    if (this._options.isVerticalGrouping) {
      return !!((_a = this.groupedDataMap.dateTableGroupedMap[groupIndex]) === null || _a === void 0 ? void 0 : _a[0][0].cellData.allDay);
    }
    return ((_b = this.groupedDataMap.allDayPanelGroupedMap[groupIndex]) === null || _b === void 0 ? void 0 : _b.length) > 0;
  };
  _proto.isGroupIntersectDateInterval = function isGroupIntersectDateInterval(groupIndex, startDate, endDate) {
    const groupStartDate = this.getGroupStartDate(groupIndex);
    const groupEndDate = this.getGroupEndDate(groupIndex);
    return startDate < groupEndDate && endDate > groupStartDate;
  };
  _proto.findGlobalCellPosition = function findGlobalCellPosition(date) {
    let groupIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    let allDay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    const {
      completeViewDataMap
    } = this;
    const showAllDayPanel = this._options.isAllDayPanelVisible;
    for (let rowIndex = 0; rowIndex < completeViewDataMap.length; rowIndex += 1) {
      const currentRow = completeViewDataMap[rowIndex];
      for (let columnIndex = 0; columnIndex < currentRow.length; columnIndex += 1) {
        const cellData = currentRow[columnIndex];
        const {
          startDate: currentStartDate,
          endDate: currentEndDate,
          groupIndex: currentGroupIndex,
          allDay: currentAllDay
        } = cellData;
        if (groupIndex === currentGroupIndex && allDay === !!currentAllDay && this._compareDatesAndAllDay(date, currentStartDate, currentEndDate, allDay)) {
          return {
            position: {
              columnIndex,
              rowIndex: showAllDayPanel && !this._options.isVerticalGrouping ? rowIndex - 1 : rowIndex
            },
            cellData
          };
        }
      }
    }
    return undefined;
  };
  _proto._compareDatesAndAllDay = function _compareDatesAndAllDay(date, cellStartDate, cellEndDate, allDay) {
    return allDay ? _date.default.sameDate(date, cellStartDate) : date >= cellStartDate && date < cellEndDate;
  };
  _proto.getSkippedDaysCount = function getSkippedDaysCount(groupIndex, startDate, endDate, daysCount) {
    const {
      dateTableGroupedMap
    } = this._groupedDataMapProvider.groupedDataMap;
    const groupedData = dateTableGroupedMap[groupIndex];
    let includedDays = 0;
    for (let rowIndex = 0; rowIndex < groupedData.length; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < groupedData[rowIndex].length; columnIndex += 1) {
        const cell = groupedData[rowIndex][columnIndex].cellData;
        if (startDate.getTime() < cell.endDate.getTime() && endDate.getTime() > cell.startDate.getTime()) {
          includedDays += 1;
        }
      }
    }
    const lastCell = groupedData[groupedData.length - 1][groupedData[0].length - 1].cellData;
    const lastCellStart = _date.default.trimTime(lastCell.startDate);
    const daysAfterView = Math.floor((endDate.getTime() - lastCellStart.getTime()) / _date.default.dateToMilliseconds('day'));
    const deltaDays = daysAfterView > 0 ? daysAfterView : 0;
    return daysCount - includedDays - deltaDays;
  };
  _proto.getColumnsCount = function getColumnsCount() {
    const {
      dateTableMap
    } = this.viewDataMap;
    return dateTableMap ? dateTableMap[0].length : 0;
  };
  _proto.getViewEdgeIndices = function getViewEdgeIndices(isAllDayPanel) {
    if (isAllDayPanel) {
      return {
        firstColumnIndex: 0,
        lastColumnIndex: this.viewDataMap.allDayPanelMap.length - 1,
        firstRowIndex: 0,
        lastRowIndex: 0
      };
    }
    return {
      firstColumnIndex: 0,
      lastColumnIndex: this.viewDataMap.dateTableMap[0].length - 1,
      firstRowIndex: 0,
      lastRowIndex: this.viewDataMap.dateTableMap.length - 1
    };
  };
  _proto.getGroupEdgeIndices = function getGroupEdgeIndices(groupIndex, isAllDay) {
    const groupedDataMap = this.groupedDataMap.dateTableGroupedMap[groupIndex];
    const cellsCount = groupedDataMap[0].length;
    const rowsCount = groupedDataMap.length;
    const firstColumnIndex = groupedDataMap[0][0].position.columnIndex;
    const lastColumnIndex = groupedDataMap[0][cellsCount - 1].position.columnIndex;
    if (isAllDay) {
      return {
        firstColumnIndex,
        lastColumnIndex,
        firstRowIndex: 0,
        lastRowIndex: 0
      };
    }
    return {
      firstColumnIndex,
      lastColumnIndex,
      firstRowIndex: groupedDataMap[0][0].position.rowIndex,
      lastRowIndex: groupedDataMap[rowsCount - 1][0].position.rowIndex
    };
  };
  _proto.isSameCell = function isSameCell(firstCellData, secondCellData) {
    const {
      startDate: firstStartDate,
      groupIndex: firstGroupIndex,
      allDay: firstAllDay,
      index: firstIndex
    } = firstCellData;
    const {
      startDate: secondStartDate,
      groupIndex: secondGroupIndex,
      allDay: secondAllDay,
      index: secondIndex
    } = secondCellData;
    return firstStartDate.getTime() === secondStartDate.getTime() && firstGroupIndex === secondGroupIndex && firstAllDay === secondAllDay && firstIndex === secondIndex;
  };
  _proto.getLastViewDate = function getLastViewDate() {
    const {
      completeViewDataMap
    } = this;
    const rowsCount = completeViewDataMap.length - 1;
    return completeViewDataMap[rowsCount][completeViewDataMap[rowsCount].length - 1].endDate;
  };
  _proto.getStartViewDate = function getStartViewDate() {
    return this._options.startViewDate;
  };
  _proto.getIntervalDuration = function getIntervalDuration(intervalCount) {
    return this.viewDataGenerator._getIntervalDuration(intervalCount);
  };
  _proto.getLastCellEndDate = function getLastCellEndDate() {
    const lastEndDate = new Date(this.getLastViewDate().getTime() - _date.default.dateToMilliseconds('minute'));
    return _date2.dateUtilsTs.addOffsets(lastEndDate, [-this._options.viewOffset]);
  };
  _proto.getLastViewDateByEndDayHour = function getLastViewDateByEndDayHour(endDayHour) {
    const lastCellEndDate = this.getLastCellEndDate();
    const endTime = _date.default.dateTimeFromDecimal(endDayHour);
    const endDateOfLastViewCell = new Date(lastCellEndDate.setHours(endTime.hours, endTime.minutes));
    return this._adjustEndDateByDaylightDiff(lastCellEndDate, endDateOfLastViewCell);
  };
  _proto._adjustEndDateByDaylightDiff = function _adjustEndDateByDaylightDiff(startDate, endDate) {
    const daylightDiff = _m_utils_time_zone.default.getDaylightOffsetInMs(startDate, endDate);
    const endDateOfLastViewCell = new Date(endDate.getTime() - daylightDiff);
    return new Date(endDateOfLastViewCell.getTime() - _date.default.dateToMilliseconds('minute'));
  };
  _proto.getCellCountInDay = function getCellCountInDay(startDayHour, endDayHour, hoursInterval) {
    return this.viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
  };
  _proto.getCellCount = function getCellCount(options) {
    return this.viewDataGenerator.getCellCount(options);
  };
  _proto.getRowCount = function getRowCount(options) {
    return this.viewDataGenerator.getRowCount(options);
  };
  _proto.getVisibleDayDuration = function getVisibleDayDuration(startDayHour, endDayHour, hoursInterval) {
    return this.viewDataGenerator.getVisibleDayDuration(startDayHour, endDayHour, hoursInterval);
  };
  _proto._getRowCountWithAllDayRows = function _getRowCountWithAllDayRows() {
    const allDayRowCount = this._options.isAllDayPanelVisible ? 1 : 0;
    return this.getRowCount(this._options) + allDayRowCount;
  };
  _proto.getFirstDayOfWeek = function getFirstDayOfWeek(firstDayOfWeekOption) {
    return this.viewDataGenerator.getFirstDayOfWeek(firstDayOfWeekOption);
  };
  _proto.setViewOptions = function setViewOptions(options) {
    this._options = this._transformRenderOptions(options);
  };
  _proto.getViewOptions = function getViewOptions() {
    return this._options;
  };
  _proto.getViewPortGroupCount = function getViewPortGroupCount() {
    const {
      dateTableGroupedMap
    } = this.groupedDataMap;
    return (dateTableGroupedMap === null || dateTableGroupedMap === void 0 ? void 0 : dateTableGroupedMap.length) || 0;
  };
  _proto.getCellsBetween = function getCellsBetween(first, last) {
    var _a, _b;
    const [firstCell, lastCell] = this.normalizeCellsOrder(first, last);
    const {
      index: firstIdx
    } = firstCell;
    const {
      index: lastIdx
    } = lastCell;
    const cellMatrix = this.getCellsByGroupIndexAndAllDay((_a = firstCell.groupIndex) !== null && _a !== void 0 ? _a : 0, (_b = lastCell.allDay) !== null && _b !== void 0 ? _b : false);
    return (0, _index.isHorizontalView)(this.viewType) ? this.getCellsBetweenHorizontalView(cellMatrix, firstIdx, lastIdx) : this.getCellsBetweenVerticalView(cellMatrix, firstIdx, lastIdx);
  };
  _proto.getCellsBetweenHorizontalView = function getCellsBetweenHorizontalView(cellMatrix, firstIdx, lastIdx) {
    return cellMatrix.reduce((result, row) => result.concat(row.filter(_ref2 => {
      let {
        index
      } = _ref2;
      return firstIdx <= index && index <= lastIdx;
    })), []);
  };
  _proto.getCellsBetweenVerticalView = function getCellsBetweenVerticalView(cellMatrix, firstIdx, lastIdx) {
    var _a, _b;
    const result = [];
    const matrixHeight = cellMatrix.length;
    const matrixWidth = (_b = (_a = cellMatrix[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    let inSegment = false;
    for (let columnIdx = 0; columnIdx < matrixWidth; columnIdx += 1) {
      for (let rowIdx = 0; rowIdx < matrixHeight; rowIdx += 1) {
        const cell = cellMatrix[rowIdx][columnIdx];
        const {
          index: cellIdx
        } = cell;
        if (cellIdx === firstIdx) {
          inSegment = true;
        }
        if (inSegment) {
          result.push(cell);
        }
        if (cellIdx === lastIdx) {
          return result;
        }
      }
    }
    // NOTE: It's redundant return, but a function must always have a return statement.
    return result;
  };
  _proto.normalizeCellsOrder = function normalizeCellsOrder(firstSelectedCell, lastSelectedCell) {
    return firstSelectedCell.startDate > lastSelectedCell.startDate ? [lastSelectedCell, firstSelectedCell] : [firstSelectedCell, lastSelectedCell];
  };
  _createClass(ViewDataProvider, [{
    key: "groupedDataMap",
    get: function () {
      return this._groupedDataMapProvider.groupedDataMap;
    }
  }, {
    key: "hiddenInterval",
    get: function () {
      return this.viewDataGenerator.hiddenInterval;
    }
  }]);
  return ViewDataProvider;
}();