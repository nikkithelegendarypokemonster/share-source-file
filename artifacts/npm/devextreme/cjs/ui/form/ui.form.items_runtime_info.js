/**
* DevExtreme (cjs/ui/form/ui.form.items_runtime_info.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _guid = _interopRequireDefault(require("../../core/guid"));
var _iterator = require("../../core/utils/iterator");
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let FormItemsRunTimeInfo = exports.default = /*#__PURE__*/function () {
  function FormItemsRunTimeInfo() {
    this._map = {};
  }
  var _proto = FormItemsRunTimeInfo.prototype;
  _proto._findWidgetInstance = function _findWidgetInstance(condition) {
    let result;
    (0, _iterator.each)(this._map, function (guid, _ref) {
      let {
        widgetInstance,
        item
      } = _ref;
      if (condition(item)) {
        result = widgetInstance;
        return false;
      }
    });
    return result;
  };
  _proto._findFieldByCondition = function _findFieldByCondition(callback, valueExpr) {
    let result;
    (0, _iterator.each)(this._map, function (key, value) {
      if (callback(value)) {
        result = valueExpr === 'guid' ? key : value[valueExpr];
        return false;
      }
    });
    return result;
  };
  _proto.clear = function clear() {
    this._map = {};
  };
  _proto.removeItemsByItems = function removeItemsByItems(itemsRunTimeInfo) {
    (0, _iterator.each)(itemsRunTimeInfo.getItems(), guid => this.removeItemByKey(guid));
  };
  _proto.removeItemByKey = function removeItemByKey(key) {
    delete this._map[key];
  };
  _proto.add = function add(options) {
    const key = options.guid || new _guid.default();
    this._map[key] = options;
    return key;
  };
  _proto.addItemsOrExtendFrom = function addItemsOrExtendFrom(itemsRunTimeInfo) {
    itemsRunTimeInfo.each((key, itemRunTimeInfo) => {
      if (this._map[key]) {
        if (itemRunTimeInfo.widgetInstance) {
          this._map[key].widgetInstance = itemRunTimeInfo.widgetInstance;
        }
        this._map[key].$itemContainer = itemRunTimeInfo.$itemContainer;
      } else {
        this.add({
          item: itemRunTimeInfo.item,
          widgetInstance: itemRunTimeInfo.widgetInstance,
          guid: key,
          $itemContainer: itemRunTimeInfo.$itemContainer
        });
      }
    });
  };
  _proto.extendRunTimeItemInfoByKey = function extendRunTimeItemInfoByKey(key, options) {
    if (this._map[key]) {
      this._map[key] = (0, _extend.extend)(this._map[key], options);
    }
  };
  _proto.findWidgetInstanceByItem = function findWidgetInstanceByItem(item) {
    return this._findWidgetInstance(storedItem => storedItem === item);
  };
  _proto.findGroupOrTabLayoutManagerByPath = function findGroupOrTabLayoutManagerByPath(targetPath) {
    return this._findFieldByCondition(_ref2 => {
      let {
        path
      } = _ref2;
      return path === targetPath;
    }, 'layoutManager');
  };
  _proto.findKeyByPath = function findKeyByPath(targetPath) {
    return this._findFieldByCondition(_ref3 => {
      let {
        path
      } = _ref3;
      return path === targetPath;
    }, 'guid');
  };
  _proto.findWidgetInstanceByName = function findWidgetInstanceByName(name) {
    return this._findWidgetInstance(item => name === item.name);
  };
  _proto.findWidgetInstanceByDataField = function findWidgetInstanceByDataField(dataField) {
    return this._findWidgetInstance(item => dataField === ((0, _type.isString)(item) ? item : item.dataField));
  };
  _proto.findItemContainerByItem = function findItemContainerByItem(item) {
    for (const key in this._map) {
      if (this._map[key].item === item) {
        return this._map[key].$itemContainer;
      }
    }
    return null;
  };
  _proto.findItemIndexByItem = function findItemIndexByItem(targetItem) {
    return this._findFieldByCondition(_ref4 => {
      let {
        item
      } = _ref4;
      return item === targetItem;
    }, 'itemIndex');
  };
  _proto.findPreparedItemByItem = function findPreparedItemByItem(item) {
    return this._findFieldByCondition(_ref5 => {
      let {
        item: currentItem
      } = _ref5;
      return currentItem === item;
    }, 'preparedItem');
  };
  _proto.getItems = function getItems() {
    return this._map;
  };
  _proto.each = function each(handler) {
    (0, _iterator.each)(this._map, function (key, itemRunTimeInfo) {
      handler(key, itemRunTimeInfo);
    });
  };
  _proto.removeItemsByPathStartWith = function removeItemsByPathStartWith(path) {
    const keys = Object.keys(this._map);
    const filteredKeys = keys.filter(key => {
      if (this._map[key].path) {
        return this._map[key].path.indexOf(path, 0) > -1;
      }
      return false;
    });
    filteredKeys.forEach(key => this.removeItemByKey(key));
  };
  return FormItemsRunTimeInfo;
}();
module.exports = exports.default;
module.exports.default = exports.default;
