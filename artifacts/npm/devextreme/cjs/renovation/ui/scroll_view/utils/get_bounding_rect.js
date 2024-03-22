/**
* DevExtreme (cjs/renovation/ui/scroll_view/utils/get_bounding_rect.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.getBoundingRect = getBoundingRect;
function getBoundingRect(el) {
  return el !== null && el !== void 0 && el.getBoundingClientRect ? el.getBoundingClientRect() : {
    width: 0,
    height: 0,
    bottom: 0,
    top: 0,
    left: 0,
    right: 0
  };
}
