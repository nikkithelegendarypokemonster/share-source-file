import _extends from "@babel/runtime/helpers/esm/extends";
// @ts-expect-error
import { executeAsync } from '../../../../core/utils/common';
import { extend } from '../../../../core/utils/extend';
import { isDefined } from '../../../../core/utils/type';
import gridCoreUtils from '../m_utils';
export var cloneItems = function cloneItems(items, groupCount) {
  if (items) {
    items = items.slice(0);
    if (groupCount) {
      for (var i = 0; i < items.length; i++) {
        items[i] = extend({
          key: items[i].key
        }, items[i]);
        items[i].items = cloneItems(items[i].items, groupCount - 1);
      }
    }
  }
  return items;
};
export var calculateOperationTypes = function calculateOperationTypes(loadOptions, lastLoadOptions, isFullReload) {
  var operationTypes = {
    reload: true,
    fullReload: true
  };
  if (lastLoadOptions) {
    operationTypes = {
      sorting: !gridCoreUtils.equalSortParameters(loadOptions.sort, lastLoadOptions.sort),
      grouping: !gridCoreUtils.equalSortParameters(loadOptions.group, lastLoadOptions.group, true),
      groupExpanding: !gridCoreUtils.equalSortParameters(loadOptions.group, lastLoadOptions.group) || lastLoadOptions.groupExpand,
      filtering: !gridCoreUtils.equalFilterParameters(loadOptions.filter, lastLoadOptions.filter),
      pageIndex: loadOptions.pageIndex !== lastLoadOptions.pageIndex,
      skip: loadOptions.skip !== lastLoadOptions.skip,
      take: loadOptions.take !== lastLoadOptions.take,
      pageSize: loadOptions.pageSize !== lastLoadOptions.pageSize,
      fullReload: isFullReload,
      reload: false,
      paging: false
    };
    operationTypes.reload = isFullReload || operationTypes.sorting || operationTypes.grouping || operationTypes.filtering;
    operationTypes.paging = operationTypes.pageIndex || operationTypes.pageSize || operationTypes.take;
  }
  return operationTypes;
};
export var executeTask = function executeTask(action, timeout) {
  if (isDefined(timeout)) {
    executeAsync(action, timeout);
  } else {
    action();
  }
};
export var createEmptyCachedData = function createEmptyCachedData() {
  return {
    items: {}
  };
};
export var getPageDataFromCache = function getPageDataFromCache(options, updatePaging) {
  var groupCount = gridCoreUtils.normalizeSortingInfo(options.group || options.storeLoadOptions.group || options.loadOptions.group).length;
  var items = [];
  if (fillItemsFromCache(items, options, groupCount)) {
    return items;
  }
  if (updatePaging) {
    updatePagingOptionsByCache(items, options, groupCount);
  }
};
export var fillItemsFromCache = function fillItemsFromCache(items, options, groupCount, fromEnd) {
  var _a, _b, _c, _d, _e;
  var {
    storeLoadOptions
  } = options;
  var take = (_b = (_a = options.take) !== null && _a !== void 0 ? _a : storeLoadOptions.take) !== null && _b !== void 0 ? _b : 0;
  var cachedItems = (_c = options.cachedData) === null || _c === void 0 ? void 0 : _c.items;
  if (take && cachedItems) {
    var skip = (_e = (_d = options.skip) !== null && _d !== void 0 ? _d : storeLoadOptions.skip) !== null && _e !== void 0 ? _e : 0;
    for (var i = 0; i < take; i += 1) {
      var localIndex = fromEnd ? take - 1 - i : i;
      var cacheItemIndex = localIndex + skip;
      var cacheItem = cachedItems[cacheItemIndex];
      if (cacheItem === undefined && cacheItemIndex in cachedItems) {
        return true;
      }
      var item = getItemFromCache(options, cacheItem, groupCount, localIndex, take);
      if (item) {
        items.push(item);
      } else {
        return false;
      }
    }
    return true;
  }
  return false;
};
export var getItemFromCache = function getItemFromCache(options, cacheItem, groupCount, index, take) {
  if (groupCount && cacheItem) {
    var skips = index === 0 && options.skips || [];
    var takes = index === take - 1 && options.takes || [];
    return getGroupItemFromCache(cacheItem, groupCount, skips, takes);
  }
  return cacheItem;
};
export var getGroupItemFromCache = function getGroupItemFromCache(cacheItem, groupCount, skips, takes) {
  if (groupCount && cacheItem) {
    var result = _extends({}, cacheItem);
    var skip = skips[0] || 0;
    var take = takes[0];
    var {
      items
    } = cacheItem;
    if (items) {
      if (take === undefined && !items[skip]) {
        return;
      }
      result.items = [];
      if (skips.length) {
        result.isContinuation = true;
      }
      if (take) {
        result.isContinuationOnNextPage = cacheItem.count > take;
      }
      for (var i = 0; take === undefined ? items[i + skip] : i < take; i += 1) {
        var childCacheItem = items[i + skip];
        var isLast = i + 1 === take;
        var item = getGroupItemFromCache(childCacheItem, groupCount - 1, i === 0 ? skips.slice(1) : [], isLast ? takes.slice(1) : []);
        if (item !== undefined) {
          result.items.push(item);
        } else {
          return;
        }
      }
    }
    return result;
  }
  return cacheItem;
};
export var updatePagingOptionsByCache = function updatePagingOptionsByCache(cacheItemsFromBegin, options, groupCount) {
  var _a, _b;
  var cacheItemBeginCount = cacheItemsFromBegin.length;
  var {
    storeLoadOptions
  } = options;
  if (storeLoadOptions.skip !== undefined && storeLoadOptions.take && !groupCount) {
    var cacheItemsFromEnd = [];
    fillItemsFromCache(cacheItemsFromEnd, options, groupCount, true);
    var cacheItemEndCount = cacheItemsFromEnd.length;
    if (cacheItemBeginCount || cacheItemEndCount) {
      options.skip = (_a = options.skip) !== null && _a !== void 0 ? _a : storeLoadOptions.skip;
      options.take = (_b = options.take) !== null && _b !== void 0 ? _b : storeLoadOptions.take;
    }
    if (cacheItemBeginCount) {
      storeLoadOptions.skip += cacheItemBeginCount;
      storeLoadOptions.take -= cacheItemBeginCount;
      options.cachedDataPartBegin = cacheItemsFromBegin;
    }
    if (cacheItemEndCount) {
      storeLoadOptions.take -= cacheItemEndCount;
      options.cachedDataPartEnd = cacheItemsFromEnd.reverse();
    }
  }
};
export var setPageDataToCache = function setPageDataToCache(options, data, groupCount) {
  var _a, _b, _c, _d;
  var {
    storeLoadOptions
  } = options;
  var skip = (_b = (_a = options.skip) !== null && _a !== void 0 ? _a : storeLoadOptions.skip) !== null && _b !== void 0 ? _b : 0;
  var take = (_d = (_c = options.take) !== null && _c !== void 0 ? _c : storeLoadOptions.take) !== null && _d !== void 0 ? _d : 0;
  for (var i = 0; i < take; i += 1) {
    var globalIndex = i + skip;
    var cacheItems = options.cachedData.items;
    var skips = i === 0 && options.skips || [];
    cacheItems[globalIndex] = getCacheItem(cacheItems[globalIndex], data[i], groupCount, skips);
  }
};
export var getCacheItem = function getCacheItem(cacheItem, loadedItem, groupCount, skips) {
  if (groupCount && loadedItem) {
    var result = _extends({}, loadedItem);
    delete result.isContinuation;
    delete result.isContinuationOnNextPage;
    var skip = skips[0] || 0;
    if (loadedItem.items) {
      result.items = (cacheItem === null || cacheItem === void 0 ? void 0 : cacheItem.items) || {};
      loadedItem.items.forEach((item, index) => {
        var globalIndex = index + skip;
        var childSkips = index === 0 ? skips.slice(1) : [];
        result.items[globalIndex] = getCacheItem(result.items[globalIndex], item, groupCount - 1, childSkips);
      });
    }
    return result;
  }
  return loadedItem;
};