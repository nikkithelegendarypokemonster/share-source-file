/**
* DevExtreme (cjs/__internal/pager/common/base_pager_props.js)
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
exports.BasePagerDefaultProps = void 0;
var _message = _interopRequireDefault(require("../../../localization/message"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const BasePagerDefaultProps = exports.BasePagerDefaultProps = {
  gridCompatibility: true,
  showInfo: false,
  displayMode: 'adaptive',
  maxPagesCount: 10,
  pageCount: 10,
  visible: true,
  hasKnownLastPage: true,
  pagesNavigatorVisible: 'auto',
  showPageSizes: true,
  pageSizes: [5, 10],
  showNavigationButtons: false,
  totalCount: 0,
  label: _message.default.format('dxPager-ariaLabel')
};
