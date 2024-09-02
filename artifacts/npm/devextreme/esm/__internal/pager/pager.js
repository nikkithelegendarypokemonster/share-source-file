/**
* DevExtreme (esm/__internal/pager/pager.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { createComponentVNode } from "inferno";
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { combineClasses } from '../core/r1/utils/render_utils';
import { PagerDefaultProps } from './common/pager_props';
import { PagerContent } from './content';
import { ResizableContainer } from './resizable_container';
export class Pager extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.__getterCache = {};
    this.pageIndexChangedInternal = this.pageIndexChangedInternal.bind(this);
    this.pageSizeChangedInternal = this.pageSizeChangedInternal.bind(this);
  }
  createEffects() {
    return [createReRenderEffect()];
  }
  pageIndexChangedInternal(newPageIndex) {
    const newValue = this.props.gridCompatibility ? newPageIndex + 1 : newPageIndex;
    this.setState(() => ({
      pageIndex: newValue
    }));
    this.props.pageIndexChangedInternal(newValue);
  }
  getPageIndex() {
    if (this.props.gridCompatibility) {
      return this.props.pageIndex - 1;
    }
    return this.props.pageIndex;
  }
  pageSizeChangedInternal(newPageSize) {
    this.setState(() => ({
      pageSize: newPageSize
    }));
    this.props.pageSizeChangedInternal(newPageSize);
  }
  getClassName() {
    if (this.props.gridCompatibility) {
      return combineClasses({
        'dx-datagrid-pager': true,
        [`${this.props.className}`]: !!this.props.className
      });
    }
    return this.props.className;
  }
  getPagerProps() {
    return _extends({}, this.props, {
      className: this.getClassName(),
      pageIndex: this.getPageIndex(),
      // eslint-disable-next-line max-len
      pageIndexChangedInternal: pageIndex => this.pageIndexChangedInternal(pageIndex),
      pageSizeChangedInternal: pageSize => this.pageSizeChangedInternal(pageSize)
    });
  }
  render() {
    return createComponentVNode(2, ResizableContainer, {
      "contentTemplate": PagerContent,
      "pagerProps": this.getPagerProps()
    });
  }
}
Pager.defaultProps = PagerDefaultProps;
