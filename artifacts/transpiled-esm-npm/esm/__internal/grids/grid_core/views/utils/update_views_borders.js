var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { isDefined } from '../../../../../core/utils/type';
var CLASSES = {
  borderedTop: 'dx-bordered-top-view',
  borderedBottom: 'dx-bordered-bottom-view'
};
var getFirstVisibleViewElement = _ref => {
  var {
    columnHeadersView,
    rowsView
  } = _ref;
  if (columnHeadersView === null || columnHeadersView === void 0 ? void 0 : columnHeadersView.isVisible()) {
    return columnHeadersView.element();
  }
  return rowsView.element();
};
var getLastVisibleViewElement = _ref2 => {
  var {
    filterPanelView,
    footerView,
    rowsView
  } = _ref2;
  if (filterPanelView === null || filterPanelView === void 0 ? void 0 : filterPanelView.isVisible()) {
    return filterPanelView.element();
  }
  if (footerView === null || footerView === void 0 ? void 0 : footerView.isVisible()) {
    return footerView.element();
  }
  return rowsView.element();
};
var getViewElementWithClass = (viewsWithBorder, className) => {
  var _a;
  var borderedView = Object.values(viewsWithBorder).find(view => {
    var _a;
    return (_a = view === null || view === void 0 ? void 0 : view.element()) === null || _a === void 0 ? void 0 : _a.hasClass(className);
  });
  return (_a = borderedView === null || borderedView === void 0 ? void 0 : borderedView.element()) !== null && _a !== void 0 ? _a : null;
};
var shouldUpdateBorders = (viewName, viewsWithBorder) => {
  var _a;
  if (!Object.keys(viewsWithBorder).includes(viewName)) {
    return false;
  }
  var {
      rowsView
    } = viewsWithBorder,
    otherViews = __rest(viewsWithBorder, ["rowsView"]);
  if (!isDefined((_a = rowsView === null || rowsView === void 0 ? void 0 : rowsView.element) === null || _a === void 0 ? void 0 : _a.call(rowsView))) {
    return false;
  }
  return Object.values(otherViews).filter(view => {
    var _a;
    return (_a = view === null || view === void 0 ? void 0 : view.isVisible) === null || _a === void 0 ? void 0 : _a.call(view);
  }).every(view => isDefined(view === null || view === void 0 ? void 0 : view.element()));
};
export var updateViewsBorders = (viewName, viewsWithBorder) => {
  if (!shouldUpdateBorders(viewName, viewsWithBorder)) {
    return;
  }
  var $oldFirst = getViewElementWithClass(viewsWithBorder, CLASSES.borderedTop);
  var $oldLast = getViewElementWithClass(viewsWithBorder, CLASSES.borderedBottom);
  var $newFirst = getFirstVisibleViewElement(viewsWithBorder);
  var $newLast = getLastVisibleViewElement(viewsWithBorder);
  // @ts-expect-error The dxElementWrapper's "is" method is badly typed.
  if ($oldFirst && !$oldFirst.is($newFirst)) {
    $oldFirst.removeClass(CLASSES.borderedTop);
  }
  // @ts-expect-error The dxElementWrapper's "is" method is badly typed.
  if ($oldLast && !$oldLast.is($newLast)) {
    $oldLast.removeClass(CLASSES.borderedBottom);
  }
  if (!$newFirst.hasClass(CLASSES.borderedTop)) {
    $newFirst.addClass(CLASSES.borderedTop);
  }
  if (!$newLast.hasClass(CLASSES.borderedBottom)) {
    $newLast.addClass(CLASSES.borderedBottom);
  }
};