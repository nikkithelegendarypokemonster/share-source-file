/**
* DevExtreme (esm/__internal/ui/html_editor/m_quill_importer.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import Errors from '../../../ui/widget/ui.errors';
import Quill from 'devextreme-quill';
export function getQuill() {
  if (!Quill) {
    throw Errors.Error('E1041', 'Quill');
  }
  return Quill;
}
