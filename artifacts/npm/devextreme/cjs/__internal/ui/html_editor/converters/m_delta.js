/**
* DevExtreme (cjs/__internal/ui/html_editor/converters/m_delta.js)
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
var _m_converterController = _interopRequireDefault(require("../m_converterController"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class DeltaConverter {
  setQuillInstance(quillInstance) {
    this.quillInstance = quillInstance;
  }
  toHtml() {
    if (!this.quillInstance) {
      return;
    }
    return this._isQuillEmpty() ? '' : this.quillInstance.getSemanticHTML(0, this.quillInstance.getLength() + 1);
  }
  _isQuillEmpty() {
    const delta = this.quillInstance.getContents();
    return delta.length() === 1 && this._isDeltaEmpty(delta);
  }
  _isDeltaEmpty(delta) {
    return delta.reduce((__, _ref) => {
      let {
        insert
      } = _ref;
      return insert.indexOf('\n') !== -1;
    });
  }
}
_m_converterController.default.addConverter('delta', DeltaConverter);
var _default = exports.default = DeltaConverter;
