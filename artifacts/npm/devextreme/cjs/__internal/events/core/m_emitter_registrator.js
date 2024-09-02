/**
* DevExtreme (cjs/__internal/events/core/m_emitter_registrator.js)
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
exports.default = void 0;
var _class = _interopRequireDefault(require("../../../core/class"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _element_data = require("../../../core/element_data");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _ready_callbacks = _interopRequireDefault(require("../../../core/utils/ready_callbacks"));
var _event_registrator = _interopRequireDefault(require("../../../events/core/event_registrator"));
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _wheel = require("../../../events/core/wheel");
var _pointer = _interopRequireDefault(require("../../../events/pointer"));
var _index = require("../../../events/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MANAGER_EVENT = 'dxEventManager';
const EMITTER_DATA = 'dxEmitter';
const EventManager = _class.default.inherit({
  ctor() {
    this._attachHandlers();
    this.reset();
    this._proxiedCancelHandler = this._cancelHandler.bind(this);
    this._proxiedAcceptHandler = this._acceptHandler.bind(this);
  },
  _attachHandlers() {
    _ready_callbacks.default.add(() => {
      const document = _dom_adapter.default.getDocument();
      // @ts-expect-error
      _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_pointer.default.down, MANAGER_EVENT), this._pointerDownHandler.bind(this));
      // @ts-expect-error
      _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_pointer.default.move, MANAGER_EVENT), this._pointerMoveHandler.bind(this));
      // @ts-expect-error
      _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)([_pointer.default.up, _pointer.default.cancel].join(' '), MANAGER_EVENT), this._pointerUpHandler.bind(this));
      // @ts-expect-error
      _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_wheel.name, MANAGER_EVENT), this._mouseWheelHandler.bind(this));
    });
  },
  _eachEmitter(callback) {
    const activeEmitters = this._activeEmitters || [];
    let i = 0;
    while (activeEmitters.length > i) {
      const emitter = activeEmitters[i];
      if (callback(emitter) === false) {
        break;
      }
      if (activeEmitters[i] === emitter) {
        i++;
      }
    }
  },
  _applyToEmitters(method, arg) {
    this._eachEmitter(emitter => {
      emitter[method].call(emitter, arg);
    });
  },
  reset() {
    this._eachEmitter(this._proxiedCancelHandler);
    this._activeEmitters = [];
  },
  resetEmitter(emitter) {
    this._proxiedCancelHandler(emitter);
  },
  _pointerDownHandler(e) {
    if ((0, _index.isMouseEvent)(e) && e.which > 1) {
      return;
    }
    this._updateEmitters(e);
  },
  _updateEmitters(e) {
    if (!this._isSetChanged(e)) {
      return;
    }
    this._cleanEmitters(e);
    this._fetchEmitters(e);
  },
  _isSetChanged(e) {
    const currentSet = this._closestEmitter(e);
    const previousSet = this._emittersSet || [];
    let setChanged = currentSet.length !== previousSet.length;
    (0, _iterator.each)(currentSet, (index, emitter) => {
      setChanged = setChanged || previousSet[index] !== emitter;
      return !setChanged;
    });
    this._emittersSet = currentSet;
    return setChanged;
  },
  _closestEmitter(e) {
    const that = this;
    const result = [];
    let $element = (0, _renderer.default)(e.target);
    function handleEmitter(_, emitter) {
      if (!!emitter && emitter.validatePointers(e) && emitter.validate(e)) {
        emitter.addCancelCallback(that._proxiedCancelHandler);
        emitter.addAcceptCallback(that._proxiedAcceptHandler);
        result.push(emitter);
      }
    }
    while ($element.length) {
      const emitters = (0, _element_data.data)($element.get(0), EMITTER_DATA) || [];
      (0, _iterator.each)(emitters, handleEmitter);
      $element = $element.parent();
    }
    return result;
  },
  _acceptHandler(acceptedEmitter, e) {
    this._eachEmitter(emitter => {
      if (emitter !== acceptedEmitter) {
        this._cancelEmitter(emitter, e);
      }
    });
  },
  _cancelHandler(canceledEmitter, e) {
    this._cancelEmitter(canceledEmitter, e);
  },
  _cancelEmitter(emitter, e) {
    const activeEmitters = this._activeEmitters;
    if (e) {
      emitter.cancel(e);
    } else {
      emitter.reset();
    }
    emitter.removeCancelCallback();
    emitter.removeAcceptCallback();
    const emitterIndex = activeEmitters.indexOf(emitter);
    if (emitterIndex > -1) {
      activeEmitters.splice(emitterIndex, 1);
    }
  },
  _cleanEmitters(e) {
    this._applyToEmitters('end', e);
    this.reset(e);
  },
  _fetchEmitters(e) {
    this._activeEmitters = this._emittersSet.slice();
    this._applyToEmitters('start', e);
  },
  _pointerMoveHandler(e) {
    this._applyToEmitters('move', e);
  },
  _pointerUpHandler(e) {
    this._updateEmitters(e);
  },
  _mouseWheelHandler(e) {
    if (!this._allowInterruptionByMouseWheel()) {
      return;
    }
    e.pointers = [null];
    this._pointerDownHandler(e);
    this._adjustWheelEvent(e);
    this._pointerMoveHandler(e);
    e.pointers = [];
    this._pointerUpHandler(e);
  },
  _allowInterruptionByMouseWheel() {
    let allowInterruption = true;
    this._eachEmitter(emitter => {
      allowInterruption = emitter.allowInterruptionByMouseWheel() && allowInterruption;
      return allowInterruption;
    });
    return allowInterruption;
  },
  _adjustWheelEvent(e) {
    let closestGestureEmitter = null;
    // @ts-expect-error
    this._eachEmitter(emitter => {
      if (!emitter.gesture) {
        return;
      }
      const direction = emitter.getDirection(e);
      if (direction !== 'horizontal' && !e.shiftKey || direction !== 'vertical' && e.shiftKey) {
        closestGestureEmitter = emitter;
        return false;
      }
    });
    if (!closestGestureEmitter) {
      return;
    }
    const direction = closestGestureEmitter.getDirection(e);
    const verticalGestureDirection = direction === 'both' && !e.shiftKey || direction === 'vertical';
    const prop = verticalGestureDirection ? 'pageY' : 'pageX';
    e[prop] += e.delta;
  },
  isActive(element) {
    let result = false;
    this._eachEmitter(emitter => {
      result = result || emitter.getElement().is(element);
    });
    return result;
  }
});
const eventManager = new EventManager();
const EMITTER_SUBSCRIPTION_DATA = 'dxEmitterSubscription';
const registerEmitter = function (emitterConfig) {
  const EmitterClass = emitterConfig.emitter;
  const emitterName = emitterConfig.events[0];
  const emitterEvents = emitterConfig.events;
  (0, _iterator.each)(emitterEvents, (_, eventName) => {
    (0, _event_registrator.default)(eventName, {
      noBubble: !emitterConfig.bubble,
      setup(element) {
        const subscriptions = (0, _element_data.data)(element, EMITTER_SUBSCRIPTION_DATA) || {};
        const emitters = (0, _element_data.data)(element, EMITTER_DATA) || {};
        const emitter = emitters[emitterName] || new EmitterClass(element);
        subscriptions[eventName] = true;
        emitters[emitterName] = emitter;
        (0, _element_data.data)(element, EMITTER_DATA, emitters);
        (0, _element_data.data)(element, EMITTER_SUBSCRIPTION_DATA, subscriptions);
      },
      add(element, handleObj) {
        const emitters = (0, _element_data.data)(element, EMITTER_DATA);
        const emitter = emitters[emitterName];
        emitter.configure((0, _extend.extend)({
          delegateSelector: handleObj.selector
        }, handleObj.data), handleObj.type);
      },
      teardown(element) {
        const subscriptions = (0, _element_data.data)(element, EMITTER_SUBSCRIPTION_DATA);
        const emitters = (0, _element_data.data)(element, EMITTER_DATA);
        const emitter = emitters[emitterName];
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete subscriptions[eventName];
        let disposeEmitter = true;
        (0, _iterator.each)(emitterEvents, (_, eventName) => {
          disposeEmitter = disposeEmitter && !subscriptions[eventName];
          return disposeEmitter;
        });
        if (disposeEmitter) {
          // @ts-expect-error
          if (eventManager.isActive(element)) {
            // @ts-expect-error
            eventManager.resetEmitter(emitter);
          }
          emitter && emitter.dispose();
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete emitters[emitterName];
        }
      }
    });
  });
};
var _default = exports.default = registerEmitter;
