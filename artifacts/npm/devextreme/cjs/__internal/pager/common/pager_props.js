/**
* DevExtreme (cjs/__internal/pager/common/pager_props.js)
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
exports.PagerDefaultProps = void 0;
var _base_pager_props = require("./base_pager_props");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const PagerDefaultProps = exports.PagerDefaultProps = _extends({}, _base_pager_props.BasePagerDefaultProps, {
  pageSize: 5,
  pageIndex: 1,
  pageIndexChangedInternal: () => {},
  pageSizeChangedInternal: () => {}
});
