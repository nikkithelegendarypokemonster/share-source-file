"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _position = require("../../../core/utils/position");
var _m_constants = require("../m_constants");
var _m_timeline = _interopRequireDefault(require("./m_timeline"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const TIMELINE_CLASS = 'dx-scheduler-timeline-week';
let SchedulerTimelineWeek = exports.default = /*#__PURE__*/function (_SchedulerTimeline) {
  _inheritsLoose(SchedulerTimelineWeek, _SchedulerTimeline);
  function SchedulerTimelineWeek() {
    return _SchedulerTimeline.apply(this, arguments) || this;
  }
  var _proto = SchedulerTimelineWeek.prototype;
  _proto._getElementClass = function _getElementClass() {
    return TIMELINE_CLASS;
  };
  _proto._getHeaderPanelCellWidth = function _getHeaderPanelCellWidth($headerRow) {
    return (0, _position.getBoundingRect)($headerRow.children().first().get(0)).width;
  };
  _proto._needRenderWeekHeader = function _needRenderWeekHeader() {
    return true;
  };
  _proto._incrementDate = function _incrementDate(date) {
    date.setDate(date.getDate() + 1);
  };
  _createClass(SchedulerTimelineWeek, [{
    key: "type",
    get: function () {
      return _m_constants.VIEWS.TIMELINE_WEEK;
    }
  }]);
  return SchedulerTimelineWeek;
}(_m_timeline.default);
(0, _component_registrator.default)('dxSchedulerTimelineWeek', SchedulerTimelineWeek);