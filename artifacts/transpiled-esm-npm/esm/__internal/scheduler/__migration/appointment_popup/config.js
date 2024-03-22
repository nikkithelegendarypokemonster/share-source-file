import _extends from "@babel/runtime/helpers/esm/extends";
import devices from '../../../../core/devices';
import { getWidth } from '../../../../core/utils/size';
import { getWindow } from '../../../../core/utils/window';
import messageLocalization from '../../../../localization/message';
export var POPUP_WIDTH = {
  DEFAULT: 485,
  RECURRENCE: 970,
  FULLSCREEN: 1000,
  MOBILE: {
    DEFAULT: 350,
    FULLSCREEN: 500
  }
};
export var defaultAnimation = {
  show: {
    type: 'pop',
    duration: 300,
    from: {
      scale: 0.55
    }
  },
  hide: {
    type: 'pop',
    duration: 300,
    to: {
      opacity: 0,
      scale: 0.55
    },
    from: {
      opacity: 1,
      scale: 1
    }
  }
};
var isMobile = () => devices.current().deviceType !== 'desktop';
var isIOSPlatform = () => devices.current().platform === 'ios';
var TOOLBAR_LOCATION = {
  AFTER: 'after',
  BEFORE: 'before'
};
var getButtonsConfig = () => ({
  doneButton: {
    shortcut: 'done',
    options: {
      text: messageLocalization.format('Done')
    },
    location: TOOLBAR_LOCATION.AFTER
  },
  cancelButton: {
    shortcut: 'cancel',
    location: isIOSPlatform() ? TOOLBAR_LOCATION.BEFORE : TOOLBAR_LOCATION.AFTER
  }
});
export var getPopupToolbarItems = (allowUpdating, doneClick) => {
  var result = [];
  var buttonsConfig = getButtonsConfig();
  if (allowUpdating) {
    result.push(_extends(_extends({}, buttonsConfig.doneButton), {
      onClick: doneClick
    }));
  }
  result.push(buttonsConfig.cancelButton);
  return result;
};
export var isPopupFullScreenNeeded = () => {
  var window = getWindow();
  var width = window && getWidth(window);
  if (width) {
    return isMobile() ? width < POPUP_WIDTH.MOBILE.FULLSCREEN : width < POPUP_WIDTH.FULLSCREEN;
  }
  return false;
};
export var getMaxWidth = isRecurrence => {
  if (isMobile()) {
    return POPUP_WIDTH.MOBILE.DEFAULT;
  }
  return isRecurrence ? POPUP_WIDTH.RECURRENCE : POPUP_WIDTH.DEFAULT;
};
export var getPopupSize = isRecurrence => ({
  fullScreen: isPopupFullScreenNeeded(),
  maxWidth: getMaxWidth(isRecurrence)
});