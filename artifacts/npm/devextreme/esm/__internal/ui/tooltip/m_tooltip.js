/**
* DevExtreme (esm/__internal/ui/tooltip/m_tooltip.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import $ from '../../../core/renderer';
import { Deferred } from '../../../core/utils/deferred';
import { extend } from '../../../core/utils/extend';
import { value as viewPort } from '../../../core/utils/view_port';
import Tooltip from '../../../ui/tooltip';
let tooltip = null;
let removeTooltipElement = null;
const createTooltip = function (options) {
  options = extend({
    position: 'top'
  }, options);
  const {
    content
  } = options;
  delete options.content;
  const $tooltip = $('<div>').html(content).appendTo(viewPort());
  // @ts-expect-error
  removeTooltipElement = function () {
    $tooltip.remove();
  };
  // @ts-expect-error
  tooltip = new Tooltip($tooltip, options);
};
const removeTooltip = function () {
  if (!tooltip) {
    return;
  }
  // @ts-expect-error
  removeTooltipElement();
  tooltip = null;
};
export function show(options) {
  removeTooltip();
  createTooltip(options);
  // @ts-expect-error
  return tooltip.show();
}
export function hide() {
  if (!tooltip) {
    return Deferred().resolve();
  }
  // @ts-expect-error
  return tooltip.hide().done(removeTooltip).promise();
}
