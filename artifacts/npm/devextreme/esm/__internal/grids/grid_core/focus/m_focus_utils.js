/**
* DevExtreme (esm/__internal/grids/grid_core/focus/m_focus_utils.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import dateSerialization from '../../../../core/utils/date_serialization';
import { isDate, isFunction } from '../../../../core/utils/type';
// TODO Vinogradov: Move it to ts and cover with unit tests.
var getSortFilterValue = (sortInfo, rowData, _ref) => {
  var {
    isRemoteFiltering,
    dateSerializationFormat,
    getSelector
  } = _ref;
  var {
    selector
  } = sortInfo;
  var getter = isFunction(selector) ? selector : getSelector(selector);
  var rawValue = getter ? getter(rowData) : rowData[selector];
  var safeValue = isRemoteFiltering && isDate(rawValue) ? dateSerialization.serializeDate(rawValue, dateSerializationFormat) : rawValue;
  return {
    getter,
    rawValue,
    safeValue
  };
};
export var UiGridCoreFocusUtils = {
  getSortFilterValue
};
