/**
* DevExtreme (format_helper.d.ts)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
  Format,
} from './localization';

export interface FormatHelper {
  format(
    value: number | Date | null | undefined | string,
    format?: Format | Record<string, unknown>): string;
}

declare const formatHelper: FormatHelper;
export default formatHelper;
