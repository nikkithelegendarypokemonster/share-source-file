/**
* DevExtreme (esm/integration/jquery/ajax.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
// eslint-disable-next-line no-restricted-imports
import jQuery from 'jquery';
import ajax from '../../core/utils/ajax';
import useJQueryFn from './use_jquery';
var useJQuery = useJQueryFn();
if (useJQuery) {
  ajax.inject({
    sendRequest: function sendRequest(options) {
      if (!options.responseType && !options.upload) {
        return jQuery.ajax(options);
      }
      return this.callBase.apply(this, [options]);
    }
  });
}
