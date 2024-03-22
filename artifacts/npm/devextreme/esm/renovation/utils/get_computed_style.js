/**
* DevExtreme (esm/renovation/utils/get_computed_style.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { getWindow } from '../../core/utils/window';
export default function getElementComputedStyle(el) {
  var _window$getComputedSt;
  var window = getWindow();
  return el ? (_window$getComputedSt = window.getComputedStyle) === null || _window$getComputedSt === void 0 ? void 0 : _window$getComputedSt.call(window, el) : null;
}
