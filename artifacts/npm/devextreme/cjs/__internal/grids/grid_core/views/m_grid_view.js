/**
* DevExtreme (cjs/__internal/grids/grid_core/views/m_grid_view.js)
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
exports.gridViewModule = exports.SynchronizeScrollingController = exports.ResizingController = exports.GridView = void 0;
var _dom_adapter = _interopRequireDefault(require("../../../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _browser = _interopRequireDefault(require("../../../../core/utils/browser"));
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _iterator = require("../../../../core/utils/iterator");
var _position = require("../../../../core/utils/position");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _window = require("../../../../core/utils/window");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var accessibility = _interopRequireWildcard(require("../../../../ui/shared/accessibility"));
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const BORDERS_CLASS = 'borders';
const TABLE_FIXED_CLASS = 'table-fixed';
const IMPORTANT_MARGIN_CLASS = 'important-margin';
const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';
const GROUP_ROW_SELECTOR = 'tr.dx-group-row';
const HIDDEN_COLUMNS_WIDTH = 'adaptiveHidden';
const VIEW_NAMES = ['columnsSeparatorView', 'blockSeparatorView', 'trackerView', 'headerPanel', 'columnHeadersView', 'rowsView', 'footerView', 'columnChooserView', 'filterPanelView', 'pagerView', 'draggingHeaderView', 'contextMenuView', 'errorView', 'headerFilterView', 'filterBuilderView'];
const isPercentWidth = function (width) {
  return (0, _type.isString)(width) && width.endsWith('%');
};
const isPixelWidth = function (width) {
  return (0, _type.isString)(width) && width.endsWith('px');
};
const calculateFreeWidth = function (that, widths) {
  const contentWidth = that._rowsView.contentWidth();
  const totalWidth = that._getTotalWidth(widths, contentWidth);
  return contentWidth - totalWidth;
};
const calculateFreeWidthWithCurrentMinWidth = function (that, columnIndex, currentMinWidth, widths) {
  return calculateFreeWidth(that, widths.map((width, index) => index === columnIndex ? currentMinWidth : width));
};
const restoreFocus = function (focusedElement, selectionRange) {
  accessibility.hiddenFocus(focusedElement, true);
  _m_utils.default.setSelectionRange(focusedElement, selectionRange);
};
let ResizingController = exports.ResizingController = /*#__PURE__*/function (_modules$ViewControll) {
  _inheritsLoose(ResizingController, _modules$ViewControll);
  function ResizingController() {
    return _modules$ViewControll.apply(this, arguments) || this;
  }
  var _proto = ResizingController.prototype;
  _proto.init = function init() {
    this._prevContentMinHeight = null;
    this._dataController = this.getController('data');
    this._columnsController = this.getController('columns');
    this._columnHeadersView = this.getView('columnHeadersView');
    this._adaptiveColumnsController = this.getController('adaptiveColumns');
    this._editorFactoryController = this.getController('editorFactory');
    this._footerView = this.getView('footerView');
    this._rowsView = this.getView('rowsView');
  };
  _proto._initPostRenderHandlers = function _initPostRenderHandlers() {
    if (!this._refreshSizesHandler) {
      this._refreshSizesHandler = e => {
        // @ts-expect-error
        let resizeDeferred = new _deferred.Deferred().resolve(null);
        const changeType = e === null || e === void 0 ? void 0 : e.changeType;
        const isDelayed = e === null || e === void 0 ? void 0 : e.isDelayed;
        const needFireContentReady = changeType && changeType !== 'updateSelection' && changeType !== 'updateFocusedRow' && changeType !== 'pageIndex' && !isDelayed;
        this._dataController.changed.remove(this._refreshSizesHandler);
        if (this._checkSize()) {
          resizeDeferred = this._refreshSizes(e);
        }
        if (needFireContentReady) {
          (0, _deferred.when)(resizeDeferred).done(() => {
            this._setAriaLabel();
            this.fireContentReadyAction();
          });
        }
      };
      // TODO remove resubscribing
      this._dataController.changed.add(() => {
        this._dataController.changed.add(this._refreshSizesHandler);
      });
    }
  };
  _proto._refreshSizes = function _refreshSizes(e) {
    var _a;
    // @ts-expect-error
    let resizeDeferred = new _deferred.Deferred().resolve(null);
    const changeType = e === null || e === void 0 ? void 0 : e.changeType;
    const isDelayed = e === null || e === void 0 ? void 0 : e.isDelayed;
    const items = this._dataController.items();
    if (!e || changeType === 'refresh' || changeType === 'prepend' || changeType === 'append') {
      if (!isDelayed) {
        resizeDeferred = this.resize();
      }
    } else if (changeType === 'update') {
      if (((_a = e.changeTypes) === null || _a === void 0 ? void 0 : _a.length) === 0) {
        return resizeDeferred;
      }
      if ((items.length > 1 || e.changeTypes[0] !== 'insert') && !(items.length === 0 && e.changeTypes[0] === 'remove') && !e.needUpdateDimensions) {
        // @ts-expect-error
        resizeDeferred = new _deferred.Deferred();
        this._waitAsyncTemplates().done(() => {
          (0, _common.deferUpdate)(() => (0, _common.deferRender)(() => (0, _common.deferUpdate)(() => {
            this._setScrollerSpacing();
            this._rowsView.resize();
            resizeDeferred.resolve();
          })));
        }).fail(resizeDeferred.reject);
      } else {
        resizeDeferred = this.resize();
      }
    }
    return resizeDeferred;
  }
  /**
   * @extended: master_detail
   */;
  _proto.fireContentReadyAction = function fireContentReadyAction() {
    this.component._fireContentReadyAction();
  };
  _proto._getWidgetAriaLabel = function _getWidgetAriaLabel() {
    return 'dxDataGrid-ariaDataGrid';
  };
  _proto._setAriaLabel = function _setAriaLabel() {
    const totalItemsCount = Math.max(0, this._dataController.totalItemsCount());
    this.component.setAria('label', _message.default.format(this._getWidgetAriaLabel(),
    // @ts-expect-error
    totalItemsCount, this.component.columnCount()), this.component.$element().children(".".concat(GRIDBASE_CONTAINER_CLASS)));
  };
  _proto._getBestFitWidths = function _getBestFitWidths() {
    var _a;
    const rowsView = this._rowsView;
    const columnHeadersView = this._columnHeadersView;
    let widths = rowsView.getColumnWidths();
    if (!(widths === null || widths === void 0 ? void 0 : widths.length)) {
      const headersTableElement = columnHeadersView.getTableElement();
      columnHeadersView.setTableElement((_a = rowsView.getTableElement()) === null || _a === void 0 ? void 0 : _a.children('.dx-header'));
      widths = columnHeadersView.getColumnWidths();
      columnHeadersView.setTableElement(headersTableElement);
    }
    return widths;
  };
  _proto._setVisibleWidths = function _setVisibleWidths(visibleColumns, widths) {
    const columnsController = this._columnsController;
    columnsController.beginUpdate();
    (0, _iterator.each)(visibleColumns, (index, column) => {
      const columnId = columnsController.getColumnId(column);
      columnsController.columnOption(columnId, 'visibleWidth', widths[index]);
    });
    columnsController.endUpdate();
  };
  _proto._toggleBestFitModeForView = function _toggleBestFitModeForView(view, className, isBestFit) {
    if (!view || !view.isVisible()) return;
    const $rowsTables = this._rowsView.getTableElements();
    const $viewTables = view.getTableElements();
    (0, _iterator.each)($rowsTables, (index, tableElement) => {
      let $tableBody;
      const $rowsTable = (0, _renderer.default)(tableElement);
      const $viewTable = $viewTables.eq(index);
      if ($viewTable && $viewTable.length) {
        if (isBestFit) {
          $tableBody = $viewTable.children('tbody').appendTo($rowsTable);
        } else {
          $tableBody = $rowsTable.children(".".concat(className)).appendTo($viewTable);
        }
        $tableBody.toggleClass(className, isBestFit);
        $tableBody.toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
      }
    });
  }
  /**
   * @extended: adaptivity, master_detail
   */;
  _proto._toggleBestFitMode = function _toggleBestFitMode(isBestFit) {
    const $rowsTable = this._rowsView.getTableElement();
    const $rowsFixedTable = this._rowsView.getTableElements().eq(1);
    if (!$rowsTable) return;
    $rowsTable.css('tableLayout', isBestFit ? 'auto' : 'fixed');
    $rowsTable.children('colgroup').css('display', isBestFit ? 'none' : '');
    // NOTE T1156153: Hide group row column to get correct fixed column widths.
    (0, _iterator.each)($rowsFixedTable.find(GROUP_ROW_SELECTOR), (idx, item) => {
      (0, _renderer.default)(item).css('display', isBestFit ? 'none' : '');
    });
    $rowsFixedTable.toggleClass(this.addWidgetPrefix(TABLE_FIXED_CLASS), !isBestFit);
    this._toggleBestFitModeForView(this._columnHeadersView, 'dx-header', isBestFit);
    this._toggleBestFitModeForView(this._footerView, 'dx-footer', isBestFit);
    if (this._needStretch()) {
      // @ts-expect-error
      $rowsTable.get(0).style.width = isBestFit ? 'auto' : '';
    }
  };
  _proto._toggleContentMinHeight = function _toggleContentMinHeight(value) {
    const scrollable = this._rowsView.getScrollable();
    const $contentElement = this._rowsView._findContentElement();
    if ((scrollable === null || scrollable === void 0 ? void 0 : scrollable.option('useNative')) === false) {
      if (value === true) {
        this._prevContentMinHeight = $contentElement.get(0).style.minHeight;
      }
      if ((0, _type.isDefined)(this._prevContentMinHeight)) {
        $contentElement.css({
          minHeight: value ? _m_utils.default.getContentHeightLimit(_browser.default) : this._prevContentMinHeight
        });
      }
    }
  };
  _proto._synchronizeColumns = function _synchronizeColumns() {
    const columnsController = this._columnsController;
    const visibleColumns = columnsController.getVisibleColumns();
    const columnAutoWidth = this.option('columnAutoWidth');
    const wordWrapEnabled = this.option('wordWrapEnabled');
    const hasUndefinedColumnWidth = visibleColumns.some(column => !(0, _type.isDefined)(column.width));
    let needBestFit = this._needBestFit();
    let hasMinWidth = false;
    let resetBestFitMode;
    let isColumnWidthsCorrected = false;
    let resultWidths = [];
    let focusedElement;
    let selectionRange;
    const normalizeWidthsByExpandColumns = function () {
      let expandColumnWidth;
      (0, _iterator.each)(visibleColumns, (index, column) => {
        if (column.type === 'groupExpand') {
          expandColumnWidth = resultWidths[index];
        }
      });
      (0, _iterator.each)(visibleColumns, (index, column) => {
        if (column.type === 'groupExpand' && expandColumnWidth) {
          resultWidths[index] = expandColumnWidth;
        }
      });
    };
    !needBestFit && (0, _iterator.each)(visibleColumns, (index, column) => {
      if (column.width === 'auto') {
        needBestFit = true;
        return false;
      }
      return undefined;
    });
    (0, _iterator.each)(visibleColumns, (index, column) => {
      if (column.minWidth) {
        hasMinWidth = true;
        return false;
      }
      return undefined;
    });
    this._setVisibleWidths(visibleColumns, []);
    const $element = this.component.$element();
    if (needBestFit) {
      // @ts-expect-error
      focusedElement = _dom_adapter.default.getActiveElement($element.get(0));
      selectionRange = _m_utils.default.getSelectionRange(focusedElement);
      this._toggleBestFitMode(true);
      resetBestFitMode = true;
    }
    this._toggleContentMinHeight(wordWrapEnabled); // T1047239
    // @ts-expect-error
    if ($element && $element.get(0) && this._maxWidth) {
      delete this._maxWidth;
      $element[0].style.maxWidth = '';
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (0, _common.deferUpdate)(() => {
      if (needBestFit) {
        resultWidths = this._getBestFitWidths();
        (0, _iterator.each)(visibleColumns, (index, column) => {
          const columnId = columnsController.getColumnId(column);
          columnsController.columnOption(columnId, 'bestFitWidth', resultWidths[index], true);
        });
      } else if (hasMinWidth) {
        resultWidths = this._getBestFitWidths();
      }
      (0, _iterator.each)(visibleColumns, function (index) {
        const {
          width
        } = this;
        if (width !== 'auto') {
          if ((0, _type.isDefined)(width)) {
            resultWidths[index] = (0, _type.isNumeric)(width) || isPixelWidth(width) ? parseFloat(width) : width;
          } else if (!columnAutoWidth) {
            resultWidths[index] = undefined;
          }
        }
      });
      if (resetBestFitMode) {
        this._toggleBestFitMode(false);
        resetBestFitMode = false;
        if (focusedElement && focusedElement !== _dom_adapter.default.getActiveElement()) {
          const isFocusOutsideWindow = (0, _position.getBoundingRect)(focusedElement).bottom < 0;
          if (!isFocusOutsideWindow) {
            restoreFocus(focusedElement, selectionRange);
          }
        }
      }
      isColumnWidthsCorrected = this._correctColumnWidths(resultWidths, visibleColumns);
      if (columnAutoWidth) {
        normalizeWidthsByExpandColumns();
        if (this._needStretch()) {
          this._processStretch(resultWidths, visibleColumns);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (0, _common.deferRender)(() => {
        if (needBestFit || isColumnWidthsCorrected || hasUndefinedColumnWidth) {
          this._setVisibleWidths(visibleColumns, resultWidths);
        }
        if (wordWrapEnabled) {
          this._toggleContentMinHeight(false);
        }
      });
    });
  }
  /**
   * @extended: adaptivity
   */;
  _proto._needBestFit = function _needBestFit() {
    return this.option('columnAutoWidth');
  }
  /**
   * @extended: adaptivity
   */;
  _proto._needStretch = function _needStretch() {
    return this._columnsController.getVisibleColumns().some(c => c.width === 'auto' && !c.command);
  };
  _proto._getAverageColumnsWidth = function _getAverageColumnsWidth(resultWidths) {
    const freeWidth = calculateFreeWidth(this, resultWidths);
    const columnCountWithoutWidth = resultWidths.filter(width => width === undefined).length;
    return freeWidth / columnCountWithoutWidth;
  }
  /**
   * @extended: adaptivity
   */;
  _proto._correctColumnWidths = function _correctColumnWidths(resultWidths, visibleColumns) {
    const that = this;
    let i;
    let hasPercentWidth = false;
    let hasAutoWidth = false;
    let isColumnWidthsCorrected = false;
    const $element = that.component.$element();
    const hasWidth = that._hasWidth;
    for (i = 0; i < visibleColumns.length; i++) {
      const index = i;
      const column = visibleColumns[index];
      const isHiddenColumn = resultWidths[index] === HIDDEN_COLUMNS_WIDTH;
      let width = resultWidths[index];
      const {
        minWidth
      } = column;
      if (minWidth) {
        if (width === undefined) {
          const averageColumnsWidth = that._getAverageColumnsWidth(resultWidths);
          width = averageColumnsWidth;
        } else if (isPercentWidth(width)) {
          const freeWidth = calculateFreeWidthWithCurrentMinWidth(that, index, minWidth, resultWidths);
          if (freeWidth < 0) {
            width = -1;
          }
        }
      }
      const realColumnWidth = that._getRealColumnWidth(index, resultWidths.map((columnWidth, columnIndex) => index === columnIndex ? width : columnWidth));
      if (minWidth && !isHiddenColumn && realColumnWidth < minWidth) {
        resultWidths[index] = minWidth;
        isColumnWidthsCorrected = true;
        i = -1;
      }
      if (!(0, _type.isDefined)(column.width)) {
        hasAutoWidth = true;
      }
      if (isPercentWidth(column.width)) {
        hasPercentWidth = true;
      }
    }
    if (!hasAutoWidth && resultWidths.length) {
      const $rowsViewElement = that._rowsView.element();
      const contentWidth = that._rowsView.contentWidth();
      const scrollbarWidth = that._rowsView.getScrollbarWidth();
      const totalWidth = that._getTotalWidth(resultWidths, contentWidth);
      if (totalWidth < contentWidth) {
        const lastColumnIndex = _m_utils.default.getLastResizableColumnIndex(visibleColumns, resultWidths);
        if (lastColumnIndex >= 0) {
          resultWidths[lastColumnIndex] = 'auto';
          isColumnWidthsCorrected = true;
          if (hasWidth === false && !hasPercentWidth) {
            const borderWidth = that.option('showBorders') ? Math.ceil((0, _size.getOuterWidth)($rowsViewElement) - (0, _size.getInnerWidth)($rowsViewElement)) : 0;
            that._maxWidth = totalWidth + scrollbarWidth + borderWidth;
            // @ts-expect-error
            $element.css('maxWidth', that._maxWidth);
          }
        }
      }
    }
    return isColumnWidthsCorrected;
  };
  _proto._processStretch = function _processStretch(resultSizes, visibleColumns) {
    const groupSize = this._rowsView.contentWidth();
    const tableSize = this._getTotalWidth(resultSizes, groupSize);
    const unusedIndexes = {
      length: 0
    };
    if (!resultSizes.length) return;
    (0, _iterator.each)(visibleColumns, function (index) {
      if (this.width || resultSizes[index] === HIDDEN_COLUMNS_WIDTH) {
        unusedIndexes[index] = true;
        unusedIndexes.length++;
      }
    });
    const diff = groupSize - tableSize;
    const diffElement = Math.floor(diff / (resultSizes.length - unusedIndexes.length));
    let onePixelElementsCount = diff - diffElement * (resultSizes.length - unusedIndexes.length);
    if (diff >= 0) {
      for (let i = 0; i < resultSizes.length; i++) {
        if (unusedIndexes[i]) {
          continue;
        }
        resultSizes[i] += diffElement;
        if (onePixelElementsCount > 0) {
          if (onePixelElementsCount < 1) {
            resultSizes[i] += onePixelElementsCount;
            onePixelElementsCount = 0;
          } else {
            resultSizes[i]++;
            onePixelElementsCount--;
          }
        }
      }
    }
  };
  _proto._getRealColumnWidth = function _getRealColumnWidth(columnIndex, columnWidths, groupWidth) {
    let ratio = 1;
    const width = columnWidths[columnIndex];
    if (!isPercentWidth(width)) {
      return parseFloat(width);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const percentTotalWidth = columnWidths.reduce((sum, width, index) => {
      if (!isPercentWidth(width)) {
        return sum;
      }
      return sum + parseFloat(width);
    }, 0);
    const pixelTotalWidth = columnWidths.reduce((sum, width) => {
      if (!width || width === HIDDEN_COLUMNS_WIDTH || isPercentWidth(width)) {
        return sum;
      }
      return sum + parseFloat(width);
    }, 0);
    groupWidth = groupWidth || this._rowsView.contentWidth();
    const freeSpace = groupWidth - pixelTotalWidth;
    const percentTotalWidthInPixel = percentTotalWidth * groupWidth / 100;
    if (pixelTotalWidth > 0 && percentTotalWidthInPixel + pixelTotalWidth >= groupWidth) {
      ratio = percentTotalWidthInPixel > freeSpace ? freeSpace / percentTotalWidthInPixel : 1;
    }
    return parseFloat(width) * groupWidth * ratio / 100;
  };
  _proto._getTotalWidth = function _getTotalWidth(widths, groupWidth) {
    let result = 0;
    for (let i = 0; i < widths.length; i++) {
      const width = widths[i];
      if (width && width !== HIDDEN_COLUMNS_WIDTH) {
        result += this._getRealColumnWidth(i, widths, groupWidth);
      }
    }
    return Math.ceil(result);
  };
  _proto._getGroupElement = function _getGroupElement() {
    // @ts-expect-error
    return this.component.$element().children().get(0);
  };
  _proto.updateSize = function updateSize(rootElement) {
    const that = this;
    const $rootElement = (0, _renderer.default)(rootElement);
    const importantMarginClass = that.addWidgetPrefix(IMPORTANT_MARGIN_CLASS);
    if (that._hasHeight === undefined && $rootElement && $rootElement.is(':visible') && (0, _size.getWidth)($rootElement)) {
      const $groupElement = $rootElement.children(".".concat(that.getWidgetContainerClass()));
      if ($groupElement.length) {
        $groupElement.detach();
      }
      that._hasHeight = !!(0, _size.getHeight)($rootElement);
      const width = (0, _size.getWidth)($rootElement);
      $rootElement.addClass(importantMarginClass);
      that._hasWidth = (0, _size.getWidth)($rootElement) === width;
      $rootElement.removeClass(importantMarginClass);
      if ($groupElement.length) {
        $groupElement.appendTo($rootElement);
      }
    }
  };
  _proto.publicMethods = function publicMethods() {
    return ['resize', 'updateDimensions'];
  };
  _proto._waitAsyncTemplates = function _waitAsyncTemplates() {
    var _a, _b, _c;
    return (0, _deferred.when)((_a = this._columnHeadersView) === null || _a === void 0 ? void 0 : _a.waitAsyncTemplates(true), (_b = this._rowsView) === null || _b === void 0 ? void 0 : _b.waitAsyncTemplates(true), (_c = this._footerView) === null || _c === void 0 ? void 0 : _c.waitAsyncTemplates(true));
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto.resize = function resize() {
    if (this.component._requireResize) {
      return;
    }
    // @ts-expect-error
    const d = new _deferred.Deferred();
    this._waitAsyncTemplates().done(() => {
      (0, _deferred.when)(this.updateDimensions()).done(d.resolve).fail(d.reject);
    }).fail(d.reject);
    return d.promise();
  };
  _proto.updateDimensions = function updateDimensions(checkSize) {
    const that = this;
    that._initPostRenderHandlers();
    // T335767
    if (!that._checkSize(checkSize)) {
      return;
    }
    const prevResult = that._resizeDeferred;
    // @ts-expect-error
    const result = that._resizeDeferred = new _deferred.Deferred();
    (0, _deferred.when)(prevResult).always(() => {
      (0, _common.deferRender)(() => {
        if (that._dataController.isLoaded()) {
          that._synchronizeColumns();
        }
        // IE11
        that._resetGroupElementHeight();
        (0, _common.deferUpdate)(() => {
          (0, _common.deferRender)(() => {
            (0, _common.deferUpdate)(() => {
              that._updateDimensionsCore();
            });
          });
        });
        // @ts-expect-error
      }).done(result.resolve).fail(result.reject);
    });
    return result.promise();
  };
  _proto._resetGroupElementHeight = function _resetGroupElementHeight() {
    const groupElement = this._getGroupElement();
    const scrollable = this._rowsView.getScrollable();
    if (groupElement && groupElement.style.height && (!scrollable || !scrollable.scrollTop())) {
      groupElement.style.height = '';
    }
  };
  _proto._checkSize = function _checkSize(checkSize) {
    const $rootElement = this.component.$element();
    // @ts-expect-error
    const isWidgetVisible = $rootElement.is(':visible');
    const isGridSizeChanged = this._lastWidth !== (0, _size.getWidth)($rootElement) || this._lastHeight !== (0, _size.getHeight)($rootElement) || this._devicePixelRatio !== (0, _window.getWindow)().devicePixelRatio;
    return isWidgetVisible && (!checkSize || isGridSizeChanged);
  };
  _proto._setScrollerSpacingCore = function _setScrollerSpacingCore() {
    const that = this;
    const vScrollbarWidth = that._rowsView.getScrollbarWidth();
    const hScrollbarWidth = that._rowsView.getScrollbarWidth(true);
    (0, _common.deferRender)(() => {
      that._columnHeadersView && that._columnHeadersView.setScrollerSpacing(vScrollbarWidth);
      that._footerView && that._footerView.setScrollerSpacing(vScrollbarWidth);
      that._rowsView.setScrollerSpacing(vScrollbarWidth, hScrollbarWidth);
    });
  };
  _proto._setScrollerSpacing = function _setScrollerSpacing() {
    const scrollable = this._rowsView.getScrollable();
    // T722415, T758955
    const isNativeScrolling = this.option('scrolling.useNative') === true;
    if (!scrollable || isNativeScrolling) {
      (0, _common.deferRender)(() => {
        (0, _common.deferUpdate)(() => {
          this._setScrollerSpacingCore();
        });
      });
    } else {
      this._setScrollerSpacingCore();
    }
  }
  /**
   * @extended: column_fixing
   */;
  _proto._setAriaOwns = function _setAriaOwns() {
    var _a, _b, _c;
    const headerTable = (_a = this._columnHeadersView) === null || _a === void 0 ? void 0 : _a.getTableElement();
    const footerTable = (_b = this._footerView) === null || _b === void 0 ? void 0 : _b.getTableElement();
    // @ts-expect-error
    (_c = this._rowsView) === null || _c === void 0 ? void 0 : _c.setAriaOwns(headerTable === null || headerTable === void 0 ? void 0 : headerTable.attr('id'), footerTable === null || footerTable === void 0 ? void 0 : footerTable.attr('id'));
  }
  /**
   * @extended: header_panel
   */;
  _proto._updateDimensionsCore = function _updateDimensionsCore() {
    var _a;
    const that = this;
    const dataController = that._dataController;
    const rowsView = that._rowsView;
    const $rootElement = that.component.$element();
    const groupElement = this._getGroupElement();
    const rootElementHeight = (0, _size.getHeight)($rootElement);
    // @ts-expect-error
    const height = (_a = that.option('height')) !== null && _a !== void 0 ? _a : $rootElement.get(0).style.height;
    const isHeightSpecified = !!height && height !== 'auto';
    // @ts-expect-error
    // eslint-disable-next-line radix
    const maxHeight = parseInt($rootElement.css('maxHeight'));
    const maxHeightHappened = maxHeight && rootElementHeight >= maxHeight;
    const isMaxHeightApplied = groupElement && groupElement.scrollHeight === groupElement.offsetHeight;
    that.updateSize($rootElement);
    (0, _common.deferRender)(() => {
      const hasHeight = that._hasHeight || !!maxHeight || isHeightSpecified;
      rowsView.hasHeight(hasHeight);
      this._setAriaOwns();
      // IE11
      if (maxHeightHappened && !isMaxHeightApplied) {
        (0, _renderer.default)(groupElement).css('height', maxHeight);
      }
      if (!dataController.isLoaded()) {
        rowsView.setLoading(dataController.isLoading());
        return;
      }
      (0, _common.deferUpdate)(() => {
        that._updateLastSizes($rootElement);
        that._setScrollerSpacing();
        (0, _iterator.each)(VIEW_NAMES, (index, viewName) => {
          // TODO getView
          // @ts-expect-error
          const view = that.getView(viewName);
          if (view) {
            view.resize();
          }
        });
        this._editorFactoryController && this._editorFactoryController.resize();
      });
    });
  };
  _proto._updateLastSizes = function _updateLastSizes($rootElement) {
    this._lastWidth = (0, _size.getWidth)($rootElement);
    this._lastHeight = (0, _size.getHeight)($rootElement);
    this._devicePixelRatio = (0, _window.getWindow)().devicePixelRatio;
  };
  _proto.optionChanged = function optionChanged(args) {
    switch (args.name) {
      case 'width':
      case 'height':
        this.component._renderDimensions();
        this.resize();
      /* falls through */
      case 'renderAsync':
        args.handled = true;
        return;
      default:
        _modules$ViewControll.prototype.optionChanged.call(this, args);
    }
  };
  return ResizingController;
}(_m_modules.default.ViewController);
let SynchronizeScrollingController = exports.SynchronizeScrollingController = /*#__PURE__*/function (_modules$ViewControll2) {
  _inheritsLoose(SynchronizeScrollingController, _modules$ViewControll2);
  function SynchronizeScrollingController() {
    return _modules$ViewControll2.apply(this, arguments) || this;
  }
  var _proto2 = SynchronizeScrollingController.prototype;
  _proto2._scrollChangedHandler = function _scrollChangedHandler(views, pos, viewName) {
    for (let j = 0; j < views.length; j++) {
      if (views[j] && views[j].name !== viewName) {
        views[j].scrollTo({
          left: pos.left,
          top: pos.top
        });
      }
    }
  };
  _proto2.init = function init() {
    const views = [this.getView('columnHeadersView'), this.getView('footerView'), this.getView('rowsView')];
    for (let i = 0; i < views.length; i++) {
      const view = views[i];
      if (view) {
        view.scrollChanged.add(this._scrollChangedHandler.bind(this, views));
      }
    }
  };
  return SynchronizeScrollingController;
}(_m_modules.default.ViewController);
let GridView = exports.GridView = /*#__PURE__*/function (_modules$View) {
  _inheritsLoose(GridView, _modules$View);
  function GridView() {
    return _modules$View.apply(this, arguments) || this;
  }
  var _proto3 = GridView.prototype;
  _proto3._endUpdateCore = function _endUpdateCore() {
    if (this.component._requireResize) {
      this.component._requireResize = false;
      this._resizingController.resize();
    }
  };
  _proto3.init = function init() {
    const that = this;
    that._resizingController = that.getController('resizing');
    that._dataController = that.getController('data');
  };
  _proto3.getView = function getView(name) {
    return this.component._views[name];
  };
  _proto3.element = function element() {
    return this._groupElement;
  };
  _proto3.optionChanged = function optionChanged(args) {
    const that = this;
    if ((0, _type.isDefined)(that._groupElement) && args.name === 'showBorders') {
      that._groupElement.toggleClass(that.addWidgetPrefix(BORDERS_CLASS), !!args.value);
      args.handled = true;
    } else {
      _modules$View.prototype.optionChanged.call(this, args);
    }
  };
  _proto3._renderViews = function _renderViews($groupElement) {
    const that = this;
    (0, _iterator.each)(VIEW_NAMES, (index, viewName) => {
      // TODO getView
      const view = that.getView(viewName);
      if (view) {
        view.render($groupElement);
      }
    });
  };
  _proto3._getTableRoleName = function _getTableRoleName() {
    return 'group';
  };
  _proto3.render = function render($rootElement) {
    const isFirstRender = !this._groupElement;
    const $groupElement = this._groupElement || (0, _renderer.default)('<div>').addClass(this.getWidgetContainerClass());
    $groupElement.addClass(GRIDBASE_CONTAINER_CLASS);
    $groupElement.toggleClass(this.addWidgetPrefix(BORDERS_CLASS), !!this.option('showBorders'));
    this.setAria('role', 'presentation', $rootElement);
    this.component.setAria('role', this._getTableRoleName(), $groupElement);
    this._rootElement = $rootElement || this._rootElement;
    if (isFirstRender) {
      this._groupElement = $groupElement;
      (0, _window.hasWindow)() && this._resizingController.updateSize($rootElement);
      $groupElement.appendTo($rootElement);
    }
    this._renderViews($groupElement);
  };
  _proto3.update = function update() {
    const that = this;
    const $rootElement = that._rootElement;
    const $groupElement = that._groupElement;
    if ($rootElement && $groupElement) {
      this._resizingController.resize();
      if (that._dataController.isLoaded()) {
        that._resizingController.fireContentReadyAction();
      }
    }
  };
  return GridView;
}(_m_modules.default.View);
const gridViewModule = exports.gridViewModule = {
  defaultOptions() {
    return {
      showBorders: false,
      renderAsync: false
    };
  },
  controllers: {
    resizing: ResizingController,
    synchronizeScrolling: SynchronizeScrollingController
  },
  views: {
    gridView: GridView
  },
  VIEW_NAMES
};
