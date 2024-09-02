/**
* DevExtreme (esm/__internal/ui/popover/m_popover_position_controller.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["shading", "target", "$arrow"];
import positionUtils from '../../../animation/position';
// @ts-expect-error
import { pairToObject } from '../../../core/utils/common';
import { extend } from '../../../core/utils/extend';
import { getHeight, getWidth } from '../../../core/utils/size';
import { isDefined, isString } from '../../../core/utils/type';
import { borderWidthStyles } from '../../../renovation/ui/resizable/utils';
import { OverlayPositionController } from '../../ui/overlay/m_overlay_position_controller';
const WEIGHT_OF_SIDES = {
  left: -1,
  top: -1,
  center: 0,
  right: 1,
  bottom: 1
};
const POPOVER_POSITION_ALIASES = {
  // NOTE: public API
  top: {
    my: 'bottom center',
    at: 'top center',
    collision: 'fit flip'
  },
  bottom: {
    my: 'top center',
    at: 'bottom center',
    collision: 'fit flip'
  },
  right: {
    my: 'left center',
    at: 'right center',
    collision: 'flip fit'
  },
  left: {
    my: 'right center',
    at: 'left center',
    collision: 'flip fit'
  }
};
const POPOVER_DEFAULT_BOUNDARY_OFFSET = {
  h: 10,
  v: 10
};
class PopoverPositionController extends OverlayPositionController {
  constructor(_ref) {
    let {
        shading,
        target,
        $arrow
      } = _ref,
      args = _objectWithoutPropertiesLoose(_ref, _excluded);
    // @ts-expect-error
    super(args);
    this._props = _extends({}, this._props, {
      shading,
      target
    });
    this._$arrow = $arrow;
    this._positionSide = undefined;
    this.updatePosition(this._props.position);
  }
  positionWrapper() {
    if (this._props.shading) {
      // @ts-expect-error
      this._$wrapper.css({
        top: 0,
        left: 0
      });
    }
  }
  updateTarget(target) {
    this._props.target = target;
    this.updatePosition(this._props.position);
  }
  _renderBoundaryOffset() {}
  _getContainerPosition() {
    const offset = pairToObject(this._position.offset || '');
    let {
      h: hOffset,
      v: vOffset
    } = offset;
    const isVerticalSide = this._isVerticalSide();
    const isHorizontalSide = this._isHorizontalSide();
    if (isVerticalSide || isHorizontalSide) {
      const isPopoverInside = this._isPopoverInside();
      const sign = (isPopoverInside ? -1 : 1) * WEIGHT_OF_SIDES[this._positionSide];
      const arrowSize = isVerticalSide ? getHeight(this._$arrow) : getWidth(this._$arrow);
      const arrowSizeCorrection = this._getContentBorderWidth(this._positionSide);
      const arrowOffset = sign * (arrowSize - arrowSizeCorrection);
      isVerticalSide ? vOffset += arrowOffset : hOffset += arrowOffset;
    }
    return extend({}, this._position, {
      offset: `${hOffset} ${vOffset}`
    });
  }
  _getContentBorderWidth(side) {
    // @ts-expect-error
    const borderWidth = this._$content.css(borderWidthStyles[side]);
    // @ts-expect-error
    // eslint-disable-next-line radix
    return parseInt(borderWidth) || 0;
  }
  _isPopoverInside() {
    // @ts-expect-error
    const my = positionUtils.setup.normalizeAlign(this._position.my);
    // @ts-expect-error
    const at = positionUtils.setup.normalizeAlign(this._position.at);
    return my.h === at.h && my.v === at.v;
  }
  _isVerticalSide() {
    let side = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._positionSide;
    return side === 'top' || side === 'bottom';
  }
  _isHorizontalSide() {
    let side = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._positionSide;
    return side === 'left' || side === 'right';
  }
  _getDisplaySide(position) {
    // @ts-expect-error
    const my = positionUtils.setup.normalizeAlign(position.my);
    // @ts-expect-error
    const at = positionUtils.setup.normalizeAlign(position.at);
    const weightSign = WEIGHT_OF_SIDES[my.h] === WEIGHT_OF_SIDES[at.h] && WEIGHT_OF_SIDES[my.v] === WEIGHT_OF_SIDES[at.v] ? -1 : 1;
    const horizontalWeight = Math.abs(WEIGHT_OF_SIDES[my.h] - weightSign * WEIGHT_OF_SIDES[at.h]);
    const verticalWeight = Math.abs(WEIGHT_OF_SIDES[my.v] - weightSign * WEIGHT_OF_SIDES[at.v]);
    return horizontalWeight > verticalWeight ? at.h : at.v;
  }
  _normalizePosition(positionProp) {
    const defaultPositionConfig = {
      of: this._props.target,
      boundaryOffset: POPOVER_DEFAULT_BOUNDARY_OFFSET
    };
    let resultPosition;
    if (isDefined(positionProp)) {
      resultPosition = extend(true, {}, defaultPositionConfig, this._positionToObject(positionProp));
    } else {
      resultPosition = defaultPositionConfig;
    }
    this._positionSide = this._getDisplaySide(resultPosition);
    return resultPosition;
  }
  _positionToObject(positionProp) {
    if (isString(positionProp)) {
      return extend({}, POPOVER_POSITION_ALIASES[positionProp]);
    }
    return positionProp;
  }
}
export { POPOVER_POSITION_ALIASES, PopoverPositionController };
