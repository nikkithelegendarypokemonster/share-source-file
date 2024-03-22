/**
* DevExtreme (cjs/__internal/grids/grid_core/column_fixing/m_column_fixing.js)
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
exports.columnFixingModule = void 0;
var _translator = require("../../../../animation/translator");
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _browser = _interopRequireDefault(require("../../../../core/utils/browser"));
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _position = require("../../../../core/utils/position");
var _size = require("../../../../core/utils/size");
var _style = require("../../../../core/utils/style");
var _type = require("../../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _wheel = require("../../../../events/core/wheel");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _ui = _interopRequireDefault(require("../../../../ui/scroll_view/ui.scrollable"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _m_columns_view = require("../views/m_columns_view");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */ // TODO Move DataGrid's summary methods to the DataGrid
// TODO Move virtual scrolling related methods to the virtual_scrolling
const CONTENT_CLASS = 'content';
const CONTENT_FIXED_CLASS = 'content-fixed';
const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const FIRST_CELL_CLASS = 'dx-first-cell';
const LAST_CELL_CLASS = 'dx-last-cell';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FIXED_COL_CLASS = 'dx-col-fixed';
const FIXED_COLUMNS_CLASS = 'dx-fixed-columns';
const POINTER_EVENTS_NONE_CLASS = 'dx-pointer-events-none';
const COMMAND_TRANSPARENT = 'transparent';
const GROUP_ROW_CLASS = 'dx-group-row';
const DETAIL_ROW_CLASS = 'dx-master-detail-row';
const getTransparentColumnIndex = function (fixedColumns) {
  let transparentColumnIndex = -1;
  (0, _iterator.each)(fixedColumns, (index, column) => {
    if (column.command === COMMAND_TRANSPARENT) {
      transparentColumnIndex = index;
      return false;
    }
    return undefined;
  });
  return transparentColumnIndex;
};
const normalizeColumnWidths = function (fixedColumns, widths, fixedWidths) {
  let fixedColumnIndex = 0;
  if (fixedColumns && widths && fixedWidths) {
    for (let i = 0; i < fixedColumns.length; i++) {
      if (fixedColumns[i].command === COMMAND_TRANSPARENT) {
        fixedColumnIndex += fixedColumns[i].colspan;
      } else {
        if (widths[fixedColumnIndex] < fixedWidths[i]) {
          widths[fixedColumnIndex] = fixedWidths[i];
        }
        fixedColumnIndex++;
      }
    }
  }
  return widths;
};
// View
const baseFixedColumns = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(BaseFixedColumnsExtender, _Base);
  function BaseFixedColumnsExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto = BaseFixedColumnsExtender.prototype;
  _proto.init = function init() {
    _Base.prototype.init.call(this);
    this._isFixedTableRendering = false;
    this._isFixedColumns = false;
  };
  _proto._createCol = function _createCol(column) {
    return _Base.prototype._createCol.call(this, column).toggleClass(FIXED_COL_CLASS, !!(this._isFixedTableRendering && (column.fixed || column.command && column.command !== COMMAND_TRANSPARENT)));
  };
  _proto._correctColumnIndicesForFixedColumns = function _correctColumnIndicesForFixedColumns(fixedColumns, change) {
    const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
    const transparentColspan = fixedColumns[transparentColumnIndex].colspan;
    const columnIndices = change && change.columnIndices;
    if (columnIndices) {
      change.columnIndices = columnIndices.map(columnIndices => {
        if (columnIndices) {
          return columnIndices.map(columnIndex => {
            if (columnIndex < transparentColumnIndex) {
              return columnIndex;
            }
            if (columnIndex >= transparentColumnIndex + transparentColspan) {
              return columnIndex - transparentColspan + 1;
            }
            return -1;
          }).filter(columnIndex => columnIndex >= 0);
        }
      });
    }
  };
  _proto._partialUpdateFixedTable = function _partialUpdateFixedTable(fixedColumns) {
    const fixedTableElement = this._fixedTableElement;
    const $rows = this._getRowElementsCore(fixedTableElement);
    const $colgroup = fixedTableElement.children('colgroup');
    $colgroup.replaceWith(this._createColGroup(fixedColumns));
    for (let i = 0; i < $rows.length; i++) {
      this._partialUpdateFixedRow((0, _renderer.default)($rows[i]), fixedColumns);
    }
  };
  _proto._partialUpdateFixedRow = function _partialUpdateFixedRow($row, fixedColumns) {
    var _a;
    const cellElements = $row.get(0).childNodes;
    const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
    const transparentColumn = fixedColumns[transparentColumnIndex];
    const columnIndexOffset = this._columnsController.getColumnIndexOffset();
    let groupCellOptions;
    let colIndex = columnIndexOffset + 1;
    let {
      colspan
    } = transparentColumn;
    if ($row.hasClass(DETAIL_ROW_CLASS)) {
      cellElements[0].setAttribute('colspan', (_a = this._columnsController.getVisibleColumns()) === null || _a === void 0 ? void 0 : _a.length);
      return;
    }
    if ($row.hasClass(GROUP_ROW_CLASS)) {
      // @ts-expect-error RowsView's method
      groupCellOptions = this._getGroupCellOptions({
        row: $row.data('options'),
        columns: this._columnsController.getVisibleColumns()
      });
      colspan = groupCellOptions.colspan - Math.max(0, cellElements.length - (groupCellOptions.columnIndex + 2));
    }
    for (let j = 0; j < cellElements.length; j++) {
      const needUpdateColspan = groupCellOptions ? j === groupCellOptions.columnIndex + 1 : j === transparentColumnIndex;
      cellElements[j].setAttribute('aria-colindex', colIndex);
      if (needUpdateColspan) {
        cellElements[j].setAttribute('colspan', colspan);
        colIndex += colspan;
      } else {
        colIndex++;
      }
    }
  };
  _proto._renderTable = function _renderTable(options) {
    var _a;
    let $fixedTable;
    const fixedColumns = this.getFixedColumns();
    this._isFixedColumns = !!fixedColumns.length;
    const $table = _Base.prototype._renderTable.call(this, options);
    if (this._isFixedColumns) {
      const change = options === null || options === void 0 ? void 0 : options.change;
      const $fixedDataRows = this._getRowElements(this._fixedTableElement);
      const needPartialUpdate = (change === null || change === void 0 ? void 0 : change.virtualColumnsScrolling) && $fixedDataRows.length === ((_a = change === null || change === void 0 ? void 0 : change.items) === null || _a === void 0 ? void 0 : _a.length);
      this._isFixedTableRendering = true;
      if (needPartialUpdate && this.option('scrolling.legacyMode') !== true) {
        this._partialUpdateFixedTable(fixedColumns);
        this._isFixedTableRendering = false;
      } else {
        const columnIndices = change === null || change === void 0 ? void 0 : change.columnIndices;
        this._correctColumnIndicesForFixedColumns(fixedColumns, change);
        $fixedTable = this._createTable(fixedColumns);
        this._renderRows($fixedTable, (0, _extend.extend)({}, options, {
          columns: fixedColumns
        }));
        this._updateContent($fixedTable, change, true);
        if (columnIndices) {
          change.columnIndices = columnIndices;
        }
        this._isFixedTableRendering = false;
      }
    } else {
      this._fixedTableElement && this._fixedTableElement.parent().remove();
      this._fixedTableElement = null;
    }
    return $table;
  };
  _proto._renderRow = function _renderRow($table, options) {
    let fixedCorrection;
    let {
      cells
    } = options.row;
    _Base.prototype._renderRow.apply(this, arguments);
    if (this._isFixedTableRendering && cells && cells.length) {
      fixedCorrection = 0;
      const fixedCells = options.row.cells || [];
      cells = cells.slice();
      options.row.cells = cells;
      for (let i = 0; i < fixedCells.length; i++) {
        if (fixedCells[i].column && fixedCells[i].column.command === COMMAND_TRANSPARENT) {
          fixedCorrection = (fixedCells[i].column.colspan || 1) - 1;
          continue;
        }
        cells[i + fixedCorrection] = fixedCells[i];
      }
    }
  };
  _proto._createCell = function _createCell(options) {
    const that = this;
    const {
      column
    } = options;
    const columnCommand = column && column.command;
    const {
      rowType
    } = options;
    const $cell = _Base.prototype._createCell.apply(that, arguments);
    let fixedColumns;
    let prevFixedColumn;
    let transparentColumnIndex;
    if (that._isFixedTableRendering || rowType === 'filter') {
      fixedColumns = that.getFixedColumns();
      transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
      prevFixedColumn = fixedColumns[transparentColumnIndex - 1];
    }
    if (that._isFixedTableRendering) {
      if (columnCommand === COMMAND_TRANSPARENT) {
        $cell.addClass(POINTER_EVENTS_NONE_CLASS).toggleClass(FIRST_CELL_CLASS, transparentColumnIndex === 0 || prevFixedColumn && prevFixedColumn.command === 'expand').toggleClass(LAST_CELL_CLASS, fixedColumns.length && transparentColumnIndex === fixedColumns.length - 1);
        if (rowType !== 'freeSpace') {
          _m_utils.default.setEmptyText($cell);
        }
      }
    } else if (rowType === 'filter') {
      $cell.toggleClass(FIRST_CELL_CLASS, options.columnIndex === transparentColumnIndex);
    }
    const isRowAltStyle = that.option('rowAlternationEnabled') && options.isAltRow;
    const isSelectAllCell = that.option('selection.mode') === 'multiple' && options.columnIndex === 0 && options.rowType === 'header';
    // T823783, T852898, T865179, T875201, T1120812
    if (_browser.default.mozilla && options.column.fixed && options.rowType !== 'group' && !isRowAltStyle && !isSelectAllCell) {
      $cell.addClass(FIXED_COL_CLASS);
    }
    return $cell;
  };
  _proto._getContent = function _getContent(isFixedTableRendering) {
    var _a;
    return isFixedTableRendering ? (_a = this._fixedTableElement) === null || _a === void 0 ? void 0 : _a.parent() : _Base.prototype._getContent.apply(this, arguments);
  };
  _proto._wrapTableInScrollContainer = function _wrapTableInScrollContainer($table, isFixedTableRendering) {
    const $scrollContainer = _Base.prototype._wrapTableInScrollContainer.apply(this, arguments);
    if (this._isFixedTableRendering || isFixedTableRendering) {
      $scrollContainer.addClass(this.addWidgetPrefix(CONTENT_FIXED_CLASS));
    }
    return $scrollContainer;
  };
  _proto._renderCellContent = function _renderCellContent($cell, options) {
    let isEmptyCell;
    const {
      column
    } = options;
    const isFixedTableRendering = this._isFixedTableRendering;
    const isGroupCell = options.rowType === 'group' && (0, _type.isDefined)(column.groupIndex);
    // T747718, T824508, T821252
    if (isFixedTableRendering && isGroupCell && !column.command && !column.groupCellTemplate) {
      $cell.css('pointerEvents', 'none');
    }
    if (!isFixedTableRendering && this._isFixedColumns) {
      isEmptyCell = column.fixed || column.command && column.fixed !== false;
      if (isGroupCell) {
        isEmptyCell = false;
        if (options.row.summaryCells && options.row.summaryCells.length) {
          const columns = this._columnsController.getVisibleColumns();
          // @ts-expect-error DataGrid's method
          const alignByFixedColumnCellCount = this._getAlignByColumnCellCount
          // @ts-expect-error DataGrid's method
          ? this._getAlignByColumnCellCount(column.colspan, {
            columns,
            row: options.row,
            isFixed: true
          }) : 0;
          if (alignByFixedColumnCellCount > 0) {
            const transparentColumnIndex = getTransparentColumnIndex(this._columnsController.getFixedColumns());
            isEmptyCell = columns.length - alignByFixedColumnCellCount < transparentColumnIndex;
          }
        }
      }
      if (isEmptyCell) {
        if (column.command && column.type !== 'buttons' || options.rowType === 'group') {
          $cell.html('&nbsp;').addClass(column.cssClass);
          return;
        }
        $cell.addClass('dx-hidden-cell');
      }
    }
    if (column.command !== COMMAND_TRANSPARENT) {
      _Base.prototype._renderCellContent.apply(this, arguments);
    }
  };
  _proto._getCellElementsCore = function _getCellElementsCore(rowIndex) {
    const cellElements = _Base.prototype._getCellElementsCore.apply(this, arguments);
    const isGroupRow = cellElements === null || cellElements === void 0 ? void 0 : cellElements.parent().hasClass(GROUP_ROW_CLASS);
    const headerRowIndex = this.name === 'columnHeadersView' ? rowIndex : undefined; // TODO
    if (this._fixedTableElement && cellElements) {
      const fixedColumns = this.getFixedColumns(headerRowIndex);
      const fixedCellElements = this._getRowElements(this._fixedTableElement).eq(rowIndex).children('td');
      (0, _iterator.each)(fixedCellElements, (columnIndex, cell) => {
        if (isGroupRow) {
          if (cellElements[columnIndex] && cell.style.visibility !== 'hidden') {
            cellElements[columnIndex] = cell;
          }
        } else {
          const fixedColumn = fixedColumns[columnIndex];
          if (fixedColumn) {
            if (fixedColumn.command === COMMAND_TRANSPARENT) {
              if (fixedCellElements.eq(columnIndex).hasClass(MASTER_DETAIL_CELL_CLASS)) {
                cellElements[columnIndex] = cell || cellElements[columnIndex];
              }
            } else {
              const fixedColumnIndex = this._columnsController.getVisibleIndexByColumn(fixedColumn, headerRowIndex);
              cellElements[fixedColumnIndex] = cell || cellElements[fixedColumnIndex];
            }
          }
        }
      });
    }
    return cellElements;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.getColumnWidths = function getColumnWidths(fixedTableElement) {
    const result = _Base.prototype.getColumnWidths.call(this);
    const fixedColumns = this.getFixedColumns();
    const fixedWidths = this._fixedTableElement && result.length ? _Base.prototype.getColumnWidths.call(this, this._fixedTableElement) : undefined;
    return normalizeColumnWidths(fixedColumns, result, fixedWidths);
  };
  _proto.getTableElement = function getTableElement(isFixedTableRendering) {
    isFixedTableRendering = this._isFixedTableRendering || isFixedTableRendering;
    const tableElement = isFixedTableRendering ? this._fixedTableElement : _Base.prototype.getTableElement.call(this);
    return tableElement;
  };
  _proto.setTableElement = function setTableElement(tableElement, isFixedTableRendering) {
    if (this._isFixedTableRendering || isFixedTableRendering) {
      this._fixedTableElement = tableElement.addClass(POINTER_EVENTS_NONE_CLASS);
    } else {
      _Base.prototype.setTableElement.call(this, tableElement);
    }
  };
  _proto.getColumns = function getColumns(rowIndex) {
    const $tableElement = this.getTableElement();
    if (this._isFixedTableRendering) {
      return this.getFixedColumns(rowIndex);
    }
    return _Base.prototype.getColumns.call(this, rowIndex, $tableElement);
  };
  _proto.getRowIndex = function getRowIndex($row) {
    const $fixedTable = this._fixedTableElement;
    if ($fixedTable && $fixedTable.find($row).length) {
      return this._getRowElements($fixedTable).index($row);
    }
    return _Base.prototype.getRowIndex.call(this, $row);
  };
  _proto.getTableElements = function getTableElements() {
    let result = _Base.prototype.getTableElements.apply(this, arguments);
    if (this._fixedTableElement) {
      result = (0, _renderer.default)([result.get(0), this._fixedTableElement.get(0)]);
    }
    return result;
  };
  _proto.getFixedColumns = function getFixedColumns(rowIndex) {
    return this._columnsController.getFixedColumns(rowIndex);
  };
  _proto.getFixedColumnsOffset = function getFixedColumnsOffset() {
    let offset = {
      left: 0,
      right: 0
    };
    let $transparentColumn;
    if (this._fixedTableElement) {
      $transparentColumn = this.getTransparentColumnElement();
      const positionTransparentColumn = $transparentColumn.position();
      offset = {
        left: positionTransparentColumn.left,
        right: (0, _size.getOuterWidth)(this.element(), true) - ((0, _size.getOuterWidth)($transparentColumn, true) + positionTransparentColumn.left)
      };
    }
    return offset;
  };
  _proto.getTransparentColumnElement = function getTransparentColumnElement() {
    return this._fixedTableElement && this._fixedTableElement.find(".".concat(POINTER_EVENTS_NONE_CLASS)).first();
  };
  _proto.getFixedTableElement = function getFixedTableElement() {
    return this._fixedTableElement;
  };
  _proto.isFixedColumns = function isFixedColumns() {
    return this._isFixedColumns;
  };
  _proto._resizeCore = function _resizeCore() {
    _Base.prototype._resizeCore.call(this);
    this.synchronizeRows();
  };
  _proto.setColumnWidths = function setColumnWidths(options) {
    var _a;
    const {
      widths
    } = options;
    const visibleColumns = this._columnsController.getVisibleColumns();
    const isColumnWidthsSynced = (widths === null || widths === void 0 ? void 0 : widths.length) && visibleColumns.some(column => (0, _type.isDefined)(column.visibleWidth));
    const isColumnWidthChanged = (_a = options.optionNames) === null || _a === void 0 ? void 0 : _a.width;
    _Base.prototype.setColumnWidths.call(this, options);
    if (this._fixedTableElement) {
      const hasAutoWidth = widths === null || widths === void 0 ? void 0 : widths.some(width => width === 'auto' || !(0, _type.isDefined)(width));
      // if order of calling isScrollbarVisible changed, performance tests will fail
      const needVisibleColumns = hasAutoWidth && (!isColumnWidthsSynced || !this.isScrollbarVisible(true));
      const columns = needVisibleColumns ? visibleColumns : this.getFixedColumns();
      this.setFixedTableColumnWidths(columns, widths);
    }
    const wordWrapEnabled = this.option('wordWrapEnabled');
    const needSynchronizeRows = isColumnWidthsSynced || isColumnWidthChanged && wordWrapEnabled;
    if (needSynchronizeRows) {
      this.synchronizeRows();
    }
  };
  _proto.setFixedTableColumnWidths = function setFixedTableColumnWidths(columns, widths) {
    if (!this._fixedTableElement || !widths) {
      return;
    }
    const $cols = this._fixedTableElement.children('colgroup').children('col');
    $cols.toArray().forEach(col => col.removeAttribute('style'));
    let columnIndex = 0;
    columns.forEach(column => {
      if (column.colspan) {
        columnIndex += column.colspan;
        return;
      }
      const colWidth = (0, _m_columns_view.normalizeWidth)(widths[columnIndex]);
      if ((0, _type.isDefined)(colWidth)) {
        (0, _style.setWidth)($cols.eq(columnIndex), colWidth);
      }
      columnIndex += 1;
    });
  };
  _proto._getClientHeight = function _getClientHeight(element) {
    const boundingClientRectElement = element.getBoundingClientRect && (0, _position.getBoundingRect)(element);
    return boundingClientRectElement && boundingClientRectElement.height ? boundingClientRectElement.height : element.clientHeight;
  };
  _proto.synchronizeRows = function synchronizeRows() {
    const rowHeights = [];
    const fixedRowHeights = [];
    let rowIndex;
    let $rowElements;
    let $fixedRowElements;
    let $contentElement;
    this.waitAsyncTemplates(true).done(() => {
      if (this._isFixedColumns && this._tableElement && this._fixedTableElement) {
        const heightTable = this._getClientHeight(this._tableElement.get(0));
        const heightFixedTable = this._getClientHeight(this._fixedTableElement.get(0));
        $rowElements = this._getRowElements(this._tableElement);
        $fixedRowElements = this._getRowElements(this._fixedTableElement);
        $contentElement = this._findContentElement();
        if (heightTable !== heightFixedTable) {
          $contentElement && $contentElement.css('height', heightTable);
          $rowElements.css('height', '');
          $fixedRowElements.css('height', '');
          for (rowIndex = 0; rowIndex < $rowElements.length; rowIndex++) {
            rowHeights.push(this._getClientHeight($rowElements.get(rowIndex)));
            fixedRowHeights.push(this._getClientHeight($fixedRowElements.get(rowIndex)));
          }
          for (rowIndex = 0; rowIndex < $rowElements.length; rowIndex++) {
            const rowHeight = rowHeights[rowIndex];
            const fixedRowHeight = fixedRowHeights[rowIndex];
            if (rowHeight > fixedRowHeight) {
              $fixedRowElements.eq(rowIndex).css('height', rowHeight);
            } else if (rowHeight < fixedRowHeight) {
              $rowElements.eq(rowIndex).css('height', fixedRowHeight);
            }
          }
          $contentElement && $contentElement.css('height', '');
        }
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.setScrollerSpacing = function setScrollerSpacing(width, hWidth) {
    const rtlEnabled = this.option('rtlEnabled');
    _Base.prototype.setScrollerSpacing.call(this, width);
    this.element().children(".".concat(this.addWidgetPrefix(CONTENT_FIXED_CLASS))).css({
      paddingLeft: rtlEnabled ? width : '',
      paddingRight: !rtlEnabled ? width : ''
    });
  };
  return BaseFixedColumnsExtender;
}(Base);
const columnHeadersView = Base => /*#__PURE__*/function (_baseFixedColumns) {
  _inheritsLoose(ColumnHeadersViewFixedColumnsExtender, _baseFixedColumns);
  function ColumnHeadersViewFixedColumnsExtender() {
    return _baseFixedColumns.apply(this, arguments) || this;
  }
  var _proto2 = ColumnHeadersViewFixedColumnsExtender.prototype;
  _proto2._getRowVisibleColumns = function _getRowVisibleColumns(rowIndex) {
    if (this._isFixedTableRendering) {
      return this.getFixedColumns(rowIndex);
    }
    // TODO Check that this method exists in runtime
    // @ts-expect-error A method with this name doesn't exist in js folder at all
    return _baseFixedColumns.prototype._getRowVisibleColumns.call(this, rowIndex);
  };
  _proto2.getContextMenuItems = function getContextMenuItems(options) {
    const {
      column
    } = options;
    const columnFixingOptions = this.option('columnFixing');
    let items = _baseFixedColumns.prototype.getContextMenuItems.call(this, options);
    if (options.row && options.row.rowType === 'header') {
      if (columnFixingOptions.enabled === true && column && column.allowFixing) {
        const onItemClick = params => {
          // eslint-disable-next-line default-case
          switch (params.itemData.value) {
            case 'none':
              this._columnsController.columnOption(column.index, 'fixed', false);
              break;
            case 'left':
              this._columnsController.columnOption(column.index, {
                fixed: true,
                fixedPosition: 'left'
              });
              break;
            case 'right':
              this._columnsController.columnOption(column.index, {
                fixed: true,
                fixedPosition: 'right'
              });
              break;
          }
        };
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        items = items || [];
        items.push({
          text: columnFixingOptions.texts.fix,
          beginGroup: true,
          items: [{
            text: columnFixingOptions.texts.leftPosition,
            value: 'left',
            disabled: column.fixed && (!column.fixedPosition || column.fixedPosition === 'left'),
            onItemClick
          }, {
            text: columnFixingOptions.texts.rightPosition,
            value: 'right',
            disabled: column.fixed && column.fixedPosition === 'right',
            onItemClick
          }]
        }, {
          text: columnFixingOptions.texts.unfix,
          value: 'none',
          disabled: !column.fixed,
          onItemClick
        });
      }
    }
    return items;
  };
  _proto2.getFixedColumnElements = function getFixedColumnElements(rowIndex) {
    const that = this;
    if ((0, _type.isDefined)(rowIndex)) {
      return this._fixedTableElement && this._getRowElements(this._fixedTableElement).eq(rowIndex).children();
    }
    const columnElements = that.getColumnElements();
    const $transparentColumnElement = that.getTransparentColumnElement();
    if (columnElements && $transparentColumnElement && $transparentColumnElement.length) {
      const transparentColumnIndex = getTransparentColumnIndex(that.getFixedColumns());
      columnElements.splice(transparentColumnIndex, $transparentColumnElement.get(0).colSpan, $transparentColumnElement.get(0));
    }
    return columnElements;
  };
  _proto2.getColumnWidths = function getColumnWidths() {
    const that = this;
    let fixedWidths;
    const result = _baseFixedColumns.prototype.getColumnWidths.call(this);
    const $fixedColumnElements = that.getFixedColumnElements();
    const fixedColumns = that.getFixedColumns();
    if (that._fixedTableElement) {
      if ($fixedColumnElements && $fixedColumnElements.length) {
        fixedWidths = that._getWidths($fixedColumnElements);
      } else {
        fixedWidths = _baseFixedColumns.prototype.getColumnWidths.call(this, that._fixedTableElement);
      }
    }
    return normalizeColumnWidths(fixedColumns, result, fixedWidths);
  };
  return ColumnHeadersViewFixedColumnsExtender;
}(baseFixedColumns(Base));
const rowsView = Base => /*#__PURE__*/function (_baseFixedColumns2) {
  _inheritsLoose(RowsViewFixedColumnsExtender, _baseFixedColumns2);
  function RowsViewFixedColumnsExtender() {
    return _baseFixedColumns2.apply(this, arguments) || this;
  }
  var _proto3 = RowsViewFixedColumnsExtender.prototype;
  _proto3.dispose = function dispose() {
    _baseFixedColumns2.prototype.dispose.apply(this, arguments);
    clearTimeout(this._fixedScrollTimeout);
  };
  _proto3.optionChanged = function optionChanged(args) {
    const that = this;
    _baseFixedColumns2.prototype.optionChanged.call(this, args);
    if (args.name === 'hoverStateEnabled' && that._isFixedColumns) {
      args.value ? this._attachHoverEvents() : this._detachHoverEvents();
    }
  };
  _proto3._detachHoverEvents = function _detachHoverEvents() {
    const element = this.element();
    if (this._fixedTableElement && this._tableElement) {
      _events_engine.default.off(element, 'mouseover mouseout', '.dx-data-row');
    }
  };
  _proto3._attachHoverEvents = function _attachHoverEvents() {
    if (this._fixedTableElement && this._tableElement) {
      _events_engine.default.on(this.element(), 'mouseover mouseout', '.dx-data-row', this.createAction(args => {
        const {
          event
        } = args;
        const rowIndex = this.getRowIndex((0, _renderer.default)(event.target).closest('.dx-row'));
        const isHover = event.type === 'mouseover';
        if (rowIndex >= 0) {
          this._tableElement && this._getRowElements(this._tableElement).eq(rowIndex).toggleClass(HOVER_STATE_CLASS, isHover);
          this._fixedTableElement && this._getRowElements(this._fixedTableElement).eq(rowIndex).toggleClass(HOVER_STATE_CLASS, isHover);
        }
      }));
    }
  };
  _proto3._getScrollDelay = function _getScrollDelay() {
    var _a;
    // @ts-expect-error m_virtual_scrolling method
    const hasResizeTimeout = (_a = this._resizingController) === null || _a === void 0 ? void 0 : _a.hasResizeTimeout();
    if (hasResizeTimeout) {
      return this.option('scrolling.updateTimeout');
    }
    return _browser.default.mozilla ? 60 : 0;
  };
  _proto3._findContentElement = function _findContentElement(isFixedTableRendering) {
    let $content;
    let scrollTop;
    const contentClass = this.addWidgetPrefix(CONTENT_CLASS);
    const element = this.element();
    isFixedTableRendering = this._isFixedTableRendering || isFixedTableRendering;
    if (element && isFixedTableRendering) {
      $content = element.children(".".concat(contentClass));
      const scrollable = this.getScrollable();
      if (!$content.length && scrollable) {
        $content = (0, _renderer.default)('<div>').addClass(contentClass);
        _events_engine.default.on($content, 'scroll', e => {
          const {
            target
          } = e;
          const scrollDelay = this._getScrollDelay();
          clearTimeout(this._fixedScrollTimeout);
          this._fixedScrollTimeout = setTimeout(() => {
            scrollTop = (0, _renderer.default)(target).scrollTop();
            scrollable.scrollTo({
              y: scrollTop
            });
          }, scrollDelay);
        });
        _events_engine.default.on($content, _wheel.name, e => {
          const $nearestScrollable = (0, _renderer.default)(e.target).closest('.dx-scrollable');
          let shouldScroll = false;
          if (scrollable && scrollable.$element().is($nearestScrollable)) {
            shouldScroll = true;
          } else {
            const nearestScrollableInstance = $nearestScrollable.length && _ui.default.getInstance($nearestScrollable.get(0));
            // @ts-expect-error
            const nearestScrollableHasVerticalScrollbar = nearestScrollableInstance && nearestScrollableInstance.scrollHeight() - nearestScrollableInstance.clientHeight() > 0;
            // @ts-expect-error
            shouldScroll = nearestScrollableInstance && !nearestScrollableHasVerticalScrollbar;
          }
          if (shouldScroll) {
            scrollTop = scrollable.scrollTop();
            scrollable.scrollTo({
              y: scrollTop - e.delta
            });
            const scrollableTop = scrollable.scrollTop() + scrollable.clientHeight();
            const scrollableHeight = scrollable.scrollHeight() + this.getScrollbarWidth();
            const isPreventDefault = scrollable.scrollTop() > 0 && scrollableTop < scrollableHeight;
            if (isPreventDefault) {
              return false;
            }
          }
          return undefined;
        });
        $content.appendTo(element);
      }
      return $content;
    }
    return _baseFixedColumns2.prototype._findContentElement.call(this);
  };
  _proto3._updateScrollable = function _updateScrollable() {
    _baseFixedColumns2.prototype._updateScrollable.call(this);
    const scrollable = this.getScrollable();
    if (scrollable === null || scrollable === void 0 ? void 0 : scrollable._disposed) {
      return;
    }
    const scrollTop = scrollable && scrollable.scrollOffset().top;
    this._updateFixedTablePosition(scrollTop);
  };
  _proto3._renderContent = function _renderContent(contentElement, tableElement, isFixedTableRendering) {
    if (this._isFixedTableRendering || isFixedTableRendering) {
      return contentElement.empty().addClass("".concat(this.addWidgetPrefix(CONTENT_CLASS), " ").concat(this.addWidgetPrefix(CONTENT_FIXED_CLASS))).append(tableElement);
    }
    return _baseFixedColumns2.prototype._renderContent.call(this, contentElement, tableElement);
  };
  _proto3._getGroupCellOptions = function _getGroupCellOptions(options) {
    if (this._isFixedTableRendering) {
      return _baseFixedColumns2.prototype._getGroupCellOptions.call(this, (0, _extend.extend)({}, options, {
        columns: this._columnsController.getVisibleColumns()
      }));
    }
    return _baseFixedColumns2.prototype._getGroupCellOptions.call(this, options);
  };
  _proto3._renderGroupedCells = function _renderGroupedCells($row, options) {
    return _baseFixedColumns2.prototype._renderGroupedCells.call(this, $row, (0, _extend.extend)({}, options, {
      columns: this._columnsController.getVisibleColumns()
    }));
  };
  _proto3._renderGroupSummaryCells = function _renderGroupSummaryCells($row, options) {
    if (this._isFixedTableRendering) {
      // @ts-expect-error DataGrid's method
      _baseFixedColumns2.prototype._renderGroupSummaryCells.call(this, $row, (0, _extend.extend)({}, options, {
        columns: this._columnsController.getVisibleColumns()
      }));
    } else {
      // @ts-expect-error DataGrid's method
      _baseFixedColumns2.prototype._renderGroupSummaryCells.call(this, $row, options);
    }
  };
  _proto3._hasAlignByColumnSummaryItems = function _hasAlignByColumnSummaryItems(columnIndex, options) {
    // @ts-expect-error DataGrid's method
    const result = _baseFixedColumns2.prototype._hasAlignByColumnSummaryItems.apply(this, arguments);
    const column = options.columns[columnIndex];
    if (options.isFixed) {
      return column.fixed && (result || column.fixedPosition === 'right');
    }
    return result && (!this._isFixedColumns || !column.fixed);
  };
  _proto3._renderGroupSummaryCellsCore = function _renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
    let alignByFixedColumnCellCount;
    if (this._isFixedTableRendering) {
      options.isFixed = true;
      // @ts-expect-error DataGrid's method
      alignByFixedColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);
      options.isFixed = false;
      const startColumnIndex = options.columns.length - alignByFixedColumnCellCount;
      options = (0, _extend.extend)({}, options, {
        columns: this.getFixedColumns()
      });
      const transparentColumnIndex = getTransparentColumnIndex(options.columns);
      if (startColumnIndex < transparentColumnIndex) {
        alignByFixedColumnCellCount -= options.columns[transparentColumnIndex].colspan - 1 || 0;
        groupCellColSpan -= options.columns[transparentColumnIndex].colspan - 1 || 0;
      } else if (alignByColumnCellCount > 0) {
        $groupCell.css('visibility', 'hidden');
      }
      alignByColumnCellCount = alignByFixedColumnCellCount;
    }
    // @ts-expect-error DataGrid's method
    _baseFixedColumns2.prototype._renderGroupSummaryCellsCore.call(this, $groupCell, options, groupCellColSpan, alignByColumnCellCount);
  };
  _proto3._getSummaryCellIndex = function _getSummaryCellIndex(columnIndex, columns) {
    if (this._isFixedTableRendering) {
      const transparentColumnIndex = getTransparentColumnIndex(columns);
      if (columnIndex > transparentColumnIndex) {
        columnIndex += columns[transparentColumnIndex].colspan - 1;
      }
      return columnIndex;
    }
    // @ts-expect-error DataGrid's method
    return _baseFixedColumns2.prototype._getSummaryCellIndex.apply(this, arguments);
  };
  _proto3._renderCore = function _renderCore(change) {
    this._detachHoverEvents();
    const deferred = _baseFixedColumns2.prototype._renderCore.call(this, change);
    const isFixedColumns = this._isFixedColumns;
    this.element().toggleClass(FIXED_COLUMNS_CLASS, isFixedColumns);
    if (this.option('hoverStateEnabled') && isFixedColumns) {
      this._attachHoverEvents();
    }
    return deferred;
  };
  _proto3.setAriaOwns = function setAriaOwns(headerTableId, footerTableId, isFixed) {
    var _a, _b;
    if (isFixed) {
      const contentFixedClass = this.addWidgetPrefix(CONTENT_FIXED_CLASS);
      const $contentFixedElement = (_a = this.element()) === null || _a === void 0 ? void 0 : _a.children(".".concat(contentFixedClass));
      const $fixedTableElement = this.getFixedTableElement();
      if ($contentFixedElement.length && ($fixedTableElement === null || $fixedTableElement === void 0 ? void 0 : $fixedTableElement.length)) {
        this.setAria('owns', "".concat(headerTableId !== null && headerTableId !== void 0 ? headerTableId : '', " ").concat((_b = $fixedTableElement.attr('id')) !== null && _b !== void 0 ? _b : '', " ").concat(footerTableId !== null && footerTableId !== void 0 ? footerTableId : '').trim(), $contentFixedElement);
      }
    } else {
      _baseFixedColumns2.prototype.setAriaOwns.apply(this, arguments);
    }
  };
  _proto3.setRowsOpacity = function setRowsOpacity(columnIndex, value) {
    _baseFixedColumns2.prototype.setRowsOpacity.call(this, columnIndex, value);
    const $rows = this._getRowElements(this._fixedTableElement);
    this._setRowsOpacityCore($rows, this.getFixedColumns(), columnIndex, value);
  };
  _proto3.getCellIndex = function getCellIndex($cell) {
    const $fixedTable = this._fixedTableElement;
    let cellIndex = 0;
    if ($fixedTable && $cell.is('td') && $cell.closest($fixedTable).length) {
      const columns = this.getFixedColumns();
      (0, _iterator.each)(columns, (index, column) => {
        if (index === $cell[0].cellIndex) {
          return false;
        }
        if (column.colspan) {
          cellIndex += column.colspan;
          return;
        }
        cellIndex++;
        return undefined;
      });
      return cellIndex;
    }
    return _baseFixedColumns2.prototype.getCellIndex.apply(this, arguments);
  };
  _proto3._updateFixedTablePosition = function _updateFixedTablePosition(scrollTop, needFocus) {
    if (this._fixedTableElement && this._tableElement) {
      let $focusedElement;
      this._fixedTableElement.parent().scrollTop(scrollTop);
      if (needFocus && this._editorFactoryController) {
        $focusedElement = this._editorFactoryController.focus();
        $focusedElement && this._editorFactoryController.focus($focusedElement);
      }
    }
  };
  _proto3.setScrollerSpacing = function setScrollerSpacing(vWidth, hWidth) {
    const that = this;
    const styles = {
      marginBottom: 0
    };
    const $fixedContent = that.element().children(".".concat(this.addWidgetPrefix(CONTENT_FIXED_CLASS)));
    if ($fixedContent.length && that._fixedTableElement) {
      $fixedContent.css(styles);
      that._fixedTableElement.css(styles);
      styles[that.option('rtlEnabled') ? 'marginLeft' : 'marginRight'] = vWidth;
      styles.marginBottom = hWidth;
      const useNativeScrolling = that._scrollable && that._scrollable.option('useNative');
      (useNativeScrolling ? $fixedContent : that._fixedTableElement).css(styles);
    }
  };
  _proto3._getElasticScrollTop = function _getElasticScrollTop(e) {
    let elasticScrollTop = 0;
    if (e.scrollOffset.top < 0) {
      elasticScrollTop = -e.scrollOffset.top;
    } else if (e.reachedBottom) {
      const $scrollableContent = (0, _renderer.default)(e.component.content());
      const $scrollableContainer = (0, _renderer.default)(e.component.container());
      const maxScrollTop = Math.max($scrollableContent.get(0).clientHeight - $scrollableContainer.get(0).clientHeight, 0);
      elasticScrollTop = Math.min(maxScrollTop - e.scrollOffset.top, 0);
    }
    return Math.floor(elasticScrollTop);
  };
  _proto3._applyElasticScrolling = function _applyElasticScrolling(e) {
    if (this._fixedTableElement) {
      const elasticScrollTop = this._getElasticScrollTop(e);
      if (Math.ceil(elasticScrollTop) !== 0) {
        (0, _translator.move)(this._fixedTableElement, {
          top: elasticScrollTop
        });
      } else {
        this._fixedTableElement.css('transform', '');
      }
    }
  };
  _proto3._handleScroll = function _handleScroll(e) {
    this._updateFixedTablePosition(e.scrollOffset.top, true);
    this._applyElasticScrolling(e);
    _baseFixedColumns2.prototype._handleScroll.call(this, e);
  };
  _proto3._updateContentPosition = function _updateContentPosition(isRender) {
    // @ts-expect-error m_virtual_scrolling method
    _baseFixedColumns2.prototype._updateContentPosition.apply(this, arguments);
    if (!isRender) {
      this._updateFixedTablePosition(this._scrollTop);
    }
  };
  _proto3._afterRowPrepared = function _afterRowPrepared(e) {
    if (this._isFixedTableRendering) return;
    _baseFixedColumns2.prototype._afterRowPrepared.call(this, e);
  };
  _proto3._scrollToElement = function _scrollToElement($element) {
    _baseFixedColumns2.prototype._scrollToElement.call(this, $element, this.getFixedColumnsOffset());
  };
  return RowsViewFixedColumnsExtender;
}(baseFixedColumns(Base));
// TODO Move this view to the DataGrid
const footerView = Base => /*#__PURE__*/function (_baseFixedColumns3) {
  _inheritsLoose(FooterViewFixedColumnsExtender, _baseFixedColumns3);
  function FooterViewFixedColumnsExtender() {
    return _baseFixedColumns3.apply(this, arguments) || this;
  }
  return FooterViewFixedColumnsExtender;
}(baseFixedColumns(Base));
const normalizeColumnIndicesByPoints = function (columns, fixedColumns, pointsByColumns) {
  const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
  const correctIndex = columns.length - fixedColumns.length;
  (0, _iterator.each)(pointsByColumns, (_, point) => {
    if (point.index > transparentColumnIndex) {
      point.columnIndex += correctIndex;
      point.index += correctIndex;
    }
  });
  return pointsByColumns;
};
const draggingHeader = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(DraggingHeaderColumnFixingExtender, _Base2);
  function DraggingHeaderColumnFixingExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto4 = DraggingHeaderColumnFixingExtender.prototype;
  _proto4._generatePointsByColumns = function _generatePointsByColumns(options) {
    const visibleColumns = options.columns;
    const {
      targetDraggingPanel
    } = options;
    if (targetDraggingPanel && targetDraggingPanel.getName() === 'headers' && targetDraggingPanel.isFixedColumns()) {
      if (options.sourceColumn.fixed) {
        if (!options.rowIndex) {
          options.columnElements = targetDraggingPanel.getFixedColumnElements(0);
        }
        options.columns = targetDraggingPanel.getFixedColumns(options.rowIndex);
        const pointsByColumns = _Base2.prototype._generatePointsByColumns.call(this, options);
        normalizeColumnIndicesByPoints(visibleColumns, options.columns, pointsByColumns);
        return pointsByColumns;
      }
    }
    return _Base2.prototype._generatePointsByColumns.call(this, options);
  };
  _proto4._pointCreated = function _pointCreated(point, columns, location, sourceColumn) {
    const result = _Base2.prototype._pointCreated.apply(this, arguments);
    const targetColumn = columns[point.columnIndex];
    // @ts-expect-error
    const $transparentColumn = this._columnHeadersView.getTransparentColumnElement();
    if (!result && location === 'headers' && $transparentColumn && $transparentColumn.length) {
      const boundingRect = (0, _position.getBoundingRect)($transparentColumn.get(0));
      if (sourceColumn && sourceColumn.fixed) {
        return sourceColumn.fixedPosition === 'right' ? point.x < boundingRect.right : point.x > boundingRect.left;
      }
      if (targetColumn && targetColumn.fixed && targetColumn.fixedPosition !== 'right') {
        return true;
      }
      return point.x < boundingRect.left || point.x > boundingRect.right;
    }
    return result;
  };
  return DraggingHeaderColumnFixingExtender;
}(Base);
const columnsResizer = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(ColumnResizerColumnFixingExtender, _Base3);
  function ColumnResizerColumnFixingExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto5 = ColumnResizerColumnFixingExtender.prototype;
  _proto5._generatePointsByColumns = function _generatePointsByColumns() {
    const that = this;
    const columnsController = that._columnsController;
    const columns = columnsController && that._columnsController.getVisibleColumns();
    const fixedColumns = columnsController && that._columnsController.getFixedColumns();
    const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
    const correctIndex = columns.length - fixedColumns.length;
    // @ts-expect-error
    const cells = that._columnHeadersView.getFixedColumnElements();
    _Base3.prototype._generatePointsByColumns.call(this);
    if (cells && cells.length > 0) {
      that._pointsByFixedColumns = _m_utils.default.getPointsByColumns(cells, point => {
        if (point.index > transparentColumnIndex) {
          point.columnIndex += correctIndex;
          point.index += correctIndex;
        }
        return that._pointCreated(point, columns.length, columns);
      });
    }
  };
  _proto5._getTargetPoint = function _getTargetPoint(pointsByColumns, currentX, deltaX) {
    // @ts-expect-error
    const $transparentColumn = this._columnHeadersView.getTransparentColumnElement();
    if ($transparentColumn && $transparentColumn.length) {
      const boundingRect = (0, _position.getBoundingRect)($transparentColumn.get(0));
      if (currentX <= boundingRect.left || currentX >= boundingRect.right) {
        return _Base3.prototype._getTargetPoint.call(this, this._pointsByFixedColumns, currentX, deltaX);
      }
    }
    return _Base3.prototype._getTargetPoint.call(this, pointsByColumns, currentX, deltaX);
  };
  return ColumnResizerColumnFixingExtender;
}(Base);
const resizing = Base => /*#__PURE__*/function (_Base4) {
  _inheritsLoose(ResizingColumnFixingExtender, _Base4);
  function ResizingColumnFixingExtender() {
    return _Base4.apply(this, arguments) || this;
  }
  var _proto6 = ResizingColumnFixingExtender.prototype;
  _proto6._setAriaOwns = function _setAriaOwns() {
    var _a, _b, _c;
    _Base4.prototype._setAriaOwns.apply(this, arguments);
    // @ts-expect-error
    const headerFixedTable = (_a = this._columnHeadersView) === null || _a === void 0 ? void 0 : _a.getFixedTableElement();
    // @ts-expect-error
    const footerFixedTable = (_b = this._footerView) === null || _b === void 0 ? void 0 : _b.getFixedTableElement();
    // @ts-expect-error
    (_c = this._rowsView) === null || _c === void 0 ? void 0 : _c.setAriaOwns(headerFixedTable === null || headerFixedTable === void 0 ? void 0 : headerFixedTable.attr('id'), footerFixedTable === null || footerFixedTable === void 0 ? void 0 : footerFixedTable.attr('id'), true);
  };
  return ResizingColumnFixingExtender;
}(Base);
const columnFixingModule = exports.columnFixingModule = {
  defaultOptions() {
    return {
      columnFixing: {
        enabled: false,
        texts: {
          fix: _message.default.format('dxDataGrid-columnFixingFix'),
          unfix: _message.default.format('dxDataGrid-columnFixingUnfix'),
          leftPosition: _message.default.format('dxDataGrid-columnFixingLeftPosition'),
          rightPosition: _message.default.format('dxDataGrid-columnFixingRightPosition')
        }
      }
    };
  },
  extenders: {
    views: {
      columnHeadersView,
      rowsView,
      footerView
    },
    controllers: {
      draggingHeader,
      columnsResizer,
      resizing
    }
  }
};
