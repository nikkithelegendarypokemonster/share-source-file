/**
* DevExtreme (cjs/ui/file_manager/ui.file_manager.toolbar.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _common = require("../../core/utils/common");
var _message = _interopRequireDefault(require("../../localization/message"));
var _uiFile_manager = require("./ui.file_manager.common");
var _themes = require("../themes");
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _toolbar = _interopRequireDefault(require("../toolbar"));
require("../drop_down_button");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const FILE_MANAGER_TOOLBAR_CLASS = 'dx-filemanager-toolbar';
const FILE_MANAGER_GENERAL_TOOLBAR_CLASS = 'dx-filemanager-general-toolbar';
const FILE_MANAGER_FILE_TOOLBAR_CLASS = 'dx-filemanager-file-toolbar';
const FILE_MANAGER_TOOLBAR_SEPARATOR_ITEM_CLASS = FILE_MANAGER_TOOLBAR_CLASS + '-separator-item';
const FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS = FILE_MANAGER_TOOLBAR_CLASS + '-viewmode-item';
const FILE_MANAGER_TOOLBAR_HAS_LARGE_ICON_CLASS = FILE_MANAGER_TOOLBAR_CLASS + '-has-large-icon';
const FILE_MANAGER_VIEW_SWITCHER_POPUP_CLASS = 'dx-filemanager-view-switcher-popup';
const DEFAULT_ITEM_CONFIGS = {
  showNavPane: {
    location: 'before'
  },
  create: {
    location: 'before',
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto'
    }
  },
  upload: {
    location: 'before',
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto'
    }
  },
  refresh: {
    location: 'after',
    showText: 'inMenu',
    cssClass: FILE_MANAGER_TOOLBAR_HAS_LARGE_ICON_CLASS,
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto'
    }
  },
  switchView: {
    location: 'after'
  },
  download: {
    location: 'before',
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto'
    }
  },
  move: {
    location: 'before',
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto'
    }
  },
  copy: {
    location: 'before',
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto'
    }
  },
  rename: {
    location: 'before',
    compactMode: {
      showText: 'inMenu',
      locateInMenu: 'auto'
    }
  },
  delete: {
    location: 'before',
    compactMode: {
      showText: 'inMenu'
    }
  },
  clearSelection: {
    location: 'after',
    locateInMenu: 'never',
    compactMode: {
      showText: 'inMenu'
    }
  },
  separator: {
    location: 'before'
  }
};
const DEFAULT_ITEM_ALLOWED_PROPERTIES = ['visible', 'location', 'locateInMenu', 'disabled', 'showText'];
const DEFAULT_ITEM_ALLOWED_OPTION_PROPERTIES = ['accessKey', 'elementAttr', 'height', 'hint', 'icon', 'stylingMode', 'tabIndex', 'text', 'width'];
const ALWAYS_VISIBLE_TOOLBAR_ITEMS = ['separator', 'switchView'];
const REFRESH_ICON_MAP = {
  default: 'dx-filemanager-i dx-filemanager-i-refresh',
  progress: 'dx-filemanager-i dx-filemanager-i-progress',
  success: 'dx-filemanager-i dx-filemanager-i-done',
  error: 'dx-filemanager-i dx-filemanager-i-danger'
};
const REFRESH_ITEM_PROGRESS_MESSAGE_DELAY = 500;
let FileManagerToolbar = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(FileManagerToolbar, _Widget);
  function FileManagerToolbar() {
    return _Widget.apply(this, arguments) || this;
  }
  var _proto = FileManagerToolbar.prototype;
  _proto._init = function _init() {
    _Widget.prototype._init.call(this);
    this._generalToolbarVisible = true;
    this._refreshItemState = {
      message: '',
      status: 'default'
    };
  };
  _proto._initMarkup = function _initMarkup() {
    this._createItemClickedAction();
    this._$viewSwitcherPopup = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_VIEW_SWITCHER_POPUP_CLASS);
    this._generalToolbar = this._createToolbar(this.option('generalItems'), !this._generalToolbarVisible);
    this._fileToolbar = this._createToolbar(this.option('fileItems'), this._generalToolbarVisible);
    this._$viewSwitcherPopup.appendTo(this.$element());
    this.$element().addClass(FILE_MANAGER_TOOLBAR_CLASS + ' ' + FILE_MANAGER_GENERAL_TOOLBAR_CLASS);
  };
  _proto._render = function _render() {
    _Widget.prototype._render.call(this);
    const toolbar = this._getVisibleToolbar();
    this._checkCompactMode(toolbar);
  };
  _proto._clean = function _clean() {
    delete this._commandManager;
    delete this._itemClickedAction;
    delete this._$viewSwitcherPopup;
    delete this._generalToolbar;
    delete this._fileToolbar;
    _Widget.prototype._clean.call(this);
  };
  _proto._dimensionChanged = function _dimensionChanged(dimension) {
    if (!dimension || dimension !== 'height') {
      const toolbar = this._getVisibleToolbar();
      this._checkCompactMode(toolbar);
    }
  };
  _proto._getVisibleToolbar = function _getVisibleToolbar() {
    return this._generalToolbarVisible ? this._generalToolbar : this._fileToolbar;
  };
  _proto._createToolbar = function _createToolbar(items, hidden) {
    const toolbarItems = this._getPreparedItems(items);
    const $toolbar = (0, _renderer.default)('<div>').appendTo(this.$element());
    const result = this._createComponent($toolbar, _toolbar.default, {
      items: toolbarItems,
      visible: !hidden,
      onItemClick: args => this._raiseItemClicked(args)
    });
    result.compactMode = false;
    return result;
  };
  _proto._getPreparedItems = function _getPreparedItems(items) {
    items = items.map(item => {
      let extendedItem = item;
      if ((0, _type.isString)(item)) {
        extendedItem = {
          name: item
        };
      }
      const commandName = extendedItem.name;
      const preparedItem = this._configureItemByCommandName(commandName, extendedItem);
      preparedItem.originalItemData = item;
      if (commandName !== 'separator') {
        this._setItemVisibleAvailable(preparedItem);
      }
      return preparedItem;
    });
    this._updateSeparatorsVisibility(items);
    return items;
  };
  _proto._updateSeparatorsVisibility = function _updateSeparatorsVisibility(items, toolbar) {
    let hasModifications = false;
    const menuItems = this._getMenuItems(toolbar);
    const hasItemsBefore = {
      before: false,
      center: false,
      after: false
    };
    const itemGroups = {
      before: this._getItemsInGroup(items, menuItems, 'before'),
      center: this._getItemsInGroup(items, menuItems, 'center'),
      after: this._getItemsInGroup(items, menuItems, 'after')
    };
    items.forEach((item, i) => {
      const itemLocation = item.location;
      if (item.name === 'separator') {
        const isSeparatorVisible = hasItemsBefore[itemLocation] && this._groupHasItemsAfter(itemGroups[itemLocation]);
        if (item.visible !== isSeparatorVisible) {
          hasModifications = true;
          item.visible = isSeparatorVisible;
        }
        hasItemsBefore[itemLocation] = false;
      } else {
        if (!this._isItemInMenu(menuItems, item)) {
          hasItemsBefore[itemLocation] = hasItemsBefore[itemLocation] || item.visible;
        }
        itemGroups[itemLocation].shift();
      }
    });
    if (toolbar && hasModifications) {
      toolbar.repaint();
    }
    return hasModifications;
  };
  _proto._getMenuItems = function _getMenuItems(toolbar) {
    const result = toolbar ? toolbar._getMenuItems() : [];
    return result.map(menuItem => menuItem.originalItemData);
  };
  _proto._isItemInMenu = function _isItemInMenu(menuItems, item) {
    return !!menuItems.length && (0, _common.ensureDefined)(item.locateInMenu, 'never') !== 'never' && menuItems.indexOf(item.originalItemData) !== -1;
  };
  _proto._getItemsInGroup = function _getItemsInGroup(items, menuItems, groupName) {
    return items.filter(item => item.location === groupName && !this._isItemInMenu(menuItems, item));
  };
  _proto._groupHasItemsAfter = function _groupHasItemsAfter(items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].name !== 'separator' && items[i].visible) {
        return true;
      }
    }
    return false;
  };
  _proto._configureItemByCommandName = function _configureItemByCommandName(commandName, item) {
    var _result$options;
    let result = {};
    const command = this._commandManager.getCommandByName(commandName);
    if (command) {
      result = this._createCommandItem(command);
    }
    switch (commandName) {
      case 'separator':
        result = this._createSeparatorItem();
        break;
      case 'switchView':
        result = this._createViewModeItem();
        break;
    }
    if (this._isDefaultItem(commandName)) {
      const defaultConfig = DEFAULT_ITEM_CONFIGS[commandName];
      (0, _extend.extend)(true, result, defaultConfig);
      let resultCssClass = result.cssClass || '';
      (0, _uiFile_manager.extendAttributes)(result, item, DEFAULT_ITEM_ALLOWED_PROPERTIES);
      if ((0, _type.isDefined)(item.options)) {
        (0, _uiFile_manager.extendAttributes)(result.options, item.options, DEFAULT_ITEM_ALLOWED_OPTION_PROPERTIES);
      }
      (0, _uiFile_manager.extendAttributes)(result.options, item, ['text', 'icon']);
      if (item.cssClass) {
        resultCssClass = "".concat(resultCssClass, " ").concat(item.cssClass);
      }
      if (resultCssClass) {
        result.cssClass = resultCssClass;
      }
      if (!(0, _type.isDefined)(item.visible)) {
        result._autoHide = true;
      }
      if (result.widget === 'dxButton') {
        if (result.showText === 'inMenu' && !(0, _type.isDefined)(result.options.hint)) {
          result.options.hint = result.options.text;
        }
        if (result.compactMode && !(0, _type.isDefined)(result.options.hint)) {
          this._configureHintForCompactMode(result);
        }
      }
    } else {
      (0, _extend.extend)(true, result, item);
      if (!result.widget) {
        result.widget = 'dxButton';
      }
      if (result.widget === 'dxButton' && !result.compactMode && !result.showText && result.options && result.options.icon && result.options.text) {
        result.compactMode = {
          showText: 'inMenu'
        };
      }
    }
    if (commandName && !result.name) {
      (0, _extend.extend)(result, {
        name: commandName
      });
    }
    result.location = (0, _common.ensureDefined)(result.location, 'before');
    if (!(0, _type.isDefined)((_result$options = result.options) === null || _result$options === void 0 ? void 0 : _result$options.stylingMode)) {
      if (result.widget === 'dxButton') {
        (0, _extend.extend)(true, result, {
          options: {
            stylingMode: 'text'
          }
        });
      }
      if (result.widget === 'dxSelectBox') {
        (0, _extend.extend)(true, result, {
          options: {
            stylingMode: 'filled'
          }
        });
      }
    }
    return result;
  };
  _proto._isDefaultItem = function _isDefaultItem(commandName) {
    return !!DEFAULT_ITEM_CONFIGS[commandName];
  };
  _proto._createCommandItem = function _createCommandItem(command) {
    return {
      widget: 'dxButton',
      options: {
        text: command.text,
        hint: command.hint,
        commandText: command.text,
        icon: command.icon,
        stylingMode: 'text',
        onClick: e => this._executeCommand(command)
      }
    };
  };
  _proto._createSeparatorItem = function _createSeparatorItem() {
    return {
      template: (data, index, element) => {
        (0, _renderer.default)(element).addClass(FILE_MANAGER_TOOLBAR_SEPARATOR_ITEM_CLASS);
      }
    };
  };
  _proto._createViewModeItem = function _createViewModeItem() {
    const commandItems = ['details', 'thumbnails'].map(name => {
      const {
        text,
        icon
      } = this._commandManager.getCommandByName(name);
      return {
        name,
        text,
        icon
      };
    });
    const selectedIndex = this.option('itemViewMode') === 'thumbnails' ? 1 : 0;
    const dropDownOptions = {
      container: this._$viewSwitcherPopup
    };
    if ((0, _themes.isMaterial)()) {
      dropDownOptions.width = (0, _themes.isCompact)() ? 28 : 36;
    } else if ((0, _themes.isFluent)()) {
      dropDownOptions.width = (0, _themes.isCompact)() ? 34 : 40;
    }
    return {
      cssClass: FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS,
      widget: 'dxDropDownButton',
      options: {
        items: commandItems,
        keyExpr: 'name',
        selectedItemKey: this.option('itemViewMode'),
        displayExpr: ' ',
        hint: commandItems[selectedIndex].text,
        stylingMode: 'text',
        showArrowIcon: false,
        useSelectMode: true,
        dropDownOptions,
        onItemClick: e => this._executeCommand(e.itemData.name)
      }
    };
  };
  _proto._configureHintForCompactMode = function _configureHintForCompactMode(item) {
    item.options.hint = '';
    item.compactMode.options = item.compactMode.options || {};
    item.compactMode.options.hint = item.options.text;
  };
  _proto._checkCompactMode = function _checkCompactMode(toolbar) {
    if (toolbar.compactMode) {
      this._toggleCompactMode(toolbar, false);
    }
    const useCompactMode = this._toolbarHasItemsOverflow(toolbar);
    if (toolbar.compactMode !== useCompactMode) {
      if (!toolbar.compactMode) {
        this._toggleCompactMode(toolbar, useCompactMode);
      }
      toolbar.compactMode = useCompactMode;
    } else if (toolbar.compactMode) {
      this._toggleCompactMode(toolbar, true);
    }
  };
  _proto._toolbarHasItemsOverflow = function _toolbarHasItemsOverflow(toolbar) {
    const toolbarWidth = (0, _size.getWidth)(toolbar.$element());
    const itemsWidth = toolbar._getItemsWidth();
    return toolbarWidth < itemsWidth;
  };
  _proto._toggleCompactMode = function _toggleCompactMode(toolbar, useCompactMode) {
    let hasModifications = false;
    const items = toolbar.option('items');
    items.forEach(item => {
      if (item.compactMode) {
        let optionsSource = null;
        if (useCompactMode) {
          item.saved = this._getCompactModeOptions(item, item._available);
          optionsSource = item.compactMode;
        } else {
          optionsSource = item.saved;
        }
        const options = this._getCompactModeOptions(optionsSource, item._available);
        (0, _extend.extend)(true, item, options);
        hasModifications = true;
      }
    });
    hasModifications = this._updateSeparatorsVisibility(items) || hasModifications;
    if (hasModifications) {
      toolbar.repaint();
    }
    this._updateSeparatorsVisibility(items, toolbar);
  };
  _proto._getCompactModeOptions = function _getCompactModeOptions(_ref, available) {
    let {
      showText,
      locateInMenu,
      options
    } = _ref;
    return {
      visible: available,
      showText: (0, _common.ensureDefined)(showText, 'always'),
      locateInMenu: (0, _common.ensureDefined)(locateInMenu, 'never'),
      options: {
        hint: options === null || options === void 0 ? void 0 : options.hint
      }
    };
  };
  _proto._ensureAvailableCommandsVisible = function _ensureAvailableCommandsVisible(toolbar) {
    let hasModifications = false;
    const items = toolbar.option('items');
    items.forEach(item => {
      if (item.name !== 'separator') {
        const itemVisible = item._available;
        this._setItemVisibleAvailable(item);
        if (item._available !== itemVisible) {
          hasModifications = true;
        }
      }
    });
    hasModifications = this._updateSeparatorsVisibility(items) || hasModifications;
    if (hasModifications) {
      toolbar.repaint();
    }
    this._updateSeparatorsVisibility(items, toolbar);
  };
  _proto._setItemVisibleAvailable = function _setItemVisibleAvailable(item) {
    var _item$originalItemDat;
    const originalVisible = (_item$originalItemDat = item.originalItemData) === null || _item$originalItemDat === void 0 ? void 0 : _item$originalItemDat.visible;
    item._available = this._isToolbarItemAvailable(item);
    item.visible = (0, _type.isDefined)(originalVisible) ? originalVisible : item._available;
  };
  _proto._fileToolbarHasEffectiveItems = function _fileToolbarHasEffectiveItems() {
    const items = this._fileToolbar.option('items');
    return items.some(item => this._isFileToolbarItemAvailable(item));
  };
  _proto._executeCommand = function _executeCommand(command) {
    this._commandManager.executeCommand(command);
  };
  _proto._isToolbarItemAvailable = function _isToolbarItemAvailable(toolbarItem) {
    if (!this._isDefaultItem(toolbarItem.name) || !toolbarItem._autoHide) {
      return (0, _common.ensureDefined)(toolbarItem.visible, true);
    }
    if (toolbarItem.name === 'refresh') {
      return this._generalToolbarVisible || !!this._isRefreshVisibleInFileToolbar;
    }
    if (ALWAYS_VISIBLE_TOOLBAR_ITEMS.indexOf(toolbarItem.name) > -1) {
      return true;
    }
    return this._isCommandAvailable(toolbarItem.name);
  };
  _proto._isFileToolbarItemAvailable = function _isFileToolbarItemAvailable(_ref2) {
    let {
      name,
      visible
    } = _ref2;
    return !this._isDefaultItem(name) && (0, _common.ensureDefined)(visible, true) || name !== 'clearSelection' && name !== 'refresh' && this._isCommandAvailable(name);
  };
  _proto._isCommandAvailable = function _isCommandAvailable(name) {
    return this._commandManager.isCommandAvailable(name, this.option('contextItems'));
  };
  _proto._updateItemInToolbar = function _updateItemInToolbar(toolbar, commandName, options) {
    toolbar.beginUpdate();
    const items = toolbar.option('items');
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.name === commandName) {
        toolbar.option("items[".concat(i, "]"), options);
        break;
      }
    }
    toolbar.endUpdate();
  };
  _proto._raiseItemClicked = function _raiseItemClicked(args) {
    const changedArgs = (0, _extend.extend)(true, {}, args);
    changedArgs.itemData = args.itemData.originalItemData;
    this._itemClickedAction(changedArgs);
  };
  _proto._createItemClickedAction = function _createItemClickedAction() {
    this._itemClickedAction = this._createActionByOption('onItemClick');
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      commandManager: null,
      generalItems: [],
      fileItems: [],
      contextItems: [],
      itemViewMode: 'details',
      onItemClick: null
    });
  };
  _proto._optionChanged = function _optionChanged(args) {
    const name = args.name;
    switch (name) {
      case 'commandManager':
      case 'itemViewMode':
      case 'generalItems':
      case 'fileItems':
        this.repaint();
        break;
      case 'contextItems':
        this._update();
        break;
      case 'onItemClick':
        this._itemClickedAction = this._createActionByOption(name);
        break;
      default:
        _Widget.prototype._optionChanged.call(this, args);
    }
  };
  _proto.updateItemPermissions = function updateItemPermissions() {
    this.repaint();
    this._restoreRefreshItemState();
  };
  _proto._restoreRefreshItemState = function _restoreRefreshItemState() {
    this.updateRefreshItem(this._refreshItemState.message, this._refreshItemState.status);
  };
  _proto.updateRefreshItem = function updateRefreshItem(message, status) {
    let generalToolbarOptions = null;
    let text = _message.default.format('dxFileManager-commandRefresh');
    let showText = 'inMenu';
    this._isRefreshVisibleInFileToolbar = false;
    this._refreshItemState = {
      message,
      status
    };
    if (status === 'default') {
      generalToolbarOptions = {
        options: {
          icon: REFRESH_ICON_MAP.default
        }
      };
    } else {
      generalToolbarOptions = {
        options: {
          icon: REFRESH_ICON_MAP[status]
        }
      };
      this._isRefreshVisibleInFileToolbar = true;
      text = message;
      showText = 'always';
    }
    const fileToolbarOptions = (0, _extend.extend)({}, generalToolbarOptions, {
      visible: this._isRefreshVisibleInFileToolbar
    });
    this._applyRefreshItemOptions(generalToolbarOptions, fileToolbarOptions);
    this._refreshItemTextTimeout = this._updateRefreshItemText(status === 'progress', text, showText);
  };
  _proto._updateRefreshItemText = function _updateRefreshItemText(isDeferredUpdate, text, showText) {
    const options = {
      showText,
      options: {
        text
      }
    };
    if (isDeferredUpdate) {
      return setTimeout(() => {
        this._applyRefreshItemOptions(options);
        this._refreshItemTextTimeout = undefined;
      }, REFRESH_ITEM_PROGRESS_MESSAGE_DELAY);
    } else {
      if (this._refreshItemTextTimeout) {
        clearTimeout(this._refreshItemTextTimeout);
      }
      this._applyRefreshItemOptions(options);
      return undefined;
    }
  };
  _proto._applyRefreshItemOptions = function _applyRefreshItemOptions(generalToolbarOptions, fileToolbarOptions) {
    if (!fileToolbarOptions) {
      fileToolbarOptions = (0, _extend.extend)({}, generalToolbarOptions);
    }
    this._updateItemInToolbar(this._generalToolbar, 'refresh', generalToolbarOptions);
    this._updateItemInToolbar(this._fileToolbar, 'refresh', fileToolbarOptions);
  };
  _proto._update = function _update() {
    const showGeneralToolbar = this.option('contextItems').length === 0 || !this._fileToolbarHasEffectiveItems();
    if (this._generalToolbarVisible !== showGeneralToolbar) {
      this._generalToolbar.option('visible', showGeneralToolbar);
      this._fileToolbar.option('visible', !showGeneralToolbar);
      this._generalToolbarVisible = showGeneralToolbar;
      this.$element().toggleClass(FILE_MANAGER_GENERAL_TOOLBAR_CLASS, showGeneralToolbar);
      this.$element().toggleClass(FILE_MANAGER_FILE_TOOLBAR_CLASS, !showGeneralToolbar);
    }
    const toolbar = this._getVisibleToolbar();
    this._ensureAvailableCommandsVisible(toolbar);
    this._checkCompactMode(toolbar);
  };
  _createClass(FileManagerToolbar, [{
    key: "_commandManager",
    get: function () {
      return this.option('commandManager');
    }
  }]);
  return FileManagerToolbar;
}(_ui.default);
var _default = exports.default = FileManagerToolbar;
module.exports = exports.default;
module.exports.default = exports.default;
