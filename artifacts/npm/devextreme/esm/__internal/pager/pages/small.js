/**
* DevExtreme (esm/__internal/pager/pages/small.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { createVNode, createComponentVNode } from "inferno";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import { createRef } from 'inferno';
import messageLocalization from '../../../localization/message';
import { PagerDefaultProps } from '../common/pager_props';
import { NumberBox } from '../editors/number_box';
import { PAGER_INFO_CLASS } from '../info';
import { calculateValuesFittedWidth } from '../utils/calculate_values_fitted_width';
import { getElementMinWidth } from '../utils/get_element_width';
import { Page } from './page';
const PAGER_INFO_TEXT_CLASS = `${PAGER_INFO_CLASS}  dx-info-text`;
const PAGER_PAGE_INDEX_CLASS = 'dx-page-index';
const LIGHT_PAGES_CLASS = 'dx-light-pages';
const PAGER_PAGES_COUNT_CLASS = 'dx-pages-count';
export const PagerSmallDefaultProps = {
  inputAttr: {
    'aria-label': messageLocalization.format('dxPager-ariaPageNumber')
  },
  pageIndex: PagerDefaultProps.pageIndex,
  pageCount: PagerDefaultProps.pageCount,
  pageIndexChangedInternal: PagerDefaultProps.pageIndexChangedInternal
};
export class PagesSmall extends InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {
      minWidth: 10
    };
    this.refs = null;
    this.pageIndexRef = createRef();
    this.updateWidth = this.updateWidth.bind(this);
    this.selectLastPageIndex = this.selectLastPageIndex.bind(this);
    this.valueChange = this.valueChange.bind(this);
  }
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate(nextProps, nextState, context);
  }
  createEffects() {
    return [new InfernoEffect(this.updateWidth, [this.state.minWidth])];
  }
  updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.state.minWidth]);
  }
  updateWidth() {
    var _this$pageIndexRef$cu;
    const el = (_this$pageIndexRef$cu = this.pageIndexRef.current) === null || _this$pageIndexRef$cu === void 0 ? void 0 : _this$pageIndexRef$cu.querySelector(`.${PAGER_PAGE_INDEX_CLASS}`);
    this.setState(state => ({
      minWidth: el && getElementMinWidth(el) || state.minWidth
    }));
  }
  getValue() {
    return this.props.pageIndex + 1;
  }
  getWidth() {
    return calculateValuesFittedWidth(this.state.minWidth, [this.props.pageCount]);
  }
  getPagesCountText() {
    return (this.props.pagesCountText ?? '') || messageLocalization.getFormatter('dxPager-pagesCountText')();
  }
  selectLastPageIndex() {
    this.props.pageIndexChangedInternal(this.props.pageCount - 1);
  }
  valueChange(value) {
    this.props.pageIndexChangedInternal(value - 1);
  }
  render() {
    return createVNode(1, "div", LIGHT_PAGES_CLASS, [createComponentVNode(2, NumberBox, {
      "className": PAGER_PAGE_INDEX_CLASS,
      "min": 1,
      "max": Math.max(this.props.pageCount, this.getValue()),
      "width": this.getWidth(),
      "value": this.getValue(),
      "valueChange": this.valueChange,
      "inputAttr": this.props.inputAttr
    }), createVNode(1, "span", PAGER_INFO_TEXT_CLASS, this.getPagesCountText(), 0), createComponentVNode(2, Page, {
      "className": PAGER_PAGES_COUNT_CLASS,
      "selected": false,
      "index": this.props.pageCount - 1,
      "onClick": this.selectLastPageIndex
    })], 4, null, null, this.pageIndexRef);
  }
}
PagesSmall.defaultProps = PagerSmallDefaultProps;
