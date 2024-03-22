/**
* DevExtreme (cjs/renovation/ui/editors/drop_down_editors/date_box.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.DateBoxPropsType = exports.DateBoxProps = exports.DateBox = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _date_box = _interopRequireDefault(require("../../../../ui/date_box"));
var _dom_component_wrapper = require("../../common/dom_component_wrapper");
var _editor = require("../common/editor");
var _editor_state_props = require("../common/editor_state_props");
var _editor_label_props = require("../common/editor_label_props");
const _excluded = ["accessKey", "activeStateEnabled", "calendarOptions", "className", "defaultValue", "disabled", "field", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "inputAttr", "isDirty", "isValid", "label", "labelMode", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "tabIndex", "type", "useMaskBehavior", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "visible", "width"];
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
    "componentType": _date_box.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
const DateBoxProps = exports.DateBoxProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_editor.EditorProps), Object.getOwnPropertyDescriptors({
  type: 'date',
  useMaskBehavior: false,
  defaultValue: null,
  isReactComponentWrapper: true
})));
const DateBoxPropsType = exports.DateBoxPropsType = Object.defineProperties({
  isReactComponentWrapper: true
}, {
  type: {
    get: function () {
      return DateBoxProps.type;
    },
    configurable: true,
    enumerable: true
  },
  useMaskBehavior: {
    get: function () {
      return DateBoxProps.useMaskBehavior;
    },
    configurable: true,
    enumerable: true
  },
  defaultValue: {
    get: function () {
      return DateBoxProps.defaultValue;
    },
    configurable: true,
    enumerable: true
  },
  readOnly: {
    get: function () {
      return DateBoxProps.readOnly;
    },
    configurable: true,
    enumerable: true
  },
  name: {
    get: function () {
      return DateBoxProps.name;
    },
    configurable: true,
    enumerable: true
  },
  validationError: {
    get: function () {
      return DateBoxProps.validationError;
    },
    configurable: true,
    enumerable: true
  },
  validationErrors: {
    get: function () {
      return DateBoxProps.validationErrors;
    },
    configurable: true,
    enumerable: true
  },
  validationMessageMode: {
    get: function () {
      return DateBoxProps.validationMessageMode;
    },
    configurable: true,
    enumerable: true
  },
  validationMessagePosition: {
    get: function () {
      return DateBoxProps.validationMessagePosition;
    },
    configurable: true,
    enumerable: true
  },
  validationStatus: {
    get: function () {
      return DateBoxProps.validationStatus;
    },
    configurable: true,
    enumerable: true
  },
  isValid: {
    get: function () {
      return DateBoxProps.isValid;
    },
    configurable: true,
    enumerable: true
  },
  isDirty: {
    get: function () {
      return DateBoxProps.isDirty;
    },
    configurable: true,
    enumerable: true
  },
  inputAttr: {
    get: function () {
      return DateBoxProps.inputAttr;
    },
    configurable: true,
    enumerable: true
  },
  className: {
    get: function () {
      return DateBoxProps.className;
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
      return DateBoxProps.disabled;
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
      return DateBoxProps.tabIndex;
    },
    configurable: true,
    enumerable: true
  },
  visible: {
    get: function () {
      return DateBoxProps.visible;
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
let DateBox = exports.DateBox = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(DateBox, _BaseInfernoComponent);
  function DateBox(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {
      value: _this.props.value !== undefined ? _this.props.value : _this.props.defaultValue
    };
    return _this;
  }
  var _proto = DateBox.prototype;
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
  _createClass(DateBox, [{
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
  return DateBox;
}(_inferno2.BaseInfernoComponent);
DateBox.defaultProps = DateBoxPropsType;
