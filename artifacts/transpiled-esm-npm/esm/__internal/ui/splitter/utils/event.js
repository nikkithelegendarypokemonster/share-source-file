import { camelize } from '../../../../core/utils/inflector';
export function getActionNameByEventName(eventName) {
  return "_".concat(camelize(eventName.replace('on', '')), "Action");
}
export var RESIZE_EVENT = {
  onResize: 'onResize',
  onResizeStart: 'onResizeStart',
  onResizeEnd: 'onResizeEnd'
};
export var COLLAPSE_EVENT = {
  onCollapsePrev: 'onCollapsePrev',
  onCollapseNext: 'onCollapseNext'
};
export var ITEM_COLLAPSED_EVENT = 'onItemCollapsed';
export var ITEM_EXPANDED_EVENT = 'onItemExpanded';