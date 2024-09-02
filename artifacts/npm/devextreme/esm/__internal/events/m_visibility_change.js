/**
* DevExtreme (esm/__internal/events/m_visibility_change.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
const triggerVisibilityChangeEvent = function (eventName) {
  const VISIBILITY_CHANGE_SELECTOR = '.dx-visibility-change-handler';
  return function (element) {
    const $element = $(element || 'body');
    const changeHandlers = $element.filter(VISIBILITY_CHANGE_SELECTOR)
    // @ts-expect-error
    .add($element.find(VISIBILITY_CHANGE_SELECTOR));
    for (let i = 0; i < changeHandlers.length; i++) {
      eventsEngine.triggerHandler(changeHandlers[i], eventName);
    }
  };
};
export const triggerShownEvent = triggerVisibilityChangeEvent('dxshown');
export const triggerHidingEvent = triggerVisibilityChangeEvent('dxhiding');
export const triggerResizeEvent = triggerVisibilityChangeEvent('dxresize');
export default {
  triggerHidingEvent,
  triggerResizeEvent,
  triggerShownEvent
};
