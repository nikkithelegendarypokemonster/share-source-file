/**
* DevExtreme (esm/__internal/grids/grid_core/header_panel/m_header_panel.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
/* eslint-disable max-classes-per-file */
import $ from '../../../../core/renderer';
import { getPathParts } from '../../../../core/utils/data';
import { extend } from '../../../../core/utils/extend';
import { isDefined, isString } from '../../../../core/utils/type';
import messageLocalization from '../../../../localization/message';
import Toolbar from '../../../../ui/toolbar';
import { ColumnsView } from '../views/m_columns_view';
var HEADER_PANEL_CLASS = 'header-panel';
var TOOLBAR_BUTTON_CLASS = 'toolbar-button';
var TOOLBAR_ARIA_LABEL = '-ariaToolbar';
var DEFAULT_TOOLBAR_ITEM_NAMES = ['addRowButton', 'applyFilterButton', 'columnChooserButton', 'exportButton', 'groupPanel', 'revertButton', 'saveButton', 'searchPanel'];
export class HeaderPanel extends ColumnsView {
  init() {
    super.init();
    this._editingController = this.getController('editing');
    this._headerFilterController = this.getController('headerFilter');
    this.createAction('onToolbarPreparing', {
      excludeValidators: ['disabled', 'readOnly']
    });
  }
  /**
   * @extended: column_chooser, editing, filter_row, search
   */
  _getToolbarItems() {
    return [];
  }
  _getButtonContainer() {
    return $('<div>').addClass(this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS));
  }
  _getToolbarButtonClass(specificClass) {
    var secondClass = specificClass ? " ".concat(specificClass) : '';
    return this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS) + secondClass;
  }
  _getToolbarOptions() {
    var userToolbarOptions = this.option('toolbar');
    var options = {
      toolbarOptions: {
        items: this._getToolbarItems(),
        visible: userToolbarOptions === null || userToolbarOptions === void 0 ? void 0 : userToolbarOptions.visible,
        disabled: userToolbarOptions === null || userToolbarOptions === void 0 ? void 0 : userToolbarOptions.disabled,
        onItemRendered(e) {
          var itemRenderedCallback = e.itemData.onItemRendered;
          if (itemRenderedCallback) {
            itemRenderedCallback(e);
          }
        }
      }
    };
    var userItems = userToolbarOptions === null || userToolbarOptions === void 0 ? void 0 : userToolbarOptions.items;
    options.toolbarOptions.items = this._normalizeToolbarItems(options.toolbarOptions.items, userItems);
    this.executeAction('onToolbarPreparing', options);
    if (options.toolbarOptions && !isDefined(options.toolbarOptions.visible)) {
      var toolbarItems = options.toolbarOptions.items;
      options.toolbarOptions.visible = !!(toolbarItems === null || toolbarItems === void 0 ? void 0 : toolbarItems.length);
    }
    return options.toolbarOptions;
  }
  _normalizeToolbarItems(defaultItems, userItems) {
    defaultItems.forEach(button => {
      if (!DEFAULT_TOOLBAR_ITEM_NAMES.includes(button.name)) {
        throw new Error("Default toolbar item '".concat(button.name, "' is not added to DEFAULT_TOOLBAR_ITEM_NAMES"));
      }
    });
    var defaultProps = {
      location: 'after'
    };
    var isArray = Array.isArray(userItems);
    if (!isDefined(userItems)) {
      return defaultItems;
    }
    if (!isArray) {
      userItems = [userItems];
    }
    var defaultButtonsByNames = {};
    defaultItems.forEach(button => {
      defaultButtonsByNames[button.name] = button;
    });
    var normalizedItems = userItems.map(button => {
      if (isString(button)) {
        button = {
          name: button
        };
      }
      if (isDefined(button.name)) {
        if (isDefined(defaultButtonsByNames[button.name])) {
          button = extend(true, {}, defaultButtonsByNames[button.name], button);
        } else if (DEFAULT_TOOLBAR_ITEM_NAMES.includes(button.name)) {
          button = _extends(_extends({}, button), {
            visible: false
          });
        }
      }
      return extend(true, {}, defaultProps, button);
    });
    return isArray ? normalizedItems : normalizedItems[0];
  }
  _renderCore() {
    if (!this._toolbar) {
      var $headerPanel = this.element();
      $headerPanel.addClass(this.addWidgetPrefix(HEADER_PANEL_CLASS));
      var label = messageLocalization.format(this.component.NAME + TOOLBAR_ARIA_LABEL);
      var $toolbar = $('<div>').attr('aria-label', label).appendTo($headerPanel);
      this._toolbar = this._createComponent($toolbar, Toolbar, this._toolbarOptions);
    } else {
      this._toolbar.option(this._toolbarOptions);
    }
  }
  _columnOptionChanged() {}
  _handleDataChanged() {
    if (this._requireReady) {
      this.render();
    }
  }
  _isDisabledDefinedByUser(name) {
    var _a;
    var userItems = (_a = this.option('toolbar')) === null || _a === void 0 ? void 0 : _a.items;
    var userItem = userItems === null || userItems === void 0 ? void 0 : userItems.find(item => (item === null || item === void 0 ? void 0 : item.name) === name);
    return isDefined(userItem === null || userItem === void 0 ? void 0 : userItem.disabled);
  }
  render() {
    this._toolbarOptions = this._getToolbarOptions();
    super.render.apply(this, arguments);
  }
  setToolbarItemDisabled(name, disabled) {
    var _a;
    var toolbar = this._toolbar;
    var isDefinedByUser = this._isDisabledDefinedByUser(name);
    if (!toolbar || isDefinedByUser) {
      return;
    }
    var items = (_a = toolbar.option('items')) !== null && _a !== void 0 ? _a : [];
    var itemIndex = items.findIndex(item => item.name === name);
    if (itemIndex < 0) {
      return;
    }
    var item = toolbar.option("items[".concat(itemIndex, "]"));
    toolbar.option("items[".concat(itemIndex, "].disabled"), disabled);
    if (item.options) {
      toolbar.option("items[".concat(itemIndex, "].options.disabled"), disabled);
    }
  }
  updateToolbarDimensions() {
    var _a;
    (_a = this._toolbar) === null || _a === void 0 ? void 0 : _a.updateDimensions();
  }
  getHeaderPanel() {
    return this.element();
  }
  getHeight() {
    return this.getElementHeight();
  }
  optionChanged(args) {
    if (args.name === 'onToolbarPreparing') {
      this._invalidate();
      args.handled = true;
    }
    if (args.name === 'toolbar') {
      args.handled = true;
      if (this._toolbar) {
        var parts = getPathParts(args.fullName);
        var optionName = args.fullName.replace(/^toolbar\./, '');
        if (parts.length === 1) {
          // `toolbar` case
          var toolbarOptions = this._getToolbarOptions();
          this._toolbar.option(toolbarOptions);
        } else if (parts[1] === 'items') {
          if (parts.length === 2) {
            // `toolbar.items` case
            var _toolbarOptions = this._getToolbarOptions();
            this._toolbar.option('items', _toolbarOptions.items);
          } else if (parts.length === 3) {
            // `toolbar.items[i]` case
            var normalizedItem = this._normalizeToolbarItems(this._getToolbarItems(), args.value);
            this._toolbar.option(optionName, normalizedItem);
          } else if (parts.length >= 4) {
            // `toolbar.items[i].prop` case
            this._toolbar.option(optionName, args.value);
          }
        } else {
          // `toolbar.visible`, `toolbar.disabled` case
          this._toolbar.option(optionName, args.value);
        }
      }
    }
    super.optionChanged(args);
  }
  /**
   * @extended: column_chooser, editing
   */
  isVisible() {
    return !!(this._toolbarOptions && this._toolbarOptions.visible);
  }
  /**
   * @extended: DataGrid's grouping
   */
  allowDragging() {}
  hasGroupedColumns() {}
}
var resizing = Base => class HeaderPanelResizingExtender extends Base {
  _updateDimensionsCore() {
    // @ts-expect-error
    super._updateDimensionsCore.apply(this, arguments);
    this.getView('headerPanel').updateToolbarDimensions();
  }
};
export var headerPanelModule = {
  defaultOptions() {
    return {};
  },
  views: {
    headerPanel: HeaderPanel
  },
  extenders: {
    controllers: {
      resizing
    }
  }
};
