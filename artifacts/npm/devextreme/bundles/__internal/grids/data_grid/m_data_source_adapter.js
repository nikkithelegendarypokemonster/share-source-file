/**
* DevExtreme (bundles/__internal/grids/data_grid/m_data_source_adapter.js)
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
exports.default = void 0;
var _m_data_source_adapter = _interopRequireDefault(require("../../grids/grid_core/data_source_adapter/m_data_source_adapter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let DataSourceAdapterType = _m_data_source_adapter.default;
var _default = exports.default = {
  extend(extender) {
    DataSourceAdapterType = extender(DataSourceAdapterType);
  },
  create(component) {
    return new DataSourceAdapterType(component);
  }
};