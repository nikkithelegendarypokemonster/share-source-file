/**
* DevExtreme (esm/__internal/ui/html_editor/modules/m_imageCursor.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import eventsEngine from '../../../../events/core/events_engine';
import { addNamespace } from '../../../../events/utils/index';
import Quill from 'devextreme-quill';
import BaseModule from './m_base';
const MODULE_NAMESPACE = 'dxHtmlEditorImageCursor';
const clickEvent = addNamespace('dxclick', MODULE_NAMESPACE);
// eslint-disable-next-line import/no-mutable-exports
let ImageCursorModule = BaseModule;
if (Quill) {
  // @ts-expect-error
  ImageCursorModule = class ImageCursorModule extends BaseModule {
    constructor(quill, options) {
      // @ts-expect-error
      super(quill, options);
      // @ts-expect-error
      this.addCleanCallback(this.clean.bind(this));
      this._attachEvents();
    }
    _attachEvents() {
      eventsEngine.on(this.quill.root, clickEvent, this._clickHandler.bind(this));
    }
    _detachEvents() {
      eventsEngine.off(this.quill.root, clickEvent);
    }
    _clickHandler(e) {
      if (this._isAllowedTarget(e.target)) {
        this._adjustSelection(e);
      }
    }
    _isAllowedTarget(targetElement) {
      return this._isImage(targetElement);
    }
    _isImage(targetElement) {
      return targetElement.tagName.toUpperCase() === 'IMG';
    }
    _adjustSelection(e) {
      const blot = this.quill.scroll.find(e.target);
      if (blot) {
        const index = blot.offset(this.quill.scroll);
        this.quill.setSelection(index + 1, 0);
      } else {
        this.quill.setSelection(0, 0);
      }
    }
    clean() {
      this._detachEvents();
    }
  };
}
export default ImageCursorModule;
