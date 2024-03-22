"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _deferred = require("../core/utils/deferred");
var _extend = require("../core/utils/extend");
var _type = require("../core/utils/type");
var _array_store = _interopRequireDefault(require("../data/array_store"));
var _data_source = require("../data/data_source/data_source");
var _utils = require("../data/data_source/utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let DataController = /*#__PURE__*/function () {
  function DataController(dataSourceOptions, _ref) {
    let {
      key
    } = _ref;
    this._isSharedDataSource = false;
    this._keyExpr = key;
    this.updateDataSource(dataSourceOptions);
  }
  var _proto = DataController.prototype;
  _proto._updateDataSource = function _updateDataSource(dataSourceOptions) {
    if (!dataSourceOptions) {
      return;
    }
    if (dataSourceOptions instanceof _data_source.DataSource) {
      this._isSharedDataSource = true;
      this._dataSource = dataSourceOptions;
    } else {
      const normalizedDataSourceOptions = (0, _utils.normalizeDataSourceOptions)(dataSourceOptions);
      this._dataSource = new _data_source.DataSource((0, _extend.extend)(true, {}, {}, normalizedDataSourceOptions));
    }
  };
  _proto._updateDataSourceByItems = function _updateDataSourceByItems(items) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this._dataSource = new _data_source.DataSource({
      store: new _array_store.default({
        key: this.key(),
        data: items
      }),
      pageSize: 0
    });
  };
  _proto._disposeDataSource = function _disposeDataSource() {
    if (this._dataSource) {
      if (this._isSharedDataSource) {
        this._isSharedDataSource = false;
      } else {
        this._dataSource.dispose();
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      delete this._dataSource;
    }
  };
  _proto.load = function load() {
    return this._dataSource.load();
  };
  _proto.loadSingle = function loadSingle(propName, propValue) {
    if (!this._dataSource) {
      // @ts-expect-error TS2350
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new _deferred.Deferred().reject();
    }
    let pName = propName;
    let pValue = propValue;
    if (arguments.length < 2) {
      pValue = propName;
      pName = this.key();
    }
    return this._dataSource.loadSingle(pName, pValue);
  };
  _proto.loadFromStore = function loadFromStore(loadOptions) {
    return this.store().load(loadOptions);
  };
  _proto.loadNextPage = function loadNextPage() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    this.pageIndex(1 + this.pageIndex());
    return this.load();
  };
  _proto.loadOptions = function loadOptions() {
    return this._dataSource.loadOptions();
  };
  _proto.userData = function userData() {
    return this._dataSource._userData;
  };
  _proto.cancel = function cancel(operationId) {
    this._dataSource.cancel(operationId);
  };
  _proto.cancelAll = function cancelAll() {
    this._dataSource.cancelAll();
  };
  _proto.filter = function filter(_filter) {
    return this._dataSource.filter(_filter);
  };
  _proto.addSearchFilter = function addSearchFilter(storeLoadOptions) {
    this._dataSource._addSearchFilter(storeLoadOptions);
  };
  _proto.group = function group(_group) {
    return this._dataSource.group(_group);
  };
  _proto.paginate = function paginate() {
    return this._dataSource.paginate();
  };
  _proto.pageSize = function pageSize() {
    return this._dataSource._pageSize;
  };
  _proto.pageIndex = function pageIndex(_pageIndex) {
    if (_pageIndex === undefined) {
      return this._dataSource.pageIndex(undefined);
    }
    return this._dataSource.pageIndex(_pageIndex);
  };
  _proto.resetDataSource = function resetDataSource() {
    this._disposeDataSource();
  };
  _proto.resetDataSourcePageIndex = function resetDataSourcePageIndex() {
    if (this.pageIndex()) {
      this.pageIndex(0);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.load();
    }
  };
  _proto.updateDataSource = function updateDataSource(items, key) {
    const dataSourceOptions = items !== null && items !== void 0 ? items : this.items();
    if (key) {
      this._keyExpr = key;
    }
    this._disposeDataSource();
    if (Array.isArray(dataSourceOptions)) {
      this._updateDataSourceByItems(dataSourceOptions);
    } else {
      this._updateDataSource(dataSourceOptions);
    }
  };
  _proto.totalCount = function totalCount() {
    return this._dataSource.totalCount();
  };
  _proto.isLastPage = function isLastPage() {
    return this._dataSource.isLastPage() || !this._dataSource._pageSize;
  };
  _proto.isLoading = function isLoading() {
    return this._dataSource.isLoading();
  };
  _proto.isLoaded = function isLoaded() {
    return this._dataSource.isLoaded();
  };
  _proto.searchValue = function searchValue(value) {
    return this._dataSource.searchValue(value);
  };
  _proto.searchOperation = function searchOperation(operation) {
    return this._dataSource.searchOperation(operation);
  };
  _proto.searchExpr = function searchExpr(expr) {
    return this._dataSource.searchExpr(expr);
  };
  _proto.select = function select() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return this._dataSource.select(args);
  };
  _proto.key = function key() {
    var _a;
    const storeKey = (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.key();
    return (0, _type.isDefined)(storeKey) && this._keyExpr === 'this' ? storeKey : this._keyExpr;
  };
  _proto.keyOf = function keyOf(item) {
    return this.store().keyOf(item);
  };
  _proto.store = function store() {
    return this._dataSource.store();
  };
  _proto.items = function items() {
    var _a;
    return (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.items();
  };
  _proto.applyMapFunction = function applyMapFunction(data) {
    return this._dataSource._applyMapFunction(data);
  };
  _proto.getDataSource = function getDataSource() {
    var _a;
    return (_a = this._dataSource) !== null && _a !== void 0 ? _a : null;
  };
  _proto.reload = function reload() {
    return this._dataSource.reload();
  };
  _proto.on = function on(event, handler) {
    this._dataSource.on(event, handler);
  };
  _proto.off = function off(event, handler) {
    this._dataSource.off(event, handler);
  };
  return DataController;
}();
var _default = exports.default = DataController;