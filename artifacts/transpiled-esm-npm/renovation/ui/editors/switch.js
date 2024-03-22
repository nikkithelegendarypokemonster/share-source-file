"use strict";

exports.viewFunction = exports.SwitchPropsType = exports.SwitchProps = exports.Switch = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _switch = _interopRequireDefault(require("../../../ui/switch"));
var _editor = require("./common/editor");
var _editor_state_props = require("./common/editor_state_props");
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _message = _interopRequireDefault(require("../../../localization/message"));
const _excluded = ["accessKey", "activeStateEnabled", "className", "defaultValue", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "inputAttr", "isDirty", "isValid", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "switchedOffText", "switchedOnText", "tabIndex", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "visible", "width"];
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
    "componentType": _switch.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
const SwitchProps = exports.SwitchProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_editor.EditorProps), Object.getOwnPropertyDescriptors(Object.defineProperties({
  defaultValue: false,
  isReactComponentWrapper: true
}, {
  switchedOnText: {
    get: function () {
      return _message.default.format('dxSwitch-switchedOnText');
    },
    configurable: true,
    enumerable: true
  },
  switchedOffText: {
    get: function () {
      return _message.default.format('dxSwitch-switchedOffText');
    },
    configurable: true,
    enumerable: true
  }
}))));
const SwitchPropsType = exports.SwitchPropsType = Object.defineProperties({
  isReactComponentWrapper: true
}, {
  switchedOnText: {
    get: function () {
      return SwitchProps.switchedOnText;
    },
    configurable: true,
    enumerable: true
  },
  switchedOffText: {
    get: function () {
      return SwitchProps.switchedOffText;
    },
    configurable: true,
    enumerable: true
  },
  defaultValue: {
    get: function () {
      return SwitchProps.defaultValue;
    },
    configurable: true,
    enumerable: true
  },
  readOnly: {
    get: function () {
      return SwitchProps.readOnly;
    },
    configurable: true,
    enumerable: true
  },
  name: {
    get: function () {
      return SwitchProps.name;
    },
    configurable: true,
    enumerable: true
  },
  validationError: {
    get: function () {
      return SwitchProps.validationError;
    },
    configurable: true,
    enumerable: true
  },
  validationErrors: {
    get: function () {
      return SwitchProps.validationErrors;
    },
    configurable: true,
    enumerable: true
  },
  validationMessageMode: {
    get: function () {
      return SwitchProps.validationMessageMode;
    },
    configurable: true,
    enumerable: true
  },
  validationMessagePosition: {
    get: function () {
      return SwitchProps.validationMessagePosition;
    },
    configurable: true,
    enumerable: true
  },
  validationStatus: {
    get: function () {
      return SwitchProps.validationStatus;
    },
    configurable: true,
    enumerable: true
  },
  isValid: {
    get: function () {
      return SwitchProps.isValid;
    },
    configurable: true,
    enumerable: true
  },
  isDirty: {
    get: function () {
      return SwitchProps.isDirty;
    },
    configurable: true,
    enumerable: true
  },
  inputAttr: {
    get: function () {
      return SwitchProps.inputAttr;
    },
    configurable: true,
    enumerable: true
  },
  className: {
    get: function () {
      return SwitchProps.className;
    },
    configurable: true,
    enumerable: true
  },
  activeStateEnabled: {
    get: function () {
      return _editor_state_props.EditorStateProps.activeStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  disabled: {
    get: function () {
      return SwitchProps.disabled;
    },
    configurable: true,
    enumerable: true
  },
  focusStateEnabled: {
    get: function () {
      return _editor_state_props.EditorStateProps.focusStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  hoverStateEnabled: {
    get: function () {
      return _editor_state_props.EditorStateProps.hoverStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  tabIndex: {
    get: function () {
      return SwitchProps.tabIndex;
    },
    configurable: true,
    enumerable: true
  },
  visible: {
    get: function () {
      return SwitchProps.visible;
    },
    configurable: true,
    enumerable: true
  }
});
let Switch = exports.Switch = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(Switch, _BaseInfernoComponent);
  function Switch(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {
      value: _this.props.value !== undefined ? _this.props.value : _this.props.defaultValue
    };
    return _this;
  }
  var _proto = Switch.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
      componentProps: this.componentProps,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Switch, [{
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
  return Switch;
}(_inferno2.BaseInfernoComponent);
Switch.defaultProps = SwitchPropsType;