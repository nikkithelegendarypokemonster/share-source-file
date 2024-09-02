/**
* DevExtreme (ui/popover.d.ts)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    AnimationConfig,
} from '../animation/fx';

import {
    PositionConfig,
} from '../animation/position';

import {
    UserDefinedElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import dxPopup, {
    dxPopupAnimation,
    dxPopupOptions,
    TitleRenderedInfo,
} from './popup';

import {
    Position,
} from '../common';

/**
 * @docid _ui_popover_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxPopover>;

/**
 * @docid _ui_popover_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxPopover>;

/**
 * @docid _ui_popover_HidingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type HidingEvent = Cancelable & EventInfo<dxPopover>;

/**
 * @docid _ui_popover_HiddenEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type HiddenEvent = EventInfo<dxPopover>;

/**
 * @docid _ui_popover_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxPopover>;

/**
 * @docid _ui_popover_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxPopover> & ChangedOptionInfo;

/**
 * @docid _ui_popover_ShowingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type ShowingEvent = Cancelable & EventInfo<dxPopover>;

/**
 * @docid _ui_popover_ShownEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ShownEvent = EventInfo<dxPopover>;

/**
 * @docid _ui_popover_TitleRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo,TitleRenderedInfo
 */
export type TitleRenderedEvent = EventInfo<dxPopover> & TitleRenderedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxPopoverOptions<TComponent> extends dxPopupOptions<TComponent> {
    /**
     * @docid
     * @public
     * @type object
     */
    animation?: dxPopoverAnimation;
    /**
     * @docid
     * @deprecated dxPopoverOptions.hideOnOutsideClick
     * @type_function_param1 event:event
     * @default true
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * @docid
     * @default "auto"
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default undefined
     * @public
     */
    hideEvent?: {
      /**
       * @docid
       * @default undefined
       */
      delay?: number;
      /**
       * @docid
       * @default undefined
       */
      name?: string;
    } | string;
    /**
     * @docid
     * @type boolean | function
     * @type_function_param1 event:event
     * @default true
     * @public
     */
    hideOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * @docid
     * @default true
     * @public
     */
    hideOnParentScroll?: boolean;
    /**
     * @docid
     * @default { my: 'top center', at: 'bottom center', collision: 'fit flip' }
     * @public
     */
    position?: Position | PositionConfig;
    /**
     * @docid
     * @default false
     * @public
     */
    shading?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    showEvent?: {
      /**
       * @docid
       * @default undefined
       */
      delay?: number;
      /**
       * @docid
       * @default undefined
       */
      name?: string;
    } | string;
    /**
     * @docid
     * @default false
     * @public
     */
    showTitle?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    target?: string | UserDefinedElement;
    /**
     * @docid
     * @default "auto"
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxPopoverAnimation extends dxPopupAnimation {
    /**
     * @docid dxPopoverOptions.animation.hide
     * @default { type: "fade", to: 0 }
     * @public
     */
    hide?: AnimationConfig;
    /**
     * @docid dxPopoverOptions.animation.show
     * @default { type: "fade", from: 0, to: 1 }
     * @public
     */
    show?: AnimationConfig;
}
/**
 * @docid
 * @inherits dxPopup
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxPopover<TProperties = Properties> extends dxPopup<TProperties> {
    show(): DxPromise<boolean>;
    /**
     * @docid
     * @publicName show(target)
     * @param1 target:string|Element|jQuery
     * @return Promise<boolean>
     * @public
     */
    show(target: string | UserDefinedElement): DxPromise<boolean>;
}

interface PopoverInstance extends dxPopover<Properties> { }

/** @public */
export type Properties = dxPopoverOptions<PopoverInstance>;

/** @deprecated use Properties instead */
export type Options = Properties;


