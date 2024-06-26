"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeListDataController = void 0;
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _m_data_controller = require("../../../grids/grid_core/data_controller/m_data_controller");
var _m_data_source_adapter = _interopRequireDefault(require("../data_source_adapter/m_data_source_adapter"));
var _m_core = _interopRequireDefault(require("../m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let TreeListDataController = exports.TreeListDataController = /*#__PURE__*/function (_DataController) {
  _inheritsLoose(TreeListDataController, _DataController);
  function TreeListDataController() {
    return _DataController.apply(this, arguments) || this;
  }
  var _proto = TreeListDataController.prototype;
  _proto._getDataSourceAdapter = function _getDataSourceAdapter() {
    return _m_data_source_adapter.default;
  };
  _proto._getNodeLevel = function _getNodeLevel(node) {
    let level = -1;
    while (node.parent) {
      if (node.visible) {
        level++;
      }
      node = node.parent;
    }
    return level;
  };
  _proto._generateDataItem = function _generateDataItem(node, options) {
    return {
      rowType: 'data',
      node,
      key: node.key,
      data: node.data,
      isExpanded: this.isRowExpanded(node.key, options),
      level: this._getNodeLevel(node)
    };
  };
  _proto._loadOnOptionChange = function _loadOnOptionChange() {
    this._dataSource.load();
  };
  _proto._isItemEquals = function _isItemEquals(item1, item2) {
    if (item1.isSelected !== item2.isSelected) {
      return false;
    }
    if (item1.node && item2.node && item1.node.hasChildren !== item2.node.hasChildren) {
      return false;
    }
    if (item1.level !== item2.level || item1.isExpanded !== item2.isExpanded) {
      return false;
    }
    return _DataController.prototype._isItemEquals.apply(this, arguments);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._isCellChanged = function _isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate) {
    // @ts-expect-error
    const firstDataColumnIndex = this._columnsController.getFirstDataColumnIndex();
    if (columnIndex === firstDataColumnIndex && oldRow.isSelected !== newRow.isSelected) {
      return true;
    }
    return _DataController.prototype._isCellChanged.apply(this, arguments);
  };
  _proto.init = function init() {
    this.createAction('onRowExpanding');
    this.createAction('onRowExpanded');
    this.createAction('onRowCollapsing');
    this.createAction('onRowCollapsed');
    _DataController.prototype.init.apply(this, arguments);
  };
  _proto.keyOf = function keyOf(data) {
    const dataSource = this._dataSource;
    if (dataSource) {
      return dataSource.keyOf(data);
    }
  };
  _proto.key = function key() {
    const dataSource = this._dataSource;
    if (dataSource) {
      return dataSource.getKeyExpr();
    }
  };
  _proto.publicMethods = function publicMethods() {
    return _DataController.prototype.publicMethods.call(this).concat(['expandRow', 'collapseRow', 'isRowExpanded', 'getRootNode', 'getNodeByKey', 'loadDescendants', 'forEachNode']);
  };
  _proto.changeRowExpand = function changeRowExpand(key) {
    if (this._dataSource) {
      const args = {
        key
      };
      const isExpanded = this.isRowExpanded(key);
      this.executeAction(isExpanded ? 'onRowCollapsing' : 'onRowExpanding', args);
      if (!args.cancel) {
        return this._dataSource.changeRowExpand(key).done(() => {
          this.executeAction(isExpanded ? 'onRowCollapsed' : 'onRowExpanded', args);
        });
      }
    }
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  };
  _proto.isRowExpanded = function isRowExpanded(key, cache) {
    return this._dataSource && this._dataSource.isRowExpanded(key, cache);
  };
  _proto.expandRow = function expandRow(key) {
    if (!this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  };
  _proto.collapseRow = function collapseRow(key) {
    if (this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  };
  _proto.getRootNode = function getRootNode() {
    return this._dataSource && this._dataSource.getRootNode();
  };
  _proto.optionChanged = function optionChanged(args) {
    switch (args.name) {
      case 'rootValue':
      case 'parentIdExpr':
      case 'itemsExpr':
      case 'filterMode':
      case 'expandNodesOnFiltering':
      case 'autoExpandAll':
      case 'hasItemsExpr':
      case 'dataStructure':
        this._columnsController.reset();
        this._items = [];
        this._refreshDataSource();
        args.handled = true;
        break;
      case 'expandedRowKeys':
      case 'onNodesInitialized':
        if (this._dataSource && !this._dataSource._isNodesInitializing && !(0, _common.equalByValue)(args.value, args.previousValue)) {
          this._loadOnOptionChange();
        }
        args.handled = true;
        break;
      case 'maxFilterLengthInRequest':
        args.handled = true;
        break;
      default:
        _DataController.prototype.optionChanged.call(this, args);
    }
  };
  _proto.getNodeByKey = function getNodeByKey(key) {
    if (!this._dataSource) {
      return;
    }
    return this._dataSource.getNodeByKey(key);
  };
  _proto.getChildNodeKeys = function getChildNodeKeys(parentKey) {
    if (!this._dataSource) {
      return;
    }
    return this._dataSource.getChildNodeKeys(parentKey);
  };
  _proto.loadDescendants = function loadDescendants(keys, childrenOnly) {
    if (!this._dataSource) {
      return;
    }
    return this._dataSource.loadDescendants(keys, childrenOnly);
  };
  _proto.forEachNode = function forEachNode() {
    this._dataSource.forEachNode.apply(this, arguments);
  };
  return TreeListDataController;
}(_m_data_controller.DataController);
_m_core.default.registerModule('data', {
  defaultOptions() {
    return (0, _extend.extend)({}, _m_data_controller.dataControllerModule.defaultOptions(), {
      itemsExpr: 'items',
      parentIdExpr: 'parentId',
      rootValue: 0,
      dataStructure: 'plain',
      expandedRowKeys: [],
      filterMode: 'withAncestors',
      expandNodesOnFiltering: true,
      autoExpandAll: false,
      onNodesInitialized: null,
      maxFilterLengthInRequest: 1500,
      paging: {
        enabled: false
      }
    });
  },
  controllers: {
    data: TreeListDataController
  }
});