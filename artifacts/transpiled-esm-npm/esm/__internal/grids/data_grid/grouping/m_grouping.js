/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/method-signature-style */
import devices from '../../../../core/devices';
import $ from '../../../../core/renderer';
import { Deferred, when } from '../../../../core/utils/deferred';
import { each } from '../../../../core/utils/iterator';
import { getHeight } from '../../../../core/utils/size';
import { isDefined, isString } from '../../../../core/utils/type';
import messageLocalization from '../../../../localization/message';
import { restoreFocus, setTabIndex } from '../../../../ui/shared/accessibility';
import { registerKeyboardAction } from '../../../grids/grid_core/m_accessibility';
import gridCore from '../m_core';
import dataSourceAdapterProvider from '../m_data_source_adapter';
import { GroupingHelper as CollapsedGroupingHelper } from './m_grouping_collapsed';
import { GroupingHelper as ExpandedGroupingHelper } from './m_grouping_expanded';
var DATAGRID_GROUP_PANEL_CLASS = 'dx-datagrid-group-panel';
var DATAGRID_GROUP_PANEL_MESSAGE_CLASS = 'dx-group-panel-message';
var DATAGRID_GROUP_PANEL_ITEM_CLASS = 'dx-group-panel-item';
var DATAGRID_GROUP_PANEL_LABEL_CLASS = 'dx-toolbar-label';
var DATAGRID_GROUP_PANEL_CONTAINER_CLASS = 'dx-toolbar-item';
var DATAGRID_EXPAND_CLASS = 'dx-datagrid-expand';
var DATAGRID_GROUP_ROW_CLASS = 'dx-group-row';
var HEADER_FILTER_CLASS_SELECTOR = '.dx-header-filter';
var dataSourceAdapterExtender = Base => class GroupingDataSourceAdapterExtender extends Base {
  init() {
    super.init.apply(this, arguments);
    this._initGroupingHelper();
  }
  _initGroupingHelper(options) {
    var grouping = this._grouping;
    var isAutoExpandAll = this.option('grouping.autoExpandAll');
    var isFocusedRowEnabled = this.option('focusedRowEnabled');
    var remoteOperations = options ? options.remoteOperations : this.remoteOperations();
    var isODataRemoteOperations = remoteOperations.filtering && remoteOperations.sorting && remoteOperations.paging;
    if (isODataRemoteOperations && !remoteOperations.grouping && (isAutoExpandAll || !isFocusedRowEnabled)) {
      if (!grouping || grouping instanceof CollapsedGroupingHelper) {
        this._grouping = new ExpandedGroupingHelper(this);
      }
    } else if (!grouping || grouping instanceof ExpandedGroupingHelper) {
      this._grouping = new CollapsedGroupingHelper(this);
    }
  }
  totalItemsCount() {
    var totalCount = super.totalItemsCount();
    return totalCount > 0 && this._dataSource.group() && this._dataSource.requireTotalCount() ? totalCount + this._grouping.totalCountCorrection() : totalCount;
  }
  itemsCount() {
    return this._dataSource.group() ? this._grouping.itemsCount() || 0 : super.itemsCount.apply(this, arguments);
  }
  allowCollapseAll() {
    return this._grouping.allowCollapseAll();
  }
  isGroupItemCountable(item) {
    return this._grouping.isGroupItemCountable(item);
  }
  isRowExpanded(key) {
    var groupInfo = this._grouping.findGroupInfo(key);
    return groupInfo ? groupInfo.isExpanded : !this._grouping.allowCollapseAll();
  }
  collapseAll(groupIndex) {
    return this._collapseExpandAll(groupIndex, false);
  }
  expandAll(groupIndex) {
    return this._collapseExpandAll(groupIndex, true);
  }
  _collapseExpandAll(groupIndex, isExpand) {
    var that = this;
    var dataSource = that._dataSource;
    var group = dataSource.group();
    var groups = gridCore.normalizeSortingInfo(group || []);
    if (groups.length) {
      for (var i = 0; i < groups.length; i++) {
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
  }
  refresh() {
    super.refresh.apply(this, arguments);
    return this._grouping.refresh.apply(this._grouping, arguments);
  }
  changeRowExpand(path) {
    var that = this;
    var dataSource = that._dataSource;
    if (dataSource.group()) {
      dataSource.beginLoading();
      if (that._lastLoadOptions) {
        that._lastLoadOptions.groupExpand = true;
      }
      return that._changeRowExpandCore(path).always(() => {
        dataSource.endLoading();
      });
    }
  }
  _changeRowExpandCore(path) {
    return this._grouping.changeRowExpand(path);
  }

  // @ts-expect-error
  _hasGroupLevelsExpandState(group, isExpanded) {
    if (group && Array.isArray(group)) {
      for (var i = 0; i < group.length; i++) {
        if (group[i].isExpanded === isExpanded) {
          return true;
        }
      }
    }
  }
  _customizeRemoteOperations(options, operationTypes) {
    var {
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
    super._customizeRemoteOperations.apply(this, arguments);
  }
  _handleDataLoading(options) {
    super._handleDataLoading(options);
    this._initGroupingHelper(options);
    return this._grouping.handleDataLoading(options);
  }
  _handleDataLoaded(options) {
    return this._grouping.handleDataLoaded(options, super._handleDataLoaded.bind(this));
  }
  _handleDataLoadedCore(options) {
    return this._grouping.handleDataLoadedCore(options, super._handleDataLoadedCore.bind(this));
  }
};
dataSourceAdapterProvider.extend(dataSourceAdapterExtender);
var GroupingDataControllerExtender = Base => class GroupingDataControllerExtender extends Base {
  init() {
    var that = this;
    super.init();
    that.createAction('onRowExpanding');
    that.createAction('onRowExpanded');
    that.createAction('onRowCollapsing');
    that.createAction('onRowCollapsed');
  }
  _beforeProcessItems(items) {
    var groupColumns = this._columnsController.getGroupColumns();
    items = super._beforeProcessItems(items);
    if (items.length && groupColumns.length) {
      items = this._processGroupItems(items, groupColumns.length);
    }
    return items;
  }
  _processItem(item, options) {
    if (isDefined(item.groupIndex) && isString(item.rowType) && item.rowType.indexOf('group') === 0) {
      item = this._processGroupItem(item, options);
      options.dataIndex = 0;
    } else {
      // @ts-expect-error
      item = super._processItem.apply(this, arguments);
    }
    return item;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _processGroupItem(item, options) {
    return item;
  }
  _processGroupItems(items, groupsCount, options) {
    var that = this;
    var groupedColumns = that._columnsController.getGroupColumns();
    var column = groupedColumns[groupedColumns.length - groupsCount];
    if (!options) {
      var scrollingMode = that.option('scrolling.mode');
      options = {
        collectContinuationItems: scrollingMode !== 'virtual' && scrollingMode !== 'infinite',
        resultItems: [],
        path: [],
        values: []
      };
    }
    var {
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
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
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
  }
  publicMethods() {
    return super.publicMethods().concat(['collapseAll', 'expandAll', 'isRowExpanded', 'expandRow', 'collapseRow']);
  }
  collapseAll(groupIndex) {
    var dataSource = this._dataSource;
    if (dataSource && dataSource.collapseAll(groupIndex)) {
      dataSource.pageIndex(0);
      dataSource.reload();
    }
  }
  expandAll(groupIndex) {
    var dataSource = this._dataSource;
    if (dataSource && dataSource.expandAll(groupIndex)) {
      dataSource.pageIndex(0);
      dataSource.reload();
    }
  }
  changeRowExpand(key) {
    var that = this;
    var expanded = that.isRowExpanded(key);
    var args = {
      key,
      expanded
    };
    that.executeAction(expanded ? 'onRowCollapsing' : 'onRowExpanding', args);
    if (!args.cancel) {
      return when(that._changeRowExpandCore(key)).done(() => {
        args.expanded = !expanded;
        that.executeAction(expanded ? 'onRowCollapsed' : 'onRowExpanded', args);
      });
    }
    // @ts-expect-error
    return new Deferred().resolve();
  }
  _changeRowExpandCore(key) {
    var that = this;
    var dataSource = this._dataSource;
    // @ts-expect-error
    var d = new Deferred();
    if (!dataSource) {
      d.resolve();
    } else {
      when(dataSource.changeRowExpand(key)).done(() => {
        that.load().done(d.resolve).fail(d.reject);
      }).fail(d.reject);
    }
    return d;
  }
  isRowExpanded(key) {
    var dataSource = this._dataSource;
    return dataSource && dataSource.isRowExpanded(key);
  }
  expandRow(key) {
    if (!this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    // @ts-expect-error
    return new Deferred().resolve();
  }
  collapseRow(key) {
    if (this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    // @ts-expect-error
    return new Deferred().resolve();
  }
  optionChanged(args) {
    if (args.name === 'grouping' /* autoExpandAll */) {
      args.name = 'dataSource';
    }
    super.optionChanged(args);
  }
};
var onGroupingMenuItemClick = function onGroupingMenuItemClick(column, params) {
  var columnsController = this._columnsController;
  // eslint-disable-next-line default-case
  switch (params.itemData.value) {
    case 'group':
      {
        var groups = columnsController._dataSource.group() || [];
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
var isGroupPanelVisible = groupPanelOptions => {
  var visible = groupPanelOptions === null || groupPanelOptions === void 0 ? void 0 : groupPanelOptions.visible;
  return visible === 'auto' ? devices.current().deviceType === 'desktop' : !!visible;
};
var allowDragging = (groupPanelOptions, column) => {
  var isVisible = isGroupPanelVisible(groupPanelOptions);
  var canDrag = (groupPanelOptions === null || groupPanelOptions === void 0 ? void 0 : groupPanelOptions.allowColumnDragging) && column.allowGrouping;
  return isVisible && !!canDrag;
};
export var GroupingHeaderPanelExtender = Base => class GroupingHeaderPanelExtender extends Base {
  _getToolbarItems() {
    var items = super._getToolbarItems();
    return this._appendGroupingItem(items);
  }
  _appendGroupingItem(items) {
    if (this._isGroupPanelVisible()) {
      var isRendered = false;
      var toolbarItem = {
        template: () => {
          var $groupPanel = $('<div>').addClass(DATAGRID_GROUP_PANEL_CLASS);
          this._updateGroupPanelContent($groupPanel);
          registerKeyboardAction('groupPanel', this, $groupPanel, undefined, this._handleActionKeyDown.bind(this));
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
  }
  _handleActionKeyDown(args) {
    var {
      event
    } = args;
    var $target = $(event.target);
    var groupColumnIndex = $target.closest(".".concat(DATAGRID_GROUP_PANEL_ITEM_CLASS)).index();
    var column = this._columnsController.getGroupColumns()[groupColumnIndex];
    var columnIndex = column && column.index;
    if ($target.is(HEADER_FILTER_CLASS_SELECTOR)) {
      this._headerFilterController.showHeaderFilterMenu(columnIndex, true);
    } else {
      // @ts-expect-error
      this._processGroupItemAction(columnIndex);
    }
    event.preventDefault();
  }
  _isGroupPanelVisible() {
    return isGroupPanelVisible(this.option('groupPanel'));
  }
  _renderGroupPanelItems($groupPanel, groupColumns) {
    var that = this;
    $groupPanel.empty();
    each(groupColumns, (index, groupColumn) => {
      that._createGroupPanelItem($groupPanel, groupColumn);
    });
    restoreFocus(this);
  }
  _createGroupPanelItem($rootElement, groupColumn) {
    var $groupPanelItem = $('<div>').addClass(groupColumn.cssClass).addClass(DATAGRID_GROUP_PANEL_ITEM_CLASS).data('columnData', groupColumn).appendTo($rootElement).text(groupColumn.caption);
    setTabIndex(this, $groupPanelItem);
    return $groupPanelItem;
  }
  _columnOptionChanged(e) {
    if (!this._requireReady && !gridCore.checkChanges(e.optionNames, ['width', 'visibleWidth'])) {
      var $toolbarElement = this.element();
      var $groupPanel = $toolbarElement && $toolbarElement.find(".".concat(DATAGRID_GROUP_PANEL_CLASS));
      if ($groupPanel && $groupPanel.length) {
        this._updateGroupPanelContent($groupPanel);
        this.updateToolbarDimensions();
        this.renderCompleted.fire();
      }
    }
    super._columnOptionChanged();
  }
  _updateGroupPanelContent($groupPanel) {
    var groupColumns = this.getColumns();
    var groupPanelOptions = this.option('groupPanel');
    this._renderGroupPanelItems($groupPanel, groupColumns);
    if (groupPanelOptions.allowColumnDragging && !groupColumns.length) {
      $('<div>').addClass(DATAGRID_GROUP_PANEL_MESSAGE_CLASS).text(groupPanelOptions.emptyPanelText).appendTo($groupPanel);
      $groupPanel.closest(".".concat(DATAGRID_GROUP_PANEL_CONTAINER_CLASS)).addClass(DATAGRID_GROUP_PANEL_LABEL_CLASS);
      $groupPanel.closest(".".concat(DATAGRID_GROUP_PANEL_LABEL_CLASS)).css('maxWidth', 'none');
    }
  }
  allowDragging(column) {
    var groupPanelOptions = this.option('groupPanel');
    return allowDragging(groupPanelOptions, column);
  }
  getColumnElements() {
    var $element = this.element();
    return $element && $element.find(".".concat(DATAGRID_GROUP_PANEL_ITEM_CLASS));
  }
  getColumns() {
    return this._columnsController.getGroupColumns();
  }
  getBoundingRect() {
    var that = this;
    var $element = that.element();
    if ($element && $element.find(".".concat(DATAGRID_GROUP_PANEL_CLASS)).length) {
      var offset = $element.offset();
      return {
        top: offset.top,
        bottom: offset.top + getHeight($element)
      };
    }
    return null;
  }
  getName() {
    return 'group';
  }
  getContextMenuItems(options) {
    var that = this;
    var contextMenuEnabled = that.option('grouping.contextMenuEnabled');
    var $groupedColumnElement = $(options.targetElement).closest(".".concat(DATAGRID_GROUP_PANEL_ITEM_CLASS));
    var items;
    if ($groupedColumnElement.length) {
      options.column = $groupedColumnElement.data('columnData');
    }
    if (contextMenuEnabled && options.column) {
      var {
        column
      } = options;
      var isGroupingAllowed = isDefined(column.allowGrouping) ? column.allowGrouping : true;
      if (isGroupingAllowed) {
        var isColumnGrouped = isDefined(column.groupIndex) && column.groupIndex > -1;
        var groupingTexts = that.option('grouping.texts');
        var onItemClick = onGroupingMenuItemClick.bind(that, column);
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
  }
  isVisible() {
    return super.isVisible() || this._isGroupPanelVisible();
  }
  hasGroupedColumns() {
    return this._isGroupPanelVisible() && !!this.getColumns().length;
  }
  optionChanged(args) {
    if (args.name === 'groupPanel') {
      this._invalidate();
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }
};
var GroupingRowsViewExtender = Base => class GroupingRowsViewExtender extends Base {
  getContextMenuItems(options) {
    var that = this;
    var contextMenuEnabled = that.option('grouping.contextMenuEnabled');
    var items;
    if (contextMenuEnabled && options.row && options.row.rowType === 'group') {
      var columnsController = that._columnsController;
      var column = columnsController.columnOption("groupIndex:".concat(options.row.groupIndex));
      if (column && column.allowGrouping) {
        var groupingTexts = that.option('grouping.texts');
        var onItemClick = onGroupingMenuItemClick.bind(that, column);
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
  }
  _rowClick(e) {
    var that = this;
    var expandMode = that.option('grouping.expandMode');
    var scrollingMode = that.option('scrolling.mode');
    var isGroupRowStateChanged = scrollingMode !== 'infinite' && expandMode === 'rowClick' && $(e.event.target).closest(".".concat(DATAGRID_GROUP_ROW_CLASS)).length;
    var isExpandButtonClicked = $(e.event.target).closest(".".concat(DATAGRID_EXPAND_CLASS)).length;
    if (isGroupRowStateChanged || isExpandButtonClicked) {
      that._changeGroupRowState(e);
    }
    super._rowClick(e);
  }
  _changeGroupRowState(e) {
    var row = this._dataController.items()[e.rowIndex];
    // @ts-expect-error
    var allowCollapsing = this._columnsController.columnOption("groupIndex:".concat(row.groupIndex), 'allowCollapsing');
    if (row.rowType === 'data' || row.rowType === 'group' && allowCollapsing !== false) {
      // @ts-expect-error
      this._dataController.changeRowExpand(row.key, true);
      e.event.preventDefault();
      e.handled = true;
    }
  }
};
var columnHeadersViewExtender = Base => class GroupingHeadersViewExtender extends Base {
  getContextMenuItems(options) {
    var that = this;
    var contextMenuEnabled = that.option('grouping.contextMenuEnabled');
    var items = super.getContextMenuItems(options);
    if (contextMenuEnabled && options.row && (options.row.rowType === 'header' || options.row.rowType === 'detailAdaptive')) {
      var {
        column
      } = options;
      if (!column.command && (!isDefined(column.allowGrouping) || column.allowGrouping)) {
        var groupingTexts = that.option('grouping.texts');
        var isColumnGrouped = isDefined(column.groupIndex) && column.groupIndex > -1;
        var onItemClick = onGroupingMenuItemClick.bind(that, column);
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
  }
  allowDragging(column) {
    var groupPanelOptions = this.option('groupPanel');
    return allowDragging(groupPanelOptions, column) || super.allowDragging(column);
  }
};
gridCore.registerModule('grouping', {
  defaultOptions() {
    return {
      grouping: {
        autoExpandAll: true,
        allowCollapsing: true,
        contextMenuEnabled: false,
        expandMode: 'buttonClick',
        texts: {
          groupContinuesMessage: messageLocalization.format('dxDataGrid-groupContinuesMessage'),
          groupContinuedMessage: messageLocalization.format('dxDataGrid-groupContinuedMessage'),
          groupByThisColumn: messageLocalization.format('dxDataGrid-groupHeaderText'),
          ungroup: messageLocalization.format('dxDataGrid-ungroupHeaderText'),
          ungroupAll: messageLocalization.format('dxDataGrid-ungroupAllText')
        }
      },
      groupPanel: {
        visible: false,
        emptyPanelText: messageLocalization.format('dxDataGrid-groupPanelEmptyText'),
        allowColumnDragging: true
      }
    };
  },
  extenders: {
    controllers: {
      data: GroupingDataControllerExtender,
      columns: Base => class GroupingColumnsExtender extends Base {
        _getExpandColumnOptions() {
          // @ts-expect-error
          var options = super._getExpandColumnOptions.apply(this, arguments);
          // @ts-expect-error
          options.cellTemplate = gridCore.getExpandCellTemplate();
          return options;
        }
      },
      editing: Base => class GroupingEditingExtender extends Base {
        _isProcessedItem(item) {
          return isDefined(item.groupIndex) && isString(item.rowType) && item.rowType.indexOf('group') === 0;
        }
      }
    },
    views: {
      headerPanel: GroupingHeaderPanelExtender,
      rowsView: GroupingRowsViewExtender,
      columnHeadersView: columnHeadersViewExtender
    }
  }
});