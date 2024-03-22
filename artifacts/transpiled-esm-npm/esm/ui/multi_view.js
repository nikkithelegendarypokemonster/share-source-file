import { getWidth } from '../core/utils/size';
import $ from '../core/renderer';
import { locate } from '../animation/translator';
import { _translator, animation } from './multi_view/ui.multi_view.animation';
import { sign } from '../core/utils/math';
import { extend } from '../core/utils/extend';
import { noop, deferRender } from '../core/utils/common';
import { triggerResizeEvent } from '../events/visibility_change';
import { getPublicElement } from '../core/element';
import { isDefined } from '../core/utils/type';
import devices from '../core/devices';
import registerComponent from '../core/component_registrator';
import CollectionWidget from './collection/ui.collection_widget.live_update';
import Swipeable from '../events/gesture/swipeable';
import { Deferred } from '../core/utils/deferred';
import messageLocalization from '../localization/message';

// STYLE multiView

var MULTIVIEW_CLASS = 'dx-multiview';
var MULTIVIEW_WRAPPER_CLASS = 'dx-multiview-wrapper';
var MULTIVIEW_ITEM_CONTAINER_CLASS = 'dx-multiview-item-container';
var MULTIVIEW_ITEM_CLASS = 'dx-multiview-item';
var MULTIVIEW_ITEM_HIDDEN_CLASS = 'dx-multiview-item-hidden';
var MULTIVIEW_ITEM_DATA_KEY = 'dxMultiViewItemData';
var MULTIVIEW_ANIMATION_DURATION = 200;
var toNumber = value => +value;
var position = $element => locate($element).left;
var MultiView = CollectionWidget.inherit({
  _activeStateUnit: '.' + MULTIVIEW_ITEM_CLASS,
  _supportedKeys: function _supportedKeys() {
    return extend(this.callBase(), {
      pageUp: noop,
      pageDown: noop
    });
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      selectedIndex: 0,
      swipeEnabled: true,
      animationEnabled: true,
      loop: false,
      deferRendering: true,
      /**
      * @name dxMultiViewOptions.selectedItems
      * @hidden
      */

      /**
      * @name dxMultiViewOptions.selectedItemKeys
      * @hidden
      */

      /**
      * @name dxMultiViewOptions.keyExpr
      * @hidden
      */

      loopItemFocus: false,
      selectOnFocus: true,
      selectionMode: 'single',
      selectionRequired: true,
      selectByClick: false
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: function device() {
        return devices.real().deviceType === 'desktop' && !devices.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }]);
  },
  _itemClass: function _itemClass() {
    return MULTIVIEW_ITEM_CLASS;
  },
  _itemDataKey: function _itemDataKey() {
    return MULTIVIEW_ITEM_DATA_KEY;
  },
  _itemContainer: function _itemContainer() {
    return this._$itemContainer;
  },
  _itemElements: function _itemElements() {
    return this._itemContainer().children(this._itemSelector());
  },
  _itemWidth: function _itemWidth() {
    if (!this._itemWidthValue) {
      this._itemWidthValue = getWidth(this._$wrapper);
    }
    return this._itemWidthValue;
  },
  _clearItemWidthCache: function _clearItemWidthCache() {
    delete this._itemWidthValue;
  },
  _itemsCount: function _itemsCount() {
    return this.option('items').length;
  },
  _normalizeIndex: function _normalizeIndex(index) {
    var count = this._itemsCount();
    if (index < 0) {
      index = index + count;
    }
    if (index >= count) {
      index = index - count;
    }
    return index;
  },
  _getRTLSignCorrection: function _getRTLSignCorrection() {
    return this.option('rtlEnabled') ? -1 : 1;
  },
  _init: function _init() {
    this.callBase.apply(this, arguments);
    var $element = this.$element();
    $element.addClass(MULTIVIEW_CLASS);
    this._$wrapper = $('<div>').addClass(MULTIVIEW_WRAPPER_CLASS);
    this._$wrapper.appendTo($element);
    this._$itemContainer = $('<div>').addClass(MULTIVIEW_ITEM_CONTAINER_CLASS);
    this._$itemContainer.appendTo(this._$wrapper);
    this.option('loopItemFocus', this.option('loop'));
    this._findBoundaryIndices();
    this._initSwipeable();
  },
  _initMarkup: function _initMarkup() {
    this._deferredItems = [];
    this.callBase();
    var selectedItemIndices = this._getSelectedItemIndices();
    this._updateItemsVisibility(selectedItemIndices[0]);
    this._setElementAria();
    this._setItemsAria();
  },
  _afterItemElementDeleted: function _afterItemElementDeleted($item, deletedActionArgs) {
    this.callBase($item, deletedActionArgs);
    if (this._deferredItems) {
      this._deferredItems.splice(deletedActionArgs.itemIndex, 1);
    }
  },
  _beforeItemElementInserted: function _beforeItemElementInserted(change) {
    this.callBase.apply(this, arguments);
    if (this._deferredItems) {
      this._deferredItems.splice(change.index, 0, null);
    }
  },
  _executeItemRenderAction: function _executeItemRenderAction(index, itemData, itemElement) {
    index = (this.option('items') || []).indexOf(itemData);
    this.callBase(index, itemData, itemElement);
  },
  _renderItemContent: function _renderItemContent(args) {
    var renderContentDeferred = new Deferred();
    var that = this;
    var callBase = this.callBase;
    var deferred = new Deferred();
    deferred.done(function () {
      var $itemContent = callBase.call(that, args);
      renderContentDeferred.resolve($itemContent);
    });
    this._deferredItems[args.index] = deferred;
    this.option('deferRendering') || deferred.resolve();
    return renderContentDeferred.promise();
  },
  _render: function _render() {
    this.callBase();
    deferRender(() => {
      var selectedItemIndices = this._getSelectedItemIndices();
      this._updateItems(selectedItemIndices[0]);
    });
  },
  _getElementAria() {
    return {
      role: 'group',
      'roledescription': messageLocalization.format('dxMultiView-elementAriaRoleDescription'),
      label: messageLocalization.format('dxMultiView-elementAriaLabel')
    };
  },
  _setElementAria() {
    var aria = this._getElementAria();
    this.setAria(aria, this.$element());
  },
  _setItemsAria() {
    var $itemElements = this._itemElements();
    var itemsCount = this._itemsCount();
    $itemElements.each((itemIndex, item) => {
      var aria = this._getItemAria({
        itemIndex,
        itemsCount
      });
      this.setAria(aria, $(item));
    });
  },
  _getItemAria(_ref) {
    var {
      itemIndex,
      itemsCount
    } = _ref;
    var aria = {
      'role': 'group',
      'roledescription': messageLocalization.format('dxMultiView-itemAriaRoleDescription'),
      'label': messageLocalization.format('dxMultiView-itemAriaLabel', itemIndex + 1, itemsCount)
    };
    return aria;
  },
  _updateItems: function _updateItems(selectedIndex, newIndex) {
    this._updateItemsPosition(selectedIndex, newIndex);
    this._updateItemsVisibility(selectedIndex, newIndex);
  },
  _modifyByChanges: function _modifyByChanges() {
    this.callBase.apply(this, arguments);
    var selectedItemIndices = this._getSelectedItemIndices();
    this._updateItemsVisibility(selectedItemIndices[0]);
  },
  _updateItemsPosition: function _updateItemsPosition(selectedIndex, newIndex) {
    var $itemElements = this._itemElements();
    var positionSign = isDefined(newIndex) ? -this._animationDirection(newIndex, selectedIndex) : undefined;
    var $selectedItem = $itemElements.eq(selectedIndex);
    _translator.move($selectedItem, 0);
    if (isDefined(newIndex)) {
      _translator.move($itemElements.eq(newIndex), positionSign * 100 + '%');
    }
  },
  _updateItemsVisibility(selectedIndex, newIndex) {
    var $itemElements = this._itemElements();
    $itemElements.each((itemIndex, item) => {
      var $item = $(item);
      var isHidden = itemIndex !== selectedIndex && itemIndex !== newIndex;
      if (!isHidden) {
        this._renderSpecificItem(itemIndex);
      }
      $item.toggleClass(MULTIVIEW_ITEM_HIDDEN_CLASS, isHidden);
      this.setAria('hidden', isHidden || undefined, $item);
    });
  },
  _renderSpecificItem: function _renderSpecificItem(index) {
    var $item = this._itemElements().eq(index);
    var hasItemContent = $item.find(this._itemContentClass()).length > 0;
    if (isDefined(index) && !hasItemContent) {
      this._deferredItems[index].resolve();
      triggerResizeEvent($item);
    }
  },
  _refreshItem: function _refreshItem($item, item) {
    this.callBase($item, item);
    this._updateItemsVisibility(this.option('selectedIndex'));
  },
  _setAriaSelectionAttribute: noop,
  _updateSelection: function _updateSelection(addedSelection, removedSelection) {
    var newIndex = addedSelection[0];
    var prevIndex = removedSelection[0];
    animation.complete(this._$itemContainer);
    this._updateItems(prevIndex, newIndex);
    var animationDirection = this._animationDirection(newIndex, prevIndex);
    this._animateItemContainer(animationDirection * this._itemWidth(), function () {
      _translator.move(this._$itemContainer, 0);
      this._updateItems(newIndex);

      // NOTE: force layout recalculation on iOS 6 & iOS 7.0 (B254713)
      getWidth(this._$itemContainer);
    }.bind(this));
  },
  _animateItemContainer: function _animateItemContainer(position, completeCallback) {
    var duration = this.option('animationEnabled') ? MULTIVIEW_ANIMATION_DURATION : 0;
    animation.moveTo(this._$itemContainer, position, duration, completeCallback);
  },
  _animationDirection: function _animationDirection(newIndex, prevIndex) {
    var containerPosition = position(this._$itemContainer);
    var indexDifference = (prevIndex - newIndex) * this._getRTLSignCorrection() * this._getItemFocusLoopSignCorrection();
    var isSwipePresent = containerPosition !== 0;
    var directionSignVariable = isSwipePresent ? containerPosition : indexDifference;
    return sign(directionSignVariable);
  },
  _getSwipeDisabledState() {
    return !this.option('swipeEnabled') || this._itemsCount() <= 1;
  },
  _initSwipeable() {
    this._createComponent(this.$element(), Swipeable, {
      disabled: this._getSwipeDisabledState(),
      elastic: false,
      itemSizeFunc: this._itemWidth.bind(this),
      onStart: args => this._swipeStartHandler(args.event),
      onUpdated: args => this._swipeUpdateHandler(args.event),
      onEnd: args => this._swipeEndHandler(args.event)
    });
  },
  _findBoundaryIndices() {
    var _firstIndex2, _lastIndex;
    var items = this.option('items');
    var firstIndex;
    var lastIndex;
    items.forEach((item, index) => {
      var isDisabled = Boolean(item === null || item === void 0 ? void 0 : item.disabled);
      if (!isDisabled) {
        var _firstIndex;
        (_firstIndex = firstIndex) !== null && _firstIndex !== void 0 ? _firstIndex : firstIndex = index;
        lastIndex = index;
      }
    });
    this._boundaryIndices = {
      firstAvailableIndex: (_firstIndex2 = firstIndex) !== null && _firstIndex2 !== void 0 ? _firstIndex2 : 0,
      lastAvailableIndex: (_lastIndex = lastIndex) !== null && _lastIndex !== void 0 ? _lastIndex : items.length - 1,
      firstTrueIndex: 0,
      lastTrueIndex: items.length - 1
    };
  },
  _swipeStartHandler: function _swipeStartHandler(e) {
    animation.complete(this._$itemContainer);
    var selectedIndex = this.option('selectedIndex');
    var loop = this.option('loop');
    var {
      firstAvailableIndex,
      lastAvailableIndex
    } = this._boundaryIndices;
    var rtl = this.option('rtlEnabled');
    e.maxLeftOffset = toNumber(loop || (rtl ? selectedIndex > firstAvailableIndex : selectedIndex < lastAvailableIndex));
    e.maxRightOffset = toNumber(loop || (rtl ? selectedIndex < lastAvailableIndex : selectedIndex > firstAvailableIndex));
    this._swipeDirection = null;
  },
  _swipeUpdateHandler: function _swipeUpdateHandler(e) {
    var offset = e.offset;
    var swipeDirection = sign(offset) * this._getRTLSignCorrection();
    _translator.move(this._$itemContainer, offset * this._itemWidth());
    if (swipeDirection !== this._swipeDirection) {
      this._swipeDirection = swipeDirection;
      var selectedIndex = this.option('selectedIndex');
      var newIndex = this._normalizeIndex(selectedIndex - swipeDirection);
      this._updateItems(selectedIndex, newIndex);
    }
  },
  _findNextAvailableIndex(index, offset) {
    var {
      items,
      loop
    } = this.option();
    var {
      firstAvailableIndex,
      lastAvailableIndex,
      firstTrueIndex,
      lastTrueIndex
    } = this._boundaryIndices;
    var isFirstActive = [firstTrueIndex, firstAvailableIndex].includes(index);
    var isLastActive = [lastTrueIndex, lastAvailableIndex].includes(index);
    if (loop) {
      if (isFirstActive && offset < 0) {
        return lastAvailableIndex;
      } else if (isLastActive && offset > 0) {
        return firstAvailableIndex;
      }
    }
    for (var i = index + offset; i >= firstAvailableIndex && i <= lastAvailableIndex; i += offset) {
      var isDisabled = Boolean(items[i].disabled);
      if (!isDisabled) {
        return i;
      }
    }
    return index;
  },
  _swipeEndHandler: function _swipeEndHandler(e) {
    var targetOffset = e.targetOffset * this._getRTLSignCorrection();
    if (targetOffset) {
      var newSelectedIndex = this._findNextAvailableIndex(this.option('selectedIndex'), -targetOffset);
      this.option('selectedIndex', newSelectedIndex);

      // TODO: change focusedElement on focusedItem
      var $selectedElement = this.itemElements().filter('.dx-item-selected');
      this.option('focusStateEnabled') && this.option('focusedElement', getPublicElement($selectedElement));
    } else {
      this._animateItemContainer(0, noop);
    }
  },
  _getItemFocusLoopSignCorrection: function _getItemFocusLoopSignCorrection() {
    return this._itemFocusLooped ? -1 : 1;
  },
  _moveFocus: function _moveFocus() {
    this.callBase.apply(this, arguments);
    this._itemFocusLooped = false;
  },
  _prevItem: function _prevItem($items) {
    var $result = this.callBase.apply(this, arguments);
    this._itemFocusLooped = $result.is($items.last());
    return $result;
  },
  _nextItem: function _nextItem($items) {
    var $result = this.callBase.apply(this, arguments);
    this._itemFocusLooped = $result.is($items.first());
    return $result;
  },
  _dimensionChanged: function _dimensionChanged() {
    this._clearItemWidthCache();
  },
  _visibilityChanged: function _visibilityChanged(visible) {
    if (visible) {
      this._dimensionChanged();
    }
  },
  _updateSwipeDisabledState() {
    var disabled = this._getSwipeDisabledState();
    Swipeable.getInstance(this.$element()).option('disabled', disabled);
  },
  _dispose: function _dispose() {
    delete this._boundaryIndices;
    this.callBase();
  },
  _optionChanged: function _optionChanged(args) {
    var value = args.value;
    switch (args.name) {
      case 'loop':
        this.option('loopItemFocus', value);
        break;
      case 'animationEnabled':
        break;
      case 'swipeEnabled':
        this._updateSwipeDisabledState();
        break;
      case 'deferRendering':
        this._invalidate();
        break;
      case 'items':
        this._updateSwipeDisabledState();
        this._findBoundaryIndices();
        this.callBase(args);
        break;
      default:
        this.callBase(args);
    }
  }
});
/**
* @name dxMultiViewItem.visible
* @hidden
*/

registerComponent('dxMultiView', MultiView);
export default MultiView;

/**
 * @name dxMultiViewItem
 * @inherits CollectionWidgetItem
 * @type object
 */