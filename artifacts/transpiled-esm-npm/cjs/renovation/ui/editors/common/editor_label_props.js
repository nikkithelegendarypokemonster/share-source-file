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