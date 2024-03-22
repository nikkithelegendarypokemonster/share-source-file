"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupPanelHorizontalCell = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/component_wrappers/utils/index");
var _inferno2 = require("inferno");
var _index2 = require("../../utils/index");
var _group_panel_props = require("./group_panel_props");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const GroupPanelHorizontalCellDefaultProps = _extends(_extends({}, _group_panel_props.GroupPanelCellDefaultProps), {
  isFirstGroupCell: false,
  isLastGroupCell: false,
  colSpan: 1
});
let GroupPanelHorizontalCell = exports.GroupPanelHorizontalCell = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(GroupPanelHorizontalCell, _BaseInfernoComponent);
  function GroupPanelHorizontalCell() {
    return _BaseInfernoComponent.apply(this, arguments) || this;
  }
  var _proto = GroupPanelHorizontalCell.prototype;
  _proto.render = function render() {
    const {
      cellTemplate,
      colSpan,
      color,
      data,
      id,
      index,
      text,
      className,
      isFirstGroupCell,
      isLastGroupCell
    } = this.props;
    const cellTemplateComponent = (0, _index.getTemplate)(cellTemplate);
    const classNames = _index2.renderUtils.combineClasses({
      'dx-scheduler-group-header': true,
      'dx-scheduler-first-group-cell': isFirstGroupCell,
      'dx-scheduler-last-group-cell': isLastGroupCell,
      [className]: !!className
    });
    return (0, _inferno2.createVNode)(1, 'th', classNames, (0, _inferno2.createVNode)(1, 'div', 'dx-scheduler-group-header-content', [!!cellTemplateComponent && cellTemplateComponent({
      data: {
        data,
        id,
        color,
        text
      },
      index
    }), !cellTemplateComponent && (0, _inferno2.createVNode)(1, 'div', null, text, 0)], 0), 2, {
      colSpan
    });
  };
  return GroupPanelHorizontalCell;
}(_inferno.BaseInfernoComponent);
GroupPanelHorizontalCell.defaultProps = GroupPanelHorizontalCellDefaultProps;