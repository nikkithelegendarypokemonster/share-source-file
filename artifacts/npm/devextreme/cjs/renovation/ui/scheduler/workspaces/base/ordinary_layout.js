/**
* DevExtreme (cjs/renovation/ui/scheduler/workspaces/base/ordinary_layout.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.OrdinaryLayout = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _widget = require("../../../common/widget");
var _scrollable = require("../../../scroll_view/scrollable");
var _group_panel = require("./group_panel/group_panel");
var _layout = require("./date_table/all_day_panel/layout");
var _header_panel_empty_cell = require("./header_panel_empty_cell");
var _main_layout_props = require("./main_layout_props");
var _layout2 = require("./time_panel/layout");
var _layout3 = require("../month/date_table/layout");
var _layout4 = require("./date_table/layout");
var _layout5 = require("../timeline/header_panel/layout");
var _layout6 = require("./header_panel/layout");
const _excluded = ["addDateTableClass", "addVerticalSizesClassToRows", "allDayAppointments", "allDayPanelRef", "appointments", "bottomVirtualRowHeight", "className", "dataCellTemplate", "dateCellTemplate", "dateHeaderData", "dateTableRef", "dateTableTemplate", "groupByDate", "groupOrientation", "groupPanelClassName", "groupPanelData", "groupPanelHeight", "groupPanelRef", "groups", "headerEmptyCellWidth", "headerPanelTemplate", "intervalCount", "isAllDayPanelCollapsed", "isAllDayPanelVisible", "isRenderDateHeader", "isRenderGroupPanel", "isRenderHeaderEmptyCell", "isRenderTimePanel", "isStandaloneAllDayPanel", "isUseMonthDateTable", "isUseTimelineHeader", "isWorkSpaceWithOddCells", "leftVirtualCellWidth", "onScroll", "resourceCellTemplate", "rightVirtualCellWidth", "scrollingDirection", "tablesWidth", "timeCellTemplate", "timePanelData", "timePanelRef", "topVirtualRowHeight", "viewData", "widgetElementRef", "width"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    dateTableScrollableRef,
    props: {
      allDayPanelRef,
      className,
      dataCellTemplate,
      dateCellTemplate,
      dateHeaderData,
      dateTableRef,
      groupByDate,
      groupOrientation,
      groupPanelClassName,
      groupPanelData,
      groupPanelHeight,
      groupPanelRef,
      groups,
      headerEmptyCellWidth,
      isRenderDateHeader,
      isRenderGroupPanel,
      isRenderHeaderEmptyCell,
      isRenderTimePanel,
      isStandaloneAllDayPanel,
      isUseMonthDateTable,
      isUseTimelineHeader,
      resourceCellTemplate,
      scrollingDirection,
      timeCellTemplate,
      timePanelData,
      timePanelRef,
      viewData,
      widgetElementRef
    }
  } = _ref;
  const DateTable = isUseMonthDateTable ? _layout3.MonthDateTableLayout : _layout4.DateTableLayoutBase;
  const HeaderPanel = isUseTimelineHeader ? _layout5.TimelineHeaderPanelLayout : _layout6.HeaderPanelLayout;
  return (0, _inferno.createComponentVNode)(2, _widget.Widget, {
    "className": className,
    "rootElementRef": widgetElementRef,
    children: [(0, _inferno.createVNode)(1, "div", "dx-scheduler-header-panel-container", [isRenderHeaderEmptyCell && (0, _inferno.createComponentVNode)(2, _header_panel_empty_cell.HeaderPanelEmptyCell, {
      "width": headerEmptyCellWidth,
      "isRenderAllDayTitle": isStandaloneAllDayPanel
    }), (0, _inferno.createVNode)(1, "div", "dx-scheduler-header-tables-container", [(0, _inferno.createVNode)(1, "table", "dx-scheduler-header-panel", (0, _inferno.createComponentVNode)(2, HeaderPanel, {
      "dateHeaderData": dateHeaderData,
      "groupPanelData": groupPanelData,
      "timeCellTemplate": timeCellTemplate,
      "dateCellTemplate": dateCellTemplate,
      "isRenderDateHeader": isRenderDateHeader,
      "groupOrientation": groupOrientation,
      "groupByDate": groupByDate,
      "groups": groups,
      "resourceCellTemplate": resourceCellTemplate
    }), 2), isStandaloneAllDayPanel && (0, _inferno.createComponentVNode)(2, _layout.AllDayPanelLayout, {
      "viewData": viewData,
      "dataCellTemplate": dataCellTemplate,
      "tableRef": allDayPanelRef
    })], 0)], 0), (0, _inferno.createComponentVNode)(2, _scrollable.Scrollable, {
      "useKeyboard": false,
      "bounceEnabled": false,
      "direction": scrollingDirection,
      "className": "dx-scheduler-date-table-scrollable",
      children: (0, _inferno.createVNode)(1, "div", "dx-scheduler-date-table-scrollable-content", [isRenderGroupPanel && (0, _inferno.createComponentVNode)(2, _group_panel.GroupPanel, {
        "groupPanelData": groupPanelData,
        "className": groupPanelClassName,
        "groupOrientation": groupOrientation,
        "groupByDate": groupByDate,
        "groups": groups,
        "resourceCellTemplate": resourceCellTemplate,
        "height": groupPanelHeight,
        "elementRef": groupPanelRef
      }), isRenderTimePanel && (0, _inferno.createComponentVNode)(2, _layout2.TimePanelTableLayout, {
        "timePanelData": timePanelData,
        "timeCellTemplate": timeCellTemplate,
        "groupOrientation": groupOrientation,
        "tableRef": timePanelRef
      }), (0, _inferno.createVNode)(1, "div", "dx-scheduler-date-table-container", (0, _inferno.createComponentVNode)(2, DateTable, {
        "tableRef": dateTableRef,
        "viewData": viewData,
        "groupOrientation": groupOrientation,
        "dataCellTemplate": dataCellTemplate
      }), 2)], 0)
    }, null, dateTableScrollableRef)]
  });
};
exports.viewFunction = viewFunction;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let OrdinaryLayout = exports.OrdinaryLayout = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(OrdinaryLayout, _BaseInfernoComponent);
  function OrdinaryLayout(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.dateTableScrollableRef = (0, _inferno.createRef)();
    _this.getScrollableWidth = _this.getScrollableWidth.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = OrdinaryLayout.prototype;
  _proto.getScrollableWidth = function getScrollableWidth() {
    return this.dateTableScrollableRef.current.container().getBoundingClientRect().width;
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        headerPanelTemplate: getTemplate(props.headerPanelTemplate),
        dateTableTemplate: getTemplate(props.dateTableTemplate),
        resourceCellTemplate: getTemplate(props.resourceCellTemplate),
        timeCellTemplate: getTemplate(props.timeCellTemplate),
        dateCellTemplate: getTemplate(props.dateCellTemplate),
        dataCellTemplate: getTemplate(props.dataCellTemplate)
      }),
      dateTableScrollableRef: this.dateTableScrollableRef,
      restAttributes: this.restAttributes
    });
  };
  _createClass(OrdinaryLayout, [{
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return OrdinaryLayout;
}(_inferno2.BaseInfernoComponent);
OrdinaryLayout.defaultProps = _main_layout_props.MainLayoutProps;
