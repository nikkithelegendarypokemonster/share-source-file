/**
* DevExtreme (esm/__internal/pager/pages/page_index_selector.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { createFragment, createComponentVNode } from "inferno";
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { Fragment } from 'inferno';
import messageLocalization from '../../../localization/message';
import { ConfigContext } from '../../core/r1/config_context';
import { LightButton } from '../common/light_button';
import { PagerDefaultProps } from '../common/pager_props';
import { PagesLarge } from './large';
import { PagesSmall } from './small';
const PAGER_NAVIGATE_BUTTON = 'dx-navigate-button';
const PAGER_PREV_BUTTON_CLASS = 'dx-prev-button';
const PAGER_NEXT_BUTTON_CLASS = 'dx-next-button';
export const PAGER_BUTTON_DISABLE_CLASS = 'dx-button-disable';
const getNextButtonLabel = () => messageLocalization.getFormatter('dxPager-nextPage')();
const getPrevButtonLabel = () => messageLocalization.getFormatter('dxPager-prevPage')();
const classNames = {
  nextEnabledClass: `${PAGER_NAVIGATE_BUTTON} ${PAGER_NEXT_BUTTON_CLASS}`,
  prevEnabledClass: `${PAGER_NAVIGATE_BUTTON} ${PAGER_PREV_BUTTON_CLASS}`,
  nextDisabledClass: `${PAGER_BUTTON_DISABLE_CLASS} ${PAGER_NAVIGATE_BUTTON} ${PAGER_NEXT_BUTTON_CLASS}`,
  prevDisabledClass: `${PAGER_BUTTON_DISABLE_CLASS} ${PAGER_NAVIGATE_BUTTON} ${PAGER_PREV_BUTTON_CLASS}`
};
const reverseDirections = {
  next: 'prev',
  prev: 'next'
};
function getIncrement(direction) {
  return direction === 'next' ? +1 : -1;
}
const PageIndexSelectorDefaultProps = {
  isLargeDisplayMode: true,
  maxPagesCount: PagerDefaultProps.maxPagesCount,
  pageCount: PagerDefaultProps.pageCount,
  pageIndex: PagerDefaultProps.pageIndex,
  pageIndexChangedInternal: PagerDefaultProps.pageIndexChangedInternal,
  showNavigationButtons: PagerDefaultProps.showNavigationButtons,
  totalCount: PagerDefaultProps.totalCount
};
export class PageIndexSelector extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.refs = null;
    this.__getterCache = {
      prevButtonProps: undefined,
      nextButtonProps: undefined
    };
    this.pageIndexChangedInternal = this.pageIndexChangedInternal.bind(this);
    this.getButtonProps = this.getButtonProps.bind(this);
    this.canNavigateToPage = this.canNavigateToPage.bind(this);
    this.getNextPageIndex = this.getNextPageIndex.bind(this);
    this.canNavigateTo = this.canNavigateTo.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
  }
  getConfig() {
    if (this.context[ConfigContext.id]) {
      return this.context[ConfigContext.id];
    }
    return ConfigContext.defaultValue;
  }
  pageIndexChangedInternal(pageIndex) {
    if (this.canNavigateToPage(pageIndex)) {
      this.props.pageIndexChangedInternal(pageIndex);
    }
  }
  getButtonProps(direction) {
    var _this$getConfig;
    // eslint-disable-next-line max-len
    const rtlAwareDirection = (_this$getConfig = this.getConfig()) !== null && _this$getConfig !== void 0 && _this$getConfig.rtlEnabled ? reverseDirections[direction] : direction;
    const canNavigate = this.canNavigateTo(rtlAwareDirection);
    const className = classNames[`${direction}${canNavigate ? 'Enabled' : 'Disabled'}Class`];
    return {
      className,
      tabIndex: canNavigate ? 0 : -1,
      navigate: () => this.navigateToPage(rtlAwareDirection)
    };
  }
  canNavigateToPage(pageIndex) {
    if (!this.props.hasKnownLastPage) {
      return pageIndex >= 0;
    }
    return pageIndex >= 0 && pageIndex <= this.props.pageCount - 1;
  }
  getNextPageIndex(direction) {
    return this.props.pageIndex + getIncrement(direction);
  }
  canNavigateTo(direction) {
    return this.canNavigateToPage(this.getNextPageIndex(direction));
  }
  navigateToPage(direction) {
    this.pageIndexChangedInternal(this.getNextPageIndex(direction));
  }
  getRenderPrevButton() {
    const {
      isLargeDisplayMode,
      showNavigationButtons
    } = this.props;
    return (!isLargeDisplayMode || showNavigationButtons) ?? false;
  }
  getRenderNextButton() {
    return this.getRenderPrevButton() || !this.props.hasKnownLastPage;
  }
  getPrevButtonProps() {
    if (this.__getterCache.prevButtonProps !== undefined) {
      return this.__getterCache.prevButtonProps;
    }
    const result = (() => this.getButtonProps('prev'))();
    this.__getterCache.prevButtonProps = result;
    return result;
  }
  getNextButtonProps() {
    if (this.__getterCache.nextButtonProps !== undefined) {
      return this.__getterCache.nextButtonProps;
    }
    const result = (() => this.getButtonProps('next'))();
    this.__getterCache.nextButtonProps = result;
    return result;
  }
  componentWillUpdate(nextProps, nextState, context) {
    const isComponentUpdated = this.context[ConfigContext.id] !== context[ConfigContext.id] || this.props.hasKnownLastPage !== nextProps.hasKnownLastPage || this.props.pageCount !== nextProps.pageCount || this.props.pageIndex !== nextProps.pageIndex || this.props.pageIndexChangedInternal !== nextProps.pageIndexChangedInternal;
    if (isComponentUpdated) {
      this.__getterCache.prevButtonProps = undefined;
      this.__getterCache.nextButtonProps = undefined;
    }
  }
  render() {
    const {
      className,
      tabIndex,
      navigate
    } = this.getPrevButtonProps();
    const {
      isLargeDisplayMode,
      maxPagesCount,
      pageCount,
      pageIndex,
      pagesCountText
    } = this.props;
    return createFragment([this.getRenderPrevButton() && createComponentVNode(2, LightButton, {
      "label": getPrevButtonLabel(),
      "className": className,
      "tabIndex": tabIndex,
      "onClick": navigate
    }), isLargeDisplayMode && createComponentVNode(2, PagesLarge, {
      "maxPagesCount": maxPagesCount,
      "pageCount": pageCount,
      "pageIndex": pageIndex,
      "pageIndexChangedInternal": this.pageIndexChangedInternal
    }), !isLargeDisplayMode && createComponentVNode(2, PagesSmall, {
      "pageCount": pageCount,
      "pageIndex": pageIndex,
      "pageIndexChangedInternal": this.pageIndexChangedInternal,
      "pagesCountText": pagesCountText
    }), this.getRenderNextButton() && createComponentVNode(2, LightButton, {
      "label": getNextButtonLabel(),
      "className": this.getNextButtonProps().className,
      "tabIndex": this.getNextButtonProps().tabIndex,
      "onClick": this.getNextButtonProps().navigate
    })], 0);
  }
}
PageIndexSelector.defaultProps = PageIndexSelectorDefaultProps;
