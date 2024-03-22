/**
* DevExtreme (cjs/__internal/grids/grid_core/focus/m_focus_utils.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UiGridCoreFocusUtils = void 0;
var _date_serialization = _interopRequireDefault(require("../../../../core/utils/date_serialization"));
var _type = require("../../../../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
  const getter = (0, _type.isFunction)(selector) ? selector : getSelector(selector);
  const rawValue = getter ? getter(rowData) : rowData[selector];
  const safeValue = isRemoteFiltering && (0, _type.isDate)(rawValue) ? _date_serialization.default.serializeDate(rawValue, dateSerializationFormat) : rawValue;
  return {
    getter,
    rawValue,
    safeValue
  };
};
const UiGridCoreFocusUtils = exports.UiGridCoreFocusUtils = {
  getSortFilterValue
};
