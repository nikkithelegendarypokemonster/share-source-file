/**
* DevExtreme (bundles/__internal/grids/grid_core/data_controller/m_data_controller.js)
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
exports.dataControllerModule = exports.DataController = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _array_compare = require("../../../../core/utils/array_compare");
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _array_store = _interopRequireDefault(require("../../../../data/array_store"));
var _custom_store = _interopRequireDefault(require("../../../../data/custom_store"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _m_data_helper_mixin = require("./m_data_helper_mixin");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable @typescript-eslint/method-signature-style */
const changePaging = function (that, optionName, value) {
  const dataSource = that._dataSource;
  if (dataSource) {
    if (value !== undefined) {
      const oldValue = that._getPagingOptionValue(optionName);
      if (oldValue !== value) {
        if (optionName === 'pageSize') {
          dataSource.pageIndex(0);
        }
        dataSource[optionName](value);
        that._skipProcessingPagingChange = true;
        that.option("paging.".concat(optionName), value);
        that._skipProcessingPagingChange = false;
        const pageIndex = dataSource.pageIndex();
        that._isPaging = optionName === 'pageIndex';
        return dataSource[optionName === 'pageIndex' ? 'load' : 'reload']().done(() => {
          that._isPaging = false;
          that.pageChanged.fire(pageIndex);
        });
      }
      return (0, _deferred.Deferred)().resolve().promise();
    }
    return dataSource[optionName]();
  }
  return 0;
};
let DataController = exports.DataController = /*#__PURE__*/function (_DataHelperMixin) {
  _inheritsLoose(DataController, _DataHelperMixin);
  function DataController() {
    return _DataHelperMixin.apply(this, arguments) || this;
  }
  var _proto = DataController.prototype;
  _proto.init = function init() {
    this._items = [];
    this._cachedProcessedItems = null;
    this._columnsController = this.getController('columns');
    this._adaptiveColumnsController = this.getController('adaptiveColumns');
    this._editingController = this.getController('editing');
    this._editorFactoryController = this.getController('editorFactory');
    this._errorHandlingController = this.getController('errorHandling');
    this._filterSyncController = this.getController('filterSync');
    this._applyFilterController = this.getController('applyFilter');
    this._keyboardNavigationController = this.getController('keyboardNavigation');
    this._focusController = this.getController('focus');
    this._headerFilterController = this.getController('headerFilter');
    this._selectionController = this.getController('selection');
    this._stateStoringController = this.getController('stateStoring');
    this._validatingController = this.getController('validating');
    this._isPaging = false;
    this._currentOperationTypes = null;
    this._dataChangedHandler = e => {
      this._currentOperationTypes = this._dataSource.operationTypes();
      this._handleDataChanged(e);
      this._currentOperationTypes = null;
    };
    this._columnsChangedHandler = this._handleColumnsChanged.bind(this);
    this._loadingChangedHandler = this._handleLoadingChanged.bind(this);
    this._loadErrorHandler = this._handleLoadError.bind(this);
    this._customizeStoreLoadOptionsHandler = this._handleCustomizeStoreLoadOptions.bind(this);
    this._changingHandler = this._handleChanging.bind(this);
    this._dataPushedHandler = this._handleDataPushed.bind(this);
    this._columnsController.columnsChanged.add(this._columnsChangedHandler);
    this._isLoading = false;
    this._isCustomLoading = false;
    this._repaintChangesOnly = undefined;
    this._changes = [];
    this.createAction('onDataErrorOccurred');
    this.dataErrorOccurred.add(error => this.executeAction('onDataErrorOccurred', {
      error
    }));
    this._refreshDataSource();
    this.postCtor();
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto._getPagingOptionValue = function _getPagingOptionValue(optionName) {
    return this._dataSource[optionName]();
  };
  _proto.callbackNames = function callbackNames() {
    return ['changed', 'loadingChanged', 'dataErrorOccurred', 'pageChanged', 'dataSourceChanged', 'pushed'];
  };
  _proto.callbackFlags = function callbackFlags(name) {
    if (name === 'dataErrorOccurred') {
      return {
        stopOnFalse: true
      };
    }
    return undefined;
  };
  _proto.publicMethods = function publicMethods() {
    return ['_disposeDataSource', 'beginCustomLoading', 'byKey', 'clearFilter', 'endCustomLoading', 'filter', 'getCombinedFilter', 'getDataByKeys', 'getDataSource', 'getKeyByRowIndex', 'getRowIndexByKey', 'getVisibleRows', 'keyOf', 'pageCount', 'pageIndex', 'pageSize', 'refresh', 'repaintRows', 'totalCount'];
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto.reset = function reset() {
    this._columnsController.reset();
    this._items = [];
    this._refreshDataSource();
  }
  /**
   * @extended: editing
   */;
  _proto._handleDataSourceChange = function _handleDataSourceChange(args) {
    if (args.value === args.previousValue || this.option('columns') && Array.isArray(args.value) && Array.isArray(args.previousValue)) {
      const isValueChanged = args.value !== args.previousValue;
      if (isValueChanged) {
        const store = this.store();
        if (store) {
          store._array = args.value;
        }
      }
      if (this.needToRefreshOnDataSourceChange(args)) {
        this.refresh(this.option('repaintChangesOnly'));
      }
      return true;
    }
    return false;
  }
  /**
   * @extended: editing
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.needToRefreshOnDataSourceChange = function needToRefreshOnDataSourceChange(args) {
    return true;
  };
  _proto.optionChanged = function optionChanged(args) {
    const that = this;
    let dataSource;
    let changedPagingOptions;
    function handled() {
      args.handled = true;
    }
    if (args.name === 'dataSource' && args.name === args.fullName && this._handleDataSourceChange(args)) {
      handled();
      return;
    }
    switch (args.name) {
      case 'cacheEnabled':
      case 'repaintChangesOnly':
      case 'highlightChanges':
      case 'loadingTimeout':
        handled();
        break;
      case 'remoteOperations':
      case 'keyExpr':
      case 'dataSource':
      case 'scrolling':
        handled();
        that.reset();
        break;
      case 'paging':
        dataSource = that.dataSource();
        if (dataSource) {
          changedPagingOptions = that._setPagingOptions(dataSource);
          if (changedPagingOptions) {
            const pageIndex = dataSource.pageIndex();
            this._isPaging = changedPagingOptions.isPageIndexChanged;
            dataSource.load().done(() => {
              this._isPaging = false;
              that.pageChanged.fire(pageIndex);
            });
          }
        }
        handled();
        break;
      case 'rtlEnabled':
        that.reset();
        break;
      case 'columns':
        dataSource = that.dataSource();
        if (dataSource && dataSource.isLoading() && args.name === args.fullName) {
          this._useSortingGroupingFromColumns = true;
          dataSource.load();
        }
        break;
      default:
        _DataHelperMixin.prototype.optionChanged.call(this, args);
    }
  };
  _proto.isReady = function isReady() {
    return !this._isLoading;
  };
  _proto.getDataSource = function getDataSource() {
    return this._dataSource && this._dataSource._dataSource;
  };
  _proto.getCombinedFilter = function getCombinedFilter(returnDataField) {
    return this.combinedFilter(undefined, returnDataField);
  };
  _proto.combinedFilter = function combinedFilter(filter, returnDataField) {
    if (!this._dataSource) {
      return filter;
    }
    let combined = filter !== null && filter !== void 0 ? filter : this._dataSource.filter();
    const isColumnsTypesDefined = this._columnsController.isDataSourceApplied() || this._columnsController.isAllDataTypesDefined();
    if (isColumnsTypesDefined) {
      const additionalFilter = this._calculateAdditionalFilter();
      combined = additionalFilter ? _m_utils.default.combineFilters([additionalFilter, combined]) : combined;
    }
    const isRemoteFiltering = this._dataSource.remoteOperations().filtering || returnDataField;
    combined = this._columnsController.updateFilter(combined, isRemoteFiltering);
    return combined;
  };
  _proto.waitReady = function waitReady() {
    if (this._updateLockCount) {
      // @ts-expect-error
      this._readyDeferred = new _deferred.Deferred();
      return this._readyDeferred;
    }
    return (0, _deferred.when)();
  }
  /**
   * @extended: selection
   * @protected
   */;
  _proto._endUpdateCore = function _endUpdateCore() {
    const changes = this._changes;
    if (changes.length) {
      this._changes = [];
      const repaintChangesOnly = changes.every(change => change.repaintChangesOnly);
      this.updateItems(changes.length === 1 ? changes[0] : {
        repaintChangesOnly
      });
    }
    if (this._readyDeferred) {
      this._readyDeferred.resolve();
      this._readyDeferred = null;
    }
  }
  // Handlers
  ;
  _proto._handleCustomizeStoreLoadOptions = function _handleCustomizeStoreLoadOptions(e) {
    var _a;
    const columnsController = this._columnsController;
    const dataSource = this._dataSource;
    const {
      storeLoadOptions
    } = e;
    if (e.isCustomLoading && !storeLoadOptions.isLoadingAll) {
      return;
    }
    storeLoadOptions.filter = this.combinedFilter(storeLoadOptions.filter);
    if (((_a = storeLoadOptions.filter) === null || _a === void 0 ? void 0 : _a.length) === 1 && storeLoadOptions.filter[0] === '!') {
      e.data = [];
      e.extra = e.extra || {};
      e.extra.totalCount = 0;
    }
    if (!columnsController.isDataSourceApplied()) {
      columnsController.updateColumnDataTypes(dataSource);
    }
    this._columnsUpdating = true;
    columnsController.updateSortingGrouping(dataSource, !this._useSortingGroupingFromColumns);
    this._columnsUpdating = false;
    storeLoadOptions.sort = columnsController.getSortDataSourceParameters();
    storeLoadOptions.group = columnsController.getGroupDataSourceParameters();
    dataSource.sort(storeLoadOptions.sort);
    dataSource.group(storeLoadOptions.group);
    storeLoadOptions.sort = columnsController.getSortDataSourceParameters(!dataSource.remoteOperations().sorting);
    e.group = columnsController.getGroupDataSourceParameters(!dataSource.remoteOperations().grouping);
  };
  _proto._handleColumnsChanged = function _handleColumnsChanged(e) {
    const that = this;
    const {
      changeTypes
    } = e;
    const {
      optionNames
    } = e;
    let filterValue;
    let filterValues;
    let filterApplied;
    // B255430
    const updateItemsHandler = function (change) {
      var _a;
      that._columnsController.columnsChanged.remove(updateItemsHandler);
      that.updateItems({
        repaintChangesOnly: false,
        virtualColumnsScrolling: (_a = change === null || change === void 0 ? void 0 : change.changeTypes) === null || _a === void 0 ? void 0 : _a.virtualColumnsScrolling
      });
    };
    if (changeTypes.sorting || changeTypes.grouping) {
      if (that._dataSource && !that._columnsUpdating) {
        that._dataSource.group(that._columnsController.getGroupDataSourceParameters());
        that._dataSource.sort(that._columnsController.getSortDataSourceParameters());
        that.reload();
      }
    } else if (changeTypes.columns) {
      filterValues = that._columnsController.columnOption(e.columnIndex, 'filterValues');
      if (optionNames.filterValues || optionNames.filterType && Array.isArray(filterValues) || optionNames.filterValue || optionNames.selectedFilterOperation || optionNames.allowFiltering) {
        filterValue = that._columnsController.columnOption(e.columnIndex, 'filterValue');
        if (Array.isArray(filterValues) || e.columnIndex === undefined || (0, _type.isDefined)(filterValue) || !optionNames.selectedFilterOperation || optionNames.filterValue) {
          that._applyFilter();
          filterApplied = true;
        }
      }
      if (!that._needApplyFilter && !_m_utils.default.checkChanges(optionNames, ['width', 'visibleWidth', 'filterValue', 'bufferedFilterValue', 'selectedFilterOperation', 'filterValues', 'filterType'])) {
        // TODO remove resubscribing
        that._columnsController.columnsChanged.add(updateItemsHandler);
      }
      if ((0, _type.isDefined)(optionNames.visible)) {
        const column = that._columnsController.columnOption(e.columnIndex);
        if (column && ((0, _type.isDefined)(column.filterValue) || (0, _type.isDefined)(column.filterValues))) {
          that._applyFilter();
          filterApplied = true;
        }
      }
    }
    if (!filterApplied && changeTypes.filtering && !this._needApplyFilter) {
      that.reload();
    }
  }
  /**
   * @extended: selection
   */;
  _proto._handleDataChanged = function _handleDataChanged(e) {
    const that = this;
    const dataSource = that._dataSource;
    const columnsController = that._columnsController;
    let isAsyncDataSourceApplying = false;
    this._useSortingGroupingFromColumns = false;
    if (dataSource && !that._isDataSourceApplying) {
      that._isDataSourceApplying = true;
      (0, _deferred.when)(that._columnsController.applyDataSource(dataSource)).done(() => {
        if (that._isLoading) {
          that._handleLoadingChanged(false);
        }
        if (isAsyncDataSourceApplying && e && e.isDelayed) {
          e.isDelayed = false;
        }
        that._isDataSourceApplying = false;
        const hasAdditionalFilter = () => {
          const additionalFilter = that._calculateAdditionalFilter();
          return additionalFilter && additionalFilter.length;
        };
        const needApplyFilter = that._needApplyFilter;
        that._needApplyFilter = false;
        if (needApplyFilter && !that._isAllDataTypesDefined && hasAdditionalFilter()) {
          _ui.default.log('W1005', that.component.NAME);
          that._applyFilter();
        } else {
          that.updateItems(e, true);
        }
      }).fail(() => {
        that._isDataSourceApplying = false;
      });
      if (that._isDataSourceApplying) {
        isAsyncDataSourceApplying = true;
        that._handleLoadingChanged(true);
      }
      that._needApplyFilter = !that._columnsController.isDataSourceApplied();
      that._isAllDataTypesDefined = columnsController.isAllDataTypesDefined();
    }
  };
  _proto._handleLoadingChanged = function _handleLoadingChanged(isLoading) {
    this._isLoading = isLoading;
    this._fireLoadingChanged();
  }
  /**
   * @extended: state_storing
   */;
  _proto._handleLoadError = function _handleLoadError(e) {
    this.dataErrorOccurred.fire(e);
  };
  _proto._handleDataPushed = function _handleDataPushed(changes) {
    this.pushed.fire(changes);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.fireError = function fireError() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    this.dataErrorOccurred.fire(_ui.default.Error.apply(_ui.default, args));
  };
  _proto._setPagingOptions = function _setPagingOptions(dataSource) {
    const pageIndex = this.option('paging.pageIndex');
    const pageSize = this.option('paging.pageSize');
    const pagingEnabled = this.option('paging.enabled');
    const scrollingMode = this.option('scrolling.mode');
    const appendMode = scrollingMode === 'infinite';
    const virtualMode = scrollingMode === 'virtual';
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const paginate = pagingEnabled || virtualMode || appendMode;
    let isPaginateChanged = false;
    let isPageSizeChanged = false;
    let isPageIndexChanged = false;
    dataSource.requireTotalCount(!appendMode);
    if (pagingEnabled !== undefined && dataSource.paginate() !== paginate) {
      dataSource.paginate(paginate);
      isPaginateChanged = true;
    }
    if (pageSize !== undefined && dataSource.pageSize() !== pageSize) {
      dataSource.pageSize(pageSize);
      isPageSizeChanged = true;
    }
    if (pageIndex !== undefined && dataSource.pageIndex() !== pageIndex) {
      dataSource.pageIndex(pageIndex);
      isPageIndexChanged = true;
    }
    if (isPaginateChanged || isPageSizeChanged || isPageIndexChanged) {
      return {
        isPaginateChanged,
        isPageSizeChanged,
        isPageIndexChanged
      };
    }
    return false;
  };
  _proto._getSpecificDataSourceOption = function _getSpecificDataSourceOption() {
    const dataSource = this.option('dataSource');
    if (Array.isArray(dataSource)) {
      return {
        store: {
          type: 'array',
          data: dataSource,
          key: this.option('keyExpr')
        }
      };
    }
    return dataSource;
  };
  _proto._initDataSource = function _initDataSource() {
    const that = this;
    const oldDataSource = this._dataSource;
    _DataHelperMixin.prototype._initDataSource.call(this);
    const dataSource = that._dataSource;
    that._useSortingGroupingFromColumns = true;
    that._cachedProcessedItems = null;
    if (dataSource) {
      const changedPagingOptions = that._setPagingOptions(dataSource);
      this._isPaging = changedPagingOptions === null || changedPagingOptions === void 0 ? void 0 : changedPagingOptions.isPageIndexChanged;
      that.setDataSource(dataSource);
    } else if (oldDataSource) {
      that.updateItems();
    }
  }
  /**
   * @extended: selection, virtual_scrolling
   */;
  _proto._loadDataSource = function _loadDataSource() {
    const that = this;
    const dataSource = that._dataSource;
    // @ts-expect-error
    const result = new _deferred.Deferred();
    (0, _deferred.when)(this._columnsController.refresh(true)).always(() => {
      if (dataSource) {
        dataSource.load().done(function () {
          that._isPaging = false;
          result.resolve.apply(result, arguments);
        }).fail(result.reject);
      } else {
        result.resolve();
      }
    });
    return result.promise();
  }
  /**
   * @extended: DataGrid's grouping
   */;
  _proto._beforeProcessItems = function _beforeProcessItems(items) {
    return items.slice(0);
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto.getRowIndexDelta = function getRowIndexDelta() {
    return 0;
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto.getDataIndex = function getDataIndex(change) {
    const visibleItems = this._items;
    const lastVisibleItem = change.changeType === 'append' && visibleItems.length > 0 ? visibleItems[visibleItems.length - 1] : null;
    return (0, _type.isDefined)(lastVisibleItem === null || lastVisibleItem === void 0 ? void 0 : lastVisibleItem.dataIndex) ? lastVisibleItem.dataIndex + 1 : 0;
  }
  /**
   * @extended: adaptivity, master_detail, virtual_scrolling
   */;
  _proto._processItems = function _processItems(items, change) {
    const that = this;
    const rowIndexDelta = that.getRowIndexDelta();
    const {
      changeType
    } = change;
    const visibleColumns = that._columnsController.getVisibleColumns(null, changeType === 'loadingAll');
    const dataIndex = this.getDataIndex(change);
    const options = {
      visibleColumns,
      dataIndex
    };
    const result = [];
    (0, _iterator.each)(items, (index, item) => {
      if ((0, _type.isDefined)(item)) {
        // @ts-expect-error
        options.rowIndex = index - rowIndexDelta;
        item = that._processItem(item, options);
        result.push(item);
      }
    });
    return result;
  }
  /**
   * @extended: editing
   */;
  _proto._processItem = function _processItem(item, options) {
    item = this._generateDataItem(item, options);
    item = this._processDataItem(item, options);
    item.dataIndex = options.dataIndex++;
    return item;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._generateDataItem = function _generateDataItem(data, options) {
    return {
      rowType: 'data',
      data,
      key: this.keyOf(data)
    };
  }
  /**
   * @extended: selection, editing, master_detail, TreeList's master_detail
   */;
  _proto._processDataItem = function _processDataItem(dataItem, options) {
    dataItem.values = this.generateDataValues(dataItem.data, options.visibleColumns);
    return dataItem;
  };
  _proto.generateDataValues = function generateDataValues(data, columns, isModified) {
    const values = [];
    let value;
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      value = isModified ? undefined : null;
      if (!column.command) {
        if (column.calculateCellValue) {
          value = column.calculateCellValue(data);
        } else if (column.dataField) {
          value = data[column.dataField];
        }
      }
      values.push(value);
    }
    return values;
  }
  /**
   * @extende: virtual_scrolling, focus, selection
   */;
  _proto._applyChange = function _applyChange(change) {
    const that = this;
    if (change.changeType === 'update') {
      that._applyChangeUpdate(change);
    } else if (that.items().length && change.repaintChangesOnly && change.changeType === 'refresh') {
      that._applyChangesOnly(change);
    } else if (change.changeType === 'refresh') {
      that._applyChangeFull(change);
    }
  };
  _proto._applyChangeFull = function _applyChangeFull(change) {
    this._items = change.items.slice(0);
  };
  _proto._getRowIndices = function _getRowIndices(change) {
    const rowIndices = change.rowIndices.slice(0);
    const rowIndexDelta = this.getRowIndexDelta();
    rowIndices.sort((a, b) => a - b);
    for (let i = 0; i < rowIndices.length; i++) {
      let correctedRowIndex = rowIndices[i];
      if (change.allowInvisibleRowIndices) {
        correctedRowIndex += rowIndexDelta;
      }
      if (correctedRowIndex < 0) {
        rowIndices.splice(i, 1);
        i--;
      }
    }
    return rowIndices;
  }
  /**
   * @extended: editing
   */;
  _proto._applyChangeUpdate = function _applyChangeUpdate(change) {
    const that = this;
    const {
      items
    } = change;
    const rowIndices = that._getRowIndices(change);
    const rowIndexDelta = that.getRowIndexDelta();
    const repaintChangesOnly = that.option('repaintChangesOnly');
    let prevIndex = -1;
    let rowIndexCorrection = 0;
    let changeType;
    change.items = [];
    change.rowIndices = [];
    change.columnIndices = [];
    change.changeTypes = [];
    const equalItems = function (item1, item2, strict) {
      let result = item1 && item2 && (0, _common.equalByValue)(item1.key, item2.key);
      if (result && strict) {
        result = item1.rowType === item2.rowType && (item2.rowType !== 'detail' || item1.isEditing === item2.isEditing);
      }
      return result;
    };
    (0, _iterator.each)(rowIndices, (index, rowIndex) => {
      let columnIndices;
      rowIndex += rowIndexCorrection + rowIndexDelta;
      if (prevIndex === rowIndex) return;
      prevIndex = rowIndex;
      const oldItem = that._items[rowIndex];
      const oldNextItem = that._items[rowIndex + 1];
      const newItem = items[rowIndex];
      const newNextItem = items[rowIndex + 1];
      const strict = equalItems(oldItem, oldNextItem) || equalItems(newItem, newNextItem);
      if (newItem) {
        newItem.rowIndex = rowIndex;
        change.items.push(newItem);
      }
      if (oldItem && newItem && equalItems(oldItem, newItem, strict)) {
        changeType = 'update';
        that._items[rowIndex] = newItem;
        if (oldItem.visible !== newItem.visible) {
          change.items.splice(-1, 1, {
            visible: newItem.visible
          });
        } else if (repaintChangesOnly && !change.isFullUpdate) {
          columnIndices = that._partialUpdateRow(oldItem, newItem, rowIndex - rowIndexDelta);
        }
      } else if (newItem && !oldItem || newNextItem && equalItems(oldItem, newNextItem, strict)) {
        changeType = 'insert';
        that._items.splice(rowIndex, 0, newItem);
        rowIndexCorrection++;
      } else if (oldItem && !newItem || oldNextItem && equalItems(newItem, oldNextItem, strict)) {
        changeType = 'remove';
        that._items.splice(rowIndex, 1);
        rowIndexCorrection--;
        prevIndex = -1;
      } else if (newItem) {
        changeType = 'update';
        that._items[rowIndex] = newItem;
      } else {
        return;
      }
      change.rowIndices.push(rowIndex - rowIndexDelta);
      change.changeTypes.push(changeType);
      change.columnIndices.push(columnIndices);
    });
  }
  /**
   * @extended: editing, validating
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._isCellChanged = function _isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate) {
    if (JSON.stringify(oldRow.values[columnIndex]) !== JSON.stringify(newRow.values[columnIndex])) {
      return true;
    }
    function isCellModified(row, columnIndex) {
      return row.modifiedValues ? row.modifiedValues[columnIndex] !== undefined : false;
    }
    if (isCellModified(oldRow, columnIndex) !== isCellModified(newRow, columnIndex)) {
      return true;
    }
    return false;
  }
  /**
   * @extended: editing_row_based, editing, editing_form_based
   */;
  _proto._getChangedColumnIndices = function _getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate) {
    let columnIndices;
    if (oldItem.rowType === newItem.rowType) {
      if (newItem.rowType !== 'group' && newItem.rowType !== 'groupFooter') {
        columnIndices = [];
        if (newItem.rowType !== 'detail') {
          for (let columnIndex = 0; columnIndex < oldItem.values.length; columnIndex++) {
            if (this._isCellChanged(oldItem, newItem, visibleRowIndex, columnIndex, isLiveUpdate)) {
              columnIndices.push(columnIndex);
            }
          }
        }
      }
      if (newItem.rowType === 'group' && oldItem.cells) {
        const isRowStateEquals = newItem.isExpanded === oldItem.isExpanded && newItem.data.isContinuation === oldItem.data.isContinuation && newItem.data.isContinuationOnNextPage === oldItem.data.isContinuationOnNextPage;
        if (isRowStateEquals) {
          columnIndices = oldItem.cells.map((cell, index) => {
            var _a;
            return ((_a = cell.column) === null || _a === void 0 ? void 0 : _a.type) !== 'groupExpand' ? index : -1;
          }).filter(index => index >= 0);
        }
      }
    }
    return columnIndices;
  };
  _proto._partialUpdateRow = function _partialUpdateRow(oldItem, newItem, visibleRowIndex, isLiveUpdate) {
    let changedColumnIndices = this._getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate);
    if ((changedColumnIndices === null || changedColumnIndices === void 0 ? void 0 : changedColumnIndices.length) && this.option('dataRowTemplate')) {
      changedColumnIndices = undefined;
    }
    if (changedColumnIndices) {
      oldItem.cells && oldItem.cells.forEach((cell, columnIndex) => {
        const isCellChanged = changedColumnIndices.indexOf(columnIndex) >= 0;
        if (!isCellChanged && cell && cell.update) {
          cell.update(newItem);
        }
      });
      newItem.update = oldItem.update;
      newItem.watch = oldItem.watch;
      newItem.cells = oldItem.cells;
      if (isLiveUpdate) {
        newItem.oldValues = oldItem.values;
      }
      oldItem.update && oldItem.update(newItem);
    }
    return changedColumnIndices;
  };
  _proto._isItemEquals = function _isItemEquals(item1, item2) {
    var _a, _b, _c, _d;
    if (JSON.stringify(item1.values) !== JSON.stringify(item2.values)) {
      return false;
    }
    const compareFields = ['modified', 'isNewRow', 'removed', 'isEditing'];
    if (compareFields.some(field => item1[field] !== item2[field])) {
      return false;
    }
    if (item1.rowType === 'group' || item1.rowType === 'groupFooter') {
      const expandedMatch = item1.isExpanded === item2.isExpanded;
      const summaryCellsMatch = JSON.stringify(item1.summaryCells) === JSON.stringify(item2.summaryCells);
      const continuationMatch = ((_a = item1.data) === null || _a === void 0 ? void 0 : _a.isContinuation) === ((_b = item2.data) === null || _b === void 0 ? void 0 : _b.isContinuation) && ((_c = item1.data) === null || _c === void 0 ? void 0 : _c.isContinuationOnNextPage) === ((_d = item2.data) === null || _d === void 0 ? void 0 : _d.isContinuationOnNextPage);
      if (!expandedMatch || !summaryCellsMatch || !continuationMatch) {
        return false;
      }
    }
    return true;
  }
  /**
   * @extended: editing
   */;
  _proto._applyChangesOnly = function _applyChangesOnly(change) {
    var _a;
    const rowIndices = [];
    const columnIndices = [];
    const changeTypes = [];
    const items = [];
    const newIndexByKey = {};
    const isLiveUpdate = (_a = change === null || change === void 0 ? void 0 : change.isLiveUpdate) !== null && _a !== void 0 ? _a : true;
    function getRowKey(row) {
      if (row) {
        return "".concat(row.rowType, ",").concat(JSON.stringify(row.key));
      }
      return undefined;
    }
    const isItemEquals = (item1, item2) => {
      if (!this._isItemEquals(item1, item2)) {
        return false;
      }
      if (item1.cells) {
        item1.update && item1.update(item2);
        item1.cells.forEach(cell => {
          if (cell && cell.update) {
            cell.update(item2, true);
          }
        });
      }
      return true;
    };
    const currentItems = this._items;
    const oldItems = currentItems.slice();
    change.items.forEach((item, index) => {
      const key = getRowKey(item);
      newIndexByKey[key] = index;
      item.rowIndex = index;
    });
    const result = (0, _array_compare.findChanges)(oldItems, change.items, getRowKey, isItemEquals);
    if (!result) {
      this._applyChangeFull(change);
      return;
    }
    result.forEach(change => {
      switch (change.type) {
        case 'update':
          {
            const {
              index
            } = change;
            const newItem = change.data;
            const {
              oldItem
            } = change;
            const changedColumnIndices = this._partialUpdateRow(oldItem, newItem, index, isLiveUpdate);
            rowIndices.push(index);
            changeTypes.push('update');
            items.push(newItem);
            currentItems[index] = newItem;
            columnIndices.push(changedColumnIndices);
            break;
          }
        case 'insert':
          rowIndices.push(change.index);
          changeTypes.push('insert');
          items.push(change.data);
          columnIndices.push(undefined);
          currentItems.splice(change.index, 0, change.data);
          break;
        case 'remove':
          rowIndices.push(change.index);
          changeTypes.push('remove');
          currentItems.splice(change.index, 1);
          items.push(change.oldItem);
          columnIndices.push(undefined);
          break;
        default:
          break;
      }
    });
    change.repaintChangesOnly = true;
    change.changeType = 'update';
    change.rowIndices = rowIndices;
    change.columnIndices = columnIndices;
    change.changeTypes = changeTypes;
    change.items = items;
    if (oldItems.length) {
      change.isLiveUpdate = true;
    }
    this._correctRowIndices(rowIndex => {
      const oldRowIndexOffset = this._rowIndexOffset || 0;
      const rowIndexOffset = this.getRowIndexOffset();
      const oldItem = oldItems[rowIndex - oldRowIndexOffset];
      const key = getRowKey(oldItem);
      const newVisibleRowIndex = newIndexByKey[key];
      return newVisibleRowIndex >= 0 ? newVisibleRowIndex + rowIndexOffset - rowIndex : 0;
    });
  }
  /**
   * @extended: keyboard_navigation
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._correctRowIndices = function _correctRowIndices(rowIndex) {}
  /**
   * @extend: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._afterProcessItems = function _afterProcessItems(items, change) {
    return items;
  }
  /**
   * @extende: virtual_scrolling, editing
   */;
  _proto._updateItemsCore = function _updateItemsCore(change) {
    let items;
    const dataSource = this._dataSource;
    const changeType = change.changeType || 'refresh';
    change.changeType = changeType;
    if (dataSource) {
      const cachedProcessedItems = this._cachedProcessedItems;
      if (change.useProcessedItemsCache && cachedProcessedItems) {
        items = cachedProcessedItems;
      } else {
        items = change.items || dataSource.items();
        items = this._beforeProcessItems(items);
        items = this._processItems(items, change);
        this._cachedProcessedItems = items;
      }
      items = this._afterProcessItems(items, change);
      change.items = items;
      const oldItems = this._items.length === items.length && this._items;
      this._applyChange(change);
      const rowIndexDelta = this.getRowIndexDelta();
      (0, _iterator.each)(this._items, (index, item) => {
        var _a;
        item.rowIndex = index - rowIndexDelta;
        if (oldItems) {
          item.cells = (_a = oldItems[index].cells) !== null && _a !== void 0 ? _a : [];
        }
        const newItem = items[index];
        if (newItem) {
          item.loadIndex = newItem.loadIndex;
        }
      });
      this._rowIndexOffset = this.getRowIndexOffset();
    } else {
      this._items = [];
    }
  };
  _proto._handleChanging = function _handleChanging(e) {
    const that = this;
    const rows = that.getVisibleRows();
    const dataSource = that.dataSource();
    if (dataSource) {
      e.changes.forEach(change => {
        if (change.type === 'insert' && change.index >= 0) {
          let dataIndex = 0;
          for (let i = 0; i < change.index; i++) {
            const row = rows[i];
            if (row && (row.rowType === 'data' || row.rowType === 'group')) {
              dataIndex++;
            }
          }
          change.index = dataIndex;
        }
      });
    }
  };
  _proto.updateItems = function updateItems(change, isDataChanged) {
    var _a;
    change = change || {};
    const that = this;
    if (that._repaintChangesOnly !== undefined) {
      change.repaintChangesOnly = (_a = change.repaintChangesOnly) !== null && _a !== void 0 ? _a : that._repaintChangesOnly;
      change.needUpdateDimensions = change.needUpdateDimensions || that._needUpdateDimensions;
    } else if (change.changes) {
      change.repaintChangesOnly = that.option('repaintChangesOnly');
    } else if (isDataChanged) {
      const operationTypes = that.dataSource().operationTypes();
      change.repaintChangesOnly = operationTypes && !operationTypes.grouping && !operationTypes.filtering && that.option('repaintChangesOnly');
      change.isDataChanged = true;
      if (operationTypes && (operationTypes.reload || operationTypes.paging || operationTypes.groupExpanding)) {
        change.needUpdateDimensions = true;
      }
    }
    if (that._updateLockCount && !change.cancel) {
      that._changes.push(change);
      return;
    }
    that._updateItemsCore(change);
    if (change.cancel) return;
    that._fireChanged(change);
  };
  _proto.loadingOperationTypes = function loadingOperationTypes() {
    const dataSource = this.dataSource();
    return dataSource && dataSource.loadingOperationTypes() || {};
  }
  /**
   * @extended: virtual_scrolling, focus
   */;
  _proto._fireChanged = function _fireChanged(change) {
    if (this._currentOperationTypes) {
      change.operationTypes = this._currentOperationTypes;
      this._currentOperationTypes = null;
    }
    (0, _common.deferRender)(() => {
      this.changed.fire(change);
    });
  }
  /**
   * @extended: state_storing
   */;
  _proto.isLoading = function isLoading() {
    return this._isLoading || this._isCustomLoading;
  };
  _proto._fireLoadingChanged = function _fireLoadingChanged() {
    this.loadingChanged.fire(this.isLoading(), this._loadingText);
  }
  /**
   * @extended: filter_row, filter_sync, header_filter, search
   */;
  _proto._calculateAdditionalFilter = function _calculateAdditionalFilter() {
    return null;
  }
  /**
   * @extended: filter_sync, virtual_scrolling
   */;
  _proto._applyFilter = function _applyFilter() {
    const dataSource = this._dataSource;
    if (dataSource) {
      dataSource.pageIndex(0);
      this._isFilterApplying = true;
      return this.reload().done(() => {
        if (this._isFilterApplying) {
          this.pageChanged.fire();
        }
      });
    }
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  };
  _proto.resetFilterApplying = function resetFilterApplying() {
    this._isFilterApplying = false;
  };
  _proto.filter = function filter(filterExpr) {
    const dataSource = this._dataSource;
    const filter = dataSource && dataSource.filter();
    if (arguments.length === 0) {
      return filter;
    }
    filterExpr = arguments.length > 1 ? Array.prototype.slice.call(arguments, 0) : filterExpr;
    if (_m_utils.default.equalFilterParameters(filter, filterExpr)) {
      return;
    }
    if (dataSource) {
      dataSource.filter(filterExpr);
    }
    this._applyFilter();
  }
  /**
   * @extended: filter_sync
   */;
  _proto.clearFilter = function clearFilter(filterName) {
    const that = this;
    const columnsController = that._columnsController;
    const clearColumnOption = function (optionName) {
      const columnCount = columnsController.columnCount();
      for (let index = 0; index < columnCount; index++) {
        columnsController.columnOption(index, optionName, undefined);
      }
    };
    that.component.beginUpdate();
    if (arguments.length > 0) {
      switch (filterName) {
        case 'dataSource':
          that.filter(null);
          break;
        case 'search':
          // @ts-expect-error
          that.searchByText('');
          break;
        case 'header':
          clearColumnOption('filterValues');
          break;
        case 'row':
          clearColumnOption('filterValue');
          break;
        default:
          break;
      }
    } else {
      that.filter(null);
      // @ts-expect-error
      that.searchByText('');
      clearColumnOption('filterValue');
      clearColumnOption('bufferedFilterValue');
      clearColumnOption('filterValues');
    }
    that.component.endUpdate();
  };
  _proto._fireDataSourceChanged = function _fireDataSourceChanged() {
    const that = this;
    const changedHandler = function () {
      that.changed.remove(changedHandler);
      that.dataSourceChanged.fire();
    };
    that.changed.add(changedHandler);
  };
  _proto._getDataSourceAdapter = function _getDataSourceAdapter() {}
  /**
   * @extended: DataGrid's summary
   */;
  _proto._createDataSourceAdapterCore = function _createDataSourceAdapterCore(dataSource, remoteOperations) {
    const dataSourceAdapterProvider = this._getDataSourceAdapter();
    const dataSourceAdapter = dataSourceAdapterProvider.create(this.component);
    dataSourceAdapter.init(dataSource, remoteOperations);
    return dataSourceAdapter;
  };
  _proto.isLocalStore = function isLocalStore() {
    let store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.store();
    return store instanceof _array_store.default;
  };
  _proto.isCustomStore = function isCustomStore(store) {
    store = store || this.store();
    return store instanceof _custom_store.default;
  };
  _proto._createDataSourceAdapter = function _createDataSourceAdapter(dataSource) {
    let remoteOperations = this.option('remoteOperations');
    const store = dataSource.store();
    const enabledRemoteOperations = {
      filtering: true,
      sorting: true,
      paging: true,
      grouping: true,
      summary: true
    };
    // @ts-expect-error
    if ((0, _type.isObject)(remoteOperations) && remoteOperations.groupPaging) {
      remoteOperations = (0, _extend.extend)({}, enabledRemoteOperations, remoteOperations);
    }
    if (remoteOperations === 'auto') {
      remoteOperations = this.isLocalStore(store) || this.isCustomStore(store) ? {} : {
        filtering: true,
        sorting: true,
        paging: true
      };
    }
    if (remoteOperations === true) {
      remoteOperations = enabledRemoteOperations;
    }
    return this._createDataSourceAdapterCore(dataSource, remoteOperations);
  };
  _proto.setDataSource = function setDataSource(dataSource) {
    const that = this;
    const oldDataSource = that._dataSource;
    if (!dataSource && oldDataSource) {
      oldDataSource.cancelAll();
      oldDataSource.changed.remove(that._dataChangedHandler);
      oldDataSource.loadingChanged.remove(that._loadingChangedHandler);
      oldDataSource.loadError.remove(that._loadErrorHandler);
      oldDataSource.customizeStoreLoadOptions.remove(that._customizeStoreLoadOptionsHandler);
      oldDataSource.changing.remove(that._changingHandler);
      oldDataSource.pushed.remove(that._dataPushedHandler);
      oldDataSource.dispose(that._isSharedDataSource);
    }
    if (dataSource) {
      dataSource = that._createDataSourceAdapter(dataSource);
    }
    that._dataSource = dataSource;
    if (dataSource) {
      that._fireDataSourceChanged();
      that._isLoading = !dataSource.isLoaded();
      that._needApplyFilter = true;
      that._isAllDataTypesDefined = that._columnsController.isAllDataTypesDefined();
      dataSource.changed.add(that._dataChangedHandler);
      dataSource.loadingChanged.add(that._loadingChangedHandler);
      dataSource.loadError.add(that._loadErrorHandler);
      dataSource.customizeStoreLoadOptions.add(that._customizeStoreLoadOptionsHandler);
      dataSource.changing.add(that._changingHandler);
      dataSource.pushed.add(that._dataPushedHandler);
    }
  }
  /**
   * @extended: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.items = function items(byLoaded) {
    return this._items;
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto.isEmpty = function isEmpty() {
    return !this.items().length;
  };
  _proto.pageCount = function pageCount() {
    return this._dataSource ? this._dataSource.pageCount() : 1;
  };
  _proto.dataSource = function dataSource() {
    return this._dataSource;
  };
  _proto.store = function store() {
    const dataSource = this._dataSource;
    return dataSource && dataSource.store();
  };
  _proto.loadAll = function loadAll(data) {
    let skipFilter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const that = this;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    const dataSource = that._dataSource;
    if (dataSource) {
      if (data) {
        const options = {
          data,
          isCustomLoading: true,
          storeLoadOptions: {
            isLoadingAll: true
          },
          loadOptions: {
            filter: skipFilter ? null : that.getCombinedFilter(),
            group: dataSource.group(),
            sort: dataSource.sort()
          }
        };
        dataSource._handleDataLoaded(options);
        (0, _deferred.when)(options.data).done(data => {
          var _a;
          data = that._beforeProcessItems(data);
          d.resolve(that._processItems(data, {
            changeType: 'loadingAll'
          }), (_a = options.extra) === null || _a === void 0 ? void 0 : _a.summary);
        }).fail(d.reject);
      } else if (!dataSource.isLoading()) {
        const loadOptions = (0, _extend.extend)({}, dataSource.loadOptions(), {
          isLoadingAll: true,
          requireTotalCount: false
        });
        dataSource.load(loadOptions).done((items, extra) => {
          items = that._beforeProcessItems(items);
          items = that._processItems(items, {
            changeType: 'loadingAll'
          });
          d.resolve(items, extra && extra.summary);
        }).fail(d.reject);
      } else {
        d.reject();
      }
    } else {
      d.resolve([]);
    }
    return d;
  };
  _proto.getKeyByRowIndex = function getKeyByRowIndex(rowIndex, byLoaded) {
    const item = this.items(byLoaded)[rowIndex];
    if (item) {
      return item.key;
    }
  };
  _proto.getRowIndexByKey = function getRowIndexByKey(key, byLoaded) {
    return _m_utils.default.getIndexByKey(key, this.items(byLoaded));
  };
  _proto.keyOf = function keyOf(data) {
    const store = this.store();
    if (store) {
      return store.keyOf(data);
    }
  };
  _proto.byKey = function byKey(key) {
    const store = this.store();
    const rowIndex = this.getRowIndexByKey(key);
    let result;
    if (!store) return;
    if (rowIndex >= 0) {
      // @ts-expect-error
      result = new _deferred.Deferred().resolve(this.items()[rowIndex].data);
    }
    return result || store.byKey(key);
  };
  _proto.key = function key() {
    const store = this.store();
    if (store) {
      return store.key();
    }
  }
  /**
   * @extended: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.getRowIndexOffset = function getRowIndexOffset(byLoadedRows) {
    return 0;
  };
  _proto.getDataByKeys = function getDataByKeys(rowKeys) {
    const that = this;
    // @ts-expect-error
    const result = new _deferred.Deferred();
    const deferreds = [];
    const data = [];
    (0, _iterator.each)(rowKeys, (index, key) => {
      deferreds.push(that.byKey(key).done(keyData => {
        data[index] = keyData;
      }));
    });
    _deferred.when.apply(_renderer.default, deferreds).always(() => {
      result.resolve(data);
    });
    return result;
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto.pageIndex = function pageIndex(value) {
    return changePaging(this, 'pageIndex', value);
  };
  _proto.pageSize = function pageSize(value) {
    return changePaging(this, 'pageSize', value);
  };
  _proto.beginCustomLoading = function beginCustomLoading(messageText) {
    this._isCustomLoading = true;
    this._loadingText = messageText || '';
    this._fireLoadingChanged();
  };
  _proto.endCustomLoading = function endCustomLoading() {
    this._isCustomLoading = false;
    this._loadingText = undefined;
    this._fireLoadingChanged();
  }
  /**
   * @extended: virtual_scrolling, selection
   */;
  _proto.refresh = function refresh(options) {
    if (options === true) {
      options = {
        reload: true,
        changesOnly: true
      };
    } else if (!options) {
      options = {
        lookup: true,
        selection: true,
        reload: true
      };
    }
    const that = this;
    const dataSource = that.getDataSource();
    const {
      changesOnly
    } = options;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    const customizeLoadResult = function () {
      that._repaintChangesOnly = !!changesOnly;
    };
    (0, _deferred.when)(!options.lookup || that._columnsController.refresh()).always(() => {
      if (options.load || options.reload) {
        dataSource && dataSource.on('customizeLoadResult', customizeLoadResult);
        (0, _deferred.when)(that.reload(options.reload, changesOnly)).always(() => {
          dataSource && dataSource.off('customizeLoadResult', customizeLoadResult);
          that._repaintChangesOnly = undefined;
        }).done(d.resolve).fail(d.reject);
      } else {
        that.updateItems({
          repaintChangesOnly: options.changesOnly
        });
        d.resolve();
      }
    });
    return d.promise();
  };
  _proto.getVisibleRows = function getVisibleRows() {
    return this.items();
  };
  _proto._disposeDataSource = function _disposeDataSource() {
    if (this._dataSource && this._dataSource._eventsStrategy) {
      this._dataSource._eventsStrategy.off('loadingChanged', this.readyWatcher);
    }
    this.setDataSource(null);
  };
  _proto.dispose = function dispose() {
    this._disposeDataSource();
    _DataHelperMixin.prototype.dispose.call(this);
  }
  /**
   * @extended editing
   */;
  _proto.repaintRows = function repaintRows(rowIndexes, changesOnly) {
    rowIndexes = Array.isArray(rowIndexes) ? rowIndexes : [rowIndexes];
    if (rowIndexes.length > 1 || (0, _type.isDefined)(rowIndexes[0])) {
      this.updateItems({
        changeType: 'update',
        rowIndices: rowIndexes,
        isFullUpdate: !changesOnly
      });
    }
  };
  _proto.skipProcessingPagingChange = function skipProcessingPagingChange(fullName) {
    return this._skipProcessingPagingChange && (fullName === 'paging.pageIndex' || fullName === 'paging.pageSize');
  }
  /**
   * @extended: TreeList's state_storing
   */;
  _proto.getUserState = function getUserState() {
    return {
      searchText: this.option('searchPanel.text'),
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize()
    };
  };
  _proto.getCachedStoreData = function getCachedStoreData() {
    return this._dataSource && this._dataSource.getCachedStoreData();
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto.isLastPageLoaded = function isLastPageLoaded() {
    const pageIndex = this.pageIndex();
    const pageCount = this.pageCount();
    return pageIndex === pageCount - 1;
  };
  _proto.load = function load() {
    var _a;
    return (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.load();
  }
  /**
   * @extended: editing, virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.reload = function reload(_reload, changesOnly) {
    var _a;
    return (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.reload(_reload, changesOnly);
  };
  _proto.push = function push() {
    var _a;
    return (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.push(...arguments);
  };
  _proto.itemsCount = function itemsCount() {
    var _a;
    return this._dataSource ? (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.itemsCount() : 0;
  };
  _proto.totalItemsCount = function totalItemsCount() {
    var _a;
    return this._dataSource ? (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.totalItemsCount() : 0;
  };
  _proto.hasKnownLastPage = function hasKnownLastPage() {
    var _a;
    return this._dataSource ? (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.hasKnownLastPage() : true;
  }
  /**
   * @extended: state_storing
   */;
  _proto.isLoaded = function isLoaded() {
    var _a;
    return this._dataSource ? (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.isLoaded() : true;
  };
  _proto.totalCount = function totalCount() {
    var _a;
    return this._dataSource ? (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.totalCount() : 0;
  };
  _proto.hasLoadOperation = function hasLoadOperation() {
    var _a, _b;
    const operationTypes = (_b = (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.operationTypes()) !== null && _b !== void 0 ? _b : {};
    return Object.keys(operationTypes).some(type => operationTypes[type]);
  };
  return DataController;
}((0, _m_data_helper_mixin.DataHelperMixin)(_m_modules.default.Controller));
const dataControllerModule = exports.dataControllerModule = {
  defaultOptions() {
    return {
      loadingTimeout: 0,
      dataSource: null,
      cacheEnabled: true,
      repaintChangesOnly: false,
      highlightChanges: false,
      onDataErrorOccurred: null,
      remoteOperations: 'auto',
      paging: {
        enabled: true,
        pageSize: undefined,
        pageIndex: undefined
      }
    };
  },
  controllers: {
    data: DataController
  }
};
