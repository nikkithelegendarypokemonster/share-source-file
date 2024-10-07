"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WidgetDefaultProps = exports.Widget = void 0;
var _inferno = require("inferno");
require("../../../events/click");
require("../../../events/hover");
var _inferno2 = require("@devextreme/runtime/inferno");
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _errors = _interopRequireDefault(require("../../../core/errors"));
var _extend = require("../../../core/utils/extend");
var _resize_callbacks = _interopRequireDefault(require("../../../core/utils/resize_callbacks"));
var _style = require("../../../core/utils/style");
var _type = require("../../../core/utils/type");
var _short = require("../../../events/short");
var _config_context = require("../../core/r1/config_context");
var _config_provider = require("../../core/r1/config_provider");
var _render_utils = require("../../core/r1/utils/render_utils");
var _resolve_rtl = require("../../core/r1/utils/resolve_rtl");
var _subscribe_to_event = require("../../core/r1/utils/subscribe_to_event");
var _base_props = require("../base_props");
const _excluded = ["height", "width", "activeStateEnabled", "hoverStateEnabled", "focusStateEnabled", "_feedbackHideTimeout", "_feedbackShowTimeout", "addWidgetClass", "rootElementRef", "rtlEnabled", "aria", "hint", "cssText", "classes", "name"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable @typescript-eslint/naming-convention */ /* eslint-disable spellcheck/spell-checker */ /* eslint-disable @typescript-eslint/explicit-module-boundary-types */ /* eslint-disable @typescript-eslint/no-explicit-any */
const DEFAULT_FEEDBACK_HIDE_TIMEOUT = 400;
const DEFAULT_FEEDBACK_SHOW_TIMEOUT = 30;
const getAria = args => Object.keys(args).reduce((r, key) => {
  if (args[key]) {
    return _extends({}, r, {
      [key === 'role' || key === 'id' ? key : `aria-${key}`]: String(args[key])
    });
  }
  return r;
}, {});
const WidgetDefaultProps = exports.WidgetDefaultProps = _extends({}, _base_props.BaseWidgetDefaultProps, {
  _feedbackHideTimeout: DEFAULT_FEEDBACK_HIDE_TIMEOUT,
  _feedbackShowTimeout: DEFAULT_FEEDBACK_SHOW_TIMEOUT,
  cssText: '',
  aria: {},
  classes: '',
  name: '',
  addWidgetClass: true
});
class Widget extends _inferno2.InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      focused: false,
      hovered: false
    };
    this.refs = null;
    // eslint-disable-next-line max-len
    this.rootElementRef = (0, _inferno.createRef)();
    // eslint-disable-next-line max-len
    this.widgetElementRef = (0, _inferno.createRef)();
    this.setRootElementRef = this.setRootElementRef.bind(this);
    this.activeEffect = this.activeEffect.bind(this);
    this.inactiveEffect = this.inactiveEffect.bind(this);
    this.clickEffect = this.clickEffect.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.focusInEffect = this.focusInEffect.bind(this);
    this.focusOutEffect = this.focusOutEffect.bind(this);
    this.hoverStartEffect = this.hoverStartEffect.bind(this);
    this.hoverEndEffect = this.hoverEndEffect.bind(this);
    this.keyboardEffect = this.keyboardEffect.bind(this);
    this.resizeEffect = this.resizeEffect.bind(this);
    this.windowResizeEffect = this.windowResizeEffect.bind(this);
    this.visibilityEffect = this.visibilityEffect.bind(this);
    this.checkDeprecation = this.checkDeprecation.bind(this);
    this.applyCssTextEffect = this.applyCssTextEffect.bind(this);
  }
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate(nextProps, nextState, context);
  }
  getConfig() {
    if (this.context[_config_context.ConfigContext.id]) {
      return this.context[_config_context.ConfigContext.id];
    }
    return _config_context.ConfigContext.defaultValue;
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.setRootElementRef, []), new _inferno2.InfernoEffect(this.activeEffect, [this.props._feedbackShowTimeout, this.props.activeStateEnabled, this.props.activeStateUnit, this.props.disabled, this.props.onActive]), new _inferno2.InfernoEffect(this.inactiveEffect, [this.props._feedbackHideTimeout, this.props.activeStateEnabled, this.props.activeStateUnit, this.props.onInactive, this.state.active]), new _inferno2.InfernoEffect(this.clickEffect, [this.props.disabled, this.props.name, this.props.onClick]), new _inferno2.InfernoEffect(this.focusInEffect, [this.props.disabled, this.props.focusStateEnabled, this.props.name, this.props.onFocusIn]), new _inferno2.InfernoEffect(this.focusOutEffect, [this.props.focusStateEnabled, this.props.name, this.props.onFocusOut, this.state.focused]), new _inferno2.InfernoEffect(this.hoverStartEffect, [this.props.activeStateUnit, this.props.disabled, this.props.hoverStateEnabled, this.props.onHoverStart, this.state.active]), new _inferno2.InfernoEffect(this.hoverEndEffect, [this.props.activeStateUnit, this.props.hoverStateEnabled, this.props.onHoverEnd, this.state.hovered]), new _inferno2.InfernoEffect(this.keyboardEffect, [this.props.focusStateEnabled, this.props.onKeyDown]), new _inferno2.InfernoEffect(this.resizeEffect, [this.props.name, this.props.onDimensionChanged]), new _inferno2.InfernoEffect(this.windowResizeEffect, [this.props.onDimensionChanged]), new _inferno2.InfernoEffect(this.visibilityEffect, [this.props.name, this.props.onVisibilityChange]), new _inferno2.InfernoEffect(this.checkDeprecation, [this.props.height, this.props.width]), new _inferno2.InfernoEffect(this.applyCssTextEffect, [this.props.cssText]), (0, _inferno2.createReRenderEffect)()];
  }
  updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5, _this$_effects$6, _this$_effects$7, _this$_effects$8, _this$_effects$9, _this$_effects$10, _this$_effects$11, _this$_effects$12, _this$_effects$13;
    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props._feedbackShowTimeout, this.props.activeStateEnabled, this.props.activeStateUnit, this.props.disabled, this.props.onActive]);
    (_this$_effects$2 = this._effects[2]) === null || _this$_effects$2 === void 0 || _this$_effects$2.update([this.props._feedbackHideTimeout, this.props.activeStateEnabled, this.props.activeStateUnit, this.props.onInactive, this.state.active]);
    (_this$_effects$3 = this._effects[3]) === null || _this$_effects$3 === void 0 || _this$_effects$3.update([this.props.disabled, this.props.name, this.props.onClick]);
    (_this$_effects$4 = this._effects[4]) === null || _this$_effects$4 === void 0 || _this$_effects$4.update([this.props.disabled, this.props.focusStateEnabled, this.props.name, this.props.onFocusIn]);
    (_this$_effects$5 = this._effects[5]) === null || _this$_effects$5 === void 0 || _this$_effects$5.update([this.props.focusStateEnabled, this.props.name, this.props.onFocusOut, this.state.focused]);
    (_this$_effects$6 = this._effects[6]) === null || _this$_effects$6 === void 0 || _this$_effects$6.update([this.props.activeStateUnit, this.props.disabled, this.props.hoverStateEnabled, this.props.onHoverStart, this.state.active]);
    (_this$_effects$7 = this._effects[7]) === null || _this$_effects$7 === void 0 || _this$_effects$7.update([this.props.activeStateUnit, this.props.hoverStateEnabled, this.props.onHoverEnd, this.state.hovered]);
    (_this$_effects$8 = this._effects[8]) === null || _this$_effects$8 === void 0 || _this$_effects$8.update([this.props.focusStateEnabled, this.props.onKeyDown]);
    (_this$_effects$9 = this._effects[9]) === null || _this$_effects$9 === void 0 || _this$_effects$9.update([this.props.name, this.props.onDimensionChanged]);
    (_this$_effects$10 = this._effects[10]) === null || _this$_effects$10 === void 0 || _this$_effects$10.update([this.props.onDimensionChanged]);
    (_this$_effects$11 = this._effects[11]) === null || _this$_effects$11 === void 0 || _this$_effects$11.update([this.props.name, this.props.onVisibilityChange]);
    (_this$_effects$12 = this._effects[12]) === null || _this$_effects$12 === void 0 || _this$_effects$12.update([this.props.height, this.props.width]);
    (_this$_effects$13 = this._effects[13]) === null || _this$_effects$13 === void 0 || _this$_effects$13.update([this.props.cssText]);
  }
  setRootElementRef() {
    var _this$widgetElementRe;
    const {
      rootElementRef,
      onRootElementRendered
    } = this.props;
    if (rootElementRef && this.widgetElementRef) {
      rootElementRef.current = this.widgetElementRef.current;
    }
    if (this !== null && this !== void 0 && (_this$widgetElementRe = this.widgetElementRef) !== null && _this$widgetElementRe !== void 0 && _this$widgetElementRe.current) {
      onRootElementRendered === null || onRootElementRendered === void 0 || onRootElementRendered(this.widgetElementRef.current);
    }
  }
  activeEffect() {
    const {
      activeStateEnabled,
      activeStateUnit,
      disabled,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _feedbackShowTimeout,
      onActive
    } = this.props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;
    if (activeStateEnabled) {
      if (!disabled) {
        var _this$widgetElementRe2;
        return (0, _subscribe_to_event.subscribeToDxActiveEvent)((_this$widgetElementRe2 = this.widgetElementRef) === null || _this$widgetElementRe2 === void 0 ? void 0 : _this$widgetElementRe2.current, event => {
          this.setState({
            active: true
          });
          onActive === null || onActive === void 0 || onActive(event);
        }, {
          timeout: _feedbackShowTimeout,
          selector
        }, namespace);
      }
    }
    return undefined;
  }
  inactiveEffect() {
    const {
      activeStateEnabled,
      activeStateUnit,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _feedbackHideTimeout,
      onInactive
    } = this.props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;
    if (activeStateEnabled) {
      var _this$widgetElementRe3;
      return (0, _subscribe_to_event.subscribeToDxInactiveEvent)((_this$widgetElementRe3 = this.widgetElementRef) === null || _this$widgetElementRe3 === void 0 ? void 0 : _this$widgetElementRe3.current, event => {
        if (this.state.active) {
          this.setState({
            active: false
          });
          onInactive === null || onInactive === void 0 || onInactive(event);
        }
      }, {
        timeout: _feedbackHideTimeout,
        selector
      }, namespace);
    }
    return undefined;
  }
  clickEffect() {
    const {
      name,
      onClick,
      disabled
    } = this.props;
    const namespace = name;
    if (onClick && !disabled) {
      var _this$widgetElementRe4;
      _short.dxClick.on((_this$widgetElementRe4 = this.widgetElementRef) === null || _this$widgetElementRe4 === void 0 ? void 0 : _this$widgetElementRe4.current, onClick, {
        namespace
      });
      return () => {
        var _this$widgetElementRe5;
        return _short.dxClick.off((_this$widgetElementRe5 = this.widgetElementRef) === null || _this$widgetElementRe5 === void 0 ? void 0 : _this$widgetElementRe5.current, {
          namespace
        });
      };
    }
    return undefined;
  }
  focusInEffect() {
    const {
      disabled,
      focusStateEnabled,
      name,
      onFocusIn
    } = this.props;
    const namespace = `${name}Focus`;
    if (focusStateEnabled) {
      if (!disabled) {
        var _this$widgetElementRe6;
        return (0, _subscribe_to_event.subscribeToDxFocusInEvent)((_this$widgetElementRe6 = this.widgetElementRef) === null || _this$widgetElementRe6 === void 0 ? void 0 : _this$widgetElementRe6.current, event => {
          if (!event.isDefaultPrevented()) {
            this.setState({
              focused: true
            });
            onFocusIn === null || onFocusIn === void 0 || onFocusIn(event);
          }
        }, null, namespace);
      }
    }
    return undefined;
  }
  focusOutEffect() {
    const {
      focusStateEnabled,
      name,
      onFocusOut
    } = this.props;
    const namespace = `${name}Focus`;
    if (focusStateEnabled) {
      var _this$widgetElementRe7;
      return (0, _subscribe_to_event.subscribeToDxFocusOutEvent)((_this$widgetElementRe7 = this.widgetElementRef) === null || _this$widgetElementRe7 === void 0 ? void 0 : _this$widgetElementRe7.current, event => {
        if (!event.isDefaultPrevented() && this.state.focused) {
          this.setState({
            focused: false
          });
          onFocusOut === null || onFocusOut === void 0 || onFocusOut(event);
        }
      }, null, namespace);
    }
    return undefined;
  }
  hoverStartEffect() {
    const {
      activeStateUnit,
      hoverStateEnabled,
      disabled,
      onHoverStart
    } = this.props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;
    if (hoverStateEnabled) {
      if (!disabled) {
        var _this$widgetElementRe8;
        return (0, _subscribe_to_event.subscribeToDxHoverStartEvent)((_this$widgetElementRe8 = this.widgetElementRef) === null || _this$widgetElementRe8 === void 0 ? void 0 : _this$widgetElementRe8.current, event => {
          if (!this.state.active) {
            this.setState({
              hovered: true
            });
          }
          onHoverStart === null || onHoverStart === void 0 || onHoverStart(event);
        }, {
          selector
        }, namespace);
      }
    }
    return undefined;
  }
  hoverEndEffect() {
    const {
      activeStateUnit,
      hoverStateEnabled,
      onHoverEnd
    } = this.props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;
    if (hoverStateEnabled) {
      var _this$widgetElementRe9;
      return (0, _subscribe_to_event.subscribeToDxHoverEndEvent)((_this$widgetElementRe9 = this.widgetElementRef) === null || _this$widgetElementRe9 === void 0 ? void 0 : _this$widgetElementRe9.current, event => {
        if (this.state.hovered) {
          this.setState({
            hovered: false
          });
          onHoverEnd === null || onHoverEnd === void 0 || onHoverEnd(event);
        }
      }, {
        selector
      }, namespace);
    }
    return undefined;
  }
  keyboardEffect() {
    const {
      onKeyDown,
      focusStateEnabled
    } = this.props;
    if (focusStateEnabled && onKeyDown) {
      var _this$widgetElementRe10, _this$widgetElementRe11;
      const id = _short.keyboard.on((_this$widgetElementRe10 = this.widgetElementRef) === null || _this$widgetElementRe10 === void 0 ? void 0 : _this$widgetElementRe10.current, (_this$widgetElementRe11 = this.widgetElementRef) === null || _this$widgetElementRe11 === void 0 ? void 0 : _this$widgetElementRe11.current, e => onKeyDown(e));
      return () => _short.keyboard.off(id);
    }
    return undefined;
  }
  resizeEffect() {
    const namespace = `${this.props.name}VisibilityChange`;
    const {
      onDimensionChanged
    } = this.props;
    if (onDimensionChanged) {
      var _this$widgetElementRe12;
      _short.resize.on((_this$widgetElementRe12 = this.widgetElementRef) === null || _this$widgetElementRe12 === void 0 ? void 0 : _this$widgetElementRe12.current, onDimensionChanged, {
        namespace
      });
      return () => {
        var _this$widgetElementRe13;
        return _short.resize.off((_this$widgetElementRe13 = this.widgetElementRef) === null || _this$widgetElementRe13 === void 0 ? void 0 : _this$widgetElementRe13.current, {
          namespace
        });
      };
    }
    return undefined;
  }
  windowResizeEffect() {
    const {
      onDimensionChanged
    } = this.props;
    if (onDimensionChanged) {
      _resize_callbacks.default.add(onDimensionChanged);
      return () => {
        _resize_callbacks.default.remove(onDimensionChanged);
      };
    }
    return undefined;
  }
  visibilityEffect() {
    const {
      name,
      onVisibilityChange
    } = this.props;
    const namespace = `${name}VisibilityChange`;
    if (onVisibilityChange) {
      var _this$widgetElementRe14;
      _short.visibility.on((_this$widgetElementRe14 = this.widgetElementRef) === null || _this$widgetElementRe14 === void 0 ? void 0 : _this$widgetElementRe14.current, () => onVisibilityChange(true), () => onVisibilityChange(false), {
        namespace
      });
      return () => {
        var _this$widgetElementRe15;
        return _short.visibility.off((_this$widgetElementRe15 = this.widgetElementRef) === null || _this$widgetElementRe15 === void 0 ? void 0 : _this$widgetElementRe15.current, {
          namespace
        });
      };
    }
    return undefined;
  }
  checkDeprecation() {
    const {
      width,
      height
    } = this.props;
    if ((0, _type.isFunction)(width)) {
      _errors.default.log('W0017', 'width');
    }
    if ((0, _type.isFunction)(height)) {
      _errors.default.log('W0017', 'height');
    }
  }
  applyCssTextEffect() {
    var _this$widgetElementRe16;
    const {
      cssText
    } = this.props;
    if (cssText !== undefined && cssText !== '' && (_this$widgetElementRe16 = this.widgetElementRef) !== null && _this$widgetElementRe16 !== void 0 && _this$widgetElementRe16.current) {
      this.widgetElementRef.current.style.cssText = cssText;
    }
  }
  getShouldRenderConfigProvider() {
    const {
      rtlEnabled
    } = this.props;
    return (0, _resolve_rtl.resolveRtlEnabledDefinition)(rtlEnabled, this.config);
  }
  getRtlEnabled() {
    const {
      rtlEnabled
    } = this.props;
    return (0, _resolve_rtl.resolveRtlEnabled)(rtlEnabled, this.config);
  }
  getAttributes() {
    const {
      aria,
      disabled,
      focusStateEnabled,
      visible
    } = this.props;
    const accessKey = focusStateEnabled && !disabled && this.props.accessKey;
    const props = _extends({}, (0, _extend.extend)({}, accessKey && {
      accessKey
    }), getAria(_extends({}, aria, {
      disabled,
      hidden: !visible
    })), (0, _extend.extend)({}, this.props));
    return this.getAttributesCore(props);
  }
  getAttributesCore(props) {
    const result = _objectWithoutPropertiesLoose(props, _excluded);
    return result;
  }
  getStyles() {
    const {
      width,
      height
    } = this.props;
    const style = this.props.style || {};
    const computedWidth = (0, _style.normalizeStyleProp)('width', (0, _type.isFunction)(width) ? width() : width);
    const computedHeight = (0, _style.normalizeStyleProp)('height', (0, _type.isFunction)(height) ? height() : height);
    return _extends({}, style, {
      height: computedHeight ?? style.height,
      width: computedWidth ?? style.width
    });
  }
  getCssClasses() {
    const {
      classes,
      addWidgetClass,
      className,
      disabled,
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      onVisibilityChange,
      visible
    } = this.props;
    const isFocusable = !!focusStateEnabled && !disabled;
    const isHoverable = !!hoverStateEnabled && !disabled;
    const canBeActive = !!activeStateEnabled && !disabled;
    const classesMap = {
      'dx-widget': !!addWidgetClass,
      [String(classes)]: !!classes,
      [String(className)]: !!className,
      'dx-state-disabled': !!disabled,
      'dx-state-invisible': !visible,
      'dx-state-focused': !!this.state.focused && isFocusable,
      'dx-state-active': !!this.state.active && canBeActive,
      'dx-state-hover': !!this.state.hovered && isHoverable && !this.state.active,
      'dx-rtl': !!this.props.rtlEnabled,
      'dx-visibility-change-handler': !!onVisibilityChange
    };
    return (0, _render_utils.combineClasses)(classesMap);
  }
  getTabIndex() {
    const {
      focusStateEnabled,
      disabled,
      tabIndex
    } = this.props;
    const isFocusable = focusStateEnabled && !disabled;
    return isFocusable ? tabIndex : undefined;
  }
  focus() {
    var _this$widgetElementRe17;
    _short.focus.trigger((_this$widgetElementRe17 = this.widgetElementRef) === null || _this$widgetElementRe17 === void 0 ? void 0 : _this$widgetElementRe17.current);
  }
  blur() {
    var _this$widgetElementRe18, _this$widgetElementRe19;
    const activeElement = _dom_adapter.default.getActiveElement((_this$widgetElementRe18 = this.widgetElementRef) === null || _this$widgetElementRe18 === void 0 ? void 0 : _this$widgetElementRe18.current);
    if (((_this$widgetElementRe19 = this.widgetElementRef) === null || _this$widgetElementRe19 === void 0 ? void 0 : _this$widgetElementRe19.current) === activeElement) {
      activeElement.blur();
    }
  }
  activate() {
    this.state.active = true;
  }
  deactivate() {
    this.state.active = false;
  }
  render() {
    const {
      hint,
      children
    } = this.props;
    const widget = (0, _inferno.normalizeProps)((0, _inferno.createVNode)(1, "div", this.getCssClasses(), children, 0, _extends({}, this.getAttributes(), {
      "tabIndex": this.getTabIndex(),
      "title": hint,
      "style": this.getStyles()
    }), null, this.widgetElementRef));
    return this.getShouldRenderConfigProvider() ? (0, _inferno.createComponentVNode)(2, _config_provider.ConfigProvider, {
      "rtlEnabled": this.getRtlEnabled(),
      children: widget
    }) : widget;
  }
}
exports.Widget = Widget;
Widget.defaultProps = WidgetDefaultProps;