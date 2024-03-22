/**
* DevExtreme (renovation/ui/scroll_view/scrollable.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.Scrollable = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _native = require("./strategy/native");
var _simulated = require("./strategy/simulated");
var _get_element_location_internal = require("./utils/get_element_location_internal");
var _convert_location = require("./utils/convert_location");
var _get_offset_distance = require("./utils/get_offset_distance");
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
var _consts = require("./common/consts");
var _scrollable_props = require("./common/scrollable_props");
var _resolve_rtl = require("../../utils/resolve_rtl");
var _config_context = require("../../common/config_context");
const _excluded = ["addWidgetClass", "aria", "bounceEnabled", "children", "classes", "direction", "disabled", "forceGeneratePockets", "height", "inertiaEnabled", "loadPanelTemplate", "needRenderScrollbars", "needScrollViewContentWrapper", "onBounce", "onEnd", "onPullDown", "onReachBottom", "onScroll", "onStart", "onUpdated", "onVisibilityChange", "pullDownEnabled", "pulledDownText", "pullingDownText", "reachBottomEnabled", "reachBottomText", "refreshStrategy", "refreshingText", "rtlEnabled", "scrollByContent", "scrollByThumb", "scrollLocationChange", "showScrollbar", "useKeyboard", "useNative", "useSimulatedScrollbar", "visible", "width"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = viewModel => {
  const {
    isServerSide,
    props: {
      aria,
      bounceEnabled,
      children,
      classes,
      direction,
      disabled,
      forceGeneratePockets,
      height,
      inertiaEnabled,
      loadPanelTemplate,
      needScrollViewContentWrapper,
      onBounce,
      onEnd,
      onPullDown,
      onReachBottom,
      onScroll,
      onStart,
      onUpdated,
      onVisibilityChange,
      pullDownEnabled,
      pulledDownText,
      pullingDownText,
      reachBottomEnabled,
      reachBottomText,
      refreshStrategy,
      refreshingText,
      scrollByContent,
      scrollByThumb,
      showScrollbar,
      useKeyboard,
      useNative,
      useSimulatedScrollbar,
      visible,
      width
    },
    restAttributes,
    rtlEnabled,
    scrollableNativeRef,
    scrollableSimulatedRef
  } = viewModel;
  return useNative ? (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _native.ScrollableNative, _extends({
    "aria": aria,
    "classes": classes,
    "width": width,
    "height": height,
    "disabled": disabled,
    "visible": visible,
    "rtlEnabled": rtlEnabled,
    "direction": direction,
    "showScrollbar": showScrollbar,
    "pullDownEnabled": pullDownEnabled,
    "reachBottomEnabled": reachBottomEnabled,
    "forceGeneratePockets": forceGeneratePockets && !isServerSide,
    "needScrollViewContentWrapper": needScrollViewContentWrapper,
    "loadPanelTemplate": !isServerSide ? loadPanelTemplate : undefined,
    "needRenderScrollbars": !isServerSide,
    "onScroll": onScroll,
    "onUpdated": onUpdated,
    "onPullDown": onPullDown,
    "onReachBottom": onReachBottom,
    "refreshStrategy": refreshStrategy,
    "pulledDownText": pulledDownText,
    "pullingDownText": pullingDownText,
    "refreshingText": refreshingText,
    "reachBottomText": reachBottomText,
    "useSimulatedScrollbar": useSimulatedScrollbar
  }, restAttributes, {
    children: children
  }), null, scrollableNativeRef)) : (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _simulated.ScrollableSimulated, _extends({
    "aria": aria,
    "classes": classes,
    "width": width,
    "height": height,
    "disabled": disabled,
    "visible": visible,
    "rtlEnabled": rtlEnabled,
    "direction": direction,
    "showScrollbar": showScrollbar,
    "scrollByThumb": scrollByThumb,
    "pullDownEnabled": pullDownEnabled,
    "reachBottomEnabled": reachBottomEnabled,
    "forceGeneratePockets": forceGeneratePockets && !isServerSide,
    "needScrollViewContentWrapper": needScrollViewContentWrapper,
    "loadPanelTemplate": !isServerSide ? loadPanelTemplate : undefined,
    "needRenderScrollbars": !isServerSide,
    "onScroll": onScroll,
    "onUpdated": onUpdated,
    "onPullDown": onPullDown,
    "onReachBottom": onReachBottom,
    "refreshStrategy": "simulated",
    "pulledDownText": pulledDownText,
    "pullingDownText": pullingDownText,
    "refreshingText": refreshingText,
    "reachBottomText": reachBottomText,
    "onVisibilityChange": onVisibilityChange,
    "inertiaEnabled": inertiaEnabled,
    "bounceEnabled": bounceEnabled,
    "scrollByContent": scrollByContent,
    "useKeyboard": useKeyboard,
    "onStart": onStart,
    "onEnd": onEnd,
    "onBounce": onBounce
  }, restAttributes, {
    children: children
  }), null, scrollableSimulatedRef));
};
exports.viewFunction = viewFunction;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let Scrollable = exports.Scrollable = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(Scrollable, _InfernoWrapperCompon);
  function Scrollable(props) {
    var _this;
    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.state = {};
    _this.scrollableNativeRef = (0, _inferno.createRef)();
    _this.scrollableSimulatedRef = (0, _inferno.createRef)();
    _this.content = _this.content.bind(_assertThisInitialized(_this));
    _this.container = _this.container.bind(_assertThisInitialized(_this));
    _this.scrollTo = _this.scrollTo.bind(_assertThisInitialized(_this));
    _this.scrollBy = _this.scrollBy.bind(_assertThisInitialized(_this));
    _this.updateHandler = _this.updateHandler.bind(_assertThisInitialized(_this));
    _this.release = _this.release.bind(_assertThisInitialized(_this));
    _this.refresh = _this.refresh.bind(_assertThisInitialized(_this));
    _this.scrollToElement = _this.scrollToElement.bind(_assertThisInitialized(_this));
    _this.scrollHeight = _this.scrollHeight.bind(_assertThisInitialized(_this));
    _this.scrollWidth = _this.scrollWidth.bind(_assertThisInitialized(_this));
    _this.scrollOffset = _this.scrollOffset.bind(_assertThisInitialized(_this));
    _this.scrollTop = _this.scrollTop.bind(_assertThisInitialized(_this));
    _this.scrollLeft = _this.scrollLeft.bind(_assertThisInitialized(_this));
    _this.clientHeight = _this.clientHeight.bind(_assertThisInitialized(_this));
    _this.clientWidth = _this.clientWidth.bind(_assertThisInitialized(_this));
    _this.getScrollElementPosition = _this.getScrollElementPosition.bind(_assertThisInitialized(_this));
    _this.startLoading = _this.startLoading.bind(_assertThisInitialized(_this));
    _this.finishLoading = _this.finishLoading.bind(_assertThisInitialized(_this));
    _this.validate = _this.validate.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = Scrollable.prototype;
  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };
  _proto.validate = function validate(event) {
    return this.scrollableRef.validate(event);
  };
  _proto.content = function content() {
    return this.scrollableRef.content();
  };
  _proto.container = function container() {
    return this.scrollableRef.container();
  };
  _proto.scrollTo = function scrollTo(targetLocation) {
    if (!this.props.useNative) {
      this.updateHandler();
    }
    const currentScrollOffset = this.props.useNative ? this.scrollOffset() : {
      top: this.container().scrollTop,
      left: this.container().scrollLeft
    };
    const distance = (0, _get_offset_distance.getOffsetDistance)((0, _convert_location.convertToLocation)(targetLocation, this.props.direction), currentScrollOffset);
    this.scrollBy(distance);
  };
  _proto.scrollBy = function scrollBy(distance) {
    let {
      left,
      top
    } = (0, _convert_location.convertToLocation)(distance, this.props.direction);
    if (!(0, _type.isDefined)(top) || !(0, _type.isNumeric)(top)) {
      top = 0;
    }
    if (!(0, _type.isDefined)(left) || !(0, _type.isNumeric)(top)) {
      left = 0;
    }
    if (top === 0 && left === 0) {
      return;
    }
    this.scrollableRef.scrollByLocation({
      top,
      left
    });
  };
  _proto.updateHandler = function updateHandler() {
    this.scrollableRef.updateHandler();
  };
  _proto.release = function release() {
    if (!this.isServerSide) {
      this.scrollableRef.release();
    }
  };
  _proto.refresh = function refresh() {
    if (!this.isServerSide) {
      this.scrollableRef.refresh();
    }
  };
  _proto.scrollToElement = function scrollToElement(element, offset) {
    if (!this.content().contains(element)) {
      return;
    }
    const scrollPosition = {
      top: 0,
      left: 0
    };
    const {
      direction
    } = this.props;
    if (direction !== _consts.DIRECTION_VERTICAL) {
      scrollPosition.left = this.getScrollElementPosition(element, _consts.DIRECTION_HORIZONTAL, offset);
    }
    if (direction !== _consts.DIRECTION_HORIZONTAL) {
      scrollPosition.top = this.getScrollElementPosition(element, _consts.DIRECTION_VERTICAL, offset);
    }
    this.scrollTo(scrollPosition);
  };
  _proto.scrollHeight = function scrollHeight() {
    return this.scrollableRef.scrollHeight();
  };
  _proto.scrollWidth = function scrollWidth() {
    return this.scrollableRef.scrollWidth();
  };
  _proto.scrollOffset = function scrollOffset() {
    if (!this.isServerSide) {
      return this.scrollableRef.scrollOffset();
    }
    return {
      top: 0,
      left: 0
    };
  };
  _proto.scrollTop = function scrollTop() {
    return this.scrollableRef.scrollTop();
  };
  _proto.scrollLeft = function scrollLeft() {
    return this.scrollableRef.scrollLeft();
  };
  _proto.clientHeight = function clientHeight() {
    return this.scrollableRef.clientHeight();
  };
  _proto.clientWidth = function clientWidth() {
    return this.scrollableRef.clientWidth();
  };
  _proto.getScrollElementPosition = function getScrollElementPosition(targetElement, direction, offset) {
    const scrollOffset = this.scrollOffset();
    return (0, _get_element_location_internal.getElementLocationInternal)(targetElement, direction, this.container(), scrollOffset, offset);
  };
  _proto.startLoading = function startLoading() {
    this.scrollableRef.startLoading();
  };
  _proto.finishLoading = function finishLoading() {
    if (!this.isServerSide) {
      this.scrollableRef.finishLoading();
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        loadPanelTemplate: getTemplate(props.loadPanelTemplate)
      }),
      scrollableNativeRef: this.scrollableNativeRef,
      scrollableSimulatedRef: this.scrollableSimulatedRef,
      config: this.config,
      validate: this.validate,
      scrollableRef: this.scrollableRef,
      rtlEnabled: this.rtlEnabled,
      isServerSide: this.isServerSide,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Scrollable, [{
    key: "config",
    get: function () {
      if (this.context[_config_context.ConfigContext.id]) {
        return this.context[_config_context.ConfigContext.id];
      }
      return _config_context.ConfigContext.defaultValue;
    }
  }, {
    key: "scrollableRef",
    get: function () {
      if (this.props.useNative) {
        return this.scrollableNativeRef.current;
      }
      return this.scrollableSimulatedRef.current;
    }
  }, {
    key: "rtlEnabled",
    get: function () {
      const {
        rtlEnabled
      } = this.props;
      return !!(0, _resolve_rtl.resolveRtlEnabled)(rtlEnabled, this.config);
    }
  }, {
    key: "isServerSide",
    get: function () {
      return !(0, _window.hasWindow)();
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return Scrollable;
}(_inferno2.InfernoWrapperComponent);
Scrollable.defaultProps = _scrollable_props.ScrollableProps;
