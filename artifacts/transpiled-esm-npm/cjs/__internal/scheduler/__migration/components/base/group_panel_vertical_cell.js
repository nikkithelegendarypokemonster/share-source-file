"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupPanelVerticalCell = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/component_wrappers/utils/index");
var _inferno2 = require("inferno");
var _group_panel_props = require("./group_panel_props");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let GroupPanelVerticalCell = exports.GroupPanelVerticalCell = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(GroupPanelVerticalCell, _BaseInfernoComponent);
  function GroupPanelVerticalCell() {
    return _BaseInfernoComponent.apply(this, arguments) || this;
  }
  var _proto = GroupPanelVerticalCell.prototype;
  _proto.render = function render() {
    const {
      className,
      data,
      id,
      color,
      text,
      index,
      cellTemplate
    } = this.props;
    const cellTemplateComponent = (0, _index.getTemplate)(cellTemplate);
    return (0, _inferno2.createVNode)(1, 'div', 'dx-scheduler-group-header '.concat(className), [!!cellTemplateComponent && cellTemplateComponent({
      data: {
        data,
        id,
        color,
        text
      },
      index
    }), !cellTemplateComponent && (0, _inferno2.createVNode)(1, 'div', 'dx-scheduler-group-header-content', text, 0)], 0);
  };
  return GroupPanelVerticalCell;
}(_inferno.BaseInfernoComponent);
GroupPanelVerticalCell.defaultProps = _group_panel_props.GroupPanelCellDefaultProps;