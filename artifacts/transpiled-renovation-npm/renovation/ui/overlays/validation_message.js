"use strict";

exports.viewFunction = exports.ValidationMessageProps = exports.ValidationMessage = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _validation_message = _interopRequireDefault(require("../../../ui/validation_message"));
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _base_props = require("../common/base_props");
const _excluded = ["accessKey", "activeStateEnabled", "boundary", "className", "contentId", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "mode", "offset", "onClick", "onKeyDown", "positionSide", "rtlEnabled", "tabIndex", "target", "validationErrors", "visible", "visualContainer", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
    componentProps,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _validation_message.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
const ValidationMessageProps = exports.ValidationMessageProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_base_props.BaseWidgetProps), Object.getOwnPropertyDescriptors({
  mode: 'auto',
  positionSide: 'top',
  offset: Object.freeze({
    h: 0,
    v: 0
  }),
  isReactComponentWrapper: true
})));
let ValidationMessage = exports.ValidationMessage = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(ValidationMessage, _BaseInfernoComponent);
  function ValidationMessage(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = ValidationMessage.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      componentProps: this.componentProps,
      restAttributes: this.restAttributes
    });
  };
  _createClass(ValidationMessage, [{
    key: "componentProps",
    get: function () {
      return this.props;
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return ValidationMessage;
}(_inferno2.BaseInfernoComponent);
ValidationMessage.defaultProps = ValidationMessageProps;