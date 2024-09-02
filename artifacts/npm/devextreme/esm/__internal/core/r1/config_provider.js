/**
* DevExtreme (esm/__internal/core/r1/config_provider.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { ConfigContext } from './config_context';
export const ConfigProviderDefaultProps = {};
export class ConfigProvider extends BaseInfernoComponent {
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
      [ConfigContext.id]: this.getConfig() || ConfigContext.defaultValue
    });
  }
  render() {
    return this.props.children;
  }
}
ConfigProvider.defaultProps = ConfigProviderDefaultProps;
