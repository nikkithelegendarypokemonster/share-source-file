/**
* DevExtreme (esm/__internal/ui/toolbar/internal/m_toolbar.menu.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import '../../../../ui/popup/ui.popup';
import devices from '../../../../core/devices';
import $ from '../../../../core/renderer';
import { ChildDefaultTemplate } from '../../../../core/templates/child_default_template';
import { extend } from '../../../../core/utils/extend';
import { getOuterHeight } from '../../../../core/utils/size';
import { getWindow } from '../../../../core/utils/window';
import Button from '../../../../ui/button';
import { isFluent, isMaterialBased } from '../../../../ui/themes';
import Widget from '../../../ui/widget';
import { toggleItemFocusableElementTabIndex } from '../m_toolbar.utils';
import ToolbarMenuList from './m_toolbar.menu.list';
const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';
const DROP_DOWN_MENU_POPUP_CLASS = 'dx-dropdownmenu-popup';
const DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = 'dx-dropdownmenu-popup-wrapper';
const DROP_DOWN_MENU_LIST_CLASS = 'dx-dropdownmenu-list';
const DROP_DOWN_MENU_BUTTON_CLASS = 'dx-dropdownmenu-button';
const POPUP_BOUNDARY_VERTICAL_OFFSET = 10;
const POPUP_VERTICAL_OFFSET = 3;
export default class DropDownMenu extends Widget {
  _supportedKeys() {
    var _this$_list;
    let extension = {};
    if (!this.option('opened') || !((_this$_list = this._list) !== null && _this$_list !== void 0 && _this$_list.option('focusedElement'))) {
      // @ts-expect-error
      extension = this._button._supportedKeys();
    }
    return extend(super._supportedKeys(), extension, {
      tab() {
        this._popup && this._popup.hide();
      }
    });
  }
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      items: [],
      // @ts-expect-error
      onItemClick: null,
      dataSource: null,
      itemTemplate: 'item',
      onButtonClick: null,
      activeStateEnabled: true,
      hoverStateEnabled: true,
      opened: false,
      onItemRendered: null,
      closeOnClick: true,
      useInkRipple: false,
      container: undefined,
      animation: {
        show: {
          type: 'fade',
          from: 0,
          to: 1
        },
        hide: {
          type: 'fade',
          to: 0
        }
      }
    });
  }
  _defaultOptionsRules() {
    return super._defaultOptionsRules().concat([{
      device() {
        return devices.real().deviceType === 'desktop' && !devices.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }, {
      device() {
        // @ts-expect-error
        return isMaterialBased();
      },
      options: {
        useInkRipple: true,
        animation: {
          show: {
            type: 'pop',
            duration: 200,
            from: {
              scale: 0
            },
            to: {
              scale: 1
            }
          },
          hide: {
            type: 'pop',
            duration: 200,
            from: {
              scale: 1
            },
            to: {
              scale: 0
            }
          }
        }
      }
    }]);
  }
  _init() {
    super._init();
    // @ts-expect-error
    this.$element().addClass(DROP_DOWN_MENU_CLASS);
    this._initItemClickAction();
    this._initButtonClickAction();
  }
  _initItemClickAction() {
    this._itemClickAction = this._createActionByOption('onItemClick');
  }
  _initButtonClickAction() {
    this._buttonClickAction = this._createActionByOption('onButtonClick');
  }
  _initTemplates() {
    this._templateManager.addDefaultTemplates({
      content: new ChildDefaultTemplate('content')
    });
    super._initTemplates();
  }
  _initMarkup() {
    this._renderButton();
    super._initMarkup();
  }
  _render() {
    super._render();
    this.setAria({
      haspopup: true,
      expanded: this.option('opened')
    });
  }
  _renderContentImpl() {
    if (this.option('opened')) {
      this._renderPopup();
    }
  }
  _clean() {
    this._cleanFocusState();
    this._list && this._list.$element().remove();
    this._popup && this._popup.$element().remove();
    delete this._list;
    delete this._popup;
  }
  _renderButton() {
    // @ts-expect-error
    const $button = this.$element().addClass(DROP_DOWN_MENU_BUTTON_CLASS);
    this._button = this._createComponent($button, Button, {
      icon: 'overflow',
      template: 'content',
      // @ts-expect-error
      stylingMode: isFluent() ? 'text' : 'contained',
      // @ts-expect-error
      useInkRipple: this.option('useInkRipple'),
      hoverStateEnabled: false,
      focusStateEnabled: false,
      onClick: e => {
        this.option('opened', !this.option('opened'));
        this._buttonClickAction(e);
      }
    });
  }
  _toggleActiveState($element, value, e) {
    // @ts-expect-error
    this._button._toggleActiveState($element, value, e);
  }
  _toggleMenuVisibility(opened) {
    var _this$_popup, _this$_popup2;
    const state = opened ?? !((_this$_popup = this._popup) !== null && _this$_popup !== void 0 && _this$_popup.option('visible'));
    if (opened) {
      this._renderPopup();
    }
    (_this$_popup2 = this._popup) === null || _this$_popup2 === void 0 || _this$_popup2.toggle(state);
    this.setAria('expanded', state);
  }
  _renderPopup() {
    if (this._$popup) {
      return;
    }
    this._$popup = $('<div>').appendTo(this.$element());
    const {
      rtlEnabled,
      container,
      animation
    } = this.option();
    this._popup = this._createComponent(this._$popup, 'dxPopup', {
      onInitialized(_ref) {
        let {
          component
        } = _ref;
        // @ts-expect-error
        component.$wrapper().addClass(DROP_DOWN_MENU_POPUP_WRAPPER_CLASS).addClass(DROP_DOWN_MENU_POPUP_CLASS);
      },
      deferRendering: false,
      preventScrollEvents: false,
      contentTemplate: contentElement => this._renderList(contentElement),
      _ignoreFunctionValueDeprecation: true,
      maxHeight: () => this._getMaxHeight(),
      position: {
        // @ts-expect-error
        my: `top ${rtlEnabled ? 'left' : 'right'}`,
        // @ts-expect-error
        at: `bottom ${rtlEnabled ? 'left' : 'right'}`,
        collision: 'fit flip',
        // @ts-expect-error
        offset: {
          v: POPUP_VERTICAL_OFFSET
        },
        of: this.$element()
      },
      animation,
      onOptionChanged: _ref2 => {
        let {
          name,
          value
        } = _ref2;
        if (name === 'visible') {
          this.option('opened', value);
        }
      },
      container,
      autoResizeEnabled: false,
      height: 'auto',
      width: 'auto',
      hideOnOutsideClick: e => this._closeOutsideDropDownHandler(e),
      hideOnParentScroll: true,
      shading: false,
      dragEnabled: false,
      showTitle: false,
      fullScreen: false,
      _fixWrapperPosition: true
    });
  }
  _getMaxHeight() {
    const $element = this.$element();
    // @ts-expect-error
    const offsetTop = $element.offset().top;
    const windowHeight = getOuterHeight(getWindow());
    const maxHeight = Math.max(offsetTop, windowHeight - offsetTop - getOuterHeight($element));
    return Math.min(windowHeight, maxHeight - POPUP_VERTICAL_OFFSET - POPUP_BOUNDARY_VERTICAL_OFFSET);
  }
  _closeOutsideDropDownHandler(e) {
    // @ts-expect-error
    const isOutsideClick = !$(e.target).closest(this.$element()).length;
    return isOutsideClick;
  }
  _renderList(contentElement) {
    const $content = $(contentElement);
    $content.addClass(DROP_DOWN_MENU_LIST_CLASS);
    // @ts-expect-error
    this._list = this._createComponent($content, ToolbarMenuList, {
      dataSource: this._getListDataSource(),
      pageLoadMode: 'scrollBottom',
      indicateLoading: false,
      noDataText: '',
      itemTemplate: this.option('itemTemplate'),
      onItemClick: e => {
        if (this.option('closeOnClick')) {
          this.option('opened', false);
        }
        this._itemClickAction(e);
      },
      tabIndex: -1,
      focusStateEnabled: false,
      activeStateEnabled: true,
      onItemRendered: this.option('onItemRendered'),
      _itemAttributes: {
        role: 'menuitem'
      }
    });
  }
  _itemOptionChanged(item, property, value) {
    var _this$_list2;
    // @ts-expect-error
    (_this$_list2 = this._list) === null || _this$_list2 === void 0 || _this$_list2._itemOptionChanged(item, property, value);
    toggleItemFocusableElementTabIndex(this._list, item);
  }
  _getListDataSource() {
    return this.option('dataSource') ?? this.option('items');
  }
  _setListDataSource() {
    var _this$_list3;
    (_this$_list3 = this._list) === null || _this$_list3 === void 0 || _this$_list3.option('dataSource', this._getListDataSource());
    delete this._deferRendering;
  }
  _getKeyboardListeners() {
    return super._getKeyboardListeners().concat([this._list]);
  }
  _toggleVisibility(visible) {
    var _this$_button;
    super._toggleVisibility(visible);
    (_this$_button = this._button) === null || _this$_button === void 0 || _this$_button.option('visible', visible);
  }
  _optionChanged(args) {
    var _this$_list4, _this$_list5, _this$_list6;
    const {
      name,
      value
    } = args;
    switch (name) {
      case 'items':
      case 'dataSource':
        if (!this.option('opened')) {
          this._deferRendering = true;
        } else {
          this._setListDataSource();
        }
        break;
      case 'itemTemplate':
        (_this$_list4 = this._list) === null || _this$_list4 === void 0 || _this$_list4.option(name, this._getTemplate(value));
        break;
      case 'onItemClick':
        this._initItemClickAction();
        break;
      case 'onButtonClick':
        this._buttonClickAction();
        break;
      case 'useInkRipple':
        this._invalidate();
        break;
      case 'focusStateEnabled':
        (_this$_list5 = this._list) === null || _this$_list5 === void 0 || _this$_list5.option(name, value);
        super._optionChanged(args);
        break;
      case 'onItemRendered':
        (_this$_list6 = this._list) === null || _this$_list6 === void 0 || _this$_list6.option(name, value);
        break;
      case 'opened':
        if (this._deferRendering) {
          this._setListDataSource();
        }
        this._toggleMenuVisibility(value);
        this._updateFocusableItemsTabIndex();
        break;
      case 'closeOnClick':
        break;
      case 'container':
        this._popup && this._popup.option(name, value);
        break;
      case 'disabled':
        if (this._list) {
          this._updateFocusableItemsTabIndex();
        }
        break;
      default:
        super._optionChanged(args);
    }
  }
  _updateFocusableItemsTabIndex() {
    // @ts-expect-error
    this.option('items').forEach(item => toggleItemFocusableElementTabIndex(this._list, item));
  }
}
