/**
* DevExtreme (esm/__internal/grids/grid_core/focus/m_focus.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable max-classes-per-file */
import $ from '../../../../core/renderer';
import { equalByValue } from '../../../../core/utils/common';
import { Deferred, when } from '../../../../core/utils/deferred';
import { each } from '../../../../core/utils/iterator';
import { isBoolean, isDefined } from '../../../../core/utils/type';
import { isNewRowTempKey } from '../editing/m_editing_utils';
import core from '../m_modules';
import gridCoreUtils from '../m_utils';
import { UiGridCoreFocusUtils } from './m_focus_utils';
var ROW_FOCUSED_CLASS = 'dx-row-focused';
var FOCUSED_ROW_SELECTOR = ".dx-row.".concat(ROW_FOCUSED_CLASS);
var TABLE_POSTFIX_CLASS = 'table';
var CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
export class FocusController extends core.ViewController {
  // TODO getController
  //  This controller's method used in the data_controler (and maybe others) init methods
  //  And this controller's fields are empty when methods already called
  //  Therefore, as a temporary solution this private getters exist here
  get _keyboardController() {
    return this.getController('keyboardNavigation');
  }
  get _dataController() {
    return this.getController('data');
  }
  init() {
    this.component._optionsByReference.focusedRowKey = true;
  }
  optionChanged(args) {
    var {
      name,
      value,
      previousValue
    } = args;
    switch (name) {
      case 'focusedRowIndex':
        this._focusRowByIndex(value);
        this._keyboardController._fireFocusedRowChanged();
        args.handled = true;
        break;
      case 'focusedRowKey':
        if (Array.isArray(value) && JSON.stringify(value) === JSON.stringify(previousValue)) {
          return;
        }
        this._focusRowByKey(value);
        this._keyboardController._fireFocusedRowChanged();
        args.handled = true;
        break;
      case 'focusedColumnIndex':
      case 'focusedRowEnabled':
      case 'autoNavigateToFocusedRow':
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
        break;
    }
  }
  publicMethods() {
    return ['navigateToRow', 'isRowFocused'];
  }
  isAutoNavigateToFocusedRow() {
    return this.option('scrolling.mode') !== 'infinite' && this.option('autoNavigateToFocusedRow');
  }
  _focusRowByIndex(index, operationTypes) {
    if (!this.option('focusedRowEnabled')) {
      return;
    }
    index = index !== undefined ? index : this.option('focusedRowIndex');
    if (index < 0) {
      if (this.isAutoNavigateToFocusedRow()) {
        this._resetFocusedRow();
      }
    } else {
      this._focusRowByIndexCore(index, operationTypes);
    }
  }
  _focusRowByIndexCore(index, operationTypes) {
    var pageSize = this._dataController.pageSize();
    var setKeyByIndex = () => {
      if (this._isValidFocusedRowIndex(index)) {
        var rowIndex = index - this._dataController.getRowIndexOffset(true);
        if (!operationTypes || operationTypes.paging && !operationTypes.filtering) {
          // @ts-expect-error
          var lastItemIndex = this._dataController._getLastItemIndex();
          rowIndex = Math.min(rowIndex, lastItemIndex);
        }
        var focusedRowKey = this._dataController.getKeyByRowIndex(rowIndex, true);
        if (isDefined(focusedRowKey) && !this.isRowFocused(focusedRowKey)) {
          this.option('focusedRowKey', focusedRowKey);
        }
      }
    };
    if (pageSize >= 0) {
      if (!this._isLocalRowIndex(index)) {
        var pageIndex = Math.floor(index / this._dataController.pageSize());
        when(this._dataController.pageIndex(pageIndex), this._dataController.waitReady()).done(() => {
          setKeyByIndex();
        });
      } else {
        setKeyByIndex();
      }
    }
  }
  _isLocalRowIndex(index) {
    var isVirtualScrolling = this._keyboardController._isVirtualScrolling();
    if (isVirtualScrolling) {
      var pageIndex = Math.floor(index / this._dataController.pageSize());
      // @ts-expect-error
      var virtualItems = this._dataController.virtualItemsCount();
      var virtualItemsBegin = virtualItems ? virtualItems.begin : -1;
      var visibleRowsCount = this._dataController.getVisibleRows().length + this._dataController.getRowIndexOffset();
      var visiblePagesCount = Math.ceil(visibleRowsCount / this._dataController.pageSize());
      return virtualItemsBegin <= index && visiblePagesCount > pageIndex;
    }
    return true;
  }
  _setFocusedRowKeyByIndex(index) {
    if (this._isValidFocusedRowIndex(index)) {
      var rowIndex = Math.min(index - this._dataController.getRowIndexOffset(), this._dataController.items().length - 1);
      var focusedRowKey = this._dataController.getKeyByRowIndex(rowIndex);
      if (isDefined(focusedRowKey) && !this.isRowFocused(focusedRowKey)) {
        this.option('focusedRowKey', focusedRowKey);
      }
    }
  }
  _focusRowByKey(key) {
    if (!isDefined(key)) {
      this._resetFocusedRow();
    } else {
      this._navigateToRow(key, true);
    }
  }
  _resetFocusedRow() {
    var focusedRowKey = this.option('focusedRowKey');
    var isFocusedRowKeyDefined = isDefined(focusedRowKey);
    if (!isFocusedRowKeyDefined && this.option('focusedRowIndex') < 0) {
      return;
    }
    if (isFocusedRowKeyDefined) {
      this.option('focusedRowKey', null);
    }
    this._keyboardController.setFocusedRowIndex(-1);
    this.option('focusedRowIndex', -1);
    this._dataController.updateItems({
      changeType: 'updateFocusedRow',
      focusedRowKey: null
    });
    this._keyboardController._fireFocusedRowChanged();
  }
  _isValidFocusedRowIndex(rowIndex) {
    var row = this._dataController.getVisibleRows()[rowIndex];
    return !row || row.rowType === 'data' || row.rowType === 'group';
  }
  navigateToRow(key) {
    if (!this.isAutoNavigateToFocusedRow()) {
      this.option('focusedRowIndex', -1);
    }
    return this._navigateToRow(key);
  }
  _navigateToRow(key, needFocusRow) {
    var that = this;
    var isAutoNavigate = that.isAutoNavigateToFocusedRow();
    // @ts-expect-error
    var d = new Deferred();
    if (key === undefined || !this._dataController.dataSource()) {
      return d.reject().promise();
    }
    var rowIndexByKey = that.getFocusedRowIndexByKey(key);
    if (!isAutoNavigate && needFocusRow || rowIndexByKey >= 0) {
      that._navigateTo(key, d, needFocusRow);
    } else {
      // @ts-expect-error this is the TreeList's method
      this._dataController.getPageIndexByKey(key).done(pageIndex => {
        if (pageIndex < 0) {
          d.resolve(-1);
          return;
        }
        if (pageIndex === this._dataController.pageIndex()) {
          this._dataController.reload().done(() => {
            if (that.isRowFocused(key) && this._dataController.getRowIndexByKey(key) >= 0) {
              d.resolve(that.getFocusedRowIndexByKey(key));
            } else {
              that._navigateTo(key, d, needFocusRow);
            }
          }).fail(d.reject);
        } else {
          this._dataController.pageIndex(pageIndex).done(() => {
            that._navigateTo(key, d, needFocusRow);
          }).fail(d.reject);
        }
      }).fail(d.reject);
    }
    return d.promise();
  }
  _navigateTo(key, deferred, needFocusRow) {
    var visibleRowIndex = this._dataController.getRowIndexByKey(key);
    var isVirtualRowRenderingMode = gridCoreUtils.isVirtualRowRendering(this);
    var isAutoNavigate = this.isAutoNavigateToFocusedRow();
    if (isAutoNavigate && isVirtualRowRenderingMode && visibleRowIndex < 0) {
      this._navigateToVirtualRow(key, deferred, needFocusRow);
    } else {
      this._navigateToVisibleRow(key, deferred, needFocusRow);
    }
  }
  _navigateToVisibleRow(key, deferred, needFocusRow) {
    if (needFocusRow) {
      this._triggerUpdateFocusedRow(key, deferred);
    } else {
      var focusedRowIndex = this.getFocusedRowIndexByKey(key);
      // @ts-expect-error
      this.getView('rowsView').scrollToRowElement(key, deferred).done(() => {
        deferred.resolve(focusedRowIndex);
      });
    }
  }
  _navigateToVirtualRow(key, deferred, needFocusRow) {
    var rowsScrollController = this._dataController._rowsScrollController;
    var rowIndex = gridCoreUtils.getIndexByKey(key, this._dataController.items(true));
    var scrollable = this.getView('rowsView').getScrollable();
    if (rowsScrollController && scrollable && rowIndex >= 0) {
      var focusedRowIndex = rowIndex + this._dataController.getRowIndexOffset(true);
      var offset = rowsScrollController.getItemOffset(focusedRowIndex);
      var triggerUpdateFocusedRow = () => {
        if (this._dataController.totalCount() && !this._dataController.items().length) {
          return;
        }
        this.component.off('contentReady', triggerUpdateFocusedRow);
        if (needFocusRow) {
          this._triggerUpdateFocusedRow(key, deferred);
        } else {
          deferred.resolve(focusedRowIndex);
        }
      };
      this.component.on('contentReady', triggerUpdateFocusedRow);
      // @ts-expect-error
      this.getView('rowsView').scrollTopPosition(offset);
    } else {
      deferred.resolve(-1);
    }
  }
  _triggerUpdateFocusedRow(key, deferred) {
    var focusedRowIndex = this.getFocusedRowIndexByKey(key);
    if (this._isValidFocusedRowIndex(focusedRowIndex)) {
      var d;
      if (this.option('focusedRowEnabled')) {
        this._dataController.updateItems({
          changeType: 'updateFocusedRow',
          focusedRowKey: key
        });
      } else {
        // TODO getView
        // @ts-expect-error
        d = this.getView('rowsView').scrollToRowElement(key);
      }
      when(d).done(() => {
        this._keyboardController.setFocusedRowIndex(focusedRowIndex);
        deferred && deferred.resolve(focusedRowIndex);
      });
    } else {
      deferred && deferred.resolve(-1);
    }
  }
  getFocusedRowIndexByKey(key) {
    var loadedRowIndex = this._dataController.getRowIndexByKey(key, true);
    return loadedRowIndex >= 0 ? loadedRowIndex + this._dataController.getRowIndexOffset(true) : -1;
  }
  _focusRowByKeyOrIndex() {
    var focusedRowKey = this.option('focusedRowKey');
    var currentFocusedRowIndex = this.option('focusedRowIndex');
    if (isDefined(focusedRowKey)) {
      var visibleRowIndex = this._dataController.getRowIndexByKey(focusedRowKey);
      if (visibleRowIndex >= 0) {
        if (this._keyboardController._isVirtualScrolling()) {
          currentFocusedRowIndex = visibleRowIndex + this._dataController.getRowIndexOffset();
        }
        this._keyboardController.setFocusedRowIndex(currentFocusedRowIndex);
        this._triggerUpdateFocusedRow(focusedRowKey);
      } else {
        this._navigateToRow(focusedRowKey, true).done(focusedRowIndex => {
          if (currentFocusedRowIndex >= 0 && focusedRowIndex < 0) {
            this._focusRowByIndex();
          } else if (currentFocusedRowIndex < 0 && focusedRowIndex >= 0) {
            this._keyboardController.setFocusedRowIndex(focusedRowIndex);
          }
        });
      }
    } else if (currentFocusedRowIndex >= 0) {
      this._focusRowByIndex(currentFocusedRowIndex);
    }
  }
  isRowFocused(key) {
    var focusedRowKey = this.option('focusedRowKey');
    if (isDefined(focusedRowKey)) {
      return equalByValue(key, this.option('focusedRowKey'));
    }
    return undefined;
  }
  updateFocusedRow(_ref) {
    var {
      focusedRowKey
    } = _ref;
    var that = this;
    var focusedRowIndex = that._dataController.getRowIndexByKey(focusedRowKey);
    var rowsView = that.getView('rowsView');
    var $tableElement;
    var $mainRow;
    each(rowsView.getTableElements(), (index, element) => {
      var isMainTable = index === 0;
      $tableElement = $(element);
      that._clearPreviousFocusedRow($tableElement, focusedRowIndex);
      var $row = that._prepareFocusedRow({
        changedItem: that._dataController.getVisibleRows()[focusedRowIndex],
        $tableElement,
        focusedRowIndex
      });
      if (isMainTable) {
        $mainRow = $row;
      }
    });
    // @ts-expect-error
    $mainRow && rowsView.scrollToElementVertically($mainRow);
  }
  _clearPreviousFocusedRow($tableElement, focusedRowIndex) {
    var isNotMasterDetailFocusedRow = (_, focusedRow) => {
      var $focusedRowTable = $(focusedRow).closest(".".concat(this.addWidgetPrefix(TABLE_POSTFIX_CLASS)));
      return $tableElement.is($focusedRowTable);
    };
    var $prevRowFocusedElement = $tableElement.find(FOCUSED_ROW_SELECTOR).filter(isNotMasterDetailFocusedRow);
    $prevRowFocusedElement.removeClass(ROW_FOCUSED_CLASS).removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr('tabindex');
    $prevRowFocusedElement.children('td').removeAttr('tabindex');
    if (focusedRowIndex !== 0) {
      var $firstRow = $(this.getView('rowsView').getRowElement(0));
      $firstRow.removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr('tabIndex');
    }
  }
  _prepareFocusedRow(options) {
    var $row;
    var {
      changedItem
    } = options;
    if (changedItem && (changedItem.rowType === 'data' || changedItem.rowType === 'group')) {
      var {
        focusedRowIndex
      } = options;
      var {
        $tableElement
      } = options;
      var tabIndex = this.option('tabindex') || 0;
      var _rowsView = this.getView('rowsView');
      $row = $(_rowsView._getRowElements($tableElement).eq(focusedRowIndex));
      $row.addClass(ROW_FOCUSED_CLASS).attr('tabindex', tabIndex);
    }
    return $row;
  }
}
var keyboardNavigation = Base => class FocusKeyboardNavigationExtender extends Base {
  init() {
    var rowIndex = this.option('focusedRowIndex');
    var columnIndex = this.option('focusedColumnIndex');
    this.createAction('onFocusedRowChanging', {
      excludeValidators: ['disabled', 'readOnly']
    });
    this.createAction('onFocusedRowChanged', {
      excludeValidators: ['disabled', 'readOnly']
    });
    this.createAction('onFocusedCellChanging', {
      excludeValidators: ['disabled', 'readOnly']
    });
    this.createAction('onFocusedCellChanged', {
      excludeValidators: ['disabled', 'readOnly']
    });
    super.init();
    this.setRowFocusType();
    this._focusedCellPosition = {};
    if (isDefined(rowIndex) && rowIndex >= 0) {
      this._focusedCellPosition.rowIndex = rowIndex;
    }
    if (isDefined(columnIndex) && columnIndex >= 0) {
      this._focusedCellPosition.columnIndex = columnIndex;
    }
  }
  setFocusedRowIndex(rowIndex) {
    super.setFocusedRowIndex(rowIndex);
    this.option('focusedRowIndex', rowIndex);
  }
  setFocusedColumnIndex(columnIndex) {
    super.setFocusedColumnIndex(columnIndex);
    this.option('focusedColumnIndex', columnIndex);
  }
  _escapeKeyHandler(eventArgs, isEditing) {
    if (isEditing || !this.option('focusedRowEnabled')) {
      return super._escapeKeyHandler(eventArgs, isEditing);
    }
    if (this.isCellFocusType()) {
      this.setRowFocusType();
      this._focus(this._getCellElementFromTarget(eventArgs.originalEvent.target), true);
      return true;
    }
    return false;
  }
  _updateFocusedCellPosition($cell, direction) {
    var position = super._updateFocusedCellPosition($cell, direction);
    if (position && position.columnIndex >= 0) {
      this._fireFocusedCellChanged($cell);
    }
    return position;
  }
};
var editorFactory = Base => class FocusEditorFactoryExtender extends Base {
  renderFocusOverlay($element, isHideBorder) {
    var _a;
    var focusedRowEnabled = this.option('focusedRowEnabled');
    var $cell;
    if (!focusedRowEnabled || !((_a = this._keyboardNavigationController) === null || _a === void 0 ? void 0 : _a.isRowFocusType()) || this._editingController.isEditing()) {
      super.renderFocusOverlay($element, isHideBorder);
    } else if (focusedRowEnabled) {
      var isRowElement = this._keyboardNavigationController._getElementType($element) === 'row';
      if (isRowElement && !$element.hasClass(ROW_FOCUSED_CLASS)) {
        $cell = this._keyboardNavigationController.getFirstValidCellInRow($element);
        this._keyboardNavigationController.focus($cell);
      }
    }
  }
};
var columns = Base => class FocusColumnsExtender extends Base {
  getSortDataSourceParameters(_, sortByKey) {
    // @ts-expect-error
    var result = super.getSortDataSourceParameters.apply(this, arguments);
    var dataSource = this._dataController._dataSource;
    var store = this._dataController.store();
    var key = store && store.key();
    var remoteOperations = dataSource && dataSource.remoteOperations() || {};
    var isLocalOperations = Object.keys(remoteOperations).every(operationName => !remoteOperations[operationName]);
    if (key && (this.option('focusedRowEnabled') && this._focusController.isAutoNavigateToFocusedRow() !== false || sortByKey)) {
      key = Array.isArray(key) ? key : [key];
      var notSortedKeys = key.filter(key => !this.columnOption(key, 'sortOrder'));
      if (notSortedKeys.length) {
        result = result || [];
        if (isLocalOperations) {
          result.push({
            selector: dataSource.getDataIndexGetter(),
            desc: false
          });
        } else {
          notSortedKeys.forEach(notSortedKey => result.push({
            selector: notSortedKey,
            desc: false
          }));
        }
      }
    }
    return result;
  }
};
var data = Base => class FocusDataControllerExtender extends Base {
  _applyChange(change) {
    if (change && change.changeType === 'updateFocusedRow') return;
    // @ts-expect-error
    return super._applyChange.apply(this, arguments);
  }
  _fireChanged(e) {
    super._fireChanged(e);
    if (this.option('focusedRowEnabled') && this._dataSource) {
      var isPartialUpdate = e.changeType === 'update' && e.repaintChangesOnly;
      var isPartialUpdateWithDeleting = isPartialUpdate && e.changeTypes && e.changeTypes.indexOf('remove') >= 0;
      if (e.changeType === 'refresh' && e.items.length || isPartialUpdateWithDeleting) {
        this._updatePageIndexes();
        this._updateFocusedRow(e);
      } else if (e.changeType === 'append' || e.changeType === 'prepend') {
        this._updatePageIndexes();
      } else if (e.changeType === 'update' && e.repaintChangesOnly) {
        this._updateFocusedRow(e);
      }
    }
  }
  _updatePageIndexes() {
    var prevRenderingPageIndex = this._lastRenderingPageIndex || 0;
    var renderingPageIndex = this._rowsScrollController ? this._rowsScrollController.pageIndex() : 0;
    this._lastRenderingPageIndex = renderingPageIndex;
    this._isPagingByRendering = renderingPageIndex !== prevRenderingPageIndex;
  }
  isPagingByRendering() {
    return this._isPagingByRendering;
  }
  _updateFocusedRow(e) {
    var operationTypes = e.operationTypes || {};
    var {
      reload,
      fullReload,
      pageIndex,
      paging
    } = operationTypes;
    var isVirtualScrolling = this._keyboardNavigationController._isVirtualScrolling();
    var pagingWithoutVirtualScrolling = paging && !isVirtualScrolling;
    var focusedRowKey = this.option('focusedRowKey');
    var isAutoNavigate = this._focusController.isAutoNavigateToFocusedRow();
    var isReload = reload && pageIndex === false;
    if (isReload && !fullReload && isDefined(focusedRowKey)) {
      this._focusController._navigateToRow(focusedRowKey, true).done(focusedRowIndex => {
        if (focusedRowIndex < 0) {
          this._focusController._focusRowByIndex(undefined, operationTypes);
        }
      });
    } else if (pagingWithoutVirtualScrolling && isAutoNavigate) {
      var rowIndexByKey = this.getRowIndexByKey(focusedRowKey);
      var focusedRowIndex = this.option('focusedRowIndex');
      var isValidRowIndexByKey = rowIndexByKey >= 0;
      var isValidFocusedRowIndex = focusedRowIndex >= 0;
      var isSameRowIndex = focusedRowIndex === rowIndexByKey;
      if (isValidFocusedRowIndex && (isSameRowIndex || !isValidRowIndexByKey)) {
        this._focusController._focusRowByIndex(focusedRowIndex, operationTypes);
      }
    } else if (pagingWithoutVirtualScrolling && !isAutoNavigate && this.getRowIndexByKey(focusedRowKey) < 0) {
      this.option('focusedRowIndex', -1);
    } else if (operationTypes.fullReload) {
      this._focusController._focusRowByKeyOrIndex();
    }
  }
  /**
   * @extended: TreeList's focus
   */
  getPageIndexByKey(key) {
    var that = this;
    // @ts-expect-error
    var d = new Deferred();
    that.getGlobalRowIndexByKey(key).done(globalIndex => {
      d.resolve(globalIndex >= 0 ? Math.floor(globalIndex / that.pageSize()) : -1);
    }).fail(d.reject);
    return d.promise();
  }
  getGlobalRowIndexByKey(key) {
    if (this._dataSource.group()) {
      // @ts-expect-error
      return this._calculateGlobalRowIndexByGroupedData(key);
    }
    // @ts-expect-error
    return this._calculateGlobalRowIndexByFlatData(key);
  }
  _calculateGlobalRowIndexByFlatData(key, groupFilter, useGroup) {
    var that = this;
    // @ts-expect-error
    var deferred = new Deferred();
    var dataSource = that._dataSource;
    if (Array.isArray(key) || isNewRowTempKey(key)) {
      return deferred.resolve(-1).promise();
    }
    var filter = that._generateFilterByKey(key);
    dataSource.load({
      filter: that._concatWithCombinedFilter(filter),
      skip: 0,
      take: 1
    }).done(data => {
      if (data.length > 0) {
        filter = that._generateOperationFilterByKey(key, data[0], useGroup);
        dataSource.load({
          filter: that._concatWithCombinedFilter(filter, groupFilter),
          skip: 0,
          take: 1,
          requireTotalCount: true
        }).done((_, extra) => {
          deferred.resolve(extra.totalCount);
        });
      } else {
        deferred.resolve(-1);
      }
    });
    return deferred.promise();
  }
  _concatWithCombinedFilter(filter, groupFilter) {
    var combinedFilter = this.getCombinedFilter();
    return gridCoreUtils.combineFilters([filter, combinedFilter, groupFilter]);
  }
  _generateBooleanFilter(selector, value, sortInfo) {
    var {
      desc
    } = sortInfo;
    switch (true) {
      case value === false && desc:
        return [selector, '=', true];
      case value === false && !desc:
        return [selector, '=', null];
      case value === true && !desc:
      case !isBoolean(value) && desc:
        return [selector, '<>', value];
      default:
        return undefined;
    }
  }
  // TODO Vinogradov: Move this method implementation to the UiGridCoreFocusUtils
  // and cover with unit tests.
  _generateOperationFilterByKey(key, rowData, useGroup) {
    var that = this;
    var dateSerializationFormat = that.option('dateSerializationFormat');
    var isRemoteFiltering = that._dataSource.remoteOperations().filtering;
    var isRemoteSorting = that._dataSource.remoteOperations().sorting;
    var filter = that._generateFilterByKey(key, '<');
    // @ts-expect-error
    var sort = that._columnsController.getSortDataSourceParameters(!isRemoteFiltering, true);
    if (useGroup) {
      var group = that._columnsController.getGroupDataSourceParameters(!isRemoteFiltering);
      if (group) {
        sort = sort ? group.concat(sort) : group;
      }
    }
    if (sort) {
      sort.slice().reverse().forEach(sortInfo => {
        var {
          selector,
          desc,
          compare
        } = sortInfo;
        var {
          getter,
          rawValue,
          safeValue
        } = UiGridCoreFocusUtils.getSortFilterValue(sortInfo, rowData, {
          isRemoteFiltering,
          dateSerializationFormat,
          getSelector: selector => that._columnsController.columnOption(selector, 'selector')
        });
        filter = [[selector, '=', safeValue], 'and', filter];
        if (rawValue === null || isBoolean(rawValue)) {
          var booleanFilter = that._generateBooleanFilter(selector, safeValue, desc);
          if (booleanFilter) {
            filter = [booleanFilter, 'or', filter];
          }
        } else {
          var filterOperation = desc ? '>' : '<';
          var sortFilter;
          if (compare && !isRemoteSorting) {
            sortFilter = data => {
              if (filterOperation === '<') {
                return compare(rawValue, getter(data)) >= 1;
              }
              return compare(rawValue, getter(data)) <= -1;
            };
          } else {
            sortFilter = [selector, filterOperation, safeValue];
            if (!desc) {
              sortFilter = [sortFilter, 'or', [selector, '=', null]];
            }
          }
          filter = [sortFilter, 'or', filter];
        }
      });
    }
    return filter;
  }
  _generateFilterByKey(key, operation) {
    var dataSourceKey = this._dataSource.key();
    var filter = [];
    if (!operation) {
      operation = '=';
    }
    if (Array.isArray(dataSourceKey)) {
      for (var i = 0; i < dataSourceKey.length; ++i) {
        var keyPart = key[dataSourceKey[i]];
        if (keyPart) {
          if (filter.length > 0) {
            filter.push('and');
          }
          filter.push([dataSourceKey[i], operation, keyPart]);
        }
      }
    } else {
      filter = [dataSourceKey, operation, key];
    }
    return filter;
  }
  _getLastItemIndex() {
    return this.items(true).length - 1;
  }
};
var editing = Base => class FocusEditingControllerExtender extends Base {
  _deleteRowCore(rowIndex) {
    // @ts-expect-error
    var deferred = super._deleteRowCore.apply(this, arguments);
    var rowKey = this._dataController.getKeyByRowIndex(rowIndex);
    deferred.done(() => {
      var rowIndex = this._dataController.getRowIndexByKey(rowKey);
      var visibleRows = this._dataController.getVisibleRows();
      if (rowIndex === -1 && !visibleRows.length) {
        this._focusController._resetFocusedRow();
      }
    });
  }
};
var rowsView = Base => class RowsViewFocusController extends Base {
  _createRow(row) {
    // @ts-expect-error
    var $row = super._createRow.apply(this, arguments);
    if (this.option('focusedRowEnabled') && row) {
      if (this._focusController.isRowFocused(row.key)) {
        $row.addClass(ROW_FOCUSED_CLASS);
      }
    }
    return $row;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _checkRowKeys(options) {
    // @ts-expect-error
    super._checkRowKeys.apply(this, arguments);
    if (this.option('focusedRowEnabled') && this.option('dataSource')) {
      var store = this._dataController.store();
      if (store && !store.key()) {
        this._dataController.fireError('E1042', 'Row focusing');
      }
    }
  }
  _update(change) {
    if (change.changeType === 'updateFocusedRow') {
      if (this.option('focusedRowEnabled')) {
        this._focusController.updateFocusedRow(change);
      }
    } else {
      super._update(change);
    }
  }
  updateFocusElementTabIndex($cellElements, preventScroll) {
    if (this.option('focusedRowEnabled')) {
      this._setFocusedRowElementTabIndex(preventScroll);
    } else {
      // @ts-expect-error
      super.updateFocusElementTabIndex($cellElements);
    }
  }
  _setFocusedRowElementTabIndex(preventScroll) {
    var _a;
    var focusedRowKey = this.option('focusedRowKey');
    var tabIndex = (_a = this.option('tabIndex')) !== null && _a !== void 0 ? _a : 0;
    var columnsController = this._columnsController;
    var rowIndex = this._dataController.getRowIndexByKey(focusedRowKey);
    var columnIndex = this.option('focusedColumnIndex');
    var $row = this._findRowElementForTabIndex();
    if (!isDefined(this._scrollToFocusOnResize)) {
      this._scrollToFocusOnResize = () => {
        this.scrollToElementVertically(this._findRowElementForTabIndex());
        this.resizeCompleted.remove(this._scrollToFocusOnResize);
      };
    }
    $row.attr('tabIndex', tabIndex);
    if (rowIndex >= 0 && !preventScroll) {
      if (columnIndex < 0) {
        columnIndex = 0;
      }
      rowIndex += this._dataController.getRowIndexOffset();
      columnIndex += columnsController.getColumnIndexOffset();
      this._keyboardNavigationController.setFocusedCellPosition(rowIndex, columnIndex);
      if (this._focusController.isAutoNavigateToFocusedRow()) {
        var dataSource = this._dataController.dataSource();
        var operationTypes = dataSource && dataSource.operationTypes();
        // @ts-expect-error
        if (operationTypes && !operationTypes.paging && !this._dataController.isPagingByRendering()) {
          this.resizeCompleted.remove(this._scrollToFocusOnResize);
          this.resizeCompleted.add(this._scrollToFocusOnResize);
        }
      }
    }
  }
  _findRowElementForTabIndex() {
    var focusedRowKey = this.option('focusedRowKey');
    var rowIndex = this._dataController.getRowIndexByKey(focusedRowKey);
    return $(this.getRowElement(rowIndex >= 0 ? rowIndex : 0));
  }
  scrollToRowElement(key) {
    var rowIndex = this._dataController.getRowIndexByKey(key);
    // @ts-expect-error
    var $row = $(this.getRow(rowIndex));
    return this.scrollToElementVertically($row);
  }
  scrollToElementVertically($row) {
    var scrollable = this.getScrollable();
    if (scrollable && $row.length) {
      var position = scrollable.getScrollElementPosition($row, 'vertical');
      return this.scrollTopPosition(position);
    }
    // @ts-expect-error
    return new Deferred().resolve();
  }
  scrollTopPosition(scrollTop) {
    // @ts-expect-error
    var d = new Deferred();
    var scrollable = this.getScrollable();
    if (scrollable) {
      var currentScrollTop = scrollable.scrollTop();
      var scrollHandler = () => {
        scrollable.off('scroll', scrollHandler);
        d.resolve();
      };
      if (scrollTop !== currentScrollTop) {
        scrollable.on('scroll', scrollHandler);
        this._dataController.resetFilterApplying();
        scrollable.scrollTo({
          top: scrollTop
        });
        return d.promise();
      }
    }
    return d.resolve();
  }
};
export var focusModule = {
  defaultOptions() {
    return {
      focusedRowEnabled: false,
      autoNavigateToFocusedRow: true,
      focusedRowKey: null,
      focusedRowIndex: -1,
      focusedColumnIndex: -1
    };
  },
  controllers: {
    focus: FocusController
  },
  extenders: {
    controllers: {
      keyboardNavigation,
      editorFactory,
      columns,
      data,
      editing
    },
    views: {
      rowsView
    }
  }
};
