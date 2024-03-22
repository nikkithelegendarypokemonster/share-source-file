/**
* DevExtreme (bundles/__internal/grids/grid_core/keyboard_navigation/m_keyboard_navigation.js)
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
exports.keyboardNavigationModule = exports.KeyboardNavigationController = void 0;
var _common = require("../../../../core/utils/common");
var _dom_adapter = _interopRequireDefault(require("../../../../core/dom_adapter"));
var _element = require("../../../../core/element");
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _browser = _interopRequireDefault(require("../../../../core/utils/browser"));
var _deferred = require("../../../../core/utils/deferred");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _click = require("../../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _pointer = _interopRequireDefault(require("../../../../events/pointer"));
var _short = require("../../../../events/short");
var _index = require("../../../../events/utils/index");
var accessibility = _interopRequireWildcard(require("../../../../ui/shared/accessibility"));
var _selectors = require("../../../../ui/widget/selectors");
var _memoize = require("../../../utils/memoize");
var _const = require("../editing/const");
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _const2 = require("./const");
var _dom = require("./dom");
var _m_keyboard_navigation_utils = require("./m_keyboard_navigation_utils");
var _scrollable_a11y = require("./scrollable_a11y");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
let KeyboardNavigationController = exports.KeyboardNavigationController = /*#__PURE__*/function (_modules$ViewControll) {
  _inheritsLoose(KeyboardNavigationController, _modules$ViewControll);
  function KeyboardNavigationController() {
    return _modules$ViewControll.apply(this, arguments) || this;
  }
  var _proto = KeyboardNavigationController.prototype;
  // #region Initialization
  _proto.init = function init() {
    var _a, _b;
    this._dataController = this.getController('data');
    this._selectionController = this.getController('selection');
    this._editingController = this.getController('editing');
    this._headerPanel = this.getView('headerPanel');
    this._rowsView = this.getView('rowsView');
    this._columnsController = this.getController('columns');
    this._editorFactory = this.getController('editorFactory');
    this._focusController = this.getController('focus');
    this._adaptiveColumnsController = this.getController('adaptiveColumns');
    this._columnResizerController = this.getController('columnsResizer');
    this._memoFireFocusedCellChanged = (0, _memoize.memoize)(this._memoFireFocusedCellChanged.bind(this), {
      compareType: 'value'
    });
    this._memoFireFocusedRowChanged = (0, _memoize.memoize)(this._memoFireFocusedRowChanged.bind(this), {
      compareType: 'value'
    });
    this.focusedHandlerWithContext = this.focusedHandlerWithContext || this.focusedHandler.bind(this);
    this.renderCompletedWithContext = this.renderCompletedWithContext || this.renderCompleted.bind(this);
    this.rowsViewFocusHandlerContext = this.rowsViewFocusHandlerContext || this.rowsViewFocusHandler.bind(this);
    this._updateFocusTimeout = null;
    this._fastEditingStarted = false;
    this._focusedCellPosition = {};
    this._canceledCellPosition = null;
    if (this.isKeyboardEnabled()) {
      accessibility.subscribeVisibilityChange();
      (_a = this._editorFactory) === null || _a === void 0 ? void 0 : _a.focused.add(this.focusedHandlerWithContext);
      this.createAction('onKeyDown');
    } else {
      accessibility.unsubscribeVisibilityChange();
      (_b = this._editorFactory) === null || _b === void 0 ? void 0 : _b.focused.remove(this.focusedHandlerWithContext);
    }
    this.initViewHandlers();
    this.initDocumentHandlers();
  };
  _proto.dispose = function dispose() {
    _modules$ViewControll.prototype.dispose.call(this);
    this._resetFocusedView();
    _short.keyboard.off(this._keyDownListener);
    _events_engine.default.off(_dom_adapter.default.getDocument(), (0, _index.addNamespace)(_pointer.default.down, 'dxDataGridKeyboardNavigation'), this._documentClickHandler);
    clearTimeout(this._updateFocusTimeout);
    accessibility.unsubscribeVisibilityChange();
  };
  _proto.focusedHandler = function focusedHandler($element) {
    this.setupFocusedView();
    if (this._isNeedScroll) {
      if ($element.is(':visible') && this._focusedView && this._focusedView.getScrollable()) {
        this._focusedView._scrollToElement($element);
        this._isNeedScroll = false;
      }
    }
  };
  _proto.rowsViewFocusHandler = function rowsViewFocusHandler(event) {
    var _a;
    const $element = (0, _renderer.default)(event.target);
    const isRelatedTargetInRowsView = (0, _renderer.default)(event.relatedTarget).closest(this._rowsView.element()).length;
    const isLink = $element.is('a');
    if (event.relatedTarget && isLink && !isRelatedTargetInRowsView && this._isEventInCurrentGrid(event)) {
      let $focusedCell = this._getFocusedCell();
      $focusedCell = !(0, _m_keyboard_navigation_utils.isElementDefined)($focusedCell) ? this._rowsView.getCellElements(0).filter('[tabindex]').eq(0) : $focusedCell;
      if (!$element.closest($focusedCell).length) {
        event.preventDefault();
        // @ts-expect-error
        _events_engine.default.trigger($focusedCell, 'focus');
      }
    }
    const isCell = $element.is('td');
    const needSetFocusPosition = ((_a = this.option('focusedRowIndex')) !== null && _a !== void 0 ? _a : -1) < 0;
    if (isCell && needSetFocusPosition) {
      this._updateFocusedCellPosition($element);
    }
  };
  _proto.subscribeToRowsViewFocusEvent = function subscribeToRowsViewFocusEvent() {
    var _a;
    const $rowsView = (_a = this._rowsView) === null || _a === void 0 ? void 0 : _a.element();
    _events_engine.default.on($rowsView, 'focusin', this.rowsViewFocusHandlerContext);
  };
  _proto.unsubscribeFromRowsViewFocusEvent = function unsubscribeFromRowsViewFocusEvent() {
    var _a;
    const $rowsView = (_a = this._rowsView) === null || _a === void 0 ? void 0 : _a.element();
    _events_engine.default.off($rowsView, 'focusin', this.rowsViewFocusHandlerContext);
  };
  _proto.renderCompleted = function renderCompleted(e) {
    const $rowsView = this._rowsView.element();
    const isFullUpdate = !e || e.changeType === 'refresh';
    const isFocusedViewCorrect = this._focusedView && this._focusedView.name === this._rowsView.name;
    let needUpdateFocus = false;
    const isAppend = e && (e.changeType === 'append' || e.changeType === 'prepend');
    // @ts-expect-error
    const root = (0, _renderer.default)(_dom_adapter.default.getRootNode($rowsView.get && $rowsView.get(0)));
    const $focusedElement = root.find(':focus');
    const isFocusedElementCorrect = !$focusedElement.length || $focusedElement.closest($rowsView).length;
    this.unsubscribeFromRowsViewFocusEvent();
    this.subscribeToRowsViewFocusEvent();
    this.initPointerEventHandler();
    this.initKeyDownHandler();
    this._setRowsViewAttributes();
    if (isFocusedViewCorrect && isFocusedElementCorrect) {
      needUpdateFocus = this._isNeedFocus ? !isAppend : this._isHiddenFocus && isFullUpdate && !(e === null || e === void 0 ? void 0 : e.virtualColumnsScrolling);
      needUpdateFocus && this._updateFocus(true);
    }
  };
  _proto.initViewHandlers = function initViewHandlers() {
    var _a, _b;
    this.unsubscribeFromRowsViewFocusEvent();
    this.unsubscribeFromPointerEvent();
    this.unsubscribeFromKeyDownEvent();
    (_b = (_a = this._rowsView) === null || _a === void 0 ? void 0 : _a.renderCompleted) === null || _b === void 0 ? void 0 : _b.remove(this.renderCompletedWithContext);
    if (this.isKeyboardEnabled()) {
      this._rowsView.renderCompleted.add(this.renderCompletedWithContext);
    }
  };
  _proto.initDocumentHandlers = function initDocumentHandlers() {
    const document = _dom_adapter.default.getDocument();
    this._documentClickHandler = this._documentClickHandler || this.createAction(e => {
      const $target = (0, _renderer.default)(e.event.target);
      const isCurrentRowsViewClick = this._isEventInCurrentGrid(e.event) && $target.closest(".".concat(this.addWidgetPrefix(_const2.ROWS_VIEW_CLASS))).length;
      const isEditorOverlay = $target.closest(".".concat(_const2.DROPDOWN_EDITOR_OVERLAY_CLASS)).length;
      const isColumnResizing = !!this._columnResizerController && this._columnResizerController.isResizing();
      if (!isCurrentRowsViewClick && !isEditorOverlay && !isColumnResizing) {
        const targetInsideFocusedView = this._focusedView ? $target.parents().filter(this._focusedView.element()).length > 0 : false;
        !targetInsideFocusedView && this._resetFocusedCell(true);
        this._resetFocusedView();
      }
    });
    _events_engine.default.off(document, (0, _index.addNamespace)(_pointer.default.down, 'dxDataGridKeyboardNavigation'), this._documentClickHandler);
    if (this.isKeyboardEnabled()) {
      _events_engine.default.on(document, (0, _index.addNamespace)(_pointer.default.down, 'dxDataGridKeyboardNavigation'), this._documentClickHandler);
    }
  };
  _proto._setRowsViewAttributes = function _setRowsViewAttributes() {
    const $rowsView = this._getRowsViewElement();
    const isGridEmpty = !this._dataController.getVisibleRows().length;
    if (isGridEmpty) {
      this._applyTabIndexToElement($rowsView);
    }
  };
  _proto.unsubscribeFromPointerEvent = function unsubscribeFromPointerEvent() {
    const pointerEventName = !(0, _m_keyboard_navigation_utils.isMobile)() ? _pointer.default.down : _click.name;
    const $rowsView = this._getRowsViewElement();
    this._pointerEventAction && _events_engine.default.off($rowsView, (0, _index.addNamespace)(pointerEventName, 'dxDataGridKeyboardNavigation'), this._pointerEventAction);
  };
  _proto.subscribeToPointerEvent = function subscribeToPointerEvent() {
    const pointerEventName = !(0, _m_keyboard_navigation_utils.isMobile)() ? _pointer.default.down : _click.name;
    const $rowsView = this._getRowsViewElement();
    const clickSelector = ".".concat(_const.ROW_CLASS, " > td, .").concat(_const.ROW_CLASS);
    _events_engine.default.on($rowsView, (0, _index.addNamespace)(pointerEventName, 'dxDataGridKeyboardNavigation'), clickSelector, this._pointerEventAction);
  };
  _proto.initPointerEventHandler = function initPointerEventHandler() {
    this._pointerEventAction = this._pointerEventAction || this.createAction(this._pointerEventHandler);
    this.unsubscribeFromPointerEvent();
    this.subscribeToPointerEvent();
  };
  _proto.unsubscribeFromKeyDownEvent = function unsubscribeFromKeyDownEvent() {
    _short.keyboard.off(this._keyDownListener);
  };
  _proto.subscribeToKeyDownEvent = function subscribeToKeyDownEvent() {
    const $rowsView = this._getRowsViewElement();
    this._keyDownListener = _short.keyboard.on($rowsView, null, e => this._keyDownHandler(e));
  };
  _proto.initKeyDownHandler = function initKeyDownHandler() {
    this._keyDownListener && this.unsubscribeFromKeyDownEvent();
    this.subscribeToKeyDownEvent();
  }
  // #endregion Initialization
  // #region Options
  ;
  _proto.optionChanged = function optionChanged(args) {
    switch (args.name) {
      case 'keyboardNavigation':
        if (args.fullName === 'keyboardNavigation.enabled') {
          this.init();
        }
        args.handled = true;
        break;
      case 'useLegacyKeyboardNavigation':
        this.init();
        args.handled = true;
        break;
      default:
        _modules$ViewControll.prototype.optionChanged.call(this, args);
    }
  };
  _proto.isRowFocusType = function isRowFocusType() {
    return this.focusType === _const2.FOCUS_TYPE_ROW;
  };
  _proto.isCellFocusType = function isCellFocusType() {
    return this.focusType === _const2.FOCUS_TYPE_CELL;
  };
  _proto.setRowFocusType = function setRowFocusType() {
    if (this.option('focusedRowEnabled')) {
      this.focusType = _const2.FOCUS_TYPE_ROW;
    }
  };
  _proto.setCellFocusType = function setCellFocusType() {
    this.focusType = _const2.FOCUS_TYPE_CELL;
  }
  // #endregion Options
  // #region Key_Handlers
  ;
  _proto._keyDownHandler = function _keyDownHandler(e) {
    var _a;
    let needStopPropagation = true;
    this._isNeedFocus = true;
    this._isNeedScroll = true;
    let isHandled = this._processOnKeyDown(e);
    const isEditing = (_a = this._editingController) === null || _a === void 0 ? void 0 : _a.isEditing();
    const {
      originalEvent
    } = e;
    if (originalEvent.isDefaultPrevented()) {
      this._isNeedFocus = false;
      this._isNeedScroll = false;
      return;
    }
    !_const2.FUNCTIONAL_KEYS.includes(e.keyName) && this._updateFocusedCellPositionByTarget(originalEvent.target);
    if (!isHandled) {
      // eslint-disable-next-line default-case
      switch (e.keyName) {
        case 'leftArrow':
        case 'rightArrow':
          this._leftRightKeysHandler(e, isEditing);
          isHandled = true;
          break;
        case 'upArrow':
        case 'downArrow':
          if (e.ctrl) {
            accessibility.selectView('rowsView', this, originalEvent);
          } else {
            this._upDownKeysHandler(e, isEditing);
          }
          isHandled = true;
          break;
        case 'pageUp':
        case 'pageDown':
          this._pageUpDownKeyHandler(e);
          isHandled = true;
          break;
        case 'space':
          isHandled = this._spaceKeyHandler(e, isEditing);
          break;
        case 'A':
          if ((0, _index.isCommandKeyPressed)(e.originalEvent)) {
            this._ctrlAKeyHandler(e, isEditing);
            isHandled = true;
          } else {
            isHandled = this._beginFastEditing(e.originalEvent);
          }
          break;
        case 'tab':
          this._tabKeyHandler(e, isEditing);
          isHandled = true;
          break;
        case 'enter':
          this._enterKeyHandler(e, isEditing);
          isHandled = true;
          break;
        case 'escape':
          isHandled = this._escapeKeyHandler(e, isEditing);
          break;
        case 'F':
          if ((0, _index.isCommandKeyPressed)(e.originalEvent)) {
            this._ctrlFKeyHandler(e);
            isHandled = true;
          } else {
            isHandled = this._beginFastEditing(e.originalEvent);
          }
          break;
        case 'F2':
          this._f2KeyHandler();
          isHandled = true;
          break;
        case 'del':
        case 'backspace':
          if (this._isFastEditingAllowed() && !this._isFastEditingStarted()) {
            isHandled = this._beginFastEditing(originalEvent, true);
          }
          break;
      }
      if (!isHandled && !this._beginFastEditing(originalEvent)) {
        this._isNeedFocus = false;
        this._isNeedScroll = false;
        needStopPropagation = false;
      }
      if (needStopPropagation) {
        originalEvent.stopPropagation();
      }
    }
  };
  _proto._processOnKeyDown = function _processOnKeyDown(eventArgs) {
    const {
      originalEvent
    } = eventArgs;
    const args = {
      handled: false,
      event: originalEvent
    };
    this.executeAction('onKeyDown', args);
    eventArgs.ctrl = originalEvent.ctrlKey;
    eventArgs.alt = originalEvent.altKey;
    eventArgs.shift = originalEvent.shiftKey;
    return !!args.handled;
  };
  _proto._closeEditCell = function _closeEditCell() {
    setTimeout(() => {
      this._editingController.closeEditCell();
    });
  }
  /**
   * @extended: TreeList's keyboard_navigation
   */;
  _proto._leftRightKeysHandler = function _leftRightKeysHandler(eventArgs, isEditing) {
    const rowIndex = this.getVisibleRowIndex();
    const $event = eventArgs.originalEvent;
    const $row = this._focusedView && this._focusedView.getRow(rowIndex);
    const directionCode = this._getDirectionCodeByKey(eventArgs.keyName);
    const isEditingNavigationMode = this._isFastEditingStarted();
    const allowNavigate = (!isEditing || isEditingNavigationMode) && (0, _m_keyboard_navigation_utils.isDataRow)($row);
    if (allowNavigate) {
      this.setCellFocusType();
      isEditingNavigationMode && this._closeEditCell();
      if (this._isVirtualColumnRender()) {
        this._processVirtualHorizontalPosition(directionCode);
      }
      const $cell = this._getNextCell(directionCode);
      if ((0, _m_keyboard_navigation_utils.isElementDefined)($cell)) {
        this._arrowKeysHandlerFocusCell($event, $cell, directionCode);
      }
      $event && $event.preventDefault();
    }
  };
  _proto._upDownKeysHandler = function _upDownKeysHandler(eventArgs, isEditing) {
    var _a, _b;
    const visibleRowIndex = this.getVisibleRowIndex();
    const $row = this._focusedView && this._focusedView.getRow(visibleRowIndex);
    const $event = eventArgs.originalEvent;
    const isUpArrow = eventArgs.keyName === 'upArrow';
    const dataSource = this._dataController.dataSource();
    const isRowEditingInCurrentRow = (_b = (_a = this._editingController) === null || _a === void 0 ? void 0 : _a.isEditRowByIndex) === null || _b === void 0 ? void 0 : _b.call(_a, visibleRowIndex);
    const isEditingNavigationMode = this._isFastEditingStarted();
    const allowNavigate = (!isRowEditingInCurrentRow || !isEditing || isEditingNavigationMode) && $row && !(0, _m_keyboard_navigation_utils.isDetailRow)($row);
    if (allowNavigate) {
      isEditingNavigationMode && this._closeEditCell();
      if (!this._navigateNextCell($event, eventArgs.keyName)) {
        if (this._isVirtualRowRender() && isUpArrow && dataSource && !dataSource.isLoading()) {
          const rowHeight = (0, _size.getOuterHeight)($row);
          const rowIndex = this._focusedCellPosition.rowIndex - 1;
          this._scrollBy(0, -rowHeight, rowIndex, $event);
        }
      }
      $event && $event.preventDefault();
    }
  };
  _proto._pageUpDownKeyHandler = function _pageUpDownKeyHandler(eventArgs) {
    const pageIndex = this._dataController.pageIndex();
    const pageCount = this._dataController.pageCount();
    const pagingEnabled = this.option('paging.enabled');
    const isPageUp = eventArgs.keyName === 'pageUp';
    const pageStep = isPageUp ? -1 : 1;
    const scrollable = this._rowsView.getScrollable();
    if (pagingEnabled && !this._isVirtualScrolling()) {
      if ((isPageUp ? pageIndex > 0 : pageIndex < pageCount - 1) && !this._isVirtualScrolling()) {
        this._dataController.pageIndex(pageIndex + pageStep);
        eventArgs.originalEvent.preventDefault();
      }
    } else if (scrollable && (0, _size.getHeight)(scrollable.container()) < (0, _size.getHeight)(scrollable.$content())) {
      this._scrollBy(0, (0, _size.getHeight)(scrollable.container()) * pageStep);
      eventArgs.originalEvent.preventDefault();
    }
  };
  _proto._spaceKeyHandler = function _spaceKeyHandler(eventArgs, isEditing) {
    const rowIndex = this.getVisibleRowIndex();
    const $target = (0, _renderer.default)(eventArgs.originalEvent && eventArgs.originalEvent.target);
    if (this.option('selection') && this.option('selection').mode !== 'none' && !isEditing) {
      const isFocusedRowElement = this._getElementType($target) === 'row' && this.isRowFocusType() && (0, _m_keyboard_navigation_utils.isDataRow)($target);
      const isFocusedSelectionCell = $target.hasClass(_const2.COMMAND_SELECT_CLASS);
      if (isFocusedSelectionCell && this.option('selection.showCheckBoxesMode') === 'onClick') {
        this._selectionController.startSelectionWithCheckboxes();
      }
      if (isFocusedRowElement || $target.parent().hasClass(_const2.DATA_ROW_CLASS) || $target.hasClass(this.addWidgetPrefix(_const2.ROWS_VIEW_CLASS))) {
        this._selectionController.changeItemSelection(rowIndex, {
          shift: eventArgs.shift,
          control: eventArgs.ctrl
        });
        eventArgs.originalEvent.preventDefault();
        return true;
      }
      return false;
    }
    return this._beginFastEditing(eventArgs.originalEvent);
  };
  _proto._ctrlAKeyHandler = function _ctrlAKeyHandler(eventArgs, isEditing) {
    if (!isEditing && !eventArgs.alt && this.option('selection.mode') === 'multiple' && this.option('selection.allowSelectAll')) {
      this._selectionController.selectAll();
      eventArgs.originalEvent.preventDefault();
    }
  };
  _proto._tabKeyHandler = function _tabKeyHandler(eventArgs, isEditing) {
    const editingOptions = this.option('editing');
    const direction = eventArgs.shift ? 'previous' : 'next';
    const isCellPositionDefined = (0, _type.isDefined)(this._focusedCellPosition) && !(0, _type.isEmptyObject)(this._focusedCellPosition);
    let isOriginalHandlerRequired = !isCellPositionDefined || !eventArgs.shift && this._isLastValidCell(this._focusedCellPosition) || eventArgs.shift && this._isFirstValidCell(this._focusedCellPosition);
    const eventTarget = eventArgs.originalEvent.target;
    const focusedViewElement = this._focusedView && this._focusedView.element();
    if (this._handleTabKeyOnMasterDetailCell(eventTarget, direction)) {
      return;
    }
    (0, _renderer.default)(focusedViewElement).addClass(_const2.FOCUS_STATE_CLASS);
    if (editingOptions && eventTarget && !isOriginalHandlerRequired) {
      if ((0, _renderer.default)(eventTarget).hasClass(this.addWidgetPrefix(_const2.ROWS_VIEW_CLASS))) {
        this._resetFocusedCell();
      }
      if (this._isVirtualColumnRender()) {
        this._processVirtualHorizontalPosition(direction);
      }
      if (isEditing) {
        if (!this._editingCellTabHandler(eventArgs, direction)) {
          return;
        }
      } else if (this._targetCellTabHandler(eventArgs, direction)) {
        isOriginalHandlerRequired = true;
      }
    }
    if (isOriginalHandlerRequired) {
      this._editorFactory.loseFocus();
      if (this._editingController.isEditing() && !this._isRowEditMode()) {
        this._resetFocusedCell(true);
        this._resetFocusedView();
        this._closeEditCell();
      }
    } else {
      eventArgs.originalEvent.preventDefault();
    }
  };
  _proto._getMaxHorizontalOffset = function _getMaxHorizontalOffset() {
    const scrollable = this.component.getScrollable();
    return scrollable ? scrollable.scrollWidth() - (0, _size.getWidth)(this._rowsView.element()) : 0;
  };
  _proto._isColumnRendered = function _isColumnRendered(columnIndex) {
    const allVisibleColumns = this._columnsController.getVisibleColumns(null, true);
    const renderedVisibleColumns = this._columnsController.getVisibleColumns();
    const column = allVisibleColumns[columnIndex];
    let result = false;
    if (column) {
      result = renderedVisibleColumns.indexOf(column) >= 0;
    }
    return result;
  };
  _proto._isFixedColumn = function _isFixedColumn(columnIndex) {
    const allVisibleColumns = this._columnsController.getVisibleColumns(null, true);
    const column = allVisibleColumns[columnIndex];
    return !!column && !!column.fixed;
  };
  _proto._isColumnVirtual = function _isColumnVirtual(columnIndex) {
    const localColumnIndex = columnIndex - this._columnsController.getColumnIndexOffset();
    const visibleColumns = this._columnsController.getVisibleColumns();
    const column = visibleColumns[localColumnIndex];
    return !!column && column.command === 'virtual';
  };
  _proto._processVirtualHorizontalPosition = function _processVirtualHorizontalPosition(direction) {
    const scrollable = this.component.getScrollable();
    const columnIndex = this.getColumnIndex();
    let nextColumnIndex;
    let horizontalScrollPosition = 0;
    let needToScroll = false;
    // eslint-disable-next-line default-case
    switch (direction) {
      case 'next':
      case 'nextInRow':
        {
          const columnsCount = this._getVisibleColumnCount();
          nextColumnIndex = columnIndex + 1;
          horizontalScrollPosition = this.option('rtlEnabled') ? this._getMaxHorizontalOffset() : 0;
          if (direction === 'next') {
            needToScroll = columnsCount === nextColumnIndex || this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex);
          } else {
            needToScroll = columnsCount > nextColumnIndex && this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex);
          }
          break;
        }
      case 'previous':
      case 'previousInRow':
        {
          nextColumnIndex = columnIndex - 1;
          horizontalScrollPosition = this.option('rtlEnabled') ? 0 : this._getMaxHorizontalOffset();
          if (direction === 'previous') {
            const columnIndexOffset = this._columnsController.getColumnIndexOffset();
            const leftEdgePosition = nextColumnIndex < 0 && columnIndexOffset === 0;
            needToScroll = leftEdgePosition || this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex);
          } else {
            needToScroll = nextColumnIndex >= 0 && this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex);
          }
          break;
        }
    }
    if (needToScroll) {
      scrollable.scrollTo({
        left: horizontalScrollPosition
      });
    } else if ((0, _type.isDefined)(nextColumnIndex) && (0, _type.isDefined)(direction) && this._isColumnVirtual(nextColumnIndex)) {
      horizontalScrollPosition = this._getHorizontalScrollPositionOffset(direction);
      horizontalScrollPosition !== 0 && scrollable.scrollBy({
        left: horizontalScrollPosition,
        top: 0
      });
    }
  };
  _proto._getHorizontalScrollPositionOffset = function _getHorizontalScrollPositionOffset(direction) {
    let positionOffset = 0;
    const $currentCell = this._getCell(this._focusedCellPosition);
    const currentCellWidth = $currentCell && (0, _size.getOuterWidth)($currentCell);
    if (currentCellWidth > 0) {
      const rtlMultiplier = this.option('rtlEnabled') ? -1 : 1;
      positionOffset = direction === 'nextInRow' || direction === 'next' ? currentCellWidth * rtlMultiplier : currentCellWidth * rtlMultiplier * -1;
    }
    return positionOffset;
  };
  _proto._editingCellTabHandler = function _editingCellTabHandler(eventArgs, direction) {
    const eventTarget = eventArgs.originalEvent.target;
    let $cell = this._getCellElementFromTarget(eventTarget);
    let isEditingAllowed;
    const $event = eventArgs.originalEvent;
    const elementType = this._getElementType(eventTarget);
    if ($cell.is(_const2.COMMAND_CELL_SELECTOR)) {
      return !this._targetCellTabHandler(eventArgs, direction);
    }
    this._updateFocusedCellPosition($cell);
    const nextCellInfo = this._getNextCellByTabKey($event, direction, elementType);
    $cell = nextCellInfo.$cell;
    if (!$cell || this._handleTabKeyOnMasterDetailCell($cell, direction)) {
      return false;
    }
    const column = this._getColumnByCellElement($cell);
    const $row = $cell.parent();
    const rowIndex = this._getRowIndex($row);
    const row = this._dataController.items()[rowIndex];
    const editingController = this._editingController;
    if (column && column.allowEditing) {
      const isDataRow = !row || row.rowType === 'data';
      isEditingAllowed = editingController.allowUpdating({
        row
      }) ? isDataRow : row && row.isNewRow;
    }
    if (!isEditingAllowed) {
      this._closeEditCell();
    }
    if (this._focusCell($cell, !nextCellInfo.isHighlighted)) {
      if (!this._isRowEditMode() && isEditingAllowed) {
        this._editFocusedCell();
      } else {
        this._focusInteractiveElement($cell, eventArgs.shift);
      }
    }
    return true;
  };
  _proto._targetCellTabHandler = function _targetCellTabHandler(eventArgs, direction) {
    const $event = eventArgs.originalEvent;
    let eventTarget = $event.target;
    let elementType = this._getElementType(eventTarget);
    let $cell = this._getCellElementFromTarget(eventTarget);
    const $lastInteractiveElement = elementType === 'cell' && this._getInteractiveElement($cell, !eventArgs.shift);
    let isOriginalHandlerRequired = false;
    if (!(0, _m_keyboard_navigation_utils.isEditorCell)(this, $cell) && ($lastInteractiveElement === null || $lastInteractiveElement === void 0 ? void 0 : $lastInteractiveElement.length) && eventTarget !== $lastInteractiveElement.get(0)) {
      isOriginalHandlerRequired = true;
    } else {
      if (this._focusedCellPosition.rowIndex === undefined && (0, _renderer.default)(eventTarget).hasClass(_const.ROW_CLASS)) {
        this._updateFocusedCellPosition($cell);
      }
      elementType = this._getElementType(eventTarget);
      if (this.isRowFocusType()) {
        this.setCellFocusType();
        if (elementType === 'row' && (0, _m_keyboard_navigation_utils.isDataRow)((0, _renderer.default)(eventTarget))) {
          eventTarget = this.getFirstValidCellInRow((0, _renderer.default)(eventTarget));
          elementType = this._getElementType(eventTarget);
        }
      }
      const nextCellInfo = this._getNextCellByTabKey($event, direction, elementType);
      $cell = nextCellInfo.$cell;
      if (!$cell) {
        return false;
      }
      $cell = this._checkNewLineTransition($event, $cell);
      if (!$cell) {
        return false;
      }
      this._focusCell($cell, !nextCellInfo.isHighlighted);
      if (!(0, _m_keyboard_navigation_utils.isEditorCell)(this, $cell)) {
        this._focusInteractiveElement($cell, eventArgs.shift);
      }
    }
    return isOriginalHandlerRequired;
  };
  _proto._getNextCellByTabKey = function _getNextCellByTabKey($event, direction, elementType) {
    let $cell = this._getNextCell(direction, elementType);
    const args = $cell && this._fireFocusedCellChanging($event, $cell, true);
    if (!args || args.cancel) {
      return {};
    }
    if (args.$newCellElement) {
      $cell = args.$newCellElement;
    }
    return {
      $cell,
      isHighlighted: args.isHighlighted
    };
  };
  _proto._checkNewLineTransition = function _checkNewLineTransition($event, $cell) {
    const rowIndex = this.getVisibleRowIndex();
    const $row = $cell.parent();
    if (rowIndex !== this._getRowIndex($row)) {
      const cellPosition = this._getCellPosition($cell);
      const args = this._fireFocusedRowChanging($event, $row);
      if (args.cancel) {
        return;
      }
      if (args.rowIndexChanged && cellPosition) {
        this.setFocusedColumnIndex(cellPosition.columnIndex);
        $cell = this._getFocusedCell();
      }
    }
    return $cell;
  };
  _proto._enterKeyHandler = function _enterKeyHandler(eventArgs, isEditing) {
    var _a;
    const rowIndex = this.getVisibleRowIndex();
    const key = this._dataController.getKeyByRowIndex(rowIndex);
    const $row = (_a = this._focusedView) === null || _a === void 0 ? void 0 : _a.getRow(rowIndex);
    const $cell = this._getFocusedCell();
    const needExpandGroupRow = this.option('grouping.allowCollapsing') && (0, _m_keyboard_navigation_utils.isGroupRow)($row);
    const needExpandMasterDetailRow = this.option('masterDetail.enabled') && ($cell === null || $cell === void 0 ? void 0 : $cell.hasClass(_const2.COMMAND_EXPAND_CLASS));
    const needExpandAdaptiveRow = $cell === null || $cell === void 0 ? void 0 : $cell.hasClass(_const2.ADAPTIVE_COLUMN_NAME_CLASS);
    if (needExpandGroupRow || needExpandMasterDetailRow) {
      const item = this._dataController.items()[rowIndex];
      const isNotContinuation = (item === null || item === void 0 ? void 0 : item.data) && !item.data.isContinuation;
      if ((0, _type.isDefined)(key) && isNotContinuation) {
        this._dataController.changeRowExpand(key);
      }
    } else if (needExpandAdaptiveRow) {
      this._adaptiveColumnsController.toggleExpandAdaptiveDetailRow(key);
      this._updateFocusedCellPosition($cell);
    } else if (!($cell === null || $cell === void 0 ? void 0 : $cell.hasClass(_const2.COMMAND_EDIT_CLASS))) {
      this._processEnterKeyForDataCell(eventArgs, isEditing);
    }
  };
  _proto._processEnterKeyForDataCell = function _processEnterKeyForDataCell(eventArgs, isEditing) {
    const direction = this._getEnterKeyDirection(eventArgs);
    const allowEditingOnEnterKey = this._allowEditingOnEnterKey();
    if (isEditing || !allowEditingOnEnterKey && direction) {
      this._handleEnterKeyEditingCell(eventArgs.originalEvent);
      if (direction === 'next' || direction === 'previous') {
        this._targetCellTabHandler(eventArgs, direction);
      } else if (direction === 'upArrow' || direction === 'downArrow') {
        this._navigateNextCell(eventArgs.originalEvent, direction);
      }
    } else if (allowEditingOnEnterKey) {
      this._startEditing(eventArgs);
    }
  };
  _proto._getEnterKeyDirection = function _getEnterKeyDirection(eventArgs) {
    const enterKeyDirection = this.option('keyboardNavigation.enterKeyDirection');
    const isShift = eventArgs.shift;
    if (enterKeyDirection === 'column') {
      return isShift ? 'upArrow' : 'downArrow';
    }
    if (enterKeyDirection === 'row') {
      return isShift ? 'previous' : 'next';
    }
    return undefined;
  };
  _proto._handleEnterKeyEditingCell = function _handleEnterKeyEditingCell(event) {
    const {
      target
    } = event;
    const $cell = this._getCellElementFromTarget(target);
    const isRowEditMode = this._isRowEditMode();
    this._updateFocusedCellPosition($cell);
    if (isRowEditMode) {
      this._focusEditFormCell($cell);
      setTimeout(this._editingController.saveEditData.bind(this._editingController));
    } else {
      // @ts-expect-error
      _events_engine.default.trigger((0, _renderer.default)(target), 'change');
      this._closeEditCell();
      event.preventDefault();
    }
  }
  /**
   * @extended
   */;
  _proto._escapeKeyHandler = function _escapeKeyHandler(eventArgs, isEditing) {
    const $cell = this._getCellElementFromTarget(eventArgs.originalEvent.target);
    if (isEditing) {
      this._updateFocusedCellPosition($cell);
      if (!this._isRowEditMode()) {
        if (this._editingController.getEditMode() === 'cell') {
          this._editingController.cancelEditData();
        } else {
          this._closeEditCell();
        }
      } else {
        this._focusEditFormCell($cell);
        this._editingController.cancelEditData();
        if (this._dataController.items().length === 0) {
          this._resetFocusedCell();
          this._editorFactory.loseFocus();
        }
      }
      eventArgs.originalEvent.preventDefault();
      return true;
    }
    return false;
  };
  _proto._ctrlFKeyHandler = function _ctrlFKeyHandler(eventArgs) {
    if (this.option('searchPanel.visible')) {
      // @ts-expect-error
      const searchTextEditor = this._headerPanel.getSearchTextEditor();
      if (searchTextEditor) {
        searchTextEditor.focus();
        eventArgs.originalEvent.preventDefault();
      }
    }
  };
  _proto._f2KeyHandler = function _f2KeyHandler() {
    const isEditing = this._editingController.isEditing();
    const rowIndex = this.getVisibleRowIndex();
    const $row = this._focusedView && this._focusedView.getRow(rowIndex);
    if (!isEditing && (0, _m_keyboard_navigation_utils.isDataRow)($row)) {
      this._startEditing();
    }
  };
  _proto._navigateNextCell = function _navigateNextCell($event, keyCode) {
    const $cell = this._getNextCell(keyCode);
    const directionCode = this._getDirectionCodeByKey(keyCode);
    const isCellValid = $cell && this._isCellValid($cell);
    const result = isCellValid ? this._arrowKeysHandlerFocusCell($event, $cell, directionCode) : false;
    return result;
  };
  _proto._arrowKeysHandlerFocusCell = function _arrowKeysHandlerFocusCell($event, $nextCell, direction) {
    const isVerticalDirection = direction === 'prevRow' || direction === 'nextRow';
    const args = this._fireFocusChangingEvents($event, $nextCell, isVerticalDirection, true);
    $nextCell = args.$newCellElement;
    if (!args.cancel && this._isCellValid($nextCell)) {
      this._focus($nextCell, !args.isHighlighted);
      return true;
    }
    return false;
  };
  _proto._beginFastEditing = function _beginFastEditing(originalEvent, isDeleting) {
    if (!this._isFastEditingAllowed() || originalEvent.altKey || originalEvent.ctrlKey || this._editingController.isEditing()) {
      return false;
    }
    if (isDeleting) {
      this._startEditing(originalEvent, _const2.FAST_EDITING_DELETE_KEY);
    } else {
      const {
        key
      } = originalEvent;
      const keyCode = originalEvent.keyCode || originalEvent.which;
      const fastEditingKey = key || keyCode && String.fromCharCode(keyCode);
      if (fastEditingKey && (fastEditingKey.length === 1 || fastEditingKey === _const2.FAST_EDITING_DELETE_KEY)) {
        this._startEditing(originalEvent, fastEditingKey);
      }
    }
    return true;
  }
  // #endregion Key_Handlers
  // #region Pointer_Event_Handler
  ;
  _proto._pointerEventHandler = function _pointerEventHandler(e) {
    var _a;
    const event = e.event || e;
    let $target = (0, _renderer.default)(event.currentTarget);
    const focusedViewElement = (_a = this._rowsView) === null || _a === void 0 ? void 0 : _a.element();
    const $parent = $target.parent();
    const isInteractiveElement = (0, _renderer.default)(event.target).is(_const2.INTERACTIVE_ELEMENTS_SELECTOR);
    const isRevertButton = !!(0, _renderer.default)(event.target).closest(".".concat(_const2.REVERT_BUTTON_CLASS)).length;
    const isExpandCommandCell = $target.hasClass(_const2.COMMAND_EXPAND_CLASS);
    if (!this._isEventInCurrentGrid(event)) {
      return;
    }
    if (!isRevertButton && (this._isCellValid($target, !isInteractiveElement) || isExpandCommandCell)) {
      $target = this._isInsideEditForm($target) ? (0, _renderer.default)(event.target) : $target;
      this._focusView();
      (0, _renderer.default)(focusedViewElement).removeClass(_const2.FOCUS_STATE_CLASS);
      if ($parent.hasClass(_const2.FREESPACE_ROW_CLASS)) {
        this._updateFocusedCellPosition($target);
        this._applyTabIndexToElement(this._focusedView.element());
        this._focusedView.focus(true);
      } else if (!this._isMasterDetailCell($target)) {
        this._clickTargetCellHandler(event, $target);
      } else {
        this._updateFocusedCellPosition($target);
      }
    } else if ($target.is('td')) {
      this._resetFocusedCell();
    }
  };
  _proto._clickTargetCellHandler = function _clickTargetCellHandler(event, $cell) {
    const column = this._getColumnByCellElement($cell);
    const isCellEditMode = this._isCellEditMode();
    this.setCellFocusType();
    const args = this._fireFocusChangingEvents(event, $cell, true);
    $cell = args.$newCellElement;
    if (!args.cancel) {
      if (args.resetFocusedRow) {
        this._focusController._resetFocusedRow();
        return;
      }
      if (args.rowIndexChanged) {
        $cell = this._getFocusedCell();
      }
      if (!args.isHighlighted && !isCellEditMode) {
        this.setRowFocusType();
      }
      this._updateFocusedCellPosition($cell);
      if (this._allowRowUpdating() && isCellEditMode && column && column.allowEditing) {
        this._isNeedFocus = false;
        this._isHiddenFocus = false;
      } else {
        $cell = this._getFocusedCell();
        const $target = event && (0, _renderer.default)(event.target).closest("".concat(_const2.NON_FOCUSABLE_ELEMENTS_SELECTOR, ", td"));
        const skipFocusEvent = $target && $target.not($cell).is(_const2.NON_FOCUSABLE_ELEMENTS_SELECTOR);
        const isEditor = !!column && !column.command && $cell.hasClass(_const.EDITOR_CELL_CLASS);
        const isDisabled = !isEditor && (!args.isHighlighted || skipFocusEvent);
        this._focus($cell, isDisabled, skipFocusEvent);
      }
    } else {
      this.setRowFocusType();
      this.setFocusedRowIndex(args.prevRowIndex);
      if (this._editingController.isEditing() && isCellEditMode) {
        this._closeEditCell();
      }
    }
  };
  _proto._allowRowUpdating = function _allowRowUpdating() {
    const rowIndex = this.getVisibleRowIndex();
    const row = this._dataController.items()[rowIndex];
    return this._editingController.allowUpdating({
      row
    }, 'click');
  }
  // #endregion Pointer_Event_Handler
  // #region Focusing
  ;
  _proto.focus = function focus(element) {
    let activeElementSelector;
    const focusedRowEnabled = this.option('focusedRowEnabled');
    const isHighlighted = this._isCellElement((0, _renderer.default)(element));
    if (!element) {
      activeElementSelector = '.dx-datagrid-rowsview .dx-row[tabindex]';
      if (!focusedRowEnabled) {
        activeElementSelector += ', .dx-datagrid-rowsview .dx-row > td[tabindex]';
      }
      // @ts-expect-error
      element = this.component.$element().find(activeElementSelector).first();
    }
    element && this._focusElement((0, _renderer.default)(element), isHighlighted);
  };
  _proto.getFocusedView = function getFocusedView() {
    return this._focusedView;
  };
  _proto.setupFocusedView = function setupFocusedView() {
    if (this.isKeyboardEnabled() && !(0, _type.isDefined)(this._focusedView)) {
      this._focusView();
    }
  };
  _proto._focusElement = function _focusElement($element, isHighlighted) {
    const rowsViewElement = (0, _renderer.default)(this._getRowsViewElement());
    const $focusedView = $element.closest(rowsViewElement);
    const isRowFocusType = this.isRowFocusType();
    let args = {};
    if (!$focusedView.length || this._isCellElement($element) && !this._isCellValid($element)) {
      return;
    }
    this._focusView();
    this._isNeedFocus = true;
    this._isNeedScroll = true;
    if (this._isCellElement($element) || (0, _m_keyboard_navigation_utils.isGroupRow)($element)) {
      this.setCellFocusType();
      args = this._fireFocusChangingEvents(null, $element, true, isHighlighted);
      $element = args.$newCellElement;
      if (isRowFocusType && !args.isHighlighted) {
        this.setRowFocusType();
      }
    }
    if (!args.cancel) {
      this._focus($element, !args.isHighlighted);
      this._focusInteractiveElement($element);
    }
  };
  _proto._getFocusedViewByElement = function _getFocusedViewByElement($element) {
    const view = this.getFocusedView();
    const $view = view && (0, _renderer.default)(view.element());
    return $element && $element.closest($view).length !== 0;
  };
  _proto._focusView = function _focusView() {
    this._focusedView = this._rowsView;
  };
  _proto._resetFocusedView = function _resetFocusedView() {
    this.setRowFocusType();
    this._focusedView = null;
  };
  _proto._focusInteractiveElement = function _focusInteractiveElement($cell, isLast) {
    if (!$cell) return;
    const $focusedElement = this._getInteractiveElement($cell, isLast);
    _m_utils.default.focusAndSelectElement(this, $focusedElement);
  };
  _proto._focus = function _focus($cell, disableFocus, skipFocusEvent) {
    const $row = $cell && !$cell.hasClass(_const.ROW_CLASS) ? $cell.closest(".".concat(_const.ROW_CLASS)) : $cell;
    if ($row && (0, _m_keyboard_navigation_utils.isNotFocusedRow)($row)) {
      return;
    }
    const focusedView = this._focusedView;
    const $focusViewElement = focusedView && focusedView.element();
    let $focusElement;
    this._isHiddenFocus = disableFocus;
    const isRowFocus = (0, _m_keyboard_navigation_utils.isGroupRow)($row) || (0, _m_keyboard_navigation_utils.isGroupFooterRow)($row) || this.isRowFocusType();
    if (isRowFocus) {
      $focusElement = $row;
      if (focusedView) {
        this.setFocusedRowIndex(this._getRowIndex($row));
      }
    } else if (this._isCellElement($cell)) {
      $focusElement = $cell;
      this._updateFocusedCellPosition($cell);
    }
    if ($focusElement) {
      if ($focusViewElement) {
        $focusViewElement.find('.dx-row[tabindex], .dx-row > td[tabindex]').not($focusElement).removeClass(_const2.CELL_FOCUS_DISABLED_CLASS).removeClass(_const2.FOCUSED_CLASS).removeAttr('tabindex');
      }
      // @ts-expect-error
      _events_engine.default.one($focusElement, 'blur', e => {
        if (e.relatedTarget) {
          $focusElement.removeClass(_const2.CELL_FOCUS_DISABLED_CLASS).removeClass(_const2.FOCUSED_CLASS);
        }
      });
      if (!skipFocusEvent) {
        this._applyTabIndexToElement($focusElement);
        // @ts-expect-error
        _events_engine.default.trigger($focusElement, 'focus');
      }
      if (disableFocus) {
        $focusElement.addClass(_const2.CELL_FOCUS_DISABLED_CLASS);
        if (isRowFocus) {
          $cell.addClass(_const2.CELL_FOCUS_DISABLED_CLASS);
        }
      } else {
        this._editorFactory.focus($focusElement);
      }
    }
  };
  _proto._updateFocus = function _updateFocus(isRenderView) {
    this._updateFocusTimeout = setTimeout(() => {
      if (this._needFocusEditingCell()) {
        this._editingController._focusEditingCell();
        return;
      }
      let $cell = this._getFocusedCell();
      const isEditing = this._editingController.isEditing();
      if (!this._isMasterDetailCell($cell) || this._isRowEditMode()) {
        if (this._hasSkipRow($cell.parent())) {
          const direction = this._focusedCellPosition && this._focusedCellPosition.rowIndex > 0 ? 'upArrow' : 'downArrow';
          $cell = this._getNextCell(direction);
        }
        if ((0, _m_keyboard_navigation_utils.isElementDefined)($cell)) {
          if ($cell.is('td') || $cell.hasClass(this.addWidgetPrefix(_const2.EDIT_FORM_ITEM_CLASS))) {
            const isCommandCell = $cell.is(_const2.COMMAND_CELL_SELECTOR);
            const $focusedElementInsideCell = $cell.find(':focus');
            const isFocusedElementDefined = (0, _m_keyboard_navigation_utils.isElementDefined)($focusedElementInsideCell);
            const column = this._getColumnByCellElement($cell);
            if ((isRenderView || !isCommandCell) && this._editorFactory.focus()) {
              if (isCommandCell && isFocusedElementDefined) {
                _m_utils.default.focusAndSelectElement(this, $focusedElementInsideCell);
                return;
              }
              !isFocusedElementDefined && this._focus($cell);
            } else if (!isFocusedElementDefined && (this._isNeedFocus || this._isHiddenFocus)) {
              this._focus($cell, this._isHiddenFocus);
            }
            if (isEditing && !(column === null || column === void 0 ? void 0 : column.showEditorAlways)) {
              this._focusInteractiveElement.bind(this)($cell);
            }
          } else {
            // @ts-expect-error
            _events_engine.default.trigger($cell, 'focus');
          }
        }
      }
    });
  };
  _proto._getColumnByCellElement = function _getColumnByCellElement($cell) {
    const cellIndex = this._rowsView.getCellIndex($cell);
    const columnIndex = cellIndex + this._columnsController.getColumnIndexOffset();
    return this._columnsController.getVisibleColumns(null, true)[columnIndex];
  };
  _proto._needFocusEditingCell = function _needFocusEditingCell() {
    const isCellEditMode = this._editingController.getEditMode() === _const.EDIT_MODE_CELL;
    const isBatchEditMode = this._editingController.getEditMode() === _const.EDIT_MODE_BATCH;
    const cellEditModeHasChanges = isCellEditMode && this._editingController.hasChanges();
    const isNewRowBatchEditMode = isBatchEditMode && this._editingController.isNewRowInEditMode();
    const $cell = this._getFocusedCell();
    return ($cell.children().length === 0 || $cell.find(_const.FOCUSABLE_ELEMENT_SELECTOR).length > 0) && (cellEditModeHasChanges || isNewRowBatchEditMode);
  };
  _proto._getFocusedCell = function _getFocusedCell() {
    return (0, _renderer.default)(this._getCell(this._focusedCellPosition));
  };
  _proto._updateFocusedCellPositionByTarget = function _updateFocusedCellPositionByTarget(target) {
    var _a;
    const elementType = this._getElementType(target);
    if (elementType === 'row' && (0, _type.isDefined)((_a = this._focusedCellPosition) === null || _a === void 0 ? void 0 : _a.columnIndex)) {
      const $row = (0, _renderer.default)(target);
      this._focusedView && (0, _m_keyboard_navigation_utils.isGroupRow)($row) && this.setFocusedRowIndex(this._getRowIndex($row));
    } else {
      this._updateFocusedCellPosition(this._getCellElementFromTarget(target));
    }
  }
  /**
   * @extended: focus
   */;
  _proto._updateFocusedCellPosition = function _updateFocusedCellPosition($cell, direction) {
    const position = this._getCellPosition($cell, direction);
    if (position) {
      if (!$cell.length || position.rowIndex >= 0 && position.columnIndex >= 0) {
        this.setFocusedCellPosition(position.rowIndex, position.columnIndex);
      }
    }
    return position;
  };
  _proto._getFocusedColumnIndexOffset = function _getFocusedColumnIndexOffset(columnIndex) {
    let offset = 0;
    const column = this._columnsController.getVisibleColumns()[columnIndex];
    if (column && column.fixed) {
      offset = this._getFixedColumnIndexOffset(column);
    } else if (columnIndex >= 0) {
      offset = this._columnsController.getColumnIndexOffset();
    }
    return offset;
  };
  _proto._getFixedColumnIndexOffset = function _getFixedColumnIndexOffset(column) {
    const offset = (0, _m_keyboard_navigation_utils.isFixedColumnIndexOffsetRequired)(this, column) ? this._getVisibleColumnCount() - this._columnsController.getVisibleColumns().length : 0;
    return offset;
  };
  _proto._getCellPosition = function _getCellPosition($cell, direction) {
    let columnIndex;
    const $row = (0, _m_keyboard_navigation_utils.isElementDefined)($cell) && $cell.closest('tr');
    if ((0, _m_keyboard_navigation_utils.isElementDefined)($row)) {
      const rowIndex = this._getRowIndex($row);
      columnIndex = this._rowsView.getCellIndex($cell, rowIndex);
      columnIndex += this._getFocusedColumnIndexOffset(columnIndex);
      if (direction) {
        columnIndex = direction === 'previous' ? columnIndex - 1 : columnIndex + 1;
        columnIndex = this._applyColumnIndexBoundaries(columnIndex);
      }
      return {
        rowIndex,
        columnIndex
      };
    }
    return undefined;
  };
  _proto._focusCell = function _focusCell($cell, isDisabled) {
    if (this._isCellValid($cell)) {
      this._focus($cell, isDisabled);
      return true;
    }
    return undefined;
  };
  _proto._focusEditFormCell = function _focusEditFormCell($cell) {
    if ($cell.hasClass(_const2.MASTER_DETAIL_CELL_CLASS)) {
      this._editorFactory.focus($cell, true);
    }
  };
  _proto._resetFocusedCell = function _resetFocusedCell(preventScroll) {
    var _a;
    const $cell = this._getFocusedCell();
    (0, _m_keyboard_navigation_utils.isElementDefined)($cell) && $cell.removeAttr('tabindex');
    this._isNeedFocus = false;
    this._isNeedScroll = false;
    this._focusedCellPosition = {};
    clearTimeout(this._updateFocusTimeout);
    // @ts-expect-error
    (_a = this._focusedView) === null || _a === void 0 ? void 0 : _a.renderFocusState({
      preventScroll
    });
  };
  _proto.restoreFocusableElement = function restoreFocusableElement(rowIndex, $event) {
    const that = this;
    let args;
    let $rowElement;
    const isUpArrow = (0, _type.isDefined)(rowIndex);
    const $rowsViewElement = this._rowsView.element();
    const {
      columnIndex
    } = that._focusedCellPosition;
    const rowIndexOffset = that._dataController.getRowIndexOffset();
    rowIndex = isUpArrow ? rowIndex : this._rowsView.getTopVisibleItemIndex() + rowIndexOffset;
    if (!isUpArrow) {
      that._editorFactory.loseFocus();
      that._applyTabIndexToElement($rowsViewElement);
      // @ts-expect-error
      _events_engine.default.trigger($rowsViewElement, 'focus');
    } else {
      $rowElement = this._rowsView.getRow(rowIndex - rowIndexOffset);
      args = that._fireFocusedRowChanging($event, $rowElement);
      if (!args.cancel && args.rowIndexChanged) {
        rowIndex = args.newRowIndex;
      }
    }
    if (!isUpArrow || !args.cancel) {
      that.setFocusedCellPosition(rowIndex, columnIndex);
    }
    isUpArrow && that._updateFocus();
  }
  // #endregion Focusing
  // #region Cell_Position
  ;
  _proto._getNewPositionByCode = function _getNewPositionByCode(cellPosition, elementType, code) {
    let {
      columnIndex
    } = cellPosition;
    let {
      rowIndex
    } = cellPosition;
    let visibleColumnsCount;
    if (cellPosition.rowIndex === undefined && code === 'next') {
      return {
        columnIndex: 0,
        rowIndex: 0
      };
    }
    // eslint-disable-next-line default-case
    switch (code) {
      case 'nextInRow':
      case 'next':
        visibleColumnsCount = this._getVisibleColumnCount();
        if (columnIndex < visibleColumnsCount - 1 && elementType !== 'row' && this._hasValidCellAfterPosition({
          columnIndex,
          rowIndex
        })) {
          columnIndex++;
        } else if (!this._isLastRow(rowIndex) && code === 'next') {
          columnIndex = 0;
          rowIndex++;
        }
        break;
      case 'previousInRow':
      case 'previous':
        if (columnIndex > 0 && elementType !== 'row' && this._hasValidCellBeforePosition({
          columnIndex,
          rowIndex
        })) {
          columnIndex--;
        } else if (rowIndex > 0 && code === 'previous') {
          rowIndex--;
          visibleColumnsCount = this._getVisibleColumnCount();
          columnIndex = visibleColumnsCount - 1;
        }
        break;
      case 'upArrow':
        rowIndex = rowIndex > 0 ? rowIndex - 1 : rowIndex;
        break;
      case 'downArrow':
        rowIndex = !this._isLastRow(rowIndex) ? rowIndex + 1 : rowIndex;
        break;
    }
    return {
      columnIndex,
      rowIndex
    };
  };
  _proto.setFocusedCellPosition = function setFocusedCellPosition(rowIndex, columnIndex) {
    this.setFocusedRowIndex(rowIndex);
    this.setFocusedColumnIndex(columnIndex);
  }
  /**
   * @extended: focus
   */;
  _proto.setFocusedRowIndex = function setFocusedRowIndex(rowIndex) {
    if (!this._focusedCellPosition) {
      this._focusedCellPosition = {};
    }
    this._focusedCellPosition.rowIndex = rowIndex;
  }
  /**
   * @extended: focus
   */;
  _proto.setFocusedColumnIndex = function setFocusedColumnIndex(columnIndex) {
    if (!this._focusedCellPosition) {
      this._focusedCellPosition = {};
    }
    this._focusedCellPosition.columnIndex = columnIndex;
  };
  _proto.getRowIndex = function getRowIndex() {
    return this._focusedCellPosition ? this._focusedCellPosition.rowIndex : -1;
  };
  _proto.getColumnIndex = function getColumnIndex() {
    return this._focusedCellPosition ? this._focusedCellPosition.columnIndex : -1;
  }
  /**
   * @extended: TreeList's keyboard navigation
   */;
  _proto.getVisibleRowIndex = function getVisibleRowIndex() {
    var _a;
    const rowIndex = (_a = this._focusedCellPosition) === null || _a === void 0 ? void 0 : _a.rowIndex;
    return !(0, _type.isDefined)(rowIndex) || rowIndex < 0 ? -1 : rowIndex - this._dataController.getRowIndexOffset();
  };
  _proto.getVisibleColumnIndex = function getVisibleColumnIndex() {
    var _a;
    const columnIndex = (_a = this._focusedCellPosition) === null || _a === void 0 ? void 0 : _a.columnIndex;
    return !(0, _type.isDefined)(columnIndex) ? -1 : columnIndex - this._columnsController.getColumnIndexOffset();
  };
  _proto._applyColumnIndexBoundaries = function _applyColumnIndexBoundaries(columnIndex) {
    const visibleColumnsCount = this._getVisibleColumnCount();
    if (columnIndex < 0) {
      columnIndex = 0;
    } else if (columnIndex >= visibleColumnsCount) {
      columnIndex = visibleColumnsCount - 1;
    }
    return columnIndex;
  };
  _proto._isCellByPositionValid = function _isCellByPositionValid(cellPosition) {
    const $cell = (0, _renderer.default)(this._getCell(cellPosition));
    return this._isCellValid($cell);
  };
  _proto._isLastRow = function _isLastRow(rowIndex) {
    const dataController = this._dataController;
    if (this._isVirtualRowRender()) {
      return rowIndex >= dataController.getMaxRowIndex();
    }
    const lastVisibleIndex = Math.max(...dataController.items().map((item, index) => item.visible !== false ? index : -1));
    return rowIndex === lastVisibleIndex;
  };
  _proto._isFirstValidCell = function _isFirstValidCell(cellPosition) {
    let isFirstValidCell = false;
    if (cellPosition.rowIndex === 0 && cellPosition.columnIndex >= 0) {
      isFirstValidCell = isFirstValidCell || !this._hasValidCellBeforePosition(cellPosition);
    }
    return isFirstValidCell;
  };
  _proto._hasValidCellBeforePosition = function _hasValidCellBeforePosition(cellPosition) {
    let {
      columnIndex
    } = cellPosition;
    let hasValidCells = false;
    while (columnIndex > 0 && !hasValidCells) {
      const checkingPosition = {
        columnIndex: --columnIndex,
        rowIndex: cellPosition.rowIndex
      };
      hasValidCells = this._isCellByPositionValid(checkingPosition);
    }
    return hasValidCells;
  };
  _proto._hasValidCellAfterPosition = function _hasValidCellAfterPosition(cellPosition) {
    let {
      columnIndex
    } = cellPosition;
    let hasValidCells = false;
    const visibleColumnCount = this._getVisibleColumnCount();
    while (columnIndex < visibleColumnCount - 1 && !hasValidCells) {
      const checkingPosition = {
        columnIndex: ++columnIndex,
        rowIndex: cellPosition.rowIndex
      };
      hasValidCells = this._isCellByPositionValid(checkingPosition);
    }
    return hasValidCells;
  };
  _proto._isLastValidCell = function _isLastValidCell(cellPosition) {
    const nextColumnIndex = cellPosition.columnIndex >= 0 ? cellPosition.columnIndex + 1 : 0;
    const {
      rowIndex
    } = cellPosition;
    const checkingPosition = {
      columnIndex: nextColumnIndex,
      rowIndex
    };
    const visibleRows = this._dataController.getVisibleRows();
    const row = visibleRows && visibleRows[rowIndex];
    const isLastRow = this._isLastRow(rowIndex);
    if (!isLastRow) {
      return false;
    }
    const isFullRowFocus = (row === null || row === void 0 ? void 0 : row.rowType) === 'group' || (row === null || row === void 0 ? void 0 : row.rowType) === 'groupFooter';
    if (isFullRowFocus && cellPosition.columnIndex > 0) {
      return true;
    }
    if (cellPosition.columnIndex === this._getVisibleColumnCount() - 1) {
      return true;
    }
    if (this._isCellByPositionValid(checkingPosition)) {
      return false;
    }
    return this._isLastValidCell(checkingPosition);
  }
  // #endregion Cell_Position
  // #region DOM_Manipulation
  /**
   * @extended: adaptivity
   */;
  _proto._isCellValid = function _isCellValid($cell, isClick) {
    if ((0, _m_keyboard_navigation_utils.isElementDefined)($cell)) {
      const $row = $cell.parent();
      const columnIndex = this._rowsView.getCellIndex($cell) + this._columnsController.getColumnIndexOffset();
      const column = this._getColumnByCellElement($cell);
      const visibleColumnCount = this._getVisibleColumnCount();
      const editingController = this._editingController;
      const isMasterDetailRow = (0, _m_keyboard_navigation_utils.isDetailRow)($row);
      const isShowWhenGrouped = column && column.showWhenGrouped;
      const isDataCell = column && !$cell.hasClass(_const2.COMMAND_EXPAND_CLASS) && (0, _m_keyboard_navigation_utils.isDataRow)($row);
      const isValidGroupSpaceColumn = function () {
        // eslint-disable-next-line radix
        return !isMasterDetailRow && column && (!(0, _type.isDefined)(column.groupIndex) || isShowWhenGrouped && isDataCell) || parseInt($cell.attr('colspan'), 10) > 1;
      };
      const isDragCell = _dom.GridCoreKeyboardNavigationDom.isDragCell($cell);
      if (isDragCell) {
        return false;
      }
      if (this._isMasterDetailCell($cell)) {
        return true;
      }
      if (visibleColumnCount > columnIndex && isValidGroupSpaceColumn()) {
        const rowItems = this._dataController.items();
        const visibleRowIndex = this._rowsView.getRowIndex($row);
        const row = rowItems[visibleRowIndex];
        const isCellEditing = editingController && this._isCellEditMode() && editingController.isEditing();
        const isRowEditingInCurrentRow = editingController && editingController.isEditRow(visibleRowIndex);
        const isEditing = isRowEditingInCurrentRow || isCellEditing;
        if (column.command) {
          if (this._isLegacyNavigation()) {
            return !isEditing && column.command === 'expand';
          }
          if (isCellEditing) {
            return false;
          }
          if (isRowEditingInCurrentRow) {
            return column.command !== 'select';
          }
          return !isEditing;
        }
        if (isCellEditing && row && row.rowType !== 'data') {
          return false;
        }
        return !isEditing || column.allowEditing || isClick;
      }
    }
  };
  _proto.getFirstValidCellInRow = function getFirstValidCellInRow($row, columnIndex) {
    const that = this;
    const $cells = $row.find('> td');
    let $cell;
    let $result;
    columnIndex = columnIndex || 0;
    for (let i = columnIndex; i < $cells.length; ++i) {
      $cell = $cells.eq(i);
      if (that._isCellValid($cell)) {
        $result = $cell;
        break;
      }
    }
    return $result;
  };
  _proto._getNextCell = function _getNextCell(keyCode, elementType, cellPosition) {
    const focusedCellPosition = cellPosition || this._focusedCellPosition;
    const isRowFocusType = this.isRowFocusType();
    const includeCommandCells = isRowFocusType || ['next', 'previous'].includes(keyCode);
    let $cell;
    let $row;
    if (this._focusedView && focusedCellPosition) {
      const newFocusedCellPosition = this._getNewPositionByCode(focusedCellPosition, elementType, keyCode);
      $cell = (0, _renderer.default)(this._getCell(newFocusedCellPosition));
      const isLastCellOnDirection = keyCode === 'previous' ? this._isFirstValidCell(newFocusedCellPosition) : this._isLastValidCell(newFocusedCellPosition);
      if ((0, _m_keyboard_navigation_utils.isElementDefined)($cell) && !this._isCellValid($cell) && this._isCellInRow(newFocusedCellPosition, includeCommandCells) && !isLastCellOnDirection) {
        if (isRowFocusType) {
          $cell = this.getFirstValidCellInRow($cell.parent(), newFocusedCellPosition.columnIndex);
        } else {
          $cell = this._getNextCell(keyCode, 'cell', newFocusedCellPosition);
        }
      }
      $row = (0, _m_keyboard_navigation_utils.isElementDefined)($cell) && $cell.parent();
      if (this._hasSkipRow($row)) {
        const rowIndex = this._getRowIndex($row);
        if (!this._isLastRow(rowIndex)) {
          $cell = this._getNextCell(keyCode, 'row', {
            columnIndex: focusedCellPosition.columnIndex,
            rowIndex
          });
        } else {
          return null;
        }
      }
      return (0, _m_keyboard_navigation_utils.isElementDefined)($cell) ? $cell : null;
    }
    return null;
  }
  // #endregion DOM_Manipulation
  // #region Editing
  ;
  _proto._startEditing = function _startEditing(eventArgs, fastEditingKey) {
    const focusedCellPosition = this._focusedCellPosition;
    const visibleRowIndex = this.getVisibleRowIndex();
    const visibleColumnIndex = this.getVisibleColumnIndex();
    const row = this._dataController.items()[visibleRowIndex];
    const column = this._columnsController.getVisibleColumns()[visibleColumnIndex];
    if (this._isAllowEditing(row, column)) {
      if (this._isRowEditMode()) {
        this._editingController.editRow(visibleRowIndex);
      } else if (focusedCellPosition) {
        this._startEditCell(eventArgs, fastEditingKey);
      }
    }
  };
  _proto._isAllowEditing = function _isAllowEditing(row, column) {
    return this._editingController.allowUpdating({
      row
    }) && column && column.allowEditing;
  };
  _proto._editFocusedCell = function _editFocusedCell() {
    const rowIndex = this.getVisibleRowIndex();
    const colIndex = this.getVisibleColumnIndex();
    return this._editingController.editCell(rowIndex, colIndex);
  };
  _proto._startEditCell = function _startEditCell(eventArgs, fastEditingKey) {
    this._fastEditingStarted = (0, _type.isDefined)(fastEditingKey);
    const editResult = this._editFocusedCell();
    const isEditResultDeferred = (0, _type.isDeferred)(editResult);
    const isFastEditingStarted = this._isFastEditingStarted();
    if (!isFastEditingStarted || !isEditResultDeferred && !editResult) {
      return;
    }
    const editorValue = isEditResultDeferred && fastEditingKey === _const2.FAST_EDITING_DELETE_KEY ? '' : fastEditingKey;
    const editResultDeferred = isEditResultDeferred ? editResult : (0, _deferred.Deferred)().resolve();
    const waitTemplatesDeferred = this._rowsView.waitAsyncTemplates(true);
    // NOTE T1158801: wait async templates before handle cell editing.
    (0, _deferred.when)(editResultDeferred, waitTemplatesDeferred).done(() => {
      this._editingCellHandler(eventArgs, editorValue);
    });
  };
  _proto._editingCellHandler = function _editingCellHandler(eventArgs, editorValue) {
    var _a, _b;
    const $input = this._getFocusedCell().find(_const2.INTERACTIVE_ELEMENTS_SELECTOR).eq(0);
    const $inputElement = $input.get(0);
    if (!$inputElement) {
      return;
    }
    const keyDownEvent = (0, _index.createEvent)(eventArgs, {
      type: 'keydown',
      target: $inputElement
    });
    const keyPressEvent = (0, _index.createEvent)(eventArgs, {
      type: 'keypress',
      target: $inputElement
    });
    const inputEvent = (0, _index.createEvent)(eventArgs, {
      type: 'input',
      target: $inputElement
    });
    if (inputEvent.originalEvent) {
      inputEvent.originalEvent = (0, _index.createEvent)(inputEvent.originalEvent, {
        data: editorValue
      }); // T1116105
    }
    (_b = (_a = $inputElement).select) === null || _b === void 0 ? void 0 : _b.call(_a);
    // @ts-expect-error
    _events_engine.default.trigger($input, keyDownEvent);
    if (!keyDownEvent.isDefaultPrevented()) {
      // @ts-expect-error
      _events_engine.default.trigger($input, keyPressEvent);
      if (!keyPressEvent.isDefaultPrevented()) {
        const timeout = _browser.default.mozilla ? 25 : 0; // T882996
        setTimeout(() => {
          const inputValue = this._getKeyPressInputValue($input, editorValue);
          $input.val(inputValue);
          const $widgetContainer = $input.closest(".".concat(_const2.WIDGET_CLASS));
          // @ts-expect-error
          _events_engine.default.off($widgetContainer, 'focusout'); // for NumberBox to save entered symbol
          // @ts-expect-error
          _events_engine.default.one($widgetContainer, 'focusout', () => {
            // @ts-expect-error
            _events_engine.default.trigger($input, 'change');
          });
          // @ts-expect-error
          _events_engine.default.trigger($input, inputEvent);
        }, timeout);
      }
    }
  }
  /*
  * NOTE: See the T1203026 ticket.
  * The method is created for cases where the editor in the column is formatted according to the 'decimal' type.
  * After the native event 'keydown', the '-' sign is formatted by the editor into '-0'.
  * Subsequent assignment of '-' to the editor's value is treated as a text change, causing the inversion of the value from '-0' to '0'.
  * To prevent this inversion, it is necessary to assign to the value the same content as in the editor: '-0'.
  */;
  _proto._getKeyPressInputValue = function _getKeyPressInputValue($input, editorValue) {
    const inputCurrentValue = $input.val();
    return editorValue === '-' && inputCurrentValue === '-0' ? '-0' : editorValue;
  }
  // #endregion Editing
  // #region Events
  ;
  _proto._fireFocusChangingEvents = function _fireFocusChangingEvents($event, $cell, fireRowEvent, isHighlighted) {
    var _a;
    let args = {};
    const cellPosition = (_a = this._getCellPosition($cell)) !== null && _a !== void 0 ? _a : {};
    if (this.isCellFocusType()) {
      args = this._fireFocusedCellChanging($event, $cell, isHighlighted);
      if (!args.cancel) {
        cellPosition.columnIndex = args.newColumnIndex;
        cellPosition.rowIndex = args.newRowIndex;
        isHighlighted = args.isHighlighted;
        $cell = (0, _renderer.default)(this._getCell(cellPosition));
      }
    }
    if (!args.cancel && fireRowEvent && $cell) {
      args = this._fireFocusedRowChanging($event, $cell.parent());
      if (!args.cancel) {
        cellPosition.rowIndex = args.newRowIndex;
        args.isHighlighted = isHighlighted;
      }
    }
    args.$newCellElement = (0, _renderer.default)(this._getCell(cellPosition));
    if (!args.$newCellElement.length) {
      args.$newCellElement = $cell;
    }
    return args;
  };
  _proto._fireFocusedCellChanging = function _fireFocusedCellChanging($event, $cellElement, isHighlighted) {
    const prevColumnIndex = this.option('focusedColumnIndex');
    const prevRowIndex = this.option('focusedRowIndex');
    const cellPosition = this._getCellPosition($cellElement);
    const columnIndex = cellPosition ? cellPosition.columnIndex : -1;
    const rowIndex = cellPosition ? cellPosition.rowIndex : -1;
    const visibleRows = this._dataController.getVisibleRows();
    const visibleColumns = this._columnsController.getVisibleColumns();
    const args = {
      cellElement: $cellElement,
      prevColumnIndex,
      prevRowIndex,
      newColumnIndex: columnIndex,
      newRowIndex: rowIndex,
      rows: visibleRows,
      columns: visibleColumns,
      event: $event,
      isHighlighted: isHighlighted || false,
      cancel: false
    };
    this._canceledCellPosition = null;
    this.executeAction('onFocusedCellChanging', args);
    if (args.newColumnIndex !== columnIndex || args.newRowIndex !== rowIndex) {
      args.$newCellElement = (0, _renderer.default)(this._getCell({
        columnIndex: args.newColumnIndex,
        rowIndex: args.newRowIndex
      }));
    }
    if (args.cancel) {
      this._canceledCellPosition = {
        rowIndex,
        columnIndex
      };
    }
    return args;
  };
  _proto._fireFocusedCellChanged = function _fireFocusedCellChanged($cell) {
    const columnIndex = this._rowsView.getCellIndex($cell);
    const rowOptions = $cell === null || $cell === void 0 ? void 0 : $cell.parent().data('options');
    const focusedRowKey = rowOptions === null || rowOptions === void 0 ? void 0 : rowOptions.key;
    this._memoFireFocusedCellChanged(focusedRowKey, columnIndex);
  };
  _proto._memoFireFocusedCellChanged = function _memoFireFocusedCellChanged(rowKey, columnIndex) {
    const $cell = this._getFocusedCell();
    const rowIndex = this._getRowIndex($cell === null || $cell === void 0 ? void 0 : $cell.parent());
    const localRowIndex = Math.min(rowIndex - this._dataController.getRowIndexOffset(), this._dataController.items().length - 1);
    const isEditingCell = this._editingController.isEditCell(localRowIndex, columnIndex);
    if (isEditingCell) {
      return;
    }
    const row = this._dataController.items()[localRowIndex];
    const column = this._columnsController.getVisibleColumns()[columnIndex];
    this.executeAction('onFocusedCellChanged', {
      cellElement: $cell ? (0, _element.getPublicElement)($cell) : undefined,
      columnIndex,
      rowIndex,
      row: row,
      column
    });
  };
  _proto._fireFocusedRowChanging = function _fireFocusedRowChanging(eventArgs, $newFocusedRow) {
    const newRowIndex = this._getRowIndex($newFocusedRow);
    const prevFocusedRowIndex = this.option('focusedRowIndex');
    const loadingOperationTypes = this._dataController.loadingOperationTypes();
    const args = {
      rowElement: $newFocusedRow,
      prevRowIndex: prevFocusedRowIndex,
      newRowIndex,
      event: eventArgs,
      rows: this._dataController.getVisibleRows(),
      cancel: false
    };
    const loadingOperations = loadingOperationTypes.sorting || loadingOperationTypes.grouping || loadingOperationTypes.filtering || loadingOperationTypes.paging;
    if (!this._dataController || this._dataController.isLoading() && loadingOperations) {
      args.cancel = true;
      return args;
    }
    if (this.option('focusedRowEnabled')) {
      this.executeAction('onFocusedRowChanging', args);
      if (!args.cancel && args.newRowIndex !== newRowIndex) {
        args.resetFocusedRow = args.newRowIndex < 0;
        if (!args.resetFocusedRow) {
          this.setFocusedRowIndex(args.newRowIndex);
        }
        args.rowIndexChanged = true;
      }
    }
    return args;
  };
  _proto._fireFocusedRowChanged = function _fireFocusedRowChanged() {
    var _a;
    const focusedRowEnabled = this.option('focusedRowEnabled');
    const focusedRowKey = this.option('focusedRowKey');
    const focusedRowIndex = (_a = this._focusController) === null || _a === void 0 ? void 0 : _a.getFocusedRowIndexByKey(focusedRowKey);
    if (!focusedRowEnabled || (0, _type.isDefined)(focusedRowKey) && focusedRowIndex < 0) {
      return;
    }
    this._memoFireFocusedRowChanged(focusedRowKey, focusedRowIndex);
  };
  _proto._memoFireFocusedRowChanged = function _memoFireFocusedRowChanged(focusedRowKey, focusedRowIndex) {
    const localRowIndex = focusedRowIndex - this._dataController.getRowIndexOffset();
    this.executeAction('onFocusedRowChanged', {
      rowElement: focusedRowIndex < 0 ? undefined : this._rowsView.getRowElement(localRowIndex),
      rowIndex: focusedRowIndex,
      row: focusedRowIndex < 0 ? undefined : this._dataController.getVisibleRows()[localRowIndex]
    });
  }
  // #endregion Events
  ;
  _proto._isEventInCurrentGrid = function _isEventInCurrentGrid(event) {
    return _m_utils.default.isElementInCurrentGrid(this, (0, _renderer.default)(event.target));
  };
  _proto._isRowEditMode = function _isRowEditMode() {
    const editMode = this._editingController.getEditMode();
    return editMode === _const.EDIT_MODE_ROW || editMode === _const.EDIT_MODE_FORM;
  };
  _proto._isCellEditMode = function _isCellEditMode() {
    const editMode = this._editingController.getEditMode();
    return editMode === _const.EDIT_MODE_CELL || editMode === _const.EDIT_MODE_BATCH;
  };
  _proto._isFastEditingAllowed = function _isFastEditingAllowed() {
    return this._isCellEditMode() && this.option('keyboardNavigation.editOnKeyPress');
  };
  _proto._getInteractiveElement = function _getInteractiveElement($cell, isLast) {
    const $focusedElement = $cell.find(_const2.INTERACTIVE_ELEMENTS_SELECTOR).filter(':visible');
    return isLast ? $focusedElement.last() : $focusedElement.first();
  };
  _proto._applyTabIndexToElement = function _applyTabIndexToElement($element) {
    var _a;
    const tabIndex = (_a = this.option('tabIndex')) !== null && _a !== void 0 ? _a : 0;
    $element.attr('tabindex', tabIndex);
  };
  _proto._getCell = function _getCell(cellPosition) {
    if (this._focusedView && cellPosition) {
      const rowIndexOffset = this._dataController.getRowIndexOffset();
      const column = this._columnsController.getVisibleColumns(null, true)[cellPosition.columnIndex];
      const columnIndexOffset = column && column.fixed ? this._getFixedColumnIndexOffset(column) : this._columnsController.getColumnIndexOffset();
      const rowIndex = cellPosition.rowIndex >= 0 ? cellPosition.rowIndex - rowIndexOffset : -1;
      const columnIndex = cellPosition.columnIndex >= 0 ? cellPosition.columnIndex - columnIndexOffset : -1;
      return this._focusedView.getCell({
        rowIndex,
        columnIndex
      });
    }
  };
  _proto._getRowIndex = function _getRowIndex($row) {
    let rowIndex = this._rowsView.getRowIndex($row);
    if (rowIndex >= 0) {
      rowIndex += this._dataController.getRowIndexOffset();
    }
    return rowIndex;
  };
  _proto._hasSkipRow = function _hasSkipRow($row) {
    const row = $row && $row.get(0);
    return row && (row.style.display === 'none' || (0, _m_keyboard_navigation_utils.isDetailRow)($row) && !$row.hasClass(this.addWidgetPrefix(_const.EDIT_FORM_CLASS)));
  };
  _proto._allowEditingOnEnterKey = function _allowEditingOnEnterKey() {
    return this.option('keyboardNavigation.enterKeyAction') === 'startEdit';
  };
  _proto._isLegacyNavigation = function _isLegacyNavigation() {
    return this.option('useLegacyKeyboardNavigation');
  }
  /**
   * @extended: TreeList's keyboard_navigation
   */;
  _proto._getDirectionCodeByKey = function _getDirectionCodeByKey(key) {
    let directionCode;
    // eslint-disable-next-line default-case
    switch (key) {
      case 'upArrow':
        directionCode = 'prevRow';
        break;
      case 'downArrow':
        directionCode = 'nextRow';
        break;
      case 'leftArrow':
        directionCode = this.option('rtlEnabled') ? 'nextInRow' : 'previousInRow';
        break;
      case 'rightArrow':
        directionCode = this.option('rtlEnabled') ? 'previousInRow' : 'nextInRow';
        break;
    }
    return directionCode;
  };
  _proto._isVirtualScrolling = function _isVirtualScrolling() {
    const scrollingMode = this.option('scrolling.mode');
    return scrollingMode === 'virtual' || scrollingMode === 'infinite';
  };
  _proto._isVirtualRowRender = function _isVirtualRowRender() {
    return this._isVirtualScrolling() || _m_utils.default.isVirtualRowRendering(this);
  };
  _proto._isVirtualColumnRender = function _isVirtualColumnRender() {
    return this.option('scrolling.columnRenderingMode') === 'virtual';
  };
  _proto._scrollBy = function _scrollBy(left, top, rowIndex, $event) {
    const that = this;
    const scrollable = this._rowsView.getScrollable();
    if (that._focusedCellPosition) {
      const scrollHandler = function () {
        scrollable.off('scroll', scrollHandler);
        setTimeout(that.restoreFocusableElement.bind(that, rowIndex, $event));
      };
      scrollable.on('scroll', scrollHandler);
    }
    return scrollable.scrollBy({
      left,
      top
    });
  };
  _proto._isInsideEditForm = function _isInsideEditForm(element) {
    const $editForm = (0, _renderer.default)(element).closest(".".concat(this.addWidgetPrefix(_const.EDIT_FORM_CLASS)));
    return $editForm.length && this.elementIsInsideGrid($editForm);
  };
  _proto._isMasterDetailCell = function _isMasterDetailCell(element) {
    const $masterDetailCell = (0, _renderer.default)(element).closest(".".concat(_const2.MASTER_DETAIL_CELL_CLASS));
    return $masterDetailCell.length && this.elementIsInsideGrid($masterDetailCell);
  }
  /**
   * @extended: adaptivity
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._processNextCellInMasterDetail = function _processNextCellInMasterDetail($nextCell, _$cell) {
    if (!this._isInsideEditForm($nextCell) && $nextCell) {
      this._applyTabIndexToElement($nextCell);
    }
  };
  _proto._handleTabKeyOnMasterDetailCell = function _handleTabKeyOnMasterDetailCell(target, direction) {
    if (this._isMasterDetailCell(target)) {
      this._updateFocusedCellPosition((0, _renderer.default)(target), direction);
      const $nextCell = this._getNextCell(direction, 'row');
      this._processNextCellInMasterDetail($nextCell, (0, _renderer.default)(target));
      return true;
    }
    return false;
  };
  _proto._getElementType = function _getElementType(target) {
    return (0, _renderer.default)(target).is('tr') ? 'row' : 'cell';
  };
  _proto._isFastEditingStarted = function _isFastEditingStarted() {
    return this._isFastEditingAllowed() && this._fastEditingStarted;
  };
  _proto._getVisibleColumnCount = function _getVisibleColumnCount() {
    return this._columnsController.getVisibleColumns(null, true).length;
  };
  _proto._isCellInRow = function _isCellInRow(cellPosition, includeCommandCells) {
    const {
      columnIndex
    } = cellPosition;
    const visibleColumnsCount = this._getVisibleColumnCount();
    return includeCommandCells ? columnIndex >= 0 && columnIndex <= visibleColumnsCount - 1 : columnIndex > 0 && columnIndex < visibleColumnsCount - 1;
  }
  /**
   * @extended: adaptivity
   */;
  _proto._isCellElement = function _isCellElement($element) {
    return $element.length && $element[0].tagName === 'TD';
  };
  _proto._getCellElementFromTarget = function _getCellElementFromTarget(target) {
    const elementType = this._getElementType(target);
    const $targetElement = (0, _renderer.default)(target);
    let $cell;
    if (elementType === 'cell') {
      $cell = $targetElement.closest(".".concat(_const.ROW_CLASS, " > td"));
    } else {
      $cell = $targetElement.children().not(".".concat(_const2.COMMAND_EXPAND_CLASS)).first();
    }
    return $cell;
  };
  _proto._getRowsViewElement = function _getRowsViewElement() {
    var _a;
    return (_a = this._rowsView) === null || _a === void 0 ? void 0 : _a.element();
  };
  _proto.isKeyboardEnabled = function isKeyboardEnabled() {
    return this.option('keyboardNavigation.enabled');
  };
  _proto._processCanceledEditCellPosition = function _processCanceledEditCellPosition(rowIndex, columnIndex) {
    if (this._canceledCellPosition) {
      const isCanceled = this._canceledCellPosition.rowIndex === rowIndex && this._canceledCellPosition.columnIndex === columnIndex;
      this._canceledCellPosition = null;
      return isCanceled;
    }
    return undefined;
  };
  _proto.updateFocusedRowIndex = function updateFocusedRowIndex() {
    const dataController = this._dataController;
    const visibleRowIndex = this.getVisibleRowIndex();
    const visibleItems = dataController.items();
    const lastVisibleIndex = visibleItems.length ? visibleItems.length - 1 : -1;
    const rowIndexOffset = dataController.getRowIndexOffset();
    if (lastVisibleIndex >= 0 && visibleRowIndex > lastVisibleIndex) {
      this.setFocusedRowIndex(lastVisibleIndex + rowIndexOffset);
    }
  };
  return KeyboardNavigationController;
}(_m_modules.default.ViewController);
const rowsView = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(RowsViewKeyboardExtender, _Base);
  function RowsViewKeyboardExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto2 = RowsViewKeyboardExtender.prototype;
  _proto2._rowClick = function _rowClick(e) {
    const editRowIndex = this._editingController.getEditRowIndex();
    const isKeyboardEnabled = this._keyboardNavigationController.isKeyboardEnabled();
    if (editRowIndex === e.rowIndex) {
      this._keyboardNavigationController.setCellFocusType();
    }
    const needTriggerPointerEventHandler = ((0, _m_keyboard_navigation_utils.isMobile)() || !isKeyboardEnabled) && this.option('focusedRowEnabled');
    if (needTriggerPointerEventHandler) {
      this._triggerPointerDownEventHandler(e, !isKeyboardEnabled);
    }
    _Base.prototype._rowClick.apply(this, arguments);
  };
  _proto2._triggerPointerDownEventHandler = function _triggerPointerDownEventHandler(e, force) {
    const {
      originalEvent
    } = e.event;
    if (originalEvent) {
      const $cell = (0, _renderer.default)(originalEvent.target);
      const columnIndex = this.getCellIndex($cell);
      const column = this._columnsController.getVisibleColumns()[columnIndex];
      const row = this._dataController.items()[e.rowIndex];
      if (this._keyboardNavigationController._isAllowEditing(row, column) || force) {
        const eventArgs = (0, _index.createEvent)(originalEvent, {
          currentTarget: originalEvent.target
        });
        this._keyboardNavigationController._pointerEventHandler(eventArgs);
      }
    }
  };
  _proto2.renderFocusState = function renderFocusState(params) {
    const {
      preventScroll,
      pageSizeChanged
    } = params !== null && params !== void 0 ? params : {};
    const $rowsViewElement = this.element();
    if ($rowsViewElement && !(0, _selectors.focused)($rowsViewElement)) {
      $rowsViewElement.attr('tabindex', null);
    }
    pageSizeChanged && this._keyboardNavigationController.updateFocusedRowIndex();
    let rowIndex = this._keyboardNavigationController.getVisibleRowIndex();
    if (!(0, _type.isDefined)(rowIndex) || rowIndex < 0) {
      rowIndex = 0;
    }
    const cellElements = this.getCellElements(rowIndex);
    if (this._keyboardNavigationController.isKeyboardEnabled() && (cellElements === null || cellElements === void 0 ? void 0 : cellElements.length)) {
      this.updateFocusElementTabIndex(cellElements, preventScroll);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto2.updateFocusElementTabIndex = function updateFocusElementTabIndex(cellElements, preventScroll) {
    const $row = cellElements.eq(0).parent();
    if ((0, _m_keyboard_navigation_utils.isGroupRow)($row)) {
      this._keyboardNavigationController._applyTabIndexToElement($row);
    } else {
      let columnIndex = this._keyboardNavigationController.getColumnIndex();
      if (!(0, _type.isDefined)(columnIndex) || columnIndex < 0) {
        columnIndex = 0;
      }
      this._updateFocusedCellTabIndex(cellElements, columnIndex);
    }
  };
  _proto2._updateFocusedCellTabIndex = function _updateFocusedCellTabIndex(cellElements, columnIndex) {
    const keyboardController = this._keyboardNavigationController;
    const cellElementsLength = cellElements ? cellElements.length : -1;
    const updateCellTabIndex = function ($cell) {
      const isMasterDetailCell = keyboardController._isMasterDetailCell($cell);
      const isValidCell = keyboardController._isCellValid($cell);
      if (!isMasterDetailCell && isValidCell && keyboardController._isCellElement($cell)) {
        keyboardController._applyTabIndexToElement($cell);
        keyboardController.setCellFocusType();
        return true;
      }
      return undefined;
    };
    const $cell = _dom.GridCoreKeyboardNavigationDom.getCellToFocus(cellElements, columnIndex);
    if ($cell.length) {
      updateCellTabIndex($cell);
    } else {
      if (cellElementsLength <= columnIndex) {
        columnIndex = cellElementsLength - 1;
      }
      for (let i = columnIndex; i < cellElementsLength; ++i) {
        if (updateCellTabIndex((0, _renderer.default)(cellElements[i]))) {
          break;
        }
      }
    }
  };
  _proto2.renderDelayedTemplates = function renderDelayedTemplates(change) {
    _Base.prototype.renderDelayedTemplates.apply(this, arguments);
    this.waitAsyncTemplates().done(() => {
      this._renderFocusByChange(change);
    });
  };
  _proto2._renderFocusByChange = function _renderFocusByChange(change) {
    var _a;
    const {
      operationTypes,
      repaintChangesOnly
    } = change !== null && change !== void 0 ? change : {};
    const {
      fullReload,
      pageSize
    } = operationTypes !== null && operationTypes !== void 0 ? operationTypes : {};
    const hasInsertsOrRemoves = !!((_a = change === null || change === void 0 ? void 0 : change.changeTypes) === null || _a === void 0 ? void 0 : _a.find(changeType => changeType === 'insert' || changeType === 'remove'));
    if (!change || !repaintChangesOnly || fullReload || pageSize || hasInsertsOrRemoves) {
      const preventScroll = (0, _m_keyboard_navigation_utils.shouldPreventScroll)(this);
      this.renderFocusState({
        preventScroll,
        pageSizeChanged: pageSize
      });
    }
  };
  _proto2._renderCore = function _renderCore(change) {
    const deferred = _Base.prototype._renderCore.apply(this, arguments);
    this._renderFocusByChange(change);
    return deferred;
  };
  _proto2._editCellPrepared = function _editCellPrepared($cell) {
    var _a;
    const editorInstance = this._getEditorInstance($cell);
    const isEditingNavigationMode = (_a = this._keyboardNavigationController) === null || _a === void 0 ? void 0 : _a._isFastEditingStarted();
    if (editorInstance && isEditingNavigationMode) {
      this._handleEditingNavigationMode(editorInstance);
    }
    // @ts-expect-error
    _Base.prototype._editCellPrepared.apply(this, arguments);
  };
  _proto2._handleEditingNavigationMode = function _handleEditingNavigationMode(editorInstance) {
    ['downArrow', 'upArrow'].forEach(keyName => {
      const originalKeyHandler = editorInstance._supportedKeys()[keyName];
      editorInstance.registerKeyHandler(keyName, e => {
        const isDropDownOpened = editorInstance._input().attr('aria-expanded') === 'true';
        if (isDropDownOpened) {
          return originalKeyHandler && originalKeyHandler.call(editorInstance, e);
        }
      });
    });
    editorInstance.registerKeyHandler('leftArrow', _common.noop);
    editorInstance.registerKeyHandler('rightArrow', _common.noop);
    const isDateBoxWithMask = editorInstance.NAME === _const2.DATEBOX_WIDGET_NAME && editorInstance.option('useMaskBehavior');
    if (isDateBoxWithMask) {
      editorInstance.registerKeyHandler('enter', _common.noop);
    }
  };
  _proto2._getEditorInstance = function _getEditorInstance($cell) {
    const $editor = $cell.find('.dx-texteditor').eq(0);
    return _m_utils.default.getWidgetInstance($editor);
  };
  return RowsViewKeyboardExtender;
}(Base);
const editing = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(EditingControllerKeyboardExtender, _Base2);
  function EditingControllerKeyboardExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto3 = EditingControllerKeyboardExtender.prototype;
  /**
   * interface override
   */
  _proto3.editCell = function editCell(rowIndex, columnIndex) {
    if (this._keyboardNavigationController._processCanceledEditCellPosition(rowIndex, columnIndex)) {
      return false;
    }
    const isCellEditing = _Base2.prototype.editCell.call(this, rowIndex, columnIndex);
    if (isCellEditing) {
      this._keyboardNavigationController.setupFocusedView();
    }
    return isCellEditing;
  };
  _proto3.editRow = function editRow(rowIndex) {
    const visibleColumnIndex = this._keyboardNavigationController.getVisibleColumnIndex();
    const column = this._columnsController.getVisibleColumns()[visibleColumnIndex];
    if (column && column.type || this.option('editing.mode') === _const.EDIT_MODE_FORM) {
      this._keyboardNavigationController._resetFocusedCell();
    }
    _Base2.prototype.editRow.call(this, rowIndex);
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto3.addRow = function addRow(parentKey) {
    this._keyboardNavigationController.setupFocusedView();
    this._keyboardNavigationController.setCellFocusType();
    return _Base2.prototype.addRow.apply(this, arguments);
  };
  _proto3.getFocusedCellInRow = function getFocusedCellInRow(rowIndex) {
    let $cell = _Base2.prototype.getFocusedCellInRow.call(this, rowIndex);
    const rowIndexOffset = this._dataController.getRowIndexOffset();
    const focusedRowIndex = this._keyboardNavigationController._focusedCellPosition.rowIndex - rowIndexOffset;
    if (this._keyboardNavigationController.isKeyboardEnabled() && focusedRowIndex === rowIndex) {
      const $focusedCell = this._keyboardNavigationController._getFocusedCell();
      if ((0, _m_keyboard_navigation_utils.isElementDefined)($focusedCell) && !$focusedCell.hasClass(_const2.COMMAND_EDIT_CLASS)) {
        $cell = $focusedCell;
      }
    }
    return $cell;
  };
  _proto3._processCanceledEditingCell = function _processCanceledEditingCell() {
    this.closeEditCell().done(() => {
      this._keyboardNavigationController._updateFocus();
    });
  }
  /**
   * interface override
   */;
  _proto3.closeEditCell = function closeEditCell() {
    const keyboardNavigation = this._keyboardNavigationController;
    keyboardNavigation._fastEditingStarted = false;
    const result = _Base2.prototype.closeEditCell.apply(this, arguments);
    keyboardNavigation._updateFocus();
    return result;
  };
  _proto3._delayedInputFocus = function _delayedInputFocus() {
    this._keyboardNavigationController._isNeedScroll = true;
    _Base2.prototype._delayedInputFocus.apply(this, arguments);
  };
  _proto3._isEditingStart = function _isEditingStart() {
    const cancel = _Base2.prototype._isEditingStart.apply(this, arguments);
    if (cancel && !this._keyboardNavigationController._isNeedFocus) {
      const $cell = this._keyboardNavigationController._getFocusedCell();
      this._keyboardNavigationController._focus($cell, true);
    }
    return cancel;
  };
  return EditingControllerKeyboardExtender;
}(Base);
const data = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(DataControllerKeyboardExtender, _Base3);
  function DataControllerKeyboardExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto4 = DataControllerKeyboardExtender.prototype;
  _proto4._correctRowIndices = function _correctRowIndices(getRowIndexCorrection) {
    const that = this;
    const focusedCellPosition = this._keyboardNavigationController._focusedCellPosition;
    _Base3.prototype._correctRowIndices.apply(that, arguments);
    if (focusedCellPosition && focusedCellPosition.rowIndex >= 0) {
      const focusedRowIndexCorrection = getRowIndexCorrection(focusedCellPosition.rowIndex);
      if (focusedRowIndexCorrection) {
        focusedCellPosition.rowIndex += focusedRowIndexCorrection;
        this._editorFactoryController.refocus();
      }
    }
  };
  _proto4.getMaxRowIndex = function getMaxRowIndex() {
    let result = this.items().length - 1;
    // @ts-expect-error
    const virtualItemsCount = this.virtualItemsCount();
    if (virtualItemsCount) {
      const rowIndexOffset = this.getRowIndexOffset();
      result += rowIndexOffset + virtualItemsCount.end;
    }
    return result;
  };
  return DataControllerKeyboardExtender;
}(Base);
const adaptiveColumns = Base => /*#__PURE__*/function (_Base4) {
  _inheritsLoose(AdaptiveColumnsKeyboardExtender, _Base4);
  function AdaptiveColumnsKeyboardExtender() {
    return _Base4.apply(this, arguments) || this;
  }
  var _proto5 = AdaptiveColumnsKeyboardExtender.prototype;
  _proto5._showHiddenCellsInView = function _showHiddenCellsInView(_ref) {
    let {
      viewName,
      $cells,
      isCommandColumn
    } = _ref;
    _Base4.prototype._showHiddenCellsInView.apply(this, arguments);
    viewName === _const2.COLUMN_HEADERS_VIEW && !isCommandColumn && $cells.each((_, cellElement) => {
      const $cell = (0, _renderer.default)(cellElement);
      (0, _m_keyboard_navigation_utils.isCellInHeaderRow)($cell) && $cell.attr('tabindex', 0);
    });
  };
  _proto5._hideVisibleCellInView = function _hideVisibleCellInView(_ref2) {
    let {
      viewName,
      $cell,
      isCommandColumn
    } = _ref2;
    _Base4.prototype._hideVisibleCellInView.apply(this, arguments);
    if (viewName === _const2.COLUMN_HEADERS_VIEW && !isCommandColumn && (0, _m_keyboard_navigation_utils.isCellInHeaderRow)($cell)) {
      $cell.removeAttr('tabindex');
    }
  };
  return AdaptiveColumnsKeyboardExtender;
}(Base);
const keyboardNavigationModule = exports.keyboardNavigationModule = {
  defaultOptions() {
    return {
      useLegacyKeyboardNavigation: false,
      keyboardNavigation: {
        enabled: true,
        enterKeyAction: 'startEdit',
        enterKeyDirection: 'none',
        editOnKeyPress: false
      }
    };
  },
  controllers: {
    keyboardNavigation: KeyboardNavigationController
  },
  extenders: {
    views: {
      rowsView
    },
    controllers: {
      editing,
      data,
      adaptiveColumns,
      keyboardNavigation: _scrollable_a11y.keyboardNavigationScrollableA11yExtender
    }
  }
};
