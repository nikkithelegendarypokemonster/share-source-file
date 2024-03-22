/**
* DevExtreme (bundles/__internal/grids/tree_list/m_widget_base.js)
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
exports.default = void 0;
require("./module_not_extended/column_headers");
require("./m_columns_controller");
require("./data_controller/m_data_controller");
require("./module_not_extended/sorting");
require("./rows/m_rows");
require("./module_not_extended/context_menu");
require("./module_not_extended/error_handling");
require("./m_grid_view");
require("./module_not_extended/header_panel");
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _type = require("../../../core/utils/type");
var _themes = require("../../../ui/themes");
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.widget"));
var _m_utils = _interopRequireDefault(require("../../grids/grid_core/m_utils"));
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const {
  callModuleItemsMethod
} = _m_core.default;
const DATAGRID_ROW_SELECTOR = '.dx-row';
const TREELIST_CLASS = 'dx-treelist';
_m_core.default.registerModulesOrder(['stateStoring', 'columns', 'selection', 'editorFactory', 'columnChooser', 'editingRowBased', 'editingFormBased', 'editingCellBased', 'editing', 'grouping', 'masterDetail', 'validating', 'adaptivity', 'data', 'virtualScrolling', 'columnHeaders', 'filterRow', 'headerPanel', 'headerFilter', 'sorting', 'search', 'rows', 'pager', 'columnsResizingReordering', 'contextMenu', 'keyboardNavigation', 'errorHandling', 'summary', 'columnFixing', 'export', 'gridView']);
let TreeList = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(TreeList, _Widget);
  function TreeList() {
    var _this;
    _this = _Widget.apply(this, arguments) || this;
    _this._activeStateUnit = DATAGRID_ROW_SELECTOR;
    return _this;
  }
  var _proto = TreeList.prototype;
  _proto._getDefaultOptions = function _getDefaultOptions() {
    // @ts-expect-error
    const result = _Widget.prototype._getDefaultOptions.call(this);
    (0, _iterator.each)(_m_core.default.modules, function () {
      if ((0, _type.isFunction)(this.defaultOptions)) {
        (0, _extend.extend)(true, result, this.defaultOptions());
      }
    });
    return result;
  };
  _proto._setDeprecatedOptions = function _setDeprecatedOptions() {
    // @ts-expect-error
    _Widget.prototype._setDeprecatedOptions.call(this);
    (0, _extend.extend)(this._deprecatedOptions, {
      'columnChooser.allowSearch': {
        since: '23.1',
        message: 'Use the "columnChooser.search.enabled" option instead'
      },
      'columnChooser.searchTimeout': {
        since: '23.1',
        message: 'Use the "columnChooser.search.timeout" option instead'
      }
    });
  };
  _proto._defaultOptionsRules = function _defaultOptionsRules() {
    // @ts-expect-error
    return _Widget.prototype._defaultOptionsRules.call(this).concat([{
      device() {
        // @ts-expect-error
        return (0, _themes.isMaterialBased)();
      },
      options: {
        showRowLines: true,
        showColumnLines: false,
        headerFilter: {
          height: 315
        },
        editing: {
          useIcons: true
        }
      }
    }]);
  };
  _proto._init = function _init() {
    const that = this;
    // @ts-expect-error
    _Widget.prototype._init.call(this);
    if (!this.option('_disableDeprecationWarnings')) {
      _m_utils.default.logHeaderFilterDeprecatedWarningIfNeed(this);
    }
    _m_core.default.processModules(that, _m_core.default);
    callModuleItemsMethod(that, 'init');
  };
  _proto._clean = function _clean() {};
  _proto._optionChanged = function _optionChanged(args) {
    const that = this;
    callModuleItemsMethod(that, 'optionChanged', [args]);
    if (!args.handled) {
      // @ts-expect-error
      _Widget.prototype._optionChanged.call(this, args);
    }
  };
  _proto._dimensionChanged = function _dimensionChanged() {
    // @ts-expect-error
    this.updateDimensions(true);
  };
  _proto._visibilityChanged = function _visibilityChanged(visible) {
    if (visible) {
      // @ts-expect-error
      this.updateDimensions();
    }
  };
  _proto._initMarkup = function _initMarkup() {
    // @ts-expect-error
    _Widget.prototype._initMarkup.apply(this, arguments);
    this.$element().addClass(TREELIST_CLASS);
    this.getView('gridView').render(this.$element());
  };
  _proto._renderContentImpl = function _renderContentImpl() {
    this.getView('gridView').update();
  };
  _proto._renderContent = function _renderContent() {
    const that = this;
    (0, _common.deferRender)(() => {
      that._renderContentImpl();
    });
  };
  _proto._dispose = function _dispose() {
    const that = this;
    // @ts-expect-error
    _Widget.prototype._dispose.call(this);
    callModuleItemsMethod(that, 'dispose');
  };
  _proto.isReady = function isReady() {
    return this.getController('data').isReady();
  };
  _proto.beginUpdate = function beginUpdate() {
    _Widget.prototype.beginUpdate.call(this);
    callModuleItemsMethod(this, 'beginUpdate');
  };
  _proto.endUpdate = function endUpdate() {
    callModuleItemsMethod(this, 'endUpdate');
    _Widget.prototype.endUpdate.call(this);
  };
  _proto.getController = function getController(name) {
    // @ts-expect-error
    return this._controllers[name];
  };
  _proto.getView = function getView(name) {
    // @ts-expect-error
    return this._views[name];
  };
  _proto.focus = function focus(element) {
    _Widget.prototype.focus.call(this);
    if ((0, _type.isDefined)(element)) {
      this.getController('keyboardNavigation').focus(element);
    }
  };
  TreeList.registerModule = function registerModule() {
    _m_core.default.registerModule.apply(_m_core.default, arguments);
  };
  return TreeList;
}(_ui.default); // @ts-expect-error
(0, _component_registrator.default)('dxTreeList', TreeList);
var _default = exports.default = TreeList;
