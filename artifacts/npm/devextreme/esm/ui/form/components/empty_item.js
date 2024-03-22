/**
* DevExtreme (esm/ui/form/components/empty_item.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import $ from '../../../core/renderer';
export var FIELD_EMPTY_ITEM_CLASS = 'dx-field-empty-item';
export function renderEmptyItem(_ref) {
  var {
    $parent,
    rootElementCssClassList
  } = _ref;
  return $('<div>').addClass(FIELD_EMPTY_ITEM_CLASS).html('&nbsp;').addClass(rootElementCssClassList.join(' ')).appendTo($parent);
}
