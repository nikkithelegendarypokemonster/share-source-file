/**
* DevExtreme (bundles/__internal/scheduler/m_date_adapter.js)
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
exports.default = void 0;
var _date = _interopRequireDefault(require("../../core/utils/date"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const toMs = _date.default.dateToMilliseconds;
let DateAdapterCore = /*#__PURE__*/function () {
  function DateAdapterCore(source) {
    this._source = new Date(source.getTime ? source.getTime() : source);
  }
  var _proto = DateAdapterCore.prototype;
  _proto.result = function result() {
    return this._source;
  };
  _proto.getTimezoneOffset = function getTimezoneOffset() {
    let format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    const value = this._source.getTimezoneOffset();
    if (format === 'minute') {
      return value * toMs('minute');
    }
    return value;
  };
  _proto.getTime = function getTime() {
    return this._source.getTime();
  };
  _proto.setTime = function setTime(value) {
    this._source.setTime(value);
    return this;
  };
  _proto.addTime = function addTime(value) {
    this._source.setTime(this._source.getTime() + value);
    return this;
  };
  _proto.setMinutes = function setMinutes(value) {
    this._source.setMinutes(value);
    return this;
  };
  _proto.addMinutes = function addMinutes(value) {
    this._source.setMinutes(this._source.getMinutes() + value);
    return this;
  };
  _proto.subtractMinutes = function subtractMinutes(value) {
    this._source.setMinutes(this._source.getMinutes() - value);
    return this;
  };
  _createClass(DateAdapterCore, [{
    key: "source",
    get: function () {
      return this._source;
    }
  }]);
  return DateAdapterCore;
}();
const DateAdapter = date => new DateAdapterCore(date);
var _default = exports.default = DateAdapter;
