import _extends from "@babel/runtime/helpers/esm/extends";
/* eslint-disable max-classes-per-file */
import { compileGetter } from '../../../../core/utils/data';
import { Deferred } from '../../../../core/utils/deferred';
import { extend } from '../../../../core/utils/extend';
import { each } from '../../../../core/utils/iterator';
import { getDefaultAlignment } from '../../../../core/utils/position';
import { isDefined, isFunction, isObject } from '../../../../core/utils/type';
import { normalizeDataSourceOptions } from '../../../../data/data_source/utils';
import dataQuery from '../../../../data/query';
import storeHelper from '../../../../data/store_helper';
import { name as clickEventName } from '../../../../events/click';
import eventsEngine from '../../../../events/core/events_engine';
import dateLocalization from '../../../../localization/date';
import messageLocalization from '../../../../localization/message';
import { restoreFocus, saveFocusedElementInfo } from '../../../../ui/shared/accessibility';
import filterUtils from '../../../../ui/shared/filtering';
import Modules from '../../../grids/grid_core/m_modules';
import gridCoreUtils from '../m_utils';
import { allowHeaderFiltering, headerFilterMixin, HeaderFilterView, updateHeaderFilterItemSelectionState } from './m_header_filter_core';
var DATE_INTERVAL_FORMATS = {
  month(value) {
    return dateLocalization.getMonthNames()[value - 1];
  },
  quarter(value) {
    return dateLocalization.format(new Date(2000, value * 3 - 1), 'quarter');
  }
};
function ungroupUTCDates(items, dateParts, dates) {
  dateParts = dateParts || [];
  dates = dates || [];
  items.forEach(item => {
    if (isDefined(item.key)) {
      var isMonthPart = dateParts.length === 1;
      dateParts.push(isMonthPart ? item.key - 1 : item.key);
      if (item.items) {
        ungroupUTCDates(item.items, dateParts, dates);
      } else {
        var date = new Date(Date.UTC.apply(Date, dateParts));
        dates.push(date);
      }
      dateParts.pop();
    } else {
      dates.push(null);
    }
  });
  return dates;
}
function convertDataFromUTCToLocal(data, column) {
  var dates = ungroupUTCDates(data);
  var query = dataQuery(dates);
  var group = gridCoreUtils.getHeaderFilterGroupParameters(_extends(_extends({}, column), {
    calculateCellValue: date => date
  }));
  return storeHelper.queryByOptions(query, {
    group
  }).toArray();
}
function isUTCFormat(format) {
  return (format === null || format === void 0 ? void 0 : format.slice(-1)) === 'Z' || (format === null || format === void 0 ? void 0 : format.slice(-3)) === '\'Z\'';
}
var getFormatOptions = function getFormatOptions(value, column, currentLevel) {
  var groupInterval = filterUtils.getGroupInterval(column);
  var result = gridCoreUtils.getFormatOptionsByColumn(column, 'headerFilter');
  if (groupInterval) {
    result.groupInterval = groupInterval[currentLevel];
    if (gridCoreUtils.isDateType(column.dataType)) {
      result.format = DATE_INTERVAL_FORMATS[groupInterval[currentLevel]];
    } else if (column.dataType === 'number') {
      result.getDisplayFormat = function () {
        var formatOptions = {
          format: column.format,
          target: 'headerFilter'
        };
        var firstValueText = gridCoreUtils.formatValue(value, formatOptions);
        var secondValue = value + groupInterval[currentLevel];
        var secondValueText = gridCoreUtils.formatValue(secondValue, formatOptions);
        return firstValueText && secondValueText ? "".concat(firstValueText, " - ").concat(secondValueText) : '';
      };
    }
  }
  return result;
};
export class HeaderFilterController extends Modules.ViewController {
  init() {
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');
    this._headerFilterView = this.getView('headerFilterView');
  }
  _updateSelectedState(items, column) {
    var i = items.length;
    var isExclude = column.filterType === 'exclude';
    while (i--) {
      var item = items[i];
      if ('items' in items[i]) {
        this._updateSelectedState(items[i].items, column);
      }
      updateHeaderFilterItemSelectionState(item, gridCoreUtils.getIndexByKey(items[i].value, column.filterValues, null) > -1, isExclude);
    }
  }
  _normalizeGroupItem(item, currentLevel, options) {
    var value;
    var displayValue;
    var {
      path
    } = options;
    var {
      valueSelector
    } = options;
    var {
      displaySelector
    } = options;
    var {
      column
    } = options;
    if (valueSelector && displaySelector) {
      value = valueSelector(item);
      displayValue = displaySelector(item);
    } else {
      value = item.key;
      displayValue = value;
    }
    if (!isObject(item)) {
      item = {};
    } else {
      item = extend({}, item);
    }
    path.push(value);
    if (path.length === 1) {
      // NOTE: Important! Deconstructing here causes a lot of failed usage scenarios.
      // eslint-disable-next-line prefer-destructuring
      item.value = path[0];
    } else {
      item.value = path.join('/');
    }
    item.text = this.getHeaderItemText(displayValue, column, currentLevel, options.headerFilterOptions);
    return item;
  }
  getHeaderItemText(displayValue, column, currentLevel, headerFilterOptions) {
    var text = gridCoreUtils.formatValue(displayValue, getFormatOptions(displayValue, column, currentLevel));
    if (!text) {
      text = headerFilterOptions.texts.emptyValue;
    }
    return text;
  }
  _processGroupItems(groupItems, currentLevel, path, options) {
    var that = this;
    var displaySelector;
    var valueSelector;
    var {
      column
    } = options;
    var {
      lookup
    } = column;
    var {
      level
    } = options;
    path = path || [];
    currentLevel = currentLevel || 0;
    if (lookup) {
      displaySelector = compileGetter(lookup.displayExpr);
      valueSelector = compileGetter(lookup.valueExpr);
    }
    for (var i = 0; i < groupItems.length; i++) {
      groupItems[i] = that._normalizeGroupItem(groupItems[i], currentLevel, {
        column: options.column,
        headerFilterOptions: options.headerFilterOptions,
        displaySelector,
        valueSelector,
        path
      });
      if ('items' in groupItems[i]) {
        if (currentLevel === level || !isDefined(groupItems[i].value)) {
          delete groupItems[i].items;
        } else {
          that._processGroupItems(groupItems[i].items, currentLevel + 1, path, options);
        }
      }
      path.pop();
    }
  }
  getDataSource(column) {
    var _a;
    var dataSource = this._dataController.dataSource();
    var remoteGrouping = dataSource === null || dataSource === void 0 ? void 0 : dataSource.remoteOperations().grouping;
    var group = gridCoreUtils.getHeaderFilterGroupParameters(column, remoteGrouping);
    var headerFilterDataSource = (_a = column.headerFilter) === null || _a === void 0 ? void 0 : _a.dataSource;
    var headerFilterOptions = this.option('headerFilter');
    var isLookup = false;
    var options = {
      component: this.component
    };
    if (!dataSource) return;
    if (isDefined(headerFilterDataSource) && !isFunction(headerFilterDataSource)) {
      options.dataSource = normalizeDataSourceOptions(headerFilterDataSource);
    } else if (column.lookup) {
      isLookup = true;
      if (this.option('syncLookupFilterValues')) {
        this._currentColumn = column;
        var filter = this._dataController.getCombinedFilter();
        this._currentColumn = null;
        options.dataSource = gridCoreUtils.getWrappedLookupDataSource(column, dataSource, filter);
      } else {
        options.dataSource = gridCoreUtils.normalizeLookupDataSource(column.lookup);
      }
    } else {
      var cutoffLevel = Array.isArray(group) ? group.length - 1 : 0;
      this._currentColumn = column;
      var _filter = this._dataController.getCombinedFilter();
      this._currentColumn = null;
      options.dataSource = {
        filter: _filter,
        group,
        useDefaultSearch: true,
        load: options => {
          // @ts-expect-error Deferred ctor.
          var d = new Deferred();
          // TODO remove in 16.1
          options.dataField = column.dataField || column.name;
          dataSource.load(options).done(data => {
            var convertUTCDates = remoteGrouping && isUTCFormat(column.serializationFormat) && cutoffLevel > 3;
            if (convertUTCDates) {
              data = convertDataFromUTCToLocal(data, column);
            }
            that._processGroupItems(data, null, null, {
              level: cutoffLevel,
              column,
              headerFilterOptions
            });
            d.resolve(data);
          }).fail(d.reject);
          return d;
        }
      };
    }
    if (isFunction(headerFilterDataSource)) {
      headerFilterDataSource.call(column, options);
    }
    var origPostProcess = options.dataSource.postProcess;
    var that = this;
    options.dataSource.postProcess = function (data) {
      var items = data;
      if (isLookup) {
        items = items.filter(item => item[column.lookup.valueExpr] !== null);
        if (this.pageIndex() === 0 && !this.searchValue()) {
          items = items.slice(0);
          items.unshift(null);
        }
        that._processGroupItems(items, null, null, {
          level: 0,
          column,
          headerFilterOptions
        });
      }
      items = origPostProcess && origPostProcess.call(this, items) || items;
      that._updateSelectedState(items, column);
      return items;
    };
    return options.dataSource;
  }
  getCurrentColumn() {
    return this._currentColumn;
  }
  showHeaderFilterMenu(columnIndex, isGroupPanel) {
    var columnsController = this._columnsController;
    var column = extend(true, {}, this._columnsController.getColumns()[columnIndex]);
    if (column) {
      var visibleIndex = columnsController.getVisibleIndex(columnIndex);
      // TODO getView
      var view = isGroupPanel ? this.getView('headerPanel') : this.getView('columnHeadersView');
      var $columnElement = view.getColumnElements()
      // @ts-expect-error
      .eq(isGroupPanel ? column.groupIndex : visibleIndex);
      this.showHeaderFilterMenuBase({
        columnElement: $columnElement,
        column,
        applyFilter: true,
        apply() {
          columnsController.columnOption(columnIndex, {
            filterValues: this.filterValues,
            filterType: this.filterType
          });
        }
      });
    }
  }
  showHeaderFilterMenuBase(options) {
    var that = this;
    var {
      column
    } = options;
    if (column) {
      var groupInterval = filterUtils.getGroupInterval(column);
      var dataSource = that._dataController.dataSource();
      var remoteFiltering = dataSource && dataSource.remoteOperations().filtering;
      var previousOnHidden = options.onHidden;
      extend(options, column, {
        type: groupInterval && groupInterval.length > 1 ? 'tree' : 'list',
        remoteFiltering,
        onShowing: e => {
          var dxResizableInstance = e.component.$overlayContent().dxResizable('instance');
          dxResizableInstance && dxResizableInstance.option('onResizeEnd', e => {
            var headerFilterByColumn = this._columnsController.columnOption(options.dataField, 'headerFilter');
            headerFilterByColumn = headerFilterByColumn || {};
            headerFilterByColumn.width = e.width;
            headerFilterByColumn.height = e.height;
            this._columnsController.columnOption(options.dataField, 'headerFilter', headerFilterByColumn, true);
          });
        },
        onHidden: () => {
          previousOnHidden === null || previousOnHidden === void 0 ? void 0 : previousOnHidden();
          restoreFocus(this);
        }
      });
      options.dataSource = that.getDataSource(options);
      if (options.isFilterBuilder) {
        options.dataSource.filter = null;
        options.alignment = 'right';
      }
      that._headerFilterView.showHeaderFilterMenu(options.columnElement, options);
    }
  }
  hideHeaderFilterMenu() {
    this._headerFilterView.hideHeaderFilterMenu();
  }
}
var columnHeadersView = Base => class ColumnHeadersViewHeaderFilterExtender extends headerFilterMixin(Base) {
  _renderCellContent($cell, options) {
    var that = this;
    var $headerFilterIndicator;
    var {
      column
    } = options;
    if (!column.command && allowHeaderFiltering(column) && that.option('headerFilter.visible') && options.rowType === 'header') {
      $headerFilterIndicator = that._applyColumnState({
        name: 'headerFilter',
        rootElement: $cell,
        column,
        showColumnLines: that.option('showColumnLines')
      });
      $headerFilterIndicator && that._subscribeToIndicatorEvent($headerFilterIndicator, column, 'headerFilter');
    }
    super._renderCellContent.apply(this, arguments);
  }
  _subscribeToIndicatorEvent($indicator, column, indicatorName) {
    if (indicatorName === 'headerFilter') {
      eventsEngine.on($indicator, clickEventName, this.createAction(e => {
        e.event.stopPropagation();
        saveFocusedElementInfo($indicator, this);
        this._headerFilterController.showHeaderFilterMenu(column.index, false);
      }));
    }
  }
  _updateIndicator($cell, column, indicatorName) {
    var $indicator = super._updateIndicator($cell, column, indicatorName);
    $indicator && this._subscribeToIndicatorEvent($indicator, column, indicatorName);
  }
  _updateHeaderFilterIndicators() {
    if (this.option('headerFilter.visible')) {
      this._updateIndicators('headerFilter');
    }
  }
  _needUpdateFilterIndicators() {
    return true;
  }
  _columnOptionChanged(e) {
    var {
      optionNames
    } = e;
    var isFilterRowAndHeaderFilterValuesChanged = gridCoreUtils.checkChanges(optionNames, ['filterValues', 'filterValue']);
    var isHeaderFilterValuesAndTypeChanged = gridCoreUtils.checkChanges(optionNames, ['filterValues', 'filterType']);
    var shouldUpdateFilterIndicators = (isFilterRowAndHeaderFilterValuesChanged || isHeaderFilterValuesAndTypeChanged) && this._needUpdateFilterIndicators();
    if (shouldUpdateFilterIndicators) {
      this._updateHeaderFilterIndicators();
    }
    if (!isHeaderFilterValuesAndTypeChanged) {
      super._columnOptionChanged(e);
    }
  }
};
var headerPanel = Base => class HeaderPanelHeaderFilterExtender extends headerFilterMixin(Base) {
  _createGroupPanelItem($rootElement, groupColumn) {
    var that = this;
    var $item = super._createGroupPanelItem.apply(that, arguments);
    var $headerFilterIndicator;
    if (!groupColumn.command && allowHeaderFiltering(groupColumn) && that.option('headerFilter.visible')) {
      $headerFilterIndicator = that._applyColumnState({
        name: 'headerFilter',
        rootElement: $item,
        column: {
          alignment: getDefaultAlignment(that.option('rtlEnabled')),
          filterValues: groupColumn.filterValues,
          allowHeaderFiltering: true,
          caption: groupColumn.caption
        },
        showColumnLines: true
      });
      $headerFilterIndicator && eventsEngine.on($headerFilterIndicator, clickEventName, that.createAction(e => {
        var {
          event
        } = e;
        event.stopPropagation();
        this._headerFilterController.showHeaderFilterMenu(groupColumn.index, true);
      }));
    }
    return $item;
  }
};
export function invertFilterExpression(filter) {
  return ['!', filter];
}
var data = Base => class DataControllerFilterRowExtender extends Base {
  skipCalculateColumnFilters() {
    return false;
  }
  _calculateAdditionalFilter() {
    if (this.skipCalculateColumnFilters()) {
      return super._calculateAdditionalFilter();
    }
    var that = this;
    var filters = [super._calculateAdditionalFilter()];
    var columns = that._columnsController.getVisibleColumns(null, true);
    var headerFilterController = this._headerFilterController;
    var currentColumn = headerFilterController.getCurrentColumn();
    each(columns, (_, column) => {
      var filter;
      if (currentColumn && currentColumn.index === column.index) {
        return;
      }
      if (allowHeaderFiltering(column) && column.calculateFilterExpression && Array.isArray(column.filterValues) && column.filterValues.length) {
        var filterValues = [];
        each(column.filterValues, (_, filterValue) => {
          if (Array.isArray(filterValue)) {
            filter = filterValue;
          } else {
            if (column.deserializeValue && !gridCoreUtils.isDateType(column.dataType) && column.dataType !== 'number') {
              filterValue = column.deserializeValue(filterValue);
            }
            filter = column.createFilterExpression(filterValue, '=', 'headerFilter');
          }
          if (filter) {
            filter.columnIndex = column.index;
          }
          filterValues.push(filter);
        });
        filterValues = gridCoreUtils.combineFilters(filterValues, 'or');
        filters.push(column.filterType === 'exclude' ? ['!', filterValues] : filterValues);
      }
    });
    return gridCoreUtils.combineFilters(filters);
  }
};
export var headerFilterModule = {
  defaultOptions() {
    return {
      syncLookupFilterValues: true,
      headerFilter: {
        visible: false,
        width: 252,
        height: 325,
        allowSelectAll: true,
        search: {
          enabled: false,
          timeout: 500,
          mode: 'contains',
          editorOptions: {}
        },
        texts: {
          emptyValue: messageLocalization.format('dxDataGrid-headerFilterEmptyValue'),
          ok: messageLocalization.format('dxDataGrid-headerFilterOK'),
          cancel: messageLocalization.format('dxDataGrid-headerFilterCancel')
        }
      }
    };
  },
  controllers: {
    headerFilter: HeaderFilterController
  },
  views: {
    headerFilterView: HeaderFilterView
  },
  extenders: {
    controllers: {
      data
    },
    views: {
      columnHeadersView,
      headerPanel
    }
  }
};