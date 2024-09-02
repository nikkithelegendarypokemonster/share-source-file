/**
* DevExtreme (cjs/__internal/pager/pager.js)
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
exports.Pager = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _render_utils = require("../core/r1/utils/render_utils");
var _pager_props = require("./common/pager_props");
var _content = require("./content");
var _resizable_container = require("./resizable_container");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class Pager extends _inferno2.InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.__getterCache = {};
    this.pageIndexChangedInternal = this.pageIndexChangedInternal.bind(this);
    this.pageSizeChangedInternal = this.pageSizeChangedInternal.bind(this);
  }
  createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  }
  pageIndexChangedInternal(newPageIndex) {
    const newValue = this.props.gridCompatibility ? newPageIndex + 1 : newPageIndex;
    this.setState(() => ({
      pageIndex: newValue
    }));
    this.props.pageIndexChangedInternal(newValue);
  }
  getPageIndex() {
    if (this.props.gridCompatibility) {
      return this.props.pageIndex - 1;
    }
    return this.props.pageIndex;
  }
  pageSizeChangedInternal(newPageSize) {
    this.setState(() => ({
      pageSize: newPageSize
    }));
    this.props.pageSizeChangedInternal(newPageSize);
  }
  getClassName() {
    if (this.props.gridCompatibility) {
      return (0, _render_utils.combineClasses)({
        'dx-datagrid-pager': true,
        [`${this.props.className}`]: !!this.props.className
      });
    }
    return this.props.className;
  }
  getPagerProps() {
    return _extends({}, this.props, {
      className: this.getClassName(),
      pageIndex: this.getPageIndex(),
      // eslint-disable-next-line max-len
      pageIndexChangedInternal: pageIndex => this.pageIndexChangedInternal(pageIndex),
      pageSizeChangedInternal: pageSize => this.pageSizeChangedInternal(pageSize)
    });
  }
  render() {
    return (0, _inferno.createComponentVNode)(2, _resizable_container.ResizableContainer, {
      "contentTemplate": _content.PagerContent,
      "pagerProps": this.getPagerProps()
    });
  }
}
exports.Pager = Pager;
Pager.defaultProps = _pager_props.PagerDefaultProps;
