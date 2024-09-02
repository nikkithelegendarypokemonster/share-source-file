/**
* DevExtreme (esm/__internal/ui/tabs/m_item.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import $ from '../../../core/renderer';
import CollectionWidgetItem from '../../ui/collection/m_item';
const TABS_ITEM_BADGE_CLASS = 'dx-tabs-item-badge';
const BADGE_CLASS = 'dx-badge';
const TabsItem = CollectionWidgetItem.inherit({
  _renderWatchers() {
    this.callBase();
    this._startWatcher('badge', this._renderBadge.bind(this));
  },
  _renderBadge(badge) {
    this._$element.children(`.${BADGE_CLASS}`).remove();
    if (!badge) {
      return;
    }
    const $badge = $('<div>').addClass(TABS_ITEM_BADGE_CLASS).addClass(BADGE_CLASS).text(badge);
    this._$element.append($badge);
  }
});
export default TabsItem;
