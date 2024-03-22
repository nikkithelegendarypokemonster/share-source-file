/**
* DevExtreme (bundles/__internal/scheduler/workspaces/m_work_space_month.js)
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
var _common = require("../../../core/utils/common");
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _position = require("../../../core/utils/position");
var _window = require("../../../core/utils/window");
var _layout = _interopRequireDefault(require("../../../renovation/ui/scheduler/workspaces/month/date_table/layout.j"));
var _index = require("../__migration/utils/index");
var _m_constants = require("../m_constants");
var _m_utils = require("../m_utils");
var _m_work_space_indicator = _interopRequireDefault(require("./m_work_space_indicator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } // NOTE: Renovation component import.
// @ts-expect-error
const MONTH_CLASS = 'dx-scheduler-work-space-month';
const DATE_TABLE_CURRENT_DATE_CLASS = 'dx-scheduler-date-table-current-date';
const DATE_TABLE_CELL_TEXT_CLASS = 'dx-scheduler-date-table-cell-text';
const DATE_TABLE_FIRST_OF_MONTH_CLASS = 'dx-scheduler-date-table-first-of-month';
const DATE_TABLE_OTHER_MONTH_DATE_CLASS = 'dx-scheduler-date-table-other-month';
const toMs = _date.default.dateToMilliseconds;
let SchedulerWorkSpaceMonth = /*#__PURE__*/function (_SchedulerWorkSpace) {
  _inheritsLoose(SchedulerWorkSpaceMonth, _SchedulerWorkSpace);
  function SchedulerWorkSpaceMonth() {
    return _SchedulerWorkSpace.apply(this, arguments) || this;
  }
  var _proto = SchedulerWorkSpaceMonth.prototype;
  _proto._getElementClass = function _getElementClass() {
    return MONTH_CLASS;
  };
  _proto._getFormat = function _getFormat() {
    return _index.formatWeekday;
  };
  _proto._getIntervalBetween = function _getIntervalBetween(currentDate) {
    const firstViewDate = this.getStartViewDate();
    const timeZoneOffset = _date.default.getTimezonesDifference(firstViewDate, currentDate);
    return currentDate.getTime() - (firstViewDate.getTime() - this.option('startDayHour') * 3600000) - timeZoneOffset;
  };
  _proto._getDateGenerationOptions = function _getDateGenerationOptions() {
    return _extends(_extends({}, _SchedulerWorkSpace.prototype._getDateGenerationOptions.call(this)), {
      cellCountInDay: 1
    });
  }
  // TODO: temporary fix, in the future, if we replace table layout on div layout, getCellWidth method need remove. Details in T712431
  // TODO: there is a test for this bug, when changing the layout, the test will also be useless
  ;
  _proto.getCellWidth = function getCellWidth() {
    return this.cache.get('cellWidth', () => {
      const DAYS_IN_WEEK = 7;
      let averageWidth = 0;
      const cells = this._getCells().slice(0, DAYS_IN_WEEK);
      cells.each((index, element) => {
        averageWidth += (0, _window.hasWindow)() ? (0, _position.getBoundingRect)(element).width : 0;
      });
      return cells.length === 0 ? undefined : averageWidth / DAYS_IN_WEEK;
    });
  };
  _proto._insertAllDayRowsIntoDateTable = function _insertAllDayRowsIntoDateTable() {
    return false;
  };
  _proto._getCellCoordinatesByIndex = function _getCellCoordinatesByIndex(index) {
    const rowIndex = Math.floor(index / this._getCellCount());
    const columnIndex = index - this._getCellCount() * rowIndex;
    return {
      rowIndex,
      columnIndex
    };
  };
  _proto._needCreateCrossScrolling = function _needCreateCrossScrolling() {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return this.option('crossScrollingEnabled') || this._isVerticalGroupedWorkSpace();
  };
  _proto._getViewStartByOptions = function _getViewStartByOptions() {
    return _index.monthUtils.getViewStartByOptions(this.option('startDate'), this.option('currentDate'), this.option('intervalCount'), _date.default.getFirstMonthDate(this.option('startDate')));
  };
  _proto._updateIndex = function _updateIndex(index) {
    return index;
  };
  _proto.isIndicationAvailable = function isIndicationAvailable() {
    return false;
  };
  _proto.getIntervalDuration = function getIntervalDuration() {
    return toMs('day');
  };
  _proto.getTimePanelWidth = function getTimePanelWidth() {
    return 0;
  };
  _proto.supportAllDayRow = function supportAllDayRow() {
    return false;
  };
  _proto.keepOriginalHours = function keepOriginalHours() {
    return true;
  };
  _proto.getWorkSpaceLeftOffset = function getWorkSpaceLeftOffset() {
    return 0;
  };
  _proto.needApplyCollectorOffset = function needApplyCollectorOffset() {
    return true;
  };
  _proto._getHeaderDate = function _getHeaderDate() {
    return this._getViewStartByOptions();
  };
  _proto.scrollToTime = function scrollToTime() {
    return (0, _common.noop)();
  };
  _proto.renderRAllDayPanel = function renderRAllDayPanel() {};
  _proto.renderRTimeTable = function renderRTimeTable() {};
  _proto.renderRDateTable = function renderRDateTable() {
    _m_utils.utils.renovation.renderComponent(this, this._$dateTable, _layout.default, 'renovatedDateTable', this._getRDateTableProps());
  }
  // -------------
  // We need these methods for now but they are useless for renovation
  // -------------
  ;
  _proto._createWorkSpaceElements = function _createWorkSpaceElements() {
    if (this._isVerticalGroupedWorkSpace()) {
      this._createWorkSpaceScrollableElements();
    } else {
      _SchedulerWorkSpace.prototype._createWorkSpaceElements.call(this);
    }
  };
  _proto._toggleAllDayVisibility = function _toggleAllDayVisibility() {
    return (0, _common.noop)();
  };
  _proto._changeAllDayVisibility = function _changeAllDayVisibility() {
    return (0, _common.noop)();
  }
  // --------------
  // These methods should be deleted when we get rid of old render
  // --------------
  ;
  _proto._renderTimePanel = function _renderTimePanel() {
    return (0, _common.noop)();
  };
  _proto._renderAllDayPanel = function _renderAllDayPanel() {
    return (0, _common.noop)();
  };
  _proto._setMonthClassesToCell = function _setMonthClassesToCell($cell, data) {
    $cell.toggleClass(DATE_TABLE_CURRENT_DATE_CLASS, data.isCurrentDate).toggleClass(DATE_TABLE_FIRST_OF_MONTH_CLASS, data.firstDayOfMonth).toggleClass(DATE_TABLE_OTHER_MONTH_DATE_CLASS, data.otherMonth);
  };
  _proto._createAllDayPanelElements = function _createAllDayPanelElements() {};
  _proto._renderTableBody = function _renderTableBody(options) {
    options.getCellText = (rowIndex, columnIndex) => {
      const date = this.viewDataProvider.completeViewDataMap[rowIndex][columnIndex].startDate;
      return _index.monthUtils.getCellText(date, this.option('intervalCount'));
    };
    options.getCellTextClass = DATE_TABLE_CELL_TEXT_CLASS;
    options.setAdditionalClasses = this._setMonthClassesToCell.bind(this);
    _SchedulerWorkSpace.prototype._renderTableBody.call(this, options);
  };
  _createClass(SchedulerWorkSpaceMonth, [{
    key: "type",
    get: function () {
      return _m_constants.VIEWS.MONTH;
    }
  }]);
  return SchedulerWorkSpaceMonth;
}(_m_work_space_indicator.default);
(0, _component_registrator.default)('dxSchedulerWorkSpaceMonth', SchedulerWorkSpaceMonth);
var _default = exports.default = SchedulerWorkSpaceMonth;
