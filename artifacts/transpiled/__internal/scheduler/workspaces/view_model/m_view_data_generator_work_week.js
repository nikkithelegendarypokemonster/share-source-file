"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewDataGeneratorWorkWeek = void 0;
var _index = require("../../__migration/utils/index");
var _m_view_data_generator_week = require("./m_view_data_generator_week");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let ViewDataGeneratorWorkWeek = exports.ViewDataGeneratorWorkWeek = /*#__PURE__*/function (_ViewDataGeneratorWee) {
  _inheritsLoose(ViewDataGeneratorWorkWeek, _ViewDataGeneratorWee);
  function ViewDataGeneratorWorkWeek() {
    var _this;
    _this = _ViewDataGeneratorWee.apply(this, arguments) || this;
    _this.daysInInterval = 5;
    _this.isWorkView = true;
    return _this;
  }
  var _proto = ViewDataGeneratorWorkWeek.prototype;
  _proto.isSkippedDate = function isSkippedDate(date) {
    return (0, _index.isDataOnWeekend)(date);
  };
  _proto._calculateStartViewDate = function _calculateStartViewDate(options) {
    return _index.workWeekUtils.calculateStartViewDate(options.currentDate, options.startDayHour, options.startDate, this._getIntervalDuration(options.intervalCount), this.getFirstDayOfWeek(options.firstDayOfWeek));
  };
  _proto.getFirstDayOfWeek = function getFirstDayOfWeek(firstDayOfWeekOption) {
    return firstDayOfWeekOption || 0;
  };
  return ViewDataGeneratorWorkWeek;
}(_m_view_data_generator_week.ViewDataGeneratorWeek);