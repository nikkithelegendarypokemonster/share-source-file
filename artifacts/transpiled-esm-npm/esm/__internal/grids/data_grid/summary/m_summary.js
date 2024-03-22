/* eslint-disable max-classes-per-file */
import $ from '../../../../core/renderer';
import { noop } from '../../../../core/utils/common';
import { compileGetter } from '../../../../core/utils/data';
import { extend } from '../../../../core/utils/extend';
import { each, map } from '../../../../core/utils/iterator';
import { isDefined, isEmptyObject, isFunction, isPlainObject, isString } from '../../../../core/utils/type';
import dataQuery from '../../../../data/query';
import storeHelper from '../../../../data/store_helper';
// @ts-expect-error
import { normalizeSortingInfo } from '../../../../data/utils';
import messageLocalization from '../../../../localization/message';
import errors from '../../../../ui/widget/ui.errors';
import { ColumnsView } from '../../../grids/grid_core/views/m_columns_view';
import AggregateCalculator from '../m_aggregate_calculator';
import gridCore from '../m_core';
import dataSourceAdapterProvider from '../m_data_source_adapter';
var DATAGRID_TOTAL_FOOTER_CLASS = 'dx-datagrid-total-footer';
var DATAGRID_SUMMARY_ITEM_CLASS = 'dx-datagrid-summary-item';
var DATAGRID_TEXT_CONTENT_CLASS = 'dx-datagrid-text-content';
var DATAGRID_GROUP_FOOTER_CLASS = 'dx-datagrid-group-footer';
var DATAGRID_GROUP_TEXT_CONTENT_CLASS = 'dx-datagrid-group-text-content';
var DATAGRID_NOWRAP_CLASS = 'dx-datagrid-nowrap';
var DATAGRID_FOOTER_ROW_CLASS = 'dx-footer-row';
var DATAGRID_CELL_DISABLED = 'dx-cell-focus-disabled';
var DATAGRID_GROUP_FOOTER_ROW_TYPE = 'groupFooter';
var DATAGRID_TOTAL_FOOTER_ROW_TYPE = 'totalFooter';
export var renderSummaryCell = function renderSummaryCell(cell, options) {
  var $cell = $(cell);
  var {
    column
  } = options;
  var {
    summaryItems
  } = options;
  var $summaryItems = [];
  if (!column.command && summaryItems) {
    for (var i = 0; i < summaryItems.length; i++) {
      var summaryItem = summaryItems[i];
      var text = gridCore.getSummaryText(summaryItem, options.summaryTexts);
      $summaryItems.push($('<div>').css('textAlign', summaryItem.alignment || column.alignment).addClass(DATAGRID_SUMMARY_ITEM_CLASS).addClass(DATAGRID_TEXT_CONTENT_CLASS).addClass(summaryItem.cssClass).toggleClass(DATAGRID_GROUP_TEXT_CONTENT_CLASS, options.rowType === 'group').text(text).attr('aria-label', "".concat(column.caption, " ").concat(text)));
    }
    $cell.append($summaryItems);
  }
};
var getSummaryCellOptions = function getSummaryCellOptions(that, options) {
  var summaryTexts = that.option('summary.texts') || {};
  return {
    totalItem: options.row,
    summaryItems: options.row.summaryCells[options.columnIndex],
    summaryTexts
  };
};
var getGroupAggregates = function getGroupAggregates(data) {
  return data.summary || data.aggregates || [];
};
var recalculateWhileEditing = function recalculateWhileEditing(that) {
  return that.option('summary.recalculateWhileEditing');
};
var forEachGroup = function forEachGroup(groups, groupCount, callback, path) {
  path = path || [];
  for (var i = 0; i < groups.length; i++) {
    path.push(groups[i].key);
    if (groupCount === 1) {
      callback(path, groups[i].items);
    } else {
      forEachGroup(groups[i].items, groupCount - 1, callback, path);
    }
    path.pop();
  }
};
var applyAddedData = function applyAddedData(data, insertedData, groupLevel) {
  if (groupLevel) {
    return applyAddedData(data, insertedData.map(item => ({
      items: [item]
    }), groupLevel - 1));
  }
  return data.concat(insertedData);
};
var applyRemovedData = function applyRemovedData(data, removedData, groupLevel) {
  if (groupLevel) {
    return data.map(data => {
      var updatedData = {};
      var updatedItems = applyRemovedData(data.items || [], removedData, groupLevel - 1);
      Object.defineProperty(updatedData, 'aggregates', {
        get: () => data.aggregates,
        set: value => {
          data.aggregates = value;
        }
      });
      return extend(updatedData, data, {
        items: updatedItems
      });
    });
  }
  return data.filter(data => removedData.indexOf(data) < 0);
};
var sortGroupsBySummaryCore = function sortGroupsBySummaryCore(items, groups, sortByGroups) {
  if (!items || !groups.length) return items;
  var group = groups[0];
  var sorts = sortByGroups[0];
  var query;
  if (group && sorts && sorts.length) {
    query = dataQuery(items);
    each(sorts, function (index) {
      if (index === 0) {
        query = query.sortBy(this.selector, this.desc);
      } else {
        query = query.thenBy(this.selector, this.desc);
      }
    });
    query.enumerate().done(sortedItems => {
      items = sortedItems;
    });
  }
  groups = groups.slice(1);
  sortByGroups = sortByGroups.slice(1);
  if (groups.length && sortByGroups.length) {
    each(items, function () {
      this.items = sortGroupsBySummaryCore(this.items, groups, sortByGroups);
    });
  }
  return items;
};
var sortGroupsBySummary = function sortGroupsBySummary(data, group, summary) {
  var sortByGroups = summary && summary.sortByGroups && summary.sortByGroups();
  if (sortByGroups && sortByGroups.length) {
    return sortGroupsBySummaryCore(data, group, sortByGroups);
  }
  return data;
};
var calculateAggregates = function calculateAggregates(that, summary, data, groupLevel) {
  var calculator;
  if (recalculateWhileEditing(that)) {
    var editingController = that._editingController;
    if (editingController) {
      var insertedData = editingController.getInsertedData();
      if (insertedData.length) {
        data = applyAddedData(data, insertedData, groupLevel);
      }
      var removedData = editingController.getRemovedData();
      if (removedData.length) {
        data = applyRemovedData(data, removedData, groupLevel);
      }
    }
  }
  if (summary) {
    calculator = new AggregateCalculator({
      totalAggregates: summary.totalAggregates,
      groupAggregates: summary.groupAggregates,
      data,
      groupLevel
    });
    calculator.calculate();
  }
  return calculator ? calculator.totalAggregates() : [];
};
export class FooterView extends ColumnsView {
  _getRows() {
    // @ts-expect-error
    return this._dataController.footerItems();
  }
  _getCellOptions(options) {
    return extend(super._getCellOptions(options), getSummaryCellOptions(this, options));
  }
  _renderCellContent($cell, options) {
    renderSummaryCell($cell, options);
    // @ts-expect-error
    super._renderCellContent.apply(this, arguments);
  }
  _renderCore(change) {
    var needUpdateScrollLeft = false;
    // @ts-expect-error
    var totalItem = this._dataController.footerItems()[0];
    if (!change || !change.columnIndices) {
      this.element().empty().addClass(DATAGRID_TOTAL_FOOTER_CLASS).toggleClass(DATAGRID_NOWRAP_CLASS, !this.option('wordWrapEnabled'));
      needUpdateScrollLeft = true;
    }
    if (totalItem && totalItem.summaryCells && totalItem.summaryCells.length) {
      this._updateContent(this._renderTable({
        change
      }), change);
      needUpdateScrollLeft && this._updateScrollLeftPosition();
    }
  }
  _updateContent($newTable, change) {
    if (change && change.changeType === 'update' && change.columnIndices) {
      return this.waitAsyncTemplates().done(() => {
        var $row = this.getTableElement().find('.dx-row');
        var $newRow = $newTable.find('.dx-row');
        this._updateCells($row, $newRow, change.columnIndices[0]);
      });
    }
    // @ts-expect-error
    return super._updateContent.apply(this, arguments);
  }
  _rowClick(e) {
    // @ts-expect-error
    var item = this._dataController.footerItems()[e.rowIndex] || {};
    this.executeAction('onRowClick', extend({}, e, item));
  }
  _columnOptionChanged(e) {
    var {
      optionNames
    } = e;
    if (e.changeTypes.grouping) return;
    if (optionNames.width || optionNames.visibleWidth) {
      super._columnOptionChanged(e);
    }
  }
  _handleDataChanged(e) {
    var {
      changeType
    } = e;
    if (e.changeType === 'update' && e.repaintChangesOnly) {
      if (!e.totalColumnIndices) {
        this.render();
      } else if (e.totalColumnIndices.length) {
        this.render(null, {
          changeType: 'update',
          columnIndices: [e.totalColumnIndices]
        });
      }
    } else if (changeType === 'refresh' || changeType === 'append' || changeType === 'prepend') {
      this.render();
    }
  }
  _createRow(row) {
    // @ts-expect-error
    var $row = super._createRow.apply(this, arguments);
    if (row.rowType === DATAGRID_TOTAL_FOOTER_ROW_TYPE) {
      $row.addClass(DATAGRID_FOOTER_ROW_CLASS);
      $row.addClass(DATAGRID_CELL_DISABLED);
      $row.attr('tabindex', 0);
    }
    return $row;
  }
  getHeight() {
    return this.getElementHeight();
  }
  isVisible() {
    // @ts-expect-error
    return !!this._dataController.footerItems().length;
  }
}
var dataSourceAdapterExtender = Base => class SummaryDataSourceAdapterExtender extends Base {
  init() {
    super.init.apply(this, arguments);
    this._editingController = this.getController('editing');
    this._totalAggregates = [];
    this._summaryGetter = noop;
  }
  summaryGetter(summaryGetter) {
    if (!arguments.length) {
      return this._summaryGetter;
    }
    if (isFunction(summaryGetter)) {
      this._summaryGetter = summaryGetter;
    }
  }
  summary(summary) {
    if (!arguments.length) {
      return this._summaryGetter();
    }
    this._summaryGetter = function () {
      return summary;
    };
  }
  totalAggregates() {
    return this._totalAggregates;
  }
  isLastLevelGroupItemsPagingLocal() {
    var summary = this.summary();
    var sortByGroupsInfo = summary === null || summary === void 0 ? void 0 : summary.sortByGroups();
    return sortByGroupsInfo === null || sortByGroupsInfo === void 0 ? void 0 : sortByGroupsInfo.length;
  }
  sortLastLevelGroupItems(items, groups, paths) {
    var groupedItems = storeHelper.multiLevelGroup(dataQuery(items), groups).toArray();
    var result = [];
    paths.forEach(path => {
      forEachGroup(groupedItems, groups.length, (itemsPath, items) => {
        if (path.toString() === itemsPath.toString()) {
          result = result.concat(items);
        }
      });
    });
    return result;
  }
  _customizeRemoteOperations(options) {
    var summary = this.summary();
    if (summary) {
      if (options.remoteOperations.summary) {
        if (!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
          if (options.storeLoadOptions.group) {
            if (options.remoteOperations.grouping) {
              options.storeLoadOptions.groupSummary = summary.groupAggregates;
            } else if (summary.groupAggregates.length) {
              options.remoteOperations.paging = false;
            }
          }
          options.storeLoadOptions.totalSummary = summary.totalAggregates;
        }
      } else if (summary.totalAggregates.length || summary.groupAggregates.length && options.storeLoadOptions.group) {
        options.remoteOperations.paging = false;
      }
    }
    super._customizeRemoteOperations.apply(this, arguments);
    var cachedExtra = options.cachedData.extra;
    if ((cachedExtra === null || cachedExtra === void 0 ? void 0 : cachedExtra.summary) && !options.isCustomLoading) {
      options.storeLoadOptions.totalSummary = undefined;
    }
  }
  _handleDataLoadedCore(options) {
    var _a, _b;
    var groups = normalizeSortingInfo(options.storeLoadOptions.group || options.loadOptions.group || []);
    var remoteOperations = options.remoteOperations || {};
    var summary = this.summaryGetter()(remoteOperations);
    if (!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
      if (remoteOperations.summary) {
        if (!remoteOperations.paging && groups.length && summary) {
          if (!remoteOperations.grouping) {
            calculateAggregates(this, {
              groupAggregates: summary.groupAggregates
            }, options.data, groups.length);
          }
          options.data = sortGroupsBySummary(options.data, groups, summary);
        }
      } else if (!remoteOperations.paging && summary) {
        var operationTypes = options.operationTypes || {};
        var hasOperations = Object.keys(operationTypes).some(type => operationTypes[type]);
        if (!hasOperations || !((_b = (_a = options.cachedData) === null || _a === void 0 ? void 0 : _a.extra) === null || _b === void 0 ? void 0 : _b.summary) || groups.length && summary.groupAggregates.length) {
          var totalAggregates = calculateAggregates(this, summary, options.data, groups.length);
          options.extra = isPlainObject(options.extra) ? options.extra : {};
          options.extra.summary = totalAggregates;
          if (options.cachedData) {
            options.cachedData.extra = options.extra;
          }
        }
        options.data = sortGroupsBySummary(options.data, groups, summary);
      }
    }
    if (!options.isCustomLoading) {
      this._totalAggregates = options.extra && options.extra.summary || this._totalAggregates;
    }
    super._handleDataLoadedCore(options);
  }
};
dataSourceAdapterProvider.extend(dataSourceAdapterExtender);
var data = Base => class SummaryDataControllerExtender extends Base {
  _isDataColumn(column) {
    return column && (!isDefined(column.groupIndex) || column.showWhenGrouped);
  }
  _isGroupFooterVisible() {
    var groupItems = this.option('summary.groupItems') || [];
    for (var i = 0; i < groupItems.length; i++) {
      var groupItem = groupItems[i];
      var column = this._columnsController.columnOption(groupItem.showInColumn || groupItem.column);
      if (groupItem.showInGroupFooter && this._isDataColumn(column)) {
        return true;
      }
    }
    return false;
  }
  _processGroupItems(items, groupCount, options) {
    var data = options && options.data;
    // @ts-expect-error
    var result = super._processGroupItems.apply(this, arguments);
    if (options) {
      if (options.isGroupFooterVisible === undefined) {
        options.isGroupFooterVisible = this._isGroupFooterVisible();
      }
      if (data && data.items && options.isGroupFooterVisible && (options.collectContinuationItems || !data.isContinuationOnNextPage)) {
        result.push({
          rowType: DATAGRID_GROUP_FOOTER_ROW_TYPE,
          key: options.path.slice(),
          data,
          groupIndex: options.path.length - 1,
          values: []
        });
      }
    }
    return result;
  }
  _processGroupItem(groupItem, options) {
    var that = this;
    if (!options.summaryGroupItems) {
      options.summaryGroupItems = that.option('summary.groupItems') || [];
    }
    if (groupItem.rowType === 'group') {
      var groupColumnIndex = -1;
      var afterGroupColumnIndex = -1;
      each(options.visibleColumns, function (visibleIndex) {
        var prevColumn = options.visibleColumns[visibleIndex - 1];
        if (groupItem.groupIndex === this.groupIndex) {
          groupColumnIndex = this.index;
        }
        if (visibleIndex > 0 && prevColumn.command === 'expand' && this.command !== 'expand') {
          afterGroupColumnIndex = this.index;
        }
      });
      groupItem.summaryCells = this._calculateSummaryCells(options.summaryGroupItems, getGroupAggregates(groupItem.data), options.visibleColumns, (summaryItem, column) => {
        if (summaryItem.showInGroupFooter) {
          return -1;
        }
        if (summaryItem.alignByColumn && column && !isDefined(column.groupIndex) && column.index !== afterGroupColumnIndex) {
          return column.index;
        }
        return groupColumnIndex;
      }, true);
    }
    if (groupItem.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE) {
      groupItem.summaryCells = this._calculateSummaryCells(options.summaryGroupItems, getGroupAggregates(groupItem.data), options.visibleColumns, (summaryItem, column) => summaryItem.showInGroupFooter && that._isDataColumn(column) ? column.index : -1);
    }
    return groupItem;
  }
  _calculateSummaryCells(summaryItems, aggregates, visibleColumns, calculateTargetColumnIndex, isGroupRow) {
    var that = this;
    var summaryCells = [];
    var summaryCellsByColumns = {};
    each(summaryItems, (summaryIndex, summaryItem) => {
      var column = that._columnsController.columnOption(summaryItem.column);
      var showInColumn = summaryItem.showInColumn && that._columnsController.columnOption(summaryItem.showInColumn) || column;
      var columnIndex = calculateTargetColumnIndex(summaryItem, showInColumn);
      if (columnIndex >= 0) {
        if (!summaryCellsByColumns[columnIndex]) {
          summaryCellsByColumns[columnIndex] = [];
        }
        var aggregate = aggregates[summaryIndex];
        if (aggregate === aggregate) {
          var valueFormat;
          if (isDefined(summaryItem.valueFormat)) {
            valueFormat = summaryItem.valueFormat;
          } else if (summaryItem.summaryType !== 'count') {
            valueFormat = gridCore.getFormatByDataType(column && column.dataType);
          }
          summaryCellsByColumns[columnIndex].push(extend({}, summaryItem, {
            value: isString(aggregate) && column && column.deserializeValue ? column.deserializeValue(aggregate) : aggregate,
            valueFormat,
            columnCaption: column && column.index !== columnIndex ? column.caption : undefined
          }));
        }
      }
    });
    if (!isEmptyObject(summaryCellsByColumns)) {
      visibleColumns.forEach((column, visibleIndex) => {
        var prevColumn = visibleColumns[visibleIndex - 1];
        var columnIndex = isGroupRow && ((prevColumn === null || prevColumn === void 0 ? void 0 : prevColumn.command) === 'expand' || column.command === 'expand') ? prevColumn === null || prevColumn === void 0 ? void 0 : prevColumn.index : column.index;
        summaryCells.push(summaryCellsByColumns[columnIndex] || []);
      });
    }
    return summaryCells;
  }
  _getSummaryCells(summaryTotalItems, totalAggregates) {
    var that = this;
    var columnsController = that._columnsController;
    return that._calculateSummaryCells(summaryTotalItems, totalAggregates, columnsController.getVisibleColumns(), (summaryItem, column) => that._isDataColumn(column) ? column.index : -1);
  }
  _updateItemsCore(change) {
    var that = this;
    var summaryCells;
    var dataSource = that._dataSource;
    var footerItems = that._footerItems;
    var oldSummaryCells = footerItems && footerItems[0] && footerItems[0].summaryCells;
    var summaryTotalItems = that.option('summary.totalItems');
    that._footerItems = [];
    if (dataSource && summaryTotalItems && summaryTotalItems.length) {
      var totalAggregates = dataSource.totalAggregates();
      summaryCells = that._getSummaryCells(summaryTotalItems, totalAggregates);
      if (change && change.repaintChangesOnly && oldSummaryCells) {
        change.totalColumnIndices = summaryCells.map((summaryCell, index) => {
          if (JSON.stringify(summaryCell) !== JSON.stringify(oldSummaryCells[index])) {
            return index;
          }
          return -1;
        }).filter(index => index >= 0);
      }
      if (summaryCells.length) {
        that._footerItems.push({
          rowType: DATAGRID_TOTAL_FOOTER_ROW_TYPE,
          summaryCells
        });
      }
    }
    super._updateItemsCore(change);
  }
  _prepareUnsavedDataSelector(selector) {
    if (recalculateWhileEditing(this)) {
      var editingController = this._editingController;
      if (editingController) {
        return function (data) {
          data = editingController.getUpdatedData(data);
          return selector(data);
        };
      }
    }
    return selector;
  }
  _prepareAggregateSelector(selector, aggregator) {
    selector = this._prepareUnsavedDataSelector(selector);
    if (aggregator === 'avg' || aggregator === 'sum') {
      return function (data) {
        var value = selector(data);
        return isDefined(value) ? Number(value) : value;
      };
    }
    return selector;
  }
  _getAggregates(summaryItems, remoteOperations) {
    var that = this;
    var calculateCustomSummary = that.option('summary.calculateCustomSummary');
    var commonSkipEmptyValues = that.option('summary.skipEmptyValues');
    return map(summaryItems || [], summaryItem => {
      var column = this._columnsController.columnOption(summaryItem.column);
      var calculateCellValue = column && column.calculateCellValue ? column.calculateCellValue.bind(column) : compileGetter(column ? column.dataField : summaryItem.column);
      var aggregator = summaryItem.summaryType || 'count';
      var skipEmptyValues = isDefined(summaryItem.skipEmptyValues) ? summaryItem.skipEmptyValues : commonSkipEmptyValues;
      if (remoteOperations) {
        return {
          selector: summaryItem.column,
          summaryType: aggregator
        };
      }
      var selector = that._prepareAggregateSelector(calculateCellValue, aggregator);
      if (aggregator === 'custom') {
        if (!calculateCustomSummary) {
          errors.log('E1026');
          calculateCustomSummary = function calculateCustomSummary() {};
        }
        var options = {
          component: that.component,
          name: summaryItem.name
        };
        calculateCustomSummary(options);
        options.summaryProcess = 'calculate';
        aggregator = {
          seed(groupIndex) {
            options.summaryProcess = 'start';
            options.totalValue = undefined;
            options.groupIndex = groupIndex;
            delete options.value;
            calculateCustomSummary(options);
            return options.totalValue;
          },
          step(totalValue, value) {
            options.summaryProcess = 'calculate';
            options.totalValue = totalValue;
            options.value = value;
            calculateCustomSummary(options);
            return options.totalValue;
          },
          finalize(totalValue) {
            options.summaryProcess = 'finalize';
            options.totalValue = totalValue;
            delete options.value;
            calculateCustomSummary(options);
            return options.totalValue;
          }
        };
      }
      return {
        selector,
        aggregator,
        skipEmptyValues
      };
    });
  }
  _addSortInfo(sortByGroups, groupColumn, selector, sortOrder) {
    if (groupColumn) {
      var {
        groupIndex
      } = groupColumn;
      sortOrder = sortOrder || groupColumn.sortOrder;
      if (isDefined(groupIndex)) {
        sortByGroups[groupIndex] = sortByGroups[groupIndex] || [];
        sortByGroups[groupIndex].push({
          selector,
          desc: sortOrder === 'desc'
        });
      }
    }
  }
  _findSummaryItem(summaryItems, name) {
    var summaryItemIndex = -1;
    var getFullName = function getFullName(summaryItem) {
      var {
        summaryType
      } = summaryItem;
      var {
        column
      } = summaryItem;
      return summaryType && column && "".concat(summaryType, "_").concat(column);
    };
    if (isDefined(name)) {
      // @ts-expect-error
      each(summaryItems || [], function (index) {
        if (this.name === name || index === name || this.summaryType === name || this.column === name || getFullName(this) === name) {
          summaryItemIndex = index;
          return false;
        }
      });
    }
    return summaryItemIndex;
  }
  _getSummarySortByGroups(sortByGroupSummaryInfo, groupSummaryItems) {
    var that = this;
    var columnsController = that._columnsController;
    var groupColumns = columnsController.getGroupColumns();
    var sortByGroups = [];
    if (!groupSummaryItems || !groupSummaryItems.length) return;
    each(sortByGroupSummaryInfo || [], function () {
      var {
        sortOrder
      } = this;
      var {
        groupColumn
      } = this;
      var summaryItemIndex = that._findSummaryItem(groupSummaryItems, this.summaryItem);
      if (summaryItemIndex < 0) return;
      var selector = function selector(data) {
        return getGroupAggregates(data)[summaryItemIndex];
      };
      if (isDefined(groupColumn)) {
        groupColumn = columnsController.columnOption(groupColumn);
        that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
      } else {
        each(groupColumns, (groupIndex, groupColumn) => {
          that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
        });
      }
    });
    return sortByGroups;
  }
  _createDataSourceAdapterCore(dataSource, remoteOperations) {
    var that = this;
    var dataSourceAdapter = super._createDataSourceAdapterCore(dataSource, remoteOperations);
    dataSourceAdapter.summaryGetter(currentRemoteOperations => that._getSummaryOptions(currentRemoteOperations || remoteOperations));
    return dataSourceAdapter;
  }
  _getSummaryOptions(remoteOperations) {
    var that = this;
    var groupSummaryItems = that.option('summary.groupItems');
    var totalSummaryItems = that.option('summary.totalItems');
    var sortByGroupSummaryInfo = that.option('sortByGroupSummaryInfo');
    var groupAggregates = that._getAggregates(groupSummaryItems, remoteOperations && remoteOperations.grouping && remoteOperations.summary);
    var totalAggregates = that._getAggregates(totalSummaryItems, remoteOperations && remoteOperations.summary);
    var sortByGroups = function sortByGroups() {
      return that._getSummarySortByGroups(sortByGroupSummaryInfo, groupSummaryItems);
    };
    if (groupAggregates.length || totalAggregates.length) {
      return {
        groupAggregates,
        totalAggregates,
        sortByGroups
      };
    }
    return undefined;
  }
  publicMethods() {
    var methods = super.publicMethods();
    methods.push('getTotalSummaryValue');
    return methods;
  }
  getTotalSummaryValue(summaryItemName) {
    var summaryItemIndex = this._findSummaryItem(this.option('summary.totalItems'), summaryItemName);
    var aggregates = this._dataSource.totalAggregates();
    if (aggregates.length && summaryItemIndex > -1) {
      return aggregates[summaryItemIndex];
    }
  }
  optionChanged(args) {
    if (args.name === 'summary' || args.name === 'sortByGroupSummaryInfo') {
      args.name = 'dataSource';
    }
    super.optionChanged(args);
  }
  init() {
    this._footerItems = [];
    super.init();
  }
  footerItems() {
    return this._footerItems;
  }
};
var editing = Base => class SummaryEditingController extends Base {
  _refreshSummary() {
    if (recalculateWhileEditing(this) && !this.isSaving()) {
      this._dataController.refresh({
        load: true,
        changesOnly: true
      });
    }
  }
  _addChange(params) {
    // @ts-expect-error
    var result = super._addChange.apply(this, arguments);
    if (params.type) {
      this._refreshSummary();
    }
    return result;
  }
  _removeChange() {
    // @ts-expect-error
    var result = super._removeChange.apply(this, arguments);
    this._refreshSummary();
    return result;
  }
  cancelEditData() {
    // @ts-expect-error
    var result = super.cancelEditData.apply(this, arguments);
    this._refreshSummary();
    return result;
  }
};
var rowsView = Base => class SummaryRowsViewExtender extends Base {
  _createRow(row) {
    // @ts-expect-error
    var $row = super._createRow.apply(this, arguments);
    row && $row.addClass(row.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE ? DATAGRID_GROUP_FOOTER_CLASS : '');
    return $row;
  }
  _renderCells($row, options) {
    // @ts-expect-error
    super._renderCells.apply(this, arguments);
    if (options.row.rowType === 'group' && options.row.summaryCells && options.row.summaryCells.length) {
      this._renderGroupSummaryCells($row, options);
    }
  }
  _hasAlignByColumnSummaryItems(columnIndex, options) {
    return !isDefined(options.columns[columnIndex].groupIndex) && options.row.summaryCells[columnIndex].length;
  }
  _getAlignByColumnCellCount(groupCellColSpan, options) {
    var alignByColumnCellCount = 0;
    for (var i = 1; i < groupCellColSpan; i++) {
      var columnIndex = options.row.summaryCells.length - i;
      alignByColumnCellCount = this._hasAlignByColumnSummaryItems(columnIndex, options) ? i : alignByColumnCellCount;
    }
    return alignByColumnCellCount;
  }
  _renderGroupSummaryCells($row, options) {
    var $groupCell = $row.children().last();
    var groupCellColSpan = Number($groupCell.attr('colSpan')) || 1;
    var alignByColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);
    this._renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount);
  }
  _renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
    if (alignByColumnCellCount > 0) {
      $groupCell.attr('colSpan', groupCellColSpan - alignByColumnCellCount);
      for (var i = 0; i < alignByColumnCellCount; i++) {
        var columnIndex = options.columns.length - alignByColumnCellCount + i;
        this._renderCell($groupCell.parent(), extend({
          column: options.columns[columnIndex],
          columnIndex: this._getSummaryCellIndex(columnIndex, options.columns)
        }, options));
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getSummaryCellIndex(columnIndex, columns) {
    return columnIndex;
  }
  _getCellTemplate(options) {
    if (!options.column.command && !isDefined(options.column.groupIndex) && options.summaryItems && options.summaryItems.length) {
      return renderSummaryCell;
    }
    return super._getCellTemplate(options);
  }
  _getCellOptions(options) {
    var that = this;
    var parameters = super._getCellOptions(options);
    if (options.row.summaryCells) {
      return extend(parameters, getSummaryCellOptions(that, options));
    }
    return parameters;
  }
};
gridCore.registerModule('summary', {
  defaultOptions() {
    return {
      summary: {
        groupItems: undefined,
        totalItems: undefined,
        calculateCustomSummary: undefined,
        skipEmptyValues: true,
        recalculateWhileEditing: false,
        texts: {
          sum: messageLocalization.format('dxDataGrid-summarySum'),
          sumOtherColumn: messageLocalization.format('dxDataGrid-summarySumOtherColumn'),
          min: messageLocalization.format('dxDataGrid-summaryMin'),
          minOtherColumn: messageLocalization.format('dxDataGrid-summaryMinOtherColumn'),
          max: messageLocalization.format('dxDataGrid-summaryMax'),
          maxOtherColumn: messageLocalization.format('dxDataGrid-summaryMaxOtherColumn'),
          avg: messageLocalization.format('dxDataGrid-summaryAvg'),
          avgOtherColumn: messageLocalization.format('dxDataGrid-summaryAvgOtherColumn'),
          count: messageLocalization.format('dxDataGrid-summaryCount')
        }
      },
      sortByGroupSummaryInfo: undefined
    };
  },
  views: {
    footerView: FooterView
  },
  extenders: {
    controllers: {
      data,
      editing
    },
    views: {
      rowsView
    }
  }
});