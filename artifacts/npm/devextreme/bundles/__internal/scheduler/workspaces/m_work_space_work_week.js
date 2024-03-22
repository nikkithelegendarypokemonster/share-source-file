/**
* DevExtreme (bundles/__internal/scheduler/workspaces/m_work_space_work_week.js)
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
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _index = require("../__migration/utils/index");
var _m_constants = require("../m_constants");
var _m_work_space_week = _interopRequireDefault(require("./m_work_space_week"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';
let SchedulerWorkSpaceWorkWeek = /*#__PURE__*/function (_SchedulerWorkSpaceWe) {
  _inheritsLoose(SchedulerWorkSpaceWorkWeek, _SchedulerWorkSpaceWe);
  function SchedulerWorkSpaceWorkWeek() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    // @ts-expect-error
    _this = _SchedulerWorkSpaceWe.call(this, ...args) || this;
    _this._getWeekendsCount = _index.getWeekendsCount;
    return _this;
  }
  var _proto = SchedulerWorkSpaceWorkWeek.prototype;
  _proto._getElementClass = function _getElementClass() {
    return WORK_WEEK_CLASS;
  };
  _createClass(SchedulerWorkSpaceWorkWeek, [{
    key: "type",
    get: function () {
      return _m_constants.VIEWS.WORK_WEEK;
    }
  }]);
  return SchedulerWorkSpaceWorkWeek;
}(_m_work_space_week.default);
(0, _component_registrator.default)('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek);
var _default = exports.default = SchedulerWorkSpaceWorkWeek;
