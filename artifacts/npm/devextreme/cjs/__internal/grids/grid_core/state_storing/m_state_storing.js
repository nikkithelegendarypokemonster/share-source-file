/**
* DevExtreme (cjs/__internal/grids/grid_core/state_storing/m_state_storing.js)
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
exports.stateStoringModule = void 0;
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _type = require("../../../../core/utils/type");
var _m_state_storing_core = require("./m_state_storing_core");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */ // @ts-expect-error
const getDataState = that => {
  // TODO getView
  const pagerView = that.getView('pagerView');
  // TODO getController
  const dataController = that.getController('data');
  const state = {
    allowedPageSizes: pagerView ? pagerView.getPageSizes() : undefined,
    filterPanel: {
      filterEnabled: that.option('filterPanel.filterEnabled')
    },
    filterValue: that.option('filterValue'),
    focusedRowKey: that.option('focusedRowEnabled') ? that.option('focusedRowKey') : undefined
  };
  return (0, _extend.extend)(state, dataController.getUserState());
};
// TODO move processLoadState to target modules (data, columns, pagerView)
const processLoadState = that => {
  // TODO getController
  const columnsController = that.getController('columns');
  const selectionController = that.getController('selection');
  const exportController = that.getController('export');
  const dataController = that.getController('data');
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
      const state = getDataState(that);
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
const DEFAULT_FILTER_VALUE = null;
const getFilterValue = (that, state) => {
  // TODO: getController
  const filterSyncController = that.getController('filterSync');
  const columnsController = that.getController('columns');
  const hasFilterState = state.columns || state.filterValue !== undefined;
  if (filterSyncController) {
    if (hasFilterState) {
      return state.filterValue || filterSyncController.getFilterValueFromColumns(state.columns);
    }
    return that._initialFilterValue || filterSyncController.getFilterValueFromColumns(columnsController.getColumns());
  }
  return DEFAULT_FILTER_VALUE;
};
const rowsView = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(StateStoringRowsViewExtender, _Base);
  function StateStoringRowsViewExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto = StateStoringRowsViewExtender.prototype;
  _proto.init = function init() {
    _Base.prototype.init.call(this);
    // @ts-expect-error
    this._dataController.stateLoaded.add(() => {
      if (this._dataController.isLoaded() && !this._dataController.getDataSource()) {
        this.setLoading(false);
        this.renderNoDataText();
        // TODO getView
        const columnHeadersView = this.component.getView('columnHeadersView');
        columnHeadersView && columnHeadersView.render();
        this.component._fireContentReadyAction();
      }
    });
  };
  return StateStoringRowsViewExtender;
}(Base);
const stateStoring = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(StateStoringExtender, _Base2);
  function StateStoringExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto2 = StateStoringExtender.prototype;
  _proto2.init = function init() {
    // @ts-expect-error
    _Base2.prototype.init.apply(this, arguments);
    processLoadState(this);
    return this;
  };
  _proto2.isLoading = function isLoading() {
    // @ts-expect-error
    return _Base2.prototype.isLoading.call(this) || this._dataController.isStateLoading();
  };
  _proto2.state = function state(_state) {
    // @ts-expect-error
    const result = _Base2.prototype.state.apply(this, arguments);
    if (_state !== undefined) {
      this.applyState((0, _extend.extend)(true, {}, _state));
    }
    return result;
  };
  _proto2.updateState = function updateState(state) {
    if (this.isEnabled()) {
      const oldState = this.state();
      const newState = (0, _extend.extend)({}, oldState, state);
      const oldStateHash = (0, _common.getKeyHash)(oldState);
      const newStateHash = (0, _common.getKeyHash)(newState);
      if (!(0, _common.equalByValue)(oldStateHash, newStateHash)) {
        state = (0, _extend.extend)(true, {}, state);
        (0, _extend.extend)(this._state, state);
        this.save();
      }
    } else {
      (0, _extend.extend)(this._state, state);
    }
  }
  /**
   * @extended: TreeList's state_storing
   */;
  _proto2.applyState = function applyState(state) {
    var _a;
    const {
      allowedPageSizes
    } = state;
    const {
      searchText
    } = state;
    const {
      selectedRowKeys
    } = state;
    const {
      selectionFilter
    } = state;
    const scrollingMode = this.option('scrolling.mode');
    const isVirtualScrollingMode = scrollingMode === 'virtual' || scrollingMode === 'infinite';
    const showPageSizeSelector = this.option('pager.visible') === true && this.option('pager.showPageSizeSelector');
    // TODO getView
    const hasHeight = (_a = this.getView('rowsView')) === null || _a === void 0 ? void 0 : _a.hasHeight();
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
    this.option('paging.pageSize', (!isVirtualScrollingMode || showPageSizeSelector) && (0, _type.isDefined)(state.pageSize) ? state.pageSize : this._initialPageSize);
    this._dataController && this._dataController.reset();
  };
  return StateStoringExtender;
}(Base);
const columns = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(StateStoringColumnsExtender, _Base3);
  function StateStoringColumnsExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto3 = StateStoringColumnsExtender.prototype;
  _proto3._shouldReturnVisibleColumns = function _shouldReturnVisibleColumns() {
    // @ts-expect-error
    const result = _Base3.prototype._shouldReturnVisibleColumns.apply(this, arguments);
    return result && (!this._stateStoringController.isEnabled() || this._stateStoringController.isLoaded());
  };
  return StateStoringColumnsExtender;
}(Base);
const data = Base => /*#__PURE__*/function (_Base4) {
  _inheritsLoose(StateStoringDataExtender, _Base4);
  function StateStoringDataExtender() {
    return _Base4.apply(this, arguments) || this;
  }
  var _proto4 = StateStoringDataExtender.prototype;
  _proto4.dispose = function dispose() {
    clearTimeout(this._restoreStateTimeoutID);
    _Base4.prototype.dispose.call(this);
  };
  _proto4.callbackNames = function callbackNames() {
    return _Base4.prototype.callbackNames.call(this).concat(['stateLoaded']);
  };
  _proto4._refreshDataSource = function _refreshDataSource() {
    if (this._stateStoringController.isEnabled() && !this._stateStoringController.isLoaded()) {
      clearTimeout(this._restoreStateTimeoutID);
      // @ts-expect-error
      const deferred = new _deferred.Deferred();
      this._restoreStateTimeoutID = setTimeout(() => {
        this._stateStoringController.load().always(() => {
          this._restoreStateTimeoutID = null;
        }).done(() => {
          _Base4.prototype._refreshDataSource.call(this);
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
      _Base4.prototype._refreshDataSource.call(this);
    }
  };
  _proto4.isLoading = function isLoading() {
    return _Base4.prototype.isLoading.call(this) || this._stateStoringController.isLoading();
  };
  _proto4.isStateLoading = function isStateLoading() {
    return (0, _type.isDefined)(this._restoreStateTimeoutID);
  };
  _proto4.isLoaded = function isLoaded() {
    return _Base4.prototype.isLoaded.call(this) && !this.isStateLoading();
  };
  return StateStoringDataExtender;
}(Base);
const selection = Base => /*#__PURE__*/function (_Base5) {
  _inheritsLoose(StateStoringSelectionExtender, _Base5);
  function StateStoringSelectionExtender() {
    return _Base5.apply(this, arguments) || this;
  }
  var _proto5 = StateStoringSelectionExtender.prototype;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _proto5._fireSelectionChanged = function _fireSelectionChanged(options) {
    const isDeferredSelection = this.option('selection.deferred');
    if (this._stateStoringController.isLoading() && isDeferredSelection) {
      return;
    }
    // @ts-expect-error
    _Base5.prototype._fireSelectionChanged.apply(this, arguments);
  };
  return StateStoringSelectionExtender;
}(Base);
const stateStoringModule = exports.stateStoringModule = {
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
    stateStoring: _m_state_storing_core.StateStoringController
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
