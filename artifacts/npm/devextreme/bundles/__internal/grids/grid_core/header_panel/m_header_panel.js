/**
* DevExtreme (bundles/__internal/grids/grid_core/header_panel/m_header_panel.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.headerPanelModule = exports.HeaderPanel = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _data = require("../../../../core/utils/data");
var _extend = require("../../../../core/utils/extend");
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _toolbar = _interopRequireDefault(require("../../../../ui/toolbar"));
var _m_columns_view = require("../views/m_columns_view");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const HEADER_PANEL_CLASS = 'header-panel';
const TOOLBAR_BUTTON_CLASS = 'toolbar-button';
const TOOLBAR_ARIA_LABEL = '-ariaToolbar';
const DEFAULT_TOOLBAR_ITEM_NAMES = ['addRowButton', 'applyFilterButton', 'columnChooserButton', 'exportButton', 'groupPanel', 'revertButton', 'saveButton', 'searchPanel'];
let HeaderPanel = exports.HeaderPanel = /*#__PURE__*/function (_ColumnsView) {
  _inheritsLoose(HeaderPanel, _ColumnsView);
  function HeaderPanel() {
    return _ColumnsView.apply(this, arguments) || this;
  }
  var _proto = HeaderPanel.prototype;
  _proto.init = function init() {
    _ColumnsView.prototype.init.call(this);
    this._editingController = this.getController('editing');
    this._headerFilterController = this.getController('headerFilter');
    this.createAction('onToolbarPreparing', {
      excludeValidators: ['disabled', 'readOnly']
    });
  }
  /**
   * @extended: column_chooser, editing, filter_row, search
   */;
  _proto._getToolbarItems = function _getToolbarItems() {
    return [];
  };
  _proto._getButtonContainer = function _getButtonContainer() {
    return (0, _renderer.default)('<div>').addClass(this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS));
  };
  _proto._getToolbarButtonClass = function _getToolbarButtonClass(specificClass) {
    const secondClass = specificClass ? " ".concat(specificClass) : '';
    return this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS) + secondClass;
  };
  _proto._getToolbarOptions = function _getToolbarOptions() {
    const userToolbarOptions = this.option('toolbar');
    const options = {
      toolbarOptions: {
        items: this._getToolbarItems(),
        visible: userToolbarOptions === null || userToolbarOptions === void 0 ? void 0 : userToolbarOptions.visible,
        disabled: userToolbarOptions === null || userToolbarOptions === void 0 ? void 0 : userToolbarOptions.disabled,
        onItemRendered(e) {
          const itemRenderedCallback = e.itemData.onItemRendered;
          if (itemRenderedCallback) {
            itemRenderedCallback(e);
          }
        }
      }
    };
    const userItems = userToolbarOptions === null || userToolbarOptions === void 0 ? void 0 : userToolbarOptions.items;
    options.toolbarOptions.items = this._normalizeToolbarItems(options.toolbarOptions.items, userItems);
    this.executeAction('onToolbarPreparing', options);
    if (options.toolbarOptions && !(0, _type.isDefined)(options.toolbarOptions.visible)) {
      const toolbarItems = options.toolbarOptions.items;
      options.toolbarOptions.visible = !!(toolbarItems === null || toolbarItems === void 0 ? void 0 : toolbarItems.length);
    }
    return options.toolbarOptions;
  };
  _proto._normalizeToolbarItems = function _normalizeToolbarItems(defaultItems, userItems) {
    defaultItems.forEach(button => {
      if (!DEFAULT_TOOLBAR_ITEM_NAMES.includes(button.name)) {
        throw new Error("Default toolbar item '".concat(button.name, "' is not added to DEFAULT_TOOLBAR_ITEM_NAMES"));
      }
    });
    const defaultProps = {
      location: 'after'
    };
    const isArray = Array.isArray(userItems);
    if (!(0, _type.isDefined)(userItems)) {
      return defaultItems;
    }
    if (!isArray) {
      userItems = [userItems];
    }
    const defaultButtonsByNames = {};
    defaultItems.forEach(button => {
      defaultButtonsByNames[button.name] = button;
    });
    const normalizedItems = userItems.map(button => {
      if ((0, _type.isString)(button)) {
        button = {
          name: button
        };
      }
      if ((0, _type.isDefined)(button.name)) {
        if ((0, _type.isDefined)(defaultButtonsByNames[button.name])) {
          button = (0, _extend.extend)(true, {}, defaultButtonsByNames[button.name], button);
        } else if (DEFAULT_TOOLBAR_ITEM_NAMES.includes(button.name)) {
          button = _extends(_extends({}, button), {
            visible: false
          });
        }
      }
      return (0, _extend.extend)(true, {}, defaultProps, button);
    });
    return isArray ? normalizedItems : normalizedItems[0];
  };
  _proto._renderCore = function _renderCore() {
    if (!this._toolbar) {
      const $headerPanel = this.element();
      $headerPanel.addClass(this.addWidgetPrefix(HEADER_PANEL_CLASS));
      const label = _message.default.format(this.component.NAME + TOOLBAR_ARIA_LABEL);
      const $toolbar = (0, _renderer.default)('<div>').attr('aria-label', label).appendTo($headerPanel);
      this._toolbar = this._createComponent($toolbar, _toolbar.default, this._toolbarOptions);
    } else {
      this._toolbar.option(this._toolbarOptions);
    }
  };
  _proto._columnOptionChanged = function _columnOptionChanged() {};
  _proto._handleDataChanged = function _handleDataChanged() {
    if (this._requireReady) {
      this.render();
    }
  };
  _proto._isDisabledDefinedByUser = function _isDisabledDefinedByUser(name) {
    var _a;
    const userItems = (_a = this.option('toolbar')) === null || _a === void 0 ? void 0 : _a.items;
    const userItem = userItems === null || userItems === void 0 ? void 0 : userItems.find(item => (item === null || item === void 0 ? void 0 : item.name) === name);
    return (0, _type.isDefined)(userItem === null || userItem === void 0 ? void 0 : userItem.disabled);
  };
  _proto.render = function render() {
    this._toolbarOptions = this._getToolbarOptions();
    _ColumnsView.prototype.render.apply(this, arguments);
  };
  _proto.setToolbarItemDisabled = function setToolbarItemDisabled(name, disabled) {
    var _a;
    const toolbar = this._toolbar;
    const isDefinedByUser = this._isDisabledDefinedByUser(name);
    if (!toolbar || isDefinedByUser) {
      return;
    }
    const items = (_a = toolbar.option('items')) !== null && _a !== void 0 ? _a : [];
    const itemIndex = items.findIndex(item => item.name === name);
    if (itemIndex < 0) {
      return;
    }
    const item = toolbar.option("items[".concat(itemIndex, "]"));
    toolbar.option("items[".concat(itemIndex, "].disabled"), disabled);
    if (item.options) {
      toolbar.option("items[".concat(itemIndex, "].options.disabled"), disabled);
    }
  };
  _proto.updateToolbarDimensions = function updateToolbarDimensions() {
    var _a;
    (_a = this._toolbar) === null || _a === void 0 ? void 0 : _a.updateDimensions();
  };
  _proto.getHeaderPanel = function getHeaderPanel() {
    return this.element();
  };
  _proto.getHeight = function getHeight() {
    return this.getElementHeight();
  };
  _proto.optionChanged = function optionChanged(args) {
    if (args.name === 'onToolbarPreparing') {
      this._invalidate();
      args.handled = true;
    }
    if (args.name === 'toolbar') {
      args.handled = true;
      if (this._toolbar) {
        const parts = (0, _data.getPathParts)(args.fullName);
        const optionName = args.fullName.replace(/^toolbar\./, '');
        if (parts.length === 1) {
          // `toolbar` case
          const toolbarOptions = this._getToolbarOptions();
          this._toolbar.option(toolbarOptions);
        } else if (parts[1] === 'items') {
          if (parts.length === 2) {
            // `toolbar.items` case
            const toolbarOptions = this._getToolbarOptions();
            this._toolbar.option('items', toolbarOptions.items);
          } else if (parts.length === 3) {
            // `toolbar.items[i]` case
            const normalizedItem = this._normalizeToolbarItems(this._getToolbarItems(), args.value);
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
    _ColumnsView.prototype.optionChanged.call(this, args);
  }
  /**
   * @extended: column_chooser, editing
   */;
  _proto.isVisible = function isVisible() {
    return !!(this._toolbarOptions && this._toolbarOptions.visible);
  }
  /**
   * @extended: DataGrid's grouping
   */;
  _proto.allowDragging = function allowDragging() {};
  _proto.hasGroupedColumns = function hasGroupedColumns() {};
  return HeaderPanel;
}(_m_columns_view.ColumnsView);
const resizing = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(HeaderPanelResizingExtender, _Base);
  function HeaderPanelResizingExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto2 = HeaderPanelResizingExtender.prototype;
  _proto2._updateDimensionsCore = function _updateDimensionsCore() {
    // @ts-expect-error
    _Base.prototype._updateDimensionsCore.apply(this, arguments);
    this.getView('headerPanel').updateToolbarDimensions();
  };
  return HeaderPanelResizingExtender;
}(Base);
const headerPanelModule = exports.headerPanelModule = {
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
