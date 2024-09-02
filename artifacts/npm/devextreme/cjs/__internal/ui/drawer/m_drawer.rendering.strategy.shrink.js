/**
* DevExtreme (cjs/__internal/ui/drawer/m_drawer.rendering.strategy.shrink.js)
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
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _inflector = require("../../../core/utils/inflector");
var _m_drawer = require("./m_drawer.animation");
var _m_drawerRendering = _interopRequireDefault(require("./m_drawer.rendering.strategy"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class ShrinkStrategy extends _m_drawerRendering.default {
  _internalRenderPosition(changePositionUsingFxAnimation, whenAnimationCompleted) {
    const drawer = this.getDrawerInstance();
    // @ts-expect-error
    const direction = drawer.calcTargetPosition();
    const $panel = (0, _renderer.default)(drawer.content());
    const panelSize = this._getPanelSize(drawer.option('opened'));
    const panelOffset = this._getPanelOffset(drawer.option('opened'));
    const revealMode = drawer.option('revealMode');
    if (changePositionUsingFxAnimation) {
      if (revealMode === 'slide') {
        _m_drawer.animation.margin({
          complete: () => {
            whenAnimationCompleted.resolve();
          },
          $element: $panel,
          duration: drawer.option('animationDuration'),
          direction,
          margin: panelOffset
        });
      } else if (revealMode === 'expand') {
        _m_drawer.animation.size({
          complete: () => {
            whenAnimationCompleted.resolve();
          },
          $element: $panel,
          duration: drawer.option('animationDuration'),
          direction,
          size: panelSize
        });
      }
    } else if (revealMode === 'slide') {
      $panel.css(`margin${(0, _inflector.camelize)(direction, true)}`, panelOffset);
    } else if (revealMode === 'expand') {
      // @ts-expect-error
      $panel.css(drawer.isHorizontalDirection() ? 'width' : 'height', panelSize);
    }
  }
  // @ts-expect-error
  isViewContentFirst(position, isRtl) {
    return (isRtl ? position === 'left' : position === 'right') || position === 'bottom';
  }
}
var _default = exports.default = ShrinkStrategy;
