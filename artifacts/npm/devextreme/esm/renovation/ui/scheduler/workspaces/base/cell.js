/**
* DevExtreme (esm/renovation/ui/scheduler/workspaces/base/cell.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["allDay", "ariaLabel", "children", "className", "contentTemplateProps", "endDate", "groupIndex", "groups", "index", "isFirstGroupCell", "isLastGroupCell", "startDate", "text"];
import { createVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { renderUtils } from '../../../../../__internal/scheduler/__migration/utils/index';
export var viewFunction = viewModel => createVNode(1, "td", viewModel.classes, viewModel.props.children, 0, {
  "aria-label": viewModel.props.ariaLabel
});
export var CellBaseProps = {
  className: '',
  isFirstGroupCell: false,
  isLastGroupCell: false,
  startDate: Object.freeze(new Date()),
  endDate: Object.freeze(new Date()),
  allDay: false,
  text: '',
  index: 0,
  contentTemplateProps: Object.freeze({
    data: {},
    index: 0
  })
};
export class CellBase extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  get classes() {
    var {
      className,
      isFirstGroupCell,
      isLastGroupCell
    } = this.props;
    return renderUtils.getGroupCellClasses(isFirstGroupCell, isLastGroupCell, className);
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
      classes: this.classes,
      restAttributes: this.restAttributes
    });
  }
}
CellBase.defaultProps = CellBaseProps;
