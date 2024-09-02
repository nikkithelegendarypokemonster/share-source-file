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