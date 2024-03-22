/**
* DevExtreme (cjs/__internal/grids/grid_core/master_detail/m_master_detail.js)
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
exports.masterDetailModule = exports.dataMasterDetailExtenderMixin = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _iterator = require("../../../../core/utils/iterator");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _m_utils = _interopRequireDefault(require("../m_utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */ // @ts-expect-error
const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const MASTER_DETAIL_ROW_CLASS = 'dx-master-detail-row';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const ROW_LINES_CLASS = 'dx-row-lines';
const columns = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(ColumnsMasterDetailExtender, _Base);
  function ColumnsMasterDetailExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto = ColumnsMasterDetailExtender.prototype;
  _proto._getExpandColumnsCore = function _getExpandColumnsCore() {
    const expandColumns = _Base.prototype._getExpandColumnsCore.call(this);
    if (this.option('masterDetail.enabled')) {
      expandColumns.push({
        type: 'detailExpand',
        cellTemplate: _m_utils.default.getExpandCellTemplate()
      });
    }
    return expandColumns;
  };
  return ColumnsMasterDetailExtender;
}(Base);
const initMasterDetail = function (that) {
  that._expandedItems = [];
  that._isExpandAll = that.option('masterDetail.autoExpandAll');
};
const dataMasterDetailExtenderMixin = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(DataMasterDetailExtender, _Base2);
  function DataMasterDetailExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto2 = DataMasterDetailExtender.prototype;
  _proto2.init = function init() {
    const that = this;
    initMasterDetail(that);
    _Base2.prototype.init.call(this);
  };
  _proto2.expandAll = function expandAll(groupIndex) {
    const that = this;
    if (groupIndex < 0) {
      that._isExpandAll = true;
      that._expandedItems = [];
      that.updateItems();
    } else {
      // @ts-expect-error
      _Base2.prototype.expandAll.apply(that, arguments);
    }
  };
  _proto2.collapseAll = function collapseAll(groupIndex) {
    const that = this;
    if (groupIndex < 0) {
      that._isExpandAll = false;
      that._expandedItems = [];
      that.updateItems();
    } else {
      // @ts-expect-error
      _Base2.prototype.collapseAll.apply(that, arguments);
    }
  };
  _proto2.isRowExpandedHack = function isRowExpandedHack() {
    // @ts-expect-error
    return _Base2.prototype.isRowExpanded.apply(this, arguments);
  };
  _proto2.isRowExpanded = function isRowExpanded(key) {
    const that = this;
    const expandIndex = _m_utils.default.getIndexByKey(key, that._expandedItems);
    if (Array.isArray(key)) {
      // @ts-expect-error
      return _Base2.prototype.isRowExpanded.apply(that, arguments);
    }
    return !!(that._isExpandAll ^ (expandIndex >= 0 && that._expandedItems[expandIndex].visible));
  };
  _proto2._getRowIndicesForExpand = function _getRowIndicesForExpand(key) {
    const rowIndex = this.getRowIndexByKey(key);
    return [rowIndex, rowIndex + 1];
  };
  _proto2._changeRowExpandCore = function _changeRowExpandCore(key) {
    const that = this;
    let result;
    if (Array.isArray(key)) {
      // @ts-expect-error
      result = _Base2.prototype._changeRowExpandCore.apply(that, arguments);
    } else {
      const expandIndex = _m_utils.default.getIndexByKey(key, that._expandedItems);
      if (expandIndex >= 0) {
        const {
          visible
        } = that._expandedItems[expandIndex];
        that._expandedItems[expandIndex].visible = !visible;
      } else {
        that._expandedItems.push({
          key,
          visible: true
        });
      }
      that.updateItems({
        changeType: 'update',
        rowIndices: that._getRowIndicesForExpand(key)
      });
      // @ts-expect-error
      result = new _deferred.Deferred().resolve();
    }
    return result;
  };
  _proto2._processDataItemHack = function _processDataItemHack() {
    return _Base2.prototype._processDataItem.apply(this, arguments);
  };
  _proto2._processDataItem = function _processDataItem(data, options) {
    const that = this;
    const dataItem = _Base2.prototype._processDataItem.apply(that, arguments);
    dataItem.isExpanded = that.isRowExpanded(dataItem.key);
    if (options.detailColumnIndex === undefined) {
      options.detailColumnIndex = -1;
      (0, _iterator.each)(options.visibleColumns, (index, column) => {
        if (column.command === 'expand' && !(0, _type.isDefined)(column.groupIndex)) {
          options.detailColumnIndex = index;
          return false;
        }
        return undefined;
      });
    }
    if (options.detailColumnIndex >= 0) {
      dataItem.values[options.detailColumnIndex] = dataItem.isExpanded;
    }
    return dataItem;
  };
  _proto2._processItemsHack = function _processItemsHack() {
    return _Base2.prototype._processItems.apply(this, arguments);
  };
  _proto2._processItems = function _processItems(items, change) {
    const that = this;
    const {
      changeType
    } = change;
    const result = [];
    items = _Base2.prototype._processItems.apply(that, arguments);
    if (changeType === 'loadingAll') {
      return items;
    }
    if (changeType === 'refresh') {
      that._expandedItems = (0, _common.grep)(that._expandedItems, item => item.visible);
    }
    (0, _iterator.each)(items, (index, item) => {
      result.push(item);
      const expandIndex = _m_utils.default.getIndexByKey(item.key, that._expandedItems);
      if (item.rowType === 'data' && (item.isExpanded || expandIndex >= 0) && !item.isNewRow) {
        result.push({
          visible: item.isExpanded,
          rowType: 'detail',
          key: item.key,
          data: item.data,
          values: []
        });
      }
    });
    return result;
  };
  _proto2.optionChanged = function optionChanged(args) {
    const that = this;
    let isEnabledChanged;
    let isAutoExpandAllChanged;
    if (args.name === 'masterDetail') {
      args.name = 'dataSource';
      // eslint-disable-next-line default-case
      switch (args.fullName) {
        case 'masterDetail':
          {
            const value = args.value || {};
            const previousValue = args.previousValue || {};
            isEnabledChanged = value.enabled !== previousValue.enabled;
            isAutoExpandAllChanged = value.autoExpandAll !== previousValue.autoExpandAll;
            break;
          }
        case 'masterDetail.template':
          {
            initMasterDetail(that);
            break;
          }
        case 'masterDetail.enabled':
          isEnabledChanged = true;
          break;
        case 'masterDetail.autoExpandAll':
          isAutoExpandAllChanged = true;
          break;
      }
      if (isEnabledChanged || isAutoExpandAllChanged) {
        initMasterDetail(that);
      }
    }
    _Base2.prototype.optionChanged.call(this, args);
  };
  return DataMasterDetailExtender;
}(Base);
exports.dataMasterDetailExtenderMixin = dataMasterDetailExtenderMixin;
const resizing = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(ResizingMasterDetailExtender, _Base3);
  function ResizingMasterDetailExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto3 = ResizingMasterDetailExtender.prototype;
  _proto3.fireContentReadyAction = function fireContentReadyAction() {
    _Base3.prototype.fireContentReadyAction.apply(this, arguments);
    this._updateParentDataGrids(this.component.$element());
  };
  _proto3._updateParentDataGrids = function _updateParentDataGrids($element) {
    const $masterDetailRow = $element.closest(".".concat(MASTER_DETAIL_ROW_CLASS));
    if ($masterDetailRow.length) {
      (0, _deferred.when)(this._updateMasterDataGrid($masterDetailRow, $element)).done(() => {
        this._updateParentDataGrids($masterDetailRow.parent());
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto3._updateMasterDataGrid = function _updateMasterDataGrid($masterDetailRow, $detailElement) {
    const masterRowOptions = (0, _renderer.default)($masterDetailRow).data('options');
    const masterDataGrid = (0, _renderer.default)($masterDetailRow).closest(".".concat(this.getWidgetContainerClass())).parent().data('dxDataGrid');
    if (masterRowOptions && masterDataGrid) {
      return this._updateMasterDataGridCore(masterDataGrid, masterRowOptions);
    }
    return undefined;
  };
  _proto3._updateMasterDataGridCore = function _updateMasterDataGridCore(masterDataGrid, masterRowOptions) {
    const d = (0, _deferred.Deferred)();
    if (masterDataGrid.getView('rowsView').isFixedColumns()) {
      // @ts-expect-error
      this._updateFixedMasterDetailGrids(masterDataGrid, masterRowOptions.rowIndex, (0, _renderer.default)(masterRowOptions.rowElement)).done(d.resolve);
    } else {
      if (masterDataGrid.option('scrolling.useNative') === true) {
        masterDataGrid.updateDimensions().done(() => d.resolve(true));
        return;
      }
      const scrollable = masterDataGrid.getScrollable();
      if (scrollable) {
        // T607490
        scrollable === null || scrollable === void 0 ? void 0 : scrollable.update().done(() => d.resolve());
      } else {
        d.resolve();
      }
    }
    return d.promise();
  };
  _proto3._updateFixedMasterDetailGrids = function _updateFixedMasterDetailGrids(masterDataGrid, masterRowIndex, $detailElement) {
    const d = (0, _deferred.Deferred)();
    const $rows = (0, _renderer.default)(masterDataGrid.getRowElement(masterRowIndex));
    const $tables = (0, _renderer.default)(masterDataGrid.getView('rowsView').getTableElements());
    const rowsNotEqual = ($rows === null || $rows === void 0 ? void 0 : $rows.length) === 2 && (0, _size.getHeight)($rows.eq(0)) !== (0, _size.getHeight)($rows.eq(1));
    const tablesNotEqual = ($tables === null || $tables === void 0 ? void 0 : $tables.length) === 2 && (0, _size.getHeight)($tables.eq(0)) !== (0, _size.getHeight)($tables.eq(1));
    if (rowsNotEqual || tablesNotEqual) {
      const detailElementWidth = (0, _size.getWidth)($detailElement);
      masterDataGrid.updateDimensions().done(() => {
        const isDetailHorizontalScrollCanBeShown = this.option('columnAutoWidth') && masterDataGrid.option('scrolling.useNative') === true;
        const isDetailGridWidthChanged = isDetailHorizontalScrollCanBeShown && detailElementWidth !== (0, _size.getWidth)($detailElement);
        if (isDetailHorizontalScrollCanBeShown && isDetailGridWidthChanged) {
          this.updateDimensions().done(() => d.resolve(true));
        } else {
          d.resolve(true);
        }
      });
      return d.promise();
    }
    return (0, _deferred.Deferred)().resolve();
  };
  _proto3._toggleBestFitMode = function _toggleBestFitMode(isBestFit) {
    _Base3.prototype._toggleBestFitMode.apply(this, arguments);
    if (this.option('masterDetail.template')) {
      const $rowsTable = this._rowsView.getTableElement();
      if ($rowsTable) {
        $rowsTable.find('.dx-master-detail-cell').css('maxWidth', isBestFit ? 0 : '');
      }
    }
  };
  return ResizingMasterDetailExtender;
}(Base);
const rowsView = Base => /*#__PURE__*/function (_Base4) {
  _inheritsLoose(RowsViewMasterDetailExtender, _Base4);
  function RowsViewMasterDetailExtender() {
    return _Base4.apply(this, arguments) || this;
  }
  var _proto4 = RowsViewMasterDetailExtender.prototype;
  _proto4._getCellTemplate = function _getCellTemplate(options) {
    const that = this;
    const {
      column
    } = options;
    const editingController = this._editingController;
    const isEditRow = editingController && editingController.isEditRow(options.rowIndex);
    let template;
    if (column.command === 'detail' && !isEditRow) {
      template = that.option('masterDetail.template') || {
        allowRenderToDetachedContainer: false,
        render: that._getDefaultTemplate(column)
      };
    } else {
      template = _Base4.prototype._getCellTemplate.apply(that, arguments);
    }
    return template;
  };
  _proto4._isDetailRow = function _isDetailRow(row) {
    return row && row.rowType && row.rowType.indexOf('detail') === 0;
  };
  _proto4._createRow = function _createRow(row) {
    const $row = _Base4.prototype._createRow.apply(this, arguments);
    if (row && this._isDetailRow(row)) {
      this.option('showRowLines') && $row.addClass(ROW_LINES_CLASS);
      $row.addClass(MASTER_DETAIL_ROW_CLASS);
      if ((0, _type.isDefined)(row.visible)) {
        $row.toggle(row.visible);
      }
    }
    return $row;
  };
  _proto4._renderCells = function _renderCells($row, options) {
    const {
      row
    } = options;
    let $detailCell;
    const visibleColumns = this._columnsController.getVisibleColumns();
    if (row.rowType && this._isDetailRow(row)) {
      if (this._needRenderCell(0, options.columnIndices)) {
        $detailCell = this._renderCell($row, {
          value: null,
          row,
          rowIndex: row.rowIndex,
          column: {
            command: 'detail'
          },
          columnIndex: 0,
          change: options.change
        });
        $detailCell.addClass(CELL_FOCUS_DISABLED_CLASS).addClass(MASTER_DETAIL_CELL_CLASS).attr('colSpan', visibleColumns.length);
      }
    } else {
      _Base4.prototype._renderCells.apply(this, arguments);
    }
  };
  return RowsViewMasterDetailExtender;
}(Base);
const masterDetailModule = exports.masterDetailModule = {
  defaultOptions() {
    return {
      masterDetail: {
        enabled: false,
        autoExpandAll: false,
        template: null
      }
    };
  },
  extenders: {
    controllers: {
      columns,
      data: dataMasterDetailExtenderMixin,
      resizing
    },
    views: {
      rowsView
    }
  }
};
