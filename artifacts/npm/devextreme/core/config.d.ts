/**
* DevExtreme (core/config.d.ts)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { GlobalConfig } from '../common';

/** @public */
export type FloatingActionButtonDirection = 'auto' | 'up' | 'down';

/**
 * @docid
 * @publicName config()
 * @namespace DevExpress
 * @public
 */
declare function config(): GlobalConfig;

/**
 * @docid
 * @publicName config(config)
 * @namespace DevExpress
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
declare function config(config: GlobalConfig): void;

/**
* @namespace DevExpress
* @deprecated Use GlobalConfig instead
*/
export type globalConfig = GlobalConfig;

export default config;
