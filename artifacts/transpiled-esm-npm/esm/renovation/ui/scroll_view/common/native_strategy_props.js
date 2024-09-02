import { BaseScrollableProps } from './base_scrollable_props';
import { getDefaultNativeRefreshStrategy, getDefaultUseSimulatedScrollbar } from '../utils/get_default_option_value';
export const ScrollableNativeProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(BaseScrollableProps), Object.getOwnPropertyDescriptors({
  get useSimulatedScrollbar() {
    return getDefaultUseSimulatedScrollbar();
  },
  showScrollbar: 'onScroll',
  get refreshStrategy() {
    return getDefaultNativeRefreshStrategy();
  }
})));