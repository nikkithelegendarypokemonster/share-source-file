import { ScrollableSimulatedProps } from './simulated_strategy_props';
import { getDefaultUseNative, getDefaultNativeRefreshStrategy, getDefaultUseSimulatedScrollbar } from '../utils/get_default_option_value';
export const ScrollableProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(ScrollableSimulatedProps), Object.getOwnPropertyDescriptors({
  get useNative() {
    return getDefaultUseNative();
  },
  get useSimulatedScrollbar() {
    return getDefaultUseSimulatedScrollbar();
  },
  get refreshStrategy() {
    return getDefaultNativeRefreshStrategy();
  }
})));