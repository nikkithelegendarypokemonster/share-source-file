/**
* DevExtreme (renovation/ui/scroll_view/utils/get_scroll_left_max.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.getScrollLeftMax = getScrollLeftMax;
function getScrollLeftMax(element) {
  return element.scrollWidth - element.clientWidth;
}
