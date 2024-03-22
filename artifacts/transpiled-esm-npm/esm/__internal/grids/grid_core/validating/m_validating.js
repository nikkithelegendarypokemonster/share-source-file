/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
import $ from '../../../../core/renderer';
import browser from '../../../../core/utils/browser';
// @ts-expect-error
import { deferUpdate, equalByValue, getKeyHash } from '../../../../core/utils/common';
// @ts-expect-error
import { Deferred, fromPromise, when } from '../../../../core/utils/deferred';
import { extend } from '../../../../core/utils/extend';
import { each } from '../../../../core/utils/iterator';
import { getOuterHeight, getOuterWidth, getWidth, setHeight } from '../../../../core/utils/size';
import { encodeHtml } from '../../../../core/utils/string';
import { isDefined, isEmptyObject, isObject } from '../../../../core/utils/type';
import { createObjectWithChanges } from '../../../../data/array_utils';
import eventsEngine from '../../../../events/core/events_engine';
import pointerEvents from '../../../../events/pointer';
import messageLocalization from '../../../../localization/message';
import Button from '../../../../ui/button';
import LoadIndicator from '../../../../ui/load_indicator';
import Overlay from '../../../../ui/overlay/ui.overlay';
import { current, isFluent } from '../../../../ui/themes';
import ValidationEngine from '../../../../ui/validation_engine';
import Validator from '../../../../ui/validator';
import { focused } from '../../../../ui/widget/selectors';
import errors from '../../../../ui/widget/ui.errors';
import { EDITORS_INPUT_SELECTOR } from '../editing/const';
import modules from '../m_modules';
import gridCoreUtils from '../m_utils';
var INVALIDATE_CLASS = 'invalid';
var REVERT_TOOLTIP_CLASS = 'revert-tooltip';
var INVALID_MESSAGE_CLASS = 'dx-invalid-message';
var INVALID_MESSAGE_ID = 'dxInvalidMessage';
var WIDGET_INVALID_MESSAGE_CLASS = 'invalid-message';
var INVALID_MESSAGE_ALWAYS_CLASS = 'dx-invalid-message-always';
var REVERT_BUTTON_CLASS = 'dx-revert-button';
var REVERT_BUTTON_ID = 'dxRevertButton';
var VALIDATOR_CLASS = 'validator';
var PENDING_INDICATOR_CLASS = 'dx-pending-indicator';
var VALIDATION_PENDING_CLASS = 'dx-validation-pending';
var CONTENT_CLASS = 'content';
var INSERT_INDEX = '__DX_INSERT_INDEX__';
var PADDING_BETWEEN_TOOLTIPS = 2;
var EDIT_MODE_ROW = 'row';
var EDIT_MODE_FORM = 'form';
var EDIT_MODE_BATCH = 'batch';
var EDIT_MODE_CELL = 'cell';
var EDIT_MODE_POPUP = 'popup';
var GROUP_CELL_CLASS = 'dx-group-cell';
var FORM_BASED_MODES = [EDIT_MODE_POPUP, EDIT_MODE_FORM];
var COMMAND_TRANSPARENT = 'transparent';
var VALIDATION_STATUS = {
  valid: 'valid',
  invalid: 'invalid',
  pending: 'pending'
};
var EDIT_DATA_INSERT_TYPE = 'insert';
var EDIT_DATA_REMOVE_TYPE = 'remove';
var VALIDATION_CANCELLED = 'cancel';
var validationResultIsValid = function validationResultIsValid(result) {
  return isDefined(result) && result !== VALIDATION_CANCELLED;
};
var cellValueShouldBeValidated = function cellValueShouldBeValidated(value, rowOptions) {
  return value !== undefined || value === undefined && rowOptions && !rowOptions.isNewRow;
};
export class ValidatingController extends modules.Controller {
  constructor() {
    super(...arguments);
    this._isValidationInProgress = false;
    this._disableApplyValidationResults = false;
  }
  init() {
    this._editingController = this.getController('editing');
    this._editorFactoryController = this.getController('editorFactory');
    this._columnsController = this.getController('columns');
    this.createAction('onRowValidating');
    if (!this._validationState) {
      this.initValidationState();
    }
  }
  initValidationState() {
    this._validationState = [];
    this._validationStateCache = {};
  }
  _rowIsValidated(change) {
    var validationData = this._getValidationData(change === null || change === void 0 ? void 0 : change.key);
    return !!validationData && !!validationData.validated;
  }
  _getValidationData(key, create) {
    var keyHash = getKeyHash(key);
    var isObjectKeyHash = isObject(keyHash);
    var validationData;
    if (isObjectKeyHash) {
      // eslint-disable-next-line prefer-destructuring
      validationData = this._validationState.filter(data => equalByValue(data.key, key))[0];
    } else {
      validationData = this._validationStateCache[keyHash];
    }
    if (!validationData && create) {
      validationData = {
        key,
        isValid: true
      };
      this._validationState.push(validationData);
      if (!isObjectKeyHash) {
        this._validationStateCache[keyHash] = validationData;
      }
    }
    return validationData;
  }
  _getBrokenRules(validationData, validationResults) {
    var brokenRules;
    if (validationResults) {
      brokenRules = validationResults.brokenRules || validationResults.brokenRule && [validationResults.brokenRule];
    } else {
      brokenRules = validationData.brokenRules || [];
    }
    return brokenRules;
  }
  _rowValidating(validationData, validationResults) {
    // @ts-expect-error
    var deferred = new Deferred();
    // @ts-expect-error
    var change = this._editingController.getChangeByKey(validationData === null || validationData === void 0 ? void 0 : validationData.key);
    var brokenRules = this._getBrokenRules(validationData, validationResults);
    var isValid = validationResults ? validationResults.isValid : validationData.isValid;
    var parameters = {
      brokenRules,
      isValid,
      key: change.key,
      newData: change.data,
      oldData: this._editingController._getOldData(change.key),
      promise: null,
      errorText: this.getHiddenValidatorsErrorText(brokenRules)
    };
    this.executeAction('onRowValidating', parameters);
    when(fromPromise(parameters.promise)).always(() => {
      validationData.isValid = parameters.isValid;
      validationData.errorText = parameters.errorText;
      deferred.resolve(parameters);
    });
    return deferred.promise();
  }
  getHiddenValidatorsErrorText(brokenRules) {
    var brokenRulesMessages = [];
    each(brokenRules, (_, brokenRule) => {
      var {
        column
      } = brokenRule;
      var isGroupExpandColumn = column && column.groupIndex !== undefined && !column.showWhenGrouped;
      var isVisibleColumn = column && column.visible;
      if (!brokenRule.validator.$element().parent().length && (!isVisibleColumn || isGroupExpandColumn)) {
        brokenRulesMessages.push(brokenRule.message);
      }
    });
    return brokenRulesMessages.join(', ');
  }
  validate(isFull) {
    var isValid = true;
    var editingController = this._editingController;
    // @ts-expect-error
    var deferred = new Deferred();
    var completeList = [];
    var editMode = editingController.getEditMode();
    isFull = isFull || editMode === EDIT_MODE_ROW;
    if (this._isValidationInProgress) {
      return deferred.resolve(false).promise();
    }
    this._isValidationInProgress = true;
    if (isFull) {
      editingController.addDeferred(deferred);
      var changes = editingController.getChanges();
      each(changes, (index, _ref) => {
        var {
          type,
          key
        } = _ref;
        if (type !== 'remove') {
          var validationData = this._getValidationData(key, true);
          var validationResult = this.validateGroup(validationData);
          completeList.push(validationResult);
          validationResult.done(validationResult => {
            validationData.validated = true;
            isValid = isValid && validationResult.isValid;
          });
        }
      });
    } else if (this._currentCellValidator) {
      var validationResult = this.validateGroup(this._currentCellValidator._findGroup());
      completeList.push(validationResult);
      validationResult.done(validationResult => {
        isValid = validationResult.isValid;
      });
    }
    when(...completeList).done(() => {
      this._isValidationInProgress = false;
      deferred.resolve(isValid);
    });
    return deferred.promise();
  }
  validateGroup(validationData) {
    // @ts-expect-error
    var result = new Deferred();
    var validateGroup = validationData && ValidationEngine.getGroupConfig(validationData);
    var validationResult;
    if (validateGroup === null || validateGroup === void 0 ? void 0 : validateGroup.validators.length) {
      this.resetRowValidationResults(validationData);
      validationResult = ValidationEngine.validateGroup(validationData);
    }
    when((validationResult === null || validationResult === void 0 ? void 0 : validationResult.complete) || validationResult).done(validationResult => {
      when(this._rowValidating(validationData, validationResult)).done(result.resolve);
    });
    return result.promise();
  }
  isRowDataModified(change) {
    return !isEmptyObject(change.data);
  }
  updateValidationState(change) {
    var editMode = this._editingController.getEditMode();
    var {
      key
    } = change;
    var validationData = this._getValidationData(key, true);
    if (!FORM_BASED_MODES.includes(editMode)) {
      if (change.type === EDIT_DATA_INSERT_TYPE && !this.isRowDataModified(change)) {
        validationData.isValid = true;
        return;
      }
      this.setDisableApplyValidationResults(true);
      var groupConfig = ValidationEngine.getGroupConfig(validationData);
      if (groupConfig) {
        var validationResult = ValidationEngine.validateGroup(validationData);
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        when(validationResult.complete || validationResult).done(validationResult => {
          // @ts-expect-error
          validationData.isValid = validationResult.isValid;
          // @ts-expect-error
          validationData.brokenRules = validationResult.brokenRules;
        });
      } else if (!validationData.brokenRules || !validationData.brokenRules.length) {
        validationData.isValid = true;
      }
      this.setDisableApplyValidationResults(false);
    } else {
      validationData.isValid = true;
    }
  }
  setValidator(validator) {
    this._currentCellValidator = validator;
  }
  renderCellPendingIndicator($container) {
    var $indicator = $container.find(".".concat(PENDING_INDICATOR_CLASS));
    if (!$indicator.length) {
      var $indicatorContainer = $container;
      $indicator = $('<div>').appendTo($indicatorContainer).addClass(PENDING_INDICATOR_CLASS);
      this._createComponent($indicator, LoadIndicator);
      $container.addClass(VALIDATION_PENDING_CLASS);
    }
  }
  disposeCellPendingIndicator($container) {
    var $indicator = $container.find(".".concat(PENDING_INDICATOR_CLASS));
    if ($indicator.length) {
      var indicator = LoadIndicator.getInstance($indicator);
      if (indicator) {
        indicator.dispose();
        indicator.$element().remove();
      }
      $container.removeClass(VALIDATION_PENDING_CLASS);
    }
  }
  validationStatusChanged(result) {
    var {
      validator
    } = result;
    var validationGroup = validator.option('validationGroup');
    var {
      column
    } = validator.option('dataGetter')();
    this.updateCellValidationResult({
      rowKey: validationGroup.key,
      columnIndex: column.index,
      validationResult: result
    });
  }
  validatorInitialized(arg) {
    arg.component.on('validating', this.validationStatusChanged.bind(this));
    arg.component.on('validated', this.validationStatusChanged.bind(this));
  }
  validatorDisposing(arg) {
    var validator = arg.component;
    var validationGroup = validator.option('validationGroup');
    var {
      column
    } = validator.option('dataGetter')();
    var result = this.getCellValidationResult({
      rowKey: validationGroup === null || validationGroup === void 0 ? void 0 : validationGroup.key,
      columnIndex: column.index
    });
    if (validationResultIsValid(result) && result.status === VALIDATION_STATUS.pending) {
      this.cancelCellValidationResult({
        change: validationGroup,
        columnIndex: column.index
      });
    }
  }
  applyValidationResult($container, result) {
    var {
      validator
    } = result;
    var validationGroup = validator.option('validationGroup');
    var {
      column
    } = validator.option('dataGetter')();
    result.brokenRules && result.brokenRules.forEach(rule => {
      rule.columnIndex = column.index;
      rule.column = column;
    });
    if ($container) {
      var validationResult = this.getCellValidationResult({
        rowKey: validationGroup.key,
        columnIndex: column.index
      });
      var requestIsDisabled = validationResultIsValid(validationResult) && validationResult.disabledPendingId === result.id;
      if (this._disableApplyValidationResults || requestIsDisabled) {
        return;
      }
      if (result.status === VALIDATION_STATUS.invalid) {
        var $focus = $container.find(':focus');
        if (!focused($focus)) {
          // @ts-expect-error
          eventsEngine.trigger($focus, 'focus');
          // @ts-expect-error
          eventsEngine.trigger($focus, pointerEvents.down);
        }
      }
      // @ts-expect-error
      var editor = !column.editCellTemplate && this._editorFactoryController.getEditorInstance($container);
      if (result.status === VALIDATION_STATUS.pending) {
        if (editor) {
          editor.option('validationStatus', VALIDATION_STATUS.pending);
        } else {
          this.renderCellPendingIndicator($container);
        }
      } else if (editor) {
        editor.option('validationStatus', VALIDATION_STATUS.valid);
      } else {
        this.disposeCellPendingIndicator($container);
      }
      $container.toggleClass(this.addWidgetPrefix(INVALIDATE_CLASS), result.status === VALIDATION_STATUS.invalid);
    }
  }
  _syncInternalEditingData(parameters) {
    var _a;
    var editingController = this._editingController;
    // @ts-expect-error
    var change = editingController.getChangeByKey(parameters.key);
    var oldDataFromState = editingController._getOldData(parameters.key);
    var oldData = (_a = parameters.row) === null || _a === void 0 ? void 0 : _a.oldData;
    if (change && oldData && !oldDataFromState) {
      editingController._addInternalData({
        key: parameters.key,
        oldData
      });
    }
  }
  createValidator(parameters, $container) {
    var _a, _b, _c;
    var editingController = this._editingController;
    var {
      column
    } = parameters;
    var {
      showEditorAlways
    } = column;
    if (isDefined(column.command) || !column.validationRules || !Array.isArray(column.validationRules) || !column.validationRules.length) return;
    var editIndex = editingController.getIndexByKey(parameters.key, editingController.getChanges());
    var needCreateValidator = editIndex > -1;
    if (!needCreateValidator) {
      if (!showEditorAlways) {
        var visibleColumns = ((_a = this._columnsController) === null || _a === void 0 ? void 0 : _a.getVisibleColumns()) || [];
        showEditorAlways = visibleColumns.some(column => column.showEditorAlways);
      }
      var isEditRow = equalByValue(this.option('editing.editRowKey'), parameters.key);
      var isCellOrBatchEditingAllowed = editingController.isCellOrBatchEditMode() && editingController.allowUpdating({
        row: parameters.row
      });
      needCreateValidator = isEditRow || isCellOrBatchEditingAllowed && showEditorAlways;
      if (isCellOrBatchEditingAllowed && showEditorAlways) {
        editingController._addInternalData({
          key: parameters.key,
          oldData: (_c = (_b = parameters.row) === null || _b === void 0 ? void 0 : _b.oldData) !== null && _c !== void 0 ? _c : parameters.data
        });
      }
    }
    if (needCreateValidator) {
      if ($container && !$container.length) {
        errors.log('E1050');
        return;
      }
      this._syncInternalEditingData(parameters);
      var validationData = this._getValidationData(parameters.key, true);
      var getValue = () => {
        // @ts-expect-error
        var change = editingController.getChangeByKey(validationData === null || validationData === void 0 ? void 0 : validationData.key);
        var value = column.calculateCellValue((change === null || change === void 0 ? void 0 : change.data) || {});
        return value !== undefined ? value : parameters.value;
      };
      var useDefaultValidator = $container && $container.hasClass('dx-widget');
      $container && $container.addClass(this.addWidgetPrefix(VALIDATOR_CLASS));
      var validator = new Validator($container || $('<div>'), {
        name: column.caption,
        validationRules: extend(true, [], column.validationRules),
        validationGroup: validationData,
        // @ts-expect-error
        adapter: useDefaultValidator ? null : {
          getValue,
          applyValidationResults: result => {
            this.applyValidationResult($container, result);
          }
        },
        dataGetter() {
          var key = validationData === null || validationData === void 0 ? void 0 : validationData.key;
          // @ts-expect-error
          var change = editingController.getChangeByKey(key);
          var oldData = editingController._getOldData(key);
          return {
            data: createObjectWithChanges(oldData, change === null || change === void 0 ? void 0 : change.data),
            column
          };
        },
        onInitialized: this.validatorInitialized.bind(this),
        onDisposing: this.validatorDisposing.bind(this)
      });
      if (useDefaultValidator) {
        var adapter = validator.option('adapter');
        if (adapter) {
          var originBypass = adapter.bypass;
          var defaultAdapterBypass = () => parameters.row.isNewRow && !this._isValidationInProgress && !editingController.isCellModified(parameters);
          adapter.getValue = getValue;
          adapter.validationRequestsCallbacks = [];
          // @ts-expect-error
          adapter.bypass = () => originBypass.call(adapter) || defaultAdapterBypass();
        }
      }
      return validator;
    }
    return undefined;
  }
  setDisableApplyValidationResults(flag) {
    this._disableApplyValidationResults = flag;
  }
  getDisableApplyValidationResults() {
    return this._disableApplyValidationResults;
  }
  isCurrentValidatorProcessing(_ref2) {
    var {
      rowKey,
      columnIndex
    } = _ref2;
    return this._currentCellValidator && equalByValue(this._currentCellValidator.option('validationGroup').key, rowKey) && this._currentCellValidator.option('dataGetter')().column.index === columnIndex;
  }
  validateCell(validator) {
    var cellParams = {
      rowKey: validator.option('validationGroup').key,
      columnIndex: validator.option('dataGetter')().column.index,
      validationResult: null
    };
    var validationResult = this.getCellValidationResult(cellParams);
    var stateRestored = validationResultIsValid(validationResult);
    var adapter = validator.option('adapter');
    if (!stateRestored) {
      validationResult = validator.validate();
    } else {
      var currentCellValue = adapter.getValue();
      if (!equalByValue(currentCellValue, validationResult.value)) {
        validationResult = validator.validate();
      }
    }
    // @ts-expect-error
    var deferred = new Deferred();
    if (stateRestored && validationResult.status === VALIDATION_STATUS.pending) {
      this.updateCellValidationResult(cellParams);
      adapter.applyValidationResults(validationResult);
    }
    when(validationResult.complete || validationResult).done(validationResult => {
      stateRestored && adapter.applyValidationResults(validationResult);
      deferred.resolve(validationResult);
    });
    return deferred.promise();
  }
  updateCellValidationResult(_ref3) {
    var {
      rowKey,
      columnIndex,
      validationResult
    } = _ref3;
    var validationData = this._getValidationData(rowKey);
    if (!validationData) {
      return;
    }
    if (!validationData.validationResults) {
      validationData.validationResults = {};
    }
    var result;
    if (validationResult) {
      result = extend({}, validationResult);
      validationData.validationResults[columnIndex] = result;
      if (validationResult.status === VALIDATION_STATUS.pending) {
        if (this._editingController.getEditMode() === EDIT_MODE_CELL) {
          // @ts-expect-error
          result.deferred = new Deferred();
          result.complete.always(() => {
            result.deferred.resolve();
          });
          this._editingController.addDeferred(result.deferred);
        }
        if (this._disableApplyValidationResults) {
          result.disabledPendingId = validationResult.id;
          return;
        }
      }
    } else {
      result = validationData.validationResults[columnIndex];
    }
    if (result && result.disabledPendingId) {
      delete result.disabledPendingId;
    }
  }
  getCellValidationResult(_ref4) {
    var {
      rowKey,
      columnIndex
    } = _ref4;
    var _a;
    var validationData = this._getValidationData(rowKey, true);
    return (_a = validationData === null || validationData === void 0 ? void 0 : validationData.validationResults) === null || _a === void 0 ? void 0 : _a[columnIndex];
  }
  removeCellValidationResult(_ref5) {
    var {
      change,
      columnIndex
    } = _ref5;
    var validationData = this._getValidationData(change === null || change === void 0 ? void 0 : change.key);
    if (validationData && validationData.validationResults) {
      this.cancelCellValidationResult({
        change,
        columnIndex
      });
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete validationData.validationResults[columnIndex];
    }
  }
  cancelCellValidationResult(_ref6) {
    var {
      change,
      columnIndex
    } = _ref6;
    var validationData = this._getValidationData(change.key);
    if (change && validationData.validationResults) {
      var result = validationData.validationResults[columnIndex];
      if (result) {
        result.deferred && result.deferred.reject(VALIDATION_CANCELLED);
        validationData.validationResults[columnIndex] = VALIDATION_CANCELLED;
      }
    }
  }
  resetRowValidationResults(validationData) {
    if (validationData) {
      validationData.validationResults && delete validationData.validationResults;
      delete validationData.validated;
    }
  }
  isInvalidCell(_ref7) {
    var {
      rowKey,
      columnIndex
    } = _ref7;
    var result = this.getCellValidationResult({
      rowKey,
      columnIndex
    });
    return validationResultIsValid(result) && result.status === VALIDATION_STATUS.invalid;
  }
  getCellValidator(_ref8) {
    var {
      rowKey,
      columnIndex
    } = _ref8;
    var validationData = this._getValidationData(rowKey);
    var groupConfig = validationData && ValidationEngine.getGroupConfig(validationData);
    var validators = groupConfig && groupConfig.validators;
    return validators && validators.filter(v => {
      var {
        column
      } = v.option('dataGetter')();
      return column ? column.index === columnIndex : false;
    })[0];
  }
  setCellValidationStatus(cellOptions) {
    var validationResult = this.getCellValidationResult({
      rowKey: cellOptions.key,
      columnIndex: cellOptions.column.index
    });
    if (isDefined(validationResult)) {
      cellOptions.validationStatus = validationResult !== VALIDATION_CANCELLED ? validationResult.status : VALIDATION_CANCELLED;
    } else {
      delete cellOptions.validationStatus;
    }
  }
}
export var validatingEditingExtender = Base => class ValidateEditingControllerExtender extends Base {
  processDataItemTreeListHack(item) {
    // @ts-expect-error
    super.processDataItem.apply(this, arguments);
  }
  processItemsTreeListHack(items, e) {
    // @ts-expect-error
    return super.processItems.apply(this, arguments);
  }
  _addChange(changeParams) {
    var change = super._addChange.apply(this, arguments);
    if (change && changeParams.type !== EDIT_DATA_REMOVE_TYPE) {
      this._validatingController.updateValidationState(change);
    }
    return change;
  }
  _handleChangesChange(args) {
    super._handleChangesChange.apply(this, arguments);
    args.value.forEach(change => {
      if (this._validatingController._getValidationData(change.key) === undefined) {
        this._validatingController.updateValidationState(change);
      }
    });
  }
  _updateRowAndPageIndices() {
    var that = this;
    var startInsertIndex = that.getView('rowsView').getTopVisibleItemIndex();
    var rowIndex = startInsertIndex;
    each(that.getChanges(), (_, _ref9) => {
      var {
        key,
        type
      } = _ref9;
      var validationData = this._validatingController._getValidationData(key);
      if (validationData && !validationData.isValid && validationData.pageIndex !== that._pageIndex) {
        validationData.pageIndex = that._pageIndex;
        if (type === EDIT_DATA_INSERT_TYPE) {
          validationData.rowIndex = startInsertIndex;
        } else {
          validationData.rowIndex = rowIndex;
        }
        rowIndex++;
      }
    });
  }
  _getValidationGroupsInForm(detailOptions) {
    var validationData = this._validatingController._getValidationData(detailOptions.key, true);
    return {
      validationGroup: validationData
    };
  }
  _validateEditFormAfterUpdate(row, isCustomSetCellValue) {
    // T816256, T844143
    if (isCustomSetCellValue && this._editForm) {
      this._editForm.validate();
    }
    super._validateEditFormAfterUpdate.apply(this, arguments);
  }
  _prepareEditCell(params) {
    // @ts-expect-error
    var isNotCanceled = super._prepareEditCell.apply(this, arguments);
    if (isNotCanceled && params.column.showEditorAlways) {
      this._validatingController.updateValidationState({
        key: params.key
      });
    }
    return isNotCanceled;
  }
  processItems(items, changeType) {
    var changes = this.getChanges();
    var getIndexByChange = (change, items) => {
      var index = -1;
      var isInsert = change.type === EDIT_DATA_INSERT_TYPE;
      var {
        key
      } = change;
      each(items, (i, item) => {
        if (equalByValue(key, isInsert ? item.key : this._dataController.keyOf(item))) {
          index = i;
          return false;
        }
        return undefined;
      });
      return index;
    };
    items = super.processItems(items, changeType);
    var itemsCount = items.length;
    var addInValidItem = function addInValidItem(change, validationData) {
      var data = {
        key: change.key
      };
      var index = getIndexByChange(change, items);
      if (index >= 0) {
        return;
      }
      validationData.rowIndex = validationData.rowIndex > itemsCount ? validationData.rowIndex % itemsCount : validationData.rowIndex;
      var {
        rowIndex
      } = validationData;
      data[INSERT_INDEX] = 1;
      items.splice(rowIndex, 0, data);
    };
    if (this.getEditMode() === EDIT_MODE_BATCH && changeType !== 'prepend' && changeType !== 'append') {
      changes.forEach(change => {
        var {
          key
        } = change;
        var validationData = this._validatingController._getValidationData(key);
        if (validationData && change.type && validationData.pageIndex === this._pageIndex && (change === null || change === void 0 ? void 0 : change.pageIndex) !== this._pageIndex) {
          addInValidItem(change, validationData);
        }
      });
    }
    return items;
  }
  processDataItem(item) {
    var isInserted = item.data[INSERT_INDEX];
    var key = isInserted ? item.data.key : item.key;
    var editMode = this.getEditMode();
    if (editMode === EDIT_MODE_BATCH && isInserted && key) {
      var changes = this.getChanges();
      var editIndex = gridCoreUtils.getIndexByKey(key, changes);
      if (editIndex >= 0) {
        var change = changes[editIndex];
        if (change.type !== EDIT_DATA_INSERT_TYPE) {
          var oldData = this._getOldData(change.key);
          item.data = extend(true, {}, oldData, change.data);
          item.key = key;
        }
      }
    }
    super.processDataItem.apply(this, arguments);
  }
  _createInvisibleColumnValidators(changes) {
    var that = this;
    var columns = this._columnsController.getColumns();
    var invisibleColumns = this._columnsController.getInvisibleColumns().filter(column => !column.isBand);
    var groupColumns = this._columnsController.getGroupColumns().filter(column => !column.showWhenGrouped && invisibleColumns.indexOf(column) === -1);
    var invisibleColumnValidators = [];
    var isCellVisible = (column, rowKey) => this._dataController.getRowIndexByKey(rowKey) >= 0 && invisibleColumns.indexOf(column) < 0;
    invisibleColumns.push(...groupColumns);
    if (!FORM_BASED_MODES.includes(this.getEditMode())) {
      each(columns, (_, column) => {
        changes.forEach(change => {
          var data;
          if (isCellVisible(column, change.key)) {
            return;
          }
          if (change.type === EDIT_DATA_INSERT_TYPE) {
            data = change.data;
          } else if (change.type === 'update') {
            var oldData = that._getOldData(change.key);
            if (!isDefined(oldData)) {
              return;
            }
            data = createObjectWithChanges(oldData, change.data);
          }
          if (data) {
            var validator = this._validatingController.createValidator({
              column,
              key: change.key,
              value: column.calculateCellValue(data)
            });
            if (validator) {
              invisibleColumnValidators.push(validator);
            }
          }
        });
      });
    }
    return function () {
      invisibleColumnValidators.forEach(validator => {
        validator.dispose();
      });
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _beforeSaveEditData(change, editIndex) {
    var result = super._beforeSaveEditData.apply(this, arguments);
    var validationData = this._validatingController._getValidationData(change === null || change === void 0 ? void 0 : change.key);
    if (change) {
      var isValid = change.type === 'remove' || validationData.isValid;
      result = result || !isValid;
    } else {
      var disposeValidators = this._createInvisibleColumnValidators(this.getChanges());
      // @ts-expect-error
      result = new Deferred();
      this.executeOperation(result, () => {
        this._validatingController.validate(true).done(isFullValid => {
          disposeValidators();
          this._updateRowAndPageIndices();
          // eslint-disable-next-line default-case, @typescript-eslint/switch-exhaustiveness-check
          switch (this.getEditMode()) {
            case EDIT_MODE_CELL:
              if (!isFullValid) {
                this._focusEditingCell();
              }
              break;
            case EDIT_MODE_BATCH:
              if (!isFullValid) {
                this._resetEditRowKey();
                this._resetEditColumnName();
                this._dataController.updateItems();
              }
              break;
          }
          result.resolve(!isFullValid);
        });
      });
    }
    return result.promise ? result.promise() : result;
  }
  /**
   * @param rowIndex Row index
   * @param columnIndex Column index
   * @param item Data item
   * @returns A deferred object that resolves to a boolean or just a boolean to determine whether to cancel cell editing
   */
  _beforeEditCell(rowIndex, columnIndex, item) {
    // @ts-expect-error
    var result = super._beforeEditCell(rowIndex, columnIndex, item);
    if (this.getEditMode() === EDIT_MODE_CELL) {
      var $cell = this._rowsView._getCellElement(rowIndex, columnIndex);
      var validator = $cell && $cell.data('dxValidator');
      var rowOptions = $cell && $cell.closest('.dx-row').data('options');
      // @ts-expect-error
      var value = validator && validator.option('adapter').getValue();
      if (validator && cellValueShouldBeValidated(value, rowOptions)) {
        // @ts-expect-error
        var deferred = new Deferred();
        when(this._validatingController.validateCell(validator), result).done((validationResult, result) => {
          deferred.resolve(validationResult.status === VALIDATION_STATUS.valid && result);
        });
        return deferred.promise();
      }
      if (!validator) {
        return result;
      }
    }
    return false;
  }
  _afterSaveEditData(cancel) {
    var $firstErrorRow;
    var isCellEditMode = this.getEditMode() === EDIT_MODE_CELL;
    each(this.getChanges(), (_, change) => {
      var $errorRow = this._showErrorRow(change);
      $firstErrorRow = $firstErrorRow || $errorRow;
    });
    if ($firstErrorRow) {
      var scrollable = this._rowsView.getScrollable();
      if (scrollable) {
        scrollable.update();
        scrollable.scrollToElement($firstErrorRow);
      }
    }
    if (cancel && isCellEditMode && this._needUpdateRow()) {
      var editRowIndex = this.getEditRowIndex();
      this._dataController.updateItems({
        changeType: 'update',
        rowIndices: [editRowIndex]
      });
      this._focusEditingCell();
    } else if (!cancel) {
      var shouldResetValidationState = true;
      if (isCellEditMode) {
        var columns = this._columnsController.getColumns();
        var columnsWithValidatingEditors = columns.filter(col => {
          var _a;
          return col.showEditorAlways && ((_a = col.validationRules) === null || _a === void 0 ? void 0 : _a.length) > 0;
        }).length > 0;
        shouldResetValidationState = !columnsWithValidatingEditors;
      }
      if (shouldResetValidationState) {
        this._validatingController.initValidationState();
      }
    }
  }
  _handleDataChanged(args) {
    var validationState = this._validatingController._validationState;
    if (this.option('scrolling.mode') === 'standard') {
      this.resetRowAndPageIndices();
    }
    if (args.changeType === 'prepend') {
      each(validationState, (_, validationData) => {
        validationData.rowIndex += args.items.length;
      });
    }
    super._handleDataChanged(args);
  }
  resetRowAndPageIndices() {
    var validationState = this._validatingController._validationState;
    each(validationState, (_, validationData) => {
      if (validationData.pageIndex !== this._pageIndex) {
        delete validationData.pageIndex;
        delete validationData.rowIndex;
      }
    });
  }
  _beforeCancelEditData() {
    this._validatingController.initValidationState();
    super._beforeCancelEditData();
  }
  _showErrorRow(change) {
    var $popupContent;
    var items = this._dataController.items();
    var rowIndex = this.getIndexByKey(change.key, items);
    var validationData = this._validatingController._getValidationData(change.key);
    if (!(validationData === null || validationData === void 0 ? void 0 : validationData.isValid) && (validationData === null || validationData === void 0 ? void 0 : validationData.errorText) && rowIndex >= 0) {
      $popupContent = this.getPopupContent();
      return this._errorHandlingController && this._errorHandlingController.renderErrorRow(validationData === null || validationData === void 0 ? void 0 : validationData.errorText, rowIndex, $popupContent);
    }
  }
  updateFieldValue(e) {
    // @ts-expect-error
    var deferred = new Deferred();
    this._validatingController.removeCellValidationResult({
      change: this.getChangeByKey(e.key),
      columnIndex: e.column.index
    });
    super.updateFieldValue.apply(this, arguments).done(() => {
      var currentValidator = this._validatingController.getCellValidator({
        rowKey: e.key,
        columnIndex: e.column.index
      });
      when(currentValidator && this._validatingController.validateCell(currentValidator)).done(validationResult => {
        this._editorFactoryController.refocus();
        deferred.resolve(validationResult);
      });
    });
    return deferred.promise();
  }
  highlightDataCell($cell, parameters) {
    super.highlightDataCell.apply(this, arguments);
    this._validatingController.setCellValidationStatus(parameters);
    var isEditableCell = !!parameters.setValue;
    var cellModified = this.isCellModified(parameters);
    var isValidated = isDefined(parameters.validationStatus);
    var needValidation = cellModified && parameters.column.setCellValue || isEditableCell && !cellModified && !(parameters.row.isNewRow || !isValidated);
    if (needValidation) {
      var validator = $cell.data('dxValidator');
      if (validator) {
        when(this._validatingController.validateCell(validator)).done(() => {
          this._validatingController.setCellValidationStatus(parameters);
        });
      }
    }
  }
  getChangeByKey(key) {
    var changes = this.getChanges();
    return changes[gridCoreUtils.getIndexByKey(key, changes)];
  }
  isCellModified(parameters) {
    var cellModified = super.isCellModified(parameters);
    var change = this.getChangeByKey(parameters.key);
    var isCellInvalid = !!parameters.row && this._validatingController.isInvalidCell({
      rowKey: parameters.key,
      columnIndex: parameters.column.index
    });
    return cellModified || this._validatingController._rowIsValidated(change) && isCellInvalid;
  }
};
var getWidthOfVisibleCells = function getWidthOfVisibleCells(that, element) {
  var rowIndex = $(element).closest('tr').index();
  var $cellElements = $(that._rowsView.getRowElement(rowIndex)).first().children().filter(':not(.dx-hidden-cell)');
  return that._rowsView._getWidths($cellElements).reduce((w1, w2) => w1 + w2, 0);
};
var getBoundaryNonFixedColumnsInfo = function getBoundaryNonFixedColumnsInfo(fixedColumns) {
  var firstNonFixedColumnIndex;
  var lastNonFixedColumnIndex;
  // eslint-disable-next-line array-callback-return
  fixedColumns.some((column, index) => {
    if (column.command === COMMAND_TRANSPARENT) {
      firstNonFixedColumnIndex = index === 0 ? -1 : index;
      lastNonFixedColumnIndex = index === fixedColumns.length - 1 ? -1 : index + column.colspan - 1;
      return true;
    }
    return undefined;
  });
  return {
    startColumnIndex: firstNonFixedColumnIndex,
    endColumnIndex: lastNonFixedColumnIndex
  };
};
export var validatingEditorFactoryExtender = Base => class ValidatingEditorFactoryExtender extends Base {
  _showRevertButton($container) {
    var _a;
    var $tooltipElement = (_a = this._revertTooltip) === null || _a === void 0 ? void 0 : _a.$element();
    if (!$container || !$container.length) {
      $tooltipElement === null || $tooltipElement === void 0 ? void 0 : $tooltipElement.remove();
      this._revertTooltip = undefined;
      return;
    }
    // do not render tooltip if it is already rendered
    if ($container.find($tooltipElement).length) {
      return;
    }
    var $overlayContainer = $container.closest(".".concat(this.addWidgetPrefix(CONTENT_CLASS))).parent();
    var revertTooltipClass = this.addWidgetPrefix(REVERT_TOOLTIP_CLASS);
    $tooltipElement === null || $tooltipElement === void 0 ? void 0 : $tooltipElement.remove();
    $tooltipElement = $('<div>').addClass(revertTooltipClass).appendTo($container);
    var tooltipOptions = {
      animation: null,
      visible: true,
      width: 'auto',
      height: 'auto',
      shading: false,
      container: $overlayContainer,
      propagateOutsideClick: true,
      hideOnOutsideClick: false,
      wrapperAttr: {
        class: revertTooltipClass
      },
      contentTemplate: () => {
        var $buttonElement = $('<div>').addClass(REVERT_BUTTON_CLASS);
        var buttonOptions = {
          icon: 'revert',
          hint: this.option('editing.texts.validationCancelChanges'),
          elementAttr: {
            id: REVERT_BUTTON_ID,
            'aria-label': messageLocalization.format('dxDataGrid-ariaRevertButton')
          },
          onClick: () => {
            this._editingController.cancelEditData();
          }
        };
        // @ts-expect-error
        return new Button($buttonElement, buttonOptions).$element();
      },
      position: {
        my: 'left top',
        at: 'right top',
        offset: '1 0',
        collision: 'flip',
        boundaryOffset: '0 0',
        boundary: this._rowsView.element(),
        of: $container
      },
      onPositioned: this._positionedHandler.bind(this)
    };
    this._revertTooltip = new Overlay($tooltipElement, tooltipOptions);
  }
  _hideFixedGroupCell($cell, overlayOptions) {
    var $nextFixedRowElement;
    var $groupCellElement;
    // @ts-expect-error
    var isFixedColumns = this._rowsView.isFixedColumns();
    // @ts-expect-error
    var isFormOrPopupEditMode = this._editingController.isFormOrPopupEditMode();
    if (isFixedColumns && !isFormOrPopupEditMode) {
      var nextRowOptions = $cell.closest('.dx-row').next().data('options');
      if (nextRowOptions && nextRowOptions.rowType === 'group') {
        $nextFixedRowElement = $(this._rowsView.getRowElement(nextRowOptions.rowIndex)).last();
        $groupCellElement = $nextFixedRowElement.find(".".concat(GROUP_CELL_CLASS));
        if ($groupCellElement.length && $groupCellElement.get(0).style.visibility !== 'hidden') {
          $groupCellElement.css('visibility', 'hidden');
          overlayOptions.onDisposing = function () {
            $groupCellElement.css('visibility', '');
          };
        }
      }
    }
  }
  _positionedHandler(e, isOverlayVisible) {
    if (!e.component.__skipPositionProcessing) {
      var isRevertButton = $(e.element).hasClass(this.addWidgetPrefix(REVERT_TOOLTIP_CLASS));
      var needRepaint = !isRevertButton && this._rowsView.updateFreeSpaceRowHeight();
      var normalizedPosition = this._normalizeValidationMessagePositionAndMaxWidth(e, isRevertButton, isOverlayVisible);
      e.component.__skipPositionProcessing = !!(needRepaint || normalizedPosition);
      if (normalizedPosition) {
        e.component.option(normalizedPosition);
      } else if (needRepaint) {
        e.component.repaint();
      }
    }
  }
  _showValidationMessage($cell, messages, alignment) {
    var _a;
    var editorPopup = $cell.find('.dx-dropdowneditor-overlay').data('dxPopup');
    var isOverlayVisible = editorPopup && editorPopup.option('visible');
    var myPosition = isOverlayVisible ? 'top right' : "top ".concat(alignment);
    var atPosition = isOverlayVisible ? 'top left' : "bottom ".concat(alignment);
    // TODO: Don't forget to remove this code
    //  after refactoring the fixed table position (or implementation).
    var hasFixedColumns = ((_a = this._columnsController.getFixedColumns()) === null || _a === void 0 ? void 0 : _a.length) > 0;
    var $overlayContainer = hasFixedColumns ? this.getView('rowsView').element() : $cell.closest(".".concat(this.addWidgetPrefix(CONTENT_CLASS)));
    var errorMessageText = '';
    messages && messages.forEach(message => {
      errorMessageText += (errorMessageText.length ? '<br/>' : '') + encodeHtml(message);
    });
    var invalidMessageClass = this.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS);
    this._rowsView.element().find(".".concat(invalidMessageClass)).remove();
    var $overlayElement = $('<div>').addClass(INVALID_MESSAGE_CLASS).addClass(INVALID_MESSAGE_ALWAYS_CLASS).addClass(invalidMessageClass).html(errorMessageText).appendTo($cell);
    var overlayOptions = {
      container: $overlayContainer,
      shading: false,
      width: 'auto',
      height: 'auto',
      visible: true,
      animation: false,
      propagateOutsideClick: true,
      hideOnOutsideClick: false,
      wrapperAttr: {
        id: INVALID_MESSAGE_ID,
        class: "".concat(INVALID_MESSAGE_CLASS, " ").concat(INVALID_MESSAGE_ALWAYS_CLASS, " ").concat(invalidMessageClass)
      },
      position: {
        collision: 'flip',
        boundary: this._rowsView.element(),
        boundaryOffset: '0 0',
        offset: {
          x: 0,
          // Firefox consider the top row/cell border when calculating a cell offset.
          y: !isOverlayVisible && browser.mozilla ? -1 : 0
        },
        my: myPosition,
        at: atPosition,
        of: $cell
      },
      onPositioned: e => {
        this._positionedHandler(e, isOverlayVisible);
        this._shiftValidationMessageIfNeed(e.component.$content(), $cell);
      }
    };
    this._hideFixedGroupCell($cell, overlayOptions);
    // eslint-disable-next-line no-new
    new Overlay($overlayElement, overlayOptions);
  }
  _hideValidationMessage() {
    var _a;
    var validationMessages = (_a = this._rowsView.element()) === null || _a === void 0 ? void 0 : _a.find(this._getValidationMessagesSelector());
    validationMessages === null || validationMessages === void 0 ? void 0 : validationMessages.remove();
  }
  _normalizeValidationMessagePositionAndMaxWidth(options, isRevertButton, isOverlayVisible) {
    var fixedColumns = this._columnsController.getFixedColumns();
    if (!fixedColumns || !fixedColumns.length) {
      return;
    }
    var position;
    var visibleTableWidth = !isRevertButton && getWidthOfVisibleCells(this, options.element);
    var $overlayContentElement = options.component.$content();
    var validationMessageWidth = getOuterWidth($overlayContentElement, true);
    var needMaxWidth = !isRevertButton && validationMessageWidth > visibleTableWidth;
    var columnIndex = this._rowsView.getCellIndex($(options.element).closest('td'));
    var boundaryNonFixedColumnsInfo = getBoundaryNonFixedColumnsInfo(fixedColumns);
    if (!isRevertButton && (columnIndex === boundaryNonFixedColumnsInfo.startColumnIndex || needMaxWidth)) {
      position = {
        collision: 'none flip',
        my: 'top left',
        at: isOverlayVisible ? 'top right' : 'bottom left'
      };
    } else if (columnIndex === boundaryNonFixedColumnsInfo.endColumnIndex) {
      position = {
        collision: 'none flip',
        my: 'top right',
        at: isRevertButton || isOverlayVisible ? 'top left' : 'bottom right'
      };
      if (isRevertButton) {
        position.offset = '-1 0';
      }
    }
    return position && {
      position,
      maxWidth: needMaxWidth ? visibleTableWidth - 2 : undefined
    };
  }
  _shiftValidationMessageIfNeed($content, $cell) {
    var $revertContent = this._revertTooltip && this._revertTooltip.$content();
    if (!$revertContent) return;
    var contentOffset = $content.offset();
    var revertContentOffset = $revertContent.offset();
    if (contentOffset.top === revertContentOffset.top && contentOffset.left + getWidth($content) > revertContentOffset.left) {
      var left = getWidth($revertContent) + PADDING_BETWEEN_TOOLTIPS;
      $content.css('left', revertContentOffset.left < $cell.offset().left ? -left : left);
    }
  }
  /**
   * interface override
   */
  _getRevertTooltipsSelector() {
    var revertTooltipClass = this.addWidgetPrefix(REVERT_TOOLTIP_CLASS);
    return ".dx-editor-cell .".concat(revertTooltipClass);
  }
  _getValidationMessagesSelector() {
    var invalidMessageClass = this.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS);
    return ".dx-editor-cell .".concat(invalidMessageClass, ", .dx-cell-modified .").concat(invalidMessageClass);
  }
  loseFocus(skipValidator) {
    if (!skipValidator) {
      this._validatingController.setValidator(null);
    }
    super.loseFocus();
  }
  updateCellState($element, validationResult, isHideBorder) {
    var _a;
    var $focus = $element === null || $element === void 0 ? void 0 : $element.closest(this._getFocusCellSelector());
    var $cell = ($focus === null || $focus === void 0 ? void 0 : $focus.is('td')) ? $focus : null;
    var rowOptions = $focus === null || $focus === void 0 ? void 0 : $focus.closest('.dx-row').data('options');
    // @ts-expect-error
    var change = rowOptions ? this._editingController.getChangeByKey(rowOptions.key) : null;
    var column = $cell && this._columnsController.getVisibleColumns()[$cell.index()];
    var isCellModified = ((_a = change === null || change === void 0 ? void 0 : change.data) === null || _a === void 0 ? void 0 : _a[column === null || column === void 0 ? void 0 : column.name]) !== undefined && !this._editingController.isSaving();
    var validationDescriptionValues = [];
    if (this._editingController.getEditMode() === EDIT_MODE_CELL) {
      if ((validationResult === null || validationResult === void 0 ? void 0 : validationResult.status) === VALIDATION_STATUS.invalid || isCellModified) {
        this._showRevertButton($focus);
        validationDescriptionValues.push(REVERT_BUTTON_ID);
      } else {
        this._revertTooltip && this._revertTooltip.$element().remove();
      }
    }
    var showValidationMessage = validationResult && validationResult.status === VALIDATION_STATUS.invalid;
    if (showValidationMessage && $cell && column && validationResult && validationResult.brokenRules) {
      var errorMessages = [];
      validationResult.brokenRules.forEach(rule => {
        if (rule.message) {
          errorMessages.push(rule.message);
        }
      });
      if (errorMessages.length) {
        this._showValidationMessage($focus, errorMessages, column.alignment || 'left');
        validationDescriptionValues.push(INVALID_MESSAGE_ID);
      }
    }
    this._updateAriaValidationAttributes($focus, validationDescriptionValues);
    !isHideBorder && this._rowsView.element() && this._rowsView.updateFreeSpaceRowHeight();
  }
  _updateAriaValidationAttributes($focus, inputDescriptionValues) {
    if (inputDescriptionValues.length === 0) {
      return;
    }
    var editMode = this._editingController.getEditMode();
    var shouldSetValidationAriaAttributes = [EDIT_MODE_CELL, EDIT_MODE_BATCH, EDIT_MODE_ROW].includes(editMode);
    if (shouldSetValidationAriaAttributes) {
      var $focusElement = this._getCurrentFocusElement($focus);
      $focusElement.attr('aria-labelledby', inputDescriptionValues.join(' '));
      $focusElement.attr('aria-invalid', true);
    }
  }
  _getCurrentFocusElement($focus) {
    if (this._editingController.isEditing()) {
      return $focus.find(EDITORS_INPUT_SELECTOR).first();
    }
    return $focus;
  }
  focus($element, isHideBorder) {
    if (!arguments.length) return super.focus();
    this._hideValidationMessage();
    if (($element === null || $element === void 0 ? void 0 : $element.hasClass('dx-row')) || ($element === null || $element === void 0 ? void 0 : $element.hasClass('dx-master-detail-cell'))) {
      return super.focus($element, isHideBorder);
    }
    var $focus = $element === null || $element === void 0 ? void 0 : $element.closest(this._getFocusCellSelector());
    var validator = $focus && ($focus.data('dxValidator') || $element.find(".".concat(this.addWidgetPrefix(VALIDATOR_CLASS))).eq(0).data('dxValidator'));
    var rowOptions = $focus && $focus.closest('.dx-row').data('options');
    // @ts-expect-error
    var change = rowOptions ? this._editingController.getChangeByKey(rowOptions.key) : null;
    var validationResult;
    if (validator) {
      this._validatingController.setValidator(validator);
      var value = validator.option('adapter').getValue();
      if (cellValueShouldBeValidated(value, rowOptions) || this._validatingController._rowIsValidated(change)) {
        this._editingController.waitForDeferredOperations().done(() => {
          // NOTE: after waiting for deferred operations another rerender may occur.
          // In this case this validating is outdated
          var isDetached = $element.closest('tr').length === 0;
          if (isDetached) {
            return;
          }
          when(this._validatingController.validateCell(validator)).done(result => {
            validationResult = result;
            var {
              column
            } = validationResult.validator.option('dataGetter')();
            if (change && column && !this._validatingController.isCurrentValidatorProcessing({
              rowKey: change.key,
              columnIndex: column.index
            })) {
              return;
            }
            if (!isFluent(current()) && validationResult.status === VALIDATION_STATUS.invalid) {
              isHideBorder = true;
            }
            this.updateCellState($element, validationResult, isHideBorder);
            super.focus.call(this, $element, isHideBorder);
          });
        });
        return super.focus($element, isHideBorder);
      }
    }
    this.updateCellState($element, validationResult, isHideBorder);
    return super.focus($element, isHideBorder);
  }
  getEditorInstance($container) {
    var $editor = $container.find('.dx-texteditor').eq(0);
    return gridCoreUtils.getWidgetInstance($editor);
  }
};
export var validatingDataControllerExtender = Base => class ValidatingDataControllerExtender extends Base {
  _getValidationStatus(validationResult) {
    var validationStatus = validationResultIsValid(validationResult) ? validationResult.status : validationResult;
    return validationStatus || VALIDATION_STATUS.valid;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate) {
    var _a, _b;
    var cell = (_a = oldRow.cells) === null || _a === void 0 ? void 0 : _a[columnIndex];
    var oldValidationStatus = this._getValidationStatus({
      status: cell === null || cell === void 0 ? void 0 : cell.validationStatus
    });
    var validationResult = this._validatingController.getCellValidationResult({
      rowKey: oldRow.key,
      columnIndex
    });
    var validationData = this._validatingController._getValidationData(oldRow.key);
    var newValidationStatus = this._getValidationStatus(validationResult);
    var rowIsModified = JSON.stringify(newRow.modifiedValues) !== JSON.stringify(oldRow.modifiedValues);
    var validationStatusChanged = oldValidationStatus !== newValidationStatus && rowIsModified;
    var cellIsMarkedAsInvalid = $(cell === null || cell === void 0 ? void 0 : cell.cellElement).hasClass(this.addWidgetPrefix(INVALIDATE_CLASS));
    var hasValidationRules = (_b = cell === null || cell === void 0 ? void 0 : cell.column.validationRules) === null || _b === void 0 ? void 0 : _b.length;
    var rowEditStateChanged = oldRow.isEditing !== newRow.isEditing && hasValidationRules;
    var cellValidationStateChanged = validationStatusChanged || validationData.isValid && cellIsMarkedAsInvalid;
    if (rowEditStateChanged || cellValidationStateChanged) {
      return true;
    }
    return super._isCellChanged.apply(this, arguments);
  }
};
export var validatingRowsViewExtender = Base => class ValidatingRowsViewExtender extends Base {
  updateFreeSpaceRowHeight($table) {
    var that = this;
    var $rowElements;
    var $freeSpaceRowElement;
    var $freeSpaceRowElements;
    var $element = that.element();
    var $tooltipContent = $element && $element.find(".".concat(that.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS), " .dx-overlay-content"));
    super.updateFreeSpaceRowHeight($table);
    if ($tooltipContent && $tooltipContent.length) {
      $rowElements = that._getRowElements();
      $freeSpaceRowElements = that._getFreeSpaceRowElements($table);
      $freeSpaceRowElement = $freeSpaceRowElements.first();
      if ($freeSpaceRowElement && $rowElements.length === 1 && (!$freeSpaceRowElement.is(':visible') || getOuterHeight($tooltipContent) > getOuterHeight($freeSpaceRowElement))) {
        $freeSpaceRowElements.show();
        setHeight($freeSpaceRowElements, getOuterHeight($tooltipContent));
        return true;
      }
    }
    return undefined;
  }
  _formItemPrepared(cellOptions, $container) {
    // @ts-expect-error
    super._formItemPrepared.apply(this, arguments);
    deferUpdate(() => {
      var $editor = $container.find('.dx-widget').first();
      var isEditorDisposed = $editor.length && !$editor.children().length;
      // T736360
      if (!isEditorDisposed) {
        this._validatingController.createValidator(cellOptions, $editor);
      }
    });
  }
  _cellPrepared($cell, parameters) {
    // @ts-expect-error
    if (!this._editingController.isFormOrPopupEditMode()) {
      this._validatingController.createValidator(parameters, $cell);
    }
    super._cellPrepared.apply(this, arguments);
  }
  _restoreErrorRow(contentTable) {
    this._editingController && this._editingController.hasChanges() && this._getRowElements(contentTable).each((_, item) => {
      var rowOptions = $(item).data('options');
      if (rowOptions) {
        // @ts-expect-error
        var change = this._editingController.getChangeByKey(rowOptions.key);
        // @ts-expect-error
        change && this._editingController._showErrorRow(change);
      }
    });
  }
};
export var validatingModule = {
  defaultOptions() {
    return {
      editing: {
        texts: {
          validationCancelChanges: messageLocalization.format('dxDataGrid-validationCancelChanges')
        }
      }
    };
  },
  controllers: {
    validating: ValidatingController
  },
  extenders: {
    controllers: {
      editing: validatingEditingExtender,
      editorFactory: validatingEditorFactoryExtender,
      data: validatingDataControllerExtender
    },
    views: {
      rowsView: validatingRowsViewExtender
    }
  }
};