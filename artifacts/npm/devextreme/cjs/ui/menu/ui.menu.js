/**
* DevExtreme (cjs/ui/menu/ui.menu.js)
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
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _common = require("../../core/utils/common");
var _element = require("../../core/element");
var _iterator = require("../../core/utils/iterator");
var _type = require("../../core/utils/type");
var _extend = require("../../core/utils/extend");
var _utils = require("../overlay/utils");
var _index = require("../../events/utils/index");
var _pointer = _interopRequireDefault(require("../../events/pointer"));
var _hover = require("../../events/hover");
var _ui = _interopRequireDefault(require("../context_menu/ui.menu_base"));
var _ui2 = _interopRequireDefault(require("../overlay/ui.overlay"));
var _ui3 = _interopRequireDefault(require("./ui.submenu"));
var _button = _interopRequireDefault(require("../button"));
var _tree_view = _interopRequireDefault(require("../tree_view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
// STYLE menu

const DX_MENU_CLASS = 'dx-menu';
const DX_MENU_VERTICAL_CLASS = DX_MENU_CLASS + '-vertical';
const DX_MENU_HORIZONTAL_CLASS = DX_MENU_CLASS + '-horizontal';
const DX_MENU_ITEM_CLASS = DX_MENU_CLASS + '-item';
const DX_MENU_ITEMS_CONTAINER_CLASS = DX_MENU_CLASS + '-items-container';
const DX_MENU_ITEM_EXPANDED_CLASS = DX_MENU_ITEM_CLASS + '-expanded';
const DX_CONTEXT_MENU_CLASS = 'dx-context-menu';
const DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS = DX_CONTEXT_MENU_CLASS + '-container-border';
const DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS = 'dx-context-menu-content-delimiter';
const DX_SUBMENU_CLASS = 'dx-submenu';
const DX_STATE_DISABLED_CLASS = 'dx-state-disabled';
const DX_STATE_HOVER_CLASS = 'dx-state-hover';
const DX_STATE_ACTIVE_CLASS = 'dx-state-active';
const DX_ADAPTIVE_MODE_CLASS = DX_MENU_CLASS + '-adaptive-mode';
const DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS = DX_MENU_CLASS + '-hamburger-button';
const DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS = DX_ADAPTIVE_MODE_CLASS + '-overlay-wrapper';
const FOCUS_UP = 'up';
const FOCUS_DOWN = 'down';
const FOCUS_LEFT = 'left';
const FOCUS_RIGHT = 'right';
const SHOW_SUBMENU_OPERATION = 'showSubmenu';
const NEXTITEM_OPERATION = 'nextItem';
const PREVITEM_OPERATION = 'prevItem';
const DEFAULT_DELAY = {
  'show': 50,
  'hide': 300
};
const ACTIONS = ['onSubmenuShowing', 'onSubmenuShown', 'onSubmenuHiding', 'onSubmenuHidden', 'onItemContextMenu', 'onItemClick', 'onSelectionChanged', 'onItemRendered'];
let Menu = /*#__PURE__*/function (_MenuBase) {
  _inheritsLoose(Menu, _MenuBase);
  function Menu() {
    return _MenuBase.apply(this, arguments) || this;
  }
  var _proto = Menu.prototype;
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_MenuBase.prototype._getDefaultOptions.call(this), {
      orientation: 'horizontal',
      submenuDirection: 'auto',
      showFirstSubmenuMode: {
        name: 'onClick',
        delay: {
          show: 50,
          hide: 300
        }
      },
      hideSubmenuOnMouseLeave: false,
      onSubmenuShowing: null,
      onSubmenuShown: null,
      onSubmenuHiding: null,
      onSubmenuHidden: null,
      adaptivityEnabled: false

      /**
      * @name dxMenuOptions.selectedItems
      * @hidden
      */

      /**
      * @name dxMenuOptions.onSelectionChange
      * @hidden
      * @action
      */

      /**
      * @name dxMenuOptions.onItemReordered
      * @hidden
      */
    });
  };
  _proto._setOptionsByReference = function _setOptionsByReference() {
    _MenuBase.prototype._setOptionsByReference.call(this);
    (0, _extend.extend)(this._optionsByReference, {
      animation: true,
      selectedItem: true
    });
  };
  _proto._itemElements = function _itemElements() {
    const rootMenuElements = _MenuBase.prototype._itemElements.call(this);
    const submenuElements = this._submenuItemElements();
    return rootMenuElements.add(submenuElements);
  };
  _proto._submenuItemElements = function _submenuItemElements() {
    let elements = [];
    const itemSelector = ".".concat(DX_MENU_ITEM_CLASS);
    const currentSubmenu = this._submenus.length && this._submenus[0];
    if (currentSubmenu && currentSubmenu.itemsContainer()) {
      elements = currentSubmenu.itemsContainer().find(itemSelector);
    }
    return elements;
  };
  _proto._focusTarget = function _focusTarget() {
    return this.$element();
  };
  _proto._isMenuHorizontal = function _isMenuHorizontal() {
    return this.option('orientation') === 'horizontal';
  };
  _proto._moveFocus = function _moveFocus(location) {
    const $items = this._getAvailableItems();
    const isMenuHorizontal = this._isMenuHorizontal();
    const $activeItem = this._getActiveItem(true);
    let argument;
    let operation;
    let navigationAction;
    let $newTarget;
    switch (location) {
      case FOCUS_UP:
        operation = isMenuHorizontal ? SHOW_SUBMENU_OPERATION : this._getItemsNavigationOperation(PREVITEM_OPERATION);
        argument = isMenuHorizontal ? $activeItem : $items;
        navigationAction = this._getKeyboardNavigationAction(operation, argument);
        $newTarget = navigationAction();
        break;
      case FOCUS_DOWN:
        operation = isMenuHorizontal ? SHOW_SUBMENU_OPERATION : this._getItemsNavigationOperation(NEXTITEM_OPERATION);
        argument = isMenuHorizontal ? $activeItem : $items;
        navigationAction = this._getKeyboardNavigationAction(operation, argument);
        $newTarget = navigationAction();
        break;
      case FOCUS_RIGHT:
        operation = isMenuHorizontal ? this._getItemsNavigationOperation(NEXTITEM_OPERATION) : SHOW_SUBMENU_OPERATION;
        argument = isMenuHorizontal ? $items : $activeItem;
        navigationAction = this._getKeyboardNavigationAction(operation, argument);
        $newTarget = navigationAction();
        break;
      case FOCUS_LEFT:
        operation = isMenuHorizontal ? this._getItemsNavigationOperation(PREVITEM_OPERATION) : SHOW_SUBMENU_OPERATION;
        argument = isMenuHorizontal ? $items : $activeItem;
        navigationAction = this._getKeyboardNavigationAction(operation, argument);
        $newTarget = navigationAction();
        break;
      default:
        return _MenuBase.prototype._moveFocus.call(this, location);
    }
    if ($newTarget && $newTarget.length !== 0) {
      this.option('focusedElement', (0, _element.getPublicElement)($newTarget));
    }
  };
  _proto._getItemsNavigationOperation = function _getItemsNavigationOperation(operation) {
    let navOperation = operation;
    if (this.option('rtlEnabled')) {
      navOperation = operation === PREVITEM_OPERATION ? NEXTITEM_OPERATION : PREVITEM_OPERATION;
    }
    return navOperation;
  };
  _proto._getKeyboardNavigationAction = function _getKeyboardNavigationAction(operation, argument) {
    let action = _common.noop;
    switch (operation) {
      case SHOW_SUBMENU_OPERATION:
        if (!argument.hasClass(DX_STATE_DISABLED_CLASS)) {
          action = this._showSubmenu.bind(this, argument);
        }
        break;
      case NEXTITEM_OPERATION:
        action = this._nextItem.bind(this, argument);
        break;
      case PREVITEM_OPERATION:
        action = this._prevItem.bind(this, argument);
        break;
    }
    return action;
  };
  _proto._clean = function _clean() {
    _MenuBase.prototype._clean.call(this);
    this.option('templatesRenderAsynchronously') && clearTimeout(this._resizeEventTimer);
  };
  _proto._visibilityChanged = function _visibilityChanged(visible) {
    if (visible) {
      if (!this._menuItemsWidth) {
        this._updateItemsWidthCache();
      }
      this._dimensionChanged();
    }
  };
  _proto._isAdaptivityEnabled = function _isAdaptivityEnabled() {
    return this.option('adaptivityEnabled') && this.option('orientation') === 'horizontal';
  };
  _proto._updateItemsWidthCache = function _updateItemsWidthCache() {
    const $menuItems = this.$element().find('ul').first().children('li').children(".".concat(DX_MENU_ITEM_CLASS));
    this._menuItemsWidth = this._getSummaryItemsSize('width', $menuItems, true);
  };
  _proto._dimensionChanged = function _dimensionChanged() {
    if (!this._isAdaptivityEnabled()) {
      return;
    }
    const containerWidth = (0, _size.getOuterWidth)(this.$element());
    this._toggleAdaptiveMode(this._menuItemsWidth > containerWidth);
  };
  _proto._init = function _init() {
    _MenuBase.prototype._init.call(this);
    this._submenus = [];
  };
  _proto._initActions = function _initActions() {
    this._actions = {};
    (0, _iterator.each)(ACTIONS, (index, action) => {
      this._actions[action] = this._createActionByOption(action);
    });
  };
  _proto._initMarkup = function _initMarkup() {
    this._visibleSubmenu = null;
    this.$element().addClass(DX_MENU_CLASS);
    _MenuBase.prototype._initMarkup.call(this);
    this._addCustomCssClass(this.$element());
    this.setAria('role', 'menubar');
  };
  _proto._render = function _render() {
    _MenuBase.prototype._render.call(this);
    this._initAdaptivity();
  };
  _proto._renderHamburgerButton = function _renderHamburgerButton() {
    this._hamburger = new _button.default((0, _renderer.default)('<div>').addClass(DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS), {
      icon: 'menu',
      activeStateEnabled: false,
      onClick: this._toggleTreeView.bind(this)
    });
    return this._hamburger.$element();
  };
  _proto._toggleTreeView = function _toggleTreeView(state) {
    if ((0, _type.isPlainObject)(state)) {
      state = !this._overlay.option('visible');
    }
    this._overlay.option('visible', state);
    if (state) {
      this._treeView.focus();
    }
    this._toggleHamburgerActiveState(state);
  };
  _proto._toggleHamburgerActiveState = function _toggleHamburgerActiveState(state) {
    this._hamburger && this._hamburger.$element().toggleClass(DX_STATE_ACTIVE_CLASS, state);
  };
  _proto._toggleAdaptiveMode = function _toggleAdaptiveMode(state) {
    const $menuItemsContainer = this.$element().find(".".concat(DX_MENU_HORIZONTAL_CLASS));
    const $adaptiveElements = this.$element().find(".".concat(DX_ADAPTIVE_MODE_CLASS));
    if (state) {
      this._hideVisibleSubmenu();
    } else {
      this._treeView && this._treeView.collapseAll();
      this._overlay && this._toggleTreeView(state);
    }
    $menuItemsContainer.toggle(!state);
    $adaptiveElements.toggle(state);
  };
  _proto._removeAdaptivity = function _removeAdaptivity() {
    if (!this._$adaptiveContainer) {
      return;
    }
    this._toggleAdaptiveMode(false);
    this._$adaptiveContainer.remove();
    this._$adaptiveContainer = null;
    this._treeView = null;
    this._hamburger = null;
    this._overlay = null;
  };
  _proto._treeviewItemClickHandler = function _treeviewItemClickHandler(e) {
    this._actions['onItemClick'](e);
    if (!e.node.children.length) {
      this._toggleTreeView(false);
    }
  };
  _proto._getAdaptiveOverlayOptions = function _getAdaptiveOverlayOptions() {
    const rtl = this.option('rtlEnabled');
    const position = rtl ? 'right' : 'left';
    return {
      _ignoreFunctionValueDeprecation: true,
      maxHeight: () => {
        return (0, _utils.getElementMaxHeightByWindow)(this.$element());
      },
      deferRendering: false,
      shading: false,
      animation: false,
      hideOnParentScroll: true,
      onHidden: () => {
        this._toggleHamburgerActiveState(false);
      },
      height: 'auto',
      hideOnOutsideClick(e) {
        return !(0, _renderer.default)(e.target).closest(".".concat(DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS)).length;
      },
      position: {
        collision: 'flipfit',
        at: 'bottom ' + position,
        my: 'top ' + position,
        of: this._hamburger.$element()
      }
    };
  };
  _proto._getTreeViewOptions = function _getTreeViewOptions() {
    const menuOptions = {};
    const optionsToTransfer = ['rtlEnabled', 'width', 'accessKey', 'activeStateEnabled', 'animation', 'dataSource', 'disabled', 'displayExpr', 'displayExpr', 'focusStateEnabled', 'hint', 'hoverStateEnabled', 'itemsExpr', 'items', 'itemTemplate', 'selectedExpr', 'selectionMode', 'tabIndex', 'visible'];
    (0, _iterator.each)(optionsToTransfer, (_, option) => {
      menuOptions[option] = this.option(option);
    });
    const actionsToTransfer = ['onItemContextMenu', 'onSelectionChanged', 'onItemRendered'];
    (0, _iterator.each)(actionsToTransfer, (_, actionName) => {
      menuOptions[actionName] = e => {
        this._actions[actionName](e);
      };
    });
    return (0, _extend.extend)(menuOptions, {
      dataSource: this.getDataSource(),
      animationEnabled: !!this.option('animation'),
      onItemClick: this._treeviewItemClickHandler.bind(this),
      onItemExpanded: e => {
        this._overlay.repaint();
        this._actions['onSubmenuShown'](e);
      },
      onItemCollapsed: e => {
        this._overlay.repaint();
        this._actions['onSubmenuHidden'](e);
      },
      selectNodesRecursive: false,
      selectByClick: this.option('selectByClick'),
      expandEvent: 'click'
    });
  };
  _proto._initAdaptivity = function _initAdaptivity() {
    if (!this._isAdaptivityEnabled()) return;
    this._$adaptiveContainer = (0, _renderer.default)('<div>').addClass(DX_ADAPTIVE_MODE_CLASS);
    const $hamburger = this._renderHamburgerButton();
    this._treeView = this._createComponent((0, _renderer.default)('<div>'), _tree_view.default, this._getTreeViewOptions());
    this._overlay = this._createComponent((0, _renderer.default)('<div>'), _ui2.default, this._getAdaptiveOverlayOptions());
    this._overlay.$content().append(this._treeView.$element()).addClass(DX_ADAPTIVE_MODE_CLASS).addClass(this.option('cssClass'));
    this._overlay.$wrapper().addClass(DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS);
    this._$adaptiveContainer.append($hamburger);
    this._$adaptiveContainer.append(this._overlay.$element());
    this.$element().append(this._$adaptiveContainer);
    this._updateItemsWidthCache();
    this._dimensionChanged();
  };
  _proto._getDelay = function _getDelay(delayType) {
    const delay = this.option('showFirstSubmenuMode').delay;
    if (!(0, _type.isDefined)(delay)) {
      return DEFAULT_DELAY[delayType];
    } else {
      return (0, _type.isObject)(delay) ? delay[delayType] : delay;
    }
  };
  _proto._keyboardHandler = function _keyboardHandler(e) {
    return _MenuBase.prototype._keyboardHandler.call(this, e, !!this._visibleSubmenu);
  };
  _proto._renderContainer = function _renderContainer() {
    const $wrapper = (0, _renderer.default)('<div>');
    $wrapper.appendTo(this.$element()).addClass(this._isMenuHorizontal() ? DX_MENU_HORIZONTAL_CLASS : DX_MENU_VERTICAL_CLASS);
    return _MenuBase.prototype._renderContainer.call(this, $wrapper);
  };
  _proto._renderSubmenuItems = function _renderSubmenuItems(node, $itemFrame) {
    const submenu = this._createSubmenu(node, $itemFrame);
    this._submenus.push(submenu);
    this._renderBorderElement($itemFrame);
    return submenu;
  };
  _proto._getKeyboardListeners = function _getKeyboardListeners() {
    return _MenuBase.prototype._getKeyboardListeners.call(this).concat(this._visibleSubmenu);
  };
  _proto._createSubmenu = function _createSubmenu(node, $rootItem) {
    const $submenuContainer = (0, _renderer.default)('<div>').addClass(DX_CONTEXT_MENU_CLASS).appendTo($rootItem);
    const items = this._getChildNodes(node);
    const subMenu = this._createComponent($submenuContainer, _ui3.default, (0, _extend.extend)(this._getSubmenuOptions(), {
      _dataAdapter: this._dataAdapter,
      _parentKey: node.internalFields.key,
      items: items,
      onHoverStart: this._clearTimeouts.bind(this),
      position: this.getSubmenuPosition($rootItem)
    }));
    this._attachSubmenuHandlers($rootItem, subMenu);
    return subMenu;
  };
  _proto._getSubmenuOptions = function _getSubmenuOptions() {
    const $submenuTarget = (0, _renderer.default)('<div>');
    const isMenuHorizontal = this._isMenuHorizontal();
    return {
      itemTemplate: this.option('itemTemplate'),
      target: $submenuTarget,
      orientation: this.option('orientation'),
      selectionMode: this.option('selectionMode'),
      cssClass: this.option('cssClass'),
      selectByClick: this.option('selectByClick'),
      hoverStateEnabled: this.option('hoverStateEnabled'),
      activeStateEnabled: this.option('activeStateEnabled'),
      focusStateEnabled: this.option('focusStateEnabled'),
      animation: this.option('animation'),
      showSubmenuMode: this.option('showSubmenuMode'),
      displayExpr: this.option('displayExpr'),
      disabledExpr: this.option('disabledExpr'),
      selectedExpr: this.option('selectedExpr'),
      itemsExpr: this.option('itemsExpr'),
      onFocusedItemChanged: e => {
        if (!e.component.option('visible')) {
          return;
        }
        this.option('focusedElement', e.component.option('focusedElement'));
      },
      onSelectionChanged: this._nestedItemOnSelectionChangedHandler.bind(this),
      onItemClick: this._nestedItemOnItemClickHandler.bind(this),
      onItemRendered: this._nestedItemOnItemRenderedHandler.bind(this),
      onLeftFirstItem: isMenuHorizontal ? null : this._moveMainMenuFocus.bind(this, PREVITEM_OPERATION),
      onLeftLastItem: isMenuHorizontal ? null : this._moveMainMenuFocus.bind(this, NEXTITEM_OPERATION),
      onCloseRootSubmenu: this._moveMainMenuFocus.bind(this, isMenuHorizontal ? PREVITEM_OPERATION : null),
      onExpandLastSubmenu: isMenuHorizontal ? this._moveMainMenuFocus.bind(this, NEXTITEM_OPERATION) : null
    };
  };
  _proto._getShowFirstSubmenuMode = function _getShowFirstSubmenuMode() {
    if (!this._isDesktopDevice()) {
      return 'onClick';
    }
    const optionValue = this.option('showFirstSubmenuMode');
    return (0, _type.isObject)(optionValue) ? optionValue.name : optionValue;
  };
  _proto._moveMainMenuFocus = function _moveMainMenuFocus(direction) {
    const $items = this._getAvailableItems();
    const itemCount = $items.length;
    const $currentItem = $items.filter(".".concat(DX_MENU_ITEM_EXPANDED_CLASS)).eq(0);
    let itemIndex = $items.index($currentItem);
    this._hideSubmenu(this._visibleSubmenu);
    itemIndex += direction === PREVITEM_OPERATION ? -1 : 1;
    if (itemIndex >= itemCount) {
      itemIndex = 0;
    } else if (itemIndex < 0) {
      itemIndex = itemCount - 1;
    }
    const $newItem = $items.eq(itemIndex);
    this.option('focusedElement', (0, _element.getPublicElement)($newItem));
  };
  _proto._nestedItemOnSelectionChangedHandler = function _nestedItemOnSelectionChangedHandler(args) {
    const selectedItem = args.addedItems.length && args.addedItems[0];
    const submenu = _ui3.default.getInstance(args.element);
    const onSelectionChanged = this._actions['onSelectionChanged'];
    onSelectionChanged(args);
    selectedItem && this._clearSelectionInSubmenus(selectedItem[0], submenu);
    this._clearRootSelection();
    this._setOptionWithoutOptionChange('selectedItem', selectedItem);
  };
  _proto._clearSelectionInSubmenus = function _clearSelectionInSubmenus(item, targetSubmenu) {
    const cleanAllSubmenus = !arguments.length;
    (0, _iterator.each)(this._submenus, (index, submenu) => {
      const $submenu = submenu._itemContainer();
      const isOtherItem = !$submenu.is(targetSubmenu && targetSubmenu._itemContainer());
      const $selectedItem = $submenu.find(".".concat(this._selectedItemClass()));
      if (isOtherItem && $selectedItem.length || cleanAllSubmenus) {
        $selectedItem.removeClass(this._selectedItemClass());
        const selectedItemData = this._getItemData($selectedItem);
        if (selectedItemData) {
          selectedItemData.selected = false;
        }
        submenu._clearSelectedItems();
      }
    });
  };
  _proto._clearRootSelection = function _clearRootSelection() {
    const $prevSelectedItem = this.$element().find(".".concat(DX_MENU_ITEMS_CONTAINER_CLASS)).first().children().children().filter(".".concat(this._selectedItemClass()));
    if ($prevSelectedItem.length) {
      const prevSelectedItemData = this._getItemData($prevSelectedItem);
      prevSelectedItemData.selected = false;
      $prevSelectedItem.removeClass(this._selectedItemClass());
    }
  };
  _proto._nestedItemOnItemClickHandler = function _nestedItemOnItemClickHandler(e) {
    this._actions['onItemClick'](e);
  };
  _proto._nestedItemOnItemRenderedHandler = function _nestedItemOnItemRenderedHandler(e) {
    this._actions['onItemRendered'](e);
  };
  _proto._attachSubmenuHandlers = function _attachSubmenuHandlers($rootItem, submenu) {
    const $submenuOverlayContent = submenu.getOverlayContent();
    const submenus = $submenuOverlayContent.find(".".concat(DX_SUBMENU_CLASS));
    const submenuMouseLeaveName = (0, _index.addNamespace)(_hover.end, this.NAME + '_submenu');
    submenu.option({
      onShowing: this._submenuOnShowingHandler.bind(this, $rootItem, submenu),
      onShown: this._submenuOnShownHandler.bind(this, $rootItem, submenu),
      onHiding: this._submenuOnHidingHandler.bind(this, $rootItem, submenu),
      onHidden: this._submenuOnHiddenHandler.bind(this, $rootItem, submenu)
    });
    (0, _iterator.each)(submenus, (index, submenu) => {
      _events_engine.default.off(submenu, submenuMouseLeaveName);
      _events_engine.default.on(submenu, submenuMouseLeaveName, null, this._submenuMouseLeaveHandler.bind(this, $rootItem));
    });
  };
  _proto._submenuOnShowingHandler = function _submenuOnShowingHandler($rootItem, submenu) {
    const $border = $rootItem.children(".".concat(DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS));
    this._actions.onSubmenuShowing({
      rootItem: (0, _element.getPublicElement)($rootItem),
      submenu: submenu
    });
    $border.show();
    $rootItem.addClass(DX_MENU_ITEM_EXPANDED_CLASS);
  };
  _proto._submenuOnShownHandler = function _submenuOnShownHandler($rootItem, submenu) {
    this._actions.onSubmenuShown({
      rootItem: (0, _element.getPublicElement)($rootItem),
      submenu: submenu
    });
  };
  _proto._submenuOnHidingHandler = function _submenuOnHidingHandler($rootItem, submenu, eventArgs) {
    const $border = $rootItem.children(".".concat(DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS));
    const args = eventArgs;
    args.rootItem = (0, _element.getPublicElement)($rootItem);
    args.submenu = submenu;
    this._actions.onSubmenuHiding(args);
    eventArgs = args;
    if (!eventArgs.cancel) {
      if (this._visibleSubmenu === submenu) this._visibleSubmenu = null;
      $border.hide();
      $rootItem.removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
    }
  };
  _proto._submenuOnHiddenHandler = function _submenuOnHiddenHandler($rootItem, submenu) {
    this._actions.onSubmenuHidden({
      rootItem: (0, _element.getPublicElement)($rootItem),
      submenu: submenu
    });
  };
  _proto._submenuMouseLeaveHandler = function _submenuMouseLeaveHandler($rootItem, eventArgs) {
    const target = (0, _renderer.default)(eventArgs.relatedTarget).parents(".".concat(DX_CONTEXT_MENU_CLASS))[0];
    const contextMenu = this._getSubmenuByRootElement($rootItem).getOverlayContent()[0];
    if (this.option('hideSubmenuOnMouseLeave') && target !== contextMenu) {
      this._clearTimeouts();
      setTimeout(this._hideSubmenuAfterTimeout.bind(this), this._getDelay('hide'));
    }
  };
  _proto._hideSubmenuAfterTimeout = function _hideSubmenuAfterTimeout() {
    if (!this._visibleSubmenu) {
      return;
    }
    const isRootItemHovered = (0, _renderer.default)(this._visibleSubmenu.$element().context).hasClass(DX_STATE_HOVER_CLASS);
    const isSubmenuItemHovered = this._visibleSubmenu.getOverlayContent().find(".".concat(DX_STATE_HOVER_CLASS)).length;
    const hoveredElementFromSubMenu = this._visibleSubmenu.getOverlayContent().get(0).querySelector(':hover');
    if (!hoveredElementFromSubMenu && !isSubmenuItemHovered && !isRootItemHovered) {
      this._visibleSubmenu.hide();
    }
  };
  _proto._getSubmenuByRootElement = function _getSubmenuByRootElement($rootItem) {
    if (!$rootItem) {
      return false;
    }
    const $submenu = $rootItem.children(".".concat(DX_CONTEXT_MENU_CLASS));
    return $submenu.length && _ui3.default.getInstance($submenu);
  };
  _proto.getSubmenuPosition = function getSubmenuPosition($rootItem) {
    const isHorizontalMenu = this._isMenuHorizontal();
    const submenuDirection = this.option('submenuDirection').toLowerCase();
    const rtlEnabled = this.option('rtlEnabled');
    const submenuPosition = {
      collision: 'flip',
      of: $rootItem,
      precise: true
    };
    switch (submenuDirection) {
      case 'leftortop':
        submenuPosition.at = 'left top';
        submenuPosition.my = isHorizontalMenu ? 'left bottom' : 'right top';
        break;
      case 'rightorbottom':
        submenuPosition.at = isHorizontalMenu ? 'left bottom' : 'right top';
        submenuPosition.my = 'left top';
        break;
      default:
        if (isHorizontalMenu) {
          submenuPosition.at = rtlEnabled ? 'right bottom' : 'left bottom';
          submenuPosition.my = rtlEnabled ? 'right top' : 'left top';
        } else {
          submenuPosition.at = rtlEnabled ? 'left top' : 'right top';
          submenuPosition.my = rtlEnabled ? 'right top' : 'left top';
        }
        break;
    }
    return submenuPosition;
  };
  _proto._renderBorderElement = function _renderBorderElement($item) {
    (0, _renderer.default)('<div>').appendTo($item).addClass(DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS).hide();
  };
  _proto._itemPointerDownHandler = function _itemPointerDownHandler(e) {
    const $target = (0, _renderer.default)(e.target);
    const $closestItem = $target.closest(this._itemElements());
    if ($closestItem.hasClass('dx-menu-item-has-submenu')) {
      this.option('focusedElement', null);
      return;
    }
    _MenuBase.prototype._itemPointerDownHandler.call(this, e);
  };
  _proto._hoverStartHandler = function _hoverStartHandler(e) {
    const mouseMoveEventName = (0, _index.addNamespace)(_pointer.default.move, this.NAME);
    const $item = this._getItemElementByEventArgs(e);
    const node = this._dataAdapter.getNodeByItem(this._getItemData($item));
    const isSelectionActive = (0, _type.isDefined)(e.buttons) && e.buttons === 1 || !(0, _type.isDefined)(e.buttons) && e.which === 1;
    if (this._isItemDisabled($item)) {
      return;
    }
    _events_engine.default.off($item, mouseMoveEventName);
    if (!this._hasChildren(node)) {
      this._showSubmenuTimer = setTimeout(this._hideSubmenuAfterTimeout.bind(this), this._getDelay('hide'));
      return;
    }
    if (this._getShowFirstSubmenuMode() === 'onHover' && !isSelectionActive) {
      const submenu = this._getSubmenuByElement($item);
      this._clearTimeouts();
      if (!submenu.isOverlayVisible()) {
        _events_engine.default.on($item, mouseMoveEventName, this._itemMouseMoveHandler.bind(this));
        this._showSubmenuTimer = this._getDelay('hide');
      }
    }
  };
  _proto._hoverEndHandler = function _hoverEndHandler(eventArg) {
    const $item = this._getItemElementByEventArgs(eventArg);
    const relatedTarget = (0, _renderer.default)(eventArg.relatedTarget);
    _MenuBase.prototype._hoverEndHandler.call(this, eventArg);
    this._clearTimeouts();
    if (this._isItemDisabled($item)) {
      return;
    }
    if (relatedTarget.hasClass(DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS)) {
      return;
    }
    if (this.option('hideSubmenuOnMouseLeave') && !relatedTarget.hasClass(DX_MENU_ITEMS_CONTAINER_CLASS)) {
      this._hideSubmenuTimer = setTimeout(() => {
        this._hideSubmenuAfterTimeout();
      }, this._getDelay('hide'));
    }
  };
  _proto._hideVisibleSubmenu = function _hideVisibleSubmenu() {
    if (!this._visibleSubmenu) {
      return false;
    }
    this._hideSubmenu(this._visibleSubmenu);
    return true;
  };
  _proto._showSubmenu = function _showSubmenu($itemElement) {
    const submenu = this._getSubmenuByElement($itemElement);
    if (this._visibleSubmenu !== submenu) {
      this._hideVisibleSubmenu();
    }
    if (submenu) {
      this._clearTimeouts();
      this.focus();
      submenu.show();
      this.option('focusedElement', submenu.option('focusedElement'));
    }
    this._visibleSubmenu = submenu;
    this._hoveredRootItem = $itemElement;
  };
  _proto._hideSubmenu = function _hideSubmenu(submenu) {
    submenu && submenu.hide();
    if (this._visibleSubmenu === submenu) {
      this._visibleSubmenu = null;
    }
    this._hoveredRootItem = null;
  };
  _proto._itemMouseMoveHandler = function _itemMouseMoveHandler(e) {
    // todo: replace mousemove with hover event
    if (e.pointers && e.pointers.length) {
      return;
    }
    const $item = (0, _renderer.default)(e.currentTarget);
    if (!(0, _type.isDefined)(this._showSubmenuTimer)) {
      return;
    }
    this._clearTimeouts();
    this._showSubmenuTimer = setTimeout(() => {
      const submenu = this._getSubmenuByElement($item);
      if (submenu && !submenu.isOverlayVisible()) {
        this._showSubmenu($item);
      }
    }, this._getDelay('show'));
  };
  _proto._clearTimeouts = function _clearTimeouts() {
    clearTimeout(this._hideSubmenuTimer);
    clearTimeout(this._showSubmenuTimer);
  };
  _proto._getSubmenuByElement = function _getSubmenuByElement($itemElement, itemData) {
    const submenu = this._getSubmenuByRootElement($itemElement);
    if (submenu) {
      return submenu;
    } else {
      itemData = itemData || this._getItemData($itemElement);
      const node = this._dataAdapter.getNodeByItem(itemData);
      return this._hasChildren(node) && this._renderSubmenuItems(node, $itemElement);
    }
  };
  _proto._updateSubmenuVisibilityOnClick = function _updateSubmenuVisibilityOnClick(actionArgs) {
    const args = actionArgs.args.length && actionArgs.args[0];
    if (!args || this._disabledGetter(args.itemData)) {
      return;
    }
    const $itemElement = (0, _renderer.default)(args.itemElement);
    const currentSubmenu = this._getSubmenuByElement($itemElement, args.itemData);
    this._updateSelectedItemOnClick(actionArgs);
    if (this._visibleSubmenu) {
      if (this._visibleSubmenu === currentSubmenu) {
        if (this.option('showFirstSubmenuMode') === 'onClick') this._hideSubmenu(this._visibleSubmenu);
        return;
      } else {
        this._hideSubmenu(this._visibleSubmenu);
      }
    }
    if (!currentSubmenu) {
      return;
    }
    if (!currentSubmenu.isOverlayVisible()) {
      this._showSubmenu($itemElement);
      return;
    }
  };
  _proto._optionChanged = function _optionChanged(args) {
    if (ACTIONS.indexOf(args.name) >= 0) {
      this._initActions();
      return;
    }
    switch (args.name) {
      case 'orientation':
      case 'submenuDirection':
        this._invalidate();
        break;
      case 'showFirstSubmenuMode':
      case 'hideSubmenuOnMouseLeave':
        break;
      case 'showSubmenuMode':
        this._changeSubmenusOption(args.name, args.value);
        break;
      case 'adaptivityEnabled':
        args.value ? this._initAdaptivity() : this._removeAdaptivity();
        break;
      case 'width':
        if (this._isAdaptivityEnabled()) {
          this._treeView.option(args.name, args.value);
          this._overlay.option(args.name, args.value);
        }
        _MenuBase.prototype._optionChanged.call(this, args);
        this._dimensionChanged();
        break;
      case 'animation':
        if (this._isAdaptivityEnabled()) {
          this._treeView.option('animationEnabled', !!args.value);
        }
        _MenuBase.prototype._optionChanged.call(this, args);
        break;
      default:
        if (this._isAdaptivityEnabled() && (args.name === args.fullName || args.name === 'items')) {
          // TODO: if(args.name === 'items') this._treeView.option('items', this.option('items')) or treeView.repaint() ?
          this._treeView.option(args.fullName, args.value);
        }
        _MenuBase.prototype._optionChanged.call(this, args);
    }
  };
  _proto._changeSubmenusOption = function _changeSubmenusOption(name, value) {
    (0, _iterator.each)(this._submenus, (index, submenu) => {
      submenu.option(name, value);
    });
  };
  _proto.selectItem = function selectItem(itemElement) {
    this._hideSubmenu(this._visibleSubmenu);
    _MenuBase.prototype.selectItem.call(this, itemElement);
  };
  _proto.unselectItem = function unselectItem(itemElement) {
    this._hideSubmenu(this._visibleSubmenu);
    _MenuBase.prototype.selectItem.call(this, itemElement);
  };
  return Menu;
}(_ui.default);
(0, _component_registrator.default)('dxMenu', Menu);
var _default = exports.default = Menu;
module.exports = exports.default;
module.exports.default = exports.default;
