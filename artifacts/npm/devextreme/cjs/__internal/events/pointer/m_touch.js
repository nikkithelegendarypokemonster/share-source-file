/**
* DevExtreme (cjs/__internal/events/pointer/m_touch.js)
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
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _base = _interopRequireDefault(require("../../../events/pointer/base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable spellcheck/spell-checker */
const eventMap = {
  dxpointerdown: 'touchstart',
  dxpointermove: 'touchmove',
  dxpointerup: 'touchend',
  dxpointercancel: 'touchcancel',
  dxpointerover: '',
  dxpointerout: '',
  dxpointerenter: '',
  dxpointerleave: ''
};
const normalizeTouchEvent = function (e) {
  const pointers = [];
  (0, _iterator.each)(e.touches, (_, touch) => {
    pointers.push((0, _extend.extend)({
      pointerId: touch.identifier
    }, touch));
  });
  return {
    pointers,
    pointerId: e.changedTouches[0].identifier
  };
};
const skipTouchWithSameIdentifier = function (pointerEvent) {
  return _devices.default.real().platform === 'ios' && (pointerEvent === 'dxpointerdown' || pointerEvent === 'dxpointerup');
};
const TouchStrategy = _base.default.inherit({
  ctor() {
    this.callBase.apply(this, arguments);
    this._pointerId = 0;
  },
  _handler(e) {
    if (skipTouchWithSameIdentifier(this._eventName)) {
      const touch = e.changedTouches[0];
      if (this._pointerId === touch.identifier && this._pointerId !== 0) {
        return;
      }
      this._pointerId = touch.identifier;
    }
    return this.callBase.apply(this, arguments);
  },
  _fireEvent(args) {
    return this.callBase((0, _extend.extend)(normalizeTouchEvent(args.originalEvent), args));
  }
});
// @ts-expect-error
TouchStrategy.map = eventMap;
// @ts-expect-error
TouchStrategy.normalize = normalizeTouchEvent;
var _default = exports.default = TouchStrategy;
