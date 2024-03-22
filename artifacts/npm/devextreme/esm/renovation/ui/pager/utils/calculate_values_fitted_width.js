/**
* DevExtreme (esm/renovation/ui/pager/utils/calculate_values_fitted_width.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export var oneDigitWidth = 10;
export function calculateValuesFittedWidth(minWidth, values) {
  return minWidth + oneDigitWidth * Math.max(...values).toString().length;
}
