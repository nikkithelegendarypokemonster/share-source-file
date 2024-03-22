/**
* DevExtreme (cjs/ui/scroll_view/ui.scrollable.device.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.deviceDependentOptions = void 0;
var _devices = _interopRequireDefault(require("../../core/devices"));
var _support = require("../../core/utils/support");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const deviceDependentOptions = function () {
  return [{
    device: function () {
      return !_support.nativeScrolling;
    },
    options: {
      useNative: false
    }
  }, {
    device: function (device) {
      return !_devices.default.isSimulator() && _devices.default.real().deviceType === 'desktop' && device.platform === 'generic';
    },
    options: {
      bounceEnabled: false,
      scrollByThumb: true,
      scrollByContent: _support.touch,
      showScrollbar: 'onHover'
    }
  }];
};
exports.deviceDependentOptions = deviceDependentOptions;
