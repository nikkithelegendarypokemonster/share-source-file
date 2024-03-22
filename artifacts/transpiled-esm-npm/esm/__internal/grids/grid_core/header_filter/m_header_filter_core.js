/* eslint-disable max-classes-per-file */
import '../../../../ui/list/modules/search';
import '../../../../ui/list/modules/selection';
import $ from '../../../../core/renderer';
import { extend } from '../../../../core/utils/extend';
import { each } from '../../../../core/utils/iterator';
import { isDefined, isFunction } from '../../../../core/utils/type';
import messageLocalization from '../../../../localization/message';
import List from '../../../../ui/list_light';
import Popup from '../../../../ui/popup/ui.popup';
import TreeView from '../../../../ui/tree_view';
import Modules from '../../../grids/grid_core/m_modules';
import gridCoreUtils from '../m_utils';
var HEADER_FILTER_CLASS = 'dx-header-filter';
var HEADER_FILTER_MENU_CLASS = 'dx-header-filter-menu';
var DEFAULT_SEARCH_EXPRESSION = 'text';
function resetChildrenItemSelection(items) {
  items = items || [];
  for (var i = 0; i < items.length; i++) {
    items[i].selected = false;
    resetChildrenItemSelection(items[i].items);
  }
}
function getSelectAllCheckBox(listComponent) {
  var selector = listComponent.NAME === 'dxTreeView' ? '.dx-treeview-select-all-item' : '.dx-list-select-all-checkbox';
  return listComponent.$element().find(selector).dxCheckBox('instance');
}
function updateListSelectAllState(e, filterValues) {
  if (e.component.option('searchValue')) {
    return;
  }
  var selectAllCheckBox = getSelectAllCheckBox(e.component);
  if (selectAllCheckBox && filterValues && filterValues.length) {
    selectAllCheckBox.option('value', undefined);
  }
}
export function updateHeaderFilterItemSelectionState(item, filterValuesMatch, isExcludeFilter) {
  if (filterValuesMatch ^ isExcludeFilter) {
    item.selected = true;
    if (isExcludeFilter && item.items) {
      for (var j = 0; j < item.items.length; j++) {
        if (!item.items[j].selected) {
          item.selected = undefined;
          break;
        }
      }
    }
  } else if (isExcludeFilter || item.selected) {
    item.selected = false;
    resetChildrenItemSelection(item.items);
  }
}
export class HeaderFilterView extends Modules.View {
  getPopupContainer() {
    return this._popupContainer;
  }
  getListComponent() {
    return this._listComponent;
  }
  applyHeaderFilter(options) {
    var that = this;
    var list = that.getListComponent();
    var searchValue = list.option('searchValue');
    var selectAllCheckBox = getSelectAllCheckBox(list);
    var isAllSelected = !searchValue && !options.isFilterBuilder && (selectAllCheckBox === null || selectAllCheckBox === void 0 ? void 0 : selectAllCheckBox.option('value'));
    var filterValues = [];
    var fillSelectedItemKeys = function fillSelectedItemKeys(filterValues, items, isExclude) {
      each(items, (_, item) => {
        if (item.selected !== undefined && !!item.selected ^ isExclude) {
          var node = list._getNode(item);
          var hasChildren = list._hasChildren(node);
          var hasChildrenWithSelection = hasChildren && item.items && item.items.some(item => item.selected);
          if (!searchValue || !hasChildrenWithSelection) {
            filterValues.push(item.value);
            return;
          }
        }
        if (item.items && item.items.length) {
          fillSelectedItemKeys(filterValues, item.items, isExclude);
        }
      });
    };
    if (!isAllSelected) {
      if (options.type === 'tree') {
        if (options.filterType) {
          options.filterType = 'include';
        }
        fillSelectedItemKeys(filterValues, list.option('items'), false);
        options.filterValues = filterValues;
      }
    } else {
      if (options.type === 'tree') {
        options.filterType = 'exclude';
      }
      if (Array.isArray(options.filterValues)) {
        options.filterValues = [];
      }
    }
    if (options.filterValues && !options.filterValues.length) {
      options.filterValues = null; // T500956
    }
    options.apply();
    that.hideHeaderFilterMenu();
  }
  showHeaderFilterMenu($columnElement, options) {
    var that = this;
    if (options) {
      that._initializePopupContainer(options);
      var popupContainer = that.getPopupContainer();
      that.hideHeaderFilterMenu();
      that.updatePopup($columnElement, options);
      popupContainer.show();
    }
  }
  hideHeaderFilterMenu() {
    var headerFilterMenu = this.getPopupContainer();
    headerFilterMenu && headerFilterMenu.hide();
  }
  updatePopup($element, options) {
    var that = this;
    var showColumnLines = this.option('showColumnLines');
    var alignment = options.alignment === 'right' ^ !showColumnLines ? 'left' : 'right';
    that._popupContainer.setAria({
      role: 'dialog',
      label: messageLocalization.format('dxDataGrid-headerFilterLabel')
    });
    if (that._popupContainer) {
      that._cleanPopupContent();
      that._popupContainer.option('position', {
        my: "".concat(alignment, " top"),
        at: "".concat(alignment, " bottom"),
        of: $element,
        collision: 'fit fit' // T1156848
      });
    }
  }
  _getSearchExpr(options, headerFilterOptions) {
    var {
      lookup
    } = options;
    var {
      useDefaultSearchExpr
    } = options;
    var headerFilterDataSource = headerFilterOptions.dataSource;
    var filterSearchExpr = headerFilterOptions.search.searchExpr;
    if (filterSearchExpr) {
      return filterSearchExpr;
    }
    if (useDefaultSearchExpr || isDefined(headerFilterDataSource) && !isFunction(headerFilterDataSource)) {
      return DEFAULT_SEARCH_EXPRESSION;
    }
    if (lookup) {
      return lookup.displayExpr || 'this';
    }
    if (options.dataSource) {
      var {
        group
      } = options.dataSource;
      if (Array.isArray(group) && group.length > 0) {
        return group[0].selector;
      }
      if (isFunction(group) && !options.remoteFiltering) {
        return group;
      }
    }
    return options.dataField || options.selector;
  }
  _cleanPopupContent() {
    this._popupContainer && this._popupContainer.$content().empty();
  }
  _initializePopupContainer(options) {
    var that = this;
    var $element = that.element();
    var headerFilterOptions = this._normalizeHeaderFilterOptions(options);
    var {
      height,
      width
    } = headerFilterOptions;
    var dxPopupOptions = {
      width,
      height,
      visible: false,
      shading: false,
      showTitle: false,
      showCloseButton: false,
      hideOnParentScroll: false,
      dragEnabled: false,
      hideOnOutsideClick: true,
      wrapperAttr: {
        class: HEADER_FILTER_MENU_CLASS
      },
      focusStateEnabled: false,
      toolbarItems: [{
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: headerFilterOptions.texts.ok,
          onClick() {
            that.applyHeaderFilter(options);
          }
        }
      }, {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: headerFilterOptions.texts.cancel,
          onClick() {
            that.hideHeaderFilterMenu();
          }
        }
      }],
      resizeEnabled: true,
      onShowing(e) {
        e.component.$content().parent().addClass('dx-dropdowneditor-overlay');
        that._initializeListContainer(options, headerFilterOptions);
        options.onShowing && options.onShowing(e);
      },
      onShown() {
        that.getListComponent().focus();
      },
      onHidden: options.onHidden,
      onInitialized(e) {
        var {
          component
        } = e;
        // T321243
        component.option('animation', component._getDefaultOptions().animation);
      }
    };
    if (!isDefined(that._popupContainer)) {
      that._popupContainer = that._createComponent($element, Popup, dxPopupOptions);
    } else {
      that._popupContainer.option(dxPopupOptions);
    }
  }
  _initializeListContainer(options, headerFilterOptions) {
    var that = this;
    var $content = that._popupContainer.$content();
    var needShowSelectAllCheckbox = !options.isFilterBuilder && headerFilterOptions.allowSelectAll;
    var widgetOptions = {
      searchEnabled: headerFilterOptions.search.enabled,
      searchTimeout: headerFilterOptions.search.timeout,
      searchEditorOptions: headerFilterOptions.search.editorOptions,
      searchMode: headerFilterOptions.search.mode || '',
      dataSource: options.dataSource,
      onContentReady() {
        that.renderCompleted.fire();
      },
      itemTemplate(data, _, element) {
        var $element = $(element);
        if (options.encodeHtml) {
          return $element.text(data.text);
        }
        return $element.html(data.text);
      }
    };
    function onOptionChanged(e) {
      // T835492, T833015
      if (e.fullName === 'searchValue' && needShowSelectAllCheckbox && that.option('headerFilter.hideSelectAllOnSearch') !== false) {
        if (options.type === 'tree') {
          e.component.option('showCheckBoxesMode', e.value ? 'normal' : 'selectAll');
        } else {
          e.component.option('selectionMode', e.value ? 'multiple' : 'all');
        }
      }
    }
    if (options.type === 'tree') {
      that._listComponent = that._createComponent($('<div>').appendTo($content), TreeView, extend(widgetOptions, {
        showCheckBoxesMode: needShowSelectAllCheckbox ? 'selectAll' : 'normal',
        onOptionChanged,
        keyExpr: 'id'
      }));
    } else {
      that._listComponent = that._createComponent($('<div>').appendTo($content), List, extend(widgetOptions, {
        searchExpr: that._getSearchExpr(options, headerFilterOptions),
        pageLoadMode: 'scrollBottom',
        showSelectionControls: true,
        selectionMode: needShowSelectAllCheckbox ? 'all' : 'multiple',
        onOptionChanged,
        onSelectionChanged(e) {
          var items = e.component.option('items');
          var selectedItems = e.component.option('selectedItems');
          if (!e.component._selectedItemsUpdating && !e.component.option('searchValue') && !options.isFilterBuilder) {
            var filterValues = options.filterValues || [];
            var isExclude = options.filterType === 'exclude';
            if (selectedItems.length === 0 && items.length && (filterValues.length <= 1 || isExclude && filterValues.length === items.length - 1)) {
              options.filterType = 'include';
              options.filterValues = [];
            } else if (selectedItems.length === items.length) {
              options.filterType = 'exclude';
              options.filterValues = [];
            }
          }
          each(items, (index, item) => {
            var selected = gridCoreUtils.getIndexByKey(item, selectedItems, null) >= 0;
            var oldSelected = !!item.selected;
            if (oldSelected !== selected) {
              item.selected = selected;
              options.filterValues = options.filterValues || [];
              var filterValueIndex = gridCoreUtils.getIndexByKey(item.value, options.filterValues, null);
              if (filterValueIndex >= 0) {
                options.filterValues.splice(filterValueIndex, 1);
              }
              var isExcludeFilterType = options.filterType === 'exclude';
              if (selected ^ isExcludeFilterType) {
                options.filterValues.push(item.value);
              }
            }
          });
          updateListSelectAllState(e, options.filterValues);
        },
        onContentReady(e) {
          var {
            component
          } = e;
          var items = component.option('items');
          var selectedItems = [];
          each(items, function () {
            if (this.selected) {
              selectedItems.push(this);
            }
          });
          component._selectedItemsUpdating = true;
          component.option('selectedItems', selectedItems);
          component._selectedItemsUpdating = false;
          updateListSelectAllState(e, options.filterValues);
        }
      }));
    }
  }
  _normalizeHeaderFilterOptions(options) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var generalHeaderFilter = this.option('headerFilter') || {};
    var specificHeaderFilter = options.headerFilter || {};
    var generalDeprecated = {
      search: {
        enabled: generalHeaderFilter.allowSearch,
        timeout: generalHeaderFilter.searchTimeout
      }
    };
    var specificDeprecated = {
      search: {
        enabled: specificHeaderFilter.allowSearch,
        mode: specificHeaderFilter.searchMode,
        timeout: specificHeaderFilter.searchTimeout
      }
    };
    return extend(true, {}, generalHeaderFilter, generalDeprecated, specificHeaderFilter, specificDeprecated);
  }
  _renderCore() {
    this.element().addClass(HEADER_FILTER_MENU_CLASS);
  }
}
export var allowHeaderFiltering = function allowHeaderFiltering(column) {
  return isDefined(column.allowHeaderFiltering) ? column.allowHeaderFiltering : column.allowFiltering;
};
// TODO Fix types of this mixin
export var headerFilterMixin = Base => class HeaderFilterMixin extends Base {
  optionChanged(args) {
    if (args.name === 'headerFilter') {
      var requireReady = this.name === 'columnHeadersView';
      this._invalidate(requireReady, requireReady);
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }
  _applyColumnState(options) {
    var $headerFilterIndicator;
    var {
      rootElement
    } = options;
    var {
      column
    } = options;
    if (options.name === 'headerFilter') {
      rootElement.find(".".concat(HEADER_FILTER_CLASS)).remove();
      if (allowHeaderFiltering(column)) {
        $headerFilterIndicator = super._applyColumnState(options).toggleClass('dx-header-filter-empty', this._isHeaderFilterEmpty(column));
        if (!this.option('useLegacyKeyboardNavigation')) {
          $headerFilterIndicator.attr('tabindex', this.option('tabindex') || 0);
        }
        var indicatorLabel = messageLocalization.format('dxDataGrid-headerFilterIndicatorLabel', column.caption);
        $headerFilterIndicator.attr('aria-label', indicatorLabel);
        $headerFilterIndicator.attr('aria-haspopup', 'dialog');
        $headerFilterIndicator.attr('role', 'button');
      }
      return $headerFilterIndicator;
    }
    return super._applyColumnState(options);
  }
  _isHeaderFilterEmpty(column) {
    return !column.filterValues || !column.filterValues.length;
  }
  _getIndicatorClassName(name) {
    if (name === 'headerFilter') {
      return HEADER_FILTER_CLASS;
    }
    return super._getIndicatorClassName(name);
  }
  _renderIndicator(options) {
    var $container = options.container;
    var $indicator = options.indicator;
    if (options.name === 'headerFilter') {
      var rtlEnabled = this.option('rtlEnabled');
      if ($container.children().length && (!rtlEnabled && options.columnAlignment === 'right' || rtlEnabled && options.columnAlignment === 'left')) {
        $container.prepend($indicator);
        return;
      }
    }
    super._renderIndicator(options);
  }
};