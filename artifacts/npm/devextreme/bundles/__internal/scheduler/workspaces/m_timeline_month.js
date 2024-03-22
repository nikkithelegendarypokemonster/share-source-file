/**
* DevExtreme (bundles/__internal/scheduler/workspaces/m_timeline_month.js)
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
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _index = require("../__migration/components/index");
var _index2 = require("../__migration/utils/index");
var _m_constants = require("../m_constants");
var _m_timeline = _interopRequireDefault(require("./m_timeline"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } // NOTE: Renovation component import.
const TIMELINE_CLASS = 'dx-scheduler-timeline-month';
let SchedulerTimelineMonth = /*#__PURE__*/function (_SchedulerTimeline) {
  _inheritsLoose(SchedulerTimelineMonth, _SchedulerTimeline);
  function SchedulerTimelineMonth() {
    var _this;
    _this = _SchedulerTimeline.apply(this, arguments) || this;
    _this.viewDirection = 'horizontal';
    return _this;
  }
  var _proto = SchedulerTimelineMonth.prototype;
  _proto._renderView = function _renderView() {
    _SchedulerTimeline.prototype._renderView.call(this);
    this._updateScrollable();
  };
  _proto._getElementClass = function _getElementClass() {
    return TIMELINE_CLASS;
  };
  _proto._getDateHeaderTemplate = function _getDateHeaderTemplate() {
    return this.option('dateCellTemplate');
  };
  _proto._calculateDurationInCells = function _calculateDurationInCells(timeDiff) {
    return timeDiff / this.getCellDuration();
  };
  _proto.isIndicatorVisible = function isIndicatorVisible() {
    return true;
  };
  _proto._getFormat = function _getFormat() {
    return _index2.formatWeekdayAndDay;
  };
  _proto._getIntervalBetween = function _getIntervalBetween(currentDate) {
    const firstViewDate = this.getStartViewDate();
    const timeZoneOffset = _date.default.getTimezonesDifference(firstViewDate, currentDate);
    return currentDate.getTime() - (firstViewDate.getTime() - this.option('startDayHour') * 3600000) - timeZoneOffset;
  };
  _proto._getViewStartByOptions = function _getViewStartByOptions() {
    return _index2.monthUtils.getViewStartByOptions(this.option('startDate'), this.option('currentDate'), this.option('intervalCount'), _date.default.getFirstMonthDate(this.option('startDate')));
  };
  _proto.generateRenderOptions = function generateRenderOptions() {
    const options = _SchedulerTimeline.prototype.generateRenderOptions.call(this, true);
    return _extends(_extends({}, options), {
      getDateForHeaderText: (_, date) => date
    });
  };
  _proto.keepOriginalHours = function keepOriginalHours() {
    return true;
  };
  _createClass(SchedulerTimelineMonth, [{
    key: "type",
    get: function () {
      return _m_constants.VIEWS.TIMELINE_MONTH;
    }
  }, {
    key: "renovatedHeaderPanelComponent",
    get: function () {
      return _index.HeaderPanelComponent;
    }
  }]);
  return SchedulerTimelineMonth;
}(_m_timeline.default);
(0, _component_registrator.default)('dxSchedulerTimelineMonth', SchedulerTimelineMonth);
var _default = exports.default = SchedulerTimelineMonth;
