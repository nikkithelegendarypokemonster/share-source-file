import { BaseScrollableProps } from './base_scrollable_props';
import { isDesktop } from '../utils/get_default_option_value';
export const ScrollableSimulatedProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(BaseScrollableProps), Object.getOwnPropertyDescriptors({
  inertiaEnabled: true,
  useKeyboard: true,
  get showScrollbar() {
    return isDesktop() ? 'onHover' : 'onScroll';
  },
  get scrollByThumb() {
    return isDesktop();
  },
  refreshStrategy: 'simulated'
})));