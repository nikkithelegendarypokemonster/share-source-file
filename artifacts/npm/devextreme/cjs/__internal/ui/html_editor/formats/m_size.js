/**
* DevExtreme (cjs/__internal/ui/html_editor/formats/m_size.js)
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
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-mutable-exports
let SizeStyle = {};
if (_devextremeQuill.default) {
  SizeStyle = _devextremeQuill.default.import('attributors/style/size');
  // @ts-expect-error
  SizeStyle.whitelist = null;
}
var _default = exports.default = SizeStyle;
