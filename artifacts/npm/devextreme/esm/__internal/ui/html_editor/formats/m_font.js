/**
* DevExtreme (esm/__internal/ui/html_editor/formats/m_font.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import Quill from 'devextreme-quill';
// eslint-disable-next-line import/no-mutable-exports
let FontStyle = {};
if (Quill) {
  FontStyle = Quill.import('attributors/style/font');
  // @ts-expect-error
  FontStyle.whitelist = null;
}
export default FontStyle;
