import GlobalConfig from '../../core/config';
import devices from '../../core/devices';
import { each } from '../../core/utils/iterator';
import * as support from '../../core/utils/support';
import registerEvent from '../../events/core/event_registrator';
import MouseStrategy from '../../events/pointer/mouse';
import MouseAndTouchStrategy from '../../events/pointer/mouse_and_touch';
import TouchStrategy from '../../events/pointer/touch';
const getStrategy = (support, _ref) => {
  let {
    tablet,
    phone
  } = _ref;
  const pointerEventStrategy = getStrategyFromGlobalConfig();
  if (pointerEventStrategy) {
    return pointerEventStrategy;
  }
  if (support.touch && !(tablet || phone)) {
    return MouseAndTouchStrategy;
  }
  if (support.touch) {
    return TouchStrategy;
  }
  return MouseStrategy;
};
// @ts-expect-error
const EventStrategy = getStrategy(support, devices.real());
each(EventStrategy.map, (pointerEvent, originalEvents) => {
  registerEvent(pointerEvent, new EventStrategy(pointerEvent, originalEvents));
});
const pointer = {
  down: 'dxpointerdown',
  up: 'dxpointerup',
  move: 'dxpointermove',
  cancel: 'dxpointercancel',
  enter: 'dxpointerenter',
  leave: 'dxpointerleave',
  over: 'dxpointerover',
  out: 'dxpointerout'
};
function getStrategyFromGlobalConfig() {
  const eventStrategyName = GlobalConfig().pointerEventStrategy;
  return {
    'mouse-and-touch': MouseAndTouchStrategy,
    touch: TouchStrategy,
    mouse: MouseStrategy
    // @ts-expect-error
  }[eventStrategyName];
}
export default pointer;