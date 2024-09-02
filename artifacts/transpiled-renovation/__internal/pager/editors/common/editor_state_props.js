"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorStateDefaultProps = void 0;
var _devices = _interopRequireDefault(require("../../../../core/devices"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const EditorStateDefaultProps = exports.EditorStateDefaultProps = {
  hoverStateEnabled: true,
  activeStateEnabled: true,
  focusStateEnabled: _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator()
};