/**
* DevExtreme (esm/core/utils/storage.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { getWindow } from '../../core/utils/window';
const window = getWindow();
const getSessionStorage = function () {
  let sessionStorage;
  try {
    sessionStorage = window.sessionStorage;
  } catch (e) {}
  return sessionStorage;
};
export { getSessionStorage as sessionStorage };
