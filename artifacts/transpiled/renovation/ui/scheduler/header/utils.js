"use strict";

exports.isMonthView = exports.isMobileLayout = exports.formatViews = exports.formToolbarItem = void 0;
var _view_switcher = require("./view_switcher");
var _date_navigator = require("./date_navigator");
var _m_utils = require("../../../../__internal/scheduler/header/m_utils");
var _devices = _interopRequireDefault(require("../../../../core/devices"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DEFAULT_ELEMENT = 'defaultElement';
const VIEW_SWITCHER = 'viewSwitcher';
const DATE_NAVIGATOR = 'dateNavigator';
const formToolbarItem = (item, options) => {
  const {
    captionText,
    isNextButtonDisabled,
    isPreviousButtonDisabled,
    selectedView,
    setCurrentView,
    showCalendar,
    updateDateByDirection,
    useDropDownViewSwitcher,
    views
  } = options;
  if (item[DEFAULT_ELEMENT]) {
    const defaultElementType = item[DEFAULT_ELEMENT];
    switch (defaultElementType) {
      case VIEW_SWITCHER:
        if (useDropDownViewSwitcher) {
          return (0, _view_switcher.getDropDownViewSwitcher)(item, selectedView, views, setCurrentView);
        }
        return (0, _view_switcher.getViewSwitcher)(item, selectedView, views, setCurrentView);
      case DATE_NAVIGATOR:
        return (0, _date_navigator.getDateNavigator)(item, showCalendar, captionText, updateDateByDirection, isPreviousButtonDisabled, isNextButtonDisabled);
      default:
        throw new Error("Unknown default item in the scheduler's toolbar");
    }
  }
  return item;
};
exports.formToolbarItem = formToolbarItem;
const formatViews = views => {
  (0, _m_utils.validateViews)(views);
  return views.map(view => {
    const text = (0, _m_utils.getViewText)(view);
    const name = (0, _m_utils.getViewName)(view);
    return {
      text,
      name
    };
  });
};
exports.formatViews = formatViews;
const isMonthView = currentView => (0, _m_utils.getViewType)(currentView) === 'month';
exports.isMonthView = isMonthView;
const isMobileLayout = () => !_devices.default.current().generic;
exports.isMobileLayout = isMobileLayout;