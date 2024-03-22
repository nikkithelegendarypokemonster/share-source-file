/**
* DevExtreme (renovation/ui/editors/number_box.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.NumberBoxPropsType = exports.NumberBoxProps = exports.NumberBox = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _number_box = _interopRequireDefault(require("../../../ui/number_box"));
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _editor = require("./common/editor");
var _editor_state_props = require("./common/editor_state_props");
var _editor_label_props = require("./common/editor_label_props");
const _excluded = ["accessKey", "activeStateEnabled", "className", "defaultValue", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "inputAttr", "invalidValueMessage", "isDirty", "isValid", "label", "labelMode", "max", "min", "mode", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "showSpinButtons", "step", "tabIndex", "useLargeSpinButtons", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DEFAULT_VALUE = 0;
const viewFunction = _ref => {
  let {
    componentProps,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _number_box.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
const NumberBoxProps = exports.NumberBoxProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_editor.EditorProps), Object.getOwnPropertyDescriptors({
  defaultValue: DEFAULT_VALUE,
  isReactComponentWrapper: true
})));
const NumberBoxPropsType = exports.NumberBoxPropsType = Object.defineProperties({
  isReactComponentWrapper: true
}, {
  defaultValue: {
    get: function () {
      return NumberBoxProps.defaultValue;
    },
    configurable: true,
    enumerable: true
  },
  readOnly: {
    get: function () {
      return NumberBoxProps.readOnly;
    },
    configurable: true,
    enumerable: true
  },
  name: {
    get: function () {
      return NumberBoxProps.name;
    },
    configurable: true,
    enumerable: true
  },
  validationError: {
    get: function () {
      return NumberBoxProps.validationError;
    },
    configurable: true,
    enumerable: true
  },
  validationErrors: {
    get: function () {
      return NumberBoxProps.validationErrors;
    },
    configurable: true,
    enumerable: true
  },
  validationMessageMode: {
    get: function () {
      return NumberBoxProps.validationMessageMode;
    },
    configurable: true,
    enumerable: true
  },
  validationMessagePosition: {
    get: function () {
      return NumberBoxProps.validationMessagePosition;
    },
    configurable: true,
    enumerable: true
  },
  validationStatus: {
    get: function () {
      return NumberBoxProps.validationStatus;
    },
    configurable: true,
    enumerable: true
  },
  isValid: {
    get: function () {
      return NumberBoxProps.isValid;
    },
    configurable: true,
    enumerable: true
  },
  isDirty: {
    get: function () {
      return NumberBoxProps.isDirty;
    },
    configurable: true,
    enumerable: true
  },
  inputAttr: {
    get: function () {
      return NumberBoxProps.inputAttr;
    },
    configurable: true,
    enumerable: true
  },
  className: {
    get: function () {
      return NumberBoxProps.className;
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
      return NumberBoxProps.disabled;
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
      return NumberBoxProps.tabIndex;
    },
    configurable: true,
    enumerable: true
  },
  visible: {
    get: function () {
      return NumberBoxProps.visible;
    },
    configurable: true,
    enumerable: true
  },
  label: {
    get: function () {
      return _editor_label_props.EditorLabelProps.label;
    },
    configurable: true,
    enumerable: true
  },
  labelMode: {
    get: function () {
      return _editor_label_props.EditorLabelProps.labelMode;
    },
    configurable: true,
    enumerable: true
  }
});
let NumberBox = exports.NumberBox = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(NumberBox, _BaseInfernoComponent);
  function NumberBox(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {
      value: _this.props.value !== undefined ? _this.props.value : _this.props.defaultValue
    };
    return _this;
  }
  var _proto = NumberBox.prototype;
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
  _createClass(NumberBox, [{
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
  return NumberBox;
}(_inferno2.BaseInfernoComponent);
NumberBox.defaultProps = NumberBoxPropsType;
