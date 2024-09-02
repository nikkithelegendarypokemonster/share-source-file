/**
* DevExtreme (cjs/__internal/ui/multi_view/m_multi_view.animation.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animation = exports._translator = void 0;
var _fx = _interopRequireDefault(require("../../../animation/fx"));
var _translator2 = require("../../../animation/translator");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line @typescript-eslint/naming-convention
const _translator = exports._translator = {
  move($element, position) {
    (0, _translator2.move)($element, {
      left: position
    });
  }
};
const animation = exports.animation = {
  moveTo($element, position, duration, completeAction) {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    _fx.default.animate($element, {
      type: 'slide',
      to: {
        left: position
      },
      duration,
      complete: completeAction
    });
  },
  complete($element) {
    // @ts-expect-error
    _fx.default.stop($element, true);
  }
};
