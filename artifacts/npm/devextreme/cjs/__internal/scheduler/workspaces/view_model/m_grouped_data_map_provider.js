/**
* DevExtreme (cjs/__internal/scheduler/workspaces/view_model/m_grouped_data_map_provider.js)
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
exports.GroupedDataMapProvider = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _date2 = require("../../../core/utils/date");
var _index = require("../../__migration/utils/index");
var _m_utils_time_zone = _interopRequireDefault(require("../../m_utils_time_zone"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
let GroupedDataMapProvider = exports.GroupedDataMapProvider = /*#__PURE__*/function () {
  function GroupedDataMapProvider(viewDataGenerator, viewDataMap, completeViewDataMap, viewOptions) {
    this.groupedDataMap = viewDataGenerator.generateGroupedDataMap(viewDataMap);
    this.completeViewDataMap = completeViewDataMap;
    this._viewOptions = viewOptions;
  }
  var _proto = GroupedDataMapProvider.prototype;
  _proto.getGroupStartDate = function getGroupStartDate(groupIndex) {
    var _a, _b, _c;
    const firstRow = this.getFirstGroupRow(groupIndex);
    return (_c = (_b = (_a = firstRow === null || firstRow === void 0 ? void 0 : firstRow[0]) === null || _a === void 0 ? void 0 : _a.cellData) === null || _b === void 0 ? void 0 : _b.startDate) !== null && _c !== void 0 ? _c : null;
  };
  _proto.getGroupEndDate = function getGroupEndDate(groupIndex) {
    const lastRow = this.getLastGroupRow(groupIndex);
    if (lastRow) {
      const lastColumnIndex = lastRow.length - 1;
      const {
        cellData
      } = lastRow[lastColumnIndex];
      const {
        endDate
      } = cellData;
      return endDate;
    }
  };
  _proto.findGroupCellStartDate = function findGroupCellStartDate(groupIndex, startDate, endDate, isFindByDate) {
    const groupData = this.getGroupFromDateTableGroupMap(groupIndex);
    const checkCellStartDate = (rowIndex, columnIndex) => {
      const {
        cellData
      } = groupData[rowIndex][columnIndex];
      let {
        startDate: secondMin,
        endDate: secondMax
      } = cellData;
      if (isFindByDate) {
        secondMin = _date.default.trimTime(secondMin);
        secondMax = _date.default.setToDayEnd(secondMin);
      }
      if (_date.default.intervalsOverlap({
        firstMin: startDate,
        firstMax: endDate,
        secondMin,
        secondMax
      })) {
        return secondMin;
      }
    };
    const searchVertical = () => {
      const cellCount = groupData[0].length;
      for (let columnIndex = 0; columnIndex < cellCount; ++columnIndex) {
        for (let rowIndex = 0; rowIndex < groupData.length; ++rowIndex) {
          const result = checkCellStartDate(rowIndex, columnIndex);
          if (result) return result;
        }
      }
    };
    const searchHorizontal = () => {
      for (let rowIndex = 0; rowIndex < groupData.length; ++rowIndex) {
        const row = groupData[rowIndex];
        for (let columnIndex = 0; columnIndex < row.length; ++columnIndex) {
          const result = checkCellStartDate(rowIndex, columnIndex);
          if (result) return result;
        }
      }
    };
    const startDateVerticalSearch = searchVertical();
    const startDateHorizontalSearch = searchHorizontal();
    return startDateVerticalSearch > startDateHorizontalSearch ? startDateHorizontalSearch : startDateVerticalSearch;
  };
  _proto.findAllDayGroupCellStartDate = function findAllDayGroupCellStartDate(groupIndex) {
    var _a, _b, _c;
    const groupedData = this.getGroupFromDateTableGroupMap(groupIndex);
    const cellData = (_b = (_a = groupedData === null || groupedData === void 0 ? void 0 : groupedData[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.cellData;
    return (_c = cellData === null || cellData === void 0 ? void 0 : cellData.startDate) !== null && _c !== void 0 ? _c : null;
  };
  _proto.findCellPositionInMap = function findCellPositionInMap(cellInfo, isAppointmentRender) {
    const {
      groupIndex,
      startDate,
      isAllDay,
      index
    } = cellInfo;
    const {
      allDayPanelGroupedMap,
      dateTableGroupedMap
    } = this.groupedDataMap;
    const {
      viewOffset
    } = this._viewOptions;
    const rows = isAllDay && !this._viewOptions.isVerticalGrouping ? allDayPanelGroupedMap[groupIndex] ? [allDayPanelGroupedMap[groupIndex]] : [] : dateTableGroupedMap[groupIndex] || [];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      const row = rows[rowIndex];
      for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
        const cell = row[columnIndex];
        // NOTE: If this is appointment's render call
        // we should shift the real cellData dates by viewOffset
        // to find correct cell indexes.
        const cellData = isAppointmentRender ? _extends(_extends({}, cell.cellData), {
          startDate: _date2.dateUtilsTs.addOffsets(cell.cellData.startDate, [-viewOffset]),
          endDate: _date2.dateUtilsTs.addOffsets(cell.cellData.endDate, [-viewOffset])
        }) : cell.cellData;
        if (this._isSameGroupIndexAndIndex(cellData, groupIndex, index)) {
          if (this.isStartDateInCell(startDate, isAllDay, cellData)) {
            return cell.position;
          }
        }
      }
    }
    return undefined;
  };
  _proto.isStartDateInCell = function isStartDateInCell(startDate, inAllDayRow, _ref) {
    let {
      startDate: cellStartDate,
      endDate: cellEndDate,
      allDay: cellAllDay
    } = _ref;
    const {
      viewType
    } = this._viewOptions;
    const cellDatesSummerToWinterDiffMs = _m_utils_time_zone.default.getSummerToWinterTimeDSTDiffMs(cellStartDate, cellEndDate);
    const summerToWinterDiffMs = _m_utils_time_zone.default.getSummerToWinterTimeDSTDiffMs(cellStartDate, startDate);
    const isSummerToWinterDSTChangeEdgeCase = cellDatesSummerToWinterDiffMs === 0 && summerToWinterDiffMs > 0;
    switch (true) {
      case !(0, _index.isDateAndTimeView)(viewType):
      case inAllDayRow && cellAllDay:
        return _date.default.sameDate(startDate, cellStartDate);
      case !inAllDayRow && !isSummerToWinterDSTChangeEdgeCase:
        return startDate >= cellStartDate && startDate < cellEndDate;
      case !inAllDayRow && isSummerToWinterDSTChangeEdgeCase:
        return this.handleSummerToWinterDSTEdgeCase(startDate, summerToWinterDiffMs, cellStartDate, cellEndDate);
      default:
        return false;
    }
  };
  _proto.handleSummerToWinterDSTEdgeCase = function handleSummerToWinterDSTEdgeCase(startDate, summerTimeDSTDiffMs, cellStartDate, cellEndDate) {
    const nextTimezoneCellStartDate = _date2.dateUtilsTs.addOffsets(cellStartDate, [summerTimeDSTDiffMs]);
    const nextTimezoneCellEndDate = _date2.dateUtilsTs.addOffsets(cellEndDate, [summerTimeDSTDiffMs]);
    const isInPreviousTimezoneCell = startDate >= cellStartDate && startDate < cellEndDate;
    const isInNextTimezoneCell = startDate >= nextTimezoneCellStartDate && startDate < nextTimezoneCellEndDate;
    return isInPreviousTimezoneCell || isInNextTimezoneCell;
  };
  _proto._isSameGroupIndexAndIndex = function _isSameGroupIndexAndIndex(cellData, groupIndex, index) {
    return cellData.groupIndex === groupIndex && (index === undefined || cellData.index === index);
  };
  _proto.getCellsGroup = function getCellsGroup(groupIndex) {
    const {
      dateTableGroupedMap
    } = this.groupedDataMap;
    const groupData = dateTableGroupedMap[groupIndex];
    if (groupData) {
      const {
        cellData
      } = groupData[0][0];
      return cellData.groups;
    }
  };
  _proto.getCompletedGroupsInfo = function getCompletedGroupsInfo() {
    const {
      dateTableGroupedMap
    } = this.groupedDataMap;
    return dateTableGroupedMap.map(groupData => {
      const firstCell = groupData[0][0];
      const {
        allDay,
        groupIndex
      } = firstCell.cellData;
      return {
        allDay,
        groupIndex,
        startDate: this.getGroupStartDate(groupIndex),
        endDate: this.getGroupEndDate(groupIndex)
      };
    }).filter(_ref2 => {
      let {
        startDate
      } = _ref2;
      return !!startDate;
    });
  };
  _proto.getGroupIndices = function getGroupIndices() {
    return this.getCompletedGroupsInfo().map(_ref3 => {
      let {
        groupIndex
      } = _ref3;
      return groupIndex;
    });
  };
  _proto.getGroupFromDateTableGroupMap = function getGroupFromDateTableGroupMap(groupIndex) {
    const {
      dateTableGroupedMap
    } = this.groupedDataMap;
    return dateTableGroupedMap[groupIndex];
  };
  _proto.getFirstGroupRow = function getFirstGroupRow(groupIndex) {
    const groupedData = this.getGroupFromDateTableGroupMap(groupIndex);
    if (groupedData) {
      const {
        cellData
      } = groupedData[0][0];
      return !cellData.allDay ? groupedData[0] : groupedData[1];
    }
  };
  _proto.getLastGroupRow = function getLastGroupRow(groupIndex) {
    const {
      dateTableGroupedMap
    } = this.groupedDataMap;
    const groupedData = dateTableGroupedMap[groupIndex];
    if (groupedData) {
      const lastRowIndex = groupedData.length - 1;
      return groupedData[lastRowIndex];
    }
  };
  _proto.getLastGroupCellPosition = function getLastGroupCellPosition(groupIndex) {
    const groupRow = this.getLastGroupRow(groupIndex);
    // eslint-disable-next-line no-unsafe-optional-chaining
    return groupRow === null || groupRow === void 0 ? void 0 : groupRow[(groupRow === null || groupRow === void 0 ? void 0 : groupRow.length) - 1].position;
  };
  _proto.getRowCountInGroup = function getRowCountInGroup(groupIndex) {
    const groupRow = this.getLastGroupRow(groupIndex);
    const cellAmount = groupRow.length;
    const lastCellData = groupRow[cellAmount - 1].cellData;
    const lastCellIndex = lastCellData.index;
    return (lastCellIndex + 1) / groupRow.length;
  };
  return GroupedDataMapProvider;
}();
