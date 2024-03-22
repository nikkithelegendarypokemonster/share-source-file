/**
* DevExtreme (renovation/ui/button.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.defaultOptionRules = exports.ButtonProps = exports.Button = void 0;
exports.defaultOptions = defaultOptions;
exports.viewFunction = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _utils = require("../../core/options/utils");
var _devices = _interopRequireDefault(require("../../core/devices"));
var _themes = require("../../ui/themes");
var _short = require("../../events/short");
var _combine_classes = require("../utils/combine_classes");
var _icon = require("../../core/utils/icon");
var _inflector = require("../../core/utils/inflector");
var _icon2 = require("./common/icon");
var _ink_ripple = require("./common/ink_ripple");
var _widget = require("./common/widget");
var _base_props = require("./common/base_props");
var _message = _interopRequireDefault(require("../../localization/message"));
const _excluded = ["accessKey", "activeStateEnabled", "children", "className", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "icon", "iconPosition", "iconTemplate", "onClick", "onKeyDown", "onSubmit", "pressed", "rtlEnabled", "stylingMode", "tabIndex", "template", "templateData", "text", "type", "useInkRipple", "useSubmitBehavior", "visible", "width"];
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
const stylingModes = ['outlined', 'text', 'contained'];
const getCssClasses = model => {
  const {
    icon,
    iconPosition,
    stylingMode,
    text,
    type
  } = model;
  const isValidStylingMode = stylingMode && stylingModes.includes(stylingMode);
  const classesMap = {
    'dx-button': true,
    ["dx-button-mode-".concat(isValidStylingMode ? stylingMode : 'contained')]: true,
    ["dx-button-".concat(type !== null && type !== void 0 ? type : 'normal')]: true,
    'dx-button-has-text': !!text,
    'dx-button-has-icon': !!icon,
    'dx-button-icon-right': iconPosition !== 'left'
  };
  return (0, _combine_classes.combineClasses)(classesMap);
};
const viewFunction = viewModel => {
  const {
    children,
    iconPosition,
    iconTemplate: IconTemplate,
    template: ButtonTemplate,
    text
  } = viewModel.props;
  const renderText = !viewModel.props.template && !children && text !== '';
  const isIconLeft = iconPosition === 'left';
  const iconComponent = !viewModel.props.template && !children && (viewModel.iconSource || viewModel.props.iconTemplate) && (0, _inferno.createComponentVNode)(2, _icon2.Icon, {
    "source": viewModel.iconSource,
    "position": iconPosition,
    "iconTemplate": IconTemplate
  });
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
    "accessKey": viewModel.props.accessKey,
    "activeStateEnabled": viewModel.props.activeStateEnabled,
    "aria": viewModel.aria,
    "className": viewModel.props.className,
    "classes": viewModel.cssClasses,
    "disabled": viewModel.props.disabled,
    "focusStateEnabled": viewModel.props.focusStateEnabled,
    "height": viewModel.props.height,
    "hint": viewModel.props.hint,
    "hoverStateEnabled": viewModel.props.hoverStateEnabled,
    "onActive": viewModel.onActive,
    "onClick": viewModel.onWidgetClick,
    "onInactive": viewModel.onInactive,
    "onKeyDown": viewModel.keyDown,
    "rtlEnabled": viewModel.props.rtlEnabled,
    "tabIndex": viewModel.props.tabIndex,
    "visible": viewModel.props.visible,
    "width": viewModel.props.width
  }, viewModel.restAttributes, {
    children: (0, _inferno.createVNode)(1, "div", "dx-button-content", [viewModel.props.template && ButtonTemplate({
      data: viewModel.buttonTemplateData
    }), !viewModel.props.template && children, isIconLeft && iconComponent, renderText && (0, _inferno.createVNode)(1, "span", "dx-button-text", text, 0), !isIconLeft && iconComponent, viewModel.props.useSubmitBehavior && (0, _inferno.createVNode)(64, "input", "dx-button-submit-input", null, 1, {
      "type": "submit",
      "tabIndex": -1
    }, null, viewModel.submitInputRef), viewModel.props.useInkRipple && (0, _inferno.createComponentVNode)(2, _ink_ripple.InkRipple, {
      "config": viewModel.inkRippleConfig
    }, null, viewModel.inkRippleRef)], 0, null, null, viewModel.contentRef)
  }), null, viewModel.widgetRef));
};
exports.viewFunction = viewFunction;
const ButtonProps = exports.ButtonProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_base_props.BaseWidgetProps), Object.getOwnPropertyDescriptors({
  activeStateEnabled: true,
  hoverStateEnabled: true,
  icon: '',
  iconPosition: 'left',
  stylingMode: 'contained',
  text: '',
  type: 'normal',
  useInkRipple: false,
  useSubmitBehavior: false,
  templateData: Object.freeze({})
})));
const defaultOptionRules = exports.defaultOptionRules = (0, _utils.createDefaultOptionRules)([{
  device: () => _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator(),
  options: {
    focusStateEnabled: true
  }
}, {
  device: () => (0, _themes.isMaterial)((0, _themes.current)()),
  options: {
    useInkRipple: true
  }
}]);
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let Button = exports.Button = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(Button, _InfernoWrapperCompon);
  function Button(props) {
    var _this;
    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.state = {};
    _this.contentRef = (0, _inferno.createRef)();
    _this.inkRippleRef = (0, _inferno.createRef)();
    _this.submitInputRef = (0, _inferno.createRef)();
    _this.widgetRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    _this.activate = _this.activate.bind(_assertThisInitialized(_this));
    _this.deactivate = _this.deactivate.bind(_assertThisInitialized(_this));
    _this.submitEffect = _this.submitEffect.bind(_assertThisInitialized(_this));
    _this.onActive = _this.onActive.bind(_assertThisInitialized(_this));
    _this.onInactive = _this.onInactive.bind(_assertThisInitialized(_this));
    _this.onWidgetClick = _this.onWidgetClick.bind(_assertThisInitialized(_this));
    _this.keyDown = _this.keyDown.bind(_assertThisInitialized(_this));
    _this.emitClickEvent = _this.emitClickEvent.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = Button.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.submitEffect, [this.props.onSubmit, this.props.useSubmitBehavior]), (0, _inferno2.createReRenderEffect)()];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.onSubmit, this.props.useSubmitBehavior]);
  };
  _proto.submitEffect = function submitEffect() {
    const namespace = 'UIFeedback';
    const {
      onSubmit,
      useSubmitBehavior
    } = this.props;
    if (useSubmitBehavior && onSubmit) {
      _short.click.on(this.submitInputRef.current, event => onSubmit({
        event,
        submitInput: this.submitInputRef.current
      }), {
        namespace
      });
      return () => _short.click.off(this.submitInputRef.current, {
        namespace
      });
    }
    return undefined;
  };
  _proto.onActive = function onActive(event) {
    const {
      useInkRipple
    } = this.props;
    useInkRipple && this.inkRippleRef.current.showWave({
      element: this.contentRef.current,
      event
    });
  };
  _proto.onInactive = function onInactive(event) {
    const {
      useInkRipple
    } = this.props;
    useInkRipple && this.inkRippleRef.current.hideWave({
      element: this.contentRef.current,
      event
    });
  };
  _proto.onWidgetClick = function onWidgetClick(event) {
    const {
      onClick,
      useSubmitBehavior
    } = this.props;
    onClick === null || onClick === void 0 ? void 0 : onClick({
      event
    });
    useSubmitBehavior && this.submitInputRef.current.click();
  };
  _proto.keyDown = function keyDown(e) {
    const {
      onKeyDown
    } = this.props;
    const {
      keyName,
      originalEvent,
      which
    } = e;
    const result = onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
    if (result !== null && result !== void 0 && result.cancel) {
      return result;
    }
    if (keyName === 'space' || which === 'space' || keyName === 'enter' || which === 'enter') {
      originalEvent.preventDefault();
      this.emitClickEvent();
    }
    return undefined;
  };
  _proto.emitClickEvent = function emitClickEvent() {
    this.contentRef.current.click();
  };
  _proto.focus = function focus() {
    this.widgetRef.current.focus();
  };
  _proto.activate = function activate() {
    this.widgetRef.current.activate();
  };
  _proto.deactivate = function deactivate() {
    this.widgetRef.current.deactivate();
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoWrapperCompon.prototype.componentWillUpdate.call(this);
    if (this.props['icon'] !== nextProps['icon'] || this.props['text'] !== nextProps['text']) {
      this.__getterCache['inkRippleConfig'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        template: getTemplate(props.template),
        iconTemplate: getTemplate(props.iconTemplate)
      }),
      contentRef: this.contentRef,
      submitInputRef: this.submitInputRef,
      inkRippleRef: this.inkRippleRef,
      widgetRef: this.widgetRef,
      onActive: this.onActive,
      onInactive: this.onInactive,
      onWidgetClick: this.onWidgetClick,
      keyDown: this.keyDown,
      emitClickEvent: this.emitClickEvent,
      aria: this.aria,
      cssClasses: this.cssClasses,
      iconSource: this.iconSource,
      inkRippleConfig: this.inkRippleConfig,
      buttonTemplateData: this.buttonTemplateData,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Button, [{
    key: "aria",
    get: function () {
      const {
        icon,
        text
      } = this.props;
      let label = text !== null && text !== void 0 ? text : '';
      if (!text && icon) {
        const iconSource = (0, _icon.getImageSourceType)(icon);
        switch (iconSource) {
          case 'image':
            {
              const notURLRegexp = /^(?!(?:https?:\/\/)|(?:ftp:\/\/)|(?:www\.))[^\s]+$/;
              const isPathToImage = !icon.includes('base64') && notURLRegexp.test(icon);
              label = isPathToImage ? icon.replace(/.+\/([^.]+)\..+$/, '$1') : '';
              break;
            }
          case 'dxIcon':
            label = _message.default.format((0, _inflector.camelize)(icon, true)) || icon;
            break;
          case 'fontIcon':
            label = icon;
            break;
          case 'svg':
            {
              var _titleRegexp$exec$, _titleRegexp$exec;
              const titleRegexp = /<title>(.*?)<\/title>/;
              const title = (_titleRegexp$exec$ = (_titleRegexp$exec = titleRegexp.exec(icon)) === null || _titleRegexp$exec === void 0 ? void 0 : _titleRegexp$exec[1]) !== null && _titleRegexp$exec$ !== void 0 ? _titleRegexp$exec$ : '';
              label = title;
              break;
            }
          default:
            break;
        }
      }
      return _extends({
        role: 'button'
      }, label ? {
        label
      } : {});
    }
  }, {
    key: "cssClasses",
    get: function () {
      return getCssClasses(this.props);
    }
  }, {
    key: "iconSource",
    get: function () {
      const {
        icon
      } = this.props;
      return icon !== null && icon !== void 0 ? icon : '';
    }
  }, {
    key: "inkRippleConfig",
    get: function () {
      if (this.__getterCache['inkRippleConfig'] !== undefined) {
        return this.__getterCache['inkRippleConfig'];
      }
      return this.__getterCache['inkRippleConfig'] = (() => {
        const {
          icon,
          text
        } = this.props;
        return !text && icon ? {
          isCentered: true,
          useHoldAnimation: false,
          waveSizeCoefficient: 1
        } : {};
      })();
    }
  }, {
    key: "buttonTemplateData",
    get: function () {
      const {
        icon,
        templateData,
        text
      } = this.props;
      return _extends({
        icon,
        text
      }, templateData);
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return Button;
}(_inferno2.InfernoWrapperComponent);
Button.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(ButtonProps), Object.getOwnPropertyDescriptors(_extends({}, (0, _utils.convertRulesToOptions)(defaultOptionRules)))));
const __defaultOptionRules = [];
function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  Button.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(Button.defaultProps), Object.getOwnPropertyDescriptors((0, _utils.convertRulesToOptions)(defaultOptionRules)), Object.getOwnPropertyDescriptors((0, _utils.convertRulesToOptions)(__defaultOptionRules))));
}
