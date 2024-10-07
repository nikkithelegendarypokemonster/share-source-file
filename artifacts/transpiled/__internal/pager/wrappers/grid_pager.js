"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridPagerWrapper = void 0;
var _component_wrapper = require("../../core/r1/component_wrapper");
var _validation_utils = require("../utils/validation_utils");
const _excluded = ["pageSize", "pageIndex", "totalCount"];
/* eslint-disable @typescript-eslint/ban-types */
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
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
  _validateOptions(options) {
    if (options._skipValidation || this.option('_skipValidation')) {
      return options;
    }
    const initialOptions = super._validateOptions(options);
    let {
        pageSize,
        pageIndex,
        totalCount
        // eslint-disable-next-line prefer-const
      } = initialOptions,
      rest = _objectWithoutPropertiesLoose(initialOptions, _excluded);
    if (pageSize === undefined) {
      pageSize = this.option('pageSize');
    }
    if (pageIndex === undefined) {
      pageIndex = this.option('pageIndex');
    }
    if (totalCount === undefined) {
      totalCount = this.option('totalCount');
    }
    const validatedOptions = (0, _validation_utils.validateOptions)(pageSize, pageIndex, totalCount);
    return _extends({}, rest, validatedOptions);
  }
}
exports.GridPagerWrapper = GridPagerWrapper;