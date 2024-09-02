/**
* DevExtreme (cjs/__internal/events/gesture/m_swipeable.js)
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
var _dom_component = _interopRequireDefault(require("../../../core/dom_component"));
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _public_component = require("../../../core/utils/public_component");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _swipe = require("../../../events/swipe");
var _index = require("../../../events/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DX_SWIPEABLE = 'dxSwipeable';
const SWIPEABLE_CLASS = 'dx-swipeable';
const ACTION_TO_EVENT_MAP = {
  onStart: _swipe.start,
  onUpdated: _swipe.swipe,
  onEnd: _swipe.end,
  onCancel: 'dxswipecancel'
};
const IMMEDIATE_TIMEOUT = 180;
// @ts-expect-error
const Swipeable = _dom_component.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      elastic: true,
      immediate: false,
      immediateTimeout: IMMEDIATE_TIMEOUT,
      direction: 'horizontal',
      itemSizeFunc: null,
      onStart: null,
      onUpdated: null,
      onEnd: null,
      onCancel: null
    });
  },
  _render() {
    this.callBase();
    this.$element().addClass(SWIPEABLE_CLASS);
    this._attachEventHandlers();
  },
  _attachEventHandlers() {
    this._detachEventHandlers();
    if (this.option('disabled')) {
      return;
    }
    const {
      NAME
    } = this;
    this._createEventData();
    (0, _iterator.each)(ACTION_TO_EVENT_MAP, (actionName, eventName) => {
      const action = this._createActionByOption(actionName, {
        context: this
      });
      eventName = (0, _index.addNamespace)(eventName, NAME);
      _events_engine.default.on(this.$element(), eventName, this._eventData, e => action({
        event: e
      }));
    });
  },
  _createEventData() {
    this._eventData = {
      elastic: this.option('elastic'),
      itemSizeFunc: this.option('itemSizeFunc'),
      direction: this.option('direction'),
      immediate: this.option('immediate'),
      immediateTimeout: this.option('immediateTimeout')
    };
  },
  _detachEventHandlers() {
    _events_engine.default.off(this.$element(), `.${DX_SWIPEABLE}`);
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'disabled':
      case 'onStart':
      case 'onUpdated':
      case 'onEnd':
      case 'onCancel':
      case 'elastic':
      case 'immediate':
      case 'itemSizeFunc':
      case 'direction':
        this._detachEventHandlers();
        this._attachEventHandlers();
        break;
      case 'rtlEnabled':
        break;
      default:
        this.callBase(args);
    }
  },
  _useTemplates() {
    return false;
  }
});
(0, _public_component.name)(Swipeable, DX_SWIPEABLE);
var _default = exports.default = Swipeable;
