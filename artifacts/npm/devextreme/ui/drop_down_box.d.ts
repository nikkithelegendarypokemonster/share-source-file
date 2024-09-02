/**
* DevExtreme (ui/drop_down_box.d.ts)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import DataSource, { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    DataExpressionMixinOptions,
} from './editor/ui.data_expression';

import {
    Properties as PopupProperties,
} from './popup';

/**
 * @docid _ui_drop_down_box_ChangeEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ChangeEvent = NativeEventInfo<dxDropDownBox, Event>;

/**
 * @docid _ui_drop_down_box_ClosedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ClosedEvent = EventInfo<dxDropDownBox>;

/**
 * @docid _ui_drop_down_box_CopyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CopyEvent = NativeEventInfo<dxDropDownBox, ClipboardEvent>;

/**
 * @docid _ui_drop_down_box_CutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CutEvent = NativeEventInfo<dxDropDownBox, ClipboardEvent>;

/**
 * @docid _ui_drop_down_box_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxDropDownBox>;

/**
 * @docid _ui_drop_down_box_EnterKeyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type EnterKeyEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent>;

/**
 * @docid _ui_drop_down_box_FocusInEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusInEvent = NativeEventInfo<dxDropDownBox, FocusEvent>;

/**
 * @docid _ui_drop_down_box_FocusOutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusOutEvent = NativeEventInfo<dxDropDownBox, FocusEvent>;

/**
 * @docid _ui_drop_down_box_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxDropDownBox>;

/**
 * @docid _ui_drop_down_box_InputEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type InputEvent = NativeEventInfo<dxDropDownBox, UIEvent & { target: HTMLInputElement }>;

/**
 * @docid _ui_drop_down_box_KeyDownEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyDownEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent>;

/**
 * @docid _ui_drop_down_box_KeyUpEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyUpEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent>;

/**
 * @docid _ui_drop_down_box_OpenedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type OpenedEvent = EventInfo<dxDropDownBox>;

/**
 * @docid _ui_drop_down_box_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxDropDownBox> & ChangedOptionInfo;

/**
 * @docid _ui_drop_down_box_PasteEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type PasteEvent = NativeEventInfo<dxDropDownBox, ClipboardEvent>;

/**
 * @docid _ui_drop_down_box_ValueChangedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ValueChangedInfo
 */
export type ValueChangedEvent = NativeEventInfo<dxDropDownBox, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

/** @public */
export type ContentTemplateData = {
    component: dxDropDownBox;
    readonly value?: any;
};

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxDropDownBoxOptions extends DataExpressionMixinOptions<dxDropDownBox>, dxDropDownEditorOptions<dxDropDownBox> {
    /**
     * @docid
     * @default false
     * @public
     */
    acceptCustomValue?: boolean;
    /**
     * @docid
     * @default 'content'
     * @type_function_param1 templateData:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    contentTemplate?: template | ((templateData: ContentTemplateData, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default null
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
     */
    dataSource?: DataSourceLike<any> | null;
    /**
     * @docid
     * @public
     */
    displayValueFormatter?: ((value: string | Array<any>) => string);
    /**
     * @docid
     * @default null
     * @type_function_param1 value:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    fieldTemplate?: template | ((value: any, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    items?: Array<any>;
    /**
     * @docid
     * @default true
     * @public
     */
    openOnFieldClick?: boolean;
    /**
     * @docid
     * @default "change"
     * @public
     */
    valueChangeEvent?: string;

    /**
     * @docid
     * @type dxPopupOptions
     */
    dropDownOptions?: PopupProperties;
}
/**
 * @docid
 * @isEditor
 * @inherits DataExpressionMixin, dxDropDownEditor
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDropDownBox extends dxDropDownEditor<dxDropDownBoxOptions> {
    getDataSource(): DataSource;
}

/** @public */
export type Properties = dxDropDownBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxDropDownBoxOptions;


