import getElementComputedStyle from '../../core/r1/utils/get_computed_style';
import { toNumber } from '../../core/r1/utils/type_conversion';
export function getElementStyle(name, element) {
  const computedStyle = getElementComputedStyle(element) ?? {};
  return toNumber(computedStyle[name]);
}
export function getElementContentWidth(element) {
  const padding = getElementStyle('paddingLeft', element) + getElementStyle('paddingRight', element);
  const width = getElementStyle('width', element);
  return width - padding;
}
export function getElementWidth(element) {
  const margin = getElementStyle('marginLeft', element) + getElementStyle('marginRight', element);
  const width = getElementStyle('width', element);
  return margin + width;
}
export function getElementMinWidth(element) {
  return getElementStyle('minWidth', element);
}