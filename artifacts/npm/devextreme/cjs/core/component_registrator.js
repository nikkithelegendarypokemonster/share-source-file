/**
* DevExtreme (cjs/core/component_registrator.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("./renderer"));
var _component_registrator_callbacks = _interopRequireDefault(require("./component_registrator_callbacks"));
var _errors = _interopRequireDefault(require("./errors"));
var _public_component = require("./utils/public_component");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const registerComponent = function (name, namespace, componentClass) {
  if (!componentClass) {
    componentClass = namespace;
  } else {
    namespace[name] = componentClass;
  }
  (0, _public_component.name)(componentClass, name);
  _component_registrator_callbacks.default.fire(name, componentClass);
};
const registerRendererComponent = function (name, componentClass) {
  _renderer.default.fn[name] = function (options) {
    const isMemberInvoke = typeof options === 'string';
    let result;
    if (isMemberInvoke) {
      const memberName = options;
      const memberArgs = [].slice.call(arguments).slice(1);
      this.each(function () {
        const instance = componentClass.getInstance(this);
        if (!instance) {
          throw _errors.default.Error('E0009', name);
        }
        const member = instance[memberName];
        const memberValue = member.apply(instance, memberArgs);
        if (result === undefined) {
          result = memberValue;
        }
      });
    } else {
      this.each(function () {
        const instance = componentClass.getInstance(this);
        if (instance) {
          instance.option(options);
        } else {
          new componentClass(this, options);
        }
      });
      result = this;
    }
    return result;
  };
};
_component_registrator_callbacks.default.add(registerRendererComponent);
var _default = exports.default = registerComponent;
module.exports = exports.default;
module.exports.default = exports.default;