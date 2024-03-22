/**
* DevExtreme (cjs/renovation/ui/scroll_view/common/native_strategy_props.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.ScrollableNativeProps = void 0;
var _base_scrollable_props = require("./base_scrollable_props");
var _get_default_option_value = require("../utils/get_default_option_value");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ScrollableNativeProps = exports.ScrollableNativeProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_base_scrollable_props.BaseScrollableProps), Object.getOwnPropertyDescriptors(Object.defineProperties({
  showScrollbar: 'onScroll'
}, {
  useSimulatedScrollbar: {
    get: function () {
      return (0, _get_default_option_value.getDefaultUseSimulatedScrollbar)();
    },
    configurable: true,
    enumerable: true
  },
  refreshStrategy: {
    get: function () {
      return (0, _get_default_option_value.getDefaultNativeRefreshStrategy)();
    },
    configurable: true,
    enumerable: true
  }
}))));
