/**
* DevExtreme (bundles/__internal/ui/splitter/splitter.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _element = require("../../../core/element");
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _resize_observer = _interopRequireDefault(require("../../../core/resize_observer"));
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _size = require("../../../core/utils/size");
var _window = require("../../../core/utils/window");
var _item = _interopRequireDefault(require("../../../ui/collection/item"));
var _uiCollection_widget = _interopRequireDefault(require("../../../ui/collection/ui.collection_widget.live_update"));
var _resize_handle = _interopRequireWildcard(require("./resize_handle"));
var _component = require("./utils/component");
var _event = require("./utils/event");
var _layout = require("./utils/layout");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const SPLITTER_CLASS = 'dx-splitter';
const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const SPLITTER_ITEM_DATA_KEY = 'dxSplitterItemData';
const HORIZONTAL_ORIENTATION_CLASS = 'dx-splitter-horizontal';
const VERTICAL_ORIENTATION_CLASS = 'dx-splitter-vertical';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const INACTIVE_RESIZE_HANDLE_SIZE = 2;
const FLEX_PROPERTY = {
  flexGrow: 'flexGrow',
  flexShrink: 'flexShrink',
  flexBasis: 'flexBasis'
};
const DEFAULT_FLEX_SHRINK_PROP = 0;
const DEFAULT_FLEX_BASIS_PROP = 0;
const ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};
let SplitterItem = /*#__PURE__*/function (_CollectionWidgetItem) {
  _inheritsLoose(SplitterItem, _CollectionWidgetItem);
  function SplitterItem() {
    return _CollectionWidgetItem.apply(this, arguments) || this;
  }
  return SplitterItem;
}(_item.default); // eslint-disable-next-line @typescript-eslint/no-explicit-any
let Splitter = /*#__PURE__*/function (_CollectionWidget) {
  _inheritsLoose(Splitter, _CollectionWidget);
  function Splitter() {
    return _CollectionWidget.apply(this, arguments) || this;
  }
  var _proto = Splitter.prototype;
  _proto._getDefaultOptions = function _getDefaultOptions() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (0, _extend.extend)(_CollectionWidget.prototype._getDefaultOptions.call(this), {
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
  ;
  _proto._itemClass = function _itemClass() {
    return SPLITTER_ITEM_CLASS;
  }
  // eslint-disable-next-line class-methods-use-this
  ;
  _proto._itemDataKey = function _itemDataKey() {
    return SPLITTER_ITEM_DATA_KEY;
  };
  _proto._initMarkup = function _initMarkup() {
    this.$element().addClass(SPLITTER_CLASS);
    this._toggleOrientationClass();
    _CollectionWidget.prototype._initMarkup.call(this);
    this._panesCacheSize = {};
    this._attachResizeObserverSubscription();
  };
  _proto._getItemDimension = function _getItemDimension(element) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._isHorizontalOrientation() ? (0, _size.getOuterWidth)(element) : (0, _size.getOuterHeight)(element);
  };
  _proto._shouldUpdateLayout = function _shouldUpdateLayout() {
    const size = this._getDimension(this.$element().get(0));
    return size === 0;
  };
  _proto._render = function _render() {
    _CollectionWidget.prototype._render.call(this);
  };
  _proto._attachResizeObserverSubscription = function _attachResizeObserverSubscription() {
    if ((0, _window.hasWindow)()) {
      const formRootElement = this.$element().get(0);
      _resize_observer.default.unobserve(formRootElement);
      _resize_observer.default.observe(formRootElement, () => {
        this._resizeHandler();
      });
    }
  };
  _proto._resizeHandler = function _resizeHandler() {
    if (!this._shouldRecalculateLayout) {
      return;
    }
    this._layout = this._getDefaultLayoutBasedOnSize();
    this._applyFlexGrowFromLayout(this._layout);
    this._updatePaneSizesWithOuterWidth();
    this._shouldRecalculateLayout = false;
  };
  _proto._renderItems = function _renderItems(items) {
    this._resizeHandles = [];
    _CollectionWidget.prototype._renderItems.call(this, items);
    this._updateResizeHandlesResizableState();
    this._updateResizeHandlesCollapsibleState();
    if ((0, _layout.isElementVisible)(this.$element().get(0))) {
      this._layout = this._getDefaultLayoutBasedOnSize();
      this._applyFlexGrowFromLayout(this._layout);
    } else {
      this._shouldRecalculateLayout = true;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;
  _proto._itemElements = function _itemElements() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._itemContainer().children(this._itemSelector());
  };
  _proto._isLastVisibleItem = function _isLastVisibleItem(index) {
    return index === (0, _layout.findLastIndexOfVisibleItem)(this.option('items'));
  };
  _proto._renderItem = function _renderItem(index, itemData, $container, $itemToReplace) {
    const $itemFrame = _CollectionWidget.prototype._renderItem.call(this, index, itemData, $container, $itemToReplace);
    const itemElement = $itemFrame.get(0);
    (0, _layout.setFlexProp)(itemElement, FLEX_PROPERTY.flexGrow, 100 / (0, _layout.getVisibleItemsCount)(this.option('items')));
    (0, _layout.setFlexProp)(itemElement, FLEX_PROPERTY.flexShrink, DEFAULT_FLEX_SHRINK_PROP);
    (0, _layout.setFlexProp)(itemElement, FLEX_PROPERTY.flexBasis, DEFAULT_FLEX_BASIS_PROP);
    const groupAriaAttributes = {
      role: 'group'
    };
    if (itemData.visible !== false && !this._isLastVisibleItem(index)) {
      const itemId = "dx_".concat(new _guid.default());
      groupAriaAttributes.id = itemId;
      const itemProps = {
        paneId: itemId
      };
      this._renderResizeHandle(itemProps);
    }
    this.setAria(groupAriaAttributes, $itemFrame);
    return $itemFrame;
  };
  _proto._renderResizeHandle = function _renderResizeHandle(itemProps) {
    const $resizeHandle = (0, _renderer.default)('<div>').appendTo(this.$element());
    const config = this._getResizeHandleConfig(itemProps);
    const resizeHandle = this._createComponent($resizeHandle, _resize_handle.default, config);
    this._resizeHandles.push(resizeHandle);
  };
  _proto._updateResizeHandlesResizableState = function _updateResizeHandlesResizableState() {
    this._resizeHandles.forEach(resizeHandle => {
      const $resizeHandle = resizeHandle.$element();
      const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
      const $rightItem = this._getResizeHandleRightItem($resizeHandle);
      const leftItemData = this._getItemData($leftItem);
      const rightItemData = this._getItemData($rightItem);
      const resizable = leftItemData.resizable !== false && rightItemData.resizable !== false && leftItemData.collapsed !== true && rightItemData.collapsed !== true;
      resizeHandle.option('resizable', resizable);
    });
  };
  _proto._updateResizeHandlesCollapsibleState = function _updateResizeHandlesCollapsibleState() {
    this._resizeHandles.forEach(resizeHandle => {
      const $resizeHandle = resizeHandle.$element();
      const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
      const $rightItem = this._getResizeHandleRightItem($resizeHandle);
      const leftItemData = this._getItemData($leftItem);
      const rightItemData = this._getItemData($rightItem);
      const showCollapsePrev = rightItemData.collapsed === true ? rightItemData.collapsible === true && leftItemData.collapsed !== true : leftItemData.collapsible === true && leftItemData.collapsed !== true;
      const showCollapseNext = leftItemData.collapsed === true ? leftItemData.collapsible === true && rightItemData.collapsed !== true : rightItemData.collapsible === true && rightItemData.collapsed !== true;
      resizeHandle.option({
        showCollapsePrev,
        showCollapseNext
      });
    });
  };
  _proto._updateResizeHandlesOption = function _updateResizeHandlesOption(optionName, optionValue) {
    this._resizeHandles.forEach(resizeHandle => {
      resizeHandle.option(optionName, optionValue);
    });
  };
  _proto._getNextVisibleItemData = function _getNextVisibleItemData(index) {
    const {
      items
    } = this.option();
    return this._getItemDataByIndex((0, _layout.findIndexOfNextVisibleItem)(items, index));
  };
  _proto._getItemDataByIndex = function _getItemDataByIndex(index) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._editStrategy.getItemDataByIndex(index);
  };
  _proto._getAction = function _getAction(eventName) {
    var _a;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (_a = this[(0, _event.getActionNameByEventName)(eventName)]) !== null && _a !== void 0 ? _a : this._createActionByOption(eventName);
  };
  _proto._getResizeHandleConfig = function _getResizeHandleConfig(itemProps) {
    const {
      orientation,
      rtlEnabled,
      allowKeyboardNavigation,
      separatorSize
    } = this.option();
    const {
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
        const $resizeHandle = (0, _renderer.default)(e.element);
        const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
        const leftItemData = this._getItemData($leftItem);
        const leftItemIndex = this._getIndexByItem(leftItemData);
        const $rightItem = this._getResizeHandleRightItem($resizeHandle);
        const rightItemData = this._getItemData($rightItem);
        const rightItemIndex = this._getIndexByItem(rightItemData);
        const isRightItemCollapsed = rightItemData.collapsed === true;
        if (isRightItemCollapsed) {
          this._options.silent("items[".concat(rightItemIndex, "].size"), this._panesCacheSize[rightItemIndex]);
          this.option("items[".concat(rightItemIndex, "].collapsed"), false);
          this._getAction(_event.ITEM_EXPANDED_EVENT)({
            event: e.event,
            itemData: rightItemData,
            itemElement: $rightItem
          });
          return;
        }
        this._panesCacheSize[leftItemIndex] = this._getItemDimension($leftItem.get(0));
        this.option("items[".concat(leftItemIndex, "].collapsed"), true);
        this._getAction(_event.ITEM_COLLAPSED_EVENT)({
          event: e.event,
          itemData: leftItemData,
          itemElement: $leftItem
        });
      },
      onCollapseNext: e => {
        const $resizeHandle = (0, _renderer.default)(e.element);
        const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
        const leftItemData = this._getItemData($leftItem);
        const leftItemIndex = this._getIndexByItem(leftItemData);
        const $rightItem = this._getResizeHandleRightItem($resizeHandle);
        const rightItemData = this._getItemData($rightItem);
        const rightItemIndex = this._getIndexByItem(rightItemData);
        const isLeftItemCollapsed = leftItemData.collapsed === true;
        if (isLeftItemCollapsed) {
          this._options.silent("items[".concat(leftItemIndex, "].size"), this._panesCacheSize[leftItemIndex]);
          this.option("items[".concat(leftItemIndex, "].collapsed"), false);
          this._getAction(_event.ITEM_EXPANDED_EVENT)({
            event: e.event,
            itemData: leftItemData,
            itemElement: $leftItem
          });
          return;
        }
        this._panesCacheSize[rightItemIndex] = this._getItemDimension($rightItem.get(0));
        this.option("items[".concat(rightItemIndex, "].collapsed"), true);
        this._getAction(_event.ITEM_COLLAPSED_EVENT)({
          event: e.event,
          itemData: rightItemData,
          itemElement: $rightItem
        });
      },
      onResizeStart: e => {
        const {
          element,
          event
        } = e;
        this._$visibleItems = this._getVisibleItems();
        this._currentLayout = (0, _layout.getCurrentLayout)(this._$visibleItems);
        this._activeResizeHandleIndex = this._getResizeHandleItems().index(element);
        this._splitterItemsSize = this._getSummaryItemsSize((0, _layout.getDimensionByOrientation)(this.option('orientation')), this._$visibleItems, true);
        const {
          items,
          width,
          height
        } = this.option();
        const handlesSizeSum = this._getResizeHandlesSize();
        const elementSize = (0, _layout.getElementSize)(this.$element(), orientation, width, height, handlesSizeSum);
        this._itemRestrictions = [];
        (0, _layout.getVisibleItems)(items).forEach(item => {
          this._itemRestrictions.push({
            resizable: item.resizable !== false,
            visible: item.visible,
            size: (0, _layout.convertSizeToRatio)(item.size, elementSize),
            maxSize: (0, _layout.convertSizeToRatio)(item.maxSize, elementSize),
            minSize: (0, _layout.convertSizeToRatio)(item.minSize, elementSize)
          });
        });
        this._getAction(_event.RESIZE_EVENT.onResizeStart)({
          event,
          handleElement: (0, _element.getPublicElement)((0, _renderer.default)(element))
        });
      },
      onResize: _ref => {
        let {
          element,
          event
        } = _ref;
        const newLayout = (0, _layout.getNewLayout)(this._currentLayout, (0, _layout.calculateDelta)(event.offset, this.option('orientation'), rtlEnabled, this._splitterItemsSize), this._activeResizeHandleIndex, this._itemRestrictions);
        (0, _layout.updateItemsSize)(this._$visibleItems, newLayout);
        this._getAction(_event.RESIZE_EVENT.onResize)({
          event,
          handleElement: (0, _element.getPublicElement)((0, _renderer.default)(element))
        });
      },
      onResizeEnd: _ref2 => {
        let {
          element,
          event
        } = _ref2;
        (0, _iterator.each)(this._itemElements(), (index, itemElement) => {
          this._options.silent("items[".concat(index, "].size"), this._getItemDimension(itemElement));
        });
        this._getAction(_event.RESIZE_EVENT.onResizeEnd)({
          event,
          handleElement: (0, _element.getPublicElement)((0, _renderer.default)(element))
        });
      }
    };
  }
  // eslint-disable-next-line class-methods-use-this
  ;
  _proto._getResizeHandleLeftItem = function _getResizeHandleLeftItem($resizeHandle) {
    let $leftItem = $resizeHandle.prev();
    while ($leftItem.hasClass(INVISIBLE_STATE_CLASS)) {
      $leftItem = $leftItem.prev();
    }
    return $leftItem;
  }
  // eslint-disable-next-line class-methods-use-this
  ;
  _proto._getResizeHandleRightItem = function _getResizeHandleRightItem($resizeHandle) {
    // @ts-expect-error renderer d.ts issue
    let $rightItem = $resizeHandle.next();
    while ($rightItem.hasClass(INVISIBLE_STATE_CLASS)) {
      // @ts-expect-error renderer d.ts issue
      $rightItem = $rightItem.next();
    }
    return $rightItem;
  };
  _proto._getResizeHandlesSize = function _getResizeHandlesSize() {
    var _a;
    let size = 0;
    (_a = this._resizeHandles) === null || _a === void 0 ? void 0 : _a.forEach(resizeHandle => {
      const {
        disabled,
        separatorSize
      } = resizeHandle.option();
      size += disabled ? INACTIVE_RESIZE_HANDLE_SIZE : separatorSize;
    });
    return size;
  };
  _proto._renderItemContent = function _renderItemContent(args) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return _CollectionWidget.prototype._renderItemContent.call(this, args);
  };
  _proto._createItemByTemplate = function _createItemByTemplate(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  itemTemplate,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  args) {
    const {
      itemData
    } = args;
    if (itemData.splitter) {
      return itemTemplate.source ? itemTemplate.source()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : (0, _renderer.default)();
    }
    return _CollectionWidget.prototype._createItemByTemplate.call(this, itemTemplate, args);
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  ;
  _proto._postprocessRenderItem = function _postprocessRenderItem(args) {
    const splitterConfig = args.itemData.splitter;
    if (!splitterConfig) {
      return;
    }
    this._createComponent((0, _renderer.default)(args.itemContent), Splitter, (0, _extend.extend)({
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
  };
  _proto._isHorizontalOrientation = function _isHorizontalOrientation() {
    return this.option('orientation') === ORIENTATION.horizontal;
  };
  _proto._toggleOrientationClass = function _toggleOrientationClass() {
    this.$element().toggleClass(HORIZONTAL_ORIENTATION_CLASS, this._isHorizontalOrientation());
    this.$element().toggleClass(VERTICAL_ORIENTATION_CLASS, !this._isHorizontalOrientation());
  };
  _proto._itemOptionChanged = function _itemOptionChanged(item, property, value) {
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
        _CollectionWidget.prototype._itemOptionChanged.call(this, item, property, value);
    }
  };
  _proto._getDefaultLayoutBasedOnSize = function _getDefaultLayoutBasedOnSize() {
    const {
      items,
      orientation,
      width,
      height
    } = this.option();
    const handlesSizeSum = this._getResizeHandlesSize();
    const elementSize = (0, _layout.getElementSize)(this.$element(), orientation, width, height, handlesSizeSum);
    this._itemRestrictions = [];
    items.forEach(item => {
      this._itemRestrictions.push({
        visible: item.visible,
        collapsed: item.collapsed === true,
        size: (0, _layout.convertSizeToRatio)(item.size, elementSize),
        maxSize: (0, _layout.convertSizeToRatio)(item.maxSize, elementSize),
        minSize: (0, _layout.convertSizeToRatio)(item.minSize, elementSize)
      });
    });
    const defaultLayout = (0, _layout.getDefaultLayout)(this._itemRestrictions);
    return (0, _layout.validateLayout)(defaultLayout, this._itemRestrictions);
  };
  _proto._applyFlexGrowFromLayout = function _applyFlexGrowFromLayout(layout) {
    this._iterateItems((index, itemElement) => {
      (0, _layout.setFlexProp)(itemElement, FLEX_PROPERTY.flexGrow, layout[index]);
    });
  };
  _proto._updatePaneSizesWithOuterWidth = function _updatePaneSizesWithOuterWidth() {
    this._iterateItems((index, itemElement) => {
      this._options.silent("items[".concat(index, "].size"), this._getItemDimension(itemElement));
    });
  };
  _proto._iterateItems = function _iterateItems(callback) {
    (0, _iterator.each)(this._itemElements(), (index, itemElement) => {
      callback(index, itemElement);
    });
  };
  _proto._getResizeHandleItems = function _getResizeHandleItems() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.$element().children(".".concat(_resize_handle.RESIZE_HANDLE_CLASS));
  };
  _proto._iterateResizeHandles = function _iterateResizeHandles(callback) {
    this._getResizeHandleItems().each((index, element) => {
      callback((0, _component.getComponentInstance)((0, _renderer.default)(element)));
      return true;
    });
  };
  _proto._optionChanged = function _optionChanged(args) {
    const {
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
        this[(0, _event.getActionNameByEventName)(name)] = this._createActionByOption(name);
        break;
      case 'separatorSize':
        this._updateResizeHandlesOption(name, value);
        break;
      default:
        _CollectionWidget.prototype._optionChanged.call(this, args);
    }
  };
  _proto.registerKeyHandler = function registerKeyHandler(key, handler) {
    this._iterateResizeHandles(instance => {
      instance.registerKeyHandler(key, handler);
    });
  };
  return Splitter;
}(_uiCollection_widget.default);
Splitter.ItemClass = SplitterItem;
// @ts-expect-error // temp fix
(0, _component_registrator.default)('dxSplitter', Splitter);
var _default = exports.default = Splitter;
