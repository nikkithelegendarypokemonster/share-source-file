/**
* DevExtreme (esm/__internal/core/utils/date.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
// TODO Vinogradov: Refactor offsets: number[] -> ...offsets: number[]
var addOffsets = (date, offsets) => {
  var newDateMs = offsets.reduce((result, offset) => result + offset, date.getTime());
  return new Date(newDateMs);
};
export var dateUtilsTs = {
  addOffsets
};
