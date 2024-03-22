import _extends from "@babel/runtime/helpers/esm/extends";
/* eslint-disable max-classes-per-file */
import { isDefined } from '../../../core/utils/type';
import { dateUtilsTs } from '../../core/utils/date';
class BaseStrategy {
  constructor(options) {
    this.isVirtualScrolling = false;
    this.options = options;
  }
  get DOMMetaData() {
    return this.options.DOMMetaData;
  }
  get appointments() {
    return this.options.dateSettings;
  } // TODO rename appoitments -> dateSettings
  get viewDataProvider() {
    return this.options.viewDataProvider;
  }
  get positionHelper() {
    return this.options.positionHelper;
  }
  get startViewDate() {
    return this.options.startViewDate;
  }
  get viewStartDayHour() {
    return this.options.viewStartDayHour;
  }
  get viewEndDayHour() {
    return this.options.viewEndDayHour;
  }
  get cellDuration() {
    return this.options.cellDuration;
  }
  get getPositionShift() {
    return this.options.getPositionShiftCallback;
  }
  get groupCount() {
    return this.options.groupCount;
  }
  get rtlEnabled() {
    return this.options.rtlEnabled;
  }
  get isVerticalGrouping() {
    return this.options.isVerticalGroupOrientation;
  }
  get showAllDayPanel() {
    return this.options.showAllDayPanel;
  }
  get supportAllDayRow() {
    return this.options.supportAllDayRow;
  }
  get isGroupedAllDayPanel() {
    return this.options.isGroupedAllDayPanel;
  }
  calculateCellPositions(groupIndices, isAllDayRowAppointment, isRecurrentAppointment) {
    var result = [];
    this.appointments.forEach((dateSetting, index) => {
      var coordinates = this.getCoordinateInfos({
        appointment: dateSetting,
        groupIndices,
        isAllDayRowAppointment,
        isRecurrentAppointment
      });
      coordinates.forEach(item => {
        !!item && result.push(this._prepareObject(item, index));
      });
    });
    return result;
  }
  getCoordinateInfos(options) {
    var {
      appointment,
      isAllDayRowAppointment,
      groupIndices,
      recurrent
    } = options;
    var {
      startDate
    } = appointment;
    var groupIndex = !recurrent ? appointment.source.groupIndex : undefined;
    return this.getCoordinatesByDateInGroup(startDate, groupIndices, isAllDayRowAppointment, groupIndex);
  }
  _prepareObject(position, dateSettingIndex) {
    position.dateSettingIndex = dateSettingIndex;
    return {
      coordinates: position,
      dateSettingIndex
    };
  }
  getCoordinatesByDate(date, groupIndex, inAllDayRow) {
    var validGroupIndex = groupIndex || 0;
    var cellInfo = {
      groupIndex: validGroupIndex,
      startDate: date,
      isAllDay: inAllDayRow
    };
    var positionByMap = this.viewDataProvider.findCellPositionInMap(cellInfo, true);
    if (!positionByMap) {
      return undefined;
    }
    var position = this.getCellPosition(positionByMap, inAllDayRow && !this.isVerticalGrouping);
    var timeShift = inAllDayRow ? 0 : this.getTimeShiftRatio(positionByMap, date);
    var shift = this.getPositionShift(timeShift, inAllDayRow);
    var horizontalHMax = this.positionHelper.getHorizontalMax(validGroupIndex, date);
    var verticalMax = this.positionHelper.getVerticalMax({
      groupIndex: validGroupIndex,
      isVirtualScrolling: this.isVirtualScrolling,
      showAllDayPanel: this.showAllDayPanel,
      supportAllDayRow: this.supportAllDayRow,
      isGroupedAllDayPanel: this.isGroupedAllDayPanel,
      isVerticalGrouping: this.isVerticalGrouping
    });
    return {
      positionByMap,
      cellPosition: position.left + shift.cellPosition,
      top: position.top + shift.top,
      left: position.left + shift.left,
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex,
      hMax: horizontalHMax,
      vMax: verticalMax,
      groupIndex: validGroupIndex
    };
  }
  getCoordinatesByDateInGroup(startDate, groupIndices, inAllDayRow, groupIndex) {
    var result = [];
    if (this.viewDataProvider.isSkippedDate(startDate)) {
      return result;
    }
    var validGroupIndices = [groupIndex];
    if (!isDefined(groupIndex)) {
      validGroupIndices = this.groupCount ? groupIndices : [0];
    }
    validGroupIndices.forEach(groupIndex => {
      var coordinates = this.getCoordinatesByDate(startDate, groupIndex, inAllDayRow);
      if (coordinates) {
        result.push(coordinates);
      }
    });
    return result;
  }
  getCellPosition(cellCoordinates, isAllDayPanel) {
    var {
      dateTableCellsMeta,
      allDayPanelCellsMeta
    } = this.DOMMetaData;
    var {
      columnIndex,
      rowIndex
    } = cellCoordinates;
    var position = isAllDayPanel ? allDayPanelCellsMeta[columnIndex] : dateTableCellsMeta[rowIndex][columnIndex];
    var validPosition = _extends({}, position);
    if (this.rtlEnabled) {
      validPosition.left += position.width;
    }
    if (validPosition) {
      validPosition.rowIndex = cellCoordinates.rowIndex;
      validPosition.columnIndex = cellCoordinates.columnIndex;
    }
    return validPosition;
  }
  getTimeShiftRatio(positionByMap, appointmentDate) {
    var {
      cellDuration,
      viewOffset
    } = this.options;
    var {
      rowIndex,
      columnIndex
    } = positionByMap;
    var matchedCell = this.viewDataProvider.viewDataMap.dateTableMap[rowIndex][columnIndex];
    var matchedCellStartDate = dateUtilsTs.addOffsets(matchedCell.cellData.startDate, [-viewOffset]);
    var result = (appointmentDate.getTime() - matchedCellStartDate.getTime()) / cellDuration;
    // NOTE: Hande DST summer time change issue.
    // Time shift greater than cell duration - incorrect.
    // In this case appointment date should match with the next cell instead.
    return result % 1;
  }
}
class VirtualStrategy extends BaseStrategy {
  constructor() {
    super(...arguments);
    this.isVirtualScrolling = true;
  }
  calculateCellPositions(groupIndices, isAllDayRowAppointment, isRecurrentAppointment) {
    var appointments = isAllDayRowAppointment ? this.appointments : this.appointments.filter(_ref => {
      var {
        source,
        startDate,
        endDate
      } = _ref;
      return this.viewDataProvider.isGroupIntersectDateInterval(source.groupIndex, startDate, endDate);
    });
    if (isRecurrentAppointment) {
      return this.createRecurrentAppointmentInfos(appointments, isAllDayRowAppointment);
    }
    return super.calculateCellPositions(groupIndices, isAllDayRowAppointment, isRecurrentAppointment);
  }
  createRecurrentAppointmentInfos(dateSettings, isAllDayRowAppointment) {
    var result = [];
    dateSettings.forEach((_ref2, index) => {
      var {
        source,
        startDate
      } = _ref2;
      var coordinate = this.getCoordinatesByDate(startDate, source.groupIndex, isAllDayRowAppointment);
      if (coordinate) {
        result.push(this._prepareObject(coordinate, index));
      }
    });
    return result;
  }
}
export class CellPositionCalculator {
  constructor(options) {
    this.options = options;
  }
  calculateCellPositions(groupIndices, isAllDayRowAppointment, isRecurrentAppointment) {
    var strategy = this.options.isVirtualScrolling ? new VirtualStrategy(this.options) : new BaseStrategy(this.options);
    return strategy.calculateCellPositions(groupIndices, isAllDayRowAppointment, isRecurrentAppointment);
  }
}