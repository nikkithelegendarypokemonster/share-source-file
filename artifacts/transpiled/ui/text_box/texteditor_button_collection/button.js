"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let TextEditorButton = exports.default = /*#__PURE__*/function () {
  function TextEditorButton(name, editor, options) {
    this.instance = null;
    this.$container = null;
    this.$placeMarker = null;
    this.editor = editor;
    this.name = name;
    this.options = options || {};
  }
  var _proto = TextEditorButton.prototype;
  _proto._addPlaceMarker = function _addPlaceMarker($container) {
    this.$placeMarker = (0, _renderer.default)('<div>').appendTo($container);
  };
  _proto._addToContainer = function _addToContainer($element) {
    const {
      $placeMarker,
      $container
    } = this;
    $placeMarker ? $placeMarker.replaceWith($element) : $element.appendTo($container);
  };
  _proto._attachEvents = function _attachEvents( /* instance, $element */
  ) {
    throw 'Not implemented';
  };
  _proto._create = function _create() {
    throw 'Not implemented';
  };
  _proto._isRendered = function _isRendered() {
    return !!this.instance;
  };
  _proto._isVisible = function _isVisible() {
    const {
      editor,
      options
    } = this;
    return options.visible || !editor.option('readOnly');
  };
  _proto._isDisabled = function _isDisabled() {
    throw 'Not implemented';
  };
  _proto._shouldRender = function _shouldRender() {
    return this._isVisible() && !this._isRendered();
  };
  _proto.dispose = function dispose() {
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
  };
  _proto.render = function render() {
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
  };
  _proto.update = function update() {
    if (this._shouldRender()) {
      this.render();
    }
    return !!this.instance;
  };
  return TextEditorButton;
}();
module.exports = exports.default;
module.exports.default = exports.default;