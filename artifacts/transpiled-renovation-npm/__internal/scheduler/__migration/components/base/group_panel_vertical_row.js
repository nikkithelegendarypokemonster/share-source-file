"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupPanelVerticalRow = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/component_wrappers/utils/index");
var _inferno2 = require("inferno");
var _group_panel_props = require("./group_panel_props");
var _group_panel_vertical_cell = require("./group_panel_vertical_cell");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let GroupPanelVerticalRow = exports.GroupPanelVerticalRow = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(GroupPanelVerticalRow, _BaseInfernoComponent);
  function GroupPanelVerticalRow() {
    return _BaseInfernoComponent.apply(this, arguments) || this;
  }
  var _proto = GroupPanelVerticalRow.prototype;
  _proto.render = function render() {
    const {
      className,
      groupItems,
      cellTemplate
    } = this.props;
    const cellTemplateComponent = (0, _index.getTemplate)(cellTemplate);
    return (0, _inferno2.createVNode)(1, 'div', 'dx-scheduler-group-row '.concat(className), groupItems.map((item, index) => {
      const {
        color,
        data,
        id,
        key,
        text
      } = item;
      return (0, _inferno2.createComponentVNode)(2, _group_panel_vertical_cell.GroupPanelVerticalCell, {
        text,
        id,
        data,
        index,
        color,
        cellTemplate: cellTemplateComponent
      }, key);
    }), 0);
  };
  return GroupPanelVerticalRow;
}(_inferno.BaseInfernoComponent);
GroupPanelVerticalRow.defaultProps = _group_panel_props.GroupPanelRowDefaultProps;