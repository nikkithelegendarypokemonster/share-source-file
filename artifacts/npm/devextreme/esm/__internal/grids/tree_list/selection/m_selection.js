/**
* DevExtreme (esm/__internal/grids/tree_list/selection/m_selection.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable max-classes-per-file */
import $ from '../../../../core/renderer';
import { equalByValue, noop } from '../../../../core/utils/common';
import { extend } from '../../../../core/utils/extend';
import { isDefined } from '../../../../core/utils/type';
import { columnHeadersSelectionExtenderMixin, dataSelectionExtenderMixin, rowsViewSelectionExtenderMixin, selectionModule } from '../../../grids/grid_core/selection/m_selection';
import treeListCore from '../m_core';
var TREELIST_SELECT_ALL_CLASS = 'dx-treelist-select-all';
var SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';
var nodeExists = function nodeExists(array, currentKey) {
  return !!array.filter(key => key === currentKey).length;
};
var data = Base => class DataSelectionTreeListExtender extends dataSelectionExtenderMixin(Base) {
  _handleDataChanged(e) {
    // @ts-expect-error
    var isRecursiveSelection = this._selectionController.isRecursiveSelection();
    if (isRecursiveSelection && (!e || e.changeType !== 'updateSelectionState')) {
      // @ts-expect-error
      this._selectionController.updateSelectionState({
        selectedItemKeys: this.option('selectedRowKeys')
      });
    }
    super._handleDataChanged.apply(this, arguments);
  }
  loadDescendants() {
    var that = this;
    // @ts-expect-error
    var d = super.loadDescendants.apply(that, arguments);
    // @ts-expect-error
    var isRecursiveSelection = this._selectionController.isRecursiveSelection();
    if (isRecursiveSelection) {
      d.done(() => {
        // @ts-expect-error
        this._selectionController.updateSelectionState({
          selectedItemKeys: that.option('selectedRowKeys')
        });
      });
    }
    return d;
  }
};
var selection = Base => class SelectionControllerTreeListExtender extends Base {
  constructor() {
    super(...arguments);
    this._updateSelectColumn = noop;
  }
  init() {
    super.init.apply(this, arguments);
    this._selectionStateByKey = {};
  }
  _getSelectionConfig() {
    var config = super._getSelectionConfig.apply(this, arguments);
    var {
      plainItems
    } = config;
    config.plainItems = cached => {
      var result;
      if (cached) {
        result = this._dataController.getCachedStoreData();
      }
      result || (result = plainItems.apply(this, arguments).map(item => item.data));
      return result || [];
    };
    config.isItemSelected = item => {
      var key = this._dataController.keyOf(item);
      return this.isRowSelected(key);
    };
    config.isSelectableItem = item => !!item;
    config.getItemData = item => item;
    // @ts-expect-error
    config.allowLoadByRange = undefined;
    return config;
  }
  renderSelectCheckBoxContainer($container, model) {
    var that = this;
    var rowsView = that.component.getView('rowsView');
    // @ts-expect-error
    var $checkbox = rowsView._renderSelectCheckBox($container, {
      value: model.row.isSelected,
      row: model.row,
      column: model.column
    });
    // @ts-expect-error
    rowsView._attachCheckBoxClickEvent($checkbox);
  }
  _getSelectAllNodeKeys() {
    var {
      component
    } = this;
    // @ts-expect-error
    var root = component.getRootNode();
    var cache = {};
    var keys = [];
    var isRecursiveSelection = this.isRecursiveSelection();
    root && treeListCore.foreachNodes(root.children, node => {
      if (node.key !== undefined && (node.visible || isRecursiveSelection)) {
        keys.push(node.key);
      }
      if (!node.visible) {
        return true;
      }
      // @ts-expect-error
      return isRecursiveSelection ? false : component.isRowExpanded(node.key, cache);
    });
    return keys;
  }
  isSelectAll() {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var selectedRowKeys = this.option('selectedRowKeys') || [];
    if (selectedRowKeys.length === 0) return false;
    var {
      component
    } = this;
    var visibleKeys = this._getSelectAllNodeKeys();
    var isRecursiveSelection = this.isRecursiveSelection();
    var hasIndeterminateState = false;
    var selectedVisibleKeys = visibleKeys.filter(key => {
      // @ts-expect-error
      var isRowSelected = component.isRowSelected(key, isRecursiveSelection);
      if (isRowSelected === undefined) {
        hasIndeterminateState = true;
      }
      return isRowSelected;
    });
    if (!selectedVisibleKeys.length) {
      return hasIndeterminateState ? undefined : false;
    }
    if (selectedVisibleKeys.length === visibleKeys.length) {
      return true;
    }
    return undefined;
  }
  selectAll() {
    var visibleKeys = this._getSelectAllNodeKeys().filter(key => !this.isRowSelected(key));
    this.focusedItemIndex(-1);
    return this.selectRows(visibleKeys, true);
  }
  deselectAll() {
    var visibleKeys = this._getSelectAllNodeKeys();
    this.focusedItemIndex(-1);
    return this.deselectRows(visibleKeys);
  }
  selectedItemKeys(value, preserve, isDeselect, isSelectAll) {
    var that = this;
    var selectedRowKeys = that.option('selectedRowKeys');
    var isRecursiveSelection = this.isRecursiveSelection();
    var normalizedArgs = isRecursiveSelection && that._normalizeSelectionArgs({
      keys: isDefined(value) ? value : []
    }, preserve, !isDeselect);
    if (normalizedArgs && !equalByValue(normalizedArgs.selectedRowKeys, selectedRowKeys)) {
      that._isSelectionNormalizing = true;
      return super.selectedItemKeys(normalizedArgs.selectedRowKeys, false, false, false).always(() => {
        that._isSelectionNormalizing = false;
      }).done(items => {
        normalizedArgs.selectedRowsData = items;
        // @ts-expect-error
        that._fireSelectionChanged(normalizedArgs);
      });
    }
    return super.selectedItemKeys(value, preserve, isDeselect, isSelectAll);
  }
  changeItemSelection(itemIndex, keyboardKeys) {
    var isRecursiveSelection = this.isRecursiveSelection();
    var callBase = super.changeItemSelection.bind(this);
    if (isRecursiveSelection && !keyboardKeys.shift) {
      var key = this._dataController.getKeyByRowIndex(itemIndex);
      return this.selectedItemKeys(key, true, this.isRowSelected(key)).done(() => {
        this.isRowSelected(key) && callBase(itemIndex, keyboardKeys, true);
      });
    }
    return super.changeItemSelection.apply(this, arguments);
  }
  _updateParentSelectionState(node, isSelected) {
    var that = this;
    var state = isSelected;
    var parentNode = node.parent;
    if (parentNode) {
      if (parentNode.children.length > 1) {
        if (isSelected === false) {
          var hasSelectedState = parentNode.children.some(childNode => that._selectionStateByKey[childNode.key]);
          state = hasSelectedState ? undefined : false;
        } else if (isSelected === true) {
          var hasNonSelectedState = parentNode.children.some(childNode => !that._selectionStateByKey[childNode.key]);
          state = hasNonSelectedState ? undefined : true;
        }
      }
      this._selectionStateByKey[parentNode.key] = state;
      if (parentNode.parent && parentNode.parent.level >= 0) {
        this._updateParentSelectionState(parentNode, state);
      }
    }
  }
  _updateChildrenSelectionState(node, isSelected) {
    var that = this;
    var {
      children
    } = node;
    children && children.forEach(childNode => {
      that._selectionStateByKey[childNode.key] = isSelected;
      if (childNode.children.length > 0) {
        that._updateChildrenSelectionState(childNode, isSelected);
      }
    });
  }
  _updateSelectionStateCore(keys, isSelected) {
    var dataController = this._dataController;
    for (var i = 0; i < keys.length; i++) {
      this._selectionStateByKey[keys[i]] = isSelected;
      // @ts-expect-error
      var node = dataController.getNodeByKey(keys[i]);
      if (node) {
        this._updateParentSelectionState(node, isSelected);
        this._updateChildrenSelectionState(node, isSelected);
      }
    }
  }
  _getSelectedParentKeys(key, selectedItemKeys, useCash) {
    var selectedParentNode;
    // @ts-expect-error
    var node = this._dataController.getNodeByKey(key);
    var parentNode = node && node.parent;
    var result = [];
    while (parentNode && parentNode.level >= 0) {
      result.unshift(parentNode.key);
      var isSelected = useCash ? !nodeExists(selectedItemKeys, parentNode.key) && this.isRowSelected(parentNode.key) : selectedItemKeys.indexOf(parentNode.key) >= 0;
      if (isSelected) {
        selectedParentNode = parentNode;
        result = this._getSelectedParentKeys(selectedParentNode.key, selectedItemKeys, useCash).concat(result);
        break;
      } else if (useCash) {
        break;
      }
      parentNode = parentNode.parent;
    }
    return selectedParentNode && result || [];
  }
  _getSelectedChildKeys(key, keysToIgnore) {
    var childKeys = [];
    // @ts-expect-error
    var node = this._dataController.getNodeByKey(key);
    node && treeListCore.foreachNodes(node.children, childNode => {
      var ignoreKeyIndex = keysToIgnore.indexOf(childNode.key);
      if (ignoreKeyIndex < 0) {
        childKeys.push(childNode.key);
      }
      return ignoreKeyIndex > 0 || ignoreKeyIndex < 0 && this._selectionStateByKey[childNode.key] === undefined;
    });
    return childKeys;
  }
  _normalizeParentKeys(key, args) {
    var that = this;
    var keysToIgnore = [key];
    var parentNodeKeys = that._getSelectedParentKeys(key, args.selectedRowKeys);
    if (parentNodeKeys.length) {
      keysToIgnore = keysToIgnore.concat(parentNodeKeys);
      keysToIgnore.forEach(key => {
        var index = args.selectedRowKeys.indexOf(key);
        if (index >= 0) {
          args.selectedRowKeys.splice(index, 1);
        }
      });
      var childKeys = that._getSelectedChildKeys(parentNodeKeys[0], keysToIgnore);
      args.selectedRowKeys = args.selectedRowKeys.concat(childKeys);
    }
  }
  _normalizeChildrenKeys(key, args) {
    // @ts-expect-error
    var node = this._dataController.getNodeByKey(key);
    node && node.children.forEach(childNode => {
      var index = args.selectedRowKeys.indexOf(childNode.key);
      if (index >= 0) {
        args.selectedRowKeys.splice(index, 1);
      }
      this._normalizeChildrenKeys(childNode.key, args);
    });
  }
  _normalizeSelectedRowKeysCore(keys, args, preserve, isSelect) {
    var that = this;
    keys.forEach(key => {
      if (preserve && that.isRowSelected(key) === isSelect) {
        return;
      }
      that._normalizeChildrenKeys(key, args);
      var index = args.selectedRowKeys.indexOf(key);
      if (isSelect) {
        if (index < 0) {
          args.selectedRowKeys.push(key);
        }
        args.currentSelectedRowKeys.push(key);
      } else {
        if (index >= 0) {
          args.selectedRowKeys.splice(index, 1);
        }
        args.currentDeselectedRowKeys.push(key);
        that._normalizeParentKeys(key, args);
      }
    });
  }
  _normalizeSelectionArgs(args, preserve, isSelect) {
    var result;
    var keys = Array.isArray(args.keys) ? args.keys : [args.keys];
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var selectedRowKeys = this.option('selectedRowKeys') || [];
    if (keys.length) {
      result = {
        currentSelectedRowKeys: [],
        currentDeselectedRowKeys: [],
        selectedRowKeys: preserve ? selectedRowKeys.slice(0) : []
      };
      this._normalizeSelectedRowKeysCore(keys, result, preserve, isSelect);
    }
    return result;
  }
  _updateSelectedItems(args) {
    this.updateSelectionState(args);
    super._updateSelectedItems(args);
  }
  _fireSelectionChanged() {
    if (!this._isSelectionNormalizing) {
      super._fireSelectionChanged.apply(this, arguments);
    }
  }
  _isModeLeavesOnly(mode) {
    return mode === 'leavesOnly';
  }
  _removeDuplicatedKeys(keys) {
    var result = [];
    var processedKeys = {};
    keys.forEach(key => {
      if (!processedKeys[key]) {
        processedKeys[key] = true;
        result.push(key);
      }
    });
    return result;
  }
  _getAllChildKeys(key) {
    var childKeys = [];
    // @ts-expect-error
    var node = this._dataController.getNodeByKey(key);
    node && treeListCore.foreachNodes(node.children, childNode => {
      childKeys.push(childNode.key);
    }, true);
    return childKeys;
  }
  _getAllSelectedRowKeys(keys) {
    var result = [];
    keys.forEach(key => {
      var parentKeys = this._getSelectedParentKeys(key, [], true);
      var childKeys = this._getAllChildKeys(key);
      result.push.apply(result, parentKeys.concat([key], childKeys));
    });
    result = this._removeDuplicatedKeys(result);
    return result;
  }
  _getParentSelectedRowKeys(keys) {
    var that = this;
    var result = [];
    keys.forEach(key => {
      var parentKeys = that._getSelectedParentKeys(key, keys);
      !parentKeys.length && result.push(key);
    });
    return result;
  }
  _getLeafSelectedRowKeys(keys) {
    var that = this;
    var result = [];
    var dataController = that._dataController;
    keys.forEach(key => {
      // @ts-expect-error
      var node = dataController.getNodeByKey(key);
      node && !node.hasChildren && result.push(key);
    });
    return result;
  }
  isRecursiveSelection() {
    var selectionMode = this.option('selection.mode');
    var isRecursive = this.option('selection.recursive');
    return selectionMode === 'multiple' && isRecursive;
  }
  updateSelectionState(options) {
    var removedItemKeys = options.removedItemKeys || [];
    var selectedItemKeys = options.selectedItemKeys || [];
    if (this.isRecursiveSelection()) {
      this._updateSelectionStateCore(removedItemKeys, false);
      this._updateSelectionStateCore(selectedItemKeys, true);
    }
  }
  isRowSelected(key, isRecursiveSelection) {
    var result = super.isRowSelected.apply(this, arguments);
    isRecursiveSelection = isRecursiveSelection !== null && isRecursiveSelection !== void 0 ? isRecursiveSelection : this.isRecursiveSelection();
    if (!result && isRecursiveSelection) {
      if (key in this._selectionStateByKey) {
        return this._selectionStateByKey[key];
      }
      return false;
    }
    return result;
  }
  getSelectedRowKeys(mode) {
    var that = this;
    if (!that._dataController) {
      return [];
    }
    var selectedRowKeys = super.getSelectedRowKeys.apply(that, arguments);
    if (mode) {
      if (this.isRecursiveSelection()) {
        selectedRowKeys = this._getAllSelectedRowKeys(selectedRowKeys);
      }
      if (mode !== 'all') {
        if (mode === 'excludeRecursive') {
          selectedRowKeys = that._getParentSelectedRowKeys(selectedRowKeys);
        } else if (that._isModeLeavesOnly(mode)) {
          selectedRowKeys = that._getLeafSelectedRowKeys(selectedRowKeys);
        }
      }
    }
    return selectedRowKeys;
  }
  getSelectedRowsData(mode) {
    var that = this;
    var dataController = that._dataController;
    var selectedKeys = this.getSelectedRowKeys(mode) || [];
    var selectedRowsData = [];
    selectedKeys.forEach(key => {
      // @ts-expect-error
      var node = dataController.getNodeByKey(key);
      node && selectedRowsData.push(node.data);
    });
    return selectedRowsData;
  }
  refresh() {
    this._selectionStateByKey = {};
    return super.refresh.apply(this, arguments);
  }
};
var columnHeadersView = Base => class ColumnHeaderViewSelectionTreeListExtender extends columnHeadersSelectionExtenderMixin(Base) {
  _processTemplate(template, options) {
    var that = this;
    var resultTemplate;
    var renderingTemplate = super._processTemplate(template, options);
    // @ts-expect-error
    var firstDataColumnIndex = that._columnsController.getFirstDataColumnIndex();
    if (renderingTemplate && options.rowType === 'header' && options.column.index === firstDataColumnIndex) {
      resultTemplate = {
        render(options) {
          if (that.option('selection.mode') === 'multiple') {
            that.renderSelectAll(options.container, options.model);
          }
          renderingTemplate.render(options);
        }
      };
    } else {
      resultTemplate = renderingTemplate;
    }
    return resultTemplate;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderSelectAll($cell, options) {
    $cell.addClass(TREELIST_SELECT_ALL_CLASS);
    this._renderSelectAllCheckBox($cell);
  }
  _isSortableElement($target) {
    return super._isSortableElement($target) && !$target.closest(".".concat(SELECT_CHECKBOX_CLASS)).length;
  }
};
var rowsView = Base => class RowsViewSelectionTreeListExtender extends rowsViewSelectionExtenderMixin(Base) {
  _renderIcons($iconContainer, options) {
    // @ts-expect-error
    super._renderIcons.apply(this, arguments);
    if (!options.row.isNewRow && this.option('selection.mode') === 'multiple') {
      // @ts-expect-error
      this._selectionController.renderSelectCheckBoxContainer($iconContainer, options);
    }
    return $iconContainer;
  }
  _rowClick(e) {
    var $targetElement = $(e.event.target);
    // @ts-expect-error
    if (this.isExpandIcon($targetElement)) {
      super._rowClickForTreeList.apply(this, arguments);
    } else {
      super._rowClick.apply(this, arguments);
    }
  }
};
treeListCore.registerModule('selection', extend(true, {}, selectionModule, {
  defaultOptions() {
    return extend(true, selectionModule.defaultOptions(), {
      selection: {
        showCheckBoxesMode: 'always',
        recursive: false
      }
    });
  },
  extenders: {
    controllers: {
      data,
      selection
    },
    views: {
      columnHeadersView,
      rowsView
    }
  }
}));
