/**
* DevExtreme (cjs/__internal/grids/tree_list/m_validating.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _m_validating = require("../../grids/grid_core/validating/m_validating");
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable @typescript-eslint/no-unused-vars */

const editingControllerExtender = Base => class TreeListEditingControllerExtender extends _m_validating.validatingModule.extenders.controllers.editing(Base) {
  processDataItem(item) {
    super.processDataItemTreeListHack.apply(this, arguments);
  }
  processItems(items, e) {
    return super.processItemsTreeListHack.apply(this, arguments);
  }
};
_m_core.default.registerModule('validating', {
  defaultOptions: _m_validating.validatingModule.defaultOptions,
  controllers: _m_validating.validatingModule.controllers,
  extenders: {
    controllers: {
      editing: editingControllerExtender,
      editorFactory: _m_validating.validatingModule.extenders.controllers.editorFactory
    },
    views: _m_validating.validatingModule.extenders.views
  }
});
