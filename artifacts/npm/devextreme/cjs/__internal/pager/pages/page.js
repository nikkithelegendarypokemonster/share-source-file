/**
* DevExtreme (cjs/__internal/pager/pages/page.js)
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
exports.PageDefaultProps = exports.Page = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _string = require("../../../core/utils/string");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _render_utils = require("../../core/r1/utils/render_utils");
var _consts = require("../common/consts");
var _light_button = require("../common/light_button");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/* istanbul ignore next: class has only props default */
const PageDefaultProps = exports.PageDefaultProps = {
  index: 0,
  selected: false,
  className: _consts.PAGER_PAGE_CLASS
};
class Page extends _inferno2.BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this.state = {};
    this.refs = null;
  }
  getLabel() {
    return (0, _string.format)(_message.default.getFormatter('dxPager-page'), this.getValue());
  }
  getValue() {
    return this.props.index + 1;
  }
  getClassName() {
    return (0, _render_utils.combineClasses)({
      [`${this.props.className}`]: !!this.props.className,
      [_consts.PAGER_SELECTION_CLASS]: !!this.props.selected
    });
  }
  render() {
    return (0, _inferno.createComponentVNode)(2, _light_button.LightButton, {
      "className": this.getClassName(),
      "label": this.getLabel(),
      "onClick": this.props.onClick,
      "selected": this.props.selected,
      children: this.getValue()
    });
  }
}
exports.Page = Page;
Page.defaultProps = PageDefaultProps;
