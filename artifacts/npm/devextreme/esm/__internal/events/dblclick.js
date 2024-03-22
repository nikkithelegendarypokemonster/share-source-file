/**
* DevExtreme (esm/__internal/events/dblclick.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import Class from '../../core/class';
import domAdapter from '../../core/dom_adapter';
import { closestCommonParent } from '../../core/utils/dom';
import { name as clickEventName } from '../../events/click';
import eventsEngine from '../../events/core/events_engine';
import { addNamespace, fireEvent } from '../../events/utils/index';
var DBLCLICK_EVENT_NAME = 'dxdblclick';
var DBLCLICK_NAMESPACE = 'dxDblClick';
var NAMESPACED_CLICK_EVENT = addNamespace(clickEventName, DBLCLICK_NAMESPACE);
var DBLCLICK_TIMEOUT = 300;
var DblClick = Class.inherit({
  ctor() {
    this._handlerCount = 0;
    this._forgetLastClick();
  },
  _forgetLastClick() {
    this._firstClickTarget = null;
    this._lastClickTimeStamp = -DBLCLICK_TIMEOUT;
  },
  add() {
    if (this._handlerCount <= 0) {
      eventsEngine.on(domAdapter.getDocument(), NAMESPACED_CLICK_EVENT, this._clickHandler.bind(this));
    }
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    this._handlerCount += 1;
  },
  _clickHandler(e) {
    var timeStamp = e.timeStamp || Date.now();
    var timeBetweenClicks = timeStamp - this._lastClickTimeStamp;
    // NOTE: jQuery sets `timeStamp = Date.now()` for the triggered events, but
    // in the real event timeStamp is the number of milliseconds elapsed from the
    // beginning of the current document's lifetime till the event was created
    // (https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp).
    var isSimulated = timeBetweenClicks < 0;
    var isDouble = !isSimulated && timeBetweenClicks < DBLCLICK_TIMEOUT;
    if (isDouble) {
      fireEvent({
        type: DBLCLICK_EVENT_NAME,
        target: closestCommonParent(this._firstClickTarget, e.target),
        originalEvent: e
      });
      this._forgetLastClick();
    } else {
      this._firstClickTarget = e.target;
      this._lastClickTimeStamp = timeStamp;
    }
  },
  remove() {
    this._handlerCount -= 1;
    if (this._handlerCount <= 0) {
      this._forgetLastClick();
      eventsEngine.off(domAdapter.getDocument(), NAMESPACED_CLICK_EVENT, undefined);
      this._handlerCount = 0;
    }
  }
});
var dblClick = new DblClick();
export { dblClick, DBLCLICK_EVENT_NAME as name };
