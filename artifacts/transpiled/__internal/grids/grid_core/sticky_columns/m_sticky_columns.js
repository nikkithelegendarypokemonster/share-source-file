"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stickyColumnsModule = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _size = require("../../../../core/utils/size");
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _m_rows_view = require("../views/m_rows_view");
var _const = require("./const");
var _dom = require("./dom");
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const baseStickyColumns = Base => class BaseStickyColumnsExtender extends Base {
  _addStickyColumnBorderLeftClass($cell, column, rowIndex) {
    let onlyWithinBandColumn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    let fixedPosition = arguments.length > 4 ? arguments[4] : undefined;
    const isFirstFixedCell = (0, _utils.isFirstFixedColumn)(this._columnsController, column, rowIndex, onlyWithinBandColumn, fixedPosition);
    if (isFirstFixedCell) {
      _dom.GridCoreStickyColumnsDom.addStickyColumnBorderLeftClass($cell, this.addWidgetPrefix.bind(this));
    }
  }
  _addStickyColumnBorderRightClass($cell, column, rowIndex) {
    let onlyWithinBandColumn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    let fixedPosition = arguments.length > 4 ? arguments[4] : undefined;
    const isLastFixedCell = (0, _utils.isLastFixedColumn)(this._columnsController, column, rowIndex, onlyWithinBandColumn, fixedPosition);
    if (isLastFixedCell) {
      _dom.GridCoreStickyColumnsDom.addStickyColumnBorderRightClass($cell, this.addWidgetPrefix.bind(this));
    }
  }
  _isStickyColumns() {
    var _this$_columnsControl;
    const stickyColumns = (_this$_columnsControl = this._columnsController) === null || _this$_columnsControl === void 0 ? void 0 : _this$_columnsControl.getStickyColumns();
    return this.option('columnFixing.legacyMode') !== true && !!stickyColumns.length;
  }
  _renderCore(options) {
    super._renderCore(options);
    const $element = this.element();
    const isStickyColumns = this._isStickyColumns();
    _dom.GridCoreStickyColumnsDom.toggleStickyColumnsClass($element, isStickyColumns, this.addWidgetPrefix.bind(this));
  }
  _createCell(options) {
    const {
      column
    } = options;
    const {
      rowType
    } = options;
    const $cell = super._createCell(options);
    const isStickyColumns = this._isStickyColumns();
    if (isStickyColumns && column.fixed) {
      const rowIndex = rowType === 'header' ? options.rowIndex : null;
      const fixedPosition = (0, _utils.getColumnFixedPosition)(column);
      _dom.GridCoreStickyColumnsDom.addStickyColumnClass($cell, column, this.addWidgetPrefix.bind(this));
      switch (fixedPosition) {
        case _const.StickyPosition.Right:
          {
            this._addStickyColumnBorderLeftClass($cell, column, rowIndex, false, _const.StickyPosition.Right);
            break;
          }
        case _const.StickyPosition.Sticky:
          {
            this._addStickyColumnBorderLeftClass($cell, column, rowIndex, true);
            this._addStickyColumnBorderRightClass($cell, column, rowIndex, true);
            break;
          }
        default:
          {
            this._addStickyColumnBorderRightClass($cell, column, rowIndex, false, _const.StickyPosition.Left);
          }
      }
    }
    return $cell;
  }
  setStickyOffsets(rowIndex, offsets) {
    let columns = this.getColumns(rowIndex);
    let widths = this.getColumnWidths(undefined, rowIndex);
    const rtlEnabled = this.option('rtlEnabled');
    if (rtlEnabled) {
      columns = rtlEnabled ? [...columns].reverse() : columns;
      widths = rtlEnabled ? [...widths].reverse() : widths;
    }
    columns.forEach((column, columnIndex) => {
      if (column.fixed) {
        const visibleColumnIndex = rtlEnabled ? columns.length - columnIndex - 1 : columnIndex;
        const offset = (0, _utils.getStickyOffset)(columns, widths, columnIndex, offsets);
        if (offsets) {
          offsets[column.index] = offset;
        }
        const styleProps = (0, _utils.normalizeOffset)(offset);
        this.setCellProperties(styleProps, visibleColumnIndex, rowIndex, true);
      }
    });
  }
  setColumnWidths(options) {
    const isStickyColumns = this._isStickyColumns();
    const columnsResizerController = this.getController('columnsResizer');
    const isColumnResizing = columnsResizerController === null || columnsResizerController === void 0 ? void 0 : columnsResizerController.isResizing();
    super.setColumnWidths(options);
    if (isStickyColumns && isColumnResizing) {
      this.setStickyOffsets();
    }
  }
  _resizeCore() {
    const isStickyColumns = this._isStickyColumns();
    super._resizeCore.apply(this, arguments);
    if (isStickyColumns) {
      this.setStickyOffsets();
    }
  }
};
const columnHeadersView = Base => class ColumnHeadersViewStickyColumnsExtender extends baseStickyColumns(Base) {
  setStickyOffsets() {
    const offsets = {};
    const rowCount = this.getRowCount();
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      super.setStickyOffsets(rowIndex, offsets);
    }
  }
  _createCell(options) {
    const $cell = super._createCell(options);
    const rowCount = this.getRowCount();
    const {
      column,
      rowIndex
    } = options;
    const isStickyColumns = this._isStickyColumns();
    const columnsController = this._columnsController;
    if (isStickyColumns && rowCount > 1) {
      const prevCellIsFixed = (0, _utils.prevColumnIsFixed)(columnsController, column, rowIndex);
      if (prevCellIsFixed) {
        _dom.GridCoreStickyColumnsDom.addColumnNoBorderClass($cell, this.addWidgetPrefix.bind(this));
      }
      if (columnsController !== null && columnsController !== void 0 && columnsController.isFirstColumn(column, rowIndex)) {
        _dom.GridCoreStickyColumnsDom.addFirstHeaderClass($cell, this.addWidgetPrefix.bind(this));
      }
    }
    return $cell;
  }
  getContextMenuItems(options) {
    const {
      column
    } = options;
    const columnFixingOptions = this.option('columnFixing');
    let items = super.getContextMenuItems(options);
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
            case 'sticky':
              this._columnsController.columnOption(column.index, {
                fixed: true,
                fixedPosition: 'sticky'
              });
              break;
          }
        };
        const fixedPositionItems = [{
          text: columnFixingOptions.texts.leftPosition,
          icon: columnFixingOptions.icons.leftPosition,
          value: 'left',
          disabled: column.fixed && (!column.fixedPosition || column.fixedPosition === 'left'),
          onItemClick
        }, {
          text: columnFixingOptions.texts.rightPosition,
          icon: columnFixingOptions.icons.rightPosition,
          value: 'right',
          disabled: column.fixed && column.fixedPosition === 'right',
          onItemClick
        }];
        if (this.option('columnFixing.legacyMode') !== true) {
          fixedPositionItems.push({
            text: columnFixingOptions.texts.stickyPosition,
            icon: columnFixingOptions.icons.stickyPosition,
            value: 'sticky',
            disabled: column.fixed && (0, _utils.getColumnFixedPosition)(column) === _const.StickyPosition.Sticky,
            onItemClick
          });
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        items = items || [];
        items.push({
          text: columnFixingOptions.texts.fix,
          icon: columnFixingOptions.icons.fix,
          beginGroup: true,
          items: fixedPositionItems
        }, {
          text: columnFixingOptions.texts.unfix,
          icon: columnFixingOptions.icons.unfix,
          value: 'none',
          disabled: !column.fixed,
          onItemClick
        });
      }
    }
    return items;
  }
};
const rowsView = Base => class RowsViewStickyColumnsExtender extends baseStickyColumns(Base) {
  _getMasterDetailWidth() {
    var _this$component$$elem, _this$component$$elem2;
    // @ts-expect-error
    const componentWidth = ((_this$component$$elem = (_this$component$$elem2 = this.component.$element()).width) === null || _this$component$$elem === void 0 ? void 0 : _this$component$$elem.call(_this$component$$elem2)) ?? 0;
    return componentWidth - _m_utils.default.getComponentBorderWidth(this, this._$element);
  }
  _renderMasterDetailCell($row, row, options) {
    // @ts-expect-error
    const $detailCell = super._renderMasterDetailCell($row, row, options);
    if (this._isStickyColumns()) {
      $detailCell.addClass(this.addWidgetPrefix(_const.CLASSES.stickyColumnLeft))
      // @ts-expect-error
      .width(this._getMasterDetailWidth());
    }
    return $detailCell;
  }
  _updateMasterDetailWidths() {
    var _this$_$element;
    (0, _size.setWidth)((_this$_$element = this._$element) === null || _this$_$element === void 0 ? void 0 : _this$_$element.find('.dx-master-detail-cell'), this._getMasterDetailWidth());
  }
  _resizeCore() {
    const isStickyColumns = this._isStickyColumns();
    super._resizeCore.apply(this, arguments);
    if (isStickyColumns) {
      this._updateMasterDetailWidths();
    }
  }
  _renderCellContent($cell, options, renderOptions) {
    if (!(0, _m_rows_view.isGroupRow)(options) || !this._isStickyColumns()) {
      return super._renderCellContent($cell, options, renderOptions);
    }
    const $container = (0, _renderer.default)('<div>').addClass(this.addWidgetPrefix(_const.CLASSES.groupRowContainer)).appendTo($cell);
    return super._renderCellContent($container, options, renderOptions);
  }
  _renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
    // @ts-expect-error
    super._renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount);
    const stickySummarySelector = `.${this.addWidgetPrefix(_const.CLASSES.stickyColumn)}`;
    if ($groupCell.parent().find(stickySummarySelector).length && _dom.GridCoreStickyColumnsDom.doesGroupCellEndInFirstColumn($groupCell)) {
      _dom.GridCoreStickyColumnsDom.addStickyColumnBorderRightClass($groupCell, this.addWidgetPrefix.bind(this));
    }
  }
};
const footerView = Base => class FooterViewStickyColumnsExtender extends baseStickyColumns(Base) {};
const columnsResizer = Base => class ColumnResizerStickyColumnsExtender extends Base {
  _correctColumnIndexForPoint(point, correctionValue, columns) {
    const rtlEnabled = this.option('rtlEnabled');
    const isWidgetResizingMode = this.option('columnResizingMode') === 'widget';
    const columnIndex = Math.max(point.index - 1, 0);
    const column = columns[columnIndex];
    const nextColumnIndex = this._getNextColumnIndex(columnIndex);
    const nextColumn = columns[nextColumnIndex];
    if (isWidgetResizingMode && !(0, _utils.isFixedEdge)(point, column, nextColumn)) {
      const $container = (0, _renderer.default)(this._columnHeadersView.getContent());
      const isFixedCellPinnedToRight = _dom.GridCoreStickyColumnsDom.isFixedCellPinnedToRight((0, _renderer.default)(point.item), $container, this.addWidgetPrefix.bind(this));
      if (isFixedCellPinnedToRight) {
        point.columnIndex -= rtlEnabled ? 1 : 0;
        return;
      }
    }
    super._correctColumnIndexForPoint(point, correctionValue, columns);
  }
  _needToInvertResizing($cell) {
    const result = super._needToInvertResizing($cell);
    const isWidgetResizingMode = this.option('columnResizingMode') === 'widget';
    if (!result && isWidgetResizingMode) {
      const $container = (0, _renderer.default)(this._columnHeadersView.getContent());
      return _dom.GridCoreStickyColumnsDom.isFixedCellPinnedToRight($cell, $container, this.addWidgetPrefix.bind(this));
    }
    return result;
  }
  _generatePointsByColumns() {
    var _this$_columnHeadersV;
    // @ts-expect-error
    const isStickyColumns = (_this$_columnHeadersV = this._columnHeadersView) === null || _this$_columnHeadersV === void 0 ? void 0 : _this$_columnHeadersV._isStickyColumns();
    super._generatePointsByColumns(isStickyColumns);
  }
  _pointCreated(point, cellsLength, columns) {
    var _this$_columnHeadersV2;
    // @ts-expect-error
    const isStickyColumns = (_this$_columnHeadersV2 = this._columnHeadersView) === null || _this$_columnHeadersV2 === void 0 ? void 0 : _this$_columnHeadersV2._isStickyColumns();
    const result = super._pointCreated(point, cellsLength, columns);
    const needToCheckPoint = isStickyColumns && cellsLength > 0;
    if (needToCheckPoint && !result) {
      const column = columns[point.index - 1];
      const nextColumnIndex = this._getNextColumnIndex(point.index - 1);
      const nextColumn = columns[nextColumnIndex];
      return _dom.GridCoreStickyColumnsDom.noNeedToCreateResizingPoint(this._columnHeadersView, {
        point,
        column,
        nextColumn
      }, this.addWidgetPrefix.bind(this));
    }
    return result;
  }
};
const draggingHeader = Base => class DraggingHeaderStickyColumnsExtender extends Base {
  _generatePointsByColumns(options) {
    var _this$_columnHeadersV3;
    // @ts-expect-error
    const isStickyColumns = (_this$_columnHeadersV3 = this._columnHeadersView) === null || _this$_columnHeadersV3 === void 0 ? void 0 : _this$_columnHeadersV3._isStickyColumns();
    const {
      sourceLocation,
      sourceColumn
    } = options;
    if (isStickyColumns && sourceLocation === 'headers') {
      const columnFixedPosition = (0, _utils.getColumnFixedPosition)(sourceColumn);
      switch (true) {
        case sourceColumn.fixed && columnFixedPosition === _const.StickyPosition.Left:
          options.columnElements = _dom.GridCoreStickyColumnsDom.getLeftFixedCells(options.columnElements, this.addWidgetPrefix.bind(this));
          options.startColumnIndex = options.columnElements.eq(0).index();
          break;
        case sourceColumn.fixed && columnFixedPosition === _const.StickyPosition.Right:
          options.columnElements = _dom.GridCoreStickyColumnsDom.getRightFixedCells(options.columnElements, this.addWidgetPrefix.bind(this));
          options.startColumnIndex = options.columnElements.eq(0).index();
          break;
        default:
          options.columnElements = _dom.GridCoreStickyColumnsDom.getNonFixedAndStickyCells(options.columnElements, this.addWidgetPrefix.bind(this));
          options.startColumnIndex = options.columnElements.eq(0).index();
      }
    }
    return super._generatePointsByColumns(options, isStickyColumns);
  }
  _pointCreated(point, columns, location, sourceColumn) {
    // @ts-expect-error
    const isStickyColumns = this._columnHeadersView._isStickyColumns();
    const $cells = this._columnHeadersView.getColumnElements();
    const needToCheckPoint = isStickyColumns && location === 'headers' && ($cells === null || $cells === void 0 ? void 0 : $cells.length) && (!sourceColumn.fixed || sourceColumn.fixedPosition === _const.StickyPosition.Sticky);
    const result = super._pointCreated(point, columns, location, sourceColumn);
    if (needToCheckPoint && !result) {
      return _dom.GridCoreStickyColumnsDom.noNeedToCreateReorderingPoint(point, $cells, (0, _renderer.default)(this._columnHeadersView.getContent()), this.addWidgetPrefix.bind(this));
    }
    return result;
  }
};
const stickyColumnsModule = exports.stickyColumnsModule = {
  extenders: {
    views: {
      columnHeadersView,
      rowsView,
      footerView
    },
    controllers: {
      columnsResizer,
      draggingHeader
    }
  }
};