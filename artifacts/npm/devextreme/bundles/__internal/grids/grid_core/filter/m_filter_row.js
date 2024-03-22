/**
* DevExtreme (bundles/__internal/grids/grid_core/filter/m_filter_row.js)
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
exports.filterRowModule = exports.ApplyFilterViewController = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _index = require("../../../../events/utils/index");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _editor = _interopRequireDefault(require("../../../../ui/editor/editor"));
var _menu = _interopRequireDefault(require("../../../../ui/menu"));
var _ui = _interopRequireDefault(require("../../../../ui/overlay/ui.overlay"));
var _accessibility = require("../../../../ui/shared/accessibility");
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const OPERATION_ICONS = {
  '=': 'filter-operation-equals',
  '<>': 'filter-operation-not-equals',
  '<': 'filter-operation-less',
  '<=': 'filter-operation-less-equal',
  '>': 'filter-operation-greater',
  '>=': 'filter-operation-greater-equal',
  default: 'filter-operation-default',
  // eslint-disable-next-line spellcheck/spell-checker
  notcontains: 'filter-operation-not-contains',
  contains: 'filter-operation-contains',
  startswith: 'filter-operation-starts-with',
  endswith: 'filter-operation-ends-with',
  between: 'filter-operation-between'
};
const OPERATION_DESCRIPTORS = {
  '=': 'equal',
  '<>': 'notEqual',
  '<': 'lessThan',
  '<=': 'lessThanOrEqual',
  '>': 'greaterThan',
  '>=': 'greaterThanOrEqual',
  startswith: 'startsWith',
  contains: 'contains',
  // eslint-disable-next-line spellcheck/spell-checker
  notcontains: 'notContains',
  endswith: 'endsWith',
  between: 'between'
};
const FILTERING_TIMEOUT = 700;
const CORRECT_FILTER_RANGE_OVERLAY_WIDTH = 1;
const FILTER_ROW_CLASS = 'filter-row';
const FILTER_RANGE_OVERLAY_CLASS = 'filter-range-overlay';
const FILTER_RANGE_START_CLASS = 'filter-range-start';
const FILTER_RANGE_END_CLASS = 'filter-range-end';
const MENU_CLASS = 'dx-menu';
const EDITOR_WITH_MENU_CLASS = 'dx-editor-with-menu';
const EDITOR_CONTAINER_CLASS = 'dx-editor-container';
const EDITOR_CELL_CLASS = 'dx-editor-cell';
const FILTER_MENU = 'dx-filter-menu';
const APPLY_BUTTON_CLASS = 'dx-apply-button';
const HIGHLIGHT_OUTLINE_CLASS = 'dx-highlight-outline';
const FOCUSED_CLASS = 'dx-focused';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const FILTER_RANGE_CONTENT_CLASS = 'dx-filter-range-content';
const FILTER_MODIFIED_CLASS = 'dx-filter-modified';
const EDITORS_INPUT_SELECTOR = 'input:not([type=\'hidden\'])';
const BETWEEN_OPERATION_DATA_TYPES = ['date', 'datetime', 'number'];
const ARIA_SEARCH_BOX = _message.default.format('dxDataGrid-ariaSearchBox');
function isOnClickApplyFilterMode(that) {
  return that.option('filterRow.applyFilter') === 'onClick';
}
const getEditorInstance = function ($editorContainer) {
  const $editor = $editorContainer && $editorContainer.children();
  const componentNames = $editor && $editor.data('dxComponents');
  const editor = componentNames && componentNames.length && $editor.data(componentNames[0]);
  if (editor instanceof _editor.default) {
    return editor;
  }
  return null;
};
const getRangeTextByFilterValue = function (that, column) {
  let result = '';
  let rangeEnd = '';
  const filterValue = getColumnFilterValue(that, column);
  const formatOptions = _m_utils.default.getFormatOptionsByColumn(column, 'filterRow');
  if (Array.isArray(filterValue)) {
    result = _m_utils.default.formatValue(filterValue[0], formatOptions);
    rangeEnd = _m_utils.default.formatValue(filterValue[1], formatOptions);
    if (rangeEnd !== '') {
      result += " - ".concat(rangeEnd);
    }
  } else if ((0, _type.isDefined)(filterValue)) {
    result = _m_utils.default.formatValue(filterValue, formatOptions);
  }
  return result;
};
function getColumnFilterValue(that, column) {
  if (column) {
    return isOnClickApplyFilterMode(that) && column.bufferedFilterValue !== undefined ? column.bufferedFilterValue : column.filterValue;
  }
}
const getColumnSelectedFilterOperation = function (that, column) {
  if (column) {
    return isOnClickApplyFilterMode(that) && column.bufferedSelectedFilterOperation !== undefined ? column.bufferedSelectedFilterOperation : column.selectedFilterOperation;
  }
};
const isValidFilterValue = function (filterValue, column) {
  if (column && BETWEEN_OPERATION_DATA_TYPES.includes(column.dataType) && Array.isArray(filterValue)) {
    return false;
  }
  return filterValue !== undefined;
};
const getFilterValue = function (that, columnIndex, $editorContainer) {
  const column = that._columnsController.columnOption(columnIndex);
  const filterValue = getColumnFilterValue(that, column);
  const isFilterRange = $editorContainer.closest(".".concat(that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS))).length;
  const isRangeStart = $editorContainer.hasClass(that.addWidgetPrefix(FILTER_RANGE_START_CLASS));
  if (filterValue && Array.isArray(filterValue) && getColumnSelectedFilterOperation(that, column) === 'between') {
    if (isRangeStart) {
      return filterValue[0];
    }
    return filterValue[1];
  }
  return !isFilterRange && isValidFilterValue(filterValue, column) ? filterValue : null;
};
const normalizeFilterValue = function (that, filterValue, column, $editorContainer) {
  if (getColumnSelectedFilterOperation(that, column) === 'between') {
    const columnFilterValue = getColumnFilterValue(that, column);
    if ($editorContainer.hasClass(that.addWidgetPrefix(FILTER_RANGE_START_CLASS))) {
      return [filterValue, Array.isArray(columnFilterValue) ? columnFilterValue[1] : undefined];
    }
    return [Array.isArray(columnFilterValue) ? columnFilterValue[0] : columnFilterValue, filterValue];
  }
  return filterValue;
};
const updateFilterValue = function (that, options) {
  const value = options.value === '' ? null : options.value;
  const $editorContainer = options.container;
  const column = that._columnsController.columnOption(options.column.index);
  const filterValue = getFilterValue(that, column.index, $editorContainer);
  if (!(0, _type.isDefined)(filterValue) && !(0, _type.isDefined)(value)) return;
  that._applyFilterViewController.setHighLight($editorContainer, filterValue !== value);
  const columnOptionName = isOnClickApplyFilterMode(that) ? 'bufferedFilterValue' : 'filterValue';
  const normalizedValue = normalizeFilterValue(that, value, column, $editorContainer);
  const isBetween = getColumnSelectedFilterOperation(that, column) === 'between';
  const notFireEvent = options.notFireEvent || isBetween && Array.isArray(normalizedValue) && normalizedValue.includes(undefined);
  that._columnsController.columnOption(column.index, columnOptionName, normalizedValue, notFireEvent);
};
const columnHeadersView = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(ColumnHeadersViewFilterRowExtender, _Base);
  function ColumnHeadersViewFilterRowExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto = ColumnHeadersViewFilterRowExtender.prototype;
  _proto.init = function init() {
    _Base.prototype.init.call(this);
    this._applyFilterViewController = this.getController('applyFilter');
  };
  _proto.optionChanged = function optionChanged(args) {
    switch (args.name) {
      case 'filterRow':
      case 'showColumnLines':
        this._invalidate(true, true);
        args.handled = true;
        break;
      case 'syncLookupFilterValues':
        if (args.value) {
          this.updateLookupDataSource();
        } else {
          this.render();
        }
        args.handled = true;
        break;
      default:
        _Base.prototype.optionChanged.call(this, args);
        break;
    }
  };
  _proto._updateEditorValue = function _updateEditorValue(column, $editorContainer) {
    const that = this;
    const editor = getEditorInstance($editorContainer);
    editor && editor.option('value', getFilterValue(that, column.index, $editorContainer));
  };
  _proto._columnOptionChanged = function _columnOptionChanged(e) {
    var _a;
    const that = this;
    const {
      optionNames
    } = e;
    let $cell;
    let $editorContainer;
    let $editorRangeElements;
    let $menu;
    if (_m_utils.default.checkChanges(optionNames, ['filterValue', 'bufferedFilterValue', 'selectedFilterOperation', 'bufferedSelectedFilterOperation', 'filterValues', 'filterType']) && e.columnIndex !== undefined) {
      const visibleIndex = that._columnsController.getVisibleIndex(e.columnIndex);
      const column = that._columnsController.columnOption(e.columnIndex);
      // @ts-expect-error
      $cell = (_a = that._getCellElement(that.element().find(".".concat(that.addWidgetPrefix(FILTER_ROW_CLASS))).index(), visibleIndex)) !== null && _a !== void 0 ? _a : (0, _renderer.default)();
      $editorContainer = $cell.find(".".concat(EDITOR_CONTAINER_CLASS)).first();
      if (optionNames.filterValue || optionNames.bufferedFilterValue) {
        that._updateEditorValue(column, $editorContainer);
        const overlayInstance = $cell.find(".".concat(that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS))).data('dxOverlay');
        if (overlayInstance) {
          $editorRangeElements = overlayInstance.$content().find(".".concat(EDITOR_CONTAINER_CLASS));
          that._updateEditorValue(column, $editorRangeElements.first());
          that._updateEditorValue(column, $editorRangeElements.last());
        }
        if (!overlayInstance || !overlayInstance.option('visible')) {
          that._updateFilterRangeContent($cell, getRangeTextByFilterValue(that, column));
        }
      }
      if (optionNames.selectedFilterOperation || optionNames.bufferedSelectedFilterOperation) {
        if (visibleIndex >= 0 && column) {
          $menu = $cell.find(".".concat(MENU_CLASS));
          if ($menu.length) {
            that._updateFilterOperationChooser($menu, column, $editorContainer);
            if (getColumnSelectedFilterOperation(that, column) === 'between') {
              that._renderFilterRangeContent($cell, column);
            } else if ($editorContainer.find(".".concat(FILTER_RANGE_CONTENT_CLASS)).length) {
              that._renderEditor($editorContainer, that._getEditorOptions($editorContainer, column));
              that._hideFilterRange();
            }
          }
        }
      }
      return;
    }
    _Base.prototype._columnOptionChanged.call(this, e);
  };
  _proto._renderCore = function _renderCore() {
    this._filterRangeOverlayInstance = null;
    // @ts-expect-error
    return _Base.prototype._renderCore.apply(this, arguments);
  };
  _proto._resizeCore = function _resizeCore() {
    var _a;
    // @ts-expect-error
    _Base.prototype._resizeCore.apply(this, arguments);
    (_a = this._filterRangeOverlayInstance) === null || _a === void 0 ? void 0 : _a.repaint();
  };
  _proto.isFilterRowVisible = function isFilterRowVisible() {
    return this._isElementVisible(this.option('filterRow'));
  };
  _proto.isVisible = function isVisible() {
    return _Base.prototype.isVisible.call(this) || this.isFilterRowVisible();
  };
  _proto._initFilterRangeOverlay = function _initFilterRangeOverlay($cell, column) {
    const that = this;
    const sharedData = {};
    const $editorContainer = $cell.find('.dx-editor-container');
    const filterRangeOverlayClass = that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS);
    const $overlay = (0, _renderer.default)('<div>').addClass(filterRangeOverlayClass).appendTo($cell);
    return that._createComponent($overlay, _ui.default, {
      height: 'auto',
      shading: false,
      showTitle: false,
      focusStateEnabled: false,
      hideOnOutsideClick: true,
      wrapperAttr: {
        class: filterRangeOverlayClass
      },
      animation: false,
      position: {
        my: 'top',
        at: 'top',
        of: $editorContainer.length && $editorContainer || $cell,
        offset: '0 -1'
      },
      contentTemplate(contentElement) {
        let editorOptions;
        let $editor = (0, _renderer.default)('<div>').addClass("".concat(EDITOR_CONTAINER_CLASS, " ").concat(that.addWidgetPrefix(FILTER_RANGE_START_CLASS))).appendTo(contentElement);
        column = that._columnsController.columnOption(column.index);
        editorOptions = that._getEditorOptions($editor, column);
        editorOptions.sharedData = sharedData;
        that._renderEditor($editor, editorOptions);
        _events_engine.default.on($editor.find(EDITORS_INPUT_SELECTOR), 'keydown', e => {
          let $prevElement = $cell.find('[tabindex]').not(e.target).first();
          if ((0, _index.normalizeKeyName)(e) === 'tab' && e.shiftKey) {
            e.preventDefault();
            that._hideFilterRange();
            if (!$prevElement.length) {
              $prevElement = $cell.prev().find('[tabindex]').last();
            }
            // @ts-expect-error
            _events_engine.default.trigger($prevElement, 'focus');
          }
        });
        $editor = (0, _renderer.default)('<div>').addClass("".concat(EDITOR_CONTAINER_CLASS, " ").concat(that.addWidgetPrefix(FILTER_RANGE_END_CLASS))).appendTo(contentElement);
        editorOptions = that._getEditorOptions($editor, column);
        editorOptions.sharedData = sharedData;
        that._renderEditor($editor, editorOptions);
        _events_engine.default.on($editor.find(EDITORS_INPUT_SELECTOR), 'keydown', e => {
          if ((0, _index.normalizeKeyName)(e) === 'tab' && !e.shiftKey) {
            e.preventDefault();
            that._hideFilterRange();
            // @ts-expect-error
            _events_engine.default.trigger($cell.next().find('[tabindex]').first(), 'focus');
          }
        });
        return (0, _renderer.default)(contentElement).addClass(that.getWidgetContainerClass());
      },
      onShown(e) {
        const $editor = e.component.$content().find(".".concat(EDITOR_CONTAINER_CLASS)).first();
        // @ts-expect-error
        _events_engine.default.trigger($editor.find(EDITORS_INPUT_SELECTOR), 'focus');
      },
      onHidden() {
        column = that._columnsController.columnOption(column.index);
        $cell.find(".".concat(MENU_CLASS)).parent().addClass(EDITOR_WITH_MENU_CLASS);
        if (getColumnSelectedFilterOperation(that, column) === 'between') {
          that._updateFilterRangeContent($cell, getRangeTextByFilterValue(that, column));
          that.component.updateDimensions();
        }
      }
    });
  };
  _proto._updateFilterRangeOverlay = function _updateFilterRangeOverlay(options) {
    const overlayInstance = this._filterRangeOverlayInstance;
    overlayInstance && overlayInstance.option(options);
  };
  _proto._showFilterRange = function _showFilterRange($cell, column) {
    const that = this;
    const $overlay = $cell.children(".".concat(that.addWidgetPrefix(FILTER_RANGE_OVERLAY_CLASS)));
    let overlayInstance = $overlay.length && $overlay.data('dxOverlay');
    if (!overlayInstance && column) {
      overlayInstance = that._initFilterRangeOverlay($cell, column);
    }
    if (!overlayInstance.option('visible')) {
      that._filterRangeOverlayInstance && that._filterRangeOverlayInstance.hide();
      that._filterRangeOverlayInstance = overlayInstance;
      that._updateFilterRangeOverlay({
        width: (0, _size.getOuterWidth)($cell, true) + CORRECT_FILTER_RANGE_OVERLAY_WIDTH
      });
      that._filterRangeOverlayInstance && that._filterRangeOverlayInstance.show();
    }
  };
  _proto._hideFilterRange = function _hideFilterRange() {
    const overlayInstance = this._filterRangeOverlayInstance;
    overlayInstance && overlayInstance.hide();
  };
  _proto.getFilterRangeOverlayInstance = function getFilterRangeOverlayInstance() {
    return this._filterRangeOverlayInstance;
  };
  _proto._createRow = function _createRow(row) {
    const $row = _Base.prototype._createRow.call(this, row);
    if (row.rowType === 'filter') {
      $row.addClass(this.addWidgetPrefix(FILTER_ROW_CLASS));
      if (!this.option('useLegacyKeyboardNavigation')) {
        _events_engine.default.on($row, 'keydown', event => (0, _accessibility.selectView)('filterRow', this, event));
      }
    }
    return $row;
  };
  _proto._getRows = function _getRows() {
    const result = _Base.prototype._getRows.call(this);
    if (this.isFilterRowVisible()) {
      result.push({
        rowType: 'filter'
      });
    }
    return result;
  };
  _proto._renderFilterCell = function _renderFilterCell(cell, options) {
    const that = this;
    const {
      column
    } = options;
    const $cell = (0, _renderer.default)(cell);
    if (that.component.option('showColumnHeaders')) {
      that.setAria('describedby', column.headerId, $cell);
    }
    that.setAria('label', _message.default.format('dxDataGrid-ariaFilterCell'), $cell);
    $cell.addClass(EDITOR_CELL_CLASS);
    const $container = (0, _renderer.default)('<div>').appendTo($cell);
    const $editorContainer = (0, _renderer.default)('<div>').addClass(EDITOR_CONTAINER_CLASS).appendTo($container);
    if (getColumnSelectedFilterOperation(that, column) === 'between') {
      that._renderFilterRangeContent($cell, column);
    } else {
      const editorOptions = that._getEditorOptions($editorContainer, column);
      that._renderEditor($editorContainer, editorOptions);
    }
    const {
      alignment
    } = column;
    if (alignment && alignment !== 'center') {
      $cell.find(EDITORS_INPUT_SELECTOR).first().css('textAlign', column.alignment);
    }
    if (column.filterOperations && column.filterOperations.length) {
      that._renderFilterOperationChooser($container, column, $editorContainer);
    }
  };
  _proto._renderCellContent = function _renderCellContent($cell, options) {
    const that = this;
    const {
      column
    } = options;
    if (options.rowType === 'filter') {
      if (column.command) {
        $cell.html('&nbsp;');
      } else if (column.allowFiltering) {
        that.renderTemplate($cell, that._renderFilterCell.bind(that), options).done(() => {
          that._updateCell($cell, options);
        });
        return;
      }
    }
    // @ts-expect-error
    _Base.prototype._renderCellContent.apply(this, arguments);
  };
  _proto._getEditorOptions = function _getEditorOptions($editorContainer, column) {
    const that = this;
    const accessibilityOptions = {
      editorOptions: {
        inputAttr: that._getFilterInputAccessibilityAttributes(column)
      }
    };
    const result = (0, _extend.extend)(accessibilityOptions, column, {
      value: getFilterValue(that, column.index, $editorContainer),
      parentType: 'filterRow',
      showAllText: that.option('filterRow.showAllText'),
      updateValueTimeout: that.option('filterRow.applyFilter') === 'onClick' ? 0 : FILTERING_TIMEOUT,
      width: null,
      setValue(value, notFireEvent) {
        updateFilterValue(that, {
          column,
          value,
          container: $editorContainer,
          notFireEvent
        });
      }
    });
    if (getColumnSelectedFilterOperation(that, column) === 'between') {
      if ($editorContainer.hasClass(that.addWidgetPrefix(FILTER_RANGE_START_CLASS))) {
        result.placeholder = that.option('filterRow.betweenStartText');
      } else {
        result.placeholder = that.option('filterRow.betweenEndText');
      }
    }
    return result;
  };
  _proto._getFilterInputAccessibilityAttributes = function _getFilterInputAccessibilityAttributes(column) {
    const columnAriaLabel = _message.default.format('dxDataGrid-ariaFilterCell');
    if (this.component.option('showColumnHeaders')) {
      return {
        'aria-label': columnAriaLabel,
        'aria-describedby': column.headerId
      };
    }
    return {
      'aria-label': columnAriaLabel
    };
  };
  _proto._renderEditor = function _renderEditor($editorContainer, options) {
    $editorContainer.empty();
    const $element = (0, _renderer.default)('<div>').appendTo($editorContainer);
    const dataSource = this._dataController.dataSource();
    if (options.lookup && this.option('syncLookupFilterValues')) {
      this._applyFilterViewController.setCurrentColumnForFiltering(options);
      const filter = this._dataController.getCombinedFilter();
      this._applyFilterViewController.setCurrentColumnForFiltering(null);
      const lookupDataSource = _m_utils.default.getWrappedLookupDataSource(options, dataSource, filter);
      const lookupOptions = _extends(_extends({}, options), {
        lookup: _extends(_extends({}, options.lookup), {
          dataSource: lookupDataSource
        })
      });
      return this._editorFactoryController.createEditor($element, lookupOptions);
    }
    return this._editorFactoryController.createEditor($element, options);
  };
  _proto._renderFilterRangeContent = function _renderFilterRangeContent($cell, column) {
    const that = this;
    const $editorContainer = $cell.find(".".concat(EDITOR_CONTAINER_CLASS)).first();
    $editorContainer.empty();
    const $filterRangeContent = (0, _renderer.default)('<div>').addClass(FILTER_RANGE_CONTENT_CLASS).attr('tabindex', this.option('tabIndex'));
    _events_engine.default.on($filterRangeContent, 'focusin', () => {
      that._showFilterRange($cell, column);
    });
    $filterRangeContent.appendTo($editorContainer);
    that._updateFilterRangeContent($cell, getRangeTextByFilterValue(that, column));
  };
  _proto._updateFilterRangeContent = function _updateFilterRangeContent($cell, value) {
    const $filterRangeContent = $cell.find(".".concat(FILTER_RANGE_CONTENT_CLASS));
    if ($filterRangeContent.length) {
      if (value === '') {
        $filterRangeContent.html('&nbsp;');
      } else {
        $filterRangeContent.text(value);
      }
    }
  };
  _proto._updateFilterOperationChooser = function _updateFilterOperationChooser($menu, column, $editorContainer) {
    const that = this;
    let isCellWasFocused;
    const restoreFocus = function () {
      const menu = _menu.default.getInstance($menu);
      menu && menu.option('focusedElement', null);
      isCellWasFocused && that._focusEditor($editorContainer);
    };
    const editorFactoryController = this._editorFactoryController;
    that._createComponent($menu, _menu.default, {
      // @ts-expect-error
      integrationOptions: {},
      activeStateEnabled: false,
      selectionMode: 'single',
      cssClass: "".concat(that.getWidgetContainerClass(), " ").concat(CELL_FOCUS_DISABLED_CLASS, " ").concat(FILTER_MENU),
      showFirstSubmenuMode: 'onHover',
      hideSubmenuOnMouseLeave: true,
      items: [{
        disabled: !(column.filterOperations && column.filterOperations.length),
        icon: OPERATION_ICONS[getColumnSelectedFilterOperation(that, column) || 'default'],
        selectable: false,
        items: that._getFilterOperationMenuItems(column)
      }],
      onItemRendered: _ref => {
        let {
          itemElement
        } = _ref;
        this.setAria('label', ARIA_SEARCH_BOX, (0, _renderer.default)(itemElement));
      },
      onItemClick(properties) {
        // @ts-expect-error
        const selectedFilterOperation = properties.itemData.name;
        const columnSelectedFilterOperation = getColumnSelectedFilterOperation(that, column);
        let notFocusEditor = false;
        const isOnClickMode = isOnClickApplyFilterMode(that);
        const options = {};
        // @ts-expect-error
        if (properties.itemData.items || selectedFilterOperation && selectedFilterOperation === columnSelectedFilterOperation) {
          return;
        }
        if (selectedFilterOperation) {
          options[isOnClickMode ? 'bufferedSelectedFilterOperation' : 'selectedFilterOperation'] = selectedFilterOperation;
          if (selectedFilterOperation === 'between' || columnSelectedFilterOperation === 'between') {
            notFocusEditor = selectedFilterOperation === 'between';
            options[isOnClickMode ? 'bufferedFilterValue' : 'filterValue'] = null;
          }
        } else {
          options[isOnClickMode ? 'bufferedFilterValue' : 'filterValue'] = null;
          options[isOnClickMode ? 'bufferedSelectedFilterOperation' : 'selectedFilterOperation'] = column.defaultSelectedFilterOperation || null;
        }
        that._columnsController.columnOption(column.index, options);
        that._applyFilterViewController.setHighLight($editorContainer, true);
        if (!selectedFilterOperation) {
          const editor = getEditorInstance($editorContainer);
          // @ts-expect-error
          if (editor && editor.NAME === 'dxDateBox' && !editor.option('isValid')) {
            editor.clear();
            editor.option('isValid', true);
          }
        }
        if (!notFocusEditor) {
          that._focusEditor($editorContainer);
        } else {
          that._showFilterRange($editorContainer.closest(".".concat(EDITOR_CELL_CLASS)), column);
        }
      },
      onSubmenuShowing() {
        isCellWasFocused = that._isEditorFocused($editorContainer);
        editorFactoryController.loseFocus();
      },
      onSubmenuHiding() {
        // @ts-expect-error
        _events_engine.default.trigger($menu, 'blur');
        restoreFocus();
      },
      onContentReady(e) {
        _events_engine.default.on($menu, 'blur', () => {
          const menu = e.component;
          // @ts-expect-error
          menu._hideSubmenuAfterTimeout();
          restoreFocus();
        });
      },
      rtlEnabled: that.option('rtlEnabled')
    });
  };
  _proto._isEditorFocused = function _isEditorFocused($container) {
    return $container.hasClass(FOCUSED_CLASS) || $container.parents(".".concat(FOCUSED_CLASS)).length;
  };
  _proto._focusEditor = function _focusEditor($container) {
    this._editorFactoryController.focus($container);
    // @ts-expect-error
    _events_engine.default.trigger($container.find(EDITORS_INPUT_SELECTOR), 'focus');
  };
  _proto._renderFilterOperationChooser = function _renderFilterOperationChooser($container, column, $editorContainer) {
    const that = this;
    let $menu;
    if (that.option('filterRow.showOperationChooser')) {
      $container.addClass(EDITOR_WITH_MENU_CLASS);
      $menu = (0, _renderer.default)('<div>').prependTo($container);
      that._updateFilterOperationChooser($menu, column, $editorContainer);
    }
  };
  _proto._getFilterOperationMenuItems = function _getFilterOperationMenuItems(column) {
    const that = this;
    let result = [{}];
    const filterRowOptions = that.option('filterRow');
    const operationDescriptions = filterRowOptions && filterRowOptions.operationDescriptions || {};
    if (column.filterOperations && column.filterOperations.length) {
      const availableFilterOperations = column.filterOperations.filter(value => (0, _type.isDefined)(OPERATION_DESCRIPTORS[value]));
      result = (0, _iterator.map)(availableFilterOperations, value => {
        const descriptionName = OPERATION_DESCRIPTORS[value];
        return {
          name: value,
          selected: (getColumnSelectedFilterOperation(that, column) || column.defaultFilterOperation) === value,
          text: operationDescriptions[descriptionName],
          icon: OPERATION_ICONS[value]
        };
      });
      result.push({
        name: null,
        text: filterRowOptions && filterRowOptions.resetOperationText,
        icon: OPERATION_ICONS.default
      });
    }
    return result;
  };
  _proto._handleDataChanged = function _handleDataChanged(e) {
    var _a, _b, _c, _d, _e, _f;
    const dataSource = (_b = (_a = this._dataController) === null || _a === void 0 ? void 0 : _a.dataSource) === null || _b === void 0 ? void 0 : _b.call(_a);
    const lastLoadOptions = (_c = dataSource === null || dataSource === void 0 ? void 0 : dataSource.lastLoadOptions) === null || _c === void 0 ? void 0 : _c.call(dataSource);
    // @ts-expect-error
    _Base.prototype._handleDataChanged.apply(this, arguments);
    if (((_d = e.operationTypes) === null || _d === void 0 ? void 0 : _d.filtering) || ((_e = e.operationTypes) === null || _e === void 0 ? void 0 : _e.fullReload)) {
      this.updateLookupDataSource(((_f = e.operationTypes) === null || _f === void 0 ? void 0 : _f.filtering) || (lastLoadOptions === null || lastLoadOptions === void 0 ? void 0 : lastLoadOptions.filter));
    }
  };
  _proto.updateLookupDataSource = function updateLookupDataSource(filterChanged) {
    if (!this.option('syncLookupFilterValues')) {
      return;
    }
    if (!this.element()) {
      return;
    }
    const columns = this._columnsController.getVisibleColumns();
    const dataSource = this._dataController.dataSource();
    const applyFilterViewController = this._applyFilterViewController;
    const rowIndex = this.element().find(".".concat(this.addWidgetPrefix(FILTER_ROW_CLASS))).index();
    if (rowIndex === -1) {
      return;
    }
    columns.forEach((column, index) => {
      if (!column.lookup || column.calculateCellValue !== column.defaultCalculateCellValue) {
        return;
      }
      const $cell = this._getCellElement(rowIndex, index);
      const editor = getEditorInstance($cell === null || $cell === void 0 ? void 0 : $cell.find('.dx-editor-container'));
      if (editor) {
        applyFilterViewController.setCurrentColumnForFiltering(column);
        const filter = this._dataController.getCombinedFilter() || null;
        applyFilterViewController.setCurrentColumnForFiltering(null);
        const editorDataSource = editor.option('dataSource');
        const shouldUpdateFilter = !filterChanged || !(0, _common.equalByValue)(editorDataSource.__dataGridSourceFilter || null, filter);
        if (shouldUpdateFilter) {
          const lookupDataSource = _m_utils.default.getWrappedLookupDataSource(column, dataSource, filter);
          editor.option('dataSource', lookupDataSource);
        }
      }
    });
  };
  return ColumnHeadersViewFilterRowExtender;
}(Base);
const data = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(DataControllerFilterRowExtender, _Base2);
  function DataControllerFilterRowExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto2 = DataControllerFilterRowExtender.prototype;
  _proto2.skipCalculateColumnFilters = function skipCalculateColumnFilters() {
    return false;
  };
  _proto2._calculateAdditionalFilter = function _calculateAdditionalFilter() {
    if (this.skipCalculateColumnFilters()) {
      return _Base2.prototype._calculateAdditionalFilter.call(this);
    }
    const filters = [_Base2.prototype._calculateAdditionalFilter.call(this)];
    const columns = this._columnsController.getVisibleColumns(null, true);
    const applyFilterController = this._applyFilterController;
    (0, _iterator.each)(columns, function () {
      var _a;
      const shouldSkip = ((_a = applyFilterController.getCurrentColumnForFiltering()) === null || _a === void 0 ? void 0 : _a.index) === this.index;
      if (this.allowFiltering && this.calculateFilterExpression && (0, _type.isDefined)(this.filterValue) && !shouldSkip) {
        const filter = this.createFilterExpression(this.filterValue, this.selectedFilterOperation || this.defaultFilterOperation, 'filterRow');
        filters.push(filter);
      }
    });
    return _m_utils.default.combineFilters(filters);
  };
  return DataControllerFilterRowExtender;
}(Base);
let ApplyFilterViewController = exports.ApplyFilterViewController = /*#__PURE__*/function (_modules$ViewControll) {
  _inheritsLoose(ApplyFilterViewController, _modules$ViewControll);
  function ApplyFilterViewController() {
    return _modules$ViewControll.apply(this, arguments) || this;
  }
  var _proto3 = ApplyFilterViewController.prototype;
  _proto3.init = function init() {
    this._columnsController = this.getController('columns');
  };
  _proto3._getHeaderPanel = function _getHeaderPanel() {
    if (!this._headerPanel) {
      // TODO getView
      this._headerPanel = this.getView('headerPanel');
    }
    return this._headerPanel;
  };
  _proto3.setHighLight = function setHighLight($element, value) {
    if (isOnClickApplyFilterMode(this)) {
      $element && $element.toggleClass(HIGHLIGHT_OUTLINE_CLASS, value) && $element.closest(".".concat(EDITOR_CELL_CLASS)).toggleClass(FILTER_MODIFIED_CLASS, value);
      this._getHeaderPanel().enableApplyButton(value);
    }
  };
  _proto3.applyFilter = function applyFilter() {
    const columns = this._columnsController.getColumns();
    this._columnsController.beginUpdate();
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.bufferedFilterValue !== undefined) {
        this._columnsController.columnOption(i, 'filterValue', column.bufferedFilterValue);
        column.bufferedFilterValue = undefined;
      }
      if (column.bufferedSelectedFilterOperation !== undefined) {
        this._columnsController.columnOption(i, 'selectedFilterOperation', column.bufferedSelectedFilterOperation);
        column.bufferedSelectedFilterOperation = undefined;
      }
    }
    this._columnsController.endUpdate();
    this.removeHighLights();
  };
  _proto3.removeHighLights = function removeHighLights() {
    if (isOnClickApplyFilterMode(this)) {
      // TODO getView
      const columnHeadersViewElement = this.getView('columnHeadersView').element();
      columnHeadersViewElement.find(".".concat(this.addWidgetPrefix(FILTER_ROW_CLASS), " .").concat(HIGHLIGHT_OUTLINE_CLASS)).removeClass(HIGHLIGHT_OUTLINE_CLASS);
      columnHeadersViewElement.find(".".concat(this.addWidgetPrefix(FILTER_ROW_CLASS), " .").concat(FILTER_MODIFIED_CLASS)).removeClass(FILTER_MODIFIED_CLASS);
      this._getHeaderPanel().enableApplyButton(false);
    }
  };
  _proto3.setCurrentColumnForFiltering = function setCurrentColumnForFiltering(column) {
    this._currentColumn = column;
  };
  _proto3.getCurrentColumnForFiltering = function getCurrentColumnForFiltering() {
    return this._currentColumn;
  };
  return ApplyFilterViewController;
}(_m_modules.default.ViewController);
const columnsResizer = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(FilterRowColumnsResizerExtender, _Base3);
  function FilterRowColumnsResizerExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto4 = FilterRowColumnsResizerExtender.prototype;
  _proto4._startResizing = function _startResizing() {
    const that = this;
    // @ts-expect-error
    _Base3.prototype._startResizing.apply(that, arguments);
    if (that.isResizing()) {
      // @ts-expect-error
      const overlayInstance = that._columnHeadersView.getFilterRangeOverlayInstance();
      if (overlayInstance) {
        const cellIndex = overlayInstance.$element().closest('td').index();
        if (cellIndex === that._targetPoint.columnIndex || cellIndex === that._targetPoint.columnIndex + 1) {
          overlayInstance.$content().hide();
        }
      }
    }
  };
  _proto4._endResizing = function _endResizing() {
    const that = this;
    let $cell;
    if (that.isResizing()) {
      // @ts-expect-error
      const overlayInstance = that._columnHeadersView.getFilterRangeOverlayInstance();
      if (overlayInstance) {
        $cell = overlayInstance.$element().closest('td');
        // @ts-expect-error
        that._columnHeadersView._updateFilterRangeOverlay({
          width: (0, _size.getOuterWidth)($cell, true) + CORRECT_FILTER_RANGE_OVERLAY_WIDTH
        });
        overlayInstance.$content().show();
      }
    }
    // @ts-expect-error
    _Base3.prototype._endResizing.apply(that, arguments);
  };
  return FilterRowColumnsResizerExtender;
}(Base);
const editing = Base => /*#__PURE__*/function (_Base4) {
  _inheritsLoose(FilterRowEditingController, _Base4);
  function FilterRowEditingController() {
    return _Base4.apply(this, arguments) || this;
  }
  var _proto5 = FilterRowEditingController.prototype;
  _proto5.updateFieldValue = function updateFieldValue(options) {
    if (options.column.lookup) {
      this._needUpdateLookupDataSource = true;
    }
    // @ts-expect-error
    return _Base4.prototype.updateFieldValue.apply(this, arguments);
  };
  _proto5._afterSaveEditData = function _afterSaveEditData(cancel) {
    var _a;
    if (this._needUpdateLookupDataSource && !cancel) {
      // TODO getView
      // @ts-expect-error
      (_a = this.getView('columnHeadersView')) === null || _a === void 0 ? void 0 : _a.updateLookupDataSource();
    }
    this._needUpdateLookupDataSource = false;
    // @ts-expect-error
    return _Base4.prototype._afterSaveEditData.apply(this, arguments);
  };
  _proto5._afterCancelEditData = function _afterCancelEditData() {
    this._needUpdateLookupDataSource = false;
    // @ts-expect-error
    return _Base4.prototype._afterCancelEditData.apply(this, arguments);
  };
  return FilterRowEditingController;
}(Base);
const headerPanel = Base => /*#__PURE__*/function (_Base5) {
  _inheritsLoose(FilterRowHeaderPanel, _Base5);
  function FilterRowHeaderPanel() {
    return _Base5.apply(this, arguments) || this;
  }
  var _proto6 = FilterRowHeaderPanel.prototype;
  _proto6.init = function init() {
    _Base5.prototype.init.call(this);
    this._dataController = this.getController('data');
    this._applyFilterViewController = this.getController('applyFilter');
  };
  _proto6.optionChanged = function optionChanged(args) {
    if (args.name === 'filterRow') {
      this._invalidate();
      args.handled = true;
    } else {
      _Base5.prototype.optionChanged.call(this, args);
    }
  };
  _proto6._getToolbarItems = function _getToolbarItems() {
    const items = _Base5.prototype._getToolbarItems.call(this);
    const filterItem = this._prepareFilterItem();
    return filterItem.concat(items);
  };
  _proto6._prepareFilterItem = function _prepareFilterItem() {
    const that = this;
    const filterItem = [];
    if (that._isShowApplyFilterButton()) {
      const hintText = that.option('filterRow.applyFilterText');
      const columns = that._columnsController.getColumns();
      const disabled = !columns.filter(column => column.bufferedFilterValue !== undefined).length;
      const onInitialized = function (e) {
        (0, _renderer.default)(e.element).addClass(that._getToolbarButtonClass(APPLY_BUTTON_CLASS));
      };
      const onClickHandler = function () {
        that._applyFilterViewController.applyFilter();
      };
      const toolbarItem = {
        widget: 'dxButton',
        options: {
          icon: 'apply-filter',
          disabled,
          onClick: onClickHandler,
          hint: hintText,
          text: hintText,
          onInitialized
        },
        showText: 'inMenu',
        name: 'applyFilterButton',
        location: 'after',
        locateInMenu: 'auto',
        sortIndex: 10
      };
      filterItem.push(toolbarItem);
    }
    return filterItem;
  };
  _proto6._isShowApplyFilterButton = function _isShowApplyFilterButton() {
    const filterRowOptions = this.option('filterRow');
    return !!(filterRowOptions === null || filterRowOptions === void 0 ? void 0 : filterRowOptions.visible) && filterRowOptions.applyFilter === 'onClick';
  };
  _proto6.enableApplyButton = function enableApplyButton(value) {
    this.setToolbarItemDisabled('applyFilterButton', !value);
  };
  _proto6.isVisible = function isVisible() {
    return _Base5.prototype.isVisible.call(this) || this._isShowApplyFilterButton();
  };
  return FilterRowHeaderPanel;
}(Base);
const filterRowModule = exports.filterRowModule = {
  defaultOptions() {
    return {
      syncLookupFilterValues: true,
      filterRow: {
        visible: false,
        showOperationChooser: true,
        showAllText: _message.default.format('dxDataGrid-filterRowShowAllText'),
        resetOperationText: _message.default.format('dxDataGrid-filterRowResetOperationText'),
        applyFilter: 'auto',
        applyFilterText: _message.default.format('dxDataGrid-applyFilterText'),
        operationDescriptions: {
          equal: _message.default.format('dxDataGrid-filterRowOperationEquals'),
          notEqual: _message.default.format('dxDataGrid-filterRowOperationNotEquals'),
          lessThan: _message.default.format('dxDataGrid-filterRowOperationLess'),
          lessThanOrEqual: _message.default.format('dxDataGrid-filterRowOperationLessOrEquals'),
          greaterThan: _message.default.format('dxDataGrid-filterRowOperationGreater'),
          greaterThanOrEqual: _message.default.format('dxDataGrid-filterRowOperationGreaterOrEquals'),
          startsWith: _message.default.format('dxDataGrid-filterRowOperationStartsWith'),
          contains: _message.default.format('dxDataGrid-filterRowOperationContains'),
          notContains: _message.default.format('dxDataGrid-filterRowOperationNotContains'),
          endsWith: _message.default.format('dxDataGrid-filterRowOperationEndsWith'),
          between: _message.default.format('dxDataGrid-filterRowOperationBetween'),
          isBlank: _message.default.format('dxFilterBuilder-filterOperationIsBlank'),
          isNotBlank: _message.default.format('dxFilterBuilder-filterOperationIsNotBlank')
        },
        betweenStartText: _message.default.format('dxDataGrid-filterRowOperationBetweenStartText'),
        betweenEndText: _message.default.format('dxDataGrid-filterRowOperationBetweenEndText')
      }
    };
  },
  controllers: {
    applyFilter: ApplyFilterViewController
  },
  extenders: {
    controllers: {
      data,
      columnsResizer,
      editing
    },
    views: {
      columnHeadersView,
      headerPanel
    }
  }
};
