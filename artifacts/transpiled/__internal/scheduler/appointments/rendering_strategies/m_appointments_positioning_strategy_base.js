"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _type = require("../../../../core/utils/type");
const COLLECTOR_DEFAULT_WIDTH = 24;
const COLLECTOR_DEFAULT_OFFSET = 3;
const COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET = 22;
const APPOINTMENT_MIN_COUNT = 1;
const APPOINTMENT_DEFAULT_WIDTH = 40;
const COLLECTOR_WIDTH_IN_PERCENTS = 75;
const APPOINTMENT_INCREASED_WIDTH = 50;
let AppointmentPositioningStrategy = /*#__PURE__*/function () {
  function AppointmentPositioningStrategy(renderingStrategy) {
    this._renderingStrategy = renderingStrategy;
  }
  var _proto = AppointmentPositioningStrategy.prototype;
  _proto.getDropDownAppointmentWidth = function getDropDownAppointmentWidth(intervalCount, isAllDay) {
    if (isAllDay || !(0, _type.isDefined)(isAllDay)) {
      return COLLECTOR_WIDTH_IN_PERCENTS * this._renderingStrategy.cellWidth / 100;
    }
    return COLLECTOR_DEFAULT_WIDTH;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.getCollectorTopOffset = function getCollectorTopOffset(allDay) {
    return COLLECTOR_DEFAULT_OFFSET;
  };
  _proto.getCollectorLeftOffset = function getCollectorLeftOffset() {
    return COLLECTOR_DEFAULT_OFFSET;
  };
  _proto.getAppointmentDefaultOffset = function getAppointmentDefaultOffset() {
    if (this._renderingStrategy._isCompactTheme()) {
      return COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET;
    }
    return this._renderingStrategy.appointmentOffset;
  };
  _proto.getDynamicAppointmentCountPerCell = function getDynamicAppointmentCountPerCell() {
    const renderingStrategy = this._renderingStrategy;
    const {
      cellHeight
    } = renderingStrategy;
    const allDayCount = Math.floor((cellHeight - renderingStrategy._getAppointmentDefaultOffset()) / renderingStrategy._getAppointmentDefaultHeight()) || this._getAppointmentMinCount();
    // NOTE: Simplify using only object
    if (renderingStrategy.allDaySupported()) {
      return {
        allDay: renderingStrategy.groupOrientation === 'vertical' ? allDayCount : this._renderingStrategy.appointmentCountPerCell,
        simple: this._calculateDynamicAppointmentCountPerCell() || this._getAppointmentMinCount()
      };
    }
    return allDayCount;
  };
  _proto.getDropDownAppointmentHeight = function getDropDownAppointmentHeight() {
    return undefined;
  };
  _proto._getAppointmentMinCount = function _getAppointmentMinCount() {
    return APPOINTMENT_MIN_COUNT;
  };
  _proto._calculateDynamicAppointmentCountPerCell = function _calculateDynamicAppointmentCountPerCell() {
    return Math.floor(this._renderingStrategy._getAppointmentMaxWidth() / APPOINTMENT_INCREASED_WIDTH);
  };
  _proto._getAppointmentDefaultWidth = function _getAppointmentDefaultWidth() {
    return APPOINTMENT_DEFAULT_WIDTH;
  };
  return AppointmentPositioningStrategy;
}();
var _default = exports.default = AppointmentPositioningStrategy;