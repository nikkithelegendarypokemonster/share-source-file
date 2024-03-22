"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ComponentWrapper = void 0;
require("../../../events/click");
require("../../../events/core/emitter.feedback");
require("../../../events/hover");
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _dom_component = _interopRequireDefault(require("../../../core/dom_component"));
var _element = require("../../../core/element");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _extend = require("../../../core/utils/extend");
var _type = require("../../../core/utils/type");
var _inferno = require("inferno");
var _inferno_renderer = _interopRequireDefault(require("../../../core/inferno_renderer"));
var _keyboard_processor = _interopRequireDefault(require("../../../events/core/keyboard_processor"));
var _template_wrapper = require("./template_wrapper");
var _index = require("./utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable @typescript-eslint/ban-types */ /* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable class-methods-use-this */
const setDefaultOptionValue = (options, defaultValueGetter) => name => {
  if (Object.prototype.hasOwnProperty.call(options, name) && options[name] === undefined) {
    // eslint-disable-next-line no-param-reassign
    options[name] = defaultValueGetter(name);
  }
};
let ComponentWrapper = exports.ComponentWrapper = /*#__PURE__*/function (_DOMComponent) {
  _inheritsLoose(ComponentWrapper, _DOMComponent);
  function ComponentWrapper(element, options) {
    var _this;
    _this = _DOMComponent.call(this, element, options) || this;
    _this._shouldRaiseContentReady = false;
    _this.validateKeyDownHandler();
    return _this;
  }
  var _proto = ComponentWrapper.prototype;
  _proto.validateKeyDownHandler = function validateKeyDownHandler() {
    const supportedKeyNames = this.getSupportedKeyNames();
    const hasComponentDefaultKeyHandlers = supportedKeyNames.length > 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasComponentKeyDownMethod = typeof this._viewComponent.prototype.keyDown === 'function';
    if (hasComponentDefaultKeyHandlers && !hasComponentKeyDownMethod) {
      throw Error('Component\'s declaration must have \'keyDown\' method.');
    }
  };
  _proto._checkContentReadyOption = function _checkContentReadyOption(fullName) {
    const contentReadyOptions = this._getContentReadyOptions().reduce((options, name) => {
      // eslint-disable-next-line no-param-reassign
      options[name] = true;
      return options;
    }, {});
    this._checkContentReadyOption = optionName => !!contentReadyOptions[optionName];
    return this._checkContentReadyOption(fullName);
  };
  _proto._getContentReadyOptions = function _getContentReadyOptions() {
    return ['rtlEnabled'];
  };
  _proto._fireContentReady = function _fireContentReady() {
    this._actionsMap.onContentReady({});
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    const viewDefaultProps = this._getViewComponentDefaultProps();
    return (0, _extend.extend)(true, // @ts-expect-error badly typed base class
    _DOMComponent.prototype._getDefaultOptions.call(this), viewDefaultProps, this._propsInfo.twoWay.reduce((options, _ref) => {
      let [name, defaultName, eventName] = _ref;
      return _extends(_extends({}, options), {
        [name]: viewDefaultProps[defaultName],
        [eventName]: value => this.option(name, value)
      });
    }, {}), this._propsInfo.templates.reduce((options, name) => _extends(_extends({}, options), {
      [name]: null
    }), {}));
  };
  _proto._getUnwrappedOption = function _getUnwrappedOption() {
    const unwrappedProps = {};
    Object.keys(this.option()).forEach(key => {
      unwrappedProps[key] = this.option(key);
    });
    return unwrappedProps;
  };
  _proto._initializeComponent = function _initializeComponent() {
    var _a;
    // @ts-expect-error badly typed base class
    _DOMComponent.prototype._initializeComponent.call(this);
    (_a = this._templateManager) === null || _a === void 0 ? void 0 : _a.addDefaultTemplates(this.getDefaultTemplates());
    const optionProxy = this._getUnwrappedOption();
    this._props = this._optionsWithDefaultTemplates(optionProxy);
    this._propsInfo.templates.forEach(template => {
      this._componentTemplates[template] = this._createTemplateComponent(this._props[template]);
    });
    Object.keys(this._getActionConfigsFull()).forEach(name => this._addAction(name));
    this._viewRef = (0, _inferno.createRef)();
    this.defaultKeyHandlers = this._createDefaultKeyHandlers();
  };
  _proto._initMarkup = function _initMarkup() {
    const props = this.getProps();
    this._renderWrapper(props);
  };
  _proto._renderWrapper = function _renderWrapper(props) {
    const containerNode = this.$element()[0];
    if (!this._isNodeReplaced) {
      _inferno_renderer.default.onPreRender();
    }
    _inferno_renderer.default.render(this._viewComponent, props, containerNode, this._isNodeReplaced);
    if (!this._isNodeReplaced) {
      this._isNodeReplaced = true;
      _inferno_renderer.default.onAfterRender();
      this._shouldRaiseContentReady = true;
    }
    if (this._shouldRaiseContentReady) {
      this._fireContentReady();
      this._shouldRaiseContentReady = false;
    }
  };
  _proto._silent = function _silent(name, value) {
    // @ts-expect-error badly typed base class
    this._options.silent(name, value);
  };
  _proto._render = function _render() {} // NOTE: Inherited from DOM_Component
  ;
  _proto._removeWidget = function _removeWidget() {
    _inferno_renderer.default.remove(this.$element()[0]);
  };
  _proto._dispose = function _dispose() {
    this._removeWidget();
    // @ts-expect-error badly typed base class
    _DOMComponent.prototype._dispose.call(this);
  };
  _proto._getAdditionalActionConfigs = function _getAdditionalActionConfigs() {
    return {
      onContentReady: {
        excludeValidators: ['disabled', 'readOnly']
      }
    };
  };
  _proto._getAdditionalProps = function _getAdditionalProps() {
    return [];
  };
  _proto._patchOptionValues = function _patchOptionValues(options) {
    const {
      allowNull,
      twoWay,
      elements,
      props
    } = this._propsInfo;
    const viewDefaultProps = this._getViewComponentDefaultProps();
    const defaultWidgetPropsKeys = Object.keys(viewDefaultProps);
    const defaultOptions = this._getDefaultOptions();
    const {
      ref,
      children,
      onKeyboardHandled
    } = options;
    const onKeyDown = onKeyboardHandled ? (_, event_options) => {
      onKeyboardHandled(event_options);
    } : undefined;
    const widgetProps = {
      ref,
      children,
      onKeyDown
    };
    [...props, ...this._getAdditionalProps()].forEach(propName => {
      if (Object.prototype.hasOwnProperty.call(options, propName)) {
        widgetProps[propName] = options[propName];
      }
    });
    allowNull.forEach(setDefaultOptionValue(widgetProps, () => null));
    defaultWidgetPropsKeys.forEach(setDefaultOptionValue(widgetProps, name => defaultOptions[name]));
    twoWay.forEach(_ref2 => {
      let [name, defaultName] = _ref2;
      setDefaultOptionValue(widgetProps, () => defaultOptions[defaultName])(name);
    });
    elements.forEach(name => {
      if (name in widgetProps) {
        const value = widgetProps[name];
        if ((0, _type.isRenderer)(value)) {
          widgetProps[name] = this._patchElementParam(value);
        }
      }
    });
    return widgetProps;
  };
  _proto.getSupportedKeyNames = function getSupportedKeyNames() {
    return [];
  };
  _proto.prepareStyleProp = function prepareStyleProp(props) {
    if (typeof props.style === 'string') {
      return _extends(_extends({}, props), {
        style: {},
        cssText: props.style
      });
    }
    return props;
  };
  _proto.getProps = function getProps() {
    var _a, _b;
    const {
      elementAttr
    } = this.option();
    const options = this._patchOptionValues(_extends(_extends({}, this._props), {
      ref: this._viewRef,
      children: this._extractDefaultSlot(),
      aria: this._aria
    }));
    this._propsInfo.templates.forEach(template => {
      options[template] = this._componentTemplates[template];
    });
    return this.prepareStyleProp(_extends(_extends(_extends(_extends(_extends({}, options), this.elementAttr), elementAttr), {
      className: [...((_a = this.elementAttr.class) !== null && _a !== void 0 ? _a : '').split(' '), ...((_b = elementAttr === null || elementAttr === void 0 ? void 0 : elementAttr.class) !== null && _b !== void 0 ? _b : '').split(' ')].filter((c, i, a) => c && a.indexOf(c) === i).join(' ').trim(),
      class: ''
    }), this._actionsMap));
  };
  _proto._getActionConfigs = function _getActionConfigs() {
    return {};
  };
  _proto._getActionConfigsFull = function _getActionConfigsFull() {
    return _extends(_extends({}, this._getActionConfigs()), this._getAdditionalActionConfigs());
  };
  _proto.getDefaultTemplates = function getDefaultTemplates() {
    const defaultTemplates = Object.values(this._templatesInfo);
    const result = {};
    defaultTemplates.forEach(template => {
      result[template] = 'dx-renovation-template-mock';
    });
    return result;
  };
  _proto._optionsWithDefaultTemplates = function _optionsWithDefaultTemplates(options) {
    const templateOptions = Object.entries(this._templatesInfo).reduce((result, _ref3) => {
      let [templateName, templateValue] = _ref3;
      var _a;
      return _extends(_extends({}, result), {
        [templateName]: (_a = options[templateName]) !== null && _a !== void 0 ? _a : templateValue
      });
    }, {});
    return _extends(_extends({}, options), templateOptions);
  };
  _proto._init = function _init() {
    // @ts-expect-error badly typed base class
    _DOMComponent.prototype._init.call(this);
    this.customKeyHandlers = {};
    this._actionsMap = {};
    this._aria = {};
    this._componentTemplates = {};
  };
  _proto._createDefaultKeyHandlers = function _createDefaultKeyHandlers() {
    const result = {};
    const keys = this.getSupportedKeyNames();
    keys.forEach(key => {
      // eslint-disable-next-line
      result[key] = e => this.viewRef.keyDown(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _keyboard_processor.default.createKeyDownOptions(e));
    });
    return result;
  };
  _proto._addAction = function _addAction(event, actionToAdd) {
    let action = actionToAdd;
    if (!action) {
      // @ts-expect-error badly typed base class
      const actionByOption = this._createActionByOption(event, this._getActionConfigsFull()[event]);
      action = actArgs => {
        Object.keys(actArgs).forEach(name => {
          if ((0, _type.isDefined)(actArgs[name]) && _dom_adapter.default.isNode(actArgs[name])) {
            // eslint-disable-next-line no-param-reassign
            actArgs[name] = (0, _element.getPublicElement)((0, _renderer.default)(actArgs[name]));
          }
        });
        return actionByOption(actArgs);
      };
    }
    this._actionsMap[event] = action;
  };
  _proto._optionChanged = function _optionChanged(option) {
    const {
      name,
      fullName,
      value,
      previousValue
    } = option;
    (0, _index.updatePropsImmutable)(this._props, this.option(), name, fullName);
    if (this._propsInfo.templates.includes(name) && value !== previousValue) {
      this._componentTemplates[name] = this._createTemplateComponent(value);
    }
    if (name && this._getActionConfigsFull()[name]) {
      this._addAction(name);
    }
    this._shouldRaiseContentReady = this._shouldRaiseContentReady || this._checkContentReadyOption(fullName);
    // @ts-expect-error badly typed base class
    _DOMComponent.prototype._optionChanged.call(this, option);
    this._invalidate();
  };
  _proto._extractDefaultSlot = function _extractDefaultSlot() {
    if (this.option('_hasAnonymousTemplateContent')) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return _inferno_renderer.default.createElement(_template_wrapper.TemplateWrapper, {
        template: this._getTemplate(this._templateManager.anonymousTemplateName),
        transclude: true,
        renovated: true
      });
    }
    return null;
  };
  _proto._createTemplateComponent = function _createTemplateComponent(templateOption) {
    if (!templateOption) {
      return undefined;
    }
    const template = this._getTemplate(templateOption);
    if ((0, _type.isString)(template) && template === 'dx-renovation-template-mock') {
      return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const templateWrapper = model => _inferno_renderer.default.createElement(_template_wrapper.TemplateWrapper, (0, _template_wrapper.buildTemplateArgs)(model, template));
    return templateWrapper;
  };
  _proto._wrapKeyDownHandler = function _wrapKeyDownHandler(initialHandler) {
    return options => {
      const {
        originalEvent,
        keyName,
        which
      } = options;
      const keys = this.customKeyHandlers;
      const func = keys[keyName] || keys[which];
      // NOTE: registered handler has more priority
      if (func !== undefined) {
        const handler = func.bind(this);
        const result = handler(originalEvent, options);
        if (!result) {
          originalEvent.cancel = true;
          return originalEvent;
        }
      }
      // NOTE: make it possible to pass onKeyDown property
      return initialHandler === null || initialHandler === void 0 ? void 0 : initialHandler(originalEvent, options);
    };
  };
  _proto._toPublicElement = function _toPublicElement(element) {
    return (0, _element.getPublicElement)((0, _renderer.default)(element));
  };
  _proto._patchElementParam = function _patchElementParam(value) {
    try {
      const result = (0, _renderer.default)(value);
      const element = result === null || result === void 0 ? void 0 : result.get(0);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return (element === null || element === void 0 ? void 0 : element.nodeType) ? element : value;
    } catch (error) {
      return value;
    }
  }
  // Public API
  ;
  _proto.repaint = function repaint() {
    this._isNodeReplaced = false;
    this._shouldRaiseContentReady = true;
    this._removeWidget();
    this._refresh();
  };
  _proto._supportedKeys = function _supportedKeys() {
    return _extends(_extends({}, this.defaultKeyHandlers), this.customKeyHandlers);
  };
  _proto.registerKeyHandler = function registerKeyHandler(key, handler) {
    this.customKeyHandlers[key] = handler;
  }
  // NOTE: this method will be deprecated
  //       aria changes should be defined in declaration or passed through property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.setAria = function setAria(name, value) {
    this._aria[name] = value;
    this._initMarkup();
  };
  _proto._getViewComponentDefaultProps = function _getViewComponentDefaultProps() {
    return this._viewComponent.defaultProps || {};
  };
  _createClass(ComponentWrapper, [{
    key: "_propsInfo",
    get: function () {
      return {
        allowNull: [],
        twoWay: [],
        elements: [],
        templates: [],
        props: []
      };
    }
  }, {
    key: "viewRef",
    get: function () {
      var _a;
      return (_a = this._viewRef) === null || _a === void 0 ? void 0 : _a.current;
    }
  }, {
    key: "elementAttr",
    get: function () {
      const element = this.$element()[0];
      if (!this._elementAttr) {
        const {
          attributes
        } = element;
        const attrs = Array.from(attributes).filter(attr => {
          var _a;
          return !this._propsInfo.templates.includes(attr.name) && ((_a = attributes[attr.name]) === null || _a === void 0 ? void 0 : _a.specified);
        }).reduce((result, _ref4) => {
          let {
            name,
            value
          } = _ref4;
          const updatedAttributes = result;
          const isDomAttr = (name in element);
          updatedAttributes[name] = value === '' && isDomAttr ? element[name] : value;
          return updatedAttributes;
        }, {});
        this._elementAttr = attrs;
        this._storedClasses = element.getAttribute('class') || '';
      }
      const elemStyle = element.style;
      const style = {};
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < elemStyle.length; i += 1) {
        style[elemStyle[i]] = elemStyle.getPropertyValue(elemStyle[i]);
      }
      this._elementAttr.style = style;
      this._elementAttr.class = this._storedClasses;
      return this._elementAttr;
    }
  }, {
    key: "_templatesInfo",
    get: function () {
      return {};
    }
  }]);
  return ComponentWrapper;
}(_dom_component.default);
ComponentWrapper.IS_RENOVATED_WIDGET = false;
ComponentWrapper.IS_RENOVATED_WIDGET = true;
/* eslint-enable @typescript-eslint/ban-types */
/* eslint-enable @typescript-eslint/no-unsafe-member-access */