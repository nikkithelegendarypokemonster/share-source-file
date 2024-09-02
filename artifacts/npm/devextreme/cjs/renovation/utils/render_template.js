/**
* DevExtreme (cjs/renovation/utils/render_template.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.renderTemplate = renderTemplate;
var _inferno = require("inferno");
var _infernoCreateElement = require("inferno-create-element");
function renderTemplate(template, props, container) {
  setTimeout(() => {
    (0, _inferno.render)((0, _infernoCreateElement.createElement)(template, props), container === null || container === void 0 ? void 0 : container.get(0));
  }, 0);
}
