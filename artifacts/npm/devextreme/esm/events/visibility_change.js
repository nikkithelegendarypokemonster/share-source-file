/**
* DevExtreme (esm/events/visibility_change.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import $ from '../core/renderer';
import eventsEngine from './core/events_engine';
var triggerVisibilityChangeEvent = function triggerVisibilityChangeEvent(eventName) {
  var VISIBILITY_CHANGE_SELECTOR = '.dx-visibility-change-handler';
  return function (element) {
    var $element = $(element || 'body');
    var changeHandlers = $element.filter(VISIBILITY_CHANGE_SELECTOR).add($element.find(VISIBILITY_CHANGE_SELECTOR));
    for (var i = 0; i < changeHandlers.length; i++) {
      eventsEngine.triggerHandler(changeHandlers[i], eventName);
    }
  };
};
export var triggerShownEvent = triggerVisibilityChangeEvent('dxshown');
export var triggerHidingEvent = triggerVisibilityChangeEvent('dxhiding');
export var triggerResizeEvent = triggerVisibilityChangeEvent('dxresize');
