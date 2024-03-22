"use strict";

exports.viewFunction = exports.GroupPanelHorizontalCellProps = exports.GroupPanelHorizontalCell = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _combine_classes = require("../../../../../../utils/combine_classes");
var _cell_props = require("../cell_props");
const _excluded = ["cellTemplate", "className", "colSpan", "color", "data", "id", "index", "isFirstGroupCell", "isLastGroupCell", "text"];
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
      cellTemplate: CellTemplate,
      colSpan,
      color,
      data,
      id,
      index,
      text
    }
  } = _ref;
  return (0, _inferno.createVNode)(1, "th", classes, (0, _inferno.createVNode)(1, "div", "dx-scheduler-group-header-content", [!!CellTemplate && CellTemplate({
    data: {
      data,
      id,
      color,
      text
    },
    index: index
  }), !CellTemplate && (0, _inferno.createVNode)(1, "div", null, text, 0)], 0), 2, {
    "colSpan": colSpan
  });
};
exports.viewFunction = viewFunction;
const GroupPanelHorizontalCellProps = exports.GroupPanelHorizontalCellProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_cell_props.GroupPanelCellProps), Object.getOwnPropertyDescriptors({
  isFirstGroupCell: false,
  isLastGroupCell: false,
  colSpan: 1
})));
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let GroupPanelHorizontalCell = exports.GroupPanelHorizontalCell = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(GroupPanelHorizontalCell, _BaseInfernoComponent);
  function GroupPanelHorizontalCell(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = GroupPanelHorizontalCell.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        cellTemplate: getTemplate(props.cellTemplate)
      }),
      classes: this.classes,
      restAttributes: this.restAttributes
    });
  };
  _createClass(GroupPanelHorizontalCell, [{
    key: "classes",
    get: function () {
      const {
        className,
        isFirstGroupCell,
        isLastGroupCell
      } = this.props;
      return (0, _combine_classes.combineClasses)({
        'dx-scheduler-group-header': true,
        'dx-scheduler-first-group-cell': isFirstGroupCell,
        'dx-scheduler-last-group-cell': isLastGroupCell,
        [className]: !!className
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
  return GroupPanelHorizontalCell;
}(_inferno2.BaseInfernoComponent);
GroupPanelHorizontalCell.defaultProps = GroupPanelHorizontalCellProps;