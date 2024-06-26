/**
* DevExtreme (cjs/renovation/ui/scroll_view/common/animated_scrollbar_props.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.AnimatedScrollbarProps = void 0;
var _scrollbar_props = require("./scrollbar_props");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const AnimatedScrollbarProps = exports.AnimatedScrollbarProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_scrollbar_props.ScrollbarProps), Object.getOwnPropertyDescriptors({
  pulledDown: false,
  bottomPocketSize: 0,
  contentPaddingBottom: 0
})));
