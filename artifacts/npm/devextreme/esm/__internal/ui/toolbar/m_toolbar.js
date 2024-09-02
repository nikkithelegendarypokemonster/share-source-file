/**
* DevExtreme (esm/__internal/ui/toolbar/m_toolbar.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import registerComponent from '../../../core/component_registrator';
import ToolbarBase from './m_toolbar.base';
import { toggleItemFocusableElementTabIndex } from './m_toolbar.utils';
import { MultiLineStrategy } from './strategy/m_toolbar.multiline';
import { SingleLineStrategy } from './strategy/m_toolbar.singleline';
const TOOLBAR_MULTILINE_CLASS = 'dx-toolbar-multiline';
const TOOLBAR_AUTO_HIDE_TEXT_CLASS = 'dx-toolbar-text-auto-hide';
class Toolbar extends ToolbarBase {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      menuItemTemplate: 'menuItem',
      menuContainer: undefined,
      overflowMenuVisible: false,
      multiline: false
    });
  }
  _isMultiline() {
    return this.option('multiline');
  }
  _dimensionChanged(dimension) {
    if (dimension === 'height') {
      return;
    }
    super._dimensionChanged();
    this._layoutStrategy._dimensionChanged();
  }
  _initMarkup() {
    super._initMarkup();
    this._updateFocusableItemsTabIndex();
    this._layoutStrategy._initMarkup();
  }
  _renderToolbar() {
    super._renderToolbar();
    this._renderLayoutStrategy();
  }
  _itemContainer() {
    if (this._isMultiline()) {
      return this._$toolbarItemsContainer;
    }
    return super._itemContainer();
  }
  _renderLayoutStrategy() {
    // @ts-expect-error
    this.$element().toggleClass(TOOLBAR_MULTILINE_CLASS, this._isMultiline());
    this._layoutStrategy = this._isMultiline() ? new MultiLineStrategy(this) : new SingleLineStrategy(this);
  }
  _renderSections() {
    if (this._isMultiline()) {
      return;
    }
    return super._renderSections();
  }
  _postProcessRenderItems() {
    this._layoutStrategy._hideOverflowItems();
    this._layoutStrategy._updateMenuVisibility();
    super._postProcessRenderItems();
    this._layoutStrategy._renderMenuItems();
  }
  _renderItem(index, item, itemContainer, $after) {
    const itemElement = super._renderItem(index, item, itemContainer, $after);
    this._layoutStrategy._renderItem(item, itemElement);
    const {
      widget,
      showText
    } = item;
    if (widget === 'dxButton' && showText === 'inMenu') {
      itemElement.toggleClass(TOOLBAR_AUTO_HIDE_TEXT_CLASS);
    }
    return itemElement;
  }
  // for filemanager
  _getItemsWidth() {
    return this._layoutStrategy._getItemsWidth();
  }
  // for filemanager
  _getMenuItems() {
    return this._layoutStrategy._getMenuItems();
  }
  _getToolbarItems() {
    return this._layoutStrategy._getToolbarItems();
  }
  _arrangeItems() {
    // @ts-expect-error
    if (this.$element().is(':hidden')) {
      return;
    }
    const elementWidth = this._layoutStrategy._arrangeItems();
    if (!this._isMultiline()) {
      super._arrangeItems(elementWidth);
    }
  }
  _itemOptionChanged(item, property, value, prevValue) {
    if (!this._isMenuItem(item)) {
      super._itemOptionChanged(item, property, value, prevValue);
    }
    this._layoutStrategy._itemOptionChanged(item, property, value);
    if (property === 'disabled' || property === 'options.disabled') {
      toggleItemFocusableElementTabIndex(this, item);
    }
    if (property === 'location') {
      this.repaint();
    }
  }
  _updateFocusableItemsTabIndex() {
    this._getToolbarItems().forEach(item => toggleItemFocusableElementTabIndex(this, item));
  }
  _isMenuItem(itemData) {
    return itemData.location === 'menu' || itemData.locateInMenu === 'always';
  }
  _isToolbarItem(itemData) {
    return itemData.location === undefined || itemData.locateInMenu === 'never';
  }
  _optionChanged(args) {
    const {
      name,
      value
    } = args;
    this._layoutStrategy._optionChanged(name, value);
    switch (name) {
      case 'menuContainer':
      case 'menuItemTemplate':
      case 'overflowMenuVisible':
        break;
      case 'multiline':
        this._invalidate();
        break;
      case 'disabled':
        super._optionChanged(args);
        this._updateFocusableItemsTabIndex();
        break;
      default:
        super._optionChanged(args);
    }
  }
  // it is not public
  updateDimensions() {
    this._dimensionChanged();
  }
}
// @ts-expect-error
registerComponent('dxToolbar', Toolbar);
export default Toolbar;
