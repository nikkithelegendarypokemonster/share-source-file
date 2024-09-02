/**
* DevExtreme (esm/__internal/pager/utils/calculate_values_fitted_width.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export const oneDigitWidth = 10;
export function calculateValuesFittedWidth(minWidth, values) {
  return minWidth + oneDigitWidth * Math.max(...values).toString().length;
}
