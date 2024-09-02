import { ScrollbarProps } from './scrollbar_props';
export const AnimatedScrollbarProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(ScrollbarProps), Object.getOwnPropertyDescriptors({
  pulledDown: false,
  bottomPocketSize: 0,
  contentPaddingBottom: 0
})));