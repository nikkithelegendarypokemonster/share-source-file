/**
* DevExtreme (esm/__internal/grids/tree_list/m_focus.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { Deferred } from '../../../core/utils/deferred';
import { focusModule } from '../../grids/grid_core/focus/m_focus';
import core from './m_core';
function findIndex(items, callback) {
  var result = -1;
  items.forEach((node, index) => {
    if (callback(node)) {
      result = index;
    }
  });
  return result;
}
var data = Base => class TreeListDataControllerExtender extends focusModule.extenders.controllers.data(Base) {
  changeRowExpand(key) {
    // @ts-expect-error
    if (this.option('focusedRowEnabled') && this.isRowExpanded(key)) {
      if (this._isFocusedRowInside(key)) {
        this.option('focusedRowKey', key);
      }
    }
    // @ts-expect-error
    return super.changeRowExpand.apply(this, arguments);
  }
  _isFocusedRowInside(parentKey) {
    var focusedRowKey = this.option('focusedRowKey');
    var rowIndex = this.getRowIndexByKey(focusedRowKey);
    var focusedRow = rowIndex >= 0 && this.getVisibleRows()[rowIndex];
    // @ts-expect-error
    var parent = focusedRow && focusedRow.node.parent;
    while (parent) {
      if (parent.key === parentKey) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }
  getParentKey(key) {
    var that = this;
    var dataSource = that._dataSource;
    // @ts-expect-error
    var node = that.getNodeByKey(key);
    // @ts-expect-error
    var d = new Deferred();
    if (node) {
      d.resolve(node.parent ? node.parent.key : undefined);
    } else {
      dataSource.load({
        filter: [dataSource.getKeyExpr(), '=', key]
      }).done(items => {
        var parentData = items[0];
        if (parentData) {
          d.resolve(dataSource.parentKeyOf(parentData));
        } else {
          d.resolve();
        }
      }).fail(d.reject);
    }
    return d.promise();
  }
  expandAscendants(key) {
    var that = this;
    var dataSource = that._dataSource;
    // @ts-expect-error
    var d = new Deferred();
    that.getParentKey(key).done(parentKey => {
      if (dataSource && parentKey !== undefined && parentKey !== that.option('rootValue')) {
        dataSource._isNodesInitializing = true;
        // @ts-expect-error
        that.expandRow(parentKey);
        dataSource._isNodesInitializing = false;
        that.expandAscendants(parentKey).done(d.resolve).fail(d.reject);
      } else {
        d.resolve();
      }
    }).fail(d.reject);
    return d.promise();
  }
  getPageIndexByKey(key) {
    var that = this;
    var dataSource = that._dataSource;
    // @ts-expect-error
    var d = new Deferred();
    that.expandAscendants(key).done(() => {
      dataSource.load({
        parentIds: []
      }).done(nodes => {
        var offset = findIndex(nodes, node => that.keyOf(node.data) === key);
        var pageIndex = -1;
        if (offset >= 0) {
          pageIndex = Math.floor(offset / that.pageSize());
        }
        d.resolve(pageIndex);
      }).fail(d.reject);
    }).fail(d.reject);
    return d.promise();
  }
};
core.registerModule('focus', _extends(_extends({}, focusModule), {
  extenders: _extends(_extends({}, focusModule.extenders), {
    controllers: _extends(_extends({}, focusModule.extenders.controllers), {
      data
    })
  })
}));
