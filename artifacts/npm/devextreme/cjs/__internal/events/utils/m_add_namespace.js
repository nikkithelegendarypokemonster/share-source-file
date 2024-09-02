/**
* DevExtreme (cjs/__internal/events/utils/m_add_namespace.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _errors = _interopRequireDefault(require("../../../core/errors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const addNamespace = (eventNames, namespace) => {
  if (!namespace) {
    throw _errors.default.Error('E0017');
  }
  if (Array.isArray(eventNames)) {
    return eventNames.map(eventName => addNamespace(eventName, namespace)).join(' ');
  }
  if (eventNames.indexOf(' ') !== -1) {
    return addNamespace(eventNames.split(/\s+/g), namespace);
  }
  return `${eventNames}.${namespace}`;
};
var _default = exports.default = addNamespace;
