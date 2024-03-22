"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _guid = _interopRequireDefault(require("../../core/guid"));
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _extend = require("../../core/utils/extend");
var _ui = _interopRequireDefault(require("../popover/ui.popover"));
var _type = require("../../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TOOLTIP_CLASS = 'dx-tooltip';
const TOOLTIP_WRAPPER_CLASS = 'dx-tooltip-wrapper';
// STYLE tooltip

const Tooltip = _ui.default.inherit({
  _getDefaultOptions: function () {
    return (0, _extend.extend)(this.callBase(), {
      /**
      * @name dxTooltipOptions.toolbarItems
      * @hidden
      */
      toolbarItems: [],
      /**
      * @name dxTooltipOptions.showCloseButton
      * @hidden
      */
      showCloseButton: false,
      /**
      * @name dxTooltipOptions.enableBodyScroll
      * @hidden
      */
      enableBodyScroll: true,
      /**
      * @name dxTooltipOptions.showTitle
      * @hidden
      */
      showTitle: false,
      /**
      * @name dxTooltipOptions.title
      * @hidden
      */
      title: null,
      /**
      * @name dxTooltipOptions.titleTemplate
      * @type template
      * @hidden
      */
      titleTemplate: null,
      /**
      * @name dxTooltipOptions.onTitleRendered
      * @hidden
      * @action
      */
      onTitleRendered: null,
      bottomTemplate: null,
      preventScrollEvents: false,
      propagateOutsideClick: true
    });
  },
  _render: function () {
    this.$element().addClass(TOOLTIP_CLASS);
    this.$wrapper().addClass(TOOLTIP_WRAPPER_CLASS);
    this.callBase();
  },
  _renderContent: function () {
    this.callBase();
    this._toggleAriaAttributes();
  },
  _toggleAriaDescription: function (showing) {
    const $target = (0, _renderer.default)(this.option('target'));
    const label = showing ? this._contentId : undefined;
    if (!(0, _type.isWindow)($target.get(0))) {
      this.setAria('describedby', label, $target);
    }
  },
  _toggleAriaAttributes: function () {
    this._contentId = "dx-".concat(new _guid.default());
    this.$overlayContent().attr({
      'id': this._contentId
    });
    this._toggleAriaDescription(true);
  }
});
(0, _component_registrator.default)('dxTooltip', Tooltip);
var _default = exports.default = Tooltip;
module.exports = exports.default;
module.exports.default = exports.default;