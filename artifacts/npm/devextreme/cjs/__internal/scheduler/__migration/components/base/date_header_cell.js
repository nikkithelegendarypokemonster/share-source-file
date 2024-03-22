/**
* DevExtreme (cjs/__internal/scheduler/__migration/components/base/date_header_cell.js)
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
exports.DateHeaderCell = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/component_wrappers/utils/index");
var _inferno2 = require("inferno");
var _index2 = require("../../utils/index");
var _cell = require("./cell");
var _date_header_text = require("./date_header_text");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DateHeaderCellDefaultProps = _extends(_extends({}, _cell.CellBaseDefaultProps), {
  today: false,
  colSpan: 1,
  isWeekDayCell: false,
  splitText: false,
  isTimeCellTemplate: false
});
let DateHeaderCell = exports.DateHeaderCell = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(DateHeaderCell, _BaseInfernoComponent);
  function DateHeaderCell() {
    return _BaseInfernoComponent.apply(this, arguments) || this;
  }
  var _proto = DateHeaderCell.prototype;
  _proto.render = function render() {
    const {
      colSpan,
      dateCellTemplate,
      groupIndex,
      groups,
      index,
      isTimeCellTemplate,
      splitText,
      startDate,
      text,
      timeCellTemplate,
      className,
      isFirstGroupCell,
      isLastGroupCell,
      isWeekDayCell,
      today
    } = this.props;
    const timeCellTemplateComponent = (0, _index.getTemplate)(timeCellTemplate);
    const dateCellTemplateComponent = (0, _index.getTemplate)(dateCellTemplate);
    const cellClasses = _index2.renderUtils.combineClasses({
      'dx-scheduler-header-panel-cell': true,
      'dx-scheduler-cell-sizes-horizontal': true,
      'dx-scheduler-header-panel-current-time-cell': today,
      'dx-scheduler-header-panel-week-cell': isWeekDayCell,
      [className]: !!className
    });
    const classNames = _index2.renderUtils.getGroupCellClasses(isFirstGroupCell, isLastGroupCell, cellClasses);
    const useTemplate = !isTimeCellTemplate && !!dateCellTemplate || isTimeCellTemplate && !!timeCellTemplate;
    const children = useTemplate ? (0, _inferno2.createFragment)([isTimeCellTemplate && timeCellTemplateComponent && timeCellTemplateComponent({
      data: {
        date: startDate,
        text,
        groups,
        groupIndex
      },
      index
    }), !isTimeCellTemplate && dateCellTemplateComponent && dateCellTemplateComponent({
      data: {
        date: startDate,
        text,
        groups,
        groupIndex
      },
      index
    })], 0) : (0, _inferno2.createComponentVNode)(2, _date_header_text.DateHeaderText, {
      splitText,
      text
    });
    return (0, _inferno2.createVNode)(1, 'th', classNames, children, 0, {
      colSpan,
      title: text
    });
  };
  return DateHeaderCell;
}(_inferno.BaseInfernoComponent);
DateHeaderCell.defaultProps = DateHeaderCellDefaultProps;
