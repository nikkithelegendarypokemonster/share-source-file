"use strict";

exports.viewFunction = exports.DateHeaderCellProps = exports.DateHeaderCell = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _cell = require("../../cell");
var _combine_classes = require("../../../../../../utils/combine_classes");
var _index = require("../../../../../../../__internal/scheduler/__migration/utils/index");
var _dateHeaderText = require("./dateHeaderText");
const _excluded = ["allDay", "ariaLabel", "children", "className", "colSpan", "contentTemplateProps", "dateCellTemplate", "endDate", "groupIndex", "groups", "index", "isFirstGroupCell", "isLastGroupCell", "isTimeCellTemplate", "isWeekDayCell", "splitText", "startDate", "text", "timeCellTemplate", "today"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    classes,
    props: {
      colSpan,
      dateCellTemplate: DateCellTemplate,
      groupIndex,
      groups,
      index,
      isTimeCellTemplate,
      splitText,
      startDate,
      text,
      timeCellTemplate: TimeCellTemplate
    },
    useTemplate
  } = _ref;
  return (0, _inferno.createVNode)(1, "th", classes, useTemplate ? (0, _inferno.createFragment)([isTimeCellTemplate && TimeCellTemplate && TimeCellTemplate({
    data: {
      date: startDate,
      text,
      groups,
      groupIndex
    },
    index: index
  }), !isTimeCellTemplate && DateCellTemplate && DateCellTemplate({
    data: {
      date: startDate,
      text,
      groups,
      groupIndex
    },
    index: index
  })], 0) : (0, _inferno.createComponentVNode)(2, _dateHeaderText.DateHeaderText, {
    "splitText": splitText,
    "text": text
  }), 0, {
    "colSpan": colSpan,
    "title": text
  });
};
exports.viewFunction = viewFunction;
const DateHeaderCellProps = exports.DateHeaderCellProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_cell.CellBaseProps), Object.getOwnPropertyDescriptors({
  today: false,
  colSpan: 1,
  isWeekDayCell: false,
  splitText: false,
  isTimeCellTemplate: false
})));
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let DateHeaderCell = exports.DateHeaderCell = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(DateHeaderCell, _BaseInfernoComponent);
  function DateHeaderCell(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = DateHeaderCell.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        timeCellTemplate: getTemplate(props.timeCellTemplate),
        dateCellTemplate: getTemplate(props.dateCellTemplate)
      }),
      classes: this.classes,
      useTemplate: this.useTemplate,
      restAttributes: this.restAttributes
    });
  };
  _createClass(DateHeaderCell, [{
    key: "classes",
    get: function () {
      const {
        className,
        isFirstGroupCell,
        isLastGroupCell,
        isWeekDayCell,
        today
      } = this.props;
      const cellClasses = (0, _combine_classes.combineClasses)({
        'dx-scheduler-header-panel-cell': true,
        'dx-scheduler-cell-sizes-horizontal': true,
        'dx-scheduler-header-panel-current-time-cell': today,
        'dx-scheduler-header-panel-week-cell': isWeekDayCell,
        [className]: !!className
      });
      return _index.renderUtils.getGroupCellClasses(isFirstGroupCell, isLastGroupCell, cellClasses);
    }
  }, {
    key: "useTemplate",
    get: function () {
      const {
        dateCellTemplate,
        isTimeCellTemplate,
        timeCellTemplate
      } = this.props;
      return !isTimeCellTemplate && !!dateCellTemplate || isTimeCellTemplate && !!timeCellTemplate;
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return DateHeaderCell;
}(_inferno2.BaseInfernoComponent);
DateHeaderCell.defaultProps = DateHeaderCellProps;