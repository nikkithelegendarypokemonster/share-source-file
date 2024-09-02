/**
* DevExtreme (ui/text_area.d.ts)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    ValueChangedInfo,
} from './editor/editor';

import dxTextBox, {
    dxTextBoxOptions,
} from './text_box';

/**
 * @docid _ui_text_area_ChangeEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ChangeEvent = NativeEventInfo<dxTextArea, Event>;

/**
 * @docid _ui_text_area_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxTextArea>;

/**
 * @docid _ui_text_area_CopyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CopyEvent = NativeEventInfo<dxTextArea, ClipboardEvent>;

/**
 * @docid _ui_text_area_CutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CutEvent = NativeEventInfo<dxTextArea, ClipboardEvent>;

/**
 * @docid _ui_text_area_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxTextArea>;

/**
 * @docid _ui_text_area_EnterKeyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type EnterKeyEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/**
 * @docid _ui_text_area_FocusInEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusInEvent = NativeEventInfo<dxTextArea, FocusEvent>;

/**
 * @docid _ui_text_area_FocusOutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusOutEvent = NativeEventInfo<dxTextArea, FocusEvent>;

/**
 * @docid _ui_text_area_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxTextArea>;

/**
 * @docid _ui_text_area_InputEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type InputEvent = NativeEventInfo<dxTextArea, UIEvent & { target: HTMLInputElement }>;

/**
 * @docid _ui_text_area_KeyDownEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyDownEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/**
 * @docid _ui_text_area_KeyUpEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyUpEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/**
 * @docid _ui_text_area_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxTextArea> & ChangedOptionInfo;

/**
 * @docid _ui_text_area_PasteEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type PasteEvent = NativeEventInfo<dxTextArea, ClipboardEvent>;

/**
 * @docid _ui_text_area_ValueChangedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ValueChangedInfo
 */
export type ValueChangedEvent = NativeEventInfo<dxTextArea, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxTextAreaOptions extends dxTextBoxOptions<dxTextArea> {
    /**
     * @docid
     * @default false
     * @public
     */
    autoResizeEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    maxHeight?: number | string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    minHeight?: number | string;
    /**
     * @docid
     * @default true
     * @public
     */
    spellcheck?: boolean;
}
/**
 * @docid
 * @isEditor
 * @inherits dxTextBox
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTextArea extends dxTextBox<dxTextAreaOptions> { }

/** @public */
export type Properties = dxTextAreaOptions;

/** @deprecated use Properties instead */
export type Options = dxTextAreaOptions;


