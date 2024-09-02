/**
* DevExtreme (esm/__internal/pager/common/pager_props.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { BasePagerDefaultProps } from './base_pager_props';
export const PagerDefaultProps = _extends({}, BasePagerDefaultProps, {
  pageSize: 5,
  pageIndex: 1,
  pageIndexChangedInternal: () => {},
  pageSizeChangedInternal: () => {}
});
