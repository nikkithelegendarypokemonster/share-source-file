/**
* DevExtreme (bundles/__internal/core/utils/date.js)
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
exports.dateUtilsTs = void 0;
// TODO Vinogradov: Refactor offsets: number[] -> ...offsets: number[]
const addOffsets = (date, offsets) => {
  const newDateMs = offsets.reduce((result, offset) => result + offset, date.getTime());
  return new Date(newDateMs);
};
const dateUtilsTs = exports.dateUtilsTs = {
  addOffsets
};
