export var PRECISION = 5;
export function compareNumbersWithPrecision(actual, expected) {
  var precision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PRECISION;
  var delta = parseFloat(actual.toFixed(precision)) - parseFloat(expected.toFixed(precision));
  if (delta === 0) {
    return 0;
  }
  return delta > 0 ? 1 : -1;
}