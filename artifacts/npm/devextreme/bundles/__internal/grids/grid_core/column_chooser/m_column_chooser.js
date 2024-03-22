/**
* DevExtreme (bundles/__internal/grids/grid_core/column_chooser/m_column_chooser.js)
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
exports.columnChooserModule = exports.ColumnChooserView = exports.ColumnChooserController = void 0;
var _devices = _interopRequireDefault(require("../../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _button = _interopRequireDefault(require("../../../../ui/button"));
var _ui = _interopRequireDefault(require("../../../../ui/popup/ui.popup"));
var _themes = require("../../../../ui/themes");
var _tree_view = _interopRequireDefault(require("../../../../ui/tree_view"));
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_columns_view = require("../views/m_columns_view");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */ // @ts-expect-error
const COLUMN_CHOOSER_CLASS = 'column-chooser';
const COLUMN_CHOOSER_BUTTON_CLASS = 'column-chooser-button';
const NOTOUCH_ACTION_CLASS = 'notouch-action';
const COLUMN_CHOOSER_LIST_CLASS = 'column-chooser-list';
const COLUMN_CHOOSER_PLAIN_CLASS = 'column-chooser-plain';
const COLUMN_CHOOSER_DRAG_CLASS = 'column-chooser-mode-drag';
const COLUMN_CHOOSER_SELECT_CLASS = 'column-chooser-mode-select';
const COLUMN_CHOOSER_ICON_NAME = 'column-chooser';
const COLUMN_CHOOSER_ITEM_CLASS = 'dx-column-chooser-item';
const COLUMN_OPTIONS_USED_IN_ITEMS = ['showInColumnChooser', 'caption', 'allowHiding', 'visible', 'cssClass', 'ownerBand'];
const processItems = function (that, chooserColumns) {
  const items = [];
  const isSelectMode = that.isSelectMode();
  const isRecursive = that.option('columnChooser.selection.recursive');
  if (chooserColumns.length) {
    (0, _iterator.each)(chooserColumns, (index, column) => {
      const item = {
        text: column.caption,
        cssClass: column.cssClass,
        allowHiding: column.allowHiding,
        expanded: true,
        id: column.index,
        disabled: column.allowHiding === false,
        parentId: (0, _type.isDefined)(column.ownerBand) ? column.ownerBand : null
      };
      const isRecursiveWithColumns = isRecursive && column.hasColumns;
      if (isSelectMode && !isRecursiveWithColumns) {
        item.selected = column.visible;
      }
      items.push(item);
    });
  }
  return items;
};
let ColumnChooserController = exports.ColumnChooserController = /*#__PURE__*/function (_modules$ViewControll) {
  _inheritsLoose(ColumnChooserController, _modules$ViewControll);
  function ColumnChooserController() {
    return _modules$ViewControll.apply(this, arguments) || this;
  }
  var _proto = ColumnChooserController.prototype;
  _proto.init = function init() {
    _modules$ViewControll.prototype.init.call(this);
    this._rowsView = this.getView('rowsView');
  };
  _proto.renderShowColumnChooserButton = function renderShowColumnChooserButton($element) {
    const that = this;
    const columnChooserButtonClass = that.addWidgetPrefix(COLUMN_CHOOSER_BUTTON_CLASS);
    const columnChooserEnabled = that.option('columnChooser.enabled');
    const $showColumnChooserButton = $element.find(".".concat(columnChooserButtonClass));
    let $columnChooserButton;
    if (columnChooserEnabled) {
      if (!$showColumnChooserButton.length) {
        $columnChooserButton = (0, _renderer.default)('<div>').addClass(columnChooserButtonClass).appendTo($element);
        that._createComponent($columnChooserButton, _button.default, {
          icon: COLUMN_CHOOSER_ICON_NAME,
          onClick() {
            // TODO getView
            that.getView('columnChooserView').showColumnChooser();
          },
          hint: that.option('columnChooser.title'),
          // @ts-expect-error
          integrationOptions: {}
        });
      } else {
        $showColumnChooserButton.show();
      }
    } else {
      $showColumnChooserButton.hide();
    }
  };
  _proto.getPosition = function getPosition() {
    const position = this.option('columnChooser.position');
    return (0, _type.isDefined)(position) ? position : {
      my: 'right bottom',
      at: 'right bottom',
      of: this._rowsView && this._rowsView.element(),
      collision: 'fit',
      offset: '-2 -2',
      boundaryOffset: '2 2'
    };
  };
  return ColumnChooserController;
}(_m_modules.default.ViewController);
let ColumnChooserView = exports.ColumnChooserView = /*#__PURE__*/function (_ColumnsView) {
  _inheritsLoose(ColumnChooserView, _ColumnsView);
  function ColumnChooserView() {
    return _ColumnsView.apply(this, arguments) || this;
  }
  var _proto2 = ColumnChooserView.prototype;
  _proto2.optionChanged = function optionChanged(args) {
    switch (args.name) {
      case 'columnChooser':
        this._initializePopupContainer();
        this.render(null, 'full');
        break;
      default:
        _ColumnsView.prototype.optionChanged.call(this, args);
    }
  };
  _proto2.publicMethods = function publicMethods() {
    return ['showColumnChooser', 'hideColumnChooser'];
  };
  _proto2._resizeCore = function _resizeCore() {};
  _proto2._isWinDevice = function _isWinDevice() {
    // @ts-expect-error
    return !!_devices.default.real().win;
  };
  _proto2._initializePopupContainer = function _initializePopupContainer() {
    const that = this;
    const columnChooserClass = that.addWidgetPrefix(COLUMN_CHOOSER_CLASS);
    const $element = that.element().addClass(columnChooserClass);
    const columnChooserOptions = that.option('columnChooser');
    const popupPosition = this._columnChooserController.getPosition();
    const themeName = (0, _themes.current)();
    const isGenericTheme = (0, _themes.isGeneric)(themeName);
    const isMaterial = (0, _themes.isMaterial)(themeName);
    const dxPopupOptions = {
      visible: false,
      shading: false,
      showCloseButton: false,
      dragEnabled: true,
      resizeEnabled: true,
      wrapperAttr: {
        class: columnChooserClass
      },
      toolbarItems: [{
        text: columnChooserOptions.title,
        toolbar: 'top',
        location: isGenericTheme || isMaterial ? 'before' : 'center'
      }],
      position: popupPosition,
      width: columnChooserOptions.width,
      height: columnChooserOptions.height,
      rtlEnabled: that.option('rtlEnabled'),
      onHidden() {
        if (that._isWinDevice()) {
          (0, _renderer.default)('body').removeClass(that.addWidgetPrefix(NOTOUCH_ACTION_CLASS));
        }
      },
      container: columnChooserOptions.container
    };
    if (isGenericTheme || isMaterial) {
      (0, _extend.extend)(dxPopupOptions, {
        showCloseButton: true
      });
    } else {
      // @ts-expect-error
      dxPopupOptions.toolbarItems[dxPopupOptions.toolbarItems.length] = {
        shortcut: 'cancel'
      };
    }
    if (!(0, _type.isDefined)(this._popupContainer)) {
      that._popupContainer = that._createComponent($element, _ui.default, dxPopupOptions);
      that._popupContainer.on('optionChanged', args => {
        if (args.name === 'visible') {
          that.renderCompleted.fire();
        }
      });
    } else {
      this._popupContainer.option(dxPopupOptions);
    }
    this.setPopupAttributes();
  };
  _proto2.setPopupAttributes = function setPopupAttributes() {
    const isSelectMode = this.isSelectMode();
    const isBandColumnsUsed = this._columnsController.isBandColumnsUsed();
    this._popupContainer.setAria({
      role: 'dialog',
      label: _message.default.format('dxDataGrid-columnChooserTitle')
    });
    this._popupContainer.$wrapper().toggleClass(this.addWidgetPrefix(COLUMN_CHOOSER_DRAG_CLASS), !isSelectMode).toggleClass(this.addWidgetPrefix(COLUMN_CHOOSER_SELECT_CLASS), isSelectMode);
    this._popupContainer.$content().addClass(this.addWidgetPrefix(COLUMN_CHOOSER_LIST_CLASS));
    if (isSelectMode && !isBandColumnsUsed) {
      this._popupContainer.$content().addClass(this.addWidgetPrefix(COLUMN_CHOOSER_PLAIN_CLASS));
    }
  };
  _proto2._renderCore = function _renderCore(change) {
    if (this._popupContainer) {
      const isDragMode = !this.isSelectMode();
      if (!this._columnChooserList || change === 'full') {
        this._renderTreeView();
      } else if (isDragMode) {
        this._updateItems();
      }
    }
  };
  _proto2._renderTreeView = function _renderTreeView() {
    var _a, _b, _c;
    const that = this;
    const $container = this._popupContainer.$content();
    const columnChooser = this.option('columnChooser');
    const isSelectMode = this.isSelectMode();
    const searchEnabled = (0, _type.isDefined)(columnChooser.allowSearch) ? columnChooser.allowSearch : (_a = columnChooser.search) === null || _a === void 0 ? void 0 : _a.enabled;
    const searchTimeout = (0, _type.isDefined)(columnChooser.searchTimeout) ? columnChooser.searchTimeout : (_b = columnChooser.search) === null || _b === void 0 ? void 0 : _b.timeout;
    const treeViewConfig = {
      dataStructure: 'plain',
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      itemTemplate: 'item',
      showCheckBoxesMode: 'none',
      rootValue: null,
      searchEnabled,
      searchTimeout,
      searchEditorOptions: (_c = columnChooser.search) === null || _c === void 0 ? void 0 : _c.editorOptions
    };
    if (this._isWinDevice()) {
      treeViewConfig.useNativeScrolling = false;
    }
    (0, _extend.extend)(treeViewConfig, isSelectMode ? this._prepareSelectModeConfig() : this._prepareDragModeConfig());
    if (this._columnChooserList) {
      if (!treeViewConfig.searchEnabled) {
        treeViewConfig.searchValue = '';
      }
      this._columnChooserList.option(treeViewConfig);
      // we need to set items after setting selectNodesRecursive, so they will be processed correctly inside TreeView
      this._updateItems();
    } else {
      this._columnChooserList = this._createComponent($container, _tree_view.default, treeViewConfig);
      // we need to set items after setting selectNodesRecursive, so they will be processed correctly inside TreeView
      this._updateItems();
      let scrollTop = 0;
      this._columnChooserList.on('optionChanged', e => {
        const scrollable = e.component.getScrollable();
        scrollTop = scrollable.scrollTop();
      });
      this._columnChooserList.on('contentReady', e => {
        (0, _common.deferUpdate)(() => {
          const scrollable = e.component.getScrollable();
          scrollable.scrollTo({
            y: scrollTop
          });
          that.renderCompleted.fire();
        });
      });
    }
  };
  _proto2._prepareDragModeConfig = function _prepareDragModeConfig() {
    const columnChooserOptions = this.option('columnChooser');
    return {
      noDataText: columnChooserOptions.emptyPanelText,
      activeStateEnabled: false,
      focusStateEnabled: false,
      hoverStateEnabled: false,
      itemTemplate(data, index, item) {
        (0, _renderer.default)(item).text(data.text).parent().addClass(data.cssClass).addClass(COLUMN_CHOOSER_ITEM_CLASS);
      }
    };
  };
  _proto2._prepareSelectModeConfig = function _prepareSelectModeConfig() {
    var _a;
    const that = this;
    const selectionOptions = (_a = this.option('columnChooser.selection')) !== null && _a !== void 0 ? _a : {};
    const getFlatNodes = nodes => {
      const addNodesToArray = (nodes, flatNodesArray) => nodes.reduce((result, node) => {
        result.push(node);
        if (node.children.length) {
          addNodesToArray(node.children, result);
        }
        return result;
      }, flatNodesArray);
      return addNodesToArray(nodes, []);
    };
    const updateSelection = (e, nodes) => {
      nodes.filter(node => node.itemData.allowHiding === false).forEach(node => e.component.selectItem(node.key));
    };
    const updateColumnVisibility = nodes => {
      nodes.forEach(node => {
        const columnIndex = node.itemData.id;
        const isVisible = node.selected !== false;
        that._columnsController.columnOption(columnIndex, 'visible', isVisible);
      });
    };
    let isUpdatingSelection = false;
    const selectionChangedHandler = e => {
      if (isUpdatingSelection) {
        return;
      }
      const nodes = getFlatNodes(e.component.getNodes());
      e.component.beginUpdate();
      isUpdatingSelection = true;
      updateSelection(e, nodes);
      e.component.endUpdate();
      isUpdatingSelection = false;
      that.component.beginUpdate();
      this._isUpdatingColumnVisibility = true;
      updateColumnVisibility(nodes);
      that.component.endUpdate();
      this._isUpdatingColumnVisibility = false;
    };
    return {
      selectByClick: selectionOptions.selectByClick,
      selectNodesRecursive: selectionOptions.recursive,
      showCheckBoxesMode: selectionOptions.allowSelectAll ? 'selectAll' : 'normal',
      onSelectionChanged: selectionChangedHandler
    };
  };
  _proto2._updateItems = function _updateItems() {
    const isSelectMode = this.isSelectMode();
    const chooserColumns = this._columnsController.getChooserColumns(isSelectMode);
    const items = processItems(this, chooserColumns);
    this._columnChooserList.option('items', items);
  };
  _proto2._updateItemsSelection = function _updateItemsSelection(columnIndices) {
    const changedColumns = columnIndices === null || columnIndices === void 0 ? void 0 : columnIndices.map(columnIndex => this._columnsController.columnOption(columnIndex));
    this._columnChooserList.beginUpdate();
    changedColumns === null || changedColumns === void 0 ? void 0 : changedColumns.forEach(_ref => {
      let {
        visible,
        index
      } = _ref;
      if (visible) {
        this._columnChooserList.selectItem(index);
      } else {
        this._columnChooserList.unselectItem(index);
      }
    });
    this._columnChooserList.endUpdate();
  };
  _proto2._columnOptionChanged = function _columnOptionChanged(e) {
    _ColumnsView.prototype._columnOptionChanged.call(this, e);
    const isSelectMode = this.isSelectMode();
    if (isSelectMode && this._columnChooserList && !this._isUpdatingColumnVisibility) {
      const {
        optionNames
      } = e;
      const onlyVisibleChanged = optionNames.visible && optionNames.length === 1;
      const columnIndices = (0, _type.isDefined)(e.columnIndex) ? [e.columnIndex] : e.columnIndices;
      const needUpdate = COLUMN_OPTIONS_USED_IN_ITEMS.some(optionName => optionNames[optionName]) || e.changeTypes.columns && optionNames.all;
      if (needUpdate) {
        this._updateItemsSelection(columnIndices);
        if (!onlyVisibleChanged) {
          this._updateItems();
        }
      }
    }
  };
  _proto2.getColumnElements = function getColumnElements() {
    const result = [];
    const isSelectMode = this.isSelectMode();
    const chooserColumns = this._columnsController.getChooserColumns(isSelectMode);
    const $content = this._popupContainer && this._popupContainer.$content();
    const $nodes = $content && $content.find('.dx-treeview-node');
    if ($nodes) {
      chooserColumns.forEach(column => {
        const $node = $nodes.filter("[data-item-id = '".concat(column.index, "']"));
        const item = $node.length ? $node.children(".".concat(COLUMN_CHOOSER_ITEM_CLASS)).get(0) : null;
        result.push(item);
      });
    }
    return (0, _renderer.default)(result);
  };
  _proto2.getName = function getName() {
    return 'columnChooser';
  };
  _proto2.getColumns = function getColumns() {
    return this._columnsController.getChooserColumns();
  };
  _proto2.allowDragging = function allowDragging(column) {
    const isParentColumnVisible = this._columnsController.isParentColumnVisible(column.index);
    const isColumnHidden = !column.visible && column.allowHiding;
    return this.isColumnChooserVisible() && isParentColumnVisible && isColumnHidden;
  };
  _proto2.allowColumnHeaderDragging = function allowColumnHeaderDragging(column) {
    const isDragMode = !this.isSelectMode();
    return isDragMode && this.isColumnChooserVisible() && column.allowHiding;
  };
  _proto2.getBoundingRect = function getBoundingRect() {
    const that = this;
    const container = that._popupContainer && that._popupContainer.$overlayContent();
    if (container && container.is(':visible')) {
      const offset = container.offset();
      return {
        left: offset.left,
        top: offset.top,
        right: offset.left + (0, _size.getOuterWidth)(container),
        bottom: offset.top + (0, _size.getOuterHeight)(container)
      };
    }
    return null;
  };
  _proto2.showColumnChooser = function showColumnChooser() {
    if (!this._popupContainer) {
      this._initializePopupContainer();
      this.render();
    }
    this._popupContainer.show();
    if (this._isWinDevice()) {
      (0, _renderer.default)('body').addClass(this.addWidgetPrefix(NOTOUCH_ACTION_CLASS));
    }
  };
  _proto2.hideColumnChooser = function hideColumnChooser() {
    if (this._popupContainer) {
      this._popupContainer.hide();
    }
  };
  _proto2.isColumnChooserVisible = function isColumnChooserVisible() {
    const popupContainer = this._popupContainer;
    return popupContainer && popupContainer.option('visible');
  };
  _proto2.isSelectMode = function isSelectMode() {
    return this.option('columnChooser.mode') === 'select';
  };
  _proto2.hasHiddenColumns = function hasHiddenColumns() {
    const isEnabled = this.option('columnChooser.enabled');
    const hiddenColumns = this.getColumns().filter(column => !column.visible);
    return isEnabled && hiddenColumns.length;
  };
  return ColumnChooserView;
}(_m_columns_view.ColumnsView);
const headerPanel = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(ColumnChooserHeaderPanelExtender, _Base);
  function ColumnChooserHeaderPanelExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto3 = ColumnChooserHeaderPanelExtender.prototype;
  _proto3._getToolbarItems = function _getToolbarItems() {
    const items = _Base.prototype._getToolbarItems.call(this);
    return this._appendColumnChooserItem(items);
  };
  _proto3._appendColumnChooserItem = function _appendColumnChooserItem(items) {
    const that = this;
    const columnChooserEnabled = that.option('columnChooser.enabled');
    if (columnChooserEnabled) {
      const onClickHandler = function () {
        // TODO getView
        that.component.getView('columnChooserView').showColumnChooser();
      };
      const onInitialized = function (e) {
        (0, _renderer.default)(e.element).addClass(that._getToolbarButtonClass(that.addWidgetPrefix(COLUMN_CHOOSER_BUTTON_CLASS)));
      };
      const hintText = that.option('columnChooser.title');
      const toolbarItem = {
        widget: 'dxButton',
        options: {
          icon: COLUMN_CHOOSER_ICON_NAME,
          onClick: onClickHandler,
          hint: hintText,
          text: hintText,
          onInitialized,
          elementAttr: {
            'aria-haspopup': 'dialog'
          }
        },
        showText: 'inMenu',
        location: 'after',
        name: 'columnChooserButton',
        locateInMenu: 'auto',
        sortIndex: 40
      };
      items.push(toolbarItem);
    }
    return items;
  };
  _proto3.optionChanged = function optionChanged(args) {
    switch (args.name) {
      case 'columnChooser':
        this._invalidate();
        args.handled = true;
        break;
      default:
        _Base.prototype.optionChanged.call(this, args);
    }
  };
  _proto3.isVisible = function isVisible() {
    const that = this;
    const columnChooserEnabled = that.option('columnChooser.enabled');
    return _Base.prototype.isVisible.call(this) || columnChooserEnabled;
  };
  return ColumnChooserHeaderPanelExtender;
}(Base);
const columns = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(ColumnsChooserColumnsControllerExtender, _Base2);
  function ColumnsChooserColumnsControllerExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto4 = ColumnsChooserColumnsControllerExtender.prototype;
  _proto4.allowMoveColumn = function allowMoveColumn(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
    const isSelectMode = this.option('columnChooser.mode') === 'select';
    const isMoveColumnDisallowed = isSelectMode && targetLocation === 'columnChooser';
    return isMoveColumnDisallowed ? false : _Base2.prototype.allowMoveColumn.call(this, fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation);
  };
  return ColumnsChooserColumnsControllerExtender;
}(Base);
const columnHeadersView = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(ColumnChooserColumnHeadersExtender, _Base3);
  function ColumnChooserColumnHeadersExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto5 = ColumnChooserColumnHeadersExtender.prototype;
  _proto5.allowDragging = function allowDragging(column) {
    const isDragMode = !this._columnChooserView.isSelectMode();
    const isColumnChooserVisible = this._columnChooserView.isColumnChooserVisible();
    return isDragMode && isColumnChooserVisible && column.allowHiding || _Base3.prototype.allowDragging.call(this, column);
  };
  return ColumnChooserColumnHeadersExtender;
}(Base);
const columnChooserModule = exports.columnChooserModule = {
  defaultOptions() {
    return {
      columnChooser: {
        enabled: false,
        search: {
          enabled: false,
          timeout: 500,
          editorOptions: {}
        },
        selection: {
          allowSelectAll: false,
          selectByClick: false,
          recursive: false
        },
        position: undefined,
        mode: 'dragAndDrop',
        width: 250,
        height: 260,
        title: _message.default.format('dxDataGrid-columnChooserTitle'),
        emptyPanelText: _message.default.format('dxDataGrid-columnChooserEmptyText'),
        // TODO private option
        container: undefined
      }
    };
  },
  controllers: {
    columnChooser: ColumnChooserController
  },
  views: {
    columnChooserView: ColumnChooserView
  },
  extenders: {
    views: {
      headerPanel,
      columnHeadersView
    },
    controllers: {
      columns
    }
  }
};
