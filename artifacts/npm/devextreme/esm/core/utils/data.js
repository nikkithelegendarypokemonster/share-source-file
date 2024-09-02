/**
* DevExtreme (esm/core/utils/data.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import errors from '../errors';
import Class from '../class';
import { deepExtendArraySafe } from './object';
import { isObject, isPlainObject, isFunction, isDefined } from './type';
import { each } from './iterator';
import variableWrapper from './variable_wrapper';
const unwrapVariable = variableWrapper.unwrap;
const isWrapped = variableWrapper.isWrapped;
const assign = variableWrapper.assign;
const bracketsToDots = function (expr) {
  return expr.replace(/\[/g, '.').replace(/\]/g, '');
};
export const getPathParts = function (name) {
  return bracketsToDots(name).split('.');
};
const readPropValue = function (obj, propName, options) {
  options = options || {};
  if (propName === 'this') {
    return unwrap(obj, options);
  }
  return unwrap(obj[propName], options);
};
const assignPropValue = function (obj, propName, value, options) {
  if (propName === 'this') {
    throw new errors.Error('E4016');
  }
  const propValue = obj[propName];
  if (options.unwrapObservables && isWrapped(propValue)) {
    assign(propValue, value);
  } else {
    obj[propName] = value;
  }
};
const prepareOptions = function (options) {
  options = options || {};
  options.unwrapObservables = options.unwrapObservables !== undefined ? options.unwrapObservables : true;
  return options;
};
function unwrap(value, options) {
  return options.unwrapObservables ? unwrapVariable(value) : value;
}
export const compileGetter = function (expr) {
  if (arguments.length > 1) {
    expr = [].slice.call(arguments);
  }
  if (!expr || expr === 'this') {
    return function (obj) {
      return obj;
    };
  }
  if (typeof expr === 'string') {
    const path = getPathParts(expr);
    return function (obj, options) {
      options = prepareOptions(options);
      const functionAsIs = options.functionsAsIs;
      const hasDefaultValue = ('defaultValue' in options);
      let current = unwrap(obj, options);
      for (let i = 0; i < path.length; i++) {
        if (!current) {
          if (current == null && hasDefaultValue) {
            return options.defaultValue;
          }
          break;
        }
        const pathPart = path[i];
        if (hasDefaultValue && isObject(current) && !(pathPart in current)) {
          return options.defaultValue;
        }
        let next = unwrap(current[pathPart], options);
        if (!functionAsIs && isFunction(next)) {
          next = next.call(current);
        }
        current = next;
      }
      return current;
    };
  }
  if (Array.isArray(expr)) {
    return combineGetters(expr);
  }
  if (isFunction(expr)) {
    return expr;
  }
};
function combineGetters(getters) {
  const compiledGetters = {};
  for (let i = 0, l = getters.length; i < l; i++) {
    const getter = getters[i];
    compiledGetters[getter] = compileGetter(getter);
  }
  return function (obj, options) {
    let result;
    each(compiledGetters, function (name) {
      const value = this(obj, options);
      if (value === undefined) {
        return;
      }
      let current = result || (result = {});
      const path = name.split('.');
      const last = path.length - 1;
      for (let i = 0; i < last; i++) {
        const pathItem = path[i];
        if (!(pathItem in current)) {
          current[pathItem] = {};
        }
        current = current[pathItem];
      }
      current[path[last]] = value;
    });
    return result;
  };
}
function toLowerCase(value, options) {
  return options !== null && options !== void 0 && options.locale ? value.toLocaleLowerCase(options.locale) : value.toLowerCase();
}
const ensurePropValueDefined = function (obj, propName, value, options) {
  if (isDefined(value)) {
    return value;
  }
  const newValue = {};
  assignPropValue(obj, propName, newValue, options);
  return newValue;
};
export const compileSetter = function (expr) {
  expr = getPathParts(expr || 'this');
  const lastLevelIndex = expr.length - 1;
  return function (obj, value, options) {
    options = prepareOptions(options);
    let currentValue = unwrap(obj, options);
    expr.forEach(function (propertyName, levelIndex) {
      let propertyValue = readPropValue(currentValue, propertyName, options);
      const isPropertyFunc = !options.functionsAsIs && isFunction(propertyValue) && !isWrapped(propertyValue);
      if (levelIndex === lastLevelIndex) {
        if (options.merge && isPlainObject(value) && (!isDefined(propertyValue) || isPlainObject(propertyValue))) {
          propertyValue = ensurePropValueDefined(currentValue, propertyName, propertyValue, options);
          deepExtendArraySafe(propertyValue, value, false, true);
        } else if (isPropertyFunc) {
          currentValue[propertyName](value);
        } else {
          assignPropValue(currentValue, propertyName, value, options);
        }
      } else {
        propertyValue = ensurePropValueDefined(currentValue, propertyName, propertyValue, options);
        if (isPropertyFunc) {
          propertyValue = propertyValue.call(currentValue);
        }
        currentValue = propertyValue;
      }
    });
  };
};
export const toComparable = function (value, caseSensitive) {
  var _options$collatorOpti;
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (value instanceof Date) {
    return value.getTime();
  }
  if (value && value instanceof Class && value.valueOf) {
    return value.valueOf();
  }
  const isCaseSensitive = (options === null || options === void 0 || (_options$collatorOpti = options.collatorOptions) === null || _options$collatorOpti === void 0 ? void 0 : _options$collatorOpti.sensitivity) === 'case' || caseSensitive;
  if (!isCaseSensitive && typeof value === 'string') {
    var _options$collatorOpti2;
    if ((options === null || options === void 0 || (_options$collatorOpti2 = options.collatorOptions) === null || _options$collatorOpti2 === void 0 ? void 0 : _options$collatorOpti2.sensitivity) === 'base') {
      const REMOVE_DIACRITICAL_MARKS_REGEXP = /[\u0300-\u036f]/g;
      value = toLowerCase(value, options).normalize('NFD').replace(REMOVE_DIACRITICAL_MARKS_REGEXP, '');
      return value;
    }
    return toLowerCase(value, options);
  }
  return value;
};
