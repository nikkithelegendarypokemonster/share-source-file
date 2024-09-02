/**
* DevExtreme (esm/__internal/events/pointer/m_observer.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import domAdapter from '../../../core/dom_adapter';
import { each } from '../../../core/utils/iterator';
import readyCallbacks from '../../../core/utils/ready_callbacks';
const addEventsListener = function (events, handler) {
  readyCallbacks.add(() => {
    events.split(' ').forEach(event => {
      // @ts-expect-error
      domAdapter.listen(domAdapter.getDocument(), event, handler, true);
    });
  });
};
const Observer = function (eventMap, pointerEquals, onPointerAdding) {
  onPointerAdding = onPointerAdding || function () {};
  let pointers = [];
  const getPointerIndex = function (e) {
    let index = -1;
    each(pointers, (i, pointer) => {
      if (!pointerEquals(e, pointer)) {
        return true;
      }
      index = i;
      return false;
    });
    return index;
  };
  const addPointer = function (e) {
    if (getPointerIndex(e) === -1) {
      onPointerAdding(e);
      pointers.push(e);
    }
  };
  const removePointer = function (e) {
    const index = getPointerIndex(e);
    if (index > -1) {
      pointers.splice(index, 1);
    }
  };
  const updatePointer = function (e) {
    pointers[getPointerIndex(e)] = e;
  };
  /* eslint-disable spellcheck/spell-checker */
  addEventsListener(eventMap.dxpointerdown, addPointer);
  addEventsListener(eventMap.dxpointermove, updatePointer);
  addEventsListener(eventMap.dxpointerup, removePointer);
  addEventsListener(eventMap.dxpointercancel, removePointer);
  this.pointers = function () {
    return pointers;
  };
  this.reset = function () {
    pointers = [];
  };
};
export default Observer;
