/**
* DevExtreme (cjs/__internal/grids/tree_list/m_core.js)
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
var _extend = require("../../../core/utils/extend");
var _m_modules = _interopRequireDefault(require("../../grids/grid_core/m_modules"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = (0, _extend.extend)({}, _m_modules.default, {
  modules: [],
  foreachNodes(nodes, callBack, ignoreHasChildren) {
    for (let i = 0; i < nodes.length; i++) {
      if (callBack(nodes[i]) !== false && (ignoreHasChildren || nodes[i].hasChildren) && nodes[i].children.length) {
        this.foreachNodes(nodes[i].children, callBack, ignoreHasChildren);
      }
    }
  }
});