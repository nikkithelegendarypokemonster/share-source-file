/**
* DevExtreme (cjs/ui/gantt/ui.gantt.cache.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.GanttDataCache = void 0;
var _extend = require("../../core/utils/extend");
let GanttDataCache = exports.GanttDataCache = /*#__PURE__*/function () {
  function GanttDataCache() {
    this._cache = {};
    this._timers = {};
  }
  var _proto = GanttDataCache.prototype;
  _proto.saveData = function saveData(key, data, keyExpireCallback) {
    if (data) {
      this._clearTimer(key);
      const storage = this._getCache(key, true);
      (0, _extend.extendFromObject)(storage, data, true);
      if (keyExpireCallback) {
        this._setExpireTimer(key, keyExpireCallback);
      }
    }
  };
  _proto.pullDataFromCache = function pullDataFromCache(key, target) {
    const data = this._getCache(key);
    if (data) {
      (0, _extend.extendFromObject)(target, data);
    }
    this._onKeyExpired(key);
  };
  _proto.hasData = function hasData(key) {
    return !!this._cache[key];
  };
  _proto.resetCache = function resetCache(key) {
    this._onKeyExpired(key);
  };
  _proto._getCache = function _getCache(key, forceCreate) {
    if (!this._cache[key] && forceCreate) {
      this._cache[key] = {};
    }
    return this._cache[key];
  };
  _proto._setExpireTimer = function _setExpireTimer(key, callback) {
    this._timers[key] = setTimeout(() => {
      callback(key, this._getCache(key));
      this._onKeyExpired(key);
    }, 200);
  };
  _proto._onKeyExpired = function _onKeyExpired(key) {
    this._clearCache(key);
    this._clearTimer(key);
  };
  _proto._clearCache = function _clearCache(key) {
    delete this._cache[key];
  };
  _proto._clearTimer = function _clearTimer(key) {
    const timers = this._timers;
    if (timers && timers[key]) {
      clearTimeout(timers[key]);
      delete timers[key];
    }
  };
  return GanttDataCache;
}();
