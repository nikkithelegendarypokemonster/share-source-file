/**
* DevExtreme (cjs/__internal/events/m_remove.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeEvent = void 0;
var _element_data = require("../../core/element_data");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _event_registrator = _interopRequireDefault(require("../../events/core/event_registrator"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const removeEvent = exports.removeEvent = 'dxremove';
const eventPropName = 'dxRemoveEvent';
(0, _element_data.beforeCleanData)(elements => {
  elements = [].slice.call(elements);
  for (let i = 0; i < elements.length; i++) {
    const $element = (0, _renderer.default)(elements[i]);
    // @ts-expect-error
    if ($element.prop(eventPropName)) {
      $element[0][eventPropName] = null;
      // @ts-expect-error
      _events_engine.default.triggerHandler($element, removeEvent);
    }
  }
});
(0, _event_registrator.default)(removeEvent, {
  noBubble: true,
  setup(element) {
    (0, _renderer.default)(element).prop(eventPropName, true);
  }
});
