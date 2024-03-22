"use strict";

exports.viewFunction = exports.CheckBoxIconProps = exports.CheckBoxIcon = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _get_computed_style = _interopRequireDefault(require("../../../utils/get_computed_style"));
var _window = require("../../../../core/utils/window");
var _style = require("../../../../core/utils/style");
var _type = require("../../../../core/utils/type");
var _utils = require("./utils");
const _excluded = ["isChecked", "size"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const viewFunction = viewModel => {
  const {
    cssStyles,
    elementRef
  } = viewModel;
  return (0, _inferno.createVNode)(1, "span", "dx-checkbox-icon", null, 1, {
    "style": (0, _inferno2.normalizeStyles)(cssStyles)
  }, null, elementRef);
};
exports.viewFunction = viewFunction;
const CheckBoxIconProps = exports.CheckBoxIconProps = {
  isChecked: false
};
let CheckBoxIcon = exports.CheckBoxIcon = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(CheckBoxIcon, _InfernoComponent);
  function CheckBoxIcon(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.elementRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.updateFontSize = _this.updateFontSize.bind(_assertThisInitialized(_this));
    _this.setIconFontSize = _this.setIconFontSize.bind(_assertThisInitialized(_this));
    _this.getIconSize = _this.getIconSize.bind(_assertThisInitialized(_this));
    _this.getComputedIconSize = _this.getComputedIconSize.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = CheckBoxIcon.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.updateFontSize, [this.props.isChecked, this.props.size])];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.isChecked, this.props.size]);
  };
  _proto.updateFontSize = function updateFontSize() {
    const {
      isChecked,
      size
    } = this.props;
    if ((0, _window.hasWindow)() && size) {
      const newIconSize = this.getIconSize(size);
      const newFontSize = (0, _utils.getFontSizeByIconSize)(newIconSize, isChecked);
      this.setIconFontSize(newFontSize);
    }
  };
  _proto.setIconFontSize = function setIconFontSize(fontSize) {
    const element = this.elementRef.current;
    element.style.fontSize = "".concat(fontSize, "px");
  };
  _proto.getIconSize = function getIconSize(size) {
    if ((0, _type.isNumeric)(size)) {
      return size;
    }
    if (size.endsWith('px')) {
      return parseInt(size, 10);
    }
    return this.getComputedIconSize();
  };
  _proto.getComputedIconSize = function getComputedIconSize() {
    const element = this.elementRef.current;
    const iconComputedStyle = (0, _get_computed_style.default)(element);
    const computedIconSize = parseInt(iconComputedStyle === null || iconComputedStyle === void 0 ? void 0 : iconComputedStyle.width, 10);
    return computedIconSize;
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoComponent.prototype.componentWillUpdate.call(this);
    if (this.props['size'] !== nextProps['size']) {
      this.__getterCache['cssStyles'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      elementRef: this.elementRef,
      setIconFontSize: this.setIconFontSize,
      getIconSize: this.getIconSize,
      getComputedIconSize: this.getComputedIconSize,
      cssStyles: this.cssStyles,
      restAttributes: this.restAttributes
    });
  };
  _createClass(CheckBoxIcon, [{
    key: "cssStyles",
    get: function () {
      if (this.__getterCache['cssStyles'] !== undefined) {
        return this.__getterCache['cssStyles'];
      }
      return this.__getterCache['cssStyles'] = (() => {
        const {
          size
        } = this.props;
        const width = (0, _style.normalizeStyleProp)('width', size);
        const height = (0, _style.normalizeStyleProp)('height', size);
        return {
          height,
          width
        };
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
  return CheckBoxIcon;
}(_inferno2.InfernoComponent);
CheckBoxIcon.defaultProps = CheckBoxIconProps;