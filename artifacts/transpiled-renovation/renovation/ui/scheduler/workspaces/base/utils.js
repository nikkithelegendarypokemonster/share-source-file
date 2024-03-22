"use strict";

exports.isCellAllDay = exports.getTotalRowCount = exports.getTotalCellCount = exports.getRowCountWithAllDayRow = exports.getHiddenInterval = exports.getDateTableWidth = exports.getDateForHeaderText = exports.getCellIndices = exports.createVirtualScrollingOptions = exports.createCellElementMetaData = exports.compareCellsByDateAndIndex = exports.DATE_TABLE_MIN_CELL_WIDTH = void 0;
var _date = _interopRequireDefault(require("../../../../../core/utils/date"));
var _const = require("../const");
var _index = require("../../../../../__internal/scheduler/__migration/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DAY_MS = _date.default.dateToMilliseconds('day');
const HOUR_MS = _date.default.dateToMilliseconds('hour');
const DATE_TABLE_MIN_CELL_WIDTH = exports.DATE_TABLE_MIN_CELL_WIDTH = 75;
const getTotalRowCount = (rowCount, groupOrientation, groups, isAllDayPanelVisible) => {
  const isVerticalGrouping = (0, _index.isVerticalGroupingApplied)(groups, groupOrientation);
  const groupCount = (0, _index.getGroupCount)(groups);
  const totalRowCount = isVerticalGrouping ? rowCount * groupCount : rowCount;
  return isAllDayPanelVisible ? totalRowCount + groupCount : totalRowCount;
};
exports.getTotalRowCount = getTotalRowCount;
const getTotalCellCount = (cellCount, groupOrientation, groups) => {
  const isHorizontalGrouping = (0, _index.isHorizontalGroupingApplied)(groups, groupOrientation);
  const groupCount = (0, _index.getGroupCount)(groups);
  return isHorizontalGrouping ? cellCount * groupCount : cellCount;
};
exports.getTotalCellCount = getTotalCellCount;
const getRowCountWithAllDayRow = (rowCount, isAllDayPanelVisible) => isAllDayPanelVisible ? rowCount + 1 : rowCount;
exports.getRowCountWithAllDayRow = getRowCountWithAllDayRow;
const getHiddenInterval = (hoursInterval, cellCountInDay) => {
  const visibleInterval = hoursInterval * cellCountInDay * HOUR_MS;
  return DAY_MS - visibleInterval;
};
exports.getHiddenInterval = getHiddenInterval;
const createCellElementMetaData = (tableRect, cellRect) => {
  const {
    bottom,
    height,
    left,
    right,
    top,
    width,
    x,
    y
  } = cellRect;
  return {
    right,
    bottom,
    left: left - tableRect.left,
    top: top - tableRect.top,
    width,
    height,
    x,
    y
  };
};
exports.createCellElementMetaData = createCellElementMetaData;
const getDateForHeaderText = (_, date) => date;
exports.getDateForHeaderText = getDateForHeaderText;
const getDateTableWidth = (scrollableWidth, dateTable, viewDataProvider, workSpaceConfig) => {
  const dateTableCell = dateTable.querySelector('td:not(.dx-scheduler-virtual-cell)');
  let cellWidth = dateTableCell.getBoundingClientRect().width;
  if (cellWidth < DATE_TABLE_MIN_CELL_WIDTH) {
    cellWidth = DATE_TABLE_MIN_CELL_WIDTH;
  }
  const cellCount = viewDataProvider.getCellCount(workSpaceConfig);
  const totalCellCount = getTotalCellCount(cellCount, workSpaceConfig.groupOrientation, workSpaceConfig.groups);
  const minTablesWidth = totalCellCount * cellWidth;
  return scrollableWidth < minTablesWidth ? minTablesWidth : scrollableWidth;
};
exports.getDateTableWidth = getDateTableWidth;
const createVirtualScrollingOptions = options => ({
  getCellHeight: () => options.cellHeight,
  getCellWidth: () => options.cellWidth,
  getCellMinWidth: () => DATE_TABLE_MIN_CELL_WIDTH,
  isRTL: () => options.rtlEnabled,
  getSchedulerHeight: () => options.schedulerHeight,
  getSchedulerWidth: () => options.schedulerWidth,
  getViewHeight: () => options.viewHeight,
  getViewWidth: () => options.viewWidth,
  getScrolling: () => options.scrolling,
  getScrollableOuterWidth: () => options.scrollableWidth,
  getGroupCount: () => (0, _index.getGroupCount)(options.groups),
  isVerticalGrouping: () => options.isVerticalGrouping,
  getTotalRowCount: () => options.completeRowCount,
  getTotalCellCount: () => options.completeColumnCount,
  getWindowHeight: () => options.windowHeight,
  getWindowWidth: () => options.windowWidth
});
exports.createVirtualScrollingOptions = createVirtualScrollingOptions;
const getCellIndices = cell => {
  const row = cell.closest(".".concat(_const.DATE_TABLE_ROW_CLASS, ", .").concat(_const.ALL_DAY_ROW_CLASS));
  const rowParent = row.parentNode;
  const cellParent = cell.parentNode;
  const columnIndex = [...Array.from(cellParent.children)].filter(child => child.className.includes(_const.DATE_TABLE_CELL_CLASS) || child.className.includes(_const.ALL_DAY_PANEL_CELL_CLASS)).indexOf(cell);
  const rowIndex = [...Array.from(rowParent.children)].filter(child => child.className.includes(_const.DATE_TABLE_ROW_CLASS)).indexOf(row);
  return {
    columnIndex,
    rowIndex
  };
};
exports.getCellIndices = getCellIndices;
const compareCellsByDateAndIndex = daysAndIndexes => {
  const {
    date,
    firstDate,
    firstIndex,
    index,
    lastDate,
    lastIndex
  } = daysAndIndexes;
  if (firstDate === lastDate) {
    let validFirstIndex = firstIndex;
    let validLastIndex = lastIndex;
    if (validFirstIndex > validLastIndex) {
      [validFirstIndex, validLastIndex] = [validLastIndex, validFirstIndex];
    }
    return firstDate === date && index >= validFirstIndex && index <= validLastIndex;
  }
  return date === firstDate && index >= firstIndex || date === lastDate && index <= lastIndex || firstDate < date && date < lastDate;
};
exports.compareCellsByDateAndIndex = compareCellsByDateAndIndex;
const isCellAllDay = cell => cell.className.includes(_const.ALL_DAY_PANEL_CELL_CLASS);
exports.isCellAllDay = isCellAllDay;