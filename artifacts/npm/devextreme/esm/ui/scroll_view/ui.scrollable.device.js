/**
* DevExtreme (esm/ui/scroll_view/ui.scrollable.device.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import devices from '../../core/devices';
import { nativeScrolling, touch } from '../../core/utils/support';
export var deviceDependentOptions = function deviceDependentOptions() {
  return [{
    device: function device() {
      return !nativeScrolling;
    },
    options: {
      useNative: false
    }
  }, {
    device: function device(_device) {
      return !devices.isSimulator() && devices.real().deviceType === 'desktop' && _device.platform === 'generic';
    },
    options: {
      bounceEnabled: false,
      scrollByThumb: true,
      scrollByContent: touch,
      showScrollbar: 'onHover'
    }
  }];
};
