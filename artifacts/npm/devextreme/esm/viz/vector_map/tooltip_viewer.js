/**
* DevExtreme (esm/viz/vector_map/tooltip_viewer.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
const TOOLTIP_OFFSET = 12;

// TODO: Somehow it should be merged with the core.Tooltip
export function TooltipViewer(params) {
  this._subscribeToTracker(params.tracker, params.tooltip, params.layerCollection);
}
TooltipViewer.prototype = {
  constructor: TooltipViewer,
  dispose: function () {
    this._offTracker();
    this._offTracker = null;
  },
  _subscribeToTracker: function (tracker, tooltip, layerCollection) {
    this._offTracker = tracker.on({
      'focus-on': function (arg) {
        let layer;
        let proxy;
        if (tooltip.isEnabled()) {
          layer = layerCollection.byName(arg.data.name);
          proxy = layer && layer.getProxy(arg.data.index);
          const callback = result => {
            result && arg.done(result);
          };
          proxy && callback(tooltip.show(proxy, {
            x: arg.x,
            y: arg.y,
            offset: TOOLTIP_OFFSET
          }, {
            target: proxy
          }, undefined, callback));
        }
      },
      // There are no checks for `tooltip.isEnabled()` in the following two handlers because they are called only if the previous one has finished with `true`
      'focus-move': function (arg) {
        tooltip.move(arg.x, arg.y, TOOLTIP_OFFSET);
      },
      'focus-off': function () {
        tooltip.hide();
      }
    });
  }
};
