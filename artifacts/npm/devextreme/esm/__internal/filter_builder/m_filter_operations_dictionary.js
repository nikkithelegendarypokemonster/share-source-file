/**
* DevExtreme (esm/__internal/filter_builder/m_filter_operations_dictionary.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable spellcheck/spell-checker */
var OPERATION_ICONS = {
  '=': 'equal',
  '<>': 'notequal',
  '<': 'less',
  '<=': 'lessorequal',
  '>': 'greater',
  '>=': 'greaterorequal',
  notcontains: 'doesnotcontain',
  contains: 'contains',
  startswith: 'startswith',
  endswith: 'endswith',
  isblank: 'isblank',
  isnotblank: 'isnotblank'
};
var OPERATION_NAME = {
  '=': 'equal',
  '<>': 'notEqual',
  '<': 'lessThan',
  '<=': 'lessThanOrEqual',
  '>': 'greaterThan',
  '>=': 'greaterThanOrEqual',
  startswith: 'startsWith',
  contains: 'contains',
  notcontains: 'notContains',
  endswith: 'endsWith',
  isblank: 'isBlank',
  isnotblank: 'isNotBlank',
  between: 'between'
};
export default {
  getIconByFilterOperation(filterOperation) {
    return OPERATION_ICONS[filterOperation];
  },
  getNameByFilterOperation(filterOperation) {
    return OPERATION_NAME[filterOperation];
  }
};
