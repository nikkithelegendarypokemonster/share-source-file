/* eslint-disable max-classes-per-file */
import $ from '../../../../core/renderer';
import { equalByValue } from '../../../../core/utils/common';
import { Deferred } from '../../../../core/utils/deferred';
import { extend } from '../../../../core/utils/extend';
import { each } from '../../../../core/utils/iterator';
import { touch } from '../../../../core/utils/support';
import { isDefined } from '../../../../core/utils/type';
import { applyBatch } from '../../../../data/array_utils';
import { name as clickEventName } from '../../../../events/click';
import eventsEngine from '../../../../events/core/events_engine';
import holdEvent from '../../../../events/hold';
import { addNamespace, isCommandKeyPressed } from '../../../../events/utils/index';
import messageLocalization from '../../../../localization/message';
import Selection from '../../../../ui/selection/selection';
import errors from '../../../../ui/widget/ui.errors';
import modules from '../m_modules';
import gridCoreUtils from '../m_utils';
var EDITOR_CELL_CLASS = 'dx-editor-cell';
var ROW_CLASS = 'dx-row';
var ROW_SELECTION_CLASS = 'dx-selection';
var SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';
var CHECKBOXES_HIDDEN_CLASS = 'dx-select-checkboxes-hidden';
var COMMAND_SELECT_CLASS = 'dx-command-select';
var SELECTION_DISABLED_CLASS = 'dx-selection-disabled';
var DATA_ROW_CLASS = 'dx-data-row';
var SHOW_CHECKBOXES_MODE = 'selection.showCheckBoxesMode';
var SELECTION_MODE = 'selection.mode';
var processLongTap = function processLongTap(that, dxEvent) {
  // TODO getView
  var rowsView = that.getView('rowsView');
  // TODO getController
  var selectionController = that.getController('selection');
  var $row = $(dxEvent.target).closest(".".concat(DATA_ROW_CLASS));
  var rowIndex = rowsView.getRowIndex($row);
  if (rowIndex < 0) return;
  if (that.option(SHOW_CHECKBOXES_MODE) === 'onLongTap') {
    if (selectionController.isSelectionWithCheckboxes()) {
      selectionController.stopSelectionWithCheckboxes();
    } else {
      selectionController.startSelectionWithCheckboxes();
    }
  } else {
    if (that.option(SHOW_CHECKBOXES_MODE) === 'onClick') {
      selectionController.startSelectionWithCheckboxes();
    }
    if (that.option(SHOW_CHECKBOXES_MODE) !== 'always') {
      selectionController.changeItemSelection(rowIndex, {
        control: true
      });
    }
  }
};
var isSeveralRowsSelected = function isSeveralRowsSelected(that, selectionFilter) {
  var keyIndex = 0;
  var store = that._dataController.store();
  var key = store && store.key();
  var isComplexKey = Array.isArray(key);
  if (!selectionFilter.length) {
    return false;
  }
  if (isComplexKey && Array.isArray(selectionFilter[0]) && selectionFilter[1] === 'and') {
    for (var i = 0; i < selectionFilter.length; i++) {
      if (Array.isArray(selectionFilter[i])) {
        if (selectionFilter[i][0] !== key[keyIndex] || selectionFilter[i][1] !== '=') {
          return true;
        }
        keyIndex++;
      }
    }
    return false;
  }
  return key !== selectionFilter[0];
};
var selectionCellTemplate = (container, options) => {
  var {
    component
  } = options;
  // TODO getView
  var rowsView = component.getView('rowsView');
  if (component.option('renderAsync') && !component.option('selection.deferred')) {
    options.value = component.isRowSelected(options.row.key);
  }
  rowsView.renderSelectCheckBoxContainer($(container), options);
};
var selectionHeaderTemplate = (container, options) => {
  var {
    column
  } = options;
  var $cellElement = $(container);
  // TODO getView
  var columnHeadersView = options.component.getView('columnHeadersView');
  $cellElement.addClass(EDITOR_CELL_CLASS);
  columnHeadersView._renderSelectAllCheckBox($cellElement, column);
  columnHeadersView._attachSelectAllCheckBoxClickEvent($cellElement);
};
export class SelectionController extends modules.Controller {
  init() {
    var _a;
    // @ts-expect-error
    var {
      deferred,
      selectAllMode,
      mode
    } = (_a = this.option('selection')) !== null && _a !== void 0 ? _a : {};
    if (this.option('scrolling.mode') === 'infinite' && !deferred && mode === 'multiple' && selectAllMode === 'allPages') {
      errors.log('W1018');
    }
    this._dataController = this.getController('data');
    this._columnsController = this.getController('columns');
    this._stateStoringController = this.getController('stateStoring');
    this._selectionMode = mode;
    this._isSelectionWithCheckboxes = false;
    this._selection = this._createSelection();
    this._updateSelectColumn();
    this.createAction('onSelectionChanged', {
      excludeValidators: ['disabled', 'readOnly']
    });
    if (!this._dataPushedHandler) {
      this._dataPushedHandler = this._handleDataPushed.bind(this);
      this._dataController.pushed.add(this._dataPushedHandler);
    }
  }
  _handleDataPushed(changes) {
    this._deselectRemovedOnPush(changes);
    this._updateSelectedOnPush(changes);
  }
  _deselectRemovedOnPush(changes) {
    var isDeferredSelection = this.option('selection.deferred');
    var removedKeys = changes.filter(change => change.type === 'remove').map(change => change.key);
    if (isDeferredSelection) {
      var selectedKeys = this._dataController.items().filter(item => item.isSelected).map(item => item.key);
      removedKeys = removedKeys.filter(key => selectedKeys.find(selectedKey => equalByValue(selectedKey, key)));
    }
    removedKeys.length && this.deselectRows(removedKeys);
  }
  _updateSelectedOnPush(changes) {
    var isDeferredSelection = this.option('selection.deferred');
    if (isDeferredSelection) {
      return;
    }
    var updateChanges = changes.filter(change => change.type === 'update');
    var data = this.getSelectedRowsData();
    applyBatch({
      keyInfo: this._selection.options,
      data,
      changes: updateChanges
    });
  }
  /**
   * @extended: TreeList's selection
   */
  _getSelectionConfig() {
    var _a;
    var dataController = this._dataController;
    var columnsController = this._columnsController;
    var selectionOptions = (_a = this.option('selection')) !== null && _a !== void 0 ? _a : {};
    var {
      deferred
    } = selectionOptions;
    var scrollingMode = this.option('scrolling.mode');
    var virtualPaging = scrollingMode === 'virtual' || scrollingMode === 'infinite';
    var allowSelectAll = this.option('selection.allowSelectAll');
    var legacyScrollingMode = this.option('scrolling.legacyMode');
    return {
      selectedKeys: this.option('selectedRowKeys'),
      mode: this._selectionMode,
      deferred,
      alwaysSelectByShift: selectionOptions.alwaysSelectByShift,
      maxFilterLengthInRequest: selectionOptions.maxFilterLengthInRequest,
      selectionFilter: this.option('selectionFilter'),
      ignoreDisabledItems: true,
      isVirtualPaging: virtualPaging,
      allowLoadByRange() {
        var hasGroupColumns = columnsController.getGroupColumns().length > 0;
        return virtualPaging && !legacyScrollingMode && !hasGroupColumns && allowSelectAll && !deferred;
      },
      key() {
        return dataController === null || dataController === void 0 ? void 0 : dataController.key();
      },
      keyOf(item) {
        return dataController === null || dataController === void 0 ? void 0 : dataController.keyOf(item);
      },
      dataFields() {
        var _a;
        return (_a = dataController.dataSource()) === null || _a === void 0 ? void 0 : _a.select();
      },
      load(options) {
        var _a;
        // @ts-expect-error
        return ((_a = dataController.dataSource()) === null || _a === void 0 ? void 0 : _a.load(options)) || new Deferred().resolve([]);
      },
      // eslint-disable-next-line
      plainItems(cached) {
        return dataController.items(true);
      },
      isItemSelected(item) {
        return item.selected;
      },
      isSelectableItem(item) {
        return (item === null || item === void 0 ? void 0 : item.rowType) === 'data' && !item.isNewRow;
      },
      getItemData(item) {
        return isDefined(item === null || item === void 0 ? void 0 : item.rowType) ? (item === null || item === void 0 ? void 0 : item.oldData) || (item === null || item === void 0 ? void 0 : item.data) : item;
      },
      filter() {
        return dataController.getCombinedFilter(deferred);
      },
      totalCount: () => dataController.totalCount(),
      getLoadOptions(loadItemIndex, focusedItemIndex, shiftItemIndex) {
        var _a, _b;
        var {
          sort,
          filter
        } = (_b = (_a = dataController.dataSource()) === null || _a === void 0 ? void 0 : _a.lastLoadOptions()) !== null && _b !== void 0 ? _b : {};
        var minIndex = Math.min(loadItemIndex, focusedItemIndex);
        var maxIndex = Math.max(loadItemIndex, focusedItemIndex);
        if (isDefined(shiftItemIndex)) {
          minIndex = Math.min(shiftItemIndex, minIndex);
          maxIndex = Math.max(shiftItemIndex, maxIndex);
        }
        var take = maxIndex - minIndex + 1;
        return {
          skip: minIndex,
          take,
          filter,
          sort
        };
      },
      onSelectionChanged: this._updateSelectedItems.bind(this)
    };
  }
  _updateSelectColumn() {
    var columnsController = this._columnsController;
    var isSelectColumnVisible = this.isSelectColumnVisible();
    columnsController.addCommandColumn({
      type: 'selection',
      command: 'select',
      visible: isSelectColumnVisible,
      visibleIndex: -1,
      dataType: 'boolean',
      alignment: 'center',
      cssClass: COMMAND_SELECT_CLASS,
      width: 'auto',
      cellTemplate: selectionCellTemplate,
      headerCellTemplate: selectionHeaderTemplate
    });
    columnsController.columnOption('command:select', 'visible', isSelectColumnVisible);
  }
  _createSelection() {
    var options = this._getSelectionConfig();
    return new Selection(options);
  }
  /**
   * @extended: state_storing, TreeList's selection
   */
  _fireSelectionChanged(options) {
    var argument = this.option('selection.deferred') ? {
      selectionFilter: this.option('selectionFilter')
    } : {
      selectedRowKeys: this.option('selectedRowKeys')
    };
    this.selectionChanged.fire(argument);
    if (options) {
      this.executeAction('onSelectionChanged', options);
    }
  }
  _updateCheckboxesState(options) {
    var {
      isDeferredMode
    } = options;
    var {
      selectionFilter
    } = options;
    var {
      selectedItemKeys
    } = options;
    var {
      removedItemKeys
    } = options;
    if (this.option(SHOW_CHECKBOXES_MODE) === 'onClick') {
      if (isDeferredMode ? selectionFilter && isSeveralRowsSelected(this, selectionFilter) : selectedItemKeys.length > 1) {
        this.startSelectionWithCheckboxes();
      } else if (isDeferredMode ? selectionFilter && !selectionFilter.length : selectedItemKeys.length === 0 && removedItemKeys.length) {
        this.stopSelectionWithCheckboxes();
      }
    }
  }
  /**
   * @extended: TreeList's selection
   */
  _updateSelectedItems(args) {
    var that = this;
    var selectionChangedOptions;
    var isDeferredMode = that.option('selection.deferred');
    var selectionFilter = that._selection.selectionFilter();
    var dataController = that._dataController;
    var items = dataController.items(true);
    var visibleItems = dataController.items();
    if (!items) {
      return;
    }
    var isSelectionWithCheckboxes = that.isSelectionWithCheckboxes();
    var changedItemIndexes = that.getChangedItemIndexes(items);
    var visibleChangedItemIndexes = that.getChangedItemIndexes(visibleItems);
    that._updateCheckboxesState({
      selectedItemKeys: args.selectedItemKeys,
      removedItemKeys: args.removedItemKeys,
      selectionFilter,
      isDeferredMode
    });
    if (changedItemIndexes.length || isSelectionWithCheckboxes !== that.isSelectionWithCheckboxes()) {
      dataController.updateItems({
        changeType: 'updateSelection',
        itemIndexes: visibleChangedItemIndexes
      });
    }
    if (isDeferredMode) {
      // @ts-expect-error
      that.option('selectionFilter', selectionFilter);
      selectionChangedOptions = {};
    } else if (args.addedItemKeys.length || args.removedItemKeys.length) {
      that._selectedItemsInternalChange = true;
      that.option('selectedRowKeys', args.selectedItemKeys.slice(0));
      that._selectedItemsInternalChange = false;
      selectionChangedOptions = {
        selectedRowsData: args.selectedItems.slice(0),
        selectedRowKeys: args.selectedItemKeys.slice(0),
        currentSelectedRowKeys: args.addedItemKeys.slice(0),
        currentDeselectedRowKeys: args.removedItemKeys.slice(0)
      };
    }
    that._fireSelectionChanged(selectionChangedOptions);
  }
  getChangedItemIndexes(items) {
    var that = this;
    var itemIndexes = [];
    var isDeferredSelection = this.option('selection.deferred');
    for (var i = 0, {
        length
      } = items; i < length; i++) {
      var row = items[i];
      var isItemSelected = that.isRowSelected(isDeferredSelection ? row.data : row.key);
      if (that._selection.isDataItem(row) && row.isSelected !== isItemSelected) {
        itemIndexes.push(i);
      }
    }
    return itemIndexes;
  }
  callbackNames() {
    return ['selectionChanged'];
  }
  optionChanged(args) {
    super.optionChanged(args);
    // eslint-disable-next-line default-case
    switch (args.name) {
      case 'selection':
        {
          var oldSelectionMode = this._selectionMode;
          this.init();
          if (args.fullName !== 'selection.showCheckBoxesMode') {
            var selectionMode = this._selectionMode;
            var selectedRowKeys = this.option('selectedRowKeys');
            if (oldSelectionMode !== selectionMode) {
              if (selectionMode === 'single') {
                if (selectedRowKeys.length > 1) {
                  selectedRowKeys = [selectedRowKeys[0]];
                }
              } else if (selectionMode !== 'multiple') {
                selectedRowKeys = [];
              }
            }
            this.selectRows(selectedRowKeys).always(() => {
              this._fireSelectionChanged();
            });
          }
          this._columnsController.updateColumns();
          args.handled = true;
          break;
        }
      case 'selectionFilter':
        this._selection.selectionFilter(args.value);
        args.handled = true;
        break;
      case 'selectedRowKeys':
        {
          var value = args.value || [];
          if (Array.isArray(value) && !this._selectedItemsInternalChange && (this.component.getDataSource() || !value.length)) {
            this.selectRows(value);
          }
          args.handled = true;
          break;
        }
    }
  }
  publicMethods() {
    return ['selectRows', 'deselectRows', 'selectRowsByIndexes', 'getSelectedRowKeys', 'getSelectedRowsData', 'clearSelection', 'selectAll', 'deselectAll', 'startSelectionWithCheckboxes', 'stopSelectionWithCheckboxes', 'isRowSelected'];
  }
  isRowSelected(arg) {
    return this._selection.isItemSelected(arg);
  }
  isSelectColumnVisible() {
    return this.option(SELECTION_MODE) === 'multiple' && (this.option(SHOW_CHECKBOXES_MODE) === 'always' || this.option(SHOW_CHECKBOXES_MODE) === 'onClick' || this._isSelectionWithCheckboxes);
  }
  _isOnePageSelectAll() {
    return this.option('selection.selectAllMode') === 'page';
  }
  isSelectAll() {
    return this._selection.getSelectAllState(this._isOnePageSelectAll());
  }
  /**
   * @extended: TreeList's selection
   */
  selectAll() {
    if (this.option(SHOW_CHECKBOXES_MODE) === 'onClick') {
      this.startSelectionWithCheckboxes();
    }
    return this._selection.selectAll(this._isOnePageSelectAll());
  }
  /**
   * @extended: TreeList's selection
   */
  deselectAll() {
    return this._selection.deselectAll(this._isOnePageSelectAll());
  }
  clearSelection() {
    return this.selectedItemKeys([]);
  }
  refresh() {
    var _a;
    var selectedRowKeys = (_a = this.option('selectedRowKeys')) !== null && _a !== void 0 ? _a : [];
    if (!this.option('selection.deferred') && selectedRowKeys.length) {
      return this.selectedItemKeys(selectedRowKeys);
    }
    // @ts-expect-error
    return new Deferred().resolve().promise();
  }
  selectedItemKeys(value, preserve, isDeselect, isSelectAll) {
    return this._selection.selectedItemKeys(value, preserve, isDeselect, isSelectAll);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSelectedRowKeys(mode) {
    return this._selection.getSelectedItemKeys();
  }
  /**
   * @extended: TreeList's selection
   */
  selectRows(keys, preserve) {
    return this.selectedItemKeys(keys, preserve);
  }
  deselectRows(keys) {
    return this.selectedItemKeys(keys, true, true);
  }
  selectRowsByIndexes(indexes) {
    var items = this._dataController.items();
    var keys = [];
    if (!Array.isArray(indexes)) {
      indexes = Array.prototype.slice.call(arguments, 0);
    }
    each(indexes, function () {
      var item = items[this];
      if (item && item.rowType === 'data') {
        keys.push(item.key);
      }
    });
    return this.selectRows(keys);
  }
  /**
   * @extended: TreeList's selection
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSelectedRowsData(mode) {
    return this._selection.getSelectedItems();
  }
  loadSelectedItemsWithFilter() {
    return this._selection.loadSelectedItemsWithFilter();
  }
  changeItemSelection(visibleItemIndex, keys, setFocusOnly) {
    keys = keys || {};
    if (this.isSelectionWithCheckboxes()) {
      keys.control = true;
    }
    var loadedItemIndex = visibleItemIndex + this._dataController.getRowIndexOffset() - this._dataController.getRowIndexOffset(true);
    return this._selection.changeItemSelection(loadedItemIndex, keys, setFocusOnly);
  }
  focusedItemIndex(itemIndex) {
    var that = this;
    if (isDefined(itemIndex)) {
      that._selection._focusedItemIndex = itemIndex;
    } else {
      return that._selection._focusedItemIndex;
    }
    return undefined;
  }
  isSelectionWithCheckboxes() {
    return this.option(SELECTION_MODE) === 'multiple' && (this.option(SHOW_CHECKBOXES_MODE) === 'always' || this._isSelectionWithCheckboxes);
  }
  startSelectionWithCheckboxes() {
    var that = this;
    if (that.option(SELECTION_MODE) === 'multiple' && !that.isSelectionWithCheckboxes()) {
      that._isSelectionWithCheckboxes = true;
      that._updateSelectColumn();
      return true;
    }
    return false;
  }
  stopSelectionWithCheckboxes() {
    var that = this;
    if (that._isSelectionWithCheckboxes) {
      that._isSelectionWithCheckboxes = false;
      that._updateSelectColumn();
      return true;
    }
    return false;
  }
}
export var dataSelectionExtenderMixin = Base => class DataControllerSelectionExtender extends Base {
  init() {
    var isDeferredMode = this.option('selection.deferred');
    super.init.apply(this, arguments);
    if (isDeferredMode) {
      this._selectionController._updateCheckboxesState({
        isDeferredMode: true,
        selectionFilter: this.option('selectionFilter')
      });
    }
  }
  _loadDataSource() {
    var that = this;
    return super._loadDataSource().always(() => {
      that._selectionController.refresh();
    });
  }
  _processDataItem(item, options) {
    var hasSelectColumn = this._selectionController.isSelectColumnVisible();
    var isDeferredSelection = options.isDeferredSelection = options.isDeferredSelection === undefined ? this.option('selection.deferred') : options.isDeferredSelection;
    var dataItem = super._processDataItem.apply(this, arguments);
    dataItem.isSelected = this._selectionController.isRowSelected(isDeferredSelection ? dataItem.data : dataItem.key);
    if (hasSelectColumn && dataItem.values) {
      for (var i = 0; i < options.visibleColumns.length; i++) {
        if (options.visibleColumns[i].command === 'select') {
          dataItem.values[i] = dataItem.isSelected;
          break;
        }
      }
    }
    return dataItem;
  }
  refresh(options) {
    var that = this;
    // @ts-expect-error
    var d = new Deferred();
    super.refresh.apply(this, arguments).done(() => {
      if (!options || options.selection) {
        that._selectionController.refresh().done(d.resolve).fail(d.reject);
      } else {
        d.resolve();
      }
    }).fail(d.reject);
    return d.promise();
  }
  // eslint-disable-next-line
  _handleDataChanged(e) {
    var hasLoadOperation = this.hasLoadOperation();
    super._handleDataChanged.apply(this, arguments);
    if (hasLoadOperation && !this._repaintChangesOnly) {
      this._selectionController.focusedItemIndex(-1);
    }
  }
  _applyChange(change) {
    if (change && change.changeType === 'updateSelection') {
      change.items.forEach((item, index) => {
        var currentItem = this._items[index];
        if (currentItem) {
          currentItem.isSelected = item.isSelected;
          currentItem.values = item.values;
        }
      });
      return;
    }
    return super._applyChange.apply(this, arguments);
  }
  _endUpdateCore() {
    var changes = this._changes;
    var isUpdateSelection = changes.length > 1 && changes.every(change => change.changeType === 'updateSelection');
    if (isUpdateSelection) {
      var itemIndexes = changes.map(change => change.itemIndexes || []).reduce((a, b) => a.concat(b));
      this._changes = [{
        changeType: 'updateSelection',
        itemIndexes
      }];
    }
    super._endUpdateCore.apply(this, arguments);
  }
};
var contextMenu = Base => class ContextMenuControllerSelectionExtender extends Base {
  _contextMenuPrepared(options) {
    var dxEvent = options.event;
    if (dxEvent.originalEvent && dxEvent.originalEvent.type !== 'dxhold' || options.items && options.items.length > 0) return;
    processLongTap(this, dxEvent);
  }
};
export var columnHeadersSelectionExtenderMixin = Base => class ColumnHeadersSelectionExtender extends Base {
  init() {
    super.init();
    this._selectionController.selectionChanged.add(this._updateSelectAllValue.bind(this));
  }
  _updateSelectAllValue() {
    var that = this;
    var $element = that.element();
    var $editor = $element && $element.find(".".concat(SELECT_CHECKBOX_CLASS));
    if ($element && $editor.length && that.option('selection.mode') === 'multiple') {
      var selectAllValue = that._selectionController.isSelectAll();
      var hasSelection = selectAllValue !== false;
      var isVisible = that.option('selection.allowSelectAll') ? !that._dataController.isEmpty() : hasSelection;
      $editor.dxCheckBox('instance').option({
        visible: isVisible,
        value: selectAllValue
      });
    }
  }
  _handleDataChanged(e) {
    super._handleDataChanged(e);
    if (!e || e.changeType === 'refresh' || e.repaintChangesOnly && e.changeType === 'update') {
      this.waitAsyncTemplates().done(() => {
        this._updateSelectAllValue();
      });
    }
  }
  _renderSelectAllCheckBox($container, column) {
    var that = this;
    var isEmptyData = that._dataController.isEmpty();
    var groupElement = $('<div>').appendTo($container).addClass(SELECT_CHECKBOX_CLASS);
    that.setAria('label', messageLocalization.format('dxDataGrid-ariaSelectAll'), groupElement);
    that._editorFactoryController.createEditor(groupElement, extend({}, column, {
      parentType: 'headerRow',
      dataType: 'boolean',
      value: this._selectionController.isSelectAll(),
      editorOptions: {
        visible: !isEmptyData && (that.option('selection.allowSelectAll') || this._selectionController.isSelectAll() !== false)
      },
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      tabIndex: that.option('useLegacyKeyboardNavigation') ? -1 : that.option('tabIndex') || 0,
      setValue: (value, e) => {
        var allowSelectAll = that.option('selection.allowSelectAll');
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        e.component.option('visible', allowSelectAll || e.component.option('value') !== false);
        if (!e.event || this._selectionController.isSelectAll() === value) {
          return;
        }
        if (e.value && !allowSelectAll) {
          e.component.option('value', false);
        } else {
          e.value ? this._selectionController.selectAll() : this._selectionController.deselectAll();
        }
        e.event.preventDefault();
      }
    }));
    return groupElement;
  }
  _attachSelectAllCheckBoxClickEvent($element) {
    eventsEngine.on($element, clickEventName, this.createAction(e => {
      var {
        event
      } = e;
      if (!$(event.target).closest(".".concat(SELECT_CHECKBOX_CLASS)).length) {
        // @ts-expect-error
        eventsEngine.trigger($(event.currentTarget).children(".".concat(SELECT_CHECKBOX_CLASS)), clickEventName);
      }
      event.preventDefault();
    }));
  }
};
export var rowsViewSelectionExtenderMixin = Base => class RowsViewSelectionExtender extends Base {
  renderSelectCheckBoxContainer($container, options) {
    if (options.rowType === 'data' && !options.row.isNewRow) {
      $container.addClass(EDITOR_CELL_CLASS);
      this._attachCheckBoxClickEvent($container);
      this._renderSelectCheckBox($container, options);
    } else {
      gridCoreUtils.setEmptyText($container);
    }
  }
  _renderSelectCheckBox(container, options) {
    var groupElement = $('<div>').addClass(SELECT_CHECKBOX_CLASS).appendTo(container);
    this.setAria('label', messageLocalization.format('dxDataGrid-ariaSelectRow'), groupElement);
    this._editorFactoryController.createEditor(groupElement, extend({}, options.column, {
      parentType: 'dataRow',
      dataType: 'boolean',
      lookup: null,
      value: options.value,
      setValue(value, e) {
        var _a;
        if (((_a = e === null || e === void 0 ? void 0 : e.event) === null || _a === void 0 ? void 0 : _a.type) === 'keydown') {
          // @ts-expect-error
          eventsEngine.trigger(e.element, clickEventName, e);
        }
      },
      row: options.row
    }));
    return groupElement;
  }
  _attachCheckBoxClickEvent($element) {
    eventsEngine.on($element, clickEventName, this.createAction(function (e) {
      var {
        event
      } = e;
      var rowIndex = this.getRowIndex($(event.currentTarget).closest(".".concat(ROW_CLASS)));
      if (rowIndex >= 0) {
        this._selectionController.startSelectionWithCheckboxes();
        this._selectionController.changeItemSelection(rowIndex, {
          shift: event.shiftKey
        });
        if ($(event.target).closest(".".concat(SELECT_CHECKBOX_CLASS)).length) {
          this._dataController.updateItems({
            changeType: 'updateSelection',
            itemIndexes: [rowIndex]
          });
        }
      }
    }));
  }
  _update(change) {
    var that = this;
    var tableElements = that.getTableElements();
    if (change.changeType === 'updateSelection') {
      if (tableElements.length > 0) {
        each(tableElements, (_, tableElement) => {
          each(change.itemIndexes || [], (_, index) => {
            var $row;
            // T108078
            if (change.items[index]) {
              $row = that._getRowElements($(tableElement)).eq(index);
              if ($row.length) {
                var {
                  isSelected
                } = change.items[index];
                $row.toggleClass(ROW_SELECTION_CLASS, isSelected === undefined ? false : isSelected).find(".".concat(SELECT_CHECKBOX_CLASS)).dxCheckBox('option', 'value', isSelected);
                that.setAria('selected', isSelected, $row);
              }
            }
          });
        });
        that._updateCheckboxesClass();
      }
    } else {
      super._update(change);
    }
  }
  _createTable() {
    var that = this;
    var selectionMode = that.option('selection.mode');
    var $table = super._createTable.apply(that, arguments);
    if (selectionMode !== 'none') {
      if (that.option(SHOW_CHECKBOXES_MODE) === 'onLongTap' || !touch) {
        // TODO Not working timeout by hold when it is larger than other timeouts by hold
        eventsEngine.on($table, addNamespace(holdEvent.name, 'dxDataGridRowsView'), ".".concat(DATA_ROW_CLASS), that.createAction(e => {
          processLongTap(that.component, e.event);
          e.event.stopPropagation();
        }));
      }
      eventsEngine.on($table, 'mousedown selectstart', that.createAction(e => {
        var {
          event
        } = e;
        if (event.shiftKey) {
          event.preventDefault();
        }
      }));
    }
    return $table;
  }
  _createRow(row) {
    var $row = super._createRow.apply(this, arguments);
    if (row) {
      var {
        isSelected
      } = row;
      if (isSelected) {
        $row.addClass(ROW_SELECTION_CLASS);
      }
      var selectionMode = this.option(SELECTION_MODE);
      if (selectionMode !== 'none') {
        this.setAria('selected', isSelected, $row);
      }
    }
    return $row;
  }
  _rowClickForTreeList(e) {
    super._rowClick(e);
  }
  _rowClick(e) {
    var that = this;
    var dxEvent = e.event;
    var isSelectionDisabled = $(dxEvent.target).closest(".".concat(SELECTION_DISABLED_CLASS)).length;
    if (!that.isClickableElement($(dxEvent.target))) {
      if (!isSelectionDisabled && (that.option(SELECTION_MODE) !== 'multiple' || that.option(SHOW_CHECKBOXES_MODE) !== 'always')) {
        if (that._selectionController.changeItemSelection(e.rowIndex, {
          control: isCommandKeyPressed(dxEvent),
          shift: dxEvent.shiftKey
        })) {
          dxEvent.preventDefault();
          e.handled = true;
        }
      }
      super._rowClick(e);
    }
  }
  isClickableElement($target) {
    var isCommandSelect = $target.closest(".".concat(COMMAND_SELECT_CLASS)).length;
    return !!isCommandSelect;
  }
  _renderCore(change) {
    var deferred = super._renderCore(change);
    this._updateCheckboxesClass();
    return deferred;
  }
  _updateCheckboxesClass() {
    var tableElements = this.getTableElements();
    var isCheckBoxesHidden = this._selectionController.isSelectColumnVisible() && !this._selectionController.isSelectionWithCheckboxes();
    each(tableElements, (_, tableElement) => {
      $(tableElement).toggleClass(CHECKBOXES_HIDDEN_CLASS, isCheckBoxesHidden);
    });
  }
};
export var selectionModule = {
  defaultOptions() {
    return {
      selection: {
        mode: 'none',
        showCheckBoxesMode: 'onClick',
        allowSelectAll: true,
        selectAllMode: 'allPages',
        deferred: false,
        maxFilterLengthInRequest: 1500,
        alwaysSelectByShift: false
      },
      selectionFilter: [],
      selectedRowKeys: []
    };
  },
  controllers: {
    selection: SelectionController
  },
  extenders: {
    controllers: {
      data: dataSelectionExtenderMixin,
      contextMenu
    },
    views: {
      columnHeadersView: columnHeadersSelectionExtenderMixin,
      rowsView: rowsViewSelectionExtenderMixin
    }
  }
};