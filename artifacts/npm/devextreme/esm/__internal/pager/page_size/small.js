/**
* DevExtreme (esm/__internal/pager/page_size/small.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { createComponentVNode } from "inferno";
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import messageLocalization from '../../../localization/message';
import { PagerDefaultProps } from '../common/pager_props';
import { SelectBox } from '../drop_down_editors/select_box';
import { calculateValuesFittedWidth } from '../utils/calculate_values_fitted_width';
import { getElementMinWidth } from '../utils/get_element_width';
const PagerSmallDefaultProps = {
  inputAttr: {
    'aria-label': messageLocalization.format('dxPager-ariaPageSize')
  },
  pageSizes: []
};
const PageSizeSmallDefaultProps = _extends({}, PagerSmallDefaultProps, {
  pageSize: PagerDefaultProps.pageSize,
  pageSizeChangedInternal: PagerDefaultProps.pageSizeChangedInternal
});
export class PageSizeSmall extends InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {
      minWidth: 10
    };
    this.refs = null;
    this.updateWidth = this.updateWidth.bind(this);
  }
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate(nextProps, nextState, context);
  }
  createEffects() {
    const dependency = [this.props, this.state.minWidth, this.props.pageSize, this.props.pageSizeChangedInternal, this.props.pageSizes, this.props.inputAttr];
    return [new InfernoEffect(this.updateWidth, dependency)];
  }
  updateEffects() {
    var _this$_effects$;
    const dependency = [this.props, this.state.minWidth, this.props.pageSize, this.props.pageSizeChangedInternal, this.props.pageSizes, this.props.inputAttr];
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update(dependency);
  }
  updateWidth() {
    this.setState(state => {
      var _this$props$parentRef;
      return {
        minWidth: getElementMinWidth((_this$props$parentRef = this.props.parentRef) === null || _this$props$parentRef === void 0 ? void 0 : _this$props$parentRef.current) || state.minWidth
      };
    });
  }
  getWidth() {
    var _this$props$pageSizes;
    return calculateValuesFittedWidth(this.state.minWidth, (_this$props$pageSizes = this.props.pageSizes) === null || _this$props$pageSizes === void 0 ? void 0 : _this$props$pageSizes.map(p => p.value));
  }
  render() {
    const {
      inputAttr,
      pageSizes,
      pageSize,
      pageSizeChangedInternal
    } = this.props;
    return createComponentVNode(2, SelectBox, {
      "displayExpr": "text",
      "valueExpr": "value",
      "dataSource": pageSizes,
      "value": pageSize,
      "valueChange": pageSizeChangedInternal,
      "width": this.getWidth(),
      "inputAttr": inputAttr
    });
  }
}
PageSizeSmall.defaultProps = PageSizeSmallDefaultProps;
