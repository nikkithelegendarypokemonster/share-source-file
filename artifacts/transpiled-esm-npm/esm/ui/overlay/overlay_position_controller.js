import $ from '../../core/renderer';
import { isDefined, isString, isWindow, isEvent } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import positionUtils from '../../animation/position';
import { resetPosition, move, locate } from '../../animation/translator';
import { getWindow } from '../../core/utils/window';
import swatch from '../widget/swatch_container';
var window = getWindow();
var OVERLAY_POSITION_ALIASES = {
  'top': {
    my: 'top center',
    at: 'top center'
  },
  'bottom': {
    my: 'bottom center',
    at: 'bottom center'
  },
  'right': {
    my: 'right center',
    at: 'right center'
  },
  'left': {
    my: 'left center',
    at: 'left center'
  },
  'center': {
    my: 'center',
    at: 'center'
  },
  'right bottom': {
    my: 'right bottom',
    at: 'right bottom'
  },
  'right top': {
    my: 'right top',
    at: 'right top'
  },
  'left bottom': {
    my: 'left bottom',
    at: 'left bottom'
  },
  'left top': {
    my: 'left top',
    at: 'left top'
  }
};
var OVERLAY_DEFAULT_BOUNDARY_OFFSET = {
  h: 0,
  v: 0
};
class OverlayPositionController {
  constructor(_ref) {
    var {
      position,
      container,
      visualContainer,
      $root,
      $content,
      $wrapper,
      onPositioned,
      onVisualPositionChanged,
      restorePosition,
      _fixWrapperPosition,
      _skipContentPositioning
    } = _ref;
    this._props = {
      position,
      container,
      visualContainer,
      restorePosition,
      onPositioned,
      onVisualPositionChanged,
      _fixWrapperPosition,
      _skipContentPositioning
    };
    this._$root = $root;
    this._$content = $content;
    this._$wrapper = $wrapper;
    this._$markupContainer = undefined;
    this._$visualContainer = undefined;
    this._shouldRenderContentInitialPosition = true;
    this._visualPosition = undefined;
    this._initialPosition = undefined;
    this._previousVisualPosition = undefined;
    this.updateContainer(container);
    this.updatePosition(position);
    this.updateVisualContainer(visualContainer);
  }
  get $container() {
    this.updateContainer(); // NOTE: swatch classes can be updated runtime

    return this._$markupContainer;
  }
  get $visualContainer() {
    return this._$visualContainer;
  }
  get position() {
    return this._position;
  }
  set fixWrapperPosition(fixWrapperPosition) {
    this._props._fixWrapperPosition = fixWrapperPosition;
    this.styleWrapperPosition();
  }
  set restorePosition(restorePosition) {
    this._props.restorePosition = restorePosition;
  }
  restorePositionOnNextRender(value) {
    // NOTE: no visual position means it's a first render
    this._shouldRenderContentInitialPosition = value || !this._visualPosition;
  }
  openingHandled() {
    var shouldRestorePosition = this._props.restorePosition;
    this.restorePositionOnNextRender(shouldRestorePosition);
  }
  updatePosition(positionProp) {
    this._props.position = positionProp;
    this._position = this._normalizePosition(positionProp);
    this.updateVisualContainer();
  }
  updateContainer() {
    var containerProp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._props.container;
    this._props.container = containerProp;
    this._$markupContainer = containerProp ? $(containerProp) : swatch.getSwatchContainer(this._$root);
    this.updateVisualContainer(this._props.visualContainer);
  }
  updateVisualContainer() {
    var visualContainer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._props.visualContainer;
    this._props.visualContainer = visualContainer;
    this._$visualContainer = this._getVisualContainer();
  }
  detectVisualPositionChange(event) {
    this._updateVisualPositionValue();
    this._raisePositionedEvents(event);
  }
  positionContent() {
    if (this._shouldRenderContentInitialPosition) {
      this._renderContentInitialPosition();
    } else {
      move(this._$content, this._visualPosition);
      this.detectVisualPositionChange();
    }
  }
  positionWrapper() {
    if (this._$visualContainer) {
      positionUtils.setup(this._$wrapper, {
        my: 'top left',
        at: 'top left',
        of: this._$visualContainer
      });
    }
  }
  styleWrapperPosition() {
    var useFixed = isWindow(this.$visualContainer.get(0)) || this._props._fixWrapperPosition;
    var positionStyle = useFixed ? 'fixed' : 'absolute';
    this._$wrapper.css('position', positionStyle);
  }
  _updateVisualPositionValue() {
    this._previousVisualPosition = this._visualPosition;
    this._visualPosition = locate(this._$content);
  }
  _renderContentInitialPosition() {
    this._renderBoundaryOffset();
    resetPosition(this._$content);
    var wrapperOverflow = this._$wrapper.css('overflow');
    this._$wrapper.css('overflow', 'hidden');
    if (!this._props._skipContentPositioning) {
      var resultPosition = positionUtils.setup(this._$content, this._position);
      this._initialPosition = resultPosition;
    }
    this._$wrapper.css('overflow', wrapperOverflow);
    this.detectVisualPositionChange();
  }
  _raisePositionedEvents(event) {
    var previousPosition = this._previousVisualPosition;
    var newPosition = this._visualPosition;
    var isVisualPositionChanged = (previousPosition === null || previousPosition === void 0 ? void 0 : previousPosition.top) !== newPosition.top || (previousPosition === null || previousPosition === void 0 ? void 0 : previousPosition.left) !== newPosition.left;
    if (isVisualPositionChanged) {
      this._props.onVisualPositionChanged({
        previousPosition: previousPosition,
        position: newPosition,
        event
      });
    }
    this._props.onPositioned({
      position: this._initialPosition
    });
  }
  _renderBoundaryOffset() {
    var _this$_position;
    var boundaryOffset = (_this$_position = this._position) !== null && _this$_position !== void 0 ? _this$_position : {
      boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET
    };
    this._$content.css('margin', "".concat(boundaryOffset.v, "px ").concat(boundaryOffset.h, "px"));
  }
  _getVisualContainer() {
    var _this$_props$position, _this$_props$position2;
    var containerProp = this._props.container;
    var visualContainerProp = this._props.visualContainer;
    var positionOf = isEvent((_this$_props$position = this._props.position) === null || _this$_props$position === void 0 ? void 0 : _this$_props$position.of) ? this._props.position.of.target : (_this$_props$position2 = this._props.position) === null || _this$_props$position2 === void 0 ? void 0 : _this$_props$position2.of;
    if (visualContainerProp) {
      return $(visualContainerProp);
    }
    if (containerProp) {
      return $(containerProp);
    }
    if (positionOf) {
      return $(positionOf);
    }
    return $(window);
  }
  _normalizePosition(positionProp) {
    var defaultPositionConfig = {
      boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET
    };
    if (isDefined(positionProp)) {
      return extend(true, {}, defaultPositionConfig, this._positionToObject(positionProp));
    } else {
      return defaultPositionConfig;
    }
  }
  _positionToObject(position) {
    if (isString(position)) {
      return extend({}, OVERLAY_POSITION_ALIASES[position]);
    }
    return position;
  }
}
export { OVERLAY_POSITION_ALIASES, OverlayPositionController };