/**
* DevExtreme (cjs/renovation/ui/editors/common/editor_state_props.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.EditorStateProps = void 0;
var _devices = _interopRequireDefault(require("../../../../core/devices"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const EditorStateProps = exports.EditorStateProps = {
  hoverStateEnabled: true,
  activeStateEnabled: true,
  get focusStateEnabled() {
    return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
  }
};
