/**
* DevExtreme (renovation/ui/responsive_box/responsive_box.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.ResponsiveBox = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _widget = require("../common/widget");
var _responsive_box_props = require("./responsive_box_props");
var _combine_classes = require("../../utils/combine_classes");
var _box = require("../box/box");
var _window = require("../../../core/utils/window");
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _screen_utils = require("./screen_utils");
const _excluded = ["screenByWidth"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const HD_SCREEN_WIDTH = 1920;
const RESPONSIVE_BOX_CLASS = 'dx-responsivebox';
const SCREEN_SIZE_CLASS_PREFIX = "".concat(RESPONSIVE_BOX_CLASS, "-screen-");
const viewFunction = viewModel => {
  const getCurrentScreenSizeQualifier = () => {
    var _viewModel$props$scre;
    const screenWidth = (0, _window.hasWindow)() ? _dom_adapter.default.getDocumentElement().clientWidth : HD_SCREEN_WIDTH;
    const screenSizeFunc = (_viewModel$props$scre = viewModel.props.screenByWidth) !== null && _viewModel$props$scre !== void 0 ? _viewModel$props$scre : _screen_utils.convertToScreenSizeQualifier;
    return screenSizeFunc(screenWidth);
  };
  const screenSizeQualifier = getCurrentScreenSizeQualifier();
  const cssClasses = (0, _combine_classes.combineClasses)({
    [RESPONSIVE_BOX_CLASS]: true,
    [SCREEN_SIZE_CLASS_PREFIX + screenSizeQualifier]: true
  });
  return (0, _inferno.createComponentVNode)(2, _widget.Widget, {
    "classes": cssClasses,
    children: (0, _inferno.createComponentVNode)(2, _box.Box)
  });
};
exports.viewFunction = viewFunction;
let ResponsiveBox = exports.ResponsiveBox = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(ResponsiveBox, _InfernoWrapperCompon);
  function ResponsiveBox(props) {
    var _this;
    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = ResponsiveBox.prototype;
  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      restAttributes: this.restAttributes
    });
  };
  _createClass(ResponsiveBox, [{
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return ResponsiveBox;
}(_inferno2.InfernoWrapperComponent);
ResponsiveBox.defaultProps = _responsive_box_props.ResponsiveBoxProps;
