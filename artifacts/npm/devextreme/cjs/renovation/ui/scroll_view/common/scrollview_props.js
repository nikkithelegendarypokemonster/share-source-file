/**
* DevExtreme (cjs/renovation/ui/scroll_view/common/scrollview_props.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.ScrollViewProps = void 0;
var _scrollable_props = require("./scrollable_props");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ScrollViewProps = exports.ScrollViewProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_scrollable_props.ScrollableProps), Object.getOwnPropertyDescriptors({
  pullDownEnabled: false,
  reachBottomEnabled: false
})));
