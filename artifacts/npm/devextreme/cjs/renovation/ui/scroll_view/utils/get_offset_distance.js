/**
* DevExtreme (cjs/renovation/ui/scroll_view/utils/get_offset_distance.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.getOffsetDistance = getOffsetDistance;
var _common = require("../../../../core/utils/common");
function getOffsetDistance(targetLocation, scrollOffset) {
  return {
    top: (0, _common.ensureDefined)(targetLocation.top, scrollOffset.top) - scrollOffset.top,
    left: (0, _common.ensureDefined)(targetLocation.left, scrollOffset.left) - scrollOffset.left
  };
}