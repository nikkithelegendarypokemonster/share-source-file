/**
* DevExtreme (cjs/ui/drawer/ui.drawer.animation.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.animation = void 0;
var _fx = _interopRequireDefault(require("../../animation/fx"));
var _inflector = require("../../core/utils/inflector");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const animation = exports.animation = {
  moveTo(config) {
    const $element = config.$element;
    const position = config.position;
    const direction = config.direction || 'left';
    const toConfig = {};
    let animationType;
    switch (direction) {
      case 'right':
        toConfig['transform'] = 'translate(' + position + 'px, 0px)';
        animationType = 'custom';
        break;
      case 'left':
        toConfig['left'] = position;
        animationType = 'slide';
        break;
      case 'top':
      case 'bottom':
        toConfig['top'] = position;
        animationType = 'slide';
    }
    _fx.default.animate($element, {
      type: animationType,
      to: toConfig,
      duration: config.duration,
      complete: config.complete
    });
  },
  margin(config) {
    const $element = config.$element;
    const margin = config.margin;
    const direction = config.direction || 'left';
    const toConfig = {};
    toConfig['margin' + (0, _inflector.camelize)(direction, true)] = margin;
    _fx.default.animate($element, {
      to: toConfig,
      duration: config.duration,
      complete: config.complete
    });
  },
  fade($element, config, duration, completeAction) {
    _fx.default.animate($element, {
      type: 'fade',
      to: config.to,
      from: config.from,
      duration,
      complete: completeAction
    });
  },
  size(config) {
    const $element = config.$element;
    const size = config.size;
    const direction = config.direction || 'left';
    const marginTop = config.marginTop || 0;
    const duration = config.duration;
    const toConfig = {};
    if (direction === 'right' || direction === 'left') {
      toConfig['width'] = size;
    } else {
      toConfig['height'] = size;
    }
    if (direction === 'bottom') {
      toConfig['marginTop'] = marginTop;
    }
    _fx.default.animate($element, {
      to: toConfig,
      duration,
      complete: config.complete
    });
  },
  complete($element) {
    _fx.default.stop($element, true);
  }
};
