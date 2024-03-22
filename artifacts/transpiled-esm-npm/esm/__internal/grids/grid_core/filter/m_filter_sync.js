/* eslint-disable max-classes-per-file */
import { Deferred } from '../../../../core/utils/deferred';
import { isDefined } from '../../../../core/utils/type';
import filterUtils from '../../../../ui/shared/filtering';
import errors from '../../../../ui/widget/ui.errors';
import { addItem, filterHasField, getDefaultOperation, getFilterExpression, getMatchedConditions, getNormalizedFilter, removeFieldConditionsFromFilter, syncFilters } from '../../../filter_builder/m_utils';
import modules from '../m_modules';
import gridCoreUtils from '../m_utils';
import { anyOf, noneOf } from './m_filter_custom_operations';
var FILTER_ROW_OPERATIONS = ['=', '<>', '<', '<=', '>', '>=', 'notcontains', 'contains', 'startswith', 'endswith', 'between'];
var FILTER_TYPES_INCLUDE = 'include';
var FILTER_TYPES_EXCLUDE = 'exclude';
function getColumnIdentifier(column) {
  return column.name || column.dataField;
}
function checkForErrors(columns) {
  columns.forEach(column => {
    var identifier = getColumnIdentifier(column);
    // @ts-expect-error
    if (!isDefined(identifier) && column.allowFiltering) throw new errors.Error('E1049', column.caption);
  });
}
var getEmptyFilterValues = function getEmptyFilterValues() {
  return {
    filterType: FILTER_TYPES_INCLUDE,
    filterValues: undefined
  };
};
var canSyncHeaderFilterWithFilterRow = function canSyncHeaderFilterWithFilterRow(column) {
  var filterValues = column.filterValues || [];
  return !filterUtils.getGroupInterval(column) && !(column.headerFilter && column.headerFilter.dataSource) || filterValues.length === 1 && filterValues[0] === null;
};
var getHeaderFilterFromCondition = function getHeaderFilterFromCondition(headerFilterCondition, column) {
  if (!headerFilterCondition) {
    return getEmptyFilterValues();
  }
  var filterType;
  var selectedFilterOperation = headerFilterCondition[1];
  var value = headerFilterCondition[2];
  var hasArrayValue = Array.isArray(value);
  if (!hasArrayValue) {
    if (!canSyncHeaderFilterWithFilterRow(column)) {
      return getEmptyFilterValues();
    }
  }
  switch (selectedFilterOperation) {
    case 'anyof':
    case '=':
      filterType = FILTER_TYPES_INCLUDE;
      break;
    case 'noneof':
    case '<>':
      filterType = FILTER_TYPES_EXCLUDE;
      break;
    default:
      return getEmptyFilterValues();
  }
  return {
    filterType,
    filterValues: hasArrayValue ? value : [value]
  };
};
var getConditionFromFilterRow = function getConditionFromFilterRow(column) {
  var value = column.filterValue;
  if (isDefined(value)) {
    var operation = column.selectedFilterOperation || column.defaultFilterOperation || getDefaultOperation(column);
    var filter = [getColumnIdentifier(column), operation, column.filterValue];
    return filter;
  }
  return null;
};
var getConditionFromHeaderFilter = function getConditionFromHeaderFilter(column) {
  var selectedOperation;
  var value;
  var {
    filterValues
  } = column;
  if (!filterValues) return null;
  if (filterValues.length === 1 && canSyncHeaderFilterWithFilterRow(column) && !Array.isArray(filterValues[0])) {
    column.filterType === FILTER_TYPES_EXCLUDE ? selectedOperation = '<>' : selectedOperation = '=';
    // eslint-disable-next-line prefer-destructuring
    value = filterValues[0];
  } else {
    column.filterType === FILTER_TYPES_EXCLUDE ? selectedOperation = 'noneof' : selectedOperation = 'anyof';
    value = filterValues;
  }
  return [getColumnIdentifier(column), selectedOperation, value];
};
var updateHeaderFilterCondition = function updateHeaderFilterCondition(columnsController, column, headerFilterCondition) {
  var headerFilter = getHeaderFilterFromCondition(headerFilterCondition, column);
  columnsController.columnOption(getColumnIdentifier(column), headerFilter);
};
var updateFilterRowCondition = function updateFilterRowCondition(columnsController, column, condition) {
  var filterRowOptions;
  var selectedFilterOperation = condition === null || condition === void 0 ? void 0 : condition[1];
  var filterValue = condition === null || condition === void 0 ? void 0 : condition[2];
  var filterOperations = column.filterOperations || column.defaultFilterOperations;
  if ((!filterOperations || filterOperations.indexOf(selectedFilterOperation) >= 0 || selectedFilterOperation === column.defaultFilterOperation) && FILTER_ROW_OPERATIONS.includes(selectedFilterOperation) && filterValue !== null) {
    if (selectedFilterOperation === column.defaultFilterOperation && !isDefined(column.selectedFilterOperation)) {
      selectedFilterOperation = column.selectedFilterOperation;
    }
    filterRowOptions = {
      filterValue,
      selectedFilterOperation
    };
  } else {
    filterRowOptions = {
      filterValue: undefined,
      selectedFilterOperation: undefined
    };
  }
  columnsController.columnOption(getColumnIdentifier(column), filterRowOptions);
};
export class FilterSyncController extends modules.Controller {
  init() {
    this._dataController = this.getController('data');
    this._columnsController = this.getController('columns');
    // @ts-expect-error
    if (this._dataController.isFilterSyncActive()) {
      if (this._columnsController.isAllDataTypesDefined()) {
        this._initSync();
      } else {
        this._dataController.dataSourceChanged.add(() => this._initSync());
      }
    }
  }
  publicMethods() {
    return ['getCustomFilterOperations'];
  }
  syncFilterValue() {
    var that = this;
    var columns = this._columnsController.getFilteringColumns();
    this._skipSyncColumnOptions = true;
    columns.forEach(column => {
      var filterConditions = getMatchedConditions(that.option('filterValue'), getColumnIdentifier(column));
      if (filterConditions.length === 1) {
        var filterCondition = filterConditions[0];
        updateHeaderFilterCondition(this._columnsController, column, filterCondition);
        updateFilterRowCondition(this._columnsController, column, filterCondition);
      } else {
        isDefined(column.filterValues) && updateHeaderFilterCondition(this._columnsController, column, null);
        isDefined(column.filterValue) && updateFilterRowCondition(this._columnsController, column, null);
      }
    });
    this._skipSyncColumnOptions = false;
  }
  _initSync() {
    var columns = this._columnsController.getColumns();
    var pageIndex = this._dataController.pageIndex();
    checkForErrors(columns);
    if (!this.option('filterValue')) {
      var filteringColumns = this._columnsController.getFilteringColumns();
      var filterValue = this.getFilterValueFromColumns(filteringColumns);
      this._silentOption('filterValue', filterValue);
    }
    this.syncFilterValue();
    this._dataController.pageIndex(pageIndex);
  }
  _getSyncFilterRow(filterValue, column) {
    var filter = getConditionFromFilterRow(column);
    if (isDefined(filter)) {
      return syncFilters(filterValue, filter);
    }
    return removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column));
  }
  _getSyncHeaderFilter(filterValue, column) {
    var filter = getConditionFromHeaderFilter(column);
    if (filter) {
      return syncFilters(filterValue, filter);
    }
    return removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column));
  }
  getFilterValueFromColumns(columns) {
    // @ts-expect-error
    if (!this._dataController.isFilterSyncActive()) {
      return null;
    }
    var filterValue = ['and'];
    columns && columns.forEach(column => {
      var headerFilter = getConditionFromHeaderFilter(column);
      var filterRow = getConditionFromFilterRow(column);
      headerFilter && addItem(headerFilter, filterValue);
      filterRow && addItem(filterRow, filterValue);
    });
    return getNormalizedFilter(filterValue);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  syncFilterRow(column, filterValue) {
    this.option('filterValue', this._getSyncFilterRow(this.option('filterValue'), column));
  }
  syncHeaderFilter(column) {
    this.option('filterValue', this._getSyncHeaderFilter(this.option('filterValue'), column));
  }
  getCustomFilterOperations() {
    var _a;
    var filterBuilderCustomOperations = (_a = this.option('filterBuilder.customOperations')) !== null && _a !== void 0 ? _a : [];
    return [anyOf(this.component), noneOf(this.component)].concat(filterBuilderCustomOperations);
  }
}
var data = Base => class DataControllerFilterSyncExtender extends Base {
  optionChanged(args) {
    switch (args.name) {
      case 'filterValue':
        this._applyFilter();
        this.isFilterSyncActive() && this._filterSyncController.syncFilterValue();
        args.handled = true;
        break;
      case 'filterSyncEnabled':
        args.handled = true;
        break;
      case 'columns':
        if (this.isFilterSyncActive()) {
          var column = this._columnsController.getColumnByPath(args.fullName);
          if (column && !this._filterSyncController._skipSyncColumnOptions) {
            var propertyName = this._parseColumnPropertyName(args.fullName);
            this._filterSyncController._skipSyncColumnOptions = true;
            if (propertyName === 'filterType') {
              if (FILTER_TYPES_EXCLUDE === args.value || FILTER_TYPES_EXCLUDE === args.previousValue) {
                this._filterSyncController.syncHeaderFilter(column);
              }
            } else if (propertyName === 'filterValues') {
              this._filterSyncController.syncHeaderFilter(column);
            } else if (['filterValue', 'selectedFilterOperation'].includes(propertyName)) {
              this._filterSyncController.syncFilterRow(column, column.filterValue);
            }
            this._filterSyncController._skipSyncColumnOptions = false;
          }
        }
        super.optionChanged(args);
        break;
      default:
        super.optionChanged(args);
    }
  }
  isFilterSyncActive() {
    var filterSyncEnabledValue = this.option('filterSyncEnabled');
    return filterSyncEnabledValue === 'auto' ? this.option('filterPanel.visible') : filterSyncEnabledValue;
  }
  skipCalculateColumnFilters() {
    return (isDefined(this.option('filterValue')) || this._filterSyncController._skipSyncColumnOptions) && this.isFilterSyncActive();
  }
  _calculateAdditionalFilter() {
    if (this.option('filterPanel.filterEnabled') === false) {
      return super._calculateAdditionalFilter();
    }
    var filters = [super._calculateAdditionalFilter()];
    var columns = this._columnsController.getFilteringColumns();
    var filterValue = this.option('filterValue');
    if (this.isFilterSyncActive()) {
      var currentColumnForHeaderFilter = this._headerFilterController.getCurrentColumn();
      var currentColumnForFilterRow = this._applyFilterController.getCurrentColumnForFiltering();
      var currentColumn = currentColumnForHeaderFilter || currentColumnForFilterRow;
      var needRemoveCurrentColumnFilter = currentColumnForHeaderFilter || isDefined(currentColumnForFilterRow === null || currentColumnForFilterRow === void 0 ? void 0 : currentColumnForFilterRow.filterValue);
      if (needRemoveCurrentColumnFilter && filterValue) {
        filterValue = removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(currentColumn));
      }
    }
    var customOperations = this._filterSyncController.getCustomFilterOperations();
    var calculatedFilterValue = getFilterExpression(filterValue, columns, customOperations, 'filterBuilder');
    if (calculatedFilterValue) {
      filters.push(calculatedFilterValue);
    }
    return gridCoreUtils.combineFilters(filters);
  }
  _parseColumnPropertyName(fullName) {
    var matched = fullName.match(/.*\.(.*)/);
    if (matched) {
      return matched[1];
    }
    return null;
  }
  clearFilter(filterName) {
    this.component.beginUpdate();
    if (arguments.length > 0) {
      if (filterName === 'filterValue') {
        // @ts-expect-error
        this.option('filterValue', null);
      }
      super.clearFilter(filterName);
    } else {
      // @ts-expect-error
      this.option('filterValue', null);
      super.clearFilter();
    }
    this.component.endUpdate();
  }
  _applyFilter() {
    if (this._filterSyncController._skipSyncColumnOptions) {
      // @ts-expect-error
      return new Deferred().resolve();
    }
    // @ts-expect-error
    return super._applyFilter.apply(this, arguments);
  }
};
var columnHeadersView = Base => class ColumnHeadersViewFilterSyncExtender extends Base {
  optionChanged(args) {
    if (args.name === 'filterValue') {
      // @ts-expect-error
      this._updateHeaderFilterIndicators();
    } else {
      super.optionChanged(args);
    }
  }
  _isHeaderFilterEmpty(column) {
    // @ts-expect-error
    if (this._dataController.isFilterSyncActive()) {
      return !filterHasField(this.option('filterValue'), getColumnIdentifier(column));
    }
    // @ts-expect-error
    return super._isHeaderFilterEmpty(column);
  }
  _needUpdateFilterIndicators() {
    // @ts-expect-error
    return !this._dataController.isFilterSyncActive();
  }
};
export var filterSyncModule = {
  defaultOptions() {
    return {
      filterValue: null,
      filterSyncEnabled: 'auto'
    };
  },
  controllers: {
    filterSync: FilterSyncController
  },
  extenders: {
    controllers: {
      data
    },
    views: {
      columnHeadersView
    }
  }
};