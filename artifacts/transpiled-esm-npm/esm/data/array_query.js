import Class from '../core/class';
import { isFunction, isDefined, isString } from '../core/utils/type';
import { each, map } from '../core/utils/iterator';
import { compileGetter, toComparable } from '../core/utils/data';
import { Deferred } from '../core/utils/deferred';
import { errors, handleError as handleDataError } from './errors';
import { aggregators, isGroupCriterion, isUnaryOperation, normalizeBinaryCriterion, isUniformEqualsByOr, isConjunctiveOperator as isConjunctiveOperatorChecker } from './utils';
var Iterator = Class.inherit({
  toArray: function toArray() {
    var result = [];
    this.reset();
    while (this.next()) {
      result.push(this.current());
    }
    return result;
  },
  countable: function countable() {
    return false;
  }
});
var ArrayIterator = Iterator.inherit({
  ctor: function ctor(array) {
    this.array = array;
    this.index = -1;
  },
  next: function next() {
    if (this.index + 1 < this.array.length) {
      this.index++;
      return true;
    }
    return false;
  },
  current: function current() {
    return this.array[this.index];
  },
  reset: function reset() {
    this.index = -1;
  },
  toArray: function toArray() {
    return this.array.slice(0);
  },
  countable: function countable() {
    return true;
  },
  count: function count() {
    return this.array.length;
  }
});
var WrappedIterator = Iterator.inherit({
  ctor: function ctor(iter) {
    this.iter = iter;
  },
  next: function next() {
    return this.iter.next();
  },
  current: function current() {
    return this.iter.current();
  },
  reset: function reset() {
    return this.iter.reset();
  }
});
var MapIterator = WrappedIterator.inherit({
  ctor: function ctor(iter, mapper) {
    this.callBase(iter);
    this.index = -1;
    this.mapper = mapper;
  },
  current: function current() {
    return this.mapper(this.callBase(), this.index);
  },
  next: function next() {
    var hasNext = this.callBase();
    if (hasNext) {
      this.index++;
    }
    return hasNext;
  }
});
var defaultCompare = function defaultCompare(xValue, yValue, options) {
  if (isString(xValue) && isString(yValue) && (options !== null && options !== void 0 && options.locale || options !== null && options !== void 0 && options.collatorOptions)) {
    /* eslint-disable-next-line no-undef */
    return new Intl.Collator((options === null || options === void 0 ? void 0 : options.locale) || undefined, (options === null || options === void 0 ? void 0 : options.collatorOptions) || undefined).compare(xValue, yValue);
  }
  xValue = toComparable(xValue, false, options);
  yValue = toComparable(yValue, false, options);
  if (xValue === null && yValue !== null) {
    return -1;
  }
  if (xValue !== null && yValue === null) {
    return 1;
  }
  if (xValue === undefined && yValue !== undefined) {
    return 1;
  }
  if (xValue !== undefined && yValue === undefined) {
    return -1;
  }
  if (xValue < yValue) {
    return -1;
  }
  if (xValue > yValue) {
    return 1;
  }
  return 0;
};
var SortIterator = Iterator.inherit({
  ctor: function ctor(iter, getter, desc, compare) {
    this.langParams = iter.langParams;
    if (!(iter instanceof MapIterator)) {
      iter = new MapIterator(iter, this._wrap);
      iter.langParams = this.langParams;
    }
    this.iter = iter;
    this.rules = [{
      getter: getter,
      desc: desc,
      compare: compare,
      langParams: this.langParams
    }];
  },
  thenBy: function thenBy(getter, desc, compare) {
    var result = new SortIterator(this.sortedIter || this.iter, getter, desc, compare);
    if (!this.sortedIter) {
      result.rules = this.rules.concat(result.rules);
    }
    return result;
  },
  next: function next() {
    this._ensureSorted();
    return this.sortedIter.next();
  },
  current: function current() {
    this._ensureSorted();
    return this.sortedIter.current();
  },
  reset: function reset() {
    delete this.sortedIter;
  },
  countable: function countable() {
    return this.sortedIter || this.iter.countable();
  },
  count: function count() {
    if (this.sortedIter) {
      return this.sortedIter.count();
    }
    return this.iter.count();
  },
  _ensureSorted: function _ensureSorted() {
    var that = this;
    if (that.sortedIter) {
      return;
    }
    each(that.rules, function () {
      this.getter = compileGetter(this.getter);
    });
    that.sortedIter = new MapIterator(new ArrayIterator(this.iter.toArray().sort(function (x, y) {
      return that._compare(x, y);
    })), that._unwrap);
  },
  _wrap: function _wrap(record, index) {
    return {
      index: index,
      value: record
    };
  },
  _unwrap: function _unwrap(wrappedItem) {
    return wrappedItem.value;
  },
  _getDefaultCompare(langParams) {
    return (xValue, yValue) => defaultCompare(xValue, yValue, langParams);
  },
  _compare: function _compare(x, y) {
    var xIndex = x.index;
    var yIndex = y.index;
    x = x.value;
    y = y.value;
    if (x === y) {
      return xIndex - yIndex;
    }
    for (var i = 0, rulesCount = this.rules.length; i < rulesCount; i++) {
      var rule = this.rules[i];
      var xValue = rule.getter(x);
      var yValue = rule.getter(y);
      var compare = rule.compare || this._getDefaultCompare(rule.langParams);
      var compareResult = compare(xValue, yValue);
      if (compareResult) {
        return rule.desc ? -compareResult : compareResult;
      }
    }
    return xIndex - yIndex;
  }
});
var compileCriteria = function () {
  var langParams = {};
  var _toComparable = value => toComparable(value, false, langParams);
  var compileUniformEqualsCriteria = crit => {
    var getter = compileGetter(crit[0][0]);
    var filterValues = crit.reduce((acc, item, i) => {
      if (i % 2 === 0) {
        acc.push(_toComparable(item[2]));
      }
      return acc;
    }, []);
    return obj => {
      var value = _toComparable(getter(obj));
      return filterValues.some(filterValue => useStrictComparison(filterValue) ? value === filterValue
      // eslint-disable-next-line eqeqeq
      : value == filterValue);
    };
  };
  var compileGroup = function compileGroup(crit) {
    if (isUniformEqualsByOr(crit)) {
      return compileUniformEqualsCriteria(crit);
    }
    var ops = [];
    var isConjunctiveOperator = false;
    var isConjunctiveNextOperator = false;
    each(crit, function () {
      if (Array.isArray(this) || isFunction(this)) {
        if (ops.length > 1 && isConjunctiveOperator !== isConjunctiveNextOperator) {
          throw new errors.Error('E4019');
        }
        ops.push(compileCriteria(this, langParams));
        isConjunctiveOperator = isConjunctiveNextOperator;
        isConjunctiveNextOperator = true;
      } else {
        isConjunctiveNextOperator = isConjunctiveOperatorChecker(this);
      }
    });
    return function (d) {
      var result = isConjunctiveOperator;
      for (var i = 0; i < ops.length; i++) {
        if (ops[i](d) !== isConjunctiveOperator) {
          result = !isConjunctiveOperator;
          break;
        }
      }
      return result;
    };
  };
  var toString = function toString(value) {
    var _langParams;
    return isDefined(value) ? (_langParams = langParams) !== null && _langParams !== void 0 && _langParams.locale ? value.toLocaleString(langParams.locale) : value.toString() : '';
  };
  var compileBinary = function compileBinary(crit) {
    crit = normalizeBinaryCriterion(crit);
    var getter = compileGetter(crit[0]);
    var op = crit[1];
    var value = crit[2];
    value = _toComparable(value);
    var compare = (obj, operatorFn) => {
      obj = _toComparable(getter(obj));
      return (value == null || obj == null) && value !== obj ? false : operatorFn(obj, value);
    };
    switch (op.toLowerCase()) {
      case '=':
        return compileEquals(getter, value);
      case '<>':
        return compileEquals(getter, value, true);
      case '>':
        return obj => compare(obj, (a, b) => a > b);
      case '<':
        return obj => compare(obj, (a, b) => a < b);
      case '>=':
        return obj => compare(obj, (a, b) => a >= b);
      case '<=':
        return obj => compare(obj, (a, b) => a <= b);
      case 'startswith':
        return function (obj) {
          return _toComparable(toString(getter(obj))).indexOf(value) === 0;
        };
      case 'endswith':
        return function (obj) {
          var getterValue = _toComparable(toString(getter(obj)));
          var searchValue = toString(value);
          if (getterValue.length < searchValue.length) {
            return false;
          }
          var index = getterValue.lastIndexOf(value);
          return index !== -1 && index === getterValue.length - value.length;
        };
      case 'contains':
        return function (obj) {
          return _toComparable(toString(getter(obj))).indexOf(value) > -1;
        };
      case 'notcontains':
        return function (obj) {
          return _toComparable(toString(getter(obj))).indexOf(value) === -1;
        };
    }
    throw errors.Error('E4003', op);
  };
  function compileEquals(getter, value, negate) {
    return function (obj) {
      obj = _toComparable(getter(obj));
      // eslint-disable-next-line eqeqeq
      var result = useStrictComparison(value) ? obj === value : obj == value;
      if (negate) {
        result = !result;
      }
      return result;
    };
  }
  function useStrictComparison(value) {
    return value === '' || value === 0 || value === false;
  }
  function compileUnary(crit) {
    var op = crit[0];
    var criteria = compileCriteria(crit[1], langParams);
    if (op === '!') {
      return function (obj) {
        return !criteria(obj);
      };
    }
    throw errors.Error('E4003', op);
  }
  return function (crit, options) {
    langParams = options || {};
    if (isFunction(crit)) {
      return crit;
    }
    if (isGroupCriterion(crit)) {
      return compileGroup(crit);
    }
    if (isUnaryOperation(crit)) {
      return compileUnary(crit);
    }
    return compileBinary(crit);
  };
}();
var FilterIterator = WrappedIterator.inherit({
  ctor: function ctor(iter, criteria) {
    this.callBase(iter);
    this.langParams = iter.langParams;
    this.criteria = compileCriteria(criteria, this.langParams);
  },
  next: function next() {
    while (this.iter.next()) {
      if (this.criteria(this.current())) {
        return true;
      }
    }
    return false;
  }
});
var GroupIterator = Iterator.inherit({
  ctor: function ctor(iter, getter) {
    this.iter = iter;
    this.getter = getter;
  },
  next: function next() {
    this._ensureGrouped();
    return this.groupedIter.next();
  },
  current: function current() {
    this._ensureGrouped();
    return this.groupedIter.current();
  },
  reset: function reset() {
    delete this.groupedIter;
  },
  countable: function countable() {
    return !!this.groupedIter;
  },
  count: function count() {
    return this.groupedIter.count();
  },
  _ensureGrouped: function _ensureGrouped() {
    if (this.groupedIter) {
      return;
    }
    var hash = {};
    var keys = [];
    var iter = this.iter;
    var getter = compileGetter(this.getter);
    iter.reset();
    while (iter.next()) {
      var current = iter.current();
      var key = getter(current);
      if (key in hash) {
        hash[key].push(current);
      } else {
        hash[key] = [current];
        keys.push(key);
      }
    }
    this.groupedIter = new ArrayIterator(map(keys, function (key) {
      return {
        key: key,
        items: hash[key]
      };
    }));
  }
});
var SelectIterator = WrappedIterator.inherit({
  ctor: function ctor(iter, getter) {
    this.callBase(iter);
    this.getter = compileGetter(getter);
  },
  current: function current() {
    return this.getter(this.callBase());
  },
  countable: function countable() {
    return this.iter.countable();
  },
  count: function count() {
    return this.iter.count();
  }
});
var SliceIterator = WrappedIterator.inherit({
  ctor: function ctor(iter, skip, take) {
    this.callBase(iter);
    this.skip = Math.max(0, skip);
    this.take = Math.max(0, take);
    this.pos = 0;
  },
  next: function next() {
    if (this.pos >= this.skip + this.take) {
      return false;
    }
    while (this.pos < this.skip && this.iter.next()) {
      this.pos++;
    }
    this.pos++;
    return this.iter.next();
  },
  reset: function reset() {
    this.callBase();
    this.pos = 0;
  },
  countable: function countable() {
    return this.iter.countable();
  },
  count: function count() {
    return Math.min(this.iter.count() - this.skip, this.take);
  }
});
var arrayQueryImpl = function arrayQueryImpl(iter, queryOptions) {
  queryOptions = queryOptions || {};
  if (!(iter instanceof Iterator)) {
    iter = new ArrayIterator(iter);
  }
  if (queryOptions.langParams) {
    iter.langParams = queryOptions.langParams;
  }
  var handleError = function handleError(error) {
    var handler = queryOptions.errorHandler;
    if (handler) {
      handler(error);
    }
    handleDataError(error);
  };
  var aggregateCore = function aggregateCore(aggregator) {
    var d = new Deferred().fail(handleError);
    var seed;
    var step = aggregator.step;
    var finalize = aggregator.finalize;
    try {
      iter.reset();
      if ('seed' in aggregator) {
        seed = aggregator.seed;
      } else {
        seed = iter.next() ? iter.current() : NaN;
      }
      var accumulator = seed;
      while (iter.next()) {
        accumulator = step(accumulator, iter.current());
      }
      d.resolve(finalize ? finalize(accumulator) : accumulator);
    } catch (x) {
      d.reject(x);
    }
    return d.promise();
  };
  var aggregate = function aggregate(seed, step, finalize) {
    if (arguments.length < 2) {
      return aggregateCore({
        step: arguments[0]
      });
    }
    return aggregateCore({
      seed: seed,
      step: step,
      finalize: finalize
    });
  };
  var standardAggregate = function standardAggregate(name) {
    return aggregateCore(aggregators[name]);
  };
  var select = function select(getter) {
    if (!isFunction(getter) && !Array.isArray(getter)) {
      getter = [].slice.call(arguments);
    }
    return chainQuery(new SelectIterator(iter, getter));
  };
  var selectProp = function selectProp(name) {
    return select(compileGetter(name));
  };
  function chainQuery(iter) {
    return arrayQueryImpl(iter, queryOptions);
  }
  return {
    toArray: function toArray() {
      return iter.toArray();
    },
    enumerate: function enumerate() {
      var d = new Deferred().fail(handleError);
      try {
        d.resolve(iter.toArray());
      } catch (x) {
        d.reject(x);
      }
      return d.promise();
    },
    setLangParams(options) {
      iter.langParams = options;
    },
    sortBy: function sortBy(getter, desc, compare) {
      return chainQuery(new SortIterator(iter, getter, desc, compare));
    },
    thenBy: function thenBy(getter, desc, compare) {
      if (iter instanceof SortIterator) {
        return chainQuery(iter.thenBy(getter, desc, compare));
      }
      throw errors.Error('E4004');
    },
    filter: function filter(criteria) {
      if (!Array.isArray(criteria)) {
        criteria = [].slice.call(arguments);
      }
      return chainQuery(new FilterIterator(iter, criteria));
    },
    slice: function slice(skip, take) {
      if (take === undefined) {
        take = Number.MAX_VALUE;
      }
      return chainQuery(new SliceIterator(iter, skip, take));
    },
    select: select,
    groupBy: function groupBy(getter) {
      return chainQuery(new GroupIterator(iter, getter));
    },
    aggregate: aggregate,
    count: function count() {
      if (iter.countable()) {
        var d = new Deferred().fail(handleError);
        try {
          d.resolve(iter.count());
        } catch (x) {
          d.reject(x);
        }
        return d.promise();
      }
      return standardAggregate('count');
    },
    sum: function sum(getter) {
      if (getter) {
        return selectProp(getter).sum();
      }
      return standardAggregate('sum');
    },
    min: function min(getter) {
      if (getter) {
        return selectProp(getter).min();
      }
      return standardAggregate('min');
    },
    max: function max(getter) {
      if (getter) {
        return selectProp(getter).max();
      }
      return standardAggregate('max');
    },
    avg: function avg(getter) {
      if (getter) {
        return selectProp(getter).avg();
      }
      return standardAggregate('avg');
    }
  };
};
export default arrayQueryImpl;