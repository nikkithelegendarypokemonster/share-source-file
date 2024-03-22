/**
* DevExtreme (cjs/__internal/grids/grid_core/editing/m_editing_form_based.js)
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
exports.editingFormBasedModule = void 0;
var _devices = _interopRequireDefault(require("../../../../core/devices"));
var _guid = _interopRequireDefault(require("../../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _dom = require("../../../../core/utils/dom");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _remove = require("../../../../events/remove");
var _button = _interopRequireDefault(require("../../../../ui/button"));
var _form = _interopRequireDefault(require("../../../../ui/form"));
var _ui = _interopRequireDefault(require("../../../../ui/popup/ui.popup"));
var _ui2 = _interopRequireDefault(require("../../../../ui/scroll_view/ui.scrollable"));
var _const = require("./const");
var _m_editing_utils = require("./m_editing_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const editingControllerExtender = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(FormBasedEditingControllerExtender, _Base);
  function FormBasedEditingControllerExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto = FormBasedEditingControllerExtender.prototype;
  _proto.init = function init() {
    this._editForm = null;
    this._updateEditFormDeferred = null;
    _Base.prototype.init.call(this);
  };
  _proto.isFormOrPopupEditMode = function isFormOrPopupEditMode() {
    return this.isPopupEditMode() || this.isFormEditMode();
  };
  _proto.isPopupEditMode = function isPopupEditMode() {
    const editMode = this.option('editing.mode');
    return editMode === _const.EDIT_MODE_POPUP;
  };
  _proto.isFormEditMode = function isFormEditMode() {
    const editMode = this.option('editing.mode');
    return editMode === _const.EDIT_MODE_FORM;
  };
  _proto.getFirstEditableColumnIndex = function getFirstEditableColumnIndex() {
    const firstFormItem = this._firstFormItem;
    if (this.isFormEditMode() && firstFormItem) {
      const editRowKey = this.option(_const.EDITING_EDITROWKEY_OPTION_NAME);
      const editRowIndex = this._dataController.getRowIndexByKey(editRowKey);
      const $editFormElements = this._rowsView.getCellElements(editRowIndex);
      // @ts-expect-error
      return this._rowsView._getEditFormEditorVisibleIndex($editFormElements, firstFormItem.column);
    }
    return _Base.prototype.getFirstEditableColumnIndex.call(this);
  };
  _proto.getEditFormRowIndex = function getEditFormRowIndex() {
    return this.isFormOrPopupEditMode() ? this._getVisibleEditRowIndex() : _Base.prototype.getEditFormRowIndex.call(this);
  };
  _proto._isEditColumnVisible = function _isEditColumnVisible() {
    const result = _Base.prototype._isEditColumnVisible.call(this);
    const editingOptions = this.option('editing');
    return this.isFormOrPopupEditMode() ? editingOptions.allowUpdating || result : result;
  };
  _proto._handleDataChanged = function _handleDataChanged(args) {
    var _a, _b;
    if (this.isPopupEditMode()) {
      const editRowKey = this.option('editing.editRowKey');
      const hasEditRow = (_a = args === null || args === void 0 ? void 0 : args.items) === null || _a === void 0 ? void 0 : _a.some(item => (0, _common.equalByValue)(item.key, editRowKey));
      const onlyInsertChanges = ((_b = args.changeTypes) === null || _b === void 0 ? void 0 : _b.length) && args.changeTypes.every(item => item === 'insert');
      if ((args.changeType === 'refresh' || hasEditRow && args.isOptionChanged) && !onlyInsertChanges) {
        this._repaintEditPopup();
      }
    }
    _Base.prototype._handleDataChanged.call(this, args);
  };
  _proto.getPopupContent = function getPopupContent() {
    var _a;
    const popupVisible = (_a = this._editPopup) === null || _a === void 0 ? void 0 : _a.option('visible');
    if (this.isPopupEditMode() && popupVisible) {
      return this._$popupContent;
    }
  };
  _proto._showAddedRow = function _showAddedRow(rowIndex) {
    if (this.isPopupEditMode()) {
      this._showEditPopup(rowIndex);
    } else {
      _Base.prototype._showAddedRow.call(this, rowIndex);
    }
  };
  _proto._cancelEditDataCore = function _cancelEditDataCore() {
    _Base.prototype._cancelEditDataCore.call(this);
    if (this.isPopupEditMode()) {
      this._hideEditPopup();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._updateEditRowCore = function _updateEditRowCore(row, skipCurrentRow, isCustomSetCellValue) {
    var _a;
    const editForm = this._editForm;
    if (this.isPopupEditMode()) {
      if (this.option('repaintChangesOnly')) {
        (_a = row.update) === null || _a === void 0 ? void 0 : _a.call(row, row);
        this._rowsView.renderDelayedTemplates();
      } else if (editForm) {
        // @ts-expect-error
        this._updateEditFormDeferred = new _deferred.Deferred().done(() => editForm.repaint());
        if (!this._updateLockCount) {
          this._updateEditFormDeferred.resolve();
        }
      }
    } else {
      _Base.prototype._updateEditRowCore.call(this, row, skipCurrentRow, isCustomSetCellValue);
    }
  };
  _proto._showEditPopup = function _showEditPopup(rowIndex, repaintForm) {
    const isMobileDevice = _devices.default.current().deviceType !== 'desktop';
    const editPopupClass = this.addWidgetPrefix(_const.EDIT_POPUP_CLASS);
    const popupOptions = (0, _extend.extend)({
      showTitle: false,
      fullScreen: isMobileDevice,
      wrapperAttr: {
        class: editPopupClass
      },
      toolbarItems: [{
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: this._getSaveButtonConfig()
      }, {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: this._getCancelButtonConfig()
      }],
      contentTemplate: this._getPopupEditFormTemplate(rowIndex)
    }, this.option(_const.EDITING_POPUP_OPTION_NAME));
    if (!this._editPopup) {
      const $popupContainer = (0, _renderer.default)('<div>').appendTo(this.component.$element()).addClass(editPopupClass);
      this._editPopup = this._createComponent($popupContainer, _ui.default);
      this._editPopup.on('hiding', this._getEditPopupHiddenHandler());
      this._editPopup.on('shown', e => {
        var _a;
        _events_engine.default.trigger(e.component.$content().find(_const.FOCUSABLE_ELEMENT_SELECTOR).not(".".concat(_const.FOCUSABLE_ELEMENT_CLASS)).first(), 'focus');
        if (repaintForm) {
          (_a = this._editForm) === null || _a === void 0 ? void 0 : _a.repaint();
        }
      });
    }
    this._editPopup.option(popupOptions);
    this._editPopup.show();
    _Base.prototype._showEditPopup.call(this, rowIndex, repaintForm);
  };
  _proto._getPopupEditFormTemplate = function _getPopupEditFormTemplate(rowIndex) {
    // @ts-expect-error
    const row = this.component.getVisibleRows()[rowIndex];
    const templateOptions = {
      row,
      values: row.values,
      rowType: row.rowType,
      key: row.key,
      rowIndex
    };
    this._rowsView._addWatchMethod(templateOptions, row);
    return container => {
      const formTemplate = this.getEditFormTemplate();
      const scrollable = this._createComponent((0, _renderer.default)('<div>').appendTo(container), _ui2.default);
      this._$popupContent = (0, _renderer.default)(scrollable.content());
      formTemplate(this._$popupContent, templateOptions, {
        isPopupForm: true
      });
      this._rowsView.renderDelayedTemplates();
      (0, _renderer.default)(container).parent().attr('aria-label', this.localize('dxDataGrid-ariaEditForm'));
    };
  };
  _proto._repaintEditPopup = function _repaintEditPopup() {
    var _a, _b;
    const rowIndex = this._getVisibleEditRowIndex();
    if (rowIndex >= 0) {
      const defaultAnimation = (_a = this._editPopup) === null || _a === void 0 ? void 0 : _a.option('animation');
      (_b = this._editPopup) === null || _b === void 0 ? void 0 : _b.option('animation', null);
      this._showEditPopup(rowIndex, true);
      if (defaultAnimation !== undefined) {
        this._editPopup.option('animation', defaultAnimation);
      }
    }
  };
  _proto._hideEditPopup = function _hideEditPopup() {
    var _a;
    (_a = this._editPopup) === null || _a === void 0 ? void 0 : _a.option('visible', false);
  };
  _proto.optionChanged = function optionChanged(args) {
    if (args.name === 'editing' && this.isFormOrPopupEditMode()) {
      const {
        fullName
      } = args;
      if (fullName.indexOf(_const.EDITING_FORM_OPTION_NAME) === 0) {
        this._handleFormOptionChange(args);
        args.handled = true;
      } else if (fullName.indexOf(_const.EDITING_POPUP_OPTION_NAME) === 0) {
        this._handlePopupOptionChange(args);
        args.handled = true;
      }
    }
    _Base.prototype.optionChanged.call(this, args);
  };
  _proto._handleFormOptionChange = function _handleFormOptionChange(args) {
    var _a;
    if (this.isFormEditMode()) {
      const editRowIndex = this._getVisibleEditRowIndex();
      if (editRowIndex >= 0) {
        this._dataController.updateItems({
          changeType: 'update',
          rowIndices: [editRowIndex]
        });
      }
    } else if (((_a = this._editPopup) === null || _a === void 0 ? void 0 : _a.option('visible')) && args.fullName.indexOf(_const.EDITING_FORM_OPTION_NAME) === 0) {
      this._repaintEditPopup();
    }
  };
  _proto._handlePopupOptionChange = function _handlePopupOptionChange(args) {
    const editPopup = this._editPopup;
    if (editPopup) {
      const popupOptionName = args.fullName.slice(_const.EDITING_POPUP_OPTION_NAME.length + 1);
      if (popupOptionName) {
        editPopup.option(popupOptionName, args.value);
      } else {
        editPopup.option(args.value);
      }
    }
  }
  /**
   * interface override
   */;
  _proto.renderFormEditorTemplate = function renderFormEditorTemplate(detailCellOptions, item, formTemplateOptions, container, isReadOnly) {
    const that = this;
    const $container = (0, _renderer.default)(container);
    const {
      column
    } = item;
    const editorType = (0, _m_editing_utils.getEditorType)(item);
    const rowData = detailCellOptions === null || detailCellOptions === void 0 ? void 0 : detailCellOptions.row.data;
    const form = formTemplateOptions.component;
    const {
      label,
      labelMark,
      labelMode
    } = formTemplateOptions.editorOptions || {};
    const cellOptions = (0, _extend.extend)({}, detailCellOptions, {
      data: rowData,
      cellElement: null,
      isOnForm: true,
      item,
      id: form.getItemID(item.name || item.dataField),
      column: (0, _extend.extend)({}, column, {
        editorType,
        editorOptions: (0, _extend.extend)({
          label,
          labelMark,
          labelMode
        }, column.editorOptions, item.editorOptions)
      }),
      columnIndex: column.index,
      setValue: !isReadOnly && column.allowEditing && function (value, text) {
        that.updateFieldValue(cellOptions, value, text);
      }
    });
    cellOptions.value = column.calculateCellValue(rowData);
    const template = this._getFormEditItemTemplate.bind(this)(cellOptions, column);
    this._rowsView.renderTemplate($container, template, cellOptions, !!(0, _dom.isElementInDom)($container)).done(() => {
      this._rowsView._updateCell($container, cellOptions);
    });
    return cellOptions;
  };
  _proto.getFormEditorTemplate = function getFormEditorTemplate(cellOptions, item) {
    const column = this.component.columnOption(item.name || item.dataField);
    return (options, container) => {
      const $container = (0, _renderer.default)(container);
      const {
        row
      } = cellOptions;
      if (row === null || row === void 0 ? void 0 : row.watch) {
        const dispose = row.watch(() => column.selector(row.data), () => {
          let $editorElement = $container.find('.dx-widget').first();
          let validator = $editorElement.data('dxValidator');
          const validatorOptions = validator === null || validator === void 0 ? void 0 : validator.option();
          $container.contents().remove();
          cellOptions = this.renderFormEditorTemplate.bind(this)(cellOptions, item, options, $container);
          $editorElement = $container.find('.dx-widget').first();
          validator = $editorElement.data('dxValidator');
          if (validatorOptions && !validator) {
            $editorElement.dxValidator({
              validationRules: validatorOptions.validationRules,
              validationGroup: validatorOptions.validationGroup,
              dataGetter: validatorOptions.dataGetter
            });
          }
        });
        _events_engine.default.on($container, _remove.removeEvent, dispose);
      }
      cellOptions = this.renderFormEditorTemplate.bind(this)(cellOptions, item, options, $container);
    };
  };
  _proto.getEditFormOptions = function getEditFormOptions(detailOptions) {
    var _a, _b;
    const editFormOptions = (_b = (_a = this)._getValidationGroupsInForm) === null || _b === void 0 ? void 0 : _b.call(_a, detailOptions);
    const userCustomizeItem = this.option('editing.form.customizeItem');
    const editFormItemClass = this.addWidgetPrefix(_const.EDIT_FORM_ITEM_CLASS);
    let items = this.option('editing.form.items');
    const isCustomEditorType = {};
    if (!items) {
      const columns = this._columnsController.getColumns();
      items = [];
      (0, _iterator.each)(columns, (_, column) => {
        if (!column.isBand && !column.type) {
          items.push({
            column,
            name: column.name,
            dataField: column.dataField
          });
        }
      });
    } else {
      (0, _m_editing_utils.forEachFormItems)(items, item => {
        const itemId = (item === null || item === void 0 ? void 0 : item.name) || (item === null || item === void 0 ? void 0 : item.dataField);
        if (itemId) {
          isCustomEditorType[itemId] = !!item.editorType;
        }
      });
    }
    return (0, _extend.extend)({}, editFormOptions, {
      items,
      formID: "dx-".concat(new _guid.default()),
      customizeItem: item => {
        let column;
        const itemId = item.name || item.dataField;
        if (item.column || itemId) {
          column = item.column || this._columnsController.columnOption(item.name ? "name:".concat(item.name) : "dataField:".concat(item.dataField));
        }
        if (column) {
          item.label = item.label || {};
          item.label.text = item.label.text || column.caption;
          if (column.dataType === 'boolean' && item.label.visible === undefined) {
            const labelMode = this.option('editing.form.labelMode');
            if (labelMode === 'floating' || labelMode === 'static') {
              item.label.visible = true;
            }
          }
          item.template = item.template || this.getFormEditorTemplate(detailOptions, item);
          item.column = column;
          item.isCustomEditorType = isCustomEditorType[itemId];
          if (column.formItem) {
            (0, _extend.extend)(item, column.formItem);
          }
          if (item.isRequired === undefined && column.validationRules) {
            item.isRequired = column.validationRules.some(rule => rule.type === 'required');
            item.validationRules = [];
          }
          const itemVisible = (0, _type.isDefined)(item.visible) ? item.visible : true;
          if (!this._firstFormItem && itemVisible) {
            this._firstFormItem = item;
          }
        }
        userCustomizeItem === null || userCustomizeItem === void 0 ? void 0 : userCustomizeItem.call(this, item);
        item.cssClass = (0, _type.isString)(item.cssClass) ? "".concat(item.cssClass, " ").concat(editFormItemClass) : editFormItemClass;
      }
    });
  };
  _proto.getEditFormTemplate = function getEditFormTemplate() {
    return ($container, detailOptions, options) => {
      const editFormOptions = this.option(_const.EDITING_FORM_OPTION_NAME);
      const baseEditFormOptions = this.getEditFormOptions(detailOptions);
      const $formContainer = (0, _renderer.default)('<div>').appendTo($container);
      const isPopupForm = options === null || options === void 0 ? void 0 : options.isPopupForm;
      this._firstFormItem = undefined;
      if (isPopupForm) {
        $formContainer.addClass(this.addWidgetPrefix(_const.EDIT_POPUP_FORM_CLASS));
      }
      this._editForm = this._createComponent($formContainer, _form.default, (0, _extend.extend)({}, editFormOptions, baseEditFormOptions));
      if (!isPopupForm) {
        const $buttonsContainer = (0, _renderer.default)('<div>').addClass(this.addWidgetPrefix(_const.FORM_BUTTONS_CONTAINER_CLASS)).appendTo($container);
        this._createComponent((0, _renderer.default)('<div>').appendTo($buttonsContainer), _button.default, this._getSaveButtonConfig());
        this._createComponent((0, _renderer.default)('<div>').appendTo($buttonsContainer), _button.default, this._getCancelButtonConfig());
      }
      this._editForm.on('contentReady', () => {
        var _a;
        this._rowsView.renderDelayedTemplates();
        (_a = this._editPopup) === null || _a === void 0 ? void 0 : _a.repaint();
      });
    };
  };
  _proto.getEditForm = function getEditForm() {
    return this._editForm;
  };
  _proto._endUpdateCore = function _endUpdateCore() {
    var _a;
    (_a = this._updateEditFormDeferred) === null || _a === void 0 ? void 0 : _a.resolve();
  };
  _proto._beforeEndSaving = function _beforeEndSaving(changes) {
    var _a;
    _Base.prototype._beforeEndSaving.call(this, changes);
    if (this.isPopupEditMode()) {
      (_a = this._editPopup) === null || _a === void 0 ? void 0 : _a.hide();
    }
  };
  _proto._processDataItemCore = function _processDataItemCore(item, change, key, columns, generateDataValues) {
    const {
      type
    } = change;
    if (this.isPopupEditMode() && type === _const.DATA_EDIT_DATA_INSERT_TYPE) {
      item.visible = false;
    }
    _Base.prototype._processDataItemCore.call(this, item, change, key, columns, generateDataValues);
  };
  _proto._editRowFromOptionChangedCore = function _editRowFromOptionChangedCore(rowIndices, rowIndex) {
    const isPopupEditMode = this.isPopupEditMode();
    _Base.prototype._editRowFromOptionChangedCore.call(this, rowIndices, rowIndex, isPopupEditMode);
    if (isPopupEditMode) {
      this._showEditPopup(rowIndex);
    }
  };
  return FormBasedEditingControllerExtender;
}(Base);
const data = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(DataEditingFormBasedExtender, _Base2);
  function DataEditingFormBasedExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto2 = DataEditingFormBasedExtender.prototype;
  _proto2._updateEditItem = function _updateEditItem(item) {
    // @ts-expect-error
    if (this._editingController.isFormEditMode()) {
      item.rowType = 'detail';
    }
  };
  _proto2._getChangedColumnIndices = function _getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate) {
    // @ts-expect-error
    if (isLiveUpdate === false && newItem.isEditing && this._editingController.isFormEditMode()) {
      return;
    }
    return _Base2.prototype._getChangedColumnIndices.apply(this, arguments);
  };
  return DataEditingFormBasedExtender;
}(Base);
const rowsView = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(RowsViewEditingFormBasedExtender, _Base3);
  function RowsViewEditingFormBasedExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto3 = RowsViewEditingFormBasedExtender.prototype;
  _proto3._renderCellContent = function _renderCellContent($cell, options) {
    // @ts-expect-error
    if (options.rowType === 'data' && this._editingController.isPopupEditMode() && options.row.visible === false) {
      return;
    }
    _Base3.prototype._renderCellContent.apply(this, arguments);
  };
  _proto3.getCellElements = function getCellElements(rowIndex) {
    const $cellElements = _Base3.prototype.getCellElements.call(this, rowIndex);
    const editingController = this._editingController;
    // @ts-expect-error
    const editForm = editingController.getEditForm();
    const editFormRowIndex = editingController.getEditFormRowIndex();
    if (editFormRowIndex === rowIndex && $cellElements && editForm) {
      return editForm.$element().find(".".concat(this.addWidgetPrefix(_const.EDIT_FORM_ITEM_CLASS), ", .").concat(_const.BUTTON_CLASS));
    }
    return $cellElements;
  };
  _proto3._getVisibleColumnIndex = function _getVisibleColumnIndex($cells, rowIndex, columnIdentifier) {
    const editFormRowIndex = this._editingController.getEditFormRowIndex();
    if (editFormRowIndex === rowIndex && (0, _type.isString)(columnIdentifier)) {
      const column = this._columnsController.columnOption(columnIdentifier);
      return this._getEditFormEditorVisibleIndex($cells, column);
    }
    return _Base3.prototype._getVisibleColumnIndex.apply(this, arguments);
  };
  _proto3._getEditFormEditorVisibleIndex = function _getEditFormEditorVisibleIndex($cells, column) {
    let visibleIndex = -1;
    // @ts-expect-error
    (0, _iterator.each)($cells, (index, cellElement) => {
      const item = (0, _renderer.default)(cellElement).find('.dx-field-item-content').data('dx-form-item');
      if ((item === null || item === void 0 ? void 0 : item.column) && column && item.column.index === column.index) {
        visibleIndex = index;
        return false;
      }
    });
    return visibleIndex;
  };
  _proto3._isFormItem = function _isFormItem(parameters) {
    const isDetailRow = parameters.rowType === 'detail' || parameters.rowType === 'detailAdaptive';
    // @ts-expect-error
    const isPopupEditing = parameters.rowType === 'data' && this._editingController.isPopupEditMode();
    return (isDetailRow || isPopupEditing) && parameters.item;
  };
  _proto3._updateCell = function _updateCell($cell, parameters) {
    if (this._isFormItem(parameters)) {
      // @ts-expect-error Badly typed based class
      this._formItemPrepared(parameters, $cell);
    } else {
      _Base3.prototype._updateCell.call(this, $cell, parameters);
    }
  };
  _proto3._updateContent = function _updateContent() {
    const editingController = this._editingController;
    // @ts-expect-error
    const oldEditForm = editingController.getEditForm();
    const validationGroup = oldEditForm === null || oldEditForm === void 0 ? void 0 : oldEditForm.option('validationGroup');
    const deferred = _Base3.prototype._updateContent.apply(this, arguments);
    return deferred.done(() => {
      // @ts-expect-error
      const newEditForm = editingController.getEditForm();
      if (validationGroup && newEditForm && newEditForm !== oldEditForm) {
        newEditForm.option('validationGroup', validationGroup);
      }
    });
  };
  return RowsViewEditingFormBasedExtender;
}(Base);
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
const editingFormBasedModule = exports.editingFormBasedModule = {
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
