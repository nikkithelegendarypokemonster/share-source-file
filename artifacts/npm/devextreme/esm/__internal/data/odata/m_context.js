/**
* DevExtreme (esm/__internal/data/odata/m_context.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import '../../../data/odata/query_adapter';
import Class from '../../../core/class';
import { Deferred, when } from '../../../core/utils/deferred';
import { extend } from '../../../core/utils/extend';
import { each } from '../../../core/utils/iterator';
import { isDefined, isPlainObject } from '../../../core/utils/type';
import RequestDispatcher from '../../../data/odata/request_dispatcher';
import ODataStore from '../../../data/odata/store';
import { errors, handleError } from '../m_errors';
import { escapeServiceOperationParams, formatFunctionInvocationUrl } from './m_utils';
const ODataContext = Class.inherit({
  ctor(options) {
    this._requestDispatcher = new RequestDispatcher(options);
    this._errorHandler = options.errorHandler;
    each(options.entities || [], (entityAlias, entityOptions) => {
      this[entityAlias] = new ODataStore(extend({}, options, {
        url: `${this._requestDispatcher.url}/${encodeURIComponent(entityOptions.name || entityAlias)}`
      }, entityOptions));
    });
  },
  get(operationName, params) {
    return this.invoke(operationName, params, 'GET');
  },
  invoke(operationName) {
    let params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let httpMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'POST';
    httpMethod = httpMethod.toLowerCase();
    // @ts-expect-error
    const d = new Deferred();
    let url = `${this._requestDispatcher.url}/${encodeURIComponent(operationName)}`;
    let payload;
    if (this.version() === 4) {
      if (httpMethod === 'get') {
        url = formatFunctionInvocationUrl(url, escapeServiceOperationParams(params, this.version()));
        // @ts-expect-error
        params = null;
      } else if (httpMethod === 'post') {
        payload = params;
        // @ts-expect-error
        params = null;
      }
    }
    when(this._requestDispatcher.sendRequest(url, httpMethod, escapeServiceOperationParams(params, this.version()), payload)).done(r => {
      if (isPlainObject(r) && operationName in r) {
        r = r[operationName];
      }
      d.resolve(r);
    }).fail(this._errorHandler).fail(handleError).fail(d.reject);
    return d.promise();
  },
  objectLink(entityAlias, key) {
    const store = this[entityAlias];
    if (!store) {
      throw errors.Error('E4015', entityAlias);
    }
    if (!isDefined(key)) {
      return null;
    }
    return {
      __metadata: {
        uri: store._byKeyUrl(key)
      }
    };
  },
  version() {
    return this._requestDispatcher.version;
  }
});
export default ODataContext;
