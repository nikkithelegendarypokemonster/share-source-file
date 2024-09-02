/**
* DevExtreme (esm/__internal/ui/splitter/utils/component.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export function getComponentInstance($element) {
  var _$element$data, _$element$data2;
  const componentName = (_$element$data = $element.data) === null || _$element$data === void 0 ? void 0 : _$element$data.call($element, 'dxComponents')[0];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return componentName && ((_$element$data2 = $element.data) === null || _$element$data2 === void 0 ? void 0 : _$element$data2.call($element, `${componentName}`));
}
