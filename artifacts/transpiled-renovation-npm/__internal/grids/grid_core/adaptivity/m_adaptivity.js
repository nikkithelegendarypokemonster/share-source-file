"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adaptivityModule = exports.AdaptiveColumnsController = void 0;
var _guid = _interopRequireDefault(require("../../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _dom = require("../../../../core/utils/dom");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _click = require("../../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _remove = require("../../../../events/remove");
var _index = require("../../../../events/utils/index");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _form = _interopRequireDefault(require("../../../../ui/form"));
var _themes = require("../../../../ui/themes");
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable @typescript-eslint/method-signature-style */ /* eslint-disable max-classes-per-file */
const COLUMN_HEADERS_VIEW = 'columnHeadersView';
const ROWS_VIEW = 'rowsView';
const FOOTER_VIEW = 'footerView';
const COLUMN_VIEWS = [COLUMN_HEADERS_VIEW, ROWS_VIEW, FOOTER_VIEW];
const ADAPTIVE_NAMESPACE = 'dxDataGridAdaptivity';
const HIDDEN_COLUMNS_WIDTH = 'adaptiveHidden';
const ADAPTIVE_ROW_TYPE = 'detailAdaptive';
const FORM_ITEM_CONTENT_CLASS = 'dx-field-item-content';
const FORM_ITEM_MODIFIED = 'dx-item-modified';
const HIDDEN_COLUMN_CLASS = 'hidden-column';
const ADAPTIVE_COLUMN_BUTTON_CLASS = 'adaptive-more';
const ADAPTIVE_COLUMN_NAME_CLASS = 'dx-command-adaptive';
const COMMAND_ADAPTIVE_HIDDEN_CLASS = 'dx-command-adaptive-hidden';
const ADAPTIVE_DETAIL_ROW_CLASS = 'dx-adaptive-detail-row';
const ADAPTIVE_ITEM_TEXT_CLASS = 'dx-adaptive-item-text';
const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const LAST_DATA_CELL_CLASS = 'dx-last-data-cell';
const ADAPTIVE_COLUMN_NAME = 'adaptive';
const EDIT_MODE_BATCH = 'batch';
const EDIT_MODE_ROW = 'row';
const EDIT_MODE_FORM = 'form';
const EDIT_MODE_POPUP = 'popup';
const REVERT_TOOLTIP_CLASS = 'revert-tooltip';
const GROUP_CELL_CLASS = 'dx-group-cell';
const GROUP_ROW_CLASS = 'dx-group-row';
const EXPAND_ARIA_NAME = 'dxDataGrid-ariaAdaptiveExpand';
const COLLAPSE_ARIA_NAME = 'dxDataGrid-ariaAdaptiveCollapse';
const LEGACY_SCROLLING_MODE = 'scrolling.legacyMode';
function getColumnId(that, column) {
  return that._columnsController.getColumnId(column);
}
function getDataCellElements($row) {
  return $row.find('td:not(.dx-datagrid-hidden-column):not([class*=\'dx-command-\'])');
}
function adaptiveCellTemplate(container, options) {
  let $adaptiveColumnButton;
  const $container = (0, _renderer.default)(container);
  // TODO getController
  const adaptiveColumnsController = options.component.getController('adaptiveColumns');
  if (options.rowType === 'data') {
    $adaptiveColumnButton = (0, _renderer.default)('<span>').addClass(adaptiveColumnsController.addWidgetPrefix(ADAPTIVE_COLUMN_BUTTON_CLASS));
    _events_engine.default.on($adaptiveColumnButton, (0, _index.addNamespace)(_click.name, ADAPTIVE_NAMESPACE), adaptiveColumnsController.createAction(() => {
      adaptiveColumnsController.toggleExpandAdaptiveDetailRow(options.key);
    }));
    $adaptiveColumnButton.appendTo($container);
  } else {
    _m_utils.default.setEmptyText($container);
  }
}
function focusCellHandler(e) {
  var _a;
  const $nextCell = (_a = e.data) === null || _a === void 0 ? void 0 : _a.$nextCell;
  _events_engine.default.off($nextCell, 'focus', focusCellHandler);
  // @ts-expect-error
  _events_engine.default.trigger($nextCell, 'dxclick');
}
let AdaptiveColumnsController = exports.AdaptiveColumnsController = /*#__PURE__*/function (_modules$ViewControll) {
  _inheritsLoose(AdaptiveColumnsController, _modules$ViewControll);
  function AdaptiveColumnsController() {
    return _modules$ViewControll.apply(this, arguments) || this;
  }
  var _proto = AdaptiveColumnsController.prototype;
  _proto.init = function init() {
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');
    this._editingController = this.getController('editing');
    this._keyboardNavigationController = this.getController('keyboardNavigation');
    this._rowsView = this.getView('rowsView');
    this._columnsController.addCommandColumn({
      type: ADAPTIVE_COLUMN_NAME,
      command: ADAPTIVE_COLUMN_NAME,
      visible: true,
      adaptiveHidden: true,
      cssClass: ADAPTIVE_COLUMN_NAME_CLASS,
      alignment: 'center',
      width: 'auto',
      cellTemplate: adaptiveCellTemplate,
      fixedPosition: 'right'
    });
    this._columnsController.columnsChanged.add(() => {
      const isAdaptiveVisible = !!this.updateHidingQueue(this._columnsController.getColumns()).length;
      this._columnsController.columnOption('command:adaptive', 'adaptiveHidden', !isAdaptiveVisible, true);
    });
    this._hidingColumnsQueue = [];
    this._hiddenColumns = [];
    this.createAction('onAdaptiveDetailRowPreparing');
    _modules$ViewControll.prototype.init.call(this);
  };
  _proto.optionChanged = function optionChanged(args) {
    if (args.name === 'columnHidingEnabled') {
      this._columnsController.columnOption('command:adaptive', 'adaptiveHidden', !args.value);
    }
    _modules$ViewControll.prototype.optionChanged.call(this, args);
  };
  _proto.publicMethods = function publicMethods() {
    return ['isAdaptiveDetailRowExpanded', 'expandAdaptiveDetailRow', 'collapseAdaptiveDetailRow'];
  };
  _proto._isRowEditMode = function _isRowEditMode() {
    const editMode = this._getEditMode();
    return editMode === EDIT_MODE_ROW;
  };
  _proto._isItemModified = function _isItemModified(item, cellOptions) {
    const columnIndex = this._columnsController.getVisibleIndex(item.column.index);
    const rowIndex = this._dataController.getRowIndexByKey(cellOptions.key);
    const row = this._dataController.items()[rowIndex + 1];
    return row && row.modifiedValues && (0, _type.isDefined)(row.modifiedValues[columnIndex]);
  };
  _proto._renderFormViewTemplate = function _renderFormViewTemplate(item, cellOptions, $container) {
    const that = this;
    const {
      column
    } = item;
    const focusAction = that.createAction(() => {
      if (that._editingController.isEditing()) {
        // @ts-expect-error
        _events_engine.default.trigger($container, _click.name);
      }
    });
    const rowData = cellOptions.row.data;
    const value = column.calculateCellValue(rowData);
    const displayValue = _m_utils.default.getDisplayValue(column, value, rowData, cellOptions.rowType);
    const text = _m_utils.default.formatValue(displayValue, column);
    const isCellOrBatchEditMode = this._editingController.isCellOrBatchEditMode();
    const rowsView = that._rowsView;
    if (column.allowEditing && this._keyboardNavigationController.isKeyboardEnabled()) {
      $container.attr('tabIndex', that.option('tabIndex'));
      if (isCellOrBatchEditMode) {
        _events_engine.default.off($container, 'focus', focusAction);
        _events_engine.default.on($container, 'focus', focusAction);
      }
    }
    if (column.cellTemplate) {
      const templateOptions = (0, _extend.extend)({}, cellOptions, {
        value,
        displayValue,
        text,
        column
      });
      rowsView.renderTemplate($container, column.cellTemplate, templateOptions, (0, _dom.isElementInDom)($container)).done(() => {
        rowsView._cellPrepared($container, cellOptions);
      });
    } else {
      const container = $container.get(0);
      if (column.encodeHtml) {
        container.textContent = text;
      } else {
        container.innerHTML = text;
      }
      $container.addClass(ADAPTIVE_ITEM_TEXT_CLASS);
      if (!(0, _type.isDefined)(text) || text === '') {
        $container.html('&nbsp;');
      }
      if (!that._isRowEditMode()) {
        if (that._isItemModified(item, cellOptions)) {
          $container.addClass(FORM_ITEM_MODIFIED);
        }
      }
      rowsView._cellPrepared($container, cellOptions);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._getTemplate = function _getTemplate(item, cellOptions, updateForm) {
    const that = this;
    const {
      column
    } = item;
    const editingController = this._editingController;
    return function (options, container) {
      const $container = (0, _renderer.default)(container);
      const columnIndex = that._columnsController.getVisibleIndex(column.index);
      const templateOptions = (0, _extend.extend)({}, cellOptions);
      const renderFormTemplate = function () {
        const isItemEdited = that._isItemEdited(item);
        templateOptions.value = cellOptions.row.values[columnIndex];
        if (isItemEdited || column.showEditorAlways) {
          editingController.renderFormEditorTemplate(templateOptions, item, options, $container, !isItemEdited);
        } else {
          templateOptions.column = column;
          templateOptions.columnIndex = columnIndex;
          that._renderFormViewTemplate(item, templateOptions, $container);
        }
      };
      renderFormTemplate();
      if (templateOptions.watch) {
        const dispose = templateOptions.watch(() => ({
          isItemEdited: that._isItemEdited(item),
          value: cellOptions.row.values[columnIndex]
        }), () => {
          // @ts-expect-error
          $container.contents().remove();
          $container.removeClass(ADAPTIVE_ITEM_TEXT_CLASS);
          renderFormTemplate();
        });
        _events_engine.default.on($container, _remove.removeEvent, dispose);
      }
    };
  };
  _proto._isVisibleColumnsValid = function _isVisibleColumnsValid(visibleColumns) {
    const getCommandColumnsCount = function () {
      let result = 0;
      for (let j = 0; j < visibleColumns.length; j++) {
        const visibleColumn = visibleColumns[j];
        if (visibleColumn.command) {
          result++;
        }
      }
      return result;
    };
    if (visibleColumns < 2) {
      return false;
    }
    if (visibleColumns.length - getCommandColumnsCount() <= 1) {
      return false;
    }
    return true;
  };
  _proto._calculatePercentWidths = function _calculatePercentWidths(widths, visibleColumns) {
    const that = this;
    let percentWidths = 0;
    visibleColumns.forEach((item, index) => {
      if (widths[index] !== HIDDEN_COLUMNS_WIDTH) {
        percentWidths += that._getItemPercentWidth(item);
      }
    });
    return percentWidths;
  };
  _proto._isPercentWidth = function _isPercentWidth(width) {
    return (0, _type.isString)(width) && width.endsWith('%');
  };
  _proto._isColumnHidden = function _isColumnHidden(column) {
    return this._hiddenColumns.filter(hiddenColumn => hiddenColumn.index === column.index).length > 0;
  };
  _proto._getAverageColumnsWidth = function _getAverageColumnsWidth(containerWidth, columns, columnsCanFit) {
    const that = this;
    let fixedColumnsWidth = 0;
    let columnsWithoutFixedWidthCount = 0;
    columns.forEach(column => {
      if (!that._isColumnHidden(column)) {
        const {
          width
        } = column;
        if ((0, _type.isDefined)(width) && !isNaN(parseFloat(width))) {
          fixedColumnsWidth += that._isPercentWidth(width) ? that._calculatePercentWidth({
            visibleIndex: column.visibleIndex,
            columnsCount: columns.length,
            columnsCanFit,
            bestFitWidth: column.bestFitWidth,
            columnWidth: width,
            containerWidth
          }) : parseFloat(width);
        } else {
          columnsWithoutFixedWidthCount++;
        }
      }
    });
    return (containerWidth - fixedColumnsWidth) / columnsWithoutFixedWidthCount;
  };
  _proto._calculateColumnWidth = function _calculateColumnWidth(column, containerWidth, contentColumns, columnsCanFit) {
    const columnId = getColumnId(this, column);
    const widthOption = this._columnsController.columnOption(columnId, 'width');
    const bestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');
    const columnsCount = contentColumns.length;
    let colWidth;
    if (widthOption && widthOption !== 'auto') {
      if (this._isPercentWidth(widthOption)) {
        colWidth = this._calculatePercentWidth({
          visibleIndex: column.visibleIndex,
          columnsCount,
          columnsCanFit,
          bestFitWidth,
          columnWidth: widthOption,
          containerWidth
        });
      } else {
        return parseFloat(widthOption);
      }
    } else {
      const columnAutoWidth = this.option('columnAutoWidth');
      colWidth = columnAutoWidth || !!column.command ? bestFitWidth : this._getAverageColumnsWidth(containerWidth, contentColumns, columnsCanFit);
    }
    return colWidth;
  };
  _proto._calculatePercentWidth = function _calculatePercentWidth(options) {
    const columnFitted = options.visibleIndex < options.columnsCount - 1 && options.columnsCanFit;
    const partialWidth = options.containerWidth * parseFloat(options.columnWidth) / 100;
    const resultWidth = options.columnsCanFit && partialWidth < options.bestFitWidth ? options.bestFitWidth : partialWidth;
    return columnFitted ? options.containerWidth * parseFloat(options.columnWidth) / 100 : resultWidth;
  };
  _proto._getNotTruncatedColumnWidth = function _getNotTruncatedColumnWidth(column, containerWidth, contentColumns, columnsCanFit) {
    const columnId = getColumnId(this, column);
    const widthOption = this._columnsController.columnOption(columnId, 'width');
    const bestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');
    if (widthOption && widthOption !== 'auto' && !this._isPercentWidth(widthOption)) {
      return parseFloat(widthOption);
    }
    const colWidth = this._calculateColumnWidth(column, containerWidth, contentColumns, columnsCanFit);
    return colWidth < bestFitWidth ? null : colWidth;
  };
  _proto._getItemPercentWidth = function _getItemPercentWidth(item) {
    let result = 0;
    if (item.width && this._isPercentWidth(item.width)) {
      result = parseFloat(item.width);
    }
    return result;
  };
  _proto._getCommandColumnsWidth = function _getCommandColumnsWidth() {
    const that = this;
    const columns = that._columnsController.getVisibleColumns();
    let colWidth = 0;
    (0, _iterator.each)(columns, (index, column) => {
      if (column.index < 0 || column.command) {
        colWidth += that._columnsController.columnOption(getColumnId(that, column), 'bestFitWidth') || 0;
      }
    });
    return colWidth;
  };
  _proto._isItemEdited = function _isItemEdited(item) {
    if (this.isFormOrPopupEditMode()) {
      return false;
    }
    if (this._isRowEditMode()) {
      const editRowKey = this.option('editing.editRowKey');
      // @ts-expect-error
      if ((0, _common.equalByValue)(editRowKey, this._dataController.adaptiveExpandedKey())) {
        return true;
      }
    } else {
      // @ts-expect-error
      const rowIndex = this._dataController.getRowIndexByKey(this._dataController.adaptiveExpandedKey()) + 1;
      const columnIndex = this._columnsController.getVisibleIndex(item.column.index);
      return this._editingController.isEditCell(rowIndex, columnIndex);
    }
    return undefined;
  };
  _proto._getFormItemsByHiddenColumns = function _getFormItemsByHiddenColumns(hiddenColumns) {
    const items = [];
    (0, _iterator.each)(hiddenColumns, (_, column) => {
      items.push({
        column,
        name: column.name,
        dataField: column.dataField,
        visibleIndex: column.visibleIndex
      });
    });
    return items;
  };
  _proto._getAdaptiveColumnVisibleIndex = function _getAdaptiveColumnVisibleIndex(visibleColumns) {
    for (let i = 0; i < visibleColumns.length; i++) {
      const column = visibleColumns[i];
      if (column.command === ADAPTIVE_COLUMN_NAME) {
        return i;
      }
    }
    return undefined;
  };
  _proto._hideAdaptiveColumn = function _hideAdaptiveColumn(resultWidths, visibleColumns) {
    const visibleIndex = this._getAdaptiveColumnVisibleIndex(visibleColumns);
    if ((0, _type.isDefined)(visibleIndex)) {
      resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;
      this._hideVisibleColumn({
        isCommandColumn: true,
        visibleIndex
      });
    }
  }
  /**
   * @extended: keyboard_navigation
   */;
  _proto._showHiddenCellsInView = function _showHiddenCellsInView(_ref) {
    let {
      $cells,
      isCommandColumn
    } = _ref;
    let cssClassNameToRemove = this.addWidgetPrefix(HIDDEN_COLUMN_CLASS);
    if (isCommandColumn) {
      cssClassNameToRemove = COMMAND_ADAPTIVE_HIDDEN_CLASS;
      $cells.attr({
        tabIndex: 0,
        'aria-hidden': null
      }).removeClass(cssClassNameToRemove);
    } else {
      $cells.removeClass(cssClassNameToRemove);
    }
  };
  _proto._showHiddenColumns = function _showHiddenColumns() {
    for (let i = 0; i < COLUMN_VIEWS.length; i++) {
      // TODO getView
      // @ts-expect-error
      const view = this.getView(COLUMN_VIEWS[i]);
      if (view && view.isVisible() && view.element()) {
        const viewName = view.name;
        const $hiddenCommandCells = view.element().find(".".concat(COMMAND_ADAPTIVE_HIDDEN_CLASS));
        this._showHiddenCellsInView({
          viewName,
          $cells: $hiddenCommandCells,
          isCommandColumn: true
        });
        const $hiddenCells = view.element().find(".".concat(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS)));
        this._showHiddenCellsInView({
          viewName,
          $cells: $hiddenCells
        });
      }
    }
  };
  _proto._isCellValid = function _isCellValid($cell) {
    return $cell && $cell.length && !$cell.hasClass(MASTER_DETAIL_CELL_CLASS) && !$cell.hasClass(GROUP_CELL_CLASS);
  };
  _proto._hideVisibleColumn = function _hideVisibleColumn(_ref2) {
    let {
      isCommandColumn,
      visibleIndex
    } = _ref2;
    const that = this;
    COLUMN_VIEWS.forEach(viewName => {
      // TODO: getView
      // @ts-expect-error
      const view = that.getView(viewName);
      view && that._hideVisibleColumnInView({
        view,
        isCommandColumn,
        visibleIndex
      });
    });
  };
  _proto._hideVisibleColumnInView = function _hideVisibleColumnInView(_ref3) {
    let {
      view,
      isCommandColumn,
      visibleIndex
    } = _ref3;
    const viewName = view.name;
    let $cellElement;
    const column = this._columnsController.getVisibleColumns()[visibleIndex];
    const editFormRowIndex = this._editingController && this._editingController.getEditFormRowIndex();
    if (view && view.isVisible() && column) {
      const rowsCount = view.getRowsCount();
      const $rowElements = view._getRowElements();
      for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        const cancelClassAdding = rowIndex === editFormRowIndex && viewName === ROWS_VIEW && this.option('editing.mode') !== 'popup';
        if (!cancelClassAdding) {
          const currentVisibleIndex = viewName === COLUMN_HEADERS_VIEW ? this._columnsController.getVisibleIndex(column.index, rowIndex) : visibleIndex;
          if (currentVisibleIndex >= 0) {
            const $rowElement = $rowElements.eq(rowIndex);
            $cellElement = this._findCellElementInRow($rowElement, currentVisibleIndex);
            this._isCellValid($cellElement) && this._hideVisibleCellInView({
              viewName,
              isCommandColumn,
              $cell: $cellElement
            });
          }
        }
      }
    }
  };
  _proto._findCellElementInRow = function _findCellElementInRow($rowElement, visibleColumnIndex) {
    const $rowCells = $rowElement.children();
    let visibleIndex = visibleColumnIndex;
    let cellIsInsideGroup = false;
    if ($rowElement.hasClass(GROUP_ROW_CLASS)) {
      const $groupCell = $rowElement.find(".".concat(GROUP_CELL_CLASS));
      const colSpan = $groupCell.attr('colspan');
      if ($groupCell.length && (0, _type.isDefined)(colSpan)) {
        // eslint-disable-next-line radix
        const groupCellLength = parseInt(colSpan);
        const endGroupIndex = $groupCell.index() + groupCellLength - 1;
        if (visibleColumnIndex > endGroupIndex) {
          visibleIndex = visibleColumnIndex - groupCellLength + 1;
        } else {
          cellIsInsideGroup = true;
        }
      }
    }
    const $cellElement = !cellIsInsideGroup ? $rowCells.eq(visibleIndex) : undefined;
    return $cellElement;
  }
  /**
   * @extended: keyboard_navigation
   */;
  _proto._hideVisibleCellInView = function _hideVisibleCellInView(_ref4) {
    let {
      $cell,
      isCommandColumn
    } = _ref4;
    const cssClassNameToAdd = isCommandColumn ? COMMAND_ADAPTIVE_HIDDEN_CLASS : this.addWidgetPrefix(HIDDEN_COLUMN_CLASS);
    $cell.attr({
      tabIndex: -1,
      'aria-hidden': true
    }).addClass(cssClassNameToAdd);
  };
  _proto._getEditMode = function _getEditMode() {
    return this._editingController.getEditMode();
  };
  _proto.isFormOrPopupEditMode = function isFormOrPopupEditMode() {
    const editMode = this._getEditMode();
    return editMode === EDIT_MODE_FORM || editMode === EDIT_MODE_POPUP;
  };
  _proto.hideRedundantColumns = function hideRedundantColumns(resultWidths, visibleColumns, hiddenQueue) {
    const that = this;
    this._hiddenColumns = [];
    if (that._isVisibleColumnsValid(visibleColumns) && hiddenQueue.length) {
      let totalWidth = 0;
      const $rootElement = that.component.$element();
      let rootElementWidth = (0, _size.getWidth)($rootElement) - that._getCommandColumnsWidth();
      const getVisibleContentColumns = function () {
        return visibleColumns.filter(item => !item.command && this._hiddenColumns.filter(i => i.index === item.index).length === 0);
      }.bind(this);
      let visibleContentColumns = getVisibleContentColumns();
      const contentColumnsCount = visibleContentColumns.length;
      let i;
      let hasHiddenColumns;
      let needHideColumn;
      do {
        needHideColumn = false;
        totalWidth = 0;
        const percentWidths = that._calculatePercentWidths(resultWidths, visibleColumns);
        const columnsCanFit = percentWidths < 100 && percentWidths !== 0;
        for (i = 0; i < visibleColumns.length; i++) {
          const visibleColumn = visibleColumns[i];
          let columnWidth = that._getNotTruncatedColumnWidth(visibleColumn, rootElementWidth, visibleContentColumns, columnsCanFit);
          const columnId = getColumnId(that, visibleColumn);
          const widthOption = that._columnsController.columnOption(columnId, 'width');
          const minWidth = that._columnsController.columnOption(columnId, 'minWidth');
          const columnBestFitWidth = that._columnsController.columnOption(columnId, 'bestFitWidth');
          if (resultWidths[i] === HIDDEN_COLUMNS_WIDTH) {
            hasHiddenColumns = true;
            continue;
          }
          if (!columnWidth && !visibleColumn.command && !visibleColumn.fixed) {
            needHideColumn = true;
            break;
          }
          if (!widthOption || widthOption === 'auto') {
            columnWidth = Math.max(columnBestFitWidth || 0, minWidth || 0);
          }
          if (visibleColumn.command !== ADAPTIVE_COLUMN_NAME || hasHiddenColumns) {
            totalWidth += columnWidth;
          }
        }
        needHideColumn = needHideColumn || totalWidth > (0, _size.getWidth)($rootElement);
        if (needHideColumn) {
          const column = hiddenQueue.pop();
          const visibleIndex = that._columnsController.getVisibleIndex(column.index);
          rootElementWidth += that._calculateColumnWidth(column, rootElementWidth, visibleContentColumns, columnsCanFit);
          that._hideVisibleColumn({
            visibleIndex
          });
          resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;
          this._hiddenColumns.push(column);
          visibleContentColumns = getVisibleContentColumns();
        }
      } while (needHideColumn && visibleContentColumns.length > 1 && hiddenQueue.length);
      if (contentColumnsCount === visibleContentColumns.length) {
        that._hideAdaptiveColumn(resultWidths, visibleColumns);
      }
    } else {
      that._hideAdaptiveColumn(resultWidths, visibleColumns);
    }
  };
  _proto.getAdaptiveDetailItems = function getAdaptiveDetailItems() {
    return this._$itemContents;
  };
  _proto.getItemContentByColumnIndex = function getItemContentByColumnIndex(visibleColumnIndex) {
    let $itemContent;
    for (let i = 0; i < this._$itemContents.length; i++) {
      $itemContent = this._$itemContents.eq(i);
      const item = $itemContent.data('dx-form-item');
      if (item && item.column && this._columnsController.getVisibleIndex(item.column.index) === visibleColumnIndex) {
        return $itemContent;
      }
    }
  };
  _proto.toggleExpandAdaptiveDetailRow = function toggleExpandAdaptiveDetailRow(key, alwaysExpanded) {
    if (!(this.isFormOrPopupEditMode() && this._editingController.isEditing())) {
      // @ts-expect-error
      this._dataController.toggleExpandAdaptiveDetailRow(key, alwaysExpanded);
    }
  };
  _proto.createFormByHiddenColumns = function createFormByHiddenColumns(container, options) {
    const that = this;
    const $container = (0, _renderer.default)(container);
    const userFormOptions = {
      items: that._getFormItemsByHiddenColumns(that._hiddenColumns),
      formID: "dx-".concat(new _guid.default())
    };
    // @ts-expect-error
    const defaultFormOptions = (0, _themes.isMaterial)() ? {
      colCount: 2
    } : {};
    this.executeAction('onAdaptiveDetailRowPreparing', {
      formOptions: userFormOptions
    });
    that._$itemContents = null;
    that._form = that._createComponent((0, _renderer.default)('<div>').appendTo($container), _form.default, (0, _extend.extend)(defaultFormOptions, userFormOptions, {
      customizeItem(item) {
        const column = item.column || that._columnsController.columnOption(item.name || item.dataField);
        if (column) {
          item.label = item.label || {};
          item.label.text = item.label.text || column.caption;
          item.column = column;
          item.template = that._getTemplate(item, options, that.updateForm.bind(that));
        }
        userFormOptions.customizeItem && userFormOptions.customizeItem.call(this, item);
      },
      onContentReady(e) {
        userFormOptions.onContentReady && userFormOptions.onContentReady.call(this, e);
        that._$itemContents = $container.find(".".concat(FORM_ITEM_CONTENT_CLASS));
      }
    }));
  };
  _proto.hasAdaptiveDetailRowExpanded = function hasAdaptiveDetailRowExpanded() {
    // @ts-expect-error
    return (0, _type.isDefined)(this._dataController.adaptiveExpandedKey());
  };
  _proto.updateForm = function updateForm(hiddenColumns) {
    if (this.hasAdaptiveDetailRowExpanded()) {
      if (this._form && (0, _type.isDefined)(this._form._contentReadyAction)) {
        if (hiddenColumns && hiddenColumns.length) {
          this._form.option('items', this._getFormItemsByHiddenColumns(hiddenColumns));
        } else {
          this._form.repaint();
        }
      }
    }
  };
  _proto.updateHidingQueue = function updateHidingQueue(columns) {
    const that = this;
    const hideableColumns = columns.filter(column => column.visible && !column.type && !column.fixed && !((0, _type.isDefined)(column.groupIndex) && column.groupIndex >= 0));
    let columnsHasHidingPriority;
    let i;
    that._hidingColumnsQueue = [];
    if (that.option('allowColumnResizing') && that.option('columnResizingMode') === 'widget') {
      return that._hidingColumnsQueue;
    }
    for (i = 0; i < hideableColumns.length; i++) {
      if ((0, _type.isDefined)(hideableColumns[i].hidingPriority) && hideableColumns[i].hidingPriority >= 0) {
        columnsHasHidingPriority = true;
        that._hidingColumnsQueue[hideableColumns[i].hidingPriority] = hideableColumns[i];
      }
    }
    if (columnsHasHidingPriority) {
      that._hidingColumnsQueue.reverse();
    } else if (that.option('columnHidingEnabled')) {
      for (i = 0; i < hideableColumns.length; i++) {
        const visibleIndex = that._columnsController.getVisibleIndex(hideableColumns[i].index);
        that._hidingColumnsQueue[visibleIndex] = hideableColumns[i];
      }
    }
    that._hidingColumnsQueue = that._hidingColumnsQueue.filter(Object);
    return that._hidingColumnsQueue;
  };
  _proto.getHiddenColumns = function getHiddenColumns() {
    return this._hiddenColumns;
  };
  _proto.hasHiddenColumns = function hasHiddenColumns() {
    return this._hiddenColumns.length > 0;
  };
  _proto.getHidingColumnsQueue = function getHidingColumnsQueue() {
    return this._hidingColumnsQueue;
  };
  _proto.isAdaptiveDetailRowExpanded = function isAdaptiveDetailRowExpanded(key) {
    const dataController = this._dataController;
    // @ts-expect-error
    return dataController.adaptiveExpandedKey() && (0, _common.equalByValue)(dataController.adaptiveExpandedKey(), key);
  };
  _proto.expandAdaptiveDetailRow = function expandAdaptiveDetailRow(key) {
    if (!this.hasAdaptiveDetailRowExpanded()) {
      this.toggleExpandAdaptiveDetailRow(key);
    }
  };
  _proto.collapseAdaptiveDetailRow = function collapseAdaptiveDetailRow() {
    if (this.hasAdaptiveDetailRowExpanded()) {
      this.toggleExpandAdaptiveDetailRow();
    }
  };
  _proto.updateCommandAdaptiveAriaLabel = function updateCommandAdaptiveAriaLabel(key, label) {
    const rowIndex = this._dataController.getRowIndexByKey(key);
    if (rowIndex === -1) {
      return;
    }
    // @ts-expect-errors
    const $row = (0, _renderer.default)(this.component.getRowElement(rowIndex));
    this.setCommandAdaptiveAriaLabel($row, label);
  };
  _proto.setCommandAdaptiveAriaLabel = function setCommandAdaptiveAriaLabel($row, labelName) {
    const $adaptiveCommand = $row.find('.dx-command-adaptive');
    $adaptiveCommand.attr('aria-label', _message.default.format(labelName));
  };
  return AdaptiveColumnsController;
}(_m_modules.default.ViewController);
const keyboardNavigation = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(AdaptivityKeyboardNavigationExtender, _Base);
  function AdaptivityKeyboardNavigationExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto2 = AdaptivityKeyboardNavigationExtender.prototype;
  _proto2._isCellValid = function _isCellValid($cell, isClick) {
    return _Base.prototype._isCellValid.call(this, $cell, isClick) && !$cell.hasClass(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS)) && !$cell.hasClass(COMMAND_ADAPTIVE_HIDDEN_CLASS);
  };
  _proto2._processNextCellInMasterDetail = function _processNextCellInMasterDetail($nextCell, $cell) {
    _Base.prototype._processNextCellInMasterDetail.call(this, $nextCell, $cell);
    const isCellOrBatchMode = this._editingController.isCellOrBatchEditMode();
    const isEditing = this._editingController.isEditing();
    if (isEditing && $nextCell && isCellOrBatchMode && !this._isInsideEditForm($nextCell)) {
      _events_engine.default.off($nextCell, 'focus', focusCellHandler);
      _events_engine.default.on($nextCell, 'focus', {
        $nextCell
      }, focusCellHandler);
      // @ts-expect-error
      _events_engine.default.trigger($cell, 'focus');
    }
  };
  _proto2._isCellElement = function _isCellElement($cell) {
    return _Base.prototype._isCellElement.call(this, $cell) || $cell.hasClass(ADAPTIVE_ITEM_TEXT_CLASS);
  };
  return AdaptivityKeyboardNavigationExtender;
}(Base);
const rowsView = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(AdaptivityRowsViewExtender, _Base2);
  function AdaptivityRowsViewExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto3 = AdaptivityRowsViewExtender.prototype;
  _proto3._getCellTemplate = function _getCellTemplate(options) {
    const that = this;
    const {
      column
    } = options;
    if (options.rowType === ADAPTIVE_ROW_TYPE && column.command === 'detail') {
      return function (container, options) {
        that._adaptiveColumnsController.createFormByHiddenColumns((0, _renderer.default)(container), options);
      };
    }
    return _Base2.prototype._getCellTemplate.call(this, options);
  };
  _proto3._createRow = function _createRow(row) {
    const $row = _Base2.prototype._createRow.apply(this, arguments);
    // @ts-expect-error
    if (row && row.rowType === ADAPTIVE_ROW_TYPE && row.key === this._dataController.adaptiveExpandedKey()) {
      $row.addClass(ADAPTIVE_DETAIL_ROW_CLASS);
    }
    return $row;
  };
  _proto3._renderCells = function _renderCells($row, options) {
    _Base2.prototype._renderCells.call(this, $row, options);
    const adaptiveColumnsController = this._adaptiveColumnsController;
    const hidingColumnsQueueLength = adaptiveColumnsController.getHidingColumnsQueue().length;
    const hiddenColumnsLength = adaptiveColumnsController.getHiddenColumns().length;
    if (hidingColumnsQueueLength && !hiddenColumnsLength) {
      getDataCellElements($row).last().addClass(LAST_DATA_CELL_CLASS);
    }
    if (options.row.rowType === 'data') {
      adaptiveColumnsController.setCommandAdaptiveAriaLabel($row, EXPAND_ARIA_NAME);
    }
  };
  _proto3._getColumnIndexByElementCore = function _getColumnIndexByElementCore($element) {
    const $itemContent = $element.closest(".".concat(FORM_ITEM_CONTENT_CLASS));
    if ($itemContent.length && $itemContent.closest(this.component.$element()).length) {
      const formItem = $itemContent.length ? $itemContent.first().data('dx-form-item') : null;
      return formItem && formItem.column && this._columnsController.getVisibleIndex(formItem.column.index);
    }
    // @ts-expect-error
    return _Base2.prototype._getColumnIndexByElementCore.call(this, $element);
  };
  _proto3._cellPrepared = function _cellPrepared($cell, options) {
    _Base2.prototype._cellPrepared.apply(this, arguments);
    if (options.row.rowType !== ADAPTIVE_ROW_TYPE && options.column.visibleWidth === HIDDEN_COLUMNS_WIDTH) {
      $cell.addClass(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS));
    }
  };
  _proto3.getCell = function getCell(cellPosition, rows) {
    const item = this._dataController.items()[cellPosition === null || cellPosition === void 0 ? void 0 : cellPosition.rowIndex];
    if ((item === null || item === void 0 ? void 0 : item.rowType) === ADAPTIVE_ROW_TYPE) {
      const $adaptiveDetailItems = this._adaptiveColumnsController.getAdaptiveDetailItems();
      return _Base2.prototype.getCell.call(this, cellPosition, rows, $adaptiveDetailItems);
    }
    return _Base2.prototype.getCell.apply(this, arguments);
  };
  _proto3._getCellElement = function _getCellElement(rowIndex, columnIdentifier) {
    const item = this._dataController.items()[rowIndex];
    if (item && item.rowType === ADAPTIVE_ROW_TYPE) {
      return this._adaptiveColumnsController.getItemContentByColumnIndex(columnIdentifier);
    }
    return _Base2.prototype._getCellElement.apply(this, arguments);
  };
  _proto3.getContextMenuItems = function getContextMenuItems(options) {
    var _a;
    if (options.row && options.row.rowType === 'detailAdaptive') {
      const view = this._columnHeadersView;
      // @ts-expect-error
      const formItem = (0, _renderer.default)(options.targetElement).closest('.dx-field-item-label').next().data('dx-form-item');
      // @ts-expect-error
      options.column = formItem ? formItem.column : options.column;
      return view.getContextMenuItems && view.getContextMenuItems(options);
    }
    // @ts-expect-error
    return (_a = _Base2.prototype.getContextMenuItems) === null || _a === void 0 ? void 0 : _a.call(this, options);
  };
  _proto3.isClickableElement = function isClickableElement($target) {
    var _a, _b;
    // @ts-expect-error
    const isClickable = (_b = (_a = _Base2.prototype.isClickableElement) === null || _a === void 0 ? void 0 : _a.call(this, $target)) !== null && _b !== void 0 ? _b : false;
    return isClickable || !!$target.closest(".".concat(ADAPTIVE_COLUMN_NAME_CLASS)).length;
  };
  return AdaptivityRowsViewExtender;
}(Base);
const exportExtender = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(AdaptivityExportExtender, _Base3);
  function AdaptivityExportExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto4 = AdaptivityExportExtender.prototype;
  _proto4._updateColumnWidth = function _updateColumnWidth(column, width) {
    _Base3.prototype._updateColumnWidth.call(this, column, column.visibleWidth === HIDDEN_COLUMNS_WIDTH ? column.bestFitWidth : width);
  };
  return AdaptivityExportExtender;
}(Base);
const columnsResizer = Base => /*#__PURE__*/function (_Base4) {
  _inheritsLoose(AdaptivityColumnsResizerExtender, _Base4);
  function AdaptivityColumnsResizerExtender() {
    return _Base4.apply(this, arguments) || this;
  }
  var _proto5 = AdaptivityColumnsResizerExtender.prototype;
  _proto5._pointCreated = function _pointCreated(point, cellsLength, columns) {
    const result = _Base4.prototype._pointCreated.call(this, point, cellsLength, columns);
    const currentColumn = columns[point.columnIndex] || {};
    const nextColumnIndex = this._getNextColumnIndex(point.columnIndex);
    const nextColumn = columns[nextColumnIndex] || {};
    const hasHiddenColumnsOnly = nextColumnIndex !== point.columnIndex + 1 && nextColumn.command;
    const hasAdaptiveHiddenWidth = currentColumn.visibleWidth === HIDDEN_COLUMNS_WIDTH || hasHiddenColumnsOnly;
    return result || hasAdaptiveHiddenWidth;
  };
  _proto5._getNextColumnIndex = function _getNextColumnIndex(currentColumnIndex) {
    const visibleColumns = this._columnsController.getVisibleColumns();
    let index = _Base4.prototype._getNextColumnIndex.call(this, currentColumnIndex);
    while (visibleColumns[index] && visibleColumns[index].visibleWidth === HIDDEN_COLUMNS_WIDTH) {
      index++;
    }
    return index;
  };
  return AdaptivityColumnsResizerExtender;
}(Base);
const draggingHeader = Base => /*#__PURE__*/function (_Base5) {
  _inheritsLoose(AdaptivityDraggingHeaderExtender, _Base5);
  function AdaptivityDraggingHeaderExtender() {
    return _Base5.apply(this, arguments) || this;
  }
  var _proto6 = AdaptivityDraggingHeaderExtender.prototype;
  _proto6._pointCreated = function _pointCreated(point, columns, location, sourceColumn) {
    const result = _Base5.prototype._pointCreated.call(this, point, columns, location, sourceColumn);
    const column = columns[point.columnIndex - 1] || {};
    const hasAdaptiveHiddenWidth = column.visibleWidth === HIDDEN_COLUMNS_WIDTH;
    return result || hasAdaptiveHiddenWidth;
  };
  return AdaptivityDraggingHeaderExtender;
}(Base);
const editing = Base => /*#__PURE__*/function (_Base6) {
  _inheritsLoose(AdaptivityEditingExtender, _Base6);
  function AdaptivityEditingExtender() {
    return _Base6.apply(this, arguments) || this;
  }
  var _proto7 = AdaptivityEditingExtender.prototype;
  _proto7._isRowEditMode = function _isRowEditMode() {
    return this.getEditMode() === EDIT_MODE_ROW;
  };
  _proto7._getFormEditItemTemplate = function _getFormEditItemTemplate(cellOptions, column) {
    if (this.getEditMode() !== EDIT_MODE_ROW && cellOptions.rowType === 'detailAdaptive') {
      cellOptions.columnIndex = this._columnsController.getVisibleIndex(column.index);
      return this.getColumnTemplate(cellOptions);
    }
    return _Base6.prototype._getFormEditItemTemplate.call(this, cellOptions, column);
  };
  _proto7._closeEditItem = function _closeEditItem($targetElement) {
    const $itemContents = $targetElement.closest(".".concat(FORM_ITEM_CONTENT_CLASS));
    // @ts-expect-error
    const rowIndex = this._dataController.getRowIndexByKey(this._dataController.adaptiveExpandedKey()) + 1;
    const formItem = $itemContents.length ? $itemContents.first().data('dx-form-item') : null;
    const columnIndex = formItem && formItem.column && this._columnsController.getVisibleIndex(formItem.column.index);
    if (!this.isEditCell(rowIndex, columnIndex)) {
      _Base6.prototype._closeEditItem.call(this, $targetElement);
    }
  };
  _proto7._beforeUpdateItems = function _beforeUpdateItems(rowIndices, rowIndex) {
    if (!this._adaptiveColumnsController.isFormOrPopupEditMode() && this._adaptiveColumnsController.hasHiddenColumns()) {
      const items = this._dataController.items();
      const item = items[rowIndex];
      // @ts-expect-error
      const oldExpandRowIndex = _m_utils.default.getIndexByKey(this._dataController.adaptiveExpandedKey(), items);
      this._isForceRowAdaptiveExpand = !this._adaptiveColumnsController.hasAdaptiveDetailRowExpanded();
      if (oldExpandRowIndex >= 0) {
        rowIndices.push(oldExpandRowIndex + 1);
      }
      rowIndices.push(rowIndex + 1);
      // @ts-expect-error
      this._dataController.adaptiveExpandedKey(item.key);
    }
  };
  _proto7._afterInsertRow = function _afterInsertRow(key) {
    _Base6.prototype._afterInsertRow.apply(this, arguments);
    if (this._adaptiveColumnsController.hasHiddenColumns()) {
      // @ts-expect-error
      this._adaptiveColumnsController.toggleExpandAdaptiveDetailRow(key, this.isRowEditMode());
      this._isForceRowAdaptiveExpand = true;
    }
  };
  _proto7._collapseAdaptiveDetailRow = function _collapseAdaptiveDetailRow() {
    if (this._isRowEditMode() && this._isForceRowAdaptiveExpand) {
      this._adaptiveColumnsController.collapseAdaptiveDetailRow();
      this._isForceRowAdaptiveExpand = false;
    }
  };
  _proto7._cancelEditAdaptiveDetailRow = function _cancelEditAdaptiveDetailRow() {
    if (this._adaptiveColumnsController.hasHiddenColumns()) {
      this._collapseAdaptiveDetailRow();
    }
  };
  _proto7._afterSaveEditData = function _afterSaveEditData() {
    _Base6.prototype._afterSaveEditData.apply(this, arguments);
    // @ts-expect-error
    const deferred = new _deferred.Deferred();
    if (this._isRowEditMode() && this._adaptiveColumnsController.hasHiddenColumns()) {
      (0, _deferred.when)(this._validatingController.validate(true)).done(isValid => {
        if (isValid) {
          this._cancelEditAdaptiveDetailRow();
        }
        deferred.resolve();
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise();
  };
  _proto7._beforeCancelEditData = function _beforeCancelEditData() {
    _Base6.prototype._beforeCancelEditData.call(this);
    this._cancelEditAdaptiveDetailRow();
  };
  _proto7._getRowIndicesForCascadeUpdating = function _getRowIndicesForCascadeUpdating(row) {
    const rowIndices = _Base6.prototype._getRowIndicesForCascadeUpdating.apply(this, arguments);
    if (this._adaptiveColumnsController.isAdaptiveDetailRowExpanded(row.key)) {
      rowIndices.push(row.rowType === ADAPTIVE_ROW_TYPE ? row.rowIndex - 1 : row.rowIndex + 1);
    }
    return rowIndices;
  };
  _proto7._beforeCloseEditCellInBatchMode = function _beforeCloseEditCellInBatchMode(rowIndices) {
    // @ts-expect-error
    const expandedKey = this._dataController._adaptiveExpandedKey;
    if (expandedKey) {
      const rowIndex = _m_utils.default.getIndexByKey(expandedKey, this._dataController.items());
      if (rowIndex > -1) {
        rowIndices.unshift(rowIndex);
      }
    }
  };
  _proto7.editRow = function editRow(rowIndex) {
    if (this._adaptiveColumnsController.isFormOrPopupEditMode()) {
      this._adaptiveColumnsController.collapseAdaptiveDetailRow();
    }
    return _Base6.prototype.editRow.call(this, rowIndex);
  };
  _proto7.deleteRow = function deleteRow(rowIndex) {
    const rowKey = this._dataController.getKeyByRowIndex(rowIndex);
    if (this.getEditMode() === EDIT_MODE_BATCH && this._adaptiveColumnsController.isAdaptiveDetailRowExpanded(rowKey)) {
      this._adaptiveColumnsController.collapseAdaptiveDetailRow();
    }
    _Base6.prototype.deleteRow.call(this, rowIndex);
  };
  return AdaptivityEditingExtender;
}(Base);
const data = Base => /*#__PURE__*/function (_Base7) {
  _inheritsLoose(AdaptivityDataControllerExtender, _Base7);
  function AdaptivityDataControllerExtender() {
    return _Base7.apply(this, arguments) || this;
  }
  var _proto8 = AdaptivityDataControllerExtender.prototype;
  _proto8.init = function init() {
    _Base7.prototype.init.call(this);
    this._adaptiveExpandedKey = undefined;
  };
  _proto8._processItems = function _processItems(items, change) {
    const {
      changeType
    } = change;
    items = _Base7.prototype._processItems.apply(this, arguments);
    if (changeType === 'loadingAll' || !(0, _type.isDefined)(this._adaptiveExpandedKey)) {
      return items;
    }
    const expandRowIndex = _m_utils.default.getIndexByKey(this._adaptiveExpandedKey, items);
    const newMode = this.option(LEGACY_SCROLLING_MODE) === false;
    if (expandRowIndex >= 0) {
      const item = items[expandRowIndex];
      items.splice(expandRowIndex + 1, 0, {
        visible: true,
        rowType: ADAPTIVE_ROW_TYPE,
        key: item.key,
        data: item.data,
        node: item.node,
        modifiedValues: item.modifiedValues,
        isNewRow: item.isNewRow,
        values: item.values
      });
    } else if (changeType === 'refresh' && !(newMode && change.repaintChangesOnly)) {
      this._adaptiveExpandedKey = undefined;
    }
    return items;
  };
  _proto8._getRowIndicesForExpand = function _getRowIndicesForExpand(key) {
    // @ts-expect-error
    const rowIndices = _Base7.prototype._getRowIndicesForExpand.apply(this, arguments);
    if (this._adaptiveColumnsController.isAdaptiveDetailRowExpanded(key)) {
      const lastRowIndex = rowIndices[rowIndices.length - 1];
      rowIndices.push(lastRowIndex + 1);
    }
    return rowIndices;
  };
  _proto8.adaptiveExpandedKey = function adaptiveExpandedKey(value) {
    if ((0, _type.isDefined)(value)) {
      this._adaptiveExpandedKey = value;
    } else {
      return this._adaptiveExpandedKey;
    }
  };
  _proto8.toggleExpandAdaptiveDetailRow = function toggleExpandAdaptiveDetailRow(key, alwaysExpanded) {
    const that = this;
    let oldExpandLoadedRowIndex = _m_utils.default.getIndexByKey(that._adaptiveExpandedKey, that._items);
    let newExpandLoadedRowIndex = _m_utils.default.getIndexByKey(key, that._items);
    if (oldExpandLoadedRowIndex >= 0 && oldExpandLoadedRowIndex === newExpandLoadedRowIndex && !alwaysExpanded) {
      key = undefined;
      newExpandLoadedRowIndex = -1;
    }
    const oldKey = that._adaptiveExpandedKey;
    that._adaptiveExpandedKey = key;
    if (oldExpandLoadedRowIndex >= 0) {
      oldExpandLoadedRowIndex++;
    }
    if (newExpandLoadedRowIndex >= 0) {
      newExpandLoadedRowIndex++;
    }
    const rowIndexDelta = that.getRowIndexDelta();
    that.updateItems({
      allowInvisibleRowIndices: true,
      changeType: 'update',
      rowIndices: [oldExpandLoadedRowIndex - rowIndexDelta, newExpandLoadedRowIndex - rowIndexDelta]
    });
    this._adaptiveColumnsController.updateCommandAdaptiveAriaLabel(key, COLLAPSE_ARIA_NAME);
    this._adaptiveColumnsController.updateCommandAdaptiveAriaLabel(oldKey, EXPAND_ARIA_NAME);
  };
  return AdaptivityDataControllerExtender;
}(Base);
const editorFactory = Base => /*#__PURE__*/function (_Base8) {
  _inheritsLoose(AdaptivityEditorFactoryExtender, _Base8);
  function AdaptivityEditorFactoryExtender() {
    return _Base8.apply(this, arguments) || this;
  }
  var _proto9 = AdaptivityEditorFactoryExtender.prototype;
  _proto9._needHideBorder = function _needHideBorder($element) {
    return _Base8.prototype._needHideBorder.call(this, $element) || ($element === null || $element === void 0 ? void 0 : $element.hasClass('dx-field-item-content')) && ($element === null || $element === void 0 ? void 0 : $element.find('.dx-checkbox').length);
  };
  _proto9._getFocusCellSelector = function _getFocusCellSelector() {
    return "".concat(_Base8.prototype._getFocusCellSelector.call(this), ", .dx-adaptive-detail-row .dx-field-item > .dx-field-item-content");
  }
  /**
   * Overrides interface
   */;
  _proto9._getRevertTooltipsSelector = function _getRevertTooltipsSelector() {
    return "".concat(_Base8.prototype._getRevertTooltipsSelector.call(this), ", .dx-field-item-content .").concat(this.addWidgetPrefix(REVERT_TOOLTIP_CLASS));
  };
  return AdaptivityEditorFactoryExtender;
}(Base);
const columns = Base => /*#__PURE__*/function (_Base9) {
  _inheritsLoose(AdaptivityColumnsExtender, _Base9);
  function AdaptivityColumnsExtender() {
    return _Base9.apply(this, arguments) || this;
  }
  var _proto10 = AdaptivityColumnsExtender.prototype;
  _proto10._isColumnVisible = function _isColumnVisible(column) {
    return _Base9.prototype._isColumnVisible.call(this, column) && !column.adaptiveHidden;
  };
  return AdaptivityColumnsExtender;
}(Base);
const resizing = Base => /*#__PURE__*/function (_Base10) {
  _inheritsLoose(AdaptivityResizingControllerExtender, _Base10);
  function AdaptivityResizingControllerExtender() {
    return _Base10.apply(this, arguments) || this;
  }
  var _proto11 = AdaptivityResizingControllerExtender.prototype;
  _proto11.dispose = function dispose() {
    _Base10.prototype.dispose.apply(this, arguments);
    clearTimeout(this._updateScrollableTimeoutID);
  };
  _proto11._needBestFit = function _needBestFit() {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return _Base10.prototype._needBestFit.call(this) || !!this._adaptiveColumnsController.getHidingColumnsQueue().length;
  };
  _proto11._correctColumnWidths = function _correctColumnWidths(resultWidths, visibleColumns) {
    const adaptiveController = this._adaptiveColumnsController;
    const oldHiddenColumns = adaptiveController.getHiddenColumns();
    const hidingColumnsQueue = adaptiveController.updateHidingQueue(this._columnsController.getColumns());
    adaptiveController.hideRedundantColumns(resultWidths, visibleColumns, hidingColumnsQueue);
    const hiddenColumns = adaptiveController.getHiddenColumns();
    if (adaptiveController.hasAdaptiveDetailRowExpanded()) {
      if (oldHiddenColumns.length !== hiddenColumns.length) {
        adaptiveController.updateForm(hiddenColumns);
      }
    }
    !hiddenColumns.length && adaptiveController.collapseAdaptiveDetailRow();
    return _Base10.prototype._correctColumnWidths.apply(this, arguments);
  };
  _proto11._toggleBestFitMode = function _toggleBestFitMode(isBestFit) {
    isBestFit && this._adaptiveColumnsController._showHiddenColumns();
    _Base10.prototype._toggleBestFitMode.call(this, isBestFit);
  };
  _proto11._needStretch = function _needStretch() {
    const adaptiveColumnsController = this._adaptiveColumnsController;
    return _Base10.prototype._needStretch.apply(this, arguments) || adaptiveColumnsController.getHidingColumnsQueue().length || adaptiveColumnsController.hasHiddenColumns();
  };
  return AdaptivityResizingControllerExtender;
}(Base);
const adaptivityModule = exports.adaptivityModule = {
  defaultOptions() {
    return {
      columnHidingEnabled: false,
      // @ts-expect-error
      onAdaptiveDetailRowPreparing: null
    };
  },
  controllers: {
    adaptiveColumns: AdaptiveColumnsController
  },
  extenders: {
    views: {
      rowsView
    },
    controllers: {
      export: exportExtender,
      columnsResizer,
      draggingHeader,
      editing,
      resizing,
      data,
      editorFactory,
      columns,
      keyboardNavigation
    }
  }
};