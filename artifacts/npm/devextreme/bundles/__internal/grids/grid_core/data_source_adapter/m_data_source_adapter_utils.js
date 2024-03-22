/**
* DevExtreme (bundles/__internal/grids/grid_core/data_source_adapter/m_data_source_adapter_utils.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePagingOptionsByCache = exports.setPageDataToCache = exports.getPageDataFromCache = exports.getItemFromCache = exports.getGroupItemFromCache = exports.getCacheItem = exports.fillItemsFromCache = exports.executeTask = exports.createEmptyCachedData = exports.cloneItems = exports.calculateOperationTypes = void 0;
var _common = require("../../../../core/utils/common");
var _extend = require("../../../../core/utils/extend");
var _type = require("../../../../core/utils/type");
var _m_utils = _interopRequireDefault(require("../m_utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // @ts-expect-error
const cloneItems = function (items, groupCount) {
  if (items) {
    items = items.slice(0);
    if (groupCount) {
      for (let i = 0; i < items.length; i++) {
        items[i] = (0, _extend.extend)({
          key: items[i].key
        }, items[i]);
        items[i].items = cloneItems(items[i].items, groupCount - 1);
      }
    }
  }
  return items;
};
exports.cloneItems = cloneItems;
const calculateOperationTypes = function (loadOptions, lastLoadOptions, isFullReload) {
  let operationTypes = {
    reload: true,
    fullReload: true
  };
  if (lastLoadOptions) {
    operationTypes = {
      sorting: !_m_utils.default.equalSortParameters(loadOptions.sort, lastLoadOptions.sort),
      grouping: !_m_utils.default.equalSortParameters(loadOptions.group, lastLoadOptions.group, true),
      groupExpanding: !_m_utils.default.equalSortParameters(loadOptions.group, lastLoadOptions.group) || lastLoadOptions.groupExpand,
      filtering: !_m_utils.default.equalFilterParameters(loadOptions.filter, lastLoadOptions.filter),
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
exports.calculateOperationTypes = calculateOperationTypes;
const executeTask = function (action, timeout) {
  if ((0, _type.isDefined)(timeout)) {
    (0, _common.executeAsync)(action, timeout);
  } else {
    action();
  }
};
exports.executeTask = executeTask;
const createEmptyCachedData = function () {
  return {
    items: {}
  };
};
exports.createEmptyCachedData = createEmptyCachedData;
const getPageDataFromCache = function (options, updatePaging) {
  const groupCount = _m_utils.default.normalizeSortingInfo(options.group || options.storeLoadOptions.group || options.loadOptions.group).length;
  const items = [];
  if (fillItemsFromCache(items, options, groupCount)) {
    return items;
  }
  if (updatePaging) {
    updatePagingOptionsByCache(items, options, groupCount);
  }
};
exports.getPageDataFromCache = getPageDataFromCache;
const fillItemsFromCache = function (items, options, groupCount, fromEnd) {
  var _a, _b, _c, _d, _e;
  const {
    storeLoadOptions
  } = options;
  const take = (_b = (_a = options.take) !== null && _a !== void 0 ? _a : storeLoadOptions.take) !== null && _b !== void 0 ? _b : 0;
  const cachedItems = (_c = options.cachedData) === null || _c === void 0 ? void 0 : _c.items;
  if (take && cachedItems) {
    const skip = (_e = (_d = options.skip) !== null && _d !== void 0 ? _d : storeLoadOptions.skip) !== null && _e !== void 0 ? _e : 0;
    for (let i = 0; i < take; i += 1) {
      const localIndex = fromEnd ? take - 1 - i : i;
      const cacheItemIndex = localIndex + skip;
      const cacheItem = cachedItems[cacheItemIndex];
      if (cacheItem === undefined && cacheItemIndex in cachedItems) {
        return true;
      }
      const item = getItemFromCache(options, cacheItem, groupCount, localIndex, take);
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
exports.fillItemsFromCache = fillItemsFromCache;
const getItemFromCache = function (options, cacheItem, groupCount, index, take) {
  if (groupCount && cacheItem) {
    const skips = index === 0 && options.skips || [];
    const takes = index === take - 1 && options.takes || [];
    return getGroupItemFromCache(cacheItem, groupCount, skips, takes);
  }
  return cacheItem;
};
exports.getItemFromCache = getItemFromCache;
const getGroupItemFromCache = function (cacheItem, groupCount, skips, takes) {
  if (groupCount && cacheItem) {
    const result = _extends({}, cacheItem);
    const skip = skips[0] || 0;
    const take = takes[0];
    const {
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
      for (let i = 0; take === undefined ? items[i + skip] : i < take; i += 1) {
        const childCacheItem = items[i + skip];
        const isLast = i + 1 === take;
        const item = getGroupItemFromCache(childCacheItem, groupCount - 1, i === 0 ? skips.slice(1) : [], isLast ? takes.slice(1) : []);
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
exports.getGroupItemFromCache = getGroupItemFromCache;
const updatePagingOptionsByCache = function (cacheItemsFromBegin, options, groupCount) {
  var _a, _b;
  const cacheItemBeginCount = cacheItemsFromBegin.length;
  const {
    storeLoadOptions
  } = options;
  if (storeLoadOptions.skip !== undefined && storeLoadOptions.take && !groupCount) {
    const cacheItemsFromEnd = [];
    fillItemsFromCache(cacheItemsFromEnd, options, groupCount, true);
    const cacheItemEndCount = cacheItemsFromEnd.length;
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
exports.updatePagingOptionsByCache = updatePagingOptionsByCache;
const setPageDataToCache = function (options, data, groupCount) {
  var _a, _b, _c, _d;
  const {
    storeLoadOptions
  } = options;
  const skip = (_b = (_a = options.skip) !== null && _a !== void 0 ? _a : storeLoadOptions.skip) !== null && _b !== void 0 ? _b : 0;
  const take = (_d = (_c = options.take) !== null && _c !== void 0 ? _c : storeLoadOptions.take) !== null && _d !== void 0 ? _d : 0;
  for (let i = 0; i < take; i += 1) {
    const globalIndex = i + skip;
    const cacheItems = options.cachedData.items;
    const skips = i === 0 && options.skips || [];
    cacheItems[globalIndex] = getCacheItem(cacheItems[globalIndex], data[i], groupCount, skips);
  }
};
exports.setPageDataToCache = setPageDataToCache;
const getCacheItem = function (cacheItem, loadedItem, groupCount, skips) {
  if (groupCount && loadedItem) {
    const result = _extends({}, loadedItem);
    delete result.isContinuation;
    delete result.isContinuationOnNextPage;
    const skip = skips[0] || 0;
    if (loadedItem.items) {
      result.items = (cacheItem === null || cacheItem === void 0 ? void 0 : cacheItem.items) || {};
      loadedItem.items.forEach((item, index) => {
        const globalIndex = index + skip;
        const childSkips = index === 0 ? skips.slice(1) : [];
        result.items[globalIndex] = getCacheItem(result.items[globalIndex], item, groupCount - 1, childSkips);
      });
    }
    return result;
  }
  return loadedItem;
};
exports.getCacheItem = getCacheItem;
