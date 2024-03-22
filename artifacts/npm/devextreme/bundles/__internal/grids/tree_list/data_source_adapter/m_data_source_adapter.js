/**
* DevExtreme (bundles/__internal/grids/tree_list/data_source_adapter/m_data_source_adapter.js)
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
var _common = require("../../../../core/utils/common");
var _data = require("../../../../core/utils/data");
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _array_store = _interopRequireDefault(require("../../../../data/array_store"));
var _array_utils = require("../../../../data/array_utils");
var _query = _interopRequireDefault(require("../../../../data/query"));
var _store_helper = _interopRequireDefault(require("../../../../data/store_helper"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_data_source_adapter = _interopRequireDefault(require("../../../grids/grid_core/data_source_adapter/m_data_source_adapter"));
var _m_utils = _interopRequireDefault(require("../../../grids/grid_core/m_utils"));
var _m_core = _interopRequireDefault(require("../m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const {
  queryByOptions
} = _store_helper.default;
const DEFAULT_KEY_EXPRESSION = 'id';
const isFullBranchFilterMode = that => that.option('filterMode') === 'fullBranch';
const getChildKeys = function (that, keys) {
  const childKeys = [];
  keys.forEach(key => {
    const node = that.getNodeByKey(key);
    node && node.children.forEach(child => {
      childKeys.push(child.key);
    });
  });
  return childKeys;
};
const applySorting = (data, sort) => queryByOptions((0, _query.default)(data), {
  sort
}).toArray();
let DataSourceAdapterTreeList = /*#__PURE__*/function (_DataSourceAdapter) {
  _inheritsLoose(DataSourceAdapterTreeList, _DataSourceAdapter);
  function DataSourceAdapterTreeList() {
    return _DataSourceAdapter.apply(this, arguments) || this;
  }
  var _proto = DataSourceAdapterTreeList.prototype;
  _proto._createKeyGetter = function _createKeyGetter() {
    const keyExpr = this.getKeyExpr();
    return (0, _data.compileGetter)(keyExpr);
  };
  _proto._createKeySetter = function _createKeySetter() {
    const keyExpr = this.getKeyExpr();
    if ((0, _type.isFunction)(keyExpr)) {
      return keyExpr;
    }
    return (0, _data.compileSetter)(keyExpr);
  };
  _proto.createParentIdGetter = function createParentIdGetter() {
    return (0, _data.compileGetter)(this.option('parentIdExpr'));
  };
  _proto.createParentIdSetter = function createParentIdSetter() {
    const parentIdExpr = this.option('parentIdExpr');
    if ((0, _type.isFunction)(parentIdExpr)) {
      return parentIdExpr;
    }
    return (0, _data.compileSetter)(parentIdExpr);
  };
  _proto._createItemsGetter = function _createItemsGetter() {
    return (0, _data.compileGetter)(this.option('itemsExpr'));
  };
  _proto._createHasItemsGetter = function _createHasItemsGetter() {
    const hasItemsExpr = this.option('hasItemsExpr');
    return hasItemsExpr && (0, _data.compileGetter)(hasItemsExpr);
  };
  _proto._createHasItemsSetter = function _createHasItemsSetter() {
    const hasItemsExpr = this.option('hasItemsExpr');
    if ((0, _type.isFunction)(hasItemsExpr)) {
      return hasItemsExpr;
    }
    return hasItemsExpr && (0, _data.compileSetter)(hasItemsExpr);
  };
  _proto._updateIndexByKeyObject = function _updateIndexByKeyObject(items) {
    const that = this;
    that._indexByKey = {};
    (0, _iterator.each)(items, (index, item) => {
      that._indexByKey[item.key] = index;
    });
  };
  _proto._calculateHasItems = function _calculateHasItems(node, options) {
    const that = this;
    const {
      parentIds
    } = options.storeLoadOptions;
    let hasItems;
    const isFullBranch = isFullBranchFilterMode(that);
    if (that._hasItemsGetter && (parentIds || !options.storeLoadOptions.filter || isFullBranch)) {
      hasItems = that._hasItemsGetter(node.data);
    }
    if (hasItems === undefined) {
      if (!that._isChildrenLoaded[node.key] && options.remoteOperations.filtering && (parentIds || isFullBranch)) {
        hasItems = true;
      } else if (options.loadOptions.filter && !options.remoteOperations.filtering && isFullBranch) {
        hasItems = node.children.length;
      } else {
        hasItems = node.hasChildren;
      }
    }
    return !!hasItems;
  };
  _proto._fillVisibleItemsByNodes = function _fillVisibleItemsByNodes(nodes, options, result) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].visible) {
        result.push(nodes[i]);
      }
      if ((this.isRowExpanded(nodes[i].key, options) || !nodes[i].visible) && nodes[i].hasChildren && nodes[i].children.length) {
        this._fillVisibleItemsByNodes(nodes[i].children, options, result);
      }
    }
  };
  _proto._convertItemToNode = function _convertItemToNode(item, rootValue, nodeByKey) {
    const key = this._keyGetter(item);
    let parentId = this._parentIdGetter(item);
    parentId = (0, _type.isDefined)(parentId) ? parentId : rootValue;
    const parentNode = nodeByKey[parentId] = nodeByKey[parentId] || {
      key: parentId,
      children: []
    };
    const node = nodeByKey[key] = nodeByKey[key] || {
      key,
      children: []
    };
    node.data = item;
    node.parent = parentNode;
    return node;
  };
  _proto._createNodesByItems = function _createNodesByItems(items, visibleItems) {
    const that = this;
    const rootValue = that.option('rootValue');
    const visibleByKey = {};
    const nodeByKey = that._nodeByKey = {};
    let i;
    if (visibleItems) {
      for (i = 0; i < visibleItems.length; i++) {
        visibleByKey[this._keyGetter(visibleItems[i])] = true;
      }
    }
    for (i = 0; i < items.length; i++) {
      const node = that._convertItemToNode(items[i], rootValue, nodeByKey);
      if (node.key === undefined) {
        return;
      }
      node.visible = !visibleItems || !!visibleByKey[node.key];
      if (node.parent) {
        node.parent.children.push(node);
      }
    }
    const rootNode = nodeByKey[rootValue] || {
      key: rootValue,
      children: []
    };
    rootNode.level = -1;
    return rootNode;
  };
  _proto._convertDataToPlainStructure = function _convertDataToPlainStructure(data, parentId, result) {
    let key;
    if (this._itemsGetter && !data.isConverted) {
      result = result || [];
      for (let i = 0; i < data.length; i++) {
        const item = (0, _array_utils.createObjectWithChanges)(data[i]);
        key = this._keyGetter(item);
        if (key === undefined) {
          key = result.length + 1;
          this._keySetter(item, key);
        }
        this._parentIdSetter(item, parentId === undefined ? this.option('rootValue') : parentId);
        result.push(item);
        const childItems = this._itemsGetter(item);
        if (childItems && childItems.length) {
          this._convertDataToPlainStructure(childItems, key, result);
          const itemsExpr = this.option('itemsExpr');
          if (!(0, _type.isFunction)(itemsExpr)) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete item[itemsExpr];
          }
        }
      }
      result.isConverted = true;
      return result;
    }
    return data;
  };
  _proto._createIdFilter = function _createIdFilter(field, keys) {
    const parentIdFilters = [];
    for (let i = 0; i < keys.length; i++) {
      parentIdFilters.push([field, '=', keys[i]]);
    }
    return _m_utils.default.combineFilters(parentIdFilters, 'or');
  };
  _proto._customizeRemoteOperations = function _customizeRemoteOperations(options, operationTypes) {
    _DataSourceAdapter.prototype._customizeRemoteOperations.apply(this, arguments);
    options.remoteOperations.paging = false;
    let expandVisibleNodes = false;
    if (this.option('autoExpandAll')) {
      options.remoteOperations.sorting = false;
      options.remoteOperations.filtering = false;
      if ((!this._lastLoadOptions || operationTypes.filtering && !options.storeLoadOptions.filter) && !options.isCustomLoading) {
        expandVisibleNodes = true;
      }
    }
    if (!options.isCustomLoading) {
      this._isReload = this._isReload || operationTypes.reload;
      if (!options.cachedStoreData) {
        this._isChildrenLoaded = {};
        if (this._isReload) {
          this._nodeByKey = {};
        }
      }
      if (this.option('expandNodesOnFiltering') && (operationTypes.filtering || this._isReload && options.storeLoadOptions.filter)) {
        if (options.storeLoadOptions.filter) {
          expandVisibleNodes = true;
        } else {
          options.collapseVisibleNodes = true;
        }
      }
    }
    options.expandVisibleNodes = expandVisibleNodes;
  };
  _proto._getParentIdsToLoad = function _getParentIdsToLoad(parentIds) {
    const parentIdsToLoad = [];
    for (let i = 0; i < parentIds.length; i++) {
      const node = this.getNodeByKey(parentIds[i]);
      if (!node || node.hasChildren && !node.children.length) {
        parentIdsToLoad.push(parentIds[i]);
      }
    }
    return parentIdsToLoad;
  }
  /**
   * @extended: TreeLists's data_source_adapter
   */;
  _proto._handleCustomizeStoreLoadOptions = function _handleCustomizeStoreLoadOptions(options) {
    const rootValue = this.option('rootValue');
    const parentIdExpr = this.option('parentIdExpr');
    let {
      parentIds
    } = options.storeLoadOptions;
    if (parentIds) {
      options.isCustomLoading = false;
    }
    _DataSourceAdapter.prototype._handleCustomizeStoreLoadOptions.apply(this, arguments);
    if (options.remoteOperations.filtering && !options.isCustomLoading) {
      if (isFullBranchFilterMode(this) && options.cachedStoreData || !options.storeLoadOptions.filter) {
        const expandedRowKeys = options.collapseVisibleNodes ? [] : this.option('expandedRowKeys');
        parentIds = [rootValue].concat(expandedRowKeys).concat(parentIds || []);
        const parentIdsToLoad = options.data ? this._getParentIdsToLoad(parentIds) : parentIds;
        if (parentIdsToLoad.length) {
          options.cachedPagingData = undefined;
          options.data = undefined;
          options.mergeStoreLoadData = true;
          options.delay = this.option('loadingTimeout'); // T991320
        }
        options.storeLoadOptions.parentIds = parentIdsToLoad;
        options.storeLoadOptions.filter = this._createIdFilter(parentIdExpr, parentIdsToLoad);
      }
    }
  };
  _proto._generateInfoToLoad = function _generateInfoToLoad(data, needChildren) {
    const that = this;
    let key;
    const keyMap = {};
    const resultKeyMap = {};
    const resultKeys = [];
    const rootValue = that.option('rootValue');
    let i;
    for (i = 0; i < data.length; i++) {
      key = needChildren ? that._parentIdGetter(data[i]) : that._keyGetter(data[i]);
      keyMap[key] = true;
    }
    for (i = 0; i < data.length; i++) {
      key = needChildren ? that._keyGetter(data[i]) : that._parentIdGetter(data[i]);
      const needToLoad = needChildren ? that.isRowExpanded(key) : key !== rootValue;
      if (!keyMap[key] && !resultKeyMap[key] && needToLoad) {
        resultKeyMap[key] = true;
        resultKeys.push(key);
      }
    }
    return {
      keyMap: resultKeyMap,
      keys: resultKeys
    };
  };
  _proto._loadParentsOrChildren = function _loadParentsOrChildren(data, options, needChildren) {
    var _a, _b, _c;
    let filter;
    let needLocalFiltering;
    const {
      keys,
      keyMap
    } = this._generateInfoToLoad(data, needChildren);
    // @ts-expect-error
    const d = new _deferred.Deferred();
    const isRemoteFiltering = options.remoteOperations.filtering;
    const maxFilterLengthInRequest = this.option('maxFilterLengthInRequest');
    const sort = (_b = (_a = options.storeLoadOptions) === null || _a === void 0 ? void 0 : _a.sort) !== null && _b !== void 0 ? _b : (_c = options.loadOptions) === null || _c === void 0 ? void 0 : _c.sort;
    let loadOptions = isRemoteFiltering ? options.storeLoadOptions : options.loadOptions;
    const concatLoadedData = loadedData => {
      if (isRemoteFiltering) {
        this._cachedStoreData = applySorting(this._cachedStoreData.concat(loadedData), sort);
      }
      return applySorting(data.concat(loadedData), sort);
    };
    if (!keys.length) {
      return d.resolve(data);
    }
    let cachedNodes = keys.map(id => this.getNodeByKey(id)).filter(node => node && node.data);
    if (cachedNodes.length === keys.length) {
      if (needChildren) {
        cachedNodes = cachedNodes.reduce((result, node) => result.concat(node.children), []);
      }
      if (cachedNodes.length) {
        return this._loadParentsOrChildren(concatLoadedData(cachedNodes.map(node => node.data)), options, needChildren);
      }
    }
    const keyExpr = needChildren ? this.option('parentIdExpr') : this.getKeyExpr();
    filter = this._createIdFilter(keyExpr, keys);
    const filterLength = encodeURI(JSON.stringify(filter)).length;
    if (filterLength > maxFilterLengthInRequest) {
      filter = itemData => keyMap[needChildren ? this._parentIdGetter(itemData) : this._keyGetter(itemData)];
      needLocalFiltering = isRemoteFiltering;
    }
    loadOptions = (0, _extend.extend)({}, loadOptions, {
      filter: !needLocalFiltering ? filter : null
    });
    const store = options.fullData ? new _array_store.default(options.fullData) : this._dataSource.store();
    this.loadFromStore(loadOptions, store).done(loadedData => {
      if (loadedData.length) {
        if (needLocalFiltering) {
          loadedData = (0, _query.default)(loadedData).filter(filter).toArray();
        }
        this._loadParentsOrChildren(concatLoadedData(loadedData), options, needChildren).done(d.resolve).fail(d.reject);
      } else {
        d.resolve(data);
      }
    }).fail(d.reject);
    return d;
  };
  _proto._loadParents = function _loadParents(data, options) {
    return this._loadParentsOrChildren(data, options);
  };
  _proto._loadChildrenIfNeed = function _loadChildrenIfNeed(data, options) {
    if (isFullBranchFilterMode(this)) {
      return this._loadParentsOrChildren(data, options, true);
    }
    return (0, _deferred.when)(data);
  };
  _proto._updateHasItemsMap = function _updateHasItemsMap(options) {
    const {
      parentIds
    } = options.storeLoadOptions;
    if (parentIds) {
      for (let i = 0; i < parentIds.length; i++) {
        this._isChildrenLoaded[parentIds[i]] = true;
      }
    }
  };
  _proto._getKeyInfo = function _getKeyInfo() {
    return {
      key: () => 'key',
      keyOf: data => data.key
    };
  };
  _proto._processChanges = function _processChanges(changes) {
    let processedChanges = [];
    changes.forEach(change => {
      if (change.type === 'insert') {
        processedChanges = processedChanges.concat(this._applyInsert(change));
      } else if (change.type === 'remove') {
        processedChanges = processedChanges.concat(this._applyRemove(change));
      } else if (change.type === 'update') {
        processedChanges.push({
          type: change.type,
          key: change.key,
          data: {
            data: change.data
          }
        });
      }
    });
    return processedChanges;
  };
  _proto._handleChanging = function _handleChanging(e) {
    _DataSourceAdapter.prototype._handleChanging.apply(this, arguments);
    const processChanges = changes => {
      const changesToProcess = changes.filter(item => item.type === 'update');
      return this._processChanges(changesToProcess);
    };
    e.postProcessChanges = processChanges;
  };
  _proto._applyBatch = function _applyBatch(changes) {
    const processedChanges = this._processChanges(changes);
    _DataSourceAdapter.prototype._applyBatch.call(this, processedChanges);
  };
  _proto._setHasItems = function _setHasItems(node, value) {
    const hasItemsSetter = this._hasItemsSetter;
    node.hasChildren = value;
    if (hasItemsSetter && node.data) {
      hasItemsSetter(node.data, value);
    }
  };
  _proto._applyInsert = function _applyInsert(change) {
    const that = this;
    const baseChanges = [];
    const parentId = that.parentKeyOf(change.data);
    const parentNode = that.getNodeByKey(parentId);
    if (parentNode) {
      const rootValue = that.option('rootValue');
      const node = that._convertItemToNode(change.data, rootValue, that._nodeByKey);
      node.hasChildren = false;
      node.level = parentNode.level + 1;
      node.visible = true;
      parentNode.children.push(node);
      that._isChildrenLoaded[node.key] = true;
      that._setHasItems(parentNode, true);
      if ((!parentNode.parent || that.isRowExpanded(parentNode.key)) && change.index !== undefined) {
        let index = that.items().indexOf(parentNode) + 1;
        index += change.index >= 0 ? Math.min(change.index, parentNode.children.length) : parentNode.children.length;
        baseChanges.push({
          type: change.type,
          data: node,
          index
        });
      }
    }
    return baseChanges;
  };
  _proto._needToCopyDataObject = function _needToCopyDataObject() {
    return false;
  };
  _proto._applyRemove = function _applyRemove(change) {
    let baseChanges = [];
    const node = this.getNodeByKey(change.key);
    const parentNode = node && node.parent;
    if (parentNode) {
      const index = parentNode.children.indexOf(node);
      if (index >= 0) {
        parentNode.children.splice(index, 1);
        if (!parentNode.children.length) {
          this._setHasItems(parentNode, false);
        }
        baseChanges.push(change);
        baseChanges = baseChanges.concat(this.getChildNodeKeys(change.key).map(key => ({
          type: change.type,
          key
        })));
      }
    }
    return baseChanges;
  };
  _proto._handleDataLoaded = function _handleDataLoaded(options) {
    const data = options.data = this._convertDataToPlainStructure(options.data);
    if (!options.remoteOperations.filtering && options.loadOptions.filter) {
      options.fullData = queryByOptions((0, _query.default)(options.data), {
        sort: options.loadOptions && options.loadOptions.sort
      }).toArray();
    }
    this._updateHasItemsMap(options);
    _DataSourceAdapter.prototype._handleDataLoaded.call(this, options);
    if (data.isConverted && this._cachedStoreData) {
      this._cachedStoreData.isConverted = true;
    }
  };
  _proto._fillNodes = function _fillNodes(nodes, options, expandedRowKeys, level) {
    const isFullBranch = isFullBranchFilterMode(this);
    level = level || 0;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      let needToExpand = false;
      // node.hasChildren = false;
      this._fillNodes(nodes[i].children, options, expandedRowKeys, level + 1);
      node.level = level;
      node.hasChildren = this._calculateHasItems(node, options);
      if (node.visible && node.hasChildren) {
        if (isFullBranch) {
          if (node.children.filter(node => node.visible).length) {
            needToExpand = true;
          } else if (node.children.length) {
            _m_core.default.foreachNodes(node.children, node => {
              node.visible = true;
            });
          }
        } else {
          needToExpand = true;
        }
        if (options.expandVisibleNodes && needToExpand) {
          expandedRowKeys.push(node.key);
        }
      }
      if (node.visible || node.hasChildren) {
        node.parent.hasChildren = true;
      }
    }
  };
  _proto._processTreeStructure = function _processTreeStructure(options, visibleItems) {
    let {
      data
    } = options;
    const {
      parentIds
    } = options.storeLoadOptions;
    const expandedRowKeys = [];
    if (parentIds && parentIds.length || this._isReload) {
      if (options.fullData && options.fullData.length > options.data.length) {
        data = options.fullData;
        visibleItems = visibleItems || options.data;
      }
      this._rootNode = this._createNodesByItems(data, visibleItems);
      if (!this._rootNode) {
        // @ts-expect-error
        options.data = new _deferred.Deferred().reject(_ui.default.Error('E1046', this.getKeyExpr()));
        return;
      }
      this._fillNodes(this._rootNode.children, options, expandedRowKeys);
      this._isNodesInitializing = true;
      if (options.collapseVisibleNodes || expandedRowKeys.length) {
        this.option('expandedRowKeys', expandedRowKeys);
      }
      this._isReload = false;
      this.executeAction('onNodesInitialized', {
        root: this._rootNode
      });
      this._isNodesInitializing = false;
    }
    const resultData = [];
    this._fillVisibleItemsByNodes(this._rootNode.children, options, resultData);
    options.data = resultData;
    this._totalItemsCount = resultData.length;
  };
  _proto._handleDataLoadedCore = function _handleDataLoadedCore(options) {
    const that = this;
    const {
      data
    } = options;
    const filter = options.storeLoadOptions.filter || options.loadOptions.filter;
    const filterMode = that.option('filterMode');
    let visibleItems;
    const {
      parentIds
    } = options.storeLoadOptions;
    const needLoadParents = filter && (!parentIds || !parentIds.length) && filterMode !== 'standard';
    if (!options.isCustomLoading) {
      if (needLoadParents) {
        // @ts-expect-error
        const d = options.data = new _deferred.Deferred();
        if (filterMode === 'matchOnly') {
          visibleItems = data;
        }
        return that._loadParents(data, options).done(data => {
          that._loadChildrenIfNeed(data, options).done(data => {
            options.data = data;
            that._processTreeStructure(options, visibleItems);
            _DataSourceAdapter.prototype._handleDataLoadedCore.call(that, options);
            d.resolve(options.data);
          });
        }).fail(d.reject);
      }
      that._processTreeStructure(options);
    }
    _DataSourceAdapter.prototype._handleDataLoadedCore.call(this, options);
  };
  _proto._handlePush = function _handlePush(_ref) {
    let {
      changes
    } = _ref;
    const reshapeOnPush = this._dataSource._reshapeOnPush;
    const isNeedReshape = reshapeOnPush && !!changes.length;
    if (isNeedReshape) {
      this._isReload = true;
    }
    changes.forEach(change => {
      var _a;
      (_a = change.index) !== null && _a !== void 0 ? _a : change.index = -1;
    });
    _DataSourceAdapter.prototype._handlePush.apply(this, arguments);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.init = function init(dataSource, remoteOperations) {
    _DataSourceAdapter.prototype.init.apply(this, arguments);
    const dataStructure = this.option('dataStructure');
    this._keyGetter = this._createKeyGetter();
    this._parentIdGetter = this.createParentIdGetter();
    this._hasItemsGetter = this._createHasItemsGetter();
    this._hasItemsSetter = this._createHasItemsSetter();
    if (dataStructure === 'tree') {
      this._itemsGetter = this._createItemsGetter();
      this._keySetter = this._createKeySetter();
      this._parentIdSetter = this.createParentIdSetter();
    }
    this._nodeByKey = {};
    this._isChildrenLoaded = {};
    this._totalItemsCount = 0;
    this.createAction('onNodesInitialized');
  };
  _proto.getKeyExpr = function getKeyExpr() {
    const store = this.store();
    const key = store && store.key();
    const keyExpr = this.option('keyExpr');
    if ((0, _type.isDefined)(key) && (0, _type.isDefined)(keyExpr)) {
      if (!(0, _common.equalByValue)(key, keyExpr)) {
        throw _ui.default.Error('E1044');
      }
    }
    return key || keyExpr || DEFAULT_KEY_EXPRESSION;
  };
  _proto.keyOf = function keyOf(data) {
    return this._keyGetter && this._keyGetter(data);
  };
  _proto.parentKeyOf = function parentKeyOf(data) {
    return this._parentIdGetter && this._parentIdGetter(data);
  };
  _proto.getRootNode = function getRootNode() {
    return this._rootNode;
  };
  _proto.totalItemsCount = function totalItemsCount() {
    return this._totalItemsCount + this._totalCountCorrection;
  };
  _proto.isRowExpanded = function isRowExpanded(key, cache) {
    var _a;
    if (cache) {
      let {
        isExpandedByKey
      } = cache;
      if (!isExpandedByKey) {
        const expandedRowKeys = (_a = this.option('expandedRowKeys')) !== null && _a !== void 0 ? _a : [];
        isExpandedByKey = cache.isExpandedByKey = {};
        expandedRowKeys.forEach(key => {
          isExpandedByKey[key] = true;
        });
      }
      return !!isExpandedByKey[key];
    }
    const indexExpandedNodeKey = _m_utils.default.getIndexByKey(key, this.option('expandedRowKeys'), null);
    return indexExpandedNodeKey >= 0;
  };
  _proto._changeRowExpandCore = function _changeRowExpandCore(key) {
    const expandedRowKeys = this.option('expandedRowKeys').slice();
    const indexExpandedNodeKey = _m_utils.default.getIndexByKey(key, expandedRowKeys, null);
    if (indexExpandedNodeKey < 0) {
      expandedRowKeys.push(key);
    } else {
      expandedRowKeys.splice(indexExpandedNodeKey, 1);
    }
    this.option('expandedRowKeys', expandedRowKeys);
  };
  _proto.changeRowExpand = function changeRowExpand(key) {
    this._changeRowExpandCore(key);
    // @ts-expect-error
    return this._isNodesInitializing ? new _deferred.Deferred().resolve() : this.load();
  };
  _proto.getNodeByKey = function getNodeByKey(key) {
    if (this._nodeByKey) {
      return this._nodeByKey[key];
    }
  };
  _proto.getNodeLeafKeys = function getNodeLeafKeys() {
    const that = this;
    const result = [];
    const keys = that._rootNode ? [that._rootNode.key] : [];
    keys.forEach(key => {
      const node = that.getNodeByKey(key);
      node && _m_core.default.foreachNodes([node], childNode => {
        !childNode.children.length && result.push(childNode.key);
      });
    });
    return result;
  };
  _proto.getChildNodeKeys = function getChildNodeKeys(parentKey) {
    const node = this.getNodeByKey(parentKey);
    const childrenKeys = [];
    node && _m_core.default.foreachNodes(node.children, childNode => {
      childrenKeys.push(childNode.key);
    });
    return childrenKeys;
  };
  _proto.loadDescendants = function loadDescendants(keys, childrenOnly) {
    const that = this;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    const remoteOperations = that.remoteOperations();
    if ((0, _type.isDefined)(keys)) {
      keys = Array.isArray(keys) ? keys : [keys];
    } else {
      keys = that.getNodeLeafKeys();
    }
    if (!remoteOperations.filtering || !keys.length) {
      return d.resolve();
    }
    const loadOptions = that._dataSource._createStoreLoadOptions();
    loadOptions.parentIds = keys;
    that.load(loadOptions).done(() => {
      if (!childrenOnly) {
        const childKeys = getChildKeys(that, keys);
        if (childKeys.length) {
          that.loadDescendants(childKeys, childrenOnly).done(d.resolve).fail(d.reject);
          return;
        }
      }
      d.resolve();
    }).fail(d.reject);
    return d.promise();
  };
  _proto.forEachNode = function forEachNode() {
    let nodes = [];
    let callback;
    if (arguments.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      callback = arguments[0];
      const rootNode = this.getRootNode();
      nodes = rootNode && rootNode.children || [];
    } else if (arguments.length === 2) {
      // eslint-disable-next-line prefer-destructuring
      callback = arguments[1];
      // eslint-disable-next-line prefer-destructuring
      nodes = arguments[0];
      nodes = Array.isArray(nodes) ? nodes : [nodes];
    }
    _m_core.default.foreachNodes(nodes, callback);
  };
  return DataSourceAdapterTreeList;
}(_m_data_source_adapter.default);
let DataSourceAdapterTreeListType = DataSourceAdapterTreeList;
var _default = exports.default = {
  extend(extender) {
    DataSourceAdapterTreeListType = extender(DataSourceAdapterTreeListType);
  },
  create(component) {
    return new DataSourceAdapterTreeListType(component);
  }
};
