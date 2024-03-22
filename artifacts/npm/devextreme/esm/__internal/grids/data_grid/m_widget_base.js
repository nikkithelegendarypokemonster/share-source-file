/**
* DevExtreme (esm/__internal/grids/data_grid/m_widget_base.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import './module_not_extended/column_headers';
import './m_columns_controller';
import './m_data_controller';
import './module_not_extended/sorting';
import './module_not_extended/rows';
import './module_not_extended/context_menu';
import './module_not_extended/error_handling';
import './module_not_extended/grid_view';
import './module_not_extended/header_panel';
import registerComponent from '../../../core/component_registrator';
import $ from '../../../core/renderer';
import browser from '../../../core/utils/browser';
import { deferRender } from '../../../core/utils/common';
import { logger } from '../../../core/utils/console';
import { extend } from '../../../core/utils/extend';
import { each } from '../../../core/utils/iterator';
import { isFunction, isString } from '../../../core/utils/type';
import { isMaterialBased } from '../../../ui/themes';
import Widget from '../../../ui/widget/ui.widget';
import gridCoreUtils from '../../grids/grid_core/m_utils';
import gridCore from './m_core';
var DATAGRID_ROW_SELECTOR = '.dx-row';
var DATAGRID_DEPRECATED_TEMPLATE_WARNING = 'Specifying grid templates with the jQuery selector name is now deprecated. Use the DOM Node or the jQuery object that references this selector instead.';
gridCore.registerModulesOrder(['stateStoring', 'columns', 'selection', 'editorFactory', 'columnChooser', 'grouping', 'editing', 'editingRowBased', 'editingFormBased', 'editingCellBased', 'masterDetail', 'validating', 'adaptivity', 'data', 'virtualScrolling', 'columnHeaders', 'filterRow', 'headerPanel', 'headerFilter', 'sorting', 'search', 'rows', 'pager', 'columnsResizingReordering', 'contextMenu', 'keyboardNavigation', 'errorHandling', 'summary', 'columnFixing', 'export', 'gridView']);
class DataGrid extends Widget {
  constructor() {
    super(...arguments);
    this._activeStateUnit = DATAGRID_ROW_SELECTOR;
  }
  _getDefaultOptions() {
    // @ts-expect-error
    var result = super._getDefaultOptions();
    each(gridCore.modules, function () {
      if (isFunction(this.defaultOptions)) {
        extend(true, result, this.defaultOptions());
      }
    });
    return result;
  }
  _setDeprecatedOptions() {
    // @ts-expect-error
    super._setDeprecatedOptions();
    // @ts-expect-error
    extend(this._deprecatedOptions, {
      useKeyboard: {
        since: '19.2',
        alias: 'keyboardNavigation.enabled'
      },
      rowTemplate: {
        since: '21.2',
        message: 'Use the "dataRowTemplate" option instead'
      },
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super._defaultOptionsRules().concat([{
      device: {
        platform: 'ios'
      },
      options: {
        showRowLines: true
      }
    }, {
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
        },
        selection: {
          showCheckBoxesMode: 'always'
        }
      }
    }, {
      device() {
        return browser.webkit;
      },
      options: {
        loadingTimeout: 30,
        loadPanel: {
          animation: {
            show: {
              easing: 'cubic-bezier(1, 0, 1, 0)',
              duration: 500,
              from: {
                opacity: 0
              },
              to: {
                opacity: 1
              }
            }
          }
        }
      }
    }, {
      device(device) {
        return device.deviceType !== 'desktop';
      },
      options: {
        grouping: {
          expandMode: 'rowClick'
        }
      }
    }]);
  }
  _init() {
    var that = this;
    // @ts-expect-error
    super._init();
    gridCoreUtils.logHeaderFilterDeprecatedWarningIfNeed(that);
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    gridCore.processModules(that, gridCore);
    gridCore.callModuleItemsMethod(that, 'init');
  }
  _clean() {}
  _optionChanged(args) {
    var that = this;
    gridCore.callModuleItemsMethod(that, 'optionChanged', [args]);
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
  _getTemplate(templateName) {
    var template = templateName;
    if (isString(template) && template.startsWith('#')) {
      template = $(templateName);
      logger.warn(DATAGRID_DEPRECATED_TEMPLATE_WARNING);
    }
    return super._getTemplate(template);
  }
  _dispose() {
    var that = this;
    // @ts-expect-error
    super._dispose();
    gridCore.callModuleItemsMethod(that, 'dispose');
  }
  isReady() {
    return this.getController('data').isReady();
  }
  beginUpdate() {
    var that = this;
    super.beginUpdate();
    gridCore.callModuleItemsMethod(that, 'beginUpdate');
  }
  endUpdate() {
    var that = this;
    gridCore.callModuleItemsMethod(that, 'endUpdate');
    super.endUpdate();
  }
  getController(name) {
    return this._controllers[name];
  }
  getView(name) {
    return this._views[name];
  }
  focus(element) {
    this.getController('keyboardNavigation').focus(element);
  }
  static registerModule(name, module) {
    gridCore.registerModule(name, module);
  }
}
// @ts-expect-error
registerComponent('dxDataGrid', DataGrid);
export default DataGrid;
