"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _m_position_helper = require("../../workspaces/helpers/m_position_helper");
var _m_strategy_horizontal_month_line = _interopRequireDefault(require("./m_strategy_horizontal_month_line"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const MONTH_APPOINTMENT_HEIGHT_RATIO = 0.6;
const MONTH_APPOINTMENT_MIN_OFFSET = 26;
const MONTH_APPOINTMENT_MAX_OFFSET = 30;
const MONTH_DROPDOWN_APPOINTMENT_MIN_RIGHT_OFFSET = 36;
const MONTH_DROPDOWN_APPOINTMENT_MAX_RIGHT_OFFSET = 60;
const toMs = _date.default.dateToMilliseconds;
let HorizontalMonthRenderingStrategy = /*#__PURE__*/function (_HorizontalMonthLineR) {
  _inheritsLoose(HorizontalMonthRenderingStrategy, _HorizontalMonthLineR);
  function HorizontalMonthRenderingStrategy() {
    return _HorizontalMonthLineR.apply(this, arguments) || this;
  }
  var _proto = HorizontalMonthRenderingStrategy.prototype;
  _proto._getLeftPosition = function _getLeftPosition(settings) {
    const fullWeekAppointmentWidth = this.getGroupWidth(settings.groupIndex);
    return this._calculateMultiWeekAppointmentLeftOffset(settings.hMax, fullWeekAppointmentWidth);
  };
  _proto._getChunkCount = function _getChunkCount(fullChunksWidth, firstChunkWidth, weekWidth, settings) {
    const {
      groupIndex,
      info: {
        appointment: {
          startDate
        }
      }
    } = settings;
    const rawFullChunksWidth = fullChunksWidth - firstChunkWidth + weekWidth;
    const allChunksCount = Math.ceil(rawFullChunksWidth / weekWidth);
    const viewRowIndex = this._tryGetRowIndexInView(startDate);
    if (viewRowIndex !== undefined) {
      const viewChunksCount = this.viewDataProvider.getRowCountInGroup(groupIndex);
      const allowedChunksCount = viewChunksCount - viewRowIndex;
      return allChunksCount <= allowedChunksCount ? allChunksCount : allowedChunksCount;
    }
    return allChunksCount;
  }
  // NOTE: This method tries to get real row index inside appointment's group view.
  // We cannot use settings.rowIndex, because this row index for all date table and not for special group.
  ;
  _proto._tryGetRowIndexInView = function _tryGetRowIndexInView(positionStartDate) {
    var _a;
    const columnsCount = this.viewDataProvider.getColumnsCount();
    if (((_a = this.options.dataRange) === null || _a === void 0 ? void 0 : _a.length) < 1 || !columnsCount) {
      return undefined;
    }
    const [startViewDate] = this.options.dateRange;
    // NOTE: We cannot take cellDuration from options,
    // because startDayHour/endDayHour takes affect in renovation scheduler.
    const dayDurationMs = toMs('day');
    const timeFromStart = positionStartDate.getTime() - startViewDate.getTime();
    return Math.floor(timeFromStart / dayDurationMs / columnsCount);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._getChunkWidths = function _getChunkWidths(geometry, settings, weekWidth) {
    const firstChunkWidth = geometry.reducedWidth;
    const fullChunksWidth = Math.floor(geometry.sourceAppointmentWidth);
    const widthWithoutFirstChunk = fullChunksWidth - firstChunkWidth;
    return [firstChunkWidth, fullChunksWidth, widthWithoutFirstChunk];
  };
  _proto._getTailChunkSettings = function _getTailChunkSettings(withoutFirstChunkWidth, weekWidth, leftPosition) {
    const tailChunkWidth = withoutFirstChunkWidth % weekWidth || weekWidth;
    const rtlPosition = leftPosition + (weekWidth - tailChunkWidth);
    const tailChunkLeftPosition = this.rtlEnabled ? rtlPosition : leftPosition;
    return [tailChunkWidth, tailChunkLeftPosition];
  };
  _proto._getAppointmentParts = function _getAppointmentParts(geometry, settings) {
    const result = [];
    const weekWidth = Math.round(this.getGroupWidth(settings.groupIndex));
    const [firstChunkWidth, fullChunksWidth, withoutFirstChunkWidth] = this._getChunkWidths(geometry, settings, weekWidth);
    const leftPosition = this._getLeftPosition(settings);
    const {
      endDate
    } = settings.info.appointment;
    const hasTailChunk = this.endViewDate > endDate;
    const chunkCount = this._getChunkCount(fullChunksWidth, firstChunkWidth, weekWidth, settings);
    const [tailChunkWidth, tailChunkLeftPosition] = this._getTailChunkSettings(withoutFirstChunkWidth, weekWidth, leftPosition);
    for (let chunkIndex = 1; chunkIndex < chunkCount; chunkIndex++) {
      const topPosition = settings.top + this.cellHeight * chunkIndex;
      const isTailChunk = hasTailChunk && chunkIndex === chunkCount - 1;
      result.push(_extends(_extends({}, settings), {
        top: topPosition,
        left: isTailChunk ? tailChunkLeftPosition : leftPosition,
        height: geometry.height,
        width: isTailChunk ? tailChunkWidth : weekWidth,
        appointmentReduced: isTailChunk ? 'tail' : 'body',
        rowIndex: ++settings.rowIndex,
        columnIndex: 0
      }));
    }
    return result;
  };
  _proto._calculateMultiWeekAppointmentLeftOffset = function _calculateMultiWeekAppointmentLeftOffset(max, width) {
    return this.rtlEnabled ? max : max - width;
  };
  _proto.getGroupWidth = function getGroupWidth(groupIndex) {
    return (0, _m_position_helper.getGroupWidth)(groupIndex, this.viewDataProvider, {
      intervalCount: this.options.intervalCount,
      currentDate: this.options.currentDate,
      viewType: this.options.viewType,
      hoursInterval: this.options.hoursInterval,
      startDayHour: this.options.startDayHour,
      endDayHour: this.options.endDayHour,
      isVirtualScrolling: this.isVirtualScrolling,
      rtlEnabled: this.rtlEnabled,
      DOMMetaData: this.DOMMetaData
    });
  };
  _proto._getAppointmentDefaultHeight = function _getAppointmentDefaultHeight() {
    return this._getAppointmentHeightByTheme();
  };
  _proto._getAppointmentMinHeight = function _getAppointmentMinHeight() {
    return this._getAppointmentDefaultHeight();
  };
  _proto.createTaskPositionMap = function createTaskPositionMap(items) {
    return _HorizontalMonthLineR.prototype.createTaskPositionMap.call(this, items, true);
  };
  _proto._getSortedPositions = function _getSortedPositions(map) {
    return _HorizontalMonthLineR.prototype._getSortedPositions.call(this, map, true);
  };
  _proto._getDefaultRatio = function _getDefaultRatio() {
    return MONTH_APPOINTMENT_HEIGHT_RATIO;
  };
  _proto._getOffsets = function _getOffsets() {
    return {
      unlimited: MONTH_APPOINTMENT_MIN_OFFSET,
      auto: MONTH_APPOINTMENT_MAX_OFFSET
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.getDropDownAppointmentWidth = function getDropDownAppointmentWidth(intervalCount, isAllDay) {
    if (this.adaptivityEnabled) {
      return this.getDropDownButtonAdaptiveSize();
    }
    const offset = intervalCount > 1 ? MONTH_DROPDOWN_APPOINTMENT_MAX_RIGHT_OFFSET : MONTH_DROPDOWN_APPOINTMENT_MIN_RIGHT_OFFSET;
    return this.cellWidth - offset;
  };
  _proto.needCorrectAppointmentDates = function needCorrectAppointmentDates() {
    return false;
  };
  _proto._needVerticalGroupBounds = function _needVerticalGroupBounds() {
    return false;
  };
  _proto._needHorizontalGroupBounds = function _needHorizontalGroupBounds() {
    return true;
  };
  _createClass(HorizontalMonthRenderingStrategy, [{
    key: "endViewDate",
    get: function () {
      return this.options.endViewDate;
    }
  }, {
    key: "adaptivityEnabled",
    get: function () {
      return this.options.adaptivityEnabled;
    }
  }, {
    key: "DOMMetaData",
    get: function () {
      return this.options.DOMMetaData;
    }
  }]);
  return HorizontalMonthRenderingStrategy;
}(_m_strategy_horizontal_month_line.default);
var _default = exports.default = HorizontalMonthRenderingStrategy;