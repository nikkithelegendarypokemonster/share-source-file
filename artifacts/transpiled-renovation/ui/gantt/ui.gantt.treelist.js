"use strict";

exports.GanttTreeList = void 0;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _tree_list = _interopRequireDefault(require("../tree_list"));
var _position = require("../../core/utils/position");
var _type = require("../../core/utils/type");
var _uiGantt = require("./ui.gantt.helper");
var _data_source = require("../../data/data_source/data_source");
var _array_store = _interopRequireDefault(require("../../data/array_store"));
var _data = require("../../core/utils/data");
var _uiGanttTreelist = require("./ui.gantt.treelist.nodes_state");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const GANTT_TASKS = 'tasks';
const GANTT_COLLAPSABLE_ROW = 'dx-gantt-collapsable-row';
const GANTT_DEFAULT_ROW_HEIGHT = 34;
const GANTT_SCROLL_ACTIVATION_LEVEL = 1;
let GanttTreeList = exports.GanttTreeList = /*#__PURE__*/function () {
  function GanttTreeList(gantt) {
    this._gantt = gantt;
    this._$treeList = this._gantt._$treeList;
  }
  var _proto = GanttTreeList.prototype;
  _proto.getTreeList = function getTreeList() {
    const {
      keyExpr,
      parentIdExpr
    } = this._gantt.option(GANTT_TASKS);
    this._treeList = this._gantt._createComponent(this._$treeList, _tree_list.default, {
      dataSource: this.createDataSource(this._gantt._tasksRaw, keyExpr),
      keyExpr: keyExpr,
      filterSyncEnabled: true,
      parentIdExpr: parentIdExpr,
      columns: this.getColumns(),
      columnResizingMode: 'nextColumn',
      height: this._getHeight(),
      width: this._gantt.option('taskListWidth'),
      selection: {
        mode: _uiGantt.GanttHelper.getSelectionMode(this._gantt.option('allowSelection'))
      },
      selectedRowKeys: _uiGantt.GanttHelper.getArrayFromOneElement(this._gantt.option('selectedRowKey')),
      sorting: this._gantt.option('sorting'),
      filterRow: this._gantt.option('filterRow'),
      headerFilter: this._gantt.option('headerFilter'),
      scrolling: {
        showScrollbar: 'onHover',
        mode: 'virtual'
      },
      allowColumnResizing: true,
      autoExpandAll: true,
      showRowLines: this._gantt.option('showRowLines'),
      rootValue: this._gantt.option('rootValue'),
      onContentReady: e => {
        this._onContentReady(e);
      },
      onSelectionChanged: e => {
        this._onSelectionChanged(e);
      },
      onRowCollapsed: e => {
        this._onRowCollapsed(e);
      },
      onRowExpanded: e => {
        this._onRowExpanded(e);
      },
      onRowPrepared: e => {
        this._onRowPrepared(e);
      },
      onContextMenuPreparing: e => {
        this._onContextMenuPreparing(e);
      },
      onRowClick: e => {
        this.onRowClick(e);
      },
      onRowDblClick: e => {
        this.onRowDblClick(e);
      },
      onNodesInitialized: e => {
        this._onNodesInitialized(e);
      },
      _disableDeprecationWarnings: true
    });
    return this._treeList;
  };
  _proto.onAfterTreeListCreate = function onAfterTreeListCreate() {
    if (this._postponedGanttInitRequired) {
      this._initGanttOnContentReady({
        component: this._treeList
      });
      delete this._postponedGanttInitRequired;
    }
  };
  _proto._onContentReady = function _onContentReady(e) {
    const hasTreeList = !!this._treeList;
    if (hasTreeList) {
      this._initGanttOnContentReady(e);
    } else {
      this._postponedGanttInitRequired = true;
    }
    this._gantt._onTreeListContentReady(e);
  };
  _proto._initGanttOnContentReady = function _initGanttOnContentReady(e) {
    if (e.component.getDataSource()) {
      this._gantt._initGanttView();
      this._initScrollSync(e.component);
    }
    this._gantt._sortAndFilter();
    this._gantt._sizeHelper.updateGanttRowHeights();
  };
  _proto._onSelectionChanged = function _onSelectionChanged(e) {
    const selectedRowKey = e.currentSelectedRowKeys[0];
    this._gantt._setGanttViewOption('selectedRowKey', selectedRowKey);
    this._gantt._setOptionWithoutOptionChange('selectedRowKey', selectedRowKey);
    this._gantt._actionsManager.raiseSelectionChangedAction(selectedRowKey);
  };
  _proto._onRowCollapsed = function _onRowCollapsed(e) {
    this._gantt._onTreeListRowExpandChanged(e, false);
  };
  _proto._onRowExpanded = function _onRowExpanded(e) {
    this._gantt._onTreeListRowExpandChanged(e, true);
  };
  _proto._onRowPrepared = function _onRowPrepared(e) {
    if (e.rowType === 'data' && e.node.children.length > 0) {
      (0, _renderer.default)(e.rowElement).addClass(GANTT_COLLAPSABLE_ROW);
    }
  };
  _proto._onContextMenuPreparing = function _onContextMenuPreparing(e) {
    var _e$row, _e$row2;
    if (e.target === 'header') {
      return;
    }
    if (((_e$row = e.row) === null || _e$row === void 0 ? void 0 : _e$row.rowType) === 'data') {
      this.setOption('selectedRowKeys', [e.row.data[this._gantt.option('tasks.keyExpr')]]);
    }
    e.items = [];
    const info = {
      cancel: false,
      event: e.event,
      type: 'task',
      key: (_e$row2 = e.row) === null || _e$row2 === void 0 ? void 0 : _e$row2.key,
      position: {
        x: e.event.pageX,
        y: e.event.pageY
      }
    };
    this._gantt._showPopupMenu(info);
  };
  _proto._getHeight = function _getHeight() {
    if ((0, _size.getHeight)(this._$treeList)) {
      return (0, _size.getHeight)(this._$treeList);
    }
    this._gantt._hasHeight = (0, _type.isDefined)(this._gantt.option('height')) && this._gantt.option('height') !== '';
    return this._gantt._hasHeight ? '100%' : '';
  };
  _proto._initScrollSync = function _initScrollSync(treeList) {
    const treeListScrollable = treeList.getScrollable();
    if (treeListScrollable) {
      treeListScrollable.off('scroll');
      treeListScrollable.on('scroll', e => {
        this._onScroll(e);
      });
    }
  };
  _proto._onScroll = function _onScroll(treeListScrollView) {
    const ganttViewTaskAreaContainer = this._gantt._ganttView.getTaskAreaContainer();
    if (ganttViewTaskAreaContainer.scrollTop !== treeListScrollView.component.scrollTop()) {
      ganttViewTaskAreaContainer.scrollTop = treeListScrollView.component.scrollTop();
    }
  };
  _proto._correctRowsViewRowHeight = function _correctRowsViewRowHeight(height) {
    const view = this._treeList._views && this._treeList._views['rowsView'];
    if ((view === null || view === void 0 ? void 0 : view._rowHeight) !== height) {
      view._rowHeight = height;
    }
  };
  _proto._skipUpdateTreeListDataSource = function _skipUpdateTreeListDataSource() {
    return this._gantt.option('validation.autoUpdateParentTasks');
  };
  _proto.selectRows = function selectRows(keys) {
    this.setOption('selectedRowKeys', keys);
  };
  _proto.scrollBy = function scrollBy(scrollTop) {
    const treeListScrollable = this._treeList.getScrollable();
    if (treeListScrollable) {
      const diff = scrollTop - treeListScrollable.scrollTop();
      if (Math.abs(diff) >= GANTT_SCROLL_ACTIVATION_LEVEL) {
        treeListScrollable.scrollBy({
          left: 0,
          top: diff
        });
      }
    }
  };
  _proto.updateDataSource = function updateDataSource(data) {
    let forceUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let forceCustomData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (!this._skipUpdateTreeListDataSource() || forceUpdate) {
      this.setDataSource(data);
    } else if (forceCustomData) {
      const data = this._treeList.option('dataSource');
      this._gantt._onParentTasksRecalculated(data);
    }
  };
  _proto.setDataSource = function setDataSource(data) {
    this.setOption('dataSource', this.createDataSource(data));
  };
  _proto.createDataSource = function createDataSource(data, key) {
    return data && new _data_source.DataSource({
      store: new _array_store.default({
        data: data,
        key: key || this.getOption('keyExpr')
      })
    });
  };
  _proto.onRowClick = function onRowClick(e) {
    this._gantt._actionsManager.raiseTaskClickAction(e.key, e.event);
  };
  _proto.onRowDblClick = function onRowDblClick(e) {
    if (this._gantt._actionsManager.raiseTaskDblClickAction(e.key, e.event)) {
      this._gantt._ganttView._ganttViewCore.showTaskEditDialog();
    }
  };
  _proto.saveExpandedKeys = function saveExpandedKeys() {
    const treeList = this._treeList;
    const visibleRowCount = treeList === null || treeList === void 0 ? void 0 : treeList.getVisibleRows().length;
    if (visibleRowCount > 0) {
      const nodes = this.getAllNodes();
      const keys = this.getOption('expandedRowKeys');
      const hasExpandedRows = keys && nodes.length !== visibleRowCount;
      if (hasExpandedRows) {
        const state = this.getNodesState();
        state.applyNodes(nodes, this.getOption('rootValue'));
        state.saveExpandedState(keys);
      }
    }
  };
  _proto._onNodesInitialized = function _onNodesInitialized(e) {
    const state = this.getNodesState();
    const savedKeys = state.getExpandedKeys();
    const nodes = this.getAllNodes();
    state.applyNodes(nodes, this.getOption('rootValue'));
    const expandedKeys = state.getExpandedKeys();
    if (expandedKeys) {
      this.setOption('expandedRowKeys', expandedKeys);
    }
    if (this.isExpandedStateChanged(savedKeys, expandedKeys)) {
      const expandedState = nodes.reduce((previous, node) => {
        previous[node.key] = expandedKeys ? expandedKeys.includes(node.key) : true;
        return previous;
      }, {});
      this._gantt._ganttView.applyTasksExpandedState(expandedState);
    }
    state.clear();
  };
  _proto.getNodesState = function getNodesState() {
    if (!this._nodeState) {
      this._nodeState = new _uiGanttTreelist.GanttTreeListNodesState();
    }
    return this._nodeState;
  };
  _proto.getAllNodes = function getAllNodes() {
    var _this$_treeList, _this$_treeList$getDa, _this$_treeList2;
    const store = (_this$_treeList = this._treeList) === null || _this$_treeList === void 0 ? void 0 : (_this$_treeList$getDa = _this$_treeList.getDataSource()) === null || _this$_treeList$getDa === void 0 ? void 0 : _this$_treeList$getDa.store();
    if (!store || !((_this$_treeList2 = this._treeList) !== null && _this$_treeList2 !== void 0 && _this$_treeList2.getNodeByKey)) {
      return [];
    }
    const keyGetter = (0, _data.compileGetter)(store.key());
    return store._array.map(item => this._treeList.getNodeByKey(keyGetter(item))).filter(item => !!item);
  };
  _proto.isExpandedStateChanged = function isExpandedStateChanged(keys1, keys2) {
    if (keys1 === null && keys2 === null) {
      return false;
    }
    if ((keys1 === null || keys1 === void 0 ? void 0 : keys1.length) !== (keys2 === null || keys2 === void 0 ? void 0 : keys2.length)) {
      return true;
    }
    return keys1.some((key, index) => key !== keys2[index]);
  };
  _proto.getOffsetHeight = function getOffsetHeight() {
    return this._gantt._treeList._$element.get(0).offsetHeight;
  };
  _proto.getRowHeight = function getRowHeight() {
    const $row = this._treeList._$element.find('.dx-data-row');
    let height = $row.length ? (0, _position.getBoundingRect)($row.last().get(0)).height : GANTT_DEFAULT_ROW_HEIGHT;
    if (!height) {
      height = GANTT_DEFAULT_ROW_HEIGHT;
    }
    this._correctRowsViewRowHeight(height);
    return height;
  };
  _proto.getHeaderHeight = function getHeaderHeight() {
    return (0, _position.getBoundingRect)(this._treeList._$element.find('.dx-treelist-headers').get(0)).height;
  };
  _proto.getColumns = function getColumns() {
    const columns = this._gantt.option('columns');
    if (columns) {
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const isKeyColumn = column.dataField === this._gantt.option("".concat(GANTT_TASKS, ".keyExpr")) || column.dataField === this._gantt.option("".concat(GANTT_TASKS, ".parentIdExpr"));
        if (isKeyColumn && !column.dataType) {
          column.dataType = 'object';
        }
      }
    }
    return columns;
  };
  _proto.getSievedItems = function getSievedItems() {
    const rootNode = this._treeList.getRootNode();
    if (!rootNode) {
      return undefined;
    }
    const resultArray = [];
    _uiGantt.GanttHelper.convertTreeToList(rootNode, resultArray);
    const getters = _uiGantt.GanttHelper.compileGettersByOption(this._gantt.option(GANTT_TASKS));
    const validatedData = this._gantt._validateSourceData(GANTT_TASKS, resultArray);
    const mappedData = validatedData.map(_uiGantt.GanttHelper.prepareMapHandler(getters));
    return mappedData;
  };
  _proto.setOption = function setOption(optionName, value) {
    this._treeList && this._treeList.option(optionName, value);
  };
  _proto.getOption = function getOption(optionName) {
    var _this$_treeList3;
    return (_this$_treeList3 = this._treeList) === null || _this$_treeList3 === void 0 ? void 0 : _this$_treeList3.option(optionName);
  };
  _proto.onTaskInserted = function onTaskInserted(insertedId, parentId) {
    if ((0, _type.isDefined)(parentId)) {
      const expandedRowKeys = this.getOption('expandedRowKeys');
      if (expandedRowKeys.indexOf(parentId) === -1) {
        expandedRowKeys.push(parentId);
        this.setOption('expandedRowKeys', expandedRowKeys);
      }
    }
    this.selectRows(_uiGantt.GanttHelper.getArrayFromOneElement(insertedId));
    this.setOption('focusedRowKey', insertedId);
  };
  _proto.getDataSource = function getDataSource() {
    var _this$_treeList4;
    return (_this$_treeList4 = this._treeList) === null || _this$_treeList4 === void 0 ? void 0 : _this$_treeList4.getDataSource();
  };
  return GanttTreeList;
}();