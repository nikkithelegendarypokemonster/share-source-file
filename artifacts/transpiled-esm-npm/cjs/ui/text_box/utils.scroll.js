"use strict";

exports.prepareScrollData = exports.allowScroll = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _index = require("../../events/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const allowScroll = function (container, delta, shiftKey) {
  const $container = (0, _renderer.default)(container);
  const scrollTopPos = shiftKey ? $container.scrollLeft() : $container.scrollTop();
  const prop = shiftKey ? 'Width' : 'Height';
  const scrollSize = $container.prop("scroll".concat(prop));
  const clientSize = $container.prop("client".concat(prop));
  // NOTE: round to the nearest integer towards zero
  const scrollBottomPos = scrollSize - clientSize - scrollTopPos | 0;
  if (scrollTopPos === 0 && scrollBottomPos === 0) {
    return false;
  }
  const isScrollFromTop = scrollTopPos === 0 && delta >= 0;
  const isScrollFromBottom = scrollBottomPos === 0 && delta <= 0;
  const isScrollFromMiddle = scrollTopPos > 0 && scrollBottomPos > 0;
  if (isScrollFromTop || isScrollFromBottom || isScrollFromMiddle) {
    return true;
  }
};
exports.allowScroll = allowScroll;
const prepareScrollData = function (container, validateTarget) {
  const $container = (0, _renderer.default)(container);
  const isCorrectTarget = function (eventTarget) {
    return validateTarget ? (0, _renderer.default)(eventTarget).is(container) : true;
  };
  return {
    validate: function (e) {
      if ((0, _index.isDxMouseWheelEvent)(e) && isCorrectTarget(e.target)) {
        if (allowScroll($container, -e.delta, e.shiftKey)) {
          e._needSkipEvent = true;
          return true;
        }
        return false;
      }
    }
  };
};
exports.prepareScrollData = prepareScrollData;