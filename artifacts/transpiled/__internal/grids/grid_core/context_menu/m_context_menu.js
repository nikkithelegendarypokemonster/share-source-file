"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contextMenuModule = exports.ContextMenuView = exports.ContextMenuController = void 0;
var _element = require("../../../../core/element");
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _iterator = require("../../../../core/utils/iterator");
var _context_menu = _interopRequireDefault(require("../../../../ui/context_menu"));
var _m_modules = _interopRequireDefault(require("../m_modules"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const CONTEXT_MENU = 'dx-context-menu';
const viewName = {
  columnHeadersView: 'header',
  rowsView: 'content',
  footerView: 'footer',
  headerPanel: 'headerPanel'
};
const VIEW_NAMES = ['columnHeadersView', 'rowsView', 'footerView', 'headerPanel'];
let ContextMenuController = exports.ContextMenuController = /*#__PURE__*/function (_modules$ViewControll) {
  _inheritsLoose(ContextMenuController, _modules$ViewControll);
  function ContextMenuController() {
    return _modules$ViewControll.apply(this, arguments) || this;
  }
  var _proto = ContextMenuController.prototype;
  _proto.init = function init() {
    this.createAction('onContextMenuPreparing');
  };
  _proto.getContextMenuItems = function getContextMenuItems(dxEvent) {
    if (!dxEvent) {
      return false;
    }
    const that = this;
    const $targetElement = (0, _renderer.default)(dxEvent.target);
    let $element;
    let $targetRowElement;
    let $targetCellElement;
    let menuItems;
    (0, _iterator.each)(VIEW_NAMES, function () {
      var _a, _b;
      const view = that.getView(this);
      $element = view && view.element();
      if ($element && ($element.is($targetElement) || $element.find($targetElement).length)) {
        $targetCellElement = $targetElement.closest('.dx-row > td, .dx-row > tr');
        $targetRowElement = $targetCellElement.parent();
        const rowIndex = view.getRowIndex($targetRowElement);
        const columnIndex = $targetCellElement[0] && $targetCellElement[0].cellIndex;
        const rowOptions = $targetRowElement.data('options');
        const options = {
          event: dxEvent,
          targetElement: (0, _element.getPublicElement)($targetElement),
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
  ;
  _proto._contextMenuPrepared = function _contextMenuPrepared(options) {};
  return ContextMenuController;
}(_m_modules.default.ViewController);
let ContextMenuView = exports.ContextMenuView = /*#__PURE__*/function (_modules$View) {
  _inheritsLoose(ContextMenuView, _modules$View);
  function ContextMenuView() {
    return _modules$View.apply(this, arguments) || this;
  }
  var _proto2 = ContextMenuView.prototype;
  _proto2.init = function init() {
    _modules$View.prototype.init.call(this);
    this._contextMenuController = this.getController('contextMenu');
  };
  _proto2._renderCore = function _renderCore() {
    const $element = this.element().addClass(CONTEXT_MENU);
    this.setAria('role', 'presentation', $element);
    this._createComponent($element, _context_menu.default, {
      onPositioning: actionArgs => {
        const {
          event
        } = actionArgs;
        const contextMenuInstance = actionArgs.component;
        const items = this._contextMenuController.getContextMenuItems(event);
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
  };
  return ContextMenuView;
}(_m_modules.default.View);
const contextMenuModule = exports.contextMenuModule = {
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