"use strict";

exports.getPublicElementJQuery = getPublicElementJQuery;
var _element = require("../../core/element");
var _use_jquery = _interopRequireDefault(require("./use_jquery"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const useJQuery = (0, _use_jquery.default)();
function getPublicElementJQuery($element) {
  return $element;
}
if (useJQuery) {
  (0, _element.setPublicElementWrapper)(getPublicElementJQuery);
}