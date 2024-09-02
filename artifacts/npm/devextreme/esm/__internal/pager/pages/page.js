/**
* DevExtreme (esm/__internal/pager/pages/page.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { createComponentVNode } from "inferno";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { format } from '../../../core/utils/string';
import messageLocalization from '../../../localization/message';
import { combineClasses } from '../../core/r1/utils/render_utils';
import { PAGER_PAGE_CLASS, PAGER_SELECTION_CLASS } from '../common/consts';
import { LightButton } from '../common/light_button';
/* istanbul ignore next: class has only props default */
export const PageDefaultProps = {
  index: 0,
  selected: false,
  className: PAGER_PAGE_CLASS
};
export class Page extends BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this.state = {};
    this.refs = null;
  }
  getLabel() {
    return format(messageLocalization.getFormatter('dxPager-page'), this.getValue());
  }
  getValue() {
    return this.props.index + 1;
  }
  getClassName() {
    return combineClasses({
      [`${this.props.className}`]: !!this.props.className,
      [PAGER_SELECTION_CLASS]: !!this.props.selected
    });
  }
  render() {
    return createComponentVNode(2, LightButton, {
      "className": this.getClassName(),
      "label": this.getLabel(),
      "onClick": this.props.onClick,
      "selected": this.props.selected,
      children: this.getValue()
    });
  }
}
Page.defaultProps = PageDefaultProps;
