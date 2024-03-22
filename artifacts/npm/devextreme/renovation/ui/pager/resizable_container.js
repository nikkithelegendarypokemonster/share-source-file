/**
* DevExtreme (renovation/ui/pager/resizable_container.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.ResizableContainerProps = exports.ResizableContainer = void 0;
exports.calculateInfoTextVisible = calculateInfoTextVisible;
exports.calculateLargeDisplayMode = calculateLargeDisplayMode;
exports.viewFunction = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _resize_callbacks = _interopRequireDefault(require("../../../core/utils/resize_callbacks"));
var _get_element_width = require("./utils/get_element_width");
var _type = require("../../../core/utils/type");
const _excluded = ["contentTemplate", "pagerProps"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
    contentAttributes,
    infoTextRef,
    infoTextVisible,
    isLargeDisplayMode,
    pageSizesRef,
    pagesRef,
    parentRef,
    props: {
      contentTemplate: Content
    }
  } = _ref;
  return Content(_extends({
    rootElementRef: parentRef,
    pageSizesRef: pageSizesRef,
    infoTextRef: infoTextRef,
    pagesRef: pagesRef,
    infoTextVisible: infoTextVisible,
    isLargeDisplayMode: isLargeDisplayMode
  }, contentAttributes));
};
exports.viewFunction = viewFunction;
function calculateLargeDisplayMode(_ref2) {
  let {
    pageSizes: pageSizesWidth,
    pages: pagesWidth,
    parent: parentWidth
  } = _ref2;
  return parentWidth - (pageSizesWidth + pagesWidth) > 0;
}
function calculateInfoTextVisible(_ref3) {
  let {
    info: infoWidth,
    pageSizes: pageSizesWidth,
    pages: pagesWidth,
    parent: parentWidth
  } = _ref3;
  const minimalWidth = pageSizesWidth + pagesWidth + infoWidth;
  return parentWidth - minimalWidth > 0;
}
function getElementsWidth(_ref4) {
  let {
    info,
    pageSizes,
    pages,
    parent
  } = _ref4;
  const parentWidth = (0, _get_element_width.getElementContentWidth)(parent);
  const pageSizesWidth = (0, _get_element_width.getElementWidth)(pageSizes);
  const infoWidth = (0, _get_element_width.getElementWidth)(info);
  const pagesHtmlWidth = (0, _get_element_width.getElementWidth)(pages);
  return {
    parent: parentWidth,
    pageSizes: pageSizesWidth,
    info: infoWidth + (0, _get_element_width.getElementStyle)('marginLeft', info) + (0, _get_element_width.getElementStyle)('marginRight', info),
    pages: pagesHtmlWidth
  };
}
const ResizableContainerProps = exports.ResizableContainerProps = {};
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let ResizableContainer = exports.ResizableContainer = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(ResizableContainer, _InfernoComponent);
  function ResizableContainer(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.parentRef = (0, _inferno.createRef)();
    _this.pageSizesRef = (0, _inferno.createRef)();
    _this.infoTextRef = (0, _inferno.createRef)();
    _this.pagesRef = (0, _inferno.createRef)();
    _this.actualIsLargeDisplayMode = true;
    _this.actualInfoTextVisible = true;
    _this.state = {
      infoTextVisible: true,
      isLargeDisplayMode: true
    };
    _this.subscribeToResize = _this.subscribeToResize.bind(_assertThisInitialized(_this));
    _this.effectUpdateChildProps = _this.effectUpdateChildProps.bind(_assertThisInitialized(_this));
    _this.updateAdaptivityProps = _this.updateAdaptivityProps.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = ResizableContainer.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.subscribeToResize, [this.state.infoTextVisible, this.state.isLargeDisplayMode]), new _inferno2.InfernoEffect(this.effectUpdateChildProps, [this.props, this.state.infoTextVisible, this.state.isLargeDisplayMode, this.props.pagerProps, this.props.contentTemplate])];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$, _this$_effects$2;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.state.infoTextVisible, this.state.isLargeDisplayMode]);
    (_this$_effects$2 = this._effects[1]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props, this.state.infoTextVisible, this.state.isLargeDisplayMode, this.props.pagerProps, this.props.contentTemplate]);
  };
  _proto.subscribeToResize = function subscribeToResize() {
    const callback = () => {
      this.parentWidth > 0 && this.updateAdaptivityProps();
    };
    _resize_callbacks.default.add(callback);
    return () => {
      _resize_callbacks.default.remove(callback);
    };
  };
  _proto.effectUpdateChildProps = function effectUpdateChildProps() {
    if (this.parentWidth > 0) {
      this.updateAdaptivityProps();
    }
  };
  _proto.updateAdaptivityProps = function updateAdaptivityProps() {
    const currentElementsWidth = getElementsWidth({
      parent: this.parentRef.current,
      pageSizes: this.pageSizesRef.current,
      info: this.infoTextRef.current,
      pages: this.pagesRef.current
    });
    if (this.actualInfoTextVisible !== this.state.infoTextVisible || this.actualIsLargeDisplayMode !== this.state.isLargeDisplayMode) {
      return;
    }
    const isEmpty = !(0, _type.isDefined)(this.elementsWidth);
    if (isEmpty) {
      this.elementsWidth = {};
    }
    if (isEmpty || this.state.isLargeDisplayMode) {
      this.elementsWidth.pageSizes = currentElementsWidth.pageSizes;
      this.elementsWidth.pages = currentElementsWidth.pages;
    }
    if (isEmpty || this.state.infoTextVisible) {
      this.elementsWidth.info = currentElementsWidth.info;
    }
    this.actualIsLargeDisplayMode = calculateLargeDisplayMode(_extends({
      parent: currentElementsWidth.parent
    }, {
      pageSizes: this.elementsWidth.pageSizes,
      pages: this.elementsWidth.pages
    }));
    this.actualInfoTextVisible = calculateInfoTextVisible(_extends({}, currentElementsWidth, {
      info: this.elementsWidth.info
    }));
    this.setState(__state_argument => ({
      infoTextVisible: this.actualInfoTextVisible
    }));
    this.setState(__state_argument => ({
      isLargeDisplayMode: this.actualIsLargeDisplayMode
    }));
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        contentTemplate: getTemplate(props.contentTemplate)
      }),
      infoTextVisible: this.state.infoTextVisible,
      isLargeDisplayMode: this.state.isLargeDisplayMode,
      parentRef: this.parentRef,
      pageSizesRef: this.pageSizesRef,
      infoTextRef: this.infoTextRef,
      pagesRef: this.pagesRef,
      contentAttributes: this.contentAttributes,
      parentWidth: this.parentWidth,
      updateAdaptivityProps: this.updateAdaptivityProps,
      restAttributes: this.restAttributes
    });
  };
  _createClass(ResizableContainer, [{
    key: "contentAttributes",
    get: function () {
      const {
        className,
        displayMode,
        gridCompatibility,
        hasKnownLastPage,
        infoText,
        label,
        lightModeEnabled,
        maxPagesCount,
        onKeyDown,
        pageCount,
        pageIndex,
        pageIndexChange,
        pageSize,
        pageSizeChange,
        pageSizes,
        pagesCountText,
        pagesNavigatorVisible,
        rtlEnabled,
        showInfo,
        showNavigationButtons,
        showPageSizes,
        totalCount,
        visible
      } = this.props.pagerProps;
      return _extends({}, this.restAttributes, {
        pageSize,
        pageIndex,
        pageIndexChange,
        pageSizeChange,
        gridCompatibility,
        className,
        showInfo,
        infoText,
        lightModeEnabled,
        displayMode,
        maxPagesCount,
        pageCount,
        pagesCountText,
        visible,
        hasKnownLastPage,
        pagesNavigatorVisible,
        showPageSizes,
        pageSizes,
        rtlEnabled,
        showNavigationButtons,
        totalCount,
        onKeyDown,
        label
      });
    }
  }, {
    key: "parentWidth",
    get: function () {
      return this.parentRef.current ? (0, _get_element_width.getElementWidth)(this.parentRef.current) : 0;
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return ResizableContainer;
}(_inferno2.InfernoComponent);
ResizableContainer.defaultProps = ResizableContainerProps;
