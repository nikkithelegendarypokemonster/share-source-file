"use strict";

exports.MultiLineStrategy = void 0;
var _size = require("../../../core/utils/size");
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
let MultiLineStrategy = exports.MultiLineStrategy = /*#__PURE__*/function () {
  function MultiLineStrategy(toolbar) {
    this._toolbar = toolbar;
  }
  var _proto = MultiLineStrategy.prototype;
  _proto._initMarkup = function _initMarkup() {};
  _proto._updateMenuVisibility = function _updateMenuVisibility() {};
  _proto._renderMenuItems = function _renderMenuItems() {};
  _proto._renderItem = function _renderItem() {};
  _proto._getMenuItems = function _getMenuItems() {};
  _proto._getToolbarItems = function _getToolbarItems() {
    var _this$_toolbar$option;
    return (_this$_toolbar$option = this._toolbar.option('items')) !== null && _this$_toolbar$option !== void 0 ? _this$_toolbar$option : [];
  };
  _proto._getItemsWidth = function _getItemsWidth() {
    return this._toolbar._getSummaryItemsSize('width', this._toolbar.itemElements(), true);
  };
  _proto._arrangeItems = function _arrangeItems() {
    const $label = this._toolbar._$toolbarItemsContainer.find(".".concat(TOOLBAR_LABEL_CLASS)).eq(0);
    if (!$label.length) {
      return;
    }
    const elementWidth = (0, _size.getWidth)(this._toolbar.$element());
    const labelPaddings = (0, _size.getOuterWidth)($label) - (0, _size.getWidth)($label);
    $label.css('maxWidth', elementWidth - labelPaddings);
  };
  _proto._hideOverflowItems = function _hideOverflowItems() {};
  _proto._dimensionChanged = function _dimensionChanged() {};
  _proto._itemOptionChanged = function _itemOptionChanged() {};
  _proto._optionChanged = function _optionChanged() {};
  return MultiLineStrategy;
}();