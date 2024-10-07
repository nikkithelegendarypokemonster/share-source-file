"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateOptions = validateOptions;
function getPageSize(pageSize) {
  if (pageSize < 1) {
    return 1;
  }
  return pageSize;
}
function getItemCount(itemCount) {
  if (itemCount < 0) {
    return 0;
  }
  return itemCount;
}
function getPageCount(pageSize, itemCount) {
  if (pageSize > 0 && itemCount > 0) {
    return Math.max(1, Math.ceil(itemCount / pageSize));
  }
  return 1;
}
function getPageIndex(pageIndex, pageSize, itemCount) {
  if (pageIndex < 1) {
    return 1;
  }
  const pageCount = getPageCount(pageSize, itemCount);
  return Math.min(pageIndex, pageCount);
}
function validateOptions(oldPageSize, oldPageIndex, oldItemCount) {
  const pageSize = getPageSize(oldPageSize);
  const itemCount = getItemCount(oldItemCount);
  const pageCount = getPageCount(pageSize, oldItemCount);
  const pageIndex = getPageIndex(oldPageIndex, pageSize, itemCount);
  return {
    pageSize,
    pageIndex,
    totalCount: itemCount,
    pageCount
  };
}