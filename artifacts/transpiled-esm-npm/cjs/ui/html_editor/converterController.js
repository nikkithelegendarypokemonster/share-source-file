"use strict";

exports.default = void 0;
let ConverterController = /*#__PURE__*/function () {
  function ConverterController() {
    this._converters = {};
  }
  var _proto = ConverterController.prototype;
  _proto.addConverter = function addConverter(name, converter) {
    this._converters[name] = converter;
  };
  _proto.getConverter = function getConverter(name) {
    return this._converters[name];
  };
  return ConverterController;
}();
const controller = new ConverterController();
var _default = exports.default = controller;
module.exports = exports.default;
module.exports.default = exports.default;