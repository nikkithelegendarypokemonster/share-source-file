/**
* DevExtreme (cjs/__internal/ui/tab_panel/m_item.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _common = require("../../../core/utils/common");
var _m_item = _interopRequireDefault(require("../../ui/collection/m_item"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class TabPanelItem extends _m_item.default {
  _renderWatchers() {
    // @ts-expect-error
    this._startWatcher('badge', _common.noop);
    // @ts-expect-error
    return super._renderWatchers();
  }
}
exports.default = TabPanelItem;
