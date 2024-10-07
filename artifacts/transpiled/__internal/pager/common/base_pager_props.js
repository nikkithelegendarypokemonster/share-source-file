"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasePagerDefaultProps = void 0;
var _message = _interopRequireDefault(require("../../../localization/message"));
var _base_props = require("../base_props");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const BasePagerDefaultProps = exports.BasePagerDefaultProps = _extends({}, _base_props.BaseWidgetDefaultProps, {
  gridCompatibility: true,
  showInfo: false,
  displayMode: 'adaptive',
  maxPagesCount: 10,
  pageCount: 1,
  visible: true,
  hasKnownLastPage: true,
  pagesNavigatorVisible: 'auto',
  showPageSizeSelector: true,
  allowedPageSizes: [5, 10],
  showNavigationButtons: false,
  totalCount: 1,
  label: _message.default.format('dxPager-ariaLabel')
});