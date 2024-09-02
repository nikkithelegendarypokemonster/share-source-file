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