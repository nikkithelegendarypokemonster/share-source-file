/**
* DevExtreme (core/options.d.ts)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    Device,
} from './devices';

import {
    DeepPartial,
} from './index';

/**
 * @docid
 * @public
 */
export type DefaultOptionsRule<T> = {
    device?: Device | Device[] | ((device: Device) => boolean);
    options: DeepPartial<T>;
};
