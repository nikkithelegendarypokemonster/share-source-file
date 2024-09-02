/**
* DevExtreme (esm/__internal/pager/page_size/selector.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { createVNode, createComponentVNode } from "inferno";
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import { createRef as infernoCreateRef } from 'inferno';
import messageLocalization from '../../../localization/message';
import { PAGER_PAGE_SIZES_CLASS } from '../common/consts';
import { PagerDefaultProps } from '../common/pager_props';
import { PageSizeLarge } from './large';
import { PageSizeSmall } from './small';
function getAllText() {
  return messageLocalization.getFormatter('dxPager-pageSizesAllText')();
}
const PageSizeSelectorDefaultProps = {
  isLargeDisplayMode: true,
  pageSize: PagerDefaultProps.pageSize,
  pageSizeChangedInternal: PagerDefaultProps.pageSizeChangedInternal,
  pageSizes: PagerDefaultProps.pageSizes
};
export class PageSizeSelector extends InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.refs = null;
    this.rootElementRef = infernoCreateRef();
    this.htmlRef = infernoCreateRef();
    this.__getterCache = {
      normalizedPageSizes: undefined
    };
    this.setRootElementRef = this.setRootElementRef.bind(this);
  }
  createEffects() {
    return [new InfernoEffect(this.setRootElementRef, [])];
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
    return createVNode(1, "div", PAGER_PAGE_SIZES_CLASS, [isLargeDisplayMode && createComponentVNode(2, PageSizeLarge, {
      "pageSizes": this.getNormalizedPageSizes(),
      "pageSize": pageSize,
      "pageSizeChangedInternal": pageSizeChangedInternal
    }), !isLargeDisplayMode && createComponentVNode(2, PageSizeSmall, {
      "parentRef": this.htmlRef,
      "pageSizes": normalizedPageSizes,
      "pageSize": pageSize,
      "pageSizeChangedInternal": pageSizeChangedInternal
    })], 0, null, null, this.htmlRef);
  }
}
PageSizeSelector.defaultProps = PageSizeSelectorDefaultProps;
