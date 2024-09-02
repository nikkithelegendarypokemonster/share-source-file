/**
* DevExtreme (cjs/__internal/events/core/m_emitter.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _class = _interopRequireDefault(require("../../../core/class"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _callbacks = _interopRequireDefault(require("../../../core/utils/callbacks"));
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _index = require("../../../events/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Emitter = _class.default.inherit({
  ctor(element) {
    this._$element = (0, _renderer.default)(element);
    this._cancelCallback = (0, _callbacks.default)();
    this._acceptCallback = (0, _callbacks.default)();
  },
  getElement() {
    return this._$element;
  },
  validate(e) {
    return !(0, _index.isDxMouseWheelEvent)(e);
  },
  validatePointers(e) {
    return (0, _index.hasTouches)(e) === 1;
  },
  allowInterruptionByMouseWheel() {
    return true;
  },
  configure(data) {
    (0, _extend.extend)(this, data);
  },
  addCancelCallback(callback) {
    this._cancelCallback.add(callback);
  },
  removeCancelCallback() {
    this._cancelCallback.empty();
  },
  _cancel(e) {
    this._cancelCallback.fire(this, e);
  },
  addAcceptCallback(callback) {
    this._acceptCallback.add(callback);
  },
  removeAcceptCallback() {
    this._acceptCallback.empty();
  },
  _accept(e) {
    this._acceptCallback.fire(this, e);
  },
  _requestAccept(e) {
    this._acceptRequestEvent = e;
  },
  _forgetAccept() {
    this._accept(this._acceptRequestEvent);
    this._acceptRequestEvent = null;
  },
  start: _common.noop,
  move: _common.noop,
  end: _common.noop,
  cancel: _common.noop,
  reset() {
    if (this._acceptRequestEvent) {
      this._accept(this._acceptRequestEvent);
    }
  },
  _fireEvent(eventName, e, params) {
    const eventData = (0, _extend.extend)({
      type: eventName,
      originalEvent: e,
      target: this._getEmitterTarget(e),
      delegateTarget: this.getElement().get(0)
    }, params);
    e = (0, _index.fireEvent)(eventData);
    if (e.cancel) {
      this._cancel(e);
    }
    return e;
  },
  _getEmitterTarget(e) {
    return (this.delegateSelector ? (0, _renderer.default)(e.target).closest(this.delegateSelector) : this.getElement()).get(0);
  },
  dispose: _common.noop
});
var _default = exports.default = Emitter;
