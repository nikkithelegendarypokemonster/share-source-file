/* eslint-disable max-classes-per-file */
import $ from '../../../../core/renderer';
import { isDefined } from '../../../../core/utils/type';
import { name as clickEventName } from '../../../../events/click';
import eventsEngine from '../../../../events/core/events_engine';
import { addNamespace, isCommandKeyPressed } from '../../../../events/utils/index';
import messageLocalization from '../../../../localization/message';
import sortingMixin from './m_sorting_mixin';
var COLUMN_HEADERS_VIEW_NAMESPACE = 'dxDataGridColumnHeadersView';
// TODO improve types of this mixin
//  Now all members - protected by default (it may be wrong)
// TODO getController
var columnHeadersView = Base => class ColumnHeadersViewSortingExtender extends sortingMixin(Base) {
  optionChanged(args) {
    var that = this;
    switch (args.name) {
      case 'sorting':
        that._invalidate();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
  _createRow(row) {
    var $row = super._createRow(row);
    if (row.rowType === 'header') {
      eventsEngine.on($row, addNamespace(clickEventName, COLUMN_HEADERS_VIEW_NAMESPACE), 'td', this.createAction(e => {
        this._processHeaderAction(e.event, $row);
      }));
    }
    return $row;
  }
  _processHeaderAction(event, $row) {
    if ($(event.currentTarget).parent().get(0) !== $row.get(0)) {
      return;
    }
    var that = this;
    var keyName = null;
    var $cellElementFromEvent = $(event.currentTarget);
    var rowIndex = $cellElementFromEvent.parent().index();
    var columnIndex = -1;
    // eslint-disable-next-line array-callback-return
    [].slice.call(that.getCellElements(rowIndex)).some(($cellElement, index) => {
      if ($cellElement === $cellElementFromEvent.get(0)) {
        columnIndex = index;
        return true;
      }
      return undefined;
    });
    var visibleColumns = that._columnsController.getVisibleColumns(rowIndex);
    var column = visibleColumns[columnIndex];
    var editingController = that.getController('editing');
    var editingMode = that.option('editing.mode');
    var isCellEditing = editingController && editingController.isEditing() && (editingMode === 'batch' || editingMode === 'cell');
    if (isCellEditing || !that._isSortableElement($(event.target))) {
      return;
    }
    if (column && !isDefined(column.groupIndex) && !column.command) {
      if (event.shiftKey) {
        keyName = 'shift';
      } else if (isCommandKeyPressed(event)) {
        keyName = 'ctrl';
      }
      setTimeout(() => {
        that._columnsController.changeSortOrder(column.index, keyName);
      });
    }
  }
  _renderCellContent($cell, options) {
    var that = this;
    var {
      column
    } = options;
    if (!column.command && options.rowType === 'header') {
      that._applyColumnState({
        name: 'sort',
        rootElement: $cell,
        column,
        showColumnLines: that.option('showColumnLines')
      });
    }
    super._renderCellContent.apply(this, arguments);
  }
  _columnOptionChanged(e) {
    var {
      changeTypes
    } = e;
    if (changeTypes.length === 1 && changeTypes.sorting) {
      this._updateIndicators('sort');
      return;
    }
    super._columnOptionChanged(e);
  }
};
var headerPanel = Base => class HeaderPanelSortingExtender extends sortingMixin(Base) {
  optionChanged(args) {
    var that = this;
    switch (args.name) {
      case 'sorting':
        that._invalidate();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
  _createGroupPanelItem($rootElement, groupColumn) {
    var that = this;
    var $item = super._createGroupPanelItem(...arguments);
    eventsEngine.on($item, addNamespace(clickEventName, 'dxDataGridHeaderPanel'), that.createAction(() => {
      that._processGroupItemAction(groupColumn.index);
    }));
    that._applyColumnState({
      name: 'sort',
      rootElement: $item,
      column: {
        alignment: that.option('rtlEnabled') ? 'right' : 'left',
        allowSorting: groupColumn.allowSorting,
        sortOrder: groupColumn.sortOrder === 'desc' ? 'desc' : 'asc',
        isGrouped: true
      },
      showColumnLines: true
    });
    return $item;
  }
  _processGroupItemAction(groupColumnIndex) {
    setTimeout(() => this.getController('columns').changeSortOrder(groupColumnIndex));
  }
};
export var sortingModule = {
  defaultOptions() {
    return {
      sorting: {
        mode: 'single',
        ascendingText: messageLocalization.format('dxDataGrid-sortingAscendingText'),
        descendingText: messageLocalization.format('dxDataGrid-sortingDescendingText'),
        clearText: messageLocalization.format('dxDataGrid-sortingClearText'),
        showSortIndexes: true
      }
    };
  },
  extenders: {
    views: {
      columnHeadersView,
      headerPanel
    }
  }
};