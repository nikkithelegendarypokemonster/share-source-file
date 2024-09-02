/**
* DevExtreme (renovation/ui/scroll_view/utils/clamp_into_range.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.clampIntoRange = clampIntoRange;
function clampIntoRange(value, max, min) {
  return Math.max(Math.min(value, max), min);
}
