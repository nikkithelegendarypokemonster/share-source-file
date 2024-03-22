/**
* DevExtreme (renovation/ui/scheduler/workspaces/base/header_panel/date_header/layout.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.DateHeaderLayoutProps = exports.DateHeaderLayout = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _row = require("../../row");
var _cell = require("./cell");
var _getThemeType = _interopRequireDefault(require("../../../../../../utils/getThemeType"));
var _index = require("../../../../../../../__internal/scheduler/__migration/utils/index");
const _excluded = ["dateCellTemplate", "dateHeaderData", "groupByDate", "groupOrientation", "groups", "timeCellTemplate"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const {
  isMaterialBased
} = (0, _getThemeType.default)();
const viewFunction = _ref => {
  let {
    isHorizontalGrouping,
    props: {
      dateCellTemplate,
      dateHeaderData
    }
  } = _ref;
  const {
    dataMap,
    leftVirtualCellCount,
    leftVirtualCellWidth,
    rightVirtualCellCount,
    rightVirtualCellWidth
  } = dateHeaderData;
  return (0, _inferno.createFragment)(dataMap.map((dateHeaderRow, rowIndex) => (0, _inferno.createComponentVNode)(2, _row.Row, {
    "className": "dx-scheduler-header-row",
    "leftVirtualCellWidth": leftVirtualCellWidth,
    "leftVirtualCellCount": leftVirtualCellCount,
    "rightVirtualCellWidth": rightVirtualCellWidth,
    "rightVirtualCellCount": rightVirtualCellCount,
    "isHeaderRow": true,
    children: dateHeaderRow.map(_ref2 => {
      let {
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
      return (0, _inferno.createComponentVNode)(2, _cell.DateHeaderCell, {
        "startDate": startDate,
        "endDate": endDate,
        "groups": isHorizontalGrouping ? cellGroups : undefined,
        "groupIndex": isHorizontalGrouping ? groupIndex : undefined,
        "today": today,
        "index": index,
        "text": text,
        "isFirstGroupCell": isFirstGroupCell,
        "isLastGroupCell": isLastGroupCell,
        "dateCellTemplate": dateCellTemplate,
        "colSpan": colSpan,
        "splitText": isMaterialBased
      }, key);
    })
  }, rowIndex.toString())), 0);
};
exports.viewFunction = viewFunction;
const DateHeaderLayoutProps = exports.DateHeaderLayoutProps = {
  groupOrientation: 'horizontal',
  groupByDate: false,
  groups: Object.freeze([])
};
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let DateHeaderLayout = exports.DateHeaderLayout = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(DateHeaderLayout, _BaseInfernoComponent);
  function DateHeaderLayout(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = DateHeaderLayout.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        dateCellTemplate: getTemplate(props.dateCellTemplate),
        timeCellTemplate: getTemplate(props.timeCellTemplate)
      }),
      isHorizontalGrouping: this.isHorizontalGrouping,
      restAttributes: this.restAttributes
    });
  };
  _createClass(DateHeaderLayout, [{
    key: "isHorizontalGrouping",
    get: function () {
      const {
        groupByDate,
        groupOrientation,
        groups
      } = this.props;
      return (0, _index.isHorizontalGroupingApplied)(groups, groupOrientation) && !groupByDate;
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return DateHeaderLayout;
}(_inferno2.BaseInfernoComponent);
DateHeaderLayout.defaultProps = DateHeaderLayoutProps;
