/**
* DevExtreme (esm/__internal/events/gesture/m_swipeable.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DOMComponent from '../../../core/dom_component';
import { extend } from '../../../core/utils/extend';
import { each } from '../../../core/utils/iterator';
import { name } from '../../../core/utils/public_component';
import eventsEngine from '../../../events/core/events_engine';
import { end as swipeEventEnd, start as swipeEventStart, swipe as swipeEventSwipe } from '../../../events/swipe';
import { addNamespace } from '../../../events/utils/index';
const DX_SWIPEABLE = 'dxSwipeable';
const SWIPEABLE_CLASS = 'dx-swipeable';
const ACTION_TO_EVENT_MAP = {
  onStart: swipeEventStart,
  onUpdated: swipeEventSwipe,
  onEnd: swipeEventEnd,
  onCancel: 'dxswipecancel'
};
const IMMEDIATE_TIMEOUT = 180;
// @ts-expect-error
const Swipeable = DOMComponent.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
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
    each(ACTION_TO_EVENT_MAP, (actionName, eventName) => {
      const action = this._createActionByOption(actionName, {
        context: this
      });
      eventName = addNamespace(eventName, NAME);
      eventsEngine.on(this.$element(), eventName, this._eventData, e => action({
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
    eventsEngine.off(this.$element(), `.${DX_SWIPEABLE}`);
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
name(Swipeable, DX_SWIPEABLE);
export default Swipeable;
