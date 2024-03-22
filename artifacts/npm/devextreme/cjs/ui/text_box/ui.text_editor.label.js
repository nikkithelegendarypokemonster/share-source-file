/**
* DevExtreme (cjs/ui/text_box/ui.text_editor.label.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.TextEditorLabel = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _guid = _interopRequireDefault(require("../../core/guid"));
var _click = require("../../events/click");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _index = require("../../events/utils/index");
var _hover = require("../../events/hover");
var _emitter = require("../../events/core/emitter.feedback");
var _window = require("../../core/utils/window");
var _size = require("../../core/utils/size");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TEXTEDITOR_LABEL_CLASS = 'dx-texteditor-label';
const TEXTEDITOR_WITH_LABEL_CLASS = 'dx-texteditor-with-label';
const TEXTEDITOR_LABEL_OUTSIDE_CLASS = 'dx-texteditor-label-outside';
const TEXTEDITOR_WITH_FLOATING_LABEL_CLASS = 'dx-texteditor-with-floating-label';
const TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS = 'dx-texteditor-with-before-buttons';
const LABEL_BEFORE_CLASS = 'dx-label-before';
const LABEL_CLASS = 'dx-label';
const LABEL_AFTER_CLASS = 'dx-label-after';
let TextEditorLabel = exports.TextEditorLabel = /*#__PURE__*/function () {
  function TextEditorLabel(props) {
    this.NAME = 'dxLabel';
    this._props = props;
    this._id = "".concat(TEXTEDITOR_LABEL_CLASS, "-").concat(new _guid.default());
    this._render();
    this._toggleMarkupVisibility();
  }
  var _proto = TextEditorLabel.prototype;
  _proto._isVisible = function _isVisible() {
    return !!this._props.text && this._props.mode !== 'hidden';
  };
  _proto._render = function _render() {
    this._$before = (0, _renderer.default)('<div>').addClass(LABEL_BEFORE_CLASS);
    this._$labelSpan = (0, _renderer.default)('<span>');
    this._$label = (0, _renderer.default)('<div>').addClass(LABEL_CLASS).append(this._$labelSpan);
    this._$after = (0, _renderer.default)('<div>').addClass(LABEL_AFTER_CLASS);
    this._$root = (0, _renderer.default)('<div>').addClass(TEXTEDITOR_LABEL_CLASS).attr('id', this._id).append(this._$before).append(this._$label).append(this._$after);
    this._updateMark();
    this._updateText();
    this._updateBeforeWidth();
    this._updateMaxWidth();
  };
  _proto._toggleMarkupVisibility = function _toggleMarkupVisibility() {
    const visible = this._isVisible();
    this._updateEditorBeforeButtonsClass(visible);
    this._updateEditorLabelClass(visible);
    visible ? this._$root.appendTo(this._props.$editor) : this._$root.detach();
    this._attachEvents();
  };
  _proto._attachEvents = function _attachEvents() {
    const clickEventName = (0, _index.addNamespace)(_click.name, this.NAME);
    const hoverStartEventName = (0, _index.addNamespace)(_hover.start, this.NAME);
    const activeEventName = (0, _index.addNamespace)(_emitter.active, this.NAME);
    _events_engine.default.off(this._$labelSpan, clickEventName);
    _events_engine.default.off(this._$labelSpan, hoverStartEventName);
    _events_engine.default.off(this._$labelSpan, activeEventName);
    if (this._isVisible() && this._isOutsideMode()) {
      _events_engine.default.on(this._$labelSpan, clickEventName, e => {
        const selectedText = (0, _window.getWindow)().getSelection().toString();
        if (selectedText === '') {
          this._props.onClickHandler();
          e.preventDefault();
        }
      });
      _events_engine.default.on(this._$labelSpan, hoverStartEventName, e => {
        this._props.onHoverHandler(e);
      });
      _events_engine.default.on(this._$labelSpan, activeEventName, e => {
        this._props.onActiveHandler(e);
      });
    }
  };
  _proto._updateEditorLabelClass = function _updateEditorLabelClass(visible) {
    this._props.$editor.removeClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS).removeClass(TEXTEDITOR_LABEL_OUTSIDE_CLASS).removeClass(TEXTEDITOR_WITH_LABEL_CLASS);
    if (visible) {
      const labelClass = this._props.mode === 'floating' ? TEXTEDITOR_WITH_FLOATING_LABEL_CLASS : TEXTEDITOR_WITH_LABEL_CLASS;
      this._props.$editor.addClass(labelClass);
      if (this._isOutsideMode()) {
        this._props.$editor.addClass(TEXTEDITOR_LABEL_OUTSIDE_CLASS);
      }
    }
  };
  _proto._isOutsideMode = function _isOutsideMode() {
    return this._props.mode === 'outside';
  };
  _proto._updateEditorBeforeButtonsClass = function _updateEditorBeforeButtonsClass() {
    let visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._isVisible();
    this._props.$editor.removeClass(TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS);
    if (visible) {
      const beforeButtonsClass = this._props.containsButtonsBefore ? TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS : '';
      this._props.$editor.addClass(beforeButtonsClass);
    }
  };
  _proto._updateMark = function _updateMark() {
    this._$labelSpan.attr('data-mark', this._props.mark);
  };
  _proto._updateText = function _updateText() {
    this._$labelSpan.text(this._props.text);
  };
  _proto._updateBeforeWidth = function _updateBeforeWidth() {
    if (this._isVisible()) {
      var _this$_props$beforeWi;
      const width = (_this$_props$beforeWi = this._props.beforeWidth) !== null && _this$_props$beforeWi !== void 0 ? _this$_props$beforeWi : this._props.getBeforeWidth();
      this._$before.css({
        width
      });
      this._updateLabelTransform();
    }
  };
  _proto._updateLabelTransform = function _updateLabelTransform() {
    let offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    this._$labelSpan.css('transform', '');
    if (this._isVisible() && this._isOutsideMode()) {
      const sign = this._props.rtlEnabled ? 1 : -1;
      const labelTranslateX = sign * ((0, _size.getWidth)(this._$before) + offset);
      this._$labelSpan.css('transform', "translateX(".concat(labelTranslateX, "px)"));
    }
  };
  _proto._updateMaxWidth = function _updateMaxWidth() {
    if (this._isVisible() && !this._isOutsideMode()) {
      var _this$_props$containe;
      const maxWidth = (_this$_props$containe = this._props.containerWidth) !== null && _this$_props$containe !== void 0 ? _this$_props$containe : this._props.getContainerWidth();
      this._$label.css({
        maxWidth
      });
    }
  };
  _proto.$element = function $element() {
    return this._$root;
  };
  _proto.isVisible = function isVisible() {
    return this._isVisible();
  };
  _proto.getId = function getId() {
    if (this._isVisible()) return this._id;
  };
  _proto.updateMode = function updateMode(mode) {
    this._props.mode = mode;
    this._toggleMarkupVisibility();
    this._updateBeforeWidth();
    this._updateMaxWidth();
  };
  _proto.updateText = function updateText(text) {
    this._props.text = text;
    this._updateText();
    this._toggleMarkupVisibility();
    this._updateBeforeWidth();
    this._updateMaxWidth();
  };
  _proto.updateMark = function updateMark(mark) {
    this._props.mark = mark;
    this._updateMark();
  };
  _proto.updateContainsButtonsBefore = function updateContainsButtonsBefore(containsButtonsBefore) {
    this._props.containsButtonsBefore = containsButtonsBefore;
    this._updateEditorBeforeButtonsClass();
  };
  _proto.updateBeforeWidth = function updateBeforeWidth(beforeWidth) {
    this._props.beforeWidth = beforeWidth;
    this._updateBeforeWidth();
  };
  _proto.updateMaxWidth = function updateMaxWidth(containerWidth) {
    this._props.containerWidth = containerWidth;
    this._updateMaxWidth();
  };
  return TextEditorLabel;
}();
