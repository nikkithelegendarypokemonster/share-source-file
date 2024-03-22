import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["className", "elementRef", "groupByDate", "groupOrientation", "groupPanelData", "groups", "height", "resourceCellTemplate"];
import { createComponentVNode, normalizeProps } from "inferno";
import { InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { GroupPanelBaseProps } from './group_panel_props';
import { GroupPanelVerticalLayout } from './vertical/layout';
import { GroupPanelHorizontalLayout } from './horizontal/layout';
import { VERTICAL_GROUP_ORIENTATION } from '../../../../../../__internal/scheduler/__migration/const';
import { isVerticalGroupingApplied } from '../../../../../../__internal/scheduler/__migration/utils/index';
export var viewFunction = _ref => {
  var {
    isVerticalLayout,
    props: {
      className,
      elementRef,
      groupPanelData,
      height,
      resourceCellTemplate
    },
    restAttributes
  } = _ref;
  return isVerticalLayout ? createComponentVNode(2, GroupPanelVerticalLayout, {
    "height": height,
    "resourceCellTemplate": resourceCellTemplate,
    "className": className,
    "groupPanelData": groupPanelData,
    "elementRef": elementRef,
    "styles": restAttributes.style
  }) : createComponentVNode(2, GroupPanelHorizontalLayout, {
    "height": height,
    "resourceCellTemplate": resourceCellTemplate,
    "className": className,
    "groupPanelData": groupPanelData,
    "elementRef": elementRef,
    "styles": restAttributes.style
  });
};
export var GroupPanelProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(GroupPanelBaseProps), Object.getOwnPropertyDescriptors({
  groups: Object.freeze([]),
  groupOrientation: VERTICAL_GROUP_ORIENTATION
})));
import { createReRenderEffect } from '@devextreme/runtime/inferno';
var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);
export class GroupPanel extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  createEffects() {
    return [createReRenderEffect()];
  }
  get isVerticalLayout() {
    var {
      groupOrientation,
      groups
    } = this.props;
    return isVerticalGroupingApplied(groups, groupOrientation);
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
      isVerticalLayout: this.isVerticalLayout,
      restAttributes: this.restAttributes
    });
  }
}
GroupPanel.defaultProps = GroupPanelProps;