/**
* DevExtreme (cjs/__internal/grids/tree_list/editing/m_editing.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

require("../module_not_extended/editor_factory");
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_editing = require("../../../grids/grid_core/editing/m_editing");
var _m_utils = _interopRequireDefault(require("../../../grids/grid_core/m_utils"));
var _m_core = _interopRequireDefault(require("../m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const TREELIST_EXPAND_ICON_CONTAINER_CLASS = 'dx-treelist-icon-container';
const SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';
const DATA_EDIT_DATA_INSERT_TYPE = 'insert';
let EditingController = /*#__PURE__*/function (_editingModule$contro) {
  _inheritsLoose(EditingController, _editingModule$contro);
  function EditingController() {
    return _editingModule$contro.apply(this, arguments) || this;
  }
  var _proto = EditingController.prototype;
  _proto._generateNewItem = function _generateNewItem(key) {
    const item = _editingModule$contro.prototype._generateNewItem.call(this, key);
    item.data = {
      key
    };
    item.children = [];
    item.level = 0;
    item.parentKey = this.option('rootValue');
    return item;
  };
  _proto._isProcessedItem = function _isProcessedItem() {
    return true;
  };
  _proto._setInsertAfterOrBeforeKey = function _setInsertAfterOrBeforeKey(change, parentKey) {
    if (parentKey !== undefined && parentKey !== this.option('rootValue')) {
      change.insertAfterKey = parentKey;
    } else {
      // @ts-expect-error
      _editingModule$contro.prototype._setInsertAfterOrBeforeKey.apply(this, arguments);
    }
  };
  _proto._getLoadedRowIndex = function _getLoadedRowIndex(items, change) {
    const dataSourceAdapter = this._dataController.dataSource();
    const parentKey = dataSourceAdapter === null || dataSourceAdapter === void 0 ? void 0 : dataSourceAdapter.parentKeyOf(change.data);
    if (parentKey !== undefined && parentKey !== this.option('rootValue')) {
      const rowIndex = _m_utils.default.getIndexByKey(parentKey, items);
      // @ts-expect-error
      if (rowIndex >= 0 && this._dataController.isRowExpanded(parentKey)) {
        return rowIndex + 1;
      }
      return -1;
    }
    // @ts-expect-error
    return _editingModule$contro.prototype._getLoadedRowIndex.apply(this, arguments);
  };
  _proto._isEditColumnVisible = function _isEditColumnVisible() {
    // @ts-expect-error
    const result = _editingModule$contro.prototype._isEditColumnVisible.apply(this, arguments);
    const editingOptions = this.option('editing');
    return result || editingOptions.allowAdding;
  };
  _proto._isDefaultButtonVisible = function _isDefaultButtonVisible(button, options) {
    // @ts-expect-error
    const result = _editingModule$contro.prototype._isDefaultButtonVisible.apply(this, arguments);
    const {
      row
    } = options;
    if (button.name === 'add') {
      return this.allowAdding(options) && row.rowIndex !== this._getVisibleEditRowIndex() && !(row.removed || row.isNewRow);
    }
    return result;
  };
  _proto._getEditingButtons = function _getEditingButtons(options) {
    // @ts-expect-error
    const buttons = _editingModule$contro.prototype._getEditingButtons.apply(this, arguments);
    if (!options.column.buttons) {
      buttons.unshift(this._getButtonConfig('add', options));
    }
    return buttons;
  };
  _proto._beforeSaveEditData = function _beforeSaveEditData(change) {
    var _a;
    // @ts-expect-error
    const result = _editingModule$contro.prototype._beforeSaveEditData.apply(this, arguments);
    if (change && change.type !== DATA_EDIT_DATA_INSERT_TYPE) {
      const store = (_a = this._dataController) === null || _a === void 0 ? void 0 : _a.store();
      const key = store === null || store === void 0 ? void 0 : store.key();
      if (!(0, _type.isDefined)(key)) {
        throw _ui.default.Error('E1045');
      }
    }
    return result;
  };
  _proto.addRowByRowIndex = function addRowByRowIndex(rowIndex) {
    const row = this._dataController.getVisibleRows()[rowIndex];
    return this.addRow(row ? row.key : undefined);
  };
  _proto.addRow = function addRow(key) {
    if (key === undefined) {
      key = this.option('rootValue');
    }
    return _editingModule$contro.prototype.addRow.call(this, key);
  };
  _proto._addRowCore = function _addRowCore(data, parentKey, oldEditRowIndex) {
    const rootValue = this.option('rootValue');
    const dataSourceAdapter = this._dataController.dataSource();
    const parentKeyGetter = dataSourceAdapter.createParentIdGetter();
    parentKey = parentKeyGetter(data);
    // @ts-expect-error
    if (parentKey !== undefined && parentKey !== rootValue && !this._dataController.isRowExpanded(parentKey)) {
      // @ts-expect-error
      const deferred = new _deferred.Deferred();
      // @ts-expect-error
      this._dataController.expandRow(parentKey).done(() => {
        setTimeout(() => {
          _editingModule$contro.prototype._addRowCore.call(this, data, parentKey, oldEditRowIndex).done(deferred.resolve).fail(deferred.reject);
        });
      }).fail(deferred.reject);
      return deferred.promise();
    }
    return _editingModule$contro.prototype._addRowCore.call(this, data, parentKey, oldEditRowIndex);
  };
  _proto._initNewRow = function _initNewRow(options, parentKey) {
    const dataSourceAdapter = this._dataController.dataSource();
    const parentIdSetter = dataSourceAdapter.createParentIdSetter();
    parentIdSetter(options.data, parentKey);
    // @ts-expect-error
    return _editingModule$contro.prototype._initNewRow.apply(this, arguments);
  };
  _proto.allowAdding = function allowAdding(options) {
    return this._allowEditAction('allowAdding', options);
  };
  _proto._needToCloseEditableCell = function _needToCloseEditableCell($targetElement) {
    // @ts-expect-error
    return _editingModule$contro.prototype._needToCloseEditableCell.apply(this, arguments) || $targetElement.closest(".".concat(TREELIST_EXPAND_ICON_CONTAINER_CLASS)).length && this.isEditing();
  };
  _proto.getButtonLocalizationNames = function getButtonLocalizationNames() {
    const names = _editingModule$contro.prototype.getButtonLocalizationNames.apply(this);
    // @ts-expect-error
    names.add = 'dxTreeList-editingAddRowToNode';
    return names;
  };
  return EditingController;
}(_m_editing.editingModule.controllers.editing);
const rowsView = Base => /*#__PURE__*/function (_editingModule$extend) {
  _inheritsLoose(TreeListEditingRowsViewExtender, _editingModule$extend);
  function TreeListEditingRowsViewExtender() {
    return _editingModule$extend.apply(this, arguments) || this;
  }
  var _proto2 = TreeListEditingRowsViewExtender.prototype;
  _proto2._renderCellCommandContent = function _renderCellCommandContent($container, options) {
    const editingController = this._editingController;
    const isEditRow = options.row && editingController.isEditRow(options.row.rowIndex);
    const isEditing = options.isEditing || isEditRow;
    if (!isEditing) {
      // @ts-expect-error
      return _editingModule$extend.prototype._renderCellCommandContent.apply(this, arguments);
    }
    return false;
  };
  _proto2.validateClick = function validateClick(e) {
    const $targetElement = (0, _renderer.default)(e.event.target);
    const originalClickHandler = e.event.type === 'dxdblclick' ? _editingModule$extend.prototype._rowDblClick : _editingModule$extend.prototype._rowClick;
    if ($targetElement.closest(".".concat(SELECT_CHECKBOX_CLASS)).length) {
      return false;
    }
    return !this.needToCallOriginalClickHandler(e, originalClickHandler);
  };
  _proto2.needToCallOriginalClickHandler = function needToCallOriginalClickHandler(e, originalClickHandler) {
    const $targetElement = (0, _renderer.default)(e.event.target);
    if (!$targetElement.closest(".".concat(TREELIST_EXPAND_ICON_CONTAINER_CLASS)).length) {
      originalClickHandler.call(this, e);
      return true;
    }
    return false;
  };
  _proto2._rowClick = function _rowClick(e) {
    if (this.validateClick(e)) {
      // @ts-expect-error
      _editingModule$extend.prototype._rowClickTreeListHack.apply(this, arguments);
    }
  };
  _proto2._rowDblClick = function _rowDblClick(e) {
    if (this.validateClick(e)) {
      // @ts-expect-error
      _editingModule$extend.prototype._rowDblClickTreeListHack.apply(this, arguments);
    }
  };
  return TreeListEditingRowsViewExtender;
}(_m_editing.editingModule.extenders.views.rowsView(Base));
const data = Base => /*#__PURE__*/function (_dataControllerEditin) {
  _inheritsLoose(DataControllerTreeListEditingExtender, _dataControllerEditin);
  function DataControllerTreeListEditingExtender() {
    return _dataControllerEditin.apply(this, arguments) || this;
  }
  var _proto3 = DataControllerTreeListEditingExtender.prototype;
  _proto3.changeRowExpand = function changeRowExpand() {
    this._editingController.refresh();
    // @ts-expect-error
    return _dataControllerEditin.prototype.changeRowExpand.apply(this, arguments);
  };
  return DataControllerTreeListEditingExtender;
}((0, _m_editing.dataControllerEditingExtenderMixin)(Base));
_m_core.default.registerModule('editing', {
  defaultOptions() {
    return (0, _extend.extend)(true, _m_editing.editingModule.defaultOptions(), {
      editing: {
        texts: {
          addRowToNode: _message.default.format('dxTreeList-editingAddRowToNode')
        }
      }
    });
  },
  controllers: {
    editing: EditingController
  },
  extenders: {
    controllers: {
      data
    },
    views: {
      rowsView,
      headerPanel: _m_editing.editingModule.extenders.views.headerPanel
    }
  }
});
