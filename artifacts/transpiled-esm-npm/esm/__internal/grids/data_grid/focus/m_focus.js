import _extends from "@babel/runtime/helpers/esm/extends";
import { equalByValue } from '../../../../core/utils/common';
import { compileGetter } from '../../../../core/utils/data';
import { Deferred } from '../../../../core/utils/deferred';
import { isDefined } from '../../../../core/utils/type';
import { focusModule } from '../../../grids/grid_core/focus/m_focus';
import gridCore from '../m_core';
import { createGroupFilter } from '../m_utils';
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991 /* IE11 */;
var data = Base => class FocusDataControllerExtender extends focusModule.extenders.controllers.data(Base) {
  changeRowExpand(path, isRowClick) {
    // @ts-expect-error
    if (this.option('focusedRowEnabled') && Array.isArray(path) && this.isRowExpanded(path)) {
      if ((!isRowClick || !this._keyboardNavigationController.isKeyboardEnabled()) && this._isFocusedRowInsideGroup(path)) {
        this.option('focusedRowKey', path);
      }
    }
    // @ts-expect-error
    return super.changeRowExpand(path, isRowClick);
  }
  _isFocusedRowInsideGroup(path) {
    var focusedRowKey = this.option('focusedRowKey');
    var rowIndex = this.getRowIndexByKey(focusedRowKey);
    var focusedRow = rowIndex >= 0 && this.getVisibleRows()[rowIndex];
    var groups = this._columnsController.getGroupDataSourceParameters(true);
    if (focusedRow) {
      for (var i = 0; i < path.length; ++i) {
        var getter = compileGetter(groups[i] && groups[i].selector);
        // @ts-expect-error
        if (getter(focusedRow.data) !== path[i]) {
          return false;
        }
      }
    }
    return true;
  }
  _getGroupPath(groupItem, groupCount) {
    var groupPath = [];
    var items = [groupItem];
    while (items && items[0] && groupCount) {
      var item = items[0];
      if (item.key !== undefined) {
        groupPath.push(item.key);
      }
      items = item.items;
      groupCount--;
    }
    return groupPath;
  }
  _expandGroupByPath(that, groupPath, level) {
    // @ts-expect-error
    var d = new Deferred();
    level++;
    that.expandRow(groupPath.slice(0, level)).done(() => {
      if (level === groupPath.length) {
        d.resolve();
      } else {
        that._expandGroupByPath(that, groupPath, level).done(d.resolve).fail(d.reject);
      }
    }).fail(d.reject);
    return d.promise();
  }
  _calculateGlobalRowIndexByGroupedData(key) {
    var that = this;
    var dataSource = that._dataSource;
    var filter = that._generateFilterByKey(key);
    // @ts-expect-error
    var deferred = new Deferred();
    var isGroupKey = Array.isArray(key);
    var group = dataSource.group();
    if (isGroupKey) {
      return deferred.resolve(-1).promise();
    }
    if (!dataSource._grouping._updatePagingOptions) {
      that._calculateGlobalRowIndexByFlatData(key, null, true).done(deferred.resolve).fail(deferred.reject);
      return deferred;
    }
    dataSource.load({
      filter: that._concatWithCombinedFilter(filter),
      group
    }).done(data => {
      if (!data || data.length === 0 || !isDefined(data[0].key) || data[0].key === -1) {
        return deferred.resolve(-1).promise();
      }
      var groupPath = that._getGroupPath(data[0], group.length);
      that._expandGroupByPath(that, groupPath, 0).done(() => {
        that._calculateExpandedRowGlobalIndex(deferred, key, groupPath, group);
      }).fail(deferred.reject);
    }).fail(deferred.reject);
    return deferred.promise();
  }
  _calculateExpandedRowGlobalIndex(deferred, key, groupPath, group) {
    var groupFilter = createGroupFilter(groupPath, {
      group
    });
    var dataSource = this._dataSource;
    var scrollingMode = this.option('scrolling.mode');
    var isVirtualScrolling = scrollingMode === 'virtual' || scrollingMode === 'infinite';
    var pageSize = dataSource.pageSize();
    var groupOffset;
    dataSource._grouping._updatePagingOptions({
      skip: 0,
      take: MAX_SAFE_INTEGER
    }, (groupInfo, totalOffset) => {
      if (equalByValue(groupInfo.path, groupPath)) {
        groupOffset = totalOffset;
      }
    });
    // @ts-expect-error
    this._calculateGlobalRowIndexByFlatData(key, groupFilter).done(dataOffset => {
      var count;
      var groupContinuationCount;
      if (dataOffset < 0) {
        deferred.resolve(-1);
        return;
      }
      var currentPageOffset = groupOffset % pageSize || pageSize;
      count = currentPageOffset + dataOffset - groupPath.length;
      if (isVirtualScrolling) {
        groupContinuationCount = 0;
      } else {
        groupContinuationCount = Math.floor(count / (pageSize - groupPath.length)) * groupPath.length;
      }
      count = groupOffset + dataOffset + groupContinuationCount;
      deferred.resolve(count);
    }).fail(deferred.reject);
  }
};
gridCore.registerModule('focus', _extends(_extends({}, focusModule), {
  extenders: _extends(_extends({}, focusModule.extenders), {
    controllers: _extends(_extends({}, focusModule.extenders.controllers), {
      data
    })
  })
}));