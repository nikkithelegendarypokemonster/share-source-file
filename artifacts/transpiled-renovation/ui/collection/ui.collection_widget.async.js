"use strict";

exports.default = void 0;
var _uiCollection_widget = _interopRequireDefault(require("./ui.collection_widget.edit"));
var _deferred = require("../../core/utils/deferred");
var _common = require("../../core/utils/common");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const AsyncCollectionWidget = _uiCollection_widget.default.inherit({
  _initMarkup() {
    this._deferredItems = [];
    this.callBase();
  },
  _renderItemContent(args) {
    const renderContentDeferred = new _deferred.Deferred();
    const itemDeferred = new _deferred.Deferred();
    const that = this;
    this._deferredItems[args.index] = itemDeferred;
    const $itemContent = this.callBase.call(that, args);
    itemDeferred.done(() => {
      renderContentDeferred.resolve($itemContent);
    });
    return renderContentDeferred.promise();
  },
  _onItemTemplateRendered: function (itemTemplate, renderArgs) {
    return () => {
      this._deferredItems[renderArgs.index].resolve();
    };
  },
  _postProcessRenderItems: _common.noop,
  _renderItemsAsync() {
    const d = new _deferred.Deferred();
    _deferred.when.apply(this, this._deferredItems).done(() => {
      this._postProcessRenderItems();
      d.resolve();
    });
    return d.promise();
  },
  _clean() {
    this.callBase();
    this._deferredItems = [];
  }
});
var _default = exports.default = AsyncCollectionWidget;
module.exports = exports.default;
module.exports.default = exports.default;