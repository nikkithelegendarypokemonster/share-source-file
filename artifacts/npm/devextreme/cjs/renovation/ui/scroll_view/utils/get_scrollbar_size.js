/**
* DevExtreme (cjs/renovation/ui/scroll_view/utils/get_scrollbar_size.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.getScrollbarSize = getScrollbarSize;
function getScrollbarSize(element, direction) {
  if (direction === 'vertical') {
    return element.offsetWidth - element.clientWidth;
  }
  return element.offsetHeight - element.clientHeight;
}
