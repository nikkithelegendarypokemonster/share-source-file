import { ScrollableProps } from './scrollable_props';
export const ScrollViewProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(ScrollableProps), Object.getOwnPropertyDescriptors({
  pullDownEnabled: false,
  reachBottomEnabled: false
})));