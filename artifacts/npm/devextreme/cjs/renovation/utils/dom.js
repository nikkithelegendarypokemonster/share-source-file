/**
* DevExtreme (cjs/renovation/utils/dom.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.querySelectorInSameDocument = querySelectorInSameDocument;
function querySelectorInSameDocument(el, selector) {
  var _el$getRootNode;
  const root = ((_el$getRootNode = el.getRootNode) === null || _el$getRootNode === void 0 ? void 0 : _el$getRootNode.call(el)) ?? document;
  return root.querySelector(selector);
}
