/**
* DevExtreme (cjs/__internal/events/pointer/m_mouse.js)
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
var _extend = require("../../../core/utils/extend");
var _base = _interopRequireDefault(require("../../../events/pointer/base"));
var _observer = _interopRequireDefault(require("../../../events/pointer/observer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable spellcheck/spell-checker */
const eventMap = {
  dxpointerdown: 'mousedown',
  dxpointermove: 'mousemove',
  dxpointerup: 'mouseup',
  dxpointercancel: '',
  dxpointerover: 'mouseover',
  dxpointerout: 'mouseout',
  dxpointerenter: 'mouseenter',
  dxpointerleave: 'mouseleave'
};
const normalizeMouseEvent = function (e) {
  e.pointerId = 1;
  return {
    pointers: observer.pointers(),
    pointerId: 1
  };
};
let observer;
let activated = false;
const activateStrategy = function () {
  if (activated) {
    return;
  }
  // @ts-expect-error
  observer = new _observer.default(eventMap, () => true);
  activated = true;
};
const MouseStrategy = _base.default.inherit({
  ctor() {
    this.callBase.apply(this, arguments);
    activateStrategy();
  },
  _fireEvent(args) {
    return this.callBase((0, _extend.extend)(normalizeMouseEvent(args.originalEvent), args));
  }
});
// @ts-expect-error
MouseStrategy.map = eventMap;
// @ts-expect-error
MouseStrategy.normalize = normalizeMouseEvent;
// @ts-expect-error
MouseStrategy.activate = activateStrategy;
// @ts-expect-error
MouseStrategy.resetObserver = function () {
  observer.reset();
};
var _default = exports.default = MouseStrategy;
