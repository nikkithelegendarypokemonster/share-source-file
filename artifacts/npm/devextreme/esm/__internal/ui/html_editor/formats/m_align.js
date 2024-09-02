/**
* DevExtreme (esm/__internal/ui/html_editor/formats/m_align.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import Quill from 'devextreme-quill';
// eslint-disable-next-line import/no-mutable-exports
let AlignStyle = {};
if (Quill) {
  AlignStyle = Quill.import('attributors/style/align');
  // @ts-expect-error
  AlignStyle.whitelist.push('left');
}
export default AlignStyle;
