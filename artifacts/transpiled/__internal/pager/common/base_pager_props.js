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