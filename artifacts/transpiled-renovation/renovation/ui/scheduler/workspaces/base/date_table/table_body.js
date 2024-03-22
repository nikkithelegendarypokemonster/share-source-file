"use strict";

exports.viewFunction = exports.DateTableBodyProps = exports.DateTableBody = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _row = require("../row");
var _table_body = require("./all_day_panel/table_body");
var _layout_props = require("../layout_props");
var _cell = require("./cell");
var _combine_classes = require("../../../../../utils/combine_classes");
var _const = require("../../const");
const _excluded = ["addDateTableClass", "addVerticalSizesClassToRows", "bottomVirtualRowHeight", "cellTemplate", "dataCellTemplate", "groupOrientation", "leftVirtualCellWidth", "rightVirtualCellWidth", "topVirtualRowHeight", "viewData", "width"];
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
    props: {
      cellTemplate: Cell,
      dataCellTemplate,
      viewData
    },
    rowClasses
  } = _ref;
  return (0, _inferno.createFragment)(viewData.groupedData.map(_ref2 => {
    let {
      allDayPanel,
      dateTable,
      isGroupedAllDayPanel,
      key: fragmentKey
    } = _ref2;
    return (0, _inferno.createFragment)([isGroupedAllDayPanel && (0, _inferno.createComponentVNode)(2, _table_body.AllDayPanelTableBody, {
      "viewData": allDayPanel,
      "dataCellTemplate": dataCellTemplate,
      "isVerticalGroupOrientation": true,
      "leftVirtualCellWidth": viewData.leftVirtualCellWidth,
      "rightVirtualCellWidth": viewData.rightVirtualCellWidth,
      "leftVirtualCellCount": viewData.leftVirtualCellCount,
      "rightVirtualCellCount": viewData.rightVirtualCellCount
    }), dateTable.map(_ref3 => {
      let {
        cells,
        key: rowKey
      } = _ref3;
      return (0, _inferno.createComponentVNode)(2, _row.Row, {
        "className": rowClasses,
        "leftVirtualCellWidth": viewData.leftVirtualCellWidth,
        "rightVirtualCellWidth": viewData.rightVirtualCellWidth,
        "leftVirtualCellCount": viewData.leftVirtualCellCount,
        "rightVirtualCellCount": viewData.rightVirtualCellCount,
        children: cells.map(_ref4 => {
          let {
            endDate,
            firstDayOfMonth,
            groupIndex: cellGroupIndex,
            groups,
            index: cellIndex,
            isFirstGroupCell,
            isFocused,
            isLastGroupCell,
            isSelected,
            key,
            otherMonth,
            startDate,
            text,
            today
          } = _ref4;
          return Cell({
            isFirstGroupCell: isFirstGroupCell,
            isLastGroupCell: isLastGroupCell,
            startDate: startDate,
            endDate: endDate,
            groups: groups,
            groupIndex: cellGroupIndex,
            index: cellIndex,
            dataCellTemplate: dataCellTemplate,
            key: key,
            text: text,
            today: today,
            otherMonth: otherMonth,
            firstDayOfMonth: firstDayOfMonth,
            isSelected: isSelected,
            isFocused: isFocused
          });
        })
      }, rowKey);
    })], 0, fragmentKey);
  }), 0);
};
exports.viewFunction = viewFunction;
const DateTableBodyProps = exports.DateTableBodyProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_layout_props.LayoutProps), Object.getOwnPropertyDescriptors({
  cellTemplate: _cell.DateTableCellBase
})));
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let DateTableBody = exports.DateTableBody = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(DateTableBody, _BaseInfernoComponent);
  function DateTableBody(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = DateTableBody.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        cellTemplate: getTemplate(props.cellTemplate),
        dataCellTemplate: getTemplate(props.dataCellTemplate)
      }),
      rowClasses: this.rowClasses,
      restAttributes: this.restAttributes
    });
  };
  _createClass(DateTableBody, [{
    key: "rowClasses",
    get: function () {
      const {
        addVerticalSizesClassToRows
      } = this.props;
      return (0, _combine_classes.combineClasses)({
        [_const.DATE_TABLE_ROW_CLASS]: true,
        'dx-scheduler-cell-sizes-vertical': addVerticalSizesClassToRows
      });
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return DateTableBody;
}(_inferno2.BaseInfernoComponent);
DateTableBody.defaultProps = DateTableBodyProps;