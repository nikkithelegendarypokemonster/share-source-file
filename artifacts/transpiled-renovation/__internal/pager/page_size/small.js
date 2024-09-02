"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageSizeSmall = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _pager_props = require("../common/pager_props");
var _select_box = require("../drop_down_editors/select_box");
var _calculate_values_fitted_width = require("../utils/calculate_values_fitted_width");
var _get_element_width = require("../utils/get_element_width");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const PagerSmallDefaultProps = {
  inputAttr: {
    'aria-label': _message.default.format('dxPager-ariaPageSize')
  },
  pageSizes: []
};
const PageSizeSmallDefaultProps = _extends({}, PagerSmallDefaultProps, {
  pageSize: _pager_props.PagerDefaultProps.pageSize,
  pageSizeChangedInternal: _pager_props.PagerDefaultProps.pageSizeChangedInternal
});
class PageSizeSmall extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {
      minWidth: 10
    };
    this.refs = null;
    this.updateWidth = this.updateWidth.bind(this);
  }
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate(nextProps, nextState, context);
  }
  createEffects() {
    const dependency = [this.props, this.state.minWidth, this.props.pageSize, this.props.pageSizeChangedInternal, this.props.pageSizes, this.props.inputAttr];
    return [new _inferno2.InfernoEffect(this.updateWidth, dependency)];
  }
  updateEffects() {
    var _this$_effects$;
    const dependency = [this.props, this.state.minWidth, this.props.pageSize, this.props.pageSizeChangedInternal, this.props.pageSizes, this.props.inputAttr];
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update(dependency);
  }
  updateWidth() {
    this.setState(state => {
      var _this$props$parentRef;
      return {
        minWidth: (0, _get_element_width.getElementMinWidth)((_this$props$parentRef = this.props.parentRef) === null || _this$props$parentRef === void 0 ? void 0 : _this$props$parentRef.current) || state.minWidth
      };
    });
  }
  getWidth() {
    var _this$props$pageSizes;
    return (0, _calculate_values_fitted_width.calculateValuesFittedWidth)(this.state.minWidth, (_this$props$pageSizes = this.props.pageSizes) === null || _this$props$pageSizes === void 0 ? void 0 : _this$props$pageSizes.map(p => p.value));
  }
  render() {
    const {
      inputAttr,
      pageSizes,
      pageSize,
      pageSizeChangedInternal
    } = this.props;
    return (0, _inferno.createComponentVNode)(2, _select_box.SelectBox, {
      "displayExpr": "text",
      "valueExpr": "value",
      "dataSource": pageSizes,
      "value": pageSize,
      "valueChange": pageSizeChangedInternal,
      "width": this.getWidth(),
      "inputAttr": inputAttr
    });
  }
}
exports.PageSizeSmall = PageSizeSmall;
PageSizeSmall.defaultProps = PageSizeSmallDefaultProps;