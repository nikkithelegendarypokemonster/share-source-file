import _extends from "@babel/runtime/helpers/esm/extends";
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable class-methods-use-this */
import '../../../events/click';
import '../../../events/core/emitter.feedback';
import '../../../events/hover';
import domAdapter from '../../../core/dom_adapter';
import DOMComponent from '../../../core/dom_component';
import { getPublicElement } from '../../../core/element';
import $ from '../../../core/renderer';
import { extend } from '../../../core/utils/extend';
import { isDefined, isRenderer, isString } from '../../../core/utils/type';
import { createRef } from 'inferno';
import renderer from '../../../core/inferno_renderer';
import KeyboardProcessor from '../../../events/core/keyboard_processor';
import { buildTemplateArgs, TemplateWrapper } from './template_wrapper';
import { updatePropsImmutable } from './utils/index';
var setDefaultOptionValue = (options, defaultValueGetter) => name => {
  if (Object.prototype.hasOwnProperty.call(options, name) && options[name] === undefined) {
    // eslint-disable-next-line no-param-reassign
    options[name] = defaultValueGetter(name);
  }
};
export class ComponentWrapper extends DOMComponent {
  constructor(element, options) {
    super(element, options);
    this._shouldRaiseContentReady = false;
    this.validateKeyDownHandler();
  }
  get _propsInfo() {
    return {
      allowNull: [],
      twoWay: [],
      elements: [],
      templates: [],
      props: []
    };
  }
  validateKeyDownHandler() {
    var supportedKeyNames = this.getSupportedKeyNames();
    var hasComponentDefaultKeyHandlers = supportedKeyNames.length > 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var hasComponentKeyDownMethod = typeof this._viewComponent.prototype.keyDown === 'function';
    if (hasComponentDefaultKeyHandlers && !hasComponentKeyDownMethod) {
      throw Error('Component\'s declaration must have \'keyDown\' method.');
    }
  }
  get viewRef() {
    var _a;
    return (_a = this._viewRef) === null || _a === void 0 ? void 0 : _a.current;
  }
  _checkContentReadyOption(fullName) {
    var contentReadyOptions = this._getContentReadyOptions().reduce((options, name) => {
      // eslint-disable-next-line no-param-reassign
      options[name] = true;
      return options;
    }, {});
    this._checkContentReadyOption = optionName => !!contentReadyOptions[optionName];
    return this._checkContentReadyOption(fullName);
  }
  _getContentReadyOptions() {
    return ['rtlEnabled'];
  }
  _fireContentReady() {
    this._actionsMap.onContentReady({});
  }
  _getDefaultOptions() {
    var viewDefaultProps = this._getViewComponentDefaultProps();
    return extend(true,
    // @ts-expect-error badly typed base class
    super._getDefaultOptions(), viewDefaultProps, this._propsInfo.twoWay.reduce((options, _ref) => {
      var [name, defaultName, eventName] = _ref;
      return _extends(_extends({}, options), {
        [name]: viewDefaultProps[defaultName],
        [eventName]: value => this.option(name, value)
      });
    }, {}), this._propsInfo.templates.reduce((options, name) => _extends(_extends({}, options), {
      [name]: null
    }), {}));
  }
  _getUnwrappedOption() {
    var unwrappedProps = {};
    Object.keys(this.option()).forEach(key => {
      unwrappedProps[key] = this.option(key);
    });
    return unwrappedProps;
  }
  _initializeComponent() {
    var _a;
    // @ts-expect-error badly typed base class
    super._initializeComponent();
    (_a = this._templateManager) === null || _a === void 0 ? void 0 : _a.addDefaultTemplates(this.getDefaultTemplates());
    var optionProxy = this._getUnwrappedOption();
    this._props = this._optionsWithDefaultTemplates(optionProxy);
    this._propsInfo.templates.forEach(template => {
      this._componentTemplates[template] = this._createTemplateComponent(this._props[template]);
    });
    Object.keys(this._getActionConfigsFull()).forEach(name => this._addAction(name));
    this._viewRef = createRef();
    this.defaultKeyHandlers = this._createDefaultKeyHandlers();
  }
  _initMarkup() {
    var props = this.getProps();
    this._renderWrapper(props);
  }
  _renderWrapper(props) {
    var containerNode = this.$element()[0];
    if (!this._isNodeReplaced) {
      renderer.onPreRender();
    }
    renderer.render(this._viewComponent, props, containerNode, this._isNodeReplaced);
    if (!this._isNodeReplaced) {
      this._isNodeReplaced = true;
      renderer.onAfterRender();
      this._shouldRaiseContentReady = true;
    }
    if (this._shouldRaiseContentReady) {
      this._fireContentReady();
      this._shouldRaiseContentReady = false;
    }
  }
  _silent(name, value) {
    // @ts-expect-error badly typed base class
    this._options.silent(name, value);
  }
  _render() {} // NOTE: Inherited from DOM_Component
  _removeWidget() {
    renderer.remove(this.$element()[0]);
  }
  _dispose() {
    this._removeWidget();
    // @ts-expect-error badly typed base class
    super._dispose();
  }
  get elementAttr() {
    var element = this.$element()[0];
    if (!this._elementAttr) {
      var {
        attributes
      } = element;
      var attrs = Array.from(attributes).filter(attr => {
        var _a;
        return !this._propsInfo.templates.includes(attr.name) && ((_a = attributes[attr.name]) === null || _a === void 0 ? void 0 : _a.specified);
      }).reduce((result, _ref2) => {
        var {
          name,
          value
        } = _ref2;
        var updatedAttributes = result;
        var isDomAttr = (name in element);
        updatedAttributes[name] = value === '' && isDomAttr ? element[name] : value;
        return updatedAttributes;
      }, {});
      this._elementAttr = attrs;
      this._storedClasses = element.getAttribute('class') || '';
    }
    var elemStyle = element.style;
    var style = {};
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (var i = 0; i < elemStyle.length; i += 1) {
      style[elemStyle[i]] = elemStyle.getPropertyValue(elemStyle[i]);
    }
    this._elementAttr.style = style;
    this._elementAttr.class = this._storedClasses;
    return this._elementAttr;
  }
  _getAdditionalActionConfigs() {
    return {
      onContentReady: {
        excludeValidators: ['disabled', 'readOnly']
      }
    };
  }
  _getAdditionalProps() {
    return [];
  }
  _patchOptionValues(options) {
    var {
      allowNull,
      twoWay,
      elements,
      props
    } = this._propsInfo;
    var viewDefaultProps = this._getViewComponentDefaultProps();
    var defaultWidgetPropsKeys = Object.keys(viewDefaultProps);
    var defaultOptions = this._getDefaultOptions();
    var {
      ref,
      children,
      onKeyboardHandled
    } = options;
    var onKeyDown = onKeyboardHandled ? (_, event_options) => {
      onKeyboardHandled(event_options);
    } : undefined;
    var widgetProps = {
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
    twoWay.forEach(_ref3 => {
      var [name, defaultName] = _ref3;
      setDefaultOptionValue(widgetProps, () => defaultOptions[defaultName])(name);
    });
    elements.forEach(name => {
      if (name in widgetProps) {
        var value = widgetProps[name];
        if (isRenderer(value)) {
          widgetProps[name] = this._patchElementParam(value);
        }
      }
    });
    return widgetProps;
  }
  getSupportedKeyNames() {
    return [];
  }
  prepareStyleProp(props) {
    if (typeof props.style === 'string') {
      return _extends(_extends({}, props), {
        style: {},
        cssText: props.style
      });
    }
    return props;
  }
  getProps() {
    var _a, _b;
    var {
      elementAttr
    } = this.option();
    var options = this._patchOptionValues(_extends(_extends({}, this._props), {
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
  }
  _getActionConfigs() {
    return {};
  }
  _getActionConfigsFull() {
    return _extends(_extends({}, this._getActionConfigs()), this._getAdditionalActionConfigs());
  }
  getDefaultTemplates() {
    var defaultTemplates = Object.values(this._templatesInfo);
    var result = {};
    defaultTemplates.forEach(template => {
      result[template] = 'dx-renovation-template-mock';
    });
    return result;
  }
  get _templatesInfo() {
    return {};
  }
  _optionsWithDefaultTemplates(options) {
    var templateOptions = Object.entries(this._templatesInfo).reduce((result, _ref4) => {
      var [templateName, templateValue] = _ref4;
      var _a;
      return _extends(_extends({}, result), {
        [templateName]: (_a = options[templateName]) !== null && _a !== void 0 ? _a : templateValue
      });
    }, {});
    return _extends(_extends({}, options), templateOptions);
  }
  _init() {
    // @ts-expect-error badly typed base class
    super._init();
    this.customKeyHandlers = {};
    this._actionsMap = {};
    this._aria = {};
    this._componentTemplates = {};
  }
  _createDefaultKeyHandlers() {
    var result = {};
    var keys = this.getSupportedKeyNames();
    keys.forEach(key => {
      // eslint-disable-next-line
      result[key] = e => this.viewRef.keyDown(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      KeyboardProcessor.createKeyDownOptions(e));
    });
    return result;
  }
  _addAction(event, actionToAdd) {
    var action = actionToAdd;
    if (!action) {
      // @ts-expect-error badly typed base class
      var actionByOption = this._createActionByOption(event, this._getActionConfigsFull()[event]);
      action = actArgs => {
        Object.keys(actArgs).forEach(name => {
          if (isDefined(actArgs[name]) && domAdapter.isNode(actArgs[name])) {
            // eslint-disable-next-line no-param-reassign
            actArgs[name] = getPublicElement($(actArgs[name]));
          }
        });
        return actionByOption(actArgs);
      };
    }
    this._actionsMap[event] = action;
  }
  _optionChanged(option) {
    var {
      name,
      fullName,
      value,
      previousValue
    } = option;
    updatePropsImmutable(this._props, this.option(), name, fullName);
    if (this._propsInfo.templates.includes(name) && value !== previousValue) {
      this._componentTemplates[name] = this._createTemplateComponent(value);
    }
    if (name && this._getActionConfigsFull()[name]) {
      this._addAction(name);
    }
    this._shouldRaiseContentReady = this._shouldRaiseContentReady || this._checkContentReadyOption(fullName);
    // @ts-expect-error badly typed base class
    super._optionChanged(option);
    this._invalidate();
  }
  _extractDefaultSlot() {
    if (this.option('_hasAnonymousTemplateContent')) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return renderer.createElement(TemplateWrapper, {
        template: this._getTemplate(this._templateManager.anonymousTemplateName),
        transclude: true,
        renovated: true
      });
    }
    return null;
  }
  _createTemplateComponent(templateOption) {
    if (!templateOption) {
      return undefined;
    }
    var template = this._getTemplate(templateOption);
    if (isString(template) && template === 'dx-renovation-template-mock') {
      return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    var templateWrapper = model => renderer.createElement(TemplateWrapper, buildTemplateArgs(model, template));
    return templateWrapper;
  }
  _wrapKeyDownHandler(initialHandler) {
    return options => {
      var {
        originalEvent,
        keyName,
        which
      } = options;
      var keys = this.customKeyHandlers;
      var func = keys[keyName] || keys[which];
      // NOTE: registered handler has more priority
      if (func !== undefined) {
        var handler = func.bind(this);
        var result = handler(originalEvent, options);
        if (!result) {
          originalEvent.cancel = true;
          return originalEvent;
        }
      }
      // NOTE: make it possible to pass onKeyDown property
      return initialHandler === null || initialHandler === void 0 ? void 0 : initialHandler(originalEvent, options);
    };
  }
  _toPublicElement(element) {
    return getPublicElement($(element));
  }
  _patchElementParam(value) {
    try {
      var result = $(value);
      var element = result === null || result === void 0 ? void 0 : result.get(0);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return (element === null || element === void 0 ? void 0 : element.nodeType) ? element : value;
    } catch (error) {
      return value;
    }
  }
  // Public API
  repaint() {
    this._isNodeReplaced = false;
    this._shouldRaiseContentReady = true;
    this._removeWidget();
    this._refresh();
  }
  _supportedKeys() {
    return _extends(_extends({}, this.defaultKeyHandlers), this.customKeyHandlers);
  }
  registerKeyHandler(key, handler) {
    this.customKeyHandlers[key] = handler;
  }
  // NOTE: this method will be deprecated
  //       aria changes should be defined in declaration or passed through property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAria(name, value) {
    this._aria[name] = value;
    this._initMarkup();
  }
  _getViewComponentDefaultProps() {
    return this._viewComponent.defaultProps || {};
  }
}
ComponentWrapper.IS_RENOVATED_WIDGET = false;
ComponentWrapper.IS_RENOVATED_WIDGET = true;
/* eslint-enable @typescript-eslint/ban-types */
/* eslint-enable @typescript-eslint/no-unsafe-member-access */