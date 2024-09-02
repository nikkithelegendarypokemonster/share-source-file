/**
* DevExtreme (esm/viz/components/parse_utils.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { noop } from '../../core/utils/common';
import dateSerialization from '../../core/utils/date_serialization';
import { isDefined } from '../../core/utils/type';
const parsers = {
  string: function (val) {
    return isDefined(val) ? '' + val : val;
  },
  numeric: function (val) {
    if (!isDefined(val)) {
      return val;
    }
    let parsedVal = Number(val);
    if (isNaN(parsedVal)) {
      parsedVal = undefined;
    }
    return parsedVal;
  },
  datetime: function (val) {
    if (!isDefined(val)) {
      return val;
    }
    let parsedVal;
    const numVal = Number(val);
    if (!isNaN(numVal)) {
      parsedVal = new Date(numVal);
    } else {
      parsedVal = dateSerialization.deserializeDate(val);
    }
    if (isNaN(Number(parsedVal))) {
      parsedVal = undefined;
    }
    return parsedVal;
  }
};
export function correctValueType(type) {
  return type === 'numeric' || type === 'datetime' || type === 'string' ? type : '';
}
export const getParser = function (valueType) {
  return parsers[correctValueType(valueType)] || noop;
};
