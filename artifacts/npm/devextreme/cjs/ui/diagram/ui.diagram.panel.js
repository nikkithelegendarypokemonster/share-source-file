/**
* DevExtreme (cjs/ui/diagram/ui.diagram.panel.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _index = require("../../events/utils/index");
var _pointer = _interopRequireDefault(require("../../events/pointer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const POINTERUP_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.up, 'dxDiagramPanel');
const PREVENT_REFOCUS_SELECTOR = '.dx-textbox';
let DiagramPanel = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(DiagramPanel, _Widget);
  function DiagramPanel() {
    return _Widget.apply(this, arguments) || this;
  }
  var _proto = DiagramPanel.prototype;
  _proto._init = function _init() {
    _Widget.prototype._init.call(this);
    this._createOnPointerUpAction();
  };
  _proto._render = function _render() {
    _Widget.prototype._render.call(this);
    this._attachPointerUpEvent();
  };
  _proto._getPointerUpElements = function _getPointerUpElements() {
    return [this.$element()];
  };
  _proto._attachPointerUpEvent = function _attachPointerUpEvent() {
    const elements = this._getPointerUpElements();
    elements.forEach(element => {
      _events_engine.default.off(element, POINTERUP_EVENT_NAME);
      _events_engine.default.on(element, POINTERUP_EVENT_NAME, e => {
        if (!(0, _renderer.default)(e.target).closest(PREVENT_REFOCUS_SELECTOR).length) {
          this._onPointerUpAction();
        }
      });
    });
  };
  _proto._createOnPointerUpAction = function _createOnPointerUpAction() {
    this._onPointerUpAction = this._createActionByOption('onPointerUp');
  };
  _proto._optionChanged = function _optionChanged(args) {
    switch (args.name) {
      case 'onPointerUp':
        this._createOnPointerUpAction();
        break;
      default:
        _Widget.prototype._optionChanged.call(this, args);
    }
  };
  return DiagramPanel;
}(_ui.default);
var _default = exports.default = DiagramPanel;
module.exports = exports.default;
module.exports.default = exports.default;
