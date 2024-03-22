import { map } from '../../../../core/utils/iterator';
import { isDefined } from '../../../../core/utils/type';
import { createPath, findField, foreachDataLevel, foreachTree, getCompareFunction } from '../m_widget_utils';
function sort(loadOptions, dataSource, getAscOrder) {
  sortDimension(dataSource, loadOptions, 'rows', getAscOrder);
  sortDimension(dataSource, loadOptions, 'columns', getAscOrder);
}
function sortDimension(dataSource, loadOptions, dimensionName, getAscOrder) {
  var fields = loadOptions[dimensionName] || [];
  var baseIndex = loadOptions.headerName === dimensionName ? loadOptions.path.length : 0;
  var sortingMethodByLevel = [];
  foreachDataLevel(dataSource[dimensionName], (item, index) => {
    var field = fields[index] || {};
    var sortingMethod = sortingMethodByLevel[index] = sortingMethodByLevel[index] || getSortingMethod(field, dataSource, loadOptions, dimensionName, getAscOrder);
    item.sort(sortingMethod);
  }, baseIndex);
}
function getSortingMethod(field, dataSource, loadOptions, dimensionName, getAscOrder) {
  var sortOrder = getAscOrder ? 'asc' : field.sortOrder;
  var sortBy = getMemberForSortBy(field.sortBy, getAscOrder);
  var defaultCompare = field.sortingMethod ? function (a, b) {
    return field.sortingMethod(a, b);
  } : getCompareFunction(item => item[sortBy]);
  var summaryValueSelector = !getAscOrder && getFieldSummaryValueSelector(field, dataSource, loadOptions, dimensionName);
  var summaryCompare = summaryValueSelector && getCompareFunction(summaryValueSelector);
  var sortingMethod = function sortingMethod(a, b) {
    var result = summaryCompare && summaryCompare(a, b) || defaultCompare(a, b);
    return sortOrder === 'desc' ? -result : result;
  };
  return sortingMethod;
}
function getFieldSummaryValueSelector(field, dataSource, loadOptions, dimensionName) {
  var {
    values
  } = dataSource;
  var sortBySummaryFieldIndex = findField(loadOptions.values, field.sortBySummaryField);
  var areRows = dimensionName === 'rows';
  var sortByDimension = areRows ? dataSource.columns : dataSource.rows;
  var grandTotalIndex = areRows ? dataSource.grandTotalRowIndex : dataSource.grandTotalColumnIndex;
  var sortBySummaryPath = field.sortBySummaryPath || [];
  var sliceIndex = sortBySummaryPath.length ? getSliceIndex(sortByDimension, sortBySummaryPath) : grandTotalIndex;
  if (values && values.length && sortBySummaryFieldIndex >= 0 && isDefined(sliceIndex)) {
    return function (field) {
      var rowIndex = areRows ? field.index : sliceIndex;
      var columnIndex = areRows ? sliceIndex : field.index;
      var value = ((values[rowIndex] || [[]])[columnIndex] || [])[sortBySummaryFieldIndex];
      return isDefined(value) ? value : null;
    };
  }
  return undefined;
}
function getMemberForSortBy(sortBy, getAscOrder) {
  var member = 'text';
  if (sortBy === 'none') {
    member = 'index';
  } else if (getAscOrder || sortBy !== 'displayText') {
    member = 'value';
  }
  return member;
}
function getSliceIndex(items, path) {
  var index = null;
  var pathValue = (path || []).join('.');
  if (pathValue.length) {
    foreachTree(items, items => {
      var item = items[0];
      var itemPath = createPath(items).join('.');
      var textPath = map(items, item => item.text).reverse().join('.');
      if (pathValue === itemPath || item.key && textPath === pathValue) {
        index = items[0].index;
        return false;
      }
      return undefined;
    });
  }
  return index;
}
export default {
  sort
};
export { sort };