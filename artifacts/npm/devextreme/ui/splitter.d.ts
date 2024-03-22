/**
* DevExtreme (ui/splitter.d.ts)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSourceLike } from '../data/data_source';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
} from './collection/ui.collection_widget.base';

import {
    DxElement,
} from '../core/element';

import {
    Mode,
    Orientation,
} from '../common';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ResizeInfo {
    /**
     * 
     */
    readonly handleElement?: DxElement;
}

type ItemLike<TKey> = string | Item<TKey> | any;

export {
    Mode,
};

/**
 * 
 */
export type ContentReadyEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxSplitter<TItem, TKey>>;

/**
 * 
 */
export type DisposingEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxSplitter<TItem, TKey>>;

/**
 * 
 */
export type InitializedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = InitializedEventInfo<dxSplitter<TItem, TKey>>;

/**
 * 
 */
export type ItemClickEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxSplitter<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * 
 */
export type ItemContextMenuEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxSplitter<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * 
 */
export type ItemRenderedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxSplitter<TItem, TKey>> & ItemInfo<TItem>;

/**
 * 
 */
export type OptionChangedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxSplitter<TItem, TKey>> & ChangedOptionInfo;

/**
 * 
 */
export type ResizeEvent<TItem extends ItemLike<TKey> = any, TKey = any> = Cancelable & NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ResizeInfo;

/**
 * 
 */
export type ResizeStartEvent<TItem extends ItemLike<TKey> = any, TKey = any> = Cancelable & NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ResizeInfo;

/**
 * 
 */
export type ResizeEndEvent<TItem extends ItemLike<TKey> = any, TKey = any> = Cancelable & NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ResizeInfo;

/**
 * 
 */
export type ItemCollapsedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ItemInfo<TKey>;

/**
 * 
 */
export type ItemExpandedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ItemInfo<TKey>;

/**
 * 
 * @deprecated 
 */
export interface dxSplitterOptions<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidgetOptions<dxSplitter<TItem, TKey>, TItem, TKey> {
    /**
     * 
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * 
     */
    orientation?: Orientation;
    /**
     * 
     */
    items?: Array<TItem>;
    /**
     * 
     */
    repaintChangesOnly?: boolean;
    /**
     * 
     */
    allowKeyboardNavigation?: boolean;
    /**
     * 
     */
    separatorSize?: number | string;
    /**
     * 
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * 
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * 
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
    /**
     * 
     */
    onItemExpanded?: ((e: ItemExpandedEvent) => void);
    /**
     * 
     */
    onItemCollapsed?: ((e: ItemCollapsedEvent) => void);
}
/**
 * 
 */
export default class dxSplitter<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidget<Properties<TItem, TKey>, TItem, TKey> { }

export type Item<TKey = any> = dxSplitterItem<TKey>;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxSplitterItem<TKey = any> extends CollectionWidgetItem {
    /**
     * 
     */
    splitter?: Properties<any, TKey>;
    /**
     * 
     */
    size?: number | string;
    /**
     * 
     */
    maxSize?: number | string;
    /**
     * 
     */
    minSize?: number | string;
    /**
     * 
     */
    collapsedSize?: number | string;
    /**
     * 
     */
    collapsed?: boolean;
    /**
     * 
     */
    collapsible?: boolean;
    /**
     * 
     */
    resizable?: boolean;
}

export type ExplicitTypes<
    TItem extends ItemLike<TKey>,
    TKey,
> = {
    Properties: Properties<TItem, TKey>;
    ContentReadyEvent: ContentReadyEvent<TItem, TKey>;
    DisposingEvent: DisposingEvent<TItem, TKey>;
    InitializedEvent: InitializedEvent<TItem, TKey>;
    ItemClickEvent: ItemClickEvent<TItem, TKey>;
    ItemContextMenuEvent: ItemContextMenuEvent<TItem, TKey>;
    ItemRenderedEvent: ItemRenderedEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
};

export type Properties<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> = dxSplitterOptions<TItem, TKey>;


