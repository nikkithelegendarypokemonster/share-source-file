import Guid from '../../../core/guid';
import $ from '../../../core/renderer';
import { extend } from '../../../core/utils/extend';
import { name as CLICK_EVENT } from '../../../events/click';
import eventsEngine from '../../../events/core/events_engine';
import { end as dragEventEnd, move as dragEventMove, start as dragEventStart } from '../../../events/drag';
import { addNamespace, isCommandKeyPressed } from '../../../events/utils/index';
import Widget from '../../../ui/widget/ui.widget';
import { COLLAPSE_EVENT, getActionNameByEventName, RESIZE_EVENT } from './utils/event';
export var RESIZE_HANDLE_CLASS = 'dx-resize-handle';
var RESIZE_HANDLE_RESIZABLE_CLASS = 'dx-resize-handle-resizable';
var HORIZONTAL_DIRECTION_CLASS = 'dx-resize-handle-horizontal';
var VERTICAL_DIRECTION_CLASS = 'dx-resize-handle-vertical';
var RESIZE_HANDLE_ICON_CLASS = 'dx-resize-handle-icon';
var RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS = 'dx-resize-handle-collapse-prev-pane';
var RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS = 'dx-resize-handle-collapse-next-pane';
var ICON_CLASS = 'dx-icon';
var STATE_INVISIBLE_CLASS = 'dx-state-invisible';
var RESIZE_HANDLER_MODULE_NAMESPACE = 'dxResizeHandle';
var RESIZE_DIRECTION = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};
var KEYBOARD_DELTA = 5;
var INACTIVE_RESIZE_HANDLE_SIZE = 2;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class ResizeHandle extends Widget {
  _supportedKeys() {
    return extend(super._supportedKeys(), {
      rightArrow(e) {
        e.preventDefault();
        e.stopPropagation();
        var {
          direction,
          showCollapseNext
        } = this.option();
        if (isCommandKeyPressed(e)) {
          if (direction === RESIZE_DIRECTION.vertical || showCollapseNext === false) {
            return;
          }
          this._collapseNextHandler(e);
        } else {
          this._resizeBy(e, {
            x: KEYBOARD_DELTA
          });
        }
      },
      leftArrow(e) {
        e.preventDefault();
        e.stopPropagation();
        var {
          direction,
          showCollapsePrev
        } = this.option();
        if (isCommandKeyPressed(e)) {
          if (direction === RESIZE_DIRECTION.vertical || showCollapsePrev === false) {
            return;
          }
          this._collapsePrevHandler(e);
        } else {
          this._resizeBy(e, {
            x: -KEYBOARD_DELTA
          });
        }
      },
      upArrow(e) {
        e.preventDefault();
        e.stopPropagation();
        var {
          direction,
          showCollapsePrev
        } = this.option();
        if (isCommandKeyPressed(e)) {
          if (direction === RESIZE_DIRECTION.horizontal || showCollapsePrev === false) {
            return;
          }
          this._collapsePrevHandler(e);
        } else {
          this._resizeBy(e, {
            y: -KEYBOARD_DELTA
          });
        }
      },
      downArrow(e) {
        e.preventDefault();
        e.stopPropagation();
        var {
          direction,
          showCollapseNext
        } = this.option();
        if (isCommandKeyPressed(e)) {
          if (direction === RESIZE_DIRECTION.horizontal || showCollapseNext === false) {
            return;
          }
          this._collapseNextHandler(e);
        } else {
          this._resizeBy(e, {
            y: KEYBOARD_DELTA
          });
        }
      }
    });
  }
  _getDefaultOptions() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      direction: RESIZE_DIRECTION.horizontal,
      hoverStateEnabled: true,
      focusStateEnabled: true,
      onResize: null,
      onResizeEnd: null,
      onResizeStart: null,
      resizable: true,
      showCollapsePrev: true,
      showCollapseNext: true,
      onCollapsePrev: null,
      onCollapseNext: null,
      separatorSize: 8
    });
  }
  _init() {
    super._init();
    var namespace = "".concat(RESIZE_HANDLER_MODULE_NAMESPACE).concat(new Guid());
    this.RESIZE_START_EVENT_NAME = addNamespace(dragEventStart, namespace);
    this.RESIZE_EVENT_NAME = addNamespace(dragEventMove, namespace);
    this.RESIZE_END_EVENT_NAME = addNamespace(dragEventEnd, namespace);
  }
  _initMarkup() {
    super._initMarkup();
    this._renderResizeHandleContent();
    this._setAriaAttributes();
  }
  _renderResizeHandleContent() {
    var {
      resizable
    } = this.option();
    this.$element().addClass(RESIZE_HANDLE_CLASS);
    this.$element().toggleClass(RESIZE_HANDLE_RESIZABLE_CLASS, resizable);
    this._toggleDirectionClass();
    this._setResizeHandleSize();
    this._$collapsePrevButton = $('<div>').addClass(this._getIconClass('prev')).appendTo(this.$element());
    this._$resizeHandle = $('<div>').addClass(this._getIconClass('icon')).appendTo(this.$element());
    this._$collapseNextButton = $('<div>').addClass(this._getIconClass('next')).appendTo(this.$element());
    this._setCollapseButtonsVisibility();
    this._setResizeIconVisibility();
  }
  _updateIconsClasses() {
    var isHorizontal = this._isHorizontalDirection();
    this._$collapsePrevButton.removeClass(this._getCollapseIconClass(false, !isHorizontal)).addClass(this._getCollapseIconClass(false, isHorizontal));
    this._$resizeHandle.removeClass(this._getResizeIconClass(!isHorizontal)).addClass(this._getResizeIconClass(isHorizontal));
    this._$collapseNextButton.removeClass(this._getCollapseIconClass(true, !isHorizontal)).addClass(this._getCollapseIconClass(true, isHorizontal));
  }
  _setResizeHandleSize() {
    var {
      separatorSize,
      resizable,
      showCollapseNext,
      showCollapsePrev
    } = this.option();
    var isHorizontal = this._isHorizontalDirection();
    var dimension = isHorizontal ? 'width' : 'height';
    var inverseDimension = isHorizontal ? 'height' : 'width';
    if (resizable === false && showCollapseNext === false && showCollapsePrev === false) {
      this.option('disabled', true);
      this.option(dimension, INACTIVE_RESIZE_HANDLE_SIZE);
      this.option(inverseDimension, null);
    } else {
      this.option(dimension, separatorSize);
      this.option(inverseDimension, null);
      this.option('disabled', false);
    }
  }
  _getIconClass(iconType) {
    var isHorizontal = this._isHorizontalDirection();
    switch (iconType) {
      case 'prev':
        return "".concat(RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS, " ").concat(ICON_CLASS, " ").concat(this._getCollapseIconClass(false, isHorizontal));
      case 'next':
        return "".concat(RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS, " ").concat(ICON_CLASS, " ").concat(this._getCollapseIconClass(true, isHorizontal));
      case 'icon':
        return "".concat(RESIZE_HANDLE_ICON_CLASS, " ").concat(ICON_CLASS, " ").concat(this._getResizeIconClass(isHorizontal));
      default:
        return '';
    }
  }
  // eslint-disable-next-line class-methods-use-this
  _getResizeIconClass(isHorizontal) {
    return "dx-icon-handle".concat(isHorizontal ? 'vertical' : 'horizontal');
  }
  // eslint-disable-next-line class-methods-use-this
  _getCollapseIconClass(isNextButton, isHorizontal) {
    if (isNextButton) {
      return "dx-icon-triangle".concat(isHorizontal ? 'right' : 'down');
    }
    return "dx-icon-triangle".concat(isHorizontal ? 'left' : 'up');
  }
  _setCollapseButtonsVisibility() {
    var {
      showCollapsePrev,
      showCollapseNext
    } = this.option();
    this._$collapsePrevButton.toggleClass(STATE_INVISIBLE_CLASS, !showCollapsePrev);
    this._$collapseNextButton.toggleClass(STATE_INVISIBLE_CLASS, !showCollapseNext);
  }
  _setResizeIconVisibility() {
    var {
      resizable
    } = this.option();
    this._$resizeHandle.toggleClass(STATE_INVISIBLE_CLASS, !resizable);
  }
  _setAriaAttributes() {
    this.setAria({
      role: 'application',
      // eslint-disable-next-line spellcheck/spell-checker
      roledescription: 'separator',
      orientation: this._isHorizontalDirection() ? 'vertical' : 'horizontal',
      label: 'Split bar'
    });
  }
  _toggleDirectionClass() {
    this.$element().toggleClass(HORIZONTAL_DIRECTION_CLASS, this._isHorizontalDirection());
    this.$element().toggleClass(VERTICAL_DIRECTION_CLASS, !this._isHorizontalDirection());
  }
  _render() {
    super._render();
    this._attachEventHandlers();
  }
  _resizeStartHandler(e) {
    this._getAction(RESIZE_EVENT.onResizeStart)({
      event: e
    });
  }
  _resizeHandler(e) {
    this._getAction(RESIZE_EVENT.onResize)({
      event: e
    });
  }
  _resizeEndHandler(e) {
    this._getAction(RESIZE_EVENT.onResizeEnd)({
      event: e
    });
  }
  _collapsePrevHandler(e) {
    this._getAction(COLLAPSE_EVENT.onCollapsePrev)({
      event: e
    });
  }
  _collapseNextHandler(e) {
    this._getAction(COLLAPSE_EVENT.onCollapseNext)({
      event: e
    });
  }
  _resizeBy(e) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      x: 0,
      y: 0
    };
    var {
      resizable
    } = this.option();
    if (resizable === false) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    e.offset = offset;
    this._resizeStartHandler(e);
    this._resizeHandler(e);
    this._resizeEndHandler(e);
  }
  _getAction(eventName) {
    var _a;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (_a = this[getActionNameByEventName(eventName)]) !== null && _a !== void 0 ? _a : this._createActionByOption(eventName);
  }
  _attachEventHandlers() {
    var {
      resizable,
      direction
    } = this.option();
    var eventData = {
      direction,
      immediate: true
    };
    if (resizable) {
      eventsEngine.on(this.$element(), this.RESIZE_START_EVENT_NAME, eventData, this._resizeStartHandler.bind(this));
      eventsEngine.on(this.$element(), this.RESIZE_EVENT_NAME, eventData, this._resizeHandler.bind(this));
      eventsEngine.on(this.$element(), this.RESIZE_END_EVENT_NAME, eventData, this._resizeEndHandler.bind(this));
    }
    eventsEngine.on(this._$collapsePrevButton, CLICK_EVENT, this._collapsePrevHandler.bind(this));
    eventsEngine.on(this._$collapseNextButton, CLICK_EVENT, this._collapseNextHandler.bind(this));
  }
  _detachEventHandlers() {
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.RESIZE_START_EVENT_NAME);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.RESIZE_EVENT_NAME);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.RESIZE_END_EVENT_NAME);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this._$collapsePrevButton, CLICK_EVENT);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this._$collapseNextButton, CLICK_EVENT);
  }
  _isHorizontalDirection() {
    return this.option('direction') === RESIZE_DIRECTION.horizontal;
  }
  _optionChanged(args) {
    var {
      name,
      value
    } = args;
    switch (name) {
      case 'direction':
        this._toggleDirectionClass();
        this._detachEventHandlers();
        this._attachEventHandlers();
        this._setResizeHandleSize();
        this._updateIconsClasses();
        break;
      case 'resizable':
        this._setResizeIconVisibility();
        this.$element().toggleClass(RESIZE_HANDLE_RESIZABLE_CLASS, value);
        this._detachEventHandlers();
        this._attachEventHandlers();
        this._setResizeHandleSize();
        break;
      case 'separatorSize':
        this._setResizeHandleSize();
        break;
      case 'showCollapsePrev':
      case 'showCollapseNext':
        this._setCollapseButtonsVisibility();
        this._setResizeHandleSize();
        break;
      case 'onCollapsePrev':
      case 'onCollapseNext':
        this._detachEventHandlers();
        this._attachEventHandlers();
        break;
      case 'onResize':
      case 'onResizeStart':
      case 'onResizeEnd':
        this[getActionNameByEventName(name)] = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }
}
export default ResizeHandle;