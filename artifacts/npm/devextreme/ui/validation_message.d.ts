/**
* DevExtreme (ui/validation_message.d.ts)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElement,
} from '../core/element';

import dxOverlay, {
    dxOverlayOptions,
} from './overlay';

/** @namespace DevExpress.ui */
export interface dxValidationMessageOptions extends dxOverlayOptions<dxValidationMessage> {
    mode?: string;

    validationErrors?: Array<object> | null;

    positionSide?: string;

    boundary?: String | UserDefinedElement;

    offset?: object;
}
/** @namespace DevExpress.ui */
export default class dxValidationMessage extends dxOverlay<dxValidationMessageOptions> { }

/** @public */
export type Properties = dxValidationMessageOptions;

/** @deprecated use Properties instead */
export type Options = dxValidationMessageOptions;
