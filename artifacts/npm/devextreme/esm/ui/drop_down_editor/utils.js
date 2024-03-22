/**
* DevExtreme (esm/ui/drop_down_editor/utils.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { getOuterWidth } from '../../core/utils/size';
import { hasWindow } from '../../core/utils/window';
var getElementWidth = function getElementWidth($element) {
  if (hasWindow()) {
    return getOuterWidth($element);
  }
};
var getSizeValue = function getSizeValue(size) {
  if (size === null) {
    size = undefined;
  }
  if (typeof size === 'function') {
    size = size();
  }
  return size;
};
export { getElementWidth, getSizeValue };
