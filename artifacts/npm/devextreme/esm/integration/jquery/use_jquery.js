/**
* DevExtreme (esm/integration/jquery/use_jquery.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
// eslint-disable-next-line no-restricted-imports
import jQuery from 'jquery';
import config from '../../core/config';
const useJQuery = config().useJQuery;
if (jQuery && useJQuery !== false) {
  config({
    useJQuery: true
  });
}
export default function () {
  return jQuery && config().useJQuery;
}
