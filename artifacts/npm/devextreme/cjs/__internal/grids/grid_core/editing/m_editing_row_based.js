/**
* DevExtreme (cjs/__internal/grids/grid_core/editing/m_editing_row_based.js)
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
exports.editingRowBasedModule = void 0;
var _common = require("../../../../core/utils/common");
var _const = require("./const");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const editingControllerExtender = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(RowBasedEditingControllerExtender, _Base);
  function RowBasedEditingControllerExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto = RowBasedEditingControllerExtender.prototype;
  _proto.isRowEditMode = function isRowEditMode() {
    return this.getEditMode() === _const.EDIT_MODE_ROW;
  };
  _proto._afterCancelEditData = function _afterCancelEditData(rowIndex) {
    const dataController = this._dataController;
    if (this.isRowBasedEditMode() && rowIndex >= 0) {
      dataController.updateItems({
        changeType: 'update',
        rowIndices: [rowIndex, rowIndex + 1]
      });
    } else {
      _Base.prototype._afterCancelEditData.call(this, rowIndex);
    }
  };
  _proto._isDefaultButtonVisible = function _isDefaultButtonVisible(button, options) {
    const isRowMode = this.isRowBasedEditMode();
    const isEditRow = options.row && (0, _common.equalByValue)(options.row.key, this.option(_const.EDITING_EDITROWKEY_OPTION_NAME));
    if (isRowMode) {
      switch (button.name) {
        case 'edit':
          return !isEditRow && this.allowUpdating(options);
        case 'delete':
          return _Base.prototype._isDefaultButtonVisible.call(this, button, options) && !isEditRow;
        case 'save':
        case 'cancel':
          return isEditRow;
        default:
          return _Base.prototype._isDefaultButtonVisible.call(this, button, options);
      }
    }
    return _Base.prototype._isDefaultButtonVisible.call(this, button, options);
  };
  _proto.isEditRow = function isEditRow(rowIndex) {
    return this.isRowBasedEditMode() && this.isEditRowByIndex(rowIndex);
  };
  _proto._cancelSaving = function _cancelSaving(result) {
    if (this.isRowBasedEditMode()) {
      if (!this.hasChanges()) {
        this._cancelEditDataCore();
      }
    }
    _Base.prototype._cancelSaving.call(this, result);
  };
  _proto._refreshCore = function _refreshCore(params) {
    const {
      allowCancelEditing
    } = params !== null && params !== void 0 ? params : {};
    if (this.isRowBasedEditMode()) {
      const hasUpdateChanges = this.getChanges().filter(it => it.type === 'update').length > 0;
      this.init();
      allowCancelEditing && hasUpdateChanges && this._cancelEditDataCore();
    }
    _Base.prototype._refreshCore.call(this, params);
  };
  _proto._isEditColumnVisible = function _isEditColumnVisible() {
    const result = _Base.prototype._isEditColumnVisible.call(this);
    const editingOptions = this.option('editing');
    const isRowEditMode = this.isRowEditMode();
    const isVisibleInRowEditMode = editingOptions.allowUpdating || editingOptions.allowAdding;
    return result || isRowEditMode && isVisibleInRowEditMode;
  };
  _proto._focusEditorIfNeed = function _focusEditorIfNeed() {
    const editMode = this.getEditMode();
    if (this._needFocusEditor) {
      if (_const.MODES_WITH_DELAYED_FOCUS.includes(editMode)) {
        const $editingCell = this.getFocusedCellInRow(this._getVisibleEditRowIndex());
        this._delayedInputFocus($editingCell, () => {
          // @ts-expect-error
          $editingCell && this.component.focus($editingCell);
        });
      }
      this._needFocusEditor = false;
    }
  };
  return RowBasedEditingControllerExtender;
}(Base);
const data = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(DataEditingRowBasedExtender, _Base2);
  function DataEditingRowBasedExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto2 = DataEditingRowBasedExtender.prototype;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _proto2._getChangedColumnIndices = function _getChangedColumnIndices(oldItem, newItem, rowIndex, isLiveUpdate) {
    if (this._editingController.isRowBasedEditMode() && oldItem.isEditing !== newItem.isEditing) {
      return;
    }
    return _Base2.prototype._getChangedColumnIndices.apply(this, arguments);
  };
  return DataEditingRowBasedExtender;
}(Base);
const rowsView = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(RowsViewEditingRowBasedExtender, _Base3);
  function RowsViewEditingRowBasedExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto3 = RowsViewEditingRowBasedExtender.prototype;
  _proto3._createRow = function _createRow(row) {
    const $row = _Base3.prototype._createRow.apply(this, arguments);
    if (row) {
      const editingController = this._editingController;
      const isEditRow = editingController.isEditRow(row.rowIndex);
      if (isEditRow) {
        $row.addClass(_const.EDIT_ROW);
        $row.removeClass(_const.ROW_SELECTED_CLASS);
        if (row.rowType === 'detail') {
          $row.addClass(this.addWidgetPrefix(_const.EDIT_FORM_CLASS));
        }
      }
    }
    return $row;
  };
  _proto3._update = function _update(change) {
    _Base3.prototype._update.call(this, change);
    if (change.changeType === 'updateSelection') {
      this.getTableElements().children('tbody').children(".".concat(_const.EDIT_ROW)).removeClass(_const.ROW_SELECTED_CLASS);
    }
  };
  return RowsViewEditingRowBasedExtender;
}(Base);
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
const editingRowBasedModule = exports.editingRowBasedModule = {
  extenders: {
    controllers: {
      editing: editingControllerExtender,
      data
    },
    views: {
      rowsView
    }
  }
};
