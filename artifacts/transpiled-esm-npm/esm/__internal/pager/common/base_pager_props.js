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