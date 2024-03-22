/**
* DevExtreme (esm/__internal/grids/grid_core/editing/m_editing_cell_based.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable max-classes-per-file */
import domAdapter from '../../../../core/dom_adapter';
import $ from '../../../../core/renderer';
import { deferRender } from '../../../../core/utils/common';
import { Deferred, when } from '../../../../core/utils/deferred';
import { isElementInDom } from '../../../../core/utils/dom';
import { isDefined, isString } from '../../../../core/utils/type';
import { createObjectWithChanges } from '../../../../data/array_utils';
import { name as clickEventName } from '../../../../events/click';
import eventsEngine from '../../../../events/core/events_engine';
import holdEvent from '../../../../events/hold';
import pointerEvents from '../../../../events/pointer';
import { addNamespace } from '../../../../events/utils/index';
import { ADD_ROW_BUTTON_CLASS, CELL_MODIFIED_CLASS, DATA_EDIT_DATA_REMOVE_TYPE, DATA_ROW_CLASS, DROPDOWN_EDITOR_OVERLAY_CLASS, EDIT_MODE_BATCH, EDIT_MODE_CELL, EDITING_EDITCOLUMNNAME_OPTION_NAME, EDITING_EDITROWKEY_OPTION_NAME, EDITOR_CELL_CLASS, FOCUS_OVERLAY_CLASS, ROW_CLASS, ROW_REMOVED, TARGET_COMPONENT_NAME } from './const';
import { isEditable } from './m_editing_utils';
var editingControllerExtender = Base => class CellBasedEditingControllerExtender extends Base {
  init() {
    var needCreateHandlers = !this._saveEditorHandler;
    super.init();
    if (needCreateHandlers) {
      // chrome 73+
      var $pointerDownTarget;
      var isResizing;
      this._pointerUpEditorHandler = () => {
        var _a;
        isResizing = (_a = this._columnsResizerController) === null || _a === void 0 ? void 0 : _a.isResizing();
      };
      // eslint-disable-next-line no-return-assign
      this._pointerDownEditorHandler = e => $pointerDownTarget = $(e.target);
      this._saveEditorHandler = this.createAction(function (e) {
        var {
          event
        } = e;
        var $target = $(event.target);
        var targetComponent = event[TARGET_COMPONENT_NAME];
        var {
          component
        } = this;
        if (isEditable($pointerDownTarget) && !$pointerDownTarget.is($target)) {
          return;
        }
        function checkEditorPopup($element) {
          if (!$element) {
            return false;
          }
          var $dropDownEditorOverlay = $element.closest(".".concat(DROPDOWN_EDITOR_OVERLAY_CLASS));
          var $componentElement = component.$element();
          return $dropDownEditorOverlay.length > 0 && $componentElement.closest($dropDownEditorOverlay).length === 0;
        }
        if (this.isCellOrBatchEditMode() && !this._editCellInProgress) {
          var isEditorPopup = checkEditorPopup($target) || checkEditorPopup(targetComponent === null || targetComponent === void 0 ? void 0 : targetComponent.$element());
          var isAnotherComponent = targetComponent && !targetComponent._disposed && targetComponent !== this.component;
          var isAddRowButton = !!$target.closest(".".concat(this.addWidgetPrefix(ADD_ROW_BUTTON_CLASS))).length;
          var isFocusOverlay = $target.hasClass(this.addWidgetPrefix(FOCUS_OVERLAY_CLASS));
          var isCellEditMode = this.isCellEditMode();
          if (!isResizing && !isEditorPopup && !isFocusOverlay && !(isAddRowButton && isCellEditMode && this.isEditing()) && (isElementInDom($target) || isAnotherComponent)) {
            this._closeEditItem.bind(this)($target);
          }
        }
      });
      eventsEngine.on(domAdapter.getDocument(), pointerEvents.up, this._pointerUpEditorHandler);
      eventsEngine.on(domAdapter.getDocument(), pointerEvents.down, this._pointerDownEditorHandler);
      eventsEngine.on(domAdapter.getDocument(), clickEventName, this._saveEditorHandler);
    }
  }
  isCellEditMode() {
    return this.option('editing.mode') === EDIT_MODE_CELL;
  }
  isBatchEditMode() {
    return this.option('editing.mode') === EDIT_MODE_BATCH;
  }
  /**
   * interface override
   */
  isCellOrBatchEditMode() {
    return this.isCellEditMode() || this.isBatchEditMode();
  }
  _needToCloseEditableCell($targetElement) {
    var _a;
    var $element = this.component.$element();
    var result = this.isEditing();
    var isCurrentComponentElement = !$element || !!$targetElement.closest($element).length;
    if (isCurrentComponentElement) {
      var isDataRow = $targetElement.closest(".".concat(DATA_ROW_CLASS)).length;
      if (isDataRow) {
        var $targetCell = $targetElement.closest(".".concat(ROW_CLASS, "> td"));
        var rowIndex = this._rowsView.getRowIndex($targetCell.parent());
        var cellElements = this._rowsView.getCellElements(rowIndex);
        if (cellElements === null || cellElements === void 0 ? void 0 : cellElements.length) {
          var columnIndex = cellElements.index($targetCell);
          var visibleColumns = this._columnsController.getVisibleColumns();
          // TODO jsdmitry: Move this code to _rowClick method of rowsView
          var allowEditing = (_a = visibleColumns[columnIndex]) === null || _a === void 0 ? void 0 : _a.allowEditing;
          var isEditingCell = this.isEditCell(rowIndex, columnIndex);
          result = result && !allowEditing && !isEditingCell;
        }
      }
    }
    return result || super._needToCloseEditableCell($targetElement);
  }
  _closeEditItem($targetElement) {
    if (this._needToCloseEditableCell($targetElement)) {
      this.closeEditCell();
    }
  }
  _focusEditorIfNeed() {
    var _a;
    if (this._needFocusEditor && this.isCellOrBatchEditMode()) {
      var editColumnIndex = this._getVisibleEditColumnIndex();
      var $cell = (_a = this._rowsView) === null || _a === void 0 ? void 0 : _a._getCellElement(this._getVisibleEditRowIndex(), editColumnIndex); // T319885
      if ($cell && !$cell.find(':focus').length) {
        this._focusEditingCell(() => {
          this._editCellInProgress = false;
        }, $cell, true);
      } else {
        this._editCellInProgress = false;
      }
      this._needFocusEditor = false;
    } else {
      super._focusEditorIfNeed();
    }
  }
  isEditing() {
    if (this.isCellOrBatchEditMode()) {
      var isEditRowKeyDefined = isDefined(this.option(EDITING_EDITROWKEY_OPTION_NAME));
      var isEditColumnNameDefined = isDefined(this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME));
      return isEditRowKeyDefined && isEditColumnNameDefined;
    }
    return super.isEditing();
  }
  _handleEditColumnNameChange(args) {
    var oldRowIndex = this._getVisibleEditRowIndex(args.previousValue);
    if (this.isCellOrBatchEditMode() && oldRowIndex !== -1 && isDefined(args.value) && args.value !== args.previousValue) {
      var columnIndex = this._columnsController.getVisibleColumnIndex(args.value);
      var oldColumnIndex = this._columnsController.getVisibleColumnIndex(args.previousValue);
      this._editCellFromOptionChanged(columnIndex, oldColumnIndex, oldRowIndex);
    }
  }
  _addRow(parentKey) {
    if (this.isCellEditMode() && this.hasChanges()) {
      // @ts-expect-error
      var deferred = new Deferred();
      this.saveEditData().done(() => {
        // T804894
        if (!this.hasChanges()) {
          this.addRow(parentKey).done(deferred.resolve).fail(deferred.reject);
        } else {
          deferred.reject('cancel');
        }
      });
      return deferred.promise();
    }
    return super._addRow(parentKey);
  }
  /**
   * interface override
   */
  editCell(rowIndex, columnIndex) {
    return this._editCell({
      rowIndex,
      columnIndex
    });
  }
  _editCell(options) {
    // @ts-expect-error
    var d = new Deferred();
    var coreResult;
    this.executeOperation(d, () => {
      coreResult = this._editCellCore(options);
      when(coreResult).done(d.resolve).fail(d.reject);
    });
    return coreResult !== undefined ? coreResult : d.promise();
  }
  _editCellCore(options) {
    var dataController = this._dataController;
    var isEditByOptionChanged = isDefined(options.oldColumnIndex) || isDefined(options.oldRowIndex);
    var {
      columnIndex,
      rowIndex,
      column,
      item
    } = this._getNormalizedEditCellOptions(options);
    var params = {
      data: item === null || item === void 0 ? void 0 : item.data,
      cancel: false,
      column
    };
    if (item.key === undefined) {
      this._dataController.fireError('E1043');
      return;
    }
    if (column && (item.rowType === 'data' || item.rowType === 'detailAdaptive') && !item.removed && this.isCellOrBatchEditMode()) {
      if (!isEditByOptionChanged && this.isEditCell(rowIndex, columnIndex)) {
        return true;
      }
      var editRowIndex = rowIndex + dataController.getRowIndexOffset();
      return when(this._beforeEditCell(rowIndex, columnIndex, item)).done(cancel => {
        if (cancel) {
          return;
        }
        if (!this._prepareEditCell(params, item, columnIndex, editRowIndex)) {
          this._processCanceledEditingCell();
        }
      });
    }
    return false;
  }
  /**
   * @returns whether to cancel cell editing
   */
  _beforeEditCell(rowIndex, columnIndex, item) {
    if (this.isCellEditMode() && !item.isNewRow && this.hasChanges()) {
      // @ts-expect-error
      var isSaving = new Deferred();
      this.saveEditData().always(() => {
        isSaving.resolve(this.hasChanges());
      });
      this.addDeferred(isSaving);
      return isSaving;
    }
    return false;
  }
  publicMethods() {
    var publicMethods = super.publicMethods();
    return publicMethods.concat(['editCell', 'closeEditCell']);
  }
  _getNormalizedEditCellOptions(_ref) {
    var {
      oldColumnIndex,
      oldRowIndex,
      columnIndex,
      rowIndex
    } = _ref;
    var columnsController = this._columnsController;
    var visibleColumns = columnsController.getVisibleColumns();
    var items = this._dataController.items();
    var item = items[rowIndex];
    var oldColumn;
    if (isDefined(oldColumnIndex)) {
      oldColumn = visibleColumns[oldColumnIndex];
    } else {
      oldColumn = this._getEditColumn();
    }
    if (!isDefined(oldRowIndex)) {
      oldRowIndex = this._getVisibleEditRowIndex();
    }
    if (isString(columnIndex)) {
      columnIndex = columnsController.columnOption(columnIndex, 'index');
      columnIndex = columnsController.getVisibleIndex(columnIndex);
    }
    var column = visibleColumns[columnIndex];
    return {
      oldColumn,
      columnIndex,
      oldRowIndex,
      rowIndex,
      column,
      item
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prepareEditCell(params, item, editColumnIndex, editRowIndex) {
    var _a;
    if (!item.isNewRow) {
      params.key = item.key;
    }
    if (this._isEditingStart(params)) {
      return false;
    }
    this._pageIndex = this._dataController.pageIndex();
    this._setEditRowKey(item.key);
    this._setEditColumnNameByIndex(editColumnIndex);
    if (!params.column.showEditorAlways) {
      this._addInternalData({
        key: item.key,
        oldData: (_a = item.oldData) !== null && _a !== void 0 ? _a : item.data
      });
    }
    return true;
  }
  /**
   * interface override
   */
  closeEditCell(isError, withoutSaveEditData) {
    var result = when();
    var oldEditRowIndex = this._getVisibleEditRowIndex();
    if (this.isCellOrBatchEditMode()) {
      // @ts-expect-error
      var deferred = new Deferred();
      // @ts-expect-error
      result = new Deferred();
      this.executeOperation(deferred, () => {
        this._closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData).always(result.resolve);
      });
    }
    return result.promise();
  }
  _closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData) {
    var dataController = this._dataController;
    // @ts-expect-error
    var deferred = new Deferred();
    var promise = deferred.promise();
    if (this.isCellEditMode() && this.hasChanges()) {
      if (!withoutSaveEditData) {
        this.saveEditData().done(error => {
          if (!this.hasChanges()) {
            this.closeEditCell(!!error).always(deferred.resolve);
            return;
          }
          deferred.resolve();
        });
        return promise;
      }
    } else {
      this._resetEditRowKey();
      this._resetEditColumnName();
      if (oldEditRowIndex >= 0) {
        var rowIndices = [oldEditRowIndex];
        this._beforeCloseEditCellInBatchMode(rowIndices);
        if (!isError) {
          dataController.updateItems({
            changeType: 'update',
            rowIndices
          });
        }
      }
    }
    deferred.resolve();
    return promise;
  }
  _resetModifiedClassCells(changes) {
    if (this.isBatchEditMode()) {
      var columnsCount = this._columnsController.getVisibleColumns().length;
      changes.forEach(_ref2 => {
        var {
          key
        } = _ref2;
        var rowIndex = this._dataController.getRowIndexByKey(key);
        for (var columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
          var cellElement = this._rowsView._getCellElement(rowIndex, columnIndex);
          cellElement === null || cellElement === void 0 ? void 0 : cellElement.removeClass(CELL_MODIFIED_CLASS);
        }
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prepareChange(options, value, text) {
    var $cellElement = $(options.cellElement);
    if (this.isBatchEditMode() && options.key !== undefined) {
      this._applyModified($cellElement, options);
    }
    return super._prepareChange(options, value, text);
  }
  _cancelSaving(result) {
    var dataController = this._dataController;
    if (this.isCellOrBatchEditMode()) {
      if (this.isBatchEditMode()) {
        this._resetEditIndices();
      }
      dataController.updateItems();
    }
    super._cancelSaving(result);
  }
  optionChanged(args) {
    var {
      fullName
    } = args;
    if (args.name === 'editing' && fullName === EDITING_EDITCOLUMNNAME_OPTION_NAME) {
      this._handleEditColumnNameChange(args);
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }
  _editCellFromOptionChanged(columnIndex, oldColumnIndex, oldRowIndex) {
    var columns = this._columnsController.getVisibleColumns();
    if (columnIndex > -1) {
      deferRender(() => {
        this._repaintEditCell(columns[columnIndex], columns[oldColumnIndex], oldRowIndex);
      });
    }
  }
  _handleEditRowKeyChange(args) {
    var _a;
    if (this.isCellOrBatchEditMode()) {
      var columnIndex = this._getVisibleEditColumnIndex();
      var oldRowIndexCorrection = this._getEditRowIndexCorrection();
      var oldRowIndex = this._dataController.getRowIndexByKey(args.previousValue) + oldRowIndexCorrection;
      if (isDefined(args.value) && args.value !== args.previousValue) {
        (_a = this._editCellFromOptionChanged) === null || _a === void 0 ? void 0 : _a.call(this, columnIndex, columnIndex, oldRowIndex);
      }
    } else {
      super._handleEditRowKeyChange(args);
    }
  }
  deleteRow(rowIndex) {
    if (this.isCellEditMode() && this.isEditing()) {
      var {
        isNewRow
      } = this._dataController.items()[rowIndex];
      var rowKey = this._dataController.getKeyByRowIndex(rowIndex);
      // T850905
      this.closeEditCell(null, isNewRow).always(() => {
        rowIndex = this._dataController.getRowIndexByKey(rowKey);
        this._checkAndDeleteRow(rowIndex);
      });
    } else {
      super.deleteRow(rowIndex);
    }
  }
  _checkAndDeleteRow(rowIndex) {
    if (this.isBatchEditMode()) {
      this._deleteRowCore(rowIndex);
    } else {
      super._checkAndDeleteRow(rowIndex);
    }
  }
  _refreshCore(params) {
    var {
      isPageChanged
    } = params !== null && params !== void 0 ? params : {};
    var needResetIndexes = this.isBatchEditMode() || isPageChanged && this.option('scrolling.mode') !== 'virtual';
    if (this.isCellOrBatchEditMode()) {
      if (needResetIndexes) {
        this._resetEditColumnName();
        this._resetEditRowKey();
      }
    } else {
      super._refreshCore(params);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _allowRowAdding(params) {
    if (this.isBatchEditMode()) {
      return true;
    }
    return super._allowRowAdding(params);
  }
  _afterDeleteRow(rowIndex, oldEditRowIndex) {
    var dataController = this._dataController;
    if (this.isBatchEditMode()) {
      dataController.updateItems({
        changeType: 'update',
        rowIndices: [oldEditRowIndex, rowIndex]
      });
      // @ts-expect-error
      return new Deferred().resolve();
    }
    return super._afterDeleteRow(rowIndex, oldEditRowIndex);
  }
  _updateEditRow(row, forceUpdateRow, isCustomSetCellValue) {
    if (this.isCellOrBatchEditMode()) {
      this._updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue);
    } else {
      super._updateEditRow(row, forceUpdateRow, isCustomSetCellValue);
    }
  }
  _isDefaultButtonVisible(button, options) {
    if (this.isCellOrBatchEditMode()) {
      var isBatchMode = this.isBatchEditMode();
      switch (button.name) {
        case 'save':
        case 'cancel':
        case 'edit':
          return false;
        case 'delete':
          return super._isDefaultButtonVisible(button, options) && (!isBatchMode || !options.row.removed);
        case 'undelete':
          return isBatchMode && this.allowDeleting(options) && options.row.removed;
        default:
          return super._isDefaultButtonVisible(button, options);
      }
    }
    return super._isDefaultButtonVisible(button, options);
  }
  _isRowDeleteAllowed() {
    var callBaseResult = super._isRowDeleteAllowed();
    return callBaseResult || this.isBatchEditMode();
  }
  _beforeEndSaving(changes) {
    var _a;
    if (this.isCellEditMode()) {
      if (((_a = changes[0]) === null || _a === void 0 ? void 0 : _a.type) !== 'update') {
        super._beforeEndSaving(changes);
      }
    } else {
      if (this.isBatchEditMode()) {
        this._resetModifiedClassCells(changes);
      }
      super._beforeEndSaving(changes);
    }
  }
  prepareEditButtons(headerPanel) {
    var _a;
    var editingOptions = (_a = this.option('editing')) !== null && _a !== void 0 ? _a : {};
    var buttonItems = super.prepareEditButtons(headerPanel);
    var needEditingButtons = editingOptions.allowUpdating || editingOptions.allowAdding || editingOptions.allowDeleting;
    if (needEditingButtons && this.isBatchEditMode()) {
      buttonItems.push(this.prepareButtonItem(headerPanel, 'save', 'saveEditData', 21));
      buttonItems.push(this.prepareButtonItem(headerPanel, 'revert', 'cancelEditData', 22));
    }
    return buttonItems;
  }
  _saveEditDataInner() {
    var editRow = this._dataController.getVisibleRows()[this.getEditRowIndex()];
    var editColumn = this._getEditColumn();
    var showEditorAlways = editColumn === null || editColumn === void 0 ? void 0 : editColumn.showEditorAlways;
    var isUpdateInCellMode = this.isCellEditMode() && !(editRow === null || editRow === void 0 ? void 0 : editRow.isNewRow);
    var deferred;
    if (isUpdateInCellMode && showEditorAlways) {
      // @ts-expect-error
      deferred = new Deferred();
      this.addDeferred(deferred);
    }
    return super._saveEditDataInner().always(deferred === null || deferred === void 0 ? void 0 : deferred.resolve);
  }
  _applyChange(options, params, forceUpdateRow) {
    var isUpdateInCellMode = this.isCellEditMode() && options.row && !options.row.isNewRow;
    var {
      showEditorAlways
    } = options.column;
    var isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue;
    var focusPreviousEditingCell = showEditorAlways && !forceUpdateRow && isUpdateInCellMode && this.hasEditData() && !this.isEditCell(options.rowIndex, options.columnIndex);
    if (focusPreviousEditingCell) {
      this._focusEditingCell();
      this._updateEditRow(options.row, true, isCustomSetCellValue);
      return;
    }
    return super._applyChange(options, params, forceUpdateRow);
  }
  _applyChangeCore(options, forceUpdateRow) {
    var {
      showEditorAlways
    } = options.column;
    var isUpdateInCellMode = this.isCellEditMode() && options.row && !options.row.isNewRow;
    if (showEditorAlways && !forceUpdateRow) {
      if (isUpdateInCellMode) {
        this._setEditRowKey(options.row.key, true);
        this._setEditColumnNameByIndex(options.columnIndex, true);
        return this.saveEditData();
      }
      if (this.isBatchEditMode()) {
        forceUpdateRow = this._needUpdateRow(options.column);
        return super._applyChangeCore(options, forceUpdateRow);
      }
    }
    return super._applyChangeCore(options, forceUpdateRow);
  }
  _processDataItemCore(item, change, key, columns, generateDataValues) {
    var {
      data,
      type
    } = change;
    if (this.isBatchEditMode() && type === DATA_EDIT_DATA_REMOVE_TYPE) {
      item.data = createObjectWithChanges(item.data, data);
    }
    super._processDataItemCore(item, change, key, columns, generateDataValues);
  }
  _processRemoveCore(changes, editIndex, processIfBatch) {
    if (this.isBatchEditMode() && !processIfBatch) {
      return;
    }
    return super._processRemoveCore(changes, editIndex, processIfBatch);
  }
  _processRemoveIfError(changes, editIndex) {
    if (this.isBatchEditMode()) {
      return;
    }
    return super._processRemoveIfError(changes, editIndex);
  }
  _beforeFocusElementInRow(rowIndex) {
    super._beforeFocusElementInRow(rowIndex);
    var editRowIndex = rowIndex >= 0 ? rowIndex : 0;
    var columnIndex = this.getFirstEditableColumnIndex();
    columnIndex >= 0 && this.editCell(editRowIndex, columnIndex);
  }
};
var rowsView = Base => class RowsViewEditingCellBasedExtender extends Base {
  _createTable() {
    var $table = super._createTable.apply(this, arguments);
    var editingController = this._editingController;
    if (editingController.isCellOrBatchEditMode() && this.option('editing.allowUpdating')) {
      eventsEngine.on($table, addNamespace(holdEvent.name, 'dxDataGridRowsView'), "td:not(.".concat(EDITOR_CELL_CLASS, ")"), this.createAction(() => {
        if (editingController.isEditing()) {
          editingController.closeEditCell();
        }
      }));
    }
    return $table;
  }
  _createRow(row) {
    var $row = super._createRow.apply(this, arguments);
    if (row) {
      var editingController = this._editingController;
      var isRowRemoved = !!row.removed;
      // @ts-expect-error
      if (editingController.isBatchEditMode()) {
        isRowRemoved && $row.addClass(ROW_REMOVED);
      }
    }
    return $row;
  }
};
var headerPanel = Base => class HeaderPanelEditingCellBasedExtender extends Base {
  isVisible() {
    var editingOptions = this._editingController.option('editing');
    // @ts-expect-error
    return super.isVisible() || editingOptions && (editingOptions.allowUpdating || editingOptions.allowDeleting) && editingOptions.mode === EDIT_MODE_BATCH;
  }
};
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export var editingCellBasedModule = {
  extenders: {
    controllers: {
      editing: editingControllerExtender
    },
    views: {
      rowsView,
      headerPanel
    }
  }
};
