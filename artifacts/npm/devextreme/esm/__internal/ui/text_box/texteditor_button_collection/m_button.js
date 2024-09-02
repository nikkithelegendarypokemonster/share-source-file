/**
* DevExtreme (esm/__internal/ui/text_box/texteditor_button_collection/m_button.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import $ from '../../../../core/renderer';
export default class TextEditorButton {
  constructor(name, editor, options) {
    this.instance = null;
    // @ts-expect-error
    this.$container = null;
    // @ts-expect-error
    this.$placeMarker = null;
    this.editor = editor;
    this.name = name;
    this.options = options || {};
  }
  _addPlaceMarker($container) {
    this.$placeMarker = $('<div>').appendTo($container);
  }
  _addToContainer($element) {
    const {
      $placeMarker,
      $container
    } = this;
    $placeMarker ? $placeMarker.replaceWith($element) : $element.appendTo($container);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _attachEvents(instance, $element) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw 'Not implemented';
  }
  _create() {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw 'Not implemented';
  }
  _isRendered() {
    return !!this.instance;
  }
  _isVisible() {
    const {
      editor,
      options
    } = this;
    return options.visible || !editor.option('readOnly');
  }
  _isDisabled() {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw 'Not implemented';
  }
  _shouldRender() {
    return this._isVisible() && !this._isRendered();
  }
  dispose() {
    const {
      instance,
      $placeMarker
    } = this;
    if (instance) {
      // TODO: instance.dispose()
      instance.dispose ? instance.dispose() : instance.remove();
      this.instance = null;
    }
    $placeMarker && $placeMarker.remove();
  }
  render() {
    let $container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$container;
    this.$container = $container;
    if (this._isVisible()) {
      const {
        instance,
        $element
      } = this._create();
      this.instance = instance;
      this._attachEvents(instance, $element);
    } else {
      this._addPlaceMarker($container);
    }
  }
  update() {
    if (this._shouldRender()) {
      this.render();
    }
    return !!this.instance;
  }
}
