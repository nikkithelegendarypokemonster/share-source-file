/**
* DevExtreme (esm/__internal/ui/text_box/m_utils.scroll.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import $ from '../../../core/renderer';
import { isDxMouseWheelEvent } from '../../../events/utils/index';
// @ts-expect-error
const allowScroll = function (container, delta, shiftKey) {
  const $container = $(container);
  const scrollTopPos = shiftKey ? $container.scrollLeft() : $container.scrollTop();
  const prop = shiftKey ? 'Width' : 'Height';
  // @ts-expect-error
  const scrollSize = $container.prop(`scroll${prop}`);
  // @ts-expect-error
  const clientSize = $container.prop(`client${prop}`);
  // @ts-expect-error
  // NOTE: round to the nearest integer towards zero
  const scrollBottomPos = scrollSize - clientSize - scrollTopPos | 0;
  // @ts-expect-error
  if (scrollTopPos === 0 && scrollBottomPos === 0) {
    return false;
  }
  // @ts-expect-error
  const isScrollFromTop = scrollTopPos === 0 && delta >= 0;
  const isScrollFromBottom = scrollBottomPos === 0 && delta <= 0;
  // @ts-expect-error
  const isScrollFromMiddle = scrollTopPos > 0 && scrollBottomPos > 0;
  if (isScrollFromTop || isScrollFromBottom || isScrollFromMiddle) {
    return true;
  }
};
const prepareScrollData = function (container, validateTarget) {
  const $container = $(container);
  const isCorrectTarget = function (eventTarget) {
    return validateTarget ? $(eventTarget).is(container) : true;
  };
  return {
    // @ts-expect-error
    validate(e) {
      if (isDxMouseWheelEvent(e) && isCorrectTarget(e.target)) {
        if (allowScroll($container, -e.delta, e.shiftKey)) {
          e._needSkipEvent = true;
          return true;
        }
        return false;
      }
    }
  };
};
export { allowScroll, prepareScrollData };
