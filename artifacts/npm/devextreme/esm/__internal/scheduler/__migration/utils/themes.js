/**
* DevExtreme (esm/__internal/scheduler/__migration/utils/themes.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { current, isCompact, isFluent, isMaterial, isMaterialBased } from '../../../../ui/themes';
export var getThemeType = () => {
  var theme = current();
  return {
    isCompact: isCompact(theme),
    isMaterial: isMaterial(theme),
    isFluent: isFluent(theme),
    isMaterialBased: isMaterialBased(theme)
  };
};
