/**
* DevExtreme (esm/__internal/grids/grid_core/master_detail/m_master_detail.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable max-classes-per-file */
import $ from '../../../../core/renderer';
// @ts-expect-error
import { grep } from '../../../../core/utils/common';
import { Deferred, when } from '../../../../core/utils/deferred';
import { each } from '../../../../core/utils/iterator';
import { getHeight, getWidth } from '../../../../core/utils/size';
import { isDefined } from '../../../../core/utils/type';
import gridCoreUtils from '../m_utils';
var MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
var MASTER_DETAIL_ROW_CLASS = 'dx-master-detail-row';
var CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
var ROW_LINES_CLASS = 'dx-row-lines';
var columns = Base => class ColumnsMasterDetailExtender extends Base {
  _getExpandColumnsCore() {
    var expandColumns = super._getExpandColumnsCore();
    if (this.option('masterDetail.enabled')) {
      expandColumns.push({
        type: 'detailExpand',
        cellTemplate: gridCoreUtils.getExpandCellTemplate()
      });
    }
    return expandColumns;
  }
};
var initMasterDetail = function initMasterDetail(that) {
  that._expandedItems = [];
  that._isExpandAll = that.option('masterDetail.autoExpandAll');
};
export var dataMasterDetailExtenderMixin = Base => class DataMasterDetailExtender extends Base {
  init() {
    var that = this;
    initMasterDetail(that);
    super.init();
  }
  expandAll(groupIndex) {
    var that = this;
    if (groupIndex < 0) {
      that._isExpandAll = true;
      that._expandedItems = [];
      that.updateItems();
    } else {
      // @ts-expect-error
      super.expandAll.apply(that, arguments);
    }
  }
  collapseAll(groupIndex) {
    var that = this;
    if (groupIndex < 0) {
      that._isExpandAll = false;
      that._expandedItems = [];
      that.updateItems();
    } else {
      // @ts-expect-error
      super.collapseAll.apply(that, arguments);
    }
  }
  isRowExpandedHack() {
    // @ts-expect-error
    return super.isRowExpanded.apply(this, arguments);
  }
  isRowExpanded(key) {
    var that = this;
    var expandIndex = gridCoreUtils.getIndexByKey(key, that._expandedItems);
    if (Array.isArray(key)) {
      // @ts-expect-error
      return super.isRowExpanded.apply(that, arguments);
    }
    return !!(that._isExpandAll ^ (expandIndex >= 0 && that._expandedItems[expandIndex].visible));
  }
  _getRowIndicesForExpand(key) {
    var rowIndex = this.getRowIndexByKey(key);
    return [rowIndex, rowIndex + 1];
  }
  _changeRowExpandCore(key) {
    var that = this;
    var result;
    if (Array.isArray(key)) {
      // @ts-expect-error
      result = super._changeRowExpandCore.apply(that, arguments);
    } else {
      var expandIndex = gridCoreUtils.getIndexByKey(key, that._expandedItems);
      if (expandIndex >= 0) {
        var {
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
      result = new Deferred().resolve();
    }
    return result;
  }
  _processDataItemHack() {
    return super._processDataItem.apply(this, arguments);
  }
  _processDataItem(data, options) {
    var that = this;
    var dataItem = super._processDataItem.apply(that, arguments);
    dataItem.isExpanded = that.isRowExpanded(dataItem.key);
    if (options.detailColumnIndex === undefined) {
      options.detailColumnIndex = -1;
      each(options.visibleColumns, (index, column) => {
        if (column.command === 'expand' && !isDefined(column.groupIndex)) {
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
  }
  _processItemsHack() {
    return super._processItems.apply(this, arguments);
  }
  _processItems(items, change) {
    var that = this;
    var {
      changeType
    } = change;
    var result = [];
    items = super._processItems.apply(that, arguments);
    if (changeType === 'loadingAll') {
      return items;
    }
    if (changeType === 'refresh') {
      that._expandedItems = grep(that._expandedItems, item => item.visible);
    }
    each(items, (index, item) => {
      result.push(item);
      var expandIndex = gridCoreUtils.getIndexByKey(item.key, that._expandedItems);
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
  }
  optionChanged(args) {
    var that = this;
    var isEnabledChanged;
    var isAutoExpandAllChanged;
    if (args.name === 'masterDetail') {
      args.name = 'dataSource';
      // eslint-disable-next-line default-case
      switch (args.fullName) {
        case 'masterDetail':
          {
            var value = args.value || {};
            var previousValue = args.previousValue || {};
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
    super.optionChanged(args);
  }
};
var resizing = Base => class ResizingMasterDetailExtender extends Base {
  fireContentReadyAction() {
    super.fireContentReadyAction.apply(this, arguments);
    this._updateParentDataGrids(this.component.$element());
  }
  _updateParentDataGrids($element) {
    var $masterDetailRow = $element.closest(".".concat(MASTER_DETAIL_ROW_CLASS));
    if ($masterDetailRow.length) {
      when(this._updateMasterDataGrid($masterDetailRow, $element)).done(() => {
        this._updateParentDataGrids($masterDetailRow.parent());
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updateMasterDataGrid($masterDetailRow, $detailElement) {
    var masterRowOptions = $($masterDetailRow).data('options');
    var masterDataGrid = $($masterDetailRow).closest(".".concat(this.getWidgetContainerClass())).parent().data('dxDataGrid');
    if (masterRowOptions && masterDataGrid) {
      return this._updateMasterDataGridCore(masterDataGrid, masterRowOptions);
    }
    return undefined;
  }
  _updateMasterDataGridCore(masterDataGrid, masterRowOptions) {
    var d = Deferred();
    if (masterDataGrid.getView('rowsView').isFixedColumns()) {
      // @ts-expect-error
      this._updateFixedMasterDetailGrids(masterDataGrid, masterRowOptions.rowIndex, $(masterRowOptions.rowElement)).done(d.resolve);
    } else {
      if (masterDataGrid.option('scrolling.useNative') === true) {
        masterDataGrid.updateDimensions().done(() => d.resolve(true));
        return;
      }
      var scrollable = masterDataGrid.getScrollable();
      if (scrollable) {
        // T607490
        scrollable === null || scrollable === void 0 ? void 0 : scrollable.update().done(() => d.resolve());
      } else {
        d.resolve();
      }
    }
    return d.promise();
  }
  _updateFixedMasterDetailGrids(masterDataGrid, masterRowIndex, $detailElement) {
    var d = Deferred();
    var $rows = $(masterDataGrid.getRowElement(masterRowIndex));
    var $tables = $(masterDataGrid.getView('rowsView').getTableElements());
    var rowsNotEqual = ($rows === null || $rows === void 0 ? void 0 : $rows.length) === 2 && getHeight($rows.eq(0)) !== getHeight($rows.eq(1));
    var tablesNotEqual = ($tables === null || $tables === void 0 ? void 0 : $tables.length) === 2 && getHeight($tables.eq(0)) !== getHeight($tables.eq(1));
    if (rowsNotEqual || tablesNotEqual) {
      var detailElementWidth = getWidth($detailElement);
      masterDataGrid.updateDimensions().done(() => {
        var isDetailHorizontalScrollCanBeShown = this.option('columnAutoWidth') && masterDataGrid.option('scrolling.useNative') === true;
        var isDetailGridWidthChanged = isDetailHorizontalScrollCanBeShown && detailElementWidth !== getWidth($detailElement);
        if (isDetailHorizontalScrollCanBeShown && isDetailGridWidthChanged) {
          this.updateDimensions().done(() => d.resolve(true));
        } else {
          d.resolve(true);
        }
      });
      return d.promise();
    }
    return Deferred().resolve();
  }
  _toggleBestFitMode(isBestFit) {
    super._toggleBestFitMode.apply(this, arguments);
    if (this.option('masterDetail.template')) {
      var $rowsTable = this._rowsView.getTableElement();
      if ($rowsTable) {
        $rowsTable.find('.dx-master-detail-cell').css('maxWidth', isBestFit ? 0 : '');
      }
    }
  }
};
var rowsView = Base => class RowsViewMasterDetailExtender extends Base {
  _getCellTemplate(options) {
    var that = this;
    var {
      column
    } = options;
    var editingController = this._editingController;
    var isEditRow = editingController && editingController.isEditRow(options.rowIndex);
    var template;
    if (column.command === 'detail' && !isEditRow) {
      template = that.option('masterDetail.template') || {
        allowRenderToDetachedContainer: false,
        render: that._getDefaultTemplate(column)
      };
    } else {
      template = super._getCellTemplate.apply(that, arguments);
    }
    return template;
  }
  _isDetailRow(row) {
    return row && row.rowType && row.rowType.indexOf('detail') === 0;
  }
  _createRow(row) {
    var $row = super._createRow.apply(this, arguments);
    if (row && this._isDetailRow(row)) {
      this.option('showRowLines') && $row.addClass(ROW_LINES_CLASS);
      $row.addClass(MASTER_DETAIL_ROW_CLASS);
      if (isDefined(row.visible)) {
        $row.toggle(row.visible);
      }
    }
    return $row;
  }
  _renderCells($row, options) {
    var {
      row
    } = options;
    var $detailCell;
    var visibleColumns = this._columnsController.getVisibleColumns();
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
      super._renderCells.apply(this, arguments);
    }
  }
};
export var masterDetailModule = {
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
