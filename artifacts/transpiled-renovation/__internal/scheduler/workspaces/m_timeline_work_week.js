"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _index = require("../__migration/utils/index");
var _m_constants = require("../m_constants");
var _m_timeline_week = _interopRequireDefault(require("./m_timeline_week"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const TIMELINE_CLASS = 'dx-scheduler-timeline-work-week';
const LAST_DAY_WEEK_INDEX = 5;
let SchedulerTimelineWorkWeek = /*#__PURE__*/function (_SchedulerTimelineWee) {
  _inheritsLoose(SchedulerTimelineWorkWeek, _SchedulerTimelineWee);
  function SchedulerTimelineWorkWeek() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    // @ts-expect-error
    _this = _SchedulerTimelineWee.call(this, ...args) || this;
    _this._getWeekendsCount = _index.getWeekendsCount;
    return _this;
  }
  var _proto = SchedulerTimelineWorkWeek.prototype;
  _proto._getElementClass = function _getElementClass() {
    return TIMELINE_CLASS;
  };
  _proto._incrementDate = function _incrementDate(date) {
    const day = date.getDay();
    if (day === LAST_DAY_WEEK_INDEX) {
      date.setDate(date.getDate() + 2);
    }
    _SchedulerTimelineWee.prototype._incrementDate.call(this, date);
  };
  _createClass(SchedulerTimelineWorkWeek, [{
    key: "type",
    get: function () {
      return _m_constants.VIEWS.TIMELINE_WORK_WEEK;
    }
  }]);
  return SchedulerTimelineWorkWeek;
}(_m_timeline_week.default);
(0, _component_registrator.default)('dxSchedulerTimelineWorkWeek', SchedulerTimelineWorkWeek);
var _default = exports.default = SchedulerTimelineWorkWeek;