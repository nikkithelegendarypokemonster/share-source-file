/**
* DevExtreme (esm/ui/html_editor/formats/font.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import Quill from 'devextreme-quill';
var FontStyle = {};
if (Quill) {
  FontStyle = Quill.import('attributors/style/font');
  FontStyle.whitelist = null;
}
export default FontStyle;
