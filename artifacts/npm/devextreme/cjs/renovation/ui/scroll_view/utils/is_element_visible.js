/**
* DevExtreme (cjs/renovation/ui/scroll_view/utils/is_element_visible.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.isElementVisible = isElementVisible;
function isElementVisible(element) {
  if (element) {
    var _element$getClientRec;
    return !!(element.offsetWidth || element.offsetHeight || (_element$getClientRec = element.getClientRects) !== null && _element$getClientRec !== void 0 && _element$getClientRec.call(element).length);
  }
  return false;
}
