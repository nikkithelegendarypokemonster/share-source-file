/**
* DevExtreme (bundles/__internal/grids/grid_core/focus/m_focus.js)
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
exports.focusModule = exports.FocusController = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _m_editing_utils = require("../editing/m_editing_utils");
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _m_focus_utils = require("./m_focus_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const ROW_FOCUSED_CLASS = 'dx-row-focused';
const FOCUSED_ROW_SELECTOR = ".dx-row.".concat(ROW_FOCUSED_CLASS);
const TABLE_POSTFIX_CLASS = 'table';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
let FocusController = exports.FocusController = /*#__PURE__*/function (_core$ViewController) {
  _inheritsLoose(FocusController, _core$ViewController);
  function FocusController() {
    return _core$ViewController.apply(this, arguments) || this;
  }
  var _proto = FocusController.prototype;
  _proto.init = function init() {
    this.component._optionsByReference.focusedRowKey = true;
  };
  _proto.optionChanged = function optionChanged(args) {
    const {
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
        _core$ViewController.prototype.optionChanged.call(this, args);
        break;
    }
  };
  _proto.publicMethods = function publicMethods() {
    return ['navigateToRow', 'isRowFocused'];
  };
  _proto.isAutoNavigateToFocusedRow = function isAutoNavigateToFocusedRow() {
    return this.option('scrolling.mode') !== 'infinite' && this.option('autoNavigateToFocusedRow');
  };
  _proto._focusRowByIndex = function _focusRowByIndex(index, operationTypes) {
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
  };
  _proto._focusRowByIndexCore = function _focusRowByIndexCore(index, operationTypes) {
    const pageSize = this._dataController.pageSize();
    const setKeyByIndex = () => {
      if (this._isValidFocusedRowIndex(index)) {
        let rowIndex = index - this._dataController.getRowIndexOffset(true);
        if (!operationTypes || operationTypes.paging && !operationTypes.filtering) {
          // @ts-expect-error
          const lastItemIndex = this._dataController._getLastItemIndex();
          rowIndex = Math.min(rowIndex, lastItemIndex);
        }
        const focusedRowKey = this._dataController.getKeyByRowIndex(rowIndex, true);
        if ((0, _type.isDefined)(focusedRowKey) && !this.isRowFocused(focusedRowKey)) {
          this.option('focusedRowKey', focusedRowKey);
        }
      }
    };
    if (pageSize >= 0) {
      if (!this._isLocalRowIndex(index)) {
        const pageIndex = Math.floor(index / this._dataController.pageSize());
        (0, _deferred.when)(this._dataController.pageIndex(pageIndex), this._dataController.waitReady()).done(() => {
          setKeyByIndex();
        });
      } else {
        setKeyByIndex();
      }
    }
  };
  _proto._isLocalRowIndex = function _isLocalRowIndex(index) {
    const isVirtualScrolling = this._keyboardController._isVirtualScrolling();
    if (isVirtualScrolling) {
      const pageIndex = Math.floor(index / this._dataController.pageSize());
      // @ts-expect-error
      const virtualItems = this._dataController.virtualItemsCount();
      const virtualItemsBegin = virtualItems ? virtualItems.begin : -1;
      const visibleRowsCount = this._dataController.getVisibleRows().length + this._dataController.getRowIndexOffset();
      const visiblePagesCount = Math.ceil(visibleRowsCount / this._dataController.pageSize());
      return virtualItemsBegin <= index && visiblePagesCount > pageIndex;
    }
    return true;
  };
  _proto._setFocusedRowKeyByIndex = function _setFocusedRowKeyByIndex(index) {
    if (this._isValidFocusedRowIndex(index)) {
      const rowIndex = Math.min(index - this._dataController.getRowIndexOffset(), this._dataController.items().length - 1);
      const focusedRowKey = this._dataController.getKeyByRowIndex(rowIndex);
      if ((0, _type.isDefined)(focusedRowKey) && !this.isRowFocused(focusedRowKey)) {
        this.option('focusedRowKey', focusedRowKey);
      }
    }
  };
  _proto._focusRowByKey = function _focusRowByKey(key) {
    if (!(0, _type.isDefined)(key)) {
      this._resetFocusedRow();
    } else {
      this._navigateToRow(key, true);
    }
  };
  _proto._resetFocusedRow = function _resetFocusedRow() {
    const focusedRowKey = this.option('focusedRowKey');
    const isFocusedRowKeyDefined = (0, _type.isDefined)(focusedRowKey);
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
  };
  _proto._isValidFocusedRowIndex = function _isValidFocusedRowIndex(rowIndex) {
    const row = this._dataController.getVisibleRows()[rowIndex];
    return !row || row.rowType === 'data' || row.rowType === 'group';
  };
  _proto.navigateToRow = function navigateToRow(key) {
    if (!this.isAutoNavigateToFocusedRow()) {
      this.option('focusedRowIndex', -1);
    }
    return this._navigateToRow(key);
  };
  _proto._navigateToRow = function _navigateToRow(key, needFocusRow) {
    const that = this;
    const isAutoNavigate = that.isAutoNavigateToFocusedRow();
    // @ts-expect-error
    const d = new _deferred.Deferred();
    if (key === undefined || !this._dataController.dataSource()) {
      return d.reject().promise();
    }
    const rowIndexByKey = that.getFocusedRowIndexByKey(key);
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
  };
  _proto._navigateTo = function _navigateTo(key, deferred, needFocusRow) {
    const visibleRowIndex = this._dataController.getRowIndexByKey(key);
    const isVirtualRowRenderingMode = _m_utils.default.isVirtualRowRendering(this);
    const isAutoNavigate = this.isAutoNavigateToFocusedRow();
    if (isAutoNavigate && isVirtualRowRenderingMode && visibleRowIndex < 0) {
      this._navigateToVirtualRow(key, deferred, needFocusRow);
    } else {
      this._navigateToVisibleRow(key, deferred, needFocusRow);
    }
  };
  _proto._navigateToVisibleRow = function _navigateToVisibleRow(key, deferred, needFocusRow) {
    if (needFocusRow) {
      this._triggerUpdateFocusedRow(key, deferred);
    } else {
      const focusedRowIndex = this.getFocusedRowIndexByKey(key);
      // @ts-expect-error
      this.getView('rowsView').scrollToRowElement(key, deferred).done(() => {
        deferred.resolve(focusedRowIndex);
      });
    }
  };
  _proto._navigateToVirtualRow = function _navigateToVirtualRow(key, deferred, needFocusRow) {
    const rowsScrollController = this._dataController._rowsScrollController;
    const rowIndex = _m_utils.default.getIndexByKey(key, this._dataController.items(true));
    const scrollable = this.getView('rowsView').getScrollable();
    if (rowsScrollController && scrollable && rowIndex >= 0) {
      const focusedRowIndex = rowIndex + this._dataController.getRowIndexOffset(true);
      const offset = rowsScrollController.getItemOffset(focusedRowIndex);
      const triggerUpdateFocusedRow = () => {
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
  };
  _proto._triggerUpdateFocusedRow = function _triggerUpdateFocusedRow(key, deferred) {
    const focusedRowIndex = this.getFocusedRowIndexByKey(key);
    if (this._isValidFocusedRowIndex(focusedRowIndex)) {
      let d;
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
      (0, _deferred.when)(d).done(() => {
        this._keyboardController.setFocusedRowIndex(focusedRowIndex);
        deferred && deferred.resolve(focusedRowIndex);
      });
    } else {
      deferred && deferred.resolve(-1);
    }
  };
  _proto.getFocusedRowIndexByKey = function getFocusedRowIndexByKey(key) {
    const loadedRowIndex = this._dataController.getRowIndexByKey(key, true);
    return loadedRowIndex >= 0 ? loadedRowIndex + this._dataController.getRowIndexOffset(true) : -1;
  };
  _proto._focusRowByKeyOrIndex = function _focusRowByKeyOrIndex() {
    const focusedRowKey = this.option('focusedRowKey');
    let currentFocusedRowIndex = this.option('focusedRowIndex');
    if ((0, _type.isDefined)(focusedRowKey)) {
      const visibleRowIndex = this._dataController.getRowIndexByKey(focusedRowKey);
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
  };
  _proto.isRowFocused = function isRowFocused(key) {
    const focusedRowKey = this.option('focusedRowKey');
    if ((0, _type.isDefined)(focusedRowKey)) {
      return (0, _common.equalByValue)(key, this.option('focusedRowKey'));
    }
    return undefined;
  };
  _proto.updateFocusedRow = function updateFocusedRow(_ref) {
    let {
      focusedRowKey
    } = _ref;
    const that = this;
    const focusedRowIndex = that._dataController.getRowIndexByKey(focusedRowKey);
    const rowsView = that.getView('rowsView');
    let $tableElement;
    let $mainRow;
    (0, _iterator.each)(rowsView.getTableElements(), (index, element) => {
      const isMainTable = index === 0;
      $tableElement = (0, _renderer.default)(element);
      that._clearPreviousFocusedRow($tableElement, focusedRowIndex);
      const $row = that._prepareFocusedRow({
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
  };
  _proto._clearPreviousFocusedRow = function _clearPreviousFocusedRow($tableElement, focusedRowIndex) {
    const isNotMasterDetailFocusedRow = (_, focusedRow) => {
      const $focusedRowTable = (0, _renderer.default)(focusedRow).closest(".".concat(this.addWidgetPrefix(TABLE_POSTFIX_CLASS)));
      return $tableElement.is($focusedRowTable);
    };
    const $prevRowFocusedElement = $tableElement.find(FOCUSED_ROW_SELECTOR).filter(isNotMasterDetailFocusedRow);
    $prevRowFocusedElement.removeClass(ROW_FOCUSED_CLASS).removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr('tabindex');
    $prevRowFocusedElement.children('td').removeAttr('tabindex');
    if (focusedRowIndex !== 0) {
      const $firstRow = (0, _renderer.default)(this.getView('rowsView').getRowElement(0));
      $firstRow.removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr('tabIndex');
    }
  };
  _proto._prepareFocusedRow = function _prepareFocusedRow(options) {
    let $row;
    const {
      changedItem
    } = options;
    if (changedItem && (changedItem.rowType === 'data' || changedItem.rowType === 'group')) {
      const {
        focusedRowIndex
      } = options;
      const {
        $tableElement
      } = options;
      const tabIndex = this.option('tabindex') || 0;
      const rowsView = this.getView('rowsView');
      $row = (0, _renderer.default)(rowsView._getRowElements($tableElement).eq(focusedRowIndex));
      $row.addClass(ROW_FOCUSED_CLASS).attr('tabindex', tabIndex);
    }
    return $row;
  };
  _createClass(FocusController, [{
    key: "_keyboardController",
    get:
    // TODO getController
    //  This controller's method used in the data_controler (and maybe others) init methods
    //  And this controller's fields are empty when methods already called
    //  Therefore, as a temporary solution this private getters exist here
    function () {
      return this.getController('keyboardNavigation');
    }
  }, {
    key: "_dataController",
    get: function () {
      return this.getController('data');
    }
  }]);
  return FocusController;
}(_m_modules.default.ViewController);
const keyboardNavigation = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(FocusKeyboardNavigationExtender, _Base);
  function FocusKeyboardNavigationExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto2 = FocusKeyboardNavigationExtender.prototype;
  _proto2.init = function init() {
    const rowIndex = this.option('focusedRowIndex');
    const columnIndex = this.option('focusedColumnIndex');
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
    _Base.prototype.init.call(this);
    this.setRowFocusType();
    this._focusedCellPosition = {};
    if ((0, _type.isDefined)(rowIndex) && rowIndex >= 0) {
      this._focusedCellPosition.rowIndex = rowIndex;
    }
    if ((0, _type.isDefined)(columnIndex) && columnIndex >= 0) {
      this._focusedCellPosition.columnIndex = columnIndex;
    }
  };
  _proto2.setFocusedRowIndex = function setFocusedRowIndex(rowIndex) {
    _Base.prototype.setFocusedRowIndex.call(this, rowIndex);
    this.option('focusedRowIndex', rowIndex);
  };
  _proto2.setFocusedColumnIndex = function setFocusedColumnIndex(columnIndex) {
    _Base.prototype.setFocusedColumnIndex.call(this, columnIndex);
    this.option('focusedColumnIndex', columnIndex);
  };
  _proto2._escapeKeyHandler = function _escapeKeyHandler(eventArgs, isEditing) {
    if (isEditing || !this.option('focusedRowEnabled')) {
      return _Base.prototype._escapeKeyHandler.call(this, eventArgs, isEditing);
    }
    if (this.isCellFocusType()) {
      this.setRowFocusType();
      this._focus(this._getCellElementFromTarget(eventArgs.originalEvent.target), true);
      return true;
    }
    return false;
  };
  _proto2._updateFocusedCellPosition = function _updateFocusedCellPosition($cell, direction) {
    const position = _Base.prototype._updateFocusedCellPosition.call(this, $cell, direction);
    if (position && position.columnIndex >= 0) {
      this._fireFocusedCellChanged($cell);
    }
    return position;
  };
  return FocusKeyboardNavigationExtender;
}(Base);
const editorFactory = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(FocusEditorFactoryExtender, _Base2);
  function FocusEditorFactoryExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto3 = FocusEditorFactoryExtender.prototype;
  _proto3.renderFocusOverlay = function renderFocusOverlay($element, isHideBorder) {
    var _a;
    const focusedRowEnabled = this.option('focusedRowEnabled');
    let $cell;
    if (!focusedRowEnabled || !((_a = this._keyboardNavigationController) === null || _a === void 0 ? void 0 : _a.isRowFocusType()) || this._editingController.isEditing()) {
      _Base2.prototype.renderFocusOverlay.call(this, $element, isHideBorder);
    } else if (focusedRowEnabled) {
      const isRowElement = this._keyboardNavigationController._getElementType($element) === 'row';
      if (isRowElement && !$element.hasClass(ROW_FOCUSED_CLASS)) {
        $cell = this._keyboardNavigationController.getFirstValidCellInRow($element);
        this._keyboardNavigationController.focus($cell);
      }
    }
  };
  return FocusEditorFactoryExtender;
}(Base);
const columns = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(FocusColumnsExtender, _Base3);
  function FocusColumnsExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto4 = FocusColumnsExtender.prototype;
  _proto4.getSortDataSourceParameters = function getSortDataSourceParameters(_, sortByKey) {
    // @ts-expect-error
    let result = _Base3.prototype.getSortDataSourceParameters.apply(this, arguments);
    const dataSource = this._dataController._dataSource;
    const store = this._dataController.store();
    let key = store && store.key();
    const remoteOperations = dataSource && dataSource.remoteOperations() || {};
    const isLocalOperations = Object.keys(remoteOperations).every(operationName => !remoteOperations[operationName]);
    if (key && (this.option('focusedRowEnabled') && this._focusController.isAutoNavigateToFocusedRow() !== false || sortByKey)) {
      key = Array.isArray(key) ? key : [key];
      const notSortedKeys = key.filter(key => !this.columnOption(key, 'sortOrder'));
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
  };
  return FocusColumnsExtender;
}(Base);
const data = Base => /*#__PURE__*/function (_Base4) {
  _inheritsLoose(FocusDataControllerExtender, _Base4);
  function FocusDataControllerExtender() {
    return _Base4.apply(this, arguments) || this;
  }
  var _proto5 = FocusDataControllerExtender.prototype;
  _proto5._applyChange = function _applyChange(change) {
    if (change && change.changeType === 'updateFocusedRow') return;
    // @ts-expect-error
    return _Base4.prototype._applyChange.apply(this, arguments);
  };
  _proto5._fireChanged = function _fireChanged(e) {
    _Base4.prototype._fireChanged.call(this, e);
    if (this.option('focusedRowEnabled') && this._dataSource) {
      const isPartialUpdate = e.changeType === 'update' && e.repaintChangesOnly;
      const isPartialUpdateWithDeleting = isPartialUpdate && e.changeTypes && e.changeTypes.indexOf('remove') >= 0;
      if (e.changeType === 'refresh' && e.items.length || isPartialUpdateWithDeleting) {
        this._updatePageIndexes();
        this._updateFocusedRow(e);
      } else if (e.changeType === 'append' || e.changeType === 'prepend') {
        this._updatePageIndexes();
      } else if (e.changeType === 'update' && e.repaintChangesOnly) {
        this._updateFocusedRow(e);
      }
    }
  };
  _proto5._updatePageIndexes = function _updatePageIndexes() {
    const prevRenderingPageIndex = this._lastRenderingPageIndex || 0;
    const renderingPageIndex = this._rowsScrollController ? this._rowsScrollController.pageIndex() : 0;
    this._lastRenderingPageIndex = renderingPageIndex;
    this._isPagingByRendering = renderingPageIndex !== prevRenderingPageIndex;
  };
  _proto5.isPagingByRendering = function isPagingByRendering() {
    return this._isPagingByRendering;
  };
  _proto5._updateFocusedRow = function _updateFocusedRow(e) {
    const operationTypes = e.operationTypes || {};
    const {
      reload,
      fullReload,
      pageIndex,
      paging
    } = operationTypes;
    const isVirtualScrolling = this._keyboardNavigationController._isVirtualScrolling();
    const pagingWithoutVirtualScrolling = paging && !isVirtualScrolling;
    const focusedRowKey = this.option('focusedRowKey');
    const isAutoNavigate = this._focusController.isAutoNavigateToFocusedRow();
    const isReload = reload && pageIndex === false;
    if (isReload && !fullReload && (0, _type.isDefined)(focusedRowKey)) {
      this._focusController._navigateToRow(focusedRowKey, true).done(focusedRowIndex => {
        if (focusedRowIndex < 0) {
          this._focusController._focusRowByIndex(undefined, operationTypes);
        }
      });
    } else if (pagingWithoutVirtualScrolling && isAutoNavigate) {
      const rowIndexByKey = this.getRowIndexByKey(focusedRowKey);
      const focusedRowIndex = this.option('focusedRowIndex');
      const isValidRowIndexByKey = rowIndexByKey >= 0;
      const isValidFocusedRowIndex = focusedRowIndex >= 0;
      const isSameRowIndex = focusedRowIndex === rowIndexByKey;
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
   */;
  _proto5.getPageIndexByKey = function getPageIndexByKey(key) {
    const that = this;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    that.getGlobalRowIndexByKey(key).done(globalIndex => {
      d.resolve(globalIndex >= 0 ? Math.floor(globalIndex / that.pageSize()) : -1);
    }).fail(d.reject);
    return d.promise();
  };
  _proto5.getGlobalRowIndexByKey = function getGlobalRowIndexByKey(key) {
    if (this._dataSource.group()) {
      // @ts-expect-error
      return this._calculateGlobalRowIndexByGroupedData(key);
    }
    // @ts-expect-error
    return this._calculateGlobalRowIndexByFlatData(key);
  };
  _proto5._calculateGlobalRowIndexByFlatData = function _calculateGlobalRowIndexByFlatData(key, groupFilter, useGroup) {
    const that = this;
    // @ts-expect-error
    const deferred = new _deferred.Deferred();
    const dataSource = that._dataSource;
    if (Array.isArray(key) || (0, _m_editing_utils.isNewRowTempKey)(key)) {
      return deferred.resolve(-1).promise();
    }
    let filter = that._generateFilterByKey(key);
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
  };
  _proto5._concatWithCombinedFilter = function _concatWithCombinedFilter(filter, groupFilter) {
    const combinedFilter = this.getCombinedFilter();
    return _m_utils.default.combineFilters([filter, combinedFilter, groupFilter]);
  };
  _proto5._generateBooleanFilter = function _generateBooleanFilter(selector, value, sortInfo) {
    const {
      desc
    } = sortInfo;
    switch (true) {
      case value === false && desc:
        return [selector, '=', true];
      case value === false && !desc:
        return [selector, '=', null];
      case value === true && !desc:
      case !(0, _type.isBoolean)(value) && desc:
        return [selector, '<>', value];
      default:
        return undefined;
    }
  }
  // TODO Vinogradov: Move this method implementation to the UiGridCoreFocusUtils
  // and cover with unit tests.
  ;
  _proto5._generateOperationFilterByKey = function _generateOperationFilterByKey(key, rowData, useGroup) {
    const that = this;
    const dateSerializationFormat = that.option('dateSerializationFormat');
    const isRemoteFiltering = that._dataSource.remoteOperations().filtering;
    const isRemoteSorting = that._dataSource.remoteOperations().sorting;
    let filter = that._generateFilterByKey(key, '<');
    // @ts-expect-error
    let sort = that._columnsController.getSortDataSourceParameters(!isRemoteFiltering, true);
    if (useGroup) {
      const group = that._columnsController.getGroupDataSourceParameters(!isRemoteFiltering);
      if (group) {
        sort = sort ? group.concat(sort) : group;
      }
    }
    if (sort) {
      sort.slice().reverse().forEach(sortInfo => {
        const {
          selector,
          desc,
          compare
        } = sortInfo;
        const {
          getter,
          rawValue,
          safeValue
        } = _m_focus_utils.UiGridCoreFocusUtils.getSortFilterValue(sortInfo, rowData, {
          isRemoteFiltering,
          dateSerializationFormat,
          getSelector: selector => that._columnsController.columnOption(selector, 'selector')
        });
        filter = [[selector, '=', safeValue], 'and', filter];
        if (rawValue === null || (0, _type.isBoolean)(rawValue)) {
          const booleanFilter = that._generateBooleanFilter(selector, safeValue, desc);
          if (booleanFilter) {
            filter = [booleanFilter, 'or', filter];
          }
        } else {
          const filterOperation = desc ? '>' : '<';
          let sortFilter;
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
  };
  _proto5._generateFilterByKey = function _generateFilterByKey(key, operation) {
    const dataSourceKey = this._dataSource.key();
    let filter = [];
    if (!operation) {
      operation = '=';
    }
    if (Array.isArray(dataSourceKey)) {
      for (let i = 0; i < dataSourceKey.length; ++i) {
        const keyPart = key[dataSourceKey[i]];
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
  };
  _proto5._getLastItemIndex = function _getLastItemIndex() {
    return this.items(true).length - 1;
  };
  return FocusDataControllerExtender;
}(Base);
const editing = Base => /*#__PURE__*/function (_Base5) {
  _inheritsLoose(FocusEditingControllerExtender, _Base5);
  function FocusEditingControllerExtender() {
    return _Base5.apply(this, arguments) || this;
  }
  var _proto6 = FocusEditingControllerExtender.prototype;
  _proto6._deleteRowCore = function _deleteRowCore(rowIndex) {
    // @ts-expect-error
    const deferred = _Base5.prototype._deleteRowCore.apply(this, arguments);
    const rowKey = this._dataController.getKeyByRowIndex(rowIndex);
    deferred.done(() => {
      const rowIndex = this._dataController.getRowIndexByKey(rowKey);
      const visibleRows = this._dataController.getVisibleRows();
      if (rowIndex === -1 && !visibleRows.length) {
        this._focusController._resetFocusedRow();
      }
    });
  };
  return FocusEditingControllerExtender;
}(Base);
const rowsView = Base => /*#__PURE__*/function (_Base6) {
  _inheritsLoose(RowsViewFocusController, _Base6);
  function RowsViewFocusController() {
    return _Base6.apply(this, arguments) || this;
  }
  var _proto7 = RowsViewFocusController.prototype;
  _proto7._createRow = function _createRow(row) {
    // @ts-expect-error
    const $row = _Base6.prototype._createRow.apply(this, arguments);
    if (this.option('focusedRowEnabled') && row) {
      if (this._focusController.isRowFocused(row.key)) {
        $row.addClass(ROW_FOCUSED_CLASS);
      }
    }
    return $row;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto7._checkRowKeys = function _checkRowKeys(options) {
    // @ts-expect-error
    _Base6.prototype._checkRowKeys.apply(this, arguments);
    if (this.option('focusedRowEnabled') && this.option('dataSource')) {
      const store = this._dataController.store();
      if (store && !store.key()) {
        this._dataController.fireError('E1042', 'Row focusing');
      }
    }
  };
  _proto7._update = function _update(change) {
    if (change.changeType === 'updateFocusedRow') {
      if (this.option('focusedRowEnabled')) {
        this._focusController.updateFocusedRow(change);
      }
    } else {
      _Base6.prototype._update.call(this, change);
    }
  };
  _proto7.updateFocusElementTabIndex = function updateFocusElementTabIndex($cellElements, preventScroll) {
    if (this.option('focusedRowEnabled')) {
      this._setFocusedRowElementTabIndex(preventScroll);
    } else {
      // @ts-expect-error
      _Base6.prototype.updateFocusElementTabIndex.call(this, $cellElements);
    }
  };
  _proto7._setFocusedRowElementTabIndex = function _setFocusedRowElementTabIndex(preventScroll) {
    var _a;
    const focusedRowKey = this.option('focusedRowKey');
    const tabIndex = (_a = this.option('tabIndex')) !== null && _a !== void 0 ? _a : 0;
    const columnsController = this._columnsController;
    let rowIndex = this._dataController.getRowIndexByKey(focusedRowKey);
    let columnIndex = this.option('focusedColumnIndex');
    const $row = this._findRowElementForTabIndex();
    if (!(0, _type.isDefined)(this._scrollToFocusOnResize)) {
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
        const dataSource = this._dataController.dataSource();
        const operationTypes = dataSource && dataSource.operationTypes();
        // @ts-expect-error
        if (operationTypes && !operationTypes.paging && !this._dataController.isPagingByRendering()) {
          this.resizeCompleted.remove(this._scrollToFocusOnResize);
          this.resizeCompleted.add(this._scrollToFocusOnResize);
        }
      }
    }
  };
  _proto7._findRowElementForTabIndex = function _findRowElementForTabIndex() {
    const focusedRowKey = this.option('focusedRowKey');
    const rowIndex = this._dataController.getRowIndexByKey(focusedRowKey);
    return (0, _renderer.default)(this.getRowElement(rowIndex >= 0 ? rowIndex : 0));
  };
  _proto7.scrollToRowElement = function scrollToRowElement(key) {
    const rowIndex = this._dataController.getRowIndexByKey(key);
    // @ts-expect-error
    const $row = (0, _renderer.default)(this.getRow(rowIndex));
    return this.scrollToElementVertically($row);
  };
  _proto7.scrollToElementVertically = function scrollToElementVertically($row) {
    const scrollable = this.getScrollable();
    if (scrollable && $row.length) {
      const position = scrollable.getScrollElementPosition($row, 'vertical');
      return this.scrollTopPosition(position);
    }
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  };
  _proto7.scrollTopPosition = function scrollTopPosition(scrollTop) {
    // @ts-expect-error
    const d = new _deferred.Deferred();
    const scrollable = this.getScrollable();
    if (scrollable) {
      const currentScrollTop = scrollable.scrollTop();
      const scrollHandler = () => {
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
  };
  return RowsViewFocusController;
}(Base);
const focusModule = exports.focusModule = {
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
