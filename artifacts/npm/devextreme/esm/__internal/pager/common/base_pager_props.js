/**
* DevExtreme (esm/__internal/pager/common/base_pager_props.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import messageLocalization from '../../../localization/message';
export const BasePagerDefaultProps = {
  gridCompatibility: true,
  showInfo: false,
  displayMode: 'adaptive',
  maxPagesCount: 10,
  pageCount: 10,
  visible: true,
  hasKnownLastPage: true,
  pagesNavigatorVisible: 'auto',
  showPageSizes: true,
  pageSizes: [5, 10],
  showNavigationButtons: false,
  totalCount: 0,
  label: messageLocalization.format('dxPager-ariaLabel')
};
