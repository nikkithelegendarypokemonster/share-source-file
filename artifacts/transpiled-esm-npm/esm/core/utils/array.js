import { isDefined } from './type';
import { orderEach } from './object';
import config from '../config';
function createOccurrenceMap(array) {
  return array.reduce((map, value) => {
    var _map$get;
    var count = ((_map$get = map.get(value)) !== null && _map$get !== void 0 ? _map$get : 0) + 1;
    map.set(value, count);
    return map;
  }, new Map());
}
export var wrapToArray = function wrapToArray(item) {
  return Array.isArray(item) ? item : [item];
};
export var getUniqueValues = function getUniqueValues(values) {
  return [...new Set(values)];
};
export var getIntersection = function getIntersection(firstArray, secondArray) {
  var toRemoveMap = createOccurrenceMap(secondArray);
  return firstArray.filter(value => {
    var occurrencesCount = toRemoveMap.get(value);
    occurrencesCount && toRemoveMap.set(value, occurrencesCount - 1);
    return occurrencesCount;
  });
};
export var removeDuplicates = function removeDuplicates() {
  var from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var toRemove = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var toRemoveMap = createOccurrenceMap(toRemove);
  return from.filter(value => {
    var occurrencesCount = toRemoveMap.get(value);
    occurrencesCount && toRemoveMap.set(value, occurrencesCount - 1);
    return !occurrencesCount;
  });
};
export var normalizeIndexes = function normalizeIndexes(items, indexPropName, currentItem, needIndexCallback) {
  var indexedItems = {};
  var {
    useLegacyVisibleIndex
  } = config();
  var currentIndex = 0;
  var shouldUpdateIndex = item => !isDefined(item[indexPropName]) && (!needIndexCallback || needIndexCallback(item));
  items.forEach(item => {
    var index = item[indexPropName];
    if (index >= 0) {
      indexedItems[index] = indexedItems[index] || [];
      if (item === currentItem) {
        indexedItems[index].unshift(item);
      } else {
        indexedItems[index].push(item);
      }
    } else {
      item[indexPropName] = undefined;
    }
  });
  if (!useLegacyVisibleIndex) {
    items.forEach(item => {
      if (shouldUpdateIndex(item)) {
        while (indexedItems[currentIndex]) {
          currentIndex++;
        }
        indexedItems[currentIndex] = [item];
        currentIndex++;
      }
    });
  }
  currentIndex = 0;
  orderEach(indexedItems, function (index, items) {
    items.forEach(item => {
      if (index >= 0) {
        item[indexPropName] = currentIndex++;
      }
    });
  });
  if (useLegacyVisibleIndex) {
    items.forEach(item => {
      if (shouldUpdateIndex(item)) {
        item[indexPropName] = currentIndex++;
      }
    });
  }
};
export var groupBy = (array, getGroupName) => {
  return array.reduce((groupedResult, item) => {
    var _groupedResult$groupN;
    var groupName = getGroupName(item);
    groupedResult[groupName] = (_groupedResult$groupN = groupedResult[groupName]) !== null && _groupedResult$groupN !== void 0 ? _groupedResult$groupN : [];
    groupedResult[groupName].push(item);
    return groupedResult;
  }, {});
};