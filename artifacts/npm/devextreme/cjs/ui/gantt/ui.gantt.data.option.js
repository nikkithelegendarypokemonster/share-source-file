/**
* DevExtreme (cjs/ui/gantt/ui.gantt.data.option.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _component = require("../../core/component");
var _data_helper = _interopRequireDefault(require("../../data_helper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let DataOption = /*#__PURE__*/function (_Component) {
  _inheritsLoose(DataOption, _Component);
  function DataOption(optionName, getLoadPanel, dataSourceChangedCallback) {
    var _this;
    _this = _Component.call(this) || this;
    _this._optionName = optionName;
    _this._getLoadPanel = getLoadPanel;
    _this._dataSourceChangedCallback = dataSourceChangedCallback;
    return _this;
  }
  var _proto = DataOption.prototype;
  _proto.insert = function insert(data, callback, errorCallback) {
    this._showLoadPanel();
    this._getStore().insert(data).done(response => {
      if (callback) {
        callback(response);
      }
      this._hideLoadPanel();
    }).fail(error => {
      if (errorCallback) {
        errorCallback(error);
      }
      this._hideLoadPanel();
    });
  };
  _proto.update = function update(key, data, callback, errorCallback) {
    this._showLoadPanel();
    this._getStore().update(key, data).done((data, key) => {
      if (callback) {
        callback(data, key);
      }
      this._hideLoadPanel();
    }).fail(error => {
      if (errorCallback) {
        errorCallback(error);
      }
      this._hideLoadPanel();
    });
  };
  _proto.remove = function remove(key, callback, errorCallback) {
    this._showLoadPanel();
    this._getStore().remove(key).done(key => {
      if (callback) {
        callback(key);
      }
      this._hideLoadPanel();
    }).fail(error => {
      if (errorCallback) {
        errorCallback(error);
      }
      this._hideLoadPanel();
    });
  };
  _proto._dataSourceChangedHandler = function _dataSourceChangedHandler(newItems, e) {
    this._dataSourceChangedCallback(this._optionName, newItems);
  };
  _proto._dataSourceOptions = function _dataSourceOptions() {
    return {
      paginate: false
    };
  };
  _proto._dataSourceLoadingChangedHandler = function _dataSourceLoadingChangedHandler(isLoading) {
    if (isLoading && !this._dataSource.isLoaded()) {
      this._showLoadPanel();
    } else {
      this._hideLoadPanel();
    }
  };
  _proto._showLoadPanel = function _showLoadPanel() {
    var _this$_getLoadPanel;
    (_this$_getLoadPanel = this._getLoadPanel()) === null || _this$_getLoadPanel === void 0 ? void 0 : _this$_getLoadPanel.show();
  };
  _proto._hideLoadPanel = function _hideLoadPanel() {
    var _this$_getLoadPanel2;
    (_this$_getLoadPanel2 = this._getLoadPanel()) === null || _this$_getLoadPanel2 === void 0 ? void 0 : _this$_getLoadPanel2.hide();
  };
  _proto._getStore = function _getStore() {
    return this._dataSource.store();
  };
  _proto._getItems = function _getItems() {
    return this._getStore()._array || this._dataSource.items();
  };
  _proto._reloadDataSource = function _reloadDataSource() {
    return this._dataSource.load();
  };
  _proto.dispose = function dispose() {
    this._disposeDataSource();
  };
  _proto._optionChanged = function _optionChanged(args) {
    switch (args.name) {
      case 'dataSource':
        break;
    }
  };
  return DataOption;
}(_component.Component);
DataOption.include(_data_helper.default);
var _default = exports.default = DataOption;
module.exports = exports.default;
module.exports.default = exports.default;
