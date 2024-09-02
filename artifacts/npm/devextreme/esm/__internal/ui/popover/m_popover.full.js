/**
* DevExtreme (esm/__internal/ui/popover/m_popover.full.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import '../../../ui/toolbar';
import registerComponent from '../../../core/component_registrator';
import { extend } from '../../../core/utils/extend';
import Popover from '../../../ui/popover/ui.popover';
export default class PopoverFull extends Popover {
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
PopoverFull.defaultOptions = function (rule) {
  Popover.defaultOptions(rule);
};
// @ts-expect-error
registerComponent('dxPopover', PopoverFull);
