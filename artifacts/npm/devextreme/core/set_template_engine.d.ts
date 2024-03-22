/**
* DevExtreme (core/set_template_engine.d.ts)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/**
 * Sets custom functions that compile and render templates.
 */
declare function setTemplateEngine(templateEngineOptions: { compile?: Function; render?: Function }): void;

export default setTemplateEngine;
