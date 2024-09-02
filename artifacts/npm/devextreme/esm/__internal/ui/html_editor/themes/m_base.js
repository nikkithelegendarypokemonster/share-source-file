/**
* DevExtreme (esm/__internal/ui/html_editor/themes/m_base.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import Quill from 'devextreme-quill';
// eslint-disable-next-line import/no-mutable-exports
let BaseTheme;
if (Quill) {
  const Theme = Quill.import('core/theme');
  BaseTheme = class BaseTheme extends Theme {
    constructor(quill, options) {
      super(quill, options);
      this.quill.root.classList.add('dx-htmleditor-content');
      this.quill.root.setAttribute('role', 'textbox');
      this.quill.root.setAttribute('aria-label', 'Editor content');
    }
  };
} else {
  BaseTheme = {};
}
export default BaseTheme;
