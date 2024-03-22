/**
* DevExtreme (cjs/renovation/ui/overlays/overlay.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.OverlayProps = exports.Overlay = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _ui = _interopRequireDefault(require("../../../ui/overlay/ui.overlay"));
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _base_props = require("../common/base_props");
const _excluded = ["_checkParentVisibility", "accessKey", "activeStateEnabled", "animation", "className", "container", "contentTemplate", "disabled", "focusStateEnabled", "height", "hideOnOutsideClick", "hideOnParentScroll", "hint", "hoverStateEnabled", "integrationOptions", "maxWidth", "onClick", "onKeyDown", "position", "propagateOutsideClick", "rtlEnabled", "shading", "tabIndex", "templatesRenderAsynchronously", "visible", "width"];
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
    "componentType": _ui.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
const OverlayProps = exports.OverlayProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_base_props.BaseWidgetProps), Object.getOwnPropertyDescriptors({
  integrationOptions: Object.freeze({}),
  templatesRenderAsynchronously: false,
  shading: true,
  hideOnOutsideClick: false,
  hideOnParentScroll: false,
  animation: Object.freeze({
    type: 'pop',
    duration: 300,
    to: {
      opacity: 0,
      scale: 0.55
    },
    from: {
      opacity: 1,
      scale: 1
    }
  }),
  visible: false,
  propagateOutsideClick: true,
  _checkParentVisibility: false,
  rtlEnabled: false,
  contentTemplate: 'content',
  maxWidth: null,
  isReactComponentWrapper: true
})));
let Overlay = exports.Overlay = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(Overlay, _BaseInfernoComponent);
  function Overlay(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = Overlay.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      componentProps: this.componentProps,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Overlay, [{
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
  return Overlay;
}(_inferno2.BaseInfernoComponent);
Overlay.defaultProps = OverlayProps;
