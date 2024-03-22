import $ from '../../../../core/../core/renderer';
import { extend } from '../../../../core/../core/utils/extend';
import { deferUpdate } from '../../../../core/utils/common';
import { getWidth, setWidth } from '../../../../core/utils/size';
import { isDefined } from '../../../../core/utils/type';
import Sortable from '../../../../ui/sortable';
import gridCoreUtils from '../m_utils';
import { ATTRIBUTES, CLASSES } from './const';
import { GridCoreRowDraggingDom } from './dom';
var rowsView = Base => class RowsViewRowDraggingExtender extends Base {
  init() {
    super.init.apply(this, arguments);
    this._updateHandleColumn();
  }
  optionChanged(args) {
    if (args.name === 'rowDragging') {
      this._updateHandleColumn();
      this._invalidate(true, true);
      args.handled = true;
    }
    super.optionChanged.apply(this, arguments);
  }
  _allowReordering() {
    var rowDragging = this.option('rowDragging');
    return !!(rowDragging && (rowDragging.allowReordering || rowDragging.allowDropInsideItem || rowDragging.group));
  }
  _updateHandleColumn() {
    var rowDragging = this.option('rowDragging');
    var allowReordering = this._allowReordering();
    var columnsController = this._columnsController;
    var isHandleColumnVisible = allowReordering && rowDragging.showDragIcons;
    columnsController === null || columnsController === void 0 ? void 0 : columnsController.addCommandColumn({
      type: 'drag',
      command: 'drag',
      visibleIndex: -2,
      alignment: 'center',
      elementAttr: [{
        name: ATTRIBUTES.dragCell,
        value: ''
      }],
      cssClass: CLASSES.commandDrag,
      width: 'auto',
      cellTemplate: this._getHandleTemplate(),
      visible: isHandleColumnVisible
    });
    columnsController === null || columnsController === void 0 ? void 0 : columnsController.columnOption('type:drag', 'visible', isHandleColumnVisible);
  }
  _renderContent() {
    var rowDragging = this.option('rowDragging');
    var allowReordering = this._allowReordering();
    var $content = super._renderContent.apply(this, arguments);
    // @ts-expect-error
    var isFixedTableRendering = this._isFixedTableRendering;
    var sortableName = '_sortable';
    var sortableFixedName = '_sortableFixed';
    var currentSortableName = isFixedTableRendering ? sortableFixedName : sortableName;
    var anotherSortableName = isFixedTableRendering ? sortableName : sortableFixedName;
    var togglePointerEventsStyle = toggle => {
      var _a;
      // T929503
      (_a = this[sortableFixedName]) === null || _a === void 0 ? void 0 : _a.$element().css('pointerEvents', toggle ? 'auto' : '');
    };
    var rowSelector = '.dx-row:not(.dx-freespace-row):not(.dx-virtual-row):not(.dx-header-row):not(.dx-footer-row)';
    var filter = this.option('dataRowTemplate') ? "> table > tbody".concat(rowSelector) : "> table > tbody > ".concat(rowSelector);
    if ((allowReordering || this[currentSortableName]) && $content.length) {
      this[currentSortableName] = this._createComponent($content, Sortable, extend({
        component: this.component,
        contentTemplate: null,
        filter,
        cursorOffset: options => {
          var {
            event
          } = options;
          var rowsViewOffset = $(this.element()).offset();
          return {
            // @ts-expect-error
            x: event.pageX - rowsViewOffset.left
          };
        },
        onDraggableElementShown: e => {
          if (rowDragging.dragTemplate) {
            return;
          }
          var $dragElement = $(e.dragElement);
          var gridInstance = $dragElement.children('.dx-widget').data(this.component.NAME);
          this._synchronizeScrollLeftPosition(gridInstance);
        },
        dragTemplate: this._getDraggableRowTemplate(),
        handle: rowDragging.showDragIcons && ".".concat(CLASSES.commandDrag),
        dropFeedbackMode: 'indicate'
      }, rowDragging, {
        onDragStart: e => {
          var _a, _b;
          // TODO getController
          (_a = this.getController('keyboardNavigation')) === null || _a === void 0 ? void 0 : _a._resetFocusedCell();
          var row = e.component.getVisibleRows()[e.fromIndex];
          e.itemData = row && row.data;
          var isDataRow = row && row.rowType === 'data';
          e.cancel = !allowReordering || !isDataRow;
          (_b = rowDragging.onDragStart) === null || _b === void 0 ? void 0 : _b.call(rowDragging, e);
        },
        onDragEnter: () => {
          togglePointerEventsStyle(true);
        },
        onDragLeave: () => {
          togglePointerEventsStyle(false);
        },
        onDragEnd: e => {
          var _a;
          togglePointerEventsStyle(false);
          (_a = rowDragging.onDragEnd) === null || _a === void 0 ? void 0 : _a.call(rowDragging, e);
        },
        onAdd: e => {
          var _a;
          togglePointerEventsStyle(false);
          (_a = rowDragging.onAdd) === null || _a === void 0 ? void 0 : _a.call(rowDragging, e);
        },
        dropFeedbackMode: rowDragging.dropFeedbackMode,
        onOptionChanged: e => {
          var hasFixedSortable = this[sortableFixedName];
          if (hasFixedSortable) {
            if (e.name === 'fromIndex' || e.name === 'toIndex') {
              this[anotherSortableName].option(e.name, e.value);
            }
          }
        }
      }));
      $content.toggleClass('dx-scrollable-container', isFixedTableRendering);
      $content.toggleClass(CLASSES.sortableWithoutHandle, allowReordering && !rowDragging.showDragIcons);
    }
    return $content;
  }
  _renderCore(e) {
    super._renderCore.apply(this, arguments);
    if (e && e.changeType === 'update' && e.repaintChangesOnly && gridCoreUtils.isVirtualRowRendering(this)) {
      deferUpdate(() => {
        this._updateSortable();
      });
    }
  }
  _updateSortable() {
    var offset = this._dataController.getRowIndexOffset();
    // @ts-expect-error
    var offsetDiff = offset - this._previousOffset;
    // @ts-expect-error
    [this._sortable, this._sortableFixed].forEach(sortable => {
      var toIndex = sortable === null || sortable === void 0 ? void 0 : sortable.option('toIndex');
      // @ts-expect-error
      if (isDefined(toIndex) && isDefined(this._previousOffset)) {
        sortable === null || sortable === void 0 ? void 0 : sortable.option('toIndex', toIndex - offsetDiff);
      }
      sortable === null || sortable === void 0 ? void 0 : sortable.option('offset', offset);
      sortable === null || sortable === void 0 ? void 0 : sortable.update();
    });
    // @ts-expect-error
    this._previousOffset = offset;
  }
  _resizeCore() {
    super._resizeCore.apply(this, arguments);
    this._updateSortable();
  }
  _getDraggableGridOptions(options) {
    var gridOptions = this.option();
    var columns = this.getColumns();
    var $rowElement = $(this.getRowElement(options.rowIndex));
    return {
      dataSource: [{
        id: 1,
        parentId: 0
      }],
      showBorders: true,
      showColumnHeaders: false,
      scrolling: {
        useNative: false,
        showScrollbar: 'never'
      },
      pager: {
        visible: false
      },
      loadingTimeout: null,
      columnFixing: gridOptions.columnFixing,
      columnAutoWidth: gridOptions.columnAutoWidth,
      showColumnLines: gridOptions.showColumnLines,
      columns: columns.map(column => ({
        width: column.width || column.visibleWidth,
        fixed: column.fixed,
        fixedPosition: column.fixedPosition
      })),
      onRowPrepared: e => {
        var rowsView = e.component.getView('rowsView');
        $(e.rowElement).replaceWith($rowElement.eq(rowsView._isFixedTableRendering ? 1 : 0).clone());
      }
    };
  }
  _synchronizeScrollLeftPosition(gridInstance) {
    var scrollable = gridInstance === null || gridInstance === void 0 ? void 0 : gridInstance.getScrollable();
    scrollable === null || scrollable === void 0 ? void 0 : scrollable.scrollTo({
      x: this._scrollLeft
    });
  }
  _getDraggableRowTemplate() {
    return options => {
      var $rootElement = this.component.$element();
      var $dataGridContainer = $('<div>');
      setWidth($dataGridContainer, getWidth($rootElement));
      var items = this._dataController.items();
      var row = items && items[options.fromIndex];
      var gridOptions = this._getDraggableGridOptions(row);
      // @ts-expect-error
      this._createComponent($dataGridContainer, this.component.NAME, gridOptions);
      $dataGridContainer.find('.dx-gridbase-container').children(":not(.".concat(this.addWidgetPrefix(CLASSES.rowsView), ")")).hide();
      $dataGridContainer.addClass(this.addWidgetPrefix(CLASSES.dragView));
      return $dataGridContainer;
    };
  }
  _getHandleTemplate() {
    return GridCoreRowDraggingDom.createHandleTemplateFunc(string => this.addWidgetPrefix(string));
  }
};
export var rowDraggingModule = {
  defaultOptions() {
    return {
      rowDragging: {
        showDragIcons: true,
        dropFeedbackMode: 'indicate',
        allowReordering: false,
        allowDropInsideItem: false
      }
    };
  },
  extenders: {
    views: {
      rowsView
    }
  }
};