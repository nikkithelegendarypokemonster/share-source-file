import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import { createVNode } from 'inferno';
export var CellDefaultProps = {};
export class OrdinaryCell extends BaseInfernoComponent {
  render() {
    var {
      children,
      className,
      colSpan,
      styles
    } = this.props;
    return createVNode(1, 'td', className, children, 0, {
      style: normalizeStyles(styles),
      colSpan
    });
  }
}
OrdinaryCell.defaultProps = CellDefaultProps;