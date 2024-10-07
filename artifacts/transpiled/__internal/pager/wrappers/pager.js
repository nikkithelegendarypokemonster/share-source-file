"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _pager = require("../pager");
var _grid_pager = require("./grid_pager");
/* eslint-disable @typescript-eslint/no-explicit-any */

class Pager extends _grid_pager.GridPagerWrapper {
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
      props: ['defaultPageSize', 'pageSizeChanged', 'pageSizeChangedInternal', 'defaultPageIndex', 'pageIndexChanged', 'pageIndexChangedInternal', 'gridCompatibility', 'className', 'showInfo', 'infoText', 'lightModeEnabled', 'displayMode', 'maxPagesCount', 'pageCount', 'pagesCountText', 'visible', 'hasKnownLastPage', 'pagesNavigatorVisible', 'showPageSizeSelector', 'allowedPageSizes', 'rtlEnabled', 'showNavigationButtons', 'totalCount', 'label', 'onKeyDown', 'pageSize', 'pageIndex', 'width', 'height', 'elementAttr', 'hint', 'disabled', 'tabIndex', 'accessKey', 'activeStateEnabled', 'focusStateEnabled', 'hoverStateEnabled', '_skipValidation']
    };
  }
  // @ts-expect-error types error in R1
  get _viewComponent() {
    return _pager.Pager;
  }
}
exports.default = Pager;