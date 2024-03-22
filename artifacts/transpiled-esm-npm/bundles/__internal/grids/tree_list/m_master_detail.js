"use strict";

var _extend = require("../../../core/utils/extend");
var _m_master_detail = require("../../grids/grid_core/master_detail/m_master_detail");
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const data = Base => /*#__PURE__*/function (_dataMasterDetailExte) {
  _inheritsLoose(DataMasterDetailTreeListExtender, _dataMasterDetailExte);
  function DataMasterDetailTreeListExtender() {
    return _dataMasterDetailExte.apply(this, arguments) || this;
  }
  var _proto = DataMasterDetailTreeListExtender.prototype;
  _proto.isRowExpanded = function isRowExpanded() {
    // @ts-expect-error
    return this.isRowExpandedHack.apply(this, arguments);
  };
  _proto._processItems = function _processItems() {
    // @ts-expect-error
    return this._processItemsHack.apply(this, arguments);
  };
  _proto._processDataItem = function _processDataItem() {
    // @ts-expect-error
    return this._processDataItemHack.apply(this, arguments);
  };
  return DataMasterDetailTreeListExtender;
}((0, _m_master_detail.dataMasterDetailExtenderMixin)(Base));
_m_core.default.registerModule('masterDetail', (0, _extend.extend)(true, {}, _m_master_detail.masterDetailModule, {
  extenders: {
    controllers: {
      data
    }
  }
}));