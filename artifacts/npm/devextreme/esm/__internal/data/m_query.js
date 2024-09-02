/**
* DevExtreme (esm/__internal/data/m_query.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { queryImpl } from '../../data/query_implementation';
const query = function () {
  const impl = Array.isArray(arguments[0]) ? 'array' : 'remote';
  // @ts-expect-error
  return queryImpl[impl].apply(this, arguments);
};
export default query;
