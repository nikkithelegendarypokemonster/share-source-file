import { getWindow, hasWindow } from '../../core/utils/window';
import { isDefined } from '../../core/utils/type';
import domAdapter from '../../core/dom_adapter';
import devices from '../../core/devices';
import { noop } from '../../core/utils/common';
var overflowManagerMock = {
  setOverflow: noop,
  restoreOverflow: noop
};
export var createBodyOverflowManager = () => {
  if (!hasWindow()) {
    return overflowManagerMock;
  }
  var window = getWindow();
  var documentElement = domAdapter.getDocument().documentElement;
  var body = domAdapter.getBody();
  var isIosDevice = devices.real().platform === 'ios';
  var prevSettings = {
    overflow: null,
    overflowX: null,
    overflowY: null,
    paddingRight: null,
    position: null,
    top: null,
    left: null
  };
  var setBodyPositionFixed = () => {
    if (isDefined(prevSettings.position) || body.style.position === 'fixed') {
      return;
    }
    var {
      scrollY,
      scrollX
    } = window;
    prevSettings.position = body.style.position;
    prevSettings.top = body.style.top;
    prevSettings.left = body.style.left;
    body.style.setProperty('position', 'fixed');
    body.style.setProperty('top', "".concat(-scrollY, "px"));
    body.style.setProperty('left', "".concat(-scrollX, "px"));
  };
  var restoreBodyPositionFixed = () => {
    if (!isDefined(prevSettings.position)) {
      return;
    }
    var scrollY = -parseInt(body.style.top, 10);
    var scrollX = -parseInt(body.style.left, 10);
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
  var setBodyOverflow = () => {
    setBodyPaddingRight();
    if (prevSettings.overflow || body.style.overflow === 'hidden') {
      return;
    }
    prevSettings.overflow = body.style.overflow;
    prevSettings.overflowX = body.style.overflowX;
    prevSettings.overflowY = body.style.overflowY;
    body.style.setProperty('overflow', 'hidden');
  };
  var restoreBodyOverflow = () => {
    restoreBodyPaddingRight();
    ['overflow', 'overflowX', 'overflowY'].forEach(property => {
      if (!isDefined(prevSettings[property])) {
        return;
      }
      var propertyInKebabCase = property.replace(/(X)|(Y)/, symbol => "-".concat(symbol.toLowerCase()));
      if (prevSettings[property]) {
        body.style.setProperty(propertyInKebabCase, prevSettings[property]);
      } else {
        body.style.removeProperty(propertyInKebabCase);
      }
      prevSettings[property] = null;
    });
  };
  var setBodyPaddingRight = () => {
    var scrollBarWidth = window.innerWidth - documentElement.clientWidth;
    if (prevSettings.paddingRight || scrollBarWidth <= 0) {
      return;
    }
    var paddingRight = window.getComputedStyle(body).getPropertyValue('padding-right');
    var computedBodyPaddingRight = parseInt(paddingRight, 10);
    prevSettings.paddingRight = computedBodyPaddingRight;
    body.style.setProperty('padding-right', "".concat(computedBodyPaddingRight + scrollBarWidth, "px"));
  };
  var restoreBodyPaddingRight = () => {
    if (!isDefined(prevSettings.paddingRight)) {
      return;
    }
    if (prevSettings.paddingRight) {
      body.style.setProperty('padding-right', "".concat(prevSettings.paddingRight, "px"));
    } else {
      body.style.removeProperty('padding-right');
    }
    prevSettings.paddingRight = null;
  };
  return {
    setOverflow: isIosDevice ? setBodyPositionFixed : setBodyOverflow,
    restoreOverflow: isIosDevice ? restoreBodyPositionFixed : restoreBodyOverflow
  };
};