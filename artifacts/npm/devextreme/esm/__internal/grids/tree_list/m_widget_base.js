/**
* DevExtreme (esm/__internal/grids/tree_list/m_widget_base.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import './module_not_extended/column_headers';
import './m_columns_controller';
import './data_controller/m_data_controller';
import './module_not_extended/sorting';
import './rows/m_rows';
import './module_not_extended/context_menu';
import './module_not_extended/error_handling';
import './m_grid_view';
import './module_not_extended/header_panel';
import registerComponent from '../../../core/component_registrator';
import { deferRender } from '../../../core/utils/common';
import { extend } from '../../../core/utils/extend';
import { each } from '../../../core/utils/iterator';
import { isDefined, isFunction } from '../../../core/utils/type';
import { isMaterialBased } from '../../../ui/themes';
import Widget from '../../../ui/widget/ui.widget';
import gridCoreUtils from '../../grids/grid_core/m_utils';
import treeListCore from './m_core';
var {
  callModuleItemsMethod
} = treeListCore;
var DATAGRID_ROW_SELECTOR = '.dx-row';
var TREELIST_CLASS = 'dx-treelist';
treeListCore.registerModulesOrder(['stateStoring', 'columns', 'selection', 'editorFactory', 'columnChooser', 'editingRowBased', 'editingFormBased', 'editingCellBased', 'editing', 'grouping', 'masterDetail', 'validating', 'adaptivity', 'data', 'virtualScrolling', 'columnHeaders', 'filterRow', 'headerPanel', 'headerFilter', 'sorting', 'search', 'rows', 'pager', 'columnsResizingReordering', 'contextMenu', 'keyboardNavigation', 'errorHandling', 'summary', 'columnFixing', 'export', 'gridView']);
class TreeList extends Widget {
  constructor() {
    super(...arguments);
    this._activeStateUnit = DATAGRID_ROW_SELECTOR;
  }
  _getDefaultOptions() {
    // @ts-expect-error
    var result = super._getDefaultOptions();
    each(treeListCore.modules, function () {
      if (isFunction(this.defaultOptions)) {
        extend(true, result, this.defaultOptions());
      }
    });
    return result;
  }
  _setDeprecatedOptions() {
    // @ts-expect-error
    super._setDeprecatedOptions();
    extend(this._deprecatedOptions, {
      'columnChooser.allowSearch': {
        since: '23.1',
        message: 'Use the "columnChooser.search.enabled" option instead'
      },
      'columnChooser.searchTimeout': {
        since: '23.1',
        message: 'Use the "columnChooser.search.timeout" option instead'
      }
    });
  }
  _defaultOptionsRules() {
    // @ts-expect-error
    return super._defaultOptionsRules().concat([{
      device() {
        // @ts-expect-error
        return isMaterialBased();
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
  }
  _init() {
    var that = this;
    // @ts-expect-error
    super._init();
    if (!this.option('_disableDeprecationWarnings')) {
      gridCoreUtils.logHeaderFilterDeprecatedWarningIfNeed(this);
    }
    treeListCore.processModules(that, treeListCore);
    callModuleItemsMethod(that, 'init');
  }
  _clean() {}
  _optionChanged(args) {
    var that = this;
    callModuleItemsMethod(that, 'optionChanged', [args]);
    if (!args.handled) {
      // @ts-expect-error
      super._optionChanged(args);
    }
  }
  _dimensionChanged() {
    // @ts-expect-error
    this.updateDimensions(true);
  }
  _visibilityChanged(visible) {
    if (visible) {
      // @ts-expect-error
      this.updateDimensions();
    }
  }
  _initMarkup() {
    // @ts-expect-error
    super._initMarkup.apply(this, arguments);
    this.$element().addClass(TREELIST_CLASS);
    this.getView('gridView').render(this.$element());
  }
  _renderContentImpl() {
    this.getView('gridView').update();
  }
  _renderContent() {
    var that = this;
    deferRender(() => {
      that._renderContentImpl();
    });
  }
  _dispose() {
    var that = this;
    // @ts-expect-error
    super._dispose();
    callModuleItemsMethod(that, 'dispose');
  }
  isReady() {
    return this.getController('data').isReady();
  }
  beginUpdate() {
    super.beginUpdate();
    callModuleItemsMethod(this, 'beginUpdate');
  }
  endUpdate() {
    callModuleItemsMethod(this, 'endUpdate');
    super.endUpdate();
  }
  getController(name) {
    // @ts-expect-error
    return this._controllers[name];
  }
  getView(name) {
    // @ts-expect-error
    return this._views[name];
  }
  focus(element) {
    super.focus();
    if (isDefined(element)) {
      this.getController('keyboardNavigation').focus(element);
    }
  }
  static registerModule() {
    treeListCore.registerModule.apply(treeListCore, arguments);
  }
}
// @ts-expect-error
registerComponent('dxTreeList', TreeList);
export default TreeList;
