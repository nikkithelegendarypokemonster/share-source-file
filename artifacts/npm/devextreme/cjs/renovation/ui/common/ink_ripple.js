/**
* DevExtreme (cjs/renovation/ui/common/ink_ripple.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.InkRippleProps = exports.InkRipple = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _utils = require("../../../ui/widget/utils.ink_ripple");
const _excluded = ["config"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = model => (0, _inferno.normalizeProps)((0, _inferno.createVNode)(1, "div", "dx-inkripple", null, 1, _extends({}, model.restAttributes)));
exports.viewFunction = viewFunction;
const InkRippleProps = exports.InkRippleProps = {
  config: Object.freeze({})
};
let InkRipple = exports.InkRipple = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(InkRipple, _BaseInfernoComponent);
  function InkRipple(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    _this.hideWave = _this.hideWave.bind(_assertThisInitialized(_this));
    _this.showWave = _this.showWave.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = InkRipple.prototype;
  _proto.hideWave = function hideWave(opts) {
    (0, _utils.hideWave)(this.getConfig, opts);
  };
  _proto.showWave = function showWave(opts) {
    (0, _utils.showWave)(this.getConfig, opts);
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.props['config'] !== nextProps['config']) {
      this.__getterCache['getConfig'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      getConfig: this.getConfig,
      restAttributes: this.restAttributes
    });
  };
  _createClass(InkRipple, [{
    key: "getConfig",
    get: function () {
      if (this.__getterCache['getConfig'] !== undefined) {
        return this.__getterCache['getConfig'];
      }
      return this.__getterCache['getConfig'] = (() => {
        const {
          config
        } = this.props;
        return (0, _utils.initConfig)(config);
      })();
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return InkRipple;
}(_inferno2.BaseInfernoComponent);
InkRipple.defaultProps = InkRippleProps;
