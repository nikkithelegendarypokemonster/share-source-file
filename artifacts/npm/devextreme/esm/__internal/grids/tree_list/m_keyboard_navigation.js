/**
* DevExtreme (esm/__internal/grids/tree_list/m_keyboard_navigation.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { extend } from '../../../core/utils/extend';
import { keyboardNavigationModule } from '../../grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import { keyboardNavigationScrollableA11yExtender } from '../../grids/grid_core/keyboard_navigation/scrollable_a11y';
import core from './m_core';
var keyboardNavigation = Base => class TreeListKeyboardNavigationControllerExtender extends keyboardNavigationScrollableA11yExtender(Base) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _leftRightKeysHandler(eventArgs, _isEditing) {
    var rowIndex = this.getVisibleRowIndex();
    var dataController = this._dataController;
    if (eventArgs.ctrl) {
      var directionCode = this._getDirectionCodeByKey(eventArgs.keyName);
      var key = dataController.getKeyByRowIndex(rowIndex);
      if (directionCode === 'nextInRow') {
        // @ts-expect-error
        dataController.expandRow(key);
      } else {
        // @ts-expect-error
        dataController.collapseRow(key);
      }
    } else {
      return super._leftRightKeysHandler.apply(this, arguments);
    }
  }
};
core.registerModule('keyboardNavigation', extend(true, {}, keyboardNavigationModule, {
  extenders: {
    controllers: {
      keyboardNavigation
    }
  }
}));