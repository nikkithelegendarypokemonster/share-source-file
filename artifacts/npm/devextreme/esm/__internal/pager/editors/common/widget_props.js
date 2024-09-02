/**
* DevExtreme (esm/__internal/pager/editors/common/widget_props.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { BaseWidgetDefaultProps } from '../../base_props';
const DEFAULT_FEEDBACK_HIDE_TIMEOUT = 400;
const DEFAULT_FEEDBACK_SHOW_TIMEOUT = 30;
export const WidgetDefaultProps = _extends({}, BaseWidgetDefaultProps, {
  _feedbackHideTimeout: DEFAULT_FEEDBACK_HIDE_TIMEOUT,
  _feedbackShowTimeout: DEFAULT_FEEDBACK_SHOW_TIMEOUT,
  cssText: '',
  aria: {},
  classes: '',
  name: '',
  addWidgetClass: true
});
