/**
* DevExtreme (esm/events/index.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import eventsEngine from './core/events_engine';

/**
* @name events
*/

export const on = eventsEngine.on;
export const one = eventsEngine.one;
export const off = eventsEngine.off;
export const trigger = eventsEngine.trigger;
export const triggerHandler = eventsEngine.triggerHandler;

/**
* @name events.Event
* @type function
* @param1 source:string|event
* @param2 config:object
* @return event
* @module events
* @export Event
* @hidden
*/

export const Event = eventsEngine.Event;
