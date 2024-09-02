/**
* DevExtreme (esm/renovation/ui/scroll_view/utils/get_translate_values.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { getElementTransform } from './get_element_style';
export function getTranslateValues(el) {
  const matrix = getElementTransform(el);
  const regex = /matrix.*\((.+)\)/;
  const matrixValues = regex.exec(matrix);
  if (matrixValues) {
    const result = matrixValues[1].split(', ');
    return {
      left: Number(result[4]),
      top: Number(result[5])
    };
  }
  return {
    left: 0,
    top: 0
  };
}
