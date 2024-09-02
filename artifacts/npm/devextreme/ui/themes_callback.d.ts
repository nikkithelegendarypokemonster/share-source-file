/**
* DevExtreme (ui/themes_callback.d.ts)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export interface ThemeReadyCallback {
  add(fn?: Function): ThemeReadyCallback;
}

// eslint-disable-next-line @typescript-eslint/init-declarations
export const themeReadyCallback: ThemeReadyCallback;
