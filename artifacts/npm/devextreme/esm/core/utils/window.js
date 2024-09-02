/**
* DevExtreme (esm/core/utils/window.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* global window */

import domAdapter from '../dom_adapter';
let hasWindowValue = typeof window !== 'undefined';
const hasWindow = () => hasWindowValue;
let windowObject = hasWindow() ? window : undefined;
if (!windowObject) {
  windowObject = {};
  windowObject.window = windowObject;
}
const getWindow = () => windowObject;
const setWindow = (newWindowObject, hasWindow) => {
  if (hasWindow === undefined) {
    hasWindowValue = typeof window !== 'undefined' && window === newWindowObject;
  } else {
    hasWindowValue = hasWindow;
  }
  windowObject = newWindowObject;
};
const hasProperty = prop => hasWindow() && prop in windowObject;
const defaultScreenFactorFunc = width => {
  if (width < 768) {
    return 'xs';
  } else if (width < 992) {
    return 'sm';
  } else if (width < 1200) {
    return 'md';
  } else {
    return 'lg';
  }
};
const getCurrentScreenFactor = screenFactorCallback => {
  const screenFactorFunc = screenFactorCallback || defaultScreenFactorFunc;
  const windowWidth = domAdapter.getDocumentElement()['clientWidth'];
  return screenFactorFunc(windowWidth);
};
const getNavigator = () => hasWindow() ? windowObject.navigator : {
  userAgent: ''
};
export { hasWindow, getWindow, setWindow, hasProperty, defaultScreenFactorFunc, getCurrentScreenFactor, getNavigator };
