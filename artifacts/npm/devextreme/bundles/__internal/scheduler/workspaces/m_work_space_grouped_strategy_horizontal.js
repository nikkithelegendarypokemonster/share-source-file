/**
* DevExtreme (bundles/__internal/scheduler/workspaces/m_work_space_grouped_strategy_horizontal.js)
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
var _position = require("../../../core/utils/position");
var _m_classes = require("../m_classes");
let HorizontalGroupedStrategy = /*#__PURE__*/function () {
  function HorizontalGroupedStrategy(_workSpace) {
    this._workSpace = _workSpace;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var _proto = HorizontalGroupedStrategy.prototype;
  _proto.prepareCellIndexes = function prepareCellIndexes(cellCoordinates, groupIndex, inAllDay) {
    const groupByDay = this._workSpace.isGroupedByDate();
    if (!groupByDay) {
      return {
        rowIndex: cellCoordinates.rowIndex,
        columnIndex: cellCoordinates.columnIndex + groupIndex * this._workSpace._getCellCount()
      };
    }
    return {
      rowIndex: cellCoordinates.rowIndex,
      columnIndex: cellCoordinates.columnIndex * this._workSpace._getGroupCount() + groupIndex
    };
  };
  _proto.getGroupIndex = function getGroupIndex(rowIndex, columnIndex) {
    const groupByDay = this._workSpace.isGroupedByDate();
    const groupCount = this._workSpace._getGroupCount();
    if (groupByDay) {
      return columnIndex % groupCount;
    }
    return Math.floor(columnIndex / this._workSpace._getCellCount());
  };
  _proto.calculateHeaderCellRepeatCount = function calculateHeaderCellRepeatCount() {
    return this._workSpace._getGroupCount() || 1;
  };
  _proto.insertAllDayRowsIntoDateTable = function insertAllDayRowsIntoDateTable() {
    return false;
  };
  _proto.getTotalCellCount = function getTotalCellCount(groupCount) {
    groupCount = groupCount || 1;
    return this._workSpace._getCellCount() * groupCount;
  };
  _proto.getTotalRowCount = function getTotalRowCount() {
    return this._workSpace._getRowCount();
  };
  _proto.calculateTimeCellRepeatCount = function calculateTimeCellRepeatCount() {
    return 1;
  };
  _proto.getWorkSpaceMinWidth = function getWorkSpaceMinWidth() {
    return (0, _position.getBoundingRect)(this._workSpace.$element().get(0)).width - this._workSpace.getTimePanelWidth();
  };
  _proto.getAllDayOffset = function getAllDayOffset() {
    return this._workSpace.getAllDayHeight();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.getGroupCountClass = function getGroupCountClass(groups) {
    return undefined;
  };
  _proto.getLeftOffset = function getLeftOffset() {
    return this._workSpace.getTimePanelWidth();
  };
  _proto._createGroupBoundOffset = function _createGroupBoundOffset(startCell, endCell, cellWidth) {
    const extraOffset = cellWidth / 2;
    const startOffset = startCell ? startCell.offset().left - extraOffset : 0;
    const endOffset = endCell ? endCell.offset().left + cellWidth + extraOffset : 0;
    return {
      left: startOffset,
      right: endOffset,
      top: 0,
      bottom: 0
    };
  };
  _proto._getGroupedByDateBoundOffset = function _getGroupedByDateBoundOffset($cells, cellWidth) {
    const firstCellIndex = 0;
    const lastCellIndex = $cells.length - 1;
    const startCell = $cells.eq(firstCellIndex);
    const endCell = $cells.eq(lastCellIndex);
    return this._createGroupBoundOffset(startCell, endCell, cellWidth);
  };
  _proto.getGroupBoundsOffset = function getGroupBoundsOffset(cellCount, $cells, cellWidth, coordinates, groupedDataMap) {
    if (this._workSpace.isGroupedByDate()) {
      return this._getGroupedByDateBoundOffset($cells, cellWidth);
    }
    let startCell;
    let endCell;
    const cellIndex = this._workSpace.getCellIndexByCoordinates(coordinates);
    const groupIndex = coordinates.groupIndex || Math.floor(cellIndex / cellCount);
    const currentCellGroup = groupedDataMap.dateTableGroupedMap[groupIndex];
    if (currentCellGroup) {
      const groupRowLength = currentCellGroup[0].length;
      const groupStartPosition = currentCellGroup[0][0].position;
      const groupEndPosition = currentCellGroup[0][groupRowLength - 1].position;
      startCell = $cells.eq(groupStartPosition.columnIndex);
      endCell = $cells.eq(groupEndPosition.columnIndex);
    }
    return this._createGroupBoundOffset(startCell, endCell, cellWidth);
  };
  _proto.shiftIndicator = function shiftIndicator($indicator, height, rtlOffset, groupIndex) {
    const offset = this._getIndicatorOffset(groupIndex);
    const horizontalOffset = rtlOffset ? rtlOffset - offset : offset;
    $indicator.css('left', horizontalOffset);
    $indicator.css('top', height);
  };
  _proto._getIndicatorOffset = function _getIndicatorOffset(groupIndex) {
    const groupByDay = this._workSpace.isGroupedByDate();
    return groupByDay ? this._calculateGroupByDateOffset(groupIndex) : this._calculateOffset(groupIndex);
  };
  _proto._calculateOffset = function _calculateOffset(groupIndex) {
    const indicatorStartPosition = this._workSpace.getIndicatorOffset(groupIndex);
    const offset = this._workSpace._getCellCount() * this._workSpace.getRoundedCellWidth(groupIndex - 1, 0) * groupIndex;
    return indicatorStartPosition + offset;
  };
  _proto._calculateGroupByDateOffset = function _calculateGroupByDateOffset(groupIndex) {
    return this._workSpace.getIndicatorOffset(0) * this._workSpace._getGroupCount() + this._workSpace.getRoundedCellWidth(groupIndex - 1, 0) * groupIndex;
  };
  _proto.getShaderOffset = function getShaderOffset(i, width) {
    const offset = this._workSpace._getCellCount() * this._workSpace.getRoundedCellWidth(i - 1) * i;
    return this._workSpace.option('rtlEnabled') ? (0, _position.getBoundingRect)(this._workSpace._dateTableScrollable.$content().get(0)).width - offset - this._workSpace.getTimePanelWidth() - width : offset;
  };
  _proto.getShaderTopOffset = function getShaderTopOffset(i) {
    return -this.getShaderMaxHeight() * (i > 0 ? 1 : 0);
  };
  _proto.getShaderHeight = function getShaderHeight() {
    const height = this._workSpace.getIndicationHeight();
    return height;
  };
  _proto.getShaderMaxHeight = function getShaderMaxHeight() {
    return (0, _position.getBoundingRect)(this._workSpace._dateTableScrollable.$content().get(0)).height;
  };
  _proto.getShaderWidth = function getShaderWidth(i) {
    return this._workSpace.getIndicationWidth(i);
  };
  _proto.getScrollableScrollTop = function getScrollableScrollTop(allDay) {
    return !allDay ? this._workSpace.getScrollable().scrollTop() : 0;
  }
  // ---------------
  // We do not need these nethods in renovation
  // ---------------
  ;
  _proto.addAdditionalGroupCellClasses = function addAdditionalGroupCellClasses(cellClass, index, i, j) {
    let applyUnconditionally = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    cellClass = this._addLastGroupCellClass(cellClass, index, applyUnconditionally);
    return this._addFirstGroupCellClass(cellClass, index, applyUnconditionally);
  };
  _proto._addLastGroupCellClass = function _addLastGroupCellClass(cellClass, index, applyUnconditionally) {
    if (applyUnconditionally) {
      return "".concat(cellClass, " ").concat(_m_classes.LAST_GROUP_CELL_CLASS);
    }
    const groupByDate = this._workSpace.isGroupedByDate();
    if (groupByDate) {
      if (index % this._workSpace._getGroupCount() === 0) {
        return "".concat(cellClass, " ").concat(_m_classes.LAST_GROUP_CELL_CLASS);
      }
    } else if (index % this._workSpace._getCellCount() === 0) {
      return "".concat(cellClass, " ").concat(_m_classes.LAST_GROUP_CELL_CLASS);
    }
    return cellClass;
  };
  _proto._addFirstGroupCellClass = function _addFirstGroupCellClass(cellClass, index, applyUnconditionally) {
    if (applyUnconditionally) {
      return "".concat(cellClass, " ").concat(_m_classes.FIRST_GROUP_CELL_CLASS);
    }
    const groupByDate = this._workSpace.isGroupedByDate();
    if (groupByDate) {
      if ((index - 1) % this._workSpace._getGroupCount() === 0) {
        return "".concat(cellClass, " ").concat(_m_classes.FIRST_GROUP_CELL_CLASS);
      }
    } else if ((index - 1) % this._workSpace._getCellCount() === 0) {
      return "".concat(cellClass, " ").concat(_m_classes.FIRST_GROUP_CELL_CLASS);
    }
    return cellClass;
  };
  return HorizontalGroupedStrategy;
}();
var _default = exports.default = HorizontalGroupedStrategy;
