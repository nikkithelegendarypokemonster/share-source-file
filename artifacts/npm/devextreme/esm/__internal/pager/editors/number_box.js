/**
* DevExtreme (esm/__internal/pager/editors/number_box.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { createComponentVNode } from "inferno";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import LegacyNumberBox from '../../../ui/number_box';
import { DomComponentWrapper } from '../../core/r1/dom_component_wrapper';
import { EditorLabelDefaultProps } from './common/editor_label_props';
import { EditorDefaultProps } from './common/editor_props';
import { EditorStateDefaultProps } from './common/editor_state_props';
const DEFAULT_VALUE = 0;
export const NumberBoxDefaultProps = _extends({}, EditorDefaultProps, EditorStateDefaultProps, EditorLabelDefaultProps, {
  value: DEFAULT_VALUE,
  isReactComponentWrapper: true
});
export class NumberBox extends BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this.state = {};
    this.refs = null;
  }
  /* istanbul ignore next: WA for Angular */
  get componentProps() {
    return this.props;
  }
  render() {
    return createComponentVNode(2, DomComponentWrapper, {
      "componentType": LegacyNumberBox,
      "componentProps": this.componentProps,
      "templateNames": []
    });
  }
}
NumberBox.defaultProps = NumberBoxDefaultProps;
