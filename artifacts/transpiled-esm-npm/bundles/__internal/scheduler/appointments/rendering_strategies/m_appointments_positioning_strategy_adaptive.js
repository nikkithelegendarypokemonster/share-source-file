"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _m_appointments_positioning_strategy_base = _interopRequireDefault(require("./m_appointments_positioning_strategy_base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const COLLECTOR_ADAPTIVE_SIZE = 28;
const COLLECTOR_ADAPTIVE_BOTTOM_OFFSET = 40;
const ADAPTIVE_APPOINTMENT_DEFAULT_OFFSET = 35;
const ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH = 30;
let AdaptivePositioningStrategy = /*#__PURE__*/function (_AppointmentPositioni) {
  _inheritsLoose(AdaptivePositioningStrategy, _AppointmentPositioni);
  function AdaptivePositioningStrategy() {
    return _AppointmentPositioni.apply(this, arguments) || this;
  }
  var _proto = AdaptivePositioningStrategy.prototype;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _proto.getDropDownAppointmentWidth = function getDropDownAppointmentWidth(intervalCount, isAllDay) {
    return this.getDropDownButtonAdaptiveSize();
  };
  _proto.getDropDownButtonAdaptiveSize = function getDropDownButtonAdaptiveSize() {
    return COLLECTOR_ADAPTIVE_SIZE;
  };
  _proto.getCollectorTopOffset = function getCollectorTopOffset(allDay) {
    const renderingStrategy = this._renderingStrategy;
    if (renderingStrategy.allDaySupported() && allDay) {
      return (renderingStrategy.allDayHeight - renderingStrategy.getDropDownButtonAdaptiveSize()) / 2;
    }
    return this._renderingStrategy.cellHeight - COLLECTOR_ADAPTIVE_BOTTOM_OFFSET;
  };
  _proto.getCollectorLeftOffset = function getCollectorLeftOffset() {
    const collectorWidth = this._renderingStrategy.getDropDownAppointmentWidth();
    return (this._renderingStrategy.cellWidth - collectorWidth) / 2;
  };
  _proto.getAppointmentDefaultOffset = function getAppointmentDefaultOffset() {
    return ADAPTIVE_APPOINTMENT_DEFAULT_OFFSET;
  };
  _proto.getDynamicAppointmentCountPerCell = function getDynamicAppointmentCountPerCell() {
    const renderingStrategy = this._renderingStrategy;
    if (renderingStrategy.allDaySupported()) {
      return {
        allDay: 0,
        simple: this._calculateDynamicAppointmentCountPerCell() || this._getAppointmentMinCount()
      };
    }
    return 0;
  };
  _proto.getDropDownAppointmentHeight = function getDropDownAppointmentHeight() {
    return COLLECTOR_ADAPTIVE_SIZE;
  };
  _proto._getAppointmentMinCount = function _getAppointmentMinCount() {
    return 0;
  };
  _proto._getAppointmentDefaultWidth = function _getAppointmentDefaultWidth() {
    const renderingStrategy = this._renderingStrategy;
    if (renderingStrategy.allDaySupported()) {
      return ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH;
    }
    return _AppointmentPositioni.prototype._getAppointmentDefaultWidth.call(this);
  };
  _proto._calculateDynamicAppointmentCountPerCell = function _calculateDynamicAppointmentCountPerCell() {
    return Math.floor(this._renderingStrategy._getAppointmentMaxWidth() / this._renderingStrategy._getAppointmentDefaultWidth());
  };
  return AdaptivePositioningStrategy;
}(_m_appointments_positioning_strategy_base.default);
var _default = exports.default = AdaptivePositioningStrategy;