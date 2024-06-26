/**
* DevExtreme (cjs/__internal/scheduler/appointments/rendering_strategies/m_strategy_vertical.js)
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
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _extend = require("../../../../core/utils/extend");
var _math = require("../../../../core/utils/math");
var _type = require("../../../../core/utils/type");
var _utils = _interopRequireDefault(require("../../../../ui/scheduler/utils.timeZone"));
var _index = require("../../__migration/utils/index");
var _m_appointment_adapter = require("../../m_appointment_adapter");
var _m_expression_utils = require("../../m_expression_utils");
var _m_strategy_base = _interopRequireDefault(require("./m_strategy_base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const ALLDAY_APPOINTMENT_MIN_VERTICAL_OFFSET = 5;
const ALLDAY_APPOINTMENT_MAX_VERTICAL_OFFSET = 20;
const toMs = _date.default.dateToMilliseconds;
let VerticalRenderingStrategy = /*#__PURE__*/function (_BaseAppointmentsStra) {
  _inheritsLoose(VerticalRenderingStrategy, _BaseAppointmentsStra);
  function VerticalRenderingStrategy() {
    return _BaseAppointmentsStra.apply(this, arguments) || this;
  }
  var _proto = VerticalRenderingStrategy.prototype;
  _proto.getDeltaTime = function getDeltaTime(args, initialSize, appointment) {
    let deltaTime = 0;
    if (this.isAllDay(appointment)) {
      deltaTime = this._getDeltaWidth(args, initialSize) * toMs('day');
    } else {
      const deltaHeight = args.height - initialSize.height;
      deltaTime = toMs('minute') * Math.round(deltaHeight / this.cellHeight * this.cellDurationInMinutes);
    }
    return deltaTime;
  };
  _proto._correctCollectorCoordinatesInAdaptive = function _correctCollectorCoordinatesInAdaptive(coordinates, isAllDay) {
    if (isAllDay) {
      _BaseAppointmentsStra.prototype._correctCollectorCoordinatesInAdaptive.call(this, coordinates, isAllDay);
    } else if (this._getMaxAppointmentCountPerCellByType() === 0) {
      const {
        cellHeight
      } = this;
      const {
        cellWidth
      } = this;
      coordinates.top += (cellHeight - this.getDropDownButtonAdaptiveSize()) / 2;
      coordinates.left += (cellWidth - this.getDropDownButtonAdaptiveSize()) / 2;
    }
  };
  _proto.getAppointmentGeometry = function getAppointmentGeometry(coordinates) {
    let geometry = null;
    if (coordinates.allDay) {
      geometry = this._getAllDayAppointmentGeometry(coordinates);
    } else {
      geometry = this.isAdaptive && coordinates.isCompact ? this._getAdaptiveGeometry(coordinates) : this._getVerticalAppointmentGeometry(coordinates);
    }
    return _BaseAppointmentsStra.prototype.getAppointmentGeometry.call(this, geometry);
  };
  _proto._getAdaptiveGeometry = function _getAdaptiveGeometry(coordinates) {
    const config = this._calculateGeometryConfig(coordinates);
    return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset);
  };
  _proto._getItemPosition = function _getItemPosition(initialAppointment) {
    const allDay = this.isAllDay(initialAppointment);
    if (allDay) {
      return _BaseAppointmentsStra.prototype._getItemPosition.call(this, initialAppointment);
    }
    const appointment = _BaseAppointmentsStra.prototype.shiftAppointmentByViewOffset.call(this, initialAppointment);
    const adapter = (0, _m_appointment_adapter.createAppointmentAdapter)(appointment, this.dataAccessors, this.timeZoneCalculator);
    const isRecurring = !!adapter.recurrenceRule;
    const appointmentStartDate = adapter.calculateStartDate('toGrid');
    const appointmentEndDate = adapter.calculateEndDate('toGrid');
    const appointmentDuration = appointmentEndDate - appointmentStartDate;
    const appointmentBeginInCurrentView = this.options.startViewDate < appointmentStartDate;
    const isAppointmentTakesSeveralDays = !_utils.default.isSameAppointmentDates(appointmentStartDate, appointmentEndDate);
    const settings = this.generateAppointmentSettings(appointment);
    let result = [];
    for (let j = 0; j < settings.length; j++) {
      const currentSetting = settings[j];
      const height = this.calculateAppointmentHeight(appointment, currentSetting);
      const width = this.calculateAppointmentWidth(appointment, currentSetting);
      let resultHeight = height;
      let appointmentReduced = null;
      let multiDaysAppointmentParts = [];
      const currentMaxAllowedPosition = currentSetting.vMax;
      if (this._isMultiViewAppointment(currentSetting, height) || isAppointmentTakesSeveralDays && !isRecurring) {
        const trimmedStartDate = _date.default.trimTime(appointmentStartDate);
        const trimmedSettingStartDate = _date.default.trimTime(currentSetting.info.appointment.startDate);
        const reduceHead = trimmedStartDate <= trimmedSettingStartDate || isRecurring;
        if (reduceHead) {
          resultHeight = this._reduceMultiDayAppointment(height, {
            top: currentSetting.top,
            bottom: currentMaxAllowedPosition
          });
          multiDaysAppointmentParts = this._getAppointmentParts({
            sourceAppointmentHeight: height,
            reducedHeight: resultHeight,
            width
          }, currentSetting);
        }
        const {
          startDate: currentSettingStartDate,
          normalizedEndDate: currentSettingNormalizedEndDate
        } = currentSetting.info.appointment;
        const currentSettingDuration = currentSettingNormalizedEndDate - currentSettingStartDate;
        const hasNextParts = currentSettingDuration < appointmentDuration;
        appointmentReduced = hasNextParts ? appointmentBeginInCurrentView ? 'head' : 'body' : appointmentBeginInCurrentView ? 'head' : 'tail';
      }
      (0, _extend.extend)(currentSetting, {
        height: resultHeight,
        width,
        allDay,
        appointmentReduced
      });
      result = this._getAppointmentPartsPosition(multiDaysAppointmentParts, currentSetting, result);
    }
    return result;
  };
  _proto._isMultiViewAppointment = function _isMultiViewAppointment(_ref, height) {
    let {
      vMax,
      top
    } = _ref;
    // NOTE: we round these numbers, because in js 100 - 33.3333 = 66.66669999
    const fullAppointmentHeight = (0, _math.roundFloatPart)(height, 2);
    const remainingHeight = (0, _math.roundFloatPart)(vMax - top, 2);
    return fullAppointmentHeight > remainingHeight;
  };
  _proto._reduceMultiDayAppointment = function _reduceMultiDayAppointment(sourceAppointmentHeight, bound) {
    return Math.min(sourceAppointmentHeight, bound.bottom - Math.floor(bound.top));
  };
  _proto._getGroupHeight = function _getGroupHeight() {
    return this.cellHeight * this.rowCount;
  };
  _proto._getGroupTopOffset = function _getGroupTopOffset(appointmentSettings) {
    const {
      groupIndex
    } = appointmentSettings;
    const groupTop = Math.max(0, this.positionHelper.getGroupTop({
      groupIndex,
      showAllDayPanel: this.showAllDayPanel,
      isGroupedAllDayPanel: this.isGroupedAllDayPanel
    }));
    const allDayPanelOffset = this.positionHelper.getOffsetByAllDayPanel({
      groupIndex,
      supportAllDayRow: this.allDaySupported(),
      showAllDayPanel: this.showAllDayPanel
    });
    const appointmentGroupTopOffset = appointmentSettings.top - groupTop - allDayPanelOffset;
    return appointmentGroupTopOffset;
  };
  _proto._getTailHeight = function _getTailHeight(appointmentGeometry, appointmentSettings) {
    if (!this.isVirtualScrolling) {
      return appointmentGeometry.sourceAppointmentHeight - appointmentGeometry.reducedHeight;
    }
    const appointmentGroupTopOffset = this._getGroupTopOffset(appointmentSettings);
    const {
      sourceAppointmentHeight
    } = appointmentGeometry;
    const groupHeight = this._getGroupHeight();
    const tailHeight = appointmentGroupTopOffset + sourceAppointmentHeight - groupHeight;
    return tailHeight;
  };
  _proto._getAppointmentParts = function _getAppointmentParts(appointmentGeometry, appointmentSettings) {
    const {
      width
    } = appointmentGeometry;
    const result = [];
    let currentPartTop = Math.max(0, this.positionHelper.getGroupTop({
      groupIndex: appointmentSettings.groupIndex,
      showAllDayPanel: this.showAllDayPanel,
      isGroupedAllDayPanel: this.isGroupedAllDayPanel
    }));
    const cellsDiff = this.isGroupedByDate ? this.groupCount : 1;
    const offset = this.cellWidth * cellsDiff;
    const allDayPanelOffset = this.positionHelper.getOffsetByAllDayPanel({
      groupIndex: appointmentSettings.groupIndex,
      supportAllDayRow: this.allDaySupported(),
      showAllDayPanel: this.showAllDayPanel
    });
    currentPartTop += allDayPanelOffset;
    const minHeight = this.getAppointmentMinSize();
    const {
      vMax,
      hMax
    } = appointmentSettings;
    const hasTailPart = this.options.endViewDate > appointmentSettings.info.appointment.endDate;
    let left = Math.round(appointmentSettings.left + offset);
    let tailHeight = this._getTailHeight(appointmentGeometry, appointmentSettings);
    while (tailHeight > 0 && left < hMax) {
      tailHeight = Math.max(minHeight, tailHeight);
      const columnIndex = appointmentSettings.columnIndex + cellsDiff;
      const height = Math.min(tailHeight, vMax);
      result.push(_extends(_extends({}, appointmentSettings), {
        top: currentPartTop,
        left,
        height,
        width,
        appointmentReduced: 'body',
        rowIndex: 0,
        columnIndex
      }));
      left += offset;
      tailHeight -= vMax;
    }
    if (hasTailPart && result.length > 0) {
      result[result.length - 1].appointmentReduced = 'tail';
    }
    return result;
  };
  _proto._getMinuteHeight = function _getMinuteHeight() {
    return this.cellHeight / this.cellDurationInMinutes;
  };
  _proto._getCompactLeftCoordinate = function _getCompactLeftCoordinate(itemLeft, index) {
    const cellBorderSize = 1;
    const cellWidth = this.cellWidth || this.getAppointmentMinSize();
    return itemLeft + (cellBorderSize + cellWidth) * index;
  };
  _proto._getVerticalAppointmentGeometry = function _getVerticalAppointmentGeometry(coordinates) {
    const config = this._calculateVerticalGeometryConfig(coordinates);
    return this._customizeVerticalCoordinates(coordinates, config.width, config.appointmentCountPerCell, config.offset);
  };
  _proto._customizeVerticalCoordinates = function _customizeVerticalCoordinates(coordinates, width, appointmentCountPerCell, topOffset, isAllDay) {
    const appointmentWidth = Math.max(width / appointmentCountPerCell, width / coordinates.count);
    const {
      height
    } = coordinates;
    const appointmentLeft = coordinates.left + coordinates.index * appointmentWidth;
    const {
      top
    } = coordinates;
    if (coordinates.isCompact) {
      this._markAppointmentAsVirtual(coordinates, isAllDay);
    }
    return {
      height,
      width: appointmentWidth,
      top,
      left: appointmentLeft,
      empty: this._isAppointmentEmpty(height, width)
    };
  };
  _proto._calculateVerticalGeometryConfig = function _calculateVerticalGeometryConfig(coordinates) {
    const overlappingMode = this.maxAppointmentsPerCell;
    const offsets = this._getOffsets();
    const appointmentDefaultOffset = this._getAppointmentDefaultOffset();
    let appointmentCountPerCell = this._getAppointmentCount(overlappingMode, coordinates);
    let ratio = this._getDefaultRatio(coordinates, appointmentCountPerCell);
    let maxWidth = this._getMaxWidth();
    if (!appointmentCountPerCell) {
      appointmentCountPerCell = coordinates.count;
      ratio = (maxWidth - offsets.unlimited) / maxWidth;
    }
    let topOffset = (1 - ratio) * maxWidth;
    if (overlappingMode === 'auto' || (0, _type.isNumeric)(overlappingMode)) {
      ratio = 1;
      maxWidth -= appointmentDefaultOffset;
      topOffset = 0;
    }
    return {
      width: ratio * maxWidth,
      appointmentCountPerCell,
      offset: topOffset
    };
  };
  _proto._getMaxWidth = function _getMaxWidth() {
    return this.cellWidth;
  };
  _proto.isAllDay = function isAllDay(appointmentData) {
    return (0, _index.getAppointmentTakesAllDay)((0, _m_appointment_adapter.createAppointmentAdapter)(appointmentData, this.dataAccessors, this.timeZoneCalculator), this.allDayPanelMode);
  };
  _proto._getAppointmentMaxWidth = function _getAppointmentMaxWidth() {
    return this.cellWidth - this._getAppointmentDefaultOffset();
  };
  _proto.calculateAppointmentWidth = function calculateAppointmentWidth(appointment, position) {
    if (!this.isAllDay(appointment)) {
      return 0;
    }
    const {
      startDate: startDateWithTime,
      endDate,
      normalizedEndDate
    } = position.info.appointment;
    const startDate = _date.default.trimTime(startDateWithTime);
    const cellWidth = this.cellWidth || this.getAppointmentMinSize();
    const durationInHours = (normalizedEndDate.getTime() - startDate.getTime()) / toMs('hour');
    const skippedHours = (0, _index.getSkippedHoursInRange)(startDate, endDate, appointment.allDay, this.viewDataProvider);
    let width = Math.ceil((durationInHours - skippedHours) / 24) * cellWidth;
    width = this.cropAppointmentWidth(width, cellWidth);
    return width;
  };
  _proto.calculateAppointmentHeight = function calculateAppointmentHeight(appointment, position) {
    if (this.isAllDay(appointment)) {
      return 0;
    }
    const {
      startDate,
      normalizedEndDate
    } = position.info.appointment;
    const allDay = _m_expression_utils.ExpressionUtils.getField(this.dataAccessors, 'allDay', appointment);
    const duration = this.getAppointmentDurationInMs(startDate, normalizedEndDate, allDay);
    const durationInMinutes = this._adjustDurationByDaylightDiff(duration, startDate, normalizedEndDate) / toMs('minute');
    const height = durationInMinutes * this._getMinuteHeight();
    return height;
  };
  _proto.getDirection = function getDirection() {
    return 'vertical';
  };
  _proto._sortCondition = function _sortCondition(a, b) {
    if (!!a.allDay !== !!b.allDay) {
      return a.allDay ? 1 : -1;
    }
    const isAllDay = a.allDay && b.allDay;
    return this.groupOrientation === 'vertical' && isAllDay ? this._columnCondition(a, b) : this._rowCondition(a, b);
  };
  _proto.allDaySupported = function allDaySupported() {
    return true;
  };
  _proto._getAllDayAppointmentGeometry = function _getAllDayAppointmentGeometry(coordinates) {
    const config = this._calculateGeometryConfig(coordinates);
    return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset, true);
  };
  _proto._calculateGeometryConfig = function _calculateGeometryConfig(coordinates) {
    if (!this.allowResizing || !this.allowAllDayResizing) {
      coordinates.skipResizing = true;
    }
    const config = _BaseAppointmentsStra.prototype._calculateGeometryConfig.call(this, coordinates);
    const minAppointmentCountPerCell = Math.min(config.appointmentCountPerCell, this._getDynamicAppointmentCountPerCell().allDay);
    if (coordinates.allDay && coordinates.count <= minAppointmentCountPerCell) {
      config.offset = 0;
    }
    return config;
  };
  _proto._getAppointmentCount = function _getAppointmentCount(overlappingMode, coordinates) {
    return overlappingMode !== 'auto' && coordinates.count === 1 && !(0, _type.isNumeric)(overlappingMode) ? coordinates.count : this._getMaxAppointmentCountPerCellByType(coordinates.allDay);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._getDefaultRatio = function _getDefaultRatio(coordinates, appointmentCountPerCell) {
    return coordinates.count > this.appointmentCountPerCell ? 0.65 : 1;
  };
  _proto._getOffsets = function _getOffsets() {
    return {
      unlimited: ALLDAY_APPOINTMENT_MIN_VERTICAL_OFFSET,
      auto: ALLDAY_APPOINTMENT_MAX_VERTICAL_OFFSET
    };
  };
  _proto._getMaxHeight = function _getMaxHeight() {
    return this.allDayHeight || this.getAppointmentMinSize();
  }
  // eslint-disable-next-line class-methods-use-this
  ;
  _proto._needVerticalGroupBounds = function _needVerticalGroupBounds(allDay) {
    return !allDay;
  };
  _proto._needHorizontalGroupBounds = function _needHorizontalGroupBounds() {
    return false;
  };
  _proto.getPositionShift = function getPositionShift(timeShift, isAllDay) {
    if (!isAllDay && this.isAdaptive && this._getMaxAppointmentCountPerCellByType(isAllDay) === 0) {
      return {
        top: 0,
        left: 0,
        cellPosition: 0
      };
    }
    return _BaseAppointmentsStra.prototype.getPositionShift.call(this, timeShift, isAllDay);
  };
  _proto._needAdjustDuration = function _needAdjustDuration() {
    return false;
  };
  return VerticalRenderingStrategy;
}(_m_strategy_base.default);
var _default = exports.default = VerticalRenderingStrategy;
