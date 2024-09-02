/**
* DevExtreme (esm/core/utils/position.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import config from '../config';
import { isWindow } from '../utils/type';
const getDefaultAlignment = isRtlEnabled => {
  const rtlEnabled = isRtlEnabled ?? config().rtlEnabled;
  return rtlEnabled ? 'right' : 'left';
};
const getBoundingRect = element => {
  if (isWindow(element)) {
    return {
      width: element.outerWidth,
      height: element.outerHeight
    };
  }
  return element.getBoundingClientRect();
};
export { getBoundingRect, getDefaultAlignment };
