/**
* DevExtreme (esm/core/utils/storage.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { getWindow } from '../../core/utils/window';
var window = getWindow();
var getSessionStorage = function getSessionStorage() {
  var sessionStorage;
  try {
    sessionStorage = window.sessionStorage;
  } catch (e) {}
  return sessionStorage;
};
export { getSessionStorage as sessionStorage };
