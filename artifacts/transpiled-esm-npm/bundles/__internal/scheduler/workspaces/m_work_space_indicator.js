"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _extend = require("../../../core/utils/extend");
var _position = require("../../../core/utils/position");
var _size = require("../../../core/utils/size");
var _window = require("../../../core/utils/window");
var _date2 = require("../../core/utils/date");
var _index = require("../__migration/utils/index");
var _m_classes = require("../m_classes");
var _m_utils_time_zone = _interopRequireDefault(require("../m_utils_time_zone"));
var _m_work_space = _interopRequireDefault(require("./m_work_space"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const toMs = _date.default.dateToMilliseconds;
const SCHEDULER_DATE_TIME_INDICATOR_CLASS = 'dx-scheduler-date-time-indicator';
const TIME_PANEL_CURRENT_TIME_CELL_CLASS = 'dx-scheduler-time-panel-current-time-cell';
let SchedulerWorkSpaceIndicator = /*#__PURE__*/function (_SchedulerWorkSpace) {
  _inheritsLoose(SchedulerWorkSpaceIndicator, _SchedulerWorkSpace);
  function SchedulerWorkSpaceIndicator() {
    return _SchedulerWorkSpace.apply(this, arguments) || this;
  }
  var _proto = SchedulerWorkSpaceIndicator.prototype;
  // @ts-expect-error
  _proto._getToday = function _getToday() {
    const viewOffset = this.option('viewOffset');
    const today = (0, _index.getToday)(this.option('indicatorTime'), this.timeZoneCalculator);
    return _date2.dateUtilsTs.addOffsets(today, [-viewOffset]);
  };
  _proto.isIndicationOnView = function isIndicationOnView() {
    if (this.option('showCurrentTimeIndicator')) {
      const today = this._getToday();
      const endViewDate = _date.default.trimTime(this.getEndViewDate());
      return _date.default.dateInRange(today, this.getStartViewDate(), new Date(endViewDate.getTime() + toMs('day')));
    }
    return false;
  };
  _proto.isIndicationAvailable = function isIndicationAvailable() {
    if (!(0, _window.hasWindow)()) {
      return false;
    }
    const today = this._getToday();
    return today >= _date.default.trimTime(new Date(this.getStartViewDate()));
  };
  _proto.isIndicatorVisible = function isIndicatorVisible() {
    const today = this._getToday();
    // Subtracts 1 ms from the real endViewDate instead of 1 minute
    const endViewDate = new Date(this.getEndViewDate().getTime() + toMs('minute') - 1);
    const firstViewDate = new Date(this.getStartViewDate());
    firstViewDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
    endViewDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
    return _date.default.dateInRange(today, firstViewDate, endViewDate);
  };
  _proto._renderIndicator = function _renderIndicator(height, rtlOffset, $container, groupCount) {
    const groupedByDate = this.isGroupedByDate();
    const repeatCount = groupedByDate ? 1 : groupCount;
    for (let i = 0; i < repeatCount; i++) {
      const $indicator = this._createIndicator($container);
      (0, _size.setWidth)($indicator, groupedByDate ? this.getCellWidth() * groupCount : this.getCellWidth());
      this._groupedStrategy.shiftIndicator($indicator, height, rtlOffset, i);
    }
  };
  _proto._createIndicator = function _createIndicator($container) {
    const $indicator = (0, _renderer.default)('<div>').addClass(SCHEDULER_DATE_TIME_INDICATOR_CLASS);
    $container.append($indicator);
    return $indicator;
  };
  _proto._getRtlOffset = function _getRtlOffset(width) {
    return this.option('rtlEnabled') ? (0, _position.getBoundingRect)(this._dateTableScrollable.$content().get(0)).width - this.getTimePanelWidth() - width : 0;
  };
  _proto._setIndicationUpdateInterval = function _setIndicationUpdateInterval() {
    if (!this.option('showCurrentTimeIndicator') || this.option('indicatorUpdateInterval') === 0) {
      return;
    }
    this._clearIndicatorUpdateInterval();
    this._indicatorInterval = setInterval(() => {
      this.renderCurrentDateTimeIndication();
    }, this.option('indicatorUpdateInterval'));
  };
  _proto._clearIndicatorUpdateInterval = function _clearIndicatorUpdateInterval() {
    if (this._indicatorInterval) {
      clearInterval(this._indicatorInterval);
      delete this._indicatorInterval;
    }
  };
  _proto._isVerticalShader = function _isVerticalShader() {
    return true;
  };
  _proto.getIndicationWidth = function getIndicationWidth(groupIndex) {
    const maxWidth = this.getCellWidth() * this._getCellCount();
    let difference = this._getIndicatorDuration();
    if (difference > this._getCellCount()) {
      difference = this._getCellCount();
    }
    const width = difference * this.getRoundedCellWidth(groupIndex, groupIndex * this._getCellCount(), difference);
    return maxWidth < width ? maxWidth : width;
  };
  _proto.getIndicatorOffset = function getIndicatorOffset(groupIndex) {
    const difference = this._getIndicatorDuration() - 1;
    const offset = difference * this.getRoundedCellWidth(groupIndex, groupIndex * this._getCellCount(), difference);
    return offset;
  };
  _proto._getIndicatorDuration = function _getIndicatorDuration() {
    const today = this._getToday();
    const firstViewDate = new Date(this.getStartViewDate());
    let timeDiff = today.getTime() - firstViewDate.getTime();
    if (this.option('type') === 'workWeek') {
      timeDiff -= this._getWeekendsCount(Math.round(timeDiff / toMs('day'))) * toMs('day');
    }
    return Math.ceil((timeDiff + 1) / toMs('day'));
  };
  _proto.getIndicationHeight = function getIndicationHeight() {
    const today = _m_utils_time_zone.default.getDateWithoutTimezoneChange(this._getToday());
    const cellHeight = this.getCellHeight();
    const date = new Date(this.getStartViewDate());
    if (this.isIndicationOnView()) {
      date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
    }
    const duration = today.getTime() - date.getTime();
    const cellCount = duration / this.getCellDuration();
    return cellCount * cellHeight;
  };
  _proto._dispose = function _dispose() {
    this._clearIndicatorUpdateInterval();
    _SchedulerWorkSpace.prototype._dispose.apply(this, arguments);
  };
  _proto.renderCurrentDateTimeIndication = function renderCurrentDateTimeIndication() {
    this.renderCurrentDateTimeLineAndShader();
    if (this.isRenovatedRender()) {
      this.renderWorkSpace({
        generateNewData: true,
        renderComponents: {
          header: true,
          timePanel: true
        }
      });
    }
  };
  _proto.renderCurrentDateTimeLineAndShader = function renderCurrentDateTimeLineAndShader() {
    var _a;
    this._cleanDateTimeIndicator();
    (_a = this._shader) === null || _a === void 0 ? void 0 : _a.clean();
    this._renderDateTimeIndication();
  };
  _proto._isCurrentTimeHeaderCell = function _isCurrentTimeHeaderCell(headerIndex) {
    if (this.isIndicationOnView()) {
      const {
        completeDateHeaderMap
      } = this.viewDataProvider;
      const date = completeDateHeaderMap[completeDateHeaderMap.length - 1][headerIndex].startDate;
      return _date.default.sameDate(date, this._getToday());
    }
    return false;
  };
  _proto._getHeaderPanelCellClass = function _getHeaderPanelCellClass(i) {
    const cellClass = _SchedulerWorkSpace.prototype._getHeaderPanelCellClass.call(this, i);
    if (this._isCurrentTimeHeaderCell(i)) {
      return "".concat(cellClass, " ").concat(_m_classes.HEADER_CURRENT_TIME_CELL_CLASS);
    }
    return cellClass;
  };
  _proto._cleanView = function _cleanView() {
    _SchedulerWorkSpace.prototype._cleanView.call(this);
    this._cleanDateTimeIndicator();
  };
  _proto._dimensionChanged = function _dimensionChanged() {
    _SchedulerWorkSpace.prototype._dimensionChanged.call(this);
    this.renderCurrentDateTimeLineAndShader();
  };
  _proto._cleanDateTimeIndicator = function _cleanDateTimeIndicator() {
    this.$element().find(".".concat(SCHEDULER_DATE_TIME_INDICATOR_CLASS)).remove();
  };
  _proto._cleanWorkSpace = function _cleanWorkSpace() {
    _SchedulerWorkSpace.prototype._cleanWorkSpace.call(this);
    this._renderDateTimeIndication();
    this._setIndicationUpdateInterval();
  };
  _proto._optionChanged = function _optionChanged(args) {
    switch (args.name) {
      case 'showCurrentTimeIndicator':
      case 'indicatorTime':
        this._cleanWorkSpace();
        break;
      case 'indicatorUpdateInterval':
        this._setIndicationUpdateInterval();
        break;
      case 'showAllDayPanel':
      case 'allDayExpanded':
      case 'crossScrollingEnabled':
        _SchedulerWorkSpace.prototype._optionChanged.call(this, args);
        this.renderCurrentDateTimeIndication();
        break;
      case 'shadeUntilCurrentTime':
        this.renderCurrentDateTimeIndication();
        break;
      default:
        _SchedulerWorkSpace.prototype._optionChanged.call(this, args);
    }
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_SchedulerWorkSpace.prototype._getDefaultOptions.call(this), {
      showCurrentTimeIndicator: true,
      indicatorTime: new Date(),
      indicatorUpdateInterval: 5 * toMs('minute'),
      shadeUntilCurrentTime: true
    });
  };
  _proto._getCurrentTimePanelCellIndices = function _getCurrentTimePanelCellIndices() {
    const rowCountPerGroup = this._getTimePanelRowCount();
    const today = this._getToday();
    const index = this.getCellIndexByDate(today);
    const {
      rowIndex: currentTimeRowIndex
    } = this._getCellCoordinatesByIndex(index);
    if (currentTimeRowIndex === undefined) {
      return [];
    }
    let cellIndices;
    if (currentTimeRowIndex === 0) {
      cellIndices = [currentTimeRowIndex];
    } else {
      cellIndices = currentTimeRowIndex % 2 === 0 ? [currentTimeRowIndex - 1, currentTimeRowIndex] : [currentTimeRowIndex, currentTimeRowIndex + 1];
    }
    const verticalGroupCount = this._isVerticalGroupedWorkSpace() ? this._getGroupCount() : 1;
    return [...new Array(verticalGroupCount)].reduce((currentIndices, _, groupIndex) => [...currentIndices, ...cellIndices.map(cellIndex => rowCountPerGroup * groupIndex + cellIndex)], []);
  };
  _proto._renderDateTimeIndication = function _renderDateTimeIndication() {
    if (!this.isIndicationAvailable()) {
      return;
    }
    if (this.option('shadeUntilCurrentTime')) {
      this._shader.render();
    }
    if (!this.isIndicationOnView() || !this.isIndicatorVisible()) {
      return;
    }
    const groupCount = this._getGroupCount() || 1;
    const $container = this._dateTableScrollable.$content();
    const height = this.getIndicationHeight();
    const rtlOffset = this._getRtlOffset(this.getCellWidth());
    this._renderIndicator(height, rtlOffset, $container, groupCount);
    // TODO Old render: delete this code with the old render.
    if (!this.isRenovatedRender()) {
      this._setCurrentTimeCells();
    }
  }
  // Temporary new render methods.
  // TODO Old render: replace base call methods by these after the deleting of the old render.
  ;
  _proto._setCurrentTimeCells = function _setCurrentTimeCells() {
    const timePanelCells = this._getTimePanelCells();
    const currentTimeCellIndices = this._getCurrentTimePanelCellIndices();
    currentTimeCellIndices.forEach(timePanelCellIndex => {
      timePanelCells.eq(timePanelCellIndex).addClass(TIME_PANEL_CURRENT_TIME_CELL_CLASS);
    });
  };
  _proto._cleanCurrentTimeCells = function _cleanCurrentTimeCells() {
    this.$element().find(".".concat(TIME_PANEL_CURRENT_TIME_CELL_CLASS)).removeClass(TIME_PANEL_CURRENT_TIME_CELL_CLASS);
  };
  return SchedulerWorkSpaceIndicator;
}(_m_work_space.default);
(0, _component_registrator.default)('dxSchedulerWorkSpace', SchedulerWorkSpaceIndicator);
var _default = exports.default = SchedulerWorkSpaceIndicator;