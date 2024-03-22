"use strict";

exports.PagerProps = exports.InternalPagerProps = void 0;
var _base_pager_props = require("./base_pager_props");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const PagerProps = exports.PagerProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_base_pager_props.BasePagerProps), Object.getOwnPropertyDescriptors({
  defaultPageSize: 5,
  pageSizeChange: () => {},
  defaultPageIndex: 1,
  pageIndexChange: () => {}
})));
const InternalPagerProps = exports.InternalPagerProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_base_pager_props.BasePagerProps), Object.getOwnPropertyDescriptors({
  pageSize: 5,
  pageIndex: 1
})));