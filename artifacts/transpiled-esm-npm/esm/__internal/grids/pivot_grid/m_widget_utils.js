import domAdapter from '../../../core/dom_adapter';
import coreAjaxUtils from '../../../core/utils/ajax';
import callOnce from '../../../core/utils/call_once';
import { compileGetter } from '../../../core/utils/data';
import { Deferred, when } from '../../../core/utils/deferred';
import { extend } from '../../../core/utils/extend';
import { each, map } from '../../../core/utils/iterator';
import { isDefined, isNumeric, type } from '../../../core/utils/type';
import ArrayStore from '../../../data/array_store';
import { DataSource } from '../../../data/data_source/data_source';
import formatHelper from '../../../format_helper';
import localizationDate from '../../../localization/date';
import { CLASSES } from './const';
var setFieldProperty = function setFieldProperty(field, property, value, isInitialization) {
  var initProperties = field._initProperties = field._initProperties || {};
  var initValue = isInitialization ? value : field[property];
  var needInitProperty = !Object.prototype.hasOwnProperty.call(initProperties, property) || isInitialization;
  if (needInitProperty && property !== '_initProperties') {
    initProperties[property] = initValue;
  }
  field[property] = value;
};
function sendRequest(options) {
  return coreAjaxUtils.sendRequest(options);
}
var foreachTreeAsyncDate = new Date();
function createForeachTreeFunc(isAsync) {
  var foreachTreeFunc = function foreachTreeFunc(items, callback, parentAtFirst, members, index, isChildrenProcessing) {
    members = members || [];
    items = items || [];
    var i;
    var deferred;
    index = index || 0;
    function createForeachTreeAsyncHandler(deferred, i, isChildrenProcessing) {
      when(foreachTreeFunc(items, callback, parentAtFirst, members, i, isChildrenProcessing)).done(deferred.resolve);
    }
    for (i = index; i < items.length; i += 1) {
      if (isAsync && i > index && i % 10000 === 0 && new Date() - foreachTreeAsyncDate >= 300) {
        foreachTreeAsyncDate = new Date();
        // @ts-expect-error
        deferred = new Deferred();
        createForeachTreeAsyncHandler(deferred, i, false);
        return deferred;
      }
      var item = items[i];
      if (!isChildrenProcessing) {
        members.unshift(item);
        if (parentAtFirst && callback(members, i) === false) {
          return undefined;
        }
        if (item.children) {
          var childrenDeferred = foreachTreeFunc(item.children, callback, parentAtFirst, members);
          if (isAsync && childrenDeferred) {
            // @ts-expect-error
            deferred = new Deferred();
            childrenDeferred.done(createForeachTreeAsyncHandler(deferred, i, true));
            return deferred;
          }
        }
      }
      isChildrenProcessing = false;
      if (!parentAtFirst && callback(members, i) === false) {
        return undefined;
      }
      members.shift();
      if (items[i] !== item) {
        i -= 1;
      }
    }
    return undefined;
  };
  return foreachTreeFunc;
}
var foreachTree = createForeachTreeFunc(false);
var foreachTreeAsync = createForeachTreeFunc(true);
function findField(fields, id) {
  if (fields && isDefined(id)) {
    for (var i = 0; i < fields.length; i += 1) {
      var field = fields[i];
      if (field.name === id || field.caption === id || field.dataField === id || field.index === id) {
        return i;
      }
    }
  }
  return -1;
}
function formatValue(value, options) {
  // because isNaN function works incorrectly with strings and undefined (T889965)
  var valueText = value === value && formatHelper.format(value, options.format);
  var formatObject = {
    value,
    valueText: valueText || ''
  };
  return options.customizeText ? options.customizeText.call(options, formatObject) : formatObject.valueText;
}
function getCompareFunction(valueSelector) {
  return function (a, b) {
    var result = 0;
    var valueA = valueSelector(a);
    var valueB = valueSelector(b);
    var aIsDefined = isDefined(valueA);
    var bIsDefined = isDefined(valueB);
    if (aIsDefined && bIsDefined) {
      if (valueA > valueB) {
        result = 1;
      } else if (valueA < valueB) {
        result = -1;
      }
    }
    if (aIsDefined && !bIsDefined) {
      result = 1;
    }
    if (!aIsDefined && bIsDefined) {
      result = -1;
    }
    return result;
  };
}
function createPath(items) {
  var result = [];
  for (var i = items.length - 1; i >= 0; i -= 1) {
    result.push(items[i].key || items[i].value);
  }
  return result;
}
function foreachDataLevel(data, callback, index, childrenField) {
  index = index || 0;
  childrenField = childrenField || 'children';
  if (data.length) {
    callback(data, index);
  }
  for (var i = 0; i < data.length; i += 1) {
    var item = data[i];
    if (item[childrenField] && item[childrenField].length) {
      foreachDataLevel(item[childrenField], callback, index + 1, childrenField);
    }
  }
}
function mergeArraysByMaxValue(values1, values2) {
  var result = [];
  for (var i = 0; i < values1.length; i += 1) {
    result.push(Math.max(values1[i] || 0, values2[i] || 0));
  }
  return result;
}
function getExpandedLevel(options, axisName) {
  var dimensions = options[axisName];
  var expandLevel = 0;
  var expandedPaths = (axisName === 'columns' ? options.columnExpandedPaths : options.rowExpandedPaths) || [];
  if (options.headerName === axisName) {
    expandLevel = options.path.length;
  } else if (options.headerName && options.headerName !== axisName && options.oppositePath) {
    expandLevel = options.oppositePath.length;
  } else {
    each(expandedPaths, (_, path) => {
      expandLevel = Math.max(expandLevel, path.length);
    });
  }
  while (dimensions[expandLevel + 1] && dimensions[expandLevel].expanded) {
    expandLevel += 1;
  }
  return expandLevel;
}
function createGroupFields(item) {
  return map(['year', 'quarter', 'month'], (value, index) => extend({}, item, {
    groupInterval: value,
    groupIndex: index
  }));
}
function parseFields(dataSource, fieldsList, path, fieldsDataType) {
  var result = [];
  Object.keys(fieldsList || []).forEach(field => {
    if (field && field.startsWith('__')) return;
    var dataIndex = 1;
    var currentPath = path.length ? "".concat(path, ".").concat(field) : field;
    var dataType = fieldsDataType[currentPath];
    var getter = compileGetter(currentPath);
    var value = fieldsList[field];
    var items;
    while (!isDefined(value) && dataSource[dataIndex]) {
      value = getter(dataSource[dataIndex]);
      dataIndex += 1;
    }
    if (!dataType && isDefined(value)) {
      dataType = type(value);
    }
    items = [{
      dataField: currentPath,
      dataType,
      groupName: dataType === 'date' ? field : undefined,
      groupInterval: undefined,
      displayFolder: path
    }];
    if (dataType === 'date') {
      items = items.concat(createGroupFields(items[0]));
    } else if (dataType === 'object') {
      items = parseFields(dataSource, value, currentPath, fieldsDataType);
    }
    result.push.apply(result, items);
  });
  return result;
}
function discoverObjectFields(items, fields) {
  var fieldsDataType = getFieldsDataType(fields);
  return parseFields(items, items[0], '', fieldsDataType);
}
function getFieldsDataType(fields) {
  var result = {};
  each(fields, (_, field) => {
    result[field.dataField] = result[field.dataField] || field.dataType;
  });
  return result;
}
var DATE_INTERVAL_FORMATS = {
  month(value) {
    return localizationDate.getMonthNames()[value - 1];
  },
  quarter(value) {
    return localizationDate.format(new Date(2000, value * 3 - 1), 'quarter');
  },
  dayOfWeek(value) {
    return localizationDate.getDayNames()[value];
  }
};
function setDefaultFieldValueFormatting(field) {
  if (field.dataType === 'date') {
    if (!field.format) {
      setFieldProperty(field, 'format', DATE_INTERVAL_FORMATS[field.groupInterval]);
    }
  } else if (field.dataType === 'number') {
    var groupInterval = isNumeric(field.groupInterval) && field.groupInterval > 0 && field.groupInterval;
    if (groupInterval && !field.customizeText) {
      setFieldProperty(field, 'customizeText', formatObject => {
        var secondValue = formatObject.value + groupInterval;
        var secondValueText = formatHelper.format(secondValue, field.format);
        return formatObject.valueText && secondValueText ? "".concat(formatObject.valueText, " - ").concat(secondValueText) : '';
      });
    }
  }
}
function getFiltersByPath(fields, path) {
  var result = [];
  path = path || [];
  for (var i = 0; i < path.length; i += 1) {
    result.push(extend({}, fields[i], {
      groupIndex: null,
      groupName: null,
      filterType: 'include',
      filterValues: [path[i]]
    }));
  }
  return result;
}
var storeDrillDownMixin = {
  createDrillDownDataSource(descriptions, params) {
    var items = this.getDrillDownItems(descriptions, params);
    var arrayStore;
    function createCustomStoreMethod(methodName) {
      return function (options) {
        var d;
        if (arrayStore) {
          d = arrayStore[methodName](options);
        } else {
          // @ts-expect-error
          d = new Deferred();
          when(items).done(data => {
            var arrayStore = new ArrayStore(data);
            arrayStore[methodName](options).done(d.resolve).fail(d.reject);
          }).fail(d.reject);
        }
        return d;
      };
    }
    var dataSource = new DataSource({
      load: createCustomStoreMethod('load'),
      totalCount: createCustomStoreMethod('totalCount'),
      key: this.key()
    });
    return dataSource;
  }
};
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
var getScrollbarWidth = containerElement => containerElement.offsetWidth - containerElement.clientWidth;
var calculateScrollbarWidth = callOnce(() => {
  var document = domAdapter.getDocument();
  document.body.insertAdjacentHTML('beforeend', "<div class=\"".concat(CLASSES.scrollBarMeasureElement, "\"></div>"));
  var scrollbar = document.body.lastElementChild;
  var scrollbarWidth = getScrollbarWidth(scrollbar);
  if (scrollbar) {
    document.body.removeChild(scrollbar);
  }
  return scrollbarWidth;
});
export default {
  setFieldProperty,
  sendRequest,
  foreachTree,
  foreachTreeAsync,
  findField,
  formatValue,
  getCompareFunction,
  createPath,
  foreachDataLevel,
  mergeArraysByMaxValue,
  getExpandedLevel,
  discoverObjectFields,
  getFieldsDataType,
  setDefaultFieldValueFormatting,
  getFiltersByPath,
  storeDrillDownMixin,
  capitalizeFirstLetter,
  getScrollbarWidth,
  calculateScrollbarWidth
};
export { calculateScrollbarWidth, capitalizeFirstLetter, createPath, discoverObjectFields, findField, foreachDataLevel, foreachTree, foreachTreeAsync, formatValue, getCompareFunction, getExpandedLevel, getFieldsDataType, getFiltersByPath, getScrollbarWidth, mergeArraysByMaxValue, sendRequest, setDefaultFieldValueFormatting, setFieldProperty, storeDrillDownMixin };