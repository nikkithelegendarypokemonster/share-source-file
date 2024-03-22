/**
* DevExtreme (cjs/renovation/ui/pager/common/light_button.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.LightButtonProps = exports.LightButton = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _subscribe_to_event = require("../../../utils/subscribe_to_event");
var _keyboard_action_context = require("./keyboard_action_context");
const _excluded = ["children", "className", "label", "onClick", "selected", "tabIndex"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const viewFunction = _ref => {
  let {
    props: {
      children,
      className,
      label,
      selected,
      tabIndex
    },
    widgetRef
  } = _ref;
  return (0, _inferno.createVNode)(1, "div", className, children, 0, {
    "tabIndex": tabIndex,
    "role": "button",
    "aria-label": label,
    "aria-current": selected ? 'page' : undefined
  }, null, widgetRef);
};
exports.viewFunction = viewFunction;
const LightButtonProps = exports.LightButtonProps = {
  className: '',
  label: '',
  tabIndex: 0,
  selected: false
};
let LightButton = exports.LightButton = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(LightButton, _InfernoComponent);
  function LightButton(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.widgetRef = (0, _inferno.createRef)();
    _this.keyboardEffect = _this.keyboardEffect.bind(_assertThisInitialized(_this));
    _this.subscribeToClick = _this.subscribeToClick.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = LightButton.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.keyboardEffect, [this.keyboardContext, this.props.onClick]), new _inferno2.InfernoEffect(this.subscribeToClick, [this.props.onClick])];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$, _this$_effects$2;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.keyboardContext, this.props.onClick]);
    (_this$_effects$2 = this._effects[1]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props.onClick]);
  };
  _proto.keyboardEffect = function keyboardEffect() {
    return this.keyboardContext.registerKeyboardAction(this.widgetRef.current, this.props.onClick);
  };
  _proto.subscribeToClick = function subscribeToClick() {
    return (0, _subscribe_to_event.subscribeToClickEvent)(this.widgetRef.current, this.props.onClick);
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      widgetRef: this.widgetRef,
      keyboardContext: this.keyboardContext,
      restAttributes: this.restAttributes
    });
  };
  _createClass(LightButton, [{
    key: "keyboardContext",
    get: function () {
      if (this.context[_keyboard_action_context.KeyboardActionContext.id]) {
        return this.context[_keyboard_action_context.KeyboardActionContext.id];
      }
      return _keyboard_action_context.KeyboardActionContext.defaultValue;
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return LightButton;
}(_inferno2.InfernoComponent);
LightButton.defaultProps = LightButtonProps;
