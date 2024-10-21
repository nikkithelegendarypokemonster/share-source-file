"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PAGER_INFO_CLASS = exports.InfoText = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _string = require("../../core/utils/string");
var _message = _interopRequireDefault(require("../../localization/message"));
var _pager_props = require("./common/pager_props");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const PAGER_INFO_CLASS = exports.PAGER_INFO_CLASS = 'dx-info';
const InfoTextDefaultProps = {
  pageCount: _pager_props.PagerDefaultProps.pageCount,
  pageIndex: _pager_props.PagerDefaultProps.pageIndex,
  itemCount: _pager_props.PagerDefaultProps.itemCount
};
class InfoText extends _inferno2.BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this.state = {};
    this.refs = null;
    // eslint-disable-next-line max-len
    this.rootElementRef = (0, _inferno.createRef)();
  }
  getInfoText() {
    return this.props.infoText ?? _message.default.getFormatter('dxPager-infoText')();
  }
  getText() {
    const {
      pageCount,
      pageIndex,
      itemCount
    } = this.props;
    return (0, _string.format)(this.getInfoText(), (pageIndex + 1).toString(), pageCount === null || pageCount === void 0 ? void 0 : pageCount.toString(), itemCount === null || itemCount === void 0 ? void 0 : itemCount.toString());
  }
  render() {
    return (0, _inferno.createVNode)(1, "div", PAGER_INFO_CLASS, this.getText(), 0, null, null, this.props.rootElementRef);
  }
}
exports.InfoText = InfoText;
InfoText.defaultProps = InfoTextDefaultProps;