"use strict";

exports.getElementMaxHeightByWindow = void 0;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _window = require("../../core/utils/window");
var _type = require("../../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const WINDOW_HEIGHT_PERCENT = 0.9;
const getElementMaxHeightByWindow = ($element, startLocation) => {
  const $window = (0, _renderer.default)((0, _window.getWindow)());
  const {
    top: elementOffset
  } = $element.offset();
  let actualOffset;
  if ((0, _type.isNumeric)(startLocation)) {
    if (startLocation < elementOffset) {
      return elementOffset - startLocation;
    } else {
      actualOffset = (0, _size.getInnerHeight)($window) - startLocation + $window.scrollTop();
    }
  } else {
    const offsetTop = elementOffset - $window.scrollTop();
    const offsetBottom = (0, _size.getInnerHeight)($window) - offsetTop - (0, _size.getOuterHeight)($element);
    actualOffset = Math.max(offsetTop, offsetBottom);
  }
  return actualOffset * WINDOW_HEIGHT_PERCENT;
};
exports.getElementMaxHeightByWindow = getElementMaxHeightByWindow;