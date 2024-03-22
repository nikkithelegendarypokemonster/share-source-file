/**
* DevExtreme (bundles/__internal/grids/data_grid/m_data_controller.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataController = void 0;
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.errors"));
var _m_data_controller = require("../../grids/grid_core/data_controller/m_data_controller");
var _m_core = _interopRequireDefault(require("./m_core"));
var _m_data_source_adapter = _interopRequireDefault(require("./m_data_source_adapter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
let DataGridDataController = exports.DataController = /*#__PURE__*/function (_DataController) {
  _inheritsLoose(DataGridDataController, _DataController);
  function DataGridDataController() {
    return _DataController.apply(this, arguments) || this;
  }
  var _proto = DataGridDataController.prototype;
  _proto._getDataSourceAdapter = function _getDataSourceAdapter() {
    return _m_data_source_adapter.default;
  };
  _proto._getSpecificDataSourceOption = function _getSpecificDataSourceOption() {
    const dataSource = this.option('dataSource');
    if (dataSource && !Array.isArray(dataSource) && this.option('keyExpr')) {
      _ui.default.log('W1011');
    }
    return _DataController.prototype._getSpecificDataSourceOption.call(this);
  };
  return DataGridDataController;
}(_m_data_controller.DataController);
_m_core.default.registerModule('data', {
  defaultOptions: _m_data_controller.dataControllerModule.defaultOptions,
  controllers: {
    data: DataGridDataController
  }
});
