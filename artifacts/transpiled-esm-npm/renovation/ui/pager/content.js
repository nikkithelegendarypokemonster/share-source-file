"use strict";

exports.viewFunction = exports.PagerContentProps = exports.PagerContent = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _info = require("./info");
var _page_index_selector = require("./pages/page_index_selector");
var _selector = require("./page_size/selector");
var _consts = require("./common/consts");
var _pager_props = require("./common/pager_props");
var _combine_classes = require("../../utils/combine_classes");
var _widget = require("../common/widget");
var _accessibility = require("../../../ui/shared/accessibility");
var _keyboard_action_context = require("./common/keyboard_action_context");
const _excluded = ["className", "displayMode", "gridCompatibility", "hasKnownLastPage", "infoText", "infoTextRef", "infoTextVisible", "isLargeDisplayMode", "label", "lightModeEnabled", "maxPagesCount", "onKeyDown", "pageCount", "pageIndex", "pageIndexChange", "pageSize", "pageSizeChange", "pageSizes", "pageSizesRef", "pagesCountText", "pagesNavigatorVisible", "pagesRef", "rootElementRef", "rtlEnabled", "showInfo", "showNavigationButtons", "showPageSizes", "totalCount", "visible"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    aria,
    classes,
    infoVisible,
    isLargeDisplayMode,
    pageIndexSelectorVisible,
    pagesContainerVisibility,
    pagesContainerVisible,
    props: {
      hasKnownLastPage,
      infoText,
      infoTextRef,
      maxPagesCount,
      pageCount,
      pageIndex,
      pageIndexChange,
      pageSize,
      pageSizeChange,
      pageSizes,
      pageSizesRef,
      pagesCountText,
      pagesRef,
      rtlEnabled,
      showNavigationButtons,
      showPageSizes,
      totalCount,
      visible
    },
    restAttributes,
    widgetRootElementRef
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
    "rootElementRef": widgetRootElementRef,
    "rtlEnabled": rtlEnabled,
    "classes": classes,
    "visible": visible,
    "aria": aria
  }, restAttributes, {
    children: [showPageSizes && (0, _inferno.createComponentVNode)(2, _selector.PageSizeSelector, {
      "rootElementRef": pageSizesRef,
      "isLargeDisplayMode": isLargeDisplayMode,
      "pageSize": pageSize,
      "pageSizeChange": pageSizeChange,
      "pageSizes": pageSizes
    }), pagesContainerVisible && (0, _inferno.createVNode)(1, "div", _consts.PAGER_PAGES_CLASS, [infoVisible && (0, _inferno.createComponentVNode)(2, _info.InfoText, {
      "rootElementRef": infoTextRef,
      "infoText": infoText,
      "pageCount": pageCount,
      "pageIndex": pageIndex,
      "totalCount": totalCount
    }), pageIndexSelectorVisible && (0, _inferno.createVNode)(1, "div", _consts.PAGER_PAGE_INDEXES_CLASS, (0, _inferno.createComponentVNode)(2, _page_index_selector.PageIndexSelector, {
      "hasKnownLastPage": hasKnownLastPage,
      "isLargeDisplayMode": isLargeDisplayMode,
      "maxPagesCount": maxPagesCount,
      "pageCount": pageCount,
      "pageIndex": pageIndex,
      "pageIndexChange": pageIndexChange,
      "pagesCountText": pagesCountText,
      "showNavigationButtons": showNavigationButtons,
      "totalCount": totalCount
    }), 2, null, null, pagesRef)], 0, {
      "style": (0, _inferno2.normalizeStyles)({
        visibility: pagesContainerVisibility
      })
    })]
  })));
};
exports.viewFunction = viewFunction;
const PagerContentProps = exports.PagerContentProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_pager_props.InternalPagerProps), Object.getOwnPropertyDescriptors({
  infoTextVisible: true,
  isLargeDisplayMode: true
})));
let PagerContent = exports.PagerContent = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(PagerContent, _InfernoComponent);
  function PagerContent(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.widgetRootElementRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.setRootElementRef = _this.setRootElementRef.bind(_assertThisInitialized(_this));
    _this.createFakeInstance = _this.createFakeInstance.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = PagerContent.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.setRootElementRef, [])];
  };
  _proto.getChildContext = function getChildContext() {
    return _extends({}, this.context, {
      [_keyboard_action_context.KeyboardActionContext.id]: this.keyboardAction || _keyboard_action_context.KeyboardActionContext.defaultValue
    });
  };
  _proto.setRootElementRef = function setRootElementRef() {
    const {
      rootElementRef
    } = this.props;
    if (rootElementRef) {
      rootElementRef.current = this.widgetRootElementRef.current;
    }
  };
  _proto.createFakeInstance = function createFakeInstance() {
    return {
      option: () => false,
      element: () => this.widgetRootElementRef.current,
      _createActionByOption: () => e => {
        var _this$props$onKeyDown, _this$props;
        (_this$props$onKeyDown = (_this$props = this.props).onKeyDown) === null || _this$props$onKeyDown === void 0 ? void 0 : _this$props$onKeyDown.call(_this$props, e);
      }
    };
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoComponent.prototype.componentWillUpdate.call(this);
    if (this.props['onKeyDown'] !== nextProps['onKeyDown']) {
      this.__getterCache['keyboardAction'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      widgetRootElementRef: this.widgetRootElementRef,
      keyboardAction: this.keyboardAction,
      infoVisible: this.infoVisible,
      pageIndexSelectorVisible: this.pageIndexSelectorVisible,
      pagesContainerVisible: this.pagesContainerVisible,
      pagesContainerVisibility: this.pagesContainerVisibility,
      isLargeDisplayMode: this.isLargeDisplayMode,
      classes: this.classes,
      aria: this.aria,
      restAttributes: this.restAttributes
    });
  };
  _createClass(PagerContent, [{
    key: "keyboardAction",
    get: function () {
      if (this.__getterCache['keyboardAction'] !== undefined) {
        return this.__getterCache['keyboardAction'];
      }
      return this.__getterCache['keyboardAction'] = (() => {
        return {
          registerKeyboardAction: (element, action) => {
            const fakePagerInstance = this.createFakeInstance();
            return (0, _accessibility.registerKeyboardAction)('pager', fakePagerInstance, element, undefined, action);
          }
        };
      })();
    }
  }, {
    key: "infoVisible",
    get: function () {
      const {
        infoTextVisible,
        showInfo
      } = this.props;
      return showInfo && infoTextVisible;
    }
  }, {
    key: "pageIndexSelectorVisible",
    get: function () {
      return this.props.pageSize !== 0;
    }
  }, {
    key: "normalizedDisplayMode",
    get: function () {
      const {
        displayMode,
        lightModeEnabled
      } = this.props;
      if (displayMode === 'adaptive' && lightModeEnabled !== undefined) {
        return lightModeEnabled ? 'compact' : 'full';
      }
      return displayMode;
    }
  }, {
    key: "pagesContainerVisible",
    get: function () {
      return !!this.props.pagesNavigatorVisible && this.props.pageCount > 0;
    }
  }, {
    key: "pagesContainerVisibility",
    get: function () {
      if (this.props.pagesNavigatorVisible === 'auto' && this.props.pageCount === 1 && this.props.hasKnownLastPage) {
        return 'hidden';
      }
      return undefined;
    }
  }, {
    key: "isLargeDisplayMode",
    get: function () {
      const displayMode = this.normalizedDisplayMode;
      let result = false;
      if (displayMode === 'adaptive') {
        result = this.props.isLargeDisplayMode;
      } else {
        result = displayMode === 'full';
      }
      return result;
    }
  }, {
    key: "classes",
    get: function () {
      const classesMap = {
        ["".concat(this.props.className)]: !!this.props.className,
        [_consts.PAGER_CLASS]: true,
        [_consts.LIGHT_MODE_CLASS]: !this.isLargeDisplayMode
      };
      return (0, _combine_classes.combineClasses)(classesMap);
    }
  }, {
    key: "aria",
    get: function () {
      return {
        role: 'navigation',
        label: this.props.label
      };
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props2 = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props2, _excluded);
      return restProps;
    }
  }]);
  return PagerContent;
}(_inferno2.InfernoComponent);
PagerContent.defaultProps = PagerContentProps;