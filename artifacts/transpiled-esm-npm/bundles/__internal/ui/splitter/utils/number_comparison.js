"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PRECISION = void 0;
exports.compareNumbersWithPrecision = compareNumbersWithPrecision;
const PRECISION = exports.PRECISION = 5;
function compareNumbersWithPrecision(actual, expected) {
  let precision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PRECISION;
  const delta = parseFloat(actual.toFixed(precision)) - parseFloat(expected.toFixed(precision));
  if (delta === 0) {
    return 0;
  }
  return delta > 0 ? 1 : -1;
}