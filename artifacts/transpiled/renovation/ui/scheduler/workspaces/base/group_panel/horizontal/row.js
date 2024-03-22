"use strict";

exports.viewFunction = exports.Row = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _cell = require("./cell");
var _row_props = require("../row_props");
const _excluded = ["cellTemplate", "className", "groupItems"];
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
      cellTemplate,
      className,
      groupItems
    }
  } = _ref;
  return (0, _inferno.createVNode)(1, "tr", "dx-scheduler-group-row ".concat(className), groupItems.map((_ref2, index) => {
    let {
      colSpan,
      color,
      data,
      id,
      isFirstGroupCell,
      isLastGroupCell,
      key,
      text
    } = _ref2;
    return (0, _inferno.createComponentVNode)(2, _cell.GroupPanelHorizontalCell, {
      "text": text,
      "id": id,
      "data": data,
      "index": index,
      "color": color,
      "colSpan": colSpan,
      "isFirstGroupCell": !!isFirstGroupCell,
      "isLastGroupCell": !!isLastGroupCell,
      "cellTemplate": cellTemplate
    }, key);
  }), 0);
};
exports.viewFunction = viewFunction;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let Row = exports.Row = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(Row, _BaseInfernoComponent);
  function Row(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = Row.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        cellTemplate: getTemplate(props.cellTemplate)
      }),
      restAttributes: this.restAttributes
    });
  };
  _createClass(Row, [{
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return Row;
}(_inferno2.BaseInfernoComponent);
Row.defaultProps = _row_props.GroupPanelRowProps;