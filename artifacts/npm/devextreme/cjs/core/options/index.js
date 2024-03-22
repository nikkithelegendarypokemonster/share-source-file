/**
* DevExtreme (cjs/core/options/index.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.Options = void 0;
var _type = require("../utils/type");
var _common = require("../utils/common");
var _option_manager = require("./option_manager");
var _data = require("../utils/data");
var _utils = require("./utils");
var _extend = require("../utils/extend");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
let Options = exports.Options = /*#__PURE__*/function () {
  function Options(options, defaultOptions, optionsByReference, deprecatedOptions) {
    this._deprecatedCallback;
    this._startChangeCallback;
    this._endChangeCallback;
    this._default = defaultOptions;
    this._deprecated = deprecatedOptions;
    this._deprecatedNames = [];
    this._initDeprecatedNames();
    this._optionManager = new _option_manager.OptionManager(options, optionsByReference);
    this._optionManager.onRelevantNamesPrepared((options, name, value, silent) => this._setRelevantNames(options, name, value, silent));
    this._cachedOptions = {};
    this._rules = [];
  }
  var _proto = Options.prototype;
  _proto._initDeprecatedNames = function _initDeprecatedNames() {
    for (const optionName in this._deprecated) {
      this._deprecatedNames.push(optionName);
    }
  };
  _proto._getByRules = function _getByRules(rules) {
    rules = Array.isArray(rules) ? this._rules.concat(rules) : this._rules;
    return (0, _utils.convertRulesToOptions)(rules);
  };
  _proto._notifyDeprecated = function _notifyDeprecated(option) {
    const info = this._deprecated[option];
    if (info) {
      this._deprecatedCallback(option, info);
    }
  };
  _proto._setRelevantNames = function _setRelevantNames(options, name, value, silent) {
    if (name) {
      const normalizedName = this._normalizeName(name, silent);
      if (normalizedName && normalizedName !== name) {
        this._setField(options, normalizedName, value);
        this._clearField(options, name);
      }
    }
  };
  _proto._setField = function _setField(options, fullName, value) {
    let fieldName = '';
    let fieldObject = null;
    do {
      fieldName = fieldName ? ".".concat(fieldName) : '';
      fieldName = (0, _utils.getFieldName)(fullName) + fieldName;
      fullName = (0, _utils.getParentName)(fullName);
      fieldObject = fullName ? this._optionManager.get(options, fullName, false) : options;
    } while (!fieldObject);
    fieldObject[fieldName] = value;
  };
  _proto._clearField = function _clearField(options, name) {
    delete options[name];
    const previousFieldName = (0, _utils.getParentName)(name);
    const fieldObject = previousFieldName ? this._optionManager.get(options, previousFieldName, false) : options;
    if (fieldObject) {
      delete fieldObject[(0, _utils.getFieldName)(name)];
    }
  };
  _proto._normalizeName = function _normalizeName(name, silent) {
    if (this._deprecatedNames.length && name) {
      for (let i = 0; i < this._deprecatedNames.length; i++) {
        if (this._deprecatedNames[i] === name) {
          const deprecate = this._deprecated[name];
          if (deprecate) {
            !silent && this._notifyDeprecated(name);
            return deprecate.alias || name;
          }
        }
      }
    }
    return name;
  };
  _proto.addRules = function addRules(rules) {
    this._rules = rules.concat(this._rules);
  };
  _proto.applyRules = function applyRules(rules) {
    const options = this._getByRules(rules);
    this.silent(options);
  };
  _proto.dispose = function dispose() {
    this._deprecatedCallback = _common.noop;
    this._startChangeCallback = _common.noop;
    this._endChangeCallback = _common.noop;
    this._optionManager.dispose();
  };
  _proto.onChanging = function onChanging(callBack) {
    this._optionManager.onChanging(callBack);
  };
  _proto.onChanged = function onChanged(callBack) {
    this._optionManager.onChanged(callBack);
  };
  _proto.onDeprecated = function onDeprecated(callBack) {
    this._deprecatedCallback = callBack;
  };
  _proto.onStartChange = function onStartChange(callBack) {
    this._startChangeCallback = callBack;
  };
  _proto.onEndChange = function onEndChange(callBack) {
    this._endChangeCallback = callBack;
  };
  _proto.isInitial = function isInitial(name) {
    const value = this.silent(name);
    const initialValue = this.initial(name);
    const areFunctions = (0, _type.isFunction)(value) && (0, _type.isFunction)(initialValue);
    return areFunctions ? value.toString() === initialValue.toString() : (0, _common.equalByValue)(value, initialValue);
  };
  _proto.initial = function initial(name) {
    return (0, _utils.getNestedOptionValue)(this._initial, name);
  };
  _proto.option = function option(options, value) {
    const isGetter = arguments.length < 2 && (0, _type.type)(options) !== 'object';
    if (isGetter) {
      return this._optionManager.get(undefined, this._normalizeName(options));
    } else {
      this._startChangeCallback();
      try {
        this._optionManager.set(options, value);
      } finally {
        this._endChangeCallback();
      }
    }
  };
  _proto.silent = function silent(options, value) {
    const isGetter = arguments.length < 2 && (0, _type.type)(options) !== 'object';
    if (isGetter) {
      return this._optionManager.get(undefined, options, undefined, true);
    } else {
      this._optionManager.set(options, value, undefined, true);
    }
  };
  _proto.reset = function reset(name) {
    if (name) {
      const fullPath = (0, _data.getPathParts)(name);
      const value = fullPath.reduce((value, field) => value ? value[field] : this.initial(field), null);
      const defaultValue = (0, _type.isObject)(value) ? _extends({}, value) : value;
      this._optionManager.set(name, defaultValue, false);
    }
  };
  _proto.getAliasesByName = function getAliasesByName(name) {
    return Object.keys(this._deprecated).filter(aliasName => name === this._deprecated[aliasName].alias);
  };
  _proto.isDeprecated = function isDeprecated(name) {
    return Object.prototype.hasOwnProperty.call(this._deprecated, name);
  };
  _proto.cache = function cache(name, options) {
    const isGetter = arguments.length < 2;
    if (isGetter) {
      return this._cachedOptions[name];
    } else {
      this._cachedOptions[name] = (0, _extend.extend)(this._cachedOptions[name], options);
    }
  };
  _createClass(Options, [{
    key: "_initial",
    get: function () {
      if (!this._initialOptions) {
        const rulesOptions = this._getByRules(this.silent('defaultOptionsRules'));
        this._initialOptions = this._default;
        this._optionManager._setByReference(this._initialOptions, rulesOptions);
      }
      return this._initialOptions;
    },
    set: function (value) {
      this._initialOptions = value;
    }
  }]);
  return Options;
}();
