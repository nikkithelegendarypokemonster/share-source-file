import { BaseWidgetProps } from '../common/base_props';
export const CollectionWidgetItem = {};
export const BaseToolbarItemProps = {};
export const ToolbarTextBoxProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(BaseToolbarItemProps), Object.getOwnPropertyDescriptors({
  value: ''
})));
export const ToolbarCheckBoxProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(BaseToolbarItemProps), Object.getOwnPropertyDescriptors({
  value: false
})));
export const ToolbarButtonGroupProps = BaseToolbarItemProps;
export const ToolbarButtonProps = BaseToolbarItemProps;
export const ToolbarDropDownButtonItemProps = CollectionWidgetItem;
export const ToolbarDropDownButtonItemPropsType = {};
export const ToolbarDropDownButtonProps = BaseToolbarItemProps;
export const ToolbarItem = CollectionWidgetItem;
export const ToolbarItemType = {};
export const ToolbarProps = BaseWidgetProps;