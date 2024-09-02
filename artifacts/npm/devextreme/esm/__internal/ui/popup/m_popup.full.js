/**
* DevExtreme (esm/__internal/ui/popup/m_popup.full.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import '../../../ui/toolbar';
import registerComponent from '../../../core/component_registrator';
import { extend } from '../../../core/utils/extend';
import Popup from '../../../ui/popup/ui.popup';
export default class PopupFull extends Popup {
  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      preventScrollEvents: false
    });
  }
  _getToolbarName() {
    return 'dxToolbar';
  }
}
// @ts-expect-error
PopupFull.defaultOptions = function (rule) {
  Popup.defaultOptions(rule);
};
// @ts-expect-error
registerComponent('dxPopup', PopupFull);
