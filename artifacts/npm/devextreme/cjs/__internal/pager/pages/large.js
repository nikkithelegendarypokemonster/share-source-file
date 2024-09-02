/**
* DevExtreme (cjs/__internal/pager/pages/large.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PagesLarge = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _config_context = require("../../core/r1/config_context");
var _pager_props = require("../common/pager_props");
var _page = require("./page");
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

const PAGER_PAGE_SEPARATOR_CLASS = 'dx-separator';
const PAGES_LIMITER = 4;
const PagesLargeDefaultProps = {
  maxPagesCount: _pager_props.PagerDefaultProps.maxPagesCount,
  pageCount: _pager_props.PagerDefaultProps.pageCount,
  pageIndex: _pager_props.PagerDefaultProps.pageIndex,
  pageIndexChangedInternal: _pager_props.PagerDefaultProps.pageIndexChangedInternal
};
function getDelimiterType(startIndex, slidingWindowSize, pageCount) {
  switch (true) {
    case startIndex === 1:
      return 'high';
    case startIndex + slidingWindowSize === pageCount - 1:
      return 'low';
    default:
      return 'both';
  }
}
function createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter) {
  let pageIndexes = [];
  let indexesForReuse = [];
  // eslint-disable-next-line default-case
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
class PagesLarge extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.refs = null;
    this.canReuseSlidingWindow = this.canReuseSlidingWindow.bind(this);
    this.generatePageIndexes = this.generatePageIndexes.bind(this);
    this.isSlidingWindowMode = this.isSlidingWindowMode.bind(this);
    this.onPageClick = this.onPageClick.bind(this);
  }
  getConfig() {
    if (this.context[_config_context.ConfigContext.id]) {
      return this.context[_config_context.ConfigContext.id];
    }
    return _config_context.ConfigContext.defaultValue;
  }
  getSlidingWindowState() {
    const slidingWindowState = this.slidingWindowStateHolder;
    if (!slidingWindowState) {
      return {
        indexesForReuse: [],
        slidingWindowIndexes: []
      };
    }
    return slidingWindowState;
  }
  canReuseSlidingWindow(currentPageCount, pageIndex) {
    const {
      indexesForReuse
    } = this.getSlidingWindowState();
    const lastPageIsFartherThanWindow = indexesForReuse.slice(-1)[0] < currentPageCount - 1;
    const pageIndexExistInIndexes = indexesForReuse.includes(pageIndex);
    return lastPageIsFartherThanWindow && pageIndexExistInIndexes;
  }
  generatePageIndexes() {
    const {
      pageCount,
      pageIndex
    } = this.props;
    let startIndex = 0;
    const {
      slidingWindowIndexes
    } = this.getSlidingWindowState();
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
    const indexes = createPageIndexes(startIndex, slidingWindowSize, pageCount, delimiter);
    const {
      pageIndexes
    } = indexes;
    this.slidingWindowStateHolder = indexes;
    return pageIndexes;
  }
  isSlidingWindowMode() {
    const {
      maxPagesCount,
      pageCount
    } = this.props;
    return pageCount <= PAGES_LIMITER || pageCount <= maxPagesCount;
  }
  onPageClick(pageIndex) {
    this.props.pageIndexChangedInternal(pageIndex);
  }
  getPageIndexes() {
    const {
      pageCount
    } = this.props;
    if (this.isSlidingWindowMode()) {
      return createPageIndexes(0, pageCount, pageCount, 'none').pageIndexes;
    }
    if (this.canReuseSlidingWindow(pageCount, this.props.pageIndex)) {
      const {
        slidingWindowIndexes
      } = this.getSlidingWindowState();
      const delimiter = getDelimiterType(slidingWindowIndexes[0], PAGES_LIMITER, pageCount);
      return createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter).pageIndexes;
    }
    return this.generatePageIndexes();
  }
  getPages() {
    var _this$getConfig;
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
    const indices = this.getPageIndexes();
    const rtlPageIndexes = (_this$getConfig = this.getConfig()) !== null && _this$getConfig !== void 0 && _this$getConfig.rtlEnabled ? [...indices].reverse() : indices;
    return rtlPageIndexes.map(index => createPage(index));
  }
  render() {
    const PagesMarkup = this.getPages().map(_ref => {
      let {
        key,
        pageProps
      } = _ref;
      return pageProps ? (0, _inferno.createComponentVNode)(2, _page.Page, {
        "index": pageProps.index,
        "selected": pageProps.selected,
        "onClick": pageProps.onClick
      }, key) : (0, _inferno.createVNode)(1, "div", PAGER_PAGE_SEPARATOR_CLASS, ". . .", 16, null, key);
    });
    return (0, _inferno.createFragment)(PagesMarkup, 0);
  }
}
exports.PagesLarge = PagesLarge;
PagesLarge.defaultProps = PagesLargeDefaultProps;
