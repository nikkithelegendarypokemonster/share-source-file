/**
* DevExtreme (esm/ui/html_editor/modules/widget_collector.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { each } from '../../../core/utils/iterator';
export default class WidgetCollector {
  constructor() {
    this._collection = [];
  }
  clear() {
    this._collection = [];
  }
  add(name, instance) {
    this._collection.push({
      name,
      instance
    });
  }
  remove(name) {
    this._collection = this._collection.filter(item => item.name !== name);
  }
  getByName(widgetName) {
    var widget = null;
    each(this._collection, (index, _ref) => {
      var {
        name,
        instance
      } = _ref;
      if (name === widgetName) {
        widget = instance;
        return false;
      }
    });
    return widget;
  }
  each(handler) {
    this._collection.forEach(_ref2 => {
      var {
        name,
        instance
      } = _ref2;
      return instance && handler(name, instance);
    });
  }
}
