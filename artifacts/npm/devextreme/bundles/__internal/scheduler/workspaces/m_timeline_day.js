/**
* DevExtreme (bundles/__internal/scheduler/workspaces/m_timeline_day.js)
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
var _m_constants = require("../m_constants");
var _m_timeline = _interopRequireDefault(require("./m_timeline"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const TIMELINE_CLASS = 'dx-scheduler-timeline-day';
let SchedulerTimelineDay = /*#__PURE__*/function (_SchedulerTimeline) {
  _inheritsLoose(SchedulerTimelineDay, _SchedulerTimeline);
  function SchedulerTimelineDay() {
    return _SchedulerTimeline.apply(this, arguments) || this;
  }
  var _proto = SchedulerTimelineDay.prototype;
  _proto._getElementClass = function _getElementClass() {
    return TIMELINE_CLASS;
  };
  _proto._needRenderWeekHeader = function _needRenderWeekHeader() {
    return this._isWorkSpaceWithCount();
  };
  _createClass(SchedulerTimelineDay, [{
    key: "type",
    get: function () {
      return _m_constants.VIEWS.TIMELINE_DAY;
    }
  }]);
  return SchedulerTimelineDay;
}(_m_timeline.default);
(0, _component_registrator.default)('dxSchedulerTimelineDay', SchedulerTimelineDay);
var _default = exports.default = SchedulerTimelineDay;
