/**
* DevExtreme (esm/__internal/scheduler/__migration/components/base/ordinary_cell.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
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
