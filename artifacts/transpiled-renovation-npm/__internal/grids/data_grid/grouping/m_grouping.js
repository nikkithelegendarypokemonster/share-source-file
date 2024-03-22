"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupingHeaderPanelExtender = void 0;
var _devices = _interopRequireDefault(require("../../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _deferred = require("../../../../core/utils/deferred");
var _iterator = require("../../../../core/utils/iterator");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _accessibility = require("../../../../ui/shared/accessibility");
var _m_accessibility = require("../../../grids/grid_core/m_accessibility");
var _m_core = _interopRequireDefault(require("../m_core"));
var _m_data_source_adapter = _interopRequireDefault(require("../m_data_source_adapter"));
var _m_grouping_collapsed = require("./m_grouping_collapsed");
var _m_grouping_expanded = require("./m_grouping_expanded");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */ /* eslint-disable @typescript-eslint/method-signature-style */
const DATAGRID_GROUP_PANEL_CLASS = 'dx-datagrid-group-panel';
const DATAGRID_GROUP_PANEL_MESSAGE_CLASS = 'dx-group-panel-message';
const DATAGRID_GROUP_PANEL_ITEM_CLASS = 'dx-group-panel-item';
const DATAGRID_GROUP_PANEL_LABEL_CLASS = 'dx-toolbar-label';
const DATAGRID_GROUP_PANEL_CONTAINER_CLASS = 'dx-toolbar-item';
const DATAGRID_EXPAND_CLASS = 'dx-datagrid-expand';
const DATAGRID_GROUP_ROW_CLASS = 'dx-group-row';
const HEADER_FILTER_CLASS_SELECTOR = '.dx-header-filter';
const dataSourceAdapterExtender = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(GroupingDataSourceAdapterExtender, _Base);
  function GroupingDataSourceAdapterExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto = GroupingDataSourceAdapterExtender.prototype;
  _proto.init = function init() {
    _Base.prototype.init.apply(this, arguments);
    this._initGroupingHelper();
  };
  _proto._initGroupingHelper = function _initGroupingHelper(options) {
    const grouping = this._grouping;
    const isAutoExpandAll = this.option('grouping.autoExpandAll');
    const isFocusedRowEnabled = this.option('focusedRowEnabled');
    const remoteOperations = options ? options.remoteOperations : this.remoteOperations();
    const isODataRemoteOperations = remoteOperations.filtering && remoteOperations.sorting && remoteOperations.paging;
    if (isODataRemoteOperations && !remoteOperations.grouping && (isAutoExpandAll || !isFocusedRowEnabled)) {
      if (!grouping || grouping instanceof _m_grouping_collapsed.GroupingHelper) {
        this._grouping = new _m_grouping_expanded.GroupingHelper(this);
      }
    } else if (!grouping || grouping instanceof _m_grouping_expanded.GroupingHelper) {
      this._grouping = new _m_grouping_collapsed.GroupingHelper(this);
    }
  };
  _proto.totalItemsCount = function totalItemsCount() {
    const totalCount = _Base.prototype.totalItemsCount.call(this);
    return totalCount > 0 && this._dataSource.group() && this._dataSource.requireTotalCount() ? totalCount + this._grouping.totalCountCorrection() : totalCount;
  };
  _proto.itemsCount = function itemsCount() {
    return this._dataSource.group() ? this._grouping.itemsCount() || 0 : _Base.prototype.itemsCount.apply(this, arguments);
  };
  _proto.allowCollapseAll = function allowCollapseAll() {
    return this._grouping.allowCollapseAll();
  };
  _proto.isGroupItemCountable = function isGroupItemCountable(item) {
    return this._grouping.isGroupItemCountable(item);
  };
  _proto.isRowExpanded = function isRowExpanded(key) {
    const groupInfo = this._grouping.findGroupInfo(key);
    return groupInfo ? groupInfo.isExpanded : !this._grouping.allowCollapseAll();
  };
  _proto.collapseAll = function collapseAll(groupIndex) {
    return this._collapseExpandAll(groupIndex, false);
  };
  _proto.expandAll = function expandAll(groupIndex) {
    return this._collapseExpandAll(groupIndex, true);
  };
  _proto._collapseExpandAll = function _collapseExpandAll(groupIndex, isExpand) {
    const that = this;
    const dataSource = that._dataSource;
    const group = dataSource.group();
    const groups = _m_core.default.normalizeSortingInfo(group || []);
    if (groups.length) {
      for (let i = 0; i < groups.length; i++) {
        if (groupIndex === undefined || groupIndex === i) {
          groups[i].isExpanded = isExpand;
        } else if (group && group[i]) {
          groups[i].isExpanded = group[i].isExpanded;
        }
      }
      dataSource.group(groups);
      that._grouping.foreachGroups((groupInfo, parents) => {
        if (groupIndex === undefined || groupIndex === parents.length - 1) {
          groupInfo.isExpanded = isExpand;
        }
      }, false, true);
      that.resetPagesCache();
    }
    return true;
  };
  _proto.refresh = function refresh() {
    _Base.prototype.refresh.apply(this, arguments);
    return this._grouping.refresh.apply(this._grouping, arguments);
  };
  _proto.changeRowExpand = function changeRowExpand(path) {
    const that = this;
    const dataSource = that._dataSource;
    if (dataSource.group()) {
      dataSource.beginLoading();
      if (that._lastLoadOptions) {
        that._lastLoadOptions.groupExpand = true;
      }
      return that._changeRowExpandCore(path).always(() => {
        dataSource.endLoading();
      });
    }
  };
  _proto._changeRowExpandCore = function _changeRowExpandCore(path) {
    return this._grouping.changeRowExpand(path);
  }

  // @ts-expect-error
  ;
  _proto._hasGroupLevelsExpandState = function _hasGroupLevelsExpandState(group, isExpanded) {
    if (group && Array.isArray(group)) {
      for (let i = 0; i < group.length; i++) {
        if (group[i].isExpanded === isExpanded) {
          return true;
        }
      }
    }
  };
  _proto._customizeRemoteOperations = function _customizeRemoteOperations(options, operationTypes) {
    const {
      remoteOperations
    } = options;
    if (options.storeLoadOptions.group) {
      if (remoteOperations.grouping && !options.isCustomLoading) {
        if (!remoteOperations.groupPaging || this._hasGroupLevelsExpandState(options.storeLoadOptions.group, true)) {
          remoteOperations.paging = false;
        }
      }
      if (!remoteOperations.grouping && (!remoteOperations.sorting || !remoteOperations.filtering || options.isCustomLoading || this._hasGroupLevelsExpandState(options.storeLoadOptions.group, false))) {
        remoteOperations.paging = false;
      }
    } else if (!options.isCustomLoading && remoteOperations.paging && operationTypes.grouping) {
      this.resetCache();
    }
    _Base.prototype._customizeRemoteOperations.apply(this, arguments);
  };
  _proto._handleDataLoading = function _handleDataLoading(options) {
    _Base.prototype._handleDataLoading.call(this, options);
    this._initGroupingHelper(options);
    return this._grouping.handleDataLoading(options);
  };
  _proto._handleDataLoaded = function _handleDataLoaded(options) {
    return this._grouping.handleDataLoaded(options, _Base.prototype._handleDataLoaded.bind(this));
  };
  _proto._handleDataLoadedCore = function _handleDataLoadedCore(options) {
    return this._grouping.handleDataLoadedCore(options, _Base.prototype._handleDataLoadedCore.bind(this));
  };
  return GroupingDataSourceAdapterExtender;
}(Base);
_m_data_source_adapter.default.extend(dataSourceAdapterExtender);
const GroupingDataControllerExtender = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(GroupingDataControllerExtender, _Base2);
  function GroupingDataControllerExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto2 = GroupingDataControllerExtender.prototype;
  _proto2.init = function init() {
    const that = this;
    _Base2.prototype.init.call(this);
    that.createAction('onRowExpanding');
    that.createAction('onRowExpanded');
    that.createAction('onRowCollapsing');
    that.createAction('onRowCollapsed');
  };
  _proto2._beforeProcessItems = function _beforeProcessItems(items) {
    const groupColumns = this._columnsController.getGroupColumns();
    items = _Base2.prototype._beforeProcessItems.call(this, items);
    if (items.length && groupColumns.length) {
      items = this._processGroupItems(items, groupColumns.length);
    }
    return items;
  };
  _proto2._processItem = function _processItem(item, options) {
    if ((0, _type.isDefined)(item.groupIndex) && (0, _type.isString)(item.rowType) && item.rowType.indexOf('group') === 0) {
      item = this._processGroupItem(item, options);
      options.dataIndex = 0;
    } else {
      // @ts-expect-error
      item = _Base2.prototype._processItem.apply(this, arguments);
    }
    return item;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto2._processGroupItem = function _processGroupItem(item, options) {
    return item;
  };
  _proto2._processGroupItems = function _processGroupItems(items, groupsCount, options) {
    const that = this;
    const groupedColumns = that._columnsController.getGroupColumns();
    const column = groupedColumns[groupedColumns.length - groupsCount];
    if (!options) {
      const scrollingMode = that.option('scrolling.mode');
      options = {
        collectContinuationItems: scrollingMode !== 'virtual' && scrollingMode !== 'infinite',
        resultItems: [],
        path: [],
        values: []
      };
    }
    const {
      resultItems
    } = options;
    if (options.data) {
      if (options.collectContinuationItems || !options.data.isContinuation) {
        resultItems.push({
          rowType: 'group',
          data: options.data,
          groupIndex: options.path.length - 1,
          isExpanded: !!options.data.items,
          key: options.path.slice(0),
          values: options.values.slice(0)
        });
      }
    }
    if (items) {
      if (groupsCount === 0) {
        resultItems.push.apply(resultItems, items);
      } else {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item && 'items' in item) {
            options.data = item;
            options.path.push(item.key);
            options.values.push(column && column.deserializeValue && !column.calculateDisplayValue ? column.deserializeValue(item.key) : item.key);
            that._processGroupItems(item.items, groupsCount - 1, options);
            options.data = undefined;
            options.path.pop();
            options.values.pop();
          } else {
            resultItems.push(item);
          }
        }
      }
    }
    return resultItems;
  };
  _proto2.publicMethods = function publicMethods() {
    return _Base2.prototype.publicMethods.call(this).concat(['collapseAll', 'expandAll', 'isRowExpanded', 'expandRow', 'collapseRow']);
  };
  _proto2.collapseAll = function collapseAll(groupIndex) {
    const dataSource = this._dataSource;
    if (dataSource && dataSource.collapseAll(groupIndex)) {
      dataSource.pageIndex(0);
      dataSource.reload();
    }
  };
  _proto2.expandAll = function expandAll(groupIndex) {
    const dataSource = this._dataSource;
    if (dataSource && dataSource.expandAll(groupIndex)) {
      dataSource.pageIndex(0);
      dataSource.reload();
    }
  };
  _proto2.changeRowExpand = function changeRowExpand(key) {
    const that = this;
    const expanded = that.isRowExpanded(key);
    const args = {
      key,
      expanded
    };
    that.executeAction(expanded ? 'onRowCollapsing' : 'onRowExpanding', args);
    if (!args.cancel) {
      return (0, _deferred.when)(that._changeRowExpandCore(key)).done(() => {
        args.expanded = !expanded;
        that.executeAction(expanded ? 'onRowCollapsed' : 'onRowExpanded', args);
      });
    }
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  };
  _proto2._changeRowExpandCore = function _changeRowExpandCore(key) {
    const that = this;
    const dataSource = this._dataSource;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    if (!dataSource) {
      d.resolve();
    } else {
      (0, _deferred.when)(dataSource.changeRowExpand(key)).done(() => {
        that.load().done(d.resolve).fail(d.reject);
      }).fail(d.reject);
    }
    return d;
  };
  _proto2.isRowExpanded = function isRowExpanded(key) {
    const dataSource = this._dataSource;
    return dataSource && dataSource.isRowExpanded(key);
  };
  _proto2.expandRow = function expandRow(key) {
    if (!this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  };
  _proto2.collapseRow = function collapseRow(key) {
    if (this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  };
  _proto2.optionChanged = function optionChanged(args) {
    if (args.name === 'grouping' /* autoExpandAll */) {
      args.name = 'dataSource';
    }
    _Base2.prototype.optionChanged.call(this, args);
  };
  return GroupingDataControllerExtender;
}(Base);
const onGroupingMenuItemClick = function (column, params) {
  const columnsController = this._columnsController;
  // eslint-disable-next-line default-case
  switch (params.itemData.value) {
    case 'group':
      {
        const groups = columnsController._dataSource.group() || [];
        columnsController.columnOption(column.dataField, 'groupIndex', groups.length);
        break;
      }
    case 'ungroup':
      columnsController.columnOption(column.dataField, 'groupIndex', -1);
      break;
    case 'ungroupAll':
      this.component.clearGrouping();
      break;
  }
};
const isGroupPanelVisible = groupPanelOptions => {
  const visible = groupPanelOptions === null || groupPanelOptions === void 0 ? void 0 : groupPanelOptions.visible;
  return visible === 'auto' ? _devices.default.current().deviceType === 'desktop' : !!visible;
};
const _allowDragging = (groupPanelOptions, column) => {
  const isVisible = isGroupPanelVisible(groupPanelOptions);
  const canDrag = (groupPanelOptions === null || groupPanelOptions === void 0 ? void 0 : groupPanelOptions.allowColumnDragging) && column.allowGrouping;
  return isVisible && !!canDrag;
};
const GroupingHeaderPanelExtender = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(GroupingHeaderPanelExtender, _Base3);
  function GroupingHeaderPanelExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto3 = GroupingHeaderPanelExtender.prototype;
  _proto3._getToolbarItems = function _getToolbarItems() {
    const items = _Base3.prototype._getToolbarItems.call(this);
    return this._appendGroupingItem(items);
  };
  _proto3._appendGroupingItem = function _appendGroupingItem(items) {
    if (this._isGroupPanelVisible()) {
      let isRendered = false;
      const toolbarItem = {
        template: () => {
          const $groupPanel = (0, _renderer.default)('<div>').addClass(DATAGRID_GROUP_PANEL_CLASS);
          this._updateGroupPanelContent($groupPanel);
          (0, _m_accessibility.registerKeyboardAction)('groupPanel', this, $groupPanel, undefined, this._handleActionKeyDown.bind(this));
          return $groupPanel;
        },
        name: 'groupPanel',
        onItemRendered: () => {
          isRendered && this.renderCompleted.fire();
          isRendered = true;
        },
        location: 'before',
        locateInMenu: 'never',
        sortIndex: 1
      };
      items.push(toolbarItem);
      this.updateToolbarDimensions();
    }
    return items;
  };
  _proto3._handleActionKeyDown = function _handleActionKeyDown(args) {
    const {
      event
    } = args;
    const $target = (0, _renderer.default)(event.target);
    const groupColumnIndex = $target.closest(".".concat(DATAGRID_GROUP_PANEL_ITEM_CLASS)).index();
    const column = this._columnsController.getGroupColumns()[groupColumnIndex];
    const columnIndex = column && column.index;
    if ($target.is(HEADER_FILTER_CLASS_SELECTOR)) {
      this._headerFilterController.showHeaderFilterMenu(columnIndex, true);
    } else {
      // @ts-expect-error
      this._processGroupItemAction(columnIndex);
    }
    event.preventDefault();
  };
  _proto3._isGroupPanelVisible = function _isGroupPanelVisible() {
    return isGroupPanelVisible(this.option('groupPanel'));
  };
  _proto3._renderGroupPanelItems = function _renderGroupPanelItems($groupPanel, groupColumns) {
    const that = this;
    $groupPanel.empty();
    (0, _iterator.each)(groupColumns, (index, groupColumn) => {
      that._createGroupPanelItem($groupPanel, groupColumn);
    });
    (0, _accessibility.restoreFocus)(this);
  };
  _proto3._createGroupPanelItem = function _createGroupPanelItem($rootElement, groupColumn) {
    const $groupPanelItem = (0, _renderer.default)('<div>').addClass(groupColumn.cssClass).addClass(DATAGRID_GROUP_PANEL_ITEM_CLASS).data('columnData', groupColumn).appendTo($rootElement).text(groupColumn.caption);
    (0, _accessibility.setTabIndex)(this, $groupPanelItem);
    return $groupPanelItem;
  };
  _proto3._columnOptionChanged = function _columnOptionChanged(e) {
    if (!this._requireReady && !_m_core.default.checkChanges(e.optionNames, ['width', 'visibleWidth'])) {
      const $toolbarElement = this.element();
      const $groupPanel = $toolbarElement && $toolbarElement.find(".".concat(DATAGRID_GROUP_PANEL_CLASS));
      if ($groupPanel && $groupPanel.length) {
        this._updateGroupPanelContent($groupPanel);
        this.updateToolbarDimensions();
        this.renderCompleted.fire();
      }
    }
    _Base3.prototype._columnOptionChanged.call(this);
  };
  _proto3._updateGroupPanelContent = function _updateGroupPanelContent($groupPanel) {
    const groupColumns = this.getColumns();
    const groupPanelOptions = this.option('groupPanel');
    this._renderGroupPanelItems($groupPanel, groupColumns);
    if (groupPanelOptions.allowColumnDragging && !groupColumns.length) {
      (0, _renderer.default)('<div>').addClass(DATAGRID_GROUP_PANEL_MESSAGE_CLASS).text(groupPanelOptions.emptyPanelText).appendTo($groupPanel);
      $groupPanel.closest(".".concat(DATAGRID_GROUP_PANEL_CONTAINER_CLASS)).addClass(DATAGRID_GROUP_PANEL_LABEL_CLASS);
      $groupPanel.closest(".".concat(DATAGRID_GROUP_PANEL_LABEL_CLASS)).css('maxWidth', 'none');
    }
  };
  _proto3.allowDragging = function allowDragging(column) {
    const groupPanelOptions = this.option('groupPanel');
    return _allowDragging(groupPanelOptions, column);
  };
  _proto3.getColumnElements = function getColumnElements() {
    const $element = this.element();
    return $element && $element.find(".".concat(DATAGRID_GROUP_PANEL_ITEM_CLASS));
  };
  _proto3.getColumns = function getColumns() {
    return this._columnsController.getGroupColumns();
  };
  _proto3.getBoundingRect = function getBoundingRect() {
    const that = this;
    const $element = that.element();
    if ($element && $element.find(".".concat(DATAGRID_GROUP_PANEL_CLASS)).length) {
      const offset = $element.offset();
      return {
        top: offset.top,
        bottom: offset.top + (0, _size.getHeight)($element)
      };
    }
    return null;
  };
  _proto3.getName = function getName() {
    return 'group';
  };
  _proto3.getContextMenuItems = function getContextMenuItems(options) {
    const that = this;
    const contextMenuEnabled = that.option('grouping.contextMenuEnabled');
    const $groupedColumnElement = (0, _renderer.default)(options.targetElement).closest(".".concat(DATAGRID_GROUP_PANEL_ITEM_CLASS));
    let items;
    if ($groupedColumnElement.length) {
      options.column = $groupedColumnElement.data('columnData');
    }
    if (contextMenuEnabled && options.column) {
      const {
        column
      } = options;
      const isGroupingAllowed = (0, _type.isDefined)(column.allowGrouping) ? column.allowGrouping : true;
      if (isGroupingAllowed) {
        const isColumnGrouped = (0, _type.isDefined)(column.groupIndex) && column.groupIndex > -1;
        const groupingTexts = that.option('grouping.texts');
        const onItemClick = onGroupingMenuItemClick.bind(that, column);
        items = [{
          text: groupingTexts.ungroup,
          value: 'ungroup',
          disabled: !isColumnGrouped,
          onItemClick
        }, {
          text: groupingTexts.ungroupAll,
          value: 'ungroupAll',
          onItemClick
        }];
      }
    }
    return items;
  };
  _proto3.isVisible = function isVisible() {
    return _Base3.prototype.isVisible.call(this) || this._isGroupPanelVisible();
  };
  _proto3.hasGroupedColumns = function hasGroupedColumns() {
    return this._isGroupPanelVisible() && !!this.getColumns().length;
  };
  _proto3.optionChanged = function optionChanged(args) {
    if (args.name === 'groupPanel') {
      this._invalidate();
      args.handled = true;
    } else {
      _Base3.prototype.optionChanged.call(this, args);
    }
  };
  return GroupingHeaderPanelExtender;
}(Base);
exports.GroupingHeaderPanelExtender = GroupingHeaderPanelExtender;
const GroupingRowsViewExtender = Base => /*#__PURE__*/function (_Base4) {
  _inheritsLoose(GroupingRowsViewExtender, _Base4);
  function GroupingRowsViewExtender() {
    return _Base4.apply(this, arguments) || this;
  }
  var _proto4 = GroupingRowsViewExtender.prototype;
  _proto4.getContextMenuItems = function getContextMenuItems(options) {
    const that = this;
    const contextMenuEnabled = that.option('grouping.contextMenuEnabled');
    let items;
    if (contextMenuEnabled && options.row && options.row.rowType === 'group') {
      const columnsController = that._columnsController;
      const column = columnsController.columnOption("groupIndex:".concat(options.row.groupIndex));
      if (column && column.allowGrouping) {
        const groupingTexts = that.option('grouping.texts');
        const onItemClick = onGroupingMenuItemClick.bind(that, column);
        items = [];
        items.push({
          text: groupingTexts.ungroup,
          value: 'ungroup',
          onItemClick
        }, {
          text: groupingTexts.ungroupAll,
          value: 'ungroupAll',
          onItemClick
        });
      }
    }
    return items;
  };
  _proto4._rowClick = function _rowClick(e) {
    const that = this;
    const expandMode = that.option('grouping.expandMode');
    const scrollingMode = that.option('scrolling.mode');
    const isGroupRowStateChanged = scrollingMode !== 'infinite' && expandMode === 'rowClick' && (0, _renderer.default)(e.event.target).closest(".".concat(DATAGRID_GROUP_ROW_CLASS)).length;
    const isExpandButtonClicked = (0, _renderer.default)(e.event.target).closest(".".concat(DATAGRID_EXPAND_CLASS)).length;
    if (isGroupRowStateChanged || isExpandButtonClicked) {
      that._changeGroupRowState(e);
    }
    _Base4.prototype._rowClick.call(this, e);
  };
  _proto4._changeGroupRowState = function _changeGroupRowState(e) {
    const row = this._dataController.items()[e.rowIndex];
    // @ts-expect-error
    const allowCollapsing = this._columnsController.columnOption("groupIndex:".concat(row.groupIndex), 'allowCollapsing');
    if (row.rowType === 'data' || row.rowType === 'group' && allowCollapsing !== false) {
      // @ts-expect-error
      this._dataController.changeRowExpand(row.key, true);
      e.event.preventDefault();
      e.handled = true;
    }
  };
  return GroupingRowsViewExtender;
}(Base);
const columnHeadersViewExtender = Base => /*#__PURE__*/function (_Base5) {
  _inheritsLoose(GroupingHeadersViewExtender, _Base5);
  function GroupingHeadersViewExtender() {
    return _Base5.apply(this, arguments) || this;
  }
  var _proto5 = GroupingHeadersViewExtender.prototype;
  _proto5.getContextMenuItems = function getContextMenuItems(options) {
    const that = this;
    const contextMenuEnabled = that.option('grouping.contextMenuEnabled');
    let items = _Base5.prototype.getContextMenuItems.call(this, options);
    if (contextMenuEnabled && options.row && (options.row.rowType === 'header' || options.row.rowType === 'detailAdaptive')) {
      const {
        column
      } = options;
      if (!column.command && (!(0, _type.isDefined)(column.allowGrouping) || column.allowGrouping)) {
        const groupingTexts = that.option('grouping.texts');
        const isColumnGrouped = (0, _type.isDefined)(column.groupIndex) && column.groupIndex > -1;
        const onItemClick = onGroupingMenuItemClick.bind(that, column);
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        items = items || [];
        items.push({
          text: groupingTexts.groupByThisColumn,
          value: 'group',
          beginGroup: true,
          disabled: isColumnGrouped,
          onItemClick
        });
        if (column.showWhenGrouped) {
          items.push({
            text: groupingTexts.ungroup,
            value: 'ungroup',
            disabled: !isColumnGrouped,
            onItemClick
          });
        }
        items.push({
          text: groupingTexts.ungroupAll,
          value: 'ungroupAll',
          onItemClick
        });
      }
    }
    return items;
  };
  _proto5.allowDragging = function allowDragging(column) {
    const groupPanelOptions = this.option('groupPanel');
    return _allowDragging(groupPanelOptions, column) || _Base5.prototype.allowDragging.call(this, column);
  };
  return GroupingHeadersViewExtender;
}(Base);
_m_core.default.registerModule('grouping', {
  defaultOptions() {
    return {
      grouping: {
        autoExpandAll: true,
        allowCollapsing: true,
        contextMenuEnabled: false,
        expandMode: 'buttonClick',
        texts: {
          groupContinuesMessage: _message.default.format('dxDataGrid-groupContinuesMessage'),
          groupContinuedMessage: _message.default.format('dxDataGrid-groupContinuedMessage'),
          groupByThisColumn: _message.default.format('dxDataGrid-groupHeaderText'),
          ungroup: _message.default.format('dxDataGrid-ungroupHeaderText'),
          ungroupAll: _message.default.format('dxDataGrid-ungroupAllText')
        }
      },
      groupPanel: {
        visible: false,
        emptyPanelText: _message.default.format('dxDataGrid-groupPanelEmptyText'),
        allowColumnDragging: true
      }
    };
  },
  extenders: {
    controllers: {
      data: GroupingDataControllerExtender,
      columns: Base => /*#__PURE__*/function (_Base6) {
        _inheritsLoose(GroupingColumnsExtender, _Base6);
        function GroupingColumnsExtender() {
          return _Base6.apply(this, arguments) || this;
        }
        var _proto6 = GroupingColumnsExtender.prototype;
        _proto6._getExpandColumnOptions = function _getExpandColumnOptions() {
          // @ts-expect-error
          const options = _Base6.prototype._getExpandColumnOptions.apply(this, arguments);
          // @ts-expect-error
          options.cellTemplate = _m_core.default.getExpandCellTemplate();
          return options;
        };
        return GroupingColumnsExtender;
      }(Base),
      editing: Base => /*#__PURE__*/function (_Base7) {
        _inheritsLoose(GroupingEditingExtender, _Base7);
        function GroupingEditingExtender() {
          return _Base7.apply(this, arguments) || this;
        }
        var _proto7 = GroupingEditingExtender.prototype;
        _proto7._isProcessedItem = function _isProcessedItem(item) {
          return (0, _type.isDefined)(item.groupIndex) && (0, _type.isString)(item.rowType) && item.rowType.indexOf('group') === 0;
        };
        return GroupingEditingExtender;
      }(Base)
    },
    views: {
      headerPanel: GroupingHeaderPanelExtender,
      rowsView: GroupingRowsViewExtender,
      columnHeadersView: columnHeadersViewExtender
    }
  }
});