/**
* DevExtreme (cjs/__internal/data/m_abstract_store.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _class = _interopRequireDefault(require("../../core/class"));
var _events_strategy = require("../../core/events_strategy");
var _common = require("../../core/utils/common");
var _data = require("../../core/utils/data");
var _deferred = require("../../core/utils/deferred");
var _iterator = require("../../core/utils/iterator");
var _type = require("../../core/utils/type");
var _errors = require("../../data/errors");
var _store_helper = _interopRequireDefault(require("../../data/store_helper"));
var _utils = require("../../data/utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // @ts-expect-error
// @ts-expect-error
const {
  abstract
} = _class.default;
const {
  queryByOptions
} = _store_helper.default;
const storeImpl = {};
const Store = _class.default.inherit({
  _langParams: {},
  ctor(options) {
    const that = this;
    options = options || {};
    this._eventsStrategy = new _events_strategy.EventsStrategy(this);
    (0, _iterator.each)(['onLoaded', 'onLoading', 'onInserted', 'onInserting', 'onUpdated', 'onUpdating', 'onPush', 'onRemoved', 'onRemoving', 'onModified', 'onModifying'], (_, optionName) => {
      if (optionName in options) {
        that.on(optionName.slice(2).toLowerCase(), options[optionName]);
      }
    });
    this._key = options.key;
    this._errorHandler = options.errorHandler;
    this._useDefaultSearch = true;
  },
  _clearCache: _common.noop,
  _customLoadOptions() {
    return null;
  },
  key() {
    return this._key;
  },
  keyOf(obj) {
    if (!this._keyGetter) {
      this._keyGetter = (0, _data.compileGetter)(this.key());
    }
    return this._keyGetter(obj);
  },
  _requireKey() {
    if (!this.key()) {
      throw _errors.errors.Error('E4005');
    }
  },
  load(options) {
    const that = this;
    options = options || {};
    this._eventsStrategy.fireEvent('loading', [options]);
    return this._withLock(this._loadImpl(options)).done(result => {
      that._eventsStrategy.fireEvent('loaded', [result, options]);
    });
  },
  _loadImpl(options) {
    if (!(0, _type.isEmptyObject)(this._langParams)) {
      options = options || {};
      options._langParams = _extends({}, this._langParams, options._langParams);
    }
    // @ts-expect-error
    return queryByOptions(this.createQuery(options), options).enumerate();
  },
  _withLock(task) {
    // @ts-expect-error
    const result = new _deferred.Deferred();
    task.done(function () {
      const that = this;
      const args = arguments;
      _utils.processRequestResultLock.promise().done(() => {
        result.resolveWith(that, args);
      });
    }).fail(function () {
      result.rejectWith(this, arguments);
    });
    return result;
  },
  createQuery: abstract,
  totalCount(options) {
    return this._totalCountImpl(options);
  },
  _totalCountImpl(options) {
    return queryByOptions(this.createQuery(options), options, true).count();
  },
  byKey(key, extraOptions) {
    return this._addFailHandlers(this._withLock(this._byKeyImpl(key, extraOptions)));
  },
  _byKeyImpl: abstract,
  insert(values) {
    const that = this;
    that._eventsStrategy.fireEvent('modifying');
    that._eventsStrategy.fireEvent('inserting', [values]);
    return that._addFailHandlers(that._insertImpl(values).done((callbackValues, callbackKey) => {
      that._eventsStrategy.fireEvent('inserted', [callbackValues, callbackKey]);
      that._eventsStrategy.fireEvent('modified');
    }));
  },
  _insertImpl: abstract,
  update(key, values) {
    const that = this;
    that._eventsStrategy.fireEvent('modifying');
    that._eventsStrategy.fireEvent('updating', [key, values]);
    return that._addFailHandlers(that._updateImpl(key, values).done(() => {
      that._eventsStrategy.fireEvent('updated', [key, values]);
      that._eventsStrategy.fireEvent('modified');
    }));
  },
  _updateImpl: abstract,
  push(changes) {
    const beforePushArgs = {
      changes,
      waitFor: []
    };
    this._eventsStrategy.fireEvent('beforePushAggregation', [beforePushArgs]);
    (0, _deferred.when)(...beforePushArgs.waitFor).done(() => {
      this._pushImpl(changes);
      this._eventsStrategy.fireEvent('beforePush', [{
        changes
      }]);
      this._eventsStrategy.fireEvent('push', [changes]);
    });
  },
  _pushImpl: _common.noop,
  remove(key) {
    const that = this;
    that._eventsStrategy.fireEvent('modifying');
    that._eventsStrategy.fireEvent('removing', [key]);
    return that._addFailHandlers(that._removeImpl(key).done(callbackKey => {
      that._eventsStrategy.fireEvent('removed', [callbackKey]);
      that._eventsStrategy.fireEvent('modified');
    }));
  },
  _removeImpl: abstract,
  _addFailHandlers(deferred) {
    return deferred.fail(this._errorHandler).fail(_errors.handleError);
  },
  on(eventName, eventHandler) {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  },
  off(eventName, eventHandler) {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }
});
// @ts-expect-error
Store.create = function (alias, options) {
  if (!(alias in storeImpl)) {
    throw _errors.errors.Error('E4020', alias);
  }
  return new storeImpl[alias](options);
};
// @ts-expect-error
Store.registerClass = function (type, alias) {
  if (alias) {
    storeImpl[alias] = type;
  }
  return type;
};
// @ts-expect-error
Store.inherit = function (inheritor) {
  return function (members, alias) {
    const type = inheritor.apply(this, [members]);
    // @ts-expect-error
    Store.registerClass(type, alias);
    return type;
  };
}(Store.inherit);
var _default = exports.default = Store;
