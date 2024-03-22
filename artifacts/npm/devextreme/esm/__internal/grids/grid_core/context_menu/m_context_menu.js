/**
* DevExtreme (esm/__internal/grids/grid_core/context_menu/m_context_menu.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable max-classes-per-file */
import { getPublicElement } from '../../../../core/element';
import $ from '../../../../core/renderer';
import { each } from '../../../../core/utils/iterator';
import ContextMenu from '../../../../ui/context_menu';
import modules from '../m_modules';
var CONTEXT_MENU = 'dx-context-menu';
var viewName = {
  columnHeadersView: 'header',
  rowsView: 'content',
  footerView: 'footer',
  headerPanel: 'headerPanel'
};
var VIEW_NAMES = ['columnHeadersView', 'rowsView', 'footerView', 'headerPanel'];
export class ContextMenuController extends modules.ViewController {
  init() {
    this.createAction('onContextMenuPreparing');
  }
  getContextMenuItems(dxEvent) {
    if (!dxEvent) {
      return false;
    }
    var that = this;
    var $targetElement = $(dxEvent.target);
    var $element;
    var $targetRowElement;
    var $targetCellElement;
    var menuItems;
    each(VIEW_NAMES, function () {
      var _a, _b;
      var view = that.getView(this);
      $element = view && view.element();
      if ($element && ($element.is($targetElement) || $element.find($targetElement).length)) {
        $targetCellElement = $targetElement.closest('.dx-row > td, .dx-row > tr');
        $targetRowElement = $targetCellElement.parent();
        var rowIndex = view.getRowIndex($targetRowElement);
        var columnIndex = $targetCellElement[0] && $targetCellElement[0].cellIndex;
        var rowOptions = $targetRowElement.data('options');
        var options = {
          event: dxEvent,
          targetElement: getPublicElement($targetElement),
          target: viewName[this],
          rowIndex,
          // @ts-expect-error
          row: view._getRows()[rowIndex],
          columnIndex,
          column: (_b = (_a = rowOptions === null || rowOptions === void 0 ? void 0 : rowOptions.cells) === null || _a === void 0 ? void 0 : _a[columnIndex]) === null || _b === void 0 ? void 0 : _b.column
        };
        // @ts-expect-error
        options.items = view.getContextMenuItems && view.getContextMenuItems(options);
        that.executeAction('onContextMenuPreparing', options);
        that._contextMenuPrepared(options);
        menuItems = options.items;
        if (menuItems) {
          return false;
        }
      }
      return undefined;
    });
    return menuItems;
  }
  /**
   * @extended: selection
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _contextMenuPrepared(options) {}
}
export class ContextMenuView extends modules.View {
  init() {
    super.init();
    this._contextMenuController = this.getController('contextMenu');
  }
  _renderCore() {
    var $element = this.element().addClass(CONTEXT_MENU);
    this.setAria('role', 'presentation', $element);
    this._createComponent($element, ContextMenu, {
      onPositioning: actionArgs => {
        var {
          event
        } = actionArgs;
        var contextMenuInstance = actionArgs.component;
        var items = this._contextMenuController.getContextMenuItems(event);
        if (items) {
          contextMenuInstance.option('items', items);
          event.stopPropagation();
        } else {
          // @ts-expect-error
          actionArgs.cancel = true;
        }
      },
      onItemClick(params) {
        var _a, _b;
        // @ts-expect-error
        (_b = (_a = params.itemData) === null || _a === void 0 ? void 0 : _a.onItemClick) === null || _b === void 0 ? void 0 : _b.call(_a, params);
      },
      cssClass: this.getWidgetContainerClass(),
      target: this.component.$element()
    });
  }
}
export var contextMenuModule = {
  defaultOptions() {
    return {
      onContextMenuPreparing: null
    };
  },
  controllers: {
    contextMenu: ContextMenuController
  },
  views: {
    contextMenuView: ContextMenuView
  }
};
