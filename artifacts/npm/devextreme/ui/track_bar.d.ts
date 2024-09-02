/**
* DevExtreme (ui/track_bar.d.ts)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import Editor, {
    EditorOptions,
} from './editor/editor';

/**
 * @namespace DevExpress.ui
 * @docid
 * @hidden
 */
export interface dxTrackBarOptions<TComponent> extends EditorOptions<TComponent> {
    /**
     * @docid
     * @default 100
     * @public
     */
    max?: number;
    /**
     * @docid
     * @default 0
     * @public
     */
    min?: number;
}
/**
 * @docid
 * @inherits Editor
 * @hidden
 * @namespace DevExpress.ui
 * @options dxTrackBarOptions
 */
export default class dxTrackBar<TProperties> extends Editor<TProperties> { }
