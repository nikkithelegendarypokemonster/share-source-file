"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _index = require("../../__migration/utils/index");
var _m_expression_utils = require("../../m_expression_utils");
var _m_strategy_base = _interopRequireDefault(require("./m_strategy_base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const DEFAULT_APPOINTMENT_HEIGHT = 60;
const MIN_APPOINTMENT_HEIGHT = 35;
const DROP_DOWN_BUTTON_OFFSET = 2;
const toMs = _date.default.dateToMilliseconds;
let HorizontalRenderingStrategy = /*#__PURE__*/function (_BaseAppointmentsStra) {
  _inheritsLoose(HorizontalRenderingStrategy, _BaseAppointmentsStra);
  function HorizontalRenderingStrategy() {
    return _BaseAppointmentsStra.apply(this, arguments) || this;
  }
  var _proto = HorizontalRenderingStrategy.prototype;
  _proto._needVerifyItemSize = function _needVerifyItemSize() {
    return true;
  };
  _proto.calculateAppointmentWidth = function calculateAppointmentWidth(appointment, position) {
    const cellWidth = this.cellWidth || this.getAppointmentMinSize();
    const allDay = _m_expression_utils.ExpressionUtils.getField(this.dataAccessors, 'allDay', appointment);
    const {
      startDate,
      endDate,
      normalizedEndDate
    } = position.info.appointment;
    let duration = this.getAppointmentDurationInMs(startDate, normalizedEndDate, allDay);
    duration = this._adjustDurationByDaylightDiff(duration, startDate, normalizedEndDate);
    const cellDuration = this.cellDurationInMinutes * toMs('minute');
    const skippedHours = (0, _index.getSkippedHoursInRange)(startDate, endDate, appointment.allDay, this.viewDataProvider);
    const durationInCells = (duration - skippedHours * toMs('hour')) / cellDuration;
    const width = this.cropAppointmentWidth(durationInCells * cellWidth, cellWidth);
    return width;
  };
  _proto._needAdjustDuration = function _needAdjustDuration(diff) {
    return diff < 0;
  };
  _proto.getAppointmentGeometry = function getAppointmentGeometry(coordinates) {
    const result = this._customizeAppointmentGeometry(coordinates);
    return _BaseAppointmentsStra.prototype.getAppointmentGeometry.call(this, result);
  };
  _proto._customizeAppointmentGeometry = function _customizeAppointmentGeometry(coordinates) {
    const config = this._calculateGeometryConfig(coordinates);
    return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset);
  };
  _proto._getOffsets = function _getOffsets() {
    return {
      unlimited: 0,
      auto: 0
    };
  };
  _proto._getCompactLeftCoordinate = function _getCompactLeftCoordinate(itemLeft, index) {
    const cellWidth = this.cellWidth || this.getAppointmentMinSize();
    return itemLeft + cellWidth * index;
  };
  _proto._getMaxHeight = function _getMaxHeight() {
    return this.cellHeight || this.getAppointmentMinSize();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._getAppointmentCount = function _getAppointmentCount(overlappingMode, coordinates) {
    return this._getMaxAppointmentCountPerCellByType(false);
  };
  _proto._getAppointmentDefaultHeight = function _getAppointmentDefaultHeight() {
    return DEFAULT_APPOINTMENT_HEIGHT;
  };
  _proto._getAppointmentMinHeight = function _getAppointmentMinHeight() {
    return MIN_APPOINTMENT_HEIGHT;
  };
  _proto._sortCondition = function _sortCondition(a, b) {
    return this._columnCondition(a, b);
  };
  _proto._getOrientation = function _getOrientation() {
    return ['left', 'right', 'top'];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.getDropDownAppointmentWidth = function getDropDownAppointmentWidth(intervalCount, isAllDay) {
    return this.cellWidth - DROP_DOWN_BUTTON_OFFSET * 2;
  };
  _proto.getDeltaTime = function getDeltaTime(args, initialSize) {
    let deltaTime = 0;
    const deltaWidth = args.width - initialSize.width;
    deltaTime = toMs('minute') * Math.round(deltaWidth / this.cellWidth * this.cellDurationInMinutes);
    return deltaTime;
  };
  _proto.isAllDay = function isAllDay(appointmentData) {
    return _m_expression_utils.ExpressionUtils.getField(this.dataAccessors, 'allDay', appointmentData);
  };
  _proto._isItemsCross = function _isItemsCross(firstItem, secondItem) {
    const orientation = this._getOrientation();
    return this._checkItemsCrossing(firstItem, secondItem, orientation);
  };
  _proto.getPositionShift = function getPositionShift(timeShift) {
    const positionShift = _BaseAppointmentsStra.prototype.getPositionShift.call(this, timeShift);
    let left = this.cellWidth * timeShift;
    if (this.rtlEnabled) {
      left *= -1;
    }
    left += positionShift.left;
    return {
      top: 0,
      left,
      cellPosition: left
    };
  };
  _proto.supportCompactDropDownAppointments = function supportCompactDropDownAppointments() {
    return false;
  };
  return HorizontalRenderingStrategy;
}(_m_strategy_base.default);
var _default = exports.default = HorizontalRenderingStrategy;