/**
* DevExtreme (esm/__internal/pager/wrappers/pager.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pager as PagerComponent } from '../pager';
import { GridPagerWrapper } from './grid_pager';
export default class Pager extends GridPagerWrapper {
  getProps() {
    const props = super.getProps();
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }
  get _propsInfo() {
    return {
      twoWay: [['pageSize', 'defaultPageSize', 'pageSizeChangedInternal', 'pageSizeChanged'], ['pageIndex', 'defaultPageIndex', 'pageIndexChangedInternal', 'pageIndexChanged']],
      allowNull: [],
      elements: [],
      templates: [],
      props: ['defaultPageSize', 'pageSizeChanged', 'pageSizeChangedInternal', 'defaultPageIndex', 'pageIndexChanged', 'pageIndexChangedInternal', 'gridCompatibility', 'className', 'showInfo', 'infoText', 'lightModeEnabled', 'displayMode', 'maxPagesCount', 'pageCount', 'pagesCountText', 'visible', 'hasKnownLastPage', 'pagesNavigatorVisible', 'showPageSizes', 'pageSizes', 'rtlEnabled', 'showNavigationButtons', 'totalCount', 'label', 'onKeyDown', 'pageSize', 'pageIndex']
    };
  }
  // @ts-expect-error types error in R1
  get _viewComponent() {
    return PagerComponent;
  }
}
