/**
* DevExtreme (cjs/integration/jquery/element.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _element = require("../../core/element");
var _use_jquery = _interopRequireDefault(require("./use_jquery"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const useJQuery = (0, _use_jquery.default)();
const getPublicElement = function ($element) {
  return $element;
};
if (useJQuery) {
  (0, _element.setPublicElementWrapper)(getPublicElement);
}
