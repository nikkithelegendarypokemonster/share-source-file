/**
* DevExtreme (esm/__internal/grids/grid_core/focus/m_focus_utils.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import dateSerialization from '../../../../core/utils/date_serialization';
import { isDate, isFunction } from '../../../../core/utils/type';
// TODO Vinogradov: Move it to ts and cover with unit tests.
const getSortFilterValue = (sortInfo, rowData, _ref) => {
  let {
    isRemoteFiltering,
    dateSerializationFormat,
    getSelector
  } = _ref;
  const {
    selector
  } = sortInfo;
  const getter = isFunction(selector) ? selector : getSelector(selector);
  const rawValue = getter ? getter(rowData) : rowData[selector];
  const safeValue = isRemoteFiltering && isDate(rawValue) ? dateSerialization.serializeDate(rawValue, dateSerializationFormat) : rawValue;
  return {
    getter,
    rawValue,
    safeValue
  };
};
export const UiGridCoreFocusUtils = {
  getSortFilterValue
};
