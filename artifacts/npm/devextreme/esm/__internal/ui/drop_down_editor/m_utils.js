/**
* DevExtreme (esm/__internal/ui/drop_down_editor/m_utils.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { getOuterWidth } from '../../../core/utils/size';
import { hasWindow } from '../../../core/utils/window';
const getElementWidth = function ($element) {
  if (hasWindow()) {
    return getOuterWidth($element);
  }
};
const getSizeValue = function (size) {
  if (size === null) {
    size = undefined;
  }
  if (typeof size === 'function') {
    size = size();
  }
  return size;
};
export { getElementWidth, getSizeValue };
