/**
* DevExtreme (cjs/__internal/scheduler/__migration/components/base/date_header.js)
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
exports.DateHeader = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/component_wrappers/utils/index");
var _inferno2 = require("inferno");
var _index2 = require("../../utils/index");
var _date_header_cell = require("./date_header_cell");
var _row = require("./row");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const {
  isMaterialBased
} = _index2.themeUtils.getThemeType();
const DateHeaderDefaultProps = {
  groupOrientation: 'horizontal',
  groupByDate: false,
  groups: []
};
let DateHeader = exports.DateHeader = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(DateHeader, _BaseInfernoComponent);
  function DateHeader() {
    return _BaseInfernoComponent.apply(this, arguments) || this;
  }
  var _proto = DateHeader.prototype;
  _proto.render = function render() {
    const {
      dateCellTemplate,
      dateHeaderData: {
        dataMap,
        leftVirtualCellCount,
        leftVirtualCellWidth,
        rightVirtualCellCount,
        rightVirtualCellWidth
      },
      groupByDate,
      groupOrientation,
      groups
    } = this.props;
    const dateCellTemplateComponent = (0, _index.getTemplate)(dateCellTemplate);
    const isHorizontalGrouping = (0, _index2.isHorizontalGroupingApplied)(groups, groupOrientation) && !groupByDate;
    return (0, _inferno2.createFragment)(dataMap.map((dateHeaderRow, rowIndex) => (0, _inferno2.createComponentVNode)(2, _row.Row, {
      className: 'dx-scheduler-header-row',
      leftVirtualCellWidth,
      leftVirtualCellCount,
      rightVirtualCellWidth,
      rightVirtualCellCount,
      isHeaderRow: true,
      children: dateHeaderRow.map(_ref2 => {
        const {
          colSpan,
          endDate,
          groupIndex,
          groups: cellGroups,
          index,
          isFirstGroupCell,
          isLastGroupCell,
          key,
          startDate,
          text,
          today
        } = _ref2;
        return (0, _inferno2.createComponentVNode)(2, _date_header_cell.DateHeaderCell, {
          startDate,
          endDate,
          groups: isHorizontalGrouping ? cellGroups : undefined,
          groupIndex: isHorizontalGrouping ? groupIndex : undefined,
          today,
          index,
          text,
          isFirstGroupCell,
          isLastGroupCell,
          dateCellTemplate: dateCellTemplateComponent,
          colSpan,
          splitText: isMaterialBased
        }, key);
      })
    }, rowIndex.toString())), 0);
  };
  return DateHeader;
}(_inferno.BaseInfernoComponent);
DateHeader.defaultProps = DateHeaderDefaultProps;
