/**
* DevExtreme (esm/renovation/ui/scroll_view/utils/get_default_option_value.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import devices from '../../../../core/devices';
import { nativeScrolling } from '../../../../core/utils/support';
import browser from '../../../../core/utils/browser';
export function isDesktop() {
  return !devices.isSimulator() && devices.real().deviceType === 'desktop' && devices.current().platform === 'generic';
}
export function getDefaultUseSimulatedScrollbar() {
  return !!nativeScrolling && devices.real().platform === 'android' && !browser.mozilla;
}
export function getDefaultBounceEnabled() {
  return !isDesktop();
}
export function getDefaultUseNative() {
  return !!nativeScrolling;
}
export function getDefaultNativeRefreshStrategy() {
  return devices.real().platform === 'android' ? 'swipeDown' : 'pullDown';
}
