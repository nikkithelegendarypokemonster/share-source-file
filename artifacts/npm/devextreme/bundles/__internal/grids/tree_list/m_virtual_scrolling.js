/**
* DevExtreme (bundles/__internal/grids/tree_list/m_virtual_scrolling.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _extend = require("../../../core/utils/extend");
var _m_virtual_scrolling = require("../../grids/grid_core/virtual_scrolling/m_virtual_scrolling");
var _m_data_source_adapter = _interopRequireDefault(require("./data_source_adapter/m_data_source_adapter"));
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const oldDefaultOptions = _m_virtual_scrolling.virtualScrollingModule.defaultOptions;
_m_virtual_scrolling.virtualScrollingModule.extenders.controllers.data = Base => /*#__PURE__*/function (_virtualScrollingData) {
  _inheritsLoose(TreeListVirtualScrollingDataControllerExtender, _virtualScrollingData);
  function TreeListVirtualScrollingDataControllerExtender() {
    return _virtualScrollingData.apply(this, arguments) || this;
  }
  var _proto = TreeListVirtualScrollingDataControllerExtender.prototype;
  _proto._loadOnOptionChange = function _loadOnOptionChange() {
    var _a;
    const virtualScrollController = (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a._virtualScrollController;
    virtualScrollController === null || virtualScrollController === void 0 ? void 0 : virtualScrollController.reset();
    // @ts-expect-error
    _virtualScrollingData.prototype._loadOnOptionChange.call(this);
  };
  return TreeListVirtualScrollingDataControllerExtender;
}((0, _m_virtual_scrolling.data)(Base));
const dataSourceAdapterExtender = Base => /*#__PURE__*/function (_virtualScrollingData2) {
  _inheritsLoose(VirtualScrollingDataSourceAdapterExtender, _virtualScrollingData2);
  function VirtualScrollingDataSourceAdapterExtender() {
    return _virtualScrollingData2.apply(this, arguments) || this;
  }
  var _proto2 = VirtualScrollingDataSourceAdapterExtender.prototype;
  _proto2.changeRowExpand = function changeRowExpand() {
    return _virtualScrollingData2.prototype.changeRowExpand.apply(this, arguments).done(() => {
      const viewportItemIndex = this.getViewportItemIndex();
      viewportItemIndex >= 0 && this.setViewportItemIndex(viewportItemIndex);
    });
  };
  return VirtualScrollingDataSourceAdapterExtender;
}((0, _m_virtual_scrolling.dataSourceAdapterExtender)(Base));
_m_core.default.registerModule('virtualScrolling', _extends(_extends({}, _m_virtual_scrolling.virtualScrollingModule), {
  defaultOptions() {
    return (0, _extend.extend)(true, oldDefaultOptions(), {
      scrolling: {
        mode: 'virtual'
      }
    });
  }
}));
_m_data_source_adapter.default.extend(dataSourceAdapterExtender);
