/**
* DevExtreme (cjs/__internal/grids/grid_core/keyboard_navigation/scrollable_a11y.js)
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
exports.keyboardNavigationScrollableA11yExtender = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _type = require("../../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */ /* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line max-len
const keyboardNavigationScrollableA11yExtender = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(ScrollableA11yExtender, _Base);
  function ScrollableA11yExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto = ScrollableA11yExtender.prototype;
  _proto.init = function init() {
    var _a;
    _Base.prototype.init.call(this);
    // eslint-disable-next-line max-len
    this.rowsViewFocusOutHandlerContext = (_a = this.rowsViewFocusOutHandlerContext) !== null && _a !== void 0 ? _a : this.rowsViewFocusOutHandler.bind(this);
  };
  _proto.subscribeToRowsViewFocusEvent = function subscribeToRowsViewFocusEvent() {
    var _a;
    _Base.prototype.subscribeToRowsViewFocusEvent.call(this);
    const $rowsView = (_a = this._rowsView) === null || _a === void 0 ? void 0 : _a.element();
    _events_engine.default.on($rowsView, 'focusout', this.rowsViewFocusOutHandlerContext);
  };
  _proto.unsubscribeFromRowsViewFocusEvent = function unsubscribeFromRowsViewFocusEvent() {
    var _a;
    _Base.prototype.unsubscribeFromRowsViewFocusEvent.call(this);
    const $rowsView = (_a = this._rowsView) === null || _a === void 0 ? void 0 : _a.element();
    _events_engine.default.off($rowsView, 'focusout', this.rowsViewFocusOutHandlerContext);
  };
  _proto.rowsViewFocusHandler = function rowsViewFocusHandler(event) {
    const $target = (0, _renderer.default)(event.target);
    this.translateFocusIfNeed(event, $target);
    _Base.prototype.rowsViewFocusHandler.call(this, event);
  };
  _proto.rowsViewFocusOutHandler = function rowsViewFocusOutHandler() {
    this.makeScrollableFocusableIfNeed();
  };
  _proto.translateFocusIfNeed = function translateFocusIfNeed(event, $target) {
    const needTranslateFocus = this.isScrollableNeedFocusable();
    const isFirstCellFixed = this._isFixedColumn(0);
    if (!needTranslateFocus || !isFirstCellFixed) {
      return;
    }
    const $firstCell = this._rowsView.getCell({
      rowIndex: 0,
      columnIndex: 0
    });
    const firstCellHasTabIndex = !!$firstCell.attr('tabindex');
    // @ts-expect-error dxElementWrapper doesn't have overload for 'is' method
    const notFixedCellIsTarget = $target.is(this._$firstNotFixedCell);
    if (firstCellHasTabIndex && notFixedCellIsTarget) {
      event.preventDefault();
      this._focus($firstCell);
    }
  };
  _proto.renderCompleted = function renderCompleted(e) {
    this._$firstNotFixedCell = this.getFirstNotFixedCell();
    this.makeScrollableFocusableIfNeed();
    _Base.prototype.renderCompleted.call(this, e);
  };
  _proto._focus = function _focus($cell, disableFocus, skipFocusEvent) {
    _Base.prototype._focus.call(this, $cell, disableFocus, skipFocusEvent);
    this.makeScrollableFocusableIfNeed();
  };
  _proto._tabKeyHandler = function _tabKeyHandler(eventArgs, isEditing) {
    var _a;
    const isCellPositionDefined = (0, _type.isDefined)(this._focusedCellPosition) && !(0, _type.isEmptyObject)(this._focusedCellPosition);
    const isOriginalHandlerRequired = !isCellPositionDefined || !eventArgs.shift && this._isLastValidCell(this._focusedCellPosition) || eventArgs.shift && this._isFirstValidCell(this._focusedCellPosition);
    const isNeedFocusable = this.isScrollableNeedFocusable();
    if (isOriginalHandlerRequired && isNeedFocusable) {
      (_a = this._$firstNotFixedCell) === null || _a === void 0 ? void 0 : _a.removeAttr('tabIndex');
    }
    _Base.prototype._tabKeyHandler.call(this, eventArgs, isEditing);
  };
  _proto.getFirstNotFixedCell = function getFirstNotFixedCell() {
    const columns = this._columnsController.getVisibleColumns();
    const columnIndex = columns.findIndex(_ref => {
      let {
        fixed
      } = _ref;
      return !fixed;
    });
    return columnIndex === -1 ? undefined : this._rowsView._getCellElement(0, columnIndex);
  };
  _proto.isScrollableNeedFocusable = function isScrollableNeedFocusable() {
    var _a, _b;
    const hasScrollable = !!this._rowsView.getScrollable();
    // @ts-expect-error _fixedTableElement is declared in rowsView extender
    const hasFixedTable = !!((_a = this._rowsView._fixedTableElement) === null || _a === void 0 ? void 0 : _a.length);
    const isCellsRendered = !!((_b = this._rowsView.getCellElements(0)) === null || _b === void 0 ? void 0 : _b.length);
    return hasScrollable && hasFixedTable && isCellsRendered;
  };
  _proto.makeScrollableFocusableIfNeed = function makeScrollableFocusableIfNeed() {
    const needFocusable = this.isScrollableNeedFocusable();
    if (!needFocusable || !this._$firstNotFixedCell) {
      return;
    }
    this._applyTabIndexToElement(this._$firstNotFixedCell);
  };
  return ScrollableA11yExtender;
}(Base);
exports.keyboardNavigationScrollableA11yExtender = keyboardNavigationScrollableA11yExtender;
