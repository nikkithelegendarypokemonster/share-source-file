"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportController = exports.DataProvider = void 0;
require("../../../../ui/button");
require("../../../../ui/drop_down_button");
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _position = require("../../../../core/utils/position");
var _string = require("../../../../core/utils/string");
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _list_light = _interopRequireDefault(require("../../../../ui/list_light"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_export = require("../../../grids/grid_core/m_export");
var _m_core = _interopRequireDefault(require("../m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const DATAGRID_EXPORT_MENU_CLASS = 'dx-datagrid-export-menu';
const DATAGRID_EXPORT_BUTTON_CLASS = 'dx-datagrid-export-button';
const DATAGRID_EXPORT_TOOLBAR_BUTTON_NAME = 'exportButton';
const DATAGRID_EXPORT_ICON = 'export';
const DATAGRID_EXPORT_EXCEL_ICON = 'xlsxfile';
const DATAGRID_EXPORT_SELECTED_ICON = 'exportselected';
const DATAGRID_PDF_EXPORT_ICON = 'pdffile';
let DataProvider = exports.DataProvider = /*#__PURE__*/function () {
  function DataProvider(exportController, initialColumnWidthsByColumnIndex, selectedRowsOnly) {
    this._exportController = exportController;
    this._initialColumnWidthsByColumnIndex = initialColumnWidthsByColumnIndex;
    this._selectedRowsOnly = selectedRowsOnly;
  }
  var _proto = DataProvider.prototype;
  _proto._getGroupValue = function _getGroupValue(item) {
    const {
      key,
      data,
      rowType,
      groupIndex,
      summaryCells
    } = item;
    const groupColumn = this._options.groupColumns[groupIndex];
    const value = _m_core.default.getDisplayValue(groupColumn, groupColumn.deserializeValue ? groupColumn.deserializeValue(key[groupIndex]) : key[groupIndex], data, rowType);
    let result = "".concat(groupColumn.caption, ": ").concat(_m_core.default.formatValue(value, groupColumn));
    if (summaryCells && summaryCells[0] && summaryCells[0].length) {
      result += " ".concat(_m_core.default.getGroupRowSummaryText(summaryCells[0], this._options.summaryTexts));
    }
    return result;
  };
  _proto._correctCellIndex = function _correctCellIndex(cellIndex) {
    return cellIndex;
  };
  _proto._initOptions = function _initOptions() {
    const exportController = this._exportController;
    const groupColumns = exportController._columnsController.getGroupColumns();
    this._options = {
      columns: exportController._getColumns(this._initialColumnWidthsByColumnIndex),
      groupColumns,
      items: this._selectedRowsOnly || exportController._selectionOnly ? exportController._getSelectedItems() : exportController._getAllItems(),
      isHeadersVisible: exportController.option('showColumnHeaders'),
      summaryTexts: exportController.option('summary.texts'),
      rtlEnabled: exportController.option('rtlEnabled')
    };
  };
  _proto.getHeaderStyles = function getHeaderStyles() {
    return [{
      bold: true,
      alignment: 'center'
    }, {
      bold: true,
      alignment: 'left'
    }, {
      bold: true,
      alignment: 'right'
    }];
  };
  _proto.getGroupRowStyle = function getGroupRowStyle() {
    return {
      bold: true,
      alignment: (0, _position.getDefaultAlignment)(this._options.rtlEnabled)
    };
  };
  _proto.getColumnStyles = function getColumnStyles() {
    const columnStyles = [];
    this.getColumns().forEach(column => {
      columnStyles.push({
        alignment: column.alignment || 'left',
        format: column.format,
        dataType: column.dataType
      });
    });
    return columnStyles;
  };
  _proto.getStyles = function getStyles() {
    return [...this.getHeaderStyles(), ...this.getColumnStyles(), this.getGroupRowStyle()];
  };
  _proto._getTotalCellStyleId = function _getTotalCellStyleId(cellIndex) {
    var _a;
    const alignment = ((_a = this.getColumns()[cellIndex]) === null || _a === void 0 ? void 0 : _a.alignment) || 'right';
    return this.getHeaderStyles().map(style => style.alignment).indexOf(alignment);
  };
  _proto.getStyleId = function getStyleId(rowIndex, cellIndex) {
    if (rowIndex < this.getHeaderRowCount()) {
      return 0;
    }
    if (this.isTotalCell(rowIndex - this.getHeaderRowCount(), cellIndex)) {
      return this._getTotalCellStyleId(cellIndex);
    }
    if (this.isGroupRow(rowIndex - this.getHeaderRowCount())) {
      return this.getHeaderStyles().length + this.getColumns().length;
    }
    return cellIndex + this.getHeaderStyles().length;
  };
  _proto.getColumns = function getColumns(getColumnsByAllRows) {
    const {
      columns
    } = this._options;
    return getColumnsByAllRows ? columns : columns[columns.length - 1];
  };
  _proto.getColumnsWidths = function getColumnsWidths() {
    const columns = this.getColumns();
    return (0, _type.isDefined)(columns) ? columns.map(c => c.width) : undefined;
  };
  _proto.getRowsCount = function getRowsCount() {
    return this._options.items.length + this.getHeaderRowCount();
  };
  _proto.getHeaderRowCount = function getHeaderRowCount() {
    if (this.isHeadersVisible()) {
      return this._options.columns.length - 1;
    }
    return 0;
  };
  _proto.isGroupRow = function isGroupRow(rowIndex) {
    return rowIndex < this._options.items.length && this._options.items[rowIndex].rowType === 'group';
  };
  _proto.getGroupLevel = function getGroupLevel(rowIndex) {
    const item = this._options.items[rowIndex - this.getHeaderRowCount()];
    const groupIndex = item && item.groupIndex;
    if (item && item.rowType === 'totalFooter') {
      return 0;
    }
    return (0, _type.isDefined)(groupIndex) ? groupIndex : this._options.groupColumns.length;
  };
  _proto.getCellType = function getCellType(rowIndex, cellIndex) {
    const columns = this.getColumns();
    if (rowIndex < this.getHeaderRowCount()) {
      return 'string';
    }
    rowIndex -= this.getHeaderRowCount();
    if (cellIndex < columns.length) {
      const item = this._options.items.length && this._options.items[rowIndex];
      const column = columns[cellIndex];
      if (item && item.rowType === 'data') {
        if (isFinite(item.values[this._correctCellIndex(cellIndex)]) && !(0, _type.isDefined)(column.customizeText)) {
          return (0, _type.isDefined)(column.lookup) ? column.lookup.dataType : column.dataType;
        }
      }
      return 'string';
    }
  };
  _proto.ready = function ready() {
    const that = this;
    that._initOptions();
    const options = that._options;
    return (0, _deferred.when)(options.items).done(items => {
      options.items = items;
    }).fail(() => {
      options.items = [];
    });
  };
  _proto._convertFromGridGroupSummaryItems = function _convertFromGridGroupSummaryItems(gridGroupSummaryItems) {
    if ((0, _type.isDefined)(gridGroupSummaryItems) && gridGroupSummaryItems.length > 0) {
      return gridGroupSummaryItems.map(item => ({
        value: item.value,
        name: item.name
      }));
    }
  };
  _proto.getCellData = function getCellData(rowIndex, cellIndex, isExcelJS) {
    let value;
    let column;
    const result = {
      cellSourceData: {},
      value
    };
    const columns = this.getColumns();
    const correctedCellIndex = this._correctCellIndex(cellIndex);
    if (rowIndex < this.getHeaderRowCount()) {
      const columnsRow = this.getColumns(true)[rowIndex];
      column = columnsRow[cellIndex];
      result.cellSourceData.rowType = 'header';
      result.cellSourceData.column = column && column.gridColumn;
      result.value = column && column.caption;
    } else {
      rowIndex -= this.getHeaderRowCount();
      const item = this._options.items.length && this._options.items[rowIndex];
      if (item) {
        const itemValues = item.values;
        result.cellSourceData.rowType = item.rowType;
        result.cellSourceData.column = columns[cellIndex] && columns[cellIndex].gridColumn;
        switch (item.rowType) {
          case 'groupFooter':
          case 'totalFooter':
            if (correctedCellIndex < itemValues.length) {
              value = itemValues[correctedCellIndex];
              if ((0, _type.isDefined)(value)) {
                result.cellSourceData.value = value.value;
                result.cellSourceData.totalSummaryItemName = value.name;
                result.value = _m_core.default.getSummaryText(value, this._options.summaryTexts);
              } else {
                result.cellSourceData.value = undefined;
              }
            }
            break;
          case 'group':
            result.cellSourceData.groupIndex = item.groupIndex;
            if (cellIndex < 1) {
              result.cellSourceData.column = this._options.groupColumns[item.groupIndex];
              result.cellSourceData.value = item.key[item.groupIndex];
              result.cellSourceData.groupSummaryItems = this._convertFromGridGroupSummaryItems(item.summaryCells[0]);
              result.value = this._getGroupValue(item);
            } else {
              const summaryItems = item.values[correctedCellIndex];
              if (Array.isArray(summaryItems)) {
                result.cellSourceData.groupSummaryItems = this._convertFromGridGroupSummaryItems(summaryItems);
                value = '';
                for (let i = 0; i < summaryItems.length; i++) {
                  value += (i > 0 ? isExcelJS ? '\n' : ' \n ' : '') + _m_core.default.getSummaryText(summaryItems[i], this._options.summaryTexts);
                }
                result.value = value;
              } else {
                result.cellSourceData.value = undefined;
              }
            }
            break;
          default:
            column = columns[cellIndex];
            if (column) {
              const value = itemValues[correctedCellIndex];
              const displayValue = _m_core.default.getDisplayValue(column, value, item.data, item.rowType); // from 'ui.grid_core.rows.js: _getCellOptions'
              if (!isFinite(displayValue) || (0, _type.isDefined)(column.customizeText)) {
                // similar to 'ui.grid_core.rows.js: _getCellOptions'
                if (isExcelJS && (0, _type.isDefined)(column.customizeText) && column.customizeText === this._exportController._columnsController.getCustomizeTextByDataType('boolean')) {
                  result.value = displayValue;
                } else {
                  result.value = _m_core.default.formatValue(displayValue, column);
                }
              } else {
                result.value = displayValue;
              }
              result.cellSourceData.value = value;
            }
            result.cellSourceData.data = item.data;
        }
      }
    }
    return result;
  };
  _proto.isHeadersVisible = function isHeadersVisible() {
    return this._options.isHeadersVisible;
  };
  _proto.isTotalCell = function isTotalCell(rowIndex, cellIndex) {
    const {
      items
    } = this._options;
    const item = items[rowIndex];
    const correctCellIndex = this._correctCellIndex(cellIndex);
    const isSummaryAlignByColumn = item.summaryCells && item.summaryCells[correctCellIndex] && item.summaryCells[correctCellIndex].length > 0 && item.summaryCells[correctCellIndex][0].alignByColumn;
    return item && item.rowType === 'groupFooter' || item.rowType === 'totalFooter' || isSummaryAlignByColumn;
  };
  _proto.getCellMerging = function getCellMerging(rowIndex, cellIndex) {
    const {
      columns
    } = this._options;
    const column = columns[rowIndex] && columns[rowIndex][cellIndex];
    return column ? {
      colspan: (column.exportColspan || 1) - 1,
      rowspan: (column.rowspan || 1) - 1
    } : {
      colspan: 0,
      rowspan: 0
    };
  };
  _proto.getFrozenArea = function getFrozenArea() {
    const that = this;
    return {
      x: 0,
      y: that.getHeaderRowCount()
    };
  };
  return DataProvider;
}();
let ExportController = exports.ExportController = /*#__PURE__*/function (_dataGridCore$ViewCon) {
  _inheritsLoose(ExportController, _dataGridCore$ViewCon);
  function ExportController() {
    return _dataGridCore$ViewCon.apply(this, arguments) || this;
  }
  var _proto2 = ExportController.prototype;
  _proto2.init = function init() {
    this.throwWarningIfNoOnExportingEvent();
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');
    this._selectionController = this.getController('selection');
    this._rowsView = this.getView('rowsView');
    this._headersView = this.getView('columnHeadersView');
    this.createAction('onExporting', {
      excludeValidators: ['disabled', 'readOnly']
    });
  };
  _proto2._getEmptyCell = function _getEmptyCell() {
    return {
      caption: '',
      colspan: 1,
      rowspan: 1
    };
  }
  /**
   * @extended: adaptivity
   */;
  _proto2._updateColumnWidth = function _updateColumnWidth(column, width) {
    column.width = width;
  };
  _proto2._getColumns = function _getColumns(initialColumnWidthsByColumnIndex) {
    let result = [];
    let i;
    let columns;
    const columnsController = this._columnsController;
    const rowCount = columnsController.getRowCount();
    for (i = 0; i <= rowCount; i++) {
      const currentHeaderRow = [];
      columns = columnsController.getVisibleColumns(i, true);
      let columnWidthsByColumnIndex;
      if (i === rowCount) {
        if (this._updateLockCount) {
          columnWidthsByColumnIndex = initialColumnWidthsByColumnIndex;
        } else {
          const columnWidths = this._getColumnWidths(this._headersView, this._rowsView);
          if (columnWidths && columnWidths.length) {
            columnWidthsByColumnIndex = {};
            for (let i = 0; i < columns.length; i++) {
              columnWidthsByColumnIndex[columns[i].index] = columnWidths[i];
            }
          }
        }
      }
      for (let j = 0; j < columns.length; j++) {
        const column = (0, _extend.extend)({}, columns[j], {
          dataType: columns[j].dataType === 'datetime' ? 'date' : columns[j].dataType,
          gridColumn: columns[j]
        });
        if (this._needColumnExporting(column)) {
          const currentColspan = this._calculateExportColspan(column);
          if ((0, _type.isDefined)(currentColspan)) {
            column.exportColspan = currentColspan;
          }
          if (columnWidthsByColumnIndex) {
            this._updateColumnWidth(column, columnWidthsByColumnIndex[column.index]);
          }
          currentHeaderRow.push(column);
        }
      }
      result.push(currentHeaderRow);
    }
    columns = result[rowCount];
    result = (0, _m_export.prepareItems)(result.slice(0, -1), this._getEmptyCell());
    result.push(columns);
    return result;
  };
  _proto2._calculateExportColspan = function _calculateExportColspan(column) {
    if (!column.isBand) {
      return;
    }
    const childColumns = this._columnsController.getChildrenByBandColumn(column.index, true);
    if (!(0, _type.isDefined)(childColumns)) {
      return;
    }
    return childColumns.reduce((result, childColumn) => {
      if (this._needColumnExporting(childColumn)) {
        return result + (this._calculateExportColspan(childColumn) || 1);
      }
      return result;
    }, 0);
  };
  _proto2._needColumnExporting = function _needColumnExporting(column) {
    return !column.command && (column.allowExporting || column.allowExporting === undefined);
  };
  _proto2._getFooterSummaryItems = function _getFooterSummaryItems(summaryCells, isTotal) {
    const result = [];
    let estimatedItemsCount = 1;
    let i = 0;
    do {
      const values = [];
      for (let j = 0; j < summaryCells.length; j++) {
        const summaryCell = summaryCells[j];
        const itemsLength = summaryCell.length;
        if (estimatedItemsCount < itemsLength) {
          estimatedItemsCount = itemsLength;
        }
        values.push(summaryCell[i]);
      }
      result.push({
        values,
        rowType: isTotal ? 'totalFooter' : 'groupFooter'
      });
    } while (i++ < estimatedItemsCount - 1);
    return result;
  };
  _proto2._hasSummaryGroupFooters = function _hasSummaryGroupFooters() {
    const groupItems = this.option('summary.groupItems');
    if ((0, _type.isDefined)(groupItems)) {
      for (let i = 0; i < groupItems.length; i++) {
        if (groupItems[i].showInGroupFooter) {
          return true;
        }
      }
    }
    return false;
  };
  _proto2._getItemsWithSummaryGroupFooters = function _getItemsWithSummaryGroupFooters(sourceItems) {
    let result = [];
    let beforeGroupFooterItems = [];
    let groupFooterItems = [];
    for (let i = 0; i < sourceItems.length; i++) {
      const item = sourceItems[i];
      if (item.rowType === 'groupFooter') {
        groupFooterItems = this._getFooterSummaryItems(item.summaryCells);
        result = result.concat(beforeGroupFooterItems, groupFooterItems);
        beforeGroupFooterItems = [];
      } else {
        beforeGroupFooterItems.push(item);
      }
    }
    return result.length ? result : beforeGroupFooterItems;
  };
  _proto2._updateGroupValuesWithSummaryByColumn = function _updateGroupValuesWithSummaryByColumn(sourceItems) {
    let summaryValues = [];
    for (let i = 0; i < sourceItems.length; i++) {
      const item = sourceItems[i];
      const {
        summaryCells
      } = item;
      if (item.rowType === 'group' && summaryCells && summaryCells.length > 1) {
        const groupColumnCount = item.values.length;
        for (let j = 1; j < summaryCells.length; j++) {
          for (let k = 0; k < summaryCells[j].length; k++) {
            const summaryItem = summaryCells[j][k];
            if (summaryItem && summaryItem.alignByColumn) {
              if (!Array.isArray(summaryValues[j - groupColumnCount])) {
                summaryValues[j - groupColumnCount] = [];
              }
              summaryValues[j - groupColumnCount].push(summaryItem);
            }
          }
        }
        if (summaryValues.length > 0) {
          item.values.push(...summaryValues);
          summaryValues = [];
        }
      }
    }
  };
  _proto2._processUnExportedItems = function _processUnExportedItems(items) {
    const columns = this._columnsController.getVisibleColumns(null, true);
    const groupColumns = this._columnsController.getGroupColumns();
    let values;
    let summaryCells;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let isCommand = false;
      values = [];
      summaryCells = [];
      for (let j = 0; j < columns.length; j++) {
        const column = columns[j];
        isCommand || (isCommand = ['detailExpand', 'buttons'].includes(column.type));
        if (this._needColumnExporting(column)) {
          if (item.values) {
            if (item.rowType === 'group' && !values.length) {
              values.push(item.key[item.groupIndex]);
            } else {
              values.push(item.values[j]);
            }
          }
          if (item.summaryCells) {
            if (item.rowType === 'group' && !summaryCells.length) {
              const index = j - groupColumns.length + item.groupIndex;
              summaryCells.push(item.summaryCells[isCommand ? index : index + 1]);
            } else {
              summaryCells.push(item.summaryCells[j]);
            }
          }
        }
      }
      if (values.length) {
        item.values = values;
      }
      if (summaryCells.length) {
        item.summaryCells = summaryCells;
      }
    }
  };
  _proto2._getAllItems = function _getAllItems(data) {
    let skipFilter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const that = this;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    // @ts-expect-error
    const footerItems = this._dataController.footerItems();
    const totalItem = footerItems.length && footerItems[0];
    const summaryTotalItems = that.option('summary.totalItems');
    let summaryCells;
    (0, _deferred.when)(data).done(data => {
      this._dataController.loadAll(data, skipFilter).done((sourceItems, totalAggregates) => {
        that._updateGroupValuesWithSummaryByColumn(sourceItems);
        if (that._hasSummaryGroupFooters()) {
          sourceItems = that._getItemsWithSummaryGroupFooters(sourceItems);
        }
        summaryCells = totalItem && totalItem.summaryCells;
        if ((0, _type.isDefined)(totalAggregates) && summaryTotalItems) {
          summaryCells = that._getSummaryCells(summaryTotalItems, totalAggregates);
        }
        const summaryItems = totalItem && that._getFooterSummaryItems(summaryCells, true);
        if (summaryItems) {
          sourceItems = sourceItems.concat(summaryItems);
        }
        that._processUnExportedItems(sourceItems);
        d.resolve(sourceItems);
      }).fail(d.reject);
    }).fail(d.reject);
    return d;
  };
  _proto2._getSummaryCells = function _getSummaryCells(summaryTotalItems, totalAggregates) {
    // @ts-expect-error
    return this._dataController._calculateSummaryCells(summaryTotalItems, totalAggregates, this._columnsController.getVisibleColumns(null, true),
    // @ts-expect-error
    (summaryItem, column) => this._dataController._isDataColumn(column) ? column.index : -1);
  };
  _proto2._getSelectedItems = function _getSelectedItems() {
    if (this.needLoadItemsOnExportingSelectedItems()) {
      return this._getAllItems(this._selectionController.loadSelectedItemsWithFilter(), true);
    }
    return this._getAllItems(this._selectionController.getSelectedRowsData());
  };
  _proto2._getColumnWidths = function _getColumnWidths(headersView, rowsView) {
    return headersView && headersView.isVisible() ? headersView.getColumnWidths() : rowsView.getColumnWidths();
  };
  _proto2.throwWarningIfNoOnExportingEvent = function throwWarningIfNoOnExportingEvent() {
    var _a, _b;
    const hasOnExporting = (_b = (_a = this.component).hasActionSubscription) === null || _b === void 0 ? void 0 : _b.call(_a, 'onExporting');
    if (this.option('export.enabled') && !hasOnExporting) {
      _ui.default.log('W1024');
    }
  };
  _proto2.callbackNames = function callbackNames() {
    return ['selectionOnlyChanged'];
  };
  _proto2.getDataProvider = function getDataProvider(selectedRowsOnly) {
    const columnWidths = this._getColumnWidths(this._headersView, this._rowsView);
    let initialColumnWidthsByColumnIndex;
    if (columnWidths && columnWidths.length) {
      initialColumnWidthsByColumnIndex = {};
      const columnsLastRowVisibleColumns = this._columnsController.getVisibleColumns(this._columnsController.getRowCount(), true);
      for (let i = 0; i < columnsLastRowVisibleColumns.length; i++) {
        initialColumnWidthsByColumnIndex[columnsLastRowVisibleColumns[i].index] = columnWidths[i];
      }
    }
    return new DataProvider(this, initialColumnWidthsByColumnIndex, selectedRowsOnly);
  };
  _proto2.exportTo = function exportTo(selectedRowsOnly, format) {
    this._selectionOnly = selectedRowsOnly;
    const onExporting = this.getAction('onExporting');
    const eventArgs = {
      rtlEnabled: this.option('rtlEnabled'),
      selectedRowsOnly: !!selectedRowsOnly,
      format,
      fileName: 'DataGrid',
      cancel: false
    };
    (0, _type.isFunction)(onExporting) && onExporting(eventArgs);
  };
  _proto2.publicMethods = function publicMethods() {
    return ['getDataProvider'];
  };
  _proto2.selectionOnly = function selectionOnly(value) {
    if ((0, _type.isDefined)(value)) {
      this._isSelectedRows = value;
      this.selectionOnlyChanged.fire();
    } else {
      return this._isSelectedRows;
    }
  };
  _proto2.optionChanged = function optionChanged(args) {
    _dataGridCore$ViewCon.prototype.optionChanged.call(this, args);
    if (args.name === 'export') {
      this.throwWarningIfNoOnExportingEvent();
    }
  };
  _proto2.needLoadItemsOnExportingSelectedItems = function needLoadItemsOnExportingSelectedItems() {
    var _a;
    return (_a = this.option('loadItemsOnExportingSelectedItems')) !== null && _a !== void 0 ? _a : this._dataController._dataSource.remoteOperations().filtering;
  };
  return ExportController;
}(_m_core.default.ViewController);
const editing = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(ExportEditingControllerExtender, _Base);
  function ExportEditingControllerExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto3 = ExportEditingControllerExtender.prototype;
  // @ts-expect-error
  _proto3.callbackNames = function callbackNames() {
    const callbackList = _Base.prototype.callbackNames.call(this);
    return (0, _type.isDefined)(callbackList) ? callbackList.push('editingButtonsUpdated') : ['editingButtonsUpdated'];
  };
  _proto3._updateEditButtons = function _updateEditButtons() {
    _Base.prototype._updateEditButtons.call(this);
    // @ts-expect-error
    this.editingButtonsUpdated.fire();
  };
  return ExportEditingControllerExtender;
}(Base);
const headerPanel = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(ExportHeaderPanelExtender, _Base2);
  function ExportHeaderPanelExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto4 = ExportHeaderPanelExtender.prototype;
  _proto4._getToolbarItems = function _getToolbarItems() {
    const items = _Base2.prototype._getToolbarItems.call(this);
    const exportButton = this._getExportToolbarButton();
    if (exportButton) {
      items.push(exportButton);
      this._correctItemsPosition(items);
    }
    return items;
  };
  _proto4._getExportToolbarButton = function _getExportToolbarButton() {
    const items = this._getExportToolbarItems();
    if (items.length === 0) {
      return null;
    }
    const disabled = this._needDisableExportButton();
    const toolbarButtonOptions = {
      name: DATAGRID_EXPORT_TOOLBAR_BUTTON_NAME,
      location: 'after',
      locateInMenu: 'auto',
      sortIndex: 30,
      options: {
        items
      },
      disabled
    };
    if (items.length === 1) {
      const widgetOptions = _extends(_extends({}, items[0]), {
        hint: items[0].text,
        elementAttr: {
          class: DATAGRID_EXPORT_BUTTON_CLASS
        }
      });
      toolbarButtonOptions.widget = 'dxButton';
      toolbarButtonOptions.showText = 'inMenu';
      toolbarButtonOptions.options = widgetOptions;
    } else {
      const widgetOptions = {
        icon: DATAGRID_EXPORT_ICON,
        displayExpr: 'text',
        items,
        hint: this.option('export.texts.exportTo'),
        elementAttr: {
          class: DATAGRID_EXPORT_BUTTON_CLASS
        },
        dropDownOptions: {
          width: 'auto',
          _wrapperClassExternal: DATAGRID_EXPORT_MENU_CLASS
        }
      };
      toolbarButtonOptions.options = widgetOptions;
      toolbarButtonOptions.widget = 'dxDropDownButton';
      toolbarButtonOptions.menuItemTemplate = (_data, _index, container) => {
        this._createComponent((0, _renderer.default)(container), _list_light.default, {
          items
        });
      };
    }
    return toolbarButtonOptions;
  };
  _proto4._getExportToolbarItems = function _getExportToolbarItems() {
    var _a;
    const exportOptions = this.option('export');
    const texts = this.option('export.texts');
    const formats = (_a = this.option('export.formats')) !== null && _a !== void 0 ? _a : [];
    if (!exportOptions.enabled) {
      return [];
    }
    const items = [];
    formats.forEach(formatType => {
      let formatName = formatType.toUpperCase();
      let exportAllIcon = DATAGRID_EXPORT_ICON;
      const exportSelectedIcon = DATAGRID_EXPORT_SELECTED_ICON;
      if (formatType === 'xlsx') {
        formatName = 'Excel';
        exportAllIcon = DATAGRID_EXPORT_EXCEL_ICON;
      }
      if (formatType === 'pdf') {
        exportAllIcon = DATAGRID_PDF_EXPORT_ICON;
      }
      items.push({
        text: (0, _string.format)(texts.exportAll, formatName),
        icon: exportAllIcon,
        onClick: () => {
          this._exportController.exportTo(false, formatType);
        }
      });
      if (exportOptions.allowExportSelectedData) {
        items.push({
          text: (0, _string.format)(texts.exportSelectedRows, formatName),
          icon: exportSelectedIcon,
          onClick: () => {
            this._exportController.exportTo(true, formatType);
          }
        });
      }
    });
    return items;
  };
  _proto4._correctItemsPosition = function _correctItemsPosition(items) {
    items.sort((itemA, itemB) => itemA.sortIndex - itemB.sortIndex);
  };
  _proto4._isExportButtonVisible = function _isExportButtonVisible() {
    return this.option('export.enabled');
  };
  _proto4.optionChanged = function optionChanged(args) {
    _Base2.prototype.optionChanged.call(this, args);
    if (args.name === 'export') {
      args.handled = true;
      this._invalidate();
    }
  };
  _proto4._needDisableExportButton = function _needDisableExportButton() {
    const isDataColumnsInvisible = !this._columnsController.hasVisibleDataColumns();
    const hasUnsavedChanges = this._editingController.hasChanges();
    return isDataColumnsInvisible || hasUnsavedChanges;
  };
  _proto4._columnOptionChanged = function _columnOptionChanged(e) {
    // @ts-expect-error
    _Base2.prototype._columnOptionChanged.call(this, e);
    const isColumnLocationChanged = _m_core.default.checkChanges(e.optionNames, ['groupIndex', 'visible', 'all']);
    if (isColumnLocationChanged) {
      const disabled = this._needDisableExportButton();
      this.setToolbarItemDisabled('exportButton', disabled);
    }
  };
  _proto4.init = function init() {
    _Base2.prototype.init.call(this);
    this._exportController = this.getController('export');
    // @ts-expect-error
    this._editingController.editingButtonsUpdated.add(() => {
      const disabled = this._needDisableExportButton();
      this.setToolbarItemDisabled('exportButton', disabled);
    });
  };
  _proto4.isVisible = function isVisible() {
    return _Base2.prototype.isVisible.call(this) || this._isExportButtonVisible();
  };
  return ExportHeaderPanelExtender;
}(Base);
_m_core.default.registerModule('export', {
  defaultOptions() {
    return {
      export: {
        enabled: false,
        fileName: 'DataGrid',
        formats: ['xlsx'],
        allowExportSelectedData: false,
        texts: {
          exportTo: _message.default.format('dxDataGrid-exportTo'),
          exportAll: _message.default.format('dxDataGrid-exportAll'),
          exportSelectedRows: _message.default.format('dxDataGrid-exportSelectedRows')
        }
      }
    };
  },
  controllers: {
    export: ExportController
  },
  extenders: {
    controllers: {
      editing
    },
    views: {
      headerPanel
    }
  }
});