/* eslint-disable max-classes-per-file */
// @ts-expect-error
import { equalByValue, getKeyHash } from '../../../../core/utils/common';
import { Deferred } from '../../../../core/utils/deferred';
import { extend } from '../../../../core/utils/extend';
import { isDefined } from '../../../../core/utils/type';
import { StateStoringController } from './m_state_storing_core';
var getDataState = that => {
  // TODO getView
  var pagerView = that.getView('pagerView');
  // TODO getController
  var dataController = that.getController('data');
  var state = {
    allowedPageSizes: pagerView ? pagerView.getPageSizes() : undefined,
    filterPanel: {
      filterEnabled: that.option('filterPanel.filterEnabled')
    },
    filterValue: that.option('filterValue'),
    focusedRowKey: that.option('focusedRowEnabled') ? that.option('focusedRowKey') : undefined
  };
  return extend(state, dataController.getUserState());
};
// TODO move processLoadState to target modules (data, columns, pagerView)
var processLoadState = that => {
  // TODO getController
  var columnsController = that.getController('columns');
  var selectionController = that.getController('selection');
  var exportController = that.getController('export');
  var dataController = that.getController('data');
  if (columnsController) {
    columnsController.columnsChanged.add(() => {
      that.updateState({
        columns: columnsController.getUserState()
      });
    });
  }
  if (selectionController) {
    selectionController.selectionChanged.add(e => {
      that.updateState({
        selectedRowKeys: e.selectedRowKeys,
        selectionFilter: e.selectionFilter
      });
    });
  }
  if (dataController) {
    that._initialPageSize = that.option('paging.pageSize');
    that._initialFilterValue = that.option('filterValue');
    dataController.changed.add(() => {
      var state = getDataState(that);
      that.updateState(state);
    });
  }
  if (exportController) {
    exportController.selectionOnlyChanged.add(() => {
      that.updateState({
        exportSelectionOnly: exportController.selectionOnly()
      });
    });
  }
};
var DEFAULT_FILTER_VALUE = null;
var getFilterValue = (that, state) => {
  // TODO: getController
  var filterSyncController = that.getController('filterSync');
  var columnsController = that.getController('columns');
  var hasFilterState = state.columns || state.filterValue !== undefined;
  if (filterSyncController) {
    if (hasFilterState) {
      return state.filterValue || filterSyncController.getFilterValueFromColumns(state.columns);
    }
    return that._initialFilterValue || filterSyncController.getFilterValueFromColumns(columnsController.getColumns());
  }
  return DEFAULT_FILTER_VALUE;
};
var rowsView = Base => class StateStoringRowsViewExtender extends Base {
  init() {
    super.init();
    // @ts-expect-error
    this._dataController.stateLoaded.add(() => {
      if (this._dataController.isLoaded() && !this._dataController.getDataSource()) {
        this.setLoading(false);
        this.renderNoDataText();
        // TODO getView
        var columnHeadersView = this.component.getView('columnHeadersView');
        columnHeadersView && columnHeadersView.render();
        this.component._fireContentReadyAction();
      }
    });
  }
};
var stateStoring = Base => class StateStoringExtender extends Base {
  init() {
    // @ts-expect-error
    super.init.apply(this, arguments);
    processLoadState(this);
    return this;
  }
  isLoading() {
    // @ts-expect-error
    return super.isLoading() || this._dataController.isStateLoading();
  }
  state(state) {
    // @ts-expect-error
    var result = super.state.apply(this, arguments);
    if (state !== undefined) {
      this.applyState(extend(true, {}, state));
    }
    return result;
  }
  updateState(state) {
    if (this.isEnabled()) {
      var oldState = this.state();
      var newState = extend({}, oldState, state);
      var oldStateHash = getKeyHash(oldState);
      var newStateHash = getKeyHash(newState);
      if (!equalByValue(oldStateHash, newStateHash)) {
        state = extend(true, {}, state);
        extend(this._state, state);
        this.save();
      }
    } else {
      extend(this._state, state);
    }
  }
  /**
   * @extended: TreeList's state_storing
   */
  applyState(state) {
    var _a;
    var {
      allowedPageSizes
    } = state;
    var {
      searchText
    } = state;
    var {
      selectedRowKeys
    } = state;
    var {
      selectionFilter
    } = state;
    var scrollingMode = this.option('scrolling.mode');
    var isVirtualScrollingMode = scrollingMode === 'virtual' || scrollingMode === 'infinite';
    var showPageSizeSelector = this.option('pager.visible') === true && this.option('pager.showPageSizeSelector');
    // TODO getView
    var hasHeight = (_a = this.getView('rowsView')) === null || _a === void 0 ? void 0 : _a.hasHeight();
    this.component.beginUpdate();
    if (this._columnsController) {
      this._columnsController.setUserState(state.columns);
    }
    if (this._exportController) {
      this._exportController.selectionOnly(state.exportSelectionOnly);
    }
    if (!this.option('selection.deferred')) {
      this.option('selectedRowKeys', selectedRowKeys || []);
    }
    // @ts-expect-error
    this.option('selectionFilter', selectionFilter);
    if (allowedPageSizes && this.option('pager.allowedPageSizes') === 'auto') {
      this.option('pager').allowedPageSizes = allowedPageSizes;
    }
    if (this.option('focusedRowEnabled')) {
      this.option('focusedRowIndex', -1);
      this.option('focusedRowKey', state.focusedRowKey || null);
    }
    this.component.endUpdate();
    this.option('searchPanel.text', searchText || '');
    this.option('filterValue', getFilterValue(this, state));
    this.option('filterPanel.filterEnabled', state.filterPanel ? state.filterPanel.filterEnabled : true);
    this.option('paging.pageIndex', (!isVirtualScrollingMode || hasHeight) && state.pageIndex || 0);
    this.option('paging.pageSize', (!isVirtualScrollingMode || showPageSizeSelector) && isDefined(state.pageSize) ? state.pageSize : this._initialPageSize);
    this._dataController && this._dataController.reset();
  }
};
var columns = Base => class StateStoringColumnsExtender extends Base {
  _shouldReturnVisibleColumns() {
    // @ts-expect-error
    var result = super._shouldReturnVisibleColumns.apply(this, arguments);
    return result && (!this._stateStoringController.isEnabled() || this._stateStoringController.isLoaded());
  }
};
var data = Base => class StateStoringDataExtender extends Base {
  dispose() {
    clearTimeout(this._restoreStateTimeoutID);
    super.dispose();
  }
  callbackNames() {
    return super.callbackNames().concat(['stateLoaded']);
  }
  _refreshDataSource() {
    if (this._stateStoringController.isEnabled() && !this._stateStoringController.isLoaded()) {
      clearTimeout(this._restoreStateTimeoutID);
      // @ts-expect-error
      var deferred = new Deferred();
      this._restoreStateTimeoutID = setTimeout(() => {
        this._stateStoringController.load().always(() => {
          this._restoreStateTimeoutID = null;
        }).done(() => {
          super._refreshDataSource();
          // @ts-expect-error
          this.stateLoaded.fire();
          deferred.resolve();
        }).fail(error => {
          // @ts-expect-error
          this.stateLoaded.fire();
          this._handleLoadError(error || 'Unknown error');
          deferred.reject();
        });
      });
      return deferred.promise();
    }
    if (!this.isStateLoading()) {
      super._refreshDataSource();
    }
  }
  isLoading() {
    return super.isLoading() || this._stateStoringController.isLoading();
  }
  isStateLoading() {
    return isDefined(this._restoreStateTimeoutID);
  }
  isLoaded() {
    return super.isLoaded() && !this.isStateLoading();
  }
};
var selection = Base => class StateStoringSelectionExtender extends Base {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _fireSelectionChanged(options) {
    var isDeferredSelection = this.option('selection.deferred');
    if (this._stateStoringController.isLoading() && isDeferredSelection) {
      return;
    }
    // @ts-expect-error
    super._fireSelectionChanged.apply(this, arguments);
  }
};
export var stateStoringModule = {
  defaultOptions() {
    return {
      stateStoring: {
        enabled: false,
        storageKey: null,
        type: 'localStorage',
        customLoad: null,
        customSave: null,
        savingTimeout: 2000
      }
    };
  },
  controllers: {
    stateStoring: StateStoringController
  },
  extenders: {
    views: {
      rowsView
    },
    controllers: {
      stateStoring,
      columns,
      data,
      selection
    }
  }
};