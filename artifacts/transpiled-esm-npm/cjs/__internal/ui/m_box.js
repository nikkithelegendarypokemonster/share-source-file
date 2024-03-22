"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _inflector = require("../../core/utils/inflector");
var _iterator = require("../../core/utils/iterator");
var _style = require("../../core/utils/style");
var _type = require("../../core/utils/type");
var _window = require("../../core/utils/window");
var _uiCollection_widget = _interopRequireDefault(require("../../ui/collection/ui.collection_widget.edit"));
var _item = _interopRequireDefault(require("../../ui/collection/item"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } // eslint-disable-next-line max-classes-per-file
const BOX_CLASS = 'dx-box';
const BOX_FLEX_CLASS = 'dx-box-flex';
const BOX_ITEM_CLASS = 'dx-box-item';
const BOX_ITEM_DATA_KEY = 'dxBoxItemData';
const SHRINK = 1;
const MINSIZE_MAP = {
  row: 'minWidth',
  col: 'minHeight'
};
const MAXSIZE_MAP = {
  row: 'maxWidth',
  col: 'maxHeight'
};
const FLEX_JUSTIFY_CONTENT_MAP = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  'space-between': 'space-between',
  'space-around': 'space-around'
};
const FLEX_ALIGN_ITEMS_MAP = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch'
};
const FLEX_DIRECTION_MAP = {
  row: 'row',
  col: 'column'
};
const setFlexProp = (element, prop, value) => {
  // NOTE: workaround for jQuery version < 1.11.1 (T181692)
  value = (0, _style.normalizeStyleProp)(prop, value);
  element.style[(0, _style.styleProp)(prop)] = value;
  // NOTE: workaround for Domino issue https://github.com/fgnass/domino/issues/119
  if (!(0, _window.hasWindow)()) {
    if (value === '' || !(0, _type.isDefined)(value)) {
      return;
    }
    const cssName = (0, _inflector.dasherize)(prop);
    const styleExpr = "".concat(cssName, ": ").concat(value, ";");
    (0, _style.setStyle)(element, styleExpr, false);
  }
};
let BoxItem = /*#__PURE__*/function (_CollectionWidgetItem) {
  _inheritsLoose(BoxItem, _CollectionWidgetItem);
  function BoxItem() {
    return _CollectionWidgetItem.apply(this, arguments) || this;
  }
  var _proto = BoxItem.prototype;
  _proto._renderVisible = function _renderVisible(value, oldValue) {
    // @ts-expect-error
    _CollectionWidgetItem.prototype._renderVisible.call(this, value);
    if ((0, _type.isDefined)(oldValue)) {
      // @ts-expect-error
      this._options.fireItemStateChangedAction({
        name: 'visible',
        state: value,
        oldState: oldValue
      });
    }
  };
  return BoxItem;
}(_item.default);
let LayoutStrategy = /*#__PURE__*/function () {
  function LayoutStrategy($element, option) {
    this._$element = $element;
    this._option = option;
  }
  var _proto2 = LayoutStrategy.prototype;
  _proto2.renderBox = function renderBox() {
    this._$element.css({
      display: "".concat((0, _style.stylePropPrefix)('flexDirection'), "flex")
    });
    setFlexProp(this._$element.get(0), 'flexDirection', FLEX_DIRECTION_MAP[this._option('direction')]);
  };
  _proto2.renderAlign = function renderAlign() {
    this._$element.css({
      justifyContent: this._normalizedAlign()
    });
  };
  _proto2._normalizedAlign = function _normalizedAlign() {
    const align = this._option('align');
    return align in FLEX_JUSTIFY_CONTENT_MAP ? FLEX_JUSTIFY_CONTENT_MAP[align] : align;
  };
  _proto2.renderCrossAlign = function renderCrossAlign() {
    this._$element.css({
      alignItems: this._normalizedCrossAlign()
    });
  };
  _proto2._normalizedCrossAlign = function _normalizedCrossAlign() {
    const crossAlign = this._option('crossAlign');
    return crossAlign in FLEX_ALIGN_ITEMS_MAP ? FLEX_ALIGN_ITEMS_MAP[crossAlign] : crossAlign;
  };
  _proto2.renderItems = function renderItems($items) {
    const flexPropPrefix = (0, _style.stylePropPrefix)('flexDirection');
    const direction = this._option('direction');
    (0, _iterator.each)($items, function () {
      const $item = (0, _renderer.default)(this);
      const item = $item.data(BOX_ITEM_DATA_KEY);
      // @ts-expect-error
      $item.css({
        display: "".concat(flexPropPrefix, "flex")
      }).css(MAXSIZE_MAP[direction], item.maxSize || 'none').css(MINSIZE_MAP[direction], item.minSize || '0');
      setFlexProp($item.get(0), 'flexBasis', item.baseSize || 0);
      setFlexProp($item.get(0), 'flexGrow', item.ratio);
      setFlexProp($item.get(0), 'flexShrink', (0, _type.isDefined)(item.shrink) ? item.shrink : SHRINK);
      // @ts-expect-error
      $item.children().each((_, itemContent) => {
        // @ts-expect-error
        (0, _renderer.default)(itemContent).css({
          width: 'auto',
          height: 'auto',
          display: "".concat((0, _style.stylePropPrefix)('flexDirection'), "flex"),
          flexBasis: 0
        });
        setFlexProp(itemContent, 'flexGrow', 1);
        setFlexProp(itemContent, 'flexDirection', (0, _renderer.default)(itemContent)[0].style.flexDirection || 'column');
      });
    });
  };
  return LayoutStrategy;
}();
let Box = /*#__PURE__*/function (_CollectionWidget) {
  _inheritsLoose(Box, _CollectionWidget);
  function Box() {
    return _CollectionWidget.apply(this, arguments) || this;
  }
  var _proto3 = Box.prototype;
  _proto3._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_CollectionWidget.prototype._getDefaultOptions.call(this), {
      direction: 'row',
      align: 'start',
      crossAlign: 'stretch',
      activeStateEnabled: false,
      focusStateEnabled: false,
      onItemStateChanged: undefined,
      _queue: undefined
    });
  };
  _proto3._itemClass = function _itemClass() {
    return BOX_ITEM_CLASS;
  };
  _proto3._itemDataKey = function _itemDataKey() {
    return BOX_ITEM_DATA_KEY;
  };
  _proto3._itemElements = function _itemElements() {
    // @ts-expect-error
    return this._itemContainer().children(this._itemSelector());
  };
  _proto3._init = function _init() {
    _CollectionWidget.prototype._init.call(this);
    // @ts-expect-error
    this.$element().addClass(BOX_FLEX_CLASS);
    this._initLayout();
    this._initBoxQueue();
  };
  _proto3._initLayout = function _initLayout() {
    // @ts-expect-error
    this._layout = new LayoutStrategy(this.$element(), this.option.bind(this));
  };
  _proto3._initBoxQueue = function _initBoxQueue() {
    // @ts-expect-error
    this._queue = this.option('_queue') || [];
  };
  _proto3._queueIsNotEmpty = function _queueIsNotEmpty() {
    // @ts-expect-error
    return this.option('_queue') ? false : !!this._queue.length;
  };
  _proto3._pushItemToQueue = function _pushItemToQueue($item, config) {
    this._queue.push({
      $item,
      config
    });
  };
  _proto3._shiftItemFromQueue = function _shiftItemFromQueue() {
    return this._queue.shift();
  };
  _proto3._initMarkup = function _initMarkup() {
    // @ts-expect-error
    this.$element().addClass(BOX_CLASS);
    this._layout.renderBox();
    _CollectionWidget.prototype._initMarkup.call(this);
    this._renderAlign();
    this._renderActions();
  };
  _proto3._renderActions = function _renderActions() {
    // @ts-expect-error
    this._onItemStateChanged = this._createActionByOption('onItemStateChanged');
  };
  _proto3._renderAlign = function _renderAlign() {
    this._layout.renderAlign();
    this._layout.renderCrossAlign();
  };
  _proto3._renderItems = function _renderItems(items) {
    _CollectionWidget.prototype._renderItems.call(this, items);
    while (this._queueIsNotEmpty()) {
      const item = this._shiftItemFromQueue();
      // @ts-expect-error
      this._createComponent(item.$item, Box, (0, _extend.extend)({
        // @ts-expect-error
        itemTemplate: this.option('itemTemplate'),
        // @ts-expect-error
        itemHoldTimeout: this.option('itemHoldTimeout'),
        // @ts-expect-error
        onItemHold: this.option('onItemHold'),
        // @ts-expect-error
        onItemClick: this.option('onItemClick'),
        // @ts-expect-error
        onItemContextMenu: this.option('onItemContextMenu'),
        // @ts-expect-error
        onItemRendered: this.option('onItemRendered'),
        _queue: this._queue
      }, item.config));
    }
    this._layout.renderItems(this._itemElements());
  };
  _proto3._renderItemContent = function _renderItemContent(args) {
    const $itemNode = args.itemData && args.itemData.node;
    if ($itemNode) {
      // @ts-expect-error
      return this._renderItemContentByNode(args, $itemNode);
    }
    return _CollectionWidget.prototype._renderItemContent.call(this, args);
  };
  _proto3._postprocessRenderItem = function _postprocessRenderItem(args) {
    const boxConfig = args.itemData.box;
    if (!boxConfig) {
      return;
    }
    this._pushItemToQueue(args.itemContent, boxConfig);
  };
  _proto3._createItemByTemplate = function _createItemByTemplate(itemTemplate, args) {
    if (args.itemData.box) {
      // @ts-expect-error
      return itemTemplate.source ? itemTemplate.source() : (0, _renderer.default)();
    }
    return _CollectionWidget.prototype._createItemByTemplate.call(this, itemTemplate, args);
  };
  _proto3._itemOptionChanged = function _itemOptionChanged(item, property, value, oldValue) {
    if (property === 'visible') {
      // @ts-expect-error
      this._onItemStateChanged({
        name: property,
        state: value,
        oldState: oldValue !== false
      });
    }
    _CollectionWidget.prototype._itemOptionChanged.call(this, item, property, value);
  };
  _proto3._optionChanged = function _optionChanged(args) {
    switch (args.name) {
      case '_queue':
      case 'direction':
        // @ts-expect-error
        this._invalidate();
        break;
      case 'align':
        this._layout.renderAlign();
        break;
      case 'crossAlign':
        this._layout.renderCrossAlign();
        break;
      default:
        _CollectionWidget.prototype._optionChanged.call(this, args);
    }
  };
  _proto3._itemOptions = function _itemOptions() {
    const options = _CollectionWidget.prototype._itemOptions.call(this);
    options.fireItemStateChangedAction = e => {
      // @ts-expect-error
      this._onItemStateChanged(e);
    };
    return options;
  };
  return Box;
}(_uiCollection_widget.default); // @ts-expect-error
Box.ItemClass = BoxItem;
// @ts-expect-error
(0, _component_registrator.default)('dxBox', Box);
var _default = exports.default = Box;