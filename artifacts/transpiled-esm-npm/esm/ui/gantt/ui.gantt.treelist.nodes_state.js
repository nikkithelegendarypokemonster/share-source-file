export class GanttTreeListNodeState {
  constructor(treeListNode) {
    var _treeListNode$parent;
    this.collapsed = false;
    this.key = treeListNode.key;
    this.children = treeListNode.children.map(node => node.key);
    this.parentKey = (_treeListNode$parent = treeListNode.parent) === null || _treeListNode$parent === void 0 ? void 0 : _treeListNode$parent.key;
  }
  hasChildren() {
    return this.children.length > 0;
  }
  removeChild(state) {
    var index = this.children.indexOf(state.key);
    if (index > -1) {
      this.children = this.children.splice(index, 1);
    }
  }
  equal(state) {
    if (!state || state.key !== this.key || state.parentKey !== this.parentKey) {
      return false;
    }
    if (this.children.length !== state.children.length || this.children.some((value, index) => value !== state.children[index])) {
      return false;
    }
    return true;
  }
}
export class GanttTreeListNodesState {
  constructor() {
    this._resetHash();
  }
  clear() {
    this._resetHash();
  }
  applyNodes(nodes, rootValue) {
    if (this._rootValue !== rootValue) {
      this._resetHash();
      this._rootValue = rootValue;
    }
    this._removeNonExistentNodes(nodes.map(node => node.key));
    nodes.forEach(node => this._applyNode(node));
    this._validateHash();
  }
  saveExpandedState(expandedKeys) {
    this._hasCollapsed = false;
    this._forEachState(state => {
      if (state.hasChildren() && !expandedKeys.includes(state.key)) {
        state.collapsed = true;
        this._hasCollapsed = true;
      }
    });
  }
  getExpandedKeys() {
    if (this._hasCollapsed) {
      var keys = [];
      this._forEachState(state => {
        if (state.hasChildren() && !state.collapsed) {
          keys.push(state.key);
        }
      });
      return keys;
    }
    return null;
  }
  _resetHash() {
    this._nodeHash = {};
    this._hasCollapsed = false;
  }
  _getNodeState(key) {
    return this._nodeHash[key];
  }
  _removeNonExistentNodes(existingKeys) {
    if (existingKeys) {
      this._forEachState(state => {
        if (!existingKeys.includes(state.key)) {
          this._removeStateWithChildren(state);
        }
      });
    }
  }
  _removeStateWithChildren(key) {
    var state = this._getNodeState(key);
    if (state) {
      state.children.forEach(child => this._removeStateWithChildren(child));
      var parent = this._getNodeState(state.parentKey);
      if (parent) {
        parent.removeChild(state);
      }
      delete this._nodeHash[key];
    }
  }
  _applyNode(node) {
    var nodeState = new GanttTreeListNodeState(node);
    var oldState = this._getNodeState(node.key);
    if (!(oldState !== null && oldState !== void 0 && oldState.equal(nodeState))) {
      this._nodeHash[node.key] = nodeState;
      this._expandTreelineToNode(node.key);
    }
  }
  _expandTreelineToNode(key) {
    var state = this._getNodeState(key);
    var parent = this._getNodeState(state === null || state === void 0 ? void 0 : state.parentKey);
    while (parent) {
      parent.collapsed = false;
      parent = this._getNodeState(parent.parentKey);
    }
  }
  _validateHash() {
    Object.keys(this._nodeHash).forEach(key => {
      var state = this._getNodeState(key);
      var parentKey = state === null || state === void 0 ? void 0 : state.parentKey;
      if (parentKey !== this._rootValue && !this._getNodeState(parentKey)) {
        this._removeStateWithChildren(key);
      }
    });
  }
  _forEachState(callback) {
    Object.keys(this._nodeHash).forEach(key => {
      var state = this._nodeHash[key];
      if (state) {
        callback(state);
      }
    });
  }
}