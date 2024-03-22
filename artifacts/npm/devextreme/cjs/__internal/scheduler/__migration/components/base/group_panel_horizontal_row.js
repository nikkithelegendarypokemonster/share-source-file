/**
* DevExtreme (cjs/__internal/scheduler/__migration/components/base/group_panel_horizontal_row.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupPanelHorizontalRow = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/component_wrappers/utils/index");
var _inferno2 = require("inferno");
var _group_panel_horizontal_cell = require("./group_panel_horizontal_cell");
var _group_panel_props = require("./group_panel_props");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let GroupPanelHorizontalRow = exports.GroupPanelHorizontalRow = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(GroupPanelHorizontalRow, _BaseInfernoComponent);
  function GroupPanelHorizontalRow() {
    return _BaseInfernoComponent.apply(this, arguments) || this;
  }
  var _proto = GroupPanelHorizontalRow.prototype;
  _proto.render = function render() {
    const {
      cellTemplate,
      className,
      groupItems
    } = this.props;
    const cellTemplateComponent = (0, _index.getTemplate)(cellTemplate);
    return (0, _inferno2.createVNode)(1, 'tr', 'dx-scheduler-group-row '.concat(className), groupItems.map((_ref2, index) => {
      const {
        colSpan,
        color,
        data,
        id,
        isFirstGroupCell,
        isLastGroupCell,
        key,
        text
      } = _ref2;
      return (0, _inferno2.createComponentVNode)(2, _group_panel_horizontal_cell.GroupPanelHorizontalCell, {
        text,
        id,
        data,
        index,
        color,
        colSpan,
        isFirstGroupCell: !!isFirstGroupCell,
        isLastGroupCell: !!isLastGroupCell,
        cellTemplate: cellTemplateComponent
      }, key);
    }), 0);
  };
  return GroupPanelHorizontalRow;
}(_inferno.BaseInfernoComponent);
GroupPanelHorizontalRow.defaultProps = _group_panel_props.GroupPanelRowDefaultProps;
