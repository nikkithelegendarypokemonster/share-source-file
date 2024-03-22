/**
* DevExtreme (esm/__internal/grids/tree_list/m_virtual_scrolling.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
/* eslint-disable max-classes-per-file */
import { extend } from '../../../core/utils/extend';
import { data as virtualScrollingDataControllerExtender, dataSourceAdapterExtender as virtualScrollingDataSourceAdapterExtender, virtualScrollingModule } from '../../grids/grid_core/virtual_scrolling/m_virtual_scrolling';
import dataSourceAdapterProvider from './data_source_adapter/m_data_source_adapter';
import gridCore from './m_core';
var oldDefaultOptions = virtualScrollingModule.defaultOptions;
virtualScrollingModule.extenders.controllers.data = Base => class TreeListVirtualScrollingDataControllerExtender extends virtualScrollingDataControllerExtender(Base) {
  _loadOnOptionChange() {
    var _a;
    var virtualScrollController = (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a._virtualScrollController;
    virtualScrollController === null || virtualScrollController === void 0 ? void 0 : virtualScrollController.reset();
    // @ts-expect-error
    super._loadOnOptionChange();
  }
};
var dataSourceAdapterExtender = Base => class VirtualScrollingDataSourceAdapterExtender extends virtualScrollingDataSourceAdapterExtender(Base) {
  changeRowExpand() {
    return super.changeRowExpand.apply(this, arguments).done(() => {
      var viewportItemIndex = this.getViewportItemIndex();
      viewportItemIndex >= 0 && this.setViewportItemIndex(viewportItemIndex);
    });
  }
};
gridCore.registerModule('virtualScrolling', _extends(_extends({}, virtualScrollingModule), {
  defaultOptions() {
    return extend(true, oldDefaultOptions(), {
      scrolling: {
        mode: 'virtual'
      }
    });
  }
}));
dataSourceAdapterProvider.extend(dataSourceAdapterExtender);
