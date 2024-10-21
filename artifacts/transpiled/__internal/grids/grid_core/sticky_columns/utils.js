"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prevColumnIsFixed = exports.normalizeOffset = exports.isLastFixedColumn = exports.isFixedEdge = exports.isFirstFixedColumn = exports.getStickyOffset = exports.getColumnFixedPosition = void 0;
var _type = require("../../../../core/utils/type");
var _m_utils = _interopRequireDefault(require("../../../grids/grid_core/m_utils"));
var _const = require("../adaptivity/const");
var _const2 = require("./const");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getColumnFixedPosition = (that,
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
column) => {
  const {
    fixedPosition
  } = column;
  const rtlEnabled = that.option('rtlEnabled');
  const isDefaultCommandColumn = column.command && !_m_utils.default.isCustomCommandColumn(that._columns, column);
  if (isDefaultCommandColumn && rtlEnabled) {
    return fixedPosition === _const2.StickyPosition.Right ? _const2.StickyPosition.Left : _const2.StickyPosition.Right;
  }
  return fixedPosition ?? _const2.StickyPosition.Left;
};
exports.getColumnFixedPosition = getColumnFixedPosition;
const getStickyOffsetCore = function (columns, widths, columnIndex, fixedPosition, offsets) {
  const column = columns[columnIndex];
  const isChildColumn = (0, _type.isDefined)(column.ownerBand);
  const targetColumnIsRight = fixedPosition === _const2.StickyPosition.Right;
  const targetColumnIsSticky = column.fixedPosition === _const2.StickyPosition.Sticky;
  const processedColumns = targetColumnIsRight ? columns.slice(columnIndex + 1) : columns.slice(0, columnIndex).reverse();
  const processedWidths = targetColumnIsRight ? widths.slice(columnIndex + 1) : widths.slice(0, columnIndex).reverse();
  let offset = 0;
  let adjacentStickyColumnIndex = 0;
  let nonAdjacentStickyColumnCount = targetColumnIsSticky && processedColumns.length ? 1 : 0;
  processedColumns.forEach((col, colIndex) => {
    if (col.fixed && (!(0, _type.isDefined)(offsets) || column.ownerBand === col.ownerBand)) {
      const columnIsSticky = col.fixedPosition === _const2.StickyPosition.Sticky;
      const areNextOnlyFixedColumns = !processedColumns.slice(colIndex + 1).some(_ref => {
        let {
          fixed
        } = _ref;
        return !fixed;
      });
      offset += processedWidths[colIndex];
      if (colIndex === 0 && areNextOnlyFixedColumns) {
        nonAdjacentStickyColumnCount = 0;
      } else if (targetColumnIsSticky && columnIsSticky && !areNextOnlyFixedColumns) {
        if (colIndex !== adjacentStickyColumnIndex) {
          nonAdjacentStickyColumnCount += 1;
          adjacentStickyColumnIndex = colIndex + 1;
        } else {
          adjacentStickyColumnIndex += 1;
        }
      }
    } else if (col.visibleWidth === _const.HIDDEN_COLUMNS_WIDTH) {
      adjacentStickyColumnIndex += 1;
    }
  });
  if (isChildColumn && (0, _type.isDefined)(offsets)) {
    var _offsets$column$owner;
    offset += (offsets === null || offsets === void 0 || (_offsets$column$owner = offsets[column.ownerBand]) === null || _offsets$column$owner === void 0 ? void 0 : _offsets$column$owner[fixedPosition]) ?? 0;
    return offset;
  }
  return offset - nonAdjacentStickyColumnCount * _const2.STICKY_BORDER_WIDTH;
};
const isFirstOrLastColumn = function (that,
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
column, rowIndex) {
  let onlyWithinBandColumn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  let isLast = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  let fixedPosition = arguments.length > 5 ? arguments[5] : undefined;
  const rtlEnabled = that.option('rtlEnabled');
  const methodName = rtlEnabled !== isLast ? 'isLastColumn' : 'isFirstColumn';
  if (column.fixedPosition === _const2.StickyPosition.Sticky) {
    const parentColumn = that.getParentColumn(column) ?? column;
    if (that[methodName](parentColumn, 0)) {
      return false;
    }
  }
  return that[methodName](column, rowIndex, onlyWithinBandColumn, fixedPosition);
};
const getPrevColumn = function (that, column, visibleColumns, rowIndex) {
  const visibleColumnIndex = that.getVisibleIndex(column.index, rowIndex);
  return visibleColumns === null || visibleColumns === void 0 ? void 0 : visibleColumns.slice(0, visibleColumnIndex).reverse().find(col => col.visibleWidth !== _const.HIDDEN_COLUMNS_WIDTH);
};
const prevColumnIsFixedCore = function (that, column, visibleColumns, rowIndex) {
  const prevColumn = getPrevColumn(that, column, visibleColumns, rowIndex);
  const fixedPosition = getColumnFixedPosition(that, column);
  return !!(prevColumn !== null && prevColumn !== void 0 && prevColumn.fixed) && (!column.fixed || fixedPosition === _const2.StickyPosition.Sticky || fixedPosition !== getColumnFixedPosition(that, prevColumn));
};
const getStickyOffset = function (that,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
columns, widths, columnIndex, offsets) {
  const result = {};
  const column = columns[columnIndex];
  if (column) {
    const fixedPosition = getColumnFixedPosition(that, column);
    switch (fixedPosition) {
      case _const2.StickyPosition.Sticky:
        {
          const offsetLeft = getStickyOffsetCore(columns, widths, columnIndex, _const2.StickyPosition.Left, offsets);
          const offsetRight = getStickyOffsetCore(columns, widths, columnIndex, _const2.StickyPosition.Right, offsets);
          result.left = offsetLeft;
          result.right = offsetRight;
          break;
        }
      case _const2.StickyPosition.Right:
        {
          const offsetRight = getStickyOffsetCore(columns, widths, columnIndex, _const2.StickyPosition.Right, offsets);
          result.right = offsetRight;
          break;
        }
      default:
        {
          const offsetLeft = getStickyOffsetCore(columns, widths, columnIndex, _const2.StickyPosition.Left, offsets);
          result.left = offsetLeft;
        }
    }
  }
  return result;
};
exports.getStickyOffset = getStickyOffset;
const prevColumnIsFixed = function (that,
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
column, rowIndex) {
  let isDataColumn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  const visibleColumns = that.getVisibleColumns(isDataColumn ? null : rowIndex);
  const parentColumn = that.getParentColumn(column);
  if (parentColumn) {
    const isFirstColumn = that.isFirstColumn(column, rowIndex, true);
    return isFirstColumn && prevColumnIsFixedCore(that, parentColumn, that.getVisibleColumns(0), 0);
  }
  return prevColumnIsFixedCore(that, column, visibleColumns, rowIndex);
};
exports.prevColumnIsFixed = prevColumnIsFixed;
const normalizeOffset = function (offset) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styleProps = {};
  if ((0, _type.isDefined)(offset.left)) {
    styleProps.left = `${offset.left}px`;
  }
  if ((0, _type.isDefined)(offset.right)) {
    styleProps.right = `${offset.right}px`;
  }
  return styleProps;
};
exports.normalizeOffset = normalizeOffset;
const isFirstFixedColumn = function (that,
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
column, rowIndex) {
  let onlyWithinBandColumn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  let fixedPosition = arguments.length > 4 ? arguments[4] : undefined;
  return isFirstOrLastColumn(that, column, rowIndex, onlyWithinBandColumn, false, fixedPosition);
};
exports.isFirstFixedColumn = isFirstFixedColumn;
const isLastFixedColumn = function (that,
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
column, rowIndex) {
  let onlyWithinBandColumn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  let fixedPosition = arguments.length > 4 ? arguments[4] : undefined;
  return isFirstOrLastColumn(that, column, rowIndex, onlyWithinBandColumn, true, fixedPosition);
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.isLastFixedColumn = isLastFixedColumn;
const isFixedEdge = function (point, column, nextColumn) {
  const isSplitPoint = (0, _type.isDefined)(point.isLeftBoundary) || (0, _type.isDefined)(point.isRightBoundary);
  return !isSplitPoint && !!column && !!nextColumn && column.fixed !== nextColumn.fixed;
};
exports.isFixedEdge = isFixedEdge;