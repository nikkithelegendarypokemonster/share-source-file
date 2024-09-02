/**
* DevExtreme (esm/__internal/events/utils/m_event_nodes_disposing.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import eventsEngine from '../../../events/core/events_engine';
import { removeEvent } from '../../../events/remove';
function nodesByEvent(event) {
  return event && [event.target, event.delegateTarget, event.relatedTarget, event.currentTarget].filter(node => !!node);
}
export const subscribeNodesDisposing = (event, callback) => {
  // @ts-expect-error
  eventsEngine.one(nodesByEvent(event), removeEvent, callback);
};
export const unsubscribeNodesDisposing = (event, callback) => {
  eventsEngine.off(nodesByEvent(event), removeEvent, callback);
};
