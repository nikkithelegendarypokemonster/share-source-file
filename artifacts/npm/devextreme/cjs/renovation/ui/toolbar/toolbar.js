/**
* DevExtreme (cjs/renovation/ui/toolbar/toolbar.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.Toolbar = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _toolbar = _interopRequireDefault(require("../../../ui/toolbar"));
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _toolbar_props = require("./toolbar_props");
var _type = require("../../../core/utils/type");
var _config_context = require("../../common/config_context");
var _resolve_rtl = require("../../utils/resolve_rtl");
const _excluded = ["accessKey", "activeStateEnabled", "className", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "items", "onClick", "onKeyDown", "rtlEnabled", "tabIndex", "visible", "width"];
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
    "componentType": _toolbar.default,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
let Toolbar = exports.Toolbar = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(Toolbar, _BaseInfernoComponent);
  function Toolbar(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    return _this;
  }
  var _proto = Toolbar.prototype;
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.props['items'] !== nextProps['items'] || this.props['rtlEnabled'] !== nextProps['rtlEnabled'] || this.context[_config_context.ConfigContext.id] !== context[_config_context.ConfigContext.id] || this.props !== nextProps) {
      this.__getterCache['componentProps'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      config: this.config,
      componentProps: this.componentProps,
      resolvedRtlEnabled: this.resolvedRtlEnabled,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Toolbar, [{
    key: "config",
    get: function () {
      if (this.context[_config_context.ConfigContext.id]) {
        return this.context[_config_context.ConfigContext.id];
      }
      return _config_context.ConfigContext.defaultValue;
    }
  }, {
    key: "componentProps",
    get: function () {
      if (this.__getterCache['componentProps'] !== undefined) {
        return this.__getterCache['componentProps'];
      }
      return this.__getterCache['componentProps'] = (() => {
        const {
          items
        } = this.props;
        const toolbarItems = items === null || items === void 0 ? void 0 : items.map(item => {
          var _item$options, _options$rtlEnabled;
          if (!(0, _type.isObject)(item)) {
            return item;
          }
          const options = (_item$options = item.options) !== null && _item$options !== void 0 ? _item$options : {};
          options.rtlEnabled = (_options$rtlEnabled = options.rtlEnabled) !== null && _options$rtlEnabled !== void 0 ? _options$rtlEnabled : this.resolvedRtlEnabled;
          return _extends({}, item, {
            options
          });
        });
        return _extends({}, this.props, {
          items: toolbarItems
        });
      })();
    }
  }, {
    key: "resolvedRtlEnabled",
    get: function () {
      const {
        rtlEnabled
      } = this.props;
      return !!(0, _resolve_rtl.resolveRtlEnabled)(rtlEnabled, this.config);
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return Toolbar;
}(_inferno2.BaseInfernoComponent);
Toolbar.defaultProps = _toolbar_props.ToolbarProps;
