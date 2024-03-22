/**
* DevExtreme (esm/renovation/ui/scroll_view/utils/get_relative_offset.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export function getRelativeOffset(targetElementClass, sourceElement) {
  var offset = {
    left: 0,
    top: 0
  };
  var element = sourceElement;
  while ((_element = element) !== null && _element !== void 0 && _element.offsetParent && !element.classList.contains(targetElementClass)) {
    var _element;
    var parentElement = element.offsetParent;
    var elementRect = element.getBoundingClientRect();
    var parentElementRect = parentElement.getBoundingClientRect();
    offset.left += elementRect.left - parentElementRect.left;
    offset.top += elementRect.top - parentElementRect.top;
    element = element.offsetParent;
  }
  return offset;
}
