"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getComponentInstance = getComponentInstance;
function getComponentInstance($element) {
  var _a, _b;
  const componentName = (_a = $element.data) === null || _a === void 0 ? void 0 : _a.call($element, 'dxComponents')[0];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return componentName && ((_b = $element.data) === null || _b === void 0 ? void 0 : _b.call($element, "".concat(componentName)));
}