/**
* DevExtreme (cjs/renovation/ui/editors/common/editor_label_props.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.EditorLabelProps = void 0;
var _themes = require("../../../../ui/themes");
const EditorLabelProps = exports.EditorLabelProps = Object.defineProperties({
  label: ''
}, {
  labelMode: {
    get: function () {
      return (0, _themes.isMaterial)((0, _themes.current)()) ? 'floating' : 'static';
    },
    configurable: true,
    enumerable: true
  }
});
