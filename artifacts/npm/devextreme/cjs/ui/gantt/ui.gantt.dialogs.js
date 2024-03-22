/**
* DevExtreme (cjs/ui/gantt/ui.gantt.dialogs.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.GanttDialog = void 0;
var _ui = _interopRequireDefault(require("../popup/ui.popup"));
var _form = _interopRequireDefault(require("../form"));
require("../tag_box");
require("../radio_group");
var _date = _interopRequireDefault(require("../../localization/date"));
var _message = _interopRequireDefault(require("../../localization/message"));
require("../list_light");
require("../list/modules/deleting");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let GanttDialog = exports.GanttDialog = /*#__PURE__*/function () {
  function GanttDialog(owner, $element) {
    this._popupInstance = owner._createComponent($element, _ui.default);
    this.infoMap = {
      TaskEdit: TaskEditDialogInfo,
      Resources: ResourcesEditDialogInfo,
      Confirmation: ConfirmDialogInfo,
      ConstraintViolation: ConstraintViolationDialogInfo
    };
  }
  var _proto = GanttDialog.prototype;
  _proto._apply = function _apply() {
    if (this._dialogInfo.isValidated()) {
      const result = this._dialogInfo.getResult();
      this._callback(result);
      this.hide();
    }
  };
  _proto.show = function show(name, parameters, callback, afterClosing, editingOptions) {
    this._callback = callback;
    this._afterClosing = afterClosing;
    if (!this.infoMap[name]) {
      return;
    }
    const isRefresh = this._popupInstance._isVisible() && this._dialogInfo && this._dialogInfo instanceof this.infoMap[name];
    this._dialogInfo = new this.infoMap[name](parameters, this._apply.bind(this), this.hide.bind(this), editingOptions);
    this._popupInstance.option({
      showTitle: !!this._dialogInfo.getTitle(),
      title: this._dialogInfo.getTitle(),
      toolbarItems: this._dialogInfo.getToolbarItems(),
      maxWidth: this._dialogInfo.getMaxWidth(),
      height: this._dialogInfo.getHeight(),
      contentTemplate: this._dialogInfo.getContentTemplate()
    });
    if (this._afterClosing) {
      this._popupInstance.option('onHidden', this._afterClosing);
    }
    if (!isRefresh) {
      this._popupInstance.show();
    }
  };
  _proto.hide = function hide() {
    this._popupInstance.hide();
    if (this._afterClosing) {
      this._afterClosing();
    }
  };
  return GanttDialog;
}();
let DialogInfoBase = /*#__PURE__*/function () {
  function DialogInfoBase(parameters, applyAction, hideAction, editingOptions) {
    this._parameters = parameters;
    this._applyAction = applyAction;
    this._hideAction = hideAction;
    this._editingOptions = editingOptions;
  }
  var _proto2 = DialogInfoBase.prototype;
  _proto2._getFormItems = function _getFormItems() {
    return {};
  };
  _proto2._getFormCssClass = function _getFormCssClass() {
    return '';
  };
  _proto2._getFormData = function _getFormData() {
    return this._parameters;
  };
  _proto2._updateParameters = function _updateParameters() {};
  _proto2._getOkToolbarItem = function _getOkToolbarItem() {
    return this._getToolbarItem('OK', this._applyAction);
  };
  _proto2._getCancelToolbarItem = function _getCancelToolbarItem() {
    return this._getToolbarItem('Cancel', this._hideAction);
  };
  _proto2._getYesToolbarItem = function _getYesToolbarItem() {
    return this._getToolbarItem('Yes', this._applyAction);
  };
  _proto2._getNoToolbarItem = function _getNoToolbarItem() {
    return this._getToolbarItem('No', this._hideAction);
  };
  _proto2._getToolbarItem = function _getToolbarItem(localizationText, action) {
    return {
      widget: 'dxButton',
      toolbar: 'bottom',
      options: {
        text: _message.default.format(localizationText),
        onClick: action
      }
    };
  };
  _proto2.getTitle = function getTitle() {
    return '';
  };
  _proto2.getToolbarItems = function getToolbarItems() {
    return this._editingOptions.enabled ? [this._getOkToolbarItem(), this._getCancelToolbarItem()] : [this._getCancelToolbarItem()];
  };
  _proto2.getMaxWidth = function getMaxWidth() {
    return 400;
  };
  _proto2.getHeight = function getHeight() {
    return 'auto';
  };
  _proto2.getContentTemplate = function getContentTemplate() {
    return content => {
      this._form = new _form.default(content, {
        formData: this._getFormData(),
        items: this._getFormItems(),
        elementAttr: {
          class: this._getFormCssClass()
        },
        rtlEnabled: false
      });
      return content;
    };
  };
  _proto2.getResult = function getResult() {
    const formData = this.getFormData();
    this._updateParameters(formData);
    return this._parameters;
  };
  _proto2.getFormData = function getFormData() {
    const formData = this._form && this._form.option('formData');
    return formData;
  };
  _proto2.isValidated = function isValidated() {
    return true;
  };
  return DialogInfoBase;
}();
let TaskEditDialogInfo = /*#__PURE__*/function (_DialogInfoBase) {
  _inheritsLoose(TaskEditDialogInfo, _DialogInfoBase);
  function TaskEditDialogInfo() {
    return _DialogInfoBase.apply(this, arguments) || this;
  }
  var _proto3 = TaskEditDialogInfo.prototype;
  _proto3.getTitle = function getTitle() {
    return _message.default.format('dxGantt-dialogTaskDetailsTitle');
  };
  _proto3._getFormItems = function _getFormItems() {
    const readOnly = !this._editingOptions.enabled || !this._editingOptions.allowTaskUpdating;
    const readOnlyRange = readOnly || !this._parameters.enableRangeEdit;
    return [{
      dataField: 'title',
      editorType: 'dxTextBox',
      label: {
        text: _message.default.format('dxGantt-dialogTitle')
      },
      editorOptions: {
        readOnly: readOnly || this._isReadOnlyField('title')
      },
      visible: !this._isHiddenField('title')
    }, {
      dataField: 'start',
      editorType: 'dxDateBox',
      label: {
        text: _message.default.format('dxGantt-dialogStartTitle')
      },
      editorOptions: {
        type: 'datetime',
        width: '100%',
        readOnly: readOnlyRange || this._isReadOnlyField('start')
      },
      visible: !this._isHiddenField('start'),
      validationRules: [{
        type: 'required',
        message: _message.default.format('validation-required-formatted', _message.default.format('dxGantt-dialogStartTitle'))
      }, {
        type: 'custom',
        validationCallback: e => {
          if (this._parameters.isValidationRequired) {
            const correctDateRange = this._parameters.getCorrectDateRange(this._parameters.id, e.value, this._parameters.end);
            if (correctDateRange.start.getTime() !== e.value.getTime()) {
              e.rule.message = this._getValidationMessage(true, correctDateRange.start);
              return false;
            }
          }
          return true;
        }
      }]
    }, {
      dataField: 'end',
      editorType: 'dxDateBox',
      label: {
        text: _message.default.format('dxGantt-dialogEndTitle')
      },
      editorOptions: {
        type: 'datetime',
        width: '100%',
        readOnly: readOnlyRange || this._isReadOnlyField('end')
      },
      visible: !this._isHiddenField('end'),
      validationRules: [{
        type: 'required',
        message: _message.default.format('validation-required-formatted', _message.default.format('dxGantt-dialogEndTitle'))
      }, {
        type: 'custom',
        validationCallback: e => {
          if (this._parameters.isValidationRequired) {
            const correctDateRange = this._parameters.getCorrectDateRange(this._parameters.id, this._parameters.start, e.value);
            if (correctDateRange.end.getTime() !== e.value.getTime()) {
              e.rule.message = this._getValidationMessage(false, correctDateRange.end);
              return false;
            }
          }
          return true;
        }
      }]
    }, {
      dataField: 'progress',
      editorType: 'dxNumberBox',
      label: {
        text: _message.default.format('dxGantt-dialogProgressTitle')
      },
      editorOptions: {
        showSpinButtons: true,
        min: 0,
        max: 1,
        format: '#0%',
        step: 0.01,
        readOnly: readOnlyRange || this._isReadOnlyField('progress')
      },
      visible: !this._isHiddenField('progress')
    }, {
      dataField: 'assigned.items',
      editorType: 'dxTagBox',
      label: {
        text: _message.default.format('dxGantt-dialogResourcesTitle')
      },
      editorOptions: {
        readOnly: readOnly || !this._editingOptions.allowTaskResourceUpdating,
        dataSource: this._parameters.resources.items,
        displayExpr: 'text',
        buttons: [{
          name: 'editResources',
          location: 'after',
          options: {
            disabled: !this._editingOptions.allowResourceAdding && !this._editingOptions.allowResourceDeleting,
            text: '...',
            hint: _message.default.format('dxGantt-dialogEditResourceListHint'),
            onClick: () => {
              const showTaskEditDialogCallback = () => {
                this._parameters.showTaskEditDialogCommand.execute();
              };
              this._parameters.showResourcesDialogCommand.execute(showTaskEditDialogCallback);
            }
          }
        }]
      }
    }];
  };
  _proto3._getValidationMessage = function _getValidationMessage(isStartDependencies, correctDate) {
    if (isStartDependencies) {
      return _message.default.format('dxGantt-dialogStartDateValidation', this._getFormattedDateText(correctDate));
    }
    return _message.default.format('dxGantt-dialogEndDateValidation', this._getFormattedDateText(correctDate));
  };
  _proto3._getFormattedDateText = function _getFormattedDateText(date) {
    return date ? _date.default.format(date, 'shortDateShortTime') : '';
  };
  _proto3._isReadOnlyField = function _isReadOnlyField(field) {
    return this._parameters.readOnlyFields.indexOf(field) > -1;
  };
  _proto3._isHiddenField = function _isHiddenField(field) {
    return this._parameters.hiddenFields.indexOf(field) > -1;
  };
  _proto3._getFormData = function _getFormData() {
    const data = {};
    for (const field in this._parameters) {
      data[field] = field === 'progress' ? this._parameters[field] / 100 : this._parameters[field];
    }
    return data;
  };
  _proto3._updateParameters = function _updateParameters(formData) {
    this._parameters.title = formData.title;
    this._parameters.start = formData.start;
    this._parameters.end = formData.end;
    this._parameters.progress = formData.progress * 100;
    this._parameters.assigned = formData.assigned;
  };
  _proto3.isValidated = function isValidated() {
    var _this$_form;
    const validationResult = (_this$_form = this._form) === null || _this$_form === void 0 ? void 0 : _this$_form.validate();
    return validationResult === null || validationResult === void 0 ? void 0 : validationResult.isValid;
  };
  return TaskEditDialogInfo;
}(DialogInfoBase);
let ResourcesEditDialogInfo = /*#__PURE__*/function (_DialogInfoBase2) {
  _inheritsLoose(ResourcesEditDialogInfo, _DialogInfoBase2);
  function ResourcesEditDialogInfo() {
    return _DialogInfoBase2.apply(this, arguments) || this;
  }
  var _proto4 = ResourcesEditDialogInfo.prototype;
  _proto4.getTitle = function getTitle() {
    return _message.default.format('dxGantt-dialogResourceManagerTitle');
  };
  _proto4._getFormItems = function _getFormItems() {
    return [{
      label: {
        visible: false
      },
      dataField: 'resources.items',
      editorType: 'dxList',
      editorOptions: {
        allowItemDeleting: this._editingOptions.enabled && this._editingOptions.allowResourceDeleting,
        itemDeleteMode: 'static',
        selectionMode: 'none',
        items: this._parameters.resources.items,
        height: 250,
        noDataText: _message.default.format('dxGantt-dialogEditNoResources'),
        onInitialized: e => {
          this.list = e.component;
        },
        onItemDeleted: e => {
          this._parameters.resources.remove(e.itemData);
        }
      }
    }, {
      label: {
        visible: false
      },
      editorType: 'dxTextBox',
      editorOptions: {
        readOnly: !this._editingOptions.enabled || !this._editingOptions.allowResourceAdding,
        onInitialized: e => {
          this.textBox = e.component;
        },
        onInput: e => {
          const addButton = e.component.getButton('addResource');
          const resourceName = e.component.option('text');
          addButton.option('disabled', resourceName.length === 0);
        },
        buttons: [{
          name: 'addResource',
          location: 'after',
          options: {
            text: _message.default.format('dxGantt-dialogButtonAdd'),
            disabled: true,
            onClick: e => {
              const newItem = this._parameters.resources.createItem();
              newItem.text = this.textBox.option('text');
              this._parameters.resources.add(newItem);
              this.list.option('items', this._parameters.resources.items);
              this.list.scrollToItem(newItem);
              this.textBox.clear();
              e.component.option('disabled', true);
            }
          }
        }]
      }
    }];
  };
  return ResourcesEditDialogInfo;
}(DialogInfoBase);
let ConfirmDialogInfo = /*#__PURE__*/function (_DialogInfoBase3) {
  _inheritsLoose(ConfirmDialogInfo, _DialogInfoBase3);
  function ConfirmDialogInfo() {
    return _DialogInfoBase3.apply(this, arguments) || this;
  }
  var _proto5 = ConfirmDialogInfo.prototype;
  _proto5.getContentTemplate = function getContentTemplate() {
    return content => {
      return this._getConfirmMessage();
    };
  };
  _proto5._getConfirmMessage = function _getConfirmMessage() {
    switch (this._parameters.type) {
      case 0:
        return _message.default.format('dxGantt-dialogTaskDeleteConfirmation');
      case 1:
        return _message.default.format('dxGantt-dialogDependencyDeleteConfirmation');
      case 2:
        return _message.default.format('dxGantt-dialogResourcesDeleteConfirmation', this._parameters.message);
      default:
        return '';
    }
  };
  _proto5.getToolbarItems = function getToolbarItems() {
    return [this._getYesToolbarItem(), this._getNoToolbarItem()];
  };
  return ConfirmDialogInfo;
}(DialogInfoBase);
let ConstraintViolationDialogInfo = /*#__PURE__*/function (_DialogInfoBase4) {
  _inheritsLoose(ConstraintViolationDialogInfo, _DialogInfoBase4);
  function ConstraintViolationDialogInfo() {
    return _DialogInfoBase4.apply(this, arguments) || this;
  }
  var _proto6 = ConstraintViolationDialogInfo.prototype;
  _proto6._getFormItems = function _getFormItems() {
    const hasCriticalErrors = this._parameters.hasCriticalErrors;
    const severalErrors = this._parameters.errorsCount > 1;
    const items = [];
    const deleteMessage = severalErrors ? 'dxGantt-dialogDeleteDependenciesMessage' : 'dxGantt-dialogDeleteDependencyMessage';
    const moveMessage = severalErrors ? 'dxGantt-dialogMoveTaskAndKeepDependenciesMessage' : 'dxGantt-dialogMoveTaskAndKeepDependencyMessage';
    let titleMessage;
    if (hasCriticalErrors) {
      titleMessage = severalErrors ? 'dxGantt-dialogConstraintCriticalViolationSeveralTasksMessage' : 'dxGantt-dialogConstraintCriticalViolationMessage';
    } else {
      titleMessage = severalErrors ? 'dxGantt-dialogConstraintViolationSeveralTasksMessage' : 'dxGantt-dialogConstraintViolationMessage';
    }
    items.push({
      text: _message.default.format('dxGantt-dialogCancelOperationMessage'),
      value: 0
    });
    items.push({
      text: _message.default.format(deleteMessage),
      value: 1
    });
    if (!hasCriticalErrors) {
      items.push({
        text: _message.default.format(moveMessage),
        value: 2
      });
    }
    return [{
      template: _message.default.format(titleMessage)
    }, {
      cssClass: 'dx-cv-dialog-row',
      dataField: 'option',
      label: {
        visible: false
      },
      editorType: 'dxRadioGroup',
      editorOptions: {
        items: items,
        valueExpr: 'value',
        value: 0
      }
    }];
  };
  _proto6._getFormCssClass = function _getFormCssClass() {
    return 'dx-cv-dialog';
  };
  _proto6._updateParameters = function _updateParameters(formData) {
    this._parameters.option = formData.option;
  };
  return ConstraintViolationDialogInfo;
}(DialogInfoBase);
