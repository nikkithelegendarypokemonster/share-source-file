/**
* DevExtreme (cjs/__internal/scheduler/workspaces/view_model/m_view_data_generator_day.js)
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
exports.ViewDataGeneratorDay = void 0;
var _index = require("../../__migration/utils/index");
var _m_view_data_generator = require("./m_view_data_generator");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let ViewDataGeneratorDay = exports.ViewDataGeneratorDay = /*#__PURE__*/function (_ViewDataGenerator) {
  _inheritsLoose(ViewDataGeneratorDay, _ViewDataGenerator);
  function ViewDataGeneratorDay() {
    return _ViewDataGenerator.apply(this, arguments) || this;
  }
  var _proto = ViewDataGeneratorDay.prototype;
  _proto._calculateStartViewDate = function _calculateStartViewDate(options) {
    return _index.dayUtils.calculateStartViewDate(options.currentDate, options.startDayHour, options.startDate, this._getIntervalDuration(options.intervalCount));
  };
  return ViewDataGeneratorDay;
}(_m_view_data_generator.ViewDataGenerator);
