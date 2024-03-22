/**
* DevExtreme (esm/core/utils/error.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable import/no-commonjs */
import { extend } from './extend';
import { logger } from './console';
import { format } from './string';
import { version } from '../version';
var ERROR_URL = 'https://js.devexpress.com/error/' + version.split('.').slice(0, 2).join('_') + '/';
export default function (baseErrors, errors) {
  var exports = {
    ERROR_MESSAGES: extend(errors, baseErrors),
    Error: function Error() {
      return makeError([].slice.call(arguments));
    },
    log: function log(id) {
      var method = 'log';
      if (/^E\d+$/.test(id)) {
        method = 'error';
      } else if (/^W\d+$/.test(id)) {
        method = 'warn';
      }
      logger[method](method === 'log' ? id : combineMessage([].slice.call(arguments)));
    }
  };
  function combineMessage(args) {
    var id = args[0];
    args = args.slice(1);
    return formatMessage(id, formatDetails(id, args));
  }
  function formatDetails(id, args) {
    args = [exports.ERROR_MESSAGES[id]].concat(args);
    return format.apply(this, args).replace(/\.*\s*?$/, '');
  }
  function formatMessage(id, details) {
    var kind = id !== null && id !== void 0 && id.startsWith('W') ? 'warning' : 'error';
    return format.apply(this, ['{0} - {1}.\n\nFor additional information on this {2} message, see: {3}', id, details, kind, getErrorUrl(id)]);
  }
  function makeError(args) {
    var id = args[0];
    args = args.slice(1);
    var details = formatDetails(id, args);
    var url = getErrorUrl(id);
    var message = formatMessage(id, details);
    return extend(new Error(message), {
      __id: id,
      __details: details,
      url: url
    });
  }
  function getErrorUrl(id) {
    return ERROR_URL + id;
  }
  return exports;
}
