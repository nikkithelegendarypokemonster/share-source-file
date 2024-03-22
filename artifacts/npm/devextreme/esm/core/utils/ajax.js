/**
* DevExtreme (esm/core/utils/ajax.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { Deferred } from './deferred';
import httpRequest from '../../core/http_request';
import { getWindow } from '../../core/utils/window';
var window = getWindow();
import { isDefined } from './type';
import injector from './dependency_injector';
import { isCrossDomain, getJsonpCallbackName as getJsonpOptions, getRequestHeaders, getRequestOptions, evalScript, evalCrossDomainScript, getMethod } from './ajax_utils';
var SUCCESS = 'success';
var ERROR = 'error';
var TIMEOUT = 'timeout';
var NO_CONTENT = 'nocontent';
var PARSER_ERROR = 'parsererror';
var isStatusSuccess = function isStatusSuccess(status) {
  return 200 <= status && status < 300;
};
var hasContent = function hasContent(status) {
  return status !== 204;
};
var getDataFromResponse = function getDataFromResponse(xhr) {
  return xhr.responseType && xhr.responseType !== 'text' || typeof xhr.responseText !== 'string' ? xhr.response : xhr.responseText;
};
var postProcess = function postProcess(deferred, xhr, dataType) {
  var data = getDataFromResponse(xhr);
  switch (dataType) {
    case 'jsonp':
      evalScript(data);
      break;
    case 'script':
      evalScript(data);
      deferred.resolve(data, SUCCESS, xhr);
      break;
    case 'json':
      try {
        deferred.resolve(JSON.parse(data), SUCCESS, xhr);
      } catch (e) {
        deferred.reject(xhr, PARSER_ERROR, e);
      }
      break;
    default:
      deferred.resolve(data, SUCCESS, xhr);
  }
};
var setHttpTimeout = function setHttpTimeout(timeout, xhr) {
  return timeout && setTimeout(function () {
    xhr.customStatus = TIMEOUT;
    xhr.abort();
  }, timeout);
};
var sendRequest = function sendRequest(options) {
  var xhr = httpRequest.getXhr();
  var d = new Deferred();
  var result = d.promise();
  var async = isDefined(options.async) ? options.async : true;
  var dataType = options.dataType;
  var timeout = options.timeout || 0;
  var timeoutId;
  options.crossDomain = isCrossDomain(options.url);
  var needScriptEvaluation = dataType === 'jsonp' || dataType === 'script';
  if (options.cache === undefined) {
    options.cache = !needScriptEvaluation;
  }
  var callbackName = getJsonpOptions(options);
  var headers = getRequestHeaders(options);
  var requestOptions = getRequestOptions(options, headers);
  var url = requestOptions.url;
  var parameters = requestOptions.parameters;
  if (callbackName) {
    window[callbackName] = function (data) {
      d.resolve(data, SUCCESS, xhr);
    };
  }
  if (options.crossDomain && needScriptEvaluation) {
    var reject = function reject() {
      d.reject(xhr, ERROR);
    };
    var resolve = function resolve() {
      if (dataType === 'jsonp') return;
      d.resolve(null, SUCCESS, xhr);
    };
    evalCrossDomainScript(url).then(resolve, reject);
    return result;
  }
  if (options.crossDomain && !('withCredentials' in xhr)) {
    d.reject(xhr, ERROR);
    return result;
  }
  xhr.open(getMethod(options), url, async, options.username, options.password);
  if (async) {
    xhr.timeout = timeout;
    timeoutId = setHttpTimeout(timeout, xhr);
  }
  xhr['onreadystatechange'] = function (e) {
    if (xhr.readyState === 4) {
      clearTimeout(timeoutId);
      if (isStatusSuccess(xhr.status)) {
        if (hasContent(xhr.status)) {
          postProcess(d, xhr, dataType);
        } else {
          d.resolve(null, NO_CONTENT, xhr);
        }
      } else {
        d.reject(xhr, xhr.customStatus || ERROR);
      }
    }
  };
  if (options.upload) {
    xhr.upload['onprogress'] = options.upload['onprogress'];
    xhr.upload['onloadstart'] = options.upload['onloadstart'];
    xhr.upload['onabort'] = options.upload['onabort'];
  }
  if (options.xhrFields) {
    for (var field in options.xhrFields) {
      xhr[field] = options.xhrFields[field];
    }
  }
  if (options.responseType === 'arraybuffer') {
    xhr.responseType = options.responseType;
  }
  for (var name in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, name) && isDefined(headers[name])) {
      xhr.setRequestHeader(name, headers[name]);
    }
  }
  if (options.beforeSend) {
    options.beforeSend(xhr);
  }
  xhr.send(parameters);
  result.abort = function () {
    xhr.abort();
  };
  return result;
};
export default injector({
  sendRequest: sendRequest
});
