/**
* DevExtreme (esm/__internal/events/m_hold.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import Emitter from '../../events/core/emitter';
import registerEmitter from '../../events/core/emitter_registrator';
import { eventData, eventDelta } from '../../events/utils/index';
const {
  abs
} = Math;
const HOLD_EVENT_NAME = 'dxhold';
const HOLD_TIMEOUT = 750;
const TOUCH_BOUNDARY = 5;
const HoldEmitter = Emitter.inherit({
  start(e) {
    this._startEventData = eventData(e);
    this._startTimer(e);
  },
  _startTimer(e) {
    const holdTimeout = 'timeout' in this ? this.timeout : HOLD_TIMEOUT;
    this._holdTimer = setTimeout(() => {
      this._requestAccept(e);
      this._fireEvent(HOLD_EVENT_NAME, e, {
        target: e.target
      });
      this._forgetAccept();
    }, holdTimeout);
  },
  move(e) {
    if (this._touchWasMoved(e)) {
      this._cancel(e);
    }
  },
  _touchWasMoved(e) {
    // @ts-expect-error
    const delta = eventDelta(this._startEventData, eventData(e));
    return abs(delta.x) > TOUCH_BOUNDARY || abs(delta.y) > TOUCH_BOUNDARY;
  },
  end() {
    this._stopTimer();
  },
  _stopTimer() {
    clearTimeout(this._holdTimer);
  },
  cancel() {
    this._stopTimer();
  },
  dispose() {
    this._stopTimer();
  }
});
registerEmitter({
  emitter: HoldEmitter,
  bubble: true,
  events: [HOLD_EVENT_NAME]
});
export default {
  name: HOLD_EVENT_NAME
};
