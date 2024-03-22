/**
* DevExtreme (bundles/__internal/grids/grid_core/editing/m_editing_cell_based.js)
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
exports.editingCellBasedModule = void 0;
var _dom_adapter = _interopRequireDefault(require("../../../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _dom = require("../../../../core/utils/dom");
var _type = require("../../../../core/utils/type");
var _array_utils = require("../../../../data/array_utils");
var _click = require("../../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _hold = _interopRequireDefault(require("../../../../events/hold"));
var _pointer = _interopRequireDefault(require("../../../../events/pointer"));
var _index = require("../../../../events/utils/index");
var _const = require("./const");
var _m_editing_utils = require("./m_editing_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const editingControllerExtender = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(CellBasedEditingControllerExtender, _Base);
  function CellBasedEditingControllerExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto = CellBasedEditingControllerExtender.prototype;
  _proto.init = function init() {
    const needCreateHandlers = !this._saveEditorHandler;
    _Base.prototype.init.call(this);
    if (needCreateHandlers) {
      // chrome 73+
      let $pointerDownTarget;
      let isResizing;
      this._pointerUpEditorHandler = () => {
        var _a;
        isResizing = (_a = this._columnsResizerController) === null || _a === void 0 ? void 0 : _a.isResizing();
      };
      // eslint-disable-next-line no-return-assign
      this._pointerDownEditorHandler = e => $pointerDownTarget = (0, _renderer.default)(e.target);
      this._saveEditorHandler = this.createAction(function (e) {
        const {
          event
        } = e;
        const $target = (0, _renderer.default)(event.target);
        const targetComponent = event[_const.TARGET_COMPONENT_NAME];
        const {
          component
        } = this;
        if ((0, _m_editing_utils.isEditable)($pointerDownTarget) && !$pointerDownTarget.is($target)) {
          return;
        }
        function checkEditorPopup($element) {
          if (!$element) {
            return false;
          }
          const $dropDownEditorOverlay = $element.closest(".".concat(_const.DROPDOWN_EDITOR_OVERLAY_CLASS));
          const $componentElement = component.$element();
          return $dropDownEditorOverlay.length > 0 && $componentElement.closest($dropDownEditorOverlay).length === 0;
        }
        if (this.isCellOrBatchEditMode() && !this._editCellInProgress) {
          const isEditorPopup = checkEditorPopup($target) || checkEditorPopup(targetComponent === null || targetComponent === void 0 ? void 0 : targetComponent.$element());
          const isAnotherComponent = targetComponent && !targetComponent._disposed && targetComponent !== this.component;
          const isAddRowButton = !!$target.closest(".".concat(this.addWidgetPrefix(_const.ADD_ROW_BUTTON_CLASS))).length;
          const isFocusOverlay = $target.hasClass(this.addWidgetPrefix(_const.FOCUS_OVERLAY_CLASS));
          const isCellEditMode = this.isCellEditMode();
          if (!isResizing && !isEditorPopup && !isFocusOverlay && !(isAddRowButton && isCellEditMode && this.isEditing()) && ((0, _dom.isElementInDom)($target) || isAnotherComponent)) {
            this._closeEditItem.bind(this)($target);
          }
        }
      });
      _events_engine.default.on(_dom_adapter.default.getDocument(), _pointer.default.up, this._pointerUpEditorHandler);
      _events_engine.default.on(_dom_adapter.default.getDocument(), _pointer.default.down, this._pointerDownEditorHandler);
      _events_engine.default.on(_dom_adapter.default.getDocument(), _click.name, this._saveEditorHandler);
    }
  };
  _proto.isCellEditMode = function isCellEditMode() {
    return this.option('editing.mode') === _const.EDIT_MODE_CELL;
  };
  _proto.isBatchEditMode = function isBatchEditMode() {
    return this.option('editing.mode') === _const.EDIT_MODE_BATCH;
  }
  /**
   * interface override
   */;
  _proto.isCellOrBatchEditMode = function isCellOrBatchEditMode() {
    return this.isCellEditMode() || this.isBatchEditMode();
  };
  _proto._needToCloseEditableCell = function _needToCloseEditableCell($targetElement) {
    var _a;
    const $element = this.component.$element();
    let result = this.isEditing();
    const isCurrentComponentElement = !$element || !!$targetElement.closest($element).length;
    if (isCurrentComponentElement) {
      const isDataRow = $targetElement.closest(".".concat(_const.DATA_ROW_CLASS)).length;
      if (isDataRow) {
        const $targetCell = $targetElement.closest(".".concat(_const.ROW_CLASS, "> td"));
        const rowIndex = this._rowsView.getRowIndex($targetCell.parent());
        const cellElements = this._rowsView.getCellElements(rowIndex);
        if (cellElements === null || cellElements === void 0 ? void 0 : cellElements.length) {
          const columnIndex = cellElements.index($targetCell);
          const visibleColumns = this._columnsController.getVisibleColumns();
          // TODO jsdmitry: Move this code to _rowClick method of rowsView
          const allowEditing = (_a = visibleColumns[columnIndex]) === null || _a === void 0 ? void 0 : _a.allowEditing;
          const isEditingCell = this.isEditCell(rowIndex, columnIndex);
          result = result && !allowEditing && !isEditingCell;
        }
      }
    }
    return result || _Base.prototype._needToCloseEditableCell.call(this, $targetElement);
  };
  _proto._closeEditItem = function _closeEditItem($targetElement) {
    if (this._needToCloseEditableCell($targetElement)) {
      this.closeEditCell();
    }
  };
  _proto._focusEditorIfNeed = function _focusEditorIfNeed() {
    var _a;
    if (this._needFocusEditor && this.isCellOrBatchEditMode()) {
      const editColumnIndex = this._getVisibleEditColumnIndex();
      const $cell = (_a = this._rowsView) === null || _a === void 0 ? void 0 : _a._getCellElement(this._getVisibleEditRowIndex(), editColumnIndex); // T319885
      if ($cell && !$cell.find(':focus').length) {
        this._focusEditingCell(() => {
          this._editCellInProgress = false;
        }, $cell, true);
      } else {
        this._editCellInProgress = false;
      }
      this._needFocusEditor = false;
    } else {
      _Base.prototype._focusEditorIfNeed.call(this);
    }
  };
  _proto.isEditing = function isEditing() {
    if (this.isCellOrBatchEditMode()) {
      const isEditRowKeyDefined = (0, _type.isDefined)(this.option(_const.EDITING_EDITROWKEY_OPTION_NAME));
      const isEditColumnNameDefined = (0, _type.isDefined)(this.option(_const.EDITING_EDITCOLUMNNAME_OPTION_NAME));
      return isEditRowKeyDefined && isEditColumnNameDefined;
    }
    return _Base.prototype.isEditing.call(this);
  };
  _proto._handleEditColumnNameChange = function _handleEditColumnNameChange(args) {
    const oldRowIndex = this._getVisibleEditRowIndex(args.previousValue);
    if (this.isCellOrBatchEditMode() && oldRowIndex !== -1 && (0, _type.isDefined)(args.value) && args.value !== args.previousValue) {
      const columnIndex = this._columnsController.getVisibleColumnIndex(args.value);
      const oldColumnIndex = this._columnsController.getVisibleColumnIndex(args.previousValue);
      this._editCellFromOptionChanged(columnIndex, oldColumnIndex, oldRowIndex);
    }
  };
  _proto._addRow = function _addRow(parentKey) {
    if (this.isCellEditMode() && this.hasChanges()) {
      // @ts-expect-error
      const deferred = new _deferred.Deferred();
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
    return _Base.prototype._addRow.call(this, parentKey);
  }
  /**
   * interface override
   */;
  _proto.editCell = function editCell(rowIndex, columnIndex) {
    return this._editCell({
      rowIndex,
      columnIndex
    });
  };
  _proto._editCell = function _editCell(options) {
    // @ts-expect-error
    const d = new _deferred.Deferred();
    let coreResult;
    this.executeOperation(d, () => {
      coreResult = this._editCellCore(options);
      (0, _deferred.when)(coreResult).done(d.resolve).fail(d.reject);
    });
    return coreResult !== undefined ? coreResult : d.promise();
  };
  _proto._editCellCore = function _editCellCore(options) {
    const dataController = this._dataController;
    const isEditByOptionChanged = (0, _type.isDefined)(options.oldColumnIndex) || (0, _type.isDefined)(options.oldRowIndex);
    const {
      columnIndex,
      rowIndex,
      column,
      item
    } = this._getNormalizedEditCellOptions(options);
    const params = {
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
      const editRowIndex = rowIndex + dataController.getRowIndexOffset();
      return (0, _deferred.when)(this._beforeEditCell(rowIndex, columnIndex, item)).done(cancel => {
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
   */;
  _proto._beforeEditCell = function _beforeEditCell(rowIndex, columnIndex, item) {
    if (this.isCellEditMode() && !item.isNewRow && this.hasChanges()) {
      // @ts-expect-error
      const isSaving = new _deferred.Deferred();
      this.saveEditData().always(() => {
        isSaving.resolve(this.hasChanges());
      });
      this.addDeferred(isSaving);
      return isSaving;
    }
    return false;
  };
  _proto.publicMethods = function publicMethods() {
    const publicMethods = _Base.prototype.publicMethods.call(this);
    return publicMethods.concat(['editCell', 'closeEditCell']);
  };
  _proto._getNormalizedEditCellOptions = function _getNormalizedEditCellOptions(_ref) {
    let {
      oldColumnIndex,
      oldRowIndex,
      columnIndex,
      rowIndex
    } = _ref;
    const columnsController = this._columnsController;
    const visibleColumns = columnsController.getVisibleColumns();
    const items = this._dataController.items();
    const item = items[rowIndex];
    let oldColumn;
    if ((0, _type.isDefined)(oldColumnIndex)) {
      oldColumn = visibleColumns[oldColumnIndex];
    } else {
      oldColumn = this._getEditColumn();
    }
    if (!(0, _type.isDefined)(oldRowIndex)) {
      oldRowIndex = this._getVisibleEditRowIndex();
    }
    if ((0, _type.isString)(columnIndex)) {
      columnIndex = columnsController.columnOption(columnIndex, 'index');
      columnIndex = columnsController.getVisibleIndex(columnIndex);
    }
    const column = visibleColumns[columnIndex];
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
  ;
  _proto._prepareEditCell = function _prepareEditCell(params, item, editColumnIndex, editRowIndex) {
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
   */;
  _proto.closeEditCell = function closeEditCell(isError, withoutSaveEditData) {
    let result = (0, _deferred.when)();
    const oldEditRowIndex = this._getVisibleEditRowIndex();
    if (this.isCellOrBatchEditMode()) {
      // @ts-expect-error
      const deferred = new _deferred.Deferred();
      // @ts-expect-error
      result = new _deferred.Deferred();
      this.executeOperation(deferred, () => {
        this._closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData).always(result.resolve);
      });
    }
    return result.promise();
  };
  _proto._closeEditCellCore = function _closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData) {
    const dataController = this._dataController;
    // @ts-expect-error
    const deferred = new _deferred.Deferred();
    const promise = deferred.promise();
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
        const rowIndices = [oldEditRowIndex];
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
  };
  _proto._resetModifiedClassCells = function _resetModifiedClassCells(changes) {
    if (this.isBatchEditMode()) {
      const columnsCount = this._columnsController.getVisibleColumns().length;
      changes.forEach(_ref2 => {
        let {
          key
        } = _ref2;
        const rowIndex = this._dataController.getRowIndexByKey(key);
        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
          const cellElement = this._rowsView._getCellElement(rowIndex, columnIndex);
          cellElement === null || cellElement === void 0 ? void 0 : cellElement.removeClass(_const.CELL_MODIFIED_CLASS);
        }
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._prepareChange = function _prepareChange(options, value, text) {
    const $cellElement = (0, _renderer.default)(options.cellElement);
    if (this.isBatchEditMode() && options.key !== undefined) {
      this._applyModified($cellElement, options);
    }
    return _Base.prototype._prepareChange.call(this, options, value, text);
  };
  _proto._cancelSaving = function _cancelSaving(result) {
    const dataController = this._dataController;
    if (this.isCellOrBatchEditMode()) {
      if (this.isBatchEditMode()) {
        this._resetEditIndices();
      }
      dataController.updateItems();
    }
    _Base.prototype._cancelSaving.call(this, result);
  };
  _proto.optionChanged = function optionChanged(args) {
    const {
      fullName
    } = args;
    if (args.name === 'editing' && fullName === _const.EDITING_EDITCOLUMNNAME_OPTION_NAME) {
      this._handleEditColumnNameChange(args);
      args.handled = true;
    } else {
      _Base.prototype.optionChanged.call(this, args);
    }
  };
  _proto._editCellFromOptionChanged = function _editCellFromOptionChanged(columnIndex, oldColumnIndex, oldRowIndex) {
    const columns = this._columnsController.getVisibleColumns();
    if (columnIndex > -1) {
      (0, _common.deferRender)(() => {
        this._repaintEditCell(columns[columnIndex], columns[oldColumnIndex], oldRowIndex);
      });
    }
  };
  _proto._handleEditRowKeyChange = function _handleEditRowKeyChange(args) {
    var _a;
    if (this.isCellOrBatchEditMode()) {
      const columnIndex = this._getVisibleEditColumnIndex();
      const oldRowIndexCorrection = this._getEditRowIndexCorrection();
      const oldRowIndex = this._dataController.getRowIndexByKey(args.previousValue) + oldRowIndexCorrection;
      if ((0, _type.isDefined)(args.value) && args.value !== args.previousValue) {
        (_a = this._editCellFromOptionChanged) === null || _a === void 0 ? void 0 : _a.call(this, columnIndex, columnIndex, oldRowIndex);
      }
    } else {
      _Base.prototype._handleEditRowKeyChange.call(this, args);
    }
  };
  _proto.deleteRow = function deleteRow(rowIndex) {
    if (this.isCellEditMode() && this.isEditing()) {
      const {
        isNewRow
      } = this._dataController.items()[rowIndex];
      const rowKey = this._dataController.getKeyByRowIndex(rowIndex);
      // T850905
      this.closeEditCell(null, isNewRow).always(() => {
        rowIndex = this._dataController.getRowIndexByKey(rowKey);
        this._checkAndDeleteRow(rowIndex);
      });
    } else {
      _Base.prototype.deleteRow.call(this, rowIndex);
    }
  };
  _proto._checkAndDeleteRow = function _checkAndDeleteRow(rowIndex) {
    if (this.isBatchEditMode()) {
      this._deleteRowCore(rowIndex);
    } else {
      _Base.prototype._checkAndDeleteRow.call(this, rowIndex);
    }
  };
  _proto._refreshCore = function _refreshCore(params) {
    const {
      isPageChanged
    } = params !== null && params !== void 0 ? params : {};
    const needResetIndexes = this.isBatchEditMode() || isPageChanged && this.option('scrolling.mode') !== 'virtual';
    if (this.isCellOrBatchEditMode()) {
      if (needResetIndexes) {
        this._resetEditColumnName();
        this._resetEditRowKey();
      }
    } else {
      _Base.prototype._refreshCore.call(this, params);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._allowRowAdding = function _allowRowAdding(params) {
    if (this.isBatchEditMode()) {
      return true;
    }
    return _Base.prototype._allowRowAdding.call(this, params);
  };
  _proto._afterDeleteRow = function _afterDeleteRow(rowIndex, oldEditRowIndex) {
    const dataController = this._dataController;
    if (this.isBatchEditMode()) {
      dataController.updateItems({
        changeType: 'update',
        rowIndices: [oldEditRowIndex, rowIndex]
      });
      // @ts-expect-error
      return new _deferred.Deferred().resolve();
    }
    return _Base.prototype._afterDeleteRow.call(this, rowIndex, oldEditRowIndex);
  };
  _proto._updateEditRow = function _updateEditRow(row, forceUpdateRow, isCustomSetCellValue) {
    if (this.isCellOrBatchEditMode()) {
      this._updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue);
    } else {
      _Base.prototype._updateEditRow.call(this, row, forceUpdateRow, isCustomSetCellValue);
    }
  };
  _proto._isDefaultButtonVisible = function _isDefaultButtonVisible(button, options) {
    if (this.isCellOrBatchEditMode()) {
      const isBatchMode = this.isBatchEditMode();
      switch (button.name) {
        case 'save':
        case 'cancel':
        case 'edit':
          return false;
        case 'delete':
          return _Base.prototype._isDefaultButtonVisible.call(this, button, options) && (!isBatchMode || !options.row.removed);
        case 'undelete':
          return isBatchMode && this.allowDeleting(options) && options.row.removed;
        default:
          return _Base.prototype._isDefaultButtonVisible.call(this, button, options);
      }
    }
    return _Base.prototype._isDefaultButtonVisible.call(this, button, options);
  };
  _proto._isRowDeleteAllowed = function _isRowDeleteAllowed() {
    const callBaseResult = _Base.prototype._isRowDeleteAllowed.call(this);
    return callBaseResult || this.isBatchEditMode();
  };
  _proto._beforeEndSaving = function _beforeEndSaving(changes) {
    var _a;
    if (this.isCellEditMode()) {
      if (((_a = changes[0]) === null || _a === void 0 ? void 0 : _a.type) !== 'update') {
        _Base.prototype._beforeEndSaving.call(this, changes);
      }
    } else {
      if (this.isBatchEditMode()) {
        this._resetModifiedClassCells(changes);
      }
      _Base.prototype._beforeEndSaving.call(this, changes);
    }
  };
  _proto.prepareEditButtons = function prepareEditButtons(headerPanel) {
    var _a;
    const editingOptions = (_a = this.option('editing')) !== null && _a !== void 0 ? _a : {};
    const buttonItems = _Base.prototype.prepareEditButtons.call(this, headerPanel);
    const needEditingButtons = editingOptions.allowUpdating || editingOptions.allowAdding || editingOptions.allowDeleting;
    if (needEditingButtons && this.isBatchEditMode()) {
      buttonItems.push(this.prepareButtonItem(headerPanel, 'save', 'saveEditData', 21));
      buttonItems.push(this.prepareButtonItem(headerPanel, 'revert', 'cancelEditData', 22));
    }
    return buttonItems;
  };
  _proto._saveEditDataInner = function _saveEditDataInner() {
    const editRow = this._dataController.getVisibleRows()[this.getEditRowIndex()];
    const editColumn = this._getEditColumn();
    const showEditorAlways = editColumn === null || editColumn === void 0 ? void 0 : editColumn.showEditorAlways;
    const isUpdateInCellMode = this.isCellEditMode() && !(editRow === null || editRow === void 0 ? void 0 : editRow.isNewRow);
    let deferred;
    if (isUpdateInCellMode && showEditorAlways) {
      // @ts-expect-error
      deferred = new _deferred.Deferred();
      this.addDeferred(deferred);
    }
    return _Base.prototype._saveEditDataInner.call(this).always(deferred === null || deferred === void 0 ? void 0 : deferred.resolve);
  };
  _proto._applyChange = function _applyChange(options, params, forceUpdateRow) {
    const isUpdateInCellMode = this.isCellEditMode() && options.row && !options.row.isNewRow;
    const {
      showEditorAlways
    } = options.column;
    const isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue;
    const focusPreviousEditingCell = showEditorAlways && !forceUpdateRow && isUpdateInCellMode && this.hasEditData() && !this.isEditCell(options.rowIndex, options.columnIndex);
    if (focusPreviousEditingCell) {
      this._focusEditingCell();
      this._updateEditRow(options.row, true, isCustomSetCellValue);
      return;
    }
    return _Base.prototype._applyChange.call(this, options, params, forceUpdateRow);
  };
  _proto._applyChangeCore = function _applyChangeCore(options, forceUpdateRow) {
    const {
      showEditorAlways
    } = options.column;
    const isUpdateInCellMode = this.isCellEditMode() && options.row && !options.row.isNewRow;
    if (showEditorAlways && !forceUpdateRow) {
      if (isUpdateInCellMode) {
        this._setEditRowKey(options.row.key, true);
        this._setEditColumnNameByIndex(options.columnIndex, true);
        return this.saveEditData();
      }
      if (this.isBatchEditMode()) {
        forceUpdateRow = this._needUpdateRow(options.column);
        return _Base.prototype._applyChangeCore.call(this, options, forceUpdateRow);
      }
    }
    return _Base.prototype._applyChangeCore.call(this, options, forceUpdateRow);
  };
  _proto._processDataItemCore = function _processDataItemCore(item, change, key, columns, generateDataValues) {
    const {
      data,
      type
    } = change;
    if (this.isBatchEditMode() && type === _const.DATA_EDIT_DATA_REMOVE_TYPE) {
      item.data = (0, _array_utils.createObjectWithChanges)(item.data, data);
    }
    _Base.prototype._processDataItemCore.call(this, item, change, key, columns, generateDataValues);
  };
  _proto._processRemoveCore = function _processRemoveCore(changes, editIndex, processIfBatch) {
    if (this.isBatchEditMode() && !processIfBatch) {
      return;
    }
    return _Base.prototype._processRemoveCore.call(this, changes, editIndex, processIfBatch);
  };
  _proto._processRemoveIfError = function _processRemoveIfError(changes, editIndex) {
    if (this.isBatchEditMode()) {
      return;
    }
    return _Base.prototype._processRemoveIfError.call(this, changes, editIndex);
  };
  _proto._beforeFocusElementInRow = function _beforeFocusElementInRow(rowIndex) {
    _Base.prototype._beforeFocusElementInRow.call(this, rowIndex);
    const editRowIndex = rowIndex >= 0 ? rowIndex : 0;
    const columnIndex = this.getFirstEditableColumnIndex();
    columnIndex >= 0 && this.editCell(editRowIndex, columnIndex);
  };
  return CellBasedEditingControllerExtender;
}(Base);
const rowsView = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(RowsViewEditingCellBasedExtender, _Base2);
  function RowsViewEditingCellBasedExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto2 = RowsViewEditingCellBasedExtender.prototype;
  _proto2._createTable = function _createTable() {
    const $table = _Base2.prototype._createTable.apply(this, arguments);
    const editingController = this._editingController;
    if (editingController.isCellOrBatchEditMode() && this.option('editing.allowUpdating')) {
      _events_engine.default.on($table, (0, _index.addNamespace)(_hold.default.name, 'dxDataGridRowsView'), "td:not(.".concat(_const.EDITOR_CELL_CLASS, ")"), this.createAction(() => {
        if (editingController.isEditing()) {
          editingController.closeEditCell();
        }
      }));
    }
    return $table;
  };
  _proto2._createRow = function _createRow(row) {
    const $row = _Base2.prototype._createRow.apply(this, arguments);
    if (row) {
      const editingController = this._editingController;
      const isRowRemoved = !!row.removed;
      // @ts-expect-error
      if (editingController.isBatchEditMode()) {
        isRowRemoved && $row.addClass(_const.ROW_REMOVED);
      }
    }
    return $row;
  };
  return RowsViewEditingCellBasedExtender;
}(Base);
const headerPanel = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(HeaderPanelEditingCellBasedExtender, _Base3);
  function HeaderPanelEditingCellBasedExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto3 = HeaderPanelEditingCellBasedExtender.prototype;
  _proto3.isVisible = function isVisible() {
    const editingOptions = this._editingController.option('editing');
    // @ts-expect-error
    return _Base3.prototype.isVisible.call(this) || editingOptions && (editingOptions.allowUpdating || editingOptions.allowDeleting) && editingOptions.mode === _const.EDIT_MODE_BATCH;
  };
  return HeaderPanelEditingCellBasedExtender;
}(Base);
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
const editingCellBasedModule = exports.editingCellBasedModule = {
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
