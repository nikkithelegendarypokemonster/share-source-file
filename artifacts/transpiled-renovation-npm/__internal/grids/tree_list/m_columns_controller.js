"use strict";

var _type = require("../../../core/utils/type");
var _m_columns_controller = require("../../grids/grid_core/columns_controller/m_columns_controller");
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let TreeListColumnsController = /*#__PURE__*/function (_ColumnsController) {
  _inheritsLoose(TreeListColumnsController, _ColumnsController);
  function TreeListColumnsController() {
    return _ColumnsController.apply(this, arguments) || this;
  }
  var _proto = TreeListColumnsController.prototype;
  _proto._getFirstItems = function _getFirstItems(dataSourceAdapter) {
    return _ColumnsController.prototype._getFirstItems.call(this, dataSourceAdapter).map(node => node.data);
  };
  _proto.getFirstDataColumnIndex = function getFirstDataColumnIndex() {
    const visibleColumns = this.getVisibleColumns();
    const visibleColumnsLength = visibleColumns.length;
    let firstDataColumnIndex = 0;
    for (let i = 0; i <= visibleColumnsLength - 1; i++) {
      if (!(0, _type.isDefined)(visibleColumns[i].command)) {
        firstDataColumnIndex = visibleColumns[i].index;
        break;
      }
    }
    return firstDataColumnIndex;
  };
  return TreeListColumnsController;
}(_m_columns_controller.ColumnsController);
_m_core.default.registerModule('columns', {
  defaultOptions: _m_columns_controller.columnsControllerModule.defaultOptions,
  controllers: {
    columns: TreeListColumnsController
  }
});