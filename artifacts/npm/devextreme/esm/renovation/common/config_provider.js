/**
* DevExtreme (esm/renovation/common/config_provider.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["children", "rtlEnabled"];
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { ConfigContext } from './config_context';
export var viewFunction = viewModel => viewModel.props.children;
export var ConfigProviderProps = {};
export class ConfigProvider extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.__getterCache = {};
  }
  getChildContext() {
    return _extends({}, this.context, {
      [ConfigContext.id]: this.config || ConfigContext.defaultValue
    });
  }
  get config() {
    if (this.__getterCache['config'] !== undefined) {
      return this.__getterCache['config'];
    }
    return this.__getterCache['config'] = (() => {
      return {
        rtlEnabled: this.props.rtlEnabled
      };
    })();
  }
  get restAttributes() {
    var _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props['rtlEnabled'] !== nextProps['rtlEnabled']) {
      this.__getterCache['config'] = undefined;
    }
  }
  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      config: this.config,
      restAttributes: this.restAttributes
    });
  }
}
ConfigProvider.defaultProps = ConfigProviderProps;
