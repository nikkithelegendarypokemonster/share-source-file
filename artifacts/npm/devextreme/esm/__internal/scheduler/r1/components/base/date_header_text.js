/**
* DevExtreme (esm/__internal/scheduler/r1/components/base/date_header_text.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { createVNode, createFragment } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
const DateHeaderTextDefaultProps = {
  text: '',
  splitText: false
};
export class DateHeaderText extends BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this._textCache = null;
  }
  getTextParts() {
    if (this._textCache !== null) {
      return this._textCache;
    }
    const {
      text
    } = this.props;
    this._textCache = text ? text.split(' ') : [''];
    return this._textCache;
  }
  componentWillUpdate(nextProps) {
    if (this.props.text !== nextProps.text) {
      this._textCache = null;
    }
  }
  render() {
    const {
      splitText,
      text
    } = this.props;
    const textParts = this.getTextParts();
    return createFragment(splitText ? textParts.map(part => createVNode(1, "div", "dx-scheduler-header-panel-cell-date", createVNode(1, "span", null, part, 0), 2)) : text, 0);
  }
}
DateHeaderText.defaultProps = DateHeaderTextDefaultProps;
