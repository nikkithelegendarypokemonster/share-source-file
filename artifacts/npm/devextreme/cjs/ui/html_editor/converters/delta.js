/**
* DevExtreme (cjs/ui/html_editor/converters/delta.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _converterController = _interopRequireDefault(require("../converterController"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let DeltaConverter = /*#__PURE__*/function () {
  function DeltaConverter() {}
  var _proto = DeltaConverter.prototype;
  _proto.setQuillInstance = function setQuillInstance(quillInstance) {
    this.quillInstance = quillInstance;
  };
  _proto.toHtml = function toHtml() {
    if (!this.quillInstance) {
      return;
    }
    return this._isQuillEmpty() ? '' : this.quillInstance.getSemanticHTML(0, this.quillInstance.getLength() + 1);
  };
  _proto._isQuillEmpty = function _isQuillEmpty() {
    const delta = this.quillInstance.getContents();
    return delta.length() === 1 && this._isDeltaEmpty(delta);
  };
  _proto._isDeltaEmpty = function _isDeltaEmpty(delta) {
    return delta.reduce((__, _ref) => {
      let {
        insert
      } = _ref;
      return insert.indexOf('\n') !== -1;
    });
  };
  return DeltaConverter;
}();
_converterController.default.addConverter('delta', DeltaConverter);
var _default = exports.default = DeltaConverter;
module.exports = exports.default;
module.exports.default = exports.default;
