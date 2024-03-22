"use strict";

exports.default = void 0;
var _extend = require("../../core/utils/extend");
var _deferred = require("../../core/utils/deferred");
var _window = require("../../core/utils/window");
var _double_click = require("../../events/double_click");
var _index = require("../../events/utils/index");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _icon = require("../../core/utils/icon");
var _devices = _interopRequireDefault(require("../../core/devices"));
var _custom_store = _interopRequireDefault(require("../../data/custom_store"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const FILE_MANAGER_FILES_VIEW_CLASS = 'dx-filemanager-files-view';
const FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE = 'dxFileManager_open';
let FileManagerItemListBase = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(FileManagerItemListBase, _Widget);
  function FileManagerItemListBase() {
    return _Widget.apply(this, arguments) || this;
  }
  var _proto = FileManagerItemListBase.prototype;
  _proto._init = function _init() {
    this._initActions();
    this._lockFocusedItemProcessing = false;
    this._focusedItemKey = this.option('focusedItemKey');
    _Widget.prototype._init.call(this);
  };
  _proto._initMarkup = function _initMarkup() {
    this._needResetScrollPosition = false;
    this.$element().addClass(FILE_MANAGER_FILES_VIEW_CLASS);
    const dblClickEventName = (0, _index.addNamespace)(_double_click.name, FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE);
    _events_engine.default.on(this.$element(), dblClickEventName, this._getItemSelector(), this._onItemDblClick.bind(this));
    _Widget.prototype._initMarkup.call(this);
  };
  _proto._initActions = function _initActions() {
    this._actions = {
      onError: this._createActionByOption('onError'),
      onSelectionChanged: this._createActionByOption('onSelectionChanged'),
      onFocusedItemChanged: this._createActionByOption('onFocusedItemChanged'),
      onSelectedItemOpened: this._createActionByOption('onSelectedItemOpened'),
      onContextMenuShowing: this._createActionByOption('onContextMenuShowing'),
      onItemListDataLoaded: this._createActionByOption('onItemListDataLoaded')
    };
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      selectionMode: 'single',
      selectedItemKeys: [],
      focusedItemKey: undefined,
      contextMenu: null,
      getItems: null,
      getItemThumbnail: null,
      onError: null,
      onSelectionChanged: null,
      onFocusedItemChanged: null,
      onSelectedItemOpened: null,
      onContextMenuShowing: null
    });
  };
  _proto._optionChanged = function _optionChanged(args) {
    const name = args.name;
    switch (name) {
      case 'selectionMode':
      case 'contextMenu':
      case 'getItems':
      case 'getItemThumbnail':
        this.repaint();
        break;
      case 'selectedItemKeys':
        this._setSelectedItemKeys(args.value);
        break;
      case 'focusedItemKey':
        if (!this._lockFocusedItemProcessing) {
          this._setFocusedItemKey(args.value);
        }
        break;
      case 'onError':
      case 'onSelectedItemOpened':
      case 'onSelectionChanged':
      case 'onFocusedItemChanged':
      case 'onContextMenuShowing':
      case 'onItemListDataLoaded':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        _Widget.prototype._optionChanged.call(this, args);
    }
  };
  _proto._getItems = function _getItems() {
    return this._getItemsInternal().done(itemInfos => {
      this._itemCount = itemInfos.length;
      if (this._itemCount === 0) {
        this._resetFocus();
      }
      const parentDirectoryItem = this._findParentDirectoryItem(itemInfos);
      this._hasParentDirectoryItem = !!parentDirectoryItem;
      this._parentDirectoryItemKey = parentDirectoryItem ? parentDirectoryItem.fileItem.key : null;
    }).always(() => {
      this._onDataLoaded();
    });
  };
  _proto._getItemsInternal = function _getItemsInternal() {
    const itemsGetter = this.option('getItems');
    const itemsResult = itemsGetter ? itemsGetter() : [];
    return (0, _deferred.when)(itemsResult);
  };
  _proto._raiseOnError = function _raiseOnError(error) {
    this._actions.onError({
      error
    });
  };
  _proto._raiseSelectionChanged = function _raiseSelectionChanged(args) {
    this._actions.onSelectionChanged(args);
  };
  _proto._raiseFocusedItemChanged = function _raiseFocusedItemChanged(args) {
    this._actions.onFocusedItemChanged(args);
  };
  _proto._raiseSelectedItemOpened = function _raiseSelectedItemOpened(fileItemInfo) {
    this._actions.onSelectedItemOpened({
      fileItemInfo
    });
  };
  _proto._raiseContextMenuShowing = function _raiseContextMenuShowing(e) {
    this._actions.onContextMenuShowing(e);
  };
  _proto._raiseItemListDataLoaded = function _raiseItemListDataLoaded() {
    this._actions.onItemListDataLoaded();
  };
  _proto._onDataLoaded = function _onDataLoaded() {
    var _this$_refreshDeferre;
    this._raiseItemListDataLoaded();
    (_this$_refreshDeferre = this._refreshDeferred) === null || _this$_refreshDeferre === void 0 ? void 0 : _this$_refreshDeferre.resolve();
  };
  _proto._onContentReady = function _onContentReady() {
    if (this._needResetScrollPosition) {
      this._resetScrollTopPosition();
      this._needResetScrollPosition = false;
    }
  };
  _proto._tryRaiseSelectionChanged = function _tryRaiseSelectionChanged(_ref) {
    let {
      selectedItemInfos,
      selectedItems,
      selectedItemKeys,
      currentSelectedItemKeys,
      currentDeselectedItemKeys
    } = _ref;
    const parentDirectoryItem = this._findParentDirectoryItem(this.getSelectedItems());
    if (parentDirectoryItem) {
      this._deselectItem(parentDirectoryItem);
    }
    let raiseEvent = !this._hasParentDirectoryItem;
    raiseEvent = raiseEvent || this._hasValidKeys(currentSelectedItemKeys) || this._hasValidKeys(currentDeselectedItemKeys);
    if (raiseEvent) {
      selectedItemInfos = this._filterOutItemByPredicate(selectedItemInfos, item => item.fileItem.key === this._parentDirectoryItemKey);
      selectedItems = this._filterOutParentDirectory(selectedItems);
      selectedItemKeys = this._filterOutParentDirectoryKey(selectedItemKeys, true);
      currentSelectedItemKeys = this._filterOutParentDirectoryKey(currentSelectedItemKeys, true);
      currentDeselectedItemKeys = this._filterOutParentDirectoryKey(currentDeselectedItemKeys, true);
      this._raiseSelectionChanged({
        selectedItemInfos,
        selectedItems,
        selectedItemKeys,
        currentSelectedItemKeys,
        currentDeselectedItemKeys
      });
    }
  };
  _proto._onFocusedItemChanged = function _onFocusedItemChanged(args) {
    if (this._focusedItemKey === args.itemKey) {
      return;
    }
    this._focusedItemKey = args.itemKey;
    this._lockFocusedItemProcessing = true;
    this.option('focusedItemKey', args.itemKey);
    this._lockFocusedItemProcessing = false;
    this._raiseFocusedItemChanged(args);
  };
  _proto._resetFocus = function _resetFocus() {};
  _proto._resetScrollTopPosition = function _resetScrollTopPosition() {
    if (!(0, _window.hasWindow)()) {
      return;
    }
    setTimeout(() => {
      var _this$_getScrollable;
      return (_this$_getScrollable = this._getScrollable()) === null || _this$_getScrollable === void 0 ? void 0 : _this$_getScrollable.scrollTo(0);
    });
  };
  _proto._getScrollable = function _getScrollable() {};
  _proto._getItemThumbnail = function _getItemThumbnail(fileInfo) {
    const itemThumbnailGetter = this.option('getItemThumbnail');
    return itemThumbnailGetter ? itemThumbnailGetter(fileInfo) : {
      thumbnail: ''
    };
  };
  _proto._getItemThumbnailContainer = function _getItemThumbnailContainer(fileInfo) {
    const {
      thumbnail,
      cssClass
    } = this._getItemThumbnail(fileInfo);
    const $itemThumbnail = (0, _icon.getImageContainer)(thumbnail).addClass(this._getItemThumbnailCssClass());
    if (cssClass) {
      $itemThumbnail.addClass(cssClass);
    }
    return $itemThumbnail;
  };
  _proto._getItemThumbnailCssClass = function _getItemThumbnailCssClass() {
    return '';
  };
  _proto._getItemSelector = function _getItemSelector() {};
  _proto._onItemDblClick = function _onItemDblClick(e) {};
  _proto._isDesktop = function _isDesktop() {
    return _devices.default.real().deviceType === 'desktop';
  };
  _proto._showContextMenu = function _showContextMenu(items, element, event, target) {
    this._contextMenu.showAt(items, element, event, target);
  };
  _proto._findParentDirectoryItem = function _findParentDirectoryItem(itemInfos) {
    for (let i = 0; i < itemInfos.length; i++) {
      const itemInfo = itemInfos[i];
      if (this._isParentDirectoryItem(itemInfo)) {
        return itemInfo;
      }
    }
    return null;
  };
  _proto._getFileItemsForContextMenu = function _getFileItemsForContextMenu(fileItem) {
    const result = this.getSelectedItems();
    if (this._isParentDirectoryItem(fileItem)) {
      result.push(fileItem);
    }
    return result;
  };
  _proto._isParentDirectoryItem = function _isParentDirectoryItem(itemInfo) {
    return itemInfo.fileItem.isParentFolder;
  };
  _proto._hasValidKeys = function _hasValidKeys(keys) {
    return keys.length > 1 || keys.length === 1 && keys[0] !== this._parentDirectoryItemKey;
  };
  _proto._filterOutParentDirectory = function _filterOutParentDirectory(array, createNewArray) {
    return this._filterOutItemByPredicate(array, item => item.key === this._parentDirectoryItemKey, createNewArray);
  };
  _proto._filterOutParentDirectoryKey = function _filterOutParentDirectoryKey(array, createNewArray) {
    return this._filterOutItemByPredicate(array, key => key === this._parentDirectoryItemKey, createNewArray);
  };
  _proto._filterOutItemByPredicate = function _filterOutItemByPredicate(array, predicate, createNewArray) {
    let result = array;
    let index = -1;
    for (let i = 0; i < array.length; i++) {
      if (predicate(array[i])) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      if (createNewArray) {
        result = [...array];
      }
      result.splice(index, 1);
    }
    return result;
  };
  _proto._isMultipleSelectionMode = function _isMultipleSelectionMode() {
    return this.option('selectionMode') === 'multiple';
  };
  _proto._deselectItem = function _deselectItem(item) {};
  _proto._setSelectedItemKeys = function _setSelectedItemKeys(itemKeys) {};
  _proto._setFocusedItemKey = function _setFocusedItemKey(itemKey) {};
  _proto._createDataSource = function _createDataSource() {
    return {
      store: new _custom_store.default({
        key: 'fileItem.key',
        load: this._getItems.bind(this)
      })
    };
  };
  _proto.getSelectedItems = function getSelectedItems() {};
  _proto.clearSelection = function clearSelection() {};
  _proto.selectItem = function selectItem() {};
  _proto.refresh = function refresh(options, operation) {};
  _createClass(FileManagerItemListBase, [{
    key: "_contextMenu",
    get: function () {
      return this.option('contextMenu');
    }
  }]);
  return FileManagerItemListBase;
}(_ui.default);
var _default = exports.default = FileManagerItemListBase;
module.exports = exports.default;
module.exports.default = exports.default;