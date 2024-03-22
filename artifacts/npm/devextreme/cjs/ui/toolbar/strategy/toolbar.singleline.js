/**
* DevExtreme (cjs/ui/toolbar/strategy/toolbar.singleline.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.SingleLineStrategy = void 0;
var _size = require("../../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _iterator = require("../../../core/utils/iterator");
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _uiToolbar = _interopRequireDefault(require("../internal/ui.toolbar.menu"));
var _data = require("../../../core/utils/data");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const TOOLBAR_DROP_DOWN_MENU_CONTAINER_CLASS = 'dx-toolbar-menu-container';
const TOOLBAR_BUTTON_CLASS = 'dx-toolbar-button';
const TOOLBAR_AUTO_HIDE_ITEM_CLASS = 'dx-toolbar-item-auto-hide';
const TOOLBAR_HIDDEN_ITEM = 'dx-toolbar-item-invisible';
let SingleLineStrategy = exports.SingleLineStrategy = /*#__PURE__*/function () {
  function SingleLineStrategy(toolbar) {
    this._toolbar = toolbar;
  }
  var _proto = SingleLineStrategy.prototype;
  _proto._initMarkup = function _initMarkup() {
    (0, _common.deferRender)(() => {
      this._renderOverflowMenu();
      this._renderMenuItems();
    });
  };
  _proto._renderOverflowMenu = function _renderOverflowMenu() {
    if (!this._hasVisibleMenuItems()) {
      return;
    }
    this._renderMenuButtonContainer();
    const $menu = (0, _renderer.default)('<div>').appendTo(this._overflowMenuContainer());
    const itemClickAction = this._toolbar._createActionByOption('onItemClick');
    const menuItemTemplate = this._toolbar._getTemplateByOption('menuItemTemplate');
    this._menu = this._toolbar._createComponent($menu, _uiToolbar.default, {
      disabled: this._toolbar.option('disabled'),
      itemTemplate: () => menuItemTemplate,
      onItemClick: e => {
        itemClickAction(e);
      },
      container: this._toolbar.option('menuContainer'),
      onOptionChanged: _ref => {
        let {
          name,
          value
        } = _ref;
        if (name === 'opened') {
          this._toolbar.option('overflowMenuVisible', value);
        }
        if (name === 'items') {
          this._updateMenuVisibility(value);
        }
      }
    });
  };
  _proto.renderMenuItems = function renderMenuItems() {
    if (!this._menu) {
      this._renderOverflowMenu();
    }
    this._menu && this._menu.option('items', this._getMenuItems());
    if (this._menu && !this._menu.option('items').length) {
      this._menu.option('opened', false);
    }
  };
  _proto._renderMenuButtonContainer = function _renderMenuButtonContainer() {
    this._$overflowMenuContainer = (0, _renderer.default)('<div>').appendTo(this._toolbar._$afterSection).addClass(TOOLBAR_BUTTON_CLASS).addClass(TOOLBAR_DROP_DOWN_MENU_CONTAINER_CLASS);
  };
  _proto._overflowMenuContainer = function _overflowMenuContainer() {
    return this._$overflowMenuContainer;
  };
  _proto._updateMenuVisibility = function _updateMenuVisibility(menuItems) {
    const items = menuItems !== null && menuItems !== void 0 ? menuItems : this._getMenuItems();
    const isMenuVisible = items.length && this._hasVisibleMenuItems(items);
    this._toggleMenuVisibility(isMenuVisible);
  };
  _proto._toggleMenuVisibility = function _toggleMenuVisibility(value) {
    if (!this._overflowMenuContainer()) {
      return;
    }
    this._overflowMenuContainer().toggleClass(INVISIBLE_STATE_CLASS, !value);
  };
  _proto._renderMenuItems = function _renderMenuItems() {
    (0, _common.deferRender)(() => {
      this.renderMenuItems();
    });
  };
  _proto._dimensionChanged = function _dimensionChanged() {
    this.renderMenuItems();
  };
  _proto._getToolbarItems = function _getToolbarItems() {
    var _this$_toolbar$option;
    return (0, _common.grep)((_this$_toolbar$option = this._toolbar.option('items')) !== null && _this$_toolbar$option !== void 0 ? _this$_toolbar$option : [], item => {
      return !this._toolbar._isMenuItem(item);
    });
  };
  _proto._getHiddenItems = function _getHiddenItems() {
    return this._toolbar._itemContainer().children(".".concat(TOOLBAR_AUTO_HIDE_ITEM_CLASS, ".").concat(TOOLBAR_HIDDEN_ITEM)).not(".".concat(INVISIBLE_STATE_CLASS));
  };
  _proto._getMenuItems = function _getMenuItems() {
    var _this$_toolbar$option2, _this$_restoreItems;
    const menuItems = (0, _common.grep)((_this$_toolbar$option2 = this._toolbar.option('items')) !== null && _this$_toolbar$option2 !== void 0 ? _this$_toolbar$option2 : [], item => {
      return this._toolbar._isMenuItem(item);
    });
    const $hiddenItems = this._getHiddenItems();
    this._restoreItems = (_this$_restoreItems = this._restoreItems) !== null && _this$_restoreItems !== void 0 ? _this$_restoreItems : [];
    const overflowItems = [].slice.call($hiddenItems).map(hiddenItem => {
      const itemData = this._toolbar._getItemData(hiddenItem);
      const $itemContainer = (0, _renderer.default)(hiddenItem);
      const $itemMarkup = $itemContainer.children();
      return (0, _extend.extend)({
        menuItemTemplate: () => {
          this._restoreItems.push({
            container: $itemContainer,
            item: $itemMarkup
          });
          const $container = (0, _renderer.default)('<div>').addClass(TOOLBAR_AUTO_HIDE_ITEM_CLASS);
          return $container.append($itemMarkup);
        }
      }, itemData);
    });
    return [...overflowItems, ...menuItems];
  };
  _proto._hasVisibleMenuItems = function _hasVisibleMenuItems(items) {
    const menuItems = items !== null && items !== void 0 ? items : this._toolbar.option('items');
    let result = false;
    const optionGetter = (0, _data.compileGetter)('visible');
    const overflowGetter = (0, _data.compileGetter)('locateInMenu');
    (0, _iterator.each)(menuItems, function (index, item) {
      const itemVisible = optionGetter(item, {
        functionsAsIs: true
      });
      const itemOverflow = overflowGetter(item, {
        functionsAsIs: true
      });
      if (itemVisible !== false && (itemOverflow === 'auto' || itemOverflow === 'always') || item.location === 'menu') {
        result = true;
      }
    });
    return result;
  };
  _proto._arrangeItems = function _arrangeItems() {
    var _this$_restoreItems2;
    this._toolbar._$centerSection.css({
      margin: '0 auto',
      float: 'none'
    });
    (0, _iterator.each)((_this$_restoreItems2 = this._restoreItems) !== null && _this$_restoreItems2 !== void 0 ? _this$_restoreItems2 : [], function (_, obj) {
      (0, _renderer.default)(obj.container).append(obj.item);
    });
    this._restoreItems = [];
    const elementWidth = (0, _size.getWidth)(this._toolbar.$element());
    this._hideOverflowItems(elementWidth);
    return elementWidth;
  };
  _proto._hideOverflowItems = function _hideOverflowItems(elementWidth) {
    var _elementWidth;
    const overflowItems = this._toolbar.$element().find(".".concat(TOOLBAR_AUTO_HIDE_ITEM_CLASS));
    if (!overflowItems.length) {
      return;
    }
    elementWidth = (_elementWidth = elementWidth) !== null && _elementWidth !== void 0 ? _elementWidth : (0, _size.getWidth)(this._toolbar.$element());
    (0, _renderer.default)(overflowItems).removeClass(TOOLBAR_HIDDEN_ITEM);
    let itemsWidth = this._getItemsWidth();
    while (overflowItems.length && elementWidth < itemsWidth) {
      const $item = overflowItems.eq(-1);
      $item.addClass(TOOLBAR_HIDDEN_ITEM);
      itemsWidth = this._getItemsWidth();
      overflowItems.splice(-1, 1);
    }
  };
  _proto._getItemsWidth = function _getItemsWidth() {
    return this._toolbar._getSummaryItemsSize('width', [this._toolbar._$beforeSection, this._toolbar._$centerSection, this._toolbar._$afterSection]);
  };
  _proto._itemOptionChanged = function _itemOptionChanged(item, property, value) {
    if (property === 'disabled' || property === 'options.disabled') {
      if (this._toolbar._isMenuItem(item)) {
        var _this$_menu;
        (_this$_menu = this._menu) === null || _this$_menu === void 0 ? void 0 : _this$_menu._itemOptionChanged(item, property, value);
        return;
      }
    }
    this.renderMenuItems();
  };
  _proto._renderItem = function _renderItem(item, itemElement) {
    if (item.locateInMenu === 'auto') {
      itemElement.addClass(TOOLBAR_AUTO_HIDE_ITEM_CLASS);
    }
  };
  _proto._optionChanged = function _optionChanged(name, value) {
    var _this$_menu2, _this$_menu3, _this$_menu4, _this$_menu5, _this$_menu6;
    switch (name) {
      case 'disabled':
        (_this$_menu2 = this._menu) === null || _this$_menu2 === void 0 ? void 0 : _this$_menu2.option(name, value);
        break;
      case 'overflowMenuVisible':
        (_this$_menu3 = this._menu) === null || _this$_menu3 === void 0 ? void 0 : _this$_menu3.option('opened', value);
        break;
      case 'onItemClick':
        (_this$_menu4 = this._menu) === null || _this$_menu4 === void 0 ? void 0 : _this$_menu4.option(name, value);
        break;
      case 'menuContainer':
        (_this$_menu5 = this._menu) === null || _this$_menu5 === void 0 ? void 0 : _this$_menu5.option('container', value);
        break;
      case 'menuItemTemplate':
        (_this$_menu6 = this._menu) === null || _this$_menu6 === void 0 ? void 0 : _this$_menu6.option('itemTemplate', value);
        break;
    }
  };
  return SingleLineStrategy;
}();
