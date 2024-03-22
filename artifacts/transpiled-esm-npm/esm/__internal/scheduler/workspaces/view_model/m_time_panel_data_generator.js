import _extends from "@babel/runtime/helpers/esm/extends";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import dateUtils from '../../../../core/utils/date';
import { dateUtilsTs } from '../../../core/utils/date';
import { shiftIntegerByModule } from '../../../core/utils/math';
import { getDisplayedRowCount, getIsGroupedAllDayPanel, getKeyByGroup, weekUtils } from '../../__migration/utils/index';
var toMs = dateUtils.dateToMilliseconds;
export class TimePanelDataGenerator {
  constructor(_viewDataGenerator) {
    this._viewDataGenerator = _viewDataGenerator;
  }
  getCompleteTimePanelMap(options, completeViewDataMap) {
    var {
      startViewDate,
      cellDuration,
      startDayHour,
      isVerticalGrouping,
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      endDayHour,
      viewOffset,
      today,
      showCurrentTimeIndicator
    } = options;
    var rowsCount = completeViewDataMap.length - 1;
    var realEndViewDate = completeViewDataMap[rowsCount][completeViewDataMap[rowsCount].length - 1].endDate;
    var rowCountInGroup = this._viewDataGenerator.getRowCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour
    });
    var cellCountInGroupRow = this._viewDataGenerator.getCellCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour
    });
    var allDayRowsCount = 0;
    var usualCellIndex = 0;
    return completeViewDataMap.map((row, index) => {
      var _a = row[0],
        {
          allDay,
          startDate,
          endDate,
          groups,
          groupIndex,
          isFirstGroupCell,
          isLastGroupCell,
          index: cellIndex
        } = _a,
        restCellProps = __rest(_a, ["allDay", "startDate", "endDate", "groups", "groupIndex", "isFirstGroupCell", "isLastGroupCell", "index"]);
      var highlighted = allDay ? false : this.isTimeCellShouldBeHighlighted(today, viewOffset, {
        startViewDate,
        realEndViewDate,
        showCurrentTimeIndicator
      }, {
        date: startDate,
        index: usualCellIndex,
        // NOTE: The 'cellDuration' (in ms) here created from the float 'hoursInterval' value.
        // It may be not equal integer value but very close to it.
        // Therefore, we round this value here.
        duration: Math.round(cellDuration),
        isFirst: usualCellIndex === 0,
        isLast: this.isLastCellInGroup(completeViewDataMap, index)
      });
      if (allDay) {
        allDayRowsCount += 1;
        usualCellIndex = 0;
      } else {
        usualCellIndex += 1;
      }
      var timeIndex = (index - allDayRowsCount) % rowCountInGroup;
      return _extends(_extends({}, restCellProps), {
        startDate,
        allDay,
        highlighted,
        text: weekUtils.getTimePanelCellText(timeIndex, startDate, startViewDate, cellDuration, startDayHour, viewOffset),
        groups: isVerticalGrouping ? groups : undefined,
        groupIndex: isVerticalGrouping ? groupIndex : undefined,
        isFirstGroupCell: isVerticalGrouping && isFirstGroupCell,
        isLastGroupCell: isVerticalGrouping && isLastGroupCell,
        index: Math.floor(cellIndex / cellCountInGroupRow)
      });
    });
  }
  generateTimePanelData(completeTimePanelMap, options) {
    var {
      startRowIndex,
      rowCount,
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      isGroupedAllDayPanel,
      isVerticalGrouping,
      isAllDayPanelVisible
    } = options;
    var indexDifference = isVerticalGrouping || !isAllDayPanelVisible ? 0 : 1;
    var correctedStartRowIndex = startRowIndex + indexDifference;
    var displayedRowCount = getDisplayedRowCount(rowCount, completeTimePanelMap);
    var timePanelMap = completeTimePanelMap.slice(correctedStartRowIndex, correctedStartRowIndex + displayedRowCount);
    var timePanelData = {
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      isGroupedAllDayPanel
    };
    var {
      previousGroupedData: groupedData
    } = this._generateTimePanelDataFromMap(timePanelMap, isVerticalGrouping);
    timePanelData.groupedData = groupedData;
    return timePanelData;
  }
  _generateTimePanelDataFromMap(timePanelMap, isVerticalGrouping) {
    return timePanelMap.reduce((_ref, cellData) => {
      var {
        previousGroupIndex,
        previousGroupedData
      } = _ref;
      var currentGroupIndex = cellData.groupIndex;
      if (currentGroupIndex !== previousGroupIndex) {
        previousGroupedData.push({
          dateTable: [],
          isGroupedAllDayPanel: getIsGroupedAllDayPanel(!!cellData.allDay, isVerticalGrouping),
          groupIndex: currentGroupIndex,
          key: getKeyByGroup(currentGroupIndex, isVerticalGrouping)
        });
      }
      if (cellData.allDay) {
        previousGroupedData[previousGroupedData.length - 1].allDayPanel = cellData;
      } else {
        previousGroupedData[previousGroupedData.length - 1].dateTable.push(cellData);
      }
      return {
        previousGroupIndex: currentGroupIndex,
        previousGroupedData
      };
    }, {
      previousGroupIndex: -1,
      previousGroupedData: []
    });
  }
  isTimeCellShouldBeHighlighted(today, viewOffset, _ref2, cellData) {
    var {
      startViewDate,
      realEndViewDate,
      showCurrentTimeIndicator
    } = _ref2;
    // NOTE: today date value shifted by -viewOffset for the render purposes.
    // Therefore, we roll-backing here this shift.
    var realToday = dateUtilsTs.addOffsets(today, [viewOffset]);
    // NOTE: start view date value calculated from the render options and hasn't viewOffset.
    // So, we must shift it by viewOffset to get the real start view date here.
    var realStartViewDate = dateUtilsTs.addOffsets(startViewDate, [viewOffset]);
    if (!showCurrentTimeIndicator || realToday < realStartViewDate || realToday >= realEndViewDate) {
      return false;
    }
    var realTodayTimeMs = this.getLocalDateTimeInMs(realToday);
    var [startMs, endMs] = this.getHighlightedInterval(cellData);
    return startMs < endMs ? realTodayTimeMs >= startMs && realTodayTimeMs < endMs : realTodayTimeMs >= startMs && realTodayTimeMs < toMs('day') || realTodayTimeMs >= 0 && realTodayTimeMs < endMs;
  }
  getHighlightedInterval(_ref3) {
    var {
      date,
      index,
      duration,
      isFirst,
      isLast
    } = _ref3;
    var cellTimeMs = this.getLocalDateTimeInMs(date);
    var isEvenCell = index % 2 === 0;
    switch (true) {
      case isFirst || isLast && !isEvenCell:
        return [cellTimeMs, shiftIntegerByModule(cellTimeMs + duration, toMs('day'))];
      case isEvenCell:
        return [shiftIntegerByModule(cellTimeMs - duration, toMs('day')), shiftIntegerByModule(cellTimeMs + duration, toMs('day'))];
      default:
        return [cellTimeMs, shiftIntegerByModule(cellTimeMs + 2 * duration, toMs('day'))];
    }
  }
  getLocalDateTimeInMs(date) {
    var dateUtcMs = date.getTime() - date.getTimezoneOffset() * toMs('minute');
    return shiftIntegerByModule(dateUtcMs, toMs('day'));
  }
  isLastCellInGroup(completeViewDataMap, index) {
    if (index === completeViewDataMap.length - 1) {
      return true;
    }
    var {
      groupIndex: currentGroupIndex
    } = completeViewDataMap[index][0];
    var {
      groupIndex: nextGroupIndex,
      allDay: nextAllDay
    } = completeViewDataMap[index + 1][0];
    return nextAllDay || nextGroupIndex !== currentGroupIndex;
  }
}