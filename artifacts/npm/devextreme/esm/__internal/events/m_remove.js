/**
* DevExtreme (esm/__internal/events/m_remove.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { beforeCleanData } from '../../core/element_data';
import $ from '../../core/renderer';
import registerEvent from '../../events/core/event_registrator';
import eventsEngine from '../../events/core/events_engine';
export const removeEvent = 'dxremove';
const eventPropName = 'dxRemoveEvent';
beforeCleanData(elements => {
  elements = [].slice.call(elements);
  for (let i = 0; i < elements.length; i++) {
    const $element = $(elements[i]);
    // @ts-expect-error
    if ($element.prop(eventPropName)) {
      $element[0][eventPropName] = null;
      // @ts-expect-error
      eventsEngine.triggerHandler($element, removeEvent);
    }
  }
});
registerEvent(removeEvent, {
  noBubble: true,
  setup(element) {
    $(element).prop(eventPropName, true);
  }
});
