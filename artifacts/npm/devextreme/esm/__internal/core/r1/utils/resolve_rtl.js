/**
* DevExtreme (esm/__internal/core/r1/utils/resolve_rtl.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import globalConfig from '../../../../core/config';
import { isDefined } from '../../../../core/utils/type';
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
  const isPropDefined = isDefined(rtlProp);
  const onlyGlobalDefined = isDefined(globalConfig().rtlEnabled) && !isPropDefined && !isDefined(config === null || config === void 0 ? void 0 : config.rtlEnabled);
  return isPropDefined && rtlProp !== (config === null || config === void 0 ? void 0 : config.rtlEnabled) || onlyGlobalDefined;
}
