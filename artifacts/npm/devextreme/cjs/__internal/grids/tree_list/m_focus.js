/**
* DevExtreme (cjs/__internal/grids/tree_list/m_focus.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _deferred = require("../../../core/utils/deferred");
var _m_focus = require("../../grids/grid_core/focus/m_focus");
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function findIndex(items, callback) {
  let result = -1;
  items.forEach((node, index) => {
    if (callback(node)) {
      result = index;
    }
  });
  return result;
}
const data = Base => /*#__PURE__*/function (_focusModule$extender) {
  _inheritsLoose(TreeListDataControllerExtender, _focusModule$extender);
  function TreeListDataControllerExtender() {
    return _focusModule$extender.apply(this, arguments) || this;
  }
  var _proto = TreeListDataControllerExtender.prototype;
  _proto.changeRowExpand = function changeRowExpand(key) {
    // @ts-expect-error
    if (this.option('focusedRowEnabled') && this.isRowExpanded(key)) {
      if (this._isFocusedRowInside(key)) {
        this.option('focusedRowKey', key);
      }
    }
    // @ts-expect-error
    return _focusModule$extender.prototype.changeRowExpand.apply(this, arguments);
  };
  _proto._isFocusedRowInside = function _isFocusedRowInside(parentKey) {
    const focusedRowKey = this.option('focusedRowKey');
    const rowIndex = this.getRowIndexByKey(focusedRowKey);
    const focusedRow = rowIndex >= 0 && this.getVisibleRows()[rowIndex];
    // @ts-expect-error
    let parent = focusedRow && focusedRow.node.parent;
    while (parent) {
      if (parent.key === parentKey) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  };
  _proto.getParentKey = function getParentKey(key) {
    const that = this;
    const dataSource = that._dataSource;
    // @ts-expect-error
    const node = that.getNodeByKey(key);
    // @ts-expect-error
    const d = new _deferred.Deferred();
    if (node) {
      d.resolve(node.parent ? node.parent.key : undefined);
    } else {
      dataSource.load({
        filter: [dataSource.getKeyExpr(), '=', key]
      }).done(items => {
        const parentData = items[0];
        if (parentData) {
          d.resolve(dataSource.parentKeyOf(parentData));
        } else {
          d.resolve();
        }
      }).fail(d.reject);
    }
    return d.promise();
  };
  _proto.expandAscendants = function expandAscendants(key) {
    const that = this;
    const dataSource = that._dataSource;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    that.getParentKey(key).done(parentKey => {
      if (dataSource && parentKey !== undefined && parentKey !== that.option('rootValue')) {
        dataSource._isNodesInitializing = true;
        // @ts-expect-error
        that.expandRow(parentKey);
        dataSource._isNodesInitializing = false;
        that.expandAscendants(parentKey).done(d.resolve).fail(d.reject);
      } else {
        d.resolve();
      }
    }).fail(d.reject);
    return d.promise();
  };
  _proto.getPageIndexByKey = function getPageIndexByKey(key) {
    const that = this;
    const dataSource = that._dataSource;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    that.expandAscendants(key).done(() => {
      dataSource.load({
        parentIds: []
      }).done(nodes => {
        const offset = findIndex(nodes, node => that.keyOf(node.data) === key);
        let pageIndex = -1;
        if (offset >= 0) {
          pageIndex = Math.floor(offset / that.pageSize());
        }
        d.resolve(pageIndex);
      }).fail(d.reject);
    }).fail(d.reject);
    return d.promise();
  };
  return TreeListDataControllerExtender;
}(_m_focus.focusModule.extenders.controllers.data(Base));
_m_core.default.registerModule('focus', _extends(_extends({}, _m_focus.focusModule), {
  extenders: _extends(_extends({}, _m_focus.focusModule.extenders), {
    controllers: _extends(_extends({}, _m_focus.focusModule.extenders.controllers), {
      data
    })
  })
}));
