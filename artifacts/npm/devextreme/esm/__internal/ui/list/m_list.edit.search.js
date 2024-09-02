/**
* DevExtreme (esm/__internal/ui/list/m_list.edit.search.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import searchBoxMixin from '../../../ui/widget/ui.search_box_mixin';
import ListEdit from './m_list.edit';
const ListSearch = ListEdit.inherit(searchBoxMixin).inherit({
  _addWidgetPrefix(className) {
    return `dx-list-${className}`;
  },
  _getCombinedFilter() {
    const dataController = this._dataController;
    const storeLoadOptions = {
      filter: dataController.filter()
    };
    dataController.addSearchFilter(storeLoadOptions);
    const {
      filter
    } = storeLoadOptions;
    return filter;
  },
  _initDataSource() {
    const value = this.option('searchValue');
    const expr = this.option('searchExpr');
    const mode = this.option('searchMode');
    this.callBase();
    const dataController = this._dataController;
    value && value.length && dataController.searchValue(value);
    // @ts-expect-error
    mode.length && dataController.searchOperation(searchBoxMixin.getOperationBySearchMode(mode));
    expr && dataController.searchExpr(expr);
  }
});
export default ListSearch;
