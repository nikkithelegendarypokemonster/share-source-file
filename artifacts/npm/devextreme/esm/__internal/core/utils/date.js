/**
* DevExtreme (esm/__internal/core/utils/date.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
// TODO Vinogradov: Refactor offsets: number[] -> ...offsets: number[]
const addOffsets = (date, offsets) => {
  const newDateMs = offsets.reduce((result, offset) => result + offset, date.getTime());
  return new Date(newDateMs);
};
export const dateUtilsTs = {
  addOffsets
};
