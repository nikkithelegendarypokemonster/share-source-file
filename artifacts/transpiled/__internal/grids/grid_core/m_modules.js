"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ViewController = exports.View = exports.ModuleItem = exports.Controller = void 0;
exports.processModules = processModules;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _callbacks = _interopRequireDefault(require("../../../core/utils/callbacks"));
var _common = require("../../../core/utils/common");
var _iterator = require("../../../core/utils/iterator");
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.errors"));
var _update_views_borders = require("./views/utils/update_views_borders");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } // @ts-expect-error
const WIDGET_WITH_LEGACY_CONTAINER_NAME = 'dxDataGrid';
let ModuleItem = exports.ModuleItem = /*#__PURE__*/function () {
  function ModuleItem(component) {
    const that = this;
    that._updateLockCount = 0;
    that.component = component;
    that._actions = {};
    that._actionConfigs = {};
    (0, _iterator.each)(this.callbackNames() || [], function (index, name) {
      const flags = that.callbackFlags(name) || {};
      flags.unique = true;
      flags.syncStrategy = true;
      // @ts-expect-error
      that[this] = (0, _callbacks.default)(flags);
    });
  }
  var _proto = ModuleItem.prototype;
  _proto._endUpdateCore = function _endUpdateCore() {};
  _proto.init = function init() {};
  _proto.callbackNames = function callbackNames() {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.callbackFlags = function callbackFlags(name) {};
  _proto.publicMethods = function publicMethods() {
    return [];
  };
  _proto.beginUpdate = function beginUpdate() {
    this._updateLockCount++;
  };
  _proto.endUpdate = function endUpdate() {
    if (this._updateLockCount > 0) {
      this._updateLockCount--;
      if (!this._updateLockCount) {
        this._endUpdateCore();
      }
    }
  };
  _proto.option = function option(name) {
    const {
      component
    } = this;
    const optionCache = component._optionCache;
    if (arguments.length === 1 && optionCache) {
      if (!(name in optionCache)) {
        optionCache[name] = component.option(name);
      }
      return optionCache[name];
    }
    // @ts-expect-error
    return component.option.apply(component, arguments);
  };
  _proto._silentOption = function _silentOption(name, value) {
    const {
      component
    } = this;
    const optionCache = component._optionCache;
    if (optionCache) {
      optionCache[name] = value;
    }
    return component._setOptionWithoutOptionChange(name, value);
  };
  _proto.localize = function localize(name) {
    const optionCache = this.component._optionCache;
    if (optionCache) {
      if (!(name in optionCache)) {
        optionCache[name] = _message.default.format(name);
      }
      return optionCache[name];
    }
    return _message.default.format(name);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.on = function on(event, callback) {
    // @ts-expect-error
    return this.component.on.apply(this.component, arguments);
  };
  _proto.off = function off() {
    // @ts-expect-error
    return this.component.off.apply(this.component, arguments);
  };
  _proto.optionChanged = function optionChanged(args) {
    if (args.name in this._actions) {
      this.createAction(args.name, this._actionConfigs[args.name]);
      args.handled = true;
    }
  };
  _proto.getAction = function getAction(actionName) {
    return this._actions[actionName];
  };
  _proto.setAria = function setAria(name, value, $target) {
    const target = $target.get(0);
    const prefix = name !== 'role' && name !== 'id' ? 'aria-' : '';
    if (target.setAttribute) {
      target.setAttribute(prefix + name, value);
    } else {
      $target.attr(prefix + name, value);
    }
  };
  _proto._createComponent = function _createComponent($container, component, options) {
    return this.component._createComponent($container, component, options);
  };
  _proto.getController = function getController(name) {
    return this.component._controllers[name];
  };
  _proto.createAction = function createAction(actionName, config) {
    if ((0, _type.isFunction)(actionName)) {
      const action = this.component._createAction(actionName.bind(this), config);
      return function (e) {
        action({
          event: e
        });
      };
    }
    this._actions[actionName] = this.component._createActionByOption(actionName, config);
    this._actionConfigs[actionName] = config;
    return undefined;
  };
  _proto.executeAction = function executeAction(actionName, options) {
    const action = this._actions[actionName];
    return action && action(options);
  };
  _proto.dispose = function dispose() {
    const that = this;
    (0, _iterator.each)(that.callbackNames() || [], function () {
      that[this].empty();
    });
  };
  _proto.addWidgetPrefix = function addWidgetPrefix(className) {
    const componentName = this.component.NAME;
    return "dx-".concat(componentName.slice(2).toLowerCase()).concat(className ? "-".concat(className) : '');
  };
  _proto.getWidgetContainerClass = function getWidgetContainerClass() {
    const containerName = this.component.NAME === WIDGET_WITH_LEGACY_CONTAINER_NAME ? null : 'container';
    return this.addWidgetPrefix(containerName);
  };
  _proto.elementIsInsideGrid = function elementIsInsideGrid($element) {
    const $gridElement = $element.closest(".".concat(this.getWidgetContainerClass())).parent();
    return $gridElement.is(this.component.$element());
  };
  return ModuleItem;
}();
let Controller = exports.Controller = /*#__PURE__*/function (_ModuleItem) {
  _inheritsLoose(Controller, _ModuleItem);
  function Controller() {
    return _ModuleItem.apply(this, arguments) || this;
  }
  return Controller;
}(ModuleItem);
let ViewController = exports.ViewController = /*#__PURE__*/function (_Controller) {
  _inheritsLoose(ViewController, _Controller);
  function ViewController() {
    return _Controller.apply(this, arguments) || this;
  }
  var _proto2 = ViewController.prototype;
  _proto2.getView = function getView(name) {
    return this.component._views[name];
  };
  _proto2.getViews = function getViews() {
    return this.component._views;
  };
  return ViewController;
}(Controller);
let View = exports.View = /*#__PURE__*/function (_ModuleItem2) {
  _inheritsLoose(View, _ModuleItem2);
  function View(component) {
    var _this;
    _this = _ModuleItem2.call(this, component) || this;
    _this.renderCompleted = (0, _callbacks.default)();
    _this.resizeCompleted = (0, _callbacks.default)();
    return _this;
  }
  var _proto3 = View.prototype;
  _proto3._isReady = function _isReady() {
    return this.component.isReady();
  };
  _proto3._endUpdateCore = function _endUpdateCore() {
    _ModuleItem2.prototype._endUpdateCore.call(this);
    if (!this._isReady() && this._requireReady) {
      this._requireRender = false;
      this.component._requireResize = false;
    }
    if (this._requireRender) {
      this._requireRender = false;
      this.render(this._$parent);
    }
  };
  _proto3._invalidate = function _invalidate(requireResize, requireReady) {
    this._requireRender = true;
    this.component._requireResize = (0, _window.hasWindow)() && (this.component._requireResize || requireResize);
    this._requireReady = this._requireReady || requireReady;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto3._renderCore = function _renderCore(options) {};
  _proto3._resizeCore = function _resizeCore() {};
  _proto3._parentElement = function _parentElement() {
    return this._$parent;
  };
  _proto3.element = function element() {
    return this._$element;
  };
  _proto3.getElementHeight = function getElementHeight() {
    const $element = this.element();
    if (!$element) return 0;
    const marginTop = parseFloat($element.css('marginTop')) || 0;
    const marginBottom = parseFloat($element.css('marginBottom')) || 0;
    const {
      offsetHeight
    } = $element.get(0);
    return offsetHeight + marginTop + marginBottom;
  };
  _proto3.isVisible = function isVisible() {
    return true;
  };
  _proto3.getTemplate = function getTemplate(name) {
    return this.component._getTemplate(name);
  };
  _proto3.getView = function getView(name) {
    return this.component._views[name];
  };
  _proto3._getBorderedViews = function _getBorderedViews() {
    return {
      columnHeadersView: this.component._views.columnHeadersView,
      rowsView: this.component._views.rowsView,
      filterPanelView: this.component._views.filterPanelView,
      footerView: this.component._views.footerView
    };
  };
  _proto3.render = function render($parent, options) {
    let $element = this._$element;
    const isVisible = this.isVisible();
    if (!$element && !$parent) return;
    this._requireReady = false;
    if (!$element) {
      $element = this._$element = (0, _renderer.default)('<div>').appendTo($parent);
      this._$parent = $parent;
    }
    $element.toggleClass('dx-hidden', !isVisible);
    if (this.component._views) {
      (0, _update_views_borders.updateViewsBorders)(this.name, this._getBorderedViews());
    }
    if (isVisible) {
      this.component._optionCache = {};
      const deferred = this._renderCore(options);
      this.component._optionCache = undefined;
      if (deferred) {
        deferred.done(() => {
          this.renderCompleted.fire(options);
        });
      } else {
        this.renderCompleted.fire(options);
      }
    }
  };
  _proto3.resize = function resize() {
    this.isResizing = true;
    this._resizeCore();
    this.resizeCompleted.fire();
    this.isResizing = false;
  };
  _proto3.focus = function focus(preventScroll) {
    this.element().get(0).focus({
      preventScroll
    });
  };
  return View;
}(ModuleItem);
const MODULES_ORDER_MAX_INDEX = 1000000;
function getExtendedTypes(types) {
  let moduleExtenders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const extendTypes = {};
  Object.entries(moduleExtenders).forEach(_ref => {
    let [name, extender] = _ref;
    const currentType = types[name];
    if (currentType) {
      if ((0, _type.isFunction)(extender)) {
        extendTypes[name] = extender(currentType);
      } else {
        const classType = currentType;
        extendTypes[name] = classType.inherit(extender);
      }
    }
  });
  return extendTypes;
}
function registerPublicMethods(componentInstance, name, moduleItem) {
  const publicMethods = moduleItem.publicMethods();
  if (publicMethods) {
    (0, _iterator.each)(publicMethods, (_, methodName) => {
      if (moduleItem[methodName]) {
        if (!componentInstance[methodName]) {
          componentInstance[methodName] = function () {
            return moduleItem[methodName](...arguments);
          };
        } else {
          throw _ui.default.Error('E1005', methodName);
        }
      } else {
        throw _ui.default.Error('E1006', name, methodName);
      }
    });
  }
}
function processModules(componentInstance, componentClass) {
  const {
    modules
  } = componentClass;
  const {
    modulesOrder
  } = componentClass;
  function createModuleItems(moduleTypes) {
    const moduleItems = {};
    (0, _iterator.each)(moduleTypes, (name, moduleType) => {
      // eslint-disable-next-line new-cap
      const moduleItem = new moduleType(componentInstance);
      moduleItem.name = name;
      registerPublicMethods(componentInstance, name, moduleItem);
      moduleItems[name] = moduleItem;
    });
    return moduleItems;
  }
  if (modulesOrder) {
    modules.sort((module1, module2) => {
      let orderIndex1 = modulesOrder.indexOf(module1.name);
      let orderIndex2 = modulesOrder.indexOf(module2.name);
      if (orderIndex1 < 0) {
        orderIndex1 = MODULES_ORDER_MAX_INDEX;
      }
      if (orderIndex2 < 0) {
        orderIndex2 = MODULES_ORDER_MAX_INDEX;
      }
      return orderIndex1 - orderIndex2;
    });
  }
  const rootControllerTypes = {};
  const rootViewTypes = {};
  modules.forEach(_ref2 => {
    let {
      name: moduleName,
      controllers = {},
      views = {}
    } = _ref2;
    Object.entries(controllers).forEach(_ref3 => {
      let [name, type] = _ref3;
      if (rootControllerTypes[name]) {
        throw _ui.default.Error('E1001', moduleName, name);
      } else if (!((type === null || type === void 0 ? void 0 : type.prototype) instanceof Controller)) {
        throw _ui.default.Error('E1002', moduleName, name);
      }
      rootControllerTypes[name] = type;
    });
    Object.entries(views).forEach(_ref4 => {
      let [name, type] = _ref4;
      if (rootViewTypes[name]) {
        throw _ui.default.Error('E1003', moduleName, name);
      } else if (!((type === null || type === void 0 ? void 0 : type.prototype) instanceof View)) {
        throw _ui.default.Error('E1004', moduleName, name);
      }
      rootViewTypes[name] = type;
    });
  });
  const moduleExtenders = modules.filter(_ref5 => {
    let {
      extenders
    } = _ref5;
    return !!extenders;
  });
  const controllerTypes = moduleExtenders.reduce((types, _ref6) => {
    let {
      extenders
    } = _ref6;
    return _extends(_extends({}, types), getExtendedTypes(types, extenders === null || extenders === void 0 ? void 0 : extenders.controllers));
  }, rootControllerTypes);
  const viewTypes = moduleExtenders.reduce((types, _ref7) => {
    let {
      extenders
    } = _ref7;
    return _extends(_extends({}, types), getExtendedTypes(types, extenders === null || extenders === void 0 ? void 0 : extenders.views));
  }, rootViewTypes);
  // eslint-disable-next-line no-param-reassign
  componentInstance._controllers = createModuleItems(controllerTypes);
  // eslint-disable-next-line no-param-reassign
  componentInstance._views = createModuleItems(viewTypes);
}
const callModuleItemsMethod = function (that, methodName, args) {
  args = args || [];
  if (that._controllers) {
    (0, _iterator.each)(that._controllers, function () {
      this[methodName] && this[methodName].apply(this, args);
    });
  }
  if (that._views) {
    (0, _iterator.each)(that._views, function () {
      this[methodName] && this[methodName].apply(this, args);
    });
  }
};
var _default = exports.default = {
  modules: [],
  View,
  ViewController,
  Controller,
  registerModule(name, module) {
    const {
      modules
    } = this;
    for (let i = 0; i < modules.length; i++) {
      if (modules[i].name === name) {
        return;
      }
    }
    module.name = name;
    modules.push(module);
  },
  registerModulesOrder(moduleNames) {
    this.modulesOrder = moduleNames;
  },
  unregisterModule(name) {
    this.modules = (0, _common.grep)(this.modules, module => module.name !== name);
  },
  processModules,
  callModuleItemsMethod
};