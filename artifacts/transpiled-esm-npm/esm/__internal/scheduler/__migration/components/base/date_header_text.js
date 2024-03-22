import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { createFragment, createVNode } from 'inferno';
var DateHeaderTextDefaultProps = {
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
    var {
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
    var {
      splitText,
      text
    } = this.props;
    var textParts = this.getTextParts();
    return createFragment(splitText ? textParts.map(part => createVNode(1, 'div', 'dx-scheduler-header-panel-cell-date', createVNode(1, 'span', null, part, 0), 2)) : text, 0);
  }
}
DateHeaderText.defaultProps = DateHeaderTextDefaultProps;