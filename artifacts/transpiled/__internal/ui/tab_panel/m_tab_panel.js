"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _element = require("../../../core/element");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _bindable_template = require("../../../core/templates/bindable_template");
var _extend = require("../../../core/utils/extend");
var _icon = require("../../../core/utils/icon");
var _support = require("../../../core/utils/support");
var _type = require("../../../core/utils/type");
var _multi_view = _interopRequireDefault(require("../../../ui/multi_view"));
var _tabs = _interopRequireDefault(require("../../../ui/tabs"));
var _themes = require("../../../ui/themes");
var _m_item = _interopRequireDefault(require("./m_item"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-named-default

const TABPANEL_CLASS = 'dx-tabpanel';
const TABPANEL_TABS_CLASS = 'dx-tabpanel-tabs';
const TABPANEL_TABS_ITEM_CLASS = 'dx-tabpanel-tab';
const TABPANEL_CONTAINER_CLASS = 'dx-tabpanel-container';
const TABS_ITEM_TEXT_CLASS = 'dx-tab-text';
const DISABLED_FOCUSED_TAB_CLASS = 'dx-disabled-focused-tab';
const TABS_ITEM_TEXT_SPAN_CLASS = 'dx-tab-text-span';
const TABS_ITEM_TEXT_SPAN_PSEUDO_CLASS = 'dx-tab-text-span-pseudo';
const TABPANEL_TABS_POSITION_CLASS = {
  top: 'dx-tabpanel-tabs-position-top',
  right: 'dx-tabpanel-tabs-position-right',
  bottom: 'dx-tabpanel-tabs-position-bottom',
  left: 'dx-tabpanel-tabs-position-left'
};
const TABS_POSITION = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left'
};
const TABS_INDICATOR_POSITION_BY_TABS_POSITION = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right'
};
const TABS_ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};
const ICON_POSITION = {
  top: 'top',
  end: 'end',
  bottom: 'bottom',
  start: 'start'
};
const STYLING_MODE = {
  primary: 'primary',
  secondary: 'secondary'
};
// @ts-expect-error
const TabPanel = _multi_view.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      itemTitleTemplate: 'title',
      hoverStateEnabled: true,
      selectOnFocus: false,
      showNavButtons: false,
      scrollByContent: true,
      scrollingEnabled: true,
      tabsPosition: TABS_POSITION.top,
      iconPosition: ICON_POSITION.start,
      stylingMode: STYLING_MODE.primary,
      onTitleClick: null,
      onTitleHold: null,
      onTitleRendered: null,
      badgeExpr(data) {
        return data ? data.badge : undefined;
      },
      _tabsIndicatorPosition: null
    });
  },
  _defaultOptionsRules() {
    const themeName = (0, _themes.current)();
    return this.callBase().concat([{
      device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }, {
      device() {
        return !_support.touch;
      },
      options: {
        swipeEnabled: false
      }
    }, {
      device: {
        platform: 'generic'
      },
      options: {
        animationEnabled: false
      }
    }, {
      device() {
        return (0, _themes.isFluent)(themeName);
      },
      options: {
        stylingMode: STYLING_MODE.secondary
      }
    }, {
      device() {
        return (0, _themes.isMaterialBased)(themeName);
      },
      options: {
        iconPosition: ICON_POSITION.top
      }
    }]);
  },
  _init() {
    this.callBase();
    this.$element().addClass(TABPANEL_CLASS);
    this._toggleTabPanelTabsPositionClass();
  },
  _getElementAria() {
    return {
      role: 'tabpanel'
    };
  },
  _getItemAria() {
    return {
      role: 'tabpanel'
    };
  },
  _initMarkup() {
    this.callBase();
    this._createTitleActions();
    this._renderLayout();
  },
  _prepareTabsItemTemplate(data, $container) {
    const $iconElement = (0, _icon.getImageContainer)(data === null || data === void 0 ? void 0 : data.icon);
    if ($iconElement) {
      $container.append($iconElement);
    }
    const title = (0, _type.isPlainObject)(data) ? data === null || data === void 0 ? void 0 : data.title : data;
    if ((0, _type.isDefined)(title) && !(0, _type.isPlainObject)(title)) {
      const $tabTextSpan = (0, _renderer.default)('<span>').addClass(TABS_ITEM_TEXT_SPAN_CLASS);
      // @ts-expect-error
      $tabTextSpan.append(_dom_adapter.default.createTextNode(title));
      const $tabTextSpanPseudo = (0, _renderer.default)('<span>').addClass(TABS_ITEM_TEXT_SPAN_PSEUDO_CLASS);
      // @ts-expect-error
      $tabTextSpanPseudo.append(_dom_adapter.default.createTextNode(title));
      $tabTextSpanPseudo.appendTo($tabTextSpan);
      $tabTextSpan.appendTo($container);
    }
  },
  _initTemplates() {
    this.callBase();
    this._templateManager.addDefaultTemplates({
      title: new _bindable_template.BindableTemplate(($container, data) => {
        this._prepareTabsItemTemplate(data, $container);
        const $tabItem = (0, _renderer.default)('<div>').addClass(TABS_ITEM_TEXT_CLASS);
        $container.wrapInner($tabItem);
      }, ['title', 'icon'], this.option('integrationOptions.watchMethod'))
    });
  },
  _createTitleActions() {
    this._createTitleClickAction();
    this._createTitleHoldAction();
    this._createTitleRenderedAction();
  },
  _createTitleClickAction() {
    this._titleClickAction = this._createActionByOption('onTitleClick');
  },
  _createTitleHoldAction() {
    this._titleHoldAction = this._createActionByOption('onTitleHold');
  },
  _createTitleRenderedAction() {
    this._titleRenderedAction = this._createActionByOption('onTitleRendered');
  },
  _renderLayout() {
    if (this._tabs) {
      return;
    }
    const $element = this.$element();
    this._$tabContainer = (0, _renderer.default)('<div>').addClass(TABPANEL_TABS_CLASS).appendTo($element);
    const $tabs = (0, _renderer.default)('<div>').appendTo(this._$tabContainer);
    this._tabs = this._createComponent($tabs, _tabs.default, this._tabConfig());
    this._$container = (0, _renderer.default)('<div>').addClass(TABPANEL_CONTAINER_CLASS).appendTo($element);
    this._$container.append(this._$wrapper);
  },
  _refreshActiveDescendant() {
    if (!this._tabs) {
      return;
    }
    const tabs = this._tabs;
    const tabItems = tabs.itemElements();
    const $activeTab = (0, _renderer.default)(tabItems[tabs.option('selectedIndex')]);
    const id = this.getFocusedItemId();
    this.setAria('controls', undefined, (0, _renderer.default)(tabItems));
    this.setAria('controls', id, $activeTab);
  },
  _getTabsIndicatorPosition() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      _tabsIndicatorPosition,
      tabsPosition
    } = this.option();
    return _tabsIndicatorPosition ?? TABS_INDICATOR_POSITION_BY_TABS_POSITION[tabsPosition];
  },
  _tabConfig() {
    const tabsIndicatorPosition = this._getTabsIndicatorPosition();
    return {
      selectOnFocus: true,
      focusStateEnabled: this.option('focusStateEnabled'),
      hoverStateEnabled: this.option('hoverStateEnabled'),
      repaintChangesOnly: this.option('repaintChangesOnly'),
      tabIndex: this.option('tabIndex'),
      selectedIndex: this.option('selectedIndex'),
      badgeExpr: this.option('badgeExpr'),
      onItemClick: this._titleClickAction.bind(this),
      onItemHold: this._titleHoldAction.bind(this),
      itemHoldTimeout: this.option('itemHoldTimeout'),
      onSelectionChanging: e => {
        const newTabsSelectedItemData = e.addedItems[0];
        const newTabsSelectedIndex = this._getIndexByItemData(newTabsSelectedItemData);
        const selectingResult = this.selectItem(newTabsSelectedIndex);
        const promiseState = selectingResult.state();
        if (promiseState !== 'pending') {
          // NOTE: Keep selection change process synchronious if possible.
          e.cancel = promiseState === 'rejected';
          return;
        }
        e.cancel = new Promise(resolve => {
          selectingResult.done(() => {
            resolve(false);
          }).fail(() => {
            resolve(true);
          });
        });
      },
      onSelectionChanged: () => {
        this._refreshActiveDescendant();
      },
      onItemRendered: this._titleRenderedAction.bind(this),
      itemTemplate: this._getTemplateByOption('itemTitleTemplate'),
      items: this.option('items'),
      noDataText: null,
      scrollingEnabled: this.option('scrollingEnabled'),
      scrollByContent: this.option('scrollByContent'),
      showNavButtons: this.option('showNavButtons'),
      itemTemplateProperty: 'tabTemplate',
      loopItemFocus: this.option('loop'),
      selectionRequired: true,
      onOptionChanged: function (args) {
        if (args.name === 'focusedElement') {
          if (args.value) {
            const $value = (0, _renderer.default)(args.value);
            const $newItem = this._itemElements().eq($value.index());
            this.option('focusedElement', (0, _element.getPublicElement)($newItem));
          } else {
            this.option('focusedElement', args.value);
          }
        }
      }.bind(this),
      onFocusIn: function (args) {
        this._focusInHandler(args.event);
      }.bind(this),
      onFocusOut: function (args) {
        if (!this._isFocusOutHandlerExecuting) {
          this._focusOutHandler(args.event);
        }
      }.bind(this),
      orientation: this._getTabsOrientation(),
      iconPosition: this.option('iconPosition'),
      stylingMode: this.option('stylingMode'),
      _itemAttributes: {
        class: TABPANEL_TABS_ITEM_CLASS
      },
      _indicatorPosition: tabsIndicatorPosition
    };
  },
  _renderFocusTarget() {
    this._focusTarget().attr('tabIndex', -1);
  },
  _getTabsOrientation() {
    const {
      tabsPosition
    } = this.option();
    if ([TABS_POSITION.right, TABS_POSITION.left].includes(tabsPosition)) {
      return TABS_ORIENTATION.vertical;
    }
    return TABS_ORIENTATION.horizontal;
  },
  _getTabPanelTabsPositionClass() {
    const position = this.option('tabsPosition');
    switch (position) {
      case TABS_POSITION.right:
        return TABPANEL_TABS_POSITION_CLASS.right;
      case TABS_POSITION.bottom:
        return TABPANEL_TABS_POSITION_CLASS.bottom;
      case TABS_POSITION.left:
        return TABPANEL_TABS_POSITION_CLASS.left;
      case TABS_POSITION.top:
      default:
        return TABPANEL_TABS_POSITION_CLASS.top;
    }
  },
  _toggleTabPanelTabsPositionClass() {
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const key in TABPANEL_TABS_POSITION_CLASS) {
      this.$element().removeClass(TABPANEL_TABS_POSITION_CLASS[key]);
    }
    const newClass = this._getTabPanelTabsPositionClass();
    this.$element().addClass(newClass);
  },
  _updateTabsOrientation() {
    const orientation = this._getTabsOrientation();
    this._setTabsOption('orientation', orientation);
  },
  _toggleWrapperFocusedClass(isFocused) {
    this._toggleFocusClass(isFocused, this._$wrapper);
  },
  _toggleDisabledFocusedClass(isFocused) {
    this._focusTarget().toggleClass(DISABLED_FOCUSED_TAB_CLASS, isFocused);
  },
  _updateFocusState(e, isFocused) {
    this.callBase(e, isFocused);
    const isTabsTarget = e.target === this._tabs._focusTarget().get(0);
    const isMultiViewTarget = e.target === this._focusTarget().get(0);
    if (isTabsTarget) {
      this._toggleFocusClass(isFocused, this._focusTarget());
    }
    if (isTabsTarget || isMultiViewTarget) {
      const isDisabled = this._isDisabled(this.option('focusedElement'));
      this._toggleWrapperFocusedClass(isFocused && !isDisabled);
      this._toggleDisabledFocusedClass(isFocused && isDisabled);
    }
    if (isMultiViewTarget) {
      this._toggleFocusClass(isFocused, this._tabs.$element());
      this._toggleFocusClass(isFocused, this._tabs.option('focusedElement'));
    }
  },
  _focusOutHandler(e) {
    this._isFocusOutHandlerExecuting = true;
    this.callBase.apply(this, arguments);
    this._tabs._focusOutHandler(e);
    this._isFocusOutHandlerExecuting = false;
  },
  _setTabsOption(name, value) {
    if (this._tabs) {
      this._tabs.option(name, value);
    }
  },
  _postprocessSwipe(_ref) {
    let {
      swipedTabsIndex
    } = _ref;
    this._setTabsOption('selectedIndex', swipedTabsIndex);
  },
  _visibilityChanged(visible) {
    if (visible) {
      this._tabs._dimensionChanged();
    }
  },
  registerKeyHandler(key, handler) {
    this.callBase(key, handler);
    if (this._tabs) {
      this._tabs.registerKeyHandler(key, handler);
    }
  },
  repaint() {
    this.callBase();
    this._tabs.repaint();
  },
  _updateTabsIndicatorPosition() {
    const value = this._getTabsIndicatorPosition();
    this._setTabsOption('_indicatorPosition', value);
  },
  _optionChanged(args) {
    const {
      name,
      value,
      fullName
    } = args;
    switch (name) {
      case 'dataSource':
        this.callBase(args);
        break;
      case 'items':
        this._setTabsOption(name, this.option(name));
        if (!this.option('repaintChangesOnly')) {
          this._tabs.repaint();
        }
        this.callBase(args);
        break;
      case 'width':
        this.callBase(args);
        this._tabs.repaint();
        break;
      case 'selectedIndex':
      case 'selectedItem':
        {
          this._setTabsOption(fullName, value);
          this.callBase(args);
          if (this.option('focusStateEnabled') === true) {
            const selectedIndex = this.option('selectedIndex');
            const selectedTabContent = this._itemElements().eq(selectedIndex);
            this.option('focusedElement', (0, _element.getPublicElement)(selectedTabContent));
          }
          break;
        }
      case 'itemHoldTimeout':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        this._setTabsOption(fullName, value);
        this.callBase(args);
        break;
      case 'scrollingEnabled':
      case 'scrollByContent':
      case 'showNavButtons':
        this._setTabsOption(fullName, value);
        break;
      case 'focusedElement':
        {
          const id = value ? (0, _renderer.default)(value).index() : value;
          const newItem = value ? this._tabs._itemElements().eq(id) : value;
          this._setTabsOption('focusedElement', (0, _element.getPublicElement)(newItem));
          if (value) {
            const isDisabled = this._isDisabled(value);
            this._toggleWrapperFocusedClass(!isDisabled);
            this._toggleDisabledFocusedClass(isDisabled);
          }
          this.callBase(args);
          break;
        }
      case 'itemTitleTemplate':
        this._setTabsOption('itemTemplate', this._getTemplateByOption('itemTitleTemplate'));
        break;
      case 'onTitleClick':
        this._createTitleClickAction();
        this._setTabsOption('onItemClick', this._titleClickAction.bind(this));
        break;
      case 'onTitleHold':
        this._createTitleHoldAction();
        this._setTabsOption('onItemHold', this._titleHoldAction.bind(this));
        break;
      case 'onTitleRendered':
        this._createTitleRenderedAction();
        this._setTabsOption('onItemRendered', this._titleRenderedAction.bind(this));
        break;
      case 'loop':
        this._setTabsOption('loopItemFocus', value);
        break;
      case 'badgeExpr':
        this._invalidate();
        break;
      case 'tabsPosition':
        this._toggleTabPanelTabsPositionClass();
        this._updateTabsIndicatorPosition();
        this._updateTabsOrientation();
        break;
      case 'iconPosition':
        this._setTabsOption('iconPosition', value);
        break;
      case 'stylingMode':
        this._setTabsOption('stylingMode', value);
        break;
      case '_tabsIndicatorPosition':
        this._setTabsOption('_indicatorPosition', value);
        break;
      default:
        this.callBase(args);
    }
  }
});
TabPanel.ItemClass = _m_item.default;
(0, _component_registrator.default)('dxTabPanel', TabPanel);
var _default = exports.default = TabPanel;