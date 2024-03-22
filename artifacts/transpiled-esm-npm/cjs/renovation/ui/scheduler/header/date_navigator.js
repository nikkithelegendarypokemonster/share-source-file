"use strict";

exports.getDateNavigator = void 0;
var _themes = require("../../../../ui/themes");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DATE_NAVIGATOR_CLASS = 'dx-scheduler-navigator';
const PREVIOUS_BUTTON_CLASS = 'dx-scheduler-navigator-previous';
const CALENDAR_BUTTON_CLASS = 'dx-scheduler-navigator-caption';
const NEXT_BUTTON_CLASS = 'dx-scheduler-navigator-next';
const DIRECTION_LEFT = -1;
const DIRECTION_RIGHT = 1;
const getPreviousButtonOptions = isPreviousButtonDisabled => ({
  icon: 'chevronprev',
  elementAttr: {
    class: PREVIOUS_BUTTON_CLASS
  },
  disabled: isPreviousButtonDisabled
});
const getCalendarButtonOptions = captionText => ({
  text: captionText,
  elementAttr: {
    class: CALENDAR_BUTTON_CLASS
  }
});
const getNextButtonOptions = isNextButtonDisabled => ({
  icon: 'chevronnext',
  elementAttr: {
    class: NEXT_BUTTON_CLASS
  },
  disabled: isNextButtonDisabled
});
const getDateNavigator = (item, showCalendar, captionText, updateDateByDirection, isPreviousButtonDisabled, isNextButtonDisabled) => {
  const items = [getPreviousButtonOptions(isPreviousButtonDisabled), getCalendarButtonOptions(captionText), getNextButtonOptions(isNextButtonDisabled)];
  const stylingMode = (0, _themes.isMaterial)((0, _themes.current)()) ? 'text' : 'contained';
  return _extends({
    widget: 'dxButtonGroup',
    cssClass: DATE_NAVIGATOR_CLASS,
    options: {
      items,
      stylingMode,
      selectionMode: 'none',
      onItemClick: e => {
        switch (e.itemIndex) {
          case 0:
            updateDateByDirection(DIRECTION_LEFT);
            break;
          case 1:
            showCalendar();
            break;
          case 2:
            updateDateByDirection(DIRECTION_RIGHT);
            break;
          default:
            break;
        }
      }
    }
  }, item);
};
exports.getDateNavigator = getDateNavigator;