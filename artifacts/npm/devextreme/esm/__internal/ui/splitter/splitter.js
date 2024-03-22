/**
* DevExtreme (esm/__internal/ui/splitter/splitter.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import registerComponent from '../../../core/component_registrator';
import { getPublicElement } from '../../../core/element';
import Guid from '../../../core/guid';
import $ from '../../../core/renderer';
import resizeObserverSingleton from '../../../core/resize_observer';
import { extend } from '../../../core/utils/extend';
import { each } from '../../../core/utils/iterator';
import { getOuterHeight, getOuterWidth } from '../../../core/utils/size';
import { hasWindow } from '../../../core/utils/window';
import CollectionWidgetItem from '../../../ui/collection/item';
import CollectionWidget from '../../../ui/collection/ui.collection_widget.live_update';
import ResizeHandle, { RESIZE_HANDLE_CLASS } from './resize_handle';
import { getComponentInstance } from './utils/component';
import { getActionNameByEventName, ITEM_COLLAPSED_EVENT, ITEM_EXPANDED_EVENT, RESIZE_EVENT } from './utils/event';
import { calculateDelta, convertSizeToRatio, findIndexOfNextVisibleItem, findLastIndexOfVisibleItem, getCurrentLayout, getDefaultLayout, getDimensionByOrientation, getElementSize, getNewLayout, getVisibleItems, getVisibleItemsCount, isElementVisible, setFlexProp, updateItemsSize, validateLayout } from './utils/layout';
var SPLITTER_CLASS = 'dx-splitter';
var SPLITTER_ITEM_CLASS = 'dx-splitter-item';
var SPLITTER_ITEM_DATA_KEY = 'dxSplitterItemData';
var HORIZONTAL_ORIENTATION_CLASS = 'dx-splitter-horizontal';
var VERTICAL_ORIENTATION_CLASS = 'dx-splitter-vertical';
var INVISIBLE_STATE_CLASS = 'dx-state-invisible';
var INACTIVE_RESIZE_HANDLE_SIZE = 2;
var FLEX_PROPERTY = {
  flexGrow: 'flexGrow',
  flexShrink: 'flexShrink',
  flexBasis: 'flexBasis'
};
var DEFAULT_FLEX_SHRINK_PROP = 0;
var DEFAULT_FLEX_BASIS_PROP = 0;
var ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};
class SplitterItem extends CollectionWidgetItem {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Splitter extends CollectionWidget {
  _getDefaultOptions() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      orientation: ORIENTATION.horizontal,
      onItemCollapsed: null,
      onItemExpanded: null,
      onResize: null,
      onResizeEnd: null,
      onResizeStart: null,
      allowKeyboardNavigation: true,
      separatorSize: 8
    });
  }
  // eslint-disable-next-line class-methods-use-this
  _itemClass() {
    return SPLITTER_ITEM_CLASS;
  }
  // eslint-disable-next-line class-methods-use-this
  _itemDataKey() {
    return SPLITTER_ITEM_DATA_KEY;
  }
  _initMarkup() {
    this.$element().addClass(SPLITTER_CLASS);
    this._toggleOrientationClass();
    super._initMarkup();
    this._panesCacheSize = {};
    this._attachResizeObserverSubscription();
  }
  _getItemDimension(element) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._isHorizontalOrientation() ? getOuterWidth(element) : getOuterHeight(element);
  }
  _shouldUpdateLayout() {
    var size = this._getDimension(this.$element().get(0));
    return size === 0;
  }
  _render() {
    super._render();
  }
  _attachResizeObserverSubscription() {
    if (hasWindow()) {
      var formRootElement = this.$element().get(0);
      resizeObserverSingleton.unobserve(formRootElement);
      resizeObserverSingleton.observe(formRootElement, () => {
        this._resizeHandler();
      });
    }
  }
  _resizeHandler() {
    if (!this._shouldRecalculateLayout) {
      return;
    }
    this._layout = this._getDefaultLayoutBasedOnSize();
    this._applyFlexGrowFromLayout(this._layout);
    this._updatePaneSizesWithOuterWidth();
    this._shouldRecalculateLayout = false;
  }
  _renderItems(items) {
    this._resizeHandles = [];
    super._renderItems(items);
    this._updateResizeHandlesResizableState();
    this._updateResizeHandlesCollapsibleState();
    if (isElementVisible(this.$element().get(0))) {
      this._layout = this._getDefaultLayoutBasedOnSize();
      this._applyFlexGrowFromLayout(this._layout);
    } else {
      this._shouldRecalculateLayout = true;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _itemElements() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._itemContainer().children(this._itemSelector());
  }
  _isLastVisibleItem(index) {
    return index === findLastIndexOfVisibleItem(this.option('items'));
  }
  _renderItem(index, itemData, $container, $itemToReplace) {
    var $itemFrame = super._renderItem(index, itemData, $container, $itemToReplace);
    var itemElement = $itemFrame.get(0);
    setFlexProp(itemElement, FLEX_PROPERTY.flexGrow, 100 / getVisibleItemsCount(this.option('items')));
    setFlexProp(itemElement, FLEX_PROPERTY.flexShrink, DEFAULT_FLEX_SHRINK_PROP);
    setFlexProp(itemElement, FLEX_PROPERTY.flexBasis, DEFAULT_FLEX_BASIS_PROP);
    var groupAriaAttributes = {
      role: 'group'
    };
    if (itemData.visible !== false && !this._isLastVisibleItem(index)) {
      var itemId = "dx_".concat(new Guid());
      groupAriaAttributes.id = itemId;
      var itemProps = {
        paneId: itemId
      };
      this._renderResizeHandle(itemProps);
    }
    this.setAria(groupAriaAttributes, $itemFrame);
    return $itemFrame;
  }
  _renderResizeHandle(itemProps) {
    var $resizeHandle = $('<div>').appendTo(this.$element());
    var config = this._getResizeHandleConfig(itemProps);
    var resizeHandle = this._createComponent($resizeHandle, ResizeHandle, config);
    this._resizeHandles.push(resizeHandle);
  }
  _updateResizeHandlesResizableState() {
    this._resizeHandles.forEach(resizeHandle => {
      var $resizeHandle = resizeHandle.$element();
      var $leftItem = this._getResizeHandleLeftItem($resizeHandle);
      var $rightItem = this._getResizeHandleRightItem($resizeHandle);
      var leftItemData = this._getItemData($leftItem);
      var rightItemData = this._getItemData($rightItem);
      var resizable = leftItemData.resizable !== false && rightItemData.resizable !== false && leftItemData.collapsed !== true && rightItemData.collapsed !== true;
      resizeHandle.option('resizable', resizable);
    });
  }
  _updateResizeHandlesCollapsibleState() {
    this._resizeHandles.forEach(resizeHandle => {
      var $resizeHandle = resizeHandle.$element();
      var $leftItem = this._getResizeHandleLeftItem($resizeHandle);
      var $rightItem = this._getResizeHandleRightItem($resizeHandle);
      var leftItemData = this._getItemData($leftItem);
      var rightItemData = this._getItemData($rightItem);
      var showCollapsePrev = rightItemData.collapsed === true ? rightItemData.collapsible === true && leftItemData.collapsed !== true : leftItemData.collapsible === true && leftItemData.collapsed !== true;
      var showCollapseNext = leftItemData.collapsed === true ? leftItemData.collapsible === true && rightItemData.collapsed !== true : rightItemData.collapsible === true && rightItemData.collapsed !== true;
      resizeHandle.option({
        showCollapsePrev,
        showCollapseNext
      });
    });
  }
  _updateResizeHandlesOption(optionName, optionValue) {
    this._resizeHandles.forEach(resizeHandle => {
      resizeHandle.option(optionName, optionValue);
    });
  }
  _getNextVisibleItemData(index) {
    var {
      items
    } = this.option();
    return this._getItemDataByIndex(findIndexOfNextVisibleItem(items, index));
  }
  _getItemDataByIndex(index) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._editStrategy.getItemDataByIndex(index);
  }
  _getAction(eventName) {
    var _a;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (_a = this[getActionNameByEventName(eventName)]) !== null && _a !== void 0 ? _a : this._createActionByOption(eventName);
  }
  _getResizeHandleConfig(itemProps) {
    var {
      orientation,
      rtlEnabled,
      allowKeyboardNavigation,
      separatorSize
    } = this.option();
    var {
      paneId
    } = itemProps;
    return {
      direction: orientation,
      focusStateEnabled: allowKeyboardNavigation,
      hoverStateEnabled: true,
      separatorSize,
      elementAttr: {
        'aria-controls': paneId
      },
      onCollapsePrev: e => {
        var $resizeHandle = $(e.element);
        var $leftItem = this._getResizeHandleLeftItem($resizeHandle);
        var leftItemData = this._getItemData($leftItem);
        var leftItemIndex = this._getIndexByItem(leftItemData);
        var $rightItem = this._getResizeHandleRightItem($resizeHandle);
        var rightItemData = this._getItemData($rightItem);
        var rightItemIndex = this._getIndexByItem(rightItemData);
        var isRightItemCollapsed = rightItemData.collapsed === true;
        if (isRightItemCollapsed) {
          this._options.silent("items[".concat(rightItemIndex, "].size"), this._panesCacheSize[rightItemIndex]);
          this.option("items[".concat(rightItemIndex, "].collapsed"), false);
          this._getAction(ITEM_EXPANDED_EVENT)({
            event: e.event,
            itemData: rightItemData,
            itemElement: $rightItem
          });
          return;
        }
        this._panesCacheSize[leftItemIndex] = this._getItemDimension($leftItem.get(0));
        this.option("items[".concat(leftItemIndex, "].collapsed"), true);
        this._getAction(ITEM_COLLAPSED_EVENT)({
          event: e.event,
          itemData: leftItemData,
          itemElement: $leftItem
        });
      },
      onCollapseNext: e => {
        var $resizeHandle = $(e.element);
        var $leftItem = this._getResizeHandleLeftItem($resizeHandle);
        var leftItemData = this._getItemData($leftItem);
        var leftItemIndex = this._getIndexByItem(leftItemData);
        var $rightItem = this._getResizeHandleRightItem($resizeHandle);
        var rightItemData = this._getItemData($rightItem);
        var rightItemIndex = this._getIndexByItem(rightItemData);
        var isLeftItemCollapsed = leftItemData.collapsed === true;
        if (isLeftItemCollapsed) {
          this._options.silent("items[".concat(leftItemIndex, "].size"), this._panesCacheSize[leftItemIndex]);
          this.option("items[".concat(leftItemIndex, "].collapsed"), false);
          this._getAction(ITEM_EXPANDED_EVENT)({
            event: e.event,
            itemData: leftItemData,
            itemElement: $leftItem
          });
          return;
        }
        this._panesCacheSize[rightItemIndex] = this._getItemDimension($rightItem.get(0));
        this.option("items[".concat(rightItemIndex, "].collapsed"), true);
        this._getAction(ITEM_COLLAPSED_EVENT)({
          event: e.event,
          itemData: rightItemData,
          itemElement: $rightItem
        });
      },
      onResizeStart: e => {
        var {
          element,
          event
        } = e;
        this._$visibleItems = this._getVisibleItems();
        this._currentLayout = getCurrentLayout(this._$visibleItems);
        this._activeResizeHandleIndex = this._getResizeHandleItems().index(element);
        this._splitterItemsSize = this._getSummaryItemsSize(getDimensionByOrientation(this.option('orientation')), this._$visibleItems, true);
        var {
          items,
          width,
          height
        } = this.option();
        var handlesSizeSum = this._getResizeHandlesSize();
        var elementSize = getElementSize(this.$element(), orientation, width, height, handlesSizeSum);
        this._itemRestrictions = [];
        getVisibleItems(items).forEach(item => {
          this._itemRestrictions.push({
            resizable: item.resizable !== false,
            visible: item.visible,
            size: convertSizeToRatio(item.size, elementSize),
            maxSize: convertSizeToRatio(item.maxSize, elementSize),
            minSize: convertSizeToRatio(item.minSize, elementSize)
          });
        });
        this._getAction(RESIZE_EVENT.onResizeStart)({
          event,
          handleElement: getPublicElement($(element))
        });
      },
      onResize: _ref => {
        var {
          element,
          event
        } = _ref;
        var newLayout = getNewLayout(this._currentLayout, calculateDelta(event.offset, this.option('orientation'), rtlEnabled, this._splitterItemsSize), this._activeResizeHandleIndex, this._itemRestrictions);
        updateItemsSize(this._$visibleItems, newLayout);
        this._getAction(RESIZE_EVENT.onResize)({
          event,
          handleElement: getPublicElement($(element))
        });
      },
      onResizeEnd: _ref2 => {
        var {
          element,
          event
        } = _ref2;
        each(this._itemElements(), (index, itemElement) => {
          this._options.silent("items[".concat(index, "].size"), this._getItemDimension(itemElement));
        });
        this._getAction(RESIZE_EVENT.onResizeEnd)({
          event,
          handleElement: getPublicElement($(element))
        });
      }
    };
  }
  // eslint-disable-next-line class-methods-use-this
  _getResizeHandleLeftItem($resizeHandle) {
    var $leftItem = $resizeHandle.prev();
    while ($leftItem.hasClass(INVISIBLE_STATE_CLASS)) {
      $leftItem = $leftItem.prev();
    }
    return $leftItem;
  }
  // eslint-disable-next-line class-methods-use-this
  _getResizeHandleRightItem($resizeHandle) {
    // @ts-expect-error renderer d.ts issue
    var $rightItem = $resizeHandle.next();
    while ($rightItem.hasClass(INVISIBLE_STATE_CLASS)) {
      // @ts-expect-error renderer d.ts issue
      $rightItem = $rightItem.next();
    }
    return $rightItem;
  }
  _getResizeHandlesSize() {
    var _a;
    var size = 0;
    (_a = this._resizeHandles) === null || _a === void 0 ? void 0 : _a.forEach(resizeHandle => {
      var {
        disabled,
        separatorSize
      } = resizeHandle.option();
      size += disabled ? INACTIVE_RESIZE_HANDLE_SIZE : separatorSize;
    });
    return size;
  }
  _renderItemContent(args) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super._renderItemContent(args);
  }
  _createItemByTemplate(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  itemTemplate,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  args) {
    var {
      itemData
    } = args;
    if (itemData.splitter) {
      return itemTemplate.source ? itemTemplate.source()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : $();
    }
    return super._createItemByTemplate(itemTemplate, args);
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _postprocessRenderItem(args) {
    var splitterConfig = args.itemData.splitter;
    if (!splitterConfig) {
      return;
    }
    this._createComponent($(args.itemContent), Splitter, extend({
      itemTemplate: this.option('itemTemplate'),
      onResize: this.option('onResize'),
      onResizeStart: this.option('onResizeStart'),
      onResizeEnd: this.option('onResizeEnd'),
      onItemClick: this.option('onItemClick'),
      onItemContextMenu: this.option('onItemContextMenu'),
      onItemRendered: this.option('onItemRendered'),
      onItemExpanded: this.option('onItemExpanded'),
      onItemCollapsed: this.option('onItemCollapsed')
    }, splitterConfig));
  }
  _isHorizontalOrientation() {
    return this.option('orientation') === ORIENTATION.horizontal;
  }
  _toggleOrientationClass() {
    this.$element().toggleClass(HORIZONTAL_ORIENTATION_CLASS, this._isHorizontalOrientation());
    this.$element().toggleClass(VERTICAL_ORIENTATION_CLASS, !this._isHorizontalOrientation());
  }
  _itemOptionChanged(item, property, value) {
    switch (property) {
      case 'size':
      case 'maxSize':
      case 'minSize':
        this._layout = this._getDefaultLayoutBasedOnSize();
        this._applyFlexGrowFromLayout(this._layout);
        this._updatePaneSizesWithOuterWidth();
        break;
      case 'collapsed':
        this._updateResizeHandlesResizableState();
        this._updateResizeHandlesCollapsibleState();
        this._layout = this._getDefaultLayoutBasedOnSize();
        this._applyFlexGrowFromLayout(this._layout);
        this._updatePaneSizesWithOuterWidth();
        break;
      case 'resizable':
        this._updateResizeHandlesResizableState();
        break;
      case 'collapsible':
        this._updateResizeHandlesCollapsibleState();
        break;
      default:
        super._itemOptionChanged(item, property, value);
    }
  }
  _getDefaultLayoutBasedOnSize() {
    var {
      items,
      orientation,
      width,
      height
    } = this.option();
    var handlesSizeSum = this._getResizeHandlesSize();
    var elementSize = getElementSize(this.$element(), orientation, width, height, handlesSizeSum);
    this._itemRestrictions = [];
    items.forEach(item => {
      this._itemRestrictions.push({
        visible: item.visible,
        collapsed: item.collapsed === true,
        size: convertSizeToRatio(item.size, elementSize),
        maxSize: convertSizeToRatio(item.maxSize, elementSize),
        minSize: convertSizeToRatio(item.minSize, elementSize)
      });
    });
    var defaultLayout = getDefaultLayout(this._itemRestrictions);
    return validateLayout(defaultLayout, this._itemRestrictions);
  }
  _applyFlexGrowFromLayout(layout) {
    this._iterateItems((index, itemElement) => {
      setFlexProp(itemElement, FLEX_PROPERTY.flexGrow, layout[index]);
    });
  }
  _updatePaneSizesWithOuterWidth() {
    this._iterateItems((index, itemElement) => {
      this._options.silent("items[".concat(index, "].size"), this._getItemDimension(itemElement));
    });
  }
  _iterateItems(callback) {
    each(this._itemElements(), (index, itemElement) => {
      callback(index, itemElement);
    });
  }
  _getResizeHandleItems() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.$element().children(".".concat(RESIZE_HANDLE_CLASS));
  }
  _iterateResizeHandles(callback) {
    this._getResizeHandleItems().each((index, element) => {
      callback(getComponentInstance($(element)));
      return true;
    });
  }
  _optionChanged(args) {
    var {
      name,
      value
    } = args;
    switch (name) {
      case 'allowKeyboardNavigation':
        this._iterateResizeHandles(instance => {
          instance.option('focusStateEnabled', value);
        });
        break;
      case 'orientation':
        this._toggleOrientationClass();
        this._updateResizeHandlesOption('direction', value);
        break;
      case 'onResizeStart':
      case 'onResizeEnd':
      case 'onResize':
      case 'onItemCollapsed':
      case 'onItemExpanded':
        this[getActionNameByEventName(name)] = this._createActionByOption(name);
        break;
      case 'separatorSize':
        this._updateResizeHandlesOption(name, value);
        break;
      default:
        super._optionChanged(args);
    }
  }
  registerKeyHandler(key, handler) {
    this._iterateResizeHandles(instance => {
      instance.registerKeyHandler(key, handler);
    });
  }
}
Splitter.ItemClass = SplitterItem;
// @ts-expect-error // temp fix
registerComponent('dxSplitter', Splitter);
export default Splitter;
