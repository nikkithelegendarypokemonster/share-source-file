/**
* DevExtreme (cjs/renovation/ui/pager/pages/page_index_selector.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.PageIndexSelectorProps = exports.PageIndexSelector = exports.PAGER_BUTTON_DISABLE_CLASS = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _light_button = require("../common/light_button");
var _large = require("./large");
var _small = require("./small");
var _pager_props = require("../common/pager_props");
var _config_context = require("../../../common/config_context");
var _message = _interopRequireDefault(require("../../../../localization/message"));
const _excluded = ["hasKnownLastPage", "isLargeDisplayMode", "maxPagesCount", "pageCount", "pageIndex", "pageIndexChange", "pagesCountText", "showNavigationButtons", "totalCount"];
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
const PAGER_NAVIGATE_BUTTON = 'dx-navigate-button';
const PAGER_PREV_BUTTON_CLASS = 'dx-prev-button';
const PAGER_NEXT_BUTTON_CLASS = 'dx-next-button';
const PAGER_BUTTON_DISABLE_CLASS = exports.PAGER_BUTTON_DISABLE_CLASS = 'dx-button-disable';
const getNextButtonLabel = () => _message.default.getFormatter('dxPager-nextPage')();
const getPrevButtonLabel = () => _message.default.getFormatter('dxPager-prevPage')();
const classNames = {
  nextEnabledClass: "".concat(PAGER_NAVIGATE_BUTTON, " ").concat(PAGER_NEXT_BUTTON_CLASS),
  prevEnabledClass: "".concat(PAGER_NAVIGATE_BUTTON, " ").concat(PAGER_PREV_BUTTON_CLASS),
  nextDisabledClass: "".concat(PAGER_BUTTON_DISABLE_CLASS, " ").concat(PAGER_NAVIGATE_BUTTON, " ").concat(PAGER_NEXT_BUTTON_CLASS),
  prevDisabledClass: "".concat(PAGER_BUTTON_DISABLE_CLASS, " ").concat(PAGER_NAVIGATE_BUTTON, " ").concat(PAGER_PREV_BUTTON_CLASS)
};
const reverseDirections = {
  next: 'prev',
  prev: 'next'
};
const viewFunction = _ref => {
  let {
    nextButtonProps,
    pageIndexChange,
    prevButtonProps,
    props: {
      isLargeDisplayMode,
      maxPagesCount,
      pageCount,
      pageIndex,
      pagesCountText
    },
    renderNextButton,
    renderPrevButton
  } = _ref;
  return (0, _inferno.createFragment)([renderPrevButton && (0, _inferno.createComponentVNode)(2, _light_button.LightButton, {
    "label": getPrevButtonLabel(),
    "className": prevButtonProps.className,
    "tabIndex": prevButtonProps.tabIndex,
    "onClick": prevButtonProps.navigate
  }), isLargeDisplayMode && (0, _inferno.createComponentVNode)(2, _large.PagesLarge, {
    "maxPagesCount": maxPagesCount,
    "pageCount": pageCount,
    "pageIndex": pageIndex,
    "pageIndexChange": pageIndexChange
  }), !isLargeDisplayMode && (0, _inferno.createComponentVNode)(2, _small.PagesSmall, {
    "pageCount": pageCount,
    "pageIndex": pageIndex,
    "pageIndexChange": pageIndexChange,
    "pagesCountText": pagesCountText
  }), renderNextButton && (0, _inferno.createComponentVNode)(2, _light_button.LightButton, {
    "label": getNextButtonLabel(),
    "className": nextButtonProps.className,
    "tabIndex": nextButtonProps.tabIndex,
    "onClick": nextButtonProps.navigate
  })], 0);
};
exports.viewFunction = viewFunction;
function getIncrement(direction) {
  return direction === 'next' ? +1 : -1;
}
const PageIndexSelectorProps = exports.PageIndexSelectorProps = {
  isLargeDisplayMode: true
};
const PageIndexSelectorPropsType = Object.defineProperties({}, {
  pageIndex: {
    get: function () {
      return _pager_props.InternalPagerProps.pageIndex;
    },
    configurable: true,
    enumerable: true
  },
  maxPagesCount: {
    get: function () {
      return _pager_props.InternalPagerProps.maxPagesCount;
    },
    configurable: true,
    enumerable: true
  },
  pageCount: {
    get: function () {
      return _pager_props.InternalPagerProps.pageCount;
    },
    configurable: true,
    enumerable: true
  },
  hasKnownLastPage: {
    get: function () {
      return _pager_props.InternalPagerProps.hasKnownLastPage;
    },
    configurable: true,
    enumerable: true
  },
  showNavigationButtons: {
    get: function () {
      return _pager_props.InternalPagerProps.showNavigationButtons;
    },
    configurable: true,
    enumerable: true
  },
  totalCount: {
    get: function () {
      return _pager_props.InternalPagerProps.totalCount;
    },
    configurable: true,
    enumerable: true
  },
  isLargeDisplayMode: {
    get: function () {
      return PageIndexSelectorProps.isLargeDisplayMode;
    },
    configurable: true,
    enumerable: true
  }
});
let PageIndexSelector = exports.PageIndexSelector = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(PageIndexSelector, _BaseInfernoComponent);
  function PageIndexSelector(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    _this.pageIndexChange = _this.pageIndexChange.bind(_assertThisInitialized(_this));
    _this.getButtonProps = _this.getButtonProps.bind(_assertThisInitialized(_this));
    _this.canNavigateToPage = _this.canNavigateToPage.bind(_assertThisInitialized(_this));
    _this.getNextPageIndex = _this.getNextPageIndex.bind(_assertThisInitialized(_this));
    _this.canNavigateTo = _this.canNavigateTo.bind(_assertThisInitialized(_this));
    _this.navigateToPage = _this.navigateToPage.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = PageIndexSelector.prototype;
  _proto.pageIndexChange = function pageIndexChange(pageIndex) {
    if (this.canNavigateToPage(pageIndex)) {
      this.props.pageIndexChange(pageIndex);
    }
  };
  _proto.getButtonProps = function getButtonProps(direction) {
    var _this$config;
    const rtlAwareDirection = (_this$config = this.config) !== null && _this$config !== void 0 && _this$config.rtlEnabled ? reverseDirections[direction] : direction;
    const canNavigate = this.canNavigateTo(rtlAwareDirection);
    const className = classNames["".concat(direction).concat(canNavigate ? 'Enabled' : 'Disabled', "Class")];
    return {
      className,
      tabIndex: canNavigate ? 0 : -1,
      navigate: () => this.navigateToPage(rtlAwareDirection)
    };
  };
  _proto.canNavigateToPage = function canNavigateToPage(pageIndex) {
    if (!this.props.hasKnownLastPage) {
      return pageIndex >= 0;
    }
    return pageIndex >= 0 && pageIndex <= this.props.pageCount - 1;
  };
  _proto.getNextPageIndex = function getNextPageIndex(direction) {
    return this.props.pageIndex + getIncrement(direction);
  };
  _proto.canNavigateTo = function canNavigateTo(direction) {
    return this.canNavigateToPage(this.getNextPageIndex(direction));
  };
  _proto.navigateToPage = function navigateToPage(direction) {
    this.pageIndexChange(this.getNextPageIndex(direction));
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.context[_config_context.ConfigContext.id] !== context[_config_context.ConfigContext.id] || this.props['hasKnownLastPage'] !== nextProps['hasKnownLastPage'] || this.props['pageCount'] !== nextProps['pageCount'] || this.props['pageIndex'] !== nextProps['pageIndex'] || this.props['pageIndexChange'] !== nextProps['pageIndexChange']) {
      this.__getterCache['prevButtonProps'] = undefined;
    }
    if (this.context[_config_context.ConfigContext.id] !== context[_config_context.ConfigContext.id] || this.props['hasKnownLastPage'] !== nextProps['hasKnownLastPage'] || this.props['pageCount'] !== nextProps['pageCount'] || this.props['pageIndex'] !== nextProps['pageIndex'] || this.props['pageIndexChange'] !== nextProps['pageIndexChange']) {
      this.__getterCache['nextButtonProps'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      config: this.config,
      pageIndexChange: this.pageIndexChange,
      renderPrevButton: this.renderPrevButton,
      renderNextButton: this.renderNextButton,
      prevButtonProps: this.prevButtonProps,
      nextButtonProps: this.nextButtonProps,
      restAttributes: this.restAttributes
    });
  };
  _createClass(PageIndexSelector, [{
    key: "config",
    get: function () {
      if (this.context[_config_context.ConfigContext.id]) {
        return this.context[_config_context.ConfigContext.id];
      }
      return _config_context.ConfigContext.defaultValue;
    }
  }, {
    key: "renderPrevButton",
    get: function () {
      const {
        isLargeDisplayMode,
        showNavigationButtons
      } = this.props;
      return !isLargeDisplayMode || showNavigationButtons;
    }
  }, {
    key: "renderNextButton",
    get: function () {
      return this.renderPrevButton || !this.props.hasKnownLastPage;
    }
  }, {
    key: "prevButtonProps",
    get: function () {
      if (this.__getterCache['prevButtonProps'] !== undefined) {
        return this.__getterCache['prevButtonProps'];
      }
      return this.__getterCache['prevButtonProps'] = (() => {
        return this.getButtonProps('prev');
      })();
    }
  }, {
    key: "nextButtonProps",
    get: function () {
      if (this.__getterCache['nextButtonProps'] !== undefined) {
        return this.__getterCache['nextButtonProps'];
      }
      return this.__getterCache['nextButtonProps'] = (() => {
        return this.getButtonProps('next');
      })();
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return PageIndexSelector;
}(_inferno2.BaseInfernoComponent);
PageIndexSelector.defaultProps = PageIndexSelectorPropsType;
