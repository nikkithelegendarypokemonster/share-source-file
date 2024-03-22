/**
* DevExtreme (esm/renovation/ui/form/wrapper/form.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["accessKey", "activeStateEnabled", "className", "colCount", "colCountByScreen", "disabled", "focusStateEnabled", "formData", "height", "hint", "hoverStateEnabled", "items", "labelLocation", "onClick", "onKeyDown", "rtlEnabled", "scrollingEnabled", "showColonAfterLabel", "showValidationSummary", "tabIndex", "visible", "width"];
import { createComponentVNode, normalizeProps } from "inferno";
import { InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import LegacyForm from '../../../../ui/form';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import { FormProps } from './form_props';
export var viewFunction = _ref => {
  var {
    componentProps,
    restAttributes
  } = _ref;
  return normalizeProps(createComponentVNode(2, DomComponentWrapper, _extends({
    "componentType": LegacyForm,
    "componentProps": componentProps,
    "templateNames": []
  }, restAttributes)));
};
import { createReRenderEffect } from '@devextreme/runtime/inferno';
export class Form extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.__getterCache = {};
  }
  createEffects() {
    return [createReRenderEffect()];
  }
  get componentProps() {
    if (this.__getterCache['componentProps'] !== undefined) {
      return this.__getterCache['componentProps'];
    }
    return this.__getterCache['componentProps'] = (() => {
      return this.props;
    })();
  }
  get restAttributes() {
    var _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();
    if (this.props !== nextProps) {
      this.__getterCache['componentProps'] = undefined;
    }
  }
  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      componentProps: this.componentProps,
      restAttributes: this.restAttributes
    });
  }
}
Form.defaultProps = FormProps;
