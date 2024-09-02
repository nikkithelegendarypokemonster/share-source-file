"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extend = require("../../../core/utils/extend");
var _base = _interopRequireDefault(require("../../../events/pointer/base"));
var _mouse = _interopRequireDefault(require("../../../events/pointer/mouse"));
var _touch = _interopRequireDefault(require("../../../events/pointer/touch"));
var _index = require("../../../events/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable spellcheck/spell-checker */
const eventMap = {
  dxpointerdown: 'touchstart mousedown',
  dxpointermove: 'touchmove mousemove',
  dxpointerup: 'touchend mouseup',
  dxpointercancel: 'touchcancel',
  dxpointerover: 'mouseover',
  dxpointerout: 'mouseout',
  dxpointerenter: 'mouseenter',
  dxpointerleave: 'mouseleave'
};
let activated = false;
const activateStrategy = function () {
  if (activated) {
    return;
  }
  // @ts-expect-error
  _mouse.default.activate();
  activated = true;
};
const MouseAndTouchStrategy = _base.default.inherit({
  EVENT_LOCK_TIMEOUT: 100,
  ctor() {
    this.callBase.apply(this, arguments);
    activateStrategy();
  },
  _handler(e) {
    const isMouse = (0, _index.isMouseEvent)(e);
    if (!isMouse) {
      this._skipNextEvents = true;
    }
    if (isMouse && this._mouseLocked) {
      return;
    }
    if (isMouse && this._skipNextEvents) {
      this._skipNextEvents = false;
      this._mouseLocked = true;
      clearTimeout(this._unlockMouseTimer);
      const that = this;
      this._unlockMouseTimer = setTimeout(() => {
        that._mouseLocked = false;
      }, this.EVENT_LOCK_TIMEOUT);
      return;
    }
    return this.callBase(e);
  },
  _fireEvent(args) {
    // @ts-expect-error
    const normalizer = (0, _index.isMouseEvent)(args.originalEvent) ? _mouse.default.normalize : _touch.default.normalize;
    return this.callBase((0, _extend.extend)(normalizer(args.originalEvent), args));
  },
  dispose() {
    this.callBase();
    this._skipNextEvents = false;
    this._mouseLocked = false;
    clearTimeout(this._unlockMouseTimer);
  }
});
// @ts-expect-error
MouseAndTouchStrategy.map = eventMap;
// @ts-expect-error
MouseAndTouchStrategy.resetObserver = _mouse.default.resetObserver;
var _default = exports.default = MouseAndTouchStrategy;