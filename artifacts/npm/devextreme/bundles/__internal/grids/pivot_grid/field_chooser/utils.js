/**
* DevExtreme (bundles/__internal/grids/pivot_grid/field_chooser/utils.js)
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
exports.reverseSortOrder = void 0;
var _const = require("./const");
const reverseSortOrder = sortOrder => sortOrder === _const.SORT_ORDER.descending ? _const.SORT_ORDER.ascending : _const.SORT_ORDER.descending;
exports.reverseSortOrder = reverseSortOrder;
