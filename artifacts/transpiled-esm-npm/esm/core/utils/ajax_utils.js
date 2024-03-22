import { extendFromObject } from './extend';
import { getWindow, hasWindow } from './window';
import domAdapter from '../dom_adapter';
var window = getWindow();
var createScript = function createScript(options) {
  var script = domAdapter.createElement('script');
  for (var name in options) {
    script[name] = options[name];
  }
  return script;
};
var appendToHead = function appendToHead(element) {
  return domAdapter.getHead().appendChild(element);
};
var removeScript = function removeScript(scriptNode) {
  scriptNode.parentNode.removeChild(scriptNode);
};
var evalScript = function evalScript(code) {
  var script = createScript({
    text: code
  });
  appendToHead(script);
  removeScript(script);
};
var evalCrossDomainScript = function evalCrossDomainScript(url) {
  var script = createScript({
    src: url
  });
  return new Promise(function (resolve, reject) {
    var events = {
      'load': resolve,
      'error': reject
    };
    var loadHandler = function loadHandler(e) {
      events[e.type]();
      removeScript(script);
    };
    for (var event in events) {
      domAdapter.listen(script, event, loadHandler);
    }
    appendToHead(script);
  });
};
function getMethod(options) {
  return (options.method || 'GET').toUpperCase();
}
var paramsConvert = function paramsConvert(params) {
  var result = [];
  for (var name in params) {
    var value = params[name];
    if (value === undefined) {
      continue;
    }
    if (value === null) {
      value = '';
    }
    if (typeof value === 'function') {
      value = value();
    }
    result.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
  }
  return result.join('&');
};
var getContentTypeHeader = function getContentTypeHeader(options) {
  var defaultContentType;
  if (options.data && !options.upload && getMethod(options) !== 'GET') {
    defaultContentType = 'application/x-www-form-urlencoded;charset=utf-8';
  }
  return options.contentType || defaultContentType;
};
var getAcceptHeader = function getAcceptHeader(options) {
  var dataType = options.dataType || '*';
  var scriptAccept = 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript';
  var accepts = {
    '*': '*/*',
    text: 'text/plain',
    html: 'text/html',
    xml: 'application/xml, text/xml',
    json: 'application/json, text/javascript',
    jsonp: scriptAccept,
    script: scriptAccept
  };
  extendFromObject(accepts, options.accepts, true);
  return accepts[dataType] ? accepts[dataType] + (dataType !== '*' ? ', */*; q=0.01' : '') : accepts['*'];
};
var getRequestHeaders = function getRequestHeaders(options) {
  var headers = options.headers || {};
  headers['Content-Type'] = headers['Content-Type'] || getContentTypeHeader(options);
  headers['Accept'] = headers['Accept'] || getAcceptHeader(options);
  if (!options.crossDomain && !headers['X-Requested-With']) {
    headers['X-Requested-With'] = 'XMLHttpRequest';
  }
  return headers;
};
var getJsonpOptions = function getJsonpOptions(options) {
  if (options.dataType === 'jsonp') {
    var random = Math.random().toString().replace(/\D/g, '');
    var callbackName = options.jsonpCallback || 'dxCallback' + Date.now() + '_' + random;
    var callbackParameter = options.jsonp || 'callback';
    options.data = options.data || {};
    options.data[callbackParameter] = callbackName;
    return callbackName;
  }
};
var getRequestOptions = function getRequestOptions(options, headers) {
  var params = options.data;
  var paramsAlreadyString = typeof params === 'string';
  var url = options.url || window.location.href;
  if (!paramsAlreadyString && !options.cache) {
    params = params || {};
    params['_'] = Date.now();
  }
  if (params && !options.upload) {
    if (!paramsAlreadyString) {
      params = paramsConvert(params);
    }
    if (getMethod(options) === 'GET') {
      if (params !== '') {
        url += (url.indexOf('?') > -1 ? '&' : '?') + params;
      }
      params = null;
    } else if (headers['Content-Type'] && headers['Content-Type'].indexOf('application/x-www-form-urlencoded') > -1) {
      params = params.replace(/%20/g, '+');
    }
  }
  return {
    url: url,
    parameters: params
  };
};
var isCrossDomain = function isCrossDomain(url) {
  if (!hasWindow()) {
    return true;
  }
  var crossDomain = false;
  var originAnchor = domAdapter.createElement('a');
  var urlAnchor = domAdapter.createElement('a');
  originAnchor.href = window.location.href;
  try {
    urlAnchor.href = url;

    // NOTE: IE11
    // eslint-disable-next-line no-self-assign
    urlAnchor.href = urlAnchor.href;
    crossDomain = originAnchor.protocol + '//' + originAnchor.host !== urlAnchor.protocol + '//' + urlAnchor.host;
  } catch (e) {
    crossDomain = true;
  }
  return crossDomain;
};
export { isCrossDomain, getJsonpOptions as getJsonpCallbackName, getRequestHeaders, getRequestOptions, getAcceptHeader, evalScript, evalCrossDomainScript, getMethod };