/**
* DevExtreme (cjs/__internal/core/component_wrappers/utils/shallow_equals.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shallowEquals = void 0;
const shallowEquals = (firstObject, secondObject) => {
  if (Object.keys(firstObject).length !== Object.keys(secondObject).length) {
    return false;
  }
  return Object.keys(firstObject).every(key => firstObject[key] === secondObject[key]);
};
exports.shallowEquals = shallowEquals;