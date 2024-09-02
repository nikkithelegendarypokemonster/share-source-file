/**
* DevExtreme (esm/__internal/pager/page_size/large.js)
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
import { format } from '../../../core/utils/string';
import messageLocalization from '../../../localization/message';
import { combineClasses } from '../../core/r1/utils/render_utils';
import { FIRST_CHILD_CLASS, PAGER_PAGE_SIZE_CLASS, PAGER_SELECTED_PAGE_SIZE_CLASS } from '../common/consts';
import { LightButton } from '../common/light_button';
import { PagerDefaultProps } from '../common/pager_props';
export const PageSizeLargeDefaultProps = {
  pageSizes: [],
  pageSize: PagerDefaultProps.pageSize,
  pageSizeChangedInternal: PagerDefaultProps.pageSizeChangedInternal
};
export class PageSizeLarge extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.refs = null;
    this.__getterCache = {
      pageSizesText: undefined
    };
    this.state = {};
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
  }
  getPageSizesText() {
    if (this.__getterCache.pageSizesText !== undefined) {
      return this.__getterCache.pageSizesText;
    }
    const result = (() => {
      const {
        pageSize,
        pageSizes
      } = this.props;
      return pageSizes.map((_ref3, index) => {
        const {
          text,
          value: processedPageSize
        } = _ref3;
        const selected = processedPageSize === pageSize;
        const className = combineClasses({
          [selected ? PAGER_SELECTED_PAGE_SIZE_CLASS : PAGER_PAGE_SIZE_CLASS]: true,
          [FIRST_CHILD_CLASS]: index === 0
        });
        return {
          className,
          click: this.onPageSizeChange(processedPageSize),
          label: format(messageLocalization.getFormatter('dxPager-pageSize'), processedPageSize || messageLocalization.getFormatter('dxPager-pageSizesAllText')),
          text
        };
      });
    })();
    this.__getterCache.pageSizesText = result;
    return result;
  }
  onPageSizeChange(processedPageSize) {
    return () => {
      this.props.pageSizeChangedInternal(processedPageSize);
      return this.props.pageSize;
    };
  }
  componentWillUpdate(nextProps) {
    const componentChanged = this.props.pageSize !== nextProps.pageSize || this.props.pageSizes !== nextProps.pageSizes || this.props.pageSizeChangedInternal !== nextProps.pageSizeChangedInternal;
    if (componentChanged) {
      this.__getterCache.pageSizesText = undefined;
    }
  }
  render() {
    return createFragment(this.getPageSizesText().map(_ref => {
      let {
        text,
        className,
        label,
        click
      } = _ref;
      return createComponentVNode(2, LightButton, {
        "className": className,
        "label": label,
        "onClick": click,
        children: text
      }, text);
    }), 0);
  }
}
PageSizeLarge.defaultProps = PageSizeLargeDefaultProps;
