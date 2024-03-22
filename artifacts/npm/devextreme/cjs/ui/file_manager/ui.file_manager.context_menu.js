/**
* DevExtreme (cjs/ui/file_manager/ui.file_manager.context_menu.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _common = require("../../core/utils/common");
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _ui2 = _interopRequireDefault(require("../context_menu/ui.context_menu"));
var _uiFile_manager = require("./ui.file_manager.common");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const FILEMANAGER_CONTEXT_MEMU_CLASS = 'dx-filemanager-context-menu';
const DEFAULT_CONTEXT_MENU_ITEMS = {
  create: {},
  upload: {},
  download: {},
  rename: {},
  move: {},
  copy: {},
  delete: {},
  refresh: {
    beginGroup: true
  }
};
const DEFAULT_ITEM_ALLOWED_PROPERTIES = ['beginGroup', 'closeMenuOnClick', 'disabled', 'icon', 'selectable', 'selected', 'text', 'visible'];
let FileManagerContextMenu = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(FileManagerContextMenu, _Widget);
  function FileManagerContextMenu() {
    return _Widget.apply(this, arguments) || this;
  }
  var _proto = FileManagerContextMenu.prototype;
  _proto._initMarkup = function _initMarkup() {
    this._initActions();
    this._isVisible = false;
    const $menu = (0, _renderer.default)('<div>').appendTo(this.$element());
    this._contextMenu = this._createComponent($menu, _ui2.default, {
      cssClass: FILEMANAGER_CONTEXT_MEMU_CLASS,
      showEvent: '',
      onItemClick: args => this._onContextMenuItemClick(args.itemData.name, args),
      onShowing: e => this._onContextMenuShowing(e),
      onShown: () => this._onContextMenuShown(),
      onHidden: () => this._onContextMenuHidden()
    });
    _Widget.prototype._initMarkup.call(this);
  };
  _proto.showAt = function showAt(fileItems, element, event, target) {
    const {
      itemData,
      itemElement,
      isActionButton = false
    } = target;
    if (this._isVisible) {
      this._onContextMenuHidden();
    }
    this._menuShowingContext = {
      targetElement: itemElement,
      itemData,
      fileItems,
      event,
      isActionButton
    };
    const position = {
      of: element,
      at: 'top left',
      my: 'top left',
      offset: ''
    };
    if (event) {
      position.offset = event.offsetX + ' ' + event.offsetY;
    } else {
      position.my = 'left top';
      position.at = 'left bottom';
      position.boundaryOffset = '1';
    }
    this._contextMenu.option({
      target: element,
      position
    });
    this._contextMenu.show();
  };
  _proto.createContextMenuItems = function createContextMenuItems(fileItems, contextMenuItems, targetFileItem) {
    this._targetFileItems = fileItems;
    this._targetFileItem = (0, _type.isDefined)(targetFileItem) ? targetFileItem : fileItems === null || fileItems === void 0 ? void 0 : fileItems[0];
    const result = [];
    const itemArray = contextMenuItems || this.option('items');
    itemArray.forEach(srcItem => {
      const commandName = (0, _type.isString)(srcItem) ? srcItem : srcItem.name;
      const item = this._configureItemByCommandName(commandName, srcItem, fileItems, this._targetFileItem);
      if (this._isContextMenuItemAvailable(item, fileItems)) {
        result.push(item);
      }
    });
    return result;
  };
  _proto._isContextMenuItemAvailable = function _isContextMenuItemAvailable(menuItem, fileItems) {
    if (!this._isDefaultItem(menuItem.name) || !menuItem._autoHide) {
      return (0, _common.ensureDefined)(menuItem.visible, true);
    }
    if (this._isIsolatedCreationItemCommand(menuItem.name) && fileItems && fileItems.length) {
      return false;
    }
    return this._commandManager.isCommandAvailable(menuItem.name, fileItems);
  };
  _proto._isIsolatedCreationItemCommand = function _isIsolatedCreationItemCommand(commandName) {
    return (commandName === 'create' || commandName === 'upload') && this.option('isolateCreationItemCommands');
  };
  _proto._isDefaultItem = function _isDefaultItem(commandName) {
    return !!DEFAULT_CONTEXT_MENU_ITEMS[commandName];
  };
  _proto._configureItemByCommandName = function _configureItemByCommandName(commandName, item, fileItems, targetFileItem) {
    if (!this._isDefaultItem(commandName)) {
      const res = (0, _extend.extend)(true, {}, item);
      res.originalItemData = item;
      this._addItemClickHandler(commandName, res);
      if (Array.isArray(item.items)) {
        res.items = this.createContextMenuItems(fileItems, item.items, targetFileItem);
      }
      return res;
    }
    const result = this._createMenuItemByCommandName(commandName);
    const defaultConfig = DEFAULT_CONTEXT_MENU_ITEMS[commandName];
    (0, _extend.extend)(result, defaultConfig);
    result.originalItemData = item;
    (0, _uiFile_manager.extendAttributes)(result, item, DEFAULT_ITEM_ALLOWED_PROPERTIES);
    if (!(0, _type.isDefined)(result.visible)) {
      result._autoHide = true;
    }
    if (commandName && !result.name) {
      (0, _extend.extend)(result, {
        name: commandName
      });
    }
    return result;
  };
  _proto._createMenuItemByCommandName = function _createMenuItemByCommandName(commandName) {
    const {
      text,
      icon
    } = this._commandManager.getCommandByName(commandName);
    const menuItem = {
      name: commandName,
      text,
      icon
    };
    this._addItemClickHandler(commandName, menuItem);
    return menuItem;
  };
  _proto._addItemClickHandler = function _addItemClickHandler(commandName, contextMenuItem) {
    contextMenuItem.onItemClick = args => this._onContextMenuItemClick(commandName, args);
  };
  _proto._onContextMenuItemClick = function _onContextMenuItemClick(commandName, args) {
    var _this$_targetFileItem;
    const changedArgs = (0, _extend.extend)(true, {}, args);
    changedArgs.itemData = args.itemData.originalItemData;
    changedArgs.fileSystemItem = (_this$_targetFileItem = this._targetFileItem) === null || _this$_targetFileItem === void 0 ? void 0 : _this$_targetFileItem.fileItem;
    changedArgs.viewArea = this.option('viewArea');
    this._actions.onItemClick(changedArgs);
    if (this._isDefaultItem(commandName)) {
      const targetFileItems = this._isIsolatedCreationItemCommand(commandName) ? null : this._targetFileItems;
      this._commandManager.executeCommand(commandName, targetFileItems);
    }
  };
  _proto._initActions = function _initActions() {
    this._actions = {
      onContextMenuHidden: this._createActionByOption('onContextMenuHidden'),
      onContextMenuShowing: this._createActionByOption('onContextMenuShowing'),
      onItemClick: this._createActionByOption('onItemClick')
    };
  };
  _proto._onContextMenuShowing = function _onContextMenuShowing(e) {
    if (this._isVisible) {
      this._onContextMenuHidden(true);
    }
    e = (0, _extend.extend)(e, this._menuShowingContext, {
      options: this.option(),
      cancel: false
    });
    this._actions.onContextMenuShowing(e);
    if (!e.cancel) {
      const items = this.createContextMenuItems(this._menuShowingContext.fileItems, null, this._menuShowingContext.fileSystemItem);
      this._contextMenu.option('dataSource', items);
    }
  };
  _proto.tryUpdateVisibleContextMenu = function tryUpdateVisibleContextMenu() {
    if (this._isVisible) {
      const items = this.createContextMenuItems(this._targetFileItems);
      this._contextMenu.option('dataSource', items);
    }
  };
  _proto._onContextMenuShown = function _onContextMenuShown() {
    this._isVisible = true;
  };
  _proto._onContextMenuHidden = function _onContextMenuHidden(preserveContext) {
    this._isVisible = false;
    if (!preserveContext) {
      this._menuShowingContext = {};
    }
    this._contextMenu.option('visible', false);
    this._raiseContextMenuHidden();
  };
  _proto._raiseContextMenuHidden = function _raiseContextMenuHidden() {
    this._actions.onContextMenuHidden();
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      commandManager: null,
      onContextMenuHidden: null,
      onItemClick: null
    });
  };
  _proto._optionChanged = function _optionChanged(args) {
    const name = args.name;
    switch (name) {
      case 'commandManager':
        this.repaint();
        break;
      case 'items':
        this.tryUpdateVisibleContextMenu();
        break;
      case 'onItemClick':
      case 'onContextMenuShowing':
      case 'onContextMenuHidden':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        _Widget.prototype._optionChanged.call(this, args);
    }
  };
  _createClass(FileManagerContextMenu, [{
    key: "_commandManager",
    get: function () {
      return this.option('commandManager');
    }
  }]);
  return FileManagerContextMenu;
}(_ui.default);
var _default = exports.default = FileManagerContextMenu;
module.exports = exports.default;
module.exports.default = exports.default;
