/**
* DevExtreme (cjs/ui/gantt/ui.gantt.treelist.nodes_state.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.GanttTreeListNodesState = exports.GanttTreeListNodeState = void 0;
let GanttTreeListNodeState = exports.GanttTreeListNodeState = /*#__PURE__*/function () {
  function GanttTreeListNodeState(treeListNode) {
    var _treeListNode$parent;
    this.collapsed = false;
    this.key = treeListNode.key;
    this.children = treeListNode.children.map(node => node.key);
    this.parentKey = (_treeListNode$parent = treeListNode.parent) === null || _treeListNode$parent === void 0 ? void 0 : _treeListNode$parent.key;
  }
  var _proto = GanttTreeListNodeState.prototype;
  _proto.hasChildren = function hasChildren() {
    return this.children.length > 0;
  };
  _proto.removeChild = function removeChild(state) {
    const index = this.children.indexOf(state.key);
    if (index > -1) {
      this.children = this.children.splice(index, 1);
    }
  };
  _proto.equal = function equal(state) {
    if (!state || state.key !== this.key || state.parentKey !== this.parentKey) {
      return false;
    }
    if (this.children.length !== state.children.length || this.children.some((value, index) => value !== state.children[index])) {
      return false;
    }
    return true;
  };
  return GanttTreeListNodeState;
}();
let GanttTreeListNodesState = exports.GanttTreeListNodesState = /*#__PURE__*/function () {
  function GanttTreeListNodesState() {
    this._resetHash();
  }
  var _proto2 = GanttTreeListNodesState.prototype;
  _proto2.clear = function clear() {
    this._resetHash();
  };
  _proto2.applyNodes = function applyNodes(nodes, rootValue) {
    if (this._rootValue !== rootValue) {
      this._resetHash();
      this._rootValue = rootValue;
    }
    this._removeNonExistentNodes(nodes.map(node => node.key));
    nodes.forEach(node => this._applyNode(node));
    this._validateHash();
  };
  _proto2.saveExpandedState = function saveExpandedState(expandedKeys) {
    this._hasCollapsed = false;
    this._forEachState(state => {
      if (state.hasChildren() && !expandedKeys.includes(state.key)) {
        state.collapsed = true;
        this._hasCollapsed = true;
      }
    });
  };
  _proto2.getExpandedKeys = function getExpandedKeys() {
    if (this._hasCollapsed) {
      const keys = [];
      this._forEachState(state => {
        if (state.hasChildren() && !state.collapsed) {
          keys.push(state.key);
        }
      });
      return keys;
    }
    return null;
  };
  _proto2._resetHash = function _resetHash() {
    this._nodeHash = {};
    this._hasCollapsed = false;
  };
  _proto2._getNodeState = function _getNodeState(key) {
    return this._nodeHash[key];
  };
  _proto2._removeNonExistentNodes = function _removeNonExistentNodes(existingKeys) {
    if (existingKeys) {
      this._forEachState(state => {
        if (!existingKeys.includes(state.key)) {
          this._removeStateWithChildren(state);
        }
      });
    }
  };
  _proto2._removeStateWithChildren = function _removeStateWithChildren(key) {
    const state = this._getNodeState(key);
    if (state) {
      state.children.forEach(child => this._removeStateWithChildren(child));
      const parent = this._getNodeState(state.parentKey);
      if (parent) {
        parent.removeChild(state);
      }
      delete this._nodeHash[key];
    }
  };
  _proto2._applyNode = function _applyNode(node) {
    const nodeState = new GanttTreeListNodeState(node);
    const oldState = this._getNodeState(node.key);
    if (!(oldState !== null && oldState !== void 0 && oldState.equal(nodeState))) {
      this._nodeHash[node.key] = nodeState;
      this._expandTreelineToNode(node.key);
    }
  };
  _proto2._expandTreelineToNode = function _expandTreelineToNode(key) {
    const state = this._getNodeState(key);
    let parent = this._getNodeState(state === null || state === void 0 ? void 0 : state.parentKey);
    while (parent) {
      parent.collapsed = false;
      parent = this._getNodeState(parent.parentKey);
    }
  };
  _proto2._validateHash = function _validateHash() {
    Object.keys(this._nodeHash).forEach(key => {
      const state = this._getNodeState(key);
      const parentKey = state === null || state === void 0 ? void 0 : state.parentKey;
      if (parentKey !== this._rootValue && !this._getNodeState(parentKey)) {
        this._removeStateWithChildren(key);
      }
    });
  };
  _proto2._forEachState = function _forEachState(callback) {
    Object.keys(this._nodeHash).forEach(key => {
      const state = this._nodeHash[key];
      if (state) {
        callback(state);
      }
    });
  };
  return GanttTreeListNodesState;
}();
