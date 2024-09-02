/**
* DevExtreme (esm/__internal/ui/html_editor/converters/m_delta.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import ConverterController from '../m_converterController';
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
ConverterController.addConverter('delta', DeltaConverter);
export default DeltaConverter;
