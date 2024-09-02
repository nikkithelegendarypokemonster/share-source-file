/**
* DevExtreme (esm/__internal/ui/tab_panel/m_item.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { noop } from '../../../core/utils/common';
import CollectionWidgetItem from '../../ui/collection/m_item';
export default class TabPanelItem extends CollectionWidgetItem {
  _renderWatchers() {
    // @ts-expect-error
    this._startWatcher('badge', noop);
    // @ts-expect-error
    return super._renderWatchers();
  }
}
