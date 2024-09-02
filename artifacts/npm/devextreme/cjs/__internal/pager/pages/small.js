/**
* DevExtreme (cjs/__internal/pager/pages/small.js)
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
exports.PagesSmall = exports.PagerSmallDefaultProps = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _pager_props = require("../common/pager_props");
var _number_box = require("../editors/number_box");
var _info = require("../info");
var _calculate_values_fitted_width = require("../utils/calculate_values_fitted_width");
var _get_element_width = require("../utils/get_element_width");
var _page = require("./page");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

const PAGER_INFO_TEXT_CLASS = `${_info.PAGER_INFO_CLASS}  dx-info-text`;
const PAGER_PAGE_INDEX_CLASS = 'dx-page-index';
const LIGHT_PAGES_CLASS = 'dx-light-pages';
const PAGER_PAGES_COUNT_CLASS = 'dx-pages-count';
const PagerSmallDefaultProps = exports.PagerSmallDefaultProps = {
  inputAttr: {
    'aria-label': _message.default.format('dxPager-ariaPageNumber')
  },
  pageIndex: _pager_props.PagerDefaultProps.pageIndex,
  pageCount: _pager_props.PagerDefaultProps.pageCount,
  pageIndexChangedInternal: _pager_props.PagerDefaultProps.pageIndexChangedInternal
};
class PagesSmall extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {
      minWidth: 10
    };
    this.refs = null;
    this.pageIndexRef = (0, _inferno.createRef)();
    this.updateWidth = this.updateWidth.bind(this);
    this.selectLastPageIndex = this.selectLastPageIndex.bind(this);
    this.valueChange = this.valueChange.bind(this);
  }
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate(nextProps, nextState, context);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.updateWidth, [this.state.minWidth])];
  }
  updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.state.minWidth]);
  }
  updateWidth() {
    var _this$pageIndexRef$cu;
    const el = (_this$pageIndexRef$cu = this.pageIndexRef.current) === null || _this$pageIndexRef$cu === void 0 ? void 0 : _this$pageIndexRef$cu.querySelector(`.${PAGER_PAGE_INDEX_CLASS}`);
    this.setState(state => ({
      minWidth: el && (0, _get_element_width.getElementMinWidth)(el) || state.minWidth
    }));
  }
  getValue() {
    return this.props.pageIndex + 1;
  }
  getWidth() {
    return (0, _calculate_values_fitted_width.calculateValuesFittedWidth)(this.state.minWidth, [this.props.pageCount]);
  }
  getPagesCountText() {
    return (this.props.pagesCountText ?? '') || _message.default.getFormatter('dxPager-pagesCountText')();
  }
  selectLastPageIndex() {
    this.props.pageIndexChangedInternal(this.props.pageCount - 1);
  }
  valueChange(value) {
    this.props.pageIndexChangedInternal(value - 1);
  }
  render() {
    return (0, _inferno.createVNode)(1, "div", LIGHT_PAGES_CLASS, [(0, _inferno.createComponentVNode)(2, _number_box.NumberBox, {
      "className": PAGER_PAGE_INDEX_CLASS,
      "min": 1,
      "max": Math.max(this.props.pageCount, this.getValue()),
      "width": this.getWidth(),
      "value": this.getValue(),
      "valueChange": this.valueChange,
      "inputAttr": this.props.inputAttr
    }), (0, _inferno.createVNode)(1, "span", PAGER_INFO_TEXT_CLASS, this.getPagesCountText(), 0), (0, _inferno.createComponentVNode)(2, _page.Page, {
      "className": PAGER_PAGES_COUNT_CLASS,
      "selected": false,
      "index": this.props.pageCount - 1,
      "onClick": this.selectLastPageIndex
    })], 4, null, null, this.pageIndexRef);
  }
}
exports.PagesSmall = PagesSmall;
PagesSmall.defaultProps = PagerSmallDefaultProps;
