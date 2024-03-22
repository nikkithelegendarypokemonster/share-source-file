/**
* DevExtreme (renovation/ui/common/dom_component_wrapper.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.DomComponentWrapperProps = exports.DomComponentWrapper = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _config_context = require("../../common/config_context");
var _get_updated_options = require("./utils/get_updated_options");
const _excluded = ["valueChange"],
  _excluded2 = ["componentProps", "componentType", "templateNames"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const normalizeProps = props => Object.keys(props).reduce((accumulator, key) => {
  if (props[key] !== undefined) {
    accumulator[key] = props[key];
  }
  return accumulator;
}, {});
const viewFunction = _ref => {
  let {
    props: {
      componentProps: {
        className
      }
    },
    restAttributes,
    widgetRef
  } = _ref;
  return normalizeProps((0, _inferno.createVNode)(1, "div", className, null, 1, _extends({}, restAttributes), null, widgetRef));
};
exports.viewFunction = viewFunction;
const DomComponentWrapperProps = exports.DomComponentWrapperProps = {};
let DomComponentWrapper = exports.DomComponentWrapper = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(DomComponentWrapper, _InfernoComponent);
  function DomComponentWrapper(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.widgetRef = (0, _inferno.createRef)();
    _this.getInstance = _this.getInstance.bind(_assertThisInitialized(_this));
    _this.setupWidget = _this.setupWidget.bind(_assertThisInitialized(_this));
    _this.updateWidget = _this.updateWidget.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = DomComponentWrapper.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.setupWidget, []), new _inferno2.InfernoEffect(this.updateWidget, [this.props.componentProps, this.config, this.props.templateNames])];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.componentProps, this.config, this.props.templateNames]);
  };
  _proto.setupWidget = function setupWidget() {
    const componentInstance = new this.props.componentType(this.widgetRef.current, this.properties);
    this.instance = componentInstance;
    return () => {
      componentInstance.dispose();
      this.instance = null;
    };
  };
  _proto.updateWidget = function updateWidget() {
    const instance = this.getInstance();
    if (!instance) {
      return;
    }
    const updatedOptions = (0, _get_updated_options.getUpdatedOptions)(this.prevProps || {}, this.properties);
    if (updatedOptions.length) {
      instance.beginUpdate();
      updatedOptions.forEach(_ref2 => {
        let {
          path,
          value
        } = _ref2;
        instance.option(path, value);
      });
      instance.endUpdate();
    }
    this.prevProps = this.properties;
  };
  _proto.getInstance = function getInstance() {
    return this.instance;
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      widgetRef: this.widgetRef,
      config: this.config,
      properties: this.properties,
      restAttributes: this.restAttributes
    });
  };
  _createClass(DomComponentWrapper, [{
    key: "config",
    get: function () {
      if (this.context[_config_context.ConfigContext.id]) {
        return this.context[_config_context.ConfigContext.id];
      }
      return _config_context.ConfigContext.defaultValue;
    }
  }, {
    key: "properties",
    get: function () {
      var _this$config;
      const normalizedProps = normalizeProps(this.props.componentProps);
      const {
          valueChange
        } = normalizedProps,
        restProps = _objectWithoutPropertiesLoose(normalizedProps, _excluded);
      const properties = _extends({
        rtlEnabled: !!((_this$config = this.config) !== null && _this$config !== void 0 && _this$config.rtlEnabled),
        isRenovated: true
      }, restProps);
      if (valueChange) {
        properties.onValueChanged = _ref3 => {
          let {
            value
          } = _ref3;
          return valueChange(value);
        };
      }
      const templates = this.props.templateNames;
      templates.forEach(name => {
        if ((0, _inferno2.hasTemplate)(name, properties, this)) {
          properties[name] = (item, index, container) => {
            (0, _inferno2.renderTemplate)(this.props.componentProps[name], {
              item,
              index,
              container
            }, this);
          };
        }
      });
      return properties;
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded2);
      return restProps;
    }
  }]);
  return DomComponentWrapper;
}(_inferno2.InfernoComponent);
DomComponentWrapper.defaultProps = DomComponentWrapperProps;
