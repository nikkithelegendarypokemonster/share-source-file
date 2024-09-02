/**
* DevExtreme (esm/core/templates/function_template.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { TemplateBase } from './template_base';
import { normalizeTemplateElement } from '../utils/dom';
export class FunctionTemplate extends TemplateBase {
  constructor(render) {
    super();
    this._render = render;
  }
  _renderCore(options) {
    return normalizeTemplateElement(this._render(options));
  }
}
