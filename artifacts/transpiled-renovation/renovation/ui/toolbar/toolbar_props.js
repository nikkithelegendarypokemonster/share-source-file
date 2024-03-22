"use strict";

exports.ToolbarTextBoxProps = exports.ToolbarProps = exports.ToolbarItemType = exports.ToolbarItem = exports.ToolbarDropDownButtonProps = exports.ToolbarDropDownButtonItemPropsType = exports.ToolbarDropDownButtonItemProps = exports.ToolbarCheckBoxProps = exports.ToolbarButtonProps = exports.ToolbarButtonGroupProps = exports.CollectionWidgetItem = exports.BaseToolbarItemProps = void 0;
var _base_props = require("../common/base_props");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const CollectionWidgetItem = exports.CollectionWidgetItem = {};
const BaseToolbarItemProps = exports.BaseToolbarItemProps = {};
const ToolbarTextBoxProps = exports.ToolbarTextBoxProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(BaseToolbarItemProps), Object.getOwnPropertyDescriptors({
  value: ''
})));
const ToolbarCheckBoxProps = exports.ToolbarCheckBoxProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(BaseToolbarItemProps), Object.getOwnPropertyDescriptors({
  value: false
})));
const ToolbarButtonGroupProps = exports.ToolbarButtonGroupProps = BaseToolbarItemProps;
const ToolbarButtonProps = exports.ToolbarButtonProps = BaseToolbarItemProps;
const ToolbarDropDownButtonItemProps = exports.ToolbarDropDownButtonItemProps = CollectionWidgetItem;
const ToolbarDropDownButtonItemPropsType = exports.ToolbarDropDownButtonItemPropsType = {};
const ToolbarDropDownButtonProps = exports.ToolbarDropDownButtonProps = BaseToolbarItemProps;
const ToolbarItem = exports.ToolbarItem = CollectionWidgetItem;
const ToolbarItemType = exports.ToolbarItemType = {};
const ToolbarProps = exports.ToolbarProps = _base_props.BaseWidgetProps;