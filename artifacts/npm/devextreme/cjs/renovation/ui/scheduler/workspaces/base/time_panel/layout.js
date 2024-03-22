/**
* DevExtreme (cjs/renovation/ui/scheduler/workspaces/base/time_panel/layout.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.TimePanelTableLayout = exports.TimePanelLayoutProps = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _row = require("../row");
var _cell = require("./cell");
var _cell2 = require("../cell");
var _table = require("../table");
var _title = require("../date_table/all_day_panel/title");
const _excluded = ["groupOrientation", "tableRef", "timeCellTemplate", "timePanelData"];
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
    bottomVirtualRowHeight,
    props: {
      tableRef,
      timeCellTemplate,
      timePanelData
    },
    restAttributes,
    topVirtualRowHeight
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _table.Table, _extends({}, restAttributes, {
    "topVirtualRowHeight": topVirtualRowHeight,
    "bottomVirtualRowHeight": bottomVirtualRowHeight,
    "virtualCellsCount": 1,
    "className": "dx-scheduler-time-panel",
    "tableRef": tableRef,
    children: timePanelData.groupedData.map(_ref2 => {
      let {
        dateTable,
        groupIndex,
        isGroupedAllDayPanel,
        key: fragmentKey
      } = _ref2;
      return (0, _inferno.createFragment)([isGroupedAllDayPanel && (0, _inferno.createComponentVNode)(2, _row.Row, {
        children: (0, _inferno.createComponentVNode)(2, _cell2.CellBase, {
          "className": "dx-scheduler-time-panel-title-cell",
          children: (0, _inferno.createComponentVNode)(2, _title.AllDayPanelTitle)
        })
      }), dateTable.map(cell => {
        const {
          groups,
          highlighted,
          index: cellIndex,
          isFirstGroupCell,
          isLastGroupCell,
          key,
          startDate,
          text
        } = cell;
        return (0, _inferno.createComponentVNode)(2, _row.Row, {
          "className": "dx-scheduler-time-panel-row",
          children: (0, _inferno.createComponentVNode)(2, _cell.TimePanelCell, {
            "startDate": startDate,
            "text": text,
            "groups": groups,
            "groupIndex": groupIndex,
            "isFirstGroupCell": isFirstGroupCell,
            "isLastGroupCell": isLastGroupCell,
            "index": cellIndex,
            "timeCellTemplate": timeCellTemplate,
            "highlighted": highlighted
          })
        }, key);
      })], 0, fragmentKey);
    })
  })));
};
exports.viewFunction = viewFunction;
const TimePanelLayoutProps = exports.TimePanelLayoutProps = {
  timePanelData: Object.freeze({
    groupedData: [],
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
    topVirtualRowCount: 0,
    bottomVirtualRowCount: 0
  })
};
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let TimePanelTableLayout = exports.TimePanelTableLayout = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(TimePanelTableLayout, _InfernoWrapperCompon);
  function TimePanelTableLayout(props) {
    var _this;
    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = TimePanelTableLayout.prototype;
  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        timeCellTemplate: getTemplate(props.timeCellTemplate)
      }),
      topVirtualRowHeight: this.topVirtualRowHeight,
      bottomVirtualRowHeight: this.bottomVirtualRowHeight,
      restAttributes: this.restAttributes
    });
  };
  _createClass(TimePanelTableLayout, [{
    key: "topVirtualRowHeight",
    get: function () {
      var _this$props$timePanel;
      return (_this$props$timePanel = this.props.timePanelData.topVirtualRowHeight) !== null && _this$props$timePanel !== void 0 ? _this$props$timePanel : 0;
    }
  }, {
    key: "bottomVirtualRowHeight",
    get: function () {
      var _this$props$timePanel2;
      return (_this$props$timePanel2 = this.props.timePanelData.bottomVirtualRowHeight) !== null && _this$props$timePanel2 !== void 0 ? _this$props$timePanel2 : 0;
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return TimePanelTableLayout;
}(_inferno2.InfernoWrapperComponent);
TimePanelTableLayout.defaultProps = TimePanelLayoutProps;
