import _extends from "@babel/runtime/helpers/esm/extends";
import '../data_source/m_data_source';
import registerComponent from '../../../../core/component_registrator';
import $ from '../../../../core/renderer';
import { extend } from '../../../../core/utils/extend';
import { getImageContainer } from '../../../../core/utils/icon';
import { each } from '../../../../core/utils/iterator';
import { isDefined } from '../../../../core/utils/type';
import { hasWindow as hasWindowFn } from '../../../../core/utils/window';
import localizationMessage from '../../../../localization/message';
import ContextMenu from '../../../../ui/context_menu';
import TreeView from '../../../../ui/tree_view';
import { foreachDataLevel, getCompareFunction } from '../m_widget_utils';
import { ATTRIBUTES, CLASSES, ICONS } from './const';
import { FieldChooserBase } from './m_field_chooser_base';
var DIV = '<div>';
var hasWindow = hasWindowFn();
function getDimensionFields(item, fields) {
  var result = [];
  if (item.items) {
    for (var i = 0; i < item.items.length; i += 1) {
      result.push.apply(result, getDimensionFields(item.items[i], fields));
    }
  } else if (isDefined(item.index)) {
    result.push(fields[item.index]);
  }
  return result;
}
function getFirstItem(item, condition) {
  if (item.items) {
    for (var i = 0; i < item.items.length; i += 1) {
      var childrenItem = getFirstItem(item.items[i], condition);
      if (childrenItem) {
        return childrenItem;
      }
    }
  }
  if (condition(item)) {
    return item;
  }
  return undefined;
}
var compareOrder = [function (a, b) {
  var aValue = -!!a.isMeasure;
  var bValue = +!!b.isMeasure;
  return aValue + bValue;
}, function (a, b) {
  var aValue = -!!(a.items && a.items.length);
  var bValue = +!!(b.items && b.items.length);
  return aValue + bValue;
}, function (a, b) {
  var aValue = +!!(a.isMeasure === false && a.field && a.field.levels && a.field.levels.length);
  var bValue = -!!(b.isMeasure === false && b.field && b.field.levels && b.field.levels.length);
  return aValue + bValue;
}, getCompareFunction(item => item.text)];
function compareItems(a, b) {
  var result = 0;
  var i = 0;
  while (!result && compareOrder[i]) {
    // eslint-disable-next-line no-plusplus
    result = compareOrder[i++](a, b);
  }
  return result;
}
function getScrollable(container) {
  return container.find(".".concat(CLASSES.scrollable.self)).dxScrollable('instance');
}
export class FieldChooser extends FieldChooserBase {
  _getDefaultOptions() {
    return _extends(_extends({}, super._getDefaultOptions()), {
      height: 400,
      layout: 0,
      dataSource: null,
      encodeHtml: true,
      onContextMenuPreparing: null,
      allowSearch: false,
      searchTimeout: 500,
      texts: {
        columnFields: localizationMessage.format('dxPivotGrid-columnFields'),
        rowFields: localizationMessage.format('dxPivotGrid-rowFields'),
        dataFields: localizationMessage.format('dxPivotGrid-dataFields'),
        filterFields: localizationMessage.format('dxPivotGrid-filterFields'),
        allFields: localizationMessage.format('dxPivotGrid-allFields')
      }
    });
  }
  _refreshDataSource() {
    var that = this;
    that._expandedPaths = [];
    that._changedHandler = that._changedHandler || function () {
      each(that._dataChangedHandlers, (_, func) => {
        func();
      });
      that._fireContentReadyAction();
      that._skipStateChange = true;
      that.option('state', that._dataSource.state());
      that._skipStateChange = false;
    };
    that._disposeDataSource();
    super._refreshDataSource();
    that._dataSource && that._dataSource.on('changed', that._changedHandler);
  }
  _disposeDataSource() {
    var that = this;
    var dataSource = that._dataSource;
    if (dataSource) {
      dataSource.off('changed', that._changedHandler);
      that._dataSource = undefined;
    }
  }
  _dispose() {
    this._disposeDataSource();
    super._dispose.apply(this, arguments);
  }
  _init() {
    super._init();
    this._refreshDataSource();
    this._dataChangedHandlers = [];
    this._initActions();
  }
  _initActions() {
    this._actions = {
      onContextMenuPreparing: this._createActionByOption('onContextMenuPreparing')
    };
  }
  _trigger(eventName, eventArg) {
    this._actions[eventName](eventArg);
  }
  _setOptionsByReference() {
    super._setOptionsByReference();
    extend(this._optionsByReference, {
      dataSource: true
    });
  }
  _optionChanged(args) {
    var that = this;
    switch (args.name) {
      case 'dataSource':
        that._refreshDataSource();
        that._invalidate();
        break;
      case 'layout':
      case 'texts':
      case 'allowSearch':
      case 'searchTimeout':
      case 'encodeHtml':
        that._invalidate();
        break;
      case 'onContextMenuPreparing':
        that._actions[args.name] = that._createActionByOption(args.name);
        break;
      default:
        super._optionChanged(args);
    }
  }
  _clean(skipStateSetting) {
    !skipStateSetting && this._dataSource && this.option('state', this._dataSource.state());
    this.$element().children(".".concat(CLASSES.fieldChooser.container)).remove();
  }
  _renderLayout0($container) {
    var that = this;
    $container.addClass(CLASSES.layout.zero);
    var $row1 = $(DIV).addClass(CLASSES.row).appendTo($container);
    var $row2 = $(DIV).addClass(CLASSES.row).appendTo($container);
    var $col1 = $(DIV).addClass(CLASSES.col).appendTo($row1);
    var $col2 = $(DIV).addClass(CLASSES.col).appendTo($row1);
    var $col3 = $(DIV).addClass(CLASSES.col).appendTo($row2);
    var $col4 = $(DIV).addClass(CLASSES.col).appendTo($row2);
    that._renderArea($col1, 'all');
    that._renderArea($col2, 'row');
    that._renderArea($col2, 'column');
    that._renderArea($col3, 'filter');
    that._renderArea($col4, 'data');
  }
  _renderLayout1($container) {
    var that = this;
    var $col1 = $(DIV).addClass(CLASSES.col).appendTo($container);
    var $col2 = $(DIV).addClass(CLASSES.col).appendTo($container);
    that._renderArea($col1, 'all');
    that._renderArea($col2, 'filter');
    that._renderArea($col2, 'row');
    that._renderArea($col2, 'column');
    that._renderArea($col2, 'data');
  }
  _renderLayout2($container) {
    var that = this;
    $container.addClass(CLASSES.layout.second);
    var $row1 = $(DIV).addClass(CLASSES.row).appendTo($container);
    that._renderArea($row1, 'all');
    var $row2 = $(DIV).addClass(CLASSES.row).appendTo($container);
    var $col1 = $(DIV).addClass(CLASSES.col).appendTo($row2);
    var $col2 = $(DIV).addClass(CLASSES.col).appendTo($row2);
    that._renderArea($col1, 'filter');
    that._renderArea($col1, 'row');
    that._renderArea($col2, 'column');
    that._renderArea($col2, 'data');
  }
  _initMarkup() {
    var that = this;
    var $element = this.$element();
    var $container = $(DIV).addClass(CLASSES.fieldChooser.container).appendTo($element);
    var layout = that.option('layout');
    super._initMarkup();
    $element.addClass(CLASSES.fieldChooser.self).addClass(CLASSES.pivotGrid.fieldsContainer);
    that._dataChangedHandlers = [];
    var dataSource = this._dataSource;
    var currentState = that.option('applyChangesMode') !== 'instantly' && dataSource && dataSource.state();
    currentState && that.option('state') && dataSource.state(that.option('state'), true);
    if (layout === 0) {
      that._renderLayout0($container);
    } else if (layout === 1) {
      that._renderLayout1($container);
    } else {
      that._renderLayout2($container);
    }
    currentState && dataSource.state(currentState, true);
  }
  _renderContentImpl() {
    super._renderContentImpl();
    this.renderSortable();
    this._renderContextMenu();
    this.updateDimensions();
  }
  _fireContentReadyAction() {
    if (!this._dataSource || !this._dataSource.isLoading()) {
      super._fireContentReadyAction();
    }
  }
  _getContextMenuArgs(dxEvent) {
    var targetFieldElement = $(dxEvent.target).closest(".".concat(CLASSES.area.field));
    var targetGroupElement = $(dxEvent.target).closest(".".concat(CLASSES.area.fieldList));
    var field;
    var area;
    if (targetFieldElement.length) {
      var fieldCopy = targetFieldElement.data('field');
      if (fieldCopy) {
        field = this.getDataSource().field(fieldCopy.index) || fieldCopy;
      }
    }
    if (targetGroupElement.length) {
      area = targetGroupElement.attr('group');
    }
    return {
      event: dxEvent,
      field,
      area,
      items: []
    };
  }
  _renderContextMenu() {
    var that = this;
    var $container = that.$element();
    if (that._contextMenu) {
      that._contextMenu.$element().remove();
    }
    that._contextMenu = that._createComponent($(DIV).appendTo($container), ContextMenu, {
      onPositioning(actionArgs) {
        var {
          event
        } = actionArgs;
        if (!event) {
          return;
        }
        var args = that._getContextMenuArgs(event);
        that._trigger('onContextMenuPreparing', args);
        if (args.items && args.items.length) {
          actionArgs.component.option('items', args.items);
        } else {
          actionArgs.cancel = true;
        }
      },
      target: $container,
      onItemClick(params) {
        params.itemData.onItemClick && params.itemData.onItemClick(params);
      },
      cssClass: CLASSES.fieldChooser.contextMenu
    });
  }
  _createTreeItems(fields, groupFieldNames, path) {
    var that = this;
    var isMeasure;
    var resultItems = [];
    var groupedItems = [];
    var groupFieldName = groupFieldNames[0];
    var fieldsByGroup = {};
    if (!groupFieldName) {
      each(fields, (_, field) => {
        var icon;
        if (field.isMeasure === true) {
          icon = ICONS.measure;
        }
        if (field.isMeasure === false) {
          icon = field.groupName ? ICONS.hierarchy : ICONS.dimension;
        }
        resultItems.push({
          index: field.index,
          field,
          key: field.dataField,
          selected: isDefined(field.area),
          text: field.caption || field.dataField,
          icon,
          isMeasure: field.isMeasure,
          isDefault: field.isDefault
        });
      });
    } else {
      each(fields, (_, field) => {
        var groupName = field[groupFieldName] || '';
        fieldsByGroup[groupName] = fieldsByGroup[groupName] || [];
        fieldsByGroup[groupName].push(field);
        if (isMeasure === undefined) {
          isMeasure = true;
        }
        isMeasure = isMeasure && field.isMeasure === true;
      });
      each(fieldsByGroup, (groupName, fields) => {
        var currentPath = path ? "".concat(path, ".").concat(groupName) : groupName;
        var items = that._createTreeItems(fields, groupFieldNames.slice(1), currentPath);
        if (groupName) {
          groupedItems.push({
            key: groupName,
            text: groupName,
            path: currentPath,
            isMeasure: items.isMeasure,
            expanded: that._expandedPaths.includes(currentPath),
            items
          });
        } else {
          resultItems = items;
        }
      });
      resultItems = groupedItems.concat(resultItems);
      resultItems.isMeasure = isMeasure;
    }
    return resultItems;
  }
  _createFieldsDataSource(dataSource) {
    var fields = dataSource && dataSource.fields() || [];
    fields = fields.filter(field => field.visible !== false && !isDefined(field.groupIndex));
    var treeItems = this._createTreeItems(fields, ['dimension', 'displayFolder']);
    foreachDataLevel(treeItems, items => {
      items.sort(compareItems);
    }, 0, 'items');
    return treeItems;
  }
  _renderFieldsTreeView(container) {
    var that = this;
    var dataSource = that._dataSource;
    var treeView = that._createComponent(container, TreeView, {
      dataSource: that._createFieldsDataSource(dataSource),
      showCheckBoxesMode: 'normal',
      expandNodesRecursive: false,
      searchEnabled: that.option('allowSearch'),
      searchTimeout: that.option('searchTimeout'),
      useNativeScrolling: false,
      itemTemplate(itemData, itemIndex, itemElement) {
        var _a;
        var $item = $('<div>').toggleClass(CLASSES.area.field, !itemData.items).attr(ATTRIBUTES.treeViewItem, true).data('field', itemData.field).appendTo(itemElement);
        if (itemData.icon) {
          (_a = getImageContainer(itemData.icon)) === null || _a === void 0 ? void 0 : _a.appendTo($item);
        }
        $('<span>').text(itemData.text).appendTo($item);
      },
      onItemCollapsed(e) {
        var index = that._expandedPaths.indexOf(e.itemData.path);
        if (index >= 0) {
          that._expandedPaths.splice(index, 1);
        }
      },
      onItemExpanded(e) {
        var index = that._expandedPaths.indexOf(e.itemData.path);
        if (index < 0) {
          that._expandedPaths.push(e.itemData.path);
        }
      },
      onItemSelectionChanged(e) {
        var data = e.itemData;
        var field;
        var fields;
        var needSelectDefaultItem = true;
        var area;
        if (data.items) {
          if (data.selected) {
            treeView.unselectItem(data);
            return;
          }
          that._processDemandState(() => {
            fields = getDimensionFields(data, dataSource.fields());
            for (var i = 0; i < fields.length; i += 1) {
              if (fields[i].area) {
                needSelectDefaultItem = false;
                break;
              }
            }
          });
          if (needSelectDefaultItem) {
            var item = getFirstItem(data, item => item.isDefault) || getFirstItem(data, item => isDefined(item.index));
            item && treeView.selectItem(item);
            return;
          }
        } else {
          field = dataSource.fields()[data.index];
          if (data.selected) {
            area = field.isMeasure ? 'data' : 'column';
          }
          if (field) {
            fields = [field];
          }
        }
        that._applyChanges(fields, {
          area,
          areaIndex: undefined
        });
      }
    });
    var dataChanged = function dataChanged() {
      var scrollable = getScrollable(container);
      var scrollTop = scrollable ? scrollable.scrollTop() : 0;
      treeView.option({
        dataSource: that._createFieldsDataSource(dataSource)
      });
      scrollable = getScrollable(container);
      if (scrollable) {
        scrollable.scrollTo({
          y: scrollTop
        });
        scrollable.update();
      }
    };
    that._dataChangedHandlers.push(dataChanged);
  }
  _renderAreaFields($container, area) {
    var that = this;
    var dataSource = that._dataSource;
    var fields = dataSource ? extend(true, [], dataSource.getAreaFields(area, true)) : [];
    $container.empty();
    each(fields, (_, field) => {
      if (field.visible !== false) {
        that.renderField(field, true).appendTo($container);
      }
    });
  }
  _renderArea(container, area) {
    var that = this;
    var $areaContainer = $(DIV).addClass(CLASSES.area.self).appendTo(container);
    var $fieldsHeaderContainer = $(DIV).addClass(CLASSES.area.fieldListHeader).appendTo($areaContainer);
    var caption = that.option("texts.".concat(area, "Fields"));
    var $fieldsContent;
    var render;
    $('<span>').addClass(CLASSES.area.icon).addClass("dx-icon-".concat(ICONS[area])).appendTo($fieldsHeaderContainer);
    $('<span>').html('&nbsp;').appendTo($fieldsHeaderContainer);
    $('<span>').addClass(CLASSES.area.caption).text(caption).appendTo($fieldsHeaderContainer);
    var $fieldsContainer = $(DIV).addClass(CLASSES.area.fieldList).addClass(CLASSES.pivotGrid.dragAction).appendTo($areaContainer);
    if (area !== 'all') {
      $fieldsContainer.attr('group', area).attr(ATTRIBUTES.allowScrolling, true);
      $fieldsContent = $(DIV).addClass(CLASSES.area.fieldContainer).appendTo($fieldsContainer);
      render = function render() {
        that._renderAreaFields($fieldsContent, area);
      };
      that._dataChangedHandlers.push(render);
      render();
      $fieldsContainer.dxScrollable({
        useNative: false
      });
    } else {
      $areaContainer.addClass(CLASSES.allFields);
      $fieldsContainer.addClass(CLASSES.treeView.borderVisible);
      that._renderFieldsTreeView($fieldsContainer);
    }
  }
  _getSortableOptions() {
    // TODO
    return {
      direction: ''
    };
  }
  _adjustSortableOnChangedArgs() {}
  resetTreeView() {
    var treeView = this.$element().find(".".concat(CLASSES.treeView.self)).dxTreeView('instance');
    if (treeView) {
      treeView.option('searchValue', '');
      treeView.collapseAll();
    }
  }
  applyChanges() {
    var state = this.option('state');
    if (isDefined(state)) {
      this._dataSource.state(state);
    }
  }
  cancelChanges() {
    var dataSource = this._dataSource;
    if (!dataSource.isLoading()) {
      this.option('state', dataSource.state());
      return true;
    }
    return false;
  }
  getDataSource() {
    return this._dataSource;
  }
  updateDimensions() {
    var $scrollableElements = this.$element().find(".".concat(CLASSES.area.self, " .").concat(CLASSES.scrollable.self));
    $scrollableElements.dxScrollable('update');
  }
  _visibilityChanged(visible) {
    if (visible && hasWindow) {
      this.updateDimensions();
    }
  }
}
registerComponent('dxPivotGridFieldChooser', FieldChooser);
export default {
  FieldChooser
};