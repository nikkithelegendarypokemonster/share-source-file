"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewDataGeneratorWeek = void 0;
var _index = require("../../../scheduler/__migration/utils/index");
var _m_view_data_generator = require("./m_view_data_generator");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let ViewDataGeneratorWeek = exports.ViewDataGeneratorWeek = /*#__PURE__*/function (_ViewDataGenerator) {
  _inheritsLoose(ViewDataGeneratorWeek, _ViewDataGenerator);
  function ViewDataGeneratorWeek() {
    var _this;
    _this = _ViewDataGenerator.apply(this, arguments) || this;
    _this.daysInInterval = 7;
    return _this;
  }
  var _proto = ViewDataGeneratorWeek.prototype;
  _proto._getIntervalDuration = function _getIntervalDuration(intervalCount) {
    return _index.weekUtils.getIntervalDuration(intervalCount);
  };
  _proto._calculateStartViewDate = function _calculateStartViewDate(options) {
    return _index.weekUtils.calculateStartViewDate(options.currentDate, options.startDayHour, options.startDate, this._getIntervalDuration(options.intervalCount), this.getFirstDayOfWeek(options.firstDayOfWeek));
  };
  return ViewDataGeneratorWeek;
}(_m_view_data_generator.ViewDataGenerator);