"use strict";

exports.viewFunction = exports.CheckBoxIconProps = exports.CheckBoxIcon = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _style = require("../../../../core/utils/style");
require("../../../../ui/themes");
const _excluded = ["size"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
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
const CheckBoxIconProps = exports.CheckBoxIconProps = {};
class CheckBoxIcon extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.elementRef = (0, _inferno.createRef)();
    this.__getterCache = {};
  }
  get cssStyles() {
    if (this.__getterCache['cssStyles'] !== undefined) {
      return this.__getterCache['cssStyles'];
    }
    return this.__getterCache['cssStyles'] = (() => {
      const {
        size
      } = this.props;
      const fontSize = (0, _style.normalizeStyleProp)('fontSize', size);
      return {
        fontSize
      };
    })();
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props['size'] !== nextProps['size']) {
      this.__getterCache['cssStyles'] = undefined;
    }
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      elementRef: this.elementRef,
      cssStyles: this.cssStyles,
      restAttributes: this.restAttributes
    });
  }
}
exports.CheckBoxIcon = CheckBoxIcon;
CheckBoxIcon.defaultProps = CheckBoxIconProps;