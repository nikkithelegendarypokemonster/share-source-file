/**
* DevExtreme (esm/viz/funnel/tiling.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { normalizeEnum as _normalizeEnum } from '../core/utils';
const algorithms = {};
let defaultAlgorithm;
export function getAlgorithm(name) {
  return algorithms[_normalizeEnum(name)] || defaultAlgorithm;
}
export function addAlgorithm(name, callback, setDefault) {
  algorithms[name] = callback;
  if (setDefault) {
    defaultAlgorithm = algorithms[name];
  }
}
