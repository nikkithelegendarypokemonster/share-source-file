"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _element = require("../../../core/element");
var _element_data = require("../../../core/element_data");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _date_serialization = _interopRequireDefault(require("../../../core/utils/date_serialization"));
var _extend = require("../../../core/utils/extend");
var _click = require("../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _hover = require("../../../events/hover");
var _index = require("../../../events/utils/index");
var _date2 = _interopRequireDefault(require("../../../localization/date"));
var _message = _interopRequireDefault(require("../../../localization/message"));
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.widget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error
const {
  abstract
} = _ui.default;
const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_CELL_START_CLASS = 'dx-calendar-cell-start';
const CALENDAR_CELL_END_CLASS = 'dx-calendar-cell-end';
const CALENDAR_CELL_START_IN_ROW_CLASS = 'dx-calendar-cell-start-in-row';
const CALENDAR_CELL_END_IN_ROW_CLASS = 'dx-calendar-cell-end-in-row';
const CALENDAR_WEEK_NUMBER_CELL_CLASS = 'dx-calendar-week-number-cell';
const CALENDAR_EMPTY_CELL_CLASS = 'dx-calendar-empty-cell';
const CALENDAR_TODAY_CLASS = 'dx-calendar-today';
const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_CELL_IN_RANGE_CLASS = 'dx-calendar-cell-in-range';
const CALENDAR_CELL_RANGE_HOVER_CLASS = 'dx-calendar-cell-range-hover';
const CALENDAR_CELL_RANGE_HOVER_START_CLASS = 'dx-calendar-cell-range-hover-start';
const CALENDAR_CELL_RANGE_HOVER_END_CLASS = 'dx-calendar-cell-range-hover-end';
const CALENDAR_RANGE_START_DATE_CLASS = 'dx-calendar-range-start-date';
const CALENDAR_RANGE_END_DATE_CLASS = 'dx-calendar-range-end-date';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';
const NOT_WEEK_CELL_SELECTOR = `td:not(.${CALENDAR_WEEK_NUMBER_CELL_CLASS})`;
const CALENDAR_DXCLICK_EVENT_NAME = (0, _index.addNamespace)(_click.name, 'dxCalendar');
const CALENDAR_DXHOVERSTART_EVENT_NAME = (0, _index.addNamespace)(_hover.start, 'dxCalendar');
const CALENDAR_DATE_VALUE_KEY = 'dxDateValueKey';
const DAY_INTERVAL = 86400000;
const CURRENT_DATE_TEXT = {
  month: _message.default.format('dxCalendar-currentDay'),
  year: _message.default.format('dxCalendar-currentMonth'),
  decade: _message.default.format('dxCalendar-currentYear'),
  century: _message.default.format('dxCalendar-currentYearRange')
};
const ARIA_LABEL_DATE_FORMAT = 'date';
const SELECTION_MODE = {
  single: 'single',
  multiple: 'multiple',
  range: 'range'
};
const BaseView = _ui.default.inherit({
  _getViewName() {
    return 'base';
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      date: new Date(),
      focusStateEnabled: false,
      cellTemplate: null,
      disabledDates: null,
      onCellClick: null,
      onCellHover: null,
      onWeekNumberClick: null,
      rowCount: 3,
      colCount: 4,
      allowValueSelection: true,
      _todayDate: () => new Date()
    });
  },
  _initMarkup() {
    this.callBase();
    this._renderImpl();
  },
  _renderImpl() {
    this.$element().append(this._createTable());
    this._createDisabledDatesHandler();
    this._renderBody();
    this._renderContouredDate();
    this._renderValue();
    this._renderRange();
    this._renderEvents();
    this._updateTableAriaLabel();
  },
  _getLocalizedWidgetName() {
    const localizedWidgetName = _message.default.format('dxCalendar-ariaWidgetName');
    return localizedWidgetName;
  },
  _getSingleModeAriaLabel() {
    const {
      value
    } = this.option();
    const localizedWidgetName = this._getLocalizedWidgetName();
    const formattedDate = _date2.default.format(value, ARIA_LABEL_DATE_FORMAT);
    // @ts-expect-error
    const selectedDatesText = _message.default.format('dxCalendar-selectedDate', formattedDate);
    const ariaLabel = `${localizedWidgetName}. ${selectedDatesText}`;
    return ariaLabel;
  },
  _getRangeModeAriaLabel() {
    const {
      value
    } = this.option();
    const localizedWidgetName = this._getLocalizedWidgetName();
    const [startDate, endDate] = value;
    const formattedStartDate = _date2.default.format(startDate, ARIA_LABEL_DATE_FORMAT);
    const formattedEndDate = _date2.default.format(endDate, ARIA_LABEL_DATE_FORMAT);
    const selectedDatesText = startDate && endDate
    // @ts-expect-error
    ? _message.default.format('dxCalendar-selectedDateRange', formattedStartDate, formattedEndDate)
    // @ts-expect-error
    : _message.default.format('dxCalendar-selectedDate', formattedStartDate ?? formattedEndDate);
    const ariaLabel = `${localizedWidgetName}. ${selectedDatesText}`;
    return ariaLabel;
  },
  _getMultipleModeAriaLabel() {
    const localizedWidgetName = this._getLocalizedWidgetName();
    const selectedRangesText = this._getMultipleRangesText();
    const ariaLabel = `${localizedWidgetName}. ${selectedRangesText}`;
    return ariaLabel;
  },
  _getMultipleRangesText() {
    const {
      value
    } = this.option();
    const ranges = _date.default.getRangesByDates(value.map(date => new Date(date)));
    if (ranges.length > 2) {
      // @ts-expect-error
      const dateRangeCountText = _message.default.format('dxCalendar-selectedDateRangeCount', ranges.length);
      return dateRangeCountText;
    }
    const selectedDatesText = _message.default.format('dxCalendar-selectedDates');
    const rangesText = ranges.map(range => this._getRangeText(range)).join(', ');
    const result = `${selectedDatesText}: ${rangesText}`;
    return result;
  },
  _getRangeText(range) {
    const [startDate, endDate] = range;
    const formattedStartDate = _date2.default.format(startDate, ARIA_LABEL_DATE_FORMAT);
    const formattedEndDate = _date2.default.format(endDate, ARIA_LABEL_DATE_FORMAT);
    const selectedDatesText = startDate && endDate
    // @ts-expect-error
    ? _message.default.format('dxCalendar-selectedMultipleDateRange', formattedStartDate, formattedEndDate) : formattedStartDate;
    return selectedDatesText;
  },
  _getTableAriaLabel() {
    const {
      value,
      selectionMode
    } = this.option();
    const isValueEmpty = !value || Array.isArray(value) && !value.filter(Boolean).length;
    if (isValueEmpty) {
      return this._getLocalizedWidgetName();
    }
    // eslint-disable-next-line default-case
    switch (selectionMode) {
      case SELECTION_MODE.single:
        return this._getSingleModeAriaLabel();
      case SELECTION_MODE.range:
        return this._getRangeModeAriaLabel();
      case SELECTION_MODE.multiple:
        return this._getMultipleModeAriaLabel();
    }
  },
  _updateTableAriaLabel() {
    const label = this._getTableAriaLabel();
    this.setAria({
      label
    }, this._$table);
  },
  _createTable() {
    this._$table = (0, _renderer.default)('<table>');
    this.setAria({
      role: 'grid'
    }, this._$table);
    return this._$table;
  },
  _renderBody() {
    this.$body = (0, _renderer.default)('<tbody>').appendTo(this._$table);
    const rowData = {
      cellDate: this._getFirstCellData(),
      prevCellDate: null
    };
    for (let rowIndex = 0, rowCount = this.option('rowCount'); rowIndex < rowCount; rowIndex++) {
      // @ts-expect-error
      rowData.row = this._createRow();
      for (let colIndex = 0, colCount = this.option('colCount'); colIndex < colCount; colIndex++) {
        this._renderCell(rowData, colIndex);
      }
      this._renderWeekNumberCell(rowData);
    }
  },
  _createRow() {
    const row = _dom_adapter.default.createElement('tr');
    this.setAria('role', 'row', (0, _renderer.default)(row));
    this.$body.get(0).appendChild(row);
    return row;
  },
  _createCell(cellDate, cellIndex) {
    const cell = _dom_adapter.default.createElement('td');
    const $cell = (0, _renderer.default)(cell);
    cell.className = this._getClassNameByDate(cellDate, cellIndex);
    cell.setAttribute('data-value', _date_serialization.default.serializeDate(cellDate, _date.default.getShortDateFormat()));
    (0, _element_data.data)(cell, CALENDAR_DATE_VALUE_KEY, cellDate);
    this.setAria({
      role: 'gridcell',
      selected: false,
      label: this.getCellAriaLabel(cellDate)
    }, $cell);
    return {
      cell,
      $cell
    };
  },
  _renderCell(params, cellIndex) {
    const {
      cellDate,
      prevCellDate,
      row
    } = params;
    // T425127
    if (prevCellDate) {
      _date.default.fixTimezoneGap(prevCellDate, cellDate);
    }
    params.prevCellDate = cellDate;
    const {
      cell,
      $cell
    } = this._createCell(cellDate, cellIndex);
    const cellTemplate = this.option('cellTemplate');
    (0, _renderer.default)(row).append(cell);
    if (cellTemplate) {
      cellTemplate.render(this._prepareCellTemplateData(cellDate, cellIndex, $cell));
    } else {
      cell.innerHTML = this._getCellText(cellDate);
    }
    params.cellDate = this._getNextCellData(cellDate);
  },
  _getClassNameByDate(cellDate, cellIndex) {
    let className = CALENDAR_CELL_CLASS;
    if (this._isTodayCell(cellDate)) {
      className += ` ${CALENDAR_TODAY_CLASS}`;
    }
    if (this._isDateOutOfRange(cellDate) || this.isDateDisabled(cellDate)) {
      className += ` ${CALENDAR_EMPTY_CELL_CLASS}`;
    }
    if (this._isOtherView(cellDate)) {
      className += ` ${CALENDAR_OTHER_VIEW_CLASS}`;
    }
    if (this.option('selectionMode') === SELECTION_MODE.range) {
      if (cellIndex === 0) {
        className += ` ${CALENDAR_CELL_START_IN_ROW_CLASS}`;
      }
      if (cellIndex === this.option('colCount') - 1) {
        className += ` ${CALENDAR_CELL_END_IN_ROW_CLASS}`;
      }
      if (this._isStartDayOfMonth(cellDate)) {
        className += ` ${CALENDAR_CELL_START_CLASS}`;
      }
      if (this._isEndDayOfMonth(cellDate)) {
        className += ` ${CALENDAR_CELL_END_CLASS}`;
      }
    }
    return className;
  },
  _prepareCellTemplateData(cellDate, cellIndex, $cell) {
    const isDateCell = cellDate instanceof Date;
    const text = isDateCell ? this._getCellText(cellDate) : cellDate;
    const date = isDateCell ? cellDate : undefined;
    const view = this._getViewName();
    return {
      model: {
        text,
        date,
        view
      },
      container: (0, _element.getPublicElement)($cell),
      index: cellIndex
    };
  },
  _renderEvents() {
    this._createCellClickAction();
    _events_engine.default.off(this._$table, CALENDAR_DXCLICK_EVENT_NAME);
    _events_engine.default.on(this._$table, CALENDAR_DXCLICK_EVENT_NAME, NOT_WEEK_CELL_SELECTOR, e => {
      if (!(0, _renderer.default)(e.currentTarget).hasClass(CALENDAR_EMPTY_CELL_CLASS)) {
        this._cellClickAction({
          event: e,
          value: (0, _renderer.default)(e.currentTarget).data(CALENDAR_DATE_VALUE_KEY)
        });
      }
    });
    const {
      selectionMode
    } = this.option();
    _events_engine.default.off(this._$table, CALENDAR_DXHOVERSTART_EVENT_NAME);
    if (selectionMode === SELECTION_MODE.range) {
      this._createCellHoverAction();
      _events_engine.default.on(this._$table, CALENDAR_DXHOVERSTART_EVENT_NAME, NOT_WEEK_CELL_SELECTOR, e => {
        if (!(0, _renderer.default)(e.currentTarget).hasClass(CALENDAR_EMPTY_CELL_CLASS)) {
          this._cellHoverAction({
            event: e,
            value: (0, _renderer.default)(e.currentTarget).data(CALENDAR_DATE_VALUE_KEY)
          });
        }
      });
    }
    if (selectionMode !== SELECTION_MODE.single) {
      this._createWeekNumberCellClickAction();
      _events_engine.default.on(this._$table, CALENDAR_DXCLICK_EVENT_NAME, `.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`, e => {
        const $row = (0, _renderer.default)(e.currentTarget).closest('tr');
        const firstDateInRow = $row.find(`.${CALENDAR_CELL_CLASS}`).first().data(CALENDAR_DATE_VALUE_KEY);
        const lastDateInRow = $row.find(`.${CALENDAR_CELL_CLASS}`).last().data(CALENDAR_DATE_VALUE_KEY);
        const rowDates = [..._date.default.getDatesOfInterval(firstDateInRow, lastDateInRow, DAY_INTERVAL), lastDateInRow];
        this._weekNumberCellClickAction({
          event: e,
          rowDates
        });
      });
    }
  },
  _createCellClickAction() {
    this._cellClickAction = this._createActionByOption('onCellClick');
  },
  _createCellHoverAction() {
    this._cellHoverAction = this._createActionByOption('onCellHover');
  },
  _createWeekNumberCellClickAction() {
    this._weekNumberCellClickAction = this._createActionByOption('onWeekNumberClick');
  },
  _createDisabledDatesHandler() {
    const disabledDates = this.option('disabledDates');
    this._disabledDatesHandler = Array.isArray(disabledDates) ? this._getDefaultDisabledDatesHandler(disabledDates) : disabledDates || _common.noop;
  },
  _getDefaultDisabledDatesHandler() {
    return _common.noop;
  },
  _isTodayCell: abstract,
  _isDateOutOfRange: abstract,
  isDateDisabled(cellDate) {
    const dateParts = {
      date: cellDate,
      view: this._getViewName()
    };
    return this._disabledDatesHandler(dateParts);
  },
  _isOtherView: abstract,
  _isStartDayOfMonth: abstract,
  _isEndDayOfMonth: abstract,
  _getCellText: abstract,
  _getFirstCellData: abstract,
  _getNextCellData: abstract,
  _renderContouredDate(contouredDate) {
    if (!this.option('focusStateEnabled')) {
      return;
    }
    contouredDate = contouredDate || this.option('contouredDate');
    const $oldContouredCell = this._getContouredCell();
    const $newContouredCell = this._getCellByDate(contouredDate);
    $oldContouredCell.removeClass(CALENDAR_CONTOURED_DATE_CLASS);
    if (contouredDate) {
      $newContouredCell.addClass(CALENDAR_CONTOURED_DATE_CLASS);
    }
  },
  _getContouredCell() {
    return this._$table.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);
  },
  _renderValue() {
    if (!this.option('allowValueSelection')) {
      return;
    }
    let value = this.option('value');
    if (!Array.isArray(value)) {
      value = [value];
    }
    this._updateSelectedClass(value);
  },
  _updateSelectedClass(value) {
    var _this$_$selectedCells;
    if (this._isRangeMode() && !this._isMonthView()) {
      return;
    }
    (_this$_$selectedCells = this._$selectedCells) === null || _this$_$selectedCells === void 0 || _this$_$selectedCells.forEach($cell => {
      $cell.removeClass(CALENDAR_SELECTED_DATE_CLASS);
    });
    this._$selectedCells = value.map(value => this._getCellByDate(value));
    this._$selectedCells.forEach($cell => {
      $cell.addClass(CALENDAR_SELECTED_DATE_CLASS);
    });
  },
  _renderRange() {
    var _this$_$rangeCells, _this$_$hoveredRangeC, _this$_$rangeStartHov, _this$_$rangeEndHover, _this$_$rangeStartDat, _this$_$rangeEndDateC, _this$_$rangeStartDat2, _this$_$rangeEndDateC2;
    const {
      allowValueSelection,
      value,
      range
    } = this.option();
    if (!allowValueSelection || !this._isRangeMode() || !this._isMonthView()) {
      return;
    }
    (_this$_$rangeCells = this._$rangeCells) === null || _this$_$rangeCells === void 0 || _this$_$rangeCells.forEach($cell => {
      $cell.removeClass(CALENDAR_CELL_IN_RANGE_CLASS);
    });
    (_this$_$hoveredRangeC = this._$hoveredRangeCells) === null || _this$_$hoveredRangeC === void 0 || _this$_$hoveredRangeC.forEach($cell => {
      $cell.removeClass(CALENDAR_CELL_RANGE_HOVER_CLASS);
    });
    (_this$_$rangeStartHov = this._$rangeStartHoverCell) === null || _this$_$rangeStartHov === void 0 || _this$_$rangeStartHov.removeClass(CALENDAR_CELL_RANGE_HOVER_START_CLASS);
    (_this$_$rangeEndHover = this._$rangeEndHoverCell) === null || _this$_$rangeEndHover === void 0 || _this$_$rangeEndHover.removeClass(CALENDAR_CELL_RANGE_HOVER_END_CLASS);
    (_this$_$rangeStartDat = this._$rangeStartDateCell) === null || _this$_$rangeStartDat === void 0 || _this$_$rangeStartDat.removeClass(CALENDAR_RANGE_START_DATE_CLASS);
    (_this$_$rangeEndDateC = this._$rangeEndDateCell) === null || _this$_$rangeEndDateC === void 0 || _this$_$rangeEndDateC.removeClass(CALENDAR_RANGE_END_DATE_CLASS);
    this._$rangeCells = range.map(value => this._getCellByDate(value));
    this._$rangeStartDateCell = this._getCellByDate(value[0]);
    this._$rangeEndDateCell = this._getCellByDate(value[1]);
    this._$rangeCells.forEach($cell => {
      $cell.addClass(CALENDAR_CELL_IN_RANGE_CLASS);
    });
    (_this$_$rangeStartDat2 = this._$rangeStartDateCell) === null || _this$_$rangeStartDat2 === void 0 || _this$_$rangeStartDat2.addClass(CALENDAR_RANGE_START_DATE_CLASS);
    (_this$_$rangeEndDateC2 = this._$rangeEndDateCell) === null || _this$_$rangeEndDateC2 === void 0 || _this$_$rangeEndDateC2.addClass(CALENDAR_RANGE_END_DATE_CLASS);
  },
  _renderHoveredRange() {
    var _this$_$hoveredRangeC2, _this$_$rangeStartHov2, _this$_$rangeEndHover2, _this$_$rangeStartHov3, _this$_$rangeEndHover3;
    const {
      allowValueSelection,
      hoveredRange
    } = this.option();
    if (!allowValueSelection || !this._isRangeMode() || !this._isMonthView()) {
      return;
    }
    (_this$_$hoveredRangeC2 = this._$hoveredRangeCells) === null || _this$_$hoveredRangeC2 === void 0 || _this$_$hoveredRangeC2.forEach($cell => {
      $cell.removeClass(CALENDAR_CELL_RANGE_HOVER_CLASS);
    });
    (_this$_$rangeStartHov2 = this._$rangeStartHoverCell) === null || _this$_$rangeStartHov2 === void 0 || _this$_$rangeStartHov2.removeClass(CALENDAR_CELL_RANGE_HOVER_START_CLASS);
    (_this$_$rangeEndHover2 = this._$rangeEndHoverCell) === null || _this$_$rangeEndHover2 === void 0 || _this$_$rangeEndHover2.removeClass(CALENDAR_CELL_RANGE_HOVER_END_CLASS);
    this._$hoveredRangeCells = hoveredRange.map(value => this._getCellByDate(value));
    this._$rangeStartHoverCell = this._getCellByDate(hoveredRange[0]);
    this._$rangeEndHoverCell = this._getCellByDate(hoveredRange[hoveredRange.length - 1]);
    this._$hoveredRangeCells.forEach($cell => {
      $cell.addClass(CALENDAR_CELL_RANGE_HOVER_CLASS);
    });
    (_this$_$rangeStartHov3 = this._$rangeStartHoverCell) === null || _this$_$rangeStartHov3 === void 0 || _this$_$rangeStartHov3.addClass(CALENDAR_CELL_RANGE_HOVER_START_CLASS);
    (_this$_$rangeEndHover3 = this._$rangeEndHoverCell) === null || _this$_$rangeEndHover3 === void 0 || _this$_$rangeEndHover3.addClass(CALENDAR_CELL_RANGE_HOVER_END_CLASS);
  },
  _isMonthView() {
    return this.option('zoomLevel') === 'month';
  },
  _isRangeMode() {
    return this.option('selectionMode') === SELECTION_MODE.range;
  },
  _getCurrentDateFormat() {
    return null;
  },
  getCellAriaLabel(date) {
    const viewName = this._getViewName();
    const isToday = this._isTodayCell(date);
    const format = this._getCurrentDateFormat();
    const dateRangeText = format ? _date2.default.format(date, format) : this._getCellText(date);
    const ariaLabel = isToday ? `${dateRangeText}. ${CURRENT_DATE_TEXT[viewName]}` : dateRangeText;
    return ariaLabel;
  },
  _getFirstAvailableDate() {
    let date = this.option('date');
    const min = this.option('min');
    date = _date.default.getViewFirstCellDate(this._getViewName(), date);
    return new Date(min && date < min ? min : date);
  },
  _getCellByDate: abstract,
  isBoundary: abstract,
  _optionChanged(args) {
    const {
      name,
      value
    } = args;
    switch (name) {
      case 'value':
        this._renderValue();
        this._updateTableAriaLabel();
        break;
      case 'range':
        this._renderRange();
        break;
      case 'hoveredRange':
        this._renderHoveredRange();
        break;
      case 'contouredDate':
        this._renderContouredDate(value);
        break;
      case 'onCellClick':
        this._createCellClickAction();
        break;
      case 'onCellHover':
        this._createCellHoverAction();
        break;
      case 'min':
      case 'max':
      case 'disabledDates':
      case 'cellTemplate':
      case 'selectionMode':
        this._invalidate();
        break;
      case '_todayDate':
        this._renderBody();
        break;
      default:
        this.callBase(args);
    }
  }
});
var _default = exports.default = BaseView;