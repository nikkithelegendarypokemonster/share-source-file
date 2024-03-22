/**
* DevExtreme (esm/ui/toolbar/strategy/toolbar.multiline.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { getWidth, getOuterWidth } from '../../../core/utils/size';
var TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
export class MultiLineStrategy {
  constructor(toolbar) {
    this._toolbar = toolbar;
  }
  _initMarkup() {}
  _updateMenuVisibility() {}
  _renderMenuItems() {}
  _renderItem() {}
  _getMenuItems() {}
  _getToolbarItems() {
    var _this$_toolbar$option;
    return (_this$_toolbar$option = this._toolbar.option('items')) !== null && _this$_toolbar$option !== void 0 ? _this$_toolbar$option : [];
  }
  _getItemsWidth() {
    return this._toolbar._getSummaryItemsSize('width', this._toolbar.itemElements(), true);
  }
  _arrangeItems() {
    var $label = this._toolbar._$toolbarItemsContainer.find(".".concat(TOOLBAR_LABEL_CLASS)).eq(0);
    if (!$label.length) {
      return;
    }
    var elementWidth = getWidth(this._toolbar.$element());
    var labelPaddings = getOuterWidth($label) - getWidth($label);
    $label.css('maxWidth', elementWidth - labelPaddings);
  }
  _hideOverflowItems() {}
  _dimensionChanged() {}
  _itemOptionChanged() {}
  _optionChanged() {}
}
