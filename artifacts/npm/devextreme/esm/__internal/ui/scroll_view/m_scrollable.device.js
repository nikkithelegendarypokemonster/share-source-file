/**
* DevExtreme (esm/__internal/ui/scroll_view/m_scrollable.device.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import devices from '../../../core/devices';
import { nativeScrolling, touch } from '../../../core/utils/support';
export const deviceDependentOptions = function () {
  return [{
    device() {
      return !nativeScrolling;
    },
    options: {
      useNative: false
    }
  }, {
    device(device) {
      return !devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic';
    },
    options: {
      bounceEnabled: false,
      scrollByThumb: true,
      scrollByContent: touch,
      showScrollbar: 'onHover'
    }
  }];
};
