"use strict";

exports.viewFunction = exports.CalendarProps = exports.Calendar = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _calendar = _interopRequireDefault(require("../../../ui/calendar"));
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _base_props = require("../common/base_props");
const _excluded = ["_todayDate", "accessKey", "activeStateEnabled", "className", "defaultValue", "disabled", "firstDayOfWeek", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "max", "min", "onClick", "onKeyDown", "rtlEnabled", "skipFocusCheck", "tabIndex", "value", "valueChange", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function today() {
  return new Date();
}
const viewFunction = _ref => {
  let {
    componentProps,
    domComponentWrapperRef,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _calendar.default,
    "componentProps": componentProps,
    "templateNames": ['cellTemplate']
  }, restAttributes), null, domComponentWrapperRef));
};
exports.viewFunction = viewFunction;
const CalendarProps = exports.CalendarProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_base_props.BaseWidgetProps), Object.getOwnPropertyDescriptors({
  _todayDate: today,
  skipFocusCheck: false,
  defaultValue: null,
  isReactComponentWrapper: true
})));
let Calendar = exports.Calendar = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(Calendar, _InfernoComponent);
  function Calendar(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.domComponentWrapperRef = (0, _inferno.createRef)();
    _this.state = {
      value: _this.props.value !== undefined ? _this.props.value : _this.props.defaultValue
    };
    _this.saveInstance = _this.saveInstance.bind(_assertThisInitialized(_this));
    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = Calendar.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.saveInstance, [])];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([]);
  };
  _proto.saveInstance = function saveInstance() {
    var _this$domComponentWra;
    this.instance = (_this$domComponentWra = this.domComponentWrapperRef.current) === null || _this$domComponentWra === void 0 ? void 0 : _this$domComponentWra.getInstance();
  };
  _proto.focus = function focus() {
    var _this$instance;
    (_this$instance = this.instance) === null || _this$instance === void 0 ? void 0 : _this$instance.focus();
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
      domComponentWrapperRef: this.domComponentWrapperRef,
      componentProps: this.componentProps,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Calendar, [{
    key: "componentProps",
    get: function () {
      return _extends({}, this.props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      });
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props$value = _extends({}, this.props, {
          value: this.props.value !== undefined ? this.props.value : this.state.value
        }),
        restProps = _objectWithoutPropertiesLoose(_this$props$value, _excluded);
      return restProps;
    }
  }]);
  return Calendar;
}(_inferno2.InfernoComponent);
Calendar.defaultProps = CalendarProps;