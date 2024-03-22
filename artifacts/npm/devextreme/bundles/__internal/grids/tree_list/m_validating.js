/**
* DevExtreme (bundles/__internal/grids/tree_list/m_validating.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _m_validating = require("../../grids/grid_core/validating/m_validating");
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable @typescript-eslint/no-unused-vars */
const editingControllerExtender = Base => /*#__PURE__*/function (_validatingModule$ext) {
  _inheritsLoose(TreeListEditingControllerExtender, _validatingModule$ext);
  function TreeListEditingControllerExtender() {
    return _validatingModule$ext.apply(this, arguments) || this;
  }
  var _proto = TreeListEditingControllerExtender.prototype;
  _proto.processDataItem = function processDataItem(item) {
    _validatingModule$ext.prototype.processDataItemTreeListHack.apply(this, arguments);
  };
  _proto.processItems = function processItems(items, e) {
    return _validatingModule$ext.prototype.processItemsTreeListHack.apply(this, arguments);
  };
  return TreeListEditingControllerExtender;
}(_m_validating.validatingModule.extenders.controllers.editing(Base));
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
