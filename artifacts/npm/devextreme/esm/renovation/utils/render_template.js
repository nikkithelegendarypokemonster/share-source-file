/**
* DevExtreme (esm/renovation/utils/render_template.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { render } from 'inferno';
import { createElement } from 'inferno-create-element';
export function renderTemplate(template, props, container) {
  setTimeout(() => {
    render(createElement(template, props), container === null || container === void 0 ? void 0 : container.get(0));
  }, 0);
}
