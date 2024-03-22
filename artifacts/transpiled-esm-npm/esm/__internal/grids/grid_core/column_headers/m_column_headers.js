import domAdapter from '../../../../core/dom_adapter';
import $ from '../../../../core/renderer';
import { extend } from '../../../../core/utils/extend';
import { each } from '../../../../core/utils/iterator';
import { getHeight } from '../../../../core/utils/size';
import { isDefined } from '../../../../core/utils/type';
import eventsEngine from '../../../../events/core/events_engine';
import messageLocalization from '../../../../localization/message';
import { registerKeyboardAction } from '../m_accessibility';
import { ColumnsView } from '../views/m_columns_view';
var CELL_CONTENT_CLASS = 'text-content';
var HEADERS_CLASS = 'headers';
var NOWRAP_CLASS = 'nowrap';
var ROW_CLASS_SELECTOR = '.dx-row';
var HEADER_ROW_CLASS = 'dx-header-row';
var COLUMN_LINES_CLASS = 'dx-column-lines';
var CONTEXT_MENU_SORT_ASC_ICON = 'context-menu-sort-asc';
var CONTEXT_MENU_SORT_DESC_ICON = 'context-menu-sort-desc';
var CONTEXT_MENU_SORT_NONE_ICON = 'context-menu-sort-none';
var CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
var VISIBILITY_HIDDEN_CLASS = 'dx-visibility-hidden';
var TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX = 'dx-text-content-alignment-';
var SORT_INDICATOR_CLASS = 'dx-sort-indicator';
var SORT_INDEX_INDICATOR_CLASS = 'dx-sort-index-indicator';
var HEADER_FILTER_CLASS_SELECTOR = '.dx-header-filter';
var HEADER_FILTER_INDICATOR_CLASS = 'dx-header-filter-indicator';
var MULTI_ROW_HEADER_CLASS = 'dx-header-multi-row';
var LINK = 'dx-link';
var createCellContent = function createCellContent(that, $cell, options) {
  var $cellContent = $('<div>').addClass(that.addWidgetPrefix(CELL_CONTENT_CLASS));
  that.setAria('role', 'presentation', $cellContent);
  addCssClassesToCellContent(that, $cell, options.column, $cellContent);
  var showColumnLines = that.option('showColumnLines');
  // TODO getController
  var contentAlignment = that.getController('columns').getHeaderContentAlignment(options.column.alignment);
  return $cellContent[showColumnLines || contentAlignment === 'right' ? 'appendTo' : 'prependTo']($cell);
};
function addCssClassesToCellContent(that, $cell, column, $cellContent) {
  var $indicatorElements = that._getIndicatorElements($cell, true);
  var $visibleIndicatorElements = that._getIndicatorElements($cell);
  var indicatorCount = $indicatorElements && $indicatorElements.length;
  var columnAlignment = that._getColumnAlignment(column.alignment);
  var sortIndicatorClassName = ".".concat(that._getIndicatorClassName('sort'));
  var sortIndexIndicatorClassName = ".".concat(that._getIndicatorClassName('sortIndex'));
  var $sortIndicator = $visibleIndicatorElements.filter(sortIndicatorClassName);
  var $sortIndexIndicator = $visibleIndicatorElements.children().filter(sortIndexIndicatorClassName);
  $cellContent = $cellContent || $cell.children(".".concat(that.addWidgetPrefix(CELL_CONTENT_CLASS)));
  $cellContent.toggleClass(TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX + columnAlignment, indicatorCount > 0).toggleClass(TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX + (columnAlignment === 'left' ? 'right' : 'left'), indicatorCount > 0 && column.alignment === 'center').toggleClass(SORT_INDICATOR_CLASS, !!$sortIndicator.length).toggleClass(SORT_INDEX_INDICATOR_CLASS, !!$sortIndexIndicator.length).toggleClass(HEADER_FILTER_INDICATOR_CLASS, !!$visibleIndicatorElements.filter(".".concat(that._getIndicatorClassName('headerFilter'))).length);
}
export class ColumnHeadersView extends ColumnsView {
  init() {
    super.init();
    this._headerPanelView = this.getView('headerPanel');
    this._headerFilterController = this.getController('headerFilter');
    this._dataController = this.getController('data');
  }
  _createTable() {
    // @ts-expect-error
    var $table = super._createTable.apply(this, arguments);
    eventsEngine.on($table, 'mousedown selectstart', this.createAction(e => {
      var {
        event
      } = e;
      if (event.shiftKey) {
        event.preventDefault();
      }
    }));
    return $table;
  }
  _isLegacyKeyboardNavigation() {
    return this.option('useLegacyKeyboardNavigation');
  }
  _getDefaultTemplate(column) {
    var that = this;
    return function ($container, options) {
      var {
        caption
      } = column;
      var needCellContent = !column.command || caption && column.command !== 'expand';
      if (column.command === 'empty') {
        that._renderEmptyMessage($container, options);
      } else if (needCellContent) {
        var $content = createCellContent(that, $container, options);
        $content.text(caption);
      } else if (column.command) {
        $container.html('&nbsp;');
      }
    };
  }
  _renderEmptyMessage($container, options) {
    var textEmpty = this._getEmptyHeaderText();
    if (!textEmpty) {
      $container.html('&nbsp;');
      return;
    }
    var $cellContent = createCellContent(this, $container, options);
    var needSplit = textEmpty.includes('{0}');
    if (needSplit) {
      var [leftPart, rightPart] = textEmpty.split('{0}');
      var columnChooserTitle = messageLocalization.format('dxDataGrid-emptyHeaderColumnChooserText');
      var columnChooserView = this._columnChooserView;
      var $link = $('<a>').text(columnChooserTitle).addClass(LINK);
      eventsEngine.on($link, 'click', this.createAction(() => columnChooserView.showColumnChooser()));
      $cellContent
      // @ts-expect-error
      .append(domAdapter.createTextNode(leftPart)).append($link)
      // @ts-expect-error
      .append(domAdapter.createTextNode(rightPart));
    } else {
      $cellContent.text(textEmpty);
    }
  }
  _getEmptyHeaderText() {
    var hasHiddenColumns = !!this._columnChooserView.hasHiddenColumns();
    var hasGroupedColumns = !!this._headerPanelView.hasGroupedColumns();
    switch (true) {
      case hasHiddenColumns && hasGroupedColumns:
        return messageLocalization.format('dxDataGrid-emptyHeaderWithColumnChooserAndGroupPanelText');
      case hasGroupedColumns:
        return messageLocalization.format('dxDataGrid-emptyHeaderWithGroupPanelText');
      case hasHiddenColumns:
        return messageLocalization.format('dxDataGrid-emptyHeaderWithColumnChooserText');
      default:
        return '';
    }
  }
  _getHeaderTemplate(column) {
    return column.headerCellTemplate || {
      allowRenderToDetachedContainer: true,
      render: this._getDefaultTemplate(column)
    };
  }
  _processTemplate(template, options) {
    var that = this;
    var resultTemplate;
    var {
      column
    } = options;
    var renderingTemplate = super._processTemplate(template);
    if (options.rowType === 'header' && renderingTemplate && column.headerCellTemplate && !column.command) {
      resultTemplate = {
        render(options) {
          var $content = createCellContent(that, options.container, options.model);
          renderingTemplate.render(extend({}, options, {
            container: $content
          }));
        }
      };
    } else {
      resultTemplate = renderingTemplate;
    }
    return resultTemplate;
  }
  /**
   * @extended: filter_row, selection
   */
  _handleDataChanged(e) {
    if (e.changeType !== 'refresh') return;
    if (this._isGroupingChanged || this._requireReady) {
      this._isGroupingChanged = false;
      this.render();
    }
  }
  _renderCell($row, options) {
    var $cell = super._renderCell($row, options);
    if (options.row.rowType === 'header') {
      $cell.addClass(CELL_FOCUS_DISABLED_CLASS);
      if (!this._isLegacyKeyboardNavigation()) {
        if (options.column && !options.column.type) {
          $cell.attr('tabindex', this.option('tabindex') || 0);
        }
      }
    }
    return $cell;
  }
  _setCellAriaAttributes($cell, cellOptions) {
    super._setCellAriaAttributes($cell, cellOptions);
    if (cellOptions.rowType === 'header') {
      if (!cellOptions.column.type) {
        this.setAria('role', 'columnheader', $cell);
      }
      if (cellOptions.column && !cellOptions.column.command && !cellOptions.column.isBand) {
        $cell.attr('id', cellOptions.column.headerId);
        this.setAria('label', "".concat(messageLocalization.format('dxDataGrid-ariaColumn'), " ").concat(cellOptions.column.caption), $cell);
      }
    }
  }
  /**
   * @extended: filter_row
   */
  _createRow(row) {
    // @ts-expect-error
    var $row = super._createRow.apply(this, arguments);
    $row.toggleClass(COLUMN_LINES_CLASS, this.option('showColumnLines'));
    if (row.rowType === 'header') {
      $row.addClass(HEADER_ROW_CLASS);
      if (!this._isLegacyKeyboardNavigation()) {
        registerKeyboardAction('columnHeaders', this, $row, 'td', this._handleActionKeyDown.bind(this));
      }
    }
    return $row;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _processHeaderAction(event, $row) {}
  _handleActionKeyDown(args) {
    var {
      event
    } = args;
    var $target = $(event.target);
    this._lastActionElement = event.target;
    if ($target.is(HEADER_FILTER_CLASS_SELECTOR)) {
      var headerFilterController = this._headerFilterController;
      var $column = $target.closest('td');
      var columnIndex = this.getColumnIndexByElement($column);
      if (columnIndex >= 0) {
        headerFilterController.showHeaderFilterMenu(columnIndex, false);
      }
    } else {
      var $row = $target.closest(ROW_CLASS_SELECTOR);
      this._processHeaderAction(event, $row);
    }
    event.preventDefault();
  }
  /**
   * @extended: filter_row, virtual_column
   */
  _renderCore() {
    var that = this;
    var $container = that.element();
    var change = {};
    if (that._tableElement && !that._dataController.isLoaded() && !that._hasRowElements) {
      return;
    }
    $container.addClass(that.addWidgetPrefix(HEADERS_CLASS)).toggleClass(that.addWidgetPrefix(NOWRAP_CLASS), !that.option('wordWrapEnabled')).empty();
    that.setAria('role', 'presentation', $container);
    var deferred = that._updateContent(that._renderTable({
      change
    }), change);
    if (that.getRowCount() > 1) {
      $container.addClass(MULTI_ROW_HEADER_CLASS);
    }
    // @ts-expect-error
    super._renderCore.apply(that, arguments);
    return deferred;
  }
  _renderRows() {
    var that = this;
    if (that._dataController.isLoaded() || that._hasRowElements) {
      // @ts-expect-error
      super._renderRows.apply(that, arguments);
      that._hasRowElements = true;
    }
  }
  _renderRow($table, options) {
    var rowIndex = this.getRowCount() === 1 ? null : options.row.rowIndex;
    options.columns = this.getColumns(rowIndex);
    super._renderRow($table, options);
  }
  _createCell(options) {
    var {
      column
    } = options;
    // @ts-expect-error
    var $cellElement = super._createCell.apply(this, arguments);
    column.rowspan > 1 && options.rowType === 'header' && $cellElement.attr('rowSpan', column.rowspan);
    return $cellElement;
  }
  /**
   * @extended: filter_row
   */
  _getRows() {
    var result = [];
    var rowCount = this.getRowCount();
    if (this.option('showColumnHeaders')) {
      for (var i = 0; i < rowCount; i++) {
        result.push({
          rowType: 'header',
          rowIndex: i
        });
      }
    }
    return result;
  }
  _getCellTemplate(options) {
    if (options.rowType === 'header') {
      return this._getHeaderTemplate(options.column);
    }
  }
  /**
   * @extended: filter_row, header_filter
   */
  _columnOptionChanged(e) {
    var {
      changeTypes
    } = e;
    var {
      optionNames
    } = e;
    if (changeTypes.grouping || changeTypes.groupExpanding) {
      if (changeTypes.grouping) {
        this._isGroupingChanged = true;
      }
      return;
    }
    super._columnOptionChanged(e);
    if (optionNames.width || optionNames.visible) {
      this.resizeCompleted.fire();
    }
  }
  /**
   * @extended: filter_row
   */
  _isElementVisible(elementOptions) {
    return elementOptions && elementOptions.visible;
  }
  _alignCaptionByCenter($cell) {
    var $indicatorsContainer = this._getIndicatorContainer($cell, true);
    if ($indicatorsContainer && $indicatorsContainer.length) {
      $indicatorsContainer.filter(".".concat(VISIBILITY_HIDDEN_CLASS)).remove();
      $indicatorsContainer = this._getIndicatorContainer($cell);
      $indicatorsContainer.clone().addClass(VISIBILITY_HIDDEN_CLASS).css('float', '').insertBefore($cell.children(".".concat(this.addWidgetPrefix(CELL_CONTENT_CLASS))));
    }
  }
  _updateCell($cell, options) {
    if (options.rowType === 'header' && options.column.alignment === 'center') {
      this._alignCaptionByCenter($cell);
    }
    // @ts-expect-error
    super._updateCell.apply(this, arguments);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updateIndicator($cell, column, indicatorName) {
    // @ts-expect-error
    var $indicatorElement = super._updateIndicator.apply(this, arguments);
    if (column.alignment === 'center') {
      this._alignCaptionByCenter($cell);
    }
    addCssClassesToCellContent(this, $cell, column);
    return $indicatorElement;
  }
  _getIndicatorContainer($cell, returnAll) {
    var $indicatorsContainer = super._getIndicatorContainer($cell);
    return returnAll ? $indicatorsContainer : $indicatorsContainer.filter(":not(.".concat(VISIBILITY_HIDDEN_CLASS, ")"));
  }
  /**
   * @extended: tree_list/selection
   */
  // eslint-disable-next-line
  _isSortableElement($target) {
    return true;
  }
  getHeadersRowHeight() {
    var $tableElement = this.getTableElement();
    var $headerRows = $tableElement && $tableElement.find(".".concat(HEADER_ROW_CLASS));
    return $headerRows && $headerRows.toArray().reduce((sum, headerRow) => sum + getHeight(headerRow), 0) || 0;
  }
  getHeaderElement(index) {
    var columnElements = this.getColumnElements();
    return columnElements && columnElements.eq(index);
  }
  getColumnElements(index, bandColumnIndex) {
    var that = this;
    var $cellElement;
    var columnsController = that._columnsController;
    var rowCount = that.getRowCount();
    if (that.option('showColumnHeaders')) {
      if (rowCount > 1 && (!isDefined(index) || isDefined(bandColumnIndex))) {
        var result = [];
        var visibleColumns = isDefined(bandColumnIndex) ? columnsController.getChildrenByBandColumn(bandColumnIndex, true) : columnsController.getVisibleColumns();
        each(visibleColumns, (_, column) => {
          var rowIndex = isDefined(index) ? index : columnsController.getRowIndex(column.index);
          $cellElement = that._getCellElement(rowIndex, columnsController.getVisibleIndex(column.index, rowIndex));
          $cellElement && result.push($cellElement.get(0));
        });
        // @ts-expect-error
        return $(result);
      }
      if (!index || index < rowCount) {
        return that.getCellElements(index || 0);
      }
    }
    return undefined;
  }
  getColumnIndexByElement($cell) {
    var cellIndex = this.getCellIndex($cell);
    var $row = $cell.closest('.dx-row');
    var {
      rowIndex
    } = $row[0];
    var column = this.getColumns(rowIndex)[cellIndex];
    return column ? column.index : -1;
  }
  getVisibleColumnIndex(columnIndex, rowIndex) {
    var column = this.getColumns()[columnIndex];
    return column ? this._columnsController.getVisibleIndex(column.index, rowIndex) : -1;
  }
  /**
   * @extended: column_fixing
   */
  getColumnWidths() {
    var $columnElements = this.getColumnElements();
    if ($columnElements && $columnElements.length) {
      return this._getWidths($columnElements);
    }
    // @ts-expect-error
    return super.getColumnWidths.apply(this, arguments);
  }
  /**
   * @extended: column_chooser
   */
  allowDragging(column) {
    var _a;
    var rowIndex = column && this._columnsController.getRowIndex(column.index);
    var columns = this.getColumns(rowIndex);
    var isReorderingEnabled = (_a = this.option('allowColumnReordering')) !== null && _a !== void 0 ? _a : this._columnsController.isColumnOptionUsed('allowReordering');
    return isReorderingEnabled && column.allowReordering && columns.length > 1;
  }
  getBoundingRect() {
    var that = this;
    var $columnElements = that.getColumnElements();
    if ($columnElements && $columnElements.length) {
      var offset = that.getTableElement().offset();
      return {
        top: offset.top
      };
    }
    return null;
  }
  getName() {
    return 'headers';
  }
  getColumnCount() {
    var $columnElements = this.getColumnElements();
    return $columnElements ? $columnElements.length : 0;
  }
  /**
   * @extended: filter_row
   */
  isVisible() {
    return this.option('showColumnHeaders');
  }
  optionChanged(args) {
    var that = this;
    switch (args.name) {
      case 'showColumnHeaders':
      case 'wordWrapEnabled':
      case 'showColumnLines':
        that._invalidate(true, true);
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
  getHeight() {
    return this.getElementHeight();
  }
  /**
   * @extended: column_fixing
   */
  getContextMenuItems(options) {
    var that = this;
    var {
      column
    } = options;
    if (options.row && (options.row.rowType === 'header' || options.row.rowType === 'detailAdaptive')) {
      var sortingOptions = that.option('sorting');
      if (sortingOptions && sortingOptions.mode !== 'none' && column && column.allowSorting) {
        var onItemClick = function onItemClick(params) {
          setTimeout(() => {
            that._columnsController.changeSortOrder(column.index, params.itemData.value);
          });
        };
        return [{
          text: sortingOptions.ascendingText,
          value: 'asc',
          disabled: column.sortOrder === 'asc',
          icon: CONTEXT_MENU_SORT_ASC_ICON,
          onItemClick
        }, {
          text: sortingOptions.descendingText,
          value: 'desc',
          disabled: column.sortOrder === 'desc',
          icon: CONTEXT_MENU_SORT_DESC_ICON,
          onItemClick
        }, {
          text: sortingOptions.clearText,
          value: 'none',
          disabled: !column.sortOrder,
          icon: CONTEXT_MENU_SORT_NONE_ICON,
          onItemClick
        }];
      }
    }
    return undefined;
  }
  getRowCount() {
    return this._columnsController && this._columnsController.getRowCount();
  }
  setRowsOpacity(columnIndex, value, rowIndex) {
    var i;
    var columnElements;
    var rowCount = this.getRowCount();
    var columns = this._columnsController.getColumns();
    var column = columns && columns[columnIndex];
    var columnID = column && column.isBand && column.index;
    var setColumnOpacity = (column, index) => {
      if (column.ownerBand === columnID) {
        columnElements.eq(index).css({
          opacity: value
        });
        if (column.isBand) {
          this.setRowsOpacity(column.index, value, i + 1);
        }
      }
    };
    if (isDefined(columnID)) {
      rowIndex = rowIndex || 0;
      for (i = rowIndex; i < rowCount; i++) {
        columnElements = this.getCellElements(i);
        if (columnElements) {
          var rowColumns = this.getColumns(i);
          rowColumns.forEach(setColumnOpacity);
        }
      }
    }
  }
}
export var columnHeadersModule = {
  defaultOptions() {
    return {
      showColumnHeaders: true,
      cellHintEnabled: true
    };
  },
  views: {
    columnHeadersView: ColumnHeadersView
  }
};