"use strict";

exports.viewFunction = exports.CellBaseProps = exports.CellBase = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../../__internal/scheduler/__migration/utils/index");
const _excluded = ["allDay", "ariaLabel", "children", "className", "contentTemplateProps", "endDate", "groupIndex", "groups", "index", "isFirstGroupCell", "isLastGroupCell", "startDate", "text"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const viewFunction = viewModel => (0, _inferno.createVNode)(1, "td", viewModel.classes, viewModel.props.children, 0, {
  "aria-label": viewModel.props.ariaLabel
});
exports.viewFunction = viewFunction;
const CellBaseProps = exports.CellBaseProps = {
  className: '',
  isFirstGroupCell: false,
  isLastGroupCell: false,
  startDate: Object.freeze(new Date()),
  endDate: Object.freeze(new Date()),
  allDay: false,
  text: '',
  index: 0,
  contentTemplateProps: Object.freeze({
    data: {},
    index: 0
  })
};
let CellBase = exports.CellBase = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(CellBase, _BaseInfernoComponent);
  function CellBase(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = CellBase.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      classes: this.classes,
      restAttributes: this.restAttributes
    });
  };
  _createClass(CellBase, [{
    key: "classes",
    get: function () {
      const {
        className,
        isFirstGroupCell,
        isLastGroupCell
      } = this.props;
      return _index.renderUtils.getGroupCellClasses(isFirstGroupCell, isLastGroupCell, className);
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return CellBase;
}(_inferno2.BaseInfernoComponent);
CellBase.defaultProps = CellBaseProps;