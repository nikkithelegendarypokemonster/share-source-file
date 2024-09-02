/**
* DevExtreme (esm/renovation/ui/scroll_view/utils/convert_location.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { isDefined, isPlainObject } from '../../../../core/utils/type';
import { ensureDefined } from '../../../../core/utils/common';
import { ScrollDirection } from './scroll_direction';
export function convertToLocation(location, direction) {
  if (isPlainObject(location)) {
    const left = ensureDefined(location.left, location.x);
    const top = ensureDefined(location.top, location.y);
    return {
      left: isDefined(left) ? left : undefined,
      top: isDefined(top) ? top : undefined
    };
  }
  const {
    isHorizontal,
    isVertical
  } = new ScrollDirection(direction);
  return {
    left: isHorizontal && isDefined(location) ? location : undefined,
    top: isVertical && isDefined(location) ? location : undefined
  };
}
