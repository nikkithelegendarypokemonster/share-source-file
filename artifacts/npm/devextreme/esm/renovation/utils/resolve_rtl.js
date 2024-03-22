/**
* DevExtreme (esm/renovation/utils/resolve_rtl.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { isDefined } from '../../core/utils/type';
import globalConfig from '../../core/config';
export function resolveRtlEnabled(rtlProp, config) {
  if (rtlProp !== undefined) {
    return rtlProp;
  }
  if ((config === null || config === void 0 ? void 0 : config.rtlEnabled) !== undefined) {
    return config.rtlEnabled;
  }
  return globalConfig().rtlEnabled;
}
export function resolveRtlEnabledDefinition(rtlProp, config) {
  var isPropDefined = isDefined(rtlProp);
  var onlyGlobalDefined = isDefined(globalConfig().rtlEnabled) && !isPropDefined && !isDefined(config === null || config === void 0 ? void 0 : config.rtlEnabled);
  return isPropDefined && rtlProp !== (config === null || config === void 0 ? void 0 : config.rtlEnabled) || onlyGlobalDefined;
}
