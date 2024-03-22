/**
* DevExtreme (cjs/__internal/grids/grid_core/views/utils/update_views_borders.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateViewsBorders = void 0;
var _type = require("../../../../../core/utils/type");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const CLASSES = {
  borderedTop: 'dx-bordered-top-view',
  borderedBottom: 'dx-bordered-bottom-view'
};
const getFirstVisibleViewElement = _ref => {
  let {
    columnHeadersView,
    rowsView
  } = _ref;
  if (columnHeadersView === null || columnHeadersView === void 0 ? void 0 : columnHeadersView.isVisible()) {
    return columnHeadersView.element();
  }
  return rowsView.element();
};
const getLastVisibleViewElement = _ref2 => {
  let {
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
const getViewElementWithClass = (viewsWithBorder, className) => {
  var _a;
  const borderedView = Object.values(viewsWithBorder).find(view => {
    var _a;
    return (_a = view === null || view === void 0 ? void 0 : view.element()) === null || _a === void 0 ? void 0 : _a.hasClass(className);
  });
  return (_a = borderedView === null || borderedView === void 0 ? void 0 : borderedView.element()) !== null && _a !== void 0 ? _a : null;
};
const shouldUpdateBorders = (viewName, viewsWithBorder) => {
  var _a;
  if (!Object.keys(viewsWithBorder).includes(viewName)) {
    return false;
  }
  const {
      rowsView
    } = viewsWithBorder,
    otherViews = __rest(viewsWithBorder, ["rowsView"]);
  if (!(0, _type.isDefined)((_a = rowsView === null || rowsView === void 0 ? void 0 : rowsView.element) === null || _a === void 0 ? void 0 : _a.call(rowsView))) {
    return false;
  }
  return Object.values(otherViews).filter(view => {
    var _a;
    return (_a = view === null || view === void 0 ? void 0 : view.isVisible) === null || _a === void 0 ? void 0 : _a.call(view);
  }).every(view => (0, _type.isDefined)(view === null || view === void 0 ? void 0 : view.element()));
};
const updateViewsBorders = (viewName, viewsWithBorder) => {
  if (!shouldUpdateBorders(viewName, viewsWithBorder)) {
    return;
  }
  const $oldFirst = getViewElementWithClass(viewsWithBorder, CLASSES.borderedTop);
  const $oldLast = getViewElementWithClass(viewsWithBorder, CLASSES.borderedBottom);
  const $newFirst = getFirstVisibleViewElement(viewsWithBorder);
  const $newLast = getLastVisibleViewElement(viewsWithBorder);
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
exports.updateViewsBorders = updateViewsBorders;
