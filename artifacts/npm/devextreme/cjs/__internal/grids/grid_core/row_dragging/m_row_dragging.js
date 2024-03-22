/**
* DevExtreme (cjs/__internal/grids/grid_core/row_dragging/m_row_dragging.js)
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
exports.rowDraggingModule = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/../core/renderer"));
var _extend = require("../../../../core/../core/utils/extend");
var _common = require("../../../../core/utils/common");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _sortable = _interopRequireDefault(require("../../../../ui/sortable"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _const = require("./const");
var _dom = require("./dom");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const rowsView = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(RowsViewRowDraggingExtender, _Base);
  function RowsViewRowDraggingExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto = RowsViewRowDraggingExtender.prototype;
  _proto.init = function init() {
    _Base.prototype.init.apply(this, arguments);
    this._updateHandleColumn();
  };
  _proto.optionChanged = function optionChanged(args) {
    if (args.name === 'rowDragging') {
      this._updateHandleColumn();
      this._invalidate(true, true);
      args.handled = true;
    }
    _Base.prototype.optionChanged.apply(this, arguments);
  };
  _proto._allowReordering = function _allowReordering() {
    const rowDragging = this.option('rowDragging');
    return !!(rowDragging && (rowDragging.allowReordering || rowDragging.allowDropInsideItem || rowDragging.group));
  };
  _proto._updateHandleColumn = function _updateHandleColumn() {
    const rowDragging = this.option('rowDragging');
    const allowReordering = this._allowReordering();
    const columnsController = this._columnsController;
    const isHandleColumnVisible = allowReordering && rowDragging.showDragIcons;
    columnsController === null || columnsController === void 0 ? void 0 : columnsController.addCommandColumn({
      type: 'drag',
      command: 'drag',
      visibleIndex: -2,
      alignment: 'center',
      elementAttr: [{
        name: _const.ATTRIBUTES.dragCell,
        value: ''
      }],
      cssClass: _const.CLASSES.commandDrag,
      width: 'auto',
      cellTemplate: this._getHandleTemplate(),
      visible: isHandleColumnVisible
    });
    columnsController === null || columnsController === void 0 ? void 0 : columnsController.columnOption('type:drag', 'visible', isHandleColumnVisible);
  };
  _proto._renderContent = function _renderContent() {
    const rowDragging = this.option('rowDragging');
    const allowReordering = this._allowReordering();
    const $content = _Base.prototype._renderContent.apply(this, arguments);
    // @ts-expect-error
    const isFixedTableRendering = this._isFixedTableRendering;
    const sortableName = '_sortable';
    const sortableFixedName = '_sortableFixed';
    const currentSortableName = isFixedTableRendering ? sortableFixedName : sortableName;
    const anotherSortableName = isFixedTableRendering ? sortableName : sortableFixedName;
    const togglePointerEventsStyle = toggle => {
      var _a;
      // T929503
      (_a = this[sortableFixedName]) === null || _a === void 0 ? void 0 : _a.$element().css('pointerEvents', toggle ? 'auto' : '');
    };
    const rowSelector = '.dx-row:not(.dx-freespace-row):not(.dx-virtual-row):not(.dx-header-row):not(.dx-footer-row)';
    const filter = this.option('dataRowTemplate') ? "> table > tbody".concat(rowSelector) : "> table > tbody > ".concat(rowSelector);
    if ((allowReordering || this[currentSortableName]) && $content.length) {
      this[currentSortableName] = this._createComponent($content, _sortable.default, (0, _extend.extend)({
        component: this.component,
        contentTemplate: null,
        filter,
        cursorOffset: options => {
          const {
            event
          } = options;
          const rowsViewOffset = (0, _renderer.default)(this.element()).offset();
          return {
            // @ts-expect-error
            x: event.pageX - rowsViewOffset.left
          };
        },
        onDraggableElementShown: e => {
          if (rowDragging.dragTemplate) {
            return;
          }
          const $dragElement = (0, _renderer.default)(e.dragElement);
          const gridInstance = $dragElement.children('.dx-widget').data(this.component.NAME);
          this._synchronizeScrollLeftPosition(gridInstance);
        },
        dragTemplate: this._getDraggableRowTemplate(),
        handle: rowDragging.showDragIcons && ".".concat(_const.CLASSES.commandDrag),
        dropFeedbackMode: 'indicate'
      }, rowDragging, {
        onDragStart: e => {
          var _a, _b;
          // TODO getController
          (_a = this.getController('keyboardNavigation')) === null || _a === void 0 ? void 0 : _a._resetFocusedCell();
          const row = e.component.getVisibleRows()[e.fromIndex];
          e.itemData = row && row.data;
          const isDataRow = row && row.rowType === 'data';
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
          const hasFixedSortable = this[sortableFixedName];
          if (hasFixedSortable) {
            if (e.name === 'fromIndex' || e.name === 'toIndex') {
              this[anotherSortableName].option(e.name, e.value);
            }
          }
        }
      }));
      $content.toggleClass('dx-scrollable-container', isFixedTableRendering);
      $content.toggleClass(_const.CLASSES.sortableWithoutHandle, allowReordering && !rowDragging.showDragIcons);
    }
    return $content;
  };
  _proto._renderCore = function _renderCore(e) {
    _Base.prototype._renderCore.apply(this, arguments);
    if (e && e.changeType === 'update' && e.repaintChangesOnly && _m_utils.default.isVirtualRowRendering(this)) {
      (0, _common.deferUpdate)(() => {
        this._updateSortable();
      });
    }
  };
  _proto._updateSortable = function _updateSortable() {
    const offset = this._dataController.getRowIndexOffset();
    // @ts-expect-error
    const offsetDiff = offset - this._previousOffset;
    // @ts-expect-error
    [this._sortable, this._sortableFixed].forEach(sortable => {
      const toIndex = sortable === null || sortable === void 0 ? void 0 : sortable.option('toIndex');
      // @ts-expect-error
      if ((0, _type.isDefined)(toIndex) && (0, _type.isDefined)(this._previousOffset)) {
        sortable === null || sortable === void 0 ? void 0 : sortable.option('toIndex', toIndex - offsetDiff);
      }
      sortable === null || sortable === void 0 ? void 0 : sortable.option('offset', offset);
      sortable === null || sortable === void 0 ? void 0 : sortable.update();
    });
    // @ts-expect-error
    this._previousOffset = offset;
  };
  _proto._resizeCore = function _resizeCore() {
    _Base.prototype._resizeCore.apply(this, arguments);
    this._updateSortable();
  };
  _proto._getDraggableGridOptions = function _getDraggableGridOptions(options) {
    const gridOptions = this.option();
    const columns = this.getColumns();
    const $rowElement = (0, _renderer.default)(this.getRowElement(options.rowIndex));
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
        const rowsView = e.component.getView('rowsView');
        (0, _renderer.default)(e.rowElement).replaceWith($rowElement.eq(rowsView._isFixedTableRendering ? 1 : 0).clone());
      }
    };
  };
  _proto._synchronizeScrollLeftPosition = function _synchronizeScrollLeftPosition(gridInstance) {
    const scrollable = gridInstance === null || gridInstance === void 0 ? void 0 : gridInstance.getScrollable();
    scrollable === null || scrollable === void 0 ? void 0 : scrollable.scrollTo({
      x: this._scrollLeft
    });
  };
  _proto._getDraggableRowTemplate = function _getDraggableRowTemplate() {
    return options => {
      const $rootElement = this.component.$element();
      const $dataGridContainer = (0, _renderer.default)('<div>');
      (0, _size.setWidth)($dataGridContainer, (0, _size.getWidth)($rootElement));
      const items = this._dataController.items();
      const row = items && items[options.fromIndex];
      const gridOptions = this._getDraggableGridOptions(row);
      // @ts-expect-error
      this._createComponent($dataGridContainer, this.component.NAME, gridOptions);
      $dataGridContainer.find('.dx-gridbase-container').children(":not(.".concat(this.addWidgetPrefix(_const.CLASSES.rowsView), ")")).hide();
      $dataGridContainer.addClass(this.addWidgetPrefix(_const.CLASSES.dragView));
      return $dataGridContainer;
    };
  };
  _proto._getHandleTemplate = function _getHandleTemplate() {
    return _dom.GridCoreRowDraggingDom.createHandleTemplateFunc(string => this.addWidgetPrefix(string));
  };
  return RowsViewRowDraggingExtender;
}(Base);
const rowDraggingModule = exports.rowDraggingModule = {
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
