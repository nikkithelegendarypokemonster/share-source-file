/**
* DevExtreme (bundles/__internal/scheduler/workspaces/m_cache.js)
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
exports.Cache = void 0;
var _type = require("../../../core/utils/type");
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
let Cache = exports.Cache = /*#__PURE__*/function () {
  function Cache() {
    this._cache = new Map();
  }
  var _proto = Cache.prototype;
  _proto.clear = function clear() {
    this._cache.clear();
  };
  _proto.get = function get(name, callback) {
    if (!this._cache.has(name) && callback) {
      this.set(name, callback());
    }
    return this._cache.get(name);
  };
  _proto.set = function set(name, value) {
    (0, _type.isDefined)(value) && this._cache.set(name, value);
  };
  _createClass(Cache, [{
    key: "size",
    get: function () {
      return this._cache.size;
    }
  }]);
  return Cache;
}();
