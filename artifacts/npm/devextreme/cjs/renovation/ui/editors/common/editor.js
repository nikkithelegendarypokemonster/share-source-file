/**
* DevExtreme (cjs/renovation/ui/editors/common/editor.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.EditorPropsType = exports.EditorProps = exports.Editor = void 0;
exports.defaultOptions = defaultOptions;
exports.viewFunction = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _guid = _interopRequireDefault(require("../../../../core/guid"));
var _widget = require("../../common/widget");
var _base_props = require("../../common/base_props");
var _combine_classes = require("../../../utils/combine_classes");
var _validation_message = require("../../overlays/validation_message");
var _utils = require("../../../../core/options/utils");
const _excluded = ["accessKey", "activeStateEnabled", "aria", "children", "className", "classes", "defaultValue", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "inputAttr", "isDirty", "isValid", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "tabIndex", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "visible", "width"];
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
const getCssClasses = model => {
  const {
    classes,
    isValid,
    readOnly
  } = model;
  const classesMap = {
    'dx-state-readonly': !!readOnly,
    'dx-invalid': !isValid,
    ["".concat(classes)]: !!classes
  };
  return (0, _combine_classes.combineClasses)(classesMap);
};
const viewFunction = viewModel => {
  const {
    aria,
    cssClasses: classes,
    isValidationMessageVisible,
    onFocusIn,
    props: {
      accessKey,
      activeStateEnabled,
      children,
      className,
      disabled,
      focusStateEnabled,
      height,
      hint,
      hoverStateEnabled,
      onClick,
      onKeyDown,
      rtlEnabled,
      tabIndex,
      validationMessageMode,
      validationMessagePosition,
      visible,
      width
    },
    restAttributes,
    rootElementRef,
    validationErrors,
    validationMessageGuid,
    validationMessageTarget,
    widgetRef
  } = viewModel;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
    "rootElementRef": rootElementRef,
    "aria": aria,
    "classes": classes,
    "activeStateEnabled": activeStateEnabled,
    "focusStateEnabled": focusStateEnabled,
    "hoverStateEnabled": hoverStateEnabled,
    "accessKey": accessKey,
    "className": className,
    "rtlEnabled": rtlEnabled,
    "hint": hint,
    "disabled": disabled,
    "height": height,
    "width": width,
    "onFocusIn": onFocusIn,
    "onClick": onClick,
    "onKeyDown": onKeyDown,
    "tabIndex": tabIndex,
    "visible": visible
  }, restAttributes, {
    children: (0, _inferno.createFragment)([children, isValidationMessageVisible && (0, _inferno.createComponentVNode)(2, _validation_message.ValidationMessage, {
      "validationErrors": validationErrors,
      "mode": validationMessageMode,
      "positionSide": validationMessagePosition,
      "rtlEnabled": rtlEnabled,
      "target": validationMessageTarget,
      "boundary": validationMessageTarget,
      "visualContainer": validationMessageTarget,
      "contentId": validationMessageGuid
    })], 0)
  }), null, widgetRef));
};
exports.viewFunction = viewFunction;
const EditorProps = exports.EditorProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_base_props.BaseWidgetProps), Object.getOwnPropertyDescriptors({
  readOnly: false,
  name: '',
  validationError: null,
  validationErrors: null,
  validationMessageMode: 'auto',
  validationMessagePosition: 'bottom',
  validationStatus: 'valid',
  isValid: true,
  isDirty: false,
  inputAttr: Object.freeze({}),
  defaultValue: null,
  valueChange: () => {}
})));
const EditorPropsType = exports.EditorPropsType = Object.defineProperties({}, {
  readOnly: {
    get: function () {
      return EditorProps.readOnly;
    },
    configurable: true,
    enumerable: true
  },
  name: {
    get: function () {
      return EditorProps.name;
    },
    configurable: true,
    enumerable: true
  },
  validationError: {
    get: function () {
      return EditorProps.validationError;
    },
    configurable: true,
    enumerable: true
  },
  validationErrors: {
    get: function () {
      return EditorProps.validationErrors;
    },
    configurable: true,
    enumerable: true
  },
  validationMessageMode: {
    get: function () {
      return EditorProps.validationMessageMode;
    },
    configurable: true,
    enumerable: true
  },
  validationMessagePosition: {
    get: function () {
      return EditorProps.validationMessagePosition;
    },
    configurable: true,
    enumerable: true
  },
  validationStatus: {
    get: function () {
      return EditorProps.validationStatus;
    },
    configurable: true,
    enumerable: true
  },
  isValid: {
    get: function () {
      return EditorProps.isValid;
    },
    configurable: true,
    enumerable: true
  },
  isDirty: {
    get: function () {
      return EditorProps.isDirty;
    },
    configurable: true,
    enumerable: true
  },
  inputAttr: {
    get: function () {
      return EditorProps.inputAttr;
    },
    configurable: true,
    enumerable: true
  },
  defaultValue: {
    get: function () {
      return EditorProps.defaultValue;
    },
    configurable: true,
    enumerable: true
  },
  valueChange: {
    get: function () {
      return EditorProps.valueChange;
    },
    configurable: true,
    enumerable: true
  },
  className: {
    get: function () {
      return EditorProps.className;
    },
    configurable: true,
    enumerable: true
  },
  activeStateEnabled: {
    get: function () {
      return EditorProps.activeStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  disabled: {
    get: function () {
      return EditorProps.disabled;
    },
    configurable: true,
    enumerable: true
  },
  focusStateEnabled: {
    get: function () {
      return EditorProps.focusStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  hoverStateEnabled: {
    get: function () {
      return EditorProps.hoverStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  tabIndex: {
    get: function () {
      return EditorProps.tabIndex;
    },
    configurable: true,
    enumerable: true
  },
  visible: {
    get: function () {
      return EditorProps.visible;
    },
    configurable: true,
    enumerable: true
  },
  aria: {
    get: function () {
      return _widget.WidgetProps.aria;
    },
    configurable: true,
    enumerable: true
  },
  classes: {
    get: function () {
      return _widget.WidgetProps.classes;
    },
    configurable: true,
    enumerable: true
  }
});
let Editor = exports.Editor = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(Editor, _InfernoWrapperCompon);
  function Editor(props) {
    var _this;
    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.widgetRef = (0, _inferno.createRef)();
    _this.rootElementRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.state = {
      validationMessageGuid: "dx-".concat(new _guid.default()),
      isValidationMessageVisible: false,
      value: _this.props.value !== undefined ? _this.props.value : _this.props.defaultValue
    };
    _this.updateValidationMessageVisibility = _this.updateValidationMessageVisibility.bind(_assertThisInitialized(_this));
    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    _this.blur = _this.blur.bind(_assertThisInitialized(_this));
    _this.onFocusIn = _this.onFocusIn.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = Editor.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.updateValidationMessageVisibility, [this.props.isValid, this.props.validationStatus, this.props.validationError, this.props.validationErrors]), (0, _inferno2.createReRenderEffect)()];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.isValid, this.props.validationStatus, this.props.validationError, this.props.validationErrors]);
  };
  _proto.updateValidationMessageVisibility = function updateValidationMessageVisibility() {
    this.setState(__state_argument => ({
      isValidationMessageVisible: this.shouldShowValidationMessage
    }));
  };
  _proto.onFocusIn = function onFocusIn(event) {
    const {
      onFocusIn
    } = this.props;
    onFocusIn === null || onFocusIn === void 0 ? void 0 : onFocusIn(event);
  };
  _proto.focus = function focus() {
    this.widgetRef.current.focus();
  };
  _proto.blur = function blur() {
    this.widgetRef.current.blur();
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoWrapperCompon.prototype.componentWillUpdate.call(this);
    if (this.props['validationError'] !== nextProps['validationError'] || this.props['validationErrors'] !== nextProps['validationErrors']) {
      this.__getterCache['validationErrors'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
      validationMessageGuid: this.state.validationMessageGuid,
      isValidationMessageVisible: this.state.isValidationMessageVisible,
      rootElementRef: this.rootElementRef,
      widgetRef: this.widgetRef,
      onFocusIn: this.onFocusIn,
      cssClasses: this.cssClasses,
      shouldShowValidationMessage: this.shouldShowValidationMessage,
      aria: this.aria,
      validationErrors: this.validationErrors,
      validationMessageTarget: this.validationMessageTarget,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Editor, [{
    key: "cssClasses",
    get: function () {
      return "".concat(getCssClasses(_extends({}, this.props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      })));
    }
  }, {
    key: "shouldShowValidationMessage",
    get: function () {
      var _this$validationError;
      const {
        isValid,
        validationStatus
      } = this.props;
      const validationErrors = (_this$validationError = this.validationErrors) !== null && _this$validationError !== void 0 ? _this$validationError : [];
      const isEditorValid = isValid && validationStatus !== 'invalid';
      return !isEditorValid && validationErrors.length > 0;
    }
  }, {
    key: "aria",
    get: function () {
      const {
        isValid,
        readOnly
      } = this.props;
      const result = {
        readonly: readOnly ? 'true' : 'false',
        invalid: !isValid ? 'true' : 'false'
      };
      if (this.shouldShowValidationMessage) {
        result.describedBy = this.state.validationMessageGuid;
      }
      return _extends({}, result, this.props.aria);
    }
  }, {
    key: "validationErrors",
    get: function () {
      if (this.__getterCache['validationErrors'] !== undefined) {
        return this.__getterCache['validationErrors'];
      }
      return this.__getterCache['validationErrors'] = (() => {
        const {
          validationError,
          validationErrors
        } = this.props;
        let allValidationErrors = validationErrors && [...validationErrors];
        if (!allValidationErrors && validationError) {
          allValidationErrors = [_extends({}, validationError)];
        }
        return allValidationErrors;
      })();
    }
  }, {
    key: "validationMessageTarget",
    get: function () {
      var _this$rootElementRef;
      return (_this$rootElementRef = this.rootElementRef) === null || _this$rootElementRef === void 0 ? void 0 : _this$rootElementRef.current;
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
  return Editor;
}(_inferno2.InfernoWrapperComponent);
function __processTwoWayProps(defaultProps) {
  const twoWayProps = ['value'];
  return Object.keys(defaultProps).reduce((props, propName) => {
    const propValue = defaultProps[propName];
    const defaultPropName = twoWayProps.some(p => p === propName) ? 'default' + propName.charAt(0).toUpperCase() + propName.slice(1) : propName;
    props[defaultPropName] = propValue;
    return props;
  }, {});
}
Editor.defaultProps = EditorPropsType;
const __defaultOptionRules = [];
function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  Editor.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(Editor.defaultProps), Object.getOwnPropertyDescriptors(__processTwoWayProps((0, _utils.convertRulesToOptions)(__defaultOptionRules)))));
}
