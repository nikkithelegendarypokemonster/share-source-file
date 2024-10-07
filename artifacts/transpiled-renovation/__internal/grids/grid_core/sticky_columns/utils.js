"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prevColumnIsFixed = exports.normalizeOffset = exports.isLastFixedColumn = exports.isFixedEdge = exports.isFirstFixedColumn = exports.getStickyOffset = exports.getColumnFixedPosition = void 0;
var _type = require("../../../../core/utils/type");
var _const = require("./const");
const getColumnFixedPosition = _ref => {
  let {
    fixedPosition
  } = _ref;
  return fixedPosition ?? _const.StickyPosition.Left;
};
exports.getColumnFixedPosition = getColumnFixedPosition;
const getStickyOffsetCore = function (columns, widths, columnIndex, fixedPosition, offsets) {
  const column = columns[columnIndex];
  const isChildColumn = (0, _type.isDefined)(column.ownerBand);
  const targetColumnIsRight = fixedPosition === _const.StickyPosition.Right;
  const targetColumnIsSticky = getColumnFixedPosition(column) === _const.StickyPosition.Sticky;
  const processedColumns = targetColumnIsRight ? columns.slice(columnIndex + 1) : columns.slice(0, columnIndex).reverse();
  const processedWidths = targetColumnIsRight ? widths.slice(columnIndex + 1) : widths.slice(0, columnIndex).reverse();
  let offset = 0;
  let adjacentStickyColumnIndex = 0;
  let nonAdjacentStickyColumnCount = targetColumnIsSticky && processedColumns.length ? 1 : 0;
  processedColumns.forEach((col, colIndex) => {
    if (col.fixed && (!(0, _type.isDefined)(offsets) || column.ownerBand === col.ownerBand)) {
      const columnIsSticky = getColumnFixedPosition(col) === _const.StickyPosition.Sticky;
      const areNextOnlyFixedColumns = !processedColumns.slice(colIndex + 1).some(_ref2 => {
        let {
          fixed
        } = _ref2;
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
    }
  });
  if (isChildColumn && (0, _type.isDefined)(offsets)) {
    var _offsets$column$owner;
    offset += (offsets === null || offsets === void 0 || (_offsets$column$owner = offsets[column.ownerBand]) === null || _offsets$column$owner === void 0 ? void 0 : _offsets$column$owner[fixedPosition]) ?? 0;
    return offset;
  }
  return offset - nonAdjacentStickyColumnCount * _const.STICKY_BORDER_WIDTH;
};
const isFirstOrLastColumn = function (that,
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
column, rowIndex) {
  let onlyWithinBandColumn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  let isLast = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  let fixedPosition = arguments.length > 5 ? arguments[5] : undefined;
  const rtlEnabled = that.option('rtlEnabled');
  const methodName = rtlEnabled !== isLast ? 'isLastColumn' : 'isFirstColumn';
  if (column.fixedPosition === _const.StickyPosition.Sticky) {
    const parentColumn = that.getParentColumn(column) ?? column;
    if (that[methodName](parentColumn, 0)) {
      return false;
    }
  }
  return that[methodName](column, rowIndex, onlyWithinBandColumn, fixedPosition);
};
const prevColumnIsFixedCore = function (that, column, visibleColumns) {
  const visibleColumnIndex = that.getVisibleIndex(column.index, 0);
  const prevColumn = visibleColumns === null || visibleColumns === void 0 ? void 0 : visibleColumns[visibleColumnIndex - 1];
  return (prevColumn === null || prevColumn === void 0 ? void 0 : prevColumn.fixed) && (!column.fixed || column.fixedPosition === _const.StickyPosition.Sticky || column.fixedPosition !== (prevColumn === null || prevColumn === void 0 ? void 0 : prevColumn.fixedPosition));
};
const getStickyOffset = function (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
columns, widths, columnIndex, offsets) {
  const result = {};
  const column = columns[columnIndex];
  if (column) {
    const fixedPosition = getColumnFixedPosition(column);
    switch (fixedPosition) {
      case _const.StickyPosition.Sticky:
        {
          const offsetLeft = getStickyOffsetCore(columns, widths, columnIndex, _const.StickyPosition.Left, offsets);
          const offsetRight = getStickyOffsetCore(columns, widths, columnIndex, _const.StickyPosition.Right, offsets);
          result.left = offsetLeft;
          result.right = offsetRight;
          break;
        }
      case _const.StickyPosition.Right:
        {
          const offsetRight = getStickyOffsetCore(columns, widths, columnIndex, _const.StickyPosition.Right, offsets);
          result.right = offsetRight;
          break;
        }
      default:
        {
          const offsetLeft = getStickyOffsetCore(columns, widths, columnIndex, _const.StickyPosition.Left, offsets);
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
  const parentColumn = that.getParentColumn(column);
  const visibleColumns = that.getVisibleColumns(0);
  if (parentColumn) {
    const isFirstColumn = that.isFirstColumn(column, rowIndex, true);
    if (isFirstColumn) {
      return prevColumnIsFixedCore(that, parentColumn, visibleColumns);
    }
  }
  return prevColumnIsFixedCore(that, column, visibleColumns);
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