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