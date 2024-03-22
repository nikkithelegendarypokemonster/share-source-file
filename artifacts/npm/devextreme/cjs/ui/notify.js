/**
* DevExtreme (cjs/ui/notify.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _view_port = require("../core/utils/view_port");
var _extend = require("../core/utils/extend");
var _type = require("../core/utils/type");
var _window = require("../core/utils/window");
var _toast = _interopRequireDefault(require("./toast"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
let $notify = null;
const $containers = {};
function notify(message, /* optional */typeOrStack, displayTime) {
  const options = (0, _type.isPlainObject)(message) ? message : {
    message: message
  };
  const stack = (0, _type.isPlainObject)(typeOrStack) ? typeOrStack : undefined;
  const type = (0, _type.isPlainObject)(typeOrStack) ? undefined : typeOrStack;
  const {
    onHidden: userOnHidden
  } = options;
  if (stack !== null && stack !== void 0 && stack.position) {
    const {
      position
    } = stack;
    const direction = stack.direction || getDefaultDirection(position);
    const containerKey = (0, _type.isString)(position) ? position : "".concat(position.top, "-").concat(position.left, "-").concat(position.bottom, "-").concat(position.right);
    const {
      onShowing: userOnShowing
    } = options;
    const $container = getStackContainer(containerKey);
    setContainerClasses($container, direction);
    (0, _extend.extend)(options, {
      container: $container,
      _skipContentPositioning: true,
      onShowing: function (args) {
        setContainerStyles($container, direction, position);
        userOnShowing === null || userOnShowing === void 0 ? void 0 : userOnShowing(args);
      }
    });
  }
  (0, _extend.extend)(options, {
    type: type,
    displayTime: displayTime,
    onHidden: function (args) {
      (0, _renderer.default)(args.element).remove();
      userOnHidden === null || userOnHidden === void 0 ? void 0 : userOnHidden(args);
    }
  });
  $notify = (0, _renderer.default)('<div>').appendTo((0, _view_port.value)());
  new _toast.default($notify, options).show();
}
const getDefaultDirection = position => {
  return (0, _type.isString)(position) && position.includes('top') ? 'down-push' : 'up-push';
};
const createStackContainer = key => {
  const $container = (0, _renderer.default)('<div>').appendTo((0, _view_port.value)());
  $containers[key] = $container;
  return $container;
};
const getStackContainer = key => {
  const $container = $containers[key];
  return $container ? $container : createStackContainer(key);
};
const setContainerClasses = (container, direction) => {
  const containerClasses = "dx-toast-stack dx-toast-stack-".concat(direction, "-direction");
  container.removeAttr('class').addClass(containerClasses);
};
const setContainerStyles = (container, direction, position) => {
  const {
    offsetWidth: toastWidth,
    offsetHeight: toastHeight
  } = container.children().first().get(0);
  const dimensions = {
    toastWidth,
    toastHeight,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  };
  const coordinates = (0, _type.isString)(position) ? getCoordinatesByAlias(position, dimensions) : position;
  const styles = getPositionStylesByCoordinates(direction, coordinates, dimensions);
  container.css(styles);
};
const getCoordinatesByAlias = (alias, _ref) => {
  let {
    toastWidth,
    toastHeight,
    windowHeight,
    windowWidth
  } = _ref;
  switch (alias) {
    case 'top left':
      return {
        top: 10,
        left: 10
      };
    case 'top right':
      return {
        top: 10,
        right: 10
      };
    case 'bottom left':
      return {
        bottom: 10,
        left: 10
      };
    case 'bottom right':
      return {
        bottom: 10,
        right: 10
      };
    case 'top center':
      return {
        top: 10,
        left: Math.round(windowWidth / 2 - toastWidth / 2)
      };
    case 'left center':
      return {
        top: Math.round(windowHeight / 2 - toastHeight / 2),
        left: 10
      };
    case 'right center':
      return {
        top: Math.round(windowHeight / 2 - toastHeight / 2),
        right: 10
      };
    case 'center':
      return {
        top: Math.round(windowHeight / 2 - toastHeight / 2),
        left: Math.round(windowWidth / 2 - toastWidth / 2)
      };
    case 'bottom center':
    default:
      return {
        bottom: 10,
        left: Math.round(windowWidth / 2 - toastWidth / 2)
      };
  }
};
const getPositionStylesByCoordinates = (direction, coordinates, dimensions) => {
  var _coordinates$bottom, _coordinates$left, _coordinates$right, _coordinates$top, _coordinates$left2, _coordinates$right2, _coordinates$right3, _coordinates$top2, _coordinates$bottom2, _coordinates$left3, _coordinates$top3, _coordinates$bottom3;
  const {
    toastWidth,
    toastHeight,
    windowHeight,
    windowWidth
  } = dimensions;
  switch (direction.replace(/-push|-stack/g, '')) {
    case 'up':
      return {
        bottom: (_coordinates$bottom = coordinates.bottom) !== null && _coordinates$bottom !== void 0 ? _coordinates$bottom : windowHeight - toastHeight - coordinates.top,
        top: '',
        left: (_coordinates$left = coordinates.left) !== null && _coordinates$left !== void 0 ? _coordinates$left : '',
        right: (_coordinates$right = coordinates.right) !== null && _coordinates$right !== void 0 ? _coordinates$right : ''
      };
    case 'down':
      return {
        top: (_coordinates$top = coordinates.top) !== null && _coordinates$top !== void 0 ? _coordinates$top : windowHeight - toastHeight - coordinates.bottom,
        bottom: '',
        left: (_coordinates$left2 = coordinates.left) !== null && _coordinates$left2 !== void 0 ? _coordinates$left2 : '',
        right: (_coordinates$right2 = coordinates.right) !== null && _coordinates$right2 !== void 0 ? _coordinates$right2 : ''
      };
    case 'left':
      return {
        right: (_coordinates$right3 = coordinates.right) !== null && _coordinates$right3 !== void 0 ? _coordinates$right3 : windowWidth - toastWidth - coordinates.left,
        left: '',
        top: (_coordinates$top2 = coordinates.top) !== null && _coordinates$top2 !== void 0 ? _coordinates$top2 : '',
        bottom: (_coordinates$bottom2 = coordinates.bottom) !== null && _coordinates$bottom2 !== void 0 ? _coordinates$bottom2 : ''
      };
    case 'right':
      return {
        left: (_coordinates$left3 = coordinates.left) !== null && _coordinates$left3 !== void 0 ? _coordinates$left3 : windowWidth - toastWidth - coordinates.right,
        right: '',
        top: (_coordinates$top3 = coordinates.top) !== null && _coordinates$top3 !== void 0 ? _coordinates$top3 : '',
        bottom: (_coordinates$bottom3 = coordinates.bottom) !== null && _coordinates$bottom3 !== void 0 ? _coordinates$bottom3 : ''
      };
  }
};
var _default = exports.default = notify;
module.exports = exports.default;
module.exports.default = exports.default;
