/**
* DevExtreme (bundles/__internal/scheduler/workspaces/m_work_space_grouped_strategy_vertical.js)
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
var _index = require("../__migration/utils/index");
var _m_classes = require("../m_classes");
var _m_cache = require("./m_cache");
const WORK_SPACE_BORDER = 1;
let VerticalGroupedStrategy = /*#__PURE__*/function () {
  function VerticalGroupedStrategy(_workSpace) {
    this._workSpace = _workSpace;
    this.cache = new _m_cache.Cache();
  }
  var _proto = VerticalGroupedStrategy.prototype;
  _proto.prepareCellIndexes = function prepareCellIndexes(cellCoordinates, groupIndex, inAllDayRow) {
    let rowIndex = cellCoordinates.rowIndex + groupIndex * this._workSpace._getRowCount();
    if (this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
      rowIndex += groupIndex;
      if (!inAllDayRow) {
        rowIndex += 1;
      }
    }
    return {
      rowIndex,
      columnIndex: cellCoordinates.columnIndex
    };
  };
  _proto.getGroupIndex = function getGroupIndex(rowIndex) {
    return Math.floor(rowIndex / this._workSpace._getRowCount());
  };
  _proto.calculateHeaderCellRepeatCount = function calculateHeaderCellRepeatCount() {
    return 1;
  };
  _proto.insertAllDayRowsIntoDateTable = function insertAllDayRowsIntoDateTable() {
    return this._workSpace.option('showAllDayPanel');
  };
  _proto.getTotalCellCount = function getTotalCellCount() {
    return this._workSpace._getCellCount();
  };
  _proto.getTotalRowCount = function getTotalRowCount() {
    return this._workSpace._getRowCount() * this._workSpace._getGroupCount();
  };
  _proto.calculateTimeCellRepeatCount = function calculateTimeCellRepeatCount() {
    return this._workSpace._getGroupCount() || 1;
  };
  _proto.getWorkSpaceMinWidth = function getWorkSpaceMinWidth() {
    let minWidth = this._workSpace._getWorkSpaceWidth();
    const workspaceContainerWidth = (0, _position.getBoundingRect)(this._workSpace.$element().get(0)).width - this._workSpace.getTimePanelWidth() - this._workSpace.getGroupTableWidth() - 2 * WORK_SPACE_BORDER;
    if (minWidth < workspaceContainerWidth) {
      minWidth = workspaceContainerWidth;
    }
    return minWidth;
  };
  _proto.getAllDayOffset = function getAllDayOffset() {
    return 0;
  };
  _proto.getGroupCountClass = function getGroupCountClass(groups) {
    return (0, _index.getVerticalGroupCountClass)(groups);
  };
  _proto.getLeftOffset = function getLeftOffset() {
    return this._workSpace.getTimePanelWidth() + this._workSpace.getGroupTableWidth();
  };
  _proto.getGroupBoundsOffset = function getGroupBoundsOffset(groupIndex, _ref) {
    let [$firstCell, $lastCell] = _ref;
    return this.cache.get("groupBoundsOffset".concat(groupIndex), () => {
      const startDayHour = this._workSpace.option('startDayHour');
      const endDayHour = this._workSpace.option('endDayHour');
      const hoursInterval = this._workSpace.option('hoursInterval');
      const dayHeight = (0, _index.calculateDayDuration)(startDayHour, endDayHour) / hoursInterval * this._workSpace.getCellHeight();
      const scrollTop = this.getScrollableScrollTop();
      const headerRowHeight = (0, _position.getBoundingRect)(this._workSpace._$headerPanelContainer.get(0)).height;
      let topOffset = groupIndex * dayHeight + headerRowHeight + this._workSpace.option('getHeaderHeight')() - scrollTop;
      if (this._workSpace.option('showAllDayPanel') && this._workSpace.supportAllDayRow()) {
        topOffset += this._workSpace.getCellHeight() * (groupIndex + 1);
      }
      const bottomOffset = topOffset + dayHeight;
      const {
        left
      } = $firstCell.getBoundingClientRect();
      const {
        right
      } = $lastCell.getBoundingClientRect();
      this._groupBoundsOffset = {
        left,
        right,
        top: topOffset,
        bottom: bottomOffset
      };
      return this._groupBoundsOffset;
    });
  };
  _proto.shiftIndicator = function shiftIndicator($indicator, height, rtlOffset, i) {
    const offset = this._workSpace.getIndicatorOffset(0);
    const tableOffset = this._workSpace.option('crossScrollingEnabled') ? 0 : this._workSpace.getGroupTableWidth();
    const horizontalOffset = rtlOffset ? rtlOffset - offset : offset;
    let verticalOffset = this._workSpace._getRowCount() * this._workSpace.getCellHeight() * i;
    if (this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
      verticalOffset += this._workSpace.getAllDayHeight() * (i + 1);
    }
    $indicator.css('left', horizontalOffset + tableOffset);
    $indicator.css('top', height + verticalOffset);
  };
  _proto.getShaderOffset = function getShaderOffset(i, width) {
    const offset = this._workSpace.option('crossScrollingEnabled') ? 0 : this._workSpace.getGroupTableWidth();
    return this._workSpace.option('rtlEnabled') ? (0, _position.getBoundingRect)(this._$container.get(0)).width - offset - this._workSpace.getWorkSpaceLeftOffset() - width : offset;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.getShaderTopOffset = function getShaderTopOffset(i) {
    return 0;
  };
  _proto.getShaderHeight = function getShaderHeight() {
    let height = this._workSpace.getIndicationHeight();
    if (this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
      height += this._workSpace.getCellHeight();
    }
    return height;
  };
  _proto.getShaderMaxHeight = function getShaderMaxHeight() {
    let height = this._workSpace._getRowCount() * this._workSpace.getCellHeight();
    if (this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
      height += this._workSpace.getCellHeight();
    }
    return height;
  };
  _proto.getShaderWidth = function getShaderWidth() {
    return this._workSpace.getIndicationWidth(0);
  };
  _proto.getScrollableScrollTop = function getScrollableScrollTop() {
    return this._workSpace.getScrollable().scrollTop();
  }
  // ------------
  // We do not need these methods in renovation
  // ------------
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.addAdditionalGroupCellClasses = function addAdditionalGroupCellClasses(cellClass, index, i, j) {
    cellClass = this._addLastGroupCellClass(cellClass, i + 1);
    return this._addFirstGroupCellClass(cellClass, i + 1);
  };
  _proto._addLastGroupCellClass = function _addLastGroupCellClass(cellClass, index) {
    if (index % this._workSpace._getRowCount() === 0) {
      return "".concat(cellClass, " ").concat(_m_classes.LAST_GROUP_CELL_CLASS);
    }
    return cellClass;
  };
  _proto._addFirstGroupCellClass = function _addFirstGroupCellClass(cellClass, index) {
    if ((index - 1) % this._workSpace._getRowCount() === 0) {
      return "".concat(cellClass, " ").concat(_m_classes.FIRST_GROUP_CELL_CLASS);
    }
    return cellClass;
  };
  return VerticalGroupedStrategy;
}();
var _default = exports.default = VerticalGroupedStrategy;
