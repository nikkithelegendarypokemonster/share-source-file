/**
* DevExtreme (cjs/__internal/ui/form/components/m_empty_item.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FIELD_EMPTY_ITEM_CLASS = void 0;
exports.renderEmptyItem = renderEmptyItem;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FIELD_EMPTY_ITEM_CLASS = exports.FIELD_EMPTY_ITEM_CLASS = 'dx-field-empty-item';
function renderEmptyItem(_ref) {
  let {
    $parent,
    rootElementCssClassList
  } = _ref;
  return (0, _renderer.default)('<div>').addClass(FIELD_EMPTY_ITEM_CLASS).html('&nbsp;').addClass(rootElementCssClassList.join(' ')).appendTo($parent);
}
