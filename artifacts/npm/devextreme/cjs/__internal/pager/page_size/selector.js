/**
* DevExtreme (cjs/__internal/pager/page_size/selector.js)
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
exports.PageSizeSelector = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _consts = require("../common/consts");
var _pager_props = require("../common/pager_props");
var _large = require("./large");
var _small = require("./small");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

function getAllText() {
  return _message.default.getFormatter('dxPager-pageSizesAllText')();
}
const PageSizeSelectorDefaultProps = {
  isLargeDisplayMode: true,
  pageSize: _pager_props.PagerDefaultProps.pageSize,
  pageSizeChangedInternal: _pager_props.PagerDefaultProps.pageSizeChangedInternal,
  pageSizes: _pager_props.PagerDefaultProps.pageSizes
};
class PageSizeSelector extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.refs = null;
    this.rootElementRef = (0, _inferno.createRef)();
    this.htmlRef = (0, _inferno.createRef)();
    this.__getterCache = {
      normalizedPageSizes: undefined
    };
    this.setRootElementRef = this.setRootElementRef.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.setRootElementRef, [])];
  }
  setRootElementRef() {
    const {
      rootElementRef
    } = this.props;
    if (rootElementRef) {
      rootElementRef.current = this.htmlRef.current;
    }
  }
  getNormalizedPageSizes() {
    if (this.__getterCache.normalizedPageSizes !== undefined) {
      return this.__getterCache.normalizedPageSizes;
    }
    const mapFunction = p => p === 'all' || p === 0 ? {
      text: getAllText(),
      value: 0
    } : {
      text: String(p),
      value: p
    };
    const result = this.props.pageSizes.map(mapFunction);
    this.__getterCache.normalizedPageSizes = result;
    return result;
  }
  componentWillUpdate(nextProps) {
    super.componentWillUpdate();
    if (this.props.pageSizes !== nextProps.pageSizes) {
      this.__getterCache.normalizedPageSizes = undefined;
    }
  }
  render() {
    const normalizedPageSizes = this.getNormalizedPageSizes();
    const {
      pageSize,
      pageSizeChangedInternal,
      isLargeDisplayMode
    } = this.props;
    return (0, _inferno.createVNode)(1, "div", _consts.PAGER_PAGE_SIZES_CLASS, [isLargeDisplayMode && (0, _inferno.createComponentVNode)(2, _large.PageSizeLarge, {
      "pageSizes": this.getNormalizedPageSizes(),
      "pageSize": pageSize,
      "pageSizeChangedInternal": pageSizeChangedInternal
    }), !isLargeDisplayMode && (0, _inferno.createComponentVNode)(2, _small.PageSizeSmall, {
      "parentRef": this.htmlRef,
      "pageSizes": normalizedPageSizes,
      "pageSize": pageSize,
      "pageSizeChangedInternal": pageSizeChangedInternal
    })], 0, null, null, this.htmlRef);
  }
}
exports.PageSizeSelector = PageSizeSelector;
PageSizeSelector.defaultProps = PageSizeSelectorDefaultProps;
