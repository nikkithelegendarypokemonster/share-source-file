/**
* DevExtreme (esm/renovation/ui/scroll_view/utils/normalize_offset_left.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export function normalizeOffsetLeft(scrollLeft, maxLeftOffset, rtlEnabled) {
  if (rtlEnabled) {
    return maxLeftOffset + scrollLeft;
  }
  return scrollLeft;
}