/**
* DevExtreme (renovation/ui/editors/common/editor_state_props.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.EditorStateProps = void 0;
var _devices = _interopRequireDefault(require("../../../../core/devices"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const EditorStateProps = exports.EditorStateProps = Object.defineProperties({
  hoverStateEnabled: true,
  activeStateEnabled: true
}, {
  focusStateEnabled: {
    get: function () {
      return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
    },
    configurable: true,
    enumerable: true
  }
});
