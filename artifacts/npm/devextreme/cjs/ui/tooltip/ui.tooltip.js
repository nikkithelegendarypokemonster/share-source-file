/**
* DevExtreme (cjs/ui/tooltip/ui.tooltip.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.hide = hide;
exports.show = show;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _tooltip = _interopRequireDefault(require("./tooltip"));
var _extend = require("../../core/utils/extend");
var _deferred = require("../../core/utils/deferred");
var _view_port = require("../../core/utils/view_port");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let tooltip = null;
let removeTooltipElement = null;
const createTooltip = function (options) {
  options = (0, _extend.extend)({
    position: 'top'
  }, options);
  const content = options.content;
  delete options.content;
  const $tooltip = (0, _renderer.default)('<div>').html(content).appendTo((0, _view_port.value)());
  removeTooltipElement = function () {
    $tooltip.remove();
  };
  tooltip = new _tooltip.default($tooltip, options);
};
const removeTooltip = function () {
  if (!tooltip) {
    return;
  }
  removeTooltipElement();
  tooltip = null;
};
function show(options) {
  removeTooltip();
  createTooltip(options);
  return tooltip.show();
}
function hide() {
  if (!tooltip) {
    return new _deferred.Deferred().resolve();
  }
  return tooltip.hide().done(removeTooltip).promise();
}