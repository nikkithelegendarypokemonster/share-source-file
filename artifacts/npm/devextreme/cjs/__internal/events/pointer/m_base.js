/**
* DevExtreme (cjs/__internal/events/pointer/m_base.js)
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
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _browser = _interopRequireDefault(require("../../../core/utils/browser"));
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _event_target = require("../../../events/utils/event_target");
var _index = require("../../../events/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const POINTER_EVENTS_NAMESPACE = 'dxPointerEvents';
const BaseStrategy = _class.default.inherit({
  ctor(eventName, originalEvents) {
    this._eventName = eventName;
    this._originalEvents = (0, _index.addNamespace)(originalEvents, POINTER_EVENTS_NAMESPACE);
    this._handlerCount = 0;
    this.noBubble = this._isNoBubble();
  },
  _isNoBubble() {
    const eventName = this._eventName;
    return eventName === 'dxpointerenter' || eventName === 'dxpointerleave';
  },
  _handler(e) {
    const delegateTarget = this._getDelegateTarget(e);
    const event = {
      type: this._eventName,
      pointerType: e.pointerType || (0, _index.eventSource)(e),
      originalEvent: e,
      delegateTarget,
      // NOTE: TimeStamp normalization (FF bug #238041) (T277118)
      timeStamp: _browser.default.mozilla ? new Date().getTime() : e.timeStamp
    };
    const target = (0, _event_target.getEventTarget)(e);
    // @ts-expect-error
    event.target = target;
    return this._fireEvent(event);
  },
  _getDelegateTarget(e) {
    let delegateTarget;
    if (this.noBubble) {
      delegateTarget = e.delegateTarget;
    }
    return delegateTarget;
  },
  _fireEvent(args) {
    return (0, _index.fireEvent)(args);
  },
  _setSelector(handleObj) {
    this._selector = this.noBubble && handleObj ? handleObj.selector : null;
  },
  _getSelector() {
    return this._selector;
  },
  setup() {
    return true;
  },
  add(element, handleObj) {
    if (this._handlerCount <= 0 || this.noBubble) {
      element = this.noBubble ? element : _dom_adapter.default.getDocument();
      this._setSelector(handleObj);
      const that = this;
      _events_engine.default.on(element, this._originalEvents, this._getSelector(), e => {
        that._handler(e);
      });
    }
    if (!this.noBubble) {
      this._handlerCount++;
    }
  },
  remove(handleObj) {
    this._setSelector(handleObj);
    if (!this.noBubble) {
      this._handlerCount--;
    }
  },
  teardown(element) {
    if (this._handlerCount && !this.noBubble) {
      return;
    }
    element = this.noBubble ? element : _dom_adapter.default.getDocument();
    if (this._originalEvents !== `.${POINTER_EVENTS_NAMESPACE}`) {
      _events_engine.default.off(element, this._originalEvents, this._getSelector());
    }
  },
  dispose(element) {
    element = this.noBubble ? element : _dom_adapter.default.getDocument();
    _events_engine.default.off(element, this._originalEvents);
  }
});
var _default = exports.default = BaseStrategy;
