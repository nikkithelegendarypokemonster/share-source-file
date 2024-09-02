/**
* DevExtreme (esm/localization/core.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import dependencyInjector from '../core/utils/dependency_injector';
import parentLocales from './cldr-data/parent_locales';
import getParentLocale from './parentLocale';
const DEFAULT_LOCALE = 'en';
export default dependencyInjector({
  locale: (() => {
    let currentLocale = DEFAULT_LOCALE;
    return locale => {
      if (!locale) {
        return currentLocale;
      }
      currentLocale = locale;
    };
  })(),
  getValueByClosestLocale: function (getter) {
    let locale = this.locale();
    let value = getter(locale);
    let isRootLocale;
    while (!value && !isRootLocale) {
      locale = getParentLocale(parentLocales, locale);
      if (locale) {
        value = getter(locale);
      } else {
        isRootLocale = true;
      }
    }
    if (value === undefined && locale !== DEFAULT_LOCALE) {
      return getter(DEFAULT_LOCALE);
    }
    return value;
  }
});
