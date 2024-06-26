/**
* DevExtreme (bundles/__internal/scheduler/__migration/utils/themes.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThemeType = void 0;
var _themes = require("../../../../ui/themes");
const getThemeType = () => {
  const theme = (0, _themes.current)();
  return {
    isCompact: (0, _themes.isCompact)(theme),
    isMaterial: (0, _themes.isMaterial)(theme),
    isFluent: (0, _themes.isFluent)(theme),
    isMaterialBased: (0, _themes.isMaterialBased)(theme)
  };
};
exports.getThemeType = getThemeType;
