"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsubscribeNodesDisposing = exports.subscribeNodesDisposing = void 0;
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _remove = require("../../../events/remove");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function nodesByEvent(event) {
  return event && [event.target, event.delegateTarget, event.relatedTarget, event.currentTarget].filter(node => !!node);
}
const subscribeNodesDisposing = (event, callback) => {
  // @ts-expect-error
  _events_engine.default.one(nodesByEvent(event), _remove.removeEvent, callback);
};
exports.subscribeNodesDisposing = subscribeNodesDisposing;
const unsubscribeNodesDisposing = (event, callback) => {
  _events_engine.default.off(nodesByEvent(event), _remove.removeEvent, callback);
};
exports.unsubscribeNodesDisposing = unsubscribeNodesDisposing;