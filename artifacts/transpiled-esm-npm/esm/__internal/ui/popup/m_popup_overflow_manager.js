import devices from '../../../core/devices';
import domAdapter from '../../../core/dom_adapter';
import { noop } from '../../../core/utils/common';
import { isDefined } from '../../../core/utils/type';
import { getWindow, hasWindow } from '../../../core/utils/window';
const overflowManagerMock = {
  setOverflow: noop,
  restoreOverflow: noop
};
export const createBodyOverflowManager = () => {
  if (!hasWindow()) {
    return overflowManagerMock;
  }
  const window = getWindow();
  const {
    documentElement
  } = domAdapter.getDocument();
  const body = domAdapter.getBody();
  const isIosDevice = devices.real().platform === 'ios';
  const prevSettings = {
    overflow: null,
    overflowX: null,
    overflowY: null,
    paddingRight: null,
    position: null,
    top: null,
    left: null
  };
  const setBodyPositionFixed = () => {
    if (isDefined(prevSettings.position) || body.style.position === 'fixed') {
      return;
    }
    const {
      scrollY,
      scrollX
    } = window;
    prevSettings.position = body.style.position;
    prevSettings.top = body.style.top;
    prevSettings.left = body.style.left;
    body.style.setProperty('position', 'fixed');
    body.style.setProperty('top', `${-scrollY}px`);
    body.style.setProperty('left', `${-scrollX}px`);
  };
  const restoreBodyPositionFixed = () => {
    if (!isDefined(prevSettings.position)) {
      return;
    }
    const scrollY = -parseInt(body.style.top, 10);
    const scrollX = -parseInt(body.style.left, 10);
    ['position', 'top', 'left'].forEach(property => {
      if (prevSettings[property]) {
        body.style.setProperty(property, prevSettings[property]);
      } else {
        body.style.removeProperty(property);
      }
    });
    window.scrollTo(scrollX, scrollY);
    prevSettings.position = null;
  };
  const setBodyPaddingRight = () => {
    const scrollBarWidth = window.innerWidth - documentElement.clientWidth;
    if (prevSettings.paddingRight || scrollBarWidth <= 0) {
      return;
    }
    const paddingRight = window.getComputedStyle(body).getPropertyValue('padding-right');
    const computedBodyPaddingRight = parseInt(paddingRight, 10);
    prevSettings.paddingRight = computedBodyPaddingRight;
    body.style.setProperty('padding-right', `${computedBodyPaddingRight + scrollBarWidth}px`);
  };
  const setBodyOverflow = () => {
    setBodyPaddingRight();
    if (prevSettings.overflow || body.style.overflow === 'hidden') {
      return;
    }
    prevSettings.overflow = body.style.overflow;
    prevSettings.overflowX = body.style.overflowX;
    prevSettings.overflowY = body.style.overflowY;
    body.style.setProperty('overflow', 'hidden');
  };
  const restoreBodyPaddingRight = () => {
    if (!isDefined(prevSettings.paddingRight)) {
      return;
    }
    if (prevSettings.paddingRight) {
      body.style.setProperty('padding-right', `${prevSettings.paddingRight}px`);
    } else {
      body.style.removeProperty('padding-right');
    }
    prevSettings.paddingRight = null;
  };
  const restoreBodyOverflow = () => {
    restoreBodyPaddingRight();
    ['overflow', 'overflowX', 'overflowY'].forEach(property => {
      if (!isDefined(prevSettings[property])) {
        return;
      }
      const propertyInKebabCase = property.replace(/(X)|(Y)/, symbol => `-${symbol.toLowerCase()}`);
      if (prevSettings[property]) {
        body.style.setProperty(propertyInKebabCase, prevSettings[property]);
      } else {
        body.style.removeProperty(propertyInKebabCase);
      }
      prevSettings[property] = null;
    });
  };
  return {
    setOverflow: isIosDevice ? setBodyPositionFixed : setBodyOverflow,
    restoreOverflow: isIosDevice ? restoreBodyPositionFixed : restoreBodyOverflow
  };
};