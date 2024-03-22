import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import { createVNode } from 'inferno';
import { CellDefaultProps } from './ordinary_cell';
export class HeaderCell extends BaseInfernoComponent {
  render() {
    var {
      children,
      className,
      colSpan,
      styles
    } = this.props;
    return createVNode(1, 'th', className, children, 0, {
      style: normalizeStyles(styles),
      colSpan
    });
  }
}
HeaderCell.defaultProps = CellDefaultProps;