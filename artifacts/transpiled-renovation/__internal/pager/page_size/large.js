"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageSizeLargeDefaultProps = exports.PageSizeLarge = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _string = require("../../../core/utils/string");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _render_utils = require("../../core/r1/utils/render_utils");
var _consts = require("../common/consts");
var _light_button = require("../common/light_button");
var _pager_props = require("../common/pager_props");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

const PageSizeLargeDefaultProps = exports.PageSizeLargeDefaultProps = {
  pageSizes: [],
  pageSize: _pager_props.PagerDefaultProps.pageSize,
  pageSizeChangedInternal: _pager_props.PagerDefaultProps.pageSizeChangedInternal
};
class PageSizeLarge extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.refs = null;
    this.__getterCache = {
      pageSizesText: undefined
    };
    this.state = {};
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
  }
  getPageSizesText() {
    if (this.__getterCache.pageSizesText !== undefined) {
      return this.__getterCache.pageSizesText;
    }
    const result = (() => {
      const {
        pageSize,
        pageSizes
      } = this.props;
      return pageSizes.map((_ref3, index) => {
        const {
          text,
          value: processedPageSize
        } = _ref3;
        const selected = processedPageSize === pageSize;
        const className = (0, _render_utils.combineClasses)({
          [selected ? _consts.PAGER_SELECTED_PAGE_SIZE_CLASS : _consts.PAGER_PAGE_SIZE_CLASS]: true,
          [_consts.FIRST_CHILD_CLASS]: index === 0
        });
        return {
          className,
          click: this.onPageSizeChange(processedPageSize),
          label: (0, _string.format)(_message.default.getFormatter('dxPager-pageSize'), processedPageSize || _message.default.getFormatter('dxPager-pageSizesAllText')),
          text
        };
      });
    })();
    this.__getterCache.pageSizesText = result;
    return result;
  }
  onPageSizeChange(processedPageSize) {
    return () => {
      this.props.pageSizeChangedInternal(processedPageSize);
      return this.props.pageSize;
    };
  }
  componentWillUpdate(nextProps) {
    const componentChanged = this.props.pageSize !== nextProps.pageSize || this.props.pageSizes !== nextProps.pageSizes || this.props.pageSizeChangedInternal !== nextProps.pageSizeChangedInternal;
    if (componentChanged) {
      this.__getterCache.pageSizesText = undefined;
    }
  }
  render() {
    return (0, _inferno.createFragment)(this.getPageSizesText().map(_ref => {
      let {
        text,
        className,
        label,
        click
      } = _ref;
      return (0, _inferno.createComponentVNode)(2, _light_button.LightButton, {
        "className": className,
        "label": label,
        "onClick": click,
        children: text
      }, text);
    }), 0);
  }
}
exports.PageSizeLarge = PageSizeLarge;
PageSizeLarge.defaultProps = PageSizeLargeDefaultProps;