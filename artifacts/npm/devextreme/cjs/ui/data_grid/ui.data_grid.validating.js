/**
* DevExtreme (cjs/ui/data_grid/ui.data_grid.validating.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _validating = require("../../__internal/grids/data_grid/module_not_extended/validating");
Object.keys(_validating).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _validating[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _validating[key];
    }
  });
});
