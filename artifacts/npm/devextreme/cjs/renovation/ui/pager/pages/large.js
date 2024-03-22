/**
* DevExtreme (cjs/renovation/ui/pager/pages/large.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.PagesLarge = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _page = require("./page");
var _pager_props = require("../common/pager_props");
var _config_context = require("../../../common/config_context");
const _excluded = ["pageIndexes"],
  _excluded2 = ["maxPagesCount", "pageCount", "pageIndex", "pageIndexChange"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const PAGER_PAGE_SEPARATOR_CLASS = 'dx-separator';
const viewFunction = _ref => {
  let {
    pages
  } = _ref;
  const PagesMarkup = pages.map(_ref2 => {
    let {
      key,
      pageProps
    } = _ref2;
    return pageProps ? (0, _inferno.createComponentVNode)(2, _page.Page, {
      "index": pageProps.index,
      "selected": pageProps.selected,
      "onClick": pageProps.onClick
    }, key) : (0, _inferno.createVNode)(1, "div", PAGER_PAGE_SEPARATOR_CLASS, ". . .", 16, null, key);
  });
  return (0, _inferno.createFragment)(PagesMarkup, 0);
};
exports.viewFunction = viewFunction;
const PAGES_LIMITER = 4;
function getDelimiterType(startIndex, slidingWindowSize, pageCount) {
  if (startIndex === 1) {
    return 'high';
  }
  if (startIndex + slidingWindowSize === pageCount - 1) {
    return 'low';
  }
  return 'both';
}
function createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter) {
  let pageIndexes = [];
  let indexesForReuse = [];
  switch (delimiter) {
    case 'none':
      pageIndexes = [...slidingWindowIndexes];
      break;
    case 'both':
      pageIndexes = [0, 'low', ...slidingWindowIndexes, 'high', pageCount - 1];
      indexesForReuse = slidingWindowIndexes.slice(1, -1);
      break;
    case 'high':
      pageIndexes = [0, ...slidingWindowIndexes, 'high', pageCount - 1];
      indexesForReuse = slidingWindowIndexes.slice(0, -1);
      break;
    case 'low':
      pageIndexes = [0, 'low', ...slidingWindowIndexes, pageCount - 1];
      indexesForReuse = slidingWindowIndexes.slice(1);
      break;
  }
  return {
    slidingWindowIndexes,
    indexesForReuse,
    pageIndexes
  };
}
function createPageIndexes(startIndex, slidingWindowSize, pageCount, delimiter) {
  const slidingWindowIndexes = [];
  for (let i = 0; i < slidingWindowSize; i += 1) {
    slidingWindowIndexes.push(i + startIndex);
  }
  return createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter);
}
const PagesLargePropsType = Object.defineProperties({}, {
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
  }
});
let PagesLarge = exports.PagesLarge = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(PagesLarge, _BaseInfernoComponent);
  function PagesLarge(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.canReuseSlidingWindow = _this.canReuseSlidingWindow.bind(_assertThisInitialized(_this));
    _this.generatePageIndexes = _this.generatePageIndexes.bind(_assertThisInitialized(_this));
    _this.isSlidingWindowMode = _this.isSlidingWindowMode.bind(_assertThisInitialized(_this));
    _this.onPageClick = _this.onPageClick.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = PagesLarge.prototype;
  _proto.canReuseSlidingWindow = function canReuseSlidingWindow(currentPageCount, pageIndex) {
    const {
      indexesForReuse
    } = this.slidingWindowState;
    const lastPageIsFartherThanWindow = indexesForReuse.slice(-1)[0] < currentPageCount - 1;
    const pageIndexExistInIndexes = indexesForReuse.includes(pageIndex);
    return lastPageIsFartherThanWindow && pageIndexExistInIndexes;
  };
  _proto.generatePageIndexes = function generatePageIndexes() {
    const {
      pageCount,
      pageIndex
    } = this.props;
    let startIndex = 0;
    const {
      slidingWindowIndexes
    } = this.slidingWindowState;
    if (pageIndex === slidingWindowIndexes[0]) {
      startIndex = pageIndex - 1;
    } else if (pageIndex === slidingWindowIndexes[slidingWindowIndexes.length - 1]) {
      startIndex = pageIndex + 2 - PAGES_LIMITER;
    } else if (pageIndex < PAGES_LIMITER) {
      startIndex = 1;
    } else if (pageIndex >= pageCount - PAGES_LIMITER) {
      startIndex = pageCount - PAGES_LIMITER - 1;
    } else {
      startIndex = pageIndex - 1;
    }
    const slidingWindowSize = PAGES_LIMITER;
    const delimiter = getDelimiterType(startIndex, slidingWindowSize, pageCount);
    const _createPageIndexes = createPageIndexes(startIndex, slidingWindowSize, pageCount, delimiter),
      {
        pageIndexes
      } = _createPageIndexes,
      slidingWindowState = _objectWithoutPropertiesLoose(_createPageIndexes, _excluded);
    this.slidingWindowStateHolder = slidingWindowState;
    return pageIndexes;
  };
  _proto.isSlidingWindowMode = function isSlidingWindowMode() {
    const {
      maxPagesCount,
      pageCount
    } = this.props;
    return pageCount <= PAGES_LIMITER || pageCount <= maxPagesCount;
  };
  _proto.onPageClick = function onPageClick(pageIndex) {
    this.props.pageIndexChange(pageIndex);
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      config: this.config,
      pageIndexes: this.pageIndexes,
      pages: this.pages,
      restAttributes: this.restAttributes
    });
  };
  _createClass(PagesLarge, [{
    key: "config",
    get: function () {
      if (this.context[_config_context.ConfigContext.id]) {
        return this.context[_config_context.ConfigContext.id];
      }
      return _config_context.ConfigContext.defaultValue;
    }
  }, {
    key: "slidingWindowState",
    get: function () {
      const slidingWindowState = this.slidingWindowStateHolder;
      if (!slidingWindowState) {
        return {
          indexesForReuse: [],
          slidingWindowIndexes: []
        };
      }
      return slidingWindowState;
    }
  }, {
    key: "pageIndexes",
    get: function () {
      const {
        pageCount
      } = this.props;
      if (this.isSlidingWindowMode()) {
        return createPageIndexes(0, pageCount, pageCount, 'none').pageIndexes;
      }
      if (this.canReuseSlidingWindow(pageCount, this.props.pageIndex)) {
        const {
          slidingWindowIndexes
        } = this.slidingWindowState;
        const delimiter = getDelimiterType(slidingWindowIndexes[0], PAGES_LIMITER, pageCount);
        return createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter).pageIndexes;
      }
      return this.generatePageIndexes();
    }
  }, {
    key: "pages",
    get: function () {
      var _this$config;
      const {
        pageIndex
      } = this.props;
      const createPage = index => {
        const pagerProps = index === 'low' || index === 'high' ? null : {
          index,
          onClick: () => this.onPageClick(index),
          selected: pageIndex === index
        };
        return {
          key: index.toString(),
          pageProps: pagerProps
        };
      };
      const rtlPageIndexes = (_this$config = this.config) !== null && _this$config !== void 0 && _this$config.rtlEnabled ? [...this.pageIndexes].reverse() : this.pageIndexes;
      return rtlPageIndexes.map(index => createPage(index));
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded2);
      return restProps;
    }
  }]);
  return PagesLarge;
}(_inferno2.BaseInfernoComponent);
PagesLarge.defaultProps = PagesLargePropsType;
