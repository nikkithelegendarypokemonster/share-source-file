/**
* DevExtreme (esm/renovation/ui/scheduler/workspaces/base/group_panel/vertical/layout.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["className", "elementRef", "groupByDate", "groupPanelData", "height", "resourceCellTemplate", "styles"];
import { createVNode, createComponentVNode, normalizeProps } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { normalizeStyles } from '@devextreme/runtime/inferno';
import { Row } from './row';
import { renderUtils } from '../../../../../../../__internal/scheduler/__migration/utils/index';
import { GroupPanelLayoutProps } from '../group_panel_layout_props';
export var viewFunction = _ref => {
  var {
    props: {
      className,
      elementRef,
      groupPanelData,
      resourceCellTemplate
    },
    style
  } = _ref;
  return createVNode(1, "div", className, createVNode(1, "div", "dx-scheduler-group-flex-container", groupPanelData.groupPanelItems.map(group => createComponentVNode(2, Row, {
    "groupItems": group,
    "cellTemplate": resourceCellTemplate
  }, group[0].key)), 0), 2, {
    "style": normalizeStyles(style)
  }, null, elementRef);
};
export var VerticalGroupPanelLayoutProps = GroupPanelLayoutProps;
var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);
export class GroupPanelVerticalLayout extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  get style() {
    var {
      height,
      styles
    } = this.props;
    return renderUtils.addHeightToStyle(height, styles);
  }
  get restAttributes() {
    var _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        resourceCellTemplate: getTemplate(props.resourceCellTemplate)
      }),
      style: this.style,
      restAttributes: this.restAttributes
    });
  }
}
GroupPanelVerticalLayout.defaultProps = VerticalGroupPanelLayoutProps;