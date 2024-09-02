/**
* DevExtreme (cjs/__internal/core/r1/config_provider.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigProviderDefaultProps = exports.ConfigProvider = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _config_context = require("./config_context");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable @typescript-eslint/no-explicit-any */
const ConfigProviderDefaultProps = exports.ConfigProviderDefaultProps = {};
class ConfigProvider extends _inferno.BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this.state = {};
  }
  getConfig() {
    return {
      rtlEnabled: this.props.rtlEnabled
    };
  }
  getChildContext() {
    return _extends({}, this.context, {
      [_config_context.ConfigContext.id]: this.getConfig() || _config_context.ConfigContext.defaultValue
    });
  }
  render() {
    return this.props.children;
  }
}
exports.ConfigProvider = ConfigProvider;
ConfigProvider.defaultProps = ConfigProviderDefaultProps;
