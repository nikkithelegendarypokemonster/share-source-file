/**
* DevExtreme (bundles/__internal/grids/grid_core/error_handling/m_error_handling.js)
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
exports.errorHandlingModule = exports.ErrorHandlingController = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _iterator = require("../../../../core/utils/iterator");
var _click = require("../../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _m_modules = _interopRequireDefault(require("../m_modules"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const ERROR_ROW_CLASS = 'dx-error-row';
const ERROR_MESSAGE_CLASS = 'dx-error-message';
const ERROR_CLOSEBUTTON_CLASS = 'dx-closebutton';
const ACTION_CLASS = 'action';
let ErrorHandlingController = exports.ErrorHandlingController = /*#__PURE__*/function (_modules$ViewControll) {
  _inheritsLoose(ErrorHandlingController, _modules$ViewControll);
  function ErrorHandlingController() {
    return _modules$ViewControll.apply(this, arguments) || this;
  }
  var _proto = ErrorHandlingController.prototype;
  _proto.init = function init() {
    this._resizingController = this.getController('resizing');
    this._columnsController = this.getController('columns');
    this._columnHeadersView = this.getView('columnHeadersView');
    this._rowsView = this.getView('rowsView');
  };
  _proto._createErrorRow = function _createErrorRow(error, $tableElements) {
    let $errorRow;
    let $closeButton;
    const $errorMessage = this._renderErrorMessage(error);
    if ($tableElements) {
      $errorRow = (0, _renderer.default)('<tr>').attr('role', 'row').addClass(ERROR_ROW_CLASS);
      $closeButton = (0, _renderer.default)('<div>').addClass(ERROR_CLOSEBUTTON_CLASS).addClass(this.addWidgetPrefix(ACTION_CLASS));
      _events_engine.default.on($closeButton, _click.name, this.createAction(args => {
        var _a, _b;
        const e = args.event;
        let $errorRow;
        const errorRowIndex = (0, _renderer.default)(e.currentTarget).closest(".".concat(ERROR_ROW_CLASS)).index();
        e.stopPropagation();
        (0, _iterator.each)($tableElements, (_, tableElement) => {
          $errorRow = (0, _renderer.default)(tableElement).children('tbody').children('tr').eq(errorRowIndex);
          this.removeErrorRow($errorRow);
        });
        (_b = (_a = this._resizingController) === null || _a === void 0 ? void 0 : _a.fireContentReadyAction) === null || _b === void 0 ? void 0 : _b.call(_a);
      }));
      (0, _renderer.default)('<td>')
      // @ts-expect-errors
      .attr({
        colSpan: this._columnsController.getVisibleColumns().length,
        role: 'gridcell'
      }).prepend($closeButton).append($errorMessage).appendTo($errorRow);
      return $errorRow;
    }
    return $errorMessage;
  };
  _proto._renderErrorMessage = function _renderErrorMessage(error) {
    const message = error.url ? error.message.replace(error.url, '') : error.message || error;
    const $message = (0, _renderer.default)('<div>').attr('role', 'alert').attr('aria-roledescription', _message.default.format('dxDataGrid-ariaError')).addClass(ERROR_MESSAGE_CLASS).text(message);
    if (error.url) {
      (0, _renderer.default)('<a>').attr('href', error.url).text(error.url).appendTo($message);
    }
    return $message;
  };
  _proto.renderErrorRow = function renderErrorRow(error, rowIndex, $popupContent) {
    var _a, _b;
    const that = this;
    let $errorMessageElement;
    let $firstErrorRow;
    if ($popupContent) {
      $popupContent.find(".".concat(ERROR_MESSAGE_CLASS)).remove();
      $errorMessageElement = that._createErrorRow(error);
      $popupContent.prepend($errorMessageElement);
      return $errorMessageElement;
    }
    const viewElement = rowIndex >= 0 || !that._columnHeadersView.isVisible() ? that._rowsView : that._columnHeadersView;
    const $tableElements = viewElement.getTableElements();
    (0, _iterator.each)($tableElements, (_, tableElement) => {
      $errorMessageElement = that._createErrorRow(error, $tableElements);
      $firstErrorRow = $firstErrorRow || $errorMessageElement;
      if (rowIndex >= 0) {
        const $row = viewElement._getRowElements((0, _renderer.default)(tableElement)).eq(rowIndex);
        that.removeErrorRow($row.next());
        $errorMessageElement.insertAfter($row);
      } else {
        const $tbody = (0, _renderer.default)(tableElement).children('tbody');
        const rowElements = $tbody.children('tr');
        if (that._columnHeadersView.isVisible()) {
          that.removeErrorRow(rowElements.last());
          (0, _renderer.default)(tableElement).append($errorMessageElement);
        } else {
          that.removeErrorRow(rowElements.first());
          $tbody.first().prepend($errorMessageElement);
        }
      }
    });
    (_b = (_a = this._resizingController) === null || _a === void 0 ? void 0 : _a.fireContentReadyAction) === null || _b === void 0 ? void 0 : _b.call(_a);
    return $firstErrorRow;
  };
  _proto.removeErrorRow = function removeErrorRow($row) {
    if (!$row) {
      const $columnHeaders = this._columnHeadersView && this._columnHeadersView.element();
      $row = $columnHeaders && $columnHeaders.find(".".concat(ERROR_ROW_CLASS));
      if (!$row || !$row.length) {
        const $rowsViewElement = this._rowsView.element();
        $row = $rowsViewElement && $rowsViewElement.find(".".concat(ERROR_ROW_CLASS));
      }
    }
    $row && $row.hasClass(ERROR_ROW_CLASS) && $row.remove();
  };
  _proto.optionChanged = function optionChanged(args) {
    switch (args.name) {
      case 'errorRowEnabled':
        args.handled = true;
        break;
      default:
        _modules$ViewControll.prototype.optionChanged.call(this, args);
    }
  };
  return ErrorHandlingController;
}(_m_modules.default.ViewController);
const data = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(ErrorHandlingDataControllerExtends, _Base);
  function ErrorHandlingDataControllerExtends() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto2 = ErrorHandlingDataControllerExtends.prototype;
  _proto2.init = function init() {
    _Base.prototype.init.call(this);
    this.dataErrorOccurred.add((error, $popupContent) => {
      if (this.option('errorRowEnabled')) {
        this._errorHandlingController.renderErrorRow(error, undefined, $popupContent);
      }
    });
    this.changed.add(e => {
      var _a, _b;
      if (e && e.changeType === 'loadError') {
        return;
      }
      if (this._editingController && !this._editingController.hasChanges()) {
        (_b = (_a = this._errorHandlingController) === null || _a === void 0 ? void 0 : _a.removeErrorRow) === null || _b === void 0 ? void 0 : _b.call(_a);
      }
    });
  };
  return ErrorHandlingDataControllerExtends;
}(Base);
const errorHandlingModule = exports.errorHandlingModule = {
  defaultOptions() {
    return {
      errorRowEnabled: true
    };
  },
  controllers: {
    errorHandling: ErrorHandlingController
  },
  extenders: {
    controllers: {
      data
    }
  }
};
