/**
* DevExtreme (esm/__internal/grids/grid_core/editing/m_editing.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import devices from '../../../../core/devices';
import domAdapter from '../../../../core/dom_adapter';
import Guid from '../../../../core/guid';
import $ from '../../../../core/renderer';
import { equalByValue } from '../../../../core/utils/common';
// @ts-expect-error
import { Deferred, fromPromise, when } from '../../../../core/utils/deferred';
import { resetActiveElement } from '../../../../core/utils/dom';
import { extend } from '../../../../core/utils/extend';
import * as iconUtils from '../../../../core/utils/icon';
import { each } from '../../../../core/utils/iterator';
import { deepExtendArraySafe } from '../../../../core/utils/object';
import { isDefined, isEmptyObject, isFunction, isObject } from '../../../../core/utils/type';
import { createObjectWithChanges } from '../../../../data/array_utils';
import { name as clickEventName } from '../../../../events/click';
import eventsEngine from '../../../../events/core/events_engine';
import pointerEvents from '../../../../events/pointer';
import { removeEvent } from '../../../../events/remove';
import { addNamespace } from '../../../../events/utils/index';
import messageLocalization from '../../../../localization/message';
import { confirm } from '../../../../ui/dialog';
import { current, isFluent } from '../../../../ui/themes';
import modules from '../m_modules';
import gridCoreUtils from '../m_utils';
import { ACTION_OPTION_NAMES, BUTTON_NAMES, CELL_BASED_MODES, CELL_FOCUS_DISABLED_CLASS, CELL_MODIFIED, COMMAND_EDIT_CLASS, COMMAND_EDIT_WITH_ICONS_CLASS, DATA_EDIT_DATA_INSERT_TYPE, DATA_EDIT_DATA_REMOVE_TYPE, DATA_EDIT_DATA_UPDATE_TYPE, DEFAULT_START_EDIT_ACTION, EDIT_BUTTON_CLASS, EDIT_FORM_CLASS, EDIT_ICON_CLASS, EDIT_LINK_CLASS, EDIT_MODE_ROW, EDIT_MODES, EDITING_CHANGES_OPTION_NAME, EDITING_EDITCOLUMNNAME_OPTION_NAME, EDITING_EDITROWKEY_OPTION_NAME, EDITING_NAMESPACE, EDITING_POPUP_OPTION_NAME, EDITOR_CELL_CLASS, EDITORS_INPUT_SELECTOR, FIRST_NEW_ROW_POSITION, FOCUSABLE_ELEMENT_SELECTOR, INSERT_INDEX, LAST_NEW_ROW_POSITION, LINK_CLASS, LINK_ICON_CLASS, METHOD_NAMES, PAGE_BOTTOM_NEW_ROW_POSITION, PAGE_TOP_NEW_ROW_POSITION, READONLY_CLASS, REQUIRED_EDITOR_LABELLEDBY_MODES, ROW_BASED_MODES, ROW_CLASS, ROW_INSERTED, ROW_MODIFIED, ROW_SELECTED, TARGET_COMPONENT_NAME, VIEWPORT_BOTTOM_NEW_ROW_POSITION, VIEWPORT_TOP_NEW_ROW_POSITION } from './const';
import { createFailureHandler, generateNewRowTempKey, getButtonIndex, getButtonName, getEditingTexts, isEditingCell, isEditingOrShowEditorAlwaysDataCell } from './m_editing_utils';
class EditingControllerImpl extends modules.ViewController {
  init() {
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');
    this._adaptiveColumnsController = this.getController('adaptiveColumns');
    this._validatingController = this.getController('validating');
    this._editorFactoryController = this.getController('editorFactory');
    this._focusController = this.getController('focus');
    this._keyboardNavigationController = this.getController('keyboardNavigation');
    this._columnsResizerController = this.getController('columnsResizer');
    this._errorHandlingController = this.getController('errorHandling');
    this._rowsView = this.getView('rowsView');
    this._headerPanelView = this.getView('headerPanel');
    this._lastOperation = null;
    // this contains the value of 'editing.changes' option, to check if it has changed in onOptionChanged
    this._changes = [];
    if (this._deferreds) {
      this._deferreds.forEach(d => {
        d.reject('cancel');
      });
    }
    this._deferreds = [];
    if (!this._dataChangedHandler) {
      this._dataChangedHandler = this._handleDataChanged.bind(this);
      this._dataController.changed.add(this._dataChangedHandler);
    }
    if (!this._saveEditorHandler) {
      this.createAction('onInitNewRow', {
        excludeValidators: ['disabled', 'readOnly']
      });
      this.createAction('onRowInserting', {
        excludeValidators: ['disabled', 'readOnly']
      });
      this.createAction('onRowInserted', {
        excludeValidators: ['disabled', 'readOnly']
      });
      this.createAction('onEditingStart', {
        excludeValidators: ['disabled', 'readOnly']
      });
      this.createAction('onRowUpdating', {
        excludeValidators: ['disabled', 'readOnly']
      });
      this.createAction('onRowUpdated', {
        excludeValidators: ['disabled', 'readOnly']
      });
      this.createAction('onRowRemoving', {
        excludeValidators: ['disabled', 'readOnly']
      });
      this.createAction('onRowRemoved', {
        excludeValidators: ['disabled', 'readOnly']
      });
      this.createAction('onSaved', {
        excludeValidators: ['disabled', 'readOnly']
      });
      this.createAction('onSaving', {
        excludeValidators: ['disabled', 'readOnly']
      });
      this.createAction('onEditCanceling', {
        excludeValidators: ['disabled', 'readOnly']
      });
      this.createAction('onEditCanceled', {
        excludeValidators: ['disabled', 'readOnly']
      });
    }
    this._updateEditColumn();
    this._updateEditButtons();
    if (!this._internalState) {
      this._internalState = [];
    }
    this.component._optionsByReference[EDITING_EDITROWKEY_OPTION_NAME] = true;
    this.component._optionsByReference[EDITING_CHANGES_OPTION_NAME] = true;
  }
  getEditMode() {
    var _a;
    var editMode = (_a = this.option('editing.mode')) !== null && _a !== void 0 ? _a : EDIT_MODE_ROW;
    if (EDIT_MODES.includes(editMode)) {
      return editMode;
    }
    return EDIT_MODE_ROW;
  }
  isCellBasedEditMode() {
    var editMode = this.getEditMode();
    return CELL_BASED_MODES.includes(editMode);
  }
  _getDefaultEditorTemplate() {
    return (container, options) => {
      var $editor = $('<div>').appendTo(container);
      var editorOptions = extend({}, options.column, {
        value: options.value,
        setValue: options.setValue,
        row: options.row,
        parentType: 'dataRow',
        width: null,
        readOnly: !options.setValue,
        isOnForm: options.isOnForm,
        id: options.id
      });
      var needLabel = REQUIRED_EDITOR_LABELLEDBY_MODES.includes(this.getEditMode());
      if (needLabel) {
        editorOptions['aria-labelledby'] = options.column.headerId;
      }
      this._editorFactoryController.createEditor($editor, editorOptions);
    };
  }
  _getNewRowPosition() {
    var newRowPosition = this.option('editing.newRowPosition');
    var scrollingMode = this.option('scrolling.mode');
    if (scrollingMode === 'virtual') {
      switch (newRowPosition) {
        case PAGE_TOP_NEW_ROW_POSITION:
          return VIEWPORT_TOP_NEW_ROW_POSITION;
        case PAGE_BOTTOM_NEW_ROW_POSITION:
          return VIEWPORT_BOTTOM_NEW_ROW_POSITION;
        default:
          return newRowPosition;
      }
    }
    return newRowPosition;
  }
  getChanges() {
    return this.option(EDITING_CHANGES_OPTION_NAME);
  }
  getInsertRowCount() {
    var changes = this.option(EDITING_CHANGES_OPTION_NAME);
    return changes.filter(change => change.type === 'insert').length;
  }
  resetChanges() {
    var changes = this.getChanges();
    var needReset = changes === null || changes === void 0 ? void 0 : changes.length;
    if (needReset) {
      this._silentOption(EDITING_CHANGES_OPTION_NAME, []);
    }
  }
  _getInternalData(key) {
    return this._internalState.filter(item => equalByValue(item.key, key))[0];
  }
  _addInternalData(params) {
    var internalData = this._getInternalData(params.key);
    if (internalData) {
      return extend(internalData, params);
    }
    this._internalState.push(params);
    return params;
  }
  /**
   * @extended: validating
   */
  _getOldData(key) {
    var _a;
    return (_a = this._getInternalData(key)) === null || _a === void 0 ? void 0 : _a.oldData;
  }
  getUpdatedData(data) {
    var key = this._dataController.keyOf(data);
    var changes = this.getChanges();
    var editIndex = gridCoreUtils.getIndexByKey(key, changes);
    if (changes[editIndex]) {
      return createObjectWithChanges(data, changes[editIndex].data);
    }
    return data;
  }
  getInsertedData() {
    return this.getChanges().filter(change => change.data && change.type === DATA_EDIT_DATA_INSERT_TYPE).map(change => change.data);
  }
  getRemovedData() {
    return this.getChanges().filter(change => this._getOldData(change.key) && change.type === DATA_EDIT_DATA_REMOVE_TYPE).map(change => this._getOldData(change.key));
  }
  _fireDataErrorOccurred(arg) {
    if (arg === 'cancel') return;
    var $popupContent = this.getPopupContent();
    this._dataController.dataErrorOccurred.fire(arg, $popupContent);
  }
  /**
   * @extended: TreeList's editing
   */
  _needToCloseEditableCell($targetElement) {}
  /**
   * @extended: adaptivity
   */
  _closeEditItem($targetElement) {}
  /**
   * @extended: validating
   */
  _handleDataChanged(args) {}
  _isDefaultButtonVisible(button, options) {
    var result = true;
    // eslint-disable-next-line default-case
    switch (button.name) {
      case 'delete':
        result = this.allowDeleting(options);
        break;
      case 'undelete':
        result = false;
    }
    return result;
  }
  _isButtonVisible(button, options) {
    var {
      visible
    } = button;
    if (!isDefined(visible)) {
      return this._isDefaultButtonVisible(button, options);
    }
    return isFunction(visible) ? visible.call(button, {
      component: options.component,
      row: options.row,
      column: options.column
    }) : visible;
  }
  _isButtonDisabled(button, options) {
    var {
      disabled
    } = button;
    return isFunction(disabled) ? disabled.call(button, {
      component: options.component,
      row: options.row,
      column: options.column
    }) : !!disabled;
  }
  _getButtonConfig(button, options) {
    var config = isObject(button) ? button : {};
    var buttonName = getButtonName(button);
    var editingTexts = getEditingTexts(options);
    var methodName = METHOD_NAMES[buttonName];
    var editingOptions = this.option('editing');
    var actionName = ACTION_OPTION_NAMES[buttonName];
    var allowAction = actionName ? editingOptions[actionName] : true;
    return extend({
      name: buttonName,
      text: editingTexts[buttonName],
      cssClass: EDIT_LINK_CLASS[buttonName]
    }, {
      onClick: methodName && (e => {
        var {
          event
        } = e;
        event.stopPropagation();
        event.preventDefault();
        setTimeout(() => {
          options.row && allowAction && this[methodName] && this[methodName](options.row.rowIndex);
        });
      })
    }, config);
  }
  /**
   * @extended: TreeList's editing
   */
  _getEditingButtons(options) {
    var buttonIndex;
    var haveCustomButtons = !!options.column.buttons;
    var buttons = (options.column.buttons || []).slice();
    if (haveCustomButtons) {
      buttonIndex = getButtonIndex(buttons, 'edit');
      if (buttonIndex >= 0) {
        if (getButtonIndex(buttons, 'save') < 0) {
          buttons.splice(buttonIndex + 1, 0, 'save');
        }
        if (getButtonIndex(buttons, 'cancel') < 0) {
          buttons.splice(getButtonIndex(buttons, 'save') + 1, 0, 'cancel');
        }
      }
      buttonIndex = getButtonIndex(buttons, 'delete');
      if (buttonIndex >= 0 && getButtonIndex(buttons, 'undelete') < 0) {
        buttons.splice(buttonIndex + 1, 0, 'undelete');
      }
    } else {
      buttons = BUTTON_NAMES.slice();
    }
    return buttons.map(button => this._getButtonConfig(button, options));
  }
  _renderEditingButtons($container, buttons, options, change) {
    buttons.forEach(button => {
      if (this._isButtonVisible(button, options)) {
        this._createButton($container, button, options, change);
      }
    });
  }
  _getEditCommandCellTemplate() {
    return (container, options, change) => {
      var $container = $(container);
      if (options.rowType === 'data') {
        var buttons = this._getEditingButtons(options);
        this._renderEditingButtons($container, buttons, options, change);
        if (options.watch) {
          var dispose = options.watch(() => buttons.map(button => ({
            visible: this._isButtonVisible(button, options),
            disabled: this._isButtonDisabled(button, options)
          })), () => {
            $container.empty();
            this._renderEditingButtons($container, buttons, options);
          });
          eventsEngine.on($container, removeEvent, dispose);
        }
      } else {
        gridCoreUtils.setEmptyText($container);
      }
    };
  }
  isRowBasedEditMode() {
    var editMode = this.getEditMode();
    return ROW_BASED_MODES.includes(editMode);
  }
  getFirstEditableColumnIndex() {
    var columnIndex;
    var visibleColumns = this._columnsController.getVisibleColumns();
    // @ts-expect-error
    each(visibleColumns, (index, column) => {
      if (column.allowEditing) {
        columnIndex = index;
        return false;
      }
    });
    return columnIndex;
  }
  getFirstEditableCellInRow(rowIndex) {
    var _a;
    var columnIndex = this.getFirstEditableColumnIndex();
    return (_a = this._rowsView) === null || _a === void 0 ? void 0 : _a._getCellElement(rowIndex || 0, columnIndex);
  }
  /**
   * @extedned: keyboard_navigation
   * @param rowIndex
   * @protected
   */
  getFocusedCellInRow(rowIndex) {
    return this.getFirstEditableCellInRow(rowIndex);
  }
  /**
   * @extended: validating
   */
  getIndexByKey(key, items) {
    return gridCoreUtils.getIndexByKey(key, items);
  }
  hasChanges(rowIndex) {
    var changes = this.getChanges();
    var result = false;
    for (var i = 0; i < (changes === null || changes === void 0 ? void 0 : changes.length); i++) {
      if (changes[i].type && (!isDefined(rowIndex) || this._dataController.getRowIndexByKey(changes[i].key) === rowIndex)) {
        result = true;
        break;
      }
    }
    return result;
  }
  dispose() {
    super.dispose();
    clearTimeout(this._inputFocusTimeoutID);
    eventsEngine.off(domAdapter.getDocument(), pointerEvents.up, this._pointerUpEditorHandler);
    eventsEngine.off(domAdapter.getDocument(), pointerEvents.down, this._pointerDownEditorHandler);
    eventsEngine.off(domAdapter.getDocument(), clickEventName, this._saveEditorHandler);
  }
  _silentOption(name, value) {
    if (name === 'editing.changes') {
      this._changes = deepExtendArraySafe([], value);
    }
    // @ts-expect-error
    super._silentOption(name, value);
  }
  optionChanged(args) {
    if (args.name === 'editing') {
      var {
        fullName
      } = args;
      if (fullName === EDITING_EDITROWKEY_OPTION_NAME) {
        this._handleEditRowKeyChange(args);
      } else if (fullName === EDITING_CHANGES_OPTION_NAME) {
        // to prevent render on optionChanged called by two-way binding - T1128881
        var isEqual = equalByValue(args.value, this._changes, {
          maxDepth: 4
        });
        if (!isEqual) {
          this._changes = deepExtendArraySafe([], args.value);
          this._handleChangesChange(args);
        }
      } else if (!args.handled) {
        this._columnsController.reinit();
        this.init();
        this.resetChanges();
        this._resetEditColumnName();
        this._resetEditRowKey();
      }
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }
  _handleEditRowKeyChange(args) {
    var rowIndex = this._dataController.getRowIndexByKey(args.value);
    var oldRowIndexCorrection = this._getEditRowIndexCorrection();
    var oldRowIndex = this._dataController.getRowIndexByKey(args.previousValue) + oldRowIndexCorrection;
    if (isDefined(args.value)) {
      if (args.value !== args.previousValue) {
        this._editRowFromOptionChanged(rowIndex, oldRowIndex);
      }
    } else {
      this.cancelEditData();
    }
  }
  /**
   * @extended: validating
   */
  _handleChangesChange(args) {
    var dataController = this._dataController;
    var changes = args.value;
    if (!args.value.length && !args.previousValue.length) {
      return;
    }
    changes.forEach(change => {
      var _a;
      if (change.type === 'insert') {
        this._addInsertInfo(change);
      } else {
        var items = dataController.getCachedStoreData() || ((_a = dataController.items()) === null || _a === void 0 ? void 0 : _a.map(item => item.data));
        var rowIndex = gridCoreUtils.getIndexByKey(change.key, items, dataController.key());
        this._addInternalData({
          key: change.key,
          oldData: items[rowIndex]
        });
      }
    });
    dataController.updateItems({
      repaintChangesOnly: true,
      isLiveUpdate: false,
      isOptionChanged: true
    });
  }
  publicMethods() {
    return ['addRow', 'deleteRow', 'undeleteRow', 'editRow', 'saveEditData', 'cancelEditData', 'hasEditData'];
  }
  refresh() {
    if (!isDefined(this._pageIndex)) {
      return;
    }
    // @ts-expect-error
    this._refreshCore.apply(this, arguments);
  }
  _refreshCore(params) {}
  isEditing() {
    var isEditRowKeyDefined = isDefined(this.option(EDITING_EDITROWKEY_OPTION_NAME));
    return isEditRowKeyDefined;
  }
  isEditRow(rowIndex) {
    return false;
  }
  _setEditRowKey(value, silent) {
    if (silent) {
      this._silentOption(EDITING_EDITROWKEY_OPTION_NAME, value);
    } else {
      this.option(EDITING_EDITROWKEY_OPTION_NAME, value);
    }
    if (this._refocusEditCell) {
      this._refocusEditCell = false;
      this._focusEditingCell();
    }
  }
  _setEditRowKeyByIndex(rowIndex, silent) {
    var key = this._dataController.getKeyByRowIndex(rowIndex);
    if (key === undefined) {
      this._dataController.fireError('E1043');
      return;
    }
    this._setEditRowKey(key, silent);
  }
  getEditRowIndex() {
    return this._getVisibleEditRowIndex();
  }
  getEditFormRowIndex() {
    return -1;
  }
  isEditRowByIndex(rowIndex) {
    var key = this._dataController.getKeyByRowIndex(rowIndex);
    // Vitik: performance optimization equalByValue take O(1)
    var isKeyEqual = isDefined(key) && equalByValue(this.option(EDITING_EDITROWKEY_OPTION_NAME), key);
    if (isKeyEqual) {
      // Vitik: performance optimization _getVisibleEditRowIndex take O(n)
      return this._getVisibleEditRowIndex() === rowIndex;
    }
    return isKeyEqual;
  }
  isEditCell(visibleRowIndex, columnIndex) {
    return this.isEditRowByIndex(visibleRowIndex) && this._getVisibleEditColumnIndex() === columnIndex;
  }
  getPopupContent() {}
  /**
   * @extended: TreeList's editing
   */
  _isProcessedItem(item) {
    return false;
  }
  _getInsertRowIndex(items, change, isProcessedItems) {
    var result = -1;
    var dataController = this._dataController;
    var key = this._getInsertAfterOrBeforeKey(change);
    if (!isDefined(key) && items.length === 0) {
      result = 0;
    } else if (isDefined(key)) {
      // @ts-expect-error
      // eslint-disable-next-line array-callback-return
      items.some((item, index) => {
        var isProcessedItem = isProcessedItems || this._isProcessedItem(item);
        if (isObject(item)) {
          if (isProcessedItem || isDefined(item[INSERT_INDEX])) {
            // @ts-expect-error
            if (equalByValue(item.key, key)) {
              result = index;
            }
          } else if (equalByValue(dataController.keyOf(item), key)) {
            result = index;
          }
        }
        if (result >= 0) {
          var nextItem = items[result + 1];
          if (nextItem && (nextItem.rowType === 'detail' || nextItem.rowType === 'detailAdaptive') && isDefined(change.insertAfterKey)) {
            return;
          }
          if (isDefined(change.insertAfterKey)) {
            result += 1;
          }
          return true;
        }
      });
    }
    return result;
  }
  /**
   * @extended: TreeList's editing
   */
  _generateNewItem(key) {
    var _a;
    var item = {
      key
    };
    var insertInfo = (_a = this._getInternalData(key)) === null || _a === void 0 ? void 0 : _a.insertInfo;
    if (insertInfo === null || insertInfo === void 0 ? void 0 : insertInfo[INSERT_INDEX]) {
      item[INSERT_INDEX] = insertInfo[INSERT_INDEX];
    }
    return item;
  }
  /**
   * @extended: TreeList's editing
   */
  _getLoadedRowIndex(items, change, isProcessedItems) {
    var loadedRowIndex = this._getInsertRowIndex(items, change, isProcessedItems);
    var dataController = this._dataController;
    if (loadedRowIndex < 0) {
      var newRowPosition = this._getNewRowPosition();
      var pageIndex = dataController.pageIndex();
      var insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);
      if (newRowPosition !== LAST_NEW_ROW_POSITION && pageIndex === 0 && !isDefined(insertAfterOrBeforeKey)) {
        loadedRowIndex = 0;
      } else if (newRowPosition === LAST_NEW_ROW_POSITION && dataController.isLastPageLoaded()) {
        loadedRowIndex = items.length;
      }
    }
    return loadedRowIndex;
  }
  /**
   * @extended: validatiing
   */
  processItems(items, e) {
    var {
      changeType
    } = e;
    this.update(changeType);
    var changes = this.getChanges();
    changes.forEach(change => {
      var _a;
      var isInsert = change.type === DATA_EDIT_DATA_INSERT_TYPE;
      if (!isInsert) {
        return;
      }
      var {
        key
      } = change;
      var insertInfo = (_a = this._getInternalData(key)) === null || _a === void 0 ? void 0 : _a.insertInfo;
      if (!isDefined(key) || !isDefined(insertInfo)) {
        insertInfo = this._addInsertInfo(change);
        key = insertInfo.key;
      }
      var loadedRowIndex = this._getLoadedRowIndex(items, change);
      var item = this._generateNewItem(key);
      if (loadedRowIndex >= 0) {
        items.splice(loadedRowIndex, 0, item);
      }
    });
    return items;
  }
  /**
   * @extended: validating
   */
  processDataItem(item, options, generateDataValues) {
    var columns = options.visibleColumns;
    var key = item.data[INSERT_INDEX] ? item.data.key : item.key;
    var changes = this.getChanges();
    var editIndex = gridCoreUtils.getIndexByKey(key, changes);
    item.isEditing = false;
    if (editIndex >= 0) {
      this._processDataItemCore(item, changes[editIndex], key, columns, generateDataValues);
    }
  }
  _processDataItemCore(item, change, key, columns, generateDataValues) {
    var {
      data,
      type
    } = change;
    // eslint-disable-next-line default-case
    switch (type) {
      case DATA_EDIT_DATA_INSERT_TYPE:
        item.isNewRow = true;
        item.key = key;
        item.data = data;
        break;
      case DATA_EDIT_DATA_UPDATE_TYPE:
        item.modified = true;
        item.oldData = item.data;
        item.data = createObjectWithChanges(item.data, data);
        item.modifiedValues = generateDataValues(data, columns, true);
        break;
      case DATA_EDIT_DATA_REMOVE_TYPE:
        item.removed = true;
        break;
    }
  }
  /**
   * @extended: TreeList's editing
   */
  _initNewRow(options) {
    this.executeAction('onInitNewRow', options);
    if (options.promise) {
      // @ts-expect-error
      var deferred = new Deferred();
      when(fromPromise(options.promise)).done(deferred.resolve).fail(createFailureHandler(deferred)).fail(arg => this._fireDataErrorOccurred(arg));
      return deferred;
    }
  }
  _createInsertInfo() {
    var insertInfo = {};
    insertInfo[INSERT_INDEX] = this._getInsertIndex();
    return insertInfo;
  }
  _addInsertInfo(change, parentKey) {
    var _a;
    console.log('add insert info');
    var insertInfo;
    change.key = this.getChangeKeyValue(change);
    var {
      key
    } = change;
    insertInfo = (_a = this._getInternalData(key)) === null || _a === void 0 ? void 0 : _a.insertInfo;
    if (!isDefined(insertInfo)) {
      var insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);
      insertInfo = this._createInsertInfo();
      if (!isDefined(insertAfterOrBeforeKey)) {
        this._setInsertAfterOrBeforeKey(change, parentKey);
      }
    }
    this._addInternalData({
      insertInfo,
      key
    });
    return {
      insertInfo,
      key
    };
  }
  getChangeKeyValue(change) {
    if (isDefined(change.key)) {
      return change.key;
    }
    var keyExpr = this._dataController.key();
    var keyValue;
    if (change.data && keyExpr && !Array.isArray(keyExpr)) {
      keyValue = change.data[keyExpr];
    }
    if (!isDefined(keyValue)) {
      keyValue = generateNewRowTempKey();
    }
    return keyValue;
  }
  /**
   * @extended: TreeList's editing
   */
  _setInsertAfterOrBeforeKey(change, parentKey) {
    // TODO getView
    var rowsView = this.getView('rowsView');
    var dataController = this._dataController;
    var allItems = dataController.items(true);
    var newRowPosition = this._getNewRowPosition();
    switch (newRowPosition) {
      case FIRST_NEW_ROW_POSITION:
      case LAST_NEW_ROW_POSITION:
        break;
      case PAGE_TOP_NEW_ROW_POSITION:
      case PAGE_BOTTOM_NEW_ROW_POSITION:
        if (allItems.length) {
          var itemIndex = newRowPosition === PAGE_TOP_NEW_ROW_POSITION ? 0 : allItems.length - 1;
          change[itemIndex === 0 ? 'insertBeforeKey' : 'insertAfterKey'] = allItems[itemIndex].key;
        }
        break;
      default:
        {
          var isViewportBottom = newRowPosition === VIEWPORT_BOTTOM_NEW_ROW_POSITION;
          var visibleItemIndex = isViewportBottom
          // @ts-expect-error
          ? rowsView === null || rowsView === void 0 ? void 0 : rowsView.getBottomVisibleItemIndex() : rowsView === null || rowsView === void 0 ? void 0 : rowsView.getTopVisibleItemIndex();
          var row = dataController.getVisibleRows()[visibleItemIndex];
          if (row && (!row.isEditing && row.rowType === 'detail' || row.rowType === 'detailAdaptive')) {
            visibleItemIndex++;
          }
          var insertKey = dataController.getKeyByRowIndex(visibleItemIndex);
          if (isDefined(insertKey)) {
            change.insertBeforeKey = insertKey;
          }
        }
    }
  }
  _getInsertIndex() {
    var maxInsertIndex = 0;
    this.getChanges().forEach(editItem => {
      var _a;
      var insertInfo = (_a = this._getInternalData(editItem.key)) === null || _a === void 0 ? void 0 : _a.insertInfo;
      if (isDefined(insertInfo) && editItem.type === DATA_EDIT_DATA_INSERT_TYPE && insertInfo[INSERT_INDEX] > maxInsertIndex) {
        maxInsertIndex = insertInfo[INSERT_INDEX];
      }
    });
    return maxInsertIndex + 1;
  }
  _getInsertAfterOrBeforeKey(insertChange) {
    var _a;
    return (_a = insertChange.insertAfterKey) !== null && _a !== void 0 ? _a : insertChange.insertBeforeKey;
  }
  _getPageIndexToInsertRow() {
    var newRowPosition = this._getNewRowPosition();
    var dataController = this._dataController;
    var pageIndex = dataController.pageIndex();
    var lastPageIndex = dataController.pageCount() - 1;
    if (newRowPosition === FIRST_NEW_ROW_POSITION && pageIndex !== 0) {
      return 0;
    }
    if (newRowPosition === LAST_NEW_ROW_POSITION && pageIndex !== lastPageIndex) {
      return lastPageIndex;
    }
    return -1;
  }
  /**
   * @extended: keyboard_navigation
   */
  addRow(parentKey) {
    var dataController = this._dataController;
    var store = dataController.store();
    if (!store) {
      dataController.fireError('E1052', this.component.NAME);
      // @ts-expect-error
      return new Deferred().reject();
    }
    return this._addRow(parentKey);
  }
  _addRow(parentKey) {
    var dataController = this._dataController;
    var store = dataController.store();
    var key = store && store.key();
    var param = {
      data: {}
    };
    var oldEditRowIndex = this._getVisibleEditRowIndex();
    // @ts-expect-error
    var deferred = new Deferred();
    // @ts-expect-error
    this.refresh({
      allowCancelEditing: true
    });
    if (!this._allowRowAdding()) {
      when(this._navigateToNewRow(oldEditRowIndex)).done(deferred.resolve).fail(deferred.reject);
      return deferred.promise();
    }
    if (!key) {
      param.data.__KEY__ = String(new Guid());
    }
    // @ts-expect-error
    when(this._initNewRow(param, parentKey)).done(() => {
      if (this._allowRowAdding()) {
        when(this._addRowCore(param.data, parentKey, oldEditRowIndex)).done(deferred.resolve).fail(deferred.reject);
      } else {
        deferred.reject('cancel');
      }
    }).fail(deferred.reject);
    return deferred.promise();
  }
  _allowRowAdding(params) {
    var insertIndex = this._getInsertIndex();
    if (insertIndex > 1) {
      return false;
    }
    return true;
  }
  /**
   * @exteded: TreeList's editing
   */
  _addRowCore(data, parentKey, initialOldEditRowIndex) {
    var change = {
      data,
      type: DATA_EDIT_DATA_INSERT_TYPE
    };
    var editRowIndex = this._getVisibleEditRowIndex();
    var insertInfo = this._addInsertInfo(change, parentKey);
    var {
      key
    } = insertInfo;
    this._setEditRowKey(key, true);
    this._addChange(change);
    return this._navigateToNewRow(initialOldEditRowIndex, change, editRowIndex);
  }
  _navigateToNewRow(oldEditRowIndex, change, editRowIndex) {
    // @ts-expect-error
    var d = new Deferred();
    var dataController = this._dataController;
    editRowIndex = editRowIndex !== null && editRowIndex !== void 0 ? editRowIndex : -1;
    change = change !== null && change !== void 0 ? change : this.getChanges().filter(c => c.type === DATA_EDIT_DATA_INSERT_TYPE)[0];
    if (!change) {
      return d.reject('cancel').promise();
    }
    var pageIndexToInsertRow = this._getPageIndexToInsertRow();
    var rowIndex = this._getLoadedRowIndex(dataController.items(), change, true);
    var navigateToRowByKey = key => {
      var _a;
      when((_a = this._focusController) === null || _a === void 0 ? void 0 : _a.navigateToRow(key)).done(() => {
        rowIndex = dataController.getRowIndexByKey(change.key);
        d.resolve();
      });
    };
    var insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);
    if (pageIndexToInsertRow >= 0) {
      dataController.pageIndex(pageIndexToInsertRow).done(() => {
        navigateToRowByKey(change.key);
      }).fail(d.reject);
    } else if (rowIndex < 0 && isDefined(insertAfterOrBeforeKey)) {
      navigateToRowByKey(insertAfterOrBeforeKey);
    } else {
      dataController.updateItems({
        changeType: 'update',
        rowIndices: [oldEditRowIndex, editRowIndex, rowIndex]
      });
      rowIndex = dataController.getRowIndexByKey(change.key);
      if (rowIndex < 0) {
        navigateToRowByKey(change.key);
      } else {
        d.resolve();
      }
    }
    d.done(() => {
      var _a;
      (_a = this._rowsView) === null || _a === void 0 ? void 0 : _a.waitAsyncTemplates(true).done(() => {
        this._showAddedRow(rowIndex);
        this._afterInsertRow(change.key);
      });
    });
    return d.promise();
  }
  _showAddedRow(rowIndex) {
    this._focusFirstEditableCellInRow(rowIndex);
  }
  _beforeFocusElementInRow(rowIndex) {}
  _focusFirstEditableCellInRow(rowIndex) {
    var _a;
    var dataController = this._dataController;
    var key = dataController.getKeyByRowIndex(rowIndex);
    var $firstCell = this.getFirstEditableCellInRow(rowIndex);
    (_a = this._keyboardNavigationController) === null || _a === void 0 ? void 0 : _a.focus($firstCell);
    this.option('focusedRowKey', key);
    this._editCellInProgress = true;
    this._delayedInputFocus($firstCell, () => {
      rowIndex = dataController.getRowIndexByKey(key);
      this._editCellInProgress = false;
      this._beforeFocusElementInRow(rowIndex);
    });
  }
  /**
   * @extended: keyboard_navigation
   */
  _isEditingStart(options) {
    this.executeAction('onEditingStart', options);
    return options.cancel;
  }
  /**
   * @extended: adaptivity
   */
  _beforeUpdateItems(rowIndices, rowIndex) {}
  _getVisibleEditColumnIndex() {
    var editColumnName = this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME);
    if (!isDefined(editColumnName)) {
      return -1;
    }
    return this._columnsController.getVisibleColumnIndex(editColumnName);
  }
  _setEditColumnNameByIndex(index, silent) {
    var _a;
    var visibleColumns = this._columnsController.getVisibleColumns();
    this._setEditColumnName((_a = visibleColumns[index]) === null || _a === void 0 ? void 0 : _a.name, silent);
  }
  _setEditColumnName(name, silent) {
    if (silent) {
      this._silentOption(EDITING_EDITCOLUMNNAME_OPTION_NAME, name);
    } else {
      this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME, name);
    }
  }
  _resetEditColumnName() {
    this._setEditColumnName(null, true);
  }
  _getEditColumn() {
    var editColumnName = this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME);
    return this._getColumnByName(editColumnName);
  }
  _getColumnByName(name) {
    var visibleColumns = this._columnsController.getVisibleColumns();
    var editColumn;
    // @ts-expect-error
    // eslint-disable-next-line array-callback-return
    isDefined(name) && visibleColumns.some(column => {
      if (column.name === name) {
        editColumn = column;
        return true;
      }
    });
    return editColumn;
  }
  _getVisibleEditRowIndex(columnName) {
    var dataController = this._dataController;
    var editRowKey = this.option(EDITING_EDITROWKEY_OPTION_NAME);
    var rowIndex = dataController.getRowIndexByKey(editRowKey);
    if (rowIndex === -1) {
      return rowIndex;
    }
    return rowIndex + this._getEditRowIndexCorrection(columnName);
  }
  _getEditRowIndexCorrection(columnName) {
    var editColumn = columnName ? this._getColumnByName(columnName) : this._getEditColumn();
    var isColumnHidden = (editColumn === null || editColumn === void 0 ? void 0 : editColumn.visibleWidth) === 'adaptiveHidden';
    return isColumnHidden ? 1 : 0;
  }
  _resetEditRowKey() {
    this._refocusEditCell = false;
    this._setEditRowKey(null, true);
  }
  _resetEditIndices() {
    this._resetEditColumnName();
    this._resetEditRowKey();
  }
  /**
   * @extended: adaptivity, keyboard_navigation
   */
  // @ts-expect-error
  editRow(rowIndex) {
    var _a;
    var dataController = this._dataController;
    var items = dataController.items();
    var item = items[rowIndex];
    var params = {
      data: item && item.data,
      cancel: false
    };
    var oldRowIndex = this._getVisibleEditRowIndex();
    if (!item) {
      return;
    }
    if (rowIndex === oldRowIndex) {
      return true;
    }
    if (item.key === undefined) {
      this._dataController.fireError('E1043');
      return;
    }
    if (!item.isNewRow) {
      params.key = item.key;
    }
    if (this._isEditingStart(params)) {
      return;
    }
    this.resetChanges();
    this.init();
    this._resetEditColumnName();
    this._pageIndex = dataController.pageIndex();
    this._addInternalData({
      key: item.key,
      oldData: (_a = item.oldData) !== null && _a !== void 0 ? _a : item.data
    });
    this._setEditRowKey(item.key);
  }
  _editRowFromOptionChanged(rowIndex, oldRowIndex) {
    var rowIndices = [oldRowIndex, rowIndex];
    // @ts-expect-error
    this._beforeUpdateItems(rowIndices, rowIndex, oldRowIndex);
    this._editRowFromOptionChangedCore(rowIndices, rowIndex);
  }
  _editRowFromOptionChangedCore(rowIndices, rowIndex, preventRendering) {
    this._needFocusEditor = true;
    this._dataController.updateItems({
      changeType: 'update',
      rowIndices,
      cancel: preventRendering
    });
  }
  _focusEditorIfNeed() {}
  _showEditPopup(rowIndex, repaintForm) {}
  _repaintEditPopup() {}
  _getEditPopupHiddenHandler() {
    return e => {
      if (this.isEditing()) {
        this.cancelEditData();
      }
    };
  }
  _getPopupEditFormTemplate(rowIndex) {}
  _getSaveButtonConfig() {
    var buttonConfig = {
      text: this.option('editing.texts.saveRowChanges'),
      onClick: this.saveEditData.bind(this)
    };
    if (isFluent(current())) {
      buttonConfig.stylingMode = 'contained';
      buttonConfig.type = 'default';
    }
    return buttonConfig;
  }
  _getCancelButtonConfig() {
    var buttonConfig = {
      text: this.option('editing.texts.cancelRowChanges'),
      onClick: this.cancelEditData.bind(this)
    };
    if (isFluent(current())) {
      buttonConfig.stylingMode = 'outlined';
    }
    return buttonConfig;
  }
  _removeInternalData(key) {
    var internalData = this._getInternalData(key);
    var index = this._internalState.indexOf(internalData);
    if (index > -1) {
      this._internalState.splice(index, 1);
    }
  }
  _updateInsertAfterOrBeforeKeys(changes, index) {
    var removeChange = changes[index];
    changes.forEach(change => {
      var insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);
      if (equalByValue(insertAfterOrBeforeKey, removeChange.key)) {
        change[isDefined(change.insertAfterKey) ? 'insertAfterKey' : 'insertBeforeKey'] = this._getInsertAfterOrBeforeKey(removeChange);
      }
    });
  }
  /**
   * @extended: DataGrid's summary
   */
  _removeChange(index) {
    if (index >= 0) {
      var changes = [...this.getChanges()];
      var {
        key
      } = changes[index];
      this._removeInternalData(key);
      this._updateInsertAfterOrBeforeKeys(changes, index);
      changes.splice(index, 1);
      this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);
      if (equalByValue(this.option(EDITING_EDITROWKEY_OPTION_NAME), key)) {
        this._resetEditIndices();
      }
    }
  }
  executeOperation(deferred, func) {
    this._lastOperation && this._lastOperation.reject();
    this._lastOperation = deferred;
    this.waitForDeferredOperations().done(() => {
      if (deferred.state() === 'rejected') {
        return;
      }
      func();
      this._lastOperation = null;
    }).fail(() => {
      deferred.reject();
      this._lastOperation = null;
    });
  }
  waitForDeferredOperations() {
    return when(...this._deferreds);
  }
  /**
   * @extended: keyboard_navigation
   * @protected
   */
  _processCanceledEditingCell() {}
  _repaintEditCell(column, oldColumn, oldEditRowIndex) {
    if (!column || !column.showEditorAlways || oldColumn && !oldColumn.showEditorAlways) {
      this._editCellInProgress = true;
      this._needFocusEditor = true;
      // T316439
      this._editorFactoryController.loseFocus();
      this._dataController.updateItems({
        changeType: 'update',
        rowIndices: [oldEditRowIndex, this._getVisibleEditRowIndex()]
      });
    } else if (column !== oldColumn) {
      this._needFocusEditor = true;
      // TODO check this necessity T816039
      this._dataController.updateItems({
        changeType: 'update',
        rowIndices: []
      });
    }
  }
  /**
   * @extended: keyboard_navigation
   */
  _delayedInputFocus($cell, beforeFocusCallback, callBeforeFocusCallbackAlways) {
    var inputFocus = () => {
      if (beforeFocusCallback) {
        beforeFocusCallback();
      }
      if ($cell) {
        var $focusableElement = $cell.find(FOCUSABLE_ELEMENT_SELECTOR).first();
        gridCoreUtils.focusAndSelectElement(this, $focusableElement);
      }
      this._beforeFocusCallback = null;
    };
    if (devices.real().ios || devices.real().android) {
      inputFocus();
    } else {
      if (this._beforeFocusCallback) this._beforeFocusCallback();
      clearTimeout(this._inputFocusTimeoutID);
      if (callBeforeFocusCallbackAlways) {
        this._beforeFocusCallback = beforeFocusCallback;
      }
      this._inputFocusTimeoutID = setTimeout(inputFocus);
    }
  }
  _focusEditingCell(beforeFocusCallback, $editCell, callBeforeFocusCallbackAlways) {
    var editColumnIndex = this._getVisibleEditColumnIndex();
    $editCell = $editCell || this._rowsView && this._rowsView._getCellElement(this._getVisibleEditRowIndex(), editColumnIndex);
    if ($editCell) {
      this._delayedInputFocus($editCell, beforeFocusCallback, callBeforeFocusCallbackAlways);
    }
  }
  /**
   * @extended: adaptivity
   */
  deleteRow(rowIndex) {
    this._checkAndDeleteRow(rowIndex);
  }
  _checkAndDeleteRow(rowIndex) {
    var editingOptions = this.option('editing');
    var editingTexts = editingOptions === null || editingOptions === void 0 ? void 0 : editingOptions.texts;
    var confirmDelete = editingOptions === null || editingOptions === void 0 ? void 0 : editingOptions.confirmDelete;
    var confirmDeleteMessage = editingTexts === null || editingTexts === void 0 ? void 0 : editingTexts.confirmDeleteMessage;
    var item = this._dataController.items()[rowIndex];
    var allowDeleting = !this.isEditing() || item.isNewRow; // T741746
    if (item && allowDeleting) {
      if (!confirmDelete || !confirmDeleteMessage) {
        this._deleteRowCore(rowIndex);
      } else {
        var confirmDeleteTitle = editingTexts && editingTexts.confirmDeleteTitle;
        var showDialogTitle = isDefined(confirmDeleteTitle) && confirmDeleteTitle.length > 0;
        // @ts-expect-error
        confirm(confirmDeleteMessage, confirmDeleteTitle, showDialogTitle).done(confirmResult => {
          if (confirmResult) {
            this._deleteRowCore(rowIndex);
          }
        });
      }
    }
  }
  /**
   * @extended: focus
   */
  _deleteRowCore(rowIndex) {
    var dataController = this._dataController;
    var item = dataController.items()[rowIndex];
    var key = item && item.key;
    var oldEditRowIndex = this._getVisibleEditRowIndex();
    this.refresh();
    var changes = this.getChanges();
    var editIndex = gridCoreUtils.getIndexByKey(key, changes);
    if (editIndex >= 0) {
      if (changes[editIndex].type === DATA_EDIT_DATA_INSERT_TYPE) {
        this._removeChange(editIndex);
      } else {
        this._addChange({
          key,
          type: DATA_EDIT_DATA_REMOVE_TYPE
        });
      }
    } else {
      this._addChange({
        key,
        oldData: item.data,
        type: DATA_EDIT_DATA_REMOVE_TYPE
      });
    }
    return this._afterDeleteRow(rowIndex, oldEditRowIndex);
  }
  _afterDeleteRow(rowIndex, oldEditRowIndex) {
    return this.saveEditData();
  }
  undeleteRow(rowIndex) {
    var dataController = this._dataController;
    var item = dataController.items()[rowIndex];
    var oldEditRowIndex = this._getVisibleEditRowIndex();
    var key = item && item.key;
    var changes = this.getChanges();
    if (item) {
      var editIndex = gridCoreUtils.getIndexByKey(key, changes);
      if (editIndex >= 0) {
        var {
          data
        } = changes[editIndex];
        if (isEmptyObject(data)) {
          this._removeChange(editIndex);
        } else {
          this._addChange({
            key,
            type: DATA_EDIT_DATA_UPDATE_TYPE
          });
        }
        dataController.updateItems({
          changeType: 'update',
          rowIndices: [oldEditRowIndex, rowIndex]
        });
      }
    }
  }
  _fireOnSaving() {
    var onSavingParams = {
      cancel: false,
      promise: null,
      changes: [...this.getChanges()]
    };
    this.executeAction('onSaving', onSavingParams);
    // @ts-expect-error
    var d = new Deferred();
    when(fromPromise(onSavingParams.promise)).done(() => {
      d.resolve(onSavingParams);
    }).fail(arg => {
      createFailureHandler(d);
      this._fireDataErrorOccurred(arg);
      d.resolve({
        cancel: true
      });
    });
    return d;
  }
  _executeEditingAction(actionName, params, func) {
    if (this.component._disposed) {
      return null;
    }
    // @ts-expect-error
    var deferred = new Deferred();
    this.executeAction(actionName, params);
    when(fromPromise(params.cancel)).done(cancel => {
      if (cancel) {
        setTimeout(() => {
          deferred.resolve('cancel');
        });
      } else {
        func(params).done(deferred.resolve).fail(createFailureHandler(deferred));
      }
    }).fail(createFailureHandler(deferred));
    return deferred;
  }
  _processChanges(deferreds, results, dataChanges, changes) {
    var store = this._dataController.store();
    each(changes, (index, change) => {
      var oldData = this._getOldData(change.key);
      var {
        data,
        type
      } = change;
      var changeCopy = _extends({}, change);
      var deferred;
      var params;
      // @ts-expect-error
      if (this._beforeSaveEditData(change, index)) {
        return;
      }
      // eslint-disable-next-line default-case
      switch (type) {
        case DATA_EDIT_DATA_REMOVE_TYPE:
          params = {
            data: oldData,
            key: change.key,
            cancel: false
          };
          deferred = this._executeEditingAction('onRowRemoving', params, () => store.remove(change.key).done(key => {
            dataChanges.push({
              type: 'remove',
              key
            });
          }));
          break;
        case DATA_EDIT_DATA_INSERT_TYPE:
          params = {
            data,
            cancel: false
          };
          deferred = this._executeEditingAction('onRowInserting', params, () => store.insert(params.data).done((data, key) => {
            if (isDefined(key)) {
              changeCopy.key = key;
            }
            if (data && isObject(data) && data !== params.data) {
              changeCopy.data = data;
            }
            dataChanges.push({
              type: 'insert',
              data,
              index: 0
            });
          }));
          break;
        case DATA_EDIT_DATA_UPDATE_TYPE:
          params = {
            newData: data,
            oldData,
            key: change.key,
            cancel: false
          };
          deferred = this._executeEditingAction('onRowUpdating', params, () => store.update(change.key, params.newData).done((data, key) => {
            if (data && isObject(data) && data !== params.newData) {
              changeCopy.data = data;
            }
            dataChanges.push({
              type: 'update',
              key,
              data
            });
          }));
          break;
      }
      changes[index] = changeCopy;
      if (deferred) {
        // @ts-expect-error
        var doneDeferred = new Deferred();
        deferred.always(data => {
          results.push({
            key: change.key,
            result: data
          });
        }).always(doneDeferred.resolve);
        deferreds.push(doneDeferred.promise());
      }
    });
  }
  _processRemoveIfError(changes, editIndex) {
    var change = changes[editIndex];
    if ((change === null || change === void 0 ? void 0 : change.type) === DATA_EDIT_DATA_REMOVE_TYPE) {
      if (editIndex >= 0) {
        changes.splice(editIndex, 1);
      }
    }
    return true;
  }
  _processRemove(changes, editIndex, cancel) {
    var change = changes[editIndex];
    if (!cancel || !change || change.type === DATA_EDIT_DATA_REMOVE_TYPE) {
      return this._processRemoveCore(changes, editIndex, !cancel || !change);
    }
  }
  _processRemoveCore(changes, editIndex, processIfBatch) {
    if (editIndex >= 0) {
      changes.splice(editIndex, 1);
    }
    return true;
  }
  _processSaveEditDataResult(results) {
    var hasSavedData = false;
    var changes = [...this.getChanges()];
    var changesLength = changes.length;
    for (var i = 0; i < results.length; i++) {
      var arg = results[i].result;
      var cancel = arg === 'cancel';
      var editIndex = gridCoreUtils.getIndexByKey(results[i].key, changes);
      var change = changes[editIndex];
      var isError = arg && arg instanceof Error;
      if (isError) {
        if (change) {
          this._addInternalData({
            key: change.key,
            error: arg
          });
        }
        this._fireDataErrorOccurred(arg);
        if (this._processRemoveIfError(changes, editIndex)) {
          break;
        }
      } else if (this._processRemove(changes, editIndex, cancel)) {
        hasSavedData = !cancel;
      }
    }
    if (changes.length < changesLength) {
      this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);
    }
    return hasSavedData;
  }
  _fireSaveEditDataEvents(changes) {
    each(changes, (_, _ref) => {
      var {
        data,
        key,
        type
      } = _ref;
      var internalData = this._addInternalData({
        key
      });
      var params = {
        key,
        data
      };
      if (internalData.error) {
        params.error = internalData.error;
      }
      // eslint-disable-next-line default-case
      switch (type) {
        case DATA_EDIT_DATA_REMOVE_TYPE:
          this.executeAction('onRowRemoved', extend({}, params, {
            data: internalData.oldData
          }));
          break;
        case DATA_EDIT_DATA_INSERT_TYPE:
          this.executeAction('onRowInserted', params);
          break;
        case DATA_EDIT_DATA_UPDATE_TYPE:
          this.executeAction('onRowUpdated', params);
          break;
      }
    });
    this.executeAction('onSaved', {
      changes
    });
  }
  saveEditData() {
    // @ts-expect-error
    var deferred = new Deferred();
    this.waitForDeferredOperations().done(() => {
      if (this.isSaving()) {
        this._resolveAfterSave(deferred);
        return;
      }
      when(this._beforeSaveEditData()).done(cancel => {
        if (cancel) {
          // @ts-expect-error
          this._resolveAfterSave(deferred, {
            cancel
          });
          return;
        }
        this._saving = true;
        this._saveEditDataInner().always(() => {
          this._saving = false;
          if (this._refocusEditCell) {
            this._focusEditingCell();
          }
        }).done(deferred.resolve).fail(deferred.reject);
      }).fail(deferred.reject);
    }).fail(deferred.reject);
    return deferred.promise();
  }
  // @ts-expect-error
  _resolveAfterSave(deferred) {
    var {
      cancel,
      error
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // @ts-expect-error
    when(this._afterSaveEditData(cancel)).done(() => {
      deferred.resolve(error);
    }).fail(deferred.reject);
  }
  _saveEditDataInner() {
    // @ts-expect-error
    var result = new Deferred();
    var results = [];
    var deferreds = [];
    var dataChanges = [];
    var dataSource = this._dataController.dataSource();
    when(this._fireOnSaving()).done(_ref2 => {
      var {
        cancel,
        changes
      } = _ref2;
      if (cancel) {
        return result.resolve().promise();
      }
      this._processChanges(deferreds, results, dataChanges, changes);
      if (deferreds.length) {
        this._refocusEditCell = true;
        dataSource === null || dataSource === void 0 ? void 0 : dataSource.beginLoading();
        when(...deferreds).done(() => {
          if (this._processSaveEditDataResult(results)) {
            this._endSaving(dataChanges, changes, result);
          } else {
            dataSource === null || dataSource === void 0 ? void 0 : dataSource.endLoading();
            result.resolve();
          }
        }).fail(error => {
          dataSource === null || dataSource === void 0 ? void 0 : dataSource.endLoading();
          result.resolve(error);
        });
        return result.always(() => {
          this._refocusEditCell = true;
        }).promise();
      }
      this._cancelSaving(result);
    }).fail(result.reject);
    return result.promise();
  }
  _beforeEndSaving(changes) {
    this._resetEditIndices();
  }
  _endSaving(dataChanges, changes, deferred) {
    var dataSource = this._dataController.dataSource();
    this._beforeEndSaving(changes);
    dataSource === null || dataSource === void 0 ? void 0 : dataSource.endLoading();
    this._refreshDataAfterSave(dataChanges, changes, deferred);
  }
  _cancelSaving(result) {
    this.executeAction('onSaved', {
      changes: []
    });
    this._resolveAfterSave(result);
  }
  _refreshDataAfterSave(dataChanges, changes, deferred) {
    var dataController = this._dataController;
    var refreshMode = this.option('editing.refreshMode');
    var isFullRefresh = refreshMode !== 'reshape' && refreshMode !== 'repaint';
    if (!isFullRefresh) {
      dataController.push(dataChanges);
    }
    when(dataController.refresh({
      selection: isFullRefresh,
      reload: isFullRefresh,
      load: refreshMode === 'reshape',
      changesOnly: this.option('repaintChangesOnly')
    })).always(() => {
      this._fireSaveEditDataEvents(changes);
    }).done(() => {
      this._resolveAfterSave(deferred);
    }).fail(error => {
      // @ts-expect-error
      this._resolveAfterSave(deferred, {
        error
      });
    });
  }
  isSaving() {
    return this._saving;
  }
  _updateEditColumn() {
    var isEditColumnVisible = this._isEditColumnVisible();
    var useIcons = this.option('editing.useIcons');
    var cssClass = COMMAND_EDIT_CLASS + (useIcons ? " ".concat(COMMAND_EDIT_WITH_ICONS_CLASS) : '');
    this._columnsController.addCommandColumn({
      type: 'buttons',
      command: 'edit',
      visible: isEditColumnVisible,
      cssClass,
      width: 'auto',
      alignment: 'center',
      cellTemplate: this._getEditCommandCellTemplate(),
      fixedPosition: 'right'
    });
    this._columnsController.columnOption('command:edit', {
      visible: isEditColumnVisible,
      cssClass
    });
  }
  _isEditColumnVisible() {
    var editingOptions = this.option('editing');
    return editingOptions.allowDeleting;
  }
  _isEditButtonDisabled() {
    var hasChanges = this.hasChanges();
    var isEditRowDefined = isDefined(this.option('editing.editRowKey'));
    return !(isEditRowDefined || hasChanges);
  }
  /**
   * @extended: DataGrid's export
   */
  _updateEditButtons() {
    var isButtonDisabled = this._isEditButtonDisabled();
    if (this._headerPanelView) {
      this._headerPanelView.setToolbarItemDisabled('saveButton', isButtonDisabled);
      this._headerPanelView.setToolbarItemDisabled('revertButton', isButtonDisabled);
    }
  }
  _applyModified($element, options) {
    $element && $element.addClass(CELL_MODIFIED);
  }
  /**
   * @extended: adaptivity
   */
  _beforeCloseEditCellInBatchMode(rowIndices) {}
  /**
   * @extended: DataGird's summary
   */
  cancelEditData() {
    var changes = this.getChanges();
    var params = {
      cancel: false,
      changes
    };
    this.executeAction('onEditCanceling', params);
    if (!params.cancel) {
      this._cancelEditDataCore();
      this.executeAction('onEditCanceled', {
        changes
      });
    }
  }
  _cancelEditDataCore() {
    var rowIndex = this._getVisibleEditRowIndex();
    this._beforeCancelEditData();
    this.init();
    this.resetChanges();
    this._resetEditColumnName();
    this._resetEditRowKey();
    this._afterCancelEditData(rowIndex);
  }
  /**
   * @extended: filter_row
   */
  _afterCancelEditData(rowIndex) {
    var dataController = this._dataController;
    dataController.updateItems({
      repaintChangesOnly: this.option('repaintChangesOnly')
    });
  }
  _hideEditPopup() {}
  hasEditData() {
    return this.hasChanges();
  }
  update(changeType) {
    var dataController = this._dataController;
    if (dataController && this._pageIndex !== dataController.pageIndex()) {
      if (changeType === 'refresh') {
        // @ts-expect-error
        this.refresh({
          isPageChanged: true
        });
      }
      this._pageIndex = dataController.pageIndex();
    }
    this._updateEditButtons();
  }
  /**
   * @extended: adaptivity
   */
  _getRowIndicesForCascadeUpdating(row, skipCurrentRow) {
    return skipCurrentRow ? [] : [row.rowIndex];
  }
  /**
   * Adds a deferred object to be awaited before other operations are executed
   */
  addDeferred(deferred) {
    if (!this._deferreds.includes(deferred)) {
      this._deferreds.push(deferred);
      deferred.always(() => {
        var index = this._deferreds.indexOf(deferred);
        if (index >= 0) {
          this._deferreds.splice(index, 1);
        }
      });
    }
  }
  _prepareChange(options, value, text) {
    var _a;
    var newData = {};
    var oldData = (_a = options.row) === null || _a === void 0 ? void 0 : _a.data;
    var rowKey = options.key;
    // @ts-expect-error
    var deferred = new Deferred();
    if (rowKey !== undefined) {
      options.value = value;
      var setCellValueResult = fromPromise(options.column.setCellValue(newData, value, extend(true, {}, oldData), text));
      setCellValueResult.done(() => {
        deferred.resolve({
          data: newData,
          key: rowKey,
          oldData,
          type: DATA_EDIT_DATA_UPDATE_TYPE
        });
      }).fail(createFailureHandler(deferred)).fail(arg => this._fireDataErrorOccurred(arg));
      if (isDefined(text) && options.column.displayValueMap) {
        options.column.displayValueMap[value] = text;
      }
      this._updateRowValues(options);
      this.addDeferred(deferred);
    }
    return deferred;
  }
  _updateRowValues(options) {
    if (options.values) {
      var dataController = this._dataController;
      var rowIndex = dataController.getRowIndexByKey(options.key);
      var row = dataController.getVisibleRows()[rowIndex];
      if (row) {
        options.row.values = row.values; // T1122209
        options.values = row.values;
      }
      options.values[options.columnIndex] = options.value;
    }
  }
  /**
   * @extended: filter_row, validating
   */
  updateFieldValue(options, value, text, forceUpdateRow) {
    var rowKey = options.key;
    // @ts-expect-error
    var deferred = new Deferred();
    if (rowKey === undefined) {
      this._dataController.fireError('E1043');
    }
    if (options.column.setCellValue) {
      this._prepareChange(options, value, text).done(params => {
        when(this._applyChange(options, params, forceUpdateRow)).always(() => {
          deferred.resolve();
        });
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise();
  }
  // @ts-expect-error
  _focusPreviousEditingCellIfNeed(options) {
    if (this.hasEditData() && !this.isEditCell(options.rowIndex, options.columnIndex)) {
      this._focusEditingCell();
      this._updateEditRow(options.row, true);
      return true;
    }
  }
  _needUpdateRow(column) {
    var visibleColumns = this._columnsController.getVisibleColumns();
    if (!column) {
      column = this._getEditColumn();
    }
    var isCustomSetCellValue = column && column.setCellValue !== column.defaultSetCellValue;
    var isCustomCalculateCellValue = visibleColumns.some(visibleColumn => visibleColumn.calculateCellValue !== visibleColumn.defaultCalculateCellValue);
    return isCustomSetCellValue || isCustomCalculateCellValue;
  }
  _applyChange(options, params, forceUpdateRow) {
    var changeOptions = _extends(_extends({}, options), {
      forceUpdateRow
    });
    this._addChange(params, changeOptions);
    this._updateEditButtons();
    return this._applyChangeCore(options, changeOptions.forceUpdateRow);
  }
  _applyChangeCore(options, forceUpdateRow) {
    var isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue;
    var {
      row
    } = options;
    if (row) {
      if (forceUpdateRow || isCustomSetCellValue) {
        this._updateEditRow(row, forceUpdateRow, isCustomSetCellValue);
      } else if (row.update) {
        row.update();
      }
    }
  }
  _updateEditRowCore(row, skipCurrentRow, isCustomSetCellValue) {
    this._dataController.updateItems({
      changeType: 'update',
      rowIndices: this._getRowIndicesForCascadeUpdating(row, skipCurrentRow)
    });
  }
  _updateEditRow(row, forceUpdateRow, isCustomSetCellValue) {
    if (forceUpdateRow) {
      this._updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue);
    } else {
      this._updateRowWithDelay(row, isCustomSetCellValue);
    }
  }
  _updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue) {
    this._updateEditRowCore(row, !forceUpdateRow, isCustomSetCellValue);
    // @ts-expect-error
    this._validateEditFormAfterUpdate(row, isCustomSetCellValue);
    if (!forceUpdateRow) {
      this._focusEditingCell();
    }
  }
  _updateRowWithDelay(row, isCustomSetCellValue) {
    // @ts-expect-error
    var deferred = new Deferred();
    this.addDeferred(deferred);
    setTimeout(() => {
      var _a;
      // NOTE: if the editForm is enabled then we need to search for focused element in the document root
      // otherwise we need to search for element in the shadow dom
      // @ts-expect-error
      var elementContainer = ((_a = this._editForm) === null || _a === void 0 ? void 0 : _a.element()) || this.component.$element().get(0);
      var $focusedElement = $(domAdapter.getActiveElement(elementContainer));
      var columnIndex = this._rowsView.getCellIndex($focusedElement, row.rowIndex);
      var focusedElement = $focusedElement.get(0);
      var selectionRange = gridCoreUtils.getSelectionRange(focusedElement);
      this._updateEditRowCore(row, false, isCustomSetCellValue);
      // @ts-expect-error
      this._validateEditFormAfterUpdate(row, isCustomSetCellValue);
      if (columnIndex >= 0) {
        var $focusedItem = this._rowsView._getCellElement(row.rowIndex, columnIndex);
        this._delayedInputFocus($focusedItem, () => {
          setTimeout(() => {
            var _a;
            // @ts-expect-error
            focusedElement = domAdapter.getActiveElement((_a = this.component.$element()) === null || _a === void 0 ? void 0 : _a.get(0));
            if (selectionRange.selectionStart >= 0) {
              gridCoreUtils.setSelectionRange(focusedElement, selectionRange);
            }
          });
        });
      }
      deferred.resolve();
    });
  }
  /**
   * @extended: validating
   */
  _validateEditFormAfterUpdate() {}
  /**
   * @extended: validating
   */
  _addChange(changeParams, options) {
    var _a;
    var row = options === null || options === void 0 ? void 0 : options.row;
    var changes = [...this.getChanges()];
    var index = gridCoreUtils.getIndexByKey(changeParams.key, changes);
    if (index < 0) {
      index = changes.length;
      this._addInternalData({
        key: changeParams.key,
        oldData: changeParams.oldData
      });
      delete changeParams.oldData;
      changes.push(changeParams);
    }
    var change = _extends({}, changes[index]);
    if (change) {
      if (changeParams.data) {
        change.data = createObjectWithChanges(change.data, changeParams.data);
      }
      if ((!change.type || !changeParams.data) && changeParams.type) {
        change.type = changeParams.type;
      }
      if (row) {
        row.oldData = this._getOldData(row.key);
        row.data = createObjectWithChanges(row.data, changeParams.data);
      }
    }
    changes[index] = change;
    this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);
    // T1043517
    if (options && change !== ((_a = this.getChanges()) === null || _a === void 0 ? void 0 : _a[index])) {
      options.forceUpdateRow = true;
    }
    return change;
  }
  /**
   * @extended: adaptivity
   */
  _getFormEditItemTemplate(cellOptions, column) {
    return column.editCellTemplate || this._getDefaultEditorTemplate();
  }
  getColumnTemplate(options) {
    var _a;
    var {
      column
    } = options;
    var rowIndex = options.row && options.row.rowIndex;
    var template;
    var isRowMode = this.isRowBasedEditMode();
    var isRowEditing = this.isEditRow(rowIndex);
    var isCellEditing = this.isEditCell(rowIndex, options.columnIndex);
    var editingStartOptions;
    if ((column.showEditorAlways || column.setCellValue && (isRowEditing && column.allowEditing || isCellEditing)) && (options.rowType === 'data' || options.rowType === 'detailAdaptive') && !column.command) {
      var allowUpdating = this.allowUpdating(options);
      if (((allowUpdating || isRowEditing) && column.allowEditing || isCellEditing) && (isRowEditing || !isRowMode)) {
        if (column.showEditorAlways && !isRowMode) {
          editingStartOptions = {
            cancel: false,
            key: options.row.isNewRow ? undefined : options.row.key,
            data: options.row.data,
            column
          };
          this._isEditingStart(editingStartOptions);
        }
        if (!editingStartOptions || !editingStartOptions.cancel) {
          options.setValue = (value, text) => {
            this.updateFieldValue(options, value, text);
          };
        }
      }
      template = column.editCellTemplate || this._getDefaultEditorTemplate();
    } else if (column.command === 'detail' && options.rowType === 'detail' && isRowEditing) {
      template = (_a = this) === null || _a === void 0 ? void 0 : _a.getEditFormTemplate(options);
    }
    return template;
  }
  _createButton($container, button, options, change) {
    var icon = EDIT_ICON_CLASS[button.name];
    var useIcons = this.option('editing.useIcons');
    var useLegacyColumnButtonTemplate = this.option('useLegacyColumnButtonTemplate');
    var $button = $('<a>').attr('href', '#').addClass(LINK_CLASS).addClass(button.cssClass);
    if (button.template && useLegacyColumnButtonTemplate) {
      this._rowsView.renderTemplate($container, button.template, options, true);
    } else {
      if (button.template) {
        $button = $('<span>').addClass(button.cssClass);
      } else if (useIcons && icon || button.icon) {
        icon = button.icon || icon;
        var iconType = iconUtils.getImageSourceType(icon);
        if (iconType === 'image' || iconType === 'svg') {
          // @ts-expect-error
          $button = iconUtils.getImageContainer(icon).addClass(button.cssClass);
        } else {
          $button.addClass("dx-icon".concat(iconType === 'dxIcon' ? '-' : ' ').concat(icon)).attr('title', button.text);
        }
        $button.addClass(LINK_ICON_CLASS);
        $container.addClass(COMMAND_EDIT_WITH_ICONS_CLASS);
        var localizationName = this.getButtonLocalizationNames()[button.name];
        localizationName && $button.attr('aria-label', messageLocalization.format(localizationName));
      } else {
        $button.text(button.text);
      }
      if (isDefined(button.hint)) {
        $button.attr('title', button.hint);
      }
      if (this._isButtonDisabled(button, options)) {
        $button.addClass('dx-state-disabled');
      } else if (!button.template || button.onClick) {
        eventsEngine.on($button, addNamespace('click', EDITING_NAMESPACE), this.createAction(e => {
          var _a;
          (_a = button.onClick) === null || _a === void 0 ? void 0 : _a.call(button, extend({}, e, {
            row: options.row,
            column: options.column
          }));
          e.event.preventDefault();
          e.event.stopPropagation();
        }));
      }
      $container.append($button);
      if (button.template) {
        options.renderAsync = false;
        this._rowsView.renderTemplate($button, button.template, options, true, change);
      }
    }
  }
  /**
   * @extended: TreeList's editing
   */
  getButtonLocalizationNames() {
    return {
      edit: 'dxDataGrid-editingEditRow',
      save: 'dxDataGrid-editingSaveRowChanges',
      delete: 'dxDataGrid-editingDeleteRow',
      undelete: 'dxDataGrid-editingUndeleteRow',
      cancel: 'dxDataGrid-editingCancelRowChanges'
    };
  }
  prepareButtonItem(headerPanel, name, methodName, sortIndex) {
    var _a;
    var editingTexts = (_a = this.option('editing.texts')) !== null && _a !== void 0 ? _a : {};
    var titleButtonTextByClassNames = {
      revert: editingTexts.cancelAllChanges,
      save: editingTexts.saveAllChanges,
      addRow: editingTexts.addRow
    };
    var classNameButtonByNames = {
      revert: 'cancel',
      save: 'save',
      addRow: 'addrow'
    };
    var className = classNameButtonByNames[name];
    var onInitialized = e => {
      $(e.element).addClass(headerPanel._getToolbarButtonClass("".concat(EDIT_BUTTON_CLASS, " ").concat(this.addWidgetPrefix(className), "-button")));
    };
    var hintText = titleButtonTextByClassNames[name];
    var isButtonDisabled = (className === 'save' || className === 'cancel') && this._isEditButtonDisabled();
    return {
      widget: 'dxButton',
      options: {
        onInitialized,
        icon: "edit-button-".concat(className),
        disabled: isButtonDisabled,
        onClick: () => {
          setTimeout(() => {
            this[methodName]();
          });
        },
        text: hintText,
        hint: hintText
      },
      showText: 'inMenu',
      name: "".concat(name, "Button"),
      location: 'after',
      locateInMenu: 'auto',
      sortIndex
    };
  }
  prepareEditButtons(headerPanel) {
    var _a;
    var editingOptions = (_a = this.option('editing')) !== null && _a !== void 0 ? _a : {};
    var buttonItems = [];
    if (editingOptions.allowAdding) {
      buttonItems.push(this.prepareButtonItem(headerPanel, 'addRow', 'addRow', 20));
    }
    return buttonItems;
  }
  /**
   * @extended: validating
   */
  highlightDataCell($cell, params) {
    this.shouldHighlightCell(params) && $cell.addClass(CELL_MODIFIED);
  }
  /**
   * @extended: adaptivity
   */
  _afterInsertRow(key) {}
  /**
   * @extended: validating, TreeList's editing
   */
  // @ts-expect-error
  _beforeSaveEditData(change) {
    if (change && !isDefined(change.key) && isDefined(change.type)) {
      return true;
    }
  }
  /**
   * @extended: adaptivity, filter_row, validating
   */
  _afterSaveEditData() {}
  /**
   * @extended: adaptivity, validating
   */
  _beforeCancelEditData() {}
  _allowEditAction(actionName, options) {
    var allowEditAction = this.option("editing.".concat(actionName));
    if (isFunction(allowEditAction)) {
      allowEditAction = allowEditAction({
        component: this.component,
        row: options.row
      });
    }
    return allowEditAction;
  }
  allowUpdating(options, eventName) {
    var _a;
    var startEditAction = (_a = this.option('editing.startEditAction')) !== null && _a !== void 0 ? _a : DEFAULT_START_EDIT_ACTION;
    var needCallback = arguments.length > 1 ? startEditAction === eventName || eventName === 'down' : true;
    return needCallback && this._allowEditAction('allowUpdating', options);
  }
  allowDeleting(options) {
    return this._allowEditAction('allowDeleting', options);
  }
  /**
   * @extended: validating
   */
  isCellModified(parameters) {
    var _a, _b, _c;
    var {
      columnIndex
    } = parameters;
    var modifiedValue = (_b = (_a = parameters === null || parameters === void 0 ? void 0 : parameters.row) === null || _a === void 0 ? void 0 : _a.modifiedValues) === null || _b === void 0 ? void 0 : _b[columnIndex];
    if ((_c = parameters === null || parameters === void 0 ? void 0 : parameters.row) === null || _c === void 0 ? void 0 : _c.isNewRow) {
      modifiedValue = parameters.value;
    }
    return modifiedValue !== undefined;
  }
  isNewRowInEditMode() {
    var visibleEditRowIndex = this._getVisibleEditRowIndex();
    var rows = this._dataController.items();
    return visibleEditRowIndex >= 0 ? rows[visibleEditRowIndex].isNewRow : false;
  }
  _isRowDeleteAllowed() {}
  shouldHighlightCell(parameters) {
    var cellModified = this.isCellModified(parameters);
    return cellModified && parameters.column.setCellValue && (this.getEditMode() !== EDIT_MODE_ROW || !parameters.row.isEditing);
  }
}
export var dataControllerEditingExtenderMixin = Base => class DataControllerEditingExtender extends Base {
  reload(full, repaintChangesOnly) {
    !repaintChangesOnly && this._editingController.refresh();
    return super.reload.apply(this, arguments);
  }
  repaintRows() {
    if (this._editingController.isSaving()) return;
    return super.repaintRows.apply(this, arguments);
  }
  _updateEditRow(items) {
    var _a;
    var editRowKey = this.option(EDITING_EDITROWKEY_OPTION_NAME);
    var editRowIndex = gridCoreUtils.getIndexByKey(editRowKey, items);
    var editItem = items[editRowIndex];
    if (editItem) {
      editItem.isEditing = true;
      // @ts-expect-error Badly typed based class
      (_a = this._updateEditItem) === null || _a === void 0 ? void 0 : _a.call(this, editItem);
    }
  }
  _updateItemsCore(change) {
    super._updateItemsCore(change);
    this._updateEditRow(this.items(true));
  }
  _applyChangeUpdate(change) {
    this._updateEditRow(change.items);
    super._applyChangeUpdate(change);
  }
  _applyChangesOnly(change) {
    this._updateEditRow(change.items);
    super._applyChangesOnly(change);
  }
  _processItems(items, change) {
    items = this._editingController.processItems(items, change);
    return super._processItems(items, change);
  }
  _processDataItem(dataItem, options) {
    this._editingController.processDataItem(dataItem, options, this.generateDataValues);
    return super._processDataItem(dataItem, options);
  }
  _processItem(item, options) {
    item = super._processItem(item, options);
    if (item.isNewRow) {
      options.dataIndex--;
      delete item.dataIndex;
    }
    return item;
  }
  _getChangedColumnIndices(oldItem, newItem, rowIndex, isLiveUpdate) {
    if (oldItem.isNewRow !== newItem.isNewRow || oldItem.removed !== newItem.removed) {
      return;
    }
    return super._getChangedColumnIndices.apply(this, arguments);
  }
  _isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate) {
    var cell = oldRow.cells && oldRow.cells[columnIndex];
    var isEditing = this._editingController && this._editingController.isEditCell(visibleRowIndex, columnIndex);
    if (isLiveUpdate && isEditing) {
      return false;
    }
    if (cell && cell.column && !cell.column.showEditorAlways && cell.isEditing !== isEditing) {
      return true;
    }
    return super._isCellChanged.apply(this, arguments);
  }
  needToRefreshOnDataSourceChange(args) {
    var isParasiteChange = Array.isArray(args.value) && args.value === args.previousValue && this._editingController.isSaving();
    return !isParasiteChange;
  }
  _handleDataSourceChange(args) {
    var result = super._handleDataSourceChange(args);
    var changes = this.option('editing.changes');
    var dataSource = args.value;
    if (Array.isArray(dataSource) && changes.length) {
      var dataSourceKeys = dataSource.map(item => this.keyOf(item));
      var newChanges = changes.filter(change => change.type === 'insert' || dataSourceKeys.some(key => equalByValue(change.key, key)));
      if (newChanges.length !== changes.length) {
        this.option('editing.changes', newChanges);
      }
      var editRowKey = this.option('editing.editRowKey');
      var isEditNewItem = newChanges.some(change => change.type === 'insert' && equalByValue(editRowKey, change.key));
      if (!isEditNewItem && dataSourceKeys.every(key => !equalByValue(editRowKey, key))) {
        this.option('editing.editRowKey', null);
      }
    }
    return result;
  }
};
var rowsView = Base => class RowsViewEditingExtender extends Base {
  getCellIndex($cell, rowIndex) {
    if (!$cell.is('td') && rowIndex >= 0) {
      var $cellElements = this.getCellElements(rowIndex);
      var cellIndex = -1;
      each($cellElements, (index, cellElement) => {
        if ($(cellElement).find($cell).length) {
          cellIndex = index;
        }
      });
      return cellIndex;
    }
    return super.getCellIndex.apply(this, arguments);
  }
  publicMethods() {
    return super.publicMethods().concat(['cellValue']);
  }
  _getCellTemplate(options) {
    var template = this._editingController.getColumnTemplate(options);
    return template || super._getCellTemplate(options);
  }
  _createRow(row) {
    var $row = super._createRow.apply(this, arguments);
    if (row) {
      var isRowRemoved = !!row.removed;
      var isRowInserted = !!row.isNewRow;
      var isRowModified = !!row.modified;
      isRowInserted && $row.addClass(ROW_INSERTED);
      isRowModified && $row.addClass(ROW_MODIFIED);
      if (isRowInserted || isRowRemoved) {
        $row.removeClass(ROW_SELECTED);
      }
    }
    return $row;
  }
  _getColumnIndexByElement($element) {
    var $tableElement = $element.closest('table');
    var $tableElements = this.getTableElements();
    while ($tableElement.length && !$tableElements.filter($tableElement).length) {
      $element = $tableElement.closest('td');
      $tableElement = $element.closest('table');
    }
    return this._getColumnIndexByElementCore($element);
  }
  _getColumnIndexByElementCore($element) {
    var $targetElement = $element.closest(".".concat(ROW_CLASS, "> td:not(.dx-master-detail-cell)"));
    return this.getCellIndex($targetElement);
  }
  _editCellByClick(e, eventName) {
    var editingController = this._editingController;
    var $targetElement = $(e.event.target);
    var columnIndex = this._getColumnIndexByElement($targetElement);
    var row = this._dataController.items()[e.rowIndex];
    var allowUpdating = editingController.allowUpdating({
      row
    }, eventName) || row && row.isNewRow;
    var column = this._columnsController.getVisibleColumns()[columnIndex];
    var isEditedCell = editingController.isEditCell(e.rowIndex, columnIndex);
    var allowEditing = allowUpdating && column && (column.allowEditing || isEditedCell);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var startEditAction = this.option('editing.startEditAction') || 'click';
    var isShowEditorAlways = column && column.showEditorAlways;
    if (isEditedCell) {
      return true;
    }
    if (eventName === 'down') {
      if (devices.real().ios || devices.real().android) {
        resetActiveElement();
      }
      return isShowEditorAlways && allowEditing && editingController.editCell(e.rowIndex, columnIndex);
    }
    if (eventName === 'click' && startEditAction === 'dblClick' && this._pointerDownTarget === $targetElement.get(0)) {
      var isError = false;
      var withoutSaveEditData = row === null || row === void 0 ? void 0 : row.isNewRow;
      editingController.closeEditCell(isError, withoutSaveEditData);
    }
    if (allowEditing && eventName === startEditAction) {
      return editingController.editCell(e.rowIndex, columnIndex) || editingController.isEditRow(e.rowIndex);
    }
  }
  _rowPointerDown(e) {
    this._pointerDownTarget = e.event.target;
    this._pointerDownTimeout = setTimeout(() => {
      this._editCellByClick(e, 'down');
    });
  }
  _rowClickTreeListHack(e) {
    // @ts-expect-error
    super._rowClick.apply(this, arguments);
  }
  _rowClick(e) {
    var isEditForm = $(e.rowElement).hasClass(this.addWidgetPrefix(EDIT_FORM_CLASS));
    e.event[TARGET_COMPONENT_NAME] = this.component;
    if (!this._editCellByClick(e, 'click') && !isEditForm) {
      super._rowClick.apply(this, arguments);
    }
  }
  _rowDblClickTreeListHack(e) {
    // @ts-expect-error
    super._rowDblClick.apply(this, arguments);
  }
  _rowDblClick(e) {
    if (!this._editCellByClick(e, 'dblClick')) {
      super._rowDblClick.apply(this, arguments);
    }
  }
  _cellPrepared($cell, parameters) {
    var _a;
    var editingController = this._editingController;
    var isCommandCell = !!parameters.column.command;
    var isEditableCell = parameters.setValue;
    var isEditRow = editingController.isEditRow(parameters.rowIndex);
    var isEditing = isEditingCell(isEditRow, parameters);
    if (isEditingOrShowEditorAlwaysDataCell(isEditRow, parameters)) {
      var {
        alignment
      } = parameters.column;
      $cell.toggleClass(this.addWidgetPrefix(READONLY_CLASS), !isEditableCell).toggleClass(CELL_FOCUS_DISABLED_CLASS, !isEditableCell);
      if (alignment) {
        $cell.find(EDITORS_INPUT_SELECTOR).first().css('textAlign', alignment);
      }
    }
    if (isEditing) {
      // @ts-expect-error
      this._editCellPrepared($cell);
    }
    var hasTemplate = !!((_a = parameters.column) === null || _a === void 0 ? void 0 : _a.cellTemplate);
    if (parameters.column && !isCommandCell && (!hasTemplate || editingController.shouldHighlightCell(parameters))) {
      editingController.highlightDataCell($cell, parameters);
    }
    super._cellPrepared.apply(this, arguments);
  }
  _getCellOptions(options) {
    var cellOptions = super._getCellOptions(options);
    var {
      columnIndex,
      row
    } = options;
    cellOptions.isEditing = this._editingController.isEditCell(cellOptions.rowIndex, cellOptions.columnIndex);
    cellOptions.removed = row.removed;
    if (row.modified) {
      cellOptions.modified = row.modifiedValues[columnIndex] !== undefined;
    }
    return cellOptions;
  }
  _setCellAriaAttributes($cell, cellOptions) {
    super._setCellAriaAttributes($cell, cellOptions);
    if (cellOptions.removed) {
      this.setAria('roledescription', messageLocalization.format('dxDataGrid-ariaDeletedCell'), $cell);
    }
    if (cellOptions.modified) {
      this.setAria('roledescription', messageLocalization.format('dxDataGrid-ariaModifiedCell'), $cell);
    }
    var isEditableCell = cellOptions.column.allowEditing && !cellOptions.removed && !cellOptions.modified && cellOptions.rowType === 'data' && cellOptions.column.calculateCellValue === cellOptions.column.defaultCalculateCellValue && this._editingController.isCellBasedEditMode();
    if (isEditableCell) {
      this.setAria('roledescription', messageLocalization.format('dxDataGrid-ariaEditableCell'), $cell);
    }
  }
  _createCell(options) {
    var $cell = super._createCell(options);
    var isEditRow = this._editingController.isEditRow(options.rowIndex);
    isEditingOrShowEditorAlwaysDataCell(isEditRow, options) && $cell.addClass(EDITOR_CELL_CLASS);
    return $cell;
  }
  cellValue(rowIndex, columnIdentifier, value, text) {
    var cellOptions = this.getCellOptions(rowIndex, columnIdentifier);
    if (cellOptions) {
      if (value === undefined) {
        return cellOptions.value;
      }
      this._editingController.updateFieldValue(cellOptions, value, text, true);
    }
  }
  dispose() {
    super.dispose.apply(this, arguments);
    clearTimeout(this._pointerDownTimeout);
  }
  _renderCore() {
    super._renderCore.apply(this, arguments);
    return this.waitAsyncTemplates(true).done(() => {
      this._editingController._focusEditorIfNeed();
    });
  }
  _editCellPrepared() {}
  _formItemPrepared() {}
};
var headerPanel = Base => class HeaderPanelEditingExtender extends Base {
  optionChanged(args) {
    var {
      fullName
    } = args;
    switch (args.name) {
      case 'editing':
        {
          var excludedOptions = [EDITING_POPUP_OPTION_NAME, EDITING_CHANGES_OPTION_NAME, EDITING_EDITCOLUMNNAME_OPTION_NAME, EDITING_EDITROWKEY_OPTION_NAME];
          var shouldInvalidate = fullName && !excludedOptions.some(optionName => optionName === fullName);
          shouldInvalidate && this._invalidate();
          super.optionChanged(args);
          break;
        }
      case 'useLegacyColumnButtonTemplate':
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
  _getToolbarItems() {
    var items = super._getToolbarItems();
    var editButtonItems = this._editingController.prepareEditButtons(this);
    return editButtonItems.concat(items);
  }
  isVisible() {
    var editingOptions = this._editingController.option('editing');
    // @ts-expect-error
    return super.isVisible() || (editingOptions === null || editingOptions === void 0 ? void 0 : editingOptions.allowAdding);
  }
};
export var editingModule = {
  defaultOptions() {
    return {
      editing: {
        mode: 'row',
        refreshMode: 'full',
        newRowPosition: VIEWPORT_TOP_NEW_ROW_POSITION,
        allowAdding: false,
        allowUpdating: false,
        allowDeleting: false,
        useIcons: false,
        selectTextOnEditStart: false,
        confirmDelete: true,
        texts: {
          editRow: messageLocalization.format('dxDataGrid-editingEditRow'),
          saveAllChanges: messageLocalization.format('dxDataGrid-editingSaveAllChanges'),
          saveRowChanges: messageLocalization.format('dxDataGrid-editingSaveRowChanges'),
          cancelAllChanges: messageLocalization.format('dxDataGrid-editingCancelAllChanges'),
          cancelRowChanges: messageLocalization.format('dxDataGrid-editingCancelRowChanges'),
          addRow: messageLocalization.format('dxDataGrid-editingAddRow'),
          deleteRow: messageLocalization.format('dxDataGrid-editingDeleteRow'),
          undeleteRow: messageLocalization.format('dxDataGrid-editingUndeleteRow'),
          confirmDeleteMessage: messageLocalization.format('dxDataGrid-editingConfirmDeleteMessage'),
          confirmDeleteTitle: ''
        },
        form: {
          colCount: 2
        },
        popup: {},
        startEditAction: 'click',
        editRowKey: null,
        editColumnName: null,
        changes: []
      },
      useLegacyColumnButtonTemplate: false
    };
  },
  controllers: {
    editing: EditingControllerImpl
  },
  extenders: {
    controllers: {
      data: dataControllerEditingExtenderMixin
    },
    views: {
      rowsView,
      headerPanel
    }
  }
};
