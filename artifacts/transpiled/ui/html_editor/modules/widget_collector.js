"use strict";

exports.default = void 0;
var _iterator = require("../../../core/utils/iterator");
let WidgetCollector = exports.default = /*#__PURE__*/function () {
  function WidgetCollector() {
    this._collection = [];
  }
  var _proto = WidgetCollector.prototype;
  _proto.clear = function clear() {
    this._collection = [];
  };
  _proto.add = function add(name, instance) {
    this._collection.push({
      name,
      instance
    });
  };
  _proto.remove = function remove(name) {
    this._collection = this._collection.filter(item => item.name !== name);
  };
  _proto.getByName = function getByName(widgetName) {
    let widget = null;
    (0, _iterator.each)(this._collection, (index, _ref) => {
      let {
        name,
        instance
      } = _ref;
      if (name === widgetName) {
        widget = instance;
        return false;
      }
    });
    return widget;
  };
  _proto.each = function each(handler) {
    this._collection.forEach(_ref2 => {
      let {
        name,
        instance
      } = _ref2;
      return instance && handler(name, instance);
    });
  };
  return WidgetCollector;
}();
module.exports = exports.default;
module.exports.default = exports.default;