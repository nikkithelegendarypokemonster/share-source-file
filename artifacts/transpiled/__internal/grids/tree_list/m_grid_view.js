"use strict";

var _m_grid_view = require("../../grids/grid_core/views/m_grid_view");
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let TreeListResizingController = /*#__PURE__*/function (_ResizingController) {
  _inheritsLoose(TreeListResizingController, _ResizingController);
  function TreeListResizingController() {
    return _ResizingController.apply(this, arguments) || this;
  }
  var _proto = TreeListResizingController.prototype;
  _proto._getWidgetAriaLabel = function _getWidgetAriaLabel() {
    return 'dxTreeList-ariaTreeList';
  };
  _proto._toggleBestFitMode = function _toggleBestFitMode(isBestFit) {
    _ResizingController.prototype._toggleBestFitMode.call(this, isBestFit);
    const $rowsTable = this._rowsView.getTableElement();
    $rowsTable.find('.dx-treelist-cell-expandable').toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
  };
  return TreeListResizingController;
}(_m_grid_view.ResizingController);
_m_core.default.registerModule('gridView', {
  defaultOptions: _m_grid_view.gridViewModule.defaultOptions,
  controllers: _extends(_extends({}, _m_grid_view.gridViewModule.controllers), {
    resizing: TreeListResizingController
  }),
  views: _m_grid_view.gridViewModule.views
});