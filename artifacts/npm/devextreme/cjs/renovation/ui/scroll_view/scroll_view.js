/**
* DevExtreme (cjs/renovation/ui/scroll_view/scroll_view.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.ScrollView = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _type = require("../../../core/utils/type");
var _scrollable = require("./scrollable");
var _scrollview_props = require("./common/scrollview_props");
var _load_panel = require("./internal/load_panel");
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
    props: {
      aria,
      bounceEnabled,
      children,
      direction,
      disabled,
      height,
      inertiaEnabled,
      onBounce,
      onEnd,
      onPullDown,
      onReachBottom,
      onScroll,
      onStart,
      onUpdated,
      pullDownEnabled,
      pulledDownText,
      pullingDownText,
      reachBottomText,
      refreshStrategy,
      refreshingText,
      rtlEnabled,
      scrollByContent,
      scrollByThumb,
      showScrollbar,
      useKeyboard,
      useNative,
      useSimulatedScrollbar,
      visible,
      width
    },
    reachBottomEnabled,
    restAttributes,
    scrollableRef
  } = viewModel;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _scrollable.Scrollable, _extends({
    "useNative": useNative,
    "classes": "dx-scrollview",
    "aria": aria,
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
    "onScroll": onScroll,
    "onUpdated": onUpdated,
    "onPullDown": onPullDown,
    "onReachBottom": onReachBottom,
    "refreshStrategy": refreshStrategy,
    "pulledDownText": pulledDownText,
    "pullingDownText": pullingDownText,
    "refreshingText": refreshingText,
    "reachBottomText": reachBottomText,
    "forceGeneratePockets": true,
    "needScrollViewContentWrapper": true,
    "useSimulatedScrollbar": useSimulatedScrollbar,
    "inertiaEnabled": inertiaEnabled,
    "bounceEnabled": bounceEnabled,
    "scrollByContent": scrollByContent,
    "useKeyboard": useKeyboard,
    "onStart": onStart,
    "onEnd": onEnd,
    "onBounce": onBounce,
    "loadPanelTemplate": _load_panel.ScrollViewLoadPanel
  }, restAttributes, {
    children: children
  }), null, scrollableRef));
};
exports.viewFunction = viewFunction;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let ScrollView = exports.ScrollView = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(ScrollView, _InfernoWrapperCompon);
  function ScrollView(props) {
    var _this;
    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.scrollableRef = (0, _inferno.createRef)();
    _this.state = {
      forceReachBottom: undefined
    };
    _this.release = _this.release.bind(_assertThisInitialized(_this));
    _this.refresh = _this.refresh.bind(_assertThisInitialized(_this));
    _this.content = _this.content.bind(_assertThisInitialized(_this));
    _this.container = _this.container.bind(_assertThisInitialized(_this));
    _this.scrollBy = _this.scrollBy.bind(_assertThisInitialized(_this));
    _this.scrollTo = _this.scrollTo.bind(_assertThisInitialized(_this));
    _this.scrollToElement = _this.scrollToElement.bind(_assertThisInitialized(_this));
    _this.scrollHeight = _this.scrollHeight.bind(_assertThisInitialized(_this));
    _this.scrollWidth = _this.scrollWidth.bind(_assertThisInitialized(_this));
    _this.scrollOffset = _this.scrollOffset.bind(_assertThisInitialized(_this));
    _this.scrollTop = _this.scrollTop.bind(_assertThisInitialized(_this));
    _this.scrollLeft = _this.scrollLeft.bind(_assertThisInitialized(_this));
    _this.clientHeight = _this.clientHeight.bind(_assertThisInitialized(_this));
    _this.clientWidth = _this.clientWidth.bind(_assertThisInitialized(_this));
    _this.toggleLoading = _this.toggleLoading.bind(_assertThisInitialized(_this));
    _this.startLoading = _this.startLoading.bind(_assertThisInitialized(_this));
    _this.finishLoading = _this.finishLoading.bind(_assertThisInitialized(_this));
    _this.updateHandler = _this.updateHandler.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = ScrollView.prototype;
  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };
  _proto.release = function release(preventScrollBottom) {
    if (preventScrollBottom !== undefined) {
      this.toggleLoading(!preventScrollBottom);
    }
    this.scrollableRef.current.release();
  };
  _proto.refresh = function refresh() {
    if (this.props.pullDownEnabled) {
      this.scrollableRef.current.refresh();
    }
  };
  _proto.content = function content() {
    return this.scrollableRef.current.content();
  };
  _proto.container = function container() {
    return this.scrollableRef.current.container();
  };
  _proto.scrollBy = function scrollBy(distance) {
    this.scrollableRef.current.scrollBy(distance);
  };
  _proto.scrollTo = function scrollTo(targetLocation) {
    this.scrollableRef.current.scrollTo(targetLocation);
  };
  _proto.scrollToElement = function scrollToElement(element, offset) {
    this.scrollableRef.current.scrollToElement(element, offset);
  };
  _proto.scrollHeight = function scrollHeight() {
    return this.scrollableRef.current.scrollHeight();
  };
  _proto.scrollWidth = function scrollWidth() {
    return this.scrollableRef.current.scrollWidth();
  };
  _proto.scrollOffset = function scrollOffset() {
    return this.scrollableRef.current.scrollOffset();
  };
  _proto.scrollTop = function scrollTop() {
    return this.scrollableRef.current.scrollTop();
  };
  _proto.scrollLeft = function scrollLeft() {
    return this.scrollableRef.current.scrollLeft();
  };
  _proto.clientHeight = function clientHeight() {
    return this.scrollableRef.current.clientHeight();
  };
  _proto.clientWidth = function clientWidth() {
    return this.scrollableRef.current.clientWidth();
  };
  _proto.toggleLoading = function toggleLoading(showOrHide) {
    this.setState(__state_argument => ({
      forceReachBottom: showOrHide
    }));
  };
  _proto.startLoading = function startLoading() {
    this.scrollableRef.current.startLoading();
  };
  _proto.finishLoading = function finishLoading() {
    this.scrollableRef.current.finishLoading();
  };
  _proto.updateHandler = function updateHandler() {
    this.scrollableRef.current.updateHandler();
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        loadPanelTemplate: getTemplate(props.loadPanelTemplate)
      }),
      forceReachBottom: this.state.forceReachBottom,
      scrollableRef: this.scrollableRef,
      reachBottomEnabled: this.reachBottomEnabled,
      restAttributes: this.restAttributes
    });
  };
  _createClass(ScrollView, [{
    key: "reachBottomEnabled",
    get: function () {
      if ((0, _type.isDefined)(this.state.forceReachBottom)) {
        return this.state.forceReachBottom;
      }
      return this.props.reachBottomEnabled;
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return ScrollView;
}(_inferno2.InfernoWrapperComponent);
ScrollView.defaultProps = _scrollview_props.ScrollViewProps;
