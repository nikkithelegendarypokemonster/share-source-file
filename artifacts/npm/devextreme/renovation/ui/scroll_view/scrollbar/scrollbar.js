/**
* DevExtreme (renovation/ui/scroll_view/scrollbar/scrollbar.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.THUMB_MIN_SIZE = exports.ScrollbarPropsType = exports.Scrollbar = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _combine_classes = require("../../../utils/combine_classes");
var _dom_adapter = _interopRequireDefault(require("../../../../core/dom_adapter"));
var _consts = require("../common/consts");
var _subscribe_to_event = require("../../../utils/subscribe_to_event");
var _scrollbar_props = require("../common/scrollbar_props");
var _simulated_strategy_props = require("../common/simulated_strategy_props");
const _excluded = ["bounceEnabled", "containerHasSizes", "containerSize", "contentSize", "direction", "maxOffset", "minOffset", "scrollByThumb", "scrollLocation", "showScrollbar", "visible"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const THUMB_MIN_SIZE = exports.THUMB_MIN_SIZE = 15;
const viewFunction = viewModel => {
  const {
    hidden,
    scrollbarClasses,
    scrollbarRef,
    thumbClasses,
    thumbRef,
    thumbStyles
  } = viewModel;
  return (0, _inferno.createVNode)(1, "div", scrollbarClasses, (0, _inferno.createVNode)(1, "div", thumbClasses, (0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_SCROLL_CONTENT_CLASS), 2, {
    "style": (0, _inferno2.normalizeStyles)(thumbStyles)
  }, null, thumbRef), 2, {
    "hidden": hidden
  }, null, scrollbarRef);
};
exports.viewFunction = viewFunction;
const ScrollbarPropsType = exports.ScrollbarPropsType = Object.defineProperties({}, {
  direction: {
    get: function () {
      return _scrollbar_props.ScrollbarProps.direction;
    },
    configurable: true,
    enumerable: true
  },
  containerSize: {
    get: function () {
      return _scrollbar_props.ScrollbarProps.containerSize;
    },
    configurable: true,
    enumerable: true
  },
  contentSize: {
    get: function () {
      return _scrollbar_props.ScrollbarProps.contentSize;
    },
    configurable: true,
    enumerable: true
  },
  visible: {
    get: function () {
      return _scrollbar_props.ScrollbarProps.visible;
    },
    configurable: true,
    enumerable: true
  },
  containerHasSizes: {
    get: function () {
      return _scrollbar_props.ScrollbarProps.containerHasSizes;
    },
    configurable: true,
    enumerable: true
  },
  scrollLocation: {
    get: function () {
      return _scrollbar_props.ScrollbarProps.scrollLocation;
    },
    configurable: true,
    enumerable: true
  },
  minOffset: {
    get: function () {
      return _scrollbar_props.ScrollbarProps.minOffset;
    },
    configurable: true,
    enumerable: true
  },
  maxOffset: {
    get: function () {
      return _scrollbar_props.ScrollbarProps.maxOffset;
    },
    configurable: true,
    enumerable: true
  },
  showScrollbar: {
    get: function () {
      return _simulated_strategy_props.ScrollableSimulatedProps.showScrollbar;
    },
    configurable: true,
    enumerable: true
  },
  scrollByThumb: {
    get: function () {
      return _simulated_strategy_props.ScrollableSimulatedProps.scrollByThumb;
    },
    configurable: true,
    enumerable: true
  },
  bounceEnabled: {
    get: function () {
      return _simulated_strategy_props.ScrollableSimulatedProps.bounceEnabled;
    },
    configurable: true,
    enumerable: true
  }
});
let Scrollbar = exports.Scrollbar = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(Scrollbar, _InfernoComponent);
  function Scrollbar(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.scrollbarRef = (0, _inferno.createRef)();
    _this.scrollRef = (0, _inferno.createRef)();
    _this.thumbRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.state = {
      hovered: false,
      active: false
    };
    _this.pointerDownEffect = _this.pointerDownEffect.bind(_assertThisInitialized(_this));
    _this.pointerUpEffect = _this.pointerUpEffect.bind(_assertThisInitialized(_this));
    _this.mouseEnterEffect = _this.mouseEnterEffect.bind(_assertThisInitialized(_this));
    _this.mouseLeaveEffect = _this.mouseLeaveEffect.bind(_assertThisInitialized(_this));
    _this.isThumb = _this.isThumb.bind(_assertThisInitialized(_this));
    _this.isScrollbar = _this.isScrollbar.bind(_assertThisInitialized(_this));
    _this.setActiveState = _this.setActiveState.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = Scrollbar.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.pointerDownEffect, []), new _inferno2.InfernoEffect(this.pointerUpEffect, []), new _inferno2.InfernoEffect(this.mouseEnterEffect, [this.props.showScrollbar, this.props.scrollByThumb]), new _inferno2.InfernoEffect(this.mouseLeaveEffect, [this.props.showScrollbar, this.props.scrollByThumb])];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$, _this$_effects$2;
    (_this$_effects$ = this._effects[2]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.showScrollbar, this.props.scrollByThumb]);
    (_this$_effects$2 = this._effects[3]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props.showScrollbar, this.props.scrollByThumb]);
  };
  _proto.pointerDownEffect = function pointerDownEffect() {
    return (0, _subscribe_to_event.subscribeToDXPointerDownEvent)(this.thumbRef.current, () => {
      this.setState(__state_argument => ({
        active: true
      }));
    });
  };
  _proto.pointerUpEffect = function pointerUpEffect() {
    return (0, _subscribe_to_event.subscribeToDXPointerUpEvent)(_dom_adapter.default.getDocument(), () => {
      this.setState(__state_argument => ({
        active: false
      }));
    });
  };
  _proto.mouseEnterEffect = function mouseEnterEffect() {
    if (this.isExpandable) {
      return (0, _subscribe_to_event.subscribeToMouseEnterEvent)(this.scrollbarRef.current, () => {
        this.setState(__state_argument => ({
          hovered: true
        }));
      });
    }
    return undefined;
  };
  _proto.mouseLeaveEffect = function mouseLeaveEffect() {
    if (this.isExpandable) {
      return (0, _subscribe_to_event.subscribeToMouseLeaveEvent)(this.scrollbarRef.current, () => {
        this.setState(__state_argument => ({
          hovered: false
        }));
      });
    }
    return undefined;
  };
  _proto.isThumb = function isThumb(element) {
    return this.scrollbarRef.current.querySelector(".".concat(_consts.SCROLLABLE_SCROLL_CLASS)) === element || this.scrollbarRef.current.querySelector(".".concat(_consts.SCROLLABLE_SCROLL_CONTENT_CLASS)) === element;
  };
  _proto.isScrollbar = function isScrollbar(element) {
    return element === this.scrollbarRef.current;
  };
  _proto.setActiveState = function setActiveState() {
    this.setState(__state_argument => ({
      active: true
    }));
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoComponent.prototype.componentWillUpdate.call(this);
    if (this.props['direction'] !== nextProps['direction'] || this.props['containerSize'] !== nextProps['containerSize'] || this.props['contentSize'] !== nextProps['contentSize'] || this.props['showScrollbar'] !== nextProps['showScrollbar'] || this.props['scrollLocation'] !== nextProps['scrollLocation'] || this.props['maxOffset'] !== nextProps['maxOffset']) {
      this.__getterCache['thumbStyles'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      hovered: this.state.hovered,
      active: this.state.active,
      scrollbarRef: this.scrollbarRef,
      scrollRef: this.scrollRef,
      thumbRef: this.thumbRef,
      dimension: this.dimension,
      isHorizontal: this.isHorizontal,
      scrollSize: this.scrollSize,
      containerToContentRatio: this.containerToContentRatio,
      scrollRatio: this.scrollRatio,
      scrollbarClasses: this.scrollbarClasses,
      thumbStyles: this.thumbStyles,
      thumbTransform: this.thumbTransform,
      thumbClasses: this.thumbClasses,
      hidden: this.hidden,
      isThumbVisible: this.isThumbVisible,
      isExpandable: this.isExpandable,
      isHoverMode: this.isHoverMode,
      isAlwaysMode: this.isAlwaysMode,
      isNeverMode: this.isNeverMode,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Scrollbar, [{
    key: "dimension",
    get: function () {
      return this.isHorizontal ? 'width' : 'height';
    }
  }, {
    key: "isHorizontal",
    get: function () {
      return this.props.direction === _consts.DIRECTION_HORIZONTAL;
    }
  }, {
    key: "scrollSize",
    get: function () {
      return Math.max(this.props.containerSize * this.containerToContentRatio, THUMB_MIN_SIZE);
    }
  }, {
    key: "containerToContentRatio",
    get: function () {
      return this.props.contentSize ? this.props.containerSize / this.props.contentSize : this.props.containerSize;
    }
  }, {
    key: "scrollRatio",
    get: function () {
      const scrollOffsetMax = Math.abs(this.props.maxOffset);
      if (scrollOffsetMax) {
        return (this.props.containerSize - this.scrollSize) / scrollOffsetMax;
      }
      return 1;
    }
  }, {
    key: "scrollbarClasses",
    get: function () {
      const classesMap = {
        [_consts.SCROLLABLE_SCROLLBAR_CLASS]: true,
        ["dx-scrollbar-".concat(this.props.direction)]: true,
        [_consts.SCROLLABLE_SCROLLBAR_ACTIVE_CLASS]: this.state.active,
        [_consts.HOVER_ENABLED_STATE]: this.isExpandable,
        'dx-state-invisible': this.hidden,
        'dx-state-hover': this.isExpandable && this.state.hovered
      };
      return (0, _combine_classes.combineClasses)(classesMap);
    }
  }, {
    key: "thumbStyles",
    get: function () {
      if (this.__getterCache['thumbStyles'] !== undefined) {
        return this.__getterCache['thumbStyles'];
      }
      return this.__getterCache['thumbStyles'] = (() => {
        return {
          [this.dimension]: Math.round(this.scrollSize) || THUMB_MIN_SIZE,
          transform: this.isNeverMode ? 'none' : this.thumbTransform
        };
      })();
    }
  }, {
    key: "thumbTransform",
    get: function () {
      const translateValue = -this.props.scrollLocation * this.scrollRatio;
      if (this.isHorizontal) {
        return "translate(".concat(translateValue, "px, 0px)");
      }
      return "translate(0px, ".concat(translateValue, "px)");
    }
  }, {
    key: "thumbClasses",
    get: function () {
      return (0, _combine_classes.combineClasses)({
        [_consts.SCROLLABLE_SCROLL_CLASS]: true,
        'dx-state-invisible': !this.isThumbVisible
      });
    }
  }, {
    key: "hidden",
    get: function () {
      return this.isNeverMode || this.props.maxOffset === 0 || this.props.containerSize < 15;
    }
  }, {
    key: "isThumbVisible",
    get: function () {
      if (this.hidden) {
        return false;
      }
      if (this.isHoverMode) {
        return this.props.visible || this.state.hovered || this.state.active;
      }
      if (this.isAlwaysMode) {
        return true;
      }
      return this.props.visible;
    }
  }, {
    key: "isExpandable",
    get: function () {
      return (this.isHoverMode || this.isAlwaysMode) && this.props.scrollByThumb;
    }
  }, {
    key: "isHoverMode",
    get: function () {
      return this.props.showScrollbar === _consts.ShowScrollbarMode.HOVER;
    }
  }, {
    key: "isAlwaysMode",
    get: function () {
      return this.props.showScrollbar === _consts.ShowScrollbarMode.ALWAYS;
    }
  }, {
    key: "isNeverMode",
    get: function () {
      return this.props.showScrollbar === _consts.ShowScrollbarMode.NEVER;
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return Scrollbar;
}(_inferno2.InfernoComponent);
Scrollbar.defaultProps = ScrollbarPropsType;
