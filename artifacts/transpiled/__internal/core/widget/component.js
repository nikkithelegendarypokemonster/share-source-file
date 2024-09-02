"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = void 0;
var _action = _interopRequireDefault(require("../../../core/action"));
var _class = _interopRequireDefault(require("../../../core/class"));
var _config = _interopRequireDefault(require("../../../core/config"));
var _errors = _interopRequireDefault(require("../../../core/errors"));
var _events_strategy = require("../../../core/events_strategy");
var _index = require("../../../core/options/index");
var _utils = require("../../../core/options/utils");
var _postponed_operations = require("../../../core/postponed_operations");
var _callbacks = _interopRequireDefault(require("../../../core/utils/callbacks"));
var _common = require("../../../core/utils/common");
var _data = require("../../../core/utils/data");
var _extend = require("../../../core/utils/extend");
var _public_component = require("../../../core/utils/public_component");
var _type = require("../../../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const getEventName = actionName => actionName.charAt(2).toLowerCase() + actionName.substr(3);
const isInnerOption = optionName => optionName.indexOf('_', 0) === 0;
class Component extends _class.default.inherit({}) {
  _setDeprecatedOptions() {
    this._deprecatedOptions = {};
  }
  _getDeprecatedOptions() {
    return this._deprecatedOptions;
  }
  _getDefaultOptions() {
    return {
      onInitialized: null,
      onOptionChanged: null,
      onDisposing: null,
      defaultOptionsRules: null
    };
  }
  _defaultOptionsRules() {
    return [];
  }
  _setOptionsByDevice(rules) {
    this._options.applyRules(rules);
  }
  _convertRulesToOptions(rules) {
    return (0, _utils.convertRulesToOptions)(rules);
  }
  _isInitialOptionValue(name) {
    return this._options.isInitial(name);
  }
  _setOptionsByReference() {
    this._optionsByReference = {};
  }
  _getOptionsByReference() {
    return this._optionsByReference;
  }
  ctor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      _optionChangedCallbacks,
      _disposingCallbacks
    } = options;
    this.NAME = (0, _public_component.name)(this.constructor);
    this._eventsStrategy = _events_strategy.EventsStrategy.create(this, options.eventsStrategy);
    this._updateLockCount = 0;
    this._optionChangedCallbacks = _optionChangedCallbacks || (0, _callbacks.default)();
    this._disposingCallbacks = _disposingCallbacks || (0, _callbacks.default)();
    this.postponedOperations = new _postponed_operations.PostponedOperations();
    this._createOptions(options);
  }
  _createOptions(options) {
    this.beginUpdate();
    try {
      this._setOptionsByReference();
      this._setDeprecatedOptions();
      this._options = new _index.Options(this._getDefaultOptions(), this._getDefaultOptions(), this._getOptionsByReference(), this._getDeprecatedOptions());
      this._options.onChanging((name, previousValue, value) => this._initialized && this._optionChanging(name, previousValue, value));
      this._options.onDeprecated((option, info) => this._logDeprecatedOptionWarning(option, info));
      this._options.onChanged((name, value, previousValue) => this._notifyOptionChanged(name, value, previousValue));
      this._options.onStartChange(() => this.beginUpdate());
      this._options.onEndChange(() => this.endUpdate());
      this._options.addRules(this._defaultOptionsRules());
      if (options && options.onInitializing) {
        options.onInitializing.apply(this, [options]);
      }
      this._setOptionsByDevice(options.defaultOptionsRules);
      this._initOptions(options);
    } finally {
      this.endUpdate();
    }
  }
  _initOptions(options) {
    this.option(options);
  }
  _init() {
    this._createOptionChangedAction();
    this.on('disposing', args => {
      this._disposingCallbacks.fireWith(this, [args]);
    });
  }
  _logDeprecatedOptionWarning(option, info) {
    const message = info.message || `Use the '${info.alias}' option instead`;
    _errors.default.log('W0001', this.NAME, option, info.since, message);
  }
  _logDeprecatedComponentWarning(since, alias) {
    _errors.default.log('W0000', this.NAME, since, `Use the '${alias}' widget instead`);
  }
  _createOptionChangedAction() {
    this._optionChangedAction = this._createActionByOption('onOptionChanged', {
      excludeValidators: ['disabled', 'readOnly']
    });
  }
  _createDisposingAction() {
    this._disposingAction = this._createActionByOption('onDisposing', {
      excludeValidators: ['disabled', 'readOnly']
    });
  }
  _optionChanged(args) {
    switch (args.name) {
      case 'onDisposing':
      case 'onInitialized':
        break;
      case 'onOptionChanged':
        this._createOptionChangedAction();
        break;
      case 'defaultOptionsRules':
        break;
    }
  }
  _dispose() {
    this._optionChangedCallbacks.empty();
    this._createDisposingAction();
    this._disposingAction();
    this._eventsStrategy.dispose();
    this._options.dispose();
    this._disposed = true;
  }
  _lockUpdate() {
    this._updateLockCount++;
  }
  _unlockUpdate() {
    this._updateLockCount = Math.max(this._updateLockCount - 1, 0);
  }
  // TODO: remake as getter after ES6 refactor
  _isUpdateAllowed() {
    return this._updateLockCount === 0;
  }
  // TODO: remake as getter after ES6 refactor
  _isInitializingRequired() {
    return !this._initializing && !this._initialized;
  }
  isInitialized() {
    return this._initialized;
  }
  _commitUpdate() {
    this.postponedOperations.callPostponedOperations();
    this._isInitializingRequired() && this._initializeComponent();
  }
  _initializeComponent() {
    this._initializing = true;
    try {
      this._init();
    } finally {
      this._initializing = false;
      this._lockUpdate();
      this._createActionByOption('onInitialized', {
        excludeValidators: ['disabled', 'readOnly']
      })();
      this._unlockUpdate();
      this._initialized = true;
    }
  }
  instance() {
    return this;
  }
  beginUpdate() {
    this._lockUpdate();
  }
  endUpdate() {
    this._unlockUpdate();
    this._isUpdateAllowed() && this._commitUpdate();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _optionChanging() {}
  _notifyOptionChanged(option, value, previousValue) {
    if (this._initialized) {
      const optionNames = [option].concat(this._options.getAliasesByName(option));
      for (let i = 0; i < optionNames.length; i++) {
        const name = optionNames[i];
        const args = {
          name: (0, _data.getPathParts)(name)[0],
          fullName: name,
          value,
          previousValue
        };
        if (!isInnerOption(name)) {
          this._optionChangedCallbacks.fireWith(this, [(0, _extend.extend)(this._defaultActionArgs(), args)]);
          this._optionChangedAction((0, _extend.extend)({}, args));
        }
        if (!this._disposed && this._cancelOptionChange !== name) {
          this._optionChanged(args);
        }
      }
    }
  }
  initialOption(name) {
    return this._options.initial(name);
  }
  _defaultActionConfig() {
    return {
      context: this,
      component: this
    };
  }
  _defaultActionArgs() {
    return {
      component: this
    };
  }
  _createAction(actionSource, config) {
    let action;
    return e => {
      if (!(0, _type.isDefined)(e)) {
        e = {};
      }
      if (!(0, _type.isPlainObject)(e)) {
        e = {
          actionValue: e
        };
      }
      action = action || new _action.default(actionSource, (0, _extend.extend)({}, config, this._defaultActionConfig()));
      return action.execute.call(action, (0, _extend.extend)(e, this._defaultActionArgs()));
    };
  }
  _createActionByOption(optionName, config) {
    var _this = this;
    let action;
    let eventName;
    let actionFunc;
    config = (0, _extend.extend)({}, config);
    const result = function () {
      if (!eventName) {
        config = config || {};
        if (typeof optionName !== 'string') {
          throw _errors.default.Error('E0008');
        }
        if (optionName.startsWith('on')) {
          eventName = getEventName(optionName);
        }
        /// #DEBUG
        if (!optionName.startsWith('on')) {
          throw Error(`The '${optionName}' option name should start with 'on' prefix`);
        }
        /// #ENDDEBUG
        actionFunc = _this.option(optionName);
      }
      if (!action && !actionFunc && !config.beforeExecute && !config.afterExecute && !_this._eventsStrategy.hasEvent(eventName)) {
        return;
      }
      if (!action) {
        const {
          beforeExecute
        } = config;
        config.beforeExecute = function () {
          for (var _len2 = arguments.length, props = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            props[_key2] = arguments[_key2];
          }
          beforeExecute && beforeExecute.apply(_this, props);
          _this._eventsStrategy.fireEvent(eventName, props[0].args);
        };
        action = _this._createAction(actionFunc, config);
      }
      // @ts-expect-error
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if ((0, _config.default)().wrapActionsBeforeExecute) {
        const beforeActionExecute = _this.option('beforeActionExecute') || _common.noop;
        const wrappedAction = beforeActionExecute(_this, action, config) || action;
        return wrappedAction.apply(_this, args);
      }
      return action.apply(_this, args);
    };
    // @ts-expect-error
    if ((0, _config.default)().wrapActionsBeforeExecute) {
      return result;
    }
    const onActionCreated = this.option('onActionCreated') || _common.noop;
    return onActionCreated(this, result, config) || result;
  }
  on(eventName, eventHandler) {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  }
  off(eventName, eventHandler) {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }
  hasActionSubscription(actionName) {
    return !!this._options.silent(actionName) || this._eventsStrategy.hasEvent(getEventName(actionName));
  }
  isOptionDeprecated(name) {
    return this._options.isDeprecated(name);
  }
  _setOptionWithoutOptionChange(name, value) {
    this._cancelOptionChange = name;
    this.option(name, value);
    this._cancelOptionChange = false;
  }
  _getOptionValue(name, context) {
    const value = this.option(name);
    if ((0, _type.isFunction)(value)) {
      return value.bind(context)();
    }
    return value;
  }
  option() {
    return this._options.option(...arguments);
  }
  resetOption(name) {
    this.beginUpdate();
    this._options.reset(name);
    this.endUpdate();
  }
}
exports.Component = Component;