"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _type = require("../../core/utils/type");
var _devices = _interopRequireDefault(require("../../core/devices"));
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  ios,
  mac
} = _devices.default.real();
const isFocusingOnCaretChange = ios || mac;
const getCaret = function (input) {
  let range;
  try {
    range = {
      start: input.selectionStart,
      end: input.selectionEnd
    };
  } catch (e) {
    range = {
      start: 0,
      end: 0
    };
  }
  return range;
};
const setCaret = function (input, position) {
  const body = _dom_adapter.default.getBody();
  if (!body.contains(input) && !body.contains(input.getRootNode().host)) {
    return;
  }
  try {
    input.selectionStart = position.start;
    input.selectionEnd = position.end;
  } catch (e) {}
};
const caret = function (input, position) {
  let force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  input = (0, _renderer.default)(input).get(0);
  if (!(0, _type.isDefined)(position)) {
    return getCaret(input);
  }

  // NOTE: AppleWebKit-based browsers focuses element input after caret position has changed
  if (!force && isFocusingOnCaretChange && _dom_adapter.default.getActiveElement(input) !== input) {
    return;
  }
  setCaret(input, position);
};
var _default = exports.default = caret;
module.exports = exports.default;
module.exports.default = exports.default;