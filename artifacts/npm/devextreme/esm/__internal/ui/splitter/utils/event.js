/**
* DevExtreme (esm/__internal/ui/splitter/utils/event.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
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
