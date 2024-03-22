/**
* DevExtreme (cjs/__internal/grids/tree_list/m_keyboard_navigation.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _extend = require("../../../core/utils/extend");
var _m_keyboard_navigation = require("../../grids/grid_core/keyboard_navigation/m_keyboard_navigation");
var _scrollable_a11y = require("../../grids/grid_core/keyboard_navigation/scrollable_a11y");
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const keyboardNavigation = Base => /*#__PURE__*/function (_keyboardNavigationSc) {
  _inheritsLoose(TreeListKeyboardNavigationControllerExtender, _keyboardNavigationSc);
  function TreeListKeyboardNavigationControllerExtender() {
    return _keyboardNavigationSc.apply(this, arguments) || this;
  }
  var _proto = TreeListKeyboardNavigationControllerExtender.prototype;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _proto._leftRightKeysHandler = function _leftRightKeysHandler(eventArgs, _isEditing) {
    const rowIndex = this.getVisibleRowIndex();
    const dataController = this._dataController;
    if (eventArgs.ctrl) {
      const directionCode = this._getDirectionCodeByKey(eventArgs.keyName);
      const key = dataController.getKeyByRowIndex(rowIndex);
      if (directionCode === 'nextInRow') {
        // @ts-expect-error
        dataController.expandRow(key);
      } else {
        // @ts-expect-error
        dataController.collapseRow(key);
      }
    } else {
      return _keyboardNavigationSc.prototype._leftRightKeysHandler.apply(this, arguments);
    }
  };
  return TreeListKeyboardNavigationControllerExtender;
}((0, _scrollable_a11y.keyboardNavigationScrollableA11yExtender)(Base));
_m_core.default.registerModule('keyboardNavigation', (0, _extend.extend)(true, {}, _m_keyboard_navigation.keyboardNavigationModule, {
  extenders: {
    controllers: {
      keyboardNavigation
    }
  }
}));
