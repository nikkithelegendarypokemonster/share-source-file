/**
* DevExtreme (esm/__internal/scheduler/r1/components/base/header_cell.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { createVNode } from "inferno";
import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import { OrdinaryCellDefaultProps } from './ordinary_cell';
export class HeaderCell extends BaseInfernoComponent {
  render() {
    const {
      children,
      className,
      colSpan,
      styles
    } = this.props;
    return createVNode(1, "th", className, children, 0, {
      "style": normalizeStyles(styles),
      "colSpan": colSpan
    });
  }
}
HeaderCell.defaultProps = OrdinaryCellDefaultProps;
