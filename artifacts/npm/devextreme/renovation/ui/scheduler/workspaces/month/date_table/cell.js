/**
* DevExtreme (renovation/ui/scheduler/workspaces/month/date_table/cell.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.MonthDateTableCell = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _combine_classes = require("../../../../../utils/combine_classes");
var _cell = require("../../base/date_table/cell");
const _excluded = ["allDay", "ariaLabel", "children", "className", "contentTemplateProps", "dataCellTemplate", "endDate", "firstDayOfMonth", "groupIndex", "groups", "index", "isFirstGroupCell", "isFocused", "isLastGroupCell", "isSelected", "otherMonth", "startDate", "text", "today"];
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
    contentTemplateProps,
    props: {
      dataCellTemplate,
      endDate,
      groupIndex,
      groups,
      index,
      isFirstGroupCell,
      isFocused,
      isLastGroupCell,
      isSelected,
      startDate,
      text
    }
  } = _ref;
  return (0, _inferno.createComponentVNode)(2, _cell.DateTableCellBase, {
    "className": classes,
    "dataCellTemplate": dataCellTemplate,
    "startDate": startDate,
    "endDate": endDate,
    "text": text,
    "groups": groups,
    "groupIndex": groupIndex,
    "index": index,
    "isFirstGroupCell": isFirstGroupCell,
    "isLastGroupCell": isLastGroupCell,
    "isSelected": isSelected,
    "isFocused": isFocused,
    "contentTemplateProps": contentTemplateProps,
    children: (0, _inferno.createVNode)(1, "div", "dx-scheduler-date-table-cell-text", text, 0)
  });
};
exports.viewFunction = viewFunction;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let MonthDateTableCell = exports.MonthDateTableCell = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(MonthDateTableCell, _BaseInfernoComponent);
  function MonthDateTableCell(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    return _this;
  }
  var _proto = MonthDateTableCell.prototype;
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.props['index'] !== nextProps['index'] || this.props['text'] !== nextProps['text']) {
      this.__getterCache['contentTemplateProps'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        dataCellTemplate: getTemplate(props.dataCellTemplate)
      }),
      classes: this.classes,
      contentTemplateProps: this.contentTemplateProps,
      restAttributes: this.restAttributes
    });
  };
  _createClass(MonthDateTableCell, [{
    key: "classes",
    get: function () {
      const {
        className,
        firstDayOfMonth,
        otherMonth,
        today
      } = this.props;
      return (0, _combine_classes.combineClasses)({
        'dx-scheduler-date-table-other-month': !!otherMonth,
        'dx-scheduler-date-table-current-date': !!today,
        'dx-scheduler-date-table-first-of-month': !!firstDayOfMonth,
        [className]: !!className
      });
    }
  }, {
    key: "contentTemplateProps",
    get: function () {
      if (this.__getterCache['contentTemplateProps'] !== undefined) {
        return this.__getterCache['contentTemplateProps'];
      }
      return this.__getterCache['contentTemplateProps'] = (() => {
        const {
          index,
          text
        } = this.props;
        return {
          data: {
            text
          },
          index
        };
      })();
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return MonthDateTableCell;
}(_inferno2.BaseInfernoComponent);
MonthDateTableCell.defaultProps = _cell.DateTableCellBaseProps;
