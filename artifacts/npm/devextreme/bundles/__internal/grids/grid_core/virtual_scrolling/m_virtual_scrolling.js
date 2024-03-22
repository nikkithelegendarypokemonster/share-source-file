/**
* DevExtreme (bundles/__internal/grids/grid_core/virtual_scrolling/m_virtual_scrolling.js)
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
exports.virtualScrollingModule = exports.rowsView = exports.resizing = exports.dataSourceAdapterExtender = exports.data = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _browser = _interopRequireDefault(require("../../../../core/utils/browser"));
var _deferred = require("../../../../core/utils/deferred");
var _dom = require("../../../../core/utils/dom");
var _iterator = require("../../../../core/utils/iterator");
var _position = require("../../../../core/utils/position");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _window = require("../../../../core/utils/window");
var _load_indicator = _interopRequireDefault(require("../../../../ui/load_indicator"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _m_virtual_scrolling_core = require("./m_virtual_scrolling_core");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const BOTTOM_LOAD_PANEL_CLASS = 'bottom-load-panel';
const GROUP_SPACE_CLASS = 'group-space';
const FREESPACE_CLASS = 'dx-freespace-row';
const COLUMN_LINES_CLASS = 'dx-column-lines';
const VIRTUAL_ROW_CLASS = 'dx-virtual-row';
const ROW_INSERTED = 'dx-row-inserted';
const SCROLLING_MODE_INFINITE = 'infinite';
const SCROLLING_MODE_VIRTUAL = 'virtual';
const LOAD_TIMEOUT = 300;
const LEGACY_SCROLLING_MODE = 'scrolling.legacyMode';
const VISIBLE_PAGE_INDEX = 'paging.pageIndex';
const PAGING_METHOD_NAMES = ['beginPageIndex', 'endPageIndex', 'pageIndex'];
const isVirtualMode = function (that) {
  return that.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL;
};
const isAppendMode = function (that) {
  return that.option('scrolling.mode') === SCROLLING_MODE_INFINITE;
};
const isVirtualPaging = function (that) {
  return isVirtualMode(that) || isAppendMode(that);
};
const correctCount = function (items, count, fromEnd, isItemCountableFunc) {
  for (let i = 0; i < count + 1; i++) {
    const item = items[fromEnd ? items.length - 1 - i : i];
    if (item && !isItemCountableFunc(item, i === count, fromEnd)) {
      count++;
    }
  }
  return count;
};
const isItemCountableByDataSource = function (item, dataSource) {
  return item.rowType === 'data' && !item.isNewRow || item.rowType === 'group' && dataSource.isGroupItemCountable(item.data);
};
const updateItemIndices = function (items) {
  items.forEach((item, index) => {
    item.rowIndex = index;
  });
  return items;
};
const updateLoading = function (that) {
  const beginPageIndex = that._virtualScrollController.beginPageIndex(-1);
  if (isVirtualMode(that)) {
    if (beginPageIndex < 0 || that.viewportSize() >= 0 && that.getViewportItemIndex() >= 0 && (beginPageIndex * that.pageSize() > that.getViewportItemIndex() || beginPageIndex * that.pageSize() + that.itemsCount() < that.getViewportItemIndex() + that.viewportSize()) && that._dataSource.isLoading()) {
      if (!that._isLoading) {
        that._isLoading = true;
        that.loadingChanged.fire(true);
      }
    } else if (that._isLoading) {
      that._isLoading = false;
      that.loadingChanged.fire(false);
    }
  }
};
const proxyDataSourceAdapterMethod = function (that, methodName, args) {
  if (that.option(LEGACY_SCROLLING_MODE) === false && PAGING_METHOD_NAMES.includes(methodName)) {
    const dataSource = that._dataSource;
    return dataSource.pageIndex.apply(dataSource, args);
  }
  const virtualScrollController = that._virtualScrollController;
  return virtualScrollController[methodName].apply(virtualScrollController, args);
};
const removeEmptyRows = function ($emptyRows, className) {
  const getRowParent = row => (0, _renderer.default)(row).parent(".".concat(className)).get(0);
  const tBodies = $emptyRows.toArray().map(getRowParent).filter(row => row);
  if (tBodies.length) {
    $emptyRows = (0, _renderer.default)(tBodies);
  }
  const rowCount = className === FREESPACE_CLASS ? $emptyRows.length - 1 : $emptyRows.length;
  for (let i = 0; i < rowCount; i++) {
    $emptyRows.eq(i).remove();
  }
};
const dataSourceAdapterExtender = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(VirtualScrollingCoreDataSourceAdapterExtender, _Base);
  function VirtualScrollingCoreDataSourceAdapterExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto = VirtualScrollingCoreDataSourceAdapterExtender.prototype;
  _proto.init = function init() {
    _Base.prototype.init.apply(this, arguments);
    this._items = [];
    this._totalCount = -1;
    this._isLoaded = true;
    this._loadPageCount = 1;
    this._virtualScrollController = new _m_virtual_scrolling_core.VirtualScrollController(this.component, this._getVirtualScrollDataOptions());
  };
  _proto.dispose = function dispose() {
    this._virtualScrollController.dispose();
    _Base.prototype.dispose.apply(this, arguments);
  };
  _proto._getVirtualScrollDataOptions = function _getVirtualScrollDataOptions() {
    const that = this;
    return {
      pageSize() {
        return that.pageSize();
      },
      totalItemsCount() {
        return that.totalItemsCount();
      },
      hasKnownLastPage() {
        return that.hasKnownLastPage();
      },
      pageIndex(index) {
        return that._dataSource.pageIndex(index);
      },
      isLoading() {
        return that._dataSource.isLoading() && !that.isCustomLoading();
      },
      pageCount() {
        return that.pageCount();
      },
      load() {
        return that._dataSource.load();
      },
      updateLoading() {
        updateLoading(that);
      },
      itemsCount() {
        return that.itemsCount(true);
      },
      items() {
        return that._dataSource.items();
      },
      viewportItems(items) {
        if (items) {
          that._items = items;
        }
        return that._items;
      },
      onChanged(e) {
        that.changed.fire(e);
      },
      changingDuration() {
        if (that.isLoading()) {
          return LOAD_TIMEOUT;
        }
        return that._renderTime || 0;
      }
    };
  };
  _proto._handleLoadingChanged = function _handleLoadingChanged(isLoading) {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      _Base.prototype._handleLoadingChanged.apply(this, arguments);
      return;
    }
    if (!isVirtualMode(this) || this._isLoadingAll) {
      this._isLoading = isLoading;
      _Base.prototype._handleLoadingChanged.apply(this, arguments);
    }
    if (isLoading) {
      this._startLoadTime = new Date();
    } else {
      this._startLoadTime = undefined;
    }
  };
  _proto._handleLoadError = function _handleLoadError() {
    if (this.option(LEGACY_SCROLLING_MODE) !== false) {
      this._isLoading = false;
      this.loadingChanged.fire(false);
    }
    _Base.prototype._handleLoadError.apply(this, arguments);
  };
  _proto._handleDataChanged = function _handleDataChanged(e) {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      this._items = this._dataSource.items().slice();
      this._totalCount = this._dataSourceTotalCount(true);
      _Base.prototype._handleDataChanged.apply(this, arguments);
      return;
    }
    const callBase = _Base.prototype._handleDataChanged.bind(this);
    this._virtualScrollController.handleDataChanged(callBase, e);
  };
  _proto._customizeRemoteOperations = function _customizeRemoteOperations(options, operationTypes) {
    const newMode = this.option(LEGACY_SCROLLING_MODE) === false;
    let renderAsync = this.option('scrolling.renderAsync');
    if (!(0, _type.isDefined)(renderAsync)) {
      renderAsync = this._renderTime >= this.option('scrolling.renderingThreshold');
    }
    if ((isVirtualMode(this) || isAppendMode(this) && newMode) && !operationTypes.reload && (operationTypes.skip || newMode) && !renderAsync) {
      options.delay = undefined;
    }
    _Base.prototype._customizeRemoteOperations.apply(this, arguments);
  };
  _proto.items = function items() {
    return this._items;
  };
  _proto._dataSourceTotalCount = function _dataSourceTotalCount(isBase) {
    return this.option(LEGACY_SCROLLING_MODE) === false && isVirtualMode(this) && !isBase ? this._totalCount : _Base.prototype._dataSourceTotalCount.call(this);
  };
  _proto.itemsCount = function itemsCount(isBase) {
    if (isBase || this.option(LEGACY_SCROLLING_MODE) === false) {
      return _Base.prototype.itemsCount.call(this);
    }
    return this._virtualScrollController.itemsCount();
  };
  _proto.load = function load(loadOptions) {
    if (this.option(LEGACY_SCROLLING_MODE) === false || loadOptions) {
      return _Base.prototype.load.call(this, loadOptions);
    }
    return this._virtualScrollController.load();
  };
  _proto.isLoading = function isLoading() {
    return this.option(LEGACY_SCROLLING_MODE) === false ? this._dataSource.isLoading() : this._isLoading;
  };
  _proto.isLoaded = function isLoaded() {
    return this._dataSource.isLoaded() && this._isLoaded;
  };
  _proto.resetPagesCache = function resetPagesCache(isLiveUpdate) {
    if (!isLiveUpdate) {
      this._virtualScrollController.reset(true);
    }
    _Base.prototype.resetPagesCache.apply(this, arguments);
  };
  _proto._changeRowExpandCore = function _changeRowExpandCore() {
    const result = _Base.prototype._changeRowExpandCore.apply(this, arguments);
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return result;
    }
    this.resetPagesCache();
    updateLoading(this);
    return result;
  };
  _proto.reload = function reload() {
    this._dataSource.pageIndex(this.pageIndex());
    const virtualScrollController = this._virtualScrollController;
    if (this.option(LEGACY_SCROLLING_MODE) !== false && virtualScrollController) {
      // @ts-expect-error
      const d = new _deferred.Deferred();
      _Base.prototype.reload.apply(this, arguments).done(r => {
        const delayDeferred = virtualScrollController.getDelayDeferred();
        if (delayDeferred) {
          delayDeferred.done(d.resolve).fail(d.reject);
        } else {
          d.resolve(r);
        }
      }).fail(d.reject);
      return d;
    }
    return _Base.prototype.reload.apply(this, arguments);
  };
  _proto.refresh = function refresh(options, operationTypes) {
    if (this.option(LEGACY_SCROLLING_MODE) !== false) {
      const {
        storeLoadOptions
      } = options;
      const dataSource = this._dataSource;
      if (operationTypes.reload) {
        this._virtualScrollController.reset();
        dataSource.items().length = 0;
        this._isLoaded = false;
        updateLoading(this);
        this._isLoaded = true;
        if (isAppendMode(this)) {
          this.pageIndex(0);
          dataSource.pageIndex(0);
          storeLoadOptions.pageIndex = 0;
          options.pageIndex = 0;
          storeLoadOptions.skip = 0;
        } else {
          dataSource.pageIndex(this.pageIndex());
          if (dataSource.paginate()) {
            options.pageIndex = this.pageIndex();
            storeLoadOptions.skip = this.pageIndex() * this.pageSize();
          }
        }
      } else if (isAppendMode(this) && storeLoadOptions.skip && this._totalCountCorrection < 0) {
        storeLoadOptions.skip += this._totalCountCorrection;
      }
    }
    return _Base.prototype.refresh.apply(this, arguments);
  };
  _proto.loadPageCount = function loadPageCount(count) {
    if (!(0, _type.isDefined)(count)) {
      return this._loadPageCount;
    }
    this._loadPageCount = count;
  };
  _proto._handleDataLoading = function _handleDataLoading(options) {
    const loadPageCount = this.loadPageCount();
    const pageSize = this.pageSize();
    const newMode = this.option(LEGACY_SCROLLING_MODE) === false;
    const {
      storeLoadOptions
    } = options;
    const takeIsDefined = (0, _type.isDefined)(storeLoadOptions.take);
    options.loadPageCount = loadPageCount;
    if (!options.isCustomLoading && newMode && takeIsDefined && loadPageCount > 1 && pageSize > 0) {
      storeLoadOptions.take = loadPageCount * pageSize;
    }
    _Base.prototype._handleDataLoading.apply(this, arguments);
  };
  _proto._loadPageSize = function _loadPageSize() {
    return _Base.prototype._loadPageSize.apply(this, arguments) * this.loadPageCount();
  };
  _proto.beginPageIndex = function beginPageIndex() {
    return proxyDataSourceAdapterMethod(this, 'beginPageIndex', [...arguments]);
  };
  _proto.endPageIndex = function endPageIndex() {
    return proxyDataSourceAdapterMethod(this, 'endPageIndex', [...arguments]);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.pageIndex = function pageIndex(_pageIndex) {
    return proxyDataSourceAdapterMethod(this, 'pageIndex', [...arguments]);
  };
  _proto.virtualItemsCount = function virtualItemsCount() {
    return proxyDataSourceAdapterMethod(this, 'virtualItemsCount', [...arguments]);
  };
  _proto.getContentOffset = function getContentOffset() {
    return proxyDataSourceAdapterMethod(this, 'getContentOffset', [...arguments]);
  };
  _proto.getVirtualContentSize = function getVirtualContentSize() {
    return proxyDataSourceAdapterMethod(this, 'getVirtualContentSize', [...arguments]);
  };
  _proto.setContentItemSizes = function setContentItemSizes() {
    return proxyDataSourceAdapterMethod(this, 'setContentItemSizes', [...arguments]);
  };
  _proto.setViewportPosition = function setViewportPosition() {
    return proxyDataSourceAdapterMethod(this, 'setViewportPosition', [...arguments]);
  };
  _proto.getViewportItemIndex = function getViewportItemIndex() {
    return proxyDataSourceAdapterMethod(this, 'getViewportItemIndex', [...arguments]);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.setViewportItemIndex = function setViewportItemIndex(viewportItemIndex) {
    return proxyDataSourceAdapterMethod(this, 'setViewportItemIndex', [...arguments]);
  };
  _proto.getItemIndexByPosition = function getItemIndexByPosition() {
    return proxyDataSourceAdapterMethod(this, 'getItemIndexByPosition', [...arguments]);
  };
  _proto.viewportSize = function viewportSize() {
    return proxyDataSourceAdapterMethod(this, 'viewportSize', [...arguments]);
  };
  _proto.viewportItemSize = function viewportItemSize() {
    return proxyDataSourceAdapterMethod(this, 'viewportItemSize', [...arguments]);
  };
  _proto.getItemSize = function getItemSize() {
    return proxyDataSourceAdapterMethod(this, 'getItemSize', [...arguments]);
  };
  _proto.getItemSizes = function getItemSizes() {
    return proxyDataSourceAdapterMethod(this, 'getItemSizes', [...arguments]);
  };
  _proto.loadIfNeed = function loadIfNeed() {
    return proxyDataSourceAdapterMethod(this, 'loadIfNeed', [...arguments]);
  };
  return VirtualScrollingCoreDataSourceAdapterExtender;
}(Base);
exports.dataSourceAdapterExtender = dataSourceAdapterExtender;
const data = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(VirtualScrollingDataControllerExtender, _Base2);
  function VirtualScrollingDataControllerExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto2 = VirtualScrollingDataControllerExtender.prototype;
  _proto2.dispose = function dispose() {
    const rowsScrollController = this._rowsScrollController;
    rowsScrollController && rowsScrollController.dispose();
    _Base2.prototype.dispose.apply(this, arguments);
  };
  _proto2._refreshDataSource = function _refreshDataSource() {
    // @ts-expect-error
    const baseResult = _Base2.prototype._refreshDataSource.apply(this, arguments) || new _deferred.Deferred().resolve().promise();
    baseResult.done(this.initVirtualRows.bind(this));
    return baseResult;
  };
  _proto2._loadDataSource = function _loadDataSource() {
    var _a;
    if (this._rowsScrollController && isVirtualPaging(this)) {
      const {
        loadPageCount
      } = (0, _type.isDefined)(this._loadViewportParams) ? this.getLoadPageParams() : {
        loadPageCount: 0
      };
      loadPageCount >= 1 && ((_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.loadPageCount(loadPageCount));
    }
    return _Base2.prototype._loadDataSource.apply(this, arguments);
  };
  _proto2.getRowPageSize = function getRowPageSize() {
    const rowPageSize = this.option('scrolling.rowPageSize');
    const pageSize = this.pageSize();
    return pageSize && pageSize < rowPageSize ? pageSize : rowPageSize;
  };
  _proto2.reload = function reload() {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const rowsScrollController = this._rowsScrollController || this._dataSource;
    const itemIndex = rowsScrollController && rowsScrollController.getItemIndexByPosition();
    const result = _Base2.prototype.reload.apply(this, arguments);
    return result && result.done(() => {
      var _a, _b;
      if (isVirtualMode(this) || _m_utils.default.isVirtualRowRendering(this)) {
        const rowIndexOffset = this.getRowIndexOffset();
        const rowIndex = Math.floor(itemIndex) - rowIndexOffset;
        const {
          component
        } = this;
        const scrollable = component.getScrollable && component.getScrollable();
        const isSortingOperation = this.dataSource().operationTypes().sorting;
        if (scrollable && !isSortingOperation && rowIndex >= 0) {
          const rowElement = component.getRowElement(rowIndex);
          const $rowElement = rowElement && rowElement[0] && (0, _renderer.default)(rowElement[0]);
          let top = $rowElement && ((_a = $rowElement.position()) === null || _a === void 0 ? void 0 : _a.top);
          const isChromeLatest = _browser.default.chrome && Number((_b = _browser.default.version) !== null && _b !== void 0 ? _b : 0) >= 91;
          const allowedTopOffset = _browser.default.mozilla || isChromeLatest ? 1 : 0; // T884308
          if (top && top > allowedTopOffset) {
            top = Math.round(top + (0, _size.getOuterHeight)($rowElement) * (itemIndex % 1));
            scrollable.scrollTo({
              y: top
            });
          }
        }
      }
    });
  };
  _proto2.initVirtualRows = function initVirtualRows() {
    const virtualRowsRendering = _m_utils.default.isVirtualRowRendering(this);
    this._allItems = null;
    this._loadViewportParams = null;
    if (this.option('scrolling.mode') !== 'virtual' && !virtualRowsRendering || !virtualRowsRendering || this.option(LEGACY_SCROLLING_MODE) !== false && !this.option('scrolling.rowPageSize')) {
      this._visibleItems = null;
      this._rowsScrollController = null;
      return;
    }
    const pageIndex = !isVirtualMode(this) && this.pageIndex() >= this.pageCount() ? this.pageCount() - 1 : this.pageIndex();
    this._rowPageIndex = Math.ceil(pageIndex * this.pageSize() / this.getRowPageSize());
    this._visibleItems = this.option(LEGACY_SCROLLING_MODE) === false ? null : [];
    this._viewportChanging = false;
    this._needUpdateViewportAfterLoading = false;
    if (!this._rowsScrollController) {
      this._rowsScrollController = new _m_virtual_scrolling_core.VirtualScrollController(this.component, this._getRowsScrollDataOptions(), true);
      this._rowsScrollController.positionChanged.add(() => {
        var _a;
        if (this.option(LEGACY_SCROLLING_MODE) === false) {
          this._viewportChanging = true;
          this.loadViewport();
          this._viewportChanging = false;
          return;
        }
        (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.setViewportItemIndex(this._rowsScrollController.getViewportItemIndex());
      });
    }
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      this._updateLoadViewportParams();
    }
    if (this.isLoaded() && this.option(LEGACY_SCROLLING_MODE) !== false) {
      this._rowsScrollController.load();
    }
  };
  _proto2.isViewportChanging = function isViewportChanging() {
    return this._viewportChanging;
  };
  _proto2._getRowsScrollDataOptions = function _getRowsScrollDataOptions() {
    const that = this;
    const isItemCountable = function (item) {
      return isItemCountableByDataSource(item, that._dataSource);
    };
    return {
      pageSize() {
        return that.getRowPageSize();
      },
      loadedOffset() {
        var _a;
        return isVirtualMode(that) && ((_a = that._dataSource) === null || _a === void 0 ? void 0 : _a.lastLoadOptions().skip) || 0;
      },
      loadedItemCount() {
        return that._itemCount;
      },
      totalItemsCount() {
        if (isVirtualPaging(that)) {
          return that.totalItemsCount();
        }
        return that.option(LEGACY_SCROLLING_MODE) === false ? that._itemCount : that._items.filter(isItemCountable).length;
      },
      hasKnownLastPage() {
        return that.option(LEGACY_SCROLLING_MODE) === false ? that.hasKnownLastPage() : true;
      },
      pageIndex(index) {
        if (index !== undefined) {
          that._rowPageIndex = index;
        }
        return that._rowPageIndex;
      },
      isLoading() {
        return that.isLoading();
      },
      pageCount() {
        const pageCount = Math.ceil(this.totalItemsCount() / this.pageSize());
        return pageCount || 1;
      },
      load() {
        if (that._rowsScrollController.pageIndex() >= this.pageCount()) {
          that._rowPageIndex = this.pageCount() - 1;
          that._rowsScrollController.pageIndex(that._rowPageIndex);
        }
        if (!this.items().length && this.totalItemsCount()) return;
        that._rowsScrollController.handleDataChanged(change => {
          change = change || {};
          change.changeType = change.changeType || 'refresh';
          change.items = change.items || that._visibleItems;
          that._visibleItems.forEach((item, index) => {
            item.rowIndex = index;
          });
          that._fireChanged(change);
        });
      },
      updateLoading() {},
      itemsCount() {
        return this.items(true).length;
      },
      correctCount(items, count, fromEnd) {
        return correctCount(items, count, fromEnd, (item, isNextAfterLast, fromEnd) => {
          if (item.isNewRow) {
            return isNextAfterLast && !fromEnd;
          }
          if (isNextAfterLast && fromEnd) {
            return !item.isNewRow;
          }
          return isItemCountable(item);
        });
      },
      items(countableOnly) {
        let result = that._items;
        if (that.option(LEGACY_SCROLLING_MODE)) {
          const dataSource = that.dataSource();
          const virtualItemsCount = dataSource === null || dataSource === void 0 ? void 0 : dataSource.virtualItemsCount();
          const begin = virtualItemsCount ? virtualItemsCount.begin : 0;
          const rowPageSize = that.getRowPageSize();
          let skip = that._rowPageIndex * rowPageSize - begin;
          let take = rowPageSize;
          if (skip < 0) {
            return [];
          }
          if (skip) {
            skip = this.correctCount(result, skip);
            result = result.slice(skip);
          }
          if (take) {
            take = this.correctCount(result, take);
            result = result.slice(0, take);
          }
        }
        return countableOnly ? result.filter(isItemCountable) : result;
      },
      viewportItems(items) {
        if (items && that.option(LEGACY_SCROLLING_MODE) !== false) {
          that._visibleItems = items;
        }
        return that._visibleItems;
      },
      onChanged() {},
      changingDuration() {
        const dataSource = that.dataSource();
        if ((dataSource === null || dataSource === void 0 ? void 0 : dataSource.isLoading()) && that.option(LEGACY_SCROLLING_MODE) !== false) {
          return LOAD_TIMEOUT;
        }
        return (dataSource === null || dataSource === void 0 ? void 0 : dataSource._renderTime) || 0;
      }
    };
  };
  _proto2._updateItemsCore = function _updateItemsCore(change) {
    const delta = this.getRowIndexDelta();
    _Base2.prototype._updateItemsCore.apply(this, arguments);
    if (this.option(LEGACY_SCROLLING_MODE) === false && _m_utils.default.isVirtualRowRendering(this)) {
      if (change.changeType === 'update' && change.rowIndices.length === 0 && change.cancelEmptyChanges) {
        change.cancel = true;
      }
      return;
    }
    const rowsScrollController = this._rowsScrollController;
    if (rowsScrollController) {
      const visibleItems = this._visibleItems;
      const isRefresh = change.changeType === 'refresh' || change.isLiveUpdate;
      if (change.changeType === 'append' && change.items && !change.items.length) return;
      if (isRefresh || change.changeType === 'append' || change.changeType === 'prepend') {
        change.cancel = true;
        isRefresh && rowsScrollController.reset(true);
        rowsScrollController.load();
      } else {
        if (change.changeType === 'update') {
          change.rowIndices.forEach((rowIndex, index) => {
            const changeType = change.changeTypes[index];
            const newItem = change.items[index];
            if (changeType === 'update') {
              visibleItems[rowIndex] = newItem;
            } else if (changeType === 'insert') {
              visibleItems.splice(rowIndex, 0, newItem);
            } else if (changeType === 'remove') {
              visibleItems.splice(rowIndex, 1);
            }
          });
        } else {
          visibleItems.forEach((item, index) => {
            visibleItems[index] = this._items[index + delta] || visibleItems[index];
          });
          change.items = visibleItems;
        }
        updateItemIndices(visibleItems);
      }
    }
  };
  _proto2._updateLoadViewportParams = function _updateLoadViewportParams() {
    const viewportParams = this._rowsScrollController.getViewportParams();
    const pageSize = this.pageSize();
    if (viewportParams && !isVirtualPaging(this) && pageSize > 0) {
      const pageOffset = this.pageIndex() * pageSize;
      viewportParams.skip += pageOffset;
    }
    this._loadViewportParams = viewportParams;
  };
  _proto2._processItems = function _processItems() {
    var _a;
    const resultItems = _Base2.prototype._processItems.apply(this, arguments);
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      const dataSource = this._dataSource;
      let currentIndex = (_a = dataSource === null || dataSource === void 0 ? void 0 : dataSource.lastLoadOptions().skip) !== null && _a !== void 0 ? _a : 0;
      let prevCountable;
      let prevRowType;
      let isPrevRowNew;
      let wasCountableItem = false;
      let newRows = [];
      resultItems.forEach(item => {
        const {
          rowType
        } = item;
        const itemCountable = isItemCountableByDataSource(item, dataSource);
        const isNextGroupItem = rowType === 'group' && (prevCountable || itemCountable || prevRowType !== 'group' && currentIndex > 0);
        const isNextDataItem = rowType === 'data' && itemCountable && (prevCountable || prevRowType !== 'group');
        if (!item.isNewRow && (0, _type.isDefined)(prevCountable)) {
          const isPrevNewRowFirst = isPrevRowNew && !wasCountableItem;
          if ((isNextGroupItem || isNextDataItem) && !isPrevNewRowFirst) {
            currentIndex++;
          }
        }
        if (isNextGroupItem || isNextDataItem) {
          wasCountableItem = true;
        }
        if (item.isNewRow) {
          newRows.push(item);
        } else {
          newRows.forEach(it => {
            it.loadIndex = currentIndex;
          });
          newRows = [];
        }
        item.loadIndex = currentIndex;
        prevCountable = itemCountable;
        prevRowType = rowType;
        isPrevRowNew = item.isNewRow;
      });
      newRows.forEach(it => {
        it.loadIndex = currentIndex;
      });
    }
    return resultItems;
  };
  _proto2._afterProcessItems = function _afterProcessItems(items) {
    this._itemCount = items.filter(item => isItemCountableByDataSource(item, this._dataSource)).length;
    if ((0, _type.isDefined)(this._loadViewportParams)) {
      this._updateLoadViewportParams();
      let result = items;
      this._allItems = items;
      if (items.length) {
        const {
          skipForCurrentPage
        } = this.getLoadPageParams(true);
        const skip = items[0].loadIndex + skipForCurrentPage;
        const {
          take
        } = this._loadViewportParams;
        result = items.filter(it => {
          const isNewRowInEmptyData = it.isNewRow && it.loadIndex === skip && take === 0;
          const isLoadIndexGreaterStart = it.loadIndex >= skip;
          const isLoadIndexLessEnd = it.loadIndex < skip + take || isNewRowInEmptyData;
          return isLoadIndexGreaterStart && isLoadIndexLessEnd;
        });
      }
      return result;
    }
    return _Base2.prototype._afterProcessItems.apply(this, arguments);
  };
  _proto2._applyChange = function _applyChange(change) {
    const that = this;
    const {
      items
    } = change;
    const {
      changeType
    } = change;
    let {
      removeCount
    } = change;
    if (removeCount) {
      const fromEnd = changeType === 'prepend';
      removeCount = correctCount(that._items, removeCount, fromEnd, (item, isNextAfterLast) => item.rowType === 'data' && !item.isNewRow || item.rowType === 'group' && (that._dataSource.isGroupItemCountable(item.data) || isNextAfterLast));
      change.removeCount = removeCount;
    }
    switch (changeType) {
      case 'prepend':
        that._items.unshift.apply(that._items, items);
        if (removeCount) {
          that._items.splice(-removeCount);
        }
        break;
      case 'append':
        that._items.push.apply(that._items, items);
        if (removeCount) {
          that._items.splice(0, removeCount);
        }
        break;
      default:
        _Base2.prototype._applyChange.call(this, change);
        break;
    }
  };
  _proto2.items = function items(allItems) {
    return allItems ? this._allItems || this._items : this._visibleItems || this._items;
  };
  _proto2.getRowIndexDelta = function getRowIndexDelta() {
    let delta = 0;
    if (this.option(LEGACY_SCROLLING_MODE)) {
      const visibleItems = this._visibleItems;
      if (visibleItems && visibleItems[0]) {
        delta = this._items.indexOf(visibleItems[0]);
      }
    }
    return delta < 0 ? 0 : delta;
  };
  _proto2.getRowIndexOffset = function getRowIndexOffset(byLoadedRows, needGroupOffset) {
    var _a, _b;
    let offset = 0;
    const dataSource = this.dataSource();
    const rowsScrollController = this._rowsScrollController;
    const newMode = this.option(LEGACY_SCROLLING_MODE) === false;
    const virtualPaging = isVirtualPaging(this);
    if (rowsScrollController && !byLoadedRows) {
      if (newMode && (0, _type.isDefined)(this._loadViewportParams)) {
        const {
          skipForCurrentPage,
          pageIndex
        } = this.getLoadPageParams(true);
        const items = this.items(true);
        offset = virtualPaging ? pageIndex * this.pageSize() : 0;
        if (items.length) {
          const firstLoadIndex = items[0].loadIndex;
          offset += items.filter(item => item.loadIndex < firstLoadIndex + skipForCurrentPage).length;
        }
      } else {
        offset = rowsScrollController.beginPageIndex() * rowsScrollController.pageSize();
      }
    } else if (virtualPaging && newMode && dataSource) {
      const lastLoadOptions = dataSource.lastLoadOptions();
      if (needGroupOffset && ((_a = lastLoadOptions.skips) === null || _a === void 0 ? void 0 : _a.length)) {
        offset = lastLoadOptions.skips.reduce((res, skip) => res + skip, 0);
      } else {
        offset = (_b = lastLoadOptions.skip) !== null && _b !== void 0 ? _b : 0;
      }
    } else if (isVirtualMode(this) && dataSource) {
      offset = dataSource.beginPageIndex() * dataSource.pageSize();
    }
    return offset;
  };
  _proto2.getDataIndex = function getDataIndex() {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return this.getRowIndexOffset(true, true);
    }
    return _Base2.prototype.getDataIndex.apply(this, arguments);
  };
  _proto2.viewportSize = function viewportSize() {
    const rowsScrollController = this._rowsScrollController;
    const dataSource = this._dataSource;
    // @ts-expect-error
    const result = rowsScrollController === null || rowsScrollController === void 0 ? void 0 : rowsScrollController.viewportSize.apply(rowsScrollController, arguments);
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return result;
    }
    return dataSource === null || dataSource === void 0 ? void 0 : dataSource.viewportSize.apply(dataSource, arguments);
  };
  _proto2.viewportHeight = function viewportHeight(height, scrollTop) {
    var _a;
    (_a = this._rowsScrollController) === null || _a === void 0 ? void 0 : _a.viewportHeight(height, scrollTop);
  };
  _proto2.viewportItemSize = function viewportItemSize() {
    const rowsScrollController = this._rowsScrollController;
    const dataSource = this._dataSource;
    // @ts-expect-error
    const result = rowsScrollController === null || rowsScrollController === void 0 ? void 0 : rowsScrollController.viewportItemSize.apply(rowsScrollController, arguments);
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return result;
    }
    return dataSource === null || dataSource === void 0 ? void 0 : dataSource.viewportItemSize.apply(dataSource, arguments);
  };
  _proto2.setViewportPosition = function setViewportPosition() {
    const rowsScrollController = this._rowsScrollController;
    const dataSource = this._dataSource;
    this._isPaging = false;
    if (rowsScrollController) {
      // @ts-expect-error
      rowsScrollController.setViewportPosition.apply(rowsScrollController, arguments);
    } else {
      dataSource === null || dataSource === void 0 ? void 0 : dataSource.setViewportPosition.apply(dataSource, arguments);
    }
  };
  _proto2.setContentItemSizes = function setContentItemSizes(sizes) {
    const rowsScrollController = this._rowsScrollController;
    const dataSource = this._dataSource;
    const result = rowsScrollController === null || rowsScrollController === void 0 ? void 0 : rowsScrollController.setContentItemSizes(sizes);
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return result;
    }
    return dataSource === null || dataSource === void 0 ? void 0 : dataSource.setContentItemSizes(sizes);
  };
  _proto2.getPreloadedRowCount = function getPreloadedRowCount() {
    const preloadCount = this.option('scrolling.preloadedRowCount');
    const preloadEnabled = this.option('scrolling.preloadEnabled');
    if ((0, _type.isDefined)(preloadCount)) {
      return preloadCount;
    }
    const viewportSize = this.viewportSize();
    return preloadEnabled ? 2 * viewportSize : viewportSize;
  };
  _proto2.getLoadPageParams = function getLoadPageParams(byLoadedPage) {
    var _a, _b;
    const pageSize = this.pageSize();
    const viewportParams = this._loadViewportParams;
    const lastLoadOptions = (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.lastLoadOptions();
    const loadedPageIndex = (lastLoadOptions === null || lastLoadOptions === void 0 ? void 0 : lastLoadOptions.pageIndex) || 0;
    const loadedTake = (lastLoadOptions === null || lastLoadOptions === void 0 ? void 0 : lastLoadOptions.take) || 0;
    const isScrollingBack = this._rowsScrollController.isScrollingBack();
    const topPreloadCount = isScrollingBack ? this.getPreloadedRowCount() : 0;
    const bottomPreloadCount = isScrollingBack ? 0 : this.getPreloadedRowCount();
    const totalCountCorrection = ((_b = this._dataSource) === null || _b === void 0 ? void 0 : _b.totalCountCorrection()) || 0;
    const skipWithPreload = Math.max(0, viewportParams.skip - topPreloadCount);
    const pageIndex = byLoadedPage ? loadedPageIndex : Math.floor(pageSize ? skipWithPreload / pageSize : 0);
    const pageOffset = pageIndex * pageSize;
    const skipForCurrentPage = viewportParams.skip - pageOffset;
    const loadingTake = viewportParams.take + skipForCurrentPage + bottomPreloadCount - totalCountCorrection;
    const take = byLoadedPage ? loadedTake : loadingTake;
    const loadPageCount = Math.ceil(pageSize ? take / pageSize : 0);
    return {
      pageIndex,
      loadPageCount: Math.max(1, loadPageCount),
      skipForCurrentPage: Math.max(0, skipForCurrentPage)
    };
  };
  _proto2._updateVisiblePageIndex = function _updateVisiblePageIndex(currentPageIndex) {
    if (!this._rowsScrollController) {
      return;
    }
    if ((0, _type.isDefined)(currentPageIndex)) {
      this._silentOption(VISIBLE_PAGE_INDEX, currentPageIndex);
      this.pageChanged.fire();
      return;
    }
    const viewPortItemIndex = this._rowsScrollController.getViewportItemIndex();
    const newPageIndex = Math.floor(viewPortItemIndex / this.pageSize());
    if (this.pageIndex() !== newPageIndex) {
      this._silentOption(VISIBLE_PAGE_INDEX, newPageIndex);
      this.updateItems({
        changeType: 'pageIndex'
      });
    }
  };
  _proto2._getChangedLoadParams = function _getChangedLoadParams() {
    const loadedPageParams = this.getLoadPageParams(true);
    const {
      pageIndex,
      loadPageCount
    } = this.getLoadPageParams();
    const pageIndexIsValid = this._pageIndexIsValid(pageIndex);
    let result = null;
    if (!this._isLoading && pageIndexIsValid && (pageIndex !== loadedPageParams.pageIndex || loadPageCount !== loadedPageParams.loadPageCount)) {
      result = {
        pageIndex,
        loadPageCount
      };
    }
    return result;
  };
  _proto2._pageIndexIsValid = function _pageIndexIsValid(pageIndex) {
    let result = true;
    if (isAppendMode(this) && this.hasKnownLastPage() || isVirtualMode(this)) {
      result = pageIndex * this.pageSize() < this.totalItemsCount();
    }
    return result;
  };
  _proto2._loadItems = function _loadItems(checkLoading, viewportIsFilled) {
    var _a, _b;
    const virtualPaging = isVirtualPaging(this);
    const dataSourceAdapter = this._dataSource;
    const changedParams = this._getChangedLoadParams();
    const currentLoadPageCount = (_a = dataSourceAdapter === null || dataSourceAdapter === void 0 ? void 0 : dataSourceAdapter.loadPageCount()) !== null && _a !== void 0 ? _a : 0;
    const lastRequiredItemCount = this.pageSize() * currentLoadPageCount;
    const currentPageIndex = (_b = dataSourceAdapter === null || dataSourceAdapter === void 0 ? void 0 : dataSourceAdapter.pageIndex()) !== null && _b !== void 0 ? _b : 0;
    const pageIndexNotChanged = (changedParams === null || changedParams === void 0 ? void 0 : changedParams.pageIndex) === currentPageIndex;
    const allLoadedInAppendMode = isAppendMode(this) && this.totalItemsCount() < lastRequiredItemCount;
    const isRepaintMode = this.option('editing.refreshMode') === 'repaint';
    const pageIndexIncreased = (changedParams === null || changedParams === void 0 ? void 0 : changedParams.pageIndex) > currentPageIndex;
    let result = false;
    if (!dataSourceAdapter || virtualPaging && checkLoading && (isRepaintMode && viewportIsFilled || pageIndexIncreased || pageIndexNotChanged && allLoadedInAppendMode)) {
      return result;
    }
    if (virtualPaging && this._isLoading) {
      this._needUpdateViewportAfterLoading = true;
    }
    if (virtualPaging && changedParams) {
      result = true;
      dataSourceAdapter.pageIndex(changedParams.pageIndex);
      dataSourceAdapter.loadPageCount(changedParams.loadPageCount);
      this._repaintChangesOnly = true;
      this._needUpdateDimensions = true;
      const viewportChanging = this._viewportChanging;
      this.load().always(() => {
        this._repaintChangesOnly = undefined;
        this._needUpdateDimensions = undefined;
      }).done(() => {
        const isLastPage = this.pageCount() > 0 && this.pageIndex() === this.pageCount() - 1;
        (viewportChanging || isLastPage) && this._updateVisiblePageIndex();
        if (this._needUpdateViewportAfterLoading) {
          this._needUpdateViewportAfterLoading = false;
          this.loadViewport({
            checkLoadedParamsOnly: true
          });
        }
      });
    }
    return result;
  };
  _proto2.loadViewport = function loadViewport(params) {
    var _a, _b, _c;
    const {
      checkLoadedParamsOnly,
      checkLoading,
      viewportIsNotFilled
    } = params !== null && params !== void 0 ? params : {};
    const virtualPaging = isVirtualPaging(this);
    if (virtualPaging || _m_utils.default.isVirtualRowRendering(this)) {
      this._updateLoadViewportParams();
      const loadingItemsStarted = this._loadItems(checkLoading, !viewportIsNotFilled);
      const isCustomLoading = (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.isCustomLoading();
      const isLoading = checkLoading && !isCustomLoading && this._isLoading;
      const needToUpdateItems = !(loadingItemsStarted || isLoading || checkLoadedParamsOnly);
      if (needToUpdateItems) {
        const noPendingChangesInEditing = !((_c = (_b = this._editingController) === null || _b === void 0 ? void 0 : _b.getChanges()) === null || _c === void 0 ? void 0 : _c.length);
        this.updateItems({
          repaintChangesOnly: true,
          needUpdateDimensions: true,
          useProcessedItemsCache: noPendingChangesInEditing,
          cancelEmptyChanges: true
        });
      }
    }
  };
  _proto2.updateViewport = function updateViewport() {
    var _a, _b;
    const viewportSize = this.viewportSize();
    const itemCount = this.items().length;
    const viewportIsNotFilled = viewportSize > itemCount;
    const currentTake = (_b = (_a = this._loadViewportParams) === null || _a === void 0 ? void 0 : _a.take) !== null && _b !== void 0 ? _b : 0;
    const rowsScrollController = this._rowsScrollController;
    const newTake = rowsScrollController === null || rowsScrollController === void 0 ? void 0 : rowsScrollController.getViewportParams().take;
    (viewportIsNotFilled || currentTake < newTake) && !this._isPaging && itemCount && this.loadViewport({
      checkLoading: true,
      viewportIsNotFilled
    });
  };
  _proto2.loadIfNeed = function loadIfNeed() {
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      return;
    }
    const rowsScrollController = this._rowsScrollController;
    rowsScrollController && rowsScrollController.loadIfNeed();
    const dataSource = this._dataSource;
    return dataSource && dataSource.loadIfNeed();
  };
  _proto2.getItemSize = function getItemSize() {
    const rowsScrollController = this._rowsScrollController;
    if (rowsScrollController) {
      // @ts-expect-error
      return rowsScrollController.getItemSize.apply(rowsScrollController, arguments);
    }
    const dataSource = this._dataSource;
    return dataSource && dataSource.getItemSize.apply(dataSource, arguments);
  };
  _proto2.getItemSizes = function getItemSizes() {
    const rowsScrollController = this._rowsScrollController;
    if (rowsScrollController) {
      // @ts-expect-error
      return rowsScrollController.getItemSizes.apply(rowsScrollController, arguments);
    }
    const dataSource = this._dataSource;
    return dataSource && dataSource.getItemSizes.apply(dataSource, arguments);
  };
  _proto2.getContentOffset = function getContentOffset() {
    const rowsScrollController = this._rowsScrollController;
    if (rowsScrollController) {
      // @ts-expect-error
      return rowsScrollController.getContentOffset.apply(rowsScrollController, arguments);
    }
    const dataSource = this._dataSource;
    return dataSource && dataSource.getContentOffset.apply(dataSource, arguments);
  };
  _proto2.refresh = function refresh(options) {
    const dataSource = this._dataSource;
    if (dataSource && options && options.load && isAppendMode(this)) {
      dataSource.resetCurrentTotalCount();
    }
    return _Base2.prototype.refresh.apply(this, arguments);
  };
  _proto2.topItemIndex = function topItemIndex() {
    var _a;
    return (_a = this._loadViewportParams) === null || _a === void 0 ? void 0 : _a.skip;
  };
  _proto2.bottomItemIndex = function bottomItemIndex() {
    const viewportParams = this._loadViewportParams;
    return viewportParams && viewportParams.skip + viewportParams.take;
  };
  _proto2.virtualItemsCount = function virtualItemsCount() {
    const rowsScrollController = this._rowsScrollController;
    if (rowsScrollController) {
      // @ts-expect-error
      return rowsScrollController.virtualItemsCount.apply(rowsScrollController, arguments);
    }
    const dataSource = this._dataSource;
    return dataSource === null || dataSource === void 0 ? void 0 : dataSource.virtualItemsCount.apply(dataSource, arguments);
  };
  _proto2.pageIndex = function pageIndex(_pageIndex2) {
    var _a;
    const virtualPaging = isVirtualPaging(this);
    const rowsScrollController = this._rowsScrollController;
    if (this.option(LEGACY_SCROLLING_MODE) === false && virtualPaging && rowsScrollController) {
      if (_pageIndex2 === undefined) {
        return (_a = this.option(VISIBLE_PAGE_INDEX)) !== null && _a !== void 0 ? _a : 0;
      }
    }
    return _Base2.prototype.pageIndex.apply(this, arguments);
  };
  _proto2._fireChanged = function _fireChanged(e) {
    _Base2.prototype._fireChanged.apply(this, arguments);
    const {
      operationTypes
    } = e;
    if (this.option(LEGACY_SCROLLING_MODE) === false && isVirtualPaging(this) && operationTypes) {
      const {
        fullReload,
        pageIndex
      } = operationTypes;
      if (e.isDataChanged && !fullReload && pageIndex) {
        this._updateVisiblePageIndex(this._dataSource.pageIndex());
      }
    }
  };
  _proto2._getPagingOptionValue = function _getPagingOptionValue(optionName) {
    let result = _Base2.prototype._getPagingOptionValue.apply(this, arguments);
    if (this.option(LEGACY_SCROLLING_MODE) === false && isVirtualPaging(this)) {
      result = this[optionName]();
    }
    return result;
  };
  _proto2.isEmpty = function isEmpty() {
    return this.option(LEGACY_SCROLLING_MODE) === false ? !this.items(true).length : _Base2.prototype.isEmpty.apply(this, arguments);
  };
  _proto2.isLastPageLoaded = function isLastPageLoaded() {
    let result = false;
    if (this.option(LEGACY_SCROLLING_MODE) === false && isVirtualPaging(this)) {
      const {
        pageIndex,
        loadPageCount
      } = this.getLoadPageParams(true);
      const pageCount = this.pageCount();
      result = pageIndex + loadPageCount >= pageCount;
    } else {
      result = _Base2.prototype.isLastPageLoaded.apply(this, arguments);
    }
    return result;
  };
  _proto2.reset = function reset() {
    this._itemCount = 0;
    this._allItems = null;
    _Base2.prototype.reset.apply(this, arguments);
  };
  _proto2._applyFilter = function _applyFilter() {
    var _a;
    (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.loadPageCount(1);
    return _Base2.prototype._applyFilter.apply(this, arguments);
  };
  _proto2.getVirtualContentSize = function getVirtualContentSize() {
    var _a;
    return (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.getVirtualContentSize.apply(this._dataSource, arguments);
  };
  _proto2.setViewportItemIndex = function setViewportItemIndex() {
    var _a;
    return (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.setViewportItemIndex.apply(this._dataSource, arguments);
  };
  return VirtualScrollingDataControllerExtender;
}(Base);
exports.data = data;
const resizing = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(VirtualScrollingResizingControllerExtender, _Base3);
  function VirtualScrollingResizingControllerExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto3 = VirtualScrollingResizingControllerExtender.prototype;
  _proto3.dispose = function dispose() {
    _Base3.prototype.dispose.apply(this, arguments);
    clearTimeout(this._resizeTimeout);
  };
  _proto3._updateMasterDataGridCore = function _updateMasterDataGridCore(masterDataGrid) {
    // @ts-expect-error
    return (0, _deferred.when)(_Base3.prototype._updateMasterDataGridCore.apply(this, arguments)).done(masterDataGridUpdated => {
      const isNewVirtualMode = isVirtualMode(masterDataGrid) && masterDataGrid.option(LEGACY_SCROLLING_MODE) === false;
      if (!masterDataGridUpdated && isNewVirtualMode) {
        const scrollable = masterDataGrid.getScrollable();
        if (scrollable) {
          masterDataGrid.updateDimensions();
        }
      }
    });
  };
  _proto3.hasResizeTimeout = function hasResizeTimeout() {
    return !!this._resizeTimeout;
  };
  _proto3.resize = function resize() {
    let result;
    if (isVirtualMode(this) || _m_utils.default.isVirtualRowRendering(this)) {
      clearTimeout(this._resizeTimeout);
      this._resizeTimeout = null;
      const diff = new Date() - this._lastTime;
      const updateTimeout = this.option('scrolling.updateTimeout');
      if (this._lastTime && diff < updateTimeout) {
        // @ts-expect-error
        result = new _deferred.Deferred();
        this._resizeTimeout = setTimeout(() => {
          this._resizeTimeout = null;
          _Base3.prototype.resize.apply(this).done(result.resolve).fail(result.reject);
          this._lastTime = new Date();
        }, updateTimeout);
        this._lastTime = new Date();
      } else {
        result = _Base3.prototype.resize.apply(this);
        if (this._dataController.isLoaded()) {
          this._lastTime = new Date();
        }
      }
    } else {
      result = _Base3.prototype.resize.apply(this);
    }
    return result;
  };
  return VirtualScrollingResizingControllerExtender;
}(Base);
exports.resizing = resizing;
const rowsView = Base => /*#__PURE__*/function (_Base4) {
  _inheritsLoose(VirtualScrollingRowsViewExtender, _Base4);
  function VirtualScrollingRowsViewExtender() {
    return _Base4.apply(this, arguments) || this;
  }
  var _proto4 = VirtualScrollingRowsViewExtender.prototype;
  _proto4.init = function init() {
    var _a;
    _Base4.prototype.init.call(this);
    this._dataController.pageChanged.add(pageIndex => {
      const scrollTop = this._scrollTop;
      this.scrollToPage(pageIndex !== null && pageIndex !== void 0 ? pageIndex : this._dataController.pageIndex());
      if (this.option(LEGACY_SCROLLING_MODE) === false && this._scrollTop === scrollTop) {
        this._dataController
        // @ts-expect-error
        .updateViewport();
      }
    });
    this._dataController.dataSourceChanged.add(() => {
      !this._scrollTop && this._scrollToCurrentPageOnResize();
    });
    (_a = this._dataController
    // @ts-expect-error
    .stateLoaded) === null || _a === void 0 ? void 0 : _a.add(() => {
      this._scrollToCurrentPageOnResize();
    });
    this._scrollToCurrentPageOnResize();
  };
  _proto4.dispose = function dispose() {
    clearTimeout(this._scrollTimeoutID);
    _Base4.prototype.dispose.call(this);
  };
  _proto4._scrollToCurrentPageOnResize = function _scrollToCurrentPageOnResize() {
    if (this._dataController.pageIndex() > 0) {
      const resizeHandler = () => {
        this.resizeCompleted.remove(resizeHandler);
        this.scrollToPage(this._dataController.pageIndex());
      };
      this.resizeCompleted.add(resizeHandler);
    }
  };
  _proto4.scrollToPage = function scrollToPage(pageIndex) {
    const pageSize = this._dataController ? this._dataController.pageSize() : 0;
    let scrollPosition;
    if (isVirtualMode(this) || isAppendMode(this)) {
      const itemSize = this._dataController
      // @ts-expect-error
      .getItemSize();
      const itemSizes = this._dataController
      // @ts-expect-error
      .getItemSizes();
      const itemIndex = pageIndex * pageSize;
      scrollPosition = itemIndex * itemSize;
      // eslint-disable-next-line no-restricted-syntax
      for (const index in itemSizes) {
        // eslint-disable-next-line radix
        if (parseInt(index) < itemIndex) {
          scrollPosition += itemSizes[index] - itemSize;
        }
      }
    } else {
      scrollPosition = 0;
    }
    this.scrollTo({
      y: scrollPosition,
      x: this._scrollLeft
    });
  };
  _proto4.renderDelayedTemplates = function renderDelayedTemplates() {
    this.waitAsyncTemplates().done(() => {
      this._updateContentPosition(true);
    });
    _Base4.prototype.renderDelayedTemplates.apply(this, arguments);
  };
  _proto4._renderCore = function _renderCore(e) {
    const startRenderTime = new Date();
    const deferred = _Base4.prototype._renderCore.apply(this, arguments);
    const dataSource = this._dataController._dataSource;
    if (dataSource && e) {
      const itemCount = e.items ? e.items.length : 20;
      const viewportSize = this._dataController
      // @ts-expect-error
      .viewportSize() || 20;
      if (_m_utils.default.isVirtualRowRendering(this) && itemCount > 0 && this.option(LEGACY_SCROLLING_MODE) !== false) {
        dataSource._renderTime = (new Date() - startRenderTime) * viewportSize / itemCount;
      } else {
        dataSource._renderTime = new Date() - startRenderTime;
      }
    }
    return deferred;
  };
  _proto4._getRowElements = function _getRowElements(tableElement) {
    const $rows = _Base4.prototype._getRowElements.call(this, tableElement);
    return $rows && $rows.not(".".concat(VIRTUAL_ROW_CLASS));
  };
  _proto4._removeRowsElements = function _removeRowsElements(contentTable, removeCount, changeType) {
    let rowElements = this._getRowElements(contentTable).toArray();
    if (changeType === 'append') {
      rowElements = rowElements.slice(0, removeCount);
    } else {
      rowElements = rowElements.slice(-removeCount);
    }
    rowElements.map(rowElement => {
      const $rowElement = (0, _renderer.default)(rowElement);
      this._errorHandlingController && this._errorHandlingController.removeErrorRow(
      // @ts-expect-error
      $rowElement.next());
      // @ts-expect-error
      $rowElement.remove();
    });
  };
  _proto4._updateContent = function _updateContent(tableElement, change) {
    let $freeSpaceRowElements;
    const contentElement = this._findContentElement();
    const changeType = change && change.changeType;
    const d = (0, _deferred.Deferred)();
    const contentTable = contentElement.children().first();
    if (changeType === 'append' || changeType === 'prepend') {
      this.waitAsyncTemplates().done(() => {
        const $tBodies = this._getBodies(tableElement);
        if ($tBodies.length === 1) {
          this._getBodies(contentTable)[changeType === 'append' ? 'append' : 'prepend']($tBodies.children());
        } else {
          $tBodies[changeType === 'append' ? 'appendTo' : 'prependTo'](contentTable);
        }
        tableElement.remove();
        $freeSpaceRowElements = this._getFreeSpaceRowElements(contentTable);
        removeEmptyRows($freeSpaceRowElements, FREESPACE_CLASS);
        if (change.removeCount) {
          this._removeRowsElements(contentTable, change.removeCount, changeType);
        }
        this._restoreErrorRow(contentTable);
        d.resolve();
      }).fail(d.reject);
    } else {
      _Base4.prototype._updateContent.apply(this, arguments).done(() => {
        if (changeType === 'update') {
          this._restoreErrorRow(contentTable);
        }
        d.resolve();
      }).fail(d.reject);
    }
    return d.promise().done(() => {
      this._updateBottomLoading();
    });
  };
  _proto4._addVirtualRow = function _addVirtualRow($table, isFixed, location, position) {
    if (!position) return;
    let $virtualRow = this._createEmptyRow(VIRTUAL_ROW_CLASS, isFixed, position);
    $virtualRow = this._wrapRowIfNeed($table, $virtualRow);
    this._appendEmptyRow($table, $virtualRow, location);
  };
  _proto4._updateContentItemSizes = function _updateContentItemSizes() {
    const rowHeights = this._getRowHeights();
    const correctedRowHeights = this._correctRowHeights(rowHeights);
    this._dataController
    // @ts-expect-error
    .setContentItemSizes(correctedRowHeights);
  };
  _proto4._updateViewportSize = function _updateViewportSize(viewportHeight, scrollTop) {
    if (!(0, _type.isDefined)(viewportHeight)) {
      viewportHeight = this._hasHeight ? (0, _size.getOuterHeight)(this.element()) : (0, _size.getOuterHeight)((0, _window.getWindow)());
    }
    this._dataController
    // @ts-expect-error
    .viewportHeight(viewportHeight, scrollTop);
  };
  _proto4._getRowHeights = function _getRowHeights() {
    var _a, _b;
    const isPopupEditMode = (_b = (_a = this._editingController) === null || _a === void 0 ? void 0 : _a.isPopupEditMode) === null || _b === void 0 ? void 0 : _b.call(_a);
    let rowElements = this._getRowElements(this._tableElement).toArray();
    if (isPopupEditMode) {
      rowElements = rowElements.filter(row => !(0, _renderer.default)(row).hasClass(ROW_INSERTED));
    }
    return rowElements.map(row => (0, _position.getBoundingRect)(row).height);
  };
  _proto4._correctRowHeights = function _correctRowHeights(rowHeights) {
    const dataController = this._dataController;
    const dataSource = dataController._dataSource;
    const correctedRowHeights = [];
    const visibleRows = dataController.getVisibleRows();
    let itemSize = 0;
    let firstCountableItem = true;
    let lastLoadIndex = -1;
    for (let i = 0; i < rowHeights.length; i++) {
      const currentItem = visibleRows[i];
      if (!(0, _type.isDefined)(currentItem)) {
        continue;
      }
      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        if (lastLoadIndex >= 0 && lastLoadIndex !== currentItem.loadIndex) {
          correctedRowHeights.push(itemSize);
          itemSize = 0;
        }
        lastLoadIndex = currentItem.loadIndex;
      } else if (isItemCountableByDataSource(currentItem, dataSource)) {
        if (firstCountableItem) {
          firstCountableItem = false;
        } else {
          correctedRowHeights.push(itemSize);
          itemSize = 0;
        }
      }
      itemSize += rowHeights[i];
    }
    itemSize > 0 && correctedRowHeights.push(itemSize);
    return correctedRowHeights;
  };
  _proto4._updateContentPosition = function _updateContentPosition(isRender) {
    const rowHeight = this._rowHeight || 20;
    this._dataController
    // @ts-expect-error
    .viewportItemSize(rowHeight);
    if (isVirtualMode(this) || _m_utils.default.isVirtualRowRendering(this)) {
      if (!isRender) {
        this._updateContentItemSizes();
      }
      const top = this._dataController
      // @ts-expect-error
      .getContentOffset('begin');
      const bottom = this._dataController
      // @ts-expect-error
      .getContentOffset('end');
      const $tables = this.getTableElements();
      const $virtualRows = $tables.children('tbody').children(".".concat(VIRTUAL_ROW_CLASS));
      removeEmptyRows($virtualRows, VIRTUAL_ROW_CLASS);
      $tables.each((index, element) => {
        const isFixed = index > 0;
        const prevFixed = this._isFixedTableRendering;
        this._isFixedTableRendering = isFixed;
        this._addVirtualRow((0, _renderer.default)(element), isFixed, 'top', top);
        this._addVirtualRow((0, _renderer.default)(element), isFixed, 'bottom', bottom);
        this._isFixedTableRendering = prevFixed;
      });
    }
  };
  _proto4._isTableLinesDisplaysCorrect = function _isTableLinesDisplaysCorrect(table) {
    const hasColumnLines = table.find(".".concat(COLUMN_LINES_CLASS)).length > 0;
    return hasColumnLines === this.option('showColumnLines');
  };
  _proto4._isColumnElementsEqual = function _isColumnElementsEqual($columns, $virtualColumns) {
    let result = $columns.length === $virtualColumns.length;
    if (result) {
      (0, _iterator.each)($columns, (index, element) => {
        if (element.style.width !== $virtualColumns[index].style.width) {
          result = false;
          return result;
        }
        return undefined;
      });
    }
    return result;
  };
  _proto4._getCellClasses = function _getCellClasses(column) {
    const classes = [];
    const {
      cssClass
    } = column;
    const isExpandColumn = column.command === 'expand';
    cssClass && classes.push(cssClass);
    isExpandColumn && classes.push(this.addWidgetPrefix(GROUP_SPACE_CLASS));
    return classes;
  };
  _proto4._findBottomLoadPanel = function _findBottomLoadPanel($contentElement) {
    const $element = $contentElement || this.element();
    const $bottomLoadPanel = $element && $element.find(".".concat(this.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS)));
    if ($bottomLoadPanel && $bottomLoadPanel.length) {
      return $bottomLoadPanel;
    }
  };
  _proto4._updateBottomLoading = function _updateBottomLoading() {
    const that = this;
    const virtualMode = isVirtualMode(this);
    const appendMode = isAppendMode(this);
    const showBottomLoading = !that._dataController.hasKnownLastPage() && that._dataController.isLoaded() && (virtualMode || appendMode);
    const $contentElement = that._findContentElement();
    const bottomLoadPanelElement = that._findBottomLoadPanel($contentElement);
    if (showBottomLoading) {
      if (!bottomLoadPanelElement) {
        (0, _renderer.default)('<div>').addClass(that.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS)).append(that._createComponent((0, _renderer.default)('<div>'), _load_indicator.default).$element()).appendTo($contentElement);
      }
    } else if (bottomLoadPanelElement) {
      bottomLoadPanelElement.remove();
    }
  };
  _proto4._handleScroll = function _handleScroll(e) {
    const legacyScrollingMode = this.option(LEGACY_SCROLLING_MODE) === true;
    const zeroTopPosition = e.scrollOffset.top === 0;
    const isScrollTopChanged = this._scrollTop !== e.scrollOffset.top;
    const hasScrolled = isScrollTopChanged || e.forceUpdateScrollPosition;
    const isValidScrollTarget = this._hasHeight || !legacyScrollingMode && zeroTopPosition;
    if (hasScrolled && isValidScrollTarget && this._rowHeight) {
      this._scrollTop = e.scrollOffset.top;
      const isVirtualRowRendering = isVirtualMode(this) || this.option('scrolling.rowRenderingMode') !== 'standard';
      if (isVirtualRowRendering && this.option(LEGACY_SCROLLING_MODE) === false) {
        this._updateContentItemSizes();
        this._updateViewportSize(null, this._scrollTop);
      }
      this._dataController
      // @ts-expect-error
      .setViewportPosition(e.scrollOffset.top);
    }
    _Base4.prototype._handleScroll.apply(this, arguments);
  };
  _proto4._needUpdateRowHeight = function _needUpdateRowHeight(itemsCount) {
    return _Base4.prototype._needUpdateRowHeight.apply(this, arguments) || itemsCount > 0 && isAppendMode(this) && !_m_utils.default.isVirtualRowRendering(this);
  };
  _proto4._updateRowHeight = function _updateRowHeight() {
    _Base4.prototype._updateRowHeight.apply(this, arguments);
    if (this._rowHeight) {
      this._updateContentPosition();
      const viewportHeight = this._hasHeight ? (0, _size.getOuterHeight)(this.element()) : (0, _size.getOuterHeight)((0, _window.getWindow)());
      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        this._updateViewportSize(viewportHeight);
        this._dataController
        // @ts-expect-error
        .updateViewport();
      } else {
        this._dataController
        // @ts-expect-error
        .viewportSize(Math.ceil(viewportHeight / this._rowHeight));
      }
    }
  };
  _proto4.updateFreeSpaceRowHeight = function updateFreeSpaceRowHeight() {
    const result = _Base4.prototype.updateFreeSpaceRowHeight.apply(this, arguments);
    if (result) {
      this._updateContentPosition();
    }
    return result;
  };
  _proto4.setLoading = function setLoading(isLoading, messageText) {
    const dataController = this._dataController;
    const hasBottomLoadPanel = dataController.pageIndex() > 0 && dataController.isLoaded() && !!this._findBottomLoadPanel();
    // @ts-expect-error
    if (this.option(LEGACY_SCROLLING_MODE) === false && isLoading && dataController.isViewportChanging()) {
      return;
    }
    if (hasBottomLoadPanel) {
      isLoading = false;
    }
    _Base4.prototype.setLoading.call(this, isLoading, messageText);
  }
  // NOTE: warning won't be thrown if height was specified and then removed,
  // because for some reason `_hasHeight` is not updated properly in this case
  ;
  _proto4.throwHeightWarningIfNeed = function throwHeightWarningIfNeed() {
    if (this._hasHeight === undefined) {
      return;
    }
    const needToThrow = !this._hasHeight && isVirtualPaging(this);
    if (needToThrow && !this._heightWarningIsThrown) {
      this._heightWarningIsThrown = true;
      _ui.default.log('W1025');
    }
  };
  _proto4._resizeCore = function _resizeCore() {
    const that = this;
    const $element = that.element();
    _Base4.prototype._resizeCore.call(this);
    this.throwHeightWarningIfNeed();
    if (that.component.$element() && !that._windowScroll && (0, _dom.isElementInDom)($element)) {
      that._windowScroll = (0, _m_virtual_scrolling_core.subscribeToExternalScrollers)($element, scrollPos => {
        if (!that._hasHeight && that._rowHeight) {
          that._dataController
          // @ts-expect-error
          .setViewportPosition(scrollPos);
        }
      }, that.component.$element());
      that.on('disposing', () => {
        that._windowScroll.dispose();
      });
    }
    if (this.option(LEGACY_SCROLLING_MODE) !== false) {
      that.loadIfNeed();
    }
  };
  _proto4.loadIfNeed = function loadIfNeed() {
    var _a, _b;
    (_b = (_a = this._dataController) === null || _a === void 0 ? void 0 : _a.loadIfNeed) === null || _b === void 0 ? void 0 : _b.call(_a);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto4._restoreErrorRow = function _restoreErrorRow(contentTable) {
    var _a;
    if (this.option(LEGACY_SCROLLING_MODE) === false) {
      (_a = this._errorHandlingController) === null || _a === void 0 ? void 0 : _a.removeErrorRow();
    }
    _Base4.prototype._restoreErrorRow.apply(this, arguments);
  };
  return VirtualScrollingRowsViewExtender;
}(Base);
exports.rowsView = rowsView;
const virtualScrollingModule = exports.virtualScrollingModule = {
  defaultOptions() {
    return {
      scrolling: {
        timeout: 300,
        updateTimeout: 300,
        minTimeout: 0,
        renderingThreshold: 100,
        removeInvisiblePages: true,
        rowPageSize: 5,
        prerenderedRowChunkSize: 1,
        mode: 'standard',
        preloadEnabled: false,
        rowRenderingMode: 'standard',
        loadTwoPagesOnStart: false,
        legacyMode: false,
        prerenderedRowCount: 1
      }
    };
  },
  extenders: {
    controllers: {
      data,
      resizing
    },
    views: {
      rowsView
    }
  }
};
