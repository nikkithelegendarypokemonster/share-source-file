import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["colSpan", "isHeaderCell", "width"];
import { createComponentVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { renderUtils } from '../../../../../__internal/scheduler/__migration/utils/index';
import { HeaderCell } from './header_cell';
import { OrdinaryCell } from './ordinary_cell';
export var viewFunction = _ref => {
  var {
    props: {
      colSpan,
      isHeaderCell
    },
    style
  } = _ref;
  var Cell = isHeaderCell ? HeaderCell : OrdinaryCell;
  return createComponentVNode(2, Cell, {
    "className": "dx-scheduler-virtual-cell",
    "styles": style,
    "colSpan": colSpan
  });
};
export var VirtualCellProps = {
  width: 0,
  isHeaderCell: false
};
export class VirtualCell extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  get style() {
    var {
      width
    } = this.props;
    var {
      style
    } = this.restAttributes;
    return renderUtils.addWidthToStyle(width, style);
  }
  get restAttributes() {
    var _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      style: this.style,
      restAttributes: this.restAttributes
    });
  }
}
VirtualCell.defaultProps = VirtualCellProps;