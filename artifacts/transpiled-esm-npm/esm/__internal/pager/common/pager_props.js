import _extends from "@babel/runtime/helpers/esm/extends";
import { BasePagerDefaultProps } from './base_pager_props';
export const PagerDefaultProps = _extends({}, BasePagerDefaultProps, {
  pageSize: 5,
  pageIndex: 1,
  pageIndexChangedInternal: () => {},
  pageSizeChangedInternal: () => {}
});