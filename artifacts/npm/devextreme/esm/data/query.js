/**
* DevExtreme (esm/data/query.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { queryImpl } from './query_implementation';
var query = function query() {
  var impl = Array.isArray(arguments[0]) ? 'array' : 'remote';
  return queryImpl[impl].apply(this, arguments);
};
export default query;
