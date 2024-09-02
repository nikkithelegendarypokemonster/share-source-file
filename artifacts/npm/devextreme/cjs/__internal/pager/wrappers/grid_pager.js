/**
* DevExtreme (cjs/__internal/pager/wrappers/grid_pager.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridPagerWrapper = void 0;
var _component_wrapper = require("../../core/r1/component_wrapper");
/* eslint-disable @typescript-eslint/ban-types */

class GridPagerWrapper extends _component_wrapper.ComponentWrapper {
  _optionChanged(args) {
    switch (args.name) {
      case 'pageIndex':
        {
          const pageIndexChanged = this.option('pageIndexChanged');
          if (pageIndexChanged) {
            pageIndexChanged(args.value);
          }
          break;
        }
      case 'pageSize':
        {
          const pageSizeChanged = this.option('pageSizeChanged');
          if (pageSizeChanged) {
            pageSizeChanged(args.value);
          }
          break;
        }
      default:
        break;
    }
    super._optionChanged(args);
  }
}
exports.GridPagerWrapper = GridPagerWrapper;
