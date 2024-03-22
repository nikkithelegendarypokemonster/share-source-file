/**
* DevExtreme (esm/ui/html_editor/converterController.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
class ConverterController {
  constructor() {
    this._converters = {};
  }
  addConverter(name, converter) {
    this._converters[name] = converter;
  }
  getConverter(name) {
    return this._converters[name];
  }
}
var controller = new ConverterController();
export default controller;
