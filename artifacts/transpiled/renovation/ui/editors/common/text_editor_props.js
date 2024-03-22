"use strict";

exports.TextEditorProps = void 0;
var _themes = require("../../../../ui/themes");
const TextEditorProps = exports.TextEditorProps = Object.defineProperties({
  maxLength: null,
  spellCheck: false,
  valueChangeEvent: 'change',
  defaultValue: ''
}, {
  stylingMode: {
    get: function () {
      return (0, _themes.isMaterial)((0, _themes.current)()) ? 'filled' : 'outlined';
    },
    configurable: true,
    enumerable: true
  }
});