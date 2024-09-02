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