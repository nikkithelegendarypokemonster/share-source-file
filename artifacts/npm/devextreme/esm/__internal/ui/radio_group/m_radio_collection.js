/**
* DevExtreme (esm/__internal/ui/radio_group/m_radio_collection.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import $ from '../../../core/renderer';
import { deferRender } from '../../../core/utils/common';
import { extend } from '../../../core/utils/extend';
import DataExpressionMixin from '../../../ui/editor/ui.data_expression';
import CollectionWidget from '../../ui/collection/edit';
const RADIO_BUTTON_CHECKED_CLASS = 'dx-radiobutton-checked';
const RADIO_BUTTON_ICON_CHECKED_CLASS = 'dx-radiobutton-icon-checked';
const RADIO_BUTTON_ICON_CLASS = 'dx-radiobutton-icon';
const RADIO_BUTTON_ICON_DOT_CLASS = 'dx-radiobutton-icon-dot';
const RADIO_VALUE_CONTAINER_CLASS = 'dx-radio-value-container';
const RADIO_BUTTON_CLASS = 'dx-radiobutton';
class RadioCollection extends CollectionWidget {
  _focusTarget() {
    return $(this.element()).parent();
  }
  // eslint-disable-next-line class-methods-use-this
  _nullValueSelectionSupported() {
    return true;
  }
  _getDefaultOptions() {
    const defaultOptions = super._getDefaultOptions();
    // @ts-expect-error
    return extend(defaultOptions, DataExpressionMixin._dataExpressionDefaultOptions(), {
      _itemAttributes: {
        role: 'radio'
      }
    });
  }
  _initMarkup() {
    super._initMarkup();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deferRender(() => {
      this._itemElements().addClass(RADIO_BUTTON_CLASS);
    });
  }
  _keyboardEventBindingTarget() {
    return this._focusTarget();
  }
  _postprocessRenderItem(args) {
    const {
      itemData: {
        html
      },
      itemElement
    } = args;
    if (!html) {
      const $radio = $('<div>').addClass(RADIO_BUTTON_ICON_CLASS);
      $('<div>').addClass(RADIO_BUTTON_ICON_DOT_CLASS).appendTo($radio);
      const $radioContainer = $('<div>').append($radio).addClass(RADIO_VALUE_CONTAINER_CLASS);
      $(itemElement).prepend($radioContainer);
    }
    super._postprocessRenderItem(args);
  }
  _processSelectableItem($itemElement, isSelected) {
    super._processSelectableItem($itemElement, isSelected);
    $itemElement.toggleClass(RADIO_BUTTON_CHECKED_CLASS, isSelected).find(`.${RADIO_BUTTON_ICON_CLASS}`).first().toggleClass(RADIO_BUTTON_ICON_CHECKED_CLASS, isSelected);
    this.setAria('checked', isSelected, $itemElement);
  }
  _refreshContent() {
    this._prepareContent();
    this._renderContent();
  }
  _supportedKeys() {
    const parent = super._supportedKeys();
    return extend({}, parent, {
      enter(e) {
        e.preventDefault();
        // @ts-expect-error
        return parent.enter.apply(this, arguments);
      },
      space(e) {
        e.preventDefault();
        // @ts-expect-error
        return parent.space.apply(this, arguments);
      }
    });
  }
  _itemElements() {
    return this._itemContainer().children(this._itemSelector());
  }
  _setAriaSelectionAttribute() {}
}
export default RadioCollection;
