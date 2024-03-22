/**
* DevExtreme (cjs/ui/grid_core/ui.grid_core.virtual_columns.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _m_virtual_columns = require("../../__internal/grids/grid_core/virtual_columns/m_virtual_columns");
Object.keys(_m_virtual_columns).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_virtual_columns[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_virtual_columns[key];
    }
  });
});
